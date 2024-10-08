import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).nullable()
      table.string('remember_me_token').nullable()
      table.boolean('social_login').defaultTo(false)
      table.enum('social_service', ['Google']).nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
