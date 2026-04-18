import { AuthenticatedNavbar } from '@/components/layout/navbar/authenticated-navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthenticatedNavbar />
      {children}
    </>
  )
}
