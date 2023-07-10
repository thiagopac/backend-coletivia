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
        .firstOrFail()
      const features = await Feature.query()
        .preload('analyses', (analysis) => {
          analysis
            .select(['uuid', 'ai_document_id', 'created_at'])
            .where('user_id', user!.id)
            .andWhere('ai_document_id', aiDocument.id)
        })
        .where('suitness', 'summarization')

      return features
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
