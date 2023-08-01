import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

const MAIL_FROM = Env.get('MAIL_FROM')
const MAIL_RECEIVER = Env.get('MAIL_RECEIVER')
const FRONTEND_BASE_URL = Env.get('FRONTEND_BASE_URL')

View.mount('emails', Application.resourcesPath('views/emails'))

export default class TestController {
  public async welcome({}: HttpContextContract) {
    const user = await User.findOrFail(1)
    await user.load('info')

    return View.render('emails::welcome', {
      user: { firstName: user?.info.firstName },
      url: `${FRONTEND_BASE_URL}/reset-password?email=${user.email}&token=${'123456'}`,
    })
  }

  public async resetPassword({}: HttpContextContract) {
    const user = await User.findOrFail(1)
    await user.load('info')

    return View.render('emails::reset-password', {
      user: { firstName: user?.info.firstName },
      url: `${FRONTEND_BASE_URL}/reset-password?email=${user.email}&token=${'123456'}`,
    })
  }

  public async simpleMail({}: HttpContextContract) {
    const user = await User.findOrFail(1)
    await user.load('info')

    return View.render('emails::simple-mail', {
      user: { firstName: user?.info.firstName },
      message: `Este é apenas um aviso de que sua senha acaba de ser alterada. Caso não tenha sido você, entre em contato conosco pelo email <a href="mailto:${MAIL_RECEIVER}">${MAIL_RECEIVER}</a>`,
    })
  }
}
