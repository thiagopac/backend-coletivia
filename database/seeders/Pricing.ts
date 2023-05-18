import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pricing from 'App/Models/Pricing'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await Pricing.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        openAiModelId: 1,
        reference_value: 0.002,
        value: 0.004,
      },
      {
        id: 2,
        openAiModelId: 2,
        reference_value: 0.03,
        value: 0.05,
      },
      {
        id: 3,
        openAiModelId: 3,
        reference_value: 0.006,
        value: 0.008,
      },
      {
        id: 4,
        openAiModelId: 4,
        reference_value: 0.02,
        value: 0.03,
        variation: '1024x1024',
      },
      {
        id: 5,
        openAiModelId: 4,
        reference_value: 0.018,
        value: 0.025,
        variation: '512x512',
      },
      {
        id: 6,
        openAiModelId: 4,
        reference_value: 0.016,
        value: 0.023,
        variation: '256x256',
      },
    ])
  }
}
