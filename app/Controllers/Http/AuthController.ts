import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserInfo from 'App/Models/UserInfo'
import Env from '@ioc:Adonis/Core/Env'
import UserBalance from 'App/Models/UserBalance'

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

      response.json(user)
    } catch (error) {
      console.error(error)
      response.status(500).send({
        error: 'Erro inesperado ao criar o usuário',
      })
    }
  }

  public async registerWihSocialLogin({ request, response }: HttpContextContract) {
    try {
      const user = await User.create(request.only(['email', 'social_service']))
      user.socialLogin = true
      await user.save()

      const createInfo = {
        first_name: request.input('first_name'),
        last_name: request.input('last_name'),
        user_id: user.id,
        phone: undefined,
        city_id: undefined,
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

    const { token } = await google.accessToken()
    const googleUser = await google.userFromToken(token)

    const user = await User.firstOrCreate(
      {
        email: googleUser.email!,
      },
      {
        email: googleUser.email!,
        socialService: 'Google',
        socialLogin: true,
      }
    )

    user.socialService = 'Google'
    user.socialLogin = true
    await user.save()

    //create user info only if not exists
    if (!user.info) {
      const createInfo = {
        first_name: googleUser.original.given_name,
        last_name: googleUser.original.family_name,
        user_id: user.id,
        phone: undefined,
        city_id: undefined,
      }

      const info = await UserInfo.create(createInfo)
      await info.related('user').associate(user)
    }

    if (!user.balance) {
      const createBalance = {
        user_id: user.id,
        currentBalance: 0,
      }

      const balance = await UserBalance.create(createBalance)
      await balance.related('user').associate(user)
    }

    await user.load('info')

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
  }
}
