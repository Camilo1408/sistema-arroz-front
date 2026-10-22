// src/content/landing.js
// ============================================================
// TODO EL TEXTO DE LA LANDING EN UN SOLO LUGAR
// ============================================================
// Fuente: docs/00_ESTADO_ACTUAL_PROYECTO.md y docs/01–03 v1.2
// (22-oct-2026). Alcance: corte (pre y post) y tolva.
// Para actualizar la página basta con editar este archivo.

export const NAV_LINKS = [
  { label: "Proyecto", href: "#proyecto" },
  { label: "Qué observa", href: "#observa" },
  { label: "Sistema", href: "#sistema" },
  { label: "Fases", href: "#fases" },
  { label: "Estado", href: "#estado" },
  { label: "Equipo", href: "#equipo" },
];

export const HERO = {
  eyebrow: "Proyecto de grado · Universidad Surcolombiana",
  title: ["Ver de cerca el corte", "de la cosecha de arroz"],
  subtitle:
    "RiceVi instala cámaras y sensores en una cosechadora para registrar cómo queda el cultivo después del corte y qué llega a la tolva. Con esos datos se entrenarán modelos de visión artificial que ayuden al operario a leer lo que pasa en el lote.",
  cta: { label: "Recorrer el lote", href: "#escena-2" },
  secondary: { label: "Saltar al proyecto", href: "#proyecto" },
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
      body: "RiceVi viaja montado en una cosechadora durante la cosecha, sin intervenir la máquina.",
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
      body: "Observa el grano acumulado para estimar qué parte no es grano: paja, cascarilla o residuos.",
    },
    {
      t: 19.36,
      still: "escena-5",
      eyebrow: "Sin cables a la máquina",
      title: "Todo se guarda en la cabina",
      body: "Una Raspberry Pi recibe cada imagen con su hora, las lecturas de los sensores y la velocidad que entrega el GPS.",
    },
    {
      t: 24.2,
      still: "escena-6",
      eyebrow: "Antes del corte",
      title: "Lo que está por entrar al cabezal",
      body: "Una cámara mira el cultivo de frente y clasifica qué tan acamado está: erecto, moderado o severo.",
    },
    {
      t: 29.2,
      still: "escena-7",
      eyebrow: "Después del corte",
      title: "Y lo que queda en el suelo",
      body: "Dos cámaras detrás del cabezal miran la franja recién cortada para estimar cuánto material útil sigue visible.",
      cta: { label: "Conocer el proyecto", href: "#proyecto" },
    },
  ],
};

export const PROBLEM = {
  eyebrow: "El proyecto",
  title: "Lo que pasa detrás del cabezal no se ve desde la cabina",
  paragraphs: [
    "En la cosecha mecanizada, parte del grano puede quedarse en el lote o llegar a la tolva mezclado con paja y residuos. El operario ajusta la máquina con lo que alcanza a ver y con su experiencia, pero no tiene un registro continuo de cómo queda el corte ni de qué entra a la tolva.",
    "RiceVi busca darle ese registro: observar el proceso con cámaras, guardar cada imagen junto con el estado de la máquina en ese instante y, más adelante, analizarlo con visión artificial.",
  ],
  note: "La meta es aportar a reducir las pérdidas en la cosecha de arroz. El proyecto mide y describe lo que observa; no promete un porcentaje de reducción.",
};

export const TAGLINE =
  "Antes de mejorar la cosecha hay que poder verla. RiceVi convierte cada jornada en datos que se pueden revisar.";

export const OBSERVES = {
  eyebrow: "Qué observa",
  title: "Dos zonas de la cosechadora: el corte y la tolva",
  zones: [
    {
      id: "pre-corte",
      group: "Corte",
      title: "Antes del corte",
      devices: ["CAM01"],
      text: "Una cámara mira el cultivo que está por entrar al cabezal y lo clasifica según qué tan acamado está, es decir, qué tanto se han doblado las plantas.",
      output: "Erecto · moderado · severo",
      image: "vista_frontal",
      alt: "Vista desde la cabina sobre el molinete y el cabezal, con el cultivo de arroz al frente",
      orientation: "landscape",
    },
    {
      id: "post-corte",
      group: "Corte",
      title: "Después del corte",
      devices: ["CAM02", "CAM03"],
      text: "Dos cámaras detrás del cabezal, una a cada lado, miran la franja recién cortada para estimar cuánto material útil sigue visible en el suelo.",
      output: "Material útil visible tras el paso del cabezal",
      image: "arrocera_cosechada",
      alt: "Lote de arroz recién cosechado, con rastrojo y huellas de la máquina",
      orientation: "portrait",
    },
    {
      id: "tolva",
      group: "Tolva",
      title: "Lo que llega a la tolva",
      devices: ["CAM04"],
      text: "Una cámara dentro de la tolva, con una luz que se enciende solo al tomar la foto, observa la superficie del grano acumulado para estimar qué parte no es grano.",
      output: "Material distinto al grano: paja, cascarilla, residuos",
      image: "tolva",
      alt: "Interior de la tolva de la cosechadora con el grano de arroz acumulado y el sinfín de carga",
      orientation: "portrait",
    },
  ],
  context:
    "Tres sensores y un GPS registran además el contexto de la máquina: las vueltas del molinete, la altura del cabezal a cada lado y la velocidad de avance.",
};

// Posiciones en % sobre la foto cosechadora_cerca (vista lateral).
// Son aproximadas: sirven para explicar, no como plano de montaje.
export const SYSTEM = {
  eyebrow: "El sistema",
  title: "Dónde va cada pieza",
  intro:
    "Siete módulos pequeños con batería propia, un GPS, una central en la cabina y una red Wi-Fi dedicada. Nada se conecta a la cosechadora.",
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
    { value: "1 foto/s", label: "por cada cámara del corte" },
    { value: "≈ 15 GB", label: "de datos en una jornada de ocho horas" },
    { value: "0", label: "cables hacia la máquina" },
  ],
};

export const PHASES = {
  eyebrow: "Cómo funciona",
  title: "Primero aprender a ver, después analizar",
  flow: ["Cámaras, sensores y GPS", "Red Wi-Fi propia", "Central en la cabina", "Pantalla del operario"],
  items: [
    {
      tag: "Fase 1",
      title: "Construir el dataset",
      status: "Primera campaña",
      text: "Durante la cosecha el sistema solo captura, verifica y guarda. Cada foto queda unida a su hora exacta y a las lecturas de los sensores. Donde iría un resultado, la pantalla dice «sin modelo»: si no hay medida, no se inventa un número.",
    },
    {
      tag: "Fase 2",
      title: "Analizar a bordo",
      status: "Con modelos entrenados",
      text: "La misma Raspberry Pi ejecuta los modelos en la cabina y muestra al operario el diagnóstico, con sugerencias generales basadas en el manual de la máquina y en la literatura. El operario decide; el sistema no acciona nada.",
    },
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
      text: "Si un sensor o un modelo no da medida, el valor queda vacío, nunca en cero.",
    },
    {
      title: "No decide por el operario",
      text: "Las sugerencias son orientaciones generales. El ajuste lo hace quien maneja.",
    },
    {
      title: "No promete cifras",
      text: "Describe lo que observa. No afirma cuánto se reducen las pérdidas.",
    },
  ],
};

export const STATUS = {
  eyebrow: "Estado",
  title: "En qué va el proyecto",
  updated: "Octubre de 2026",
  columns: [
    {
      label: "Hecho",
      tone: "done",
      items: [
        "Arquitectura del sistema definida y documentada",
        "Hardware de los nodos y de la central recibido",
        "Software de la central probado en banco",
      ],
    },
    {
      label: "En curso",
      tone: "now",
      items: ["Montaje y firmware de los nodos", "Pruebas de banco de la luz de la tolva y de los sensores de altura"],
    },
    {
      label: "Siguiente",
      tone: "next",
      items: [
        "Salidas de campo para construir el dataset",
        "Anotación de imágenes y entrenamiento de los modelos",
        "Medición del desempeño de los modelos en la Raspberry Pi",
      ],
    },
  ],
};

export const FAQ = [
  {
    q: "¿El sistema controla la cosechadora?",
    a: "No. Solo observa y registra. No se conecta a la máquina ni cambia ningún ajuste; las decisiones son del operario.",
  },
  {
    q: "¿Qué es el acame?",
    a: "Es cuando las plantas de arroz se doblan o caen antes de la cosecha. Un cultivo acamado es más difícil de cortar, por eso conviene saber en qué estado entra al cabezal.",
  },
  {
    q: "¿Necesita internet en el campo?",
    a: "No. Los módulos se comunican por una red Wi-Fi propia de la máquina y todo se guarda en la central de la cabina. El GPS tampoco la necesita: recibe la señal directamente de los satélites.",
  },
  {
    q: "¿Qué se hace con las imágenes?",
    a: "Cada imagen se guarda con un identificador, su hora y una huella digital que comprueba que llegó completa. Con ellas se anotan ejemplos y se entrenan los modelos.",
  },
];

export const TEAM = {
  eyebrow: "Equipo",
  title: "Quiénes lo desarrollan",
  intro: "Estudiantes de noveno semestre de la Universidad Surcolombiana.",
  members: [
    { name: "Cesar Camilo Hoyos Diaz", role: "Investigación y desarrollo" },
    { name: "Alvaro Julian Delgado Mena", role: "Investigación y desarrollo" },
  ],
};

export const FOOTER = {
  repo: { label: "Código del sistema", href: "https://github.com/Camilo1408/config-ricevi" },
  line: "RiceVi · Diagnóstico con visión artificial del corte en la cosecha mecanizada de arroz",
};
