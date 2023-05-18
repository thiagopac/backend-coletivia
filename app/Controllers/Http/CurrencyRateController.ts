import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CurrencyRate from 'App/Models/CurrencyRate'

export default class CurrencyRateController {
  public async list({ response }: HttpContextContract) {
    try {
      return CurrencyRate.all()
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async fetchUsdBrl({ response }: HttpContextContract) {
    try {
      const currencyRate = await CurrencyRate.createCurrencyRateUsdtoBrl()
      return currencyRate
    } catch (error) {
      return response.badRequest(error.message)
    }
  }
}
