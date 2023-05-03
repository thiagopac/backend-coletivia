import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { Stream } from 'stream'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
const OPENAI_API_CHAT_URL = `${Env.get('OPENAI_API_CHAT_URL')}`

export default class GenerativeAITextController {
  public async promptSingle({ auth, request, response }: HttpContextContract) {
    const { messages } = request.body()

    const data = {
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...messages],
      max_tokens: 60,
      stream: false,
      model: 'gpt-3.5-turbo',
      temperature: 1,
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    }

    try {
      const openaiResponse = await axios.post(OPENAI_API_CHAT_URL, data, config)
      const message = openaiResponse?.data?.choices?.[0]?.message ?? ''
      return { result: message }
    } catch (error) {
      return response.notFound(error)
    }
  }

  public async promptStream({ auth, request, response }: HttpContextContract) {
    const { messages } = request.body()

    const config: AxiosRequestConfig = {
      method: 'post',
      url: OPENAI_API_CHAT_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      data: {
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, ...messages],
        max_tokens: 60,
        stream: true,
        model: 'gpt-3.5-turbo',
        temperature: 1,
      },
      responseType: 'stream',
    }

    try {
      response.response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      })

      const openaiResponse: AxiosResponse<unknown> = await axios(config)

      if (typeof openaiResponse.data !== 'object' || !(openaiResponse.data instanceof Stream)) {
        throw new Error('A resposta não é um stream')
      }

      openaiResponse.data.on('data', (chunk) => {
        response.response.write(chunk.toString())
      })

      openaiResponse.data.on('end', () => {
        response.response.end()
      })
    } catch (error) {
      response.status(500).json({ message: 'Erro ao processar a requisição' })
    }
  }

  public async fakeStream({ auth, response }: HttpContextContract) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    }

    response.response.writeHead(200, headers)

    const generateRandomChunk = (): string => {
      const id = Math.floor(Math.random() * 1000000000000)
      const created = Math.floor(Math.random() * 1000000000000)
      let content = ''
      for (let i = 0; i < 4; i++) {
        if (Math.random() < 0.25) {
          content += ' '
        } else {
          content += String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        }
      }
      const finishReason = Math.random() > 0.5 ? null : 'stop'

      const chunk = {
        id,
        object: 'chat.completion.chunk',
        created,
        model: 'gpt-3.5-turbo-0301',
        choices: [{ delta: { content }, index: 0, finish_reason: finishReason }],
      }

      return `data: ${JSON.stringify(chunk)}\n\n`
    }

    const generateClosingChunk = (): string => {
      return 'data: [DONE]\n\n'
    }

    const numChunks = Math.floor(Math.random() * (200 - 30 + 1)) + 30
    let chunkCount = 0

    const sendChunks = () => {
      const chunk = generateRandomChunk()
      response.response.write(chunk)
      chunkCount++

      if (chunkCount === numChunks) {
        response.response.write(generateClosingChunk())
        response.response.end()
      } else {
        setTimeout(sendChunks, 50)
      }
    }

    sendChunks()
  }
}
