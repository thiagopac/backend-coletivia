import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserBalance from 'App/Models/UserBalance'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await UserBalance.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        userId: 1,
        currentBalance: 10.0,
      },
      {
        id: 2,
        userId: 2,
        currentBalance: 9.0,
      },
      {
        id: 3,
        userId: 3,
        currentBalance: 10.0,
      },
    ])
  }
}
