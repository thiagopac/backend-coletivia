import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AiWriting from 'App/Models/AiWriting'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await AiWriting.updateOrCreateMany(uniqueKey, [])
  }
}
