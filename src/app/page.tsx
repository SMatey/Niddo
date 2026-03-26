import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <h1>Niddo</h1>
      <p>Encuentra tu roomie ideal.</p>
      <nav>
        <Link href="/listings">Ver inmuebles</Link>
        <Link href="/login">Iniciar sesión</Link>
        <Link href="/register">Registrarse</Link>
      </nav>
    </main>
  )
}
