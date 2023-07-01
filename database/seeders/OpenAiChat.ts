import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import OpenAiChat from 'App/Models/OpenAiChat'

export default class UserInfoSeeder extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await OpenAiChat.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        openAiModelId: 1,
        userId: 1,
        type: 'free-chat',
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
        openAiModelId: 1,
        userId: 1,
        type: 'free-chat',
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
        openAiModelId: 1,
        userId: 1,
        type: 'free-chat',
        title: 'Receita de bolo',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Qual a receita básica de bolo?"},{"role":"assistant","content":"A receita básica de bolo leva farinha de trigo, açúcar, ovos, leite e fermento em pó."},{"role":"user","content":"Qual a função de cada ingrediente na receita de bolo?"},{"role":"assistant","content":"A farinha de trigo é a base do bolo, o açúcar serve para adoçar, os ovos ajudam a dar liga, o leite deixa a massa mais macia e o fermento em pó é responsável por fazer o bolo crescer."},{"role":"user","content":"Como preparar a massa do bolo?"},{"role":"assistant","content":"Para preparar a massa do bolo, misture os ingredientes secos em uma tigela (farinha, açúcar e fermento) e os ingredientes líquidos em outra tigela (ovos e leite). Em seguida, misture os dois preparos até obter uma massa homogênea."},{"role":"user","content":"Qual o tempo e a temperatura de cozimento do bolo?"},{"role":"assistant","content":"O tempo e a temperatura de cozimento podem variar de acordo com o tipo de bolo e o forno utilizado, mas em geral a temperatura varia entre 180ºC e 200ºC e o tempo de cozimento varia entre 30 e 40 minutos."},{"role":"user","content":"Qual o ponto ideal do bolo?"},{"role":"assistant","content":"O ponto ideal do bolo é quando ele está dourado por cima e ao espetar um palito no centro, ele sai limpo."},{"role":"user","content":"Qual a cobertura mais comum para bolo?"},{"role":"assistant","content":"A cobertura mais comum para bolo é a de chocolate, que leva chocolate em barra derretido, leite e açúcar."}]}'
        ),
      },
      {
        id: 4,
        openAiModelId: 1,
        userId: 2,
        type: 'free-chat',
        title: 'Jardinagem básica',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Como escolher as plantas para meu jardim?"},{"role":"assistant","content":"Ao escolher as plantas para o seu jardim, leve em consideração o clima da sua região, o espaço disponível e o tipo de solo. Também é importante escolher plantas que sejam adequadas para a quantidade de luz que o jardim recebe."},{"role":"user","content":"Qual a importância da adubação para as plantas?"},{"role":"assistant","content":"A adubação é importante para fornecer nutrientes essenciais para o desenvolvimento das plantas, como nitrogênio, fósforo e potássio. Além disso, a adubação ajuda a melhorar a qualidade do solo."},{"role":"user","content":"O que é poda e qual a sua importância?"},{"role":"assistant","content":"A poda é o processo de cortar partes das plantas, como galhos, folhas e flores, com o objetivo de controlar o seu crescimento e promover a sua saúde. A poda também ajuda a estimular a produção de flores e frutos."},{"role":"user","content":"Como regar as plantas corretamente?"},{"role":"assistant","content":"Para regar as plantas corretamente, é importante verificar a necessidade de água de cada planta e regá-las na quantidade adequada. Em geral, é melhor regar as plantas pela manhã ou à noite, quando a temperatura está mais amena."},{"role":"user","content":"Como prevenir pragas e doenças nas plantas?"},{"role":"assistant","content":"Para prevenir pragas e doenças nas plantas, é importante manter o jardim limpo e livre de folhas e galhos mortos. Também é recomendado utilizar pesticidas e fungicidas naturais, como óleo de neem e enxofre, e evitar o uso excessivo de fertilizantes químicos."},{"role":"user","content":"Qual a importância da luz solar para as plantas?"},{"role":"assistant","content":"A luz solar é fundamental para a fotossíntese das plantas, processo pelo qual elas produzem o seu próprio alimento. Além disso, a luz solar ajuda a promover o crescimento e a saúde das plantas."},{"role":"user","content":"Como fazer a preparação do solo para o plantio?"},{"role":"assistant","content":"Para preparar o solo para o plantio, é importante retirar todas as raízes, pedras e outros materiais que possam impedir o crescimento das plantas. Em seguida, adicione composto orgânico e, se necessário, areia ou outros materiais para melhorar a drenagem do solo."}]}'
        ),
      },
      {
        id: 5,
        openAiModelId: 1,
        userId: 2,
        type: 'free-chat',
        title: 'Tópicos para aprender Francês',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Quais são os benefícios de aprender francês?"},{"role":"assistant","content":"Aprender francês pode trazer inúmeros benefícios, como ampliar as oportunidades profissionais, facilitar viagens para países francófonos, entender melhor a cultura francesa e aumentar a capacidade cognitiva."},{"role":"user","content":"Qual é a melhor forma de começar a aprender francês?"},{"role":"assistant","content":"A melhor forma de começar a aprender francês é estudando o básico da gramática e do vocabulário, e praticando a conversação desde o início. Além disso, é importante assistir filmes e séries em francês e escutar músicas para se acostumar com o idioma."},{"role":"user","content":"Quais são os principais tópicos que devo aprender para me comunicar em francês?"},{"role":"assistant","content":"Os principais tópicos que você deve aprender para se comunicar em francês incluem cumprimentos, apresentações, expressões de cortesia, vocabulário relacionado a comida e bebida, números, dias da semana e meses do ano, e verbos básicos."},{"role":"user","content":"Como melhorar a minha pronúncia em francês?"},{"role":"assistant","content":"Para melhorar a sua pronúncia em francês, é importante praticar a fala com frequência e se concentrar na pronúncia correta de cada palavra. Também é recomendado escutar a pronúncia de falantes nativos, seja em filmes, séries ou músicas."},{"role":"user","content":"Qual a importância de aprender a gramática francesa?"},{"role":"assistant","content":"Aprender a gramática francesa é fundamental para comunicar-se de forma clara e correta em francês. Além disso, a gramática também ajuda a compreender melhor a estrutura da língua e a expandir o vocabulário."},{"role":"user","content":"Qual a melhor forma de praticar a escrita em francês?"},{"role":"assistant","content":"A melhor forma de praticar a escrita em francês é escrever diariamente, mesmo que seja apenas algumas frases por dia. É importante se concentrar na gramática e na ortografia corretas, e buscar corrigir os próprios erros. Também é recomendado praticar a escrita por meio de conversas por e-mail ou redes sociais."},{"role":"user","content":"Quais são as principais dificuldades ao aprender francês?"},{"role":"assistant","content":"Algumas das principais dificuldades ao aprender francês incluem a complexidade da gramática, a pronúncia difícil para falantes de outras línguas, e a falta de prática na conversação. No entanto, com dedicação e prática, é possível superar essas dificuldades e alcançar a fluência em francês"}]}'
        ),
      },
      {
        id: 6,
        openAiModelId: 1,
        userId: 2,
        type: 'free-chat',
        title: 'Frutas da estação',
        behavior: JSON.parse(
          '{"messages":[{"role":"system","content":"Você é um assistente solícito e gentil"}],"stream":true,"temperature":1,"presence_penalty":0,"frequency_penalty":0,"logit_bias":{}}'
        ),
        messages: JSON.parse(
          '{"messages":[{"role":"user","content":"Quais são as frutas da estação atual?"},{"role":"assistant","content":"As frutas da estação atual podem variar de acordo com a região, mas em geral incluem abacaxi, banana, caju, kiwi, laranja, maçã, manga, maracujá e uva."},{"role":"user","content":"Qual é a importância de consumir frutas da estação?"},{"role":"assistant","content":"Consumir frutas da estação é importante porque elas são mais frescas, têm um sabor mais intenso e são mais nutritivas. Além disso, o consumo de frutas da estação ajuda a valorizar a produção local e a reduzir o impacto ambiental causado pelo transporte de frutas de outras regiões."},{"role":"user","content":"Qual a melhor forma de escolher frutas da estação?"},{"role":"assistant","content":"Para escolher frutas da estação, é importante observar a aparência, o cheiro e a textura das frutas. Escolha frutas que estejam firmes e sem manchas, com uma fragrância agradável e um toque macio. Além disso, verifique se a fruta está madura e pronta para ser consumida."},{"role":"user","content":"Quais são os benefícios de consumir frutas?"},{"role":"assistant","content":"Consumir frutas traz inúmeros benefícios para a saúde, como fornecer vitaminas, minerais e fibras para o organismo, ajudar na digestão, fortalecer o sistema imunológico e prevenir doenças crônicas, como diabetes e doenças cardíacas."},{"role":"user","content":"Qual a melhor forma de armazenar frutas?"},{"role":"assistant","content":"A melhor forma de armazenar frutas é em um local fresco e arejado, longe da luz direta do sol. Algumas frutas, como maçãs e bananas, podem acelerar o amadurecimento de outras frutas, portanto é importante armazená-las separadamente. Frutas que já estejam maduras devem ser consumidas imediatamente ou armazenadas na geladeira."},{"role":"user","content":"Quais são as frutas mais comuns no verão?"},{"role":"assistant","content":"As frutas mais comuns no verão podem variar de acordo com a região, mas em geral incluem abacaxi, melancia, morango, pêssego e uva."},{"role":"user","content":"Qual a melhor forma de incluir frutas na minha alimentação?"},{"role":"assistant","content":"A melhor forma de incluir frutas na alimentação é consumi-las como lanches entre as refeições ou como sobremesas saudáveis. Também é possível incluir frutas em saladas, smoothies, bolos e outras receitas"}]}'
        ),
      },
    ])
  }
}
