import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pricings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').unique()
      table.integer('ai_model_id').notNullable().unsigned().references('id').inTable('ai_models')
      table.decimal('input_reference_value', 12, 7).notNullable().defaultTo(0)
      table.decimal('input_value', 12, 7).notNullable().defaultTo(0)
      table.decimal('output_reference_value', 12, 7).notNullable().defaultTo(0)
      table.decimal('output_value', 12, 7).notNullable().defaultTo(0)
      table.string('variation').nullable().defaultTo(null)
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
