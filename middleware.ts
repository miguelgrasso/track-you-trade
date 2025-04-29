export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    // Rutas que requieren autenticación
    "/journal/:path*",
    "/listTrades/:path*",
    "/strategies/:path*",
    "/confirmations/:path*",
  ]
} 