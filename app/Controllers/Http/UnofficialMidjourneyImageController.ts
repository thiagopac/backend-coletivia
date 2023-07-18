import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import UserOperation from 'App/Models/UserOperation'
import MidjourneyImageGeneration from 'App/Models/MidjourneyImageGeneration'
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator'
import { Midjourney } from 'midjourney'
import Feature from 'App/Models/Feature'
import SocketIOController from 'App/Controllers/Http/SocketIOController'
import UserNotification from 'App/Notifications/UserNotification'

const UNOFFICIAL_MIDJOURNEY_SERVER_ID = Env.get('UNOFFICIAL_MIDJOURNEY_SERVER_ID')
const UNOFFICIAL_MIDJOURNEY_CHANNEL_ID = `${Env.get('UNOFFICIAL_MIDJOURNEY_CHANNEL_ID')}`
const UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN = `${Env.get('UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN')}`

export default class UnofficialMidjourneyImageController {
  /**
   * Retrieves a list of all image generations for the authenticated user.
   * @param auth - The authentication middleware.
   * @param response - The HTTP response.
   * @returns An array of image generation objects.
   * @throws An error if no image generations are found.
   */
  public async list({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const { page, perPage } = request.qs()

      const query = MidjourneyImageGeneration.query()
        .select(['uuid', 'prompt', 'images', 'upscales', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .orderBy('id', 'desc')

      const imageGenerations = await query.paginate(page, perPage)

      if (!imageGenerations) throw new Error('Nenhuma imagem encontrada')

      return imageGenerations
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**
   * Retrieves a single image generation by its UUID for the authenticated user.
   * @param auth - The authentication middleware.
   * @param params - The request parameters containing the UUID of the image generation to retrieve.
   * @param response - The HTTP response.
   * @returns The image generation object.
   * @throws An error if the image generation is not found.
   */
  public async retrieveGeneration({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const generation = await MidjourneyImageGeneration.query()
        .select(['uuid', 'prompt', 'images', 'upscales', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!generation) throw new Error('Geração de imagem não encontrada')

      return generation
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  /**
   * Creates a new image generation for the authenticated user.
   * @param auth - The authentication middleware.
   * @param request - The HTTP request containing the prompt and translate flag.
   * @param response - The HTTP response.
   * @returns The newly created image generation object.
   * @throws An error if the image generation cannot be created.
   */
  public async createImageGeneration({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { prompt, translate } = request.body()
      const translator = new GoogleTranslator()
      let text = prompt

      SocketIOController.wsShowToast(
        user!,
        'Sua imagem está sendo gerada, te enviaremos uma notificação assim que ela estiver disponível',
        'info'
      )

      // Translate single string
      if (translate === true) {
        text = await translator.translate(prompt, 'pt-br', 'en-us').then((translate) => translate)
      }

      const feature = await Feature.getFeatureWith('name', 'midjourney-free-image-generation')
      const imageGeneration = await MidjourneyImageGeneration.createImageGeneration(
        user,
        feature,
        prompt
      )

      let imagesArr: any[] = imageGeneration.images['images'] as any[]

      const client = new Midjourney({
        ServerId: UNOFFICIAL_MIDJOURNEY_SERVER_ID,
        ChannelId: UNOFFICIAL_MIDJOURNEY_CHANNEL_ID,
        SalaiToken: UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN,
        Debug: true,
        Ws: true,
      })
      await client.init()
      const image = await client.Imagine(text, (uri: string) => {
        console.log('loading', uri)
      })
      console.log({ image })

      if (!imagesArr) {
        imagesArr = []
      }
      delete image?.options
      imagesArr.push(image)

      imageGeneration.images = JSON.stringify({
        images: imagesArr,
      }) as any
      imageGeneration.save()

      SocketIOController.wsShowToast(user!, 'Sua imagem está pronta!', 'success')

      user!.notifyLater(
        new UserNotification(
          'Sua imagem está pronta!',
          'Sua imagem foi gerada e já está disponível!',
          'success',
          'success',
          `/image/midjourney/generation/${imageGeneration.uuid}`
        )
      )

      user!.notificationRefresh()

      UserOperation.createOperationSpending(
        user,
        feature.model.pricing.outputValue,
        feature.model.pricing.id,
        'midjourney_image_generations',
        imageGeneration.id
      )

      return imageGeneration
    } catch (error) {
      console.log('error: ', error)
      response.status(500).json({ error })
    }
  }

  /**
   * Creates a new variation for a given image generation.
   * @param auth - The authentication middleware.
   * @param request - The HTTP request containing the UUID of the image generation and the index of the variation to create.
   * @param response - The HTTP response.
   * @returns The newly created variation object.
   * @throws An error if the variation cannot be created.
   */
  public async createVariation({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { generation, option, index } = request.body()

      const feature = await Feature.getFeatureWith('name', 'midjourney-free-image-generation')
      const imageGeneration = await MidjourneyImageGeneration.getImageGenerationWith(
        'uuid',
        generation
      )

      const imagesObj: any = imageGeneration.images['images'][option] as any
      let variationsArr: any[] = imageGeneration.variations['variations'] as any[]

      const client = new Midjourney({
        ServerId: UNOFFICIAL_MIDJOURNEY_SERVER_ID,
        ChannelId: UNOFFICIAL_MIDJOURNEY_CHANNEL_ID,
        SalaiToken: UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN,
        Debug: true,
        Ws: true,
      })
      await client.init()

      const variation = await client.Variation({
        index: index,
        msgId: imagesObj.id,
        hash: imagesObj.hash,
        flags: imagesObj.flags,
        loading: (uri: string, progress: string) => {
          console.log('Variation.loading', uri, 'progress', progress)
        },
      })
      console.log({ variation })

      if (!variationsArr) {
        variationsArr = []
      }
      delete variation?.options
      variationsArr.push(variation)

      imageGeneration.variations = JSON.stringify({
        variations: variationsArr,
      }) as any
      imageGeneration.save()

      UserOperation.createOperationSpending(
        user,
        feature.model.pricing.outputValue,
        feature.model.pricing.id,
        'midjourney_image_generations',
        imageGeneration.id
      )

      return response.status(200).json({ variation })
    } catch (error) {
      console.log('error: ', error)
      response.status(500).json({ error })
    }
  }

  /**
   * Upscales an image variation for a given image generation.
   * @param auth - The authentication middleware.
   * @param request - The HTTP request containing the UUID of the image generation and the index of the variation to upscale.
   * @param response - The HTTP response.
   * @returns The upscaled image object.
   * @throws An error if the image variation cannot be upscaled.
   */
  public async createUpscale({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { generation, option, index } = request.body()

      const feature = await Feature.getFeatureWith('name', 'midjourney-free-image-generation')
      const imageGeneration = await MidjourneyImageGeneration.getImageGenerationWith(
        'uuid',
        generation
      )

      const imagesObj: any = imageGeneration.images['images'][option] as any
      let upscalesArr: any[] = imageGeneration.upscales['upscales'] as any[]

      const client = new Midjourney({
        ServerId: UNOFFICIAL_MIDJOURNEY_SERVER_ID,
        ChannelId: UNOFFICIAL_MIDJOURNEY_CHANNEL_ID,
        SalaiToken: UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN,
        Debug: true,
        Ws: true,
      })
      await client.init()

      const upscale = await client.Upscale({
        index: index,
        msgId: imagesObj.id,
        hash: imagesObj.hash,
        flags: imagesObj.flags,
        loading: (uri: string, progress: string) => {
          console.log('Upscale.loading', uri, 'progress', progress)
        },
      })
      console.log({ upscale })

      if (!upscalesArr) {
        upscalesArr = []
      }
      delete upscale?.options
      upscalesArr.push(upscale)

      imageGeneration.upscales = JSON.stringify({
        upscales: upscalesArr,
      }) as any

      imageGeneration.save()

      UserOperation.createOperationSpending(
        user,
        feature.model.pricing.outputValue,
        feature.model.pricing.id,
        'midjourney_image_generations',
        imageGeneration.id
      )

      return response.status(200).json({ upscale })
    } catch (error) {
      console.log('error: ', error)
      response.status(500).json({ error })
    }
  }

  public async fakeImageGeneration({ response }: HttpContextContract) {
    try {
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
}
