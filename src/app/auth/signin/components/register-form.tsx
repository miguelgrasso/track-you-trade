"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { signUpWithCognito } from "@/lib/auth"

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/listTrades" })
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const result = await signUpWithCognito(email, password)
      
      if (result.success) {
        // Si el registro fue exitoso, iniciar sesión automáticamente
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (signInResult?.error) {
          throw new Error("Error al iniciar sesión automáticamente")
        }

        router.push("/listTrades")
      }
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        setError("El email ya está registrado")
      } else if (error.name === "InvalidPasswordException") {
        setError("La contraseña no cumple con los requisitos mínimos")
      } else {
        setError("Error al registrar usuario")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px] bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Registro</CardTitle>
        <CardDescription className="text-gray-400">
          Crea una cuenta para comenzar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-white text-black hover:bg-gray-100"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Registrarse con Google
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

          <form onSubmit={onSubmit} className="space-y-4">
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
                minLength={8}
              />
              <p className="text-xs text-gray-400">
                La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse con Email"}
            </Button>
            <div className="text-center text-sm text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <a href="/auth/signin" className="text-blue-500 hover:text-blue-400">
                Inicia sesión
              </a>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
} 