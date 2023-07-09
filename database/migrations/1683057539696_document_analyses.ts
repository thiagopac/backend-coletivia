import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'document_analyses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.integer('feature_id').notNullable().unsigned().references('id').inTable('features')
      table
        .integer('ai_document_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('ai_documents')
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.json('behavior').notNullable()
      table.json('content').notNullable()
      table.json('messages').notNullable()
      table.timestamps()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
