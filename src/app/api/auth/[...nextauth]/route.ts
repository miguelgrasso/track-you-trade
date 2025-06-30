import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithCognito, createGoogleUserInCognito } from "@/lib/auth-client"
import { getServerConfigSafe } from "@/lib/config"

const serverConfig = getServerConfigSafe();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: serverConfig.googleClientSecret!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        try {
          const result = await signInWithCognito(credentials.email, credentials.password)
          if (result.success) {
            return {
              id: credentials.email,
              email: credentials.email,
              accessToken: result.accessToken,
            }
          }
          return null
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Crear o actualizar usuario en Cognito cuando se inicia sesión con Google
          await createGoogleUserInCognito(user.email!, profile?.sub!)
          return true
        } catch (error) {
          console.error("Error al crear usuario de Google en Cognito:", error)
          return false // No permitir el inicio de sesión si falla la creación en Cognito
        }
      }
      return true
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.provider = token.provider
      return session
    },
    async redirect({ url, baseUrl }) {
      // Lista blanca de URLs permitidas para redirección segura
      const allowedPaths = [
        '/listTrades',
        '/strategies',
        '/confirmations',
        '/auth/signin',
        '/auth/signup'
      ];
      
      // Si la URL empieza con baseUrl, validar que sea una ruta permitida
      if (url.startsWith(baseUrl)) {
        const path = url.replace(baseUrl, '');
        const isAllowedPath = allowedPaths.some(allowedPath => 
          path.startsWith(allowedPath)
        );
        
        if (isAllowedPath) {
          return url;
        }
        return `${baseUrl}/listTrades`;
      }
      
      // En desarrollo, permitir localhost
      if (process.env.NODE_ENV === 'development' && 
          url.startsWith("http://localhost:3000")) {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const isAllowedPath = allowedPaths.some(allowedPath => 
          path.startsWith(allowedPath)
        );
        
        if (isAllowedPath) {
          return url;
        }
      }
      
      // Por defecto, redirigir a la página principal segura
      return `${baseUrl}/listTrades`;
    },
  },
})

export { handler as GET, handler as POST }