"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useCallback, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  Settings,
  LogOut,
  CheckCircle,
  Menu
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin")
    }
  }, [status, router])

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    // Inicializar al cargar
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false })
    router.replace("/auth/signin")
  }, [router])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  if (status === "loading") {
    return <div>Cargando...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} min-h-screen bg-zinc-900 border-r border-zinc-800 transition-all duration-300`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              {!sidebarCollapsed && <h2 className="text-xl font-bold text-white">My Journal Trading</h2>}
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Link href="/listTrades" prefetch>
                <Button variant="ghost" className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} text-white hover:bg-zinc-800`}>
                  <LineChart className={`${sidebarCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  {!sidebarCollapsed && "Trades"}
                </Button>
              </Link>
              <Link href="/strategies" prefetch>
                <Button variant="ghost" className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} text-white hover:bg-zinc-800`}>
                  <LayoutDashboard className={`${sidebarCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  {!sidebarCollapsed && "Estrategias"}
                </Button>
              </Link>
              <Link href="/confirmations" prefetch>
                <Button variant="ghost" className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} text-white hover:bg-zinc-800`}>
                  <CheckCircle className={`${sidebarCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  {!sidebarCollapsed && "Confirmaciones"}
                </Button>
              </Link>
              <Link href="/settings" prefetch>
                <Button variant="ghost" className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} text-white hover:bg-zinc-800`}>
                  <Settings className={`${sidebarCollapsed ? '' : 'mr-2'} h-4 w-4`} />
                  {!sidebarCollapsed && "Configuración"}
                </Button>
              </Link>
            </nav>
          </div>
          <div className={`absolute bottom-0 ${sidebarCollapsed ? 'w-16' : 'w-64'} p-3 border-t border-zinc-800 bg-zinc-900 h-14 flex items-center`}>
            <Button 
              variant="ghost" 
              className={`w-full justify-${sidebarCollapsed ? 'center' : 'start'} text-white hover:bg-zinc-800`}
              onClick={handleSignOut}
            >
              <LogOut className={`${sidebarCollapsed ? '' : 'mr-2'} h-4 w-4`} />
              {!sidebarCollapsed && "Cerrar Sesión"}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 