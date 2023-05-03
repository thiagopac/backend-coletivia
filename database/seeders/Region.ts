import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Region from 'App/Models/Region'

export default class RegionSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await Region.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        name: 'Norte',
        isAvailable: true,
      },
      {
        id: 2,
        name: 'Nordeste',
        isAvailable: true,
      },
      {
        id: 3,
        name: 'Sudeste',
        isAvailable: true,
      },
      {
        id: 4,
        name: 'Sul',
        isAvailable: true,
      },
      {
        id: 5,
        name: 'Centro-Oeste',
        isAvailable: true,
      },
    ])
  }
}
