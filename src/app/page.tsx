import Link from 'next/link'
import { ROUTES } from '@/shared/constants/routes.constants'

export default function HomePage() {
  return (
    <main>
      <h1>Niddo</h1>
      <p>Encuentra tu roomie ideal.</p>
      <nav>
        <Link href={ROUTES.PUBLIC_LISTINGS}>Ver inmuebles</Link>
        <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
        <Link href={ROUTES.REGISTER}>Registrarse</Link>
      </nav>
    </main>
  )
}
