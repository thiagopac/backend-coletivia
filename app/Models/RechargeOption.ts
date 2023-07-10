import Recharge from 'App/Models/Recharge'
import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeCreate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Pricing from 'App/Models/Pricing'

export default class RechargeOption extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public uuid: string

  @column()
  public type: string

  @column()
  public label: string

  @column()
  public description: string

  @column()
  public debitedValue: number

  @column()
  public creditedValue: number

  @column()
  public observations: string

  @column()
  public isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(rechargeType: RechargeOption) {
    rechargeType.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => Recharge, { localKey: 'id' })
  public recharges: HasMany<typeof Recharge>

  @hasMany(() => Pricing, { localKey: 'id' })
  public prices: HasMany<typeof Pricing>

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async getRechargeOptionWith(field: string, value: any): Promise<RechargeOption> {
    try {
      const rechargeOption = await RechargeOption.query().where(field, value).firstOrFail()
      if (!rechargeOption) throw new Error('Opção de recarga não encontrada')

      return rechargeOption
    } catch (error) {
      throw new Error(error)
    }
  }
}
