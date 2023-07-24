import AiWriting from 'App/Models/AiWriting'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import UserOperation from 'App/Models/UserOperation'
import MidjourneyImageGeneration from 'App/Models/MidjourneyImageGeneration'
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator'
import { Midjourney } from 'midjourney'
import Feature from 'App/Models/Feature'
import InstagramPost from 'App/Models/InstagramPost'
import Utils from '../../../Utils/Utils'
import axios from 'axios'
import User from 'App/Models/User'

const OPENAI_API_KEY = Env.get('OPENAI_API_KEY')
const OPENAI_API_CHAT_COMPLETIONS_URL = `${Env.get('OPENAI_API_CHAT_COMPLETIONS_URL')}`
// const TEST_MOCK_API_CHAT_COMPLETIONS_URL = `${Env.get('TEST_MOCK_API_CHAT_COMPLETIONS_URL')}`

const UNOFFICIAL_MIDJOURNEY_SERVER_ID = Env.get('UNOFFICIAL_MIDJOURNEY_SERVER_ID')
const UNOFFICIAL_MIDJOURNEY_CHANNEL_ID = `${Env.get('UNOFFICIAL_MIDJOURNEY_CHANNEL_ID')}`
const UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN = `${Env.get('UNOFFICIAL_MIDJOURNEY_SALAI_TOKEN')}`

export default class InstagramPostController {
  /**
   * Retrieves a list of Instagram posts for the authenticated user.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication and response objects.
   * @returns {Promise<InstagramPost[]> || Promise<Error>} - A promise that resolves to an array of InstagramPost objects.
   * @throws {Error} - If no posts are found.
   */
  public async list({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { page, perPage } = request.qs()

      const query = InstagramPost.query()
        .preload('midjourneyImageGeneration')
        .preload('aiWriting')
        .where('user_id', user.id)
        .orderBy('id', 'desc')

      const posts = await query.paginate(page, perPage)

      return posts
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

  /**
   * Retrieves a specific Instagram post for the authenticated user.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, parameters, and response objects.
   * @returns {Promise<InstagramPost>} - A promise that resolves to the retrieved InstagramPost object.
   * @throws {Error} - If the post is not found.
   */
  public async retrievePost({
    auth,
    params,
    response,
  }: HttpContextContract): Promise<InstagramPost | void> {
    try {
      const user = auth.use('user').user!
      if ((await user.hasEnoughBalance()) === false) {
        throw new Error('Saldo insuficiente')
      }
      const post = await InstagramPost.query()
        .preload('aiWriting')
        .preload('midjourneyImageGeneration')
        .where('user_id', user.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!post) {
        throw new Error('Post não encontrado')
      }

      return post
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

  /**
   * Creates a new Instagram post for the authenticated user.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication and response objects.
   * @returns {Promise<InstagramPost>} - A promise that resolves to the created InstagramPost object.
   * @throws {Error} - If an error occurs during the creation process.
   */
  public async createInstagramPost({
    auth,
    response,
  }: HttpContextContract): Promise<InstagramPost | void> {
    try {
      const user = auth.use('user').user!
      const post = await InstagramPost.createInstagramPost(user)
      if ('error' in post) {
        throw new Error(post.error)
      }

      return post
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

  /**
   * Generates text content for an Instagram post.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, request, and response objects.
   * @returns {Promise<InstagramPost>} - A promise that resolves to the updated InstagramPost object with generated text content.
   * @throws {Error} - If an error occurs during the generation process.
   */
  public async generateTextPost({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { post, prompt } = request.body()
      let instagramPost = await InstagramPost.query().where('uuid', post).first()
      if (!instagramPost) {
        throw new Error('Post de Instagram não encontrado')
      }

      let writing: any

      if (instagramPost.aiWritingId === null) {
        const featureText = await Feature.getFeatureWith('name', 'Post de Instagram - Texto')

        if ('error' in featureText) {
          throw new Error(featureText.error)
        }

        const result = await AiWriting.createAiWriting(user, featureText)

        if ('error' in result) {
          throw new Error(result.error)
        }

        writing = result

        instagramPost.aiWritingId = writing.id
        await instagramPost.save()
      } else {
        writing = await AiWriting.getAiWritingWith('id', instagramPost.aiWritingId)
      }

      const result = await AiWriting.getAiWritingWith('id', writing.id)

      if ('error' in result) {
        throw new Error(result.error)
      }

      const aiWriting: AiWriting = result
      const behavior: any = aiWriting.behavior

      const promptContext = behavior['prompt_context']
      const message = { role: 'user', content: `${promptContext}${prompt}` }

      const data = {
        messages: [message],
        stream: false,
        model: aiWriting.feature.model.release,
        temperature: behavior.temperature,
        presence_penalty: behavior.presence_penalty,
        frequency_penalty: behavior.frequency_penalty,
        logit_bias: behavior.logit_bias,
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }

      const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
      const openaiResponseMessage = openaiResponse?.data?.choices?.[0]?.message.content ?? ''

      const promptTokensCount = openaiResponse?.data?.usage?.prompt_tokens
      const completionTokensCount = openaiResponse?.data?.usage?.completion_tokens
      const modelPricingInputValuePer1k = aiWriting.feature.model.pricing.inputValue / 1000
      const modelPricingOutputValuePer1k = aiWriting.feature.model.pricing.outputValue / 1000
      const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
      const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
      const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

      this.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        aiWriting.feature.model.pricing.id,
        'ai_writings',
        aiWriting.id
      )

      aiWriting.prompt = prompt
      aiWriting.text = openaiResponseMessage
      aiWriting.save()

      instagramPost = await InstagramPost.query().preload('aiWriting').where('uuid', post).first()
      if (!instagramPost) {
        throw new Error('Post de Instagram não encontrado')
      }

      return instagramPost
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

  /**
   * Generates text content for an Instagram post with an image.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, request, and response objects.
   * @returns {Promise<{ imagine: string }>} - A promise that resolves to an object with the generated text content.
   * @throws {Error} - If an error occurs during the generation process.
   */
  public async generateTextImagine({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<{ imagine: string } | void> {
    try {
      const user = auth.use('user').user!
      const { post, textPost } = request.body()
      const instagramPost = await InstagramPost.query().where('uuid', post).firstOrFail()
      const result = await AiWriting.getAiWritingWith('id', instagramPost.aiWritingId)

      if ('error' in result) {
        throw new Error(result.error)
      }

      const aiWriting: AiWriting = result as AiWriting
      const behavior: any = aiWriting.behavior

      const promptImage = behavior['prompt_image']
      const message = { role: 'user', content: `${promptImage}${textPost}` }

      const data = {
        messages: [message],
        stream: false,
        model: aiWriting.feature.model.release,
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

      const openaiResponse = await axios.post(OPENAI_API_CHAT_COMPLETIONS_URL, data, config)
      // const openaiResponse = await axios.post(TEST_MOCK_API_CHAT_COMPLETIONS_URL, data, config)
      const openaiResponseMessage = openaiResponse?.data?.choices?.[0]?.message.content ?? ''

      const promptTokensCount = openaiResponse?.data?.usage?.prompt_tokens
      const completionTokensCount = openaiResponse?.data?.usage?.completion_tokens
      const modelPricingInputValuePer1k = aiWriting.feature.model.pricing.inputValue / 1000
      const modelPricingOutputValuePer1k = aiWriting.feature.model.pricing.outputValue / 1000
      const promptTokensCost = promptTokensCount * modelPricingInputValuePer1k
      const completionTokenCost = completionTokensCount * modelPricingOutputValuePer1k
      const totalTokenCurrencyCost = promptTokensCost + completionTokenCost

      this.createOperationSpending(
        user,
        totalTokenCurrencyCost,
        aiWriting.feature.model.pricing.id,
        'ai_writings',
        aiWriting.id
      )

      return { imagine: openaiResponseMessage }
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

  /**
   * Generates an image for an Instagram post.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, request, and response objects.
   * @returns {Promise<InstagramPost>} - A promise that resolves to the updated InstagramPost object with generated image.
   * @throws {Error} - If an error occurs during the generation process.
   */
  public async generateImagePost({
    auth,
    request,
  }: HttpContextContract): Promise<InstagramPost | { error: string }> {
    const user = auth.use('user').user!
    const { post, imagine, translate, size } = request.body()

    const translator = new GoogleTranslator()
    let text = imagine
    let suffix = ''

    //size = square | horizontal | vertical
    if (size === 'square') {
      suffix = '--ar 1:1'
    } else if (size === 'horizontal') {
      suffix = '--ar 191:100'
    } else if (size === 'vertical') {
      suffix = '--ar 4:5'
    }

    if (translate === true) {
      text = await translator.translate(imagine, 'pt-br', 'en-us')
    }

    text = `${Utils.removeHyphens(text)} ${suffix}`

    let instagramPost = await InstagramPost.query().where('uuid', post).firstOrFail()

    let generation: any

    if (instagramPost.midjourneyImageGenerationId === null) {
      const featureImage = await Feature.getFeatureWith('name', 'Post de Instagram - Imagem')

      if ('error' in featureImage) {
        throw new Error(featureImage.error)
      }

      const result = await MidjourneyImageGeneration.createImageGeneration(
        user,
        featureImage,
        imagine
      )

      if ('error' in result) {
        throw new Error(result.error)
      }

      generation = result as MidjourneyImageGeneration

      instagramPost.midjourneyImageGenerationId = generation.id
      await instagramPost.save()
    } else {
      generation = await MidjourneyImageGeneration.getImageGenerationWith(
        'id',
        instagramPost.midjourneyImageGenerationId
      )
    }

    const midjourneyImageGeneration = await MidjourneyImageGeneration.getImageGenerationWith(
      'id',
      generation.id
    )

    if ('error' in midjourneyImageGeneration) {
      throw new Error(midjourneyImageGeneration.error)
    }

    let imagesArr: any[] = midjourneyImageGeneration.images['images'] as any[]

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

    if (!imagesArr) {
      imagesArr = []
    }

    delete image?.options
    imagesArr.push(image)

    this.createOperationSpending(
      user,
      midjourneyImageGeneration.feature.model.pricing.outputValue,
      midjourneyImageGeneration.feature.model.pricing.id,
      'midjourney_image_generations',
      midjourneyImageGeneration.id
    )

    midjourneyImageGeneration.images = JSON.stringify({
      images: imagesArr,
    }) as any

    midjourneyImageGeneration.save()

    const instagramPostOrError = await InstagramPost.getInstagramPostWith('uuid', post)

    if ('error' in instagramPostOrError) {
      throw new Error(instagramPostOrError.error)
    }

    instagramPost = instagramPostOrError

    return instagramPost
  }

  /**
   * Upscales an image for an Instagram post.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, request, and response objects.
   * @returns {Promise<InstagramPost | { error: string }>} - A promise that resolves to the updated InstagramPost object with upscaled image, or an object with an error message.
   * @throws {Error} - If an error occurs during the upscaling process.
   */
  public async upscaleImage({
    auth,
    request,
    response,
  }: HttpContextContract): Promise<InstagramPost | { error: string }> {
    try {
      const user = auth.use('user').user!
      const { post, option, index } = request.body()

      let instagramPost = await InstagramPost.getInstagramPostWith('uuid', post)

      if ('error' in instagramPost) {
        return {
          error: instagramPost.error,
        }
      }

      const feature = await Feature.getFeatureWith('name', 'Post de Instagram - Imagem')

      if ('error' in feature) {
        throw new Error(feature.error)
      }

      const imageGeneration = await MidjourneyImageGeneration.getImageGenerationWith(
        'uuid',
        instagramPost.midjourneyImageGeneration.uuid
      )

      if ('error' in imageGeneration) {
        throw new Error(imageGeneration.error)
      }

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

      if (!upscalesArr) {
        upscalesArr = []
      }

      delete upscale?.options
      upscalesArr.push(upscale)

      imageGeneration.upscales = JSON.stringify({
        upscales: upscalesArr,
      }) as any

      imageGeneration.save()

      this.createOperationSpending(
        user,
        feature.model.pricing.outputValue,
        feature.model.pricing.id,
        'midjourney_image_generations',
        imageGeneration.id
      )

      instagramPost = await InstagramPost.getInstagramPostWith('uuid', post)

      return instagramPost
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // }) as any
    }
  }

  /**
   * Creates a spending operation record.
   *
   * @param {User} user - The user associated with the spending operation.
   * @param {number} cost - The cost of the spending operation.
   * @param {number} pricingId - The ID of the pricing associated with the spending operation.
   * @param {string} table - The table name associated with the spending operation.
   * @param {number} entityId - The ID of the entity associated with the spending operation.
   * @returns {Promise<void>} - A promise that resolves when the spending operation is created.
   */
  public async createOperationSpending(
    user: User,
    cost: number,
    pricingId: number,
    table: string,
    entityId: number
  ): Promise<void> {
    UserOperation.createOperationSpending(user, cost, pricingId, table, entityId)
  }

  /**
   * Deletes a specific Instagram post.
   *
   * @param {HttpContextContract} ctx - The HTTP context containing the authentication, parameters, and response objects.
   * @returns {Promise<void>} - A promise that resolves when the post is marked as deleted.
   * @throws {Error} - If the post is not found.
   */
  public async deletePost({ auth, params, response }: HttpContextContract): Promise<void> {
    try {
      const user = auth.use('user').user
      const post = await InstagramPost.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!post) throw new Error('Post não encontrado')

      await post.delete()
      return response.noContent()
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

  public async translate({ request }: HttpContextContract): Promise<string> {
    const { text } = request.body()
    const translator = new GoogleTranslator()
    const translation = await translator.translate(text, 'pt-br', 'en-us')
    return translation
  }
}
