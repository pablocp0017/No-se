/* ---------- coach ---------- */
async function chat(msg) {
  msg = String(msg || "").trim(); if (!msg || !SAMPLE || ui.busy) return;
  ui.tab = "coach"; S.coach.push({ role: "user", content: msg }); S.coach = S.coach.slice(-16); ui.busy = true; ui.err = ""; render();
  const out = $("#coachOut"); out.hidden = false; out.textContent = "Pensando…";
  const rules = `Eres el coach de nutrición de la app NutriDiario. Responde en español, con frases cortas, prácticas y prudentes. No diagnostiques ni sustituyas a un médico o dietista. Usa estos datos del usuario:\n${ctxText()}${ui.pantry ? "\nIngredientes que tiene en casa: " + ui.pantry : ""}`;
  try { const { text } = await SAMPLE([{ role: "user", content: rules }, ...S.coach.map(m => ({ role: m.role, content: m.content }))], { cache: false, modelTier: "default", onText: ({ text }) => { const o = $("#coachOut"); if (o) o.textContent = text; } }); S.coach.push({ role: "assistant", content: text }); save(); }
  catch (e) { ui.err = aiErr(e); if (e && e.text) { S.coach.push({ role: "assistant", content: e.text }); save(); } }
  ui.busy = false; render();
}
