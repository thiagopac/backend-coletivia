import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

const CC = require('currency-converter-lt')

export default class CurrencyRate extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true })
  public id: number

  @column()
  public from: string

  @column()
  public to: string

  @column()
  public rate: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async latestRateUsdtoBrl(): Promise<number | { error: string }> {
    try {
      const currencyRate = await CurrencyRate.query()
        .where('from', 'USD')
        .where('to', 'BRL')
        .orderBy('id', 'desc')
        .first()

      if (!currencyRate) {
        throw new Error('Erro ao obter taxa de conversão')
      }

      return +currencyRate.rate
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async convertUsdToBrl(value: number): Promise<number | { error: string }> {
    try {
      const latestRate = await CurrencyRate.latestRateUsdtoBrl()

      if (typeof latestRate !== 'number') {
        throw new Error('Erro ao obter taxa de conversão atualizada')
      }

      return +(value * latestRate)
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async createCurrencyRateUsdtoBrl(): Promise<CurrencyRate | { error: string }> {
    try {
      let currencyConverter = new CC({ from: 'USD', to: 'BRL' })
      const usdBrlRate = await currencyConverter.rates()

      let currencyRate = new CurrencyRate()
      currencyRate.from = 'USD'
      currencyRate.to = 'BRL'
      currencyRate.rate = usdBrlRate

      await currencyRate.save()

      return currencyRate
    } catch (error) {
      return { error: error.message }
    }
  }

  public static async createCurrencyRateFromTo(
    from: string,
    to: string
  ): Promise<CurrencyRate | { error: string }> {
    try {
      let currencyConverter = new CC({ from: from.toUpperCase(), to: to.toUpperCase() })
      const rate = await currencyConverter.rates()

      let currencyRate = new CurrencyRate()
      currencyRate.from = from.toUpperCase()
      currencyRate.to = to.toUpperCase()
      currencyRate.rate = rate

      await currencyRate.save()

      return currencyRate
    } catch (error) {
      return { error: error.message }
    }
  }
}
