import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import InstagramPost from 'App/Models/InstagramPost'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await InstagramPost.updateOrCreateMany(uniqueKey, [])
  }
}
