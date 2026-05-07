"use client";

import { motion } from "framer-motion";
import type { Scenario } from "@/lib/types";

interface ScenarioCardDefinition {
  id: Scenario;
  title: string;
  description: string;
  active: boolean;
  tags: { label: string; className: string }[];
}

const scenarios: ScenarioCardDefinition[] = [
  {
    id: "credito_trampa",
    title: "Crédito Trampa",
    description: "Contrato financiero con cesión amplia de datos transaccionales y terceros poco claros.",
    active: true,
    tags: [
      { label: "Contrato", className: "tag tag-info" },
      { label: "Ley 19.628", className: "tag tag-warn" },
    ],
  },
  {
    id: "app_estafa",
    title: "Lucas Fácil",
    description: "App de crédito sospechosa que imita entidades reguladas y empuja links externos.",
    active: true,
    tags: [
      { label: "CMF", className: "tag tag-info" },
      { label: "Fraude", className: "tag tag-bad" },
    ],
  },
  {
    id: "galpon",
    title: "Galpón",
    description: "Arriendo comercial con multas desproporcionadas, renuncias amplias y cierre unilateral.",
    active: false,
    tags: [
      { label: "Vista demo", className: "tag tag-violet" },
      { label: "Arriendo", className: "tag tag-warn" },
    ],
  },
  {
    id: "atd_software",
    title: "Software ATD",
    description: "Proveedor de contabilidad sin acuerdo claro de tratamiento de datos ni subprocesadores.",
    active: false,
    tags: [
      { label: "Vista demo", className: "tag tag-violet" },
      { label: "Ley 21.719", className: "tag tag-bad" },
    ],
  },
];

export function ScenarioCards() {
  return (
    <section className="demo-card p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-black tracking-[-0.04em] text-text-primary sm:text-xl">Casos de uso</h2>
        <p className="mt-1 text-body-sm text-text-secondary">Ejemplos reales de lo que el Escudo puede analizar por ti.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {scenarios.map((scenario, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="demo-panel p-4 text-left transition sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            key={scenario.id}
            transition={{ delay: index * 0.06, duration: 0.3 }}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {scenario.tags.map((tag) => (
                <span className={tag.className} key={tag.label}>{tag.label}</span>
              ))}
            </div>
            <h3 className="text-h3 text-text-primary">{scenario.title}</h3>
            <p className="mt-2 text-body-sm leading-6 text-text-secondary">{scenario.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
