"use client";
import { useEffect, useState } from 'react'
import { PropertyPublicationForm } from '@/features/properties/components/property-publication-form'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EditPropertyPage() {
  const params = useParams()
  const id = params.id as string
  
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProperty() {
      if (!id) return;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_amenities (
            amenity_id
          )
        `)
        .eq('id', id)
        .single();
        
      if (!error && data) {
        const mappedData = {
          ...data,
          amenities: data.property_amenities?.map((pa: any) => pa.amenity_id) || []
        }
        setProperty(mappedData)
      }
      setLoading(false)
    }
    
    loadProperty()
  }, [id])

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
        <p className="text-muted-foreground">Cargando datos de la propiedad...</p>
      </main>
    )
  }

  if (!property) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 flex justify-center">
        <p className="text-destructive">Propiedad no encontrada o no autorizada.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <PropertyPublicationForm initialData={property} propertyId={id} />
    </main>
  )
}

