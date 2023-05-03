import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import State from './State'

export default class City extends BaseModel {
  /*
  |--------------------------------------------------------------------------
  | Columns
  |--------------------------------------------------------------------------
  */

  @column({ isPrimary: true })
  public id: number

  @column()
  public stateId: number

  @column()
  public lat: string

  @column()
  public lon: string

  @column()
  public name: string

  @column()
  public class: string

  @column()
  public stateLetter: string

  @column()
  public isAvailable: boolean

  /*
  |--------------------------------------------------------------------------
  | Relations
  |--------------------------------------------------------------------------
  */

  /* :::::::::::::::::::: belongs to :::::::::::::::::::: */

  @belongsTo(() => State, { foreignKey: 'stateId' })
  public state: BelongsTo<typeof State>
}
