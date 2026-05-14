export const DASHBOARD_CONTENT = {
  title: 'Mis Publicaciones',
  description: 'Gestiona tus propiedades y habitaciones publicadas.',
  buttonText: 'Publicar Inmueble',
  emptyStateText: 'No tienes publicaciones',
  emptyStateSubtext: 'Publica tu primera propiedad y conecta con roomies compatibles',
  newPublicationUrl: '/mis-publicaciones/nueva',
} as const;

export const PROPERTY_CARD_CONTENT = {
  status: {
    active: 'Activo',
    draft: 'Borrador',
    paused: 'Pausado',
  },
  menu: {
    view: 'Ver publicación',
    edit: 'Editar',
    pause: 'Pausar',
    activate: 'Activar',
    delete: 'Eliminar',
  },
  pricePerMonth: '/mes',
  publishedPrefix: 'Publicado el',
} as const;