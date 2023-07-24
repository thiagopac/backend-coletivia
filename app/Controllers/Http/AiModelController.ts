import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AiModel from 'App/Models/AiModel'

export default class AiModelController {
  public async list({ response }: HttpContextContract) {
    try {
      const aiModels = await AiModel.query().where('is_available', true)

      if (!aiModels || aiModels.length === 0) {
        throw new Error('Nenhum modelo de IA encontrado')
      }

      return aiModels
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  public async listForType({ params, response }: HttpContextContract) {
    try {
      const aiModels = await AiModel.query()
        .where('is_available', true)
        .andWhere('type', params.type)

      if (!aiModels || aiModels.length === 0) {
        throw new Error('Nenhum modelo de IA encontrado para o tipo especificado')
      }

      return aiModels
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }
}
