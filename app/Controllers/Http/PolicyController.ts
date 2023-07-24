import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Policy from 'App/Models/Policy'

export default class PolicyController {
  public async retrieve({ params, response }: HttpContextContract) {
    try {
      const policy = await Policy.query()
        .where('type', params.type)
        .orderBy('id', 'desc')
        .firstOrFail()
      return policy
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
}
