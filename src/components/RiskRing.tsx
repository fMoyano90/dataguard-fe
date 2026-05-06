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
    <div className="grid gap-4 rounded-[22px] border border-warning-200 bg-gradient-to-br from-warning-50 to-white p-5 sm:grid-cols-[112px_1fr] sm:items-center">
      <div
        aria-label={`Puntaje de riesgo ${normalized} de 100`}
        className="relative grid h-28 w-28 place-items-center rounded-full"
        role="img"
        style={{ background: `conic-gradient(${riskColor(score)} 0 ${normalized}%, ${trackColor} ${normalized}% 100%)` }}
      >
        <div className="absolute inset-3 rounded-full bg-white" />
        <strong className="relative z-10 text-3xl font-black tracking-[-0.06em] text-text-primary">{normalized}</strong>
      </div>
      <div>
        <span className={score >= 75 ? "tag tag-bad" : score >= 45 ? "tag tag-warn" : "tag tag-ok"}>Riesgo {label}</span>
        <p className="mt-3 text-body-sm leading-6 text-text-secondary">Puntaje estimado por agentes. Sirve para priorizar acción, no reemplaza revisión legal.</p>
      </div>
    </div>
  );
}
