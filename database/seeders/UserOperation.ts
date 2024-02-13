import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserOperation from 'App/Models/UserOperation'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await UserOperation.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        userId: 1,
        type: 'recharge',
        value: 10.0,
        currentBalance: 10.0,
      },
      {
        id: 2,
        userId: 2,
        type: 'recharge',
        value: 9.0,
        currentBalance: 9.0,
      },
    ])
  }
}
// additionalData: JSON.parse('{"message":"Pix recebido com sucesso"}'),
