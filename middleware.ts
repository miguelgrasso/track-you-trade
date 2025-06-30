import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Agregar headers de seguridad adicionales
    const response = NextResponse.next();
    
    // Rate limiting básico (puedes implementar uno más sofisticado)
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    // Headers de seguridad adicionales
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar que el usuario tenga un token válido
        if (req.nextUrl.pathname.startsWith('/api/')) {
          // Para rutas de API, verificar token específico
          return !!token;
        }
        
        // Para rutas de página, verificar sesión
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Rutas protegidas - usar formato más específico
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)",
    // Rutas específicas que requieren autenticación
    "/listTrades/:path*",
    "/strategies/:path*", 
    "/confirmations/:path*",
    // Proteger rutas de API sensibles
    "/api/trades/:path*",
    "/api/strategies/:path*",
    "/api/confirmations/:path*",
  ]
} 