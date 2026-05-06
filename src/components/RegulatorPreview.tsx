"use client";

const rows = [
  { id: "BETO-001", scenario: "Crédito Trampa", entity: "Banco Cordillera Demo", source: "Contrato + BCN", risk: "Medio-alto", action: "Carta banco + SERNAC", className: "tag tag-warn" },
  { id: "BETO-002", scenario: "Lucas Fácil", entity: "Lucas Fácil", source: "CMF + PhishTank", risk: "Alto", action: "Alerta fraude", className: "tag tag-bad" },
  { id: "BETO-003", scenario: "Galpón", entity: "Galpones Sur Demo", source: "Contrato", risk: "Medio", action: "Renegociar cláusulas", className: "tag tag-warn" },
  { id: "BETO-004", scenario: "Software ATD", entity: "ContaNube Demo", source: "Ley 21.719", risk: "Alto", action: "Exigir ATD", className: "tag tag-bad" },
];

export function RegulatorPreview() {
  return (
    <section className="demo-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="tag tag-violet">Bonus B2G</span>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.05em] text-text-primary">Vista regulador</h2>
          <p className="mt-1 text-body-sm leading-6 text-text-secondary">Casos estructurados sin exponer PII para priorización pública.</p>
        </div>
        <span className="tag tag-ok">PII enmascarada</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-separate border-spacing-y-2 text-left text-body-sm">
          <thead>
            <tr className="text-caption uppercase tracking-[0.14em] text-text-tertiary">
              <th className="px-3 py-2">Caso</th>
              <th className="px-3 py-2">Escenario</th>
              <th className="px-3 py-2">Entidad</th>
              <th className="px-3 py-2">Fuente</th>
              <th className="px-3 py-2">Riesgo</th>
              <th className="px-3 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="rounded-l-2xl border-y border-l border-gray-200 bg-white px-3 py-4 font-mono font-black text-text-primary">{row.id}</td>
                <td className="border-y border-gray-200 bg-white px-3 py-4 text-gray-700">{row.scenario}</td>
                <td className="border-y border-gray-200 bg-white px-3 py-4 text-gray-700">{row.entity}</td>
                <td className="border-y border-gray-200 bg-white px-3 py-4 text-gray-700">{row.source}</td>
                <td className="border-y border-gray-200 bg-white px-3 py-4"><span className={row.className}>{row.risk}</span></td>
                <td className="rounded-r-2xl border-y border-r border-gray-200 bg-white px-3 py-4 text-gray-700">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
