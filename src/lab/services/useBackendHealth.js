import { useEffect, useState } from "react";
import { BASE_URL } from "@/lab/services/api.ts";

/**
 * Consulta GET /health del backend cada 30 s.
 * El Space de Hugging Face se duerme sin uso y tarda en despertar, así que
 * la primera consulta espera hasta 90 s antes de darse por fallida.
 * Devuelve "connecting" | "ok" | "error".
 */
export function useBackendHealth() {
  const [health, setHealth] = useState("connecting");

  useEffect(() => {
    let alive = true;
    let timer;
    const check = async () => {
      const abort = new AbortController();
      const timeout = setTimeout(() => abort.abort(), 90_000);
      try {
        const r = await fetch(`${BASE_URL}/health`, { signal: abort.signal });
        const body = r.ok ? await r.json() : null;
        const loaded = body?.models_loaded && Object.values(body.models_loaded).every(Boolean);
        if (alive) setHealth(r.ok && loaded ? "ok" : "error");
      } catch {
        if (alive) setHealth("error");
      } finally {
        clearTimeout(timeout);
        if (alive) timer = setTimeout(check, 30_000);
      }
    };
    check();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  return health;
}
