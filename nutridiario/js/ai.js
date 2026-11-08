/* ---------- Claude (capability sample) ---------- */
let SAMPLE = null, LIM = null;
/* IA: dentro de claude.ai usa window.claude (capability "sample"); fuera, usa el servidor propio (server/server.js).
   En ambos casos SAMPLE tiene la misma forma: SAMPLE(input, opts) -> {text} y SAMPLE.json(input, opts) -> objeto. */
const API_BASE = (window.NUTRI_API || "").replace(/\/$/, "");
const toB64 = file => new Promise((ok, ko) => {
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => { const r = Math.min(1, 1280 / Math.max(img.width, img.height)), c = document.createElement("canvas"); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok({ type: "image/jpeg", data: c.toDataURL("image/jpeg", .85).split(",")[1] }); };
  img.onerror = () => { URL.revokeObjectURL(url); ko({ code: "image_rejected" }); };
  img.src = url;
});
const parseJSON = t => {
  t = String(t).replace(/```(?:json)?/gi, "").trim();
  try { return JSON.parse(t); } catch (e) { }
  const a = t.search(/[\[{]/), z = Math.max(t.lastIndexOf("]"), t.lastIndexOf("}"));
  if (a >= 0 && z > a) { try { return JSON.parse(t.slice(a, z + 1)); } catch (e) { } }
  throw { code: "invalid_json" };
};
function makeServerSample() {
  const call = async (input, opts = {}) => {
    const list = typeof input === "string" ? [{ role: "user", content: input }] : input.map(m => ({ role: m.role, content: m.content }));
    if (opts.images && opts.images.length) { const imgs = await Promise.all(opts.images.map(toB64)); list[list.length - 1] = { ...list[list.length - 1], images: imgs }; }
    let r;
    try { r = await fetch(API_BASE + "/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tier: opts.modelTier === "quick" ? "quick" : "default", messages: list }) }); }
    catch (e) { throw { code: "network" }; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: j.error || "upstream_error" };
    if (opts.onText) opts.onText({ text: j.text });
    return { text: j.text };
  };
  const fn = (input, opts) => call(input, opts);
  fn.json = async (input, opts) => parseJSON((await call(input, opts)).text);
  fn.limits = async () => ({ images: true });
  return fn;
}
(async () => {
  try {
    SAMPLE = await window.claude?.use("sample");
    if (SAMPLE) LIM = await SAMPLE.limits().catch(() => null);
    else {
      const h = await fetch(API_BASE + "/api/health").then(r => r.ok ? r.json() : null).catch(() => null);
      if (h && h.ai) { SAMPLE = makeServerSample(); LIM = { images: !!h.images }; }
    }
  } catch (e) { SAMPLE = null; }
  render();
})();
const aiErr = e => ({ not_granted: "No has permitido usar Claude en esta página.", rate_limited: "Demasiadas peticiones seguidas. Espera un momento y vuelve a probar.", image_rejected: "No he podido leer esa imagen. Prueba con otra foto (JPG o PNG).",
  network: "No hay conexión con el servidor de IA.", upstream_error: "El servicio de IA ha fallado. Inténtalo de nuevo en un momento.", invalid_json: "No he entendido la respuesta. Inténtalo de nuevo con una descripción más concreta.", images_unavailable: "Aquí no se pueden enviar imágenes.", sampling_disabled: "La IA no está activa: falta la clave de Anthropic o Ollama no está en marcha.", model_missing: "Falta descargar el modelo en Ollama (ollama pull llama3.2).", cancelled: "" }[e && e.code] || "Algo ha fallado al consultar a Claude. Inténtalo otra vez.");
const NUTRI_FMT = 'Responde SOLO con un array JSON. Cada elemento: {"nombre":string,"gramos":number,"kcal":number,"proteinas":number,"carbohidratos":number,"grasas":number,"fibra":number,"azucar":number,"sodio_mg":number}. Los valores son del total de esa cantidad en gramos, no por 100 g.';
const num = v => { v = +v; return isFinite(v) && v >= 0 ? v : 0; };
const toItem = x => ({ id: uid(), name: String(x.nombre || "Alimento"), g: num(x.gramos), k: num(x.kcal), p: num(x.proteinas), c: num(x.carbohidratos), f: num(x.grasas), fi: num(x.fibra), s: num(x.azucar), na: num(x.sodio_mg) });
async function runAI(prompt, opts, after) {
  if (!SAMPLE) return;
  ui.busy = true; ui.err = ""; render();
  try { const r = await SAMPLE.json(prompt, opts || { modelTier: "quick" }); after(r); }
  catch (e) { ui.err = aiErr(e); }
  ui.busy = false; render();
}
function estimate(instruction, imgs) {
  runAI(instruction + "\n\n" + NUTRI_FMT + "\nSi no puedes identificar nada, responde []. Estima porciones habituales si no se indican.", { modelTier: "quick", ...(imgs ? { images: imgs } : {}) },
    r => { const a = (Array.isArray(r) ? r : [r]).filter(Boolean).map(toItem); ui.ai = { items: a }; if (!a.length) ui.err = "No he encontrado alimentos. Descríbelos con más detalle."; });
}
