import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserInfo from 'App/Models/UserInfo'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const token = await auth.use('user').attempt(email, password, { expiresIn: '365days' })
      return token
    } catch (error) {
      console.error('error: ', error)
      return response.status(401).send({
        error: 'Credenciais inválidas',
      })
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('user').logout()
    return {
      revoked: true,
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      await user?.load('info')
      await user?.info.load('city')
      await user?.load('balance')

      return user
    } catch (error) {
      return response.status(401).send({
        error: 'Credenciais inválidas',
      })
    }
  }

  public async register({ request, response }: HttpContextContract) {
    try {
      const user = await User.create(request.only(['email', 'password']))

      const createInfo = {
        first_name: request.input('first_name'),
        last_name: request.input('last_name'),
        user_id: user.id,
        phone: request.input('phone'),
        registration_type: request.input('registration_type'),
        cpf_cnpj: request.input('cpf_cnpj'),
        city_id: 1991, // forçando cidade ao cadastrar ser Belo Horizonte - MG request.input('city_id')
      }

      const info = await UserInfo.create(createInfo)
      await info.related('user').associate(user)

      await user.load('info')
      await user.info.load('city')

      response.json(user)
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: 'Erro inesperado ao criar o usuário',
      })
    }
  }
}
