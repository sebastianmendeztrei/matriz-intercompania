// Carga la configuración desde el endpoint /api/config, que lee las
// env vars de Vercel. Nada sensible vive en el repo.
window.MATRIZ_CFG_READY = (async () => {
  try {
    const r = await fetch("/api/config");
    if (!r.ok) throw new Error("HTTP " + r.status);
    const cfg = await r.json();
    window.MATRIZ_CFG = cfg;
    return cfg;
  } catch (e) {
    console.error("No se pudo cargar /api/config:", e);
    throw e;
  }
})();
