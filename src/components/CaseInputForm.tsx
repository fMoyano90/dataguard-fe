"use client";

import { useState } from "react";
import type { CreateAnalysisInput, Scenario } from "@/lib/types";

const scenarioDefaults: Record<Scenario, CreateAnalysisInput> = {
  credito_trampa: {
    scenario: "credito_trampa",
    text: "Cláusula 14: autorizo al banco a compartir mi historial de ventas, boletas y comportamiento de pago con aliados comerciales por 5 años para evaluar productos financieros futuros.",
    language: "es",
    entity: "Banco Cordillera Demo",
    documentType: "contract",
  },
  app_estafa: {
    scenario: "app_estafa",
    text: "La app Lucas Fácil me ofrece crédito inmediato, pide foto de carnet, cuenta bancaria y autorizar acceso a contactos antes de mostrar contrato completo.",
    language: "es",
    entity: "Lucas Fácil",
    documentType: "tos",
  },
  galpon: {
    scenario: "galpon",
    text: "Contrato de arriendo de galpón con multa diaria, término unilateral sin aviso y renuncia anticipada a reclamar ante autoridad competente.",
    language: "es",
    entity: "Inmobiliaria Galpones Sur Demo",
    documentType: "rental",
  },
  atd_software: {
    scenario: "atd_software",
    text: "Proveedor de software contable procesa ventas, clientes y pagos del negocio, pero no entrega acuerdo de tratamiento de datos ni lista subprocesadores.",
    language: "es",
    entity: "ContaNube Demo",
    documentType: "dpa",
  },
};

interface CaseInputFormProps {
  defaultScenario: Scenario;
  disabled?: boolean;
  onSubmit: (input: CreateAnalysisInput) => void;
}

export function CaseInputForm({ defaultScenario, disabled = false, onSubmit }: CaseInputFormProps) {
  const [state, setState] = useState({
    scenario: defaultScenario,
    form: scenarioDefaults[defaultScenario],
  });
  const form = state.scenario === defaultScenario ? state.form : scenarioDefaults[defaultScenario];

  function update<K extends keyof CreateAnalysisInput>(key: K, value: CreateAnalysisInput[K]) {
    setState({ scenario: defaultScenario, form: { ...form, [key]: value } });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <section className="demo-card p-5 sm:p-6" id="case-input">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="tag tag-info">Flujo profundo</span>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-slate-950">Analizar contrato o T&C</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Pega texto ficticio o enmascarado. En demo no se sube ni guarda nada.</p>
        </div>
        <button className="tag tag-violet" type="button">Mic decorativo</button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <textarea
          className="form-field min-h-40 resize-y px-4 py-3 text-sm leading-7"
          disabled={disabled}
          onChange={(event) => update("text", event.target.value)}
          placeholder="Pega aquí el contrato o T&C"
          value={form.text}
        />

        <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <strong className="block text-sm text-slate-800">Subir PDF o foto</strong>
          <span className="mt-1 block text-xs font-bold text-slate-500">Decorativo: el archivo no se envía en este MVP</span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Tipo
            <select className="form-field px-3 py-3" value={form.documentType} onChange={(event) => update("documentType", event.target.value as CreateAnalysisInput["documentType"])}>
              <option value="contract">Contrato banco</option>
              <option value="tos">T&C app</option>
              <option value="rental">Arriendo</option>
              <option value="dpa">ATD</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Entidad
            <input className="form-field px-3 py-3" value={form.entity} onChange={(event) => update("entity", event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Idioma
            <select className="form-field px-3 py-3" value={form.language} onChange={(event) => update("language", event.target.value as CreateAnalysisInput["language"])}>
              <option value="es">Español simple</option>
              <option value="kreyol">Kreyol haitiano</option>
              <option value="quechua">Quechua</option>
              <option value="en">Inglés</option>
            </select>
          </label>
        </div>

        <button className="btn-primary px-5 py-3" disabled={disabled} type="submit">
          Activar el Escudo
        </button>
      </form>
    </section>
  );
}
