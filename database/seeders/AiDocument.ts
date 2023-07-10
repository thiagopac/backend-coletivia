import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AiDocument from 'App/Models/AiDocument'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await AiDocument.updateOrCreateMany(uniqueKey, [])
  }
}
