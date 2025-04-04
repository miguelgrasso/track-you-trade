import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { signInWithCognito, createGoogleUserInCognito } from "@/lib/auth"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      // Asegurarse de que las redirecciones sean seguras
      if (url.startsWith(baseUrl)) {
        if (url.includes("/listTrades")) {
          return url
        }
        return `${baseUrl}/listTrades`
      } else if (url.startsWith("http://localhost:3000")) {
        return url
      }
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST }