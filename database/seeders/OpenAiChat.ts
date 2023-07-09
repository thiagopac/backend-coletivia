import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiChat from 'App/Models/OpenAiChat'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiChat.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        featureId: 1,
        userId: 1,
        title: 'Idade do universo',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Quais são as frutas da estação atual?"},{"role":"assistant","content":"As frutas da estação atual podem variar de acordo com a região, mas em geral incluem abacaxi, banana, caju, kiwi, laranja, maçã, manga, maracujá e uva."},{"role":"user","content":"Qual é a importância de consumir frutas da estação?"},{"role":"assistant","content":"Consumir frutas da estação é importante porque elas são mais frescas, têm um sabor mais intenso e são mais nutritivas. Além disso, o consumo de frutas da estação ajuda a valorizar a produção local e a reduzir o impacto ambiental causado pelo transporte de frutas de outras regiões."},{"role":"user","content":"Qual a melhor forma de escolher frutas da estação?"},{"role":"assistant","content":"Para escolher frutas da estação, é importante observar a aparência, o cheiro e a textura das frutas. Escolha frutas que estejam firmes e sem manchas, com uma fragrância agradável e um toque macio. Além disso, verifique se a fruta está madura e pronta para ser consumida."},{"role":"user","content":"Quais são os benefícios de consumir frutas?"},{"role":"assistant","content":"Consumir frutas traz inúmeros benefícios para a saúde, como fornecer vitaminas, minerais e fibras para o organismo, ajudar na digestão, fortalecer o sistema imunológico e prevenir doenças crônicas, como diabetes e doenças cardíacas."},{"role":"user","content":"Qual a melhor forma de armazenar frutas?"},{"role":"assistant","content":"A melhor forma de armazenar frutas é em um local fresco e arejado, longe da luz direta do sol. Algumas frutas, como maçãs e bananas, podem acelerar o amadurecimento de outras frutas, portanto é importante armazená-las separadamente. Frutas que já estejam maduras devem ser consumidas imediatamente ou armazenadas na geladeira."},{"role":"user","content":"Quais são as frutas mais comuns no verão?"},{"role":"assistant","content":"As frutas mais comuns no verão podem variar de acordo com a região, mas em geral incluem abacaxi, melancia, morango, pêssego e uva."},{"role":"user","content":"Qual a melhor forma de incluir frutas na minha alimentação?"},{"role":"assistant","content":"A melhor forma de incluir frutas na alimentação é consumi-las como lanches entre as refeições ou como sobremesas saudáveis. Também é possível incluir frutas em saladas, smoothies, bolos e outras receitas"}]}'
        ),
      },
      {
        id: 2,
        featureId: 1,
        userId: 1,
        title: 'Fundamentos da programação',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"O que é programação?"},{"role":"assistant","content":"Programação é o processo de criação de um software por meio da escrita de códigos em uma linguagem de programação."},{"role":"user","content":"Qual a importância da programação nos dias atuais?"},{"role":"assistant","content":"A programação é uma habilidade muito valorizada atualmente, já que é utilizada em praticamente todas as áreas da sociedade, desde a criação de softwares até o desenvolvimento de soluções tecnológicas para empresas."},{"role":"user","content":"O que são algoritmos?"},{"role":"assistant","content":"Algoritmos são uma sequência lógica de instruções que buscam resolver um problema ou executar uma tarefa específica."},{"role":"user","content":"O que é uma variável?"},{"role":"assistant","content":"Uma variável é um espaço na memória do computador que armazena um valor ou uma referência a um valor."},{"role":"user","content":"O que é uma função?"},{"role":"assistant","content":"Uma função é um bloco de código que pode ser executado várias vezes a partir de diferentes partes do programa, e pode receber e retornar valores."},{"role":"user","content":"O que é orientação a objetos?"},{"role":"assistant","content":"Orientação a objetos é um paradigma de programação que busca modelar o mundo real por meio de objetos, que possuem características e comportamentos específicos."},{"role":"user","content":"O que é herança?"},{"role":"assistant","content":"Herança é um conceito da orientação a objetos que permite que uma classe herde os atributos e métodos de outra classe, possibilitando a reutilização de código."}]}'
        ),
      },
      {
        id: 3,
        featureId: 1,
        userId: 1,
        title: 'Receita de bolo',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Qual a receita básica de bolo?"},{"role":"assistant","content":"A receita básica de bolo leva farinha de trigo, açúcar, ovos, leite e fermento em pó."},{"role":"user","content":"Qual a função de cada ingrediente na receita de bolo?"},{"role":"assistant","content":"A farinha de trigo é a base do bolo, o açúcar serve para adoçar, os ovos ajudam a dar liga, o leite deixa a massa mais macia e o fermento em pó é responsável por fazer o bolo crescer."},{"role":"user","content":"Como preparar a massa do bolo?"},{"role":"assistant","content":"Para preparar a massa do bolo, misture os ingredientes secos em uma tigela (farinha, açúcar e fermento) e os ingredientes líquidos em outra tigela (ovos e leite). Em seguida, misture os dois preparos até obter uma massa homogênea."},{"role":"user","content":"Qual o tempo e a temperatura de cozimento do bolo?"},{"role":"assistant","content":"O tempo e a temperatura de cozimento podem variar de acordo com o tipo de bolo e o forno utilizado, mas em geral a temperatura varia entre 180ºC e 200ºC e o tempo de cozimento varia entre 30 e 40 minutos."},{"role":"user","content":"Qual o ponto ideal do bolo?"},{"role":"assistant","content":"O ponto ideal do bolo é quando ele está dourado por cima e ao espetar um palito no centro, ele sai limpo."},{"role":"user","content":"Qual a cobertura mais comum para bolo?"},{"role":"assistant","content":"A cobertura mais comum para bolo é a de chocolate, que leva chocolate em barra derretido, leite e açúcar."}]}'
        ),
      },
    ])
  }
}
