import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admin_api_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('admin_id').unsigned().references('id').inTable('admins')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable()
      table.string('expires_at').nullable()
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
