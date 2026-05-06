"use client";

interface BetoGreetingProps {
  onStart?: () => void;
}

export function BetoGreeting({ onStart }: BetoGreetingProps) {
  return (
    <section className="demo-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/10" />
      <div className="relative z-10 max-w-4xl">
        <span className="tag tag-info uppercase tracking-[0.18em]">El Escudo de Beto</span>
        <h1 className="mt-4 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.07em] text-slate-950 sm:text-5xl lg:text-6xl">
          Hola Beto. Soy tu Escudo.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Pega lo que te enviaron, te aviso si es trampa y preparo cartas simples para reclamar antes de firmar.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="tag tag-warn">41% no lee contratos</span>
          <span className="tag tag-bad">20.000 UTM</span>
          <span className="tag tag-violet">122 entidades denunciadas 2025</span>
        </div>
        <button className="btn-primary mt-8 px-5 py-3" type="button" onClick={onStart}>
          Ir a verificar una entidad
        </button>
      </div>
    </section>
  );
}
