import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import { v4 as uuidv4 } from 'uuid'
import RechargeOption from 'App/Models/RechargeOption'

export default class Recharge extends BaseModel {
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
  public rechargeOptionId: number

  @column()
  public status: string

  @column({ serializeAs: null })
  public additionalData: JSON

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

  @belongsTo(() => RechargeOption, { foreignKey: 'rechargeOptionId' })
  public rechargeOption: BelongsTo<typeof RechargeOption>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeCreate()
  public static generateUUID(writing: Recharge) {
    writing.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static async createRecharge(
    user: User,
    rechargeOption: RechargeOption,
    additionalData?: any
  ): Promise<Recharge> {
    try {
      const recharge = await Recharge.create({
        userId: user.id,
        rechargeOptionId: rechargeOption.id,
        status: 'pending',
        additionalData: additionalData,
      })

      if (!recharge) throw new Error('Erro ao ao criar registro de recarga')

      return recharge
    } catch (error) {
      return error.message
    }
  }

  public static async getRechargeWith(field: string, value: any): Promise<Recharge> {
    try {
      const recharge = await Recharge.query()
        .preload('user')
        .preload('rechargeOption')
        .where(field, value)
        .firstOrFail()
      if (!recharge) throw new Error('Recarga não encontrada')

      return recharge
    } catch (error) {
      throw new Error(error)
    }
  }
}
