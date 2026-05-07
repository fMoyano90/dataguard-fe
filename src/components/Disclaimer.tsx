"use client";

interface Source {
  ley: string;
  fecha: string;
  url?: string;
}

interface DisclaimerProps {
  sources: Source[];
  lastUpdated: string;
}

export function Disclaimer({ sources, lastUpdated }: DisclaimerProps) {
  return (
    <aside
      aria-label="Descargo de responsabilidad y fuentes legales"
      className="rounded-[16px] border border-primary-200 bg-primary-50 p-4 sm:p-6"
    >
      <header className="flex items-center gap-2">
        <span aria-hidden className="text-xl text-primary-600">ℹ️</span>
        <h3 className="text-h3 text-primary-900">Descargo de responsabilidad</h3>
      </header>

      <p className="mt-3 text-body-lg text-text-primary">
        Esta auditoría es <strong>educación</strong>, no asesoría legal. Beto, consulta siempre con
        un abogado antes de tomar decisiones legales.
      </p>

      <div className="mt-5">
        <p className="text-caption text-text-tertiary uppercase tracking-wider">
          Fuentes verificadas
        </p>
        <ul className="break-anywhere mt-2 space-y-1 font-mono text-body-sm text-text-secondary">
          {sources.map((s) => (
            <li key={`${s.ley}-${s.fecha}`}>
              <span aria-hidden>• </span>
              {s.url ? (
                <a
                  className="text-primary-600 underline-offset-2 hover:underline"
                  href={s.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {s.ley}
                </a>
              ) : (
                s.ley
              )}{" "}
              <span className="text-text-tertiary">({s.fecha})</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-4 border-t border-gray-200 pt-3 text-caption text-text-tertiary">
        Última actualización: {lastUpdated}
      </footer>
    </aside>
  );
}
