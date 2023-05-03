import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('state_id').unsigned().references('id').inTable('states')
      table.string('lat')
      table.string('lon')
      table.string('name')
      table.string('class')
      table.string('state_letter', 2)
      table.boolean('is_available').defaultTo(0)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
