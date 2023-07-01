import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RechargeType from 'App/Models/RechargeType'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await RechargeType.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        name: 'PIX',
        isAvailable: true,
      },
    ])
  }
}
