# FRONTEND_IMPLEMENTATION_PLAN.md

> Plan ejecutable para 1 desarrollador frontend. 12 horas. MVP **El Escudo de Beto**.
> Trabajar en paralelo con `BACKEND_IMPLEMENTATION_PLAN.md`. La sección 6 (API Contract) es contrato compartido.

---

## 1. Frontend Goal

Una app web (`/`) que demuestra el flujo completo de **El Escudo de Beto** — un agente que protege a microemprendedores chilenos (persona: Beto, jubilado con Parkinson, comerciante con patente, baja adopción digital, administración financiera delegada al hijo) de:
1. Cláusulas abusivas en contratos financieros
2. Apps de crédito fraudulentas
3. Cláusulas comerciales abusivas (arriendos)
4. Acuerdos de Tratamiento de Datos (ATD) faltantes (Ley 21.719)

La app debe demostrar **2 flujos activos**:
- **Flujo rápido — Verificación de entidad**: pegar nombre de app/empresa → MCP consulta CMF mock → resultado en <3s con badge rojo/verde.
- **Flujo profundo — Análisis de contrato**: pegar T&C / texto contrato → multi-agent → 3 pilares (Lo Bueno / Lo Malo / Alertas Rojas) → 2 cartas generables (Banco + SERNAC).

Los **otros 2 escenarios** (galpón, software contabilidad) se muestran como cards precargadas con resultados estáticos.

Debe correr en `localhost:3000` y hablarle al backend en `localhost:3001`. Modo mock como fallback total.

---

## 2. Current Frontend Analysis

**Ubicación:** `/Users/felipemoyano/Documents/CODIGO-STARTUP/impact-lab/dataguard/`

**Stack:**
- Next.js 16.2.5 (App Router, `src/app/`)
- React 19, TypeScript 5
- Tailwind CSS 4 (vía `@tailwindcss/postcss`)
- Path alias `@/*` → `src/*`
- Instalados pero sin uso: `framer-motion@12`, `gsap@3`, `recharts@3`

**Estado actual:**
- `src/app/page.tsx` → solo `<h1>DataGuard</h1>` (placeholder)
- `src/app/layout.tsx` → fonts Geist OK, no tocar
- `src/app/globals.css` → CSS vars básicas, Tailwind 4 importado
- **No hay componentes, no hay API client, no hay `.env.local`**

**Reusable / Inventario:**
| Recurso | Acción |
|---|---|
| `layout.tsx` (Geist + Tailwind) | Reusar tal cual, cambiar `metadata.title` a "El Escudo de Beto" |
| `globals.css` | Extender con design tokens del HTML demo |
| Tailwind 4 setup | Reusar tal cual |
| `tsconfig.json` (alias `@/*`) | Reusar tal cual |
| `framer-motion` | Usar para animar agent dots y badges |
| `page.tsx` | Reemplazar completo |

**Referencia visual obligatoria:** `/impact-lab/demo-primera-idea.html`. Tiene los colores, layouts y animaciones ya resueltos. **No reinventar UI** — portar a React adaptando a 4 escenarios y 3 pilares.

---

## 3. Final Frontend Demo Flow

Toda la experiencia ocurre en una sola página (`/`). Estructura vertical:

```
[Hero / Banner Zero Storage + Multas hasta 20.000 UTM]
        ↓
[Greeting Beto + 4 metric cards]
        ↓
[Quick Action: Verificar entidad fintech]   ← FLUJO 1
   input compacto → click "Verificar"
   → result badge instantáneo (3s) + razón
        ↓
[4 Escenarios (cards)]
   Card 1: Crédito Trampa   ← ACTIVO
   Card 2: Lucas Fácil      ← ACTIVO (atajo del Quick Action arriba)
   Card 3: Galpón           ← PRECARGADO (resultado estático)
   Card 4: Software ATD     ← PRECARGADO (resultado estático)
        ↓
[Form de análisis profundo (visible cuando se selecciona Crédito Trampa)]
   Voz (mic decorativo) | Pegar texto T&C | Dropzone PDF (decorativo)
   Botón "Activar el Escudo"
        ↓
[Modal: AgentTimeline con 5 agentes corriendo]
        ↓
[Resultado: 3 pilares grandes]
   ✓ Lo Bueno    ✗ Lo Malo    ⚠ Alertas Rojas
        ↓
[Plan de acción (numerado, lenguaje simple)]
        ↓
[2 botones generadores: "Carta al Banco" | "Reclamo SERNAC"]
        ↓
[Document preview con tabs entre los 2 docs + Copiar / Descargar]
```

---

## 4. Frontend Screens to Build or Modify

### 4.1 `/` — Página única "El Escudo de Beto"

| Item | Valor |
|---|---|
| **Purpose** | Demo end-to-end completa de los 2 flujos activos |
| **Route** | `/` |
| **Existing file** | `src/app/page.tsx` (reemplazar) |
| **Layout** | stack vertical en mobile/desktop con scroll suave entre secciones |
| **Loading state** | Inline spinner para Quick Action; modal full-screen para análisis profundo |
| **Error state** | Toast + botón "Usar modo offline" |
| **Acceptance** | Desde abrir URL hasta ver carta generada en ≤15s; Quick Action en ≤3s |

---

## 5. Frontend Components

Todos en `src/components/`. Client components (`'use client'`).

### 5.1 `DemoModeBanner`
Banner superior con "Zero Storage — datos enmascarados" + nota "Multas Ley 21.719: hasta 20.000 UTM". Cambia color si modo mock.

### 5.2 `BetoGreeting`
- **Purpose:** hero personalizado con nombre + persona
- **Texto:** "Hola Beto. Soy tu Escudo. Pega lo que te enviaron, te aviso si es trampa."
- **Sub:** stats clave (41% no lee, 20.000 UTM, 122 entidades denunciadas 2025)
- **CTA:** scroll hacia Quick Action

### 5.3 `DashboardSummary`
4 metric cards: "Escenarios cubiertos: 4", "Fuentes públicas: 6", "Acciones automáticas: 2 cartas", "Datos persistidos: 0".

### 5.4 `EntityVerifier` ⭐ FLUJO RÁPIDO (2 tools MCP reales)
- **Purpose:** input + button para verificar entidad fintech contra **CMF oficial** y/o URL contra **PhishTank live**
- **Props:** `onVerified?: (result: EntityCheckResult) => void`
- **State:** `name`, `url`, `loading`, `result`
- **Backend:** `POST /api/entity-check { name?, url? }` → `{ name, registered, isImitator, source, evidence?, phishtank?: { in_database, verified, valid_phish }, _mocked }`
- **UI:**
  - 2 inputs apilados: "Nombre de la app/empresa" + "Link sospechoso (opcional)"
  - Placeholder name: "Ej: Lucas Fácil, BancoEstado, Santander..."
  - Placeholder url: "Ej: http://lucasfacil.app/login"
  - Botón "🛡 Verificar"
  - Result inline:
    - Badge principal: rojo "🚨 Posible imitador" / verde "✓ Registrado en CMF" / ámbar "Sin coincidencia"
    - Sub-chips: "📋 CMF" (siempre que se consultó) + "🎣 PhishTank" (solo si se consultó URL)
    - 1-2 líneas de evidencia citando fuente: "CMF Alertas — usura" / "PhishTank — verified phishing"
  - Animación framer-motion al aparecer
- **Acceptance:**
  - "Lucas Fácil" sin URL → badge rojo + chip CMF, evidencia desde alertas oficiales
  - "Lucas Fácil" + URL → badge rojo + chips CMF + PhishTank en paralelo
  - "BancoEstado" → badge verde desde CSV oficial
  - URL conocida de phishing → chip PhishTank rojo "verified phishing"

### 5.5 `ScenarioCards`
4 cards (créditro trampa, Lucas Fácil, galpón, ATD software). Click activa flujo correspondiente.
- Cards 1-2 (activos): borde sólido, click → scroll al `CaseInputForm` con valores pre-poblados.
- Cards 3-4 (precargados): badge "Vista Demo", click → muestra `ResultsPanel` con fixture estático.

### 5.6 `CaseInputForm` (escenario activo "Crédito Trampa")
- **Props:** `defaultScenario: 'credito_trampa' | 'app_estafa' | 'galpon' | 'atd_software'`, `onSubmit`, `disabled`
- **State:** form local
- **Backend:** dispara `POST /api/analyses`
- **UI:**
  - Botón mic grande decorativo arriba ("Toca y dictame en tu idioma")
  - Textarea: "Pega aquí el contrato o T&C" (rows=8, placeholder con ejemplo del crédito trampa)
  - Dropzone PDF/foto: visual sin upload real, chip "decorativo"
  - Selects: tipo (Contrato banco / T&C app / Arriendo / ATD) | Entidad (Banco Cordillera Demo, etc.) | Idioma
  - Botón primary "🛡 Activar el Escudo"
- **Acceptance:** submit dispara modal y eventualmente popula `ResultsPanel`

### 5.7 `AgentTimeline` (modal overlay)
- **Props:** `open`, `agentStates`, `progress`
- **Implementación:** 5 agent cards (Intake / Regulatory / Risk / Recommendation / Validator) con dots animados. Timing fake en `page.tsx` para que dé sensación de paralelismo aunque el backend sea secuencial:
  - 0ms: intake → running
  - 800ms: intake done, regulatory + risk → running (visualmente paralelos)
  - 3500ms: regulatory done, risk done, recommendation + validator → running
  - cuando llega response: todos done → cierra modal
- **Texto descriptivo de cada agente** visible mientras corre
- **Acceptance:** judges ven los nombres de los agentes activarse en cascada

### 5.8 `RiskRing`
Anillo conic-gradient con score 0-100 + label de severidad.

### 5.9 `PillarsPanel` ⭐ NUEVO (reemplaza FindingsList)
- **Purpose:** los 3 pilares grandes lado a lado
- **Props:** `pillars: { good: Item[]; bad: Item[]; red: Item[] }`
- **UI:**
  - 3 columnas en desktop, stack en mobile
  - Verde (Lo Bueno) | Ámbar (Lo Malo) | Rojo (Alertas Rojas)
  - Cada Item: título, detalle 1-2 líneas, citation chip (Art. X — Ley Y) clickeable
- **Acceptance:** se ven los 3 colores claros; cada item con cita verificable

### 5.10 `PlanList`
Lista numerada de 3-5 pasos en lenguaje Beto-friendly. Cada paso con badge "Acción".

### 5.11 `LetterGenerator` ⭐ NUEVO (reemplaza ARCOLetterPreview)
- **Purpose:** mostrar las 2 cartas generadas con tabs
- **Props:** `letters: { bank?: string; sernac?: string }`
- **UI:**
  - Tabs: "Carta al Banco" / "Reclamo SERNAC"
  - Preview con `white-space: pre-line`, monospaced
  - Botones: Copiar / Descargar TXT / "Marcar como revisado"
  - Banner: "Borrador. Revisa antes de enviar. No reemplaza asesoría legal."
- **Acceptance:** ambas cartas visibles, copy/download funcionan

### 5.12 `ResultsPanel`
Contenedor con `RiskRing` arriba, `PillarsPanel` al medio, `PlanList` y `LetterGenerator` abajo. Estado vacío "Activa el Escudo arriba".

### 5.13 `Toast`
Mensaje temporal con auto-hide 3s.

### 5.14 `RegulatorPreview` (P2 — bonus B2G)
Tabla estática con 4 casos demo (uno por escenario) tal cual el HTML demo (vista regulador).

---

## 6. Frontend API Contract

### 6.1 Tipos (en `src/lib/types.ts`)

```ts
export type Scenario = 'credito_trampa' | 'app_estafa' | 'galpon' | 'atd_software';
export type Severity = 'Bajo' | 'Medio' | 'Alto';
export type RiskLabel = 'Bajo' | 'Medio' | 'Medio-alto' | 'Alto';
export type AgentName = 'intake' | 'regulatory' | 'risk' | 'recommendation' | 'validator';

export interface Citation {
  articulo: string;
  ley: string;
  url: string;
}

export interface PillarItem {
  title: string;
  detail: string;
  citation?: Citation;
  severity?: Severity;
}

export interface Pillars {
  good: PillarItem[];   // Lo Bueno
  bad: PillarItem[];    // Lo Malo
  red: PillarItem[];    // Alertas Rojas
}

export interface Source {
  name: string;
  type: 'legal' | 'public' | 'document' | 'mock';
  snippet?: string;
  url?: string;
}

export interface AgentRun {
  agent: AgentName;
  model: string;
  durationMs: number;
  status: 'done' | 'warn';
}

export interface AnalysisResult {
  id: string;
  scenario: Scenario;
  riskScore: number;
  riskLabel: RiskLabel;
  resultTitle: string;
  resultText: string;
  pillars: Pillars;
  plan: string[];
  letters: {
    bank?: string;
    sernac?: string;
  };
  sources: Source[];
  agentRuns: AgentRun[];
  meta: {
    processedAt: string;
    zeroStorage: true;
    piiRedacted: boolean;
    mocked: boolean;
  };
}

export interface CreateAnalysisInput {
  scenario: Scenario;
  text: string;
  language: 'es' | 'kreyol' | 'quechua' | 'en';
  entity: string;
  documentType: 'contract' | 'tos' | 'rental' | 'dpa';
}

export interface EntityCheckInput {
  name?: string;
  url?: string;          // opcional, si se provee se invoca PhishTank
}

export interface PhishTankResult {
  in_database: boolean;
  verified: boolean;
  valid_phish: boolean;
  phish_detail_url?: string;
}

export interface EntityCheckResult {
  name?: string;
  registered: boolean;
  isImitator: boolean;
  source: string;        // ej "CMF RPSF (oficial, snapshot 2026-05-06)"
  evidence?: string;
  phishtank?: PhishTankResult;
  _mocked: boolean;
}
```

### 6.2 Endpoints

| Endpoint | Método | Body | Response | Notas |
|---|---|---|---|---|
| `/api/entity-check` | POST | `EntityCheckInput` | `EntityCheckResult` | <500ms; usado por `EntityVerifier` |
| `/api/analyses` | POST | `CreateAnalysisInput` | `AnalysisResult` | flujo profundo, 8-15s |
| `/api/analyses/:id` | GET | — | `AnalysisResult` | P2 |
| `/api/data-sources` | GET | — | `Source[]` | P2 |
| `/api/health/ai` | GET | — | `{claude,pinecone,mongo:'ok'\|'down'}` | smoke test |

### 6.3 Cliente fetch (`src/lib/api.ts`)

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function checkEntity(input: EntityCheckInput): Promise<EntityCheckResult> {
  if (USE_MOCK) return (await import('./mockApi')).checkEntityMock(input);
  const res = await fetch(`${BASE}/api/entity-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  return res.json();
}

export async function runAnalysis(input: CreateAnalysisInput): Promise<AnalysisResult> {
  if (USE_MOCK) return (await import('./mockApi')).runAnalysisMock(input);
  const res = await fetch(`${BASE}/api/analyses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  return res.json();
}

export async function checkHealth() {
  if (USE_MOCK) return { claude: 'ok', pinecone: 'ok', mongo: 'ok' };
  return (await fetch(`${BASE}/api/health/ai`)).json();
}
```

---

## 7. Mock Strategy

### 7.1 `src/lib/mockApi.ts`

```ts
import type { AnalysisResult, CreateAnalysisInput, EntityCheckInput, EntityCheckResult } from './types';

export async function checkEntityMock(input: EntityCheckInput): Promise<EntityCheckResult> {
  await new Promise(r => setTimeout(r, 600));
  const lc = (input.name ?? '').toLowerCase();
  const phishtank = input.url
    ? { in_database: lc.includes('lucas'), verified: lc.includes('lucas'), valid_phish: lc.includes('lucas') }
    : undefined;
  if (lc.includes('lucas') || lc.includes('facil')) {
    return {
      name: input.name,
      registered: false,
      isImitator: true,
      source: 'CMF Alertas al Público (mock snapshot)',
      evidence: 'Alertada por CMF: usura y captación irregular',
      phishtank,
      _mocked: true,
    };
  }
  if (lc.includes('estado') || lc.includes('santander') || lc.includes('coopeuch')) {
    return {
      name: input.name, registered: true, isImitator: false,
      source: 'CMF RPSF (mock snapshot)', evidence: 'Registrada con licencia vigente',
      phishtank,
      _mocked: true,
    };
  }
  return { name: input.name, registered: false, isImitator: false,
           source: 'CMF RPSF (mock)', evidence: 'No encontrada — verifica el nombre',
           phishtank,
           _mocked: true };
}

export async function runAnalysisMock(input: CreateAnalysisInput): Promise<AnalysisResult> {
  await new Promise(r => setTimeout(r, 4500));
  return SCENARIO_FIXTURES[input.scenario];
}

const SCENARIO_FIXTURES: Record<Scenario, AnalysisResult> = {
  credito_trampa: {
    id: 'demo-credito-trampa',
    scenario: 'credito_trampa',
    riskScore: 76,
    riskLabel: 'Medio-alto',
    resultTitle: 'Crédito con cláusula Open Finance abusiva',
    resultText: 'Te están pidiendo permiso para compartir tu historial de ventas de los últimos 5 años con terceros.',
    pillars: {
      good: [
        { title: 'Tasa dentro del límite legal', detail: 'La tasa anual está bajo la Tasa Máxima Convencional vigente.',
          citation: { articulo: 'Art. 6 bis', ley: 'Ley 18.010', url: 'https://www.bcn.cl/leychile/navegar?idNorma=29438' } },
      ],
      bad: [
        { title: 'Cesión de datos por 5 años', severity: 'Alto',
          detail: 'La cláusula 14 obliga a compartir tus ventas con aliados comerciales por 5 años.',
          citation: { articulo: 'Art. 4', ley: 'Ley 19.628', url: 'https://www.bcn.cl/leychile/navegar?idNorma=141599' } },
        { title: 'Aliados comerciales no individualizados', severity: 'Medio',
          detail: 'No se identifican los terceros concretos que recibirán tus datos.',
          citation: { articulo: 'Art. 9', ley: 'Ley 19.628', url: 'https://www.bcn.cl/leychile/navegar?idNorma=141599' } },
      ],
      red: [
        { title: 'Multa Ley 21.719: hasta 20.000 UTM', severity: 'Alto',
          detail: 'Si el banco usa mal tus datos, tú podrías ser corresponsable como titular del negocio.',
          citation: { articulo: 'Art. 35', ley: 'Ley 21.719', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272' } },
      ],
    },
    plan: [
      'No firmes todavía.',
      'Pide al banco que elimine la cláusula 14 (compartir datos con terceros).',
      'Si no aceptan, presenta reclamo en SERNAC.',
      'Activa derecho de oposición sobre datos transaccionales (Art. 12 Ley 19.628).',
    ],
    letters: {
      bank: 'Asunto: Solicitud de eliminación de cláusula 14...\n\nEstimado Banco Cordillera Demo:\n\nPor medio de la presente solicito que se elimine la cláusula 14 del contrato ofertado, que autoriza la cesión de mis datos transaccionales a terceros por un plazo de 5 años...\n\n[texto completo de carta formal, ~300 palabras, citando Ley 19.628 Art. 4 y Art. 12]\n\nEsta carta es un borrador revisable. No reemplaza asesoría legal.',
      sernac: 'Asunto: Reclamo por cláusula abusiva en oferta de crédito...\n\n[texto completo de reclamo formal SERNAC, ~250 palabras, citando Ley 21.398 y Ley 19.496]\n\nEsta carta es un borrador revisable.',
    },
    sources: [
      { name: 'Ley 19.628 Art. 4', type: 'legal', url: 'https://www.bcn.cl/leychile/navegar?idNorma=141599' },
      { name: 'Ley 21.719 Art. 35', type: 'legal', url: 'https://www.bcn.cl/leychile/navegar?idNorma=1209272' },
      { name: 'CMF RPSF (mock)', type: 'mock' },
    ],
    agentRuns: [
      { agent: 'intake', model: 'claude-haiku-4-5', durationMs: 850, status: 'done' },
      { agent: 'regulatory', model: 'pinecone-rag', durationMs: 420, status: 'done' },
      { agent: 'risk', model: 'claude-sonnet-4-6', durationMs: 4200, status: 'done' },
      { agent: 'recommendation', model: 'claude-sonnet-4-6', durationMs: 5100, status: 'done' },
      { agent: 'validator', model: 'claude-haiku-4-5', durationMs: 950, status: 'done' },
    ],
    meta: { processedAt: new Date().toISOString(), zeroStorage: true, piiRedacted: false, mocked: true },
  },
  app_estafa:    { /* fixture análoga para Lucas Fácil */ },
  galpon:        { /* fixture cláusula abusiva arriendo + carta rechazo */ },
  atd_software:  { /* fixture ATD faltante + multa Ley 21.719 */ },
};
```

> **Tarea adicional al equipo:** completar las 3 fixtures faltantes con la misma estructura (texto completo de cartas y pillars). Plantillas en `BACKEND_IMPLEMENTATION_PLAN.md` sección 11.

### 7.2 Modo mock toggle

- `NEXT_PUBLIC_USE_MOCK=true` en `.env.local`.
- Auto-fallback: si el fetch real falla, se invoca el mock con el mismo input y se muestra toast "Modo offline".
- `DemoModeBanner` cambia color/texto si `mocked=true` en cualquier respuesta.

---

## 8. Step-by-Step Frontend Tasks

| # | Task | Files | Deps | Acceptance | P | Time |
|---|---|---|---|---|---|---|
| 1 | `.env.local` con `NEXT_PUBLIC_API_URL` | `.env.local` | none | accesible | P0 | 5m |
| 2 | `src/lib/types.ts` (sección 6.1) | nuevo | none | tsc OK | P0 | 15m |
| 3 | Design tokens en `globals.css` (copiar HTML demo + agregar verde/ámbar/rojo brillantes para pilares) | `src/app/globals.css` | none | clases disponibles | P0 | 20m |
| 4 | `DemoModeBanner` + `BetoGreeting` | `src/components/` | T3 | renderizan | P0 | 25m |
| 5 | `DashboardSummary` con metrics hardcoded | nuevo | T3 | grid 4 cols | P0 | 15m |
| 6 | `EntityVerifier` ⭐ con 2 inputs (name + url) y chips CMF/PhishTank | nuevo | T2 | "Lucas Fácil" → badge rojo + chip CMF; con URL → +chip PhishTank | P0 | 50m |
| 7 | `ScenarioCards` (4 cards) | nuevo | T2 | click activa | P0 | 30m |
| 8 | `CaseInputForm` con mic decorativo + textarea + dropzone visual | nuevo | T2 | submit dispara | P0 | 40m |
| 9 | `RiskRing` | nuevo | T3 | conic-gradient | P0 | 20m |
| 10 | `PillarsPanel` (3 columnas) ⭐ | nuevo | T2 | renderiza 3 colores | P0 | 35m |
| 11 | `PlanList` | nuevo | T2 | lista numerada | P0 | 15m |
| 12 | `LetterGenerator` con tabs Banco/SERNAC + copy/download ⭐ | nuevo | T2 | clipboard + Blob | P0 | 35m |
| 13 | `ResultsPanel` integra los anteriores | nuevo | T9-12 | estado vacío + lleno | P0 | 25m |
| 14 | `AgentTimeline` (modal + framer-motion 5 dots) | nuevo | T2 | dots animan en cascada | P0 | 45m |
| 15 | `src/lib/api.ts` (fetch wrapper) | nuevo | T2 | llama backend | P0 | 15m |
| 16 | `src/lib/mockApi.ts` con 4 fixtures completas | nuevo | T2 | retorna fixtures | P0 | 60m |
| 17 | `src/app/page.tsx` integra todo, con MOCK | reescribir | T1-16 | flujo end-to-end con mock | P0 | 60m |
| 18 | Conectar al backend real (Quick Action + Análisis) | `page.tsx` | backend listo | request real funciona | P0 | 30m |
| 19 | Health check al cargar + banner si down | `page.tsx`, `api.ts` | T15 | banner amarillo si down | P1 | 20m |
| 20 | `Toast` component | nuevo | T2 | auto-hide 3s | P1 | 15m |
| 21 | Responsive (mobile <720px) — Beto usa celular | `globals.css`, componentes | T1-17 | demo iPhone OK | P1 | 35m |
| 22 | `RegulatorPreview` tabla estática (bonus B2G) | nuevo | T3 | 4 filas | P2 | 25m |
| 23 | Polish micro-animaciones framer-motion en pilares y badges | varios | T10, T6 | smooth | P2 | 25m |

**Total P0:** ~7.5h. **P0+P1:** ~9h. **Buffer:** 3h para integración + bugs.

---

## 9. 12-Hour Frontend Timeline

| Bloque | Horas | Foco |
|---|---|---|
| **0:00–1:00** | 1h | Setup + tokens + types (T1, T2, T3) |
| **1:00–2:00** | 1h | Banner, Greeting, Dashboard, Scenarios (T4-T7) |
| **2:00–3:00** | 1h | EntityVerifier ⭐ (T6) — flujo rápido funcional con mock al final del bloque |
| **3:00–4:00** | 1h | CaseInputForm + AgentTimeline (T8, T14 inicial) |
| **4:00–5:30** | 1.5h | RiskRing + PillarsPanel + PlanList + LetterGenerator + ResultsPanel (T9-T13) |
| **5:30–6:30** | 1h | api.ts + mockApi.ts + las 4 fixtures completas (T15, T16) |
| **6:30–8:00** | 1.5h | Integrar todo en page.tsx con MOCK (T17) — **demo offline funciona aquí** |
| **8:00–9:00** | 1h | Conectar backend real, ajustes contractuales (T18) |
| **9:00–10:00** | 1h | Health check, error handling, toasts, polish AgentTimeline (T19, T20, T14 final) |
| **10:00–11:00** | 1h | Responsive + RegulatorPreview (T21, T22) |
| **11:00–12:00** | 1h | Polish framer-motion + smoke test demo + fixes (T23) |

**Hito clave hora 8:00:** demo funciona end-to-end con mocks. A partir de ahí todo es upgrade.

---

## 10. Frontend Definition of Done

- [ ] `npm run dev` levanta sin errores TypeScript
- [ ] Hero "Hola Beto" + DemoModeBanner visible
- [ ] **Quick Action (CMF)**: escribir "Lucas Fácil" → badge rojo "Posible imitador" en <3s con chip "📋 CMF"
- [ ] **Quick Action (CMF real)**: escribir "BancoEstado" → badge verde "Registrado en CMF" desde CSV oficial
- [ ] **Quick Action (PhishTank)**: pegar URL conocida de phishing → chip "🎣 PhishTank — verified" rojo
- [ ] 4 Escenarios visibles; clicks 1 y 2 abren form con valores pre-poblados
- [ ] Submit del form → modal con 5 agentes corriendo
- [ ] Modal cierra cuando llega response
- [ ] `RiskRing` con score numérico
- [ ] `PillarsPanel` muestra Lo Bueno (verde), Lo Malo (ámbar), Alertas Rojas (rojo) con citas
- [ ] `PlanList` con 3-5 pasos
- [ ] `LetterGenerator` muestra 2 cartas (Banco + SERNAC) con copy/download funcionando
- [ ] Modo mock activable y operativo
- [ ] Funciona en mobile (Chrome DevTools iPhone) — Beto usa celular
- [ ] No hay PII real en fixtures
- [ ] Sin errores en consola del browser
