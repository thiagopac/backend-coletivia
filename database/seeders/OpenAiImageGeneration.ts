import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiImageGeneration from 'App/Models/OpenAiImageGeneration'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiImageGeneration.updateOrCreateMany(uniqueKey, [])
  }
}
