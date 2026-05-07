"use client";

import { useRef, useState } from "react";
import { checkEntity, runAnalysis } from "@/lib/api";
import { getScenarioFixture } from "@/lib/mockApi";
import type { AgentName, AnalysisResult, CreateAnalysisInput, EntityCheckResult, Scenario } from "@/lib/types";
import { AgentTimeline, type AgentStatus } from "./AgentTimeline";
import { BetoGreeting } from "./BetoGreeting";
import { CaseInputForm } from "./CaseInputForm";

import { EntityVerifier } from "./EntityVerifier";
import { FAQSection } from "./FAQSection";
import { ResultsPanel } from "./ResultsPanel";
import { ScenarioCards } from "./ScenarioCards";
import { Toast } from "./Toast";

type AgentStateMap = Partial<Record<AgentName, AgentStatus>>;

const initialAgentStates: AgentStateMap = {
  intake: "idle",
  regulatory: "idle",
  risk: "idle",
  recommendation: "idle",
  validator: "idle",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function BetoDemo() {
  const verifierRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>("credito_trampa");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lastEntityCheck, setLastEntityCheck] = useState<EntityCheckResult | null>(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [agentStates, setAgentStates] = useState<AgentStateMap>(initialAgentStates);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function playTimeline(request: Promise<AnalysisResult>) {
    setTimelineOpen(true);
    setProgress(8);
    setAgentStates({ ...initialAgentStates, intake: "running" });
    await sleep(650);
    setProgress(28);
    setAgentStates({ ...initialAgentStates, intake: "done", regulatory: "running", risk: "running" });
    await sleep(900);
    setProgress(62);
    setAgentStates({ ...initialAgentStates, intake: "done", regulatory: "done", risk: "done", recommendation: "running", validator: "running" });
    const response = await request;
    setProgress(100);
    setAgentStates({ intake: "done", regulatory: "done", risk: "done", recommendation: "done", validator: "done" });
    await sleep(350);
    setTimelineOpen(false);
    return response;
  }

  async function handleSubmit(input: CreateAnalysisInput) {
    setSubmitting(true);
    try {
      const response = await playTimeline(runAnalysis(input));
      setResult(response);
      showToast(response.meta.mocked ? "Análisis listo en modo mock." : "Análisis listo con backend real.");
      window.setTimeout(() => scrollTo(resultsRef), 80);
    } catch (cause) {
      showToast(cause instanceof Error ? cause.message : "No se pudo ejecutar el análisis.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleScenarioSelect(scenario: Scenario, active: boolean) {
    setSelectedScenario(scenario);
    if (active) {
      showToast("Escenario activo cargado en el formulario.");
      window.setTimeout(() => scrollTo(formRef), 60);
      return;
    }

    setResult(getScenarioFixture(scenario));
    showToast("Vista demo precargada.");
    window.setTimeout(() => scrollTo(resultsRef), 60);
  }

  function handleVerified(entityCheck: EntityCheckResult) {
    setLastEntityCheck(entityCheck);
    if (entityCheck.isImitator) {
      setSelectedScenario("app_estafa");
      showToast("Entidad sospechosa detectada. Escenario Lucas Fácil seleccionado.");
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-[1480px] gap-3 px-3 py-3 sm:gap-5 sm:px-6 sm:py-4 lg:px-8">
      <BetoGreeting />

      <div ref={formRef}>
        <CaseInputForm
          defaultScenario={selectedScenario}
          disabled={submitting}
          hasResult={result !== null}
          onReset={() => setResult(null)}
          onSubmit={handleSubmit}
        />
      </div>

      <div ref={resultsRef}>
        <ResultsPanel
          onCopied={() => showToast("Carta copiada al portapapeles.")}
          onDownloaded={() => showToast("Carta descargada como TXT.")}
          onReviewed={() => showToast("Marcado como revisado en la demo.")}
          result={result}
        />
      </div>

      <ScenarioCards onSelect={handleScenarioSelect} selectedScenario={selectedScenario} />

      <div ref={verifierRef}>
        <EntityVerifier onVerified={handleVerified} onVerify={checkEntity} />
      </div>

      <FAQSection />

      <AgentTimeline agentStates={agentStates} open={timelineOpen} progress={progress} />
      <Toast message={toast} />
    </main>
  );
}
