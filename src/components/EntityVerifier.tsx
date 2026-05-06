"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { EntityCheckInput, EntityCheckResult } from "@/lib/types";

interface EntityVerifierProps {
  onVerify: (input: EntityCheckInput) => Promise<EntityCheckResult>;
  onVerified?: (result: EntityCheckResult) => void;
}

function getMainBadge(result: EntityCheckResult) {
  if (result.isImitator) return { label: "Posible imitador", className: "tag tag-bad" };
  if (result.registered) return { label: "Registrado en CMF", className: "tag tag-ok" };
  return { label: "Sin coincidencia", className: "tag tag-warn" };
}

export function EntityVerifier({ onVerify, onVerified }: EntityVerifierProps) {
  const [name, setName] = useState("Lucas Fácil");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EntityCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() && !url.trim()) {
      setError("Ingresa un nombre o link sospechoso.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const nextResult = await onVerify({ name: name.trim() || undefined, url: url.trim() || undefined });
      setResult(nextResult);
      onVerified?.(nextResult);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo verificar la entidad.");
    } finally {
      setLoading(false);
    }
  }

  const badge = result ? getMainBadge(result) : null;
  const phishing = result?.phishtank;

  return (
    <section className="demo-card p-5 sm:p-6" id="entity-verifier">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="tag tag-info">Flujo rápido</span>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-slate-950">Verificar entidad fintech</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Consulta CMF y, si pegas un link, marca riesgo PhishTank.</p>
        </div>
        <span className="tag tag-violet">Objetivo: &lt;3s</span>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Nombre de la app/empresa
          <input
            className="form-field px-4 py-3 font-semibold"
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Lucas Fácil, BancoEstado, Santander..."
            value={name}
          />
        </label>
        <label className="grid gap-2 text-sm font-black text-slate-700">
          Link sospechoso opcional
          <input
            className="form-field px-4 py-3 font-semibold"
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Ej: http://lucasfacil.app/login"
            value={url}
          />
        </label>
        <button className="btn-primary px-5 py-3" disabled={loading} type="submit">
          {loading ? "Verificando..." : "Verificar"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm font-bold text-red-700">{error}</p> : null}

      <AnimatePresence>
        {result && badge ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-[20px] border border-slate-200 bg-white p-4"
            exit={{ opacity: 0, y: 6 }}
            initial={{ opacity: 0, y: 8 }}
          >
            <div className="flex flex-wrap gap-2">
              <span className={badge.className}>{badge.label}</span>
              <span className="tag tag-info">CMF</span>
              {phishing ? (
                <span className={phishing.valid_phish ? "tag tag-bad" : "tag tag-ok"}>
                  PhishTank {phishing.verified ? "verified" : "checked"}
                </span>
              ) : null}
              {result._mocked ? <span className="tag tag-warn">mock</span> : null}
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{result.evidence ?? result.source}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">Fuente: {result.source}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
