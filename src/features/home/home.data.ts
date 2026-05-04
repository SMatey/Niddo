export const HOME_DATA = {
  featured_properties: {
    title: 'Propiedades destacadas',
    description: 'Explora las mejores opciones disponibles',
    viewAllLabel: 'Ver todos',
    pageSize: 3,
    itemsToShow: 3,
    viewAllHref: '/explorar?tipo=vivienda',
  },
  featured_roomies: {
    title: 'Conoce a los roomies',
    description: 'Personas verificadas buscando vivienda compartida',
    viewAllLabel: 'Ver todos',
    pageSize: 4,
    itemsToShow: 4,
    viewAllHref: '/explorar?tipo=roomie',
    cta: {
      title: '¿Listo para encontrar tu match?',
      subtitle: 'Únete a miles de personas que ya encontraron su roomie o vivienda ideal',
      searchButtonLabel: 'Empezar a buscar',
      publishButtonLabel: 'Publicar mi espacio',
    },
    loginPrompt: {
      title: 'Mis Publicaciones',
      description: 'Inicia sesión para gestionar tus propiedades publicadas',
      loginButtonLabel: 'Iniciar Sesión',
    },
  },
  search_bar: {
    typeOptions: {
      vivienda: 'Busco Vivienda',
      roomie: 'Busco Roomie',
    },
    placeholder: 'Ciudad, zona o colonia...',
    searchButtonLabel: 'Buscar',
  },
  hero: {
    title: 'Encuentra tu ',
    titleHighlight: 'roomie ideal',
    titleEnd: ' o vivienda perfecta',
    description: 'Publica tu espacio o encuentra el lugar perfecto para vivir.',
  },
} as const
