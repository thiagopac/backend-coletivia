import AiDocument from 'App/Models/AiDocument'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import UserOperation from 'App/Models/UserOperation'
import User from 'App/Models/User'
import Feature from 'App/Models/Feature'
import DocumentAnalysis from 'App/Models/DocumentAnalysis'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
// const OPENAI_API_CHAT_COMPLETIONS_URL = `${Env.get('OPENAI_API_CHAT_COMPLETIONS_URL')}`

const TEST_MOCK_API_CHAT_COMPLETIONS_URL = `${Env.get('TEST_MOCK_API_CHAT_COMPLETIONS_URL')}`

export default class DocumentController {
  public async createDocumentAnalysis({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { document, feature } = request.body()

      const aiFeature = await Feature.getFeatureWith('uuid', feature)
      if (!feature) throw new Error('Funcionalidade não encontrada')

      const aiDocument = await AiDocument.getAiDocumentWith('uuid', document)
      if (!aiDocument) throw new Error('Documento não encontrado')

      const documentAnalysis = await DocumentAnalysis.createDocumentAnalysis(
        user,
        aiFeature,
        aiDocument
      )

      const analysis = await DocumentAnalysis.getDocumentAnalysisWith('id', documentAnalysis.id)
      const behavior: any = analysis.behavior
      const contextLengthInChars = aiFeature.model.contextLength * 4 - 2000

      const content = aiDocument.content
      const parts = this.splitTextIntoParts(content['raw'], contextLengthInChars)

      let contentArr: any[] = []
      let fragmentCount: number = 1

      for (const part of parts) {
        const contentItem: any = {
          stamp: `FRAGMENTO_${fragmentCount}`,
          raw: part.raw,
          analysis: await this.analyzeContent(behavior.prompt_context, part.raw, analysis, user),
        }

        contentArr.push(contentItem)
        fragmentCount++
      }

      const synthesis = await this.synthesizeAnalysis(contentArr, analysis, user)
      contentArr.push({
        stamp: 'SINTESE',
        analysis: synthesis.analyzed,
      })

      analysis.content = JSON.stringify(contentArr) as any
      await analysis.save()

      return analysis
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**x
   * @description Divide o texto em partes menores para processamento
   * @param text - O texto a ser dividido
   * @param maxCharacters - O número máximo de caracteres por parte
   * @param behavior - O comportamento de análise
   * @returns As partes divididas do texto
   */
  private splitTextIntoParts(text: string, maxCharacters: number) {
    let remainingText = text
    let parts: any[] = []
    let partIndex = 1

    while (remainingText.length > 0) {
      let textPart = remainingText.slice(0, maxCharacters)

      if (remainingText.length > maxCharacters) {
        const lastPeriodIndex = textPart.lastIndexOf('.')
        if (lastPeriodIndex !== -1) {
          textPart = textPart.slice(0, lastPeriodIndex + 1)
        }
      }

      const sanitizedTextPart = this.sanitizeText(textPart)

      parts.push({
        stamp: `FRAGMENTO_${partIndex}`,
        raw: sanitizedTextPart,
      })

      remainingText = remainingText.slice(textPart.length)
      partIndex++
    }

    return parts
  }

  /**
   * @description Remove caracteres indesejados do texto
   * @param text - O texto a ser sanitizado
   * @returns O texto sanitizado
   */
  private sanitizeText(text: string) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/_+/g, ' ')
      .replace(/\.{2,}/g, '')
      .replace(/-+/g, '')
      .replace(/([^\w\s.,?!])\1+/g, '')
      .trim()
  }

  /**
   * @description Lista análises de documentos para um usuário
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns Os documentos listados
   */
  public async list({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const documents = await DocumentAnalysis.query()
        .select(['uuid', 'feature_id', 'created_at', 'updated_at'])
        .preload('feature')
        .where('user_id', user!.id)
        .orderBy('id', 'desc')

      if (!documents) throw new Error('Nenhuma análise de documento encontrada')

      return documents
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**
   * @description Cria uma nova mensagem em uma conversa sobre documento existente, recebendo através de single response (ignora o stream do behavior)
   * @param auth - O contrato de contexto HTTP
   * @param request - A requisição HTTP
   * @param response - A resposta HTTP
   * @returns O resultado da mensagem criada
   */
  public async createMessageSingle({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { document, prompt } = request.body()
      let messages: any[] = []

      const documentAnalysis = await DocumentAnalysis.getDocumentAnalysisWith('uuid', document)
      const behavior: any = documentAnalysis.behavior

      messages = documentAnalysis.messages['messages']

      const data = {
        messages:
          messages.length === 1 && behavior['messages'].length > 0
            ? [...behavior['messages'], ...messages]
            : messages,
        stream: false, //ignora o valor stream do behavior
        model: documentAnalysis.feature.model.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      // console.log('prompt body: ', data.messages)
      // console.log('prompt tokens: ', OpenAiUtils.countTokens(JSON.stringify(data.messages).trim()))

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }

      // const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
      const openaiResponse = await axios.post(TEST_MOCK_API_CHAT_COMPLETIONS_URL, data, config)
      const openaiResponseMessage = openaiResponse?.data?.choices?.[0]?.message ?? ''

      //trocar o objeto contextualizado pelo prompt real para guardar no histórico
      messages[messages.length - 1] = { role: 'user', content: prompt }

      // console.log('openaiResponse?.data: ', openaiResponse?.data)

      const promptTokensCount = openaiResponse?.data?.usage?.prompt_tokens
      const completionTokensCount = openaiResponse?.data?.usage?.completion_tokens
      const modelPricingInputValuePer1k = documentAnalysis.feature.model.pricing.inputValue / 1000
      const modelPricingOutputValuePer1k = documentAnalysis.feature.model.pricing.outputValue / 1000
      const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
      const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
      const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

      // console.log('totalTokensCost: ', totalTokensCost)
      // console.log('modelPricingValuePer1k: ', modelPricingValuePer1k)
      // console.log('totalTokenCurrencyCost: ', totalTokenCurrencyCost)

      UserOperation.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        documentAnalysis.feature.model.pricing.id,
        'document_analysis',
        documentAnalysis.id
      )

      messages.push(openaiResponseMessage)

      // console.log('completion body: ', openaiResponseMessage.content)
      // console.log('completion tokens: ', openaiResponse?.data?.usage?.completion_tokens)

      documentAnalysis.messages = JSON.stringify({ messages: messages }) as any
      documentAnalysis.save()
      return { result: openaiResponseMessage }
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  }

  /**
   * @description Realiza a análise de um conteúdo
   * @param prompt - O prompt de análise
   * @param raw - O conteúdo a ser analisado
   * @param aiDocument - O documento OpenAI
   * @param user - O usuário
   * @returns O resultado da análise
   */
  public async analyzeContent(
    prompt: string,
    raw: string,
    documentAnalysis: DocumentAnalysis,
    user: User
  ) {
    try {
      const message = { role: 'user', content: `${prompt}${raw}` }
      const behavior: any = documentAnalysis.behavior

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }

      const data = {
        messages: [message],
        stream: false,
        model: documentAnalysis.feature.model.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      // const response = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
      const response = await axios.post(TEST_MOCK_API_CHAT_COMPLETIONS_URL, data, config)

      const promptTokensCount = response?.data?.usage?.prompt_tokens
      const completionTokensCount = response?.data?.usage?.completion_tokens
      const modelPricingInputValuePer1k = documentAnalysis.feature.model.pricing.inputValue / 1000
      const modelPricingOutputValuePer1k = documentAnalysis.feature.model.pricing.outputValue / 1000
      const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
      const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
      const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

      UserOperation.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        documentAnalysis.feature.model.pricing.id,
        'document_analysis',
        documentAnalysis.id
      )

      return response?.data?.choices?.[0]?.message.content ?? ''
    } catch (error) {
      throw new Error('Erro ao chamar a API de completions')
    }
  }

  /**
   * @description Realiza a síntese das análises
   * @param contentItems - Os itens de conteúdo
   * @param aiDocument - O documento OpenAI
   * @param user - O usuário
   * @returns A síntese das análises
   */
  public async synthesizeAnalysis(
    contentItems: any[],
    documentAnalysis: DocumentAnalysis,
    user: User
  ) {
    try {
      // Concatena todas as análises em uma única string
      const raw = contentItems.map((item) => item.analysis).join('\n\n')
      const behavior: any = documentAnalysis.behavior

      // Utiliza a função de análise para criar a síntese
      const analyzed = await this.analyzeContent(
        behavior.prompt_synthesis,
        raw,
        documentAnalysis,
        user
      )

      return { raw, analyzed }
    } catch (error) {
      throw new Error('Erro ao sintetizar as análises')
    }
  }

  /**
   * @description Recupera um documento pelo UUID
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns O documento recuperado
   */
  public async retrieveDocumentAnalysis({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const analysis = await DocumentAnalysis.query()
        .select(['uuid', 'feature_id', 'ai_document_id', 'content', 'created_at', 'updated_at'])
        .preload('document', (document) => {
          document.select(['uuid', 'title', 'extension', 'created_at', 'updated_at'])
        })
        .preload('feature')
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!analysis) throw new Error('Análise de documento não encontrada')

      return analysis
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**
   * @description Exclui um documento pelo UUID
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns A resposta de exclusão bem-sucedida
   */
  public async deleteDocumentAnalysis({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const analysis = await DocumentAnalysis.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!analysis) throw new Error('Análise de documento não encontrada')

      await analysis.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
