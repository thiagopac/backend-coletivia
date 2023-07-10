import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiUtils from '../../../Utils/OpenAiUtils'
import axios from 'axios'

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
}

export default class GenerativeAITextController {
  public async testBuffer({ response }: HttpContextContract) {
    let chunk = `data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"role":"assistant"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":" ele"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"f"},"index":0,"finish_reason":null}]}
    data: {"id":"chatcmpl-7Cv0lCDG1zc7Ir6RT1pJzi0pN1uNd","object":"chat.completion.chunk","created":1683313443,"model":"gpt-3.5-turbo-0301","choices":[{"delta":{"content":"ante"},"index":0,"finish_reason":null}]}
    data: [DONE]`

    // chunk = ` data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" sum"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" of"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" "},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":"2"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" and"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" "},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":"2"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" is"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":" "},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":"4"},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{"content":"."},"finish_reason":null}]}

    // data: {"id":"chatcmpl-7WnagohPDtiwPdODkz9VrdIAdH77k","object":"chat.completion.chunk","created":1688051478,"model":"gpt-3.5-turbo-0301","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

    // data: [DONE]`

    const content = OpenAiUtils.extractContentFromBufferChunk(chunk)
    return response.send(content)
  }

  public async fakeStream({ response }: HttpContextContract) {
    let responseTokensCost

    response.response.writeHead(200, headers)

    const generateRandomChunk = (isLastChunk: boolean): string => {
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
      const finishReason = isLastChunk ? 'stop' : null

      const chunk = {
        id,
        object: 'chat.completion.chunk',
        created,
        model: 'gpt-3.5-turbo',
        choices: [{ delta: { content }, index: 0, finish_reason: finishReason }],
      }

      return `data: ${JSON.stringify(chunk)}\n\n`
    }

    const generateClosingChunk = (): string => {
      return 'data: [DONE]\n\n'
    }

    const numChunks = Math.floor(Math.random() * (10 - 30 + 1)) + 30
    let chunkCount = 0

    responseTokensCost = numChunks - 2 //starting and closing chunks must be removed from the counter

    const sendChunks = () => {
      const isLastChunk = chunkCount === numChunks - 1
      const chunk = generateRandomChunk(isLastChunk)
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

  public async streamRandomText({ response }: HttpContextContract) {
    const url = 'https://mocki.io/v1/28812a57-d172-4a2e-9991-2e8d63c15171'
    const { data } = await axios.get(url)
    const objects = data // Assuming the JSON response is an array of objects

    const randomObject = objects[Math.floor(Math.random() * objects.length)] // Select a random object from the array
    const text = randomObject.message // Access the "message" property of the random object

    response.response.writeHead(200, headers)

    const chunkSize = 3 // Each chunk will have 3 letters of the text
    const totalChunks = Math.ceil(text.length / chunkSize)
    let chunksSent = 0

    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize)

      setTimeout(() => {
        if (chunksSent === totalChunks - 2) {
          const penultimateChunkResponse = JSON.stringify({
            id: 89558037361,
            object: 'chat.completion.chunk',
            created: 728445409184,
            model: 'gpt-3.5-turbo',
            choices: [
              {
                delta: {
                  content: chunk,
                },
                index: 0,
                finish_reason: 'length',
              },
            ],
          })
          response.response.write(`data: ${penultimateChunkResponse}\n\n`)
          chunksSent++
        } else if (chunksSent === totalChunks - 1) {
          response.response.write('data: [DONE]\n\n')
          response.response.end()
        } else {
          const chunkResponse = JSON.stringify({
            id: 89558037361,
            object: 'chat.completion.chunk',
            created: 728445409184,
            model: 'gpt-3.5-turbo',
            choices: [
              {
                delta: {
                  content: chunk,
                },
                index: 0,
                finish_reason: null,
              },
            ],
          })
          response.response.write(`data: ${chunkResponse}\n\n`)
          chunksSent++
        }
      }, 10 * (i / chunkSize + 1))
    }
  }
}
