"use client";

import type { AnalysisResult } from "@/lib/types";
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

export function ResultsPanel({ result, onCopied, onDownloaded, onReviewed }: ResultsPanelProps) {
  if (!result) {
    return (
      <section className="demo-card grid min-h-72 place-items-center p-8 text-center" id="results-panel">
        <div>
          <span className="tag tag-info">Resultado vacío</span>
          <h2 className="mt-4 text-2xl font-black tracking-[-0.05em] text-slate-950">Activa el Escudo arriba</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">El análisis mostrará riesgo, 3 pilares, plan de acción y cartas generables.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="demo-card grid gap-5 p-5 sm:p-6" id="results-panel">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className={result.meta.mocked ? "tag tag-warn" : "tag tag-ok"}>{result.meta.mocked ? "Mock" : "Backend real"}</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-slate-950">{result.resultTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{result.resultText}</p>
        </div>
        <span className="tag tag-info">Zero Storage</span>
      </div>

      <RiskRing label={result.riskLabel} score={result.riskScore} />
      <PillarsPanel pillars={result.pillars} />
      <PlanList plan={result.plan} />
      <LetterGenerator letters={result.letters} onCopied={onCopied} onDownloaded={onDownloaded} onReviewed={onReviewed} />
    </section>
  );
}
