"use client";

import { useCallback, useRef, useState } from "react";
import { extractDocument } from "@/lib/api";
import { useSpeechRecognition, type SpeechLang } from "@/lib/hooks/useSpeechRecognition";
import type { CreateAnalysisInput, Scenario } from "@/lib/types";
import { Button } from "./Button";
import { HowToModal } from "./HowToModal";

const scenarioDefaults: Record<Scenario, CreateAnalysisInput> = {
  credito_trampa: {
    scenario: "credito_trampa",
    text: "",
    language: "es",
    entity: "",
    documentType: "contract",
    caseContext: "",
  },
  app_estafa: {
    scenario: "app_estafa",
    text: "",
    language: "es",
    entity: "",
    documentType: "tos",
    caseContext: "",
  },
  galpon: {
    scenario: "galpon",
    text: "",
    language: "es",
    entity: "",
    documentType: "rental",
    caseContext: "",
  },
  atd_software: {
    scenario: "atd_software",
    text: "",
    language: "es",
    entity: "",
    documentType: "dpa",
    caseContext: "",
  },
};

const ACCEPTED_MIMETYPES = "application/pdf,image/png,image/jpeg,image/webp";
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
const CASE_CONTEXT_MAX = 1000;
const CASE_TEXT_MAX = 50_000;

const LANG_TO_SPEECH: Record<CreateAnalysisInput["language"], SpeechLang> = {
  es: "es-CL",
  en: "en-US",
};

interface CaseInputFormProps {
  defaultScenario: Scenario;
  disabled?: boolean;
  hasResult?: boolean;
  onSubmit: (input: CreateAnalysisInput) => void;
  onReset?: () => void;
}

export function CaseInputForm({ defaultScenario, disabled = false, hasResult = false, onSubmit, onReset }: CaseInputFormProps) {
  const [state, setState] = useState({
    scenario: defaultScenario,
    form: scenarioDefaults[defaultScenario],
  });
  const form = state.scenario === defaultScenario ? state.form : scenarioDefaults[defaultScenario];

  const [uploadStatus, setUploadStatus] = useState<{
    state: "idle" | "uploading" | "success" | "error";
    message?: string;
    fileName?: string;
  }>({ state: "idle" });
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [howToOpen, setHowToOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseTextRef = useRef<string>("");

  const update = useCallback(
    <K extends keyof CreateAnalysisInput>(key: K, value: CreateAnalysisInput[K]) => {
      setState((prev) => {
        const current = prev.scenario === defaultScenario ? prev.form : scenarioDefaults[defaultScenario];
        return {
          scenario: defaultScenario,
          form: { ...current, [key]: value },
        };
      });
    },
    [defaultScenario],
  );

  const handleTranscript = useCallback(
    ({ transcript, isFinal }: { transcript: string; isFinal: boolean }) => {
      const separator = baseTextRef.current && !baseTextRef.current.endsWith(" ") ? " " : "";
      const next = `${baseTextRef.current}${separator}${transcript}`.slice(0, CASE_CONTEXT_MAX);
      setState((prev) => {
        const current = prev.scenario === defaultScenario ? prev.form : scenarioDefaults[defaultScenario];
        return {
          scenario: defaultScenario,
          form: { ...current, caseContext: next },
        };
      });
      if (isFinal) {
        baseTextRef.current = next;
      }
    },
    [defaultScenario],
  );

  const { isSupported: voiceSupported, isListening, start: startListening, stop: stopListening } = useSpeechRecognition({
    lang: LANG_TO_SPEECH[form.language],
    onTranscript: handleTranscript,
    onError: setVoiceError,
  });

  const toggleListening = useCallback(() => {
    setVoiceError(null);
    if (isListening) {
      stopListening();
      return;
    }
    baseTextRef.current = form.caseContext ?? "";
    startListening();
  }, [form.caseContext, isListening, startListening, stopListening]);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > MAX_DOCUMENT_BYTES) {
        setUploadStatus({
          state: "error",
          message: "El archivo supera 10 MB. Prueba con uno mas chico.",
          fileName: file.name,
        });
        return;
      }

      setUploadStatus({ state: "uploading", fileName: file.name });
      try {
        const result = await extractDocument(file);
        const base = form.text?.trim();
        const merged = base
          ? `${base}\n\n${result.text}`.slice(0, CASE_TEXT_MAX)
          : result.text.slice(0, CASE_TEXT_MAX);
        update("text", merged);
        baseTextRef.current = merged;
        setUploadStatus({
          state: "success",
          fileName: file.name,
          message: `Texto extraido (${result.charCount} caracteres${result.piiRedacted ? ", datos personales enmascarados" : ""}).`,
        });
      } catch (error) {
        setUploadStatus({
          state: "error",
          fileName: file.name,
          message: (error as Error).message,
        });
      }
    },
    [form.text, update],
  );

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      caseContext: form.caseContext?.trim() || undefined,
    });
  }

  function handleReset() {
    setState({
      scenario: defaultScenario,
      form: scenarioDefaults[defaultScenario],
    });
    setUploadStatus({ state: "idle" });
    baseTextRef.current = "";
    onReset?.();
  }

  return (
    <section className="demo-card p-4 sm:p-6" id="case-input">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-text-primary sm:mt-3 sm:text-2xl sm:tracking-[-0.05em]">Analizar contrato o términos y condiciones</h2>
          <p className="mt-1 text-body-sm leading-6 text-text-secondary">Pega texto o sube el contrato. No guardamos nada de tu información.</p>
        </div>
        <button
          className="shrink-0 rounded-xl border border-primary-500/20 px-4 py-2 text-sm font-bold text-primary-500 hover:bg-primary-500/10"
          onClick={() => setHowToOpen(true)}
          type="button"
        >
          ¿Cómo usar la app?
        </button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-body-sm font-black text-gray-700">
          <span>Contrato o términos y condiciones</span>
          <textarea
            className="form-field min-h-32 resize-y px-3 py-3 text-body-sm leading-7 sm:min-h-40 sm:px-4"
            disabled={disabled}
            maxLength={CASE_TEXT_MAX}
            onChange={(event) => update("text", event.target.value)}
            placeholder="Pega aqui el contrato o términos y condiciones, o sube un archivo abajo."
            value={form.text}
          />
        </label>

        <div
          className={`rounded-[20px] border-2 border-dashed p-4 text-center transition sm:p-5 ${
            uploadStatus.state === "error"
              ? "border-danger-300 bg-danger-50"
              : uploadStatus.state === "success"
                ? "border-success-300 bg-success-50"
                : "border-primary-300 bg-primary-50"
          }`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <strong className="block text-body-sm text-text-primary">Subir PDF o foto del contrato</strong>
          <span className="mt-1 block text-caption text-text-tertiary">PDF, PNG, JPG o WEBP (max 10 MB). Se extrae el texto y se enmascaran datos personales.</span>
          <input
            accept={ACCEPTED_MIMETYPES}
            className="hidden"
            disabled={disabled || uploadStatus.state === "uploading"}
            onChange={handleFileInput}
            ref={fileInputRef}
            type="file"
          />
          <Button
            className="mt-3"
            disabled={disabled || uploadStatus.state === "uploading"}
            onClick={() => fileInputRef.current?.click()}
            type="button"
            variant="secondary"
          >
            {uploadStatus.state === "uploading" ? "Extrayendo texto..." : "Elegir archivo"}
          </Button>
          {uploadStatus.fileName ? (
            <p className="mt-2 text-caption font-bold text-text-secondary">
              {uploadStatus.fileName}
              {uploadStatus.message ? ` — ${uploadStatus.message}` : ""}
            </p>
          ) : null}
        </div>

        <label className="grid gap-2 text-body-sm font-black text-gray-700">
          <span className="flex items-center justify-between">
            <span>Cuentanos sobre tu caso (recomendado)</span>
            <span className="text-caption font-normal text-text-tertiary">{(form.caseContext ?? "").length}/{CASE_CONTEXT_MAX}</span>
          </span>
          <textarea
            className="form-field min-h-44! resize-y px-3 py-3 text-body-sm leading-7 sm:min-h-28!"
            disabled={disabled}
            maxLength={CASE_CONTEXT_MAX}
            onChange={(event) => update("caseContext", event.target.value)}
            placeholder="¿Qué pasó? ¿Qué te preocupa? ¿Qué querés lograr? Ej: 'Mi mamá firmó esto hace 3 meses y ahora le cobran intereses altos.'"
            rows={5}
            value={form.caseContext ?? ""}
          />
          {isListening ? (
            <span className="text-caption font-bold" style={{ color: "var(--color-accent-violet)" }}>Grabando... Hacé clic en el botón para detener.</span>
          ) : null}
          <button
            aria-pressed={isListening}
            className={`mt-2 inline-flex w-full min-h-[44px] items-center justify-center gap-2 tag ${isListening ? "tag-violet animate-pulse" : "tag-info"} ${voiceSupported ? "" : "opacity-60"}`}
            disabled={!voiceSupported || disabled}
            onClick={toggleListening}
            title={voiceSupported ? "Dictar tu caso por voz" : "Tu navegador no soporta dictado. Usa Chrome o Edge."}
            type="button"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="23" />
              <line x1="8" x2="16" y1="23" y2="23" />
            </svg>
            <span className="uppercase">{isListening ? "Detener grabación" : "Dictar tu caso por voz"}</span>
          </button>
        </label>

        {voiceError ? (
          <p className="rounded-2xl bg-danger-50 px-4 py-2 text-caption font-bold text-danger-700" role="alert">{voiceError}</p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-2 text-body-sm font-black text-gray-700">
            Tipo
            <select className="form-field px-3 py-3" value={form.documentType} onChange={(event) => update("documentType", event.target.value as CreateAnalysisInput["documentType"])}>
              <option value="contract">Contrato con entidad financiera</option>
              <option value="tos">Términos y condiciones</option>
              <option value="rental">Contrato de arriendo</option>
              <option value="dpa">Acuerdo de tratamiento de datos</option>
            </select>
          </label>
          <label className="grid gap-2 text-body-sm font-black text-gray-700">
            Entidad
            <input className="form-field px-3 py-3" placeholder="Nombre de la entidad o empresa" value={form.entity} onChange={(event) => update("entity", event.target.value)} />
          </label>
          <label className="grid gap-2 text-body-sm font-black text-gray-700">
            Idioma
            <select className="form-field px-3 py-3" value={form.language} onChange={(event) => update("language", event.target.value as CreateAnalysisInput["language"])}>
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </label>
        </div>

        <div className="btn-row flex flex-col gap-3 sm:flex-row">
          <Button className="w-full sm:flex-1" disabled={disabled} type="submit" variant="primary">
            Activar el Escudo
          </Button>
          {hasResult ? (
            <Button className="w-full sm:w-auto sm:px-4" onClick={handleReset} type="button" variant="secondary">
              Nueva consulta
            </Button>
          ) : null}
        </div>
      </form>
      <HowToModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </section>
  );
}
