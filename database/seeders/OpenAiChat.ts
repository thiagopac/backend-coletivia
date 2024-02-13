import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiChat from 'App/Models/OpenAiChat'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiChat.updateOrCreateMany(uniqueKey, [])
  }
}
