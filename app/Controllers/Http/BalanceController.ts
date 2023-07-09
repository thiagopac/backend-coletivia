import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BalanceController {
  public async retrieve({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      await user?.load('balance')

      return user?.balance
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
