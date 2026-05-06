import type { Property } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    owner_id: 'user-1',
    title: 'Apartamento luminoso en el centro',
    description: 'Hermoso apartamento de 2 habitaciones, amueblado, con excelente iluminación natural y cerca de transporte público. Ideal para estudiantes o jóvenes profesionales.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'],
    price: 15000,
    location: 'Colonia Roma, CDMX',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // Hace 2 días
  },
  {
    id: 'prop-2',
    owner_id: 'user-1',
    title: 'Habitación con baño privado (Pet Friendly)',
    description: 'Se busca roomie para compartir depa de 3 cuartos. El complejo tiene gimnasio, alberca y seguridad 24/7. Se aceptan mascotas pequeñas.',
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    price: 8500,
    location: 'Polanco, CDMX',
    status: 'paused',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // Hace 15 días
  },
  {
    id: 'prop-3',
    owner_id: 'user-1',
    title: 'Loft moderno cerca de la universidad',
    description: 'Espacio abierto de estilo industrial. Faltan pintar algunas paredes, por lo que lo tengo guardado para publicarlo la próxima semana.',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    price: 12000,
    location: 'Coyoacán, CDMX',
    status: 'draft',
    created_at: new Date().toISOString(), // Hoy
  }
];