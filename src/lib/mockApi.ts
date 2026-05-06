import type { AnalysisResult, CreateAnalysisInput, EntityCheckInput, EntityCheckResult, Scenario } from "./types";

const now = () => new Date().toISOString();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function checkEntityMock(input: EntityCheckInput): Promise<EntityCheckResult> {
  await sleep(600);
  const name = input.name ?? "";
  const lc = name.toLowerCase();
  const url = input.url?.toLowerCase() ?? "";
  const looksPhishy = lc.includes("lucas") || url.includes("lucas") || url.includes("login") || url.includes("validar");
  const phishtank = input.url
    ? {
        in_database: looksPhishy,
        verified: looksPhishy,
        valid_phish: looksPhishy,
        phish_detail_url: looksPhishy ? "https://phishtank.org/mock/lucas-facil" : undefined,
      }
    : undefined;

  if (lc.includes("lucas") || lc.includes("facil") || lc.includes("fácil")) {
    return {
      name,
      registered: false,
      isImitator: true,
      source: "CMF Alertas al Público (mock snapshot 2026-05-06)",
      evidence: "Alertada como entidad no inscrita que ofrece crédito rápido con condiciones de usura y captación irregular.",
      phishtank,
      _mocked: true,
    };
  }

  if (lc.includes("estado") || lc.includes("santander") || lc.includes("coopeuch")) {
    return {
      name,
      registered: true,
      isImitator: false,
      source: "CMF RPSF (mock snapshot 2026-05-06)",
      evidence: "Entidad encontrada en registro oficial con licencia vigente. Verifica siempre el dominio oficial.",
      phishtank,
      _mocked: true,
    };
  }

  return {
    name,
    registered: false,
    isImitator: false,
    source: "CMF RPSF (mock snapshot 2026-05-06)",
    evidence: "No se encontró coincidencia clara. Revisa ortografía, dominio oficial y canales de atención antes de avanzar.",
    phishtank,
    _mocked: true,
  };
}

export async function runAnalysisMock(input: CreateAnalysisInput): Promise<AnalysisResult> {
  await sleep(1200);
  return {
    ...SCENARIO_FIXTURES[input.scenario],
    id: `demo-${input.scenario}-${Date.now()}`,
    meta: { ...SCENARIO_FIXTURES[input.scenario].meta, processedAt: now() },
  };
}

export function getScenarioFixture(scenario: Scenario): AnalysisResult {
  return {
    ...SCENARIO_FIXTURES[scenario],
    id: `fixture-${scenario}`,
    meta: { ...SCENARIO_FIXTURES[scenario].meta, processedAt: now() },
  };
}

export const SCENARIO_FIXTURES: Record<Scenario, AnalysisResult> = {
  credito_trampa: {
    id: "demo-credito-trampa",
    scenario: "credito_trampa",
    riskScore: 76,
    riskLabel: "Medio-alto",
    resultTitle: "Crédito con cláusula Open Finance abusiva",
    resultText: "Te están pidiendo permiso para compartir tu historial de ventas de los últimos 5 años con terceros no individualizados.",
    pillars: {
      good: [
        {
          title: "La tasa no parece superar el límite",
          detail: "El texto demo no muestra una tasa sobre la Tasa Máxima Convencional, por lo que el foco está en datos y consentimiento.",
          citation: { articulo: "Art. 6 bis", ley: "Ley 18.010", url: "https://www.bcn.cl/leychile/navegar?idNorma=29438" },
        },
      ],
      bad: [
        {
          title: "Cesión de datos por 5 años",
          severity: "Alto",
          detail: "La cláusula autoriza compartir ventas, boletas y comportamiento de pago con aliados comerciales por un plazo excesivo.",
          citation: { articulo: "Art. 4", ley: "Ley 19.628", url: "https://www.bcn.cl/leychile/navegar?idNorma=141599" },
        },
        {
          title: "Aliados comerciales no individualizados",
          severity: "Medio",
          detail: "No se identifican los terceros que recibirían los datos ni sus finalidades concretas.",
          citation: { articulo: "Art. 9", ley: "Ley 19.628", url: "https://www.bcn.cl/leychile/navegar?idNorma=141599" },
        },
      ],
      red: [
        {
          title: "Riesgo de consentimiento amplio",
          severity: "Alto",
          detail: "La autorización puede habilitar usos futuros difíciles de controlar para un microemprendedor.",
          citation: { articulo: "Art. 35", ley: "Ley 21.719", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
        },
      ],
    },
    plan: [
      "No firmes todavía.",
      "Pide al banco eliminar o limitar la cláusula de cesión de datos.",
      "Solicita lista de terceros, finalidad y plazo exacto del tratamiento.",
      "Si no responden claro, prepara reclamo ante SERNAC.",
    ],
    letters: {
      bank: "Asunto: Solicitud de eliminación de cláusula de cesión de datos\n\nEstimado Banco Cordillera Demo:\n\nSolicito revisar y eliminar la cláusula que autoriza compartir mi historial de ventas, boletas y comportamiento de pago con aliados comerciales por un plazo de cinco años. La redacción actual no individualiza destinatarios, finalidades específicas ni mecanismos simples para ejercer oposición.\n\nPido que se entregue una versión alternativa del contrato que limite el tratamiento de datos a lo estrictamente necesario para evaluar y ejecutar el crédito solicitado. También solicito informar qué datos serían tratados, con qué finalidad, por cuánto tiempo y qué terceros participarían.\n\nEsta solicitud se formula como borrador revisable, con referencia a los principios de finalidad y consentimiento de la Ley 19.628 y estándares reforzados de la Ley 21.719.\n\nAtentamente,\nBeto [datos a completar fuera de la demo]",
      sernac: "Asunto: Reclamo por cláusula abusiva en oferta de crédito\n\nSolicito orientación y registro de reclamo por una oferta de crédito que condiciona la contratación a una autorización amplia para compartir datos transaccionales de mi negocio con terceros no individualizados.\n\nLa cláusula dificulta comprender quién recibirá los datos, para qué fines y durante cuánto tiempo. Como consumidor financiero y microemprendedor, requiero información clara, comprensible y proporcional antes de aceptar el contrato.\n\nPido que se revise la cláusula y se solicite al proveedor una alternativa que respete derechos de información, finalidad y oposición.\n\nEste documento es un borrador generado para revisión humana antes de cualquier envío real.",
    },
    sources: [
      { name: "Ley 19.628 Art. 4", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=141599" },
      { name: "Ley 21.719 Art. 35", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
      { name: "Contrato demo enmascarado", type: "document" },
    ],
    agentRuns: [
      { agent: "intake", model: "claude-haiku-4-5", durationMs: 850, status: "done" },
      { agent: "regulatory", model: "pinecone-rag", durationMs: 420, status: "done" },
      { agent: "risk", model: "claude-sonnet-4-6", durationMs: 4200, status: "done" },
      { agent: "recommendation", model: "claude-sonnet-4-6", durationMs: 5100, status: "done" },
      { agent: "validator", model: "claude-haiku-4-5", durationMs: 950, status: "done" },
    ],
    meta: { processedAt: now(), zeroStorage: true, piiRedacted: false, mocked: true },
  },
  app_estafa: {
    id: "demo-app-estafa",
    scenario: "app_estafa",
    riskScore: 91,
    riskLabel: "Alto",
    resultTitle: "App de crédito con señales fuertes de fraude",
    resultText: "Lucas Fácil pide datos sensibles antes de mostrar contrato y usa urgencia para empujar una decisión riesgosa.",
    pillars: {
      good: [
        {
          title: "Se puede verificar antes de entregar datos",
          detail: "El nombre y el enlace pueden contrastarse contra fuentes públicas antes de subir documentos.",
          citation: { articulo: "Registro", ley: "Ley 21.521", url: "https://www.bcn.cl/leychile/navegar?idNorma=1170464" },
        },
      ],
      bad: [
        {
          title: "No aparece como entidad registrada",
          severity: "Alto",
          detail: "La app no coincide con una entidad autorizada en el snapshot demo del registro CMF.",
          citation: { articulo: "RPSF", ley: "Ley 21.521", url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43545.html" },
        },
        {
          title: "Pide carnet y banco por canal inseguro",
          severity: "Alto",
          detail: "Solicitar documentos y datos bancarios antes de un contrato claro es un patrón común de fraude.",
          citation: { articulo: "Alertas", ley: "CSIRT/PhishTank", url: "https://www.csirt.gob.cl/" },
        },
      ],
      red: [
        {
          title: "No entregar documentos ni claves",
          severity: "Alto",
          detail: "El riesgo principal es captura de identidad, acceso a cuenta bancaria y deuda fraudulenta.",
          citation: { articulo: "Art. 3", ley: "Ley 19.496", url: "https://www.bcn.cl/leychile/navegar?idNorma=61438" },
        },
      ],
    },
    plan: [
      "No abras el enlace ni subas documentos.",
      "Busca el nombre en el sitio oficial de CMF.",
      "Guarda captura del mensaje y URL.",
      "Reporta la app como posible fraude y avisa a tu banco si ya entregaste datos.",
    ],
    letters: {
      bank: "Asunto: Alerta preventiva por posible captura de datos bancarios\n\nEstimado banco:\n\nInformo que recibí una oferta de crédito de la aplicación Lucas Fácil, la cual solicitó datos personales, documento de identidad y antecedentes bancarios mediante un enlace externo. Solicito dejar constancia preventiva, monitorear movimientos inusuales y orientar los pasos de bloqueo o protección si fuera necesario.\n\nNo autorizo nuevos productos ni cargos asociados a esa aplicación. Este texto es un borrador para revisión antes de envío real.",
      sernac: "Asunto: Reclamo preventivo por app de crédito sospechosa\n\nSolicito registrar antecedentes sobre la aplicación Lucas Fácil, que ofrece crédito inmediato y pide documentos personales antes de entregar condiciones contractuales claras. La práctica puede inducir a error y exponer a consumidores a fraude financiero.\n\nAdjuntaría, fuera de esta demo, capturas, URL y fecha de contacto. Solicito orientación sobre canales de denuncia y eventual derivación a organismos competentes.",
    },
    sources: [
      { name: "CMF Alertas al Público", type: "public", url: "https://www.cmfchile.cl/portal/principal/613/w3-propertyvalue-43545.html" },
      { name: "CSIRT Chile", type: "public", url: "https://www.csirt.gob.cl/" },
      { name: "PhishTank mock", type: "mock" },
    ],
    agentRuns: [
      { agent: "intake", model: "claude-haiku-4-5", durationMs: 620, status: "done" },
      { agent: "regulatory", model: "cmf-tool", durationMs: 360, status: "done" },
      { agent: "risk", model: "claude-sonnet-4-6", durationMs: 3100, status: "done" },
      { agent: "recommendation", model: "claude-sonnet-4-6", durationMs: 2600, status: "done" },
      { agent: "validator", model: "claude-haiku-4-5", durationMs: 700, status: "done" },
    ],
    meta: { processedAt: now(), zeroStorage: true, piiRedacted: false, mocked: true },
  },
  galpon: {
    id: "demo-galpon",
    scenario: "galpon",
    riskScore: 64,
    riskLabel: "Medio",
    resultTitle: "Arriendo comercial con cláusulas desequilibradas",
    resultText: "El contrato impone multas y término unilateral que Beto debería negociar antes de firmar.",
    pillars: {
      good: [
        {
          title: "El objeto del arriendo está identificado",
          detail: "El contrato describe galpón, destino comercial y plazo base, lo que permite negociar sobre texto concreto.",
          citation: { articulo: "Art. 1915", ley: "Código Civil", url: "https://www.bcn.cl/leychile/navegar?idNorma=172986" },
        },
      ],
      bad: [
        {
          title: "Multa diaria desproporcionada",
          severity: "Medio",
          detail: "La multa supera lo razonable para atrasos menores y puede afectar la continuidad del negocio.",
          citation: { articulo: "Art. 1544", ley: "Código Civil", url: "https://www.bcn.cl/leychile/navegar?idNorma=172986" },
        },
        {
          title: "Término unilateral sin aviso suficiente",
          severity: "Medio",
          detail: "La cláusula permite cierre con poco plazo, sin considerar inventario, proveedores ni operación diaria.",
          citation: { articulo: "Buena fe", ley: "Código Civil", url: "https://www.bcn.cl/leychile/navegar?idNorma=172986" },
        },
      ],
      red: [
        {
          title: "Renuncia anticipada a reclamar",
          severity: "Alto",
          detail: "No conviene firmar una renuncia amplia a acciones o reclamos antes de que exista un conflicto real.",
          citation: { articulo: "Art. 16", ley: "Ley 19.496", url: "https://www.bcn.cl/leychile/navegar?idNorma=61438" },
        },
      ],
    },
    plan: [
      "Pide bajar la multa diaria a un monto proporcional.",
      "Exige aviso previo razonable para término anticipado.",
      "Elimina renuncias generales a reclamar.",
      "Firma solo después de revisar inventario, garantía y salida del local.",
    ],
    letters: {
      bank: "Asunto: Observaciones a contrato de arriendo comercial\n\nEstimados:\n\nSolicito ajustar el borrador de arriendo del galpón, especialmente la multa diaria, el término unilateral y la renuncia amplia a reclamos. Requiero una redacción proporcional que permita continuidad operacional y aviso previo suficiente.\n\nPropongo incorporar una instancia de subsanación antes de aplicar multas o término anticipado. Este borrador debe revisarse antes de cualquier envío real.",
      sernac: "Asunto: Consulta por cláusulas contractuales en arriendo comercial\n\nSolicito orientación respecto de cláusulas que podrían generar desequilibrio importante para un pequeño comerciante: multa diaria elevada, término unilateral y renuncia anticipada a reclamar.\n\nPido revisar si corresponde derivación o asesoría especializada. Este texto es referencial y no contiene datos personales reales.",
    },
    sources: [
      { name: "Contrato de arriendo demo", type: "document" },
      { name: "Código Civil", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=172986" },
      { name: "Ley 19.496", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=61438" },
    ],
    agentRuns: [
      { agent: "intake", model: "claude-haiku-4-5", durationMs: 530, status: "done" },
      { agent: "regulatory", model: "legal-fixture", durationMs: 280, status: "done" },
      { agent: "risk", model: "claude-sonnet-4-6", durationMs: 2400, status: "done" },
      { agent: "recommendation", model: "claude-sonnet-4-6", durationMs: 2100, status: "done" },
      { agent: "validator", model: "claude-haiku-4-5", durationMs: 610, status: "done" },
    ],
    meta: { processedAt: now(), zeroStorage: true, piiRedacted: false, mocked: true },
  },
  atd_software: {
    id: "demo-atd-software",
    scenario: "atd_software",
    riskScore: 83,
    riskLabel: "Alto",
    resultTitle: "Proveedor contable sin ATD claro",
    resultText: "El software procesa ventas y clientes de Beto, pero no entrega acuerdo de tratamiento de datos ni subprocesadores.",
    pillars: {
      good: [
        {
          title: "La finalidad principal es legítima",
          detail: "Procesar contabilidad y ventas puede ser necesario para prestar el servicio contratado.",
          citation: { articulo: "Finalidad", ley: "Ley 19.628", url: "https://www.bcn.cl/leychile/navegar?idNorma=141599" },
        },
      ],
      bad: [
        {
          title: "No hay acuerdo de tratamiento de datos",
          severity: "Alto",
          detail: "Falta identificar responsable, encargado, instrucciones, seguridad, conservación y devolución de datos.",
          citation: { articulo: "Deberes", ley: "Ley 21.719", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
        },
        {
          title: "Subprocesadores no informados",
          severity: "Medio",
          detail: "No se transparenta si usa nube, OCR, analítica o terceros fuera del contrato principal.",
          citation: { articulo: "Seguridad", ley: "Ley 21.719", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
        },
      ],
      red: [
        {
          title: "Riesgo para datos de clientes del negocio",
          severity: "Alto",
          detail: "Beto podría exponer ventas, clientes y documentos tributarios sin garantías contractuales suficientes.",
          citation: { articulo: "20.000 UTM", ley: "Ley 21.719", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
        },
      ],
    },
    plan: [
      "Pide el ATD antes de cargar datos reales.",
      "Exige lista de subprocesadores y país de almacenamiento.",
      "Define plazo de conservación y devolución o eliminación de datos.",
      "No subas documentos de clientes hasta tener respuesta escrita.",
    ],
    letters: {
      bank: "Asunto: Solicitud de acuerdo de tratamiento de datos\n\nEstimado proveedor ContaNube Demo:\n\nAntes de cargar ventas, clientes, boletas o antecedentes contables de mi negocio, solicito el acuerdo de tratamiento de datos aplicable al servicio. Requiero identificar responsable, encargado, finalidad, medidas de seguridad, subprocesadores, plazo de conservación y procedimiento de eliminación o devolución.\n\nHasta recibir respuesta clara, no autorizaré el uso de datos reales de mi negocio. Este borrador debe revisarse antes de envío real.",
      sernac: "Asunto: Reclamo por falta de información sobre tratamiento de datos\n\nSolicito registrar consulta o reclamo contra proveedor de software contable que ofrece procesar información de ventas y clientes sin entregar acuerdo de tratamiento de datos ni lista de subprocesadores.\n\nLa falta de información impide evaluar riesgos antes de contratar y puede afectar derechos de consumidores y pequeños comerciantes.",
    },
    sources: [
      { name: "Ley 21.719", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=1209272" },
      { name: "Ley 19.628", type: "legal", url: "https://www.bcn.cl/leychile/navegar?idNorma=141599" },
      { name: "T&C software demo", type: "document" },
    ],
    agentRuns: [
      { agent: "intake", model: "claude-haiku-4-5", durationMs: 580, status: "done" },
      { agent: "regulatory", model: "legal-fixture", durationMs: 320, status: "done" },
      { agent: "risk", model: "claude-sonnet-4-6", durationMs: 2850, status: "done" },
      { agent: "recommendation", model: "claude-sonnet-4-6", durationMs: 2300, status: "done" },
      { agent: "validator", model: "claude-haiku-4-5", durationMs: 650, status: "done" },
    ],
    meta: { processedAt: now(), zeroStorage: true, piiRedacted: false, mocked: true },
  },
};
