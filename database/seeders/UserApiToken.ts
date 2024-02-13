import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserApiToken from 'App/Models/UserApiToken'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await UserApiToken.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        userId: 1,
        name: 'Opaque Access Token',
        type: 'opaque_token',
        token: 'c9d204e9f84e5c1b0437e3114e48cc4b3cd13036bac9494529b661106998397a',
        expiresAt: '2024-05-02 16:50:30',
      },
      {
        id: 2,
        userId: 2,
        name: 'Opaque Access Token',
        type: 'opaque_token',
        token: '09618ffb05cb04305254e15deb92fd49f5eb5647d4fe0c7dedc2d26cee35fc77',
        expiresAt: '2024-05-02 16:50:30',
      },
    ])
  }
}
