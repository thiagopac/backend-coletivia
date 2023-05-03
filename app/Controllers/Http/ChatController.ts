import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OpenAiChat from 'App/Models/OpenAiChat'

export default class ChatController {
  public async list({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const chats = await OpenAiChat.query()
        .preload('aiModel')
        .where('user_id', user!.id)
        .orderBy('id', 'desc')

      if (!chats) throw new Error('No chats found')

      return chats
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async messages({ auth, params, response }: HttpContextContract) {
    try {
      const chat = await OpenAiChat.query()
        .preload('aiModel')
        .preload('chatMessages')
        .where('uuid', params.uuid)
        .first()

      if (!chat) throw new Error('Chat not found')

      return chat
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
