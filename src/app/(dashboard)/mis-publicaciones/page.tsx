import { useState } from 'react';
import Link from 'next/link';
import { Plus, Building2, Loader2 } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { DASHBOARD_CONTENT } from '@/features/properties/constants/dashboard.constants';
import { DashboardPropertyCard } from '@/features/properties/components/dashboard-property-card';
import { useMyProperties } from '@/features/properties/hooks/use-my-properties';
import type { PropertyStatus } from '@/features/properties/types';

export default function MisPublicacionesPage() {
  const { properties, isLoading, refresh } = useMyProperties();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Lógica para cambiar el estado (Activo <-> Pausado)
  const handleToggleStatus = async (id: string, currentStatus: PropertyStatus) => {
    try {
      setActionLoadingId(id);
      
      const session = await createClient().auth.getSession();
      const token = session.data.session?.access_token;
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const functionUrl = `${supabaseUrl}/functions/v1/property-status-update`;

      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Refresh list to show changes
      refresh();
    } catch (e) {
      console.error("No se pudo cambiar el estado", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Lógica para eliminar la propiedad
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) return;
    
    try {
      setActionLoadingId(id);
      const supabase = createClient();
      
      // Optionally we use property-manage with DELETE or simply property-status-update to 'deleted'
      // Or we can delete it directly if RLS rules allow it
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      refresh();
    } catch (e) {
      console.error("Error al eliminar la propiedad", e);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Section */}
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {DASHBOARD_CONTENT.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {DASHBOARD_CONTENT.description}
          </p>
        </div>
        
        {/* Botón de Acción Principal */}
        <Button className="gap-2 shrink-0" asChild>
          <Link href={DASHBOARD_CONTENT.newPublicationUrl}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {DASHBOARD_CONTENT.buttonText}
          </Link>
        </Button>
      </section>

      {/* Loading state */}
      {isLoading ? (
        <section className="flex min-h-60 flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground text-sm">Cargando publicaciones...</p>
        </section>
      ) : properties.length > 0 ? (
        <section className="flex flex-col gap-5">
          {properties.map((property) => (
            <DashboardPropertyCard
              key={property.id}
              property={property}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        /* Empty State (Estado Vacío) */
        <section className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h3 className="mb-2 text-xl font-medium text-foreground">
            {DASHBOARD_CONTENT.emptyStateText}
          </h3>
          <p className="mb-6 max-w-sm text-muted-foreground">
            {DASHBOARD_CONTENT.emptyStateSubtext}
          </p>
          <Button variant="outline" className="gap-2" asChild>
            <Link href={DASHBOARD_CONTENT.newPublicationUrl}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {DASHBOARD_CONTENT.buttonText}
            </Link>
          </Button>
        </section>
      )}
    </main>
  );
}