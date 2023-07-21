import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserInfo from 'App/Models/UserInfo'

export default class UsersController {
  public async changePassword({ auth, request, response }: HttpContextContract) {
    try {
      await auth.attempt(auth.use('user').user!.email, request.input('current_password'))
      const user = await User.find(auth.use('user').user!.id)

      user!.password = request.input('new_password')
      await user!.save()

      response.json(user)
    } catch (error) {
      response.status(500).send({
        error: error.message,
      })
    }
  }

  public async updateInfo({ auth, request, response }: HttpContextContract) {
    try {
      const info = await UserInfo.findBy('user_id', auth.use('user').user?.id)
      const allowedFields = [
        'first_name',
        'last_name',
        'phone',
        'city_id',
        'cpf_cnpj',
        'registration_type',
      ]

      const data = request.only(allowedFields) as Partial<UserInfo>

      if (!info) {
        return response.status(404).send({
          error: 'Informações não encontradas',
        })
      }

      info.merge(data)
      await info.save()

      response.json(info)
    } catch (error) {
      response.status(500).send({
        error: error.message,
      })
    }
  }

  public async list({ response }: HttpContextContract) {
    try {
      const users = await User.query()
        .preload('info', (info) => {
          info.preload('city')
        })
        .orderBy('id', 'desc')

      return users
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
