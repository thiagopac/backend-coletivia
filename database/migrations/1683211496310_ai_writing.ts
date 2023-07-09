import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ai_writings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.charset('utf8mb4')
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.integer('feature_id').notNullable().unsigned().references('id').inTable('features')
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.json('behavior').notNullable()
      table.text('prompt', 'utf8mb4_unicode_ci').nullable()
      table.text('text', 'utf8mb4_unicode_ci').nullable()
      table.timestamps()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
