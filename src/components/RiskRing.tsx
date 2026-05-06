"use client";

import type { RiskLabel } from "@/lib/types";

interface RiskRingProps {
  score: number;
  label: RiskLabel;
}

function riskColor(score: number) {
  if (score >= 75) return "var(--red)";
  if (score >= 45) return "var(--amber)";
  return "var(--green)";
}

export function RiskRing({ score, label }: RiskRingProps) {
  const normalized = Math.max(0, Math.min(100, score));

  return (
    <div className="grid gap-4 rounded-[22px] border border-amber-200 bg-gradient-to-br from-orange-50 to-white p-5 sm:grid-cols-[112px_1fr] sm:items-center">
      <div
        className="relative grid h-28 w-28 place-items-center rounded-full"
        style={{ background: `conic-gradient(${riskColor(score)} 0 ${normalized}%, #ffedd5 ${normalized}% 100%)` }}
      >
        <div className="absolute inset-3 rounded-full bg-white" />
        <strong className="relative z-10 text-3xl font-black tracking-[-0.06em] text-slate-950">{normalized}</strong>
      </div>
      <div>
        <span className={score >= 75 ? "tag tag-bad" : score >= 45 ? "tag tag-warn" : "tag tag-ok"}>Riesgo {label}</span>
        <p className="mt-3 text-sm leading-6 text-slate-600">Puntaje estimado por agentes. Sirve para priorizar acción, no reemplaza revisión legal.</p>
      </div>
    </div>
  );
}
