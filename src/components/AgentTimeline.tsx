"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { AgentName } from "@/lib/types";

export type AgentStatus = "idle" | "running" | "done" | "warn";

interface AgentTimelineProps {
  open: boolean;
  agentStates: Partial<Record<AgentName, AgentStatus>>;
  progress: number;
}

const agents: { id: AgentName; name: string; detail: string }[] = [
  { id: "intake", name: "Intake", detail: "Detecta caso, idioma y datos sensibles." },
  { id: "regulatory", name: "Regulatory", detail: "Busca leyes y fuentes citables." },
  { id: "risk", name: "Risk", detail: "Separa lo bueno, lo malo y alertas rojas." },
  { id: "recommendation", name: "Recommendation", detail: "Prepara pasos y cartas." },
  { id: "validator", name: "Validator", detail: "Revisa citas y evita afirmaciones inventadas." },
];

function dotClass(status: AgentStatus) {
  if (status === "running") return "bg-primary-600 shadow-[0_0_0_7px_color-mix(in_srgb,var(--color-primary-500)_18%,transparent)]";
  if (status === "done") return "bg-success-600";
  if (status === "warn") return "bg-danger-700";
  return "bg-gray-300";
}

export function AgentTimeline({ open, agentStates, progress }: AgentTimelineProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-gray-900/45 p-4 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
        <motion.div
          animate={{ scale: 1, y: 0 }}
          aria-live="polite"
          className="w-full max-w-3xl rounded-[28px] bg-white p-4 shadow-[0_28px_90px_rgba(7,17,31,0.32)] sm:p-6"
          exit={{ scale: 0.98, y: 8 }}
          initial={{ scale: 0.98, y: 10 }}
          role="status"
        >
          <h2 className="text-xl font-black tracking-[-0.05em] text-text-primary sm:text-2xl">Analizando con agentes IA</h2>
          <p className="mt-2 text-body-sm leading-6 text-text-secondary">El orquestador simula trabajo paralelo aunque el backend responda secuencialmente.</p>
            <div className="my-5 h-2 overflow-hidden rounded-full bg-gray-200" aria-label={`Progreso ${progress}%`}>
              <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-success-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="grid gap-3">
              {agents.map((agent) => {
                const status = agentStates[agent.id] ?? "idle";
                return (
                  <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white p-4" key={agent.id}>
                    <motion.span
                      animate={status === "running" ? { scale: [1, 1.16, 1] } : { scale: 1 }}
                      aria-hidden
                      className={`h-3 w-3 rounded-full ${dotClass(status)}`}
                      transition={status === "running" ? { duration: 1, repeat: Infinity } : undefined}
                    />
                    <div>
                      <strong className="block text-body-sm text-text-primary">{agent.name}</strong>
                      <span className="block text-caption font-semibold text-text-tertiary">{agent.detail}</span>
                    </div>
                    <span className="ml-auto text-caption font-black uppercase tracking-[0.14em] text-gray-400">{status}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
