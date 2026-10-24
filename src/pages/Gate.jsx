import { lazy, Suspense, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound.jsx";

// La interfaz de inferencia vive en una ruta privada que no aparece en
// ningún enlace. El repositorio es público, así que aquí solo se guarda la
// huella SHA-256 del primer segmento de la ruta, nunca la ruta en sí. La
// interfaz se descarga aparte (lazy) solo cuando la huella coincide.
const GATE_SHA256 = "4153f05deced7422769eb96f4f89b4701fa2fa99d92182962920a8e3558ad1b0";

const LabApp = lazy(() => import("@/lab/LabApp.jsx"));

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Gate() {
  const { gate } = useParams();
  const [state, setState] = useState("checking"); // checking | open | closed

  useEffect(() => {
    let alive = true;
    sha256(gate ?? "")
      .then((h) => alive && setState(h === GATE_SHA256 ? "open" : "closed"))
      .catch(() => alive && setState("closed"));
    return () => {
      alive = false;
    };
  }, [gate]);

  if (state === "checking") return null;
  if (state === "closed") return <NotFound />;
  return (
    <Suspense fallback={null}>
      <LabApp base={`/${gate}`} />
    </Suspense>
  );
}
