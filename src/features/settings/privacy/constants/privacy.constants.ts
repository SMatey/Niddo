import type { PrivacyOption } from '../types/privacy.types'

export const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    id: 'showEmail',
    label: 'Mostrar email',
    description: 'Permite que otros usuarios vean tu correo',
  },
  {
    id: 'showLocation',
    label: 'Mostrar ubicacion',
    description: 'Muestra tu ciudad/zona en tu perfil',
  },
  {
    id: 'allowMessages',
    label: 'Permitir mensajes',
    description: 'Permite que otros usuarios te envien mensajes',
  },
]

export const PRIVACY_DEFAULTS = {
  showPhone: true,
  showEmail: false,
  showLocation: true,
  allowMessages: true,
} as const
