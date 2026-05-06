"use client";

import { useState } from "react";

const faqs = [
  {
    q: "¿Esto es asesoría legal?",
    a: "No. Data Guard IA es una herramienta informativa que te ayuda a entender cláusulas y riesgos en lenguaje simple. No reemplaza a un abogado. Si tu caso es grave, consulta con un profesional o acude al SERNAC.",
  },
  {
    q: "¿Se guardan mis datos o los de mi contrato?",
    a: "No. Esta demo no almacena nada. Los datos que ingresás se procesan en el momento y no se persisten en ningún servidor.",
  },
  {
    q: "¿Qué leyes usa para analizar?",
    a: "Se basa en la Ley 21.719 (protección de datos personales), Ley 21.521 (Fintech), Ley 19.628 (vida privada) y Ley 19.496/21.398 (derechos del consumidor).",
  },
  {
    q: "¿Puedo usar esto con un contrato real?",
    a: "Sí, podés pegar el texto de cualquier contrato, términos y condiciones o acuerdo. La herramienta te mostrará riesgos y sugerencias en lenguaje simple.",
  },
  {
    q: "¿Qué tipos de documentos puedo analizar?",
    a: "Contratos bancarios, términos y condiciones de apps, contratos de arriendo y acuerdos de tratamiento de datos personales.",
  },
  {
    q: "¿Cómo verifico si una app o empresa es legítima?",
    a: "Usá la sección 'Verificar entidad fintech' más abajo. Consultamos el registro de la CMF y PhishTank para detectar posibles imitadores o estafas.",
  },
  {
    q: "¿Qué hago si encuentro una cláusula abusiva?",
    a: "La herramienta te genera cartas modelo para reclamar. Podés copiarlas o descargarlas. También podés presentar un reclamo en SERNAC o en la CMF si corresponde.",
  },
  {
    q: "¿Es gratis?",
    a: "Esta demo es gratuita y de código abierto. Es un proyecto educativo para proteger a consumidores y microemprendedores.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto w-full max-w-[1480px] px-3 py-8 sm:px-6 lg:px-8" id="faq">
      <h2 className="text-2xl font-black tracking-[-0.05em] text-text-primary">Preguntas frecuentes</h2>
      <p className="mt-2 max-w-2xl text-body-sm leading-6 text-text-secondary">
        Lo más consultado antes de usar la herramienta.
      </p>

      <div className="mt-6 grid gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="rounded-[20px] border border-gray-200 bg-white">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left text-body-sm font-bold text-text-primary"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                type="button"
              >
                <span>{faq.q}</span>
                <span className={`ml-4 text-lg transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-body-sm leading-6 text-text-secondary">{faq.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
