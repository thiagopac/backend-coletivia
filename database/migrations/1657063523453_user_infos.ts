import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'user_infos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('first_name', 255)
      table.string('last_name', 255)
      table.string('phone').nullable()
      table.enum('registration_type', ['PF', 'PJ']).notNullable()
      table.string('cpf_cnpj').notNullable()
      table.integer('city_id').nullable().unsigned().references('id').inTable('cities')
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
