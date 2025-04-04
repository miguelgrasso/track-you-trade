export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="rounded-lg bg-zinc-900 p-8 text-white">
        <h1 className="text-2xl font-bold">Error de Autenticación</h1>
        <p className="mt-2 text-gray-400">
          Ha ocurrido un error durante el proceso de autenticación. Por favor, intenta nuevamente.
        </p>
        <a
          href="/auth/signin"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Volver al inicio de sesión
        </a>
      </div>
    </div>
  );
} 