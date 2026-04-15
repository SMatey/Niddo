import { PublicNavbar } from '@/components/layout/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  )
}
