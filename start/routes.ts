/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.group(() => {
  //non-authenticated routes
  Route.group(() => {
    Route.post('auth/register', 'AuthController.register')
    Route.post('auth/login', 'AuthController.login')
    Route.post('admin-auth/login', 'AdminAuthController.login')
  })

  //user-authenticated routes
  Route.group(() => {
    Route.group(() => {
      Route.post('logout', 'AuthController.logout')
      Route.get('me', 'AuthController.me')
    }).prefix('/auth')

    Route.group(() => {
      Route.patch('users/change-password', 'UsersController.changePassword')
      Route.patch('users/info/update', 'UsersController.updateInfo')
    }).prefix('/user')

    Route.group(() => {
      Route.get('states', 'LocationController.states')
      Route.get('cities/:state', 'LocationController.cities') // :param = id || abbr
    }).prefix('/location')

    Route.group(() => {
      Route.get('fake-stream', 'GenerativeAITextController.fakeStream')
      Route.post('fake-stream', 'GenerativeAITextController.fakeStream')
      Route.post('prompt-single', 'GenerativeAITextController.promptSingle')
      Route.post('prompt-stream', 'GenerativeAITextController.promptStream')
    }).prefix('/generative-text')

    Route.group(() => {
      Route.get('list', 'ChatController.list')
      Route.get('messages/:uuid', 'ChatController.messages')
    }).prefix('/chat')
  }).middleware('auth:user')

  // admin-authenticated routes
  Route.group(() => {
    Route.group(() => {
      Route.post('logout', 'AdminAuthController.logout')
      Route.get('me', 'AdminAuthController.me')
    }).prefix('/admin-auth')

    Route.group(() => {
      Route.group(() => {
        Route.get('list', 'UsersController.list')
      }).prefix('/user')
      Route.group(() => {
        Route.get('list', 'AdminsController.list')
      }).prefix('/admin')
    }).prefix('/management')
  }).middleware('auth:admin')
}).prefix('/api')
