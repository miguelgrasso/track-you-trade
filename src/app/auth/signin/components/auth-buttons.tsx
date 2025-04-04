// src/app/auth/signin/components/auth-buttons.tsx
"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function AuthButtonsContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/listTrades", redirect: false })
      .then((result) => {
        if (result?.ok) {
          router.replace("/listTrades")
        }
      })
  }

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setLoginError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setLoginError("Credenciales inválidas")
        return
      }

      if (result?.ok) {
        router.replace("/listTrades")
      }
    } catch (error) {
      setLoginError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full bg-white text-black hover:bg-gray-100"
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Continuar con Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-900 px-2 text-gray-400">
            O continúa con
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
          />
        </div>
        {loginError && (
          <div className="text-red-500 text-sm">{loginError}</div>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión con Email"}
        </Button>
      </form>

      {error === "UserNotFound" && (
        <div className="text-center text-sm text-gray-400">
          <p>No tienes una cuenta registrada.</p>
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-400">
            Regístrate aquí
          </Link>
        </div>
      )}

      <div className="text-center text-sm text-gray-400">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-blue-500 hover:text-blue-400">
          Regístrate
        </Link>
      </div>
    </div>
  )
}

export function AuthButtons() {
  return (
    <Suspense fallback={<div className="space-y-4">
      <Button
        variant="outline"
        className="w-full bg-white text-black hover:bg-gray-100"
        disabled
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        Cargando...
      </Button>
    </div>}>
      <AuthButtonsContent />
    </Suspense>
  )
}