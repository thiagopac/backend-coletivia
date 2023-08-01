import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

const MAIL_FROM = Env.get('MAIL_FROM')
const MAIL_RECEIVER = Env.get('MAIL_RECEIVER')
const FRONTEND_BASE_URL = Env.get('FRONTEND_BASE_URL')

export default class SocketIOController {
  public static async sendMailWelcome(user: User) {
    try {
      await user.load('info')
      await Mail.send((message) => {
        message
          .from(MAIL_FROM)
          .to(user?.email as string)
          .subject('Sua conta no Coletivia foi criada!')
          .htmlView('emails/welcome', {
            user: { firstName: user?.info.firstName },
          })
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async sendMailPasswordReset(user: User, token: string) {
    try {
      await user.load('info')
      await Mail.send((message) => {
        message
          .from(MAIL_FROM)
          .to(user?.email as string)
          .subject('Redefinição de senha')
          .htmlView('emails/reset-password', {
            user: { firstName: user?.info.firstName },
            url: `${FRONTEND_BASE_URL}/auth/reset-password?email=${user.email}&token=${token}`,
          })
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async sendMailNewPassword(user: User) {
    try {
      await user.load('info')
      await Mail.send((message) => {
        message
          .from(MAIL_FROM)
          .to(user?.email as string)
          .subject('Sua senha foi alterada')
          .htmlView('emails/simple-mail', {
            user: { firstName: user?.info.firstName },
            message: `Este é apenas um aviso de que sua senha acaba de ser alterada. Caso você não tenha alterado sua senha, entre em contato conosco pelo email <a href="mailto:${MAIL_RECEIVER}">${MAIL_RECEIVER}</a>`,
          })
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}
