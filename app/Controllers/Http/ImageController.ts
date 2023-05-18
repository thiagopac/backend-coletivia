import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiChat from 'App/Models/OpenAiChat'
import OpenAiModel from 'App/Models/OpenAiModel'
import Pricing from 'App/Models/Pricing'
import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import UserOperation from 'App/Models/UserOperation'
import OpenAiImageGeneration from 'App/Models/OpenAiImageGeneration'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
const OPENAI_API_IMAGE_GENERATIONS_URL = `${Env.get('OPENAI_API_IMAGE_GENERATIONS_URL')}`

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Origin': '*',
}

export default class ImageController {
  public async createImageGenerationFree({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { model, size } = request.body()

      const behavior: any = {}

      const imageGeneration = await OpenAiImageGeneration.createImageGeneration(
        user,
        model,
        behavior,
        'free-image-generation',
        size
      )
      return imageGeneration
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async list({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const imageGenerations = await OpenAiImageGeneration.query()
        .select(['uuid', 'size', 'images', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .orderBy('id', 'desc')

      if (!imageGenerations) throw new Error('Nenhuma imagem encontrada')

      return imageGenerations
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async createImageGeneration({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { size, prompt, variations } = request.body()

      //enquanto só há o DALL·E, selecionar direto do banco de dados, depois deixar usuário escolher entre opções de models de imagem
      const openAiModel = await OpenAiModel.query()
        .where('type', 'image')
        .orderBy('id', 'desc')
        .firstOrFail()

      const behavior: any = {}

      const imageGeneration = await OpenAiImageGeneration.createImageGeneration(
        user,
        openAiModel.uuid,
        behavior,
        'free-image-generation',
        size
      )

      const modelPricing = await Pricing.query()
        .where('open_ai_model_id', openAiModel.id)
        .firstOrFail()

      const data = {
        prompt: prompt,
        n: variations,
        size: size,
        // response_format: 'b64_json',
        response_format: 'url',
        user: user.uuid,
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }

      const openaiResponse = await axios.post(OPENAI_API_IMAGE_GENERATIONS_URL, data, config)
      const openaiResponseData = openaiResponse?.data
      console.log('openaiResponseData: ', openaiResponseData)

      const modelPricingVariation = await Pricing.query()
        .where('variation', size)
        .orderBy('id', 'desc')
        .firstOrFail()

      UserOperation.createOperationSpending(
        user,
        modelPricingVariation.value * variations,
        modelPricing.id,
        'open_ai_image_generations',
        imageGeneration.id
      )

      imageGeneration.images = JSON.stringify({ images: openaiResponseData }) as any
      imageGeneration.save()
      return imageGeneration
    } catch (error) {
      console.log('error: ', error)
      response.status(500).json({ error })
    }
  }

  public async fakeImageGeneration({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      // const { size, prompt, variations } = request.body()

      const fakeImageGeneration = {
        type: 'free-image-generation',
        size: '1024x1024',
        images:
          '{"images":{"created":1684375458,"data":[{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-m269LFaxGgzaY6vSVtHo9TjC.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mYlitBdB5qqHeKJZEisIH1v9ht4XeLllirgM6EfTfHA%3D"},{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-FUyUXB5GH4FxFosouiSKoOIy.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mQEKd6y0cvj4V%2BAJKwIdXa903usnfMs/sdD4p4Q5whY%3D"},{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-FUyUXB5GH4FxFosouiSKoOIy.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mQEKd6y0cvj4V%2BAJKwIdXa903usnfMs/sdD4p4Q5whY%3D"},{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-FUyUXB5GH4FxFosouiSKoOIy.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mQEKd6y0cvj4V%2BAJKwIdXa903usnfMs/sdD4p4Q5whY%3D"},{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-FUyUXB5GH4FxFosouiSKoOIy.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mQEKd6y0cvj4V%2BAJKwIdXa903usnfMs/sdD4p4Q5whY%3D"},{"url":"https://oaidalleapiprodscus.blob.core.windows.net/private/org-qlXnEj1wDB417hIRO73WEILo/user-tB9Id02z8WLqHl4Lq16apIxy/img-FUyUXB5GH4FxFosouiSKoOIy.png?st=2023-05-18T01%3A04%3A18Z&se=2023-05-18T03%3A04%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-17T20%3A33%3A55Z&ske=2023-05-18T20%3A33%3A55Z&sks=b&skv=2021-08-06&sig=mQEKd6y0cvj4V%2BAJKwIdXa903usnfMs/sdD4p4Q5whY%3D"}]}}',
        uuid: 'a791136d-54d4-4bf0-87f9-565d9e609298',
        created_at: '2023-05-17T23:04:12.687-03:00',
        updated_at: '2023-05-17T23:04:19.073-03:00',
      }

      return fakeImageGeneration
    } catch (error) {
      response.status(500).json({ error })
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
}
