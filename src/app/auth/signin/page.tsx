import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthButtons } from "./components/auth-buttons"

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Card className="w-[400px] bg-zinc-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription className="text-gray-400">
            Elige tu método de autenticación preferido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthButtons />
        </CardContent>
      </Card>
    </div>
  )
} 