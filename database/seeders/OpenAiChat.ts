import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiChat from 'App/Models/OpenAiChat'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiChat.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        openAiModelId: 1,
        userId: 1,
        title: 'Idade do universo',
      },
      {
        id: 2,
        openAiModelId: 1,
        userId: 1,
        title: 'Fundamentos da programação',
      },
      {
        id: 3,
        openAiModelId: 1,
        userId: 1,
        title: 'Receita de bolo',
      },
      {
        id: 4,
        openAiModelId: 1,
        userId: 2,
        title: 'Jardinagem básica',
      },
      {
        id: 5,
        openAiModelId: 1,
        userId: 2,
        title: 'Tópicos para aprender Francês',
      },
      {
        id: 6,
        openAiModelId: 1,
        userId: 2,
        title: 'Frutas da estação',
      },
    ])
  }
}
