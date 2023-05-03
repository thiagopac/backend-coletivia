import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AdminInfo from 'App/Models/AdminInfo'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'adminId'

    await AdminInfo.updateOrCreateMany(uniqueKey, [
      {
        adminId: 1,
        phone: '+55 31 3333-3333',
        cityId: 1991,
        firstName: 'Admin1',
        lastName: 'Coletivia',
      },
    ])
  }
}
