import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'states'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('country_id').unsigned().references('id').inTable('countries')
      table.integer('region_id').unsigned().references('id').inTable('regions')
      table.string('name')
      table.string('letter', 2)
      table.tinyint('iso')
      table.boolean('is_available').defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
