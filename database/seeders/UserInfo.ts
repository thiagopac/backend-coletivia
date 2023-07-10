import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserInfo from 'App/Models/UserInfo'

export default class extends BaseSeeder {
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
        registrationType: 'PF',
        cpfCnpj: '06956141698',
      },
      {
        userId: 2,
        phone: '553191851290',
        cityId: 1991,
        firstName: 'Rodolfo',
        lastName: 'Iannazzo',
        registrationType: 'PF',
        cpfCnpj: '12345678900',
      },
      {
        userId: 3,
        phone: '553193639401',
        cityId: 1991,
        firstName: 'Crosswork',
        lastName: 'TI',
        registrationType: 'PJ',
        cpfCnpj: '17751370000163',
      },
    ])
  }
}
