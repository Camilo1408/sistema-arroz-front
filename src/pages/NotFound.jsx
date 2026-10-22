import { Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-start justify-center bg-paper px-6">
      <div className="mx-auto w-full max-w-3xl">
        <p className="font-mono text-sm text-field">Error 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Esta página no está en el lote</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          La dirección que abriste no existe o cambió. Toda la información del proyecto está en la página principal.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-base font-semibold text-paper transition-transform duration-500 ease-fluid hover:-translate-y-0.5 active:translate-y-px"
        >
          <ArrowLeft weight="bold" className="h-4 w-4" />
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
