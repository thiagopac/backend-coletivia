import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RechargeOption from 'App/Models/RechargeOption'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await RechargeOption.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        type: 'pix',
        label: 'Teste',
        debitedValue: 0.01,
        creditedValue: 0.01,
        isAvailable: true,
      },
      {
        id: 2,
        type: 'pix',
        label: 'Pix25',
        debitedValue: 25,
        creditedValue: 25,
        isAvailable: true,
      },
      {
        id: 3,
        type: 'pix',
        label: 'Pix50',
        debitedValue: 50,
        creditedValue: 50,
        isAvailable: true,
      },
      {
        id: 4,
        type: 'pix',
        label: 'Pix100',
        debitedValue: 100,
        creditedValue: 100,
        isAvailable: true,
      },
    ])
  }
}
