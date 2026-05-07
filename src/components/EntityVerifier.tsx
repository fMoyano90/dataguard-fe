"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { EntityCheckInput, EntityCheckResult } from "@/lib/types";
import { Button } from "./Button";

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
  const [name, setName] = useState("");
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
    <section className="demo-card p-4 sm:p-6" id="entity-verifier">
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-text-primary sm:mt-3 sm:text-2xl sm:tracking-[-0.05em]">Verificar entidad fintech</h2>
          <p className="mt-1 text-body-sm leading-6 text-text-secondary">Consulta CMF y, si pegas un link, marca riesgo PhishTank.</p>
        </div>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-body-sm font-black text-gray-700">
          Nombre de la app/empresa
          <input
            className="form-field px-4 py-3 font-semibold"
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej: Lucas Fácil, BancoEstado, Santander..."
            value={name}
          />
        </label>
        <label className="grid gap-2 text-body-sm font-black text-gray-700">
          Link sospechoso opcional
          <input
            className="form-field px-4 py-3 font-semibold"
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Ej: http://lucasfacil.app/login"
            value={url}
          />
        </label>
        <Button disabled={loading} type="submit" variant="primary">
          {loading ? "Verificando..." : "Verificar"}
        </Button>
      </form>

      {error ? <p className="mt-3 text-body-sm font-bold text-danger-700" role="alert">{error}</p> : null}

      <AnimatePresence>
        {result && badge ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-[20px] border border-gray-200 bg-white p-4"
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
            <p className="break-anywhere mt-3 text-body-sm font-semibold leading-6 text-gray-700">{result.evidence ?? result.source}</p>
            <p className="break-anywhere mt-1 text-caption font-bold text-text-tertiary">Fuente: {result.source}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
