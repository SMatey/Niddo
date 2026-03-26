export default function PublicListingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      <h1>Inmueble {params.id}</h1>
    </main>
  )
}
