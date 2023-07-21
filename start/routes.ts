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

    Route.get('generative-text/test-buffer', 'GenerativeAITextController.testBuffer')
    Route.get('generative-text/stream-random-text', 'GenerativeAITextController.streamRandomText')

    Route.get('tests/text-to-stream', 'TestController.getTextInChunks')

    Route.get('policy/:type', 'PolicyController.retrieve')

    Route.group(() => {
      Route.post('pix', 'RechargeController.updateRecharge')
    }).prefix('/webhook')

    Route.group(() => {
      Route.get('fetch-currency-rate-usd-brl', 'CurrencyRateController.fetchUsdBrl')
    }).prefix('/scheduled')
  })

  //user-authenticated routes
  Route.group(() => {
    Route.group(() => {
      Route.post('logout', 'AuthController.logout')
      Route.get('me', 'AuthController.me')
    }).prefix('/auth')

    Route.group(() => {
      Route.patch('change-password', 'UsersController.changePassword')
      Route.patch('info/update', 'UsersController.updateInfo')
      Route.get('balance/retrieve', 'BalanceController.retrieve')
    }).prefix('/user')

    Route.group(() => {
      Route.get('states', 'LocationController.states')
      Route.get('cities/:state', 'LocationController.cities') // :param = id || abbr
    }).prefix('/location')

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
      Route.get('list/:type', 'ChatController.list')
      Route.get(':uuid', 'ChatController.retrieveChat')
      Route.get(':uuid/messages', 'ChatController.messages')

      Route.post('send-messages', 'ChatController.createMessage')
      // Route.post('send-messages', 'GenerativeAITextController.fakeStream')
      // Route.post('send-messages', 'GenerativeAITextController.streamRandomText')
      Route.post('continue', 'GenerativeAITextController.streamRandomText')

      Route.post('send-messages-single', 'ChatController.createMessageSingle')
      Route.patch(':uuid/rename', 'ChatController.renameChat')
      Route.delete(':uuid/delete', 'ChatController.deleteChat')
    }).prefix('/chat')

    Route.group(() => {
      Route.get('list', 'FeatureController.list')
      Route.get(
        'list-for-document/:document',
        'FeatureController.listFeaturesForDocumentWithAnalyses'
      )
    }).prefix('feature')

    Route.group(() => {
      Route.post('create-document-free', 'DocumentController.createDocument')
      Route.post('send-messages-single', 'DocumentController.createMessageSingle')
      Route.get('list', 'DocumentController.list')
      Route.get(':uuid', 'DocumentController.retrieveDocument')
      Route.post('send-document-file', 'DocumentController.sendDocumentFile')
      Route.delete(':uuid/delete', 'DocumentController.deleteDocument')

      Route.group(() => {
        Route.post('analyze', 'DocumentAnalysisController.createDocumentAnalysis')
        Route.get('list', 'DocumentAnalysisController.list')
        Route.get(':uuid', 'DocumentAnalysisController.retrieveDocumentAnalysis')
        Route.delete(':uuid/delete', 'DocumentAnalysisController.deleteDocumentAnalysis')
      }).prefix('analysis')
    }).prefix('/document')

    Route.group(() => {
      Route.group(() => {
        Route.post('create-image-free', 'DalleImageController.createImageGeneration')
        // Route.post('create-image-free', 'DalleImageController.fakeImageGeneration')
        Route.get('list', 'DalleImageController.list')
      }).prefix('dalle')
      Route.group(() => {
        Route.post('create-image-free', 'UnofficialMidjourneyImageController.createImageGeneration')
        Route.post('create-variation', 'UnofficialMidjourneyImageController.createVariation')
        Route.post('create-upscale', 'UnofficialMidjourneyImageController.createUpscale')
        Route.get('list', 'UnofficialMidjourneyImageController.list')
        Route.get('retrieve/:uuid', 'UnofficialMidjourneyImageController.retrieveGeneration')
      }).prefix('midjourney')
    }).prefix('image')

    Route.group(() => {
      Route.post('create-post', 'InstagramPostController.createInstagramPost')
      Route.post('generate-text', 'InstagramPostController.generateTextPost')
      Route.post('generate-text-imagine', 'InstagramPostController.generateTextImagine')
      Route.post('generate-image', 'InstagramPostController.generateImagePost')
      Route.post('upscale-image', 'InstagramPostController.upscaleImage')
      Route.get('list', 'InstagramPostController.list')
      Route.get('retrieve/:uuid', 'InstagramPostController.retrievePost')
      Route.delete(':uuid/delete', 'InstagramPostController.deletePost')
      Route.post('translate', 'InstagramPostController.translate')
    }).prefix('instagram')

    Route.group(() => {
      Route.get('list', 'OperationController.list')
      Route.post('recharge', 'OperationController.createRechargeOperation')
    }).prefix('/operation')

    Route.group(() => {
      Route.get('list', 'RechargeController.list')
      Route.get('options', 'RechargeController.listOptions')
      Route.post('checkout', 'RechargeController.createRecharge')
      Route.get('retrieve/:uuid', 'RechargeController.retrieve')
    }).prefix('/recharge')

    Route.group(() => {
      Route.get('list/:type', 'NotificationController.list')
      Route.post('mark-as-read', 'NotificationController.markAsRead')
      Route.post('mark-as-unread', 'NotificationController.markAsUnread')
      Route.post('mark-all-as-read', 'NotificationController.markAllAsRead')
    }).prefix('/notification')
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
