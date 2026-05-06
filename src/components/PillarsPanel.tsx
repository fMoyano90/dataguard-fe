"use client";

import { motion } from "framer-motion";
import type { PillarItem, Pillars } from "@/lib/types";

interface PillarsPanelProps {
  pillars: Pillars;
}

const pillarConfig = [
  { key: "good", title: "Lo Bueno", className: "border-success-200 bg-success-50", tag: "tag tag-ok" },
  { key: "bad", title: "Lo Malo", className: "border-warning-200 bg-warning-50", tag: "tag tag-warn" },
  { key: "red", title: "Alertas Rojas", className: "border-danger-200 bg-danger-50", tag: "tag tag-bad" },
] as const;

function PillarCard({ item, tag }: { item: PillarItem; tag: string }) {
  return (
    <article className="rounded-[18px] border border-white/80 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <strong className="text-body-sm leading-5 text-text-primary">{item.title}</strong>
        {item.severity ? <span className={tag}>{item.severity}</span> : null}
      </div>
      <p className="mt-2 text-body-sm leading-6 text-text-secondary">{item.detail}</p>
      {item.citation ? (
        <a className="tag tag-info mt-3 font-mono" href={item.citation.url} rel="noreferrer" target="_blank">
          {item.citation.articulo} - {item.citation.ley}
        </a>
      ) : null}
    </article>
  );
}

export function PillarsPanel({ pillars }: PillarsPanelProps) {
  return (
    <section className="grid gap-4">
      {pillarConfig.map((config, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[24px] border p-4 ${config.className}`}
          initial={{ opacity: 0, y: 8 }}
          key={config.key}
          transition={{ delay: index * 0.08 }}
        >
          <h3 className="mb-4 text-xl font-black tracking-[-0.05em] text-text-primary">{config.title}</h3>
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
