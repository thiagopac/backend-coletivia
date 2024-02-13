import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DocumentAnalysis from 'App/Models/DocumentAnalysis'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await DocumentAnalysis.updateOrCreateMany(uniqueKey, [])
  }
}
