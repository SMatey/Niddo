export default function EditListingPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main>
      <h1>Editar inmueble {params.id}</h1>
    </main>
  )
}
