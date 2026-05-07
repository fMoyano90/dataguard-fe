"use client";

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

interface PlanListProps {
  plan: string[];
}

export function PlanList({ plan }: PlanListProps) {
  return (
    <section className="demo-panel p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-black tracking-[-0.04em] text-text-primary sm:text-xl sm:tracking-[-0.05em]">Plan de acción</h3>
        <span className="tag tag-info">Lenguaje simple</span>
      </div>
      <ol className="grid gap-3">
        {plan.map((item, index) => (
          <li className="flex gap-3 rounded-[18px] border border-gray-200 bg-white p-3 sm:p-4" key={item}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-100 text-body-sm font-black text-primary-700">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm leading-6 text-text-primary">{renderMarkdown(item)}</p>
              <span className="tag tag-info mt-2">Acción</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
