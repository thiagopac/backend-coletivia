import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recharge from 'App/Models/Recharge'
import UserOperation from 'App/Models/UserOperation'

export default class OperationController {
  public async list({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { page, perPage } = request.qs()

      const query = UserOperation.query().where('user_id', user!.id).orderBy('id', 'desc')
      const operations = await query.paginate(page, perPage)

      return operations
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createRechargeOperation({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const value = request.input('value')
      const recharge = await Recharge.getRechargeWith('uuid', request.input('uuid'))
      const operation = UserOperation.createOperationRecharge(
        user!,
        value,
        request.raw()!,
        recharge.id
      )

      if (!operation) {
        throw new Error('Ocorreu um erro ao criar a operação de recarga')
      }

      return operation
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
