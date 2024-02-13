import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import City from 'App/Models/City'
import State from 'App/Models/State'

export default class LocationController {
  public async states({ response }: HttpContextContract) {
    try {
      const states = await State.query().where('is_available', true).orderBy('name', 'asc')
      return states
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  public async cities({ params, response }: HttpContextContract) {
    try {
      const column = isNaN(params.state) ? 'state_letter' : 'state_id' //accepts state_id or state_letter as param
      const cities = await City.query()
        .where(column, params.state)
        .where('is_available', true)
        .orderBy('class', 'asc')
        .orderBy('name', 'asc')

      if (cities.length === 0) {
        throw new Error('Nenhuma cidade encontrada para o estado fornecido.')
      }

      return cities
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }
}
