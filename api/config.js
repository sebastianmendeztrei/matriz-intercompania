// Vercel Serverless Function.
// Devuelve la configuración pública del cliente de Supabase para esta app.
// Las vars viven en Vercel → Settings → Environment Variables, nunca en el repo.
export default function handler(_req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    res.status(500).json({
      error: "Faltan env vars",
      detail: "Configurar SUPABASE_URL y SUPABASE_ANON_KEY en Vercel.",
    });
    return;
  }

  // Cache corto en el edge (no hay secretos aquí, pero evita hits innecesarios)
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  res.status(200).json({
    SUPABASE_URL: url,
    SUPABASE_ANON_KEY: key,
  });
}
