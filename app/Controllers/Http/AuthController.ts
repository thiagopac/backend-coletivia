import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserInfo from 'App/Models/UserInfo'
import Env from '@ioc:Adonis/Core/Env'
import UserBalance from 'App/Models/UserBalance'
import PasswordReset from 'App/Models/PasswordReset'
import MailController from 'App/Controllers/Http/MailController'
import { DateTime } from 'luxon'
import { AllyUserContract, Oauth1AccessToken, Oauth2AccessToken } from '@ioc:Adonis/Addons/Ally'

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const token = await auth.use('user').attempt(email, password, { expiresIn: '365days' })
      return token
    } catch (error) {
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
      console.log('error: ', error)
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
        phone: undefined,
        city_id: undefined, // forçando cidade ao cadastrar ser Belo Horizonte - MG request.input('city_id')
      }

      const info = await UserInfo.create(createInfo)
      await info.related('user').associate(user)

      await user.load('info')
      await user.info.load('city')

      const createBalance = {
        user_id: user.id,
        currentBalance: 0,
      }
      const balance = await UserBalance.create(createBalance)
      await balance.related('user').associate(user)

      await MailController.sendMailWelcome(user)

      response.json(user)
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: 'Erro inesperado ao criar o usuário',
      })
    }
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).send({
          error: 'Usuário não encontrado',
        })
      }

      const passwordReset = await PasswordReset.create({ email: user.email })
      await MailController.sendMailPasswordReset(user, passwordReset.token)

      return response.send({
        message: 'E-mail para redefinição de senha enviado.',
      })
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: error.message,
      })
    }
  }

  public async resetPasswordWithToken({ request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const token = request.input('token')
      const password = request.input('password')

      const passwordReset = await PasswordReset.query()
        .where('email', email)
        .where('token', token)
        .first()

      if (!passwordReset) {
        throw new Error('Token e/ou e-mail inválidos')
      }

      const currentTime = DateTime.now()

      const tokenExpirationMinutes = 30
      const tokenExpiration = passwordReset.createdAt.plus({ minutes: tokenExpirationMinutes })

      if (currentTime > tokenExpiration) {
        throw new Error(
          'O tempo limite para redefinição de senha expirou. Inicie o processo novamente.'
        )
      }

      const user = await User.findBy('email', email)
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      user.password = password
      user.save()

      await MailController.sendMailNewPassword(user)
      await passwordReset.delete()

      return response.send({
        message: 'Senha redefinida com sucesso.',
      })
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: error.message,
      })
    }
  }

  public async userExists({ request, response }: HttpContextContract) {
    const user = await User.findBy('email', request.input('email'))
    if (user) {
      return response.status(200).send({
        exists: true,
        social_login: user.socialLogin,
        social_service: user.socialService,
      })
    } else {
      return response.status(200).send({
        exists: false,
      })
    }
  }

  public async redirect({ auth, ally, response }: HttpContextContract) {
    if (await auth.check()) {
      return response.notAcceptable()
    }

    return response.send(await ally.use('google').stateless().redirectUrl())
  }

  public async callback({ ally, auth, response }: HttpContextContract) {
    if (await auth.check()) {
      return response.notAcceptable()
    }

    const google = ally.use('google').stateless()

    if (google.accessDenied()) {
      return 'Login social cancelado pelo usuário'
    }

    if (google.stateMisMatch()) {
      return 'A requisição expirou. Recarregue a página e tente novamente.'
    }

    if (google.hasError()) {
      return google.getError()
    }

    try {
      const { token } = await google.accessToken()
      const googleUser = await google.userFromToken(token)

      let user = await User.findBy('email', googleUser.email!)

      if (!user) {
        user = await this.registerWihSocialLogin(googleUser, 'Google')
      } else {
        await user.load('info')
        user.info.firstName = googleUser.original.given_name
        user.info.lastName = googleUser.original.family_name
        user.socialService = 'Google'
        user.socialLogin = true
        await user.save()
      }

      const oat = await auth.use('user').login(user, {
        expiresIn: '365days',
      })

      response.cookie(String(Env.get('API_TOKEN_COOKIE_NAME')), oat.token, {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      })

      await auth.use('user').login(user)
      return response.ok(oat)
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: 'Erro inesperado durante o processo de login',
      })
    }
  }

  public async registerWihSocialLogin(
    socialUser: AllyUserContract<Oauth2AccessToken | Oauth1AccessToken>,
    service: string
  ): Promise<User> {
    try {
      const user = await User.create({
        email: socialUser.email!,
        socialService: service,
        socialLogin: true,
      })

      const createInfo = {
        firstName: socialUser.original.given_name,
        lastName: socialUser.original.family_name,
        userId: user.id,
        phone: undefined,
        cityId: undefined,
      }

      const info = await UserInfo.create(createInfo)
      await info.related('user').associate(user)

      const createBalance = {
        user_id: user.id,
        currentBalance: 0,
      }

      const balance = await UserBalance.create(createBalance)
      await balance.related('user').associate(user)

      await MailController.sendMailWelcome(user)

      return user
    } catch (error) {
      console.error(error)
      throw new Error(error.message)
    }
  }
}
