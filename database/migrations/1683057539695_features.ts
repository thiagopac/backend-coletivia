import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'features'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('uuid').notNullable().unique()
      table.integer('ai_model_id').notNullable().unsigned().references('id').inTable('ai_models')
      table.string('name').notNullable()
      table.string('suitness').notNullable()
      table.json('behavior').notNullable()
      table.timestamps()
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

/**
Suitness values:

'chat',
'rewrite',
'translation',
'summarization',
'named-entity-recognition',
'sentiment-analysis',
'speech-recognition',
'speech-synthesis',
'question-answering',
'language-generation',
'text-classification',
'image-generation',
'image-recognition',
'object-detection',
'style-transfer',
'anomaly-detection',
'time-series-forecasting',
'reinforcement-learning',
'recommender-systems',

Chat: Include models suitable for conversational interactions with users.
Rewrite: Models capable of rewriting text with different styles, tones, and voices.
Translation: Specify models that are suitable for language translation tasks.
Summarization: Identify models that excel in generating concise summaries of text.
Sentiment Analysis: Indicate models capable of analyzing and determining the sentiment expressed in text.
Named Entity Recognition (NER): Include models specialized in identifying and extracting named entities from text.
Speech Recognition: Specify models designed for converting spoken language into written text.
Speech Synthesis: Identify models that can generate realistic speech from text inputs.
Question Answering: Include models that excel in providing accurate answers to questions based on given contexts.
Language Generation: Specify models capable of generating coherent and contextually relevant text.
Text Classification: Indicate models suitable for classifying text into predefined categories or labels.
Image Generation: Generative image models.
Image Recognition: Include models specialized in recognizing and classifying objects or features within images.
Object Detection: Specify models that can identify and localize multiple objects within an image.
Style Transfer: Include models that can transfer the artistic style of one image onto another.
Anomaly Detection: Specify models capable of identifying unusual patterns or outliers within data.
Time Series Forecasting: Indicate models suitable for predicting future values or trends based on historical data.
Reinforcement Learning: Include models designed to learn optimal behaviors through interaction with an environment.
Recommender Systems: Specify models specialized in providing personalized recommendations based on user preferences and behavior.
*/
