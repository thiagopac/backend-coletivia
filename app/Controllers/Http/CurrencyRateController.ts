import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CurrencyRate from 'App/Models/CurrencyRate'

export default class CurrencyRateController {
  public async list({ response }: HttpContextContract) {
    try {
      const currencyRates = await CurrencyRate.all()
      if (!currencyRates || currencyRates.length === 0) {
        return response.status(404).send({
          error: 'Nenhum rate de moeda encontrado',
        })
      }

      return currencyRates
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }

  public async fetchUsdBrl({ response }: HttpContextContract) {
    try {
      const currencyRate = await CurrencyRate.createCurrencyRateUsdtoBrl()
      return currencyRate
    } catch (error) {
      return response.status(400).send({
        error: error.message,
      })
    }
  }
}
