// src/content/landing.js
// ============================================================
// TODO EL TEXTO DE LA LANDING EN UN SOLO LUGAR
// ============================================================
// Fuentes: Anexo 2 del concurso NEIVA FEST (documento técnico,
// 22-oct-2026) y docs/01–03 v1.2. Alcance: corte y tolva.
// Para actualizar la página basta con editar este archivo.

export const NAV_LINKS = [
  { label: "Problema", href: "#problema" },
  { label: "Impacto", href: "#impacto" },
  { label: "Cómo funciona", href: "#proceso" },
  { label: "Sistema", href: "#sistema" },
  { label: "Avance", href: "#estado" },
  { label: "Equipo", href: "#equipo" },
];

export const HERO = {
  // Cifras del Anexo 2: pérdida del cabezal (1,44 %) en la producción del
  // Huila 2025 al precio de junio de 2026, y escenario de reducirla a la mitad.
  title: ["Cada año el Huila deja", "$4.560 millones de arroz en el lote"],
  highlight: "$4.560 millones",
  subtitle:
    "Son 3.400 toneladas que se pierden solo en el cabezal. Con RiceVi, reducir esa pérdida a la mitad recuperaría 1.700 toneladas y unos $2.280 millones al año.",
  cta: { label: "Recorrer el lote", href: "#escena-2" },
  secondary: { label: "Ir al problema", href: "#problema" },
  proof: ["4 cámaras", "3 sensores y un GPS", "Ninguna conexión a la máquina"],
};

// Recorrido en video que avanza con el scroll (portada).
// `t` es el segundo del video donde aparece la foto de cada escena;
// `still` es ese mismo cuadro, que se ve mientras carga el video o con
// movimiento reducido. La escena 1 usa el texto de HERO.
export const FILM = {
  video: { desktop: "/video/recorrido-escritorio.mp4", mobile: "/video/recorrido-movil.mp4" },
  duration: 29.2,
  hint: "Desliza para recorrer el lote",
  scenes: [
    { t: 0, still: "escena-1" },
    {
      t: 4.84,
      still: "escena-2",
      eyebrow: "En el lote",
      title: "La cosechadora entra al arrozal",
      body: "RiceVi viaja montado en la cosechadora durante la cosecha y se retira sin modificarla.",
    },
    {
      t: 9.68,
      still: "escena-3",
      eyebrow: "A bordo",
      title: "Cámaras y sensores con batería propia",
      body: "Cuatro cámaras, un sensor en el molinete, dos sensores de altura en el cabezal y un GPS en el techo de la cabina.",
    },
    {
      t: 14.52,
      still: "escena-4",
      eyebrow: "Tolva",
      title: "Una cámara mira lo que llega a la tolva",
      body: "Mide cuánto material que no es grano entra con la cosecha, para cuidar la calidad de lo que se entrega.",
    },
    {
      t: 19.36,
      still: "escena-5",
      eyebrow: "En la cabina",
      title: "La inteligencia artificial va a bordo",
      body: "Una Raspberry Pi analiza las imágenes ahí mismo, sin internet, y muestra el diagnóstico en una tablet o un teléfono.",
    },
    {
      t: 24.2,
      still: "escena-6",
      eyebrow: "Antes del corte",
      title: "Lo que está por entrar al cabezal",
      body: "Una cámara clasifica si el cultivo está erecto o volcado, para ajustar el cabezal y el molinete a tiempo.",
    },
    {
      t: 29.2,
      still: "escena-7",
      eyebrow: "Después del corte",
      title: "Y el grano que queda en el suelo",
      body: "Dos cámaras detrás del cabezal miden el grano útil que queda en el lote, el indicador directo de la pérdida.",
      cta: { label: "Ver el problema", href: "#problema" },
    },
  ],
};

// Pérdida medida al cosechar arroz con cosechadora en Colombia [1].
export const PROBLEM = {
  eyebrow: "El problema",
  total: "7,17 %",
  title: "del arroz se pierde al cosecharlo",
  lead: "Es grano que se sembró, se fertilizó y se pagó, pero nunca llegó a la tolva.",
  // Colores validados para daltonismo sobre el fondo de la página
  parts: [
    { label: "Cabezal de corte", value: 1.44, color: "#C08A0C", focus: true },
    { label: "Trilla", value: 1.56, color: "#2F7A3E" },
    { label: "Separación y limpieza", value: 4.12, color: "#8A63B0" },
  ],
  reference: {
    label: "Con operario entrenado y máquina bien ajustada",
    min: 1.25,
    max: 2.2,
  },
  paragraphs: [
    "Desde la cabina el operario no ve el grano que queda detrás del cabezal ni lo que entra a la tolva. Ajusta altura, molinete y velocidad por experiencia, y se entera de la pérdida cuando ya ocurrió.",
    "RiceVi empieza por el cabezal, la primera pérdida del proceso y la que se puede corregir de forma más directa.",
  ],
  source:
    "Chaparro, Devia y Zea (1984), 39 observaciones en Ambalema, Tolima. Referente de Paulsen, Kalita y Rausch (2015, ASABE).",
};

export const TAGLINE =
  "Lo que no se ve no se puede corregir. RiceVi convierte la pérdida invisible en un número que el operario puede usar.";

// Escenarios calculados en el Anexo 2 con el 1,44 % del cabezal [1],
// el rendimiento del Huila (7,40 t/ha) y su producción 2025 [3], y el
// precio del arroz paddy verde de junio de 2026, $1,34 millones/t [6].
export const IMPACT = {
  eyebrow: "Impacto",
  title: "Lo que se recuperaría en el Huila",
  intro:
    "El Huila tiene el mayor rendimiento de arroz del país, 7,40 toneladas por hectárea, y en 2025 produjo 236.475 toneladas. Solo el cabezal deja en el lote el 1,44 % de esa cosecha.",
  scenarios: [
    {
      id: "mitad",
      label: "Si se reduce a la mitad",
      totalAfter: "6,45 %",
      payback: "56",
      figures: [
        { scale: "Por hectárea", amount: "≈ 53 kg", money: "≈ $71.400" },
        { scale: "Un lote de 10 hectáreas", amount: "≈ 530 kg", money: "≈ $714.000" },
        { scale: "Un año en el Huila", amount: "≈ 1.700 t", money: "≈ $2.280 millones" },
      ],
    },
    {
      id: "techo",
      label: "Si se elimina",
      totalAfter: "5,73 %",
      payback: "28",
      figures: [
        { scale: "Por hectárea", amount: "≈ 107 kg", money: "≈ $142.800" },
        { scale: "Un lote de 10 hectáreas", amount: "≈ 1,07 t", money: "≈ $1,4 millones" },
        { scale: "Un año en el Huila", amount: "≈ 3.400 t", money: "≈ $4.560 millones" },
      ],
    },
  ],
  cost: "El equipo cuesta del orden de US$ 1.000 por cosechadora, unos $4 millones, sin pagos mensuales.",
  indirect:
    "Además, la velocidad de avance y el molinete influyen en lo que se pierde en la trilla y la limpieza. Ese efecto se medirá en campo y no se suma a estas cifras.",
  note:
    "Son escenarios calculados, no resultados medidos. Fuentes: Chaparro et al. (1984); DANE y Fedearroz, Encuesta Nacional de Arroz Mecanizado 2025; precio de Fedearroz de junio de 2026.",
};

export const PROCESS = {
  eyebrow: "Cómo funciona",
  title: "Ver, ajustar y comprobar",
  steps: [
    {
      n: "01",
      title: "Observa tres puntos de la cosecha",
      text: "Cuatro cámaras miran el cultivo antes del corte, el suelo después del cabezal y el interior de la tolva. Tres sensores y un GPS registran el molinete, la altura del cabezal y la velocidad de avance.",
      points: [
        { label: "Antes del corte", detail: "Cultivo erecto o volcado" },
        { label: "Después del corte", detail: "Grano útil que queda en el suelo" },
        { label: "Tolva", detail: "Material que no es grano" },
      ],
    },
    {
      n: "02",
      title: "Analiza a bordo, sin internet",
      text: "Una Raspberry Pi 5 en la cabina ejecuta tres modelos de visión artificial y calcula el índice del molinete, la relación entre su velocidad y la de avance, uno de los ajustes que más pesa en la pérdida.",
    },
    {
      n: "03",
      title: "El operario ajusta y comprueba",
      text: "En una tablet o un teléfono ve el diagnóstico y sugerencias como «considere bajar la velocidad de avance». Hace el ajuste y en segundos ve si el grano en el suelo disminuyó. El sistema no toca los controles.",
    },
  ],
  images: [
    { name: "vista_frontal", alt: "Vista desde la cabina sobre el molinete y el cabezal, con el cultivo de arroz al frente" },
    { name: "arrocera_cosechada", alt: "Lote de arroz recién cosechado, con rastrojo y huellas de la máquina" },
    { name: "tolva", alt: "Interior de la tolva con el grano de arroz acumulado y el sinfín de carga" },
  ],
};

// Posiciones en % sobre la foto cosechadora_cerca (vista lateral).
// Son aproximadas: sirven para explicar, no como plano de montaje.
export const SYSTEM = {
  eyebrow: "El sistema",
  title: "Dónde va cada pieza",
  intro:
    "Siete módulos pequeños con batería propia, un GPS, una central en la cabina y una red Wi-Fi dedicada. Se instala y se retira sin modificar la cosechadora.",
  hotspots: [
    {
      n: 1,
      x: 35,
      y: 51,
      title: "Cámara antes del corte",
      ids: "CAM01",
      text: "Mira hacia adelante el cultivo que va a entrar al cabezal.",
    },
    {
      n: 2,
      x: 30,
      y: 74,
      title: "Cámaras después del corte",
      ids: "CAM02 · CAM03",
      text: "Detrás del cabezal, a izquierda y derecha, sobre la franja recién cortada.",
    },
    {
      n: 3,
      x: 11,
      y: 61,
      title: "Sensor del molinete",
      ids: "NH01",
      text: "Un sensor magnético en el eje del molinete cuenta sus vueltas.",
    },
    {
      n: 4,
      x: 22,
      y: 73,
      title: "Sensores de altura del cabezal",
      ids: "NU01 · NU02",
      text: "Dos ultrasónicos, uno en cada extremo del cabezal, miden la distancia al suelo. Son nodos separados del sensor del molinete.",
    },
    {
      n: 5,
      x: 39,
      y: 35,
      title: "Antena GPS",
      ids: "GPS USB · u-blox",
      text: "Un receptor GPS sobre el techo de la cabina, conectado por USB a la central, mide la velocidad de avance.",
    },
    {
      n: 6,
      x: 42,
      y: 46,
      title: "Central en la cabina",
      ids: "RPI01",
      text: "Una Raspberry Pi 5 con batería propia recibe, verifica y guarda todo. El operario la consulta desde un navegador.",
    },
    {
      n: 7,
      x: 51,
      y: 38,
      title: "Cámara de la tolva",
      ids: "CAM04",
      text: "Dentro de la tolva, con su luz pulsada y una referencia de color.",
    },
  ],
  facts: [
    { value: "7", label: "módulos ESP32, uno por cámara o sensor" },
    { value: "3", label: "modelos de visión artificial" },
    { value: "≈ US$ 1.000", label: "de hardware por cosechadora" },
    { value: "0", label: "costos de nube o conectividad" },
  ],
};

export const PRINCIPLES = {
  eyebrow: "Límites claros",
  title: "Lo que RiceVi no hace",
  items: [
    {
      title: "No toca la máquina",
      text: "No se conecta al cableado ni a los mandos de la cosechadora. Todo funciona con baterías propias.",
    },
    {
      title: "No inventa datos",
      text: "Si un sensor o un modelo no da medida, el valor queda vacío y la pantalla dice «sin modelo», nunca un número falso.",
    },
    {
      title: "No decide por el operario",
      text: "Las sugerencias salen del manual de la máquina y de la literatura técnica. El ajuste lo hace quien maneja.",
    },
    {
      title: "No da cifras sin medirlas",
      text: "Las cifras de impacto son escenarios. El efecto real se medirá en campo, comparando el grano en el suelo antes y después de cada ajuste.",
    },
  ],
};

export const STATUS = {
  eyebrow: "Avance",
  title: "En qué va el proyecto",
  updated: "Octubre de 2026",
  steps: [
    {
      when: "Hoy",
      tone: "done",
      title: "Prototipo funcional en banco",
      text: "La central ya recibe, verifica y guarda datos, con 40 comprobaciones automáticas. Las placas están en manos del equipo y el código es público.",
    },
    {
      when: "Hasta mediados de noviembre de 2026",
      tone: "now",
      title: "Montaje de los siete nodos y el GPS",
      text: "Cableado definitivo, soportes impresos en 3D y pruebas de banco.",
    },
    {
      when: "Noviembre y diciembre de 2026",
      tone: "next",
      title: "Fase 1, captura del dataset",
      text: "Jornadas reales de cosecha para construir el primer dataset de imágenes de cosecha del Huila.",
    },
    {
      when: "Noviembre de 2026 a enero de 2027",
      tone: "next",
      title: "Etiquetado y entrenamiento",
      text: "Los modelos mejoran a medida que llegan las imágenes.",
    },
    {
      when: "Enero y febrero de 2027",
      tone: "next",
      title: "Fase 2, primeras salidas con los modelos",
      text: "La inteligencia artificial funcionando en la cabina y la pérdida medida en el lote.",
    },
  ],
};

export const FAQ = [
  {
    q: "¿El sistema controla la cosechadora?",
    a: "No. Solo observa, diagnostica y sugiere. No se conecta a la máquina ni cambia ningún ajuste; las decisiones son del operario.",
  },
  {
    q: "¿Qué es el acame?",
    a: "Es cuando las plantas de arroz se doblan o caen antes de la cosecha. Un cultivo acamado obliga a reajustar el cabezal y el molinete sobre la marcha, y un ajuste tardío se paga en grano perdido.",
  },
  {
    q: "¿Necesita internet en el campo?",
    a: "No. Los módulos se comunican por una red Wi-Fi propia de la máquina y todo se analiza y se guarda en la cabina. El GPS recibe la señal directamente de los satélites.",
  },
  {
    q: "¿Sirve para otros granos?",
    a: "Sí. Maíz, sorgo, soya o trigo se cosechan con el mismo principio de cabezal, molinete y tolva. Llevar RiceVi a otro cultivo es adaptar el montaje y entrenar su propio dataset.",
  },
];

export const TEAM = {
  eyebrow: "Equipo",
  title: "Quiénes lo desarrollan",
  intro: "Proyecto de modalidad de grado de la Universidad Surcolombiana, diseñado y desarrollado en Neiva.",
  members: [
    { name: "Cesar Camilo Hoyos Diaz", role: "Desarrollador" },
    { name: "Alvaro Julian Delgado Mena", role: "Desarrollador" },
    { name: "Ferley Medina Rojas", role: "Asesor, profesor de Ingeniería de Software" },
  ],
};

export const FOOTER = {
  repo: { label: "Código del sistema", href: "https://github.com/Camilo1408/config-ricevi" },
  line: "RiceVi · Diagnóstico con visión artificial del corte de la cosecha mecanizada de arroz",
};
