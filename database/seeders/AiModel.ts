import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AiModel from 'App/Models/AiModel'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await AiModel.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        name: 'GPT-3.5 Turbo 4k',
        release: 'gpt-3.5-turbo',
        type: 'text',
        contextLength: 4096,
        isAvailable: true,
      },
      {
        id: 2,
        name: 'GPT-3.5 Turbo 16k',
        release: 'gpt-3.5-turbo-16k',
        type: 'text',
        contextLength: 16384,
        isAvailable: true,
      },
      {
        id: 3,
        name: 'GPT-4 8k',
        release: 'gpt-4',
        type: 'text',
        contextLength: 8192,
        isAvailable: false,
      },
      {
        id: 4,
        name: 'GPT-4 32k',
        release: 'gpt-4-32k',
        type: 'text',
        contextLength: 32768,
        isAvailable: false,
      },
      {
        id: 5,
        name: 'DALL·E',
        type: 'image',
        isAvailable: true,
      },
      {
        id: 6,
        name: 'Midjourney',
        type: 'image',
        isAvailable: true,
      },
    ])
  }
}
