import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AiDocument from 'App/Models/AiDocument'
import Feature from 'App/Models/Feature'

export default class FeatureController {
  public async list({ response }: HttpContextContract) {
    try {
      return await Feature.query().where('suitness', 'summarization')
    } catch (error) {
      response.status(500).send({
        error: error.message,
      })
    }
  }

  public async listFeaturesForDocumentWithAnalyses({
    auth,
    params,
    response,
  }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const aiDocument = await AiDocument.query()
        .select(['id'])
        .where('uuid', params.document)
        .first()

      if (!aiDocument) {
        throw new Error('Documento não encontrado')
      }

      const features = await Feature.query()
        .preload('analyses', (analysis) => {
          analysis
            .select(['uuid', 'ai_document_id', 'created_at'])
            .where('user_id', user!.id)
            .andWhere('ai_document_id', aiDocument.id)
        })
        .where('suitness', 'summarization')

      if (!features) {
        throw new Error('Funcionalidade não encontrada')
      }

      return features
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
