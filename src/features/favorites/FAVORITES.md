## Integración de Favoritos - Guía de Uso

### Componentes Disponibles

#### 1. **FavoritePropertyButton**
Botón para agregar/remover propiedades de favoritos.

```tsx
import { FavoritePropertyButton } from '@/features/favorites'

<FavoritePropertyButton
  propertyId="prop-123"
  onToggleComplete={(isFavorited) => console.log(isFavorited)}
/>
```

#### 2. **FavoriteProfileButton**
Botón para agregar/remover perfiles de favoritos.

```tsx
import { FavoriteProfileButton } from '@/features/favorites'

<FavoriteProfileButton
  profileId="profile-456"
  onToggleComplete={(isFavorited) => console.log(isFavorited)}
/>
```

#### 3. **useFavorites Hook**
Hook para control manual de favoritos desde componentes cliente.

```tsx
'use client'

import { useFavorites } from '@/features/favorites'

export function MyComponent() {
  const { 
    isFavorited, 
    isLoading, 
    error, 
    togglePropertyFavorite,
    toggleUserFavorite 
  } = useFavorites()

  return (
    <button onClick={() => togglePropertyFavorite('prop-123')}>
      {isLoading ? 'Cargando...' : 'Agregar a Favoritos'}
    </button>
  )
}
```

#### 4. **FavoritesList Component**
Lista de todos los favoritos del usuario con tabs.

```tsx
import { FavoritesList } from '@/features/favorites'

<FavoritesList tab="all" />  // 'all' | 'properties' | 'users'
```

### Funciones de Servicio (Server-Side)

Importar desde `@/features/favorites`:

- `toggleFavoriteProperty(propertyId)` - Toggle favorito de propiedad
- `toggleFavoriteUser(favoritedProfileId)` - Toggle favorito de perfil
- `isPropertyFavorited(propertyId)` - Verificar si propiedad está en favoritos
- `isProfileFavorited(favoritedProfileId)` - Verificar si perfil está en favoritos
- `getFavoriteProperties()` - Obtener todas las propiedades favoritas del usuario
- `getFavoriteProfiles()` - Obtener todos los perfiles favoritos del usuario

### Integración en PropertyCard y UserCard

Reemplazar los callbacks vacíos en los componentes:

```tsx
// Antes:
<FavoriteButton isFavorite={false} onToggle={() => {}} />

// Después:
import { FavoritePropertyButton } from '@/features/favorites'

<FavoritePropertyButton propertyId={property.id} />
```

### Base de Datos

La tabla `favorites` ya está creada con las siguientes columnas:
- `id` (TEXT PRIMARY KEY)
- `profile_id` (TEXT) - Usuario que favorita
- `property_id` (TEXT, nullable) - Propiedad
- `favorited_profile_id` (TEXT, nullable) - Perfil
- `created_at` (TIMESTAMPTZ)

Constraint: Solo puede haber uno de property_id o favorited_profile_id (no ambos)

### Constantes y Mensajes

Todos los strings están centralizados en:
```typescript
import { FAVORITES_LABELS, FAVORITES_MESSAGES } from '@/features/favorites'
```

### Autenticación

Todas las operaciones requieren usuario autenticado. Las funciones retornan valores por defecto si el usuario no está autenticado.
