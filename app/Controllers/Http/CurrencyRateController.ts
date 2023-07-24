import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CurrencyRate from 'App/Models/CurrencyRate'

export default class CurrencyRateController {
  public async list({ response }: HttpContextContract) {
    try {
      const currencyRates = await CurrencyRate.all()
      if (!currencyRates || currencyRates.length === 0) {
        throw new Error('Nenhum rate de moeda encontrado')
      }

      return currencyRates
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  public async fetchUsdBrl({ response }: HttpContextContract) {
    try {
      const currencyRate = await CurrencyRate.createCurrencyRateUsdtoBrl()
      return currencyRate
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }
}
