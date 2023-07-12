import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Policy from 'App/Models/Policy'

export default class PolicyController {
  public async retrieve({ params, response }: HttpContextContract) {
    try {
      const policy = await Policy.query()
        .where('type', params.type)
        .orderBy('id', 'desc')
        .firstOrFail()
      return policy
    } catch (error) {
      return response.status(404).json({ error: 'Política não encontrada' })
    }
  }
}
