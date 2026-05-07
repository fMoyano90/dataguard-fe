"use client";

import type { RiskLabel } from "@/lib/types";

interface RiskRingProps {
  score: number;
  label: RiskLabel;
}

function riskColor(score: number) {
  if (score >= 75) return "var(--color-danger-500)";
  if (score >= 45) return "var(--color-warning-500)";
  return "var(--color-success-500)";
}

export function RiskRing({ score, label }: RiskRingProps) {
  const normalized = Math.max(0, Math.min(100, score));
  const trackColor = "var(--color-warning-200)";

  return (
    <div className="grid place-items-center gap-4 rounded-[22px] border border-warning-200 bg-gradient-to-br from-warning-50 to-white p-4 sm:grid-cols-[112px_1fr] sm:place-items-stretch sm:items-center sm:p-5">
      <div
        aria-label={`Puntaje de riesgo ${normalized} de 100`}
        className="relative grid h-24 w-24 place-items-center rounded-full sm:h-28 sm:w-28"
        role="img"
        style={{ background: `conic-gradient(${riskColor(score)} 0 ${normalized}%, ${trackColor} ${normalized}% 100%)` }}
      >
        <div className="absolute inset-3 rounded-full bg-white" />
        <strong className="relative z-10 text-2xl font-black tracking-[-0.06em] text-text-primary sm:text-3xl">{normalized}</strong>
      </div>
      <div className="text-center sm:text-left">
        <span className={score >= 75 ? "tag tag-bad" : score >= 45 ? "tag tag-warn" : "tag tag-ok"}>Riesgo {label}</span>
        <p className="mt-3 text-body-sm leading-6 text-text-secondary">Puntaje estimado por agentes. Sirve para priorizar acción, no reemplaza revisión legal.</p>
      </div>
    </div>
  );
}
