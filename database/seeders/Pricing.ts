import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Pricing from 'App/Models/Pricing'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await Pricing.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        aiModelId: 1,
        inputReferenceValue: 0.0015,
        inputValue: 0.003,
        outputReferenceValue: 0.002,
        outputValue: 0.004,
      },
      {
        id: 2,
        aiModelId: 2,
        inputReferenceValue: 0.003,
        inputValue: 0.005,
        outputReferenceValue: 0.004,
        outputValue: 0.006,
      },
      {
        id: 3,
        aiModelId: 3,
        inputReferenceValue: 0.03,
        inputValue: 0.05,
        outputReferenceValue: 0.006,
        outputValue: 0.008,
      },
      {
        id: 4,
        aiModelId: 4,
        inputReferenceValue: 0.06,
        inputValue: 0.08,
        outputReferenceValue: 0.12,
        outputValue: 0.15,
      },
      {
        id: 5,
        aiModelId: 5,
        inputReferenceValue: 0.02,
        inputValue: 0.022,
        outputReferenceValue: 0.02,
        outputValue: 0.022,
        variation: '1024x1024',
      },
      {
        id: 6,
        aiModelId: 5,
        inputReferenceValue: 0.018,
        inputValue: 0.02,
        outputReferenceValue: 0.018,
        outputValue: 0.02,
        variation: '512x512',
      },
      {
        id: 7,
        aiModelId: 5,
        inputReferenceValue: 0.016,
        inputValue: 0.018,
        outputReferenceValue: 0.016,
        outputValue: 0.018,
        variation: '256x256',
      },
      {
        id: 8,
        aiModelId: 6,
        inputReferenceValue: 0.02,
        inputValue: 0.02,
        outputReferenceValue: 0.04,
        outputValue: 0.04,
      },
    ])
  }
}
