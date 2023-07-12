import RechargeOption from 'App/Models/RechargeOption'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recharge from 'App/Models/Recharge'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
const PIX_URL = Env.get('PIX_URL')

export default class RechargeController {
  public async listOptions({ response }: HttpContextContract) {
    try {
      const options = RechargeOption.query().where('is_available', true)
      if (!options) {
        throw new Error('Nenhuma opção de recarga encontrada')
      }

      return options
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async retrieve({ params, response }: HttpContextContract) {
    try {
      const recharge = await Recharge.getRechargeWith('uuid', params.uuid)
      if (!recharge) {
        throw new Error('Recarga não encontrada')
      }
      const result = {
        uuid: recharge.uuid,
        status: recharge.status,
        qr_code: (recharge.chargeData as any).pixCopiaECola,
        label: recharge.rechargeOption.label,
        description: recharge.rechargeOption.description,
        observations: recharge.rechargeOption.observations,
        value: recharge.rechargeOption.debitedValue,
        created_at: recharge.createdAt,
        updated_at: recharge.updatedAt,
      }
      return result
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createRecharge({ auth, request }: HttpContextContract) {
    const { option } = request.body()

    const rechargeOption = await RechargeOption.getRechargeOptionWith('uuid', option)
    const user = await User.find(auth.use('user').user!.id)
    await user?.load('info')
    const cobImediata = await this.createPixCobImediata(user!, rechargeOption)
    const recharge = await Recharge.createRecharge(user!, rechargeOption, cobImediata)

    return recharge
  }

  public async createPixCobImediata(user: User, rechargeOption: RechargeOption): Promise<object> {
    const expirationMinutes = 30
    const registrationType = user?.info?.registrationType
    const documento = user?.info?.cpfCnpj
    const valorPix = rechargeOption?.debitedValue
    const devedor: any =
      registrationType === 'PF'
        ? {
            cpf: documento,
            nome: user?.info?.firstName + ' ' + user?.info?.lastName,
          }
        : {
            cnpj: documento,
            nome: user?.info?.firstName + ' ' + user?.info?.lastName,
          }

    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    let payload: any = {
      calendario: {
        criacao: today.toISOString(),
        dataDeVencimento: tomorrow.toISOString(),
        expiracao: expirationMinutes * 60 * 1000,
      },
      chave: 'b33a1e83-2703-4d45-9e14-500a2d4aabbd',
      devedor: devedor,
      valor: {
        original: valorPix,
      },
    }

    console.log(payload)

    const response = await axios.post(`${PIX_URL}/pix`, payload)
    return response
  }

  public async updateRecharge({ request, response }: HttpContextContract) {
    try {
      const { txid } = request.body()
      const recharge = await Recharge.query().where('transaction_code', txid).firstOrFail()
      recharge.status = 'paid'
      recharge.paymentData = JSON.parse(request.raw()!)
      recharge.save()
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}

/*

"calendario": {
    "criacao": "string", <- é a data de criação do pagamento
    "dataDeVencimento": "string", <- é a data de vencimento
    "expiracao": 0 <- é o tempo em milisegundos em que o qrcode vai expirar
  }

  "chave": "string", <- é a chave pix do recebedor
  "devedor": {
    "cnpj": "string", <- cnpj do devedor se houver
    "cpf": "string", <- cpf do devedor se houver
    "nome": "string" <- nome ou razao social do devedor
  }

  "valor": {
    "original": 0 <- valor da cobrança
  }
 */
