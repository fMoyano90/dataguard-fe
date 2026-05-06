"use client";

import { motion } from "framer-motion";

const metrics = [
  { label: "Escenarios cubiertos", value: "4", detail: "Crédito, app, galpón y ATD" },
  { label: "Fuentes públicas", value: "6", detail: "CMF, BCN, SERNAC, CSIRT y más" },
  { label: "Acciones automáticas", value: "2", detail: "Carta al banco y reclamo SERNAC" },
  { label: "Datos persistidos", value: "0", detail: "Modo demo efímero" },
];

export function DashboardSummary() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="demo-panel p-5"
          initial={{ opacity: 0, y: 10 }}
          key={metric.label}
          transition={{ delay: index * 0.05 + 0.15, duration: 0.3 }}
        >
          <span className="text-caption uppercase tracking-[0.16em] text-text-tertiary">{metric.label}</span>
          <strong className="mt-2 block text-4xl font-black tracking-[-0.06em] text-text-primary">{metric.value}</strong>
          <small className="mt-1 block text-body-sm font-bold text-text-tertiary">{metric.detail}</small>
        </motion.article>
      ))}
    </section>
  );
}
