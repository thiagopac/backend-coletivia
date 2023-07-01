import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import State from 'App/Models/State'

export default class LocationController {
  public async states({ response }: HttpContextContract) {
    try {
      return await State.query().where('is_available', true).orderBy('name', 'asc')
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async cities({ params, response }: HttpContextContract) {
    try {
      const column = isNaN(params.state) ? 'state_letter' : 'state_id' //accepts state_id or state_letter as param
      return await City.query()
        .where(column, params.state)
        .where('is_available', true)
        .orderBy('class', 'asc')
        .orderBy('name', 'asc')
    } catch (error) {
      return response.notFound(error.message)
    }
  }
}
