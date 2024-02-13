import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AdminApiToken from 'App/Models/AdminApiToken'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await AdminApiToken.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        adminId: 1,
        name: 'Opaque Access Token',
        type: 'opaque_token',
        token: '8c2ad3b9712fe7f3ea3e47a2c6e198dc4279aa07c355584ba1887109b487e9af',
        expiresAt: '2024-05-02 16:50:30',
      },
    ])
  }
}
