import Link from 'next/link';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DASHBOARD_CONTENT } from '@/features/properties/constants/dashboard';

export default function MisPublicacionesPage() {
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
        
        {/* Boton de Accion Principal */}
        <Button className="gap-2 shrink-0" asChild>
          <Link href={DASHBOARD_CONTENT.newPublicationUrl}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {DASHBOARD_CONTENT.buttonText}
          </Link>
        </Button>
      </section>

      {/* Empty State (Estado Vacio) */}
      <section className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center shadow-sm">
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

    </main>
  );
}