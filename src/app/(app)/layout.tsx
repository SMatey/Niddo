import { Sidebar } from '@/shared/components/Navbar/Sidebar'
import { Navbar } from '@/shared/components/Navbar/Navbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  )
}
