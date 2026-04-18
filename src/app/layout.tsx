import "@/shared/styles/globals.css";
import { AuthModalProvider } from "@/shared/providers/AuthModalProvider";
import { AuthModal } from "@/shared/components/modals/AuthModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthModalProvider>
          {children}
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  )
}
