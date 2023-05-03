import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'open_ai_chat_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table
        .integer('open_ai_chat_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('open_ai_chats')
        .onDelete('CASCADE')
      table.json('messages').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
