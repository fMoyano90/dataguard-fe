"use client";

import { motion } from "framer-motion";

interface HowToModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { step: 1, title: "Pega tu contrato", text: "Copia el texto del contrato o documento que quieras revisar y pégalo en el formulario." },
  { step: 2, title: "El Escudo analiza", text: "Revisamos cláusulas abusivas, riesgos legales y tu protección bajo la ley chilena." },
  { step: 3, title: "Recibe tu plan", text: "Obtén un resumen claro del riesgo, los 3 pilares de defensa y un plan de acción concreto." },
  { step: 4, title: "Genera cartas", text: "Descarga cartas listas para enviar al banco, SERNAC o la entidad correspondiente." },
];

export function HowToModal({ open, onClose }: HowToModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2 }}
      >
        <button
          className="absolute right-4 top-4 text-text-tertiary hover:text-text-primary"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        <h2 className="text-2xl font-black tracking-[-0.05em] text-text-primary">Cómo usar Data Guard</h2>
        <p className="mt-2 text-body-sm text-text-secondary">4 pasos simples para proteger tus derechos.</p>
        <ol className="mt-6 space-y-5">
          {steps.map((s) => (
            <li className="flex gap-4" key={s.step}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/10 text-sm font-black text-primary-500">
                {s.step}
              </span>
              <div>
                <strong className="block text-text-primary">{s.title}</strong>
                <span className="text-body-sm text-text-secondary">{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
        <button
          className="mt-6 w-full rounded-xl bg-primary-500 py-3 font-bold text-white hover:bg-primary-600"
          onClick={onClose}
          type="button"
        >
          Entendido, ¡empecemos!
        </button>
      </motion.div>
    </div>
  );
}
