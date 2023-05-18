import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in a environment specified in Seeder
     */
    if (
      (!Seeder.default.environment.includes('development') && Application.inDev) ||
      (!Seeder.default.environment.includes('testing') && Application.inTest) ||
      (!Seeder.default.environment.includes('production') && Application.inProduction)
    ) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  public async run() {
    await this.runSeeder(await import('../Country'))
    await this.runSeeder(await import('../Region'))
    await this.runSeeder(await import('../State'))
    await this.runSeeder(await import('../City'))
    await this.runSeeder(await import('../User'))
    await this.runSeeder(await import('../UserInfo'))
    await this.runSeeder(await import('../Admin'))
    await this.runSeeder(await import('../AdminInfo'))
    await this.runSeeder(await import('../OpenAiModel'))
    await this.runSeeder(await import('../OpenAiChat'))
    await this.runSeeder(await import('../UserBalance'))
    await this.runSeeder(await import('../UserOperation'))
    await this.runSeeder(await import('../Pricing'))
    await this.runSeeder(await import('../UserApiToken')) //para manter token de acesso fixo durante desenvolvimento
    await this.runSeeder(await import('../AdminApiToken')) //para manter token de acesso fixo durante desenvolvimento
    await this.runSeeder(await import('../CurrencyRate'))
    await this.runSeeder(await import('../RechargeType'))
  }
}
