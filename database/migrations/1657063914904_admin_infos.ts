import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'admin_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table
        .integer('admin_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('admins')
        .onDelete('CASCADE')
      table.string('first_name', 255)
      table.string('last_name', 255)
      table.string('phone').nullable()
      table.integer('city_id').nullable().unsigned().references('id').inTable('cities')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
