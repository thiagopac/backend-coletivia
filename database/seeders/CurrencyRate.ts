import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CurrencyRate from 'App/Models/CurrencyRate'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await CurrencyRate.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        from: 'USD',
        to: 'BRL',
        rate: 5.07,
      },
      {
        id: 2,
        from: 'USD',
        to: 'BRL',
        rate: 5.04,
      },
      {
        id: 3,
        from: 'USD',
        to: 'BRL',
        rate: 5.03,
      },
    ])
  }
}
