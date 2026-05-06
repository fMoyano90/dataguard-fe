"use client";

import { useState } from "react";

interface LetterGeneratorProps {
  letters: {
    bank?: string;
    sernac?: string;
  };
  onCopied?: () => void;
  onDownloaded?: () => void;
  onReviewed?: () => void;
}

type LetterTab = "bank" | "sernac";

export function LetterGenerator({ letters, onCopied, onDownloaded, onReviewed }: LetterGeneratorProps) {
  const [activeTab, setActiveTab] = useState<LetterTab>(letters.bank ? "bank" : "sernac");
  const current = activeTab === "bank" ? letters.bank : letters.sernac;

  async function copyLetter() {
    if (!current) return;
    await navigator.clipboard.writeText(current);
    onCopied?.();
  }

  function downloadLetter() {
    if (!current) return;
    const blob = new Blob([current], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = activeTab === "bank" ? "carta-banco-beto.txt" : "reclamo-sernac-beto.txt";
    link.click();
    URL.revokeObjectURL(url);
    onDownloaded?.();
  }

  return (
    <section className="demo-panel p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black tracking-[-0.05em] text-slate-950">Cartas generadas</h3>
          <p className="mt-1 text-sm text-slate-600">Borradores revisables antes de enviar.</p>
        </div>
        <span className="tag tag-warn">No reemplaza asesoría legal</span>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl bg-slate-100 p-1">
        <button className={`rounded-xl px-4 py-2 text-xs font-black ${activeTab === "bank" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`} disabled={!letters.bank} onClick={() => setActiveTab("bank")} type="button">
          Carta al Banco
        </button>
        <button className={`rounded-xl px-4 py-2 text-xs font-black ${activeTab === "sernac" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`} disabled={!letters.sernac} onClick={() => setActiveTab("sernac")} type="button">
          Reclamo SERNAC
        </button>
      </div>

      <pre className="max-h-[420px] overflow-auto whitespace-pre-line rounded-[18px] border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-700">
        {current ?? "Carta no disponible para este escenario."}
      </pre>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button className="btn-primary px-4 py-3" disabled={!current} onClick={copyLetter} type="button">Copiar</button>
        <button className="btn-secondary px-4 py-3" disabled={!current} onClick={downloadLetter} type="button">Descargar TXT</button>
        <button className="btn-secondary px-4 py-3" onClick={onReviewed} type="button">Marcar como revisado</button>
      </div>
    </section>
  );
}
