import { createContext, useContext } from "react";

// Prefijo de la ruta privada: todos los enlaces internos se arman con él
export const BaseContext = createContext("");

/** Devuelve una función que antepone la ruta privada: lab("/dashboard") */
export function useLab() {
  const base = useContext(BaseContext);
  return (path) => `${base}${path}`;
}

/** Ruta interna sin el prefijo privado: "/subsistema/corte" */
export function useLabPath(pathname) {
  const base = useContext(BaseContext);
  return pathname.startsWith(base) ? pathname.slice(base.length) || "/" : pathname;
}
