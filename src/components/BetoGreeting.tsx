"use client";

export function BetoGreeting() {
  return (
    <section className="demo-card relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 20%, transparent) 0%, color-mix(in srgb, var(--color-accent-violet) 10%, transparent) 70%)",
        }}
      />
      <div className="relative z-10 max-w-4xl">
        <h1 className="mt-4 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.07em] text-text-primary sm:text-5xl lg:text-6xl">
          Hola. <br></br>Soy el Escudo de tus Datos.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
          Sube lo que te enviaron para firmar o lo que ya firmaste. Detecto cláusulas abusivas, riesgos y posibles trampas. Si detecto algo, preparo cartas simples para reclamar, pedir información o ejercer derechos sobre tus datos.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="tag tag-warn">41% no lee contratos</span>
          <span className="tag tag-bad">20.000 UTM</span>
          <span className="tag tag-violet">122 entidades denunciadas 2025</span>
        </div>
      </div>
    </section>
  );
}
