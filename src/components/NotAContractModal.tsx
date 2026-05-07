"use client";

import { motion } from "framer-motion";

interface NotAContractModalProps {
  open: boolean;
  message?: string;
  onClose: () => void;
}

export function NotAContractModal({ open, message, onClose }: NotAContractModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-8"
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2 }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="not-a-contract-title"
      >
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-warning-50 text-2xl">⚠️</div>
        <h2 id="not-a-contract-title" className="text-xl font-black tracking-[-0.04em] text-text-primary sm:text-2xl sm:tracking-[-0.05em]">
          Este documento no se puede analizar
        </h2>
        <p className="mt-2 text-body-sm leading-6 text-text-secondary">
          {message ??
            "Lo que subiste no corresponde a un contrato o términos y condiciones. Sube un contrato bancario, T&C, contrato de arriendo o anexo de tratamiento de datos para que el Escudo pueda revisarlo."}
        </p>
        <button
          className="mt-5 inline-flex w-full min-h-[44px] items-center justify-center rounded-2xl bg-primary-500 px-4 py-2 text-body-sm font-bold text-white hover:bg-primary-600"
          onClick={onClose}
          type="button"
        >
          Entendido
        </button>
      </motion.div>
    </div>
  );
}
