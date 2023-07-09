import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
<<<<<<<< HEAD:database/migrations/1683057539696_ai_documents.ts
  protected tableName = 'ai_documents'
========
  protected tableName = 'recharge_types'
>>>>>>>> d740561383fe3e40c6924862d2905938ce5ad24c:database/migrations/1683211496309_recharge_types.ts

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
<<<<<<<< HEAD:database/migrations/1683057539696_ai_documents.ts
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('extension').notNullable()
      table.string('title').notNullable()
      table.json('content').notNullable()
========
      table.string('name').notNullable()
      table.boolean('is_available').defaultTo(0)
>>>>>>>> d740561383fe3e40c6924862d2905938ce5ad24c:database/migrations/1683211496309_recharge_types.ts
      table.timestamps()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
