"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  LineChart, 
  BookOpen, 
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "next-auth/react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin")
    }
  }, [status, router])

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false })
    router.replace("/auth/signin")
  }, [router])

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
        <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800">
          <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-8">My Journal Trading</h2>
            <nav className="space-y-2">
              <Link href="/listTrades" prefetch>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800">
                  <LineChart className="mr-2 h-4 w-4" />
                  Trades
                </Button>
              </Link>
              <Link href="/strategies" prefetch>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Estrategias
                </Button>
              </Link>
              <Link href="/journal" prefetch>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Journal
                </Button>
              </Link>
              <Link href="/settings" prefetch>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-zinc-800">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
              </Link>
            </nav>
          </div>
          <div className="absolute bottom-0 w-64 p-4 border-t border-zinc-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-zinc-800"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 