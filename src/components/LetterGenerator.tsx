"use client";

import { useState } from "react";
import { Button } from "./Button";

interface LetterGeneratorProps {
  letters: {
    bank?: string;
    sernac?: string;
  };
  onCopied?: () => void;
  onDownloaded?: () => void;
}

type LetterTab = "bank" | "sernac";

export function LetterGenerator({ letters, onCopied, onDownloaded }: LetterGeneratorProps) {
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
    <section className="demo-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-black tracking-[-0.04em] text-text-primary sm:text-xl sm:tracking-[-0.05em]">Cartas generadas</h3>
          <p className="mt-1 text-body-sm text-text-secondary">Borradores revisables antes de enviar.</p>
        </div>
        <span className="tag tag-warn">No reemplaza asesoría legal</span>
      </div>

      <div className="mb-4 flex gap-1 rounded-2xl bg-gray-100 p-1 sm:gap-2" role="tablist">
        <button
          aria-selected={activeTab === "bank"}
          className={`flex-1 rounded-xl px-3 py-2 text-caption font-black sm:flex-initial sm:px-4 ${activeTab === "bank" ? "bg-white text-primary-700 shadow-sm" : "text-text-tertiary"}`}
          disabled={!letters.bank}
          onClick={() => setActiveTab("bank")}
          role="tab"
          type="button"
        >
          Carta al Banco
        </button>
        <button
          aria-selected={activeTab === "sernac"}
          className={`flex-1 rounded-xl px-3 py-2 text-caption font-black sm:flex-initial sm:px-4 ${activeTab === "sernac" ? "bg-white text-primary-700 shadow-sm" : "text-text-tertiary"}`}
          disabled={!letters.sernac}
          onClick={() => setActiveTab("sernac")}
          role="tab"
          type="button"
        >
          Reclamo SERNAC
        </button>
      </div>

      <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded-[18px] border border-gray-200 bg-gray-50 p-3 font-mono text-[12px] leading-6 text-gray-700 sm:max-h-[420px] sm:p-4 sm:text-body-sm sm:leading-7">
        {current ?? "Carta no disponible para este escenario."}
      </pre>

      <div className="btn-row mt-4 flex gap-2">
        <Button aria-label="Copiar carta al portapapeles" className="w-full sm:w-auto" disabled={!current} onClick={copyLetter} variant="primary">
          Copiar
        </Button>
        <Button aria-label="Descargar carta como archivo de texto" className="w-full sm:w-auto" disabled={!current} onClick={downloadLetter} variant="secondary">
          Descargar TXT
        </Button>
      </div>
    </section>
  );
}
