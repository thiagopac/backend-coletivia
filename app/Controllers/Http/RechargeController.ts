import RechargeOption from 'App/Models/RechargeOption'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recharge from 'App/Models/Recharge'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import UserOperation from 'App/Models/UserOperation'
import UserNotification from 'App/Notifications/UserNotification'
const CHAVE_PIX = Env.get('CHAVE_PIX')
const PIX_URL = Env.get('PIX_URL')
// const TEST_MOCK_PIX_URL = Env.get('TEST_MOCK_PIX_URL')

export default class RechargeController {
  public async list({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { page, perPage } = request.qs()

      const query = Recharge.query()
        .preload('rechargeOption')
        .where('user_id', user!.id)
        .orderBy('id', 'desc')
      const recharges = await query.paginate(page, perPage)

      return recharges
    } catch (error) {
      return response.notFound(error.message)
    }
  }

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
        paid_at: (recharge.paymentData as any)?.pix[0].horario,
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
      chave: CHAVE_PIX,
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
      const recharge = await Recharge.query().where('transaction_code', txid).firstOrFail()
      const user = await recharge.related('user').query().firstOrFail()

      recharge.status = 'paid'
      recharge.paymentData = request.raw()! as any
      await recharge.save()

      UserOperation.createOperationRecharge(user!, recharge.value, recharge.id)

      user!.notifyLater(
        new UserNotification(
          'Recarga efetuada com sucesso!',
          'Recebemos o seu pagamento. Seus créditos já podem ser utilizados!',
          'success',
          'success',
          '/recharge/list'
        )
      )

      user!.notificationRefresh()

      return response.ok({ message: 'Pedido de recarga atualizado' })
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
