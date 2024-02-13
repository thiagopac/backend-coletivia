import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
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
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }
}
