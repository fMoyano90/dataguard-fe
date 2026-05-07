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
}

const DEFAULT_SOURCES = [
  { ley: "Ley 21.719 — Protección de datos personales", fecha: "13/DIC/2024" },
  { ley: "Ley 21.521 — Fintech / Finanzas abiertas", fecha: "04/ENE/2023" },
  { ley: "Ley 19.628 — Protección a la vida privada", fecha: "vigente" },
  { ley: "Ley 19.496 / 21.398 — Consumidor (SERNAC)", fecha: "vigente" },
];

export function ResultsPanel({ result, onCopied, onDownloaded }: ResultsPanelProps) {
  if (!result) {
    return (
      <section className="demo-card grid min-h-60 place-items-center p-6 text-center sm:min-h-72 sm:p-8" id="results-panel">
        <div>
          <span className="tag tag-info">Resultado vacío</span>
          <h2 className="mt-4 text-xl font-black tracking-[-0.04em] text-text-primary sm:text-2xl sm:tracking-[-0.05em]">Activa el Escudo arriba</h2>
          <p className="mt-2 max-w-md text-body-sm leading-6 text-text-secondary">El análisis mostrará riesgo, 3 pilares, plan de acción y cartas generables.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="demo-card grid gap-4 p-4 sm:gap-5 sm:p-6" id="results-panel">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-text-primary sm:mt-3 sm:text-3xl sm:tracking-[-0.06em]">{result.resultTitle}</h2>
          <p className="mt-2 max-w-3xl text-body-sm leading-6 text-text-secondary">{result.resultText}</p>
        </div>
        <span className="tag tag-info self-start">Zero Storage</span>
      </div>

      <RiskRing label={result.riskLabel} score={result.riskScore} />
      <PillarsPanel pillars={result.pillars} />
      <PlanList plan={result.plan} />
      <LetterGenerator letters={result.letters} onCopied={onCopied} onDownloaded={onDownloaded} />
      <Disclaimer lastUpdated="6 de mayo 2026" sources={DEFAULT_SOURCES} />
    </section>
  );
}
