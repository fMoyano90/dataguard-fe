"use client";

import { motion } from "framer-motion";
import type { PillarItem, Pillars } from "@/lib/types";

interface PillarsPanelProps {
  pillars: Pillars;
}

const pillarConfig = [
  { key: "good", title: "Lo Bueno", className: "border-emerald-200 bg-emerald-50", tag: "tag tag-ok" },
  { key: "bad", title: "Lo Malo", className: "border-amber-200 bg-amber-50", tag: "tag tag-warn" },
  { key: "red", title: "Alertas Rojas", className: "border-red-200 bg-red-50", tag: "tag tag-bad" },
] as const;

function PillarCard({ item, tag }: { item: PillarItem; tag: string }) {
  return (
    <article className="rounded-[18px] border border-white/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <strong className="text-sm leading-5 text-slate-950">{item.title}</strong>
        {item.severity ? <span className={tag}>{item.severity}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
      {item.citation ? (
        <a className="tag tag-info mt-3" href={item.citation.url} rel="noreferrer" target="_blank">
          {item.citation.articulo} - {item.citation.ley}
        </a>
      ) : null}
    </article>
  );
}

export function PillarsPanel({ pillars }: PillarsPanelProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {pillarConfig.map((config, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[24px] border p-4 ${config.className}`}
          initial={{ opacity: 0, y: 8 }}
          key={config.key}
          transition={{ delay: index * 0.08 }}
        >
          <h3 className="mb-4 text-xl font-black tracking-[-0.05em] text-slate-950">{config.title}</h3>
          <div className="grid gap-3">
            {pillars[config.key].map((item) => (
              <PillarCard item={item} key={`${config.key}-${item.title}`} tag={config.tag} />
            ))}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
