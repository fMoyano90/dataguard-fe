"use client";

interface PlanListProps {
  plan: string[];
}

export function PlanList({ plan }: PlanListProps) {
  return (
    <section className="demo-panel p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-black tracking-[-0.05em] text-slate-950">Plan de acción para Beto</h3>
        <span className="tag tag-info">Lenguaje simple</span>
      </div>
      <ol className="grid gap-3">
        {plan.map((item, index) => (
          <li className="flex gap-3 rounded-[18px] border border-slate-200 bg-white p-4" key={item}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-black text-blue-700">{index + 1}</span>
            <div>
              <strong className="block text-sm leading-6 text-slate-950">{item}</strong>
              <span className="tag tag-info mt-2">Acción</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
