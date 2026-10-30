/**
 * Traduções globais compartilhadas por todas as páginas.
 * Antes cada página tinha sua própria cópia parcial e inconsistente.
 */
export const translations = {
  pt: {
    // Header / Nav
    headerWork: 'TRABALHO',
    headerAbout: 'SOBRE',
    headerBlog: 'BLOG',
    headerChat: 'FALE COMIGO',

    // Hero - luxjson
    heroTitle: 'SUA VISÃO CONSTRÓI NOSSA HISTÓRIA.',
    workTag: 'TRABALHO',
    workDesc:
      'SOU UM <span class="sh-h-word">DESENVOLVEDOR WEB JÚNIOR</span>, APAIXONADO POR TRANSFORMAR IDEIAS EM REALIDADE.',
    aboutTitle: 'DESENVOLVIMENTO INTELIGENTE',
    aboutDesc:
      'Especializado em construir sistemas de alto desempenho e experiências digitais que superam expectativas.',

    // Blog
    blogHeroTitle: 'BLOG',
    blogHeroSub: 'FIQUE POR DENTRO DAS NOVIDADES E ARTIGOS',
    noPosts: 'Nenhum post publicado ainda.',
    errorLoadingPosts: 'Não foi possível carregar as publicações. Tente novamente.',
    readMore: 'Ler mais',

    // BlogPost
    backToBlog: 'Voltar ao Blog',
    notFound: 'Post não encontrado.',
    errorLoading: 'Erro ao carregar o post.',
    readingTime: 'min de leitura',
    views: 'visualizações',

    // Footer
    footerSub: 'SUA VISÃO CONSTRÓI NOSSA HISTÓRIA',

    // Contact modal
    chatTitle: 'ENTRE EM CONTATO',
    chatName: 'NOME',
    chatEmail: 'EMAIL',
    chatSubject: 'ASSUNTO',
    chatMessage: 'MENSAGEM',
    chatSend: 'ENVIAR MENSAGEM',
    chatSending: 'ENVIANDO...',
    chatSent: 'ENVIADO COM SUCESSO.',
    chatError: 'ERRO. TENTE NOVAMENTE.',
    chatPlaceholderName: 'Seu nome',
    chatPlaceholderSubject: 'Sobre o que é?',
    chatPlaceholderMsg: 'Sua mensagem...',

    // Info drawer
    infoTitle: 'INFORMAÇÕES',
    infoMade: 'Feito por',
    infoRepo: 'Ver repositório',

    // Project modal
    modalClose: 'Fechar',
    modalNoDesc: 'Sem descrição disponível no GitHub.',
    modalStars: 'Estrelas',
    modalForks: 'Forks',
    modalIssues: 'Issues',
    modalUpdated: 'Atualizado',
    modalViewGit: 'Ver no GitHub',
    modalAccess: 'Acessar Projeto',
    modalDemo: 'Acessar Demo',
    modalRepo: 'Ver Repositório',
    modalTopics: 'Tópicos',
    noProjects: 'Nenhum projeto encontrado.',

    // App banner
    appBannerTitle: 'Baixe o aplicativo luxjson',
    appBannerDesc: 'Baixe a versão mais recente do aplicativo luxjson para dispositivos móveis.',
    appBannerBtn: 'Baixar Última Versão',

    // Cards
    clickToSeeDetails: 'Clique para ver detalhes',
    clickToRead: 'Clique para ler',

    // GitHub stats
    repositories: 'repositórios',
    followers: 'seguidores',
  },

  en: {
    // Header / Nav
    headerWork: 'WORK',
    headerAbout: 'ABOUT',
    headerBlog: 'BLOG',
    headerChat: "LET'S CHAT",

    // Hero - luxjson
    heroTitle: 'YOUR VISION BUILDS OUR HISTORY.',
    workTag: 'WORK',
    workDesc:
      'I AM A JUNIOR <span class="sh-h-word">WEB DEVELOPER</span>, PASSIONATE ABOUT TURNING IDEAS INTO REALITIES.',
    aboutTitle: 'SMART DEVELOPMENT',
    aboutDesc:
      'Specialized in Building High-Performance Systems and Digital Experiences That Surpass Expectations.',

    // Blog
    blogHeroTitle: 'BLOG',
    blogHeroSub: 'STAY UPDATED WITH NEWS AND ARTICLES',
    noPosts: 'No posts published yet.',
    errorLoadingPosts: 'Could not load posts. Please try again.',
    readMore: 'Read more',

    // BlogPost
    backToBlog: 'Back to Blog',
    notFound: 'Post not found.',
    errorLoading: 'Error loading post.',
    readingTime: 'min read',
    views: 'views',

    // Footer
    footerSub: 'YOUR VISION BUILDS OUR HISTORY',

    // Contact modal
    chatTitle: 'GET IN TOUCH',
    chatName: 'NAME',
    chatEmail: 'EMAIL',
    chatSubject: 'SUBJECT',
    chatMessage: 'MESSAGE',
    chatSend: 'SEND MESSAGE',
    chatSending: 'SENDING...',
    chatSent: 'SENT SUCCESSFULLY.',
    chatError: 'ERROR. TRY AGAIN.',
    chatPlaceholderName: 'Your name',
    chatPlaceholderSubject: 'What is this about?',
    chatPlaceholderMsg: 'Your message...',

    // Info drawer
    infoTitle: 'INFO',
    infoMade: 'Made by',
    infoRepo: 'View repository',

    // Project modal
    modalClose: 'Close',
    modalNoDesc: 'No description available on GitHub.',
    modalStars: 'Stars',
    modalForks: 'Forks',
    modalIssues: 'Issues',
    modalUpdated: 'Updated',
    modalViewGit: 'View on GitHub',
    modalAccess: 'Access Project',
    modalDemo: 'View Demo',
    modalRepo: 'View Repository',
    modalTopics: 'Topics',
    noProjects: 'No projects found.',

    // App banner
    appBannerTitle: 'Get luxjson App',
    appBannerDesc: 'Download the latest version of luxjson app for mobile devices.',
    appBannerBtn: 'Download Latest',

    // Cards
    clickToSeeDetails: 'Click to see details',
    clickToRead: 'Click to read',

    // GitHub stats
    repositories: 'repositories',
    followers: 'followers',
  },
};

/** Helper: retorna tradução ou a chave se não encontrada */
export function createT(language) {
  return (key) => translations[language]?.[key] ?? key;
}
