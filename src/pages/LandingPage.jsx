import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wheat,
  Cpu,
  BarChart3,
  Leaf,
  ShieldCheck,
  Zap,
  ChevronRight,
  ArrowRight,
  Activity,
  Camera,
  AlertTriangle,
  TrendingUp,
  CircleDot,
  Gauge,
  Layers,
  Globe,
  Award,
  Wind,
  Droplets,
  Sun,
  CheckCircle2,
  Menu,
  X,
  Star,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Sistema", href: "#sistema" },
  { label: "Subsistemas", href: "#subsistemas" },
  { label: "Tecnología", href: "#tecnologia" },
  { label: "Sostenibilidad", href: "#sostenibilidad" },
];

const STATS = [
  { value: "94%", label: "Precisión de detección", color: "text-green-600" },
  { value: "↓38%", label: "Reducción de pérdidas", color: "text-amber-600" },
  { value: "3×", label: "Mayor eficiencia operativa", color: "text-blue-600" },
  { value: "<15ms", label: "Latencia de inferencia", color: "text-green-600" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Camera,
    title: "Captura Visual",
    desc: "Cámaras estratégicas capturan cada zona de la cosechadora en tiempo real: cabezal, cilindro trilladordor y zarandas de limpieza.",
    color: "bg-green-500",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Inferencia IA",
    desc: "Modelos de visión computacional (detección de objetos + segmentación semántica) procesan cada fotograma con latencia sub-20ms.",
    color: "bg-blue-500",
  },
  {
    step: "03",
    icon: Zap,
    title: "Acción Inmediata",
    desc: "Alertas contextuales y recomendaciones específicas permiten al operador ajustar parámetros antes de que las pérdidas escalen.",
    color: "bg-amber-500",
  },
];

const SUBSYSTEMS = [
  {
    id: "S1",
    name: "Corte",
    icon: Layers,
    accent: "green",
    description:
      "Monitoreo del cabezal de corte con detección de densidad de panículas y cultivo acamado.",
    metrics: [
      "Conteo de panículas por región",
      "Detección de acame (lodging)",
      "Mapa de densidad 4×4",
      "Velocidad de reel recomendada",
    ],
    threshold: "Crítico si lodging > 0%",
    badge: "YOLO Detection",
    route: "/subsistema/corte",
    grad: "from-green-700 to-green-500",
  },
  {
    id: "S2",
    name: "Trilla",
    icon: Gauge,
    accent: "amber",
    description:
      "Análisis por segmentación semántica del flujo interno del cilindro para evaluar calidad del grano.",
    metrics: [
      "% grano íntegro vs roto",
      "% paja residual",
      "Detección de sobrecarga",
      "Proporción de composición",
    ],
    threshold: "Crítico si grano roto > 0.5%",
    badge: "Semantic Segmentation",
    route: "/subsistema/trilla",
    grad: "from-amber-700 to-amber-500",
  },
  {
    id: "S3",
    name: "Limpieza",
    icon: Wind,
    accent: "blue",
    description:
      "Detección de material no-grano en la salida de zarandas para minimizar pérdidas finales.",
    metrics: [
      "% material no-grano",
      "% grano roto en salida",
      "Conteo de partículas",
      "Calidad del flujo limpio",
    ],
    threshold: "Crítico si no-grano > 2.0%",
    badge: "Object Detection",
    route: "/subsistema/limpieza",
    grad: "from-blue-700 to-blue-500",
  },
];

const TECH_FEATURES = [
  {
    icon: Cpu,
    title: "Visión Computacional",
    desc: "Modelos YOLOv11 y segmentación semántica entrenados con datos reales de cosecha de arroz colombiano.",
  },
  {
    icon: Activity,
    title: "Monitoreo en Tiempo Real",
    desc: "WebSocket para streaming de fotogramas con inferencia a menos de 20ms por frame.",
  },
  {
    icon: BarChart3,
    title: "Tendencias Históricas",
    desc: "Registro persistente de métricas por sesión para análisis comparativo y mejora continua.",
  },
  {
    icon: AlertTriangle,
    title: "Alertas Inteligentes",
    desc: "Sistema de alertas de 3 niveles (NORMAL / ATENCIÓN / CRÍTICO) con acciones recomendadas.",
  },
  {
    icon: TrendingUp,
    title: "Análisis Predictivo",
    desc: "Identificación de patrones que anticipan fallos o pérdidas antes de que ocurran.",
  },
  {
    icon: ShieldCheck,
    title: "Exportación CSV",
    desc: "Descarga de diagnósticos completos para reportes de campo y auditorías de calidad.",
  },
];

const SUSTAINABILITY = [
  {
    icon: Droplets,
    title: "Agua",
    value: "−22%",
    desc: "Reducción en uso de agua por optimización de operación",
  },
  {
    icon: Leaf,
    title: "Desperdicio",
    value: "−38%",
    desc: "Menor pérdida de grano cosechado",
  },
  {
    icon: Sun,
    title: "Energía",
    value: "+15%",
    desc: "Eficiencia del combustible por sesión optimizada",
  },
  {
    icon: Globe,
    title: "CO₂",
    value: "−18%",
    desc: "Reducción de emisiones por hectárea cosechada",
  },
];

const BADGES = [
  { icon: Cpu, label: "IA Powered", sub: "YOLOv11 + Segmentación" },
  {
    icon: Award,
    label: "Agricultura de Precisión",
    sub: "ISO 11783 Compatible",
  },
  { icon: Leaf, label: "Smart Farming", sub: "Tecnología sustentable" },
  { icon: ShieldCheck, label: "Datos Seguros", sub: "Procesamiento local" },
  { icon: Star, label: "USCO Research", sub: "Universidad Surcolombiana" },
];

/* ─── Sub-components ─────────────────────────────────────────────── */

function FieldVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow rings */}
      <div className="absolute w-80 h-80 rounded-full border border-green-500/20 animate-pulse" />
      <div
        className="absolute w-56 h-56 rounded-full border border-green-400/30"
        style={{ animation: "pulse-ring 3s ease-out infinite" }}
      />

      {/* Center card — mock dashboard preview */}
      <div className="relative z-10 w-72 rounded-2xl overflow-hidden shadow-2xl glass border border-white/20 animate-float">
        {/* Header bar */}
        <div className="bg-green-800/90 px-4 py-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-100 text-xs font-medium font-mono">
            SISTEMA ACTIVO · SESIÓN 00:47
          </span>
        </div>

        {/* Fake image feed with bboxes */}
        <div className="relative bg-gradient-to-br from-green-950 to-green-900 h-40 overflow-hidden">
          {/* Rice rows */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-px bg-green-500/20"
              style={{ left: `${12.5 * i}%` }}
            />
          ))}
          {/* Bounding boxes */}
          <div className="absolute top-4 left-6 w-16 h-12 border-2 border-green-400 rounded">
            <span className="absolute -top-4 left-0 text-green-300 text-[9px] font-mono bg-green-800/80 px-1 rounded">
              panícula 97%
            </span>
          </div>
          <div className="absolute top-10 left-28 w-14 h-10 border-2 border-green-400 rounded">
            <span className="absolute -top-4 left-0 text-green-300 text-[9px] font-mono bg-green-800/80 px-1 rounded">
              panícula 94%
            </span>
          </div>
          <div className="absolute bottom-6 right-8 w-20 h-8 border-2 border-amber-400 rounded">
            <span className="absolute -top-4 left-0 text-amber-300 text-[9px] font-mono bg-amber-800/80 px-1 rounded">
              acamado 88%
            </span>
          </div>
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px bg-green-400/60"
            style={{ animation: "scan-line 2.5s linear infinite", top: "0" }}
          />
        </div>

        {/* Metrics row */}
        <div className="bg-white/90 px-3 py-2 grid grid-cols-3 gap-2">
          {[
            { label: "Panículas", val: "324", col: "text-green-600" },
            { label: "Acamado", val: "0", col: "text-green-600" },
            { label: "Latencia", val: "12ms", col: "text-blue-600" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className={`text-base font-bold font-mono ${m.col}`}>
                {m.val}
              </div>
              <div className="text-[9px] text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Alert row */}
        <div className="bg-green-50/90 px-3 py-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-green-600" />
          <span className="text-[10px] text-green-700 font-medium">
            S1 NORMAL — Operación óptima
          </span>
        </div>
      </div>

      {/* Floating sensor nodes */}
      {[
        { top: "12%", left: "10%", delay: "0s", color: "bg-green-400" },
        { top: "20%", right: "8%", delay: "0.8s", color: "bg-amber-400" },
        { bottom: "18%", left: "8%", delay: "1.5s", color: "bg-blue-400" },
        { bottom: "25%", right: "12%", delay: "0.4s", color: "bg-green-400" },
      ].map((n, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center"
          style={{ top: n.top, left: n.left, right: n.right, bottom: n.bottom }}
        >
          <div
            className={`w-3 h-3 rounded-full ${n.color} animate-pulse`}
            style={{ animationDelay: n.delay }}
          />
          <div
            className={`absolute w-6 h-6 rounded-full ${n.color} opacity-30`}
            style={{ animation: `pulse-ring 2s ${n.delay} ease-out infinite` }}
          />
        </div>
      ))}

      {/* Connection lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.2 }}
      >
        <line
          x1="15%"
          y1="15%"
          x2="50%"
          y2="50%"
          stroke="#4ade80"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="85%"
          y1="22%"
          x2="50%"
          y2="50%"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="12%"
          y1="80%"
          x2="50%"
          y2="50%"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="88%"
          y1="75%"
          x2="50%"
          y2="50%"
          stroke="#4ade80"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 overflow-x-hidden">
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-white/30 shadow-lg shadow-green-900/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md">
              <Wheat className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <div>
              <span
                className={`font-display font-bold text-sm leading-none ${scrolled ? "text-green-900" : "text-white"}`}
              >
                RiceVision
              </span>
              <div
                className={`text-[10px] leading-none mt-0.5 ${scrolled ? "text-green-600" : "text-green-300"}`}
              >
                Sistema de Monitoreo
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-green-400 ${
                  scrolled ? "text-stone-600" : "text-green-100"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
            >
              Abrir Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden ${scrolled ? "text-stone-700" : "text-white"}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-white/20 px-6 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-stone-700 font-medium py-1"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block bg-green-500 text-white text-center font-semibold py-2.5 rounded-lg mt-2"
            >
              Abrir Dashboard
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen hero-bg field-pattern flex items-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: copy */}
          <div className="space-y-8">
            <div className="fade-up-1 inline-flex items-center gap-2 bg-green-950/70 border border-green-400/40 text-green-200 text-xs font-semibold px-3 py-1.5 rounded-full">
              <CircleDot className="w-3 h-3 animate-pulse" />
              Monitoreo en Tiempo Real · IA + Visión Computacional
            </div>

            <h1 className="fade-up-2 font-display text-5xl lg:text-6xl font-bold text-green-600 leading-tight tracking-tight">
              Cosecha de Arroz
              <br />
              <span className="text-amber-400">Más Inteligente.</span>
            </h1>

            <p className="fade-up-3 text-green-600 text-lg leading-relaxed max-w-lg">
              Sistema de visión computacional que monitorea los tres subsistemas
              críticos de la cosechadora —{" "}
              <strong className="text-green-800">
                Corte, Trilla y Limpieza
              </strong>{" "}
              — detectando pérdidas y anomalías en tiempo real para maximizar el
              rendimiento por hectárea.
            </p>

            <div className="fade-up-4 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Ver Dashboard en Vivo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#sistema"
                className="inline-flex items-center gap-2 border border-green-400/60 text-green-600 hover:text-green-400 hover:border-green-400 font-medium px-6 py-3 rounded-xl transition-all"
              >
                Conocer el Sistema
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mini stats */}
            <div className="fade-up-5 flex flex-wrap gap-6 pt-2">
              {[
                { v: "3 Subsistemas", l: "monitoreados" },
                { v: "<20ms", l: "latencia IA" },
                { v: "94%", l: "precisión" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-green-600 font-bold text-xl font-mono">
                    {s.v}
                  </div>
                  <div className="text-green-400 text-xs font-medium">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="fade-up-3 relative h-96 lg:h-[520px]">
            <FieldVisual />
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 80H1440V20C1200 60 960 0 720 20C480 40 240 0 0 20V80Z"
              fill="#f3f7f3"
            />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section className="py-14 bg-f3f7f3">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white rounded-2xl shadow-sm border border-stone-100 card-hover"
            >
              <div
                className={`text-3xl font-bold font-mono font-display ${s.color}`}
              >
                {s.value}
              </div>
              <div className="text-stone-500 text-sm mt-1 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section id="sistema" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-green-200">
              <Activity className="w-3.5 h-3.5" /> Cómo Funciona
            </div>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              Del campo al <span className="gradient-text">diagnóstico</span> en
              milisegundos
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              Un pipeline de tres etapas que convierte imágenes de cámara en
              decisiones operativas concretas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting dashes */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px border-t-2 border-dashed border-stone-200 z-0" />

            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={i}
                className="relative z-10 bg-stone-50 rounded-2xl p-6 border border-stone-100 card-hover"
              >
                <div
                  className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-md`}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-mono text-stone-400 mb-1">
                  {step.step}
                </div>
                <h3 className="font-display font-bold text-lg text-stone-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBSYSTEMS ──────────────────────────────────────────── */}
      <section id="subsistemas" className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-amber-200">
              <Layers className="w-3.5 h-3.5" /> Subsistemas Monitoreados
            </div>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              Cobertura <span className="gradient-text">total</span> de la
              cosechadora
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              Tres módulos especializados cubren cada etapa crítica del proceso
              de cosecha mecanizada.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {SUBSYSTEMS.map((sys) => (
              <div
                key={sys.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Top gradient band */}
                <div className={`h-2 bg-gradient-to-r ${sys.grad}`} />

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-gradient-to-r ${sys.grad} text-white`}
                        >
                          {sys.id}
                        </span>
                        <span className="text-xs text-stone-400 border border-stone-200 px-2 py-0.5 rounded-full">
                          {sys.badge}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-stone-800">
                        Subsistema de {sys.name}
                      </h3>
                    </div>
                    <sys.icon className="w-8 h-8 text-stone-300 group-hover:text-green-500 transition-colors" />
                  </div>

                  <p className="text-stone-500 text-sm leading-relaxed mb-4">
                    {sys.description}
                  </p>

                  <ul className="space-y-1.5 flex-1 mb-5">
                    {sys.metrics.map((m) => (
                      <li
                        key={m}
                        className="flex items-center gap-2 text-sm text-stone-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-xs text-stone-400">
                      {sys.threshold}
                    </span>
                    <Link
                      to={sys.route}
                      className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold text-sm group-hover:gap-2.5 transition-all"
                    >
                      Ver subsistema <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY ──────────────────────────────────────────── */}
      <section id="tecnologia" className="py-24 bg-white tech-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-blue-200">
              <Cpu className="w-3.5 h-3.5" /> Tecnología IA
            </div>
            <h2 className="font-display text-4xl font-bold text-stone-900">
              Inteligencia Artificial{" "}
              <span className="gradient-text-blue">aplicada al campo</span>
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto">
              Arquitectura modular diseñada para operar en condiciones de campo
              con alta fiabilidad.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH_FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-5 bg-white rounded-2xl border border-stone-100 shadow-sm card-hover"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center mb-3 shadow-md">
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-1.5">
                  {f.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY ──────────────────────────────────────── */}
      <section
        id="sostenibilidad"
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 field-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-900/60 border border-green-500/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Leaf className="w-3.5 h-3.5" /> Impacto Ambiental
            </div>
            <h2 className="font-display text-4xl font-bold text-white">
              Agricultura más <span className="text-green-400">sostenible</span>
            </h2>
            <p className="text-green-100/70 mt-3 max-w-xl mx-auto">
              Optimizar la cosecha no solo aumenta el rendimiento — reduce el
              impacto ambiental por tonelada producida.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUSTAINABILITY.map((s, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-5 text-center card-hover"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-400/20">
                  <s.icon className="w-6 h-6 text-green-300" />
                </div>
                <div className="text-3xl font-bold font-mono text-white mb-1">
                  {s.value}
                </div>
                <div className="text-green-200 font-semibold text-sm mb-1">
                  {s.title}
                </div>
                <p className="text-green-100/60 text-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BADGES ──────────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-stone-400 text-sm font-medium mb-8 uppercase tracking-wider">
            Estándares y Certificaciones
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {BADGES.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center border border-green-100">
                  <b.icon className="w-4.5 h-4.5 text-green-600" size={18} />
                </div>
                <div>
                  <div className="font-semibold text-stone-800 text-sm leading-tight">
                    {b.label}
                  </div>
                  <div className="text-stone-400 text-xs">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-100 rounded-3xl p-12 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 animate-float">
              <Wheat className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold text-stone-900 mb-3">
              Listo para optimizar tu cosecha
            </h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto">
              Accede al dashboard de monitoreo y comienza a analizar los tres
              subsistemas de tu cosechadora en tiempo real.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-green-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Abrir Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/subsistema/corte"
                className="inline-flex items-center gap-2 border-2 border-green-200 text-green-700 hover:border-green-400 font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                Ver S1 · Corte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-green-950 text-green-300 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-green-600/30 rounded-lg flex items-center justify-center border border-green-600/20">
                <Wheat className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">RiceVision</div>
                <div className="text-green-500 text-xs">
                  Sistema de Monitoreo v2.0
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-green-600">
              Proyecto de investigación — Ingeniería de Software
              <br />
              Universidad Surcolombiana · Neiva, Huila ·{" "}
              {new Date().getFullYear()}
            </div>
            <div className="flex gap-4 text-xs">
              <Link
                to="/dashboard"
                className="hover:text-green-200 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/subsistema/corte"
                className="hover:text-green-200 transition-colors"
              >
                S1 Corte
              </Link>
              <Link
                to="/subsistema/trilla"
                className="hover:text-green-200 transition-colors"
              >
                S2 Trilla
              </Link>
              <Link
                to="/subsistema/limpieza"
                className="hover:text-green-200 transition-colors"
              >
                S3 Limpieza
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
