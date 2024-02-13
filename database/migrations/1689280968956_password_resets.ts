import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'password_resets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('email').notNullable()
      table.uuid('token').unique().notNullable()
      table.timestamp('created_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

// TODO: ao chamarem o endpoint forgot-password, criar registro de password reset e enviar email com link para resetar a senha
// o link deve conter o token gerado no registro de password reset e o email do usuário, o registro de password reset deve ser deletado após o reset da senha
// a validade do reset de senha deve ser de apenas 30 minutos
