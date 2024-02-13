import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DalleAiImageGeneration from 'App/Models/DalleAiImageGeneration'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await DalleAiImageGeneration.updateOrCreateMany(uniqueKey, [])
  }
}
