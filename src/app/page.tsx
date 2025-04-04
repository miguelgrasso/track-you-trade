import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, BookOpen, LineChart, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">My Journal Trading</h1>
          </div>
          <Link href="/auth/signin">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Gestiona tus operaciones de trading con eficiencia
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              My Journal Trading te ayuda a registrar, analizar y mejorar tus operaciones de trading con herramientas profesionales y un seguimiento detallado.
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="gap-2">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <BookOpen className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Journal de Trading</h3>
              <p className="text-muted-foreground">
                Registra tus operaciones con detalles completos y análisis de cada trade.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análisis de Rendimiento</h3>
              <p className="text-muted-foreground">
                Visualiza estadísticas y métricas clave para mejorar tu trading.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <LineChart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Estrategias Personalizadas</h3>
              <p className="text-muted-foreground">
                Crea y gestiona tus propias estrategias de trading con confirmaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para mejorar tu trading?</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a My Journal Trading y comienza a registrar tus operaciones de manera profesional.
          </p>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary" className="gap-2">
              Crear cuenta gratuita
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} My Journal Trading. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
