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
          <h3 className="text-xl font-black tracking-[-0.05em] text-text-primary">Cartas generadas</h3>
          <p className="mt-1 text-body-sm text-text-secondary">Borradores revisables antes de enviar.</p>
        </div>
        <span className="tag tag-warn">No reemplaza asesoría legal</span>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl bg-gray-100 p-1" role="tablist">
        <button
          aria-selected={activeTab === "bank"}
          className={`rounded-xl px-4 py-2 text-caption font-black ${activeTab === "bank" ? "bg-white text-primary-700 shadow-sm" : "text-text-tertiary"}`}
          disabled={!letters.bank}
          onClick={() => setActiveTab("bank")}
          role="tab"
          type="button"
        >
          Carta al Banco
        </button>
        <button
          aria-selected={activeTab === "sernac"}
          className={`rounded-xl px-4 py-2 text-caption font-black ${activeTab === "sernac" ? "bg-white text-primary-700 shadow-sm" : "text-text-tertiary"}`}
          disabled={!letters.sernac}
          onClick={() => setActiveTab("sernac")}
          role="tab"
          type="button"
        >
          Reclamo SERNAC
        </button>
      </div>

      <pre className="max-h-[420px] overflow-auto whitespace-pre-line rounded-[18px] border border-gray-200 bg-gray-50 p-4 font-mono text-body-sm leading-7 text-gray-700">
        {current ?? "Carta no disponible para este escenario."}
      </pre>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button aria-label="Copiar carta al portapapeles" disabled={!current} onClick={copyLetter} variant="primary">
          Copiar
        </Button>
        <Button aria-label="Descargar carta como archivo de texto" disabled={!current} onClick={downloadLetter} variant="secondary">
          Descargar TXT
        </Button>
        <Button aria-label="Marcar carta como revisada" onClick={onReviewed} variant="secondary">
          Marcar como revisado
        </Button>
      </div>
    </section>
  );
}
