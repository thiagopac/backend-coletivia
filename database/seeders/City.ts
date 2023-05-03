import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import City from 'App/Models/City'

export default class CitySeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await City.updateOrCreateMany(uniqueKey, [
      {
        id: 1991,
        stateId: 11,
        lat: '-19.9111',
        lon: '-43.9273',
        name: 'Belo Horizonte',
        class: 'Capital Estadual',
        stateLetter: 'MG',
        isAvailable: true,
      },
    ])
  }
}
