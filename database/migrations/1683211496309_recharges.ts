import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recharges'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users')
      table
        .integer('recharge_option_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('recharge_options')
      table.decimal('value', 12, 7).notNullable().defaultTo(0)
      table.enum('status', ['pending', 'received', 'expired']).notNullable().defaultTo('pending')
      table.json('additional_data').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}