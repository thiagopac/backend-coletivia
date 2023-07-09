import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiModel from 'App/Models/OpenAiModel'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiModel.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        name: 'GPT-3.5',
        release: 'gpt-3.5-turbo',
        type: 'text',
        isAvailable: true,
      },
      {
        id: 2,
        name: 'GPT-4',
        release: 'gpt-4',
        type: 'text',
        isAvailable: false,
      },
      {
        id: 3,
        name: 'Whisper',
        type: 'audio',
        isAvailable: false,
      },
      {
        id: 4,
        name: 'DALL·E',
        type: 'image',
        isAvailable: true,
      },
    ])
  }
}
