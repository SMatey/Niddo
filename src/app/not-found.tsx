import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <h2>404 — Página no encontrada</h2>
      <Link href="/">Volver al inicio</Link>
    </main>
  )
}
