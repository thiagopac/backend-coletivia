import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AiModel from 'App/Models/AiModel'

export default class AiModelController {
  public async list({ response }: HttpContextContract) {
    try {
      const aiModels = await AiModel.query().where('is_available', true)

      if (!aiModels || aiModels.length === 0) {
        return response.status(404).send({
          error: 'Nenhum modelo de IA encontrado',
        })
      }

      return aiModels
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }

  public async listForType({ params, response }: HttpContextContract) {
    try {
      const aiModels = await AiModel.query()
        .where('is_available', true)
        .andWhere('type', params.type)

      if (!aiModels || aiModels.length === 0) {
        return response.status(404).send({
          error: 'Nenhum modelo de IA encontrado para o tipo especificado',
        })
      }

      return aiModels
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }
}
