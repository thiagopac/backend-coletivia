import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Policy from 'App/Models/Policy'

export default class extends BaseSeeder {
  public static environment = ['development', 'testing']

  public async run() {
    const uniqueKey = 'id'

    await Policy.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        type: 'politica-de-privacidade',
        content:
          'Política de Privacidade\n\n' +
          'Esta Política de Privacidade descreve como a plataforma web Coletivia ("nós", "nosso" ou "plataforma") coleta, usa, armazena e divulga informações dos usuários ("você" ou "usuário") ao utilizar os serviços disponíveis em nossa plataforma. A plataforma Coletivia permite a integração de serviços de inteligência artificial, onde os usuários podem interagir com modelos de IA disponíveis. Ao utilizar nossa plataforma, você concorda com a coleta e o uso de suas informações conforme descrito nesta Política de Privacidade.\n\n' +
          '1. Informações coletadas\n\n' +
          '1.1 Informações fornecidas por você: Ao criar uma conta na plataforma Coletivia, podemos coletar informações pessoais, como nome, endereço de e-mail, número de telefone e outras informações de contato. Além disso, podemos coletar informações adicionais quando você interage com os modelos de inteligência artificial disponíveis em nossa plataforma.\n\n' +
          '1.2 Informações coletadas automaticamente: Quando você utiliza nossa plataforma, podemos coletar automaticamente informações sobre sua visita e uso dos serviços, como endereço IP, tipo de navegador, provedor de serviços de Internet, páginas visualizadas, tempo gasto em nosso site e outras informações de registro.\n\n' +
          '2. Uso das informações\n\n' +
          '2.1 Utilização dos serviços: Utilizamos as informações coletadas para fornecer, manter e melhorar os serviços disponíveis em nossa plataforma, incluindo aprimorar a experiência do usuário, personalizar o conteúdo apresentado, desenvolver novos recursos e oferecer suporte ao cliente.\n\n' +
          '2.2 Comunicações: Podemos usar suas informações de contato para enviar comunicações relacionadas à plataforma, como atualizações, notificações de serviço e informações sobre novos recursos. Você pode optar por não receber determinadas comunicações, seguindo as instruções de cancelamento de inscrição fornecidas em tais comunicações.\n\n' +
          '2.3 Análises e pesquisas: Podemos usar informações agregadas e anônimas para realizar análises de dados, pesquisas de mercado e outros estudos com o objetivo de melhorar nossos serviços, entender as tendências de uso e personalizar a plataforma de acordo com as necessidades e preferências dos usuários.\n\n' +
          '2.4 Cumprimento legal: Podemos utilizar ou divulgar suas informações quando acreditarmos, de boa-fé, que tal uso ou divulgação é necessário para cumprir com obrigações legais, regulatórias, responder a processos judiciais, proteger nossos direitos legais ou garantir a segurança de nossos usuários.\n\n' +
          '3. Compartilhamento de informações\n\n' +
          '3.1 Parceiros e provedores de serviços: Podemos compartilhar suas informações com parceiros de negócios e provedores de serviços terceirizados que nos auxiliam na operação da plataforma, fornecendo serviços como análises de dados, hospedagem, processamento de pagamentos, suporte técnico e outras atividades relacionadas.\n\n' +
          '3.2 Consentimento: Podemos compartilhar suas informações com terceiros fora do escopo desta Política de Privacidade se obtivermos seu consentimento explícito para fazê-lo.\n\n' +
          '3.3 Agregação de dados: Podemos compartilhar informações agregadas e anônimas com terceiros para fins de análise de dados, pesquisas de mercado, publicidade ou outros fins comerciais.\n\n' +
          '3.4 Reorganização societária: No caso de fusão, aquisição, venda de ativos ou qualquer outra reorganização societária, suas informações podem ser transferidas como parte dos ativos da plataforma.\n\n' +
          '4. Armazenamento de informações\n\n' +
          'As informações coletadas são armazenadas em servidores seguros localizados em diferentes jurisdições. Adotamos medidas de segurança razoáveis para proteger suas informações contra acesso não autorizado, uso indevido, alteração ou destruição. No entanto, nenhum sistema de transmissão ou armazenamento de dados pode garantir segurança absoluta.\n\n' +
          '5. Cookies e tecnologias similares\n\n' +
          'A plataforma Coletivia utiliza cookies e tecnologias similares para melhorar a experiência do usuário, personalizar o conteúdo, analisar o uso da plataforma e oferecer publicidade direcionada. Você pode controlar o uso de cookies por meio das configurações do seu navegador, mas observe que a desativação de cookies pode afetar a funcionalidade da plataforma.\n\n' +
          '6. Links para sites de terceiros\n\n' +
          'A plataforma Coletivia pode conter links para sites de terceiros. Esta Política de Privacidade se aplica apenas à plataforma Coletivia, e não somos responsáveis pelas práticas de privacidade ou conteúdo de sites de terceiros. Recomendamos que você revise as políticas de privacidade desses sites antes de fornecer suas informações pessoais.\n\n' +
          '7. Retenção de informações\n\n' +
          'Retemos suas informações pelo tempo necessário para fornecer os serviços solicitados e cumprir com nossas obrigações legais, resolver disputas e fazer cumprir nossos termos e condições.\n\n' +
          '8. Seus direitos de privacidade\n\n' +
          'Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas informações pessoais. Se desejar exercer esses direitos ou tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco por meio das informações fornecidas na seção de contato abaixo.\n\n' +
          '9. Alterações nesta Política de Privacidade\n\n' +
          'Podemos atualizar esta Política de Privacidade de tempos em tempos. Recomendamos que você reveja periodicamente esta página para estar ciente de quaisquer alterações. O uso continuado da plataforma após quaisquer alterações nesta Política de Privacidade será considerado como sua aceitação dessas alterações.\n\n' +
          '10. Contato\n\n' +
          'Se você tiver alguma dúvida ou preocupação relacionada a esta Política de Privacidade, entre em contato conosco pelo e-mail contato@coletivia.com.br.\n\n',
      },
      {
        id: 2,
        type: 'termos-de-uso',
        content:
          'Termos de Uso\n\n' +
          'Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma web Coletivia ("Plataforma"), doravante referida como "nós", "nosso" ou "Coletivia". Ao acessar ou usar a Plataforma, você concorda em cumprir estes Termos.\n' +
          '\n' +
          '1. Aceitação dos Termos\n' +
          '1.1. Ao acessar a Plataforma, você reconhece ter lido, entendido e concordado com estes Termos, bem como com nossa Política de Privacidade.\n' +
          '1.2. Se você não concordar com estes Termos, não poderá acessar ou usar a Plataforma.\n' +
          '\n' +
          '2. Descrição da Plataforma\n' +
          '2.1. A Coletivia é uma plataforma que oferece serviços de integração de serviços de inteligência artificial.\n' +
          '2.2. Através da Plataforma, os usuários podem interagir com os modelos de inteligência artificial disponíveis.\n' +
          '\n' +
          '3. Uso da Plataforma\n' +
          '3.1. Você concorda em usar a Plataforma somente para fins legais, éticos e de acordo com estes Termos e a legislação aplicável.\n' +
          '3.2. Você não deve usar a Plataforma para:\n' +
          ' a) Violar qualquer lei, regulamento ou direito de terceiros;\n' +
          ' b) Interferir com o funcionamento adequado da Plataforma;\n' +
          ' c) Enviar ou transmitir qualquer conteúdo ilegal, difamatório, obsceno, ofensivo ou de qualquer forma inadequado;\n' +
          ' d) Tentar contornar ou violar qualquer medida de segurança ou autenticação da Plataforma;\n' +
          ' e) Realizar qualquer atividade que possa sobrecarregar, prejudicar ou comprometer a infraestrutura da Plataforma.\n' +
          '\n' +
          '4. Conta do Usuário\n' +
          '4.1. Para acessar certos recursos da Plataforma, você poderá precisar criar uma conta de usuário.\n' +
          '4.2. Ao criar uma conta, você concorda em fornecer informações precisas, completas e atualizadas.\n' +
          '4.3. Você é responsável por manter a confidencialidade de suas informações de login e por todas as atividades que ocorrerem em sua conta.\n' +
          '4.4. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta ou qualquer violação de segurança.\n' +
          '4.5. Reservamo-nos o direito de suspender, desativar ou encerrar sua conta, a nosso critério, caso haja violação destes Termos.\n' +
          '\n' +
          '5. Propriedade Intelectual\n' +
          '5.1. A Plataforma, incluindo todo o seu conteúdo e recursos, é protegida por direitos autorais, marcas registradas e outras leis de propriedade intelectual.\n' +
          '5.2. Você concorda em não copiar, modificar, distribuir, transmitir, exibir, vender, licenciar ou explorar comercialmente qualquer parte da Plataforma sem a autorização prévia por escrito da Coletivia.\n' +
          '\n' +
          '6. Privacidade e Proteção de Dados\n' +
          '6.1. A Coletivia valoriza a privacidade dos usuários e está em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.\n' +
          '6.2. Nossa Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais. Ao usar a Plataforma, você concorda com a coleta e o uso de seus dados pessoais de acordo com nossa Política de Privacidade.\n' +
          '\n' +
          '7. Limitação de Responsabilidade\n' +
          '7.1. A Coletivia não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou incapacidade de uso da Plataforma.\n' +
          '7.2. A Plataforma é fornecida "no estado em que se encontra" e sem garantias de qualquer tipo, expressas ou implícitas.\n' +
          '\n' +
          '8. Disposições Gerais\n' +
          '8.1. Estes Termos constituem o acordo integral entre você e a Coletivia em relação ao uso da Plataforma.\n' +
          '8.2. A Coletivia reserva-se o direito de modificar, alterar ou atualizar estes Termos a qualquer momento, mediante aviso prévio.\n' +
          '8.3. Caso qualquer disposição destes Termos seja considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.\n' +
          '8.4. A falha da Coletivia em exercer qualquer direito ou disposição destes Termos não constituirá renúncia a tal direito ou disposição.\n' +
          '\n' +
          'Para qualquer dúvida ou solicitação relacionada a estes Termos de Uso, você pode entrar em contato conosco através dos canais de suporte fornecidos na Plataforma.\n' +
          '\n' +
          'Ao aceitar estes Termos de Uso, você concorda em cumprir todas as políticas e diretrizes estabelecidas pela Coletivia em relação à utilização da Plataforma.\n',
      },
    ])
  }
}
// additionalData: JSON.parse('{"message":"Pix recebido com sucesso"}'),
