import { Product, QuizQuestion } from '../types';

/**
 * Gets a list of 5 themed quiz questions for a product based on its category/title.
 */
export function getThemedQuiz(title: string, category: string, productId: string): QuizQuestion[] {
  const normTitle = title.toLowerCase();
  const normCat = category.toLowerCase();

  // TECH / PROGRAMMING / SAAS / DATABASES
  if (
    normCat.includes('tecnologia') ||
    normCat.includes('programação') ||
    normCat.includes('desenvolvimento') ||
    normTitle.includes('saas') ||
    normTitle.includes('next.js') ||
    normTitle.includes('ia') ||
    normTitle.includes('inteligência') ||
    normTitle.includes('api') ||
    normTitle.includes('node') ||
    normTitle.includes('typescript') ||
    normTitle.includes('banco') ||
    normTitle.includes('sql')
  ) {
    return [
      {
        id: `q_${productId}_1`,
        question: 'Qual o principal benefício do TypeScript no desenvolvimento de produtos escaláveis?',
        options: [
          'Prevenção de erros em tempo de compilação por meio de tipagem estática e autocompilação assistida.',
          'Eliminar por completo a necessidade de escrever testes de integração.',
          'Deixar as consultas de banco de dados SQL 100% mais rápidas automaticamente.',
          'Garantir que o site funcione sem conexão de internet nativa.'
        ],
        correctOptionIndex: 0
      },
      {
        id: `q_${productId}_2`,
        question: 'O que caracteriza a hidratação (hydration) nas aplicações React modernas?',
        options: [
          'O processo pelo qual o código do cliente faz downloads de fotos de capas.',
          'O processo em que o React reconstrói a árvore de eventos vinculando escutas de ações humanas no HTML pré-renderizado pelo servidor.',
          'Reiniciar as credenciais de autenticação do usuário a cada minuto.',
          'Limpar o arquivo localStorage de forma autônoma para liberar memória RAM.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_3`,
        question: 'No PostgreSQL, para que serve o comando EXPLAIN ANALYZE?',
        options: [
          'Para traduzir código SQL em linguagem de programação Python.',
          'Mudar as permissões de gravação de usuários administradores.',
          'Executar a consulta e detalhar os planos reais de busca, custos de varreduras na memória e uso definitivo de índices.',
          'Fazer compactação compacta de gigabytes de logs.'
        ],
        correctOptionIndex: 2
      },
      {
        id: `q_${productId}_4`,
        question: 'Qual o cenário ideal para utilizar arquiteturas serverless no backend de aplicações?',
        options: [
          'Sistemas legados corporativos que exigem sessões em cache TCP abertas constantemente.',
          'Provedores de internet físicos locais.',
          'Aplicações de streaming de vídeo bruto sem limites.',
          'Cargas de trabalho com picos de tráfego imprevisíveis, pagando unicamente frações de milissegundos de execução ativa de funções.'
        ],
        correctOptionIndex: 3
      },
      {
        id: `q_${productId}_5`,
        question: 'O que o conceito de "Stripe Hooking" visa otimizar na área de membros de infoprodutos?',
        options: [
          'Garantir sincronia imediata e automática de compras e acessos através de requisições HTTPS criptografadas de webhook recebendo confirmações de pagamento.',
          'Aumentar o brilho e contraste de logotipos de empresas no topo.',
          'Fazer o parcelamento em cartões de crédito sem consultar o saldo de devedores.',
          'Criar planilhas XLS automatizadas de faturamento para e-mails.'
        ],
        correctOptionIndex: 0
      }
    ];
  }

  // MARKETING / COPYWRITING / SALES / LAUNCHES
  if (
    normCat.includes('marketing') ||
    normCat.includes('vendas') ||
    normTitle.includes('copy') ||
    normTitle.includes('negócio') ||
    normTitle.includes('lançamento') ||
    normTitle.includes('escrever') ||
    normTitle.includes('conversão')
  ) {
    return [
      {
        id: `q_${productId}_1`,
        question: 'Qual é o objetivo central de uma Headline em páginas de vendas de conversão acelerada?',
        options: [
          'Prender a atenção imediata do visitante do site por meio de uma promessa clara, específica e de transformação rápida.',
          'Mostrar os dados de registro comercial da empresa no topo.',
          'Listar todos os módulos pedagógicos do curso de forma exaustiva.',
          'Configurar links de afiliados de forma redundante.'
        ],
        correctOptionIndex: 0
      },
      {
        id: `q_${productId}_2`,
        question: 'Qual gatilho mental é acionado quando expomos depoimentos, avaliações reais e feedbacks do produto?',
        options: [
          'Gatilho da Urgência.',
          'Gatilho da Prova Social.',
          'Gatilho da Reciprocidade.',
          'Gatilho da Autoridade Estética.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_3`,
        question: 'O que representa o conceito estratégico de "Ancoragem de Preço" em ofertas?',
        options: [
          'Mudar as cores do botão checkout para tons verdes fluorescentes.',
          'Fixar o preço final com centavos terminados em noventa e sete.',
          'Apresentar um preço de valor referencial de mercado muito superior antes do valor com desconto, reduzindo a dor monetária da compra.',
          'Vender produtos sem comissão para parceiros afiliados.'
        ],
        correctOptionIndex: 2
      },
      {
        id: `q_${productId}_4`,
        question: 'Qual a principal finalidade de um botão CTA (Call To Action)?',
        options: [
          'Proporcionar links para as redes de suporte técnico terceirizadas.',
          'Conduzir o usuário a realizar uma ação única definida e direta (ex: comprar agora), sem gerar dúvidas orçamentárias ou atrito visual.',
          'Criar uma animação de faíscas coloridas na tela.',
          'Abrir um formulário de contato por e-mail extenso.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_5`,
        question: 'Qual o papel estratégico de "Escassez" em campanhas de infoprodutos?',
        options: [
          'Exibir o produto apenas em determinados países parceiros.',
          'Vender materiais de baixa qualidade em poucas quantidades.',
          'Bloquear acessos de alunos inadimplentes da rede social.',
          'Introduzir limites reais e urgentes de vagas ou bônus com contadores regressivos para incentivar a compra rápida imediata, evitando a procrastinação.'
        ],
        correctOptionIndex: 3
      }
    ];
  }

  // FINANCE / INVESTMENTS / BUSINESS / PROPERTY
  if (
    normCat.includes('finanças') ||
    normCat.includes('investimento') ||
    normCat.includes('dinheiro') ||
    normTitle.includes('investir') ||
    normTitle.includes('dinheiro') ||
    normTitle.includes('comunidade') ||
    normTitle.includes('ações') ||
    normTitle.includes('financeiro')
  ) {
    return [
      {
        id: `q_${productId}_1`,
        question: 'Qual é a regra áurea para mitigar riscos de perdas definitivas na gestão de investimentos?',
        options: [
          'Diversificação estratégica de ativos em diferentes classes, correlações, emissores e setores industriais.',
          'Investir todo o capital disponível unicamente no ativo de maior volatilidade recomendada.',
          'Manter 100% das reservas físicas guardadas sob custódia residencial física.',
          'Nunca ler as atas gerenciais e balanços patrimoniais das empresas.'
        ],
        correctOptionIndex: 0
      },
      {
        id: `q_${productId}_2`,
        question: 'O que caracteriza a Reserva de Emergência perfeita?',
        options: [
          'Dinheiro emprestado a juros compostos altos para amigos próximos.',
          'Uma quantia equivalente a pelo menos 6-12 meses de custos fixos essenciais, alocada sob liquidez diária imediata e de baixíssima volatilidade.',
          'Comprar uma quantidade de gado ou terrenos rurais distantes.',
          'Ações de empresas recém-lançadas na bolsa nacional.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_3`,
        question: 'O que de fato representam os Dividendos pagos pelas empresas listadas em bolsa de valores?',
        options: [
          'Taxas burocráticas anuais cobradas pelas corretoras.',
          'Empréstimos que a empresa faz junto aos bancos estatais.',
          'A parte dos lucros líquidos apurados pela companhia que é distribuída periodicamente aos seus acionistas de forma proporcional à quantidade de cotas pertencentes.',
          'A taxa de juros básica emitida pelo banco central do país.'
        ],
        correctOptionIndex: 2
      },
      {
        id: `q_${productId}_4`,
        question: 'No cenário macroeconômico, quem define e vota a meta da Taxa SELIC do mercado brasileiro?',
        options: [
          'A comissão parlamentar de tributação de patrimônios privados.',
          'O Comitê de Política Monetária (Copom) do Banco Central, avaliando inflação, câmbio externo e atividade econômica nacional.',
          'A diretoria da bolsa de valores local unicamente.',
          'As empresas líderes do setor imobiliário privado.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_5`,
        question: 'Qual o papel fundamental do planejamento orçamentário empresarial?',
        options: [
          'Otimizar o fluxo de caixa mapeando entradas operacionais, amortizando custos fixos corporativos e fixando teto de custos para preservar a margem líquida e lucro operacional da corporação.',
          'Definir a marca visual que agradará os investidores externos do board.',
          'Prever o faturamento absoluto de vendas sem monitorar taxas de gateway de pagamentos.',
          'Evitar contratações de novos assistentes operacionais ao longo de anos de crescimento acelerado.'
        ],
        correctOptionIndex: 0
      }
    ];
  }

  // HEALTH / WELLNESS / YOGA / NUTRITION
  if (
    normCat.includes('saúde') ||
    normCat.includes('nutrição') ||
    normCat.includes('bem-estar') ||
    normTitle.includes('yoga') ||
    normTitle.includes('dieta') ||
    normTitle.includes('performance') ||
    normTitle.includes('físic') ||
    normTitle.includes('receita') ||
    normTitle.includes('mente') ||
    normTitle.includes('estilo')
  ) {
    return [
      {
        id: `q_${productId}_1`,
        question: 'Qual a importância de equilibrar a ingestão de macronutrientes na dieta diária?',
        options: [
          'Fornecer o substrato correto para síntese e regeneração celular das fibras musculares (proteínas), energia mitocondrial direta (carboidratos complexos) e suporte regulatório endócrino e hormonal (gorduras boas).',
          'Eliminar por completo os carboidratos e as gorduras da alimentação pelo resto da vida.',
          'Evitar o consumo de qualquer água mineral durante a digestão gástrica líquida.',
          'Substituir todas as refeições por suplementos concentrados industriais em pó.'
        ],
        correctOptionIndex: 0
      },
      {
        id: `q_${productId}_2`,
        question: 'Como a respiração pranayama (exercício respiratório da yoga) age cientificamente no nível de estresse humano?',
        options: [
          'Causando tontura intencional para anestesiar dores musculares profundas.',
          'Não há benefícios biológicos validados na controle respiratório diário.',
          'Estimulando de forma reflexiva o nervo vago e ativando o sistema nervoso parassimpático, reduzindo cortisol, batimentos cardíacos médios e restaurando o equilíbrio hemodinâmico do corpo.',
          'Aumentando a liberação de adrenalina no córtex pré-frontal constantemente.'
        ],
        correctOptionIndex: 2
      },
      {
        id: `q_${productId}_3`,
        question: 'O que define a "Longevidade Saudável" de acordo com a medicina funcional integrativa?',
        options: [
          'Uso massivo de medicamentos de última geração unicamente.',
          'Estender a expectativa total de anos de vida mantendo excelente independência funcional e motora, integridade óssea equilibrada e alta performance cognitiva/mental.',
          'Passar mais de 10 horas seguidas em jejum extremo semanal.',
          'A prática exaustiva de exercícios físicos pesados sem intervalos de regeneração muscular de 24 horas.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_4`,
        question: 'Qual o papel dos fitoquímicos e antioxidantes presentes em alimentos bioativos anti-inflamatórios?',
        options: [
          'Dificultar a absorção de açúcares pelo fígado.',
          'Neutralizar os radicais livres oxidativos excedentes no organismo, reduzindo picos inflamatórios internos e apoiando a mitocôndria a combater o estresse oxidativo intracelular crônico.',
          'Alterar a genética estrutural celular de forma permanente em poucas semanas.',
          'Deixar as membranas intestinais mais impermeáveis a qualquer nutriente dietético.'
        ],
        correctOptionIndex: 1
      },
      {
        id: `q_${productId}_5`,
        question: 'Qual a principal vantagem da hidratação hídrica fracionada ao longo do dia para o músculo cardíaco e o cérebro?',
        options: [
          'Garantir densidade sanguínea favorável, facilitando as trocas de sódio e potássio, transporte ideal de oxigênio pelas hemácias e transmissão estável de impulsos neurológicos nas sinapses corticais.',
          'Deixar as articulações dos joelhos intumescidas.',
          'Inibir permanentemente os hormônios de eliminação urinária do fígado.',
          'Aumentar o volume estomacal para saciar apetites vorazes sem consumir calorias complexas.'
        ],
        correctOptionIndex: 0
      }
    ];
  }

  // FALLBACK GENERAL LEARNING THEME
  return [
    {
      id: `q_${productId}_1`,
      question: 'Qual é o fator fundamental mais crítico e determinante para a verdadeira fixação de novos saberes digitais?',
      options: [
        'A prática ativa, aplicação imediata do conhecimento em laboratórios individuais ou projetos da vida real de forma recorrente.',
        'Apenas assistir mais de 14 horas de aulas contínuas no modo passivo de reprodução de vídeo.',
        'Anotar todas as palavras exatas do instrutor sem reflexão crítica individual sobre o tema.',
        'Expor relatórios de certificados pendentes em redes corporativas sem terminar as aulas.'
      ],
      correctOptionIndex: 0
    },
    {
      id: `q_${productId}_2`,
      question: 'Pensando em alta performance de foco, qual o benefício prático do método de blocos temporizados de estudo (ex: técnica Pomodoro)?',
      options: [
        'Ter desculpas programadas para procrastinar na execução de metas profissionais cruciais.',
        'Garantir períodos intensivos de foco focal ininterrupto com intervalos estratégicos estruturados de descanso, reduzindo a fadiga neural acumulada no córtex frontal.',
        'Concluir os cursos em menor tempo absoluto burlando vídeos rápidos.',
        'Evitar as interações no fórum coletivo ou suporte presencial.'
      ],
      correctOptionIndex: 1
    },
    {
      id: `q_${productId}_3`,
      question: 'Ao enfrentar um obstáculo técnico complexo durante a aplicação prática de uma diretriz, qual a melhor abordagem pedagógica?',
      options: [
        'Desistir do módulo atual e pular diretamente para a avaliação do certificado.',
        'Copiar soluções prontas inteiras sem ler as mensagens ou o código de depuração.',
        'Analisar a raiz lógica do erro por etapas ordenadas, examinar o console de depuração e interagir com colegas e com o Tutor AI no fórum de discussão de dúvidas.',
        'Solicitar o cancelamento do produto de imediato.'
      ],
      correctOptionIndex: 2
    },
    {
      id: `q_${productId}_4`,
      question: 'De que forma colocar em dúvida e discutir tópicos ativamente no fórum do curso enriquece a jornada escolar?',
      options: [
        'Incomodar os outros participantes do ecossistema.',
        'Evitar a fadiga mental colateral.',
        'Acelerar a consolidação da memória de longo prazo ao debater perspectivas que forçam o cérebro a reformular racionalmente os temas ensinados.',
        'Não há benefícios diretos, é apenas uma área opcional do infoproduto.'
      ],
      correctOptionIndex: 2
    },
    {
      id: `q_${productId}_5`,
      question: 'O que define a mentalidade de um estudante de sucesso continuado (Lifelong Learner)?',
      options: [
        'Enxergar a capacitação como um processo contínuo e transformador ao longo da vida profissional, mantendo curiosidade intelectual ativa e testando novas soluções ativamente no cotidiano acadêmico.',
        'Adquirir o máximo de produtos digitais unicamente para preencher estantes sem assisti-los.',
        'Delegar o próprio aprendizado para outras ferramentas ou softwares de terceiros totalmente sem raciocínio prévio.',
        'Fazer avaliações de quizzes decorando as respostas de gabaritos informais.'
      ],
      correctOptionIndex: 0
    }
  ];
}

/**
 * Gets a pre-loaded list of at least 7 interactive Portuguese reviews/comments specifically suited for a product.
 */
export function getThemedComments(title: string, category: string): { name: string; text: string; date: string; isInstructor?: boolean }[] {
  const normTitle = title.toLowerCase();
  const normCat = category.toLowerCase();

  // TECH / PROGRAMMING / SAAS
  if (
    normCat.includes('tecnologia') ||
    normCat.includes('programação') ||
    normCat.includes('desenvolvimento') ||
    normTitle.includes('saas') ||
    normTitle.includes('next.js') ||
    normTitle.includes('ia') ||
    normTitle.includes('inteligência') ||
    normTitle.includes('api') ||
    normTitle.includes('node') ||
    normTitle.includes('typescript') ||
    normTitle.includes('banco') ||
    normTitle.includes('sql')
  ) {
    return [
      { name: 'Guilherme Silva (Instructor)', text: 'Olá pessoal! Sejam bem-vindos a este módulo. Lembrem-se de baixar seu Boilerplate e configurar as variáveis no arquivo .env local antes da aula de banco de dados.', date: 'Há 2 dias', isInstructor: true },
      { name: 'Maurício Antunes', text: 'Aula fantástica! Consegui plugar o streaming sem travamentos no meu front-end local. Muito obrigado instrutor!', date: 'Há 4 horas' },
      { name: 'Eduardo Lima', text: 'Este curso superou todas as minhas expectativas de infraestrutura técnica. O módulo de Server Components de Next.js é cirúrgico!', date: 'Há 1 dia' },
      { name: 'Carla Dias', text: 'Didática fora do comum. O deploy automatizado em Docker no Cloud Run funcionou de primeira sem mistérios ou erros de permissão.', date: 'Há 2 dias' },
      { name: 'Lucas Ribeiro', text: 'Muito top o suporte no fórum! O tutor responde rápido e o uso exaustivo de TypeScript previne bugs gigantes que costumava enfrentar.', date: 'Há 3 dias' },
      { name: 'Mariana Souza', text: 'Excelente focar em boas práticas de segurança, como variáveis de ambiente no servidorExpress. Me deu clareza para aplicar no projeto real.', date: 'Há 5 dias' },
      { name: 'Felipe Nogueira', text: 'Espetacular! Consegui plugar as conexões PostgreSQL do Cloud SQL de forma otimizada usando os pooling indicados pelas aulas.', date: 'Há 1 semana' },
      { name: 'Beatriz Santos', text: 'Conteúdo denso, prático e focado na resolução de gargalos reais de performance. O boilerplate disponibilizado me economizou semanas de código braçal.', date: 'Há 1 semana' }
    ];
  }

  // MARKETING / COPYWRITING / SALES
  if (
    normCat.includes('marketing') ||
    normCat.includes('vendas') ||
    normTitle.includes('copy') ||
    normTitle.includes('negócio') ||
    normTitle.includes('lançamento') ||
    normTitle.includes('escrever') ||
    normTitle.includes('conversão')
  ) {
    return [
      { name: 'Patrícia Albuquerque (Tutor)', text: 'Sejam muito bem-vindos! Acessem o material complementar de Headlines do Módulo 1 para desbloquear o swipe file com mais de 300 modelos otimizados de alta conversão.', date: 'Há 3 dias', isInstructor: true },
      { name: 'Marcos Aurélio', text: 'As técnicas de persuasão baseadas no cérebro primitivo mudaram totalmente o CTR das minhas páginas. Tripliquei minhas conversões de tráfego orgânico!', date: 'Há 5 horas' },
      { name: 'Ana Carolina', text: 'Os modelos de estruturação de ofertas irresistíveis e quebra de objeções iniciais são simplesmente ouro puro para quem trabalha com infoprodutos.', date: 'Há 1 dia' },
      { name: 'Julio Cesar', text: 'Excelente! Entender o conceito exato sobre como e quando realizar a ancoragem de preços reduziu drasticamente as desistências no checkout.', date: 'Há 2 dias' },
      { name: 'Sofia Costa', text: 'Melhor investimento do ano. Eu sofria muito para estruturar anúncios que gerassem clique, agora os roteiros de ganchos fazem tudo fluir naturally.', date: 'Há 4 dias' },
      { name: 'Thiago Braga', text: 'Suporte maravilhoso! Tirei minhas dúvidas de copywriting sobre cartas de vendas e recebi uma excelente análise crítica individualizada.', date: 'Há 1 semana' },
      { name: 'Camila Ortiz', text: 'Sem palavras para oRoberto. Simples, direto na prática comercial lucrativa e sem enrolações conceituadas que só gastam tempo.', date: 'Há 1 semana' },
      { name: 'Gabriel Silva', text: 'Esse treinamento deveria ser obrigatório para quem quer viver de infoprodutos ou SaaS. Conhecimento de copywriting é o motor gerador de margem líquida.', date: 'Há 2 semanas' }
    ];
  }

  // FINANCE / INVESTMENTS / BUSINESS
  if (
    normCat.includes('finanças') ||
    normCat.includes('investimento') ||
    normCat.includes('dinheiro') ||
    normTitle.includes('investir') ||
    normTitle.includes('dinheiro') ||
    normTitle.includes('comunidade') ||
    normTitle.includes('ações') ||
    normTitle.includes('financeiro')
  ) {
    return [
      { name: 'Rafael Alencar (Analista VIP)', text: 'Bem-vindos à nossa área! Toda terça-feira até às 18h enviamos os relatórios de balanceamento e análises de mercado recomendados na aba de links adicionais.', date: 'Há 4 dias', isInstructor: true },
      { name: 'Renato Azevedo', text: 'As planilhas de dividendos recomendadas são esclarecedoras, principalmente para quem quer parar de investir no escuro e quer prever fluxos de caixa.', date: 'Há 4 horas' },
      { name: 'Patrícia Gomes', text: 'Excelente explicação sobre investimentos sob controle inflacionário e reservas de liquidez imediata. Didática impecável do Roberto!', date: 'Há 1 dia' },
      { name: 'Daniel Alves', text: 'A assinatura dessa comunidade já se pagou inteiramente só com as análises setoriais fundamentadas deste mês. Altíssimo nível de pesquisa de mercado.', date: 'Há 2 dias' },
      { name: 'Vanessa Rocha', text: 'Entender a importância de separar o caixa empresarial do pessoal me evitou um desastre financeiro. Muito grata pelas orientações práticas.', date: 'Há 4 dias' },
      { name: 'Roberto Antunes', text: 'Um material extremamente rico e elucidativo. Recomendo baixar o e-book complementar em PDF para estudar as fórmulas com calma.', date: 'Há 1 semana' },
      { name: 'Bruna Martins', text: 'Tratar de finanças empresariais e metas de faturamento sem de fato monitorar taxas de processamento era meu erro básico. Obrigado por abrir meus olhos!', date: 'Há 1 semana' },
      { name: 'Mateus Vieira', text: 'Focado em resultados de verdade. Menos promessas fáceis e mais análises de balanço sólidas, patrimônio é jogo de longo prazo.', date: 'Há 2 semanas' }
    ];
  }

  // HEALTH / WELLNESS / YOGA
  if (
    normCat.includes('saúde') ||
    normCat.includes('nutrição') ||
    normCat.includes('bem-estar') ||
    normTitle.includes('yoga') ||
    normTitle.includes('dieta') ||
    normTitle.includes('performance') ||
    normTitle.includes('físic') ||
    normTitle.includes('receita') ||
    normTitle.includes('mente') ||
    normTitle.includes('estilo')
  ) {
    return [
      { name: 'Mariana Fortes (Fisioterapeuta)', text: 'Bem-vindos, queridos alunos! Se sentirem algum desconforto nos asanas de alinhamento cervical, usem um bloco de apoio temporário conforme o guia.', date: 'Há 3 dias', isInstructor: true },
      { name: 'Clarissa Schmidt', text: 'As posturas de yoga propostas reduziram de forma surpreendente minhas dores lombares intensas geradas por trabalhar sentada o dia inteiro.', date: 'Há 3 horas' },
      { name: 'Juliana Meireles', text: 'O protocolo de detox corporal e alimentos bioativos me deu um ânimo fantástico. Pareço outra pessoa à tarde, com foco renovado e estamina.', date: 'Há 1 dia' },
      { name: 'André Miranda', text: 'As aulas de respiração pranayama são verdadeiros comprimidos naturais contra estresses diários. Controle excelente da ansiedade.', date: 'Há 2 dias' },
      { name: 'Larissa Couto', text: 'Excelente qualidade nas videoaulas! A iluminação cenográfica e o áudio da meditação guiada transmitem muita paz e tranquilidade espiritual.', date: 'Há 3 dias' },
      { name: 'Alexandre Ramos', text: 'Muito bom sintonizar a performance esportiva com a saúde integrativa equilibrada. Uma verdadeira consultoria em estilo de vida saudável.', date: 'Há 1 semana' },
      { name: 'Fernanda Lima', text: 'Apostilas ricas em informações, detalhando compostos anti-inflamatórios e receitas deliciosas e extremamente fáceis de preparar.', date: 'Há 1 semana' },
      { name: 'Tiago Bastos', text: 'Me sentindo rejuvenescido fisicamente e muito mais limpo em termos alimentares de toxinas industriais. Parabéns por este ecossistema incrível!', date: 'Há 2 semanas' }
    ];
  }

  // FALLBACK GENERAL LEARNING THEME
  return [
    { name: 'Carlos Neto (Suporte Técnico)', text: 'Olá aluno! Caso tenha problemas de lentidão no carregamento das aulas, tente alternar as rotas de CDN clicando no botão do reprodutor.', date: 'Há 5 dias', isInstructor: true },
    { name: 'Marcelo Nogueira', text: 'Uma didática simplesmente cirúrgica. O instrutor consegue fragmentar conceitos de alta complexidade em exemplos do cotidiano.', date: 'Há 6 horas' },
    { name: 'Tatiane Moreira', text: 'Adorei os materiais didáticos em PDF para acompanhar impresso as tarefas de fixação propostas. Muito caprichados de verdade.', date: 'Há 1 dia' },
    { name: 'Gustavo Henrique', text: 'Excelente progressão de conceitos! O andamento das aulas flui em uma ordem cronológica lógica ideal para iniciantes avançarem rápido e seguros.', date: 'Há 2 dias' },
    { name: 'Amanda Luz', text: 'Este curso é simplesmente um espetáculo. Ótimo ver as interações ricas no fórum de alunos trocando ideias em alto nível sobre os tópicos.', date: 'Há 4 dias' },
    { name: 'Renan Costa', text: 'A aula de organização pessoal de estudos foi inspiradora. Me permitiu encaixar 20 minutos de estudo bem aproveitados todos os dias de manhã.', date: 'Há 1 semana' },
    { name: 'Patrícia Abreu', text: 'Material extremamente polido, suporte ultra atencioso e plataforma leve e rápida. Valeu cada centavo gasto!', date: 'Há 1 semana' },
    { name: 'Ricardo Souza', text: 'Curso excelente, super recomendo para quem quer um método conciso de aprendizado focado de verdade e sem perda de tempo em teoria pura.', date: 'Há 2 semanas' }
  ];
}

/**
 * Enriches a Product object to guarantee at least 5 quiz questions and 7 beautiful comments.
 */
export function enrichProductData(p: Product): Product {
  const finalQuiz = p.quiz && p.quiz.length >= 5 
    ? p.quiz 
    : getThemedQuiz(p.title, p.category, p.id);

  const finalComments = p.classroomComments && p.classroomComments.length >= 7 
    ? p.classroomComments 
    : getThemedComments(p.title, p.category);

  return {
    ...p,
    quiz: finalQuiz,
    classroomComments: finalComments
  };
}
