import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_operations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique()
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('pricing_id').nullable().unsigned().references('id').inTable('pricings')
      table.enum('type', ['recharge', 'spending']).notNullable()
      table.decimal('value', 12, 7).notNullable().defaultTo(0)
      table.decimal('usd_brl_rate', 4, 2).nullable().defaultTo(null)
      table.decimal('current_balance', 12, 7).notNullable().defaultTo(0)
      table.string('subject_type').nullable()
      table.integer('subject_id').nullable()
      table.json('additional_data').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
