"use client";

export function BetoGreeting() {
  return (
    <section className="demo-card relative overflow-hidden p-5 sm:p-8 lg:p-10">
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-48 w-48 rounded-full sm:-right-20 sm:-top-20 sm:h-72 sm:w-72"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 20%, transparent) 0%, color-mix(in srgb, var(--color-accent-violet) 10%, transparent) 70%)",
        }}
      />
      <div className="relative z-10 max-w-4xl">
        <h1 className="mt-2 max-w-3xl text-2xl font-black leading-[1.05] tracking-[-0.05em] text-text-primary sm:mt-4 sm:text-5xl sm:leading-[0.95] sm:tracking-[-0.07em] lg:text-6xl">
          Hola. <br />Soy el Escudo de tus Datos.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:mt-4 sm:text-lg sm:leading-8">
          Sube lo que te enviaron para firmar o lo que ya firmaste. Detecto cláusulas abusivas, riesgos y posibles trampas. Si detecto algo, preparo cartas simples para reclamar, pedir información o ejercer derechos sobre tus datos.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
          <span className="tag tag-warn">41% no lee contratos</span>
          <span className="tag tag-bad">20.000 UTM</span>
          <span className="tag tag-violet">122 entidades denunciadas 2025</span>
        </div>
      </div>
    </section>
  );
}
