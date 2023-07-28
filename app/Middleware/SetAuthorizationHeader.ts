import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class SetAuthorizationHeader {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const token = request.cookie(String(Env.get('API_TOKEN_COOKIE_NAME')))

    if (token) {
      request.headers().authorization = `Bearer ${token}`
    }

    await next()
  }
}
