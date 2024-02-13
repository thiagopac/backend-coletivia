import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Feature from 'App/Models/Feature'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await Feature.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        aiModelId: 1,
        name: 'free-chat',
        suitness: 'chat',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente gentil e solícito"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{},"prompt_context":"","prompt_recent_memories":-1}'
        ),
      },
      {
        id: 2,
        aiModelId: 1,
        name: 'legal-to-informal',
        suitness: 'rewrite',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um advogado que traduz a linguagem jurídica para o cliente"}],"stream":false,"temperature":0.3,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{},"prompt_context":"Reescreva o texto entre aspas que tem termos jurídicos complexos para linguagem simples e acessível","prompt_recent_memories":0}'
        ),
      },
      {
        id: 3,
        aiModelId: 1,
        name: 'informal-to-formal',
        suitness: 'rewrite',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um linguista que reescreve textos de caráter informal para contexto formal"}],"stream":false,"temperature":0.8,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{},"prompt_context":"Reescreva o texto informal entre aspas para contexto formal","prompt_recent_memories":2}'
        ),
      },
      {
        id: 4,
        aiModelId: 5,
        name: 'dalle-free-image-generation',
        suitness: 'image-generation',
        behavior: JSON.parse('{}'),
      },
      {
        id: 5,
        aiModelId: 6,
        name: 'midjourney-free-image-generation',
        suitness: 'image-generation',
        behavior: JSON.parse('{}'),
      },
      {
        id: 6,
        aiModelId: 2,
        name: 'Resumo de documento',
        suitness: 'summarization',
        behavior: JSON.parse(
          '{"stream":false,"messages":[{"role":"system","content":"Você é um assistente que analisa uma grande quantidade de páginas de documentos e os reescreve."}],"logit_bias":{},"temperature":0.5,"prompt_context":"Reescreva o texto de maneira expandida. O resultado deve conter todos os tópicos importantes que foram desenvolvidos no texto original. Não introduza novas informações que não estejam presentes no texto original. Evite usar expressões como  `o texto`, `o resumo`, etc, ou outras expressões sobre a abordagem do texto original, apenas reescreva o texto. Ao final, crie uma lista com no mínimo 10 palavras-chave do texto original. Não faça conclusões. Texto: ","presence_penalty":0,"prompt_synthesis":"Elabore um texto expandido resultante dos seguintes parágrafos, sem perder o contexto original. Por favor, tome o cuidado para não introduzir novas informações que não estejam presentes nos parágrafos. Parágrafos: ","frequency_penalty":0}'
        ),
      },
      {
        id: 7,
        aiModelId: 2,
        name: 'Análise de Edital de Licitação 1',
        suitness: 'summarization',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito, que analisa uma grande quantidade de páginas de um documento e responde de maneira objetiva e clara."}],"stream":false,"temperature":0.5,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{},"prompt_context":"Sintetize o texto a seguir sem perder o contexto original. A síntese deve conter todos os tópicos importantes que foram trabalhados no texto original. Não introduza novas informações que não estejam presentes no texto original. Ao final da síntese, crie uma lista com no mínimo 10 palavras-chave do texto original. Texto: ","prompt_synthesis":"Elabore um texto resultante dos seguintes parágrafos, sem perder o contexto original. Por favor, tome o cuidado para não introduzir novas informações que não estejam presentes nos parágrafos. Parágrafos: "}'
        ),
      },
      {
        id: 8,
        aiModelId: 1,
        name: 'Post de Instagram - Texto',
        suitness: 'language-generation',
        behavior: JSON.parse(
          '{"stream":false,"messages":[{"role":"system","content":"Você é um especialista em marketing"}],"logit_bias":{},"temperature":0.8,"prompt_image":"Sugira uma frase para gerar uma imagem para esta postagem. A frase deve ser detalhista quanto aos elementos da imagem, como iluminação, cores, ambiente e tipo de ilustração que será utilizado, ele deve ser curto. Não seja vago, não seja emotivo, faça uma síntese fria e objetiva. Evite emojis. Evite usar o nome da empresa. Evite pedir textos. Evite conceitos abstratos. Evite emojis. Evite enunciar a sua resposta com coisas como: imagem sugerida, imagem, etc, só responda de forma simples e curta.","prompt_context":"Crie um post para Instagram a partir da seguinte sugestão. Sugestão: ","presence_penalty":0,"frequency_penalty":0}'
        ),
      },
      {
        id: 9,
        aiModelId: 6,
        name: 'Post de Instagram - Imagem',
        suitness: 'language-generation',
        behavior: JSON.parse('{}'),
      },
    ])
  }
}
