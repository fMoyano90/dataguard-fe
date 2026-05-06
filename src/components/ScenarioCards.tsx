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

interface ScenarioCardsProps {
  selectedScenario?: Scenario;
  onSelect: (scenario: Scenario, active: boolean) => void;
}

export function ScenarioCards({ selectedScenario, onSelect }: ScenarioCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {scenarios.map((scenario, index) => {
        const selected = selectedScenario === scenario.id;
        return (
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className={`demo-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-500 ${
              selected ? "border-blue-500 ring-4 ring-blue-500/10" : ""
            }`}
            initial={{ opacity: 0, y: 12 }}
            key={scenario.id}
            onClick={() => onSelect(scenario.id, scenario.active)}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            type="button"
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {scenario.tags.map((tag) => (
                <span className={tag.className} key={tag.label}>{tag.label}</span>
              ))}
            </div>
            <h3 className="text-xl font-black tracking-[-0.05em] text-slate-950">{scenario.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{scenario.description}</p>
          </motion.button>
        );
      })}
    </section>
  );
}
