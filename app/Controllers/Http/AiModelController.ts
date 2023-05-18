import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiModel from 'App/Models/OpenAiModel'

export default class AiModelController {
  public async list({ response }: HttpContextContract) {
    try {
      return OpenAiModel.query().where('is_available', true)
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async listForType({ params, response }: HttpContextContract) {
    try {
      return OpenAiModel.query().where('is_available', true).andWhere('type', params.type)
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
