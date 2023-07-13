import RechargeOption from 'App/Models/RechargeOption'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recharge from 'App/Models/Recharge'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
const PIX_URL = Env.get('PIX_URL')
// const TEST_MOCK_PIX_URL = Env.get('TEST_MOCK_PIX_URL')

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
      chave: '17751370000163',
      devedor: devedor,
      valor: {
        original: valorPix,
      },
    }

    const cobImediata = await axios.post(`${PIX_URL}/pix`, payload)
    // const cobImediata = await axios.post(`${TEST_MOCK_PIX_URL}/pix`, payload)
    return cobImediata.data
  }

  public async updateRecharge({ request, response }: HttpContextContract) {
    try {
      const { txid } = request.body().pix[0]
      console.log('request.raw()!: ', request.raw()!)
      const recharge = await Recharge.query().where('transaction_code', txid).firstOrFail()
      recharge.status = 'paid'
      recharge.paymentData = JSON.parse(request.raw()!)
      await recharge.save()
      return response.ok({ message: 'Recharge updated successfully' })
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
