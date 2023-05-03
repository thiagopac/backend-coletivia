import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserInfo from 'App/Models/UserInfo'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'userId'

    await UserInfo.updateOrCreateMany(uniqueKey, [
      {
        userId: 1,
        phone: '5531988886463',
        cityId: 1991,
        firstName: 'Thiago',
        lastName: 'Castro',
      },
      {
        userId: 2,
        phone: '553191851290',
        cityId: 1991,
        firstName: 'Rodolfo',
        lastName: 'Iannazzo',
      },
    ])
  }
}
