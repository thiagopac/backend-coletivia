import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiChat from 'App/Models/OpenAiChat'
import OpenAiModel from 'App/Models/OpenAiModel'
import Pricing from 'App/Models/Pricing'
import OpenAiUtils from '../../../Utils/OpenAiUtils'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { Stream } from 'stream'
import UserOperation from 'App/Models/UserOperation'
import User from 'App/Models/User'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
const OPENAI_API_CHAT_COMPLETIONS_URL = `${Env.get('OPENAI_API_CHAT_COMPLETIONS_URL')}`

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
}

export default class ChatController {
  public async testBuffer({ response }: HttpContextContract) {
    let chunk = `data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" ele"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"f"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"ante"},"index":0,"finish_reason":null}]}
    data: [DONE]`
    const content = OpenAiUtils.extractContentFromBufferChunk(chunk)
    return response.send(content)
  }

  public async createChatFree({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { model } = request.body()

      const behavior: any = {
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente gentil e solícito',
          },
        ],
        stream: true,
        temperature: 1,
        presence_penalty: 0,
        frequency_penalty: 0,
        logit_bias: {},
        prompt_context: '',
        prompt_recent_memories: -1,
      }

      const chat = await OpenAiChat.createChat(user, model, behavior, 'free-chat')
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createChatLegalToInformal({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { model } = request.body()

      const behavior: any = {
        messages: [
          {
            role: 'system',
            content: 'Você é um advogado que traduz a linguagem jurídica para o cliente',
          },
        ],
        stream: false,
        temperature: 0.3,
        presence_penalty: 0,
        frequency_penalty: 0,
        logit_bias: {},
        prompt_context:
          "Reescreva o texto entre 'aspas simples' que tem termos complexos do Direito para linguagem simples e acessível",
        prompt_recent_memories: 0,
      }

      const chat = await OpenAiChat.createChat(user, model, behavior, 'legal-to-informal')
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createChatInformalToFormal({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { model } = request.body()

      const behavior: any = {
        messages: [
          {
            role: 'system',
            content:
              'Você é um linguista que reescreve textos de caráter informal para contexto formal',
          },
        ],
        stream: false,
        temperature: 0.8,
        presence_penalty: 0,
        frequency_penalty: 0,
        logit_bias: {},
        prompt_context: "Reescreva o texto informal entre 'aspas simples' para contexto formal",
        prompt_recent_memories: 2,
      }

      const chat = await OpenAiChat.createChat(user, model, behavior, 'informal-to-formal')
      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async list({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chats = await OpenAiChat.query()
        .select(['uuid', 'title', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .andWhere('type', '=', params.type)
        .orderBy('id', 'desc')

      if (!chats) throw new Error('Nenhuma conversa encontrada')

      return chats
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**
   * @description Cria uma nova mensagem em uma conversa existente, recebendo através de single response (ignora o stream do behavior)
   */
  public async createMessageSingle({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { chat, prompt } = request.body()
      let totalTokensCost: number = 0
      let messages: any[] = []

      const openAiChat = await OpenAiChat.findByOrFail('uuid', chat)
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

      const openAiModel = await OpenAiModel.query()
        .where('id', openAiChat.openAiModelId)
        .andWhere('is_available', true)
        .firstOrFail()

      const modelPricing = await Pricing.query()
        .where('open_ai_model_id', openAiModel.id)
        .firstOrFail()

      const data = {
        messages:
          messages.length === 1 && behavior['messages'].length > 0
            ? [...behavior['messages'], ...messages]
            : messages,
        stream: false, //ignora o valor stream do behavior
        model: openAiModel.release,
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

      totalTokensCost = openaiResponse?.data?.usage?.total_tokens
      const modelPricingValuePer1k = modelPricing.value / 1000
      const totalTokenCurrencyCost = totalTokensCost * modelPricingValuePer1k

      // console.log('totalTokensCost: ', totalTokensCost)
      // console.log('modelPricingValuePer1k: ', modelPricingValuePer1k)
      // console.log('totalTokenCurrencyCost: ', totalTokenCurrencyCost)

      UserOperation.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        modelPricing.id,
        'open_ai_chats',
        openAiChat.id
      )

      messages.push(openaiResponseMessage)

      if (messages.length === 2) {
        this.suggestChatTitle(openAiChat.id, openAiModel?.release, messages, modelPricing, user)
      }

      console.log('completion body: ', openaiResponseMessage.content)
      console.log('completion tokens: ', openaiResponse?.data?.usage?.completion_tokens)

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
      let responseTokensCost: number = 0
      let totalTokensCost: number = 0
      let messages: any[] = []

      // console.log('request.body: ', request.body())

      const openAiChat = await OpenAiChat.findByOrFail('uuid', chat)
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

      console.log('messages: ', messages)

      const openAiModel = await OpenAiModel.query()
        .where('id', openAiChat.openAiModelId)
        .andWhere('is_available', true)
        .firstOrFail()

      const modelPricing = await Pricing.query()
        .where('open_ai_model_id', openAiModel.id)
        .firstOrFail()

      const data = {
        messages: messages.length === 1 ? [...behavior['messages'], ...messages] : messages,
        stream: behavior.stream,
        model: openAiModel.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      const payloadTokensCost = OpenAiUtils.countTokens(JSON.stringify(data.messages).trim())

      console.log('prompt body: ', data.messages)
      console.log('prompt tokens: ', payloadTokensCost)

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
        console.log('chunk: ', chunk.toString())
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

        responseTokensCost = chunkCount - 2 //starting and closing chunks must be removed from the counter
        totalTokensCost = payloadTokensCost + responseTokensCost

        const totalTokenCurrencyCost = totalTokensCost * (modelPricing.value / 1000)

        UserOperation.createOperationSpending(
          user,
          totalTokenCurrencyCost,
          modelPricing.id,
          'open_ai_chats',
          openAiChat.id
        )

        if (messages.length === 2) {
          this.suggestChatTitle(openAiChat.id, openAiModel?.release, messages, modelPricing, user)
        }

        openAiChat.messages = JSON.stringify({ messages: messages }) as any
        openAiChat.save()

        console.log('completion body: ', readableResponse)
        console.log('completion tokens: ', responseTokensCost)

        response.response.end()
      })
    } catch (error) {
      response.status(500).json({ message: error.message })
    }
  }

  public async messages({ auth, params, response }: HttpContextContract) {
    try {
      const chat = await OpenAiChat.query().preload('model').where('uuid', params.uuid).first()

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

    const payloadTokensCost = OpenAiUtils.countTokens(JSON.stringify(data.messages).trim())

    console.log('TITLE :: prompt body: ', data.messages)
    console.log('TITLE :: prompt tokens: ', payloadTokensCost)

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    }

    const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
    totalTokensCost = openaiResponse?.data?.usage?.total_tokens
    const modelPricingValuePer1k = modelPricing.value / 1000
    const totalTokenCurrencyCost = totalTokensCost * modelPricingValuePer1k
    const openAiChat = await OpenAiChat.findByOrFail('id', openAiId)
    UserOperation.createOperationSpending(
      user,
      totalTokenCurrencyCost,
      modelPricing.id,
      'open_ai_chats',
      openAiChat.id
    )

    const title: string = openaiResponse?.data?.choices?.[0]?.message.content ?? 'Nova conversa'
    openAiChat.title = title.replace(/['"]+/g, '')
    openAiChat.save()

    console.log('TITLE :: completion body: ', title)
    console.log('TITLE :: completion tokens: ', openaiResponse?.data?.usage?.completion_tokens)

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
