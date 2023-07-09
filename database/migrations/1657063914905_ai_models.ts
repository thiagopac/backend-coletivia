import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ai_models'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.string('name').notNullable()
      table.string('release').nullable()
      table.enum('type', ['text', 'image', 'audio']).notNullable()
      table.integer('context_length').nullable()
      table.boolean('is_available').defaultTo(0)
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
