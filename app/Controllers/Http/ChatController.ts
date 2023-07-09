import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiChat from 'App/Models/OpenAiChat'
import Pricing from 'App/Models/Pricing'
import OpenAiUtils from '../../../Utils/OpenAiUtils'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { Stream } from 'stream'
import UserOperation from 'App/Models/UserOperation'
import User from 'App/Models/User'
import Feature from 'App/Models/Feature'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
const OPENAI_API_CHAT_COMPLETIONS_URL = `${Env.get('OPENAI_API_CHAT_COMPLETIONS_URL')}`

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
}

export default class ChatController {
  public async createChatFree({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!

      const feature = await Feature.getFeatureWith('name', 'free-chat')
      if (!feature) throw new Error('Funcionalidade não encontrada')

      const chat = await OpenAiChat.createChat(user, feature)
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createChatLegalToInformal({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!

      const feature = await Feature.getFeatureWith('name', 'legal-to-informal')
      if (!feature) throw new Error('Funcionalidade não encontrada')

      const chat = await OpenAiChat.createChat(user, feature)
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createChatInformalToFormal({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!

      const feature = await Feature.getFeatureWith('name', 'informal-to-formal')
      if (!feature) throw new Error('Funcionalidade não encontrada')

      const chat = await OpenAiChat.createChat(user, feature)
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async list({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chats = await OpenAiChat.query()
        .select(['uuid', 'feature_id', 'title', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .whereHas('feature', (query) => {
          query.where('name', params.type)
        })
        .orderBy('id', 'desc')
        .preload('feature')

      return chats
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createMessageSingle({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { chat, prompt } = request.body()
      let messages: any[] = []

      const openAiChat = await OpenAiChat.getOpenAiChatWithUuid(chat)
      const behavior: any = openAiChat.behavior

      /**
       * -1 = Todas as mensagens
       * 0 = Nenhuma mensagem
       * N = N últimas mensagens
       */
      if (behavior['prompt_recent_memories'] === -1) {
        messages = openAiChat.messages['messages']
      } else if (behavior['prompt_recent_memories'] === 0) {
        messages.push({ role: 'user', content: prompt })
      } else if (behavior['prompt_recent_memories'] > 0) {
        const recentMessages = openAiChat.messages['messages']
        const start = Math.max(recentMessages.length - behavior['prompt_recent_memories'], 0)
        messages = recentMessages.slice(start)
        const promptContext = behavior['prompt_context']
        const promptFinal =
          promptContext && promptContext.trim() !== ''
            ? `${promptContext.trim()}: '${prompt}'`
            : prompt
        messages.push({ role: 'user', content: promptFinal })
      }

      const data = {
        messages:
          messages.length === 1 && behavior['messages'].length > 0
            ? [...behavior['messages'], ...messages]
            : messages,
        stream: false, //ignora o valor stream do behavior
        model: openAiChat.feature.model.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      console.log('prompt body: ', data.messages)
      console.log('prompt tokens: ', OpenAiUtils.countTokens(JSON.stringify(data.messages).trim()))

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }

      const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
      const openaiResponseMessage = openaiResponse?.data?.choices?.[0]?.message ?? ''

      //trocar o objeto contextualizado pelo prompt real para guardar no histórico
      messages[messages.length - 1] = { role: 'user', content: prompt }

      // console.log('openaiResponse?.data: ', openaiResponse?.data)

      const promptTokensCount = openaiResponse?.data?.usage?.prompt_tokens
      const completionTokensCount = openaiResponse?.data?.usage?.completion_tokens
      const modelPricingInputValuePer1k = openAiChat.feature.model.pricing.inputValue / 1000
      const modelPricingOutputValuePer1k = openAiChat.feature.model.pricing.outputValue / 1000
      const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
      const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
      const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

      // console.log('totalTokensCost: ', totalTokensCost)
      // console.log('modelPricingValuePer1k: ', modelPricingValuePer1k)
      // console.log('totalTokenCurrencyCost: ', totalTokenCurrencyCost)

      UserOperation.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        openAiChat.feature.model.pricing.id,
        'open_ai_chats',
        openAiChat.id
      )

      messages.push(openaiResponseMessage)

      if (messages.length === 2) {
        this.suggestChatTitle(
          openAiChat.id,
          openAiChat.feature.model.release,
          messages,
          openAiChat.feature.model.pricing,
          user
        )
      }

      // console.log('completion body: ', openaiResponseMessage.content)
      // console.log('completion tokens: ', openaiResponse?.data?.usage?.completion_tokens)

      openAiChat.messages = JSON.stringify({ messages: messages }) as any
      openAiChat.save()
      return { result: openaiResponseMessage }
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  }

  public async createMessage({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { chat, prompt } = request.body()
      let chunkCount: number = 0
      let messages: any[] = []

      const openAiChat = await OpenAiChat.getOpenAiChatWithUuid(chat)
      const behavior: any = openAiChat.behavior

      /**
       * -1 = Todas as mensagens
       * 0 = Nenhuma mensagem
       * N = N últimas mensagens
       */
      if (behavior['prompt_recent_memories'] === -1) {
        messages = openAiChat.messages['messages']
      } else if (behavior['prompt_recent_memories'] === 0) {
        messages.push({ role: 'user', content: prompt })
      } else if (behavior['prompt_recent_memories'] > 0) {
        const recentMessages = openAiChat.messages['messages']
        const start = Math.max(recentMessages.length - behavior['prompt_recent_memories'], 0)
        messages = recentMessages.slice(start)
      }

      const promptContext = behavior['prompt_context']
      const promptFinal =
        promptContext && promptContext.trim() !== ''
          ? `${promptContext.trim()}: '${prompt}'`
          : prompt
      messages.push({ role: 'user', content: promptFinal })
      // console.log('messages: ', messages)

      const data = {
        messages: messages.length === 1 ? [...behavior['messages'], ...messages] : messages,
        stream: behavior.stream,
        model: openAiChat.feature.model.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      const promptTokensCount = OpenAiUtils.countTokens(JSON.stringify(data.messages).trim())

      // console.log('prompt body: ', data.messages)
      // console.log('prompt tokens: ', payloadTokensCost)

      const config: AxiosRequestConfig = {
        method: 'post',
        url: OPENAI_API_CHAT_COMPLETIONS_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        data: data,
        responseType: 'stream',
      }

      response.response.writeHead(200, headers)
      const openaiResponse: AxiosResponse<unknown> = await axios(config)

      if (typeof openaiResponse.data !== 'object' || !(openaiResponse.data instanceof Stream)) {
        throw new Error('A resposta não é um stream')
      }

      let chunks: any[] = []

      //trocar o objeto contextualizado pelo prompt real para guardar no histórico
      messages[messages.length - 1] = { role: 'user', content: prompt }

      openaiResponse.data.on('data', (chunk) => {
        // console.log('chunk: ', chunk.toString())
        chunkCount++
        chunks.push(chunk)
        response.response.write(chunk.toString())
      })

      openaiResponse.data.on('end', () => {
        const bufferResponse = Buffer.concat(chunks)
        const readableResponse = OpenAiUtils.extractContentFromBufferChunk(
          bufferResponse.toString()
        )

        messages.push({ role: 'assistant', content: readableResponse })

        const completionTokensCount = chunkCount - 2 //starting and closing chunks must be removed from the counter
        const modelPricingInputValuePer1k = openAiChat.feature.model.pricing.inputValue / 1000
        const modelPricingOutputValuePer1k = openAiChat.feature.model.pricing.outputValue / 1000
        const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
        const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
        const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

        UserOperation.createOperationSpending(
          user,
          totalTokenCurrencyCost,
          openAiChat.feature.model.pricing.id,
          'open_ai_chats',
          openAiChat.id
        )

        if (messages.length === 2) {
          this.suggestChatTitle(
            openAiChat.id,
            openAiChat.feature.model.release,
            messages,
            openAiChat.feature.model.pricing,
            user
          )
        }

        openAiChat.messages = JSON.stringify({ messages: messages }) as any
        openAiChat.save()

        // console.log('completion body: ', readableResponse)
        // console.log('completion tokens: ', responseTokensCost)

        response.response.end()
      })
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  }

  public async messages({ params, response }: HttpContextContract) {
    try {
      const chat = await OpenAiChat.query()
        .preload('feature', (query) => {
          query.preload('model')
        })
        .where('uuid', params.uuid)
        .first()

      if (!chat) throw new Error('Conversa não encontrada')

      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async suggestChatTitle(
    openAiId: number,
    modelRelease: string,
    messages: any[],
    modelPricing: Pricing,
    user: User
  ) {
    let totalTokensCost: number = 0
    const data = {
      messages: [
        ...messages,
        {
          role: 'user',
          content: 'Escolha um título para o chat acima, máximo de 8 palavras',
        },
      ],
      stream: false,
      model: modelRelease,
      temperature: 0.8,
    }

    // const payloadTokensCost = OpenAiUtils.countTokens(JSON.stringify(data.messages).trim())
    // console.log('TITLE :: prompt body: ', data.messages)
    // console.log('TITLE :: prompt tokens: ', payloadTokensCost)

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    }

    const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
    const promptTokensCount = openaiResponse?.data?.usage?.prompt_tokens
    const completionTokensCount = openaiResponse?.data?.usage?.completion_tokens
    const modelPricingInputValuePer1k = modelPricing.inputValue / 1000
    const modelPricingOutputValuePer1k = modelPricing.outputValue / 1000
    const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
    const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
    const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

    const openAiChat = await OpenAiChat.findByOrFail('id', openAiId)
    UserOperation.createOperationSpending(
      user,
      totalTokenCurrencyCost,
      modelPricing.id,
      'open_ai_chats',
      openAiChat.id
    )

    const title: string = openaiResponse?.data?.choices?.[0]?.message.content ?? 'Sem título'
    openAiChat.title = title.replace(/['"]+/g, '')
    openAiChat.save()

    // console.log('TITLE :: completion body: ', title)
    // console.log('TITLE :: completion tokens: ', openaiResponse?.data?.usage?.completion_tokens)

    return
  }

  public async renameChat({ auth, params, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chat = await OpenAiChat.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!chat) throw new Error('Conversa não encontrada')

      chat.title = request.input('title')
      await chat.save()

      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async retrieveChat({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chat = await OpenAiChat.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!chat) throw new Error('Conversa não encontrada')

      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async deleteChat({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chat = await OpenAiChat.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!chat) throw new Error('Conversa não encontrada')

      await chat.delete()
      return response.noContent()
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
