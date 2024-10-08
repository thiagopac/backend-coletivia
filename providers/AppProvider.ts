import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { banner } from '../banner'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    console.log(banner)
  }

  public async ready() {
    // App is ready
    if (this.app.environment === 'web') {
      console.log('initializing socket.io')
      await import('../start/socket')
    }
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
