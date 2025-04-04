import { NextResponse } from "next/server"
import { signInUser } from "@/lib/cognito"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Iniciar sesión con Cognito
    const response = await signInUser(email, password)

    return NextResponse.json(
      { 
        message: "Inicio de sesión exitoso",
        tokens: {
          accessToken: response.AuthenticationResult?.AccessToken,
          idToken: response.AuthenticationResult?.IdToken,
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error en el inicio de sesión:", error)
    
    // Manejar errores específicos de Cognito
    if (error.name === "UserNotFoundException") {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }
    
    if (error.name === "NotAuthorizedException") {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { message: "Error al iniciar sesión" },
      { status: 500 }
    )
  }
} 