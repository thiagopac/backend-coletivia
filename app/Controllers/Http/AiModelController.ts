import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AiModel from 'App/Models/AiModel'

export default class AiModelController {
  public async list({ response }: HttpContextContract) {
    try {
      return AiModel.query().where('is_available', true)
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async listForType({ params, response }: HttpContextContract) {
    try {
      return AiModel.query().where('is_available', true).andWhere('type', params.type)
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
