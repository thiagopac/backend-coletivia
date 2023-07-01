import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'open_ai_image_generations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table
        .integer('open_ai_model_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('open_ai_models')
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('size').notNullable()
      table.json('behavior').notNullable()
      table.json('images').notNullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
// manter tipos de geração de imagens em string até que seja possível criar um enum
