import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import AdminInfo from 'App/Models/AdminInfo'

export default class AdminsController {
  public async changePassword({ auth, request, response }: HttpContextContract) {
    try {
      await auth.attempt(auth.use('admin').user!.email, request.input('current_password'))
      const admin = await Admin.find(auth.use('admin').user!.id)

      admin!.password = request.input('new_password')
      await admin!.save()

      response.json(admin)
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }

  public async updateInfo({ auth, request, response }: HttpContextContract) {
    try {
      const info = await AdminInfo.findBy('admin_id', auth.use('admin').user?.id)
      const allowedFields = ['first_name', 'last_name', 'phone', 'city_id']

      const data = request.only(allowedFields) as Partial<AdminInfo>

      if (!info) {
        return response.status(404).send({
          error: 'Informaçoes do administrador nao encontradas',
        })
      }

      info.merge(data)
      await info.save()

      response.json(info)
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }

  public async list({ response }: HttpContextContract) {
    try {
      const admins = await Admin.query()
        .preload('info', (info) => {
          info.preload('city')
        })
        .orderBy('id', 'desc')

      if (!admins || admins.length === 0) {
        return response.status(404).send({
          error: 'Nenhum administrador encontrado',
        })
      }

      return admins
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }
}
