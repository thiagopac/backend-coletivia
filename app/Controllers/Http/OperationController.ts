import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RechargeType from 'App/Models/RechargeType'
import UserOperation from 'App/Models/UserOperation'

export default class OperationController {
  public async list({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      await user?.load('operations')
      return user?.operations
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async rechargePix({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const value = request.input('value')
      const rechargeType = await RechargeType.query().where('name', 'PIX').firstOrFail()
      const operation = UserOperation.createOperationRecharge(
        user!,
        value,
        request.raw()!,
        rechargeType.id
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
