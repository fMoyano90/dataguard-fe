"use client";

import type { AnalysisResult } from "@/lib/types";
import { Disclaimer } from "./Disclaimer";
import { LetterGenerator } from "./LetterGenerator";
import { PillarsPanel } from "./PillarsPanel";
import { PlanList } from "./PlanList";
import { RiskRing } from "./RiskRing";

interface ResultsPanelProps {
  result?: AnalysisResult | null;
  onCopied?: () => void;
  onDownloaded?: () => void;
  onReviewed?: () => void;
}

const DEFAULT_SOURCES = [
  { ley: "Ley 21.719 — Protección de datos personales", fecha: "13/DIC/2024" },
  { ley: "Ley 21.521 — Fintech / Finanzas abiertas", fecha: "04/ENE/2023" },
  { ley: "Ley 19.628 — Protección a la vida privada", fecha: "vigente" },
  { ley: "Ley 19.496 / 21.398 — Consumidor (SERNAC)", fecha: "vigente" },
];

export function ResultsPanel({ result, onCopied, onDownloaded, onReviewed }: ResultsPanelProps) {
  if (!result) {
    return (
      <section className="demo-card grid min-h-72 place-items-center p-8 text-center" id="results-panel">
        <div>
          <span className="tag tag-info">Resultado vacío</span>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.05em] text-text-primary">Activa el Escudo arriba</h2>
          <p className="mt-2 max-w-md text-body-sm leading-6 text-text-secondary">El análisis mostrará riesgo, 3 pilares, plan de acción y cartas generables.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="demo-card grid gap-5 p-5 sm:p-6" id="results-panel">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-text-primary">{result.resultTitle}</h2>
          <p className="mt-2 max-w-3xl text-body-sm leading-6 text-text-secondary">{result.resultText}</p>
        </div>
        <span className="tag tag-info">Zero Storage</span>
      </div>

      <RiskRing label={result.riskLabel} score={result.riskScore} />
      <PillarsPanel pillars={result.pillars} />
      <PlanList plan={result.plan} />
      <LetterGenerator letters={result.letters} onCopied={onCopied} onDownloaded={onDownloaded} onReviewed={onReviewed} />
      <Disclaimer lastUpdated="6 de mayo 2026" sources={DEFAULT_SOURCES} />
    </section>
  );
}
