import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuidv4 } from 'uuid'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm'
import UserInfo from './UserInfo'
import OpenAiChat from 'App/Models/OpenAiChat'
import UserBalance from 'App/Models/UserBalance'
import UserOperation from 'App/Models/UserOperation'
import DalleAiImageGeneration from 'App/Models/DalleAiImageGeneration'
import AiDocument from 'App/Models/AiDocument'
import InstagramPost from 'App/Models/InstagramPost'
import Recharge from 'App/Models/Recharge'

export default class User extends BaseModel {
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
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: has one ::::::::::::::::::::::: */

  @hasOne(() => UserInfo, { localKey: 'id' })
  public info: HasOne<typeof UserInfo>

  @hasOne(() => UserBalance, { localKey: 'id' })
  public balance: HasOne<typeof UserBalance>

  /* :::::::::::::::::::: has many :::::::::::::::::::::: */

  @hasMany(() => OpenAiChat, { localKey: 'id' })
  public chats: HasMany<typeof OpenAiChat>

  @hasMany(() => AiDocument, { localKey: 'id' })
  public documents: HasMany<typeof AiDocument>

  @hasMany(() => DalleAiImageGeneration, { localKey: 'id' })
  public imageGenerations: HasMany<typeof DalleAiImageGeneration>

  @hasMany(() => UserOperation, { localKey: 'id' })
  public operations: HasMany<typeof UserOperation>

  @hasMany(() => InstagramPost, { localKey: 'id' })
  public instagramPosts: HasMany<typeof InstagramPost>

  @hasMany(() => Recharge, { localKey: 'id' })
  public recharges: HasMany<typeof Recharge>

  /*
  |--------------------------------------------------------------------------
  | Hooks
  |--------------------------------------------------------------------------
  */

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @beforeCreate()
  public static generateUUID(user: User) {
    user.uuid = uuidv4()
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */
}
