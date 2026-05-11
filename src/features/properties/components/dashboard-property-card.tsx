import Link from 'next/link';
import Image from 'next/image';
import { MapPin, MoreVertical, Eye, Edit2, Pause, Play, Trash2 } from 'lucide-react';

import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

import { PROPERTY_CARD_CONTENT } from '../constants/dashboard.constants';
import type { Property, PropertyStatus } from '../types';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'CRC', 
  maximumFractionDigits: 0,
});

const STATUS_VARIANTS: Record<PropertyStatus, { className?: string; variant?: "secondary" | "default"; label: string }> = {
  active: { className: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200', label: PROPERTY_CARD_CONTENT.status.active },
  paused: { className: 'bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-200', label: PROPERTY_CARD_CONTENT.status.paused },
  draft: { variant: 'secondary', label: PROPERTY_CARD_CONTENT.status.draft },
};

interface DashboardPropertyCardProps {
  property: Property;
  onToggleStatus: (id: string, currentStatus: PropertyStatus) => void;
  onDelete: (id: string) => void;
}

export function DashboardPropertyCard({ 
  property, 
  onToggleStatus, 
  onDelete 
}: DashboardPropertyCardProps) {
  
  const statusConfig = STATUS_VARIANTS[property.status];
  const formattedPrice = currencyFormatter.format(property.price);
  
  const formattedDate = new Date(property.created_at).toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0 flex flex-col sm:flex-row h-full sm:min-h-60">
        
        {/* Contenedor de Imagen */}
        <div className="relative w-full h-56 sm:h-auto sm:w-72 lg:w-80 shrink-0 bg-muted">
          <Image
            src={property.images[0] || '/placeholder-property.jpg'}
            alt={`Imagen de ${property.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        </div>

        {/* Contenedor de Información */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          
          <div className="flex flex-col gap-2">
            {/* Cabecera: Badge y Menú */}
            <div className="flex items-start justify-between">
              <Badge variant={statusConfig.variant || "default"} className={statusConfig.className}>
                {statusConfig.label}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 cursor-pointer text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* ... (Las opciones del menú se mantienen igual) ... */}
                  <DropdownMenuItem asChild>
                    <Link href={`/propiedad/${property.id}`} className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      {PROPERTY_CARD_CONTENT.menu.view}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/mis-publicaciones/editar/${property.id}`} className="cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      {PROPERTY_CARD_CONTENT.menu.edit}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={() => onToggleStatus(property.id, property.status)}
                  >
                    {property.status === 'active' ? (
                      <><Pause className="mr-2 h-4 w-4" /> {PROPERTY_CARD_CONTENT.menu.pause}</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> {PROPERTY_CARD_CONTENT.menu.activate}</>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                    onSelect={() => onDelete(property.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {PROPERTY_CARD_CONTENT.menu.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg text-foreground line-clamp-1" title={property.title}>
                {property.title}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {property.description}
            </p>
          </div>

          {/* Pie: Precio a la izquierda, Fecha a la derecha */}
          <div className="flex items-center justify-between gap-4 mt-auto">
            <div className="font-semibold text-primary text-xl">
              {formattedPrice}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {PROPERTY_CARD_CONTENT.pricePerMonth}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {PROPERTY_CARD_CONTENT.publishedPrefix} {formattedDate}
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}