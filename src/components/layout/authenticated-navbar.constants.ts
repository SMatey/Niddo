export const AUTHENTICATED_NAVBAR_CONFIG = {
  NAVIGATION_LINKS: [
    {
      label: 'Inicio',
      href: '/',
      icon: 'home',
    },
    {
      label: 'Explorar',
      href: '/explorar',
      icon: 'search',
    },
  ],
  MENU_LINKS: [
    {
      label: 'Inicio',
      href: '/',
      icon: 'home',
    },
    {
      label: 'Explorar',
      href: '/explorar',
      icon: 'search',
    },
    {
      label: 'Mensajes',
      href: '/mensajes',
      icon: 'message',
    },
    {
      label: 'Mi Perfil',
      href: '/perfil',
      icon: 'user',
    },
    {
      label: 'Mis Publicaciones',
      href: '/mis-publicaciones',
      icon: 'building',
    },
    {
      label: 'Favoritos',
      href: '/favoritos',
      icon: 'heart',
    },
    {
      label: 'Configuración',
      href: '/configuracion',
      icon: 'settings',
    },
  ],
}

// Mock data
export const CURRENT_USER_MOCK = {
  id: 'user-123',
  name: 'Carlos García',
  email: 'carlos@example.com',
  avatar: 'C',
}

export const NOTIFICATIONS_MOCK = {
  unread_count: 3,
}

export const MESSAGES_MOCK = {
  unread_count: 2,
}
