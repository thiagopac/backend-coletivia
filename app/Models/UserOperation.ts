import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { v4 as uuidv4 } from 'uuid'
import Pricing from 'App/Models/Pricing'
import CurrencyRate from 'App/Models/CurrencyRate'
import UserBalance from 'App/Models/UserBalance'

export default class UserOperation extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public pricingId: number

  @column()
  public type: string

  @column()
  public value: number

  @column()
  public currentBalance: number

  @column()
  public usdBrlRate: number

  @column()
  public subjectType: string

  @column()
  public subjectId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => User, { foreignKey: 'userId' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Pricing, { foreignKey: 'pricingId' })
  public price: BelongsTo<typeof Pricing>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(userOperation: UserOperation) {
    userOperation.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createOperationRecharge(
    user: User,
    value: number,
    rechargeId: number
  ): Promise<UserOperation> {
    try {
      await user?.load('balance')

      let operation = new UserOperation()
      operation.userId = user!.id
      operation.type = 'recharge'
      operation.value = value
      operation.currentBalance = Number(user!.balance.currentBalance) + Number(value)
      operation.subjectType = 'recharges'
      operation.subjectId = rechargeId

      //atualizar o balanço com o valor final
      user!.balance.currentBalance = operation.currentBalance
      await user!.balance.save()
      await operation.save()

      return operation
    } catch (error) {
      throw new Error(error)
    }
  }

  public static async createOperationSpending(
    user: User,
    value: number,
    modelPricingId: number,
    subjectType: string,
    subjectId: number
  ): Promise<UserOperation> {
    try {
      const convertedValueUsdToBrl = await CurrencyRate.convertUsdToBrl(value)
      const usdBrlRateCurrent = await CurrencyRate.latestRateUsdtoBrl()
      const balance = await UserBalance.findByOrFail('userId', user!.id)

      if (balance.currentBalance < value) {
        throw new Error('Saldo insuficiente para operação')
      }

      let operation = new UserOperation()
      operation.userId = user!.id
      operation.pricingId = modelPricingId
      operation.type = 'spending'
      operation.value = convertedValueUsdToBrl
      operation.usdBrlRate = usdBrlRateCurrent
      operation.currentBalance = Number(balance.currentBalance) - Number(convertedValueUsdToBrl)
      operation.subjectType = subjectType
      operation.subjectId = subjectId
      await operation.save()

      //atualizar o balanço com o valor final
      balance.currentBalance = Number(balance.currentBalance) - Number(convertedValueUsdToBrl)
      await balance.save()

      return operation
    } catch (error) {
      throw new Error(error)
    }
  }
}
