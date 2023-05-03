import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminAuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email')
      const password = request.input('password')
      const token = await auth.use('admin').attempt(email, password, { expiresIn: '365days' })
      return token
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('admin').logout()
    return {
      revoked: true,
    }
  }

  public async me({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('admin').user
      await user?.load('info')
      await user?.info.load('city')
      return user
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }
}
