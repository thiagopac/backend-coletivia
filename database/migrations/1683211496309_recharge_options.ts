import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'recharge_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.enum('type', ['pix', 'credito']).notNullable()
      table.string('label').nullable()
      table.string('description').nullable()
      table.decimal('debited_value', 12, 7).notNullable().defaultTo(0)
      table.decimal('credited_value', 12, 7).notNullable().defaultTo(0)
      table.string('observations').nullable()
      table.boolean('is_available').defaultTo(0)
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
