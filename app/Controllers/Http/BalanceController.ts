import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BalanceController {
  public async retrieve({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      await user?.load('balance')

      if (!user?.balance) {
        throw new Error('Saldo não encontrado para o usuário')
      }

      return user.balance
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
