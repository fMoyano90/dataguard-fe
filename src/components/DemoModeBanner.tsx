"use client";

interface DemoModeBannerProps {
  backendDown?: boolean;
  mocked?: boolean;
}

export function DemoModeBanner({ backendDown = false, mocked = true }: DemoModeBannerProps) {
  const label = backendDown ? "Backend down" : mocked ? "Modo mock" : "Backend real";
  const labelClass = backendDown || mocked ? "tag tag-warn" : "tag tag-ok";

  return (
    <div
      className={`demo-panel flex flex-col gap-2 px-4 py-3 text-sm font-bold sm:flex-row sm:items-center sm:justify-between ${
        backendDown || mocked ? "border-amber-200 bg-amber-50/90" : "border-emerald-200 bg-emerald-50/90"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={labelClass}>{label}</span>
        <span className="text-slate-700">Zero Storage: datos enmascarados y no persistidos</span>
      </div>
      <span className="text-slate-600">
        {backendDown ? "Fallback offline activo" : "Ley 21.719: multas hasta 20.000 UTM"}
      </span>
    </div>
  );
}
