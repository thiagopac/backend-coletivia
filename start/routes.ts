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

Route.group(() => {
  //non-authenticated routes
  Route.group(() => {
    Route.post('auth/register', 'AuthController.register')
    Route.post('auth/login', 'AuthController.login')
    Route.post('admin-auth/login', 'AdminAuthController.login')

    Route.post('generative-text/fake-stream', 'GenerativeAITextController.fakeStream')
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
      Route.post('prompt-single', 'GenerativeAITextController.promptSingle')
      Route.post('prompt-stream', 'GenerativeAITextController.promptStream')
    }).prefix('/generative-text')

    Route.group(() => {
      Route.get('list', 'CurrencyRateController.list')
    }).prefix('/currency-rate')

    Route.group(() => {
      Route.get('list', 'AiModelController.list')
      Route.get('list/:type', 'AiModelController.listForType')
    }).prefix('/ai-model')

    Route.group(() => {
      Route.post('create-chat-free', 'ChatController.createChatFree')
      Route.post('create-chat-legal-to-informal', 'ChatController.createChatLegalToInformal')
      Route.post('create-chat-informal-to-formal', 'ChatController.createChatInformalToFormal')
      Route.get('list', 'ChatController.list')
      Route.get(':uuid', 'ChatController.retrieveChat')
      Route.get(':uuid/messages', 'ChatController.messages')
      Route.post('send-messages', 'ChatController.createMessage')
      Route.post('send-messages-single', 'ChatController.createMessageSingle')
      Route.get('test-buffer', 'ChatController.testBuffer')
      Route.patch(':uuid/rename', 'ChatController.renameChat')
      Route.delete(':uuid/delete', 'ChatController.deleteChat')
    }).prefix('/chat')

    Route.group(() => {
      Route.post('create-image-free', 'ImageController.createImageGeneration')
      // Route.post('create-image-free', 'ImageController.fakeImageGeneration')
      Route.get('list', 'ImageController.list')
    }).prefix('image')

    Route.group(() => {
      Route.get('list', 'OperationController.list')

      Route.group(() => {
        Route.post('pix', 'OperationController.rechargePix') // simulação de pix
      }).prefix('/payment')
    }).prefix('/operation')
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
    Route.group(() => {
      Route.get('fetch-currency-rate-usd-brl', 'CurrencyRateController.fetchUsdBrl')
    }).prefix('/scheduled')
  }).middleware('auth:admin')
}).prefix('/api')
