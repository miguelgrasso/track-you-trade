import { NextResponse } from "next/server"
import { signUpUser } from "@/lib/cognito"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Registrar usuario en Cognito
    const response = await signUpUser(email, password)

    return NextResponse.json(
      { 
        message: "Usuario registrado exitosamente",
        userSub: response.UserSub,
        userConfirmed: response.UserConfirmed
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error en el registro:", error)
    
    // Manejar errores específicos de Cognito
    if (error.name === "UsernameExistsException") {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 400 }
      )
    }
    
    if (error.name === "InvalidPasswordException") {
      return NextResponse.json(
        { message: "La contraseña no cumple con los requisitos mínimos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Error al registrar usuario" },
      { status: 500 }
    )
  }
} 