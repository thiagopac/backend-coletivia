import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AiDocument from 'App/Models/AiDocument'
import Feature from 'App/Models/Feature'

export default class FeatureController {
  public async list({ response }: HttpContextContract) {
    try {
      return await Feature.query().where('suitness', 'summarization')
    } catch (error) {
      return response.notFound(error.message)
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
        return response.status(404).send({
          error: 'Documento não encontrado',
        })
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
        return response.status(404).send({
          error: 'Funcionalidade não encontrada',
        })
      }

      return features
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }
}
