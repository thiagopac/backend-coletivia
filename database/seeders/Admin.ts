import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'email'

    await Admin.updateOrCreateMany(uniqueKey, [
      {
        email: 'admin1@coletivia.com.br',
        password: 'admin1pass',
      },
    ])
  }
}
