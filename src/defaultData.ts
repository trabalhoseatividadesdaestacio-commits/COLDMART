import { Product, Sale, User, Ticket, LandingPage, TransferRequest, AffiliationRule } from './types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Guilherme Silva (Staff)',
    email: 'admin@coldmart.com.br',
    role: 'admin',
    balance: 54230.50,
    balancePending: 12850.00,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    password: 'adminpassword123',
  },
  {
    id: 'usr_producer',
    name: 'Roberto Shinyashiki (Product Manager)',
    email: 'roberto@coldmart.com.br',
    role: 'producer',
    balance: 28410.20,
    balancePending: 8430.40,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    password: 'producerpassword123',
  },
  {
    id: 'usr_affiliate',
    name: 'Rafaela Alencar (Traffic Manager)',
    email: 'rafaela@coldmart.com.br',
    role: 'affiliate',
    balance: 4120.00,
    balancePending: 1980.50,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    password: 'affiliatepassword123',
  },
  {
    id: 'usr_buyer',
    name: 'Bruno Meireles (Estudante)',
    email: 'bruno@coldmart.com.br',
    role: 'buyer',
    balance: 0.00,
    balancePending: 0.00,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    password: 'buyerpassword123',
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'SaaS Builder: Next.js & Inteligência Artificial',
    description: 'Aprenda a construir, promover e internacionalizar aplicações SaaS completas integrando modelos de linguagem inovadores e sistemas de pagamento em escala real.',
    price: 397.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 60, // 60% comissão para afiliados
    status: 'active',
    rating: 4.9,
    ratingCount: 168,
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 1240,
    quiz: [
      {
        id: 'q1_1',
        question: 'Qual é o principal benefício do Server Component no Next.js App Router para um SaaS?',
        options: [
          'Redução extrema da latência e do bundle size enviado ao cliente, otimizando o carregamento inicial.',
          'Permitir que o cliente leia do banco de dados sem nenhuma segurança.',
          'Eliminar a necessidade de usar CSS em todo o projeto.',
          'Não necessitar de servidor node ativo no Cloud Run.'
        ],
        correctOptionIndex: 0
      },
      {
        id: 'q1_2',
        question: 'O que o conceito de "Stripe Hooking" visa otimizar na área de membros?',
        options: [
          'Desenho de logotipos modernos.',
          'Sincronização imediata de permissões de compra através de mensagens webhooks assinados criptograficamente.',
          'Edição de vídeos leves.',
          'Exportação de tabelas CSV para planilhas locais.'
        ],
        correctOptionIndex: 1
      }
    ],
    modules: [
      {
        id: 'mod_1_1',
        title: 'Módulo 1: Fundamentos de Arquitetura SaaS Serverless',
        lessons: [
          {
            id: 'les_1_1_1',
            title: '1.1 Visão Geral e Alinhamento de Performance',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '14:20',
            completed: false,
            description: 'Entenda os principais requisitos de uma aplicação SaaS lucrativa, divididos em faturamento, controle de assinaturas e segurança.',
            materials: [{ name: 'Slide da Aula PDF', url: '#' }, { name: 'Boilerplate Inicial GitHub', url: '#' }]
          },
          {
            id: 'les_1_1_2',
            title: '1.2 Modelagem de Banco com ORMs de Alta Performance',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '22:15',
            completed: false,
            description: 'Conectando instâncias PostgreSQL do Cloud SQL de forma otimizada utilizando pooling de conexões e Drizzle ORM.',
            materials: [{ name: 'Esquema do Schema sql', url: '#' }]
          }
        ]
      },
      {
        id: 'mod_1_2',
        title: 'Módulo 2: Integração com Modelos Generativos de Linguagem',
        lessons: [
          {
            id: 'les_1_2_1',
            title: '2.1 Engenharia de Prompt para Geração de Conteúdo',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '18:50',
            completed: false,
            description: 'Ajuste de hiperparâmetros e prompts de sistema no SDK oficial @google/genai para criar assistentes inteligentes confiáveis.',
            materials: [{ name: 'Guia de Prompts Markdowns', url: '#' }]
          },
          {
            id: 'les_1_2_2',
            title: '2.2 Streaming de Tokens em Tempo Real na UI',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '29:44',
            completed: false,
            description: 'Como implementar streaming de texto progressivo utilizando chamadas assíncronas do Node.js direto para a tela sem travamentos.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'Copywriting de Alta Conversão: Guia Supremo',
    description: 'Transforme palavras comuns em engrenagens de faturamento multimilionário. Estruturas psicológicas comprovadas, scripts e hacks de conversão instantânea.',
    price: 97.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 92,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 890,
    modules: [
      {
        id: 'mod_2_1',
        title: 'Livro Digital Principal',
        lessons: [
          {
            id: 'les_2_1_1',
            title: 'PDF Completo - Copywriting Supremo v4.2',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Manual definitivo de ganchos do cérebro primitivo e como direcionar decisões do consumidor a seu favor com integridade.',
            materials: [{ name: 'Baixar E-Book Principal (PDF)', url: '#' }, { name: 'Swipe File de Headlines Prontas', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_3',
    title: 'Assinatura Comunidade Investidor Próspero',
    description: 'Comunidade premium de acompanhamento financeiro com carteiras recomendadas semanais, lives exclusivas e análises profundas de ações, fundos e criptoativos.',
    price: 49.90, // Mensal
    type: 'subscription',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 40,
    status: 'active',
    rating: 4.7,
    ratingCount: 145,
    category: 'Finanças',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 430,
    modules: [
      {
        id: 'mod_3_1',
        title: 'Boas-vindas e Manual do Investidor',
        lessons: [
          {
            id: 'les_3_1_1',
            title: 'Instruções da Comunidade e Acesso ao Discord Secreto',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '07:45',
            completed: false,
            description: 'Faça sua integração à comunidade próspera de investidores ativos e receba o convite de entrada para o nosso canal fechado.',
            materials: [{ name: 'Acessar Link do Discord Vip', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_4',
    title: 'Mentoria Vip: Lançamentos Digitais de 7 Dígitos',
    description: 'Minha mentoria direta e privada para produtores e agências escalarem futilidades de tráfego a funis de infoprodutos que ultrapassam 1 milhão de reais em 7 dias.',
    price: 1997.00,
    type: 'mentorship',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 30,
    status: 'active',
    rating: 5.0,
    ratingCount: 34,
    category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 65,
    modules: [
      {
        id: 'mod_4_1',
        title: 'Primeiro Encontro Individual',
        lessons: [
          {
            id: 'les_4_1_1',
            title: 'Agendamento e Briefing Diagnóstico de Modelo de Negócio',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '11:12',
            completed: false,
            description: 'Instruções para preencher seu diagnóstico estratégico de funil e liberar sua agenda personalizada no meu Calendly corporativo.',
            materials: [{ name: 'Questionário Inicial de Alinhamento xls', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_5',
    title: 'Inglês Corporativo Dinâmico',
    description: 'Vocabulário profissional avançado, simulações de entrevistas internacionais e dinâmicas de apresentação prontas para te destacar no mercado de trabalho global.',
    price: 199.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 38,
    category: 'Idiomas',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 120,
    modules: [
      {
        id: 'mod_5_1',
        title: 'Módulo 1: Pitch de Apresentação Internacional',
        lessons: [
          {
            id: 'les_5_1_1',
            title: '5.1 Construindo seu Elevator Pitch em Inglês',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '15:10',
            completed: false,
            description: 'Como se apresentar em menos de 2 minutos destacando suas competências técnicas de forma elegante.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_6',
    title: 'Full Stack Developer Masterclass',
    description: 'Domine a stack mais demandada do mercado de tecnologia. Do CSS moderno e componentes React à infraestrutura resiliente na nuvem com NodeJS.',
    price: 297.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 60,
    status: 'active',
    rating: 4.9,
    ratingCount: 88,
    category: 'Programação',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 340,
    modules: [
      {
        id: 'mod_6_1',
        title: 'Módulo de Entrada: Fundamentos',
        lessons: [
          {
            id: 'les_6_1_1',
            title: '6.1 Primeiros Passos com React 18 e Renderização Virtual',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '18:40',
            completed: false,
            description: 'Aprenda como o React lida com reconciliação e o ciclo de vida moderno usando Effects estáveis.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_7',
    title: 'Banco de Dados-SQL: PostgreSQL & NoSQL',
    description: 'Aprenda a criar modelos de tabelas relacionais eficientes, otimizar índices em consultas lentas e arquitetar persistência flexível com segurança.',
    price: 147.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 42,
    category: 'Programação',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 156,
    modules: [
      {
        id: 'mod_7_1',
        title: 'Módulo de Entrada: SQL Relacionado Avançado',
        lessons: [
          {
            id: 'les_7_1_1',
            title: '7.1 Queries Eficientes e Plano de Execução (EXPLAIN ENGINES)',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '22:15',
            completed: false,
            description: 'Análise detalhada de gargalos de rede nos bancos de dados relacionais baseados em PostgreSQL.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_8',
    title: 'Descomplicando APIs com Node.js e TypeScript',
    description: 'Guia de bolso prático para desenvolvedores criarem serviços backend seguros, totalmente tipados, modulares e prontos para produção industrial.',
    price: 49.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 29,
    category: 'Programação',
    image: 'https://images.unsplash.com/photo-1516116211223-4c359a36beec?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 201,
    modules: [
      {
        id: 'mod_8_1',
        title: 'E-Book Completo para Leitura',
        lessons: [
          {
            id: 'les_8_1_1',
            title: 'PDF Completo - APIs Robustas com Node & TS',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Bíblia de boas práticas de roteamento, tratamento de exceções assíncronas e middlewares corporativos robustos.',
            materials: [{ name: 'Acessar PDF da Obra Principal', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_9',
    title: 'Nutrição Funcional e Longevidade',
    description: 'Guia completo para reequilibrar seu corpo biomolecularmente, desinflamar músculos e obter vitalidade prolongada através de alimentos orgânicos naturais.',
    price: 79.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.6,
    ratingCount: 33,
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 147,
    modules: [
      {
        id: 'mod_9_1',
        title: 'E-Book Completo para Leitura',
        lessons: [
          {
            id: 'les_9_1_1',
            title: 'Livro Digital - Manual de Saúde Integral (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Receitas detox funcionais, listas de substituições bioativas saudáveis e nutrição científica.',
            materials: [{ name: 'Fazer Download da Nutrição Funcional', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_10',
    title: 'Protocolo Mente Ativa & Yoga Diário',
    description: 'Seu ponto de conexão. Assinatura mensal exclusiva de videoaulas diárias de yoga elemental, técnicas avançadas de respiração e relaxamento corporal ativo.',
    price: 39.95,
    type: 'subscription',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 40,
    status: 'active',
    rating: 4.9,
    ratingCount: 52,
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 220,
    modules: [
      {
        id: 'mod_10_1',
        title: 'Aulas Fixas da Semana',
        lessons: [
          {
            id: 'les_10_1_1',
            title: 'Aula 1 - Alinhamento e Posturas Iniciais (Asanas)',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '24:12',
            completed: false,
            description: 'Inicie seu dia com asanas de abertura torácica que despertam a musculatura estabilizadora profunda.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_11',
    title: 'Mentoria Premium: Performance Física',
    description: 'Acompanhamento pessoal vip focado para calibrar seus hormônios, estamina diária e clareza mental frente à rotina de altas decisões corporativas.',
    price: 1297.00,
    type: 'mentorship',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 30,
    status: 'active',
    rating: 5.0,
    ratingCount: 15,
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 42,
    modules: [
      {
        id: 'mod_11_1',
        title: 'Alinhamento Diagnóstico Inicial',
        lessons: [
          {
            id: 'les_11_1_1',
            title: 'Briefing Executivo para Programas de Performance',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '09:30',
            completed: false,
            description: 'Entenda os principais marcadores de cansaço extremo que iremos mapear individualmente.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_12',
    title: 'Foco Absoluto: Sono de Alta Performance',
    description: 'Aprenda os segredos validados da neurobiologia aplicada para otimizar suas fases de sono profundo e duplicar sua produtividade nas tarefas diurnas.',
    price: 197.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 61,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1511295742364-92767fa62d9f?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 180,
    modules: [
      {
        id: 'mod_12_1',
        title: 'Módulo 1: O Quarto Blindado para Descanso',
        lessons: [
          {
            id: 'les_12_1_1',
            title: '1.1 Higiene do Sono e Bloqueio Luminescente Eficaz',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '16:45',
            completed: false,
            description: 'Como preparar o ambiente físico ideal para maximizar a secreção natural de melatonina à noite.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_13',
    title: 'Hipertrofia Acelerada: O Guia Definitivo',
    description: 'Treinos focados com peso livre, períodos de descanso metabolicamente adequados e táticas de sobrecarga progressiva para resultados musculares consistentes.',
    price: 57.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 55,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 302,
    modules: [
      {
        id: 'mod_13_1',
        title: 'Guia Escrito de Treinamento',
        lessons: [
          {
            id: 'les_13_1_1',
            title: 'Ebook Principal - Protocolo de Cargas',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Folha de treinos detalhada de divisão A/B/C com número ótimo de repetições e séries.',
            materials: [{ name: 'Baixar Ebook Hipertrofia (PDF)', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_14',
    title: 'Calistenia Express: Treine Em Qualquer Lugar',
    description: 'Domine o controle e o peso do seu próprio corpo. Exercícios intensos baseados em calistenia que dispensam academias ou equipamentos pesados.',
    price: 129.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 37,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 114,
    modules: [
      {
        id: 'mod_14_1',
        title: 'Módulo de Treino Corporal',
        lessons: [
          {
            id: 'les_14_1_1',
            title: '1.1 Push-ups Avançados e Empuxos Horizontais',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '11:40',
            completed: false,
            description: 'Instruções posturais precisas para progredir para flexões inclinadas e flexões de ponta de cabeça.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_15',
    title: 'Dominando Linux e Docker na Prática',
    description: 'Entenda de uma vez por todas como gerenciar servidores virtuais isoladamente, empacotar sistemas complexos e implementar automação de deploy estável.',
    price: 187.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 76,
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 254,
    modules: [
      {
        id: 'mod_15_1',
        title: 'Módulo Prático: Docker Containerization',
        lessons: [
          {
            id: 'les_15_1_1',
            title: '1.1 Criando Dockerfiles Otimizados com Multi-stage Builds',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '19:15',
            completed: false,
            description: 'Como reduzir o tamanho final da imagem do container utilizando build modular moderno.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_16',
    title: 'DevOps Fácil: Escalando no Kubernetes',
    description: 'Aprenda a orquestrar de forma sustentável dezenas de instâncias com balanceador de carga nativo, clusters tolerantes a falha e atualizações zero-downtime.',
    price: 347.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 60,
    status: 'active',
    rating: 4.8,
    ratingCount: 44,
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 161,
    modules: [
      {
        id: 'mod_16_1',
        title: 'Módulo Prático: Kubernetes Clusters',
        lessons: [
          {
            id: 'les_16_1_1',
            title: '1.1 Pods, Deployments e Services de Rede Descomplicados',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '26:50',
            completed: false,
            description: 'Como configurar rotas de rede que mapeiem tráfego externo para pods saudáveis dentro do cluster.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_17',
    title: 'Gestão de Tráfego Pago: Google Ads & Meta Ads',
    description: 'Desenvolva públicos hipersegmentados de compradores recorrentes, desvende a pontuação de relevância do pixel de conversão e obtenha ROI fantástico.',
    price: 297.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 60,
    status: 'active',
    rating: 4.8,
    ratingCount: 110,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 412,
    modules: [
      {
        id: 'mod_17_1',
        title: 'Módulo Estratégico: Criação de Pixel e Escala',
        lessons: [
          {
            id: 'les_17_1_1',
            title: '1.1 Rastreamento Definitivo com Conversões na API do Facebook',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '21:30',
            completed: false,
            description: 'Configure contingência robusta para não sofrer perdas de dados após atualizações de privacidade de navegadores.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_18',
    title: 'Lançamentos em Reels e TikTok Orgânico',
    description: 'O algoritmo de entretenimento desmistificado. Guia estratégico para fabricar conteúdos hipnotizantes de 15 segundos e converter tráfego massivo sem gastos extras.',
    price: 67.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 68,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 318,
    modules: [
      {
        id: 'mod_18_1',
        title: 'Ebook Principal - Roteiros de Vídeo Viral',
        lessons: [
          {
            id: 'les_18_1_1',
            title: 'PDF Completo - Roteirização de Ganchos Psicossociais',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Como segurar a retenção do espectador nos cruciais primeiros 3 segundos para que a plataforma distribua seu conteúdo para milhões.',
            materials: [{ name: 'Acessar Roteiros Virais PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_19',
    title: 'Tesouro Direto e Renda Fixa Inteligente',
    description: 'Proteja de imediato suas economias contra devalorização causada pela inflação silenciosa e organize sua reserva de oportunidade de forma totalmente diversificada.',
    price: 119.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 31,
    category: 'Finanças',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 125,
    modules: [
      {
        id: 'mod_19_1',
        title: 'Módulo 1: Renda Fixa na Prática',
        lessons: [
          {
            id: 'les_19_1_1',
            title: '1.1 Diferença Real de IPCA+, Selic e Prefixado',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '14:20',
            completed: false,
            description: 'Identifique qual título público se adequa melhor ao seu prazo de resgate visando menor incidência de imposto.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_20',
    title: 'Declaração de IR para Investidores',
    description: 'Manual definitivo, ilustrado e didático para listar corretamente ações, Fundos Imobiliários, dividendos, criptomoedas e reservas sem erros para a Receita Federal.',
    price: 39.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 48,
    category: 'Finanças',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 228,
    modules: [
      {
        id: 'mod_20_1',
        title: 'Livro Digital de Declarações',
        lessons: [
          {
            id: 'les_20_1_1',
            title: 'Ebook Principal - Passo a Passo IRPF',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Códigos exatos de bens, direitos e rendimentos isentos para cada tipo de ativo nacional e exterior.',
            materials: [{ name: 'Baixar Manual Explicativo IRPF pdf', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_21',
    title: 'Célula de Vendas: Como Contratar SDRs',
    description: 'O playbook completo de Inside Sales para empresas. Como estruturar, organizar, motivar e escalar faturamento de auto-tickets usando times integrados de pré-vendas.',
    price: 497.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 24,
    category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1552581234-2612b75d8953?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 57,
    modules: [
      {
        id: 'mod_21_1',
        title: 'Módulo Inicial: Playbook Comercial',
        lessons: [
          {
            id: 'les_21_1_1',
            title: '1.1 Definição de ICP e Scripts de Qualificação Telefônica',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '18:55',
            completed: false,
            description: 'Como filtrar compradores frios de interessados quentes rapidamente sem gastar precioso tempo de reuniões.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_22',
    title: 'Desperte seu Potencial: O Poder do Hábito Consciente',
    description: 'Aprenda a mapear seus gatilhos mentais diários, eliminar a procrastinação e instalar rotinas de alta performance de forma simples e científica.',
    price: 47.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 39,
    category: 'Desenvolvimento pessoal',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 140,
    modules: [
      {
        id: 'mod_22_1',
        title: 'Módulo Único: Guia Completo',
        lessons: [
          {
            id: 'les_22_1_1',
            title: 'Ebook Digital - O Poder do Hábito Consciente (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Manual de bolso contendo as 5 chaves para reprogramação de hábitos destrutivos.',
            materials: [{ name: 'Baixar Ebook PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_23',
    title: 'Mindset Vencedor: Reprogramação Mental Ativa',
    description: 'Transforme por completo sua forma de encarar desafios. Treinamentos práticos de neurolinguística aplicados para destravar metas financeiras e de carreira.',
    price: 197.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 65,
    category: 'Desenvolvimento pessoal',
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 220,
    modules: [
      {
        id: 'mod_23_1',
        title: 'Módulo 1: A Neurociência por Trás das Crenças',
        lessons: [
          {
            id: 'les_23_1_1',
            title: '1.1 Identificando e Destruindo Crenças Limitantes',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '18:15',
            completed: false,
            description: 'Como nosso cérebro codifica memórias negativas e como neutralizá-las em 3 etapas simples.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_24',
    title: 'Comunicação Magnética: Liderança e Oratória',
    description: 'Perca o medo de falar em público. Domine gestos, tom de voz, gatilhos de storytelling e técnicas corporais das pessoas mais persuasivas do mundo.',
    price: 347.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 60,
    status: 'active',
    rating: 4.8,
    ratingCount: 78,
    category: 'Desenvolvimento pessoal',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 310,
    modules: [
      {
        id: 'mod_24_1',
        title: 'Módulo 1: Domínio da Presença Cênica',
        lessons: [
          {
            id: 'les_24_1_1',
            title: '1.1 Controle de Respiração e Redução do Nervosismo',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '21:10',
            completed: false,
            description: 'Técnicas de respiração diafragmática usadas por oradores profissionais antes de palestras para milhares.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_25',
    title: 'Mentoria Exclusiva: Inteligência Emocional Aplicada',
    description: 'Seja mentorado em reuniões individuais para gerir seu estresse, regular reações impulsivas e se impor de forma assertiva e resiliente no ambiente corporativo.',
    price: 1497.00,
    type: 'mentorship',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 30,
    status: 'active',
    rating: 5.0,
    ratingCount: 19,
    category: 'Desenvolvimento pessoal',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 38,
    modules: [
      {
        id: 'mod_25_1',
        title: 'Fase de Alinhamento Estratégico',
        lessons: [
          {
            id: 'les_25_1_1',
            title: 'Como Realizar seu Mapeamento de Reatividade Quotidiana',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '11:45',
            completed: false,
            description: 'O material necessário para preencher antes de nossa primeira call ao vivo.',
            materials: [{ name: 'Planilha de Atividades Emocionais xls', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_26',
    title: 'Método Estudante de Elite: Memorização Ativa',
    description: 'Guia de bolso indispensável para acelerar seus estudos. Estruturas de resumos ativos, técnicas flashcards e sistemas de repetição espaçada.',
    price: 39.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 45,
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 198,
    modules: [
      {
        id: 'mod_26_1',
        title: 'Manual Prático',
        lessons: [
          {
            id: 'les_26_1_1',
            title: 'Ebook Completo - Memorização Ativa (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Como configurar o sistema Anki para memorizar fórmulas, conceitos e regras gramaticais.',
            materials: [{ name: 'Download PDF do Método', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_27',
    title: 'Didática Excepcional e Oratória para Professores',
    description: 'Aprenda a reter o foco de turmas difíceis, desenhar planos de aula apaixonantes e usar ferramentas digitais modernas para se destacar na profissão.',
    price: 197.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 31,
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 104,
    modules: [
      {
        id: 'mod_27_1',
        title: 'Módulo 1: Pedagogia Ativa e Dinâmicas em Grupo',
        lessons: [
          {
            id: 'les_27_1_1',
            title: '1.1 A Fórmula de Engajamento das Gamificações de Sala',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '14:50',
            completed: false,
            description: 'Como iniciar uma aula gerando dúvida produtiva e despertando a atenção de imediato.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_28',
    title: 'Matemática Descomplicada: Do Zero à Aprovação',
    description: 'Prepare-se para o ENEM e concursos públicos sem traumas. Todo conteúdo de lógica, álgebra, geometria e estatística explicado passo a passo com exercícios práticos resolvidos.',
    price: 149.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 112,
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 450,
    modules: [
      {
        id: 'mod_28_1',
        title: 'Módulo 1: Lógica Matemática e Aritmética Avançada',
        lessons: [
          {
            id: 'les_28_1_1',
            title: '1.1 Razão, Proporção e Regra de Três sem Complicação',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '22:30',
            completed: false,
            description: 'Como simplificar problemas complexos de proporção em questões rápidas de 1 minuto.',
            materials: [{ name: 'Lista de Exercícios Práticos (PDF)', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_29',
    title: 'Escrita Científica de Alto Impacto',
    description: 'O manual focado para você estruturar artigos acadêmicos nota 10, monografias, TCCs e teses científicas sem estresse e no padrão correto de formatação.',
    price: 49.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.6,
    ratingCount: 22,
    category: 'Educação',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 121,
    modules: [
      {
        id: 'mod_29_1',
        title: 'Manual de Escrita',
        lessons: [
          {
            id: 'les_29_1_1',
            title: 'Manual Completo - Redação Científica Prática (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Métodos para buscar referências confiáveis e citar no padrão correto de maneira automatizada.',
            materials: [{ name: 'Acessar Livro Completo PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_30',
    title: 'Espanhol Fluente em 12 Semanas',
    description: 'Esqueça os cursinhos de anos. Método de imersão focado em conversações práticas cotidianas, vocabulário essencial e fluidez imediata.',
    price: 247.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 56,
    category: 'Idiomas',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 195,
    modules: [
      {
        id: 'mod_30_1',
        title: 'Módulo 1: Fonética e Ganchos Iniciais de Conversação',
        lessons: [
          {
            id: 'les_30_1_1',
            title: '1.1 Pronúncia Prática de Vogais e Diálogos de Sobrevivência',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '15:20',
            completed: false,
            description: 'Principais regionalismos a evitar e como parecer um falante nativo desde os primeiros minutos.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_31',
    title: 'Italiano para Viagens: Guia de Sobrevivência',
    description: 'Livro digital ilustrado focado na terminologia essencial de turismo: compreensão de cardápios, direções de transporte, hotelaria e saudações cativantes.',
    price: 29.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 18,
    category: 'Idiomas',
    image: 'https://images.unsplash.com/photo-1520117009329-30ecb8e43c1e?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 88,
    modules: [
      {
        id: 'mod_31_1',
        title: 'Ebook Digital de Linguagem Básica',
        lessons: [
          {
            id: 'les_31_1_1',
            title: 'Guia Completo de Expressões Italianas de Viagem (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Lista completa de diálogos rápidos traduzidos e com guia fonético inteligível.',
            materials: [{ name: 'Fazer Download do Guia PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_32',
    title: 'Assinatura Semanal Clube do Francês Prático',
    description: 'Grupo fechado com bate-papos semanais supervisionados por professores nativos para você desenvolver conversação em tempo real de forma natural e sem timidez.',
    price: 29.90,
    type: 'subscription',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 40,
    status: 'active',
    rating: 4.9,
    ratingCount: 34,
    category: 'Idiomas',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 154,
    modules: [
      {
        id: 'mod_32_1',
        title: 'Materiais da Semana e Agendamento',
        lessons: [
          {
            id: 'les_32_1_1',
            title: 'Instruções para Selecionar sua Sala de Meeting Semanal',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '09:12',
            completed: false,
            description: 'Como reservar seu horário no bate-papo de quarta ou sábado de forma simples.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_33',
    title: 'Pilates em Casa para Alívio de Dores',
    description: 'Exercícios fluidos, focados na ativação do centro de força abdominal (powerhouse) para alongar, corrigir sua postura e eliminar dores nas costas e articulações de forma definitiva.',
    price: 129.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 51,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 165,
    modules: [
      {
        id: 'mod_33_1',
        title: 'Módulo 1: Fortalecimento Postural do Core',
        lessons: [
          {
            id: 'les_33_1_1',
            title: '1.1 Respiração Correta e Ativação do Powerhouse',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '16:10',
            completed: false,
            description: 'O princípio essencial do pilates para proteger as vértebras lombares em qualquer exercício.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_34',
    title: 'Guia Nutricional da Hipertrofia Limpa',
    description: 'Livro digital de receitas macros calculadas. Aprenda a programar refeições saborosas de altíssimo valor biológico para ganhar massa magra sem acumular gordura.',
    price: 37.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 64,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 280,
    modules: [
      {
        id: 'mod_34_1',
        title: 'Manual de Macros Diários',
        lessons: [
          {
            id: 'les_34_1_1',
            title: 'Ebook Completo - Dieta Clean Bulking (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'Mais de 40 receitas práticas divididas em shakes anabólicos, lanches proteicos e refeições completas.',
            materials: [{ name: 'Download PDF Nutricional', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_35',
    title: 'Mindfulness para Alívio Imediato do Estresse',
    description: 'Curso prático focado para acalmar o cérebro hiperativo. Exercícios rápidos conduzidos diariamente de 10 minutos para foco concentrado e reequilíbrio emocional.',
    price: 97.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 47,
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 144,
    modules: [
      {
        id: 'mod_35_1',
        title: 'Módulo 1: Técnicas de Ancoragem Ativas',
        lessons: [
          {
            id: 'les_35_1_1',
            title: '1.1 A Respiração Caixa para Controle do Pânico Comercial',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '12:45',
            completed: false,
            description: 'Mapeamento neural imediato para frear picos de cortisol e restaurar clareza de raciocínio.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_36',
    title: 'Assinatura Portal da Saúde Integral Sem Limites',
    description: 'Seu portal de bem-estar. Planos nutricionais sazonais, treinos regenerativos e mentorias mensais ao vivo focado em longevidade sustentável de alta resistência.',
    price: 49.95,
    type: 'subscription',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 40,
    status: 'active',
    rating: 4.8,
    ratingCount: 39,
    category: 'Saúde',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 167,
    modules: [
      {
        id: 'mod_36_1',
        title: 'Membros: Portal Rápido',
        lessons: [
          {
            id: 'les_36_1_1',
            title: '1.1 Manual de Alimentação Desintoxicante de Junho',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '11:40',
            completed: false,
            description: 'Calendário de rotinas semanais completas e planejadores detox integrados.',
            materials: [{ name: 'Baixar Cardápio PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_37',
    title: 'Aposentadoria Próspera com Fundos Imobiliários',
    description: 'Crie um fluxo mensal previsível de renda livre de imposto. O método completo para analisar carteiras de FIIs, avaliar segurança do ativo e reinvestir dividendos recursivos.',
    price: 247.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 95,
    category: 'Finanças',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 312,
    modules: [
      {
        id: 'mod_37_1',
        title: 'Módulo 1: Desvendando Dividend Yield e Lajes Corporativas',
        lessons: [
          {
            id: 'les_37_1_1',
            title: '1.1 O que Mapear de Vacância e Multi-inquilinos',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '19:40',
            completed: false,
            description: 'Como evitar perdas de proventos mapeando riscos de saída de locatários relevantes nos galpões e shoppings.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_38',
    title: 'Criptomoedas do Zero: Guia Estratégico',
    description: 'Ebook completo e dinâmico sobre ativos descentralizados. Aprenda a criar wallets frias de forma segura, avaliar tokens com bons fundamentos e diversificar com controle de perdas.',
    price: 49.00,
    type: 'ebook',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.7,
    ratingCount: 38,
    category: 'Finanças',
    image: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 201,
    modules: [
      {
        id: 'mod_38_1',
        title: 'Guia Completo Cripto',
        lessons: [
          {
            id: 'les_38_1_1',
            title: 'Manual Completo - Cripto sem Complicações (PDF)',
            videoUrl: '',
            duration: 'Ebook',
            completed: false,
            description: 'As principais corretoras fiáveis e passo de proteção pessoal contra criminosos virtuais.',
            materials: [{ name: 'Download Manual Cripto PDF', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_39',
    title: 'Estratégia Growth Hacking Comercial para Empresas',
    description: 'Descubra como injetar velocidade nas suas vendas através de experimentações contínuas, táticas psicológicas de engajamento e canais robustos e escaláveis de escala orgânica.',
    price: 297.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.8,
    ratingCount: 39,
    category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 112,
    modules: [
      {
        id: 'mod_39_1',
        title: 'Módulo 1: O Funil de Pirata e Taxas de Retenção',
        lessons: [
          {
            id: 'les_39_1_1',
            title: '1.1 Métricas Norte da Startup e Aceleração de Ativação',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '21:10',
            completed: false,
            description: 'Como convencer o Lead frio a testar seu recurso principal na primeira visita sem assustá-lo.',
            materials: []
          }
        ]
      }
    ]
  },
  {
    id: 'prod_40',
    title: 'Mentoria Vip: Liderança Excepcional em Startups',
    description: 'Encontros diretos e quinzenais focados em alinhar sua governança, estruturar OKRs ambiciosos, recrutar talentos e liderar equipes de alto rendimento tecnológico.',
    price: 1997.00,
    type: 'mentorship',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 30,
    status: 'active',
    rating: 5.0,
    ratingCount: 14,
    category: 'Negócios',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 29,
    modules: [
      {
        id: 'mod_40_1',
        title: 'Liderança Estratégica: Alinhamento',
        lessons: [
          {
            id: 'les_40_1_1',
            title: 'Instruções Iniciais e Mapeamento Organizacional de OKRs',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '11:40',
            completed: false,
            description: 'Formulários táticos de metas corporativas para preenchimento de nossa primeira consultoria vip.',
            materials: [{ name: 'Análise de Desempenho Interno xls', url: '#' }]
          }
        ]
      }
    ]
  },
  {
    id: 'prod_41',
    title: 'Inteligência Artificial Aplicada no Dia a Dia Profissional',
    description: 'Não seja substituído por um robô, treine um! Aprenda a modelar assistentes personalizados de escrita, automatizar processos chatos e economizar 10h mensais usando prompts corretos.',
    price: 147.00,
    type: 'course',
    creatorId: 'usr_producer',
    creatorName: 'Roberto Shinyashiki',
    commission: 50,
    status: 'active',
    rating: 4.9,
    ratingCount: 78,
    category: 'Tecnologia',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    enrolledCount: 254,
    modules: [
      {
        id: 'mod_41_1',
        title: 'Módulo 1: Engenharia Prática de Contextos e Papéis',
        lessons: [
          {
            id: 'les_41_1_1',
            title: '1.1 Estruturando Chamados de Feedback e Triagens de Emails',
            videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '19:10',
            completed: false,
            description: 'Instruções para ensinar a IA a sintetizar longos e-mails e redigir propostas com o seu tom de escrita corporativa.',
            materials: []
          }
        ]
      }
    ]
  }
];

export const DEFAULT_SALES: Sale[] = [
  {
    id: 'sale_1',
    productId: 'prod_1',
    productTitle: 'SaaS Builder: Next.js & Inteligência Artificial',
    productImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    amount: 397.00,
    buyerName: 'Carlos Eduardo Oliveira',
    buyerEmail: 'carlosedu@hotmail.com',
    status: 'completed',
    paymentMethod: 'pix',
    creatorCommission: 158.80, // Roberto
    affiliateCommission: 238.20, // Rafaela (60%)
    affiliateId: 'usr_affiliate',
    date: '2026-06-05T14:32:00Z',
  },
  {
    id: 'sale_2',
    productId: 'prod_2',
    productTitle: 'Copywriting de Alta Conversão: Guia Supremo',
    productImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    amount: 97.00,
    buyerName: 'Juliana Pimentel',
    buyerEmail: 'jupimentel@gmail.com',
    status: 'completed',
    paymentMethod: 'credit_card',
    creatorCommission: 48.50,
    affiliateCommission: 48.50, // Rafaela (50%)
    affiliateId: 'usr_affiliate',
    date: '2026-06-05T11:15:00Z',
  },
  {
    id: 'sale_3',
    productId: 'prod_1',
    productTitle: 'SaaS Builder: Next.js & Inteligência Artificial',
    productImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    amount: 397.00,
    buyerName: 'Antônio de Souza',
    buyerEmail: 'antonio.souza@outlook.com',
    status: 'completed',
    paymentMethod: 'credit_card',
    creatorCommission: 397.00, // Sem afiliado, 100% produtor
    affiliateCommission: 0.00,
    affiliateId: null,
    date: '2026-06-04T18:40:00Z',
  },
  {
    id: 'sale_4',
    productId: 'prod_3',
    productTitle: 'Assinatura Comunidade Investidor Próspero',
    productImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
    amount: 49.90,
    buyerName: 'Kátia Regina Santos',
    buyerEmail: 'katia_reg1n4@uol.com',
    status: 'completed',
    paymentMethod: 'paypal',
    creatorCommission: 29.94,
    affiliateCommission: 19.96, // Rafaela (40%)
    affiliateId: 'usr_affiliate',
    date: '2026-06-03T09:22:00Z',
  },
  {
    id: 'sale_5',
    productId: 'prod_4',
    productTitle: 'Mentoria Vip: Lançamentos Digitais de 7 Dígitos',
    productImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    amount: 1997.00,
    buyerName: 'Felipe Montenegro Neto',
    buyerEmail: 'felipe@fmontenegrocoding.com',
    status: 'completed',
    paymentMethod: 'boleto',
    creatorCommission: 1997.00, // Sem afiliado
    affiliateCommission: 0.00,
    affiliateId: null,
    date: '2026-06-02T15:01:00Z',
  },
  {
    id: 'sale_6',
    productId: 'prod_2',
    productTitle: 'Copywriting de Alta Conversão: Guia Supremo',
    productImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    amount: 97.00,
    buyerName: 'Gustavo Henrique Marques',
    buyerEmail: 'gustavo.marques@gmail.com',
    status: 'pending',
    paymentMethod: 'pix',
    creatorCommission: 48.50,
    affiliateCommission: 48.50,
    affiliateId: 'usr_affiliate',
    date: '2026-06-05T17:12:00Z',
  },
  {
    id: 'sale_default_bruno_1',
    productId: 'prod_1',
    productTitle: 'SaaS Builder: Next.js & Inteligência Artificial',
    productImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    amount: 397.00,
    buyerName: 'Bruno Meireles (Estudante)',
    buyerEmail: 'bruno@coldmart.com.br',
    status: 'completed',
    paymentMethod: 'credit_card',
    creatorCommission: 397.00,
    affiliateCommission: 0.00,
    affiliateId: null,
    date: '2026-06-04T12:00:00Z',
  },
  {
    id: 'sale_default_bruno_2',
    productId: 'prod_2',
    productTitle: 'Copywriting de Alta Conversão: Guia Supremo',
    productImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    amount: 97.00,
    buyerName: 'Bruno Meireles (Estudante)',
    buyerEmail: 'bruno@coldmart.com.br',
    status: 'completed',
    paymentMethod: 'credit_card',
    creatorCommission: 97.05,
    affiliateCommission: 0.00,
    affiliateId: null,
    date: '2026-06-04T12:30:00Z',
  }
];

export const DEFAULT_AFFILIATIONS: AffiliationRule[] = [
  {
    id: 'aff_1',
    affiliateId: 'usr_affiliate',
    productId: 'prod_1',
    productTitle: 'SaaS Builder: Next.js & Inteligência Artificial',
    productPrice: 397.00,
    commissionPercent: 60,
    linkCode: 'NEXT60AI',
    clicks: 1420,
    salesCount: 1,
    earnings: 238.20,
  },
  {
    id: 'aff_2',
    affiliateId: 'usr_affiliate',
    productId: 'prod_2',
    productTitle: 'Copywriting de Alta Conversão: Guia Supremo',
    productPrice: 97.00,
    commissionPercent: 50,
    linkCode: 'COPYSUPR',
    clicks: 580,
    salesCount: 1,
    earnings: 48.50,
  },
  {
    id: 'aff_3',
    affiliateId: 'usr_affiliate',
    productId: 'prod_3',
    productTitle: 'Assinatura Comunidade Investidor Próspero',
    productPrice: 49.90,
    commissionPercent: 40,
    linkCode: 'COMMUNIPRO',
    clicks: 340,
    salesCount: 1,
    earnings: 19.96,
  }
];

export const DEFAULT_TICKETS: Ticket[] = [
  {
    id: 'tick_1',
    userEmail: 'bruno@coldmart.com.br',
    userName: 'Bruno Meireles',
    subject: 'Como acessar materiais extras no Módulo 2?',
    status: 'open',
    category: 'access',
    date: '2026-06-05T10:00:00Z',
    messages: [
      {
        id: 'msg_1_1',
        sender: 'user',
        text: 'Olá, comprei o SaaS Builder ontem, achei incrível! Mas não consigo encontrar o arquivo xls/pdf referenciado na segunda aula do módulo 2. Alguma dica?',
        date: '2026-06-05T10:00:00Z'
      },
      {
        id: 'msg_1_2',
        sender: 'support',
        text: 'Olá, Bruno! Que ótimo saber que está gostando do material. No reprodutor de vídeos da Área de Membros, logo abaixo do conteúdo, há uma aba dedicada chamada "Materiais de Apoio". Lá você encontrará todos os PDFs e swipes para download!',
        date: '2026-06-05T12:30:00Z'
      }
    ]
  },
  {
    id: 'tick_2',
    userEmail: 'trabalhoseatividadesdaestacio@gmail.com',
    userName: 'Estudante Coldmart',
    subject: 'Dúvida sobre taxa de comissão para afiliação',
    status: 'open',
    category: 'partnership',
    date: '2026-06-05T15:20:00Z',
    messages: [
      {
        id: 'msg_2_1',
        sender: 'user',
        text: 'Gostaria de saber se a Coldmart retém alguma taxa sobre saques das nossas comissões de afiliados, ou se o repasse é 100% livre?',
        date: '2026-06-05T15:20:00Z'
      }
    ]
  }
];

export const DEFAULT_PAGES: LandingPage[] = [
  {
    id: 'page_prod_1',
    productId: 'prod_1',
    theme: 'cosmic',
    sections: [
      {
        id: 'sec_1',
        type: 'hero',
        content: {
          title: 'Domine Next.js e IA para Construir Aplicativos SaaS que Faturam em Dólar',
          description: 'A metodologia passo a passo, do banco de dados ao faturamento global, integrada ao ecossistema de APIs mais inteligente do planeta.',
          ctaText: 'Quero Garantir Minha Vaga',
        }
      },
      {
        id: 'sec_2',
        type: 'features',
        content: {
          title: 'Por que este treinamento é diferente de tudo?',
          description: 'Não focamos em teoria vazia. Você sai deste curso com projetos reais publicados e faturando recursivamente.',
          items: [
            'Arquitetura App Router de altíssima performance no Next.js',
            'Sincronização 100% segura contra falhas de pagamentos recursivos',
            'Modelagem com TypeScript rígido e segurança militar contra ataques',
            'Suporte técnico direto no grupo vip de alunos'
          ]
        }
      },
      {
        id: 'sec_3',
        type: 'testimonials',
        content: {
          title: 'Quem já aprendeu aprova e recomenda',
          description: 'Histórias reais de desenvolvedores e criadores digitais que transformaram suas ideias em software recorrente.',
          items: [
            { name: 'Lucas Vasconcelos', role: 'Fundador do LeadFlow', text: 'Esse curso pagou o investimento nas primeiras duas semanas de vendas no ar. O ecossistema é o segredo!' },
            { name: 'Mariana Duarte', role: 'Dev Full Stack', text: 'Explicação cristalina, impecável nos detalhes de infraestrutura e segurança com os webhooks. Recomendo demais!' }
          ] as any
        }
      },
      {
        id: 'sec_4',
        type: 'faq',
        content: {
          title: 'Perguntas Frequentes',
          description: 'Garantimos todas as respostas para que você entre com total tranquilidade.',
          items: [
            { q: 'Preciso já conhecer TypeScript?', a: 'Conhecimento elementar de JavaScript é suficiente. Começamos com revisões estruturais aceleradas!' },
            { q: 'Existe garantia de arrependimento?', a: 'Sim! Garantia incondicional de 7 dias protegida por criptografia de reembolso da Coldmart.' }
          ] as any
        }
      },
      {
        id: 'sec_5',
        type: 'cta',
        content: {
          title: 'Aproveite o preço promocional antes que as vagas encerrem',
          description: 'Vagas limitadas para acompanhar de perto a evolução técnica de cada turma.',
          ctaText: 'Fazer Minha Matrícula Agora',
        }
      }
    ]
  }
];

export const DEFAULT_TRANSFERS: TransferRequest[] = [
  {
    id: 'trsf_1',
    userId: 'usr_producer',
    userName: 'Roberto Shinyashiki',
    amount: 15400.00,
    status: 'approved',
    pixKey: 'roberto@saaspremium.com',
    date: '2026-06-01T10:00:00Z',
  },
  {
    id: 'trsf_2',
    userId: 'usr_affiliate',
    userName: 'Rafaela Alencar',
    amount: 800.00,
    status: 'pending',
    pixKey: '99988877766',
    date: '2026-06-05T13:45:00Z',
  }
];
