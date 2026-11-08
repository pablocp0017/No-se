/* ---------- render ---------- */
const TABS = [["hoy", "Hoy"], ["registrar", "Registrar"], ["plan", "Plan"], ["progreso", "Progreso"], ["objetivos", "Objetivos"], ["ayuno", "Ayuno"], ["coach", "Coach"], ["mas", "Más"]];
const VIEWS = { hoy: vHoy, registrar: vRegistrar, plan: vPlan, progreso: vProgreso, objetivos: vObjetivos, ayuno: vAyuno, coach: vCoach, mas: vMas };
function render() {
  $("#tabs").innerHTML = TABS.map(t => `<button data-act="tab" data-v="${t[0]}"${ui.tab === t[0] ? ' aria-current="true"' : ""}>${t[1]}</button>`).join("");
  const keep = document.activeElement && document.activeElement.id;
  $("#main").innerHTML = VIEWS[ui.tab]();
  if (keep && $("#" + keep)) { const el = $("#" + keep); el.focus(); try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) { } }
  if (pickInfoNeeded()) updatePick();
  renderLive();
}
const pickInfoNeeded = () => ui.tab === "registrar" && ui.reg === "buscar" && ui.pick && $("#pickG");
function updatePick() {
  const f = pool().find(x => x.id === ui.pick), g = +$("#pickG").value || 0; if (!f) return;
  const m = g / 100; $("#pickInfo").textContent = `${fmt(f.k * m)} kcal · P ${f1(f.p * m)} g · C ${f1(f.c * m)} g · G ${f1(f.f * m)} g`;
}
function renderLive() {
  const el = $("#live"), fi = fastInfo(); el.hidden = !(ui.live && fi);
  if (!el.hidden) el.innerHTML = `<div id="liveRing">${ring(fi.el, fi.tot, 260, "Progreso del ayuno")}</div><div class="big" id="liveTime" style="font-size:56px">${hms(fi.left)}</div><p class="muted">${fi.done ? "Ayuno cumplido" : "para terminar tu ayuno de " + S.fast.active.hours + " h"}</p><button class="btn" data-act="liveclose">Cerrar</button>`;
}
function tick() {
  $("#clock").textContent = new Date().toLocaleString("es-ES", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const fi = fastInfo();
  if (fi) {
    const set = (id, v) => { const e = $("#" + id); if (e) e.textContent = v; };
    set("fastTime", hms(fi.left)); set("fastMini", hms(fi.left)); set("liveTime", hms(fi.left));
    [["#fastRingBox", 150], ["#liveRing", 260]].forEach(([s, sz]) => { const b = $(s); if (b) b.innerHTML = ring(fi.el, fi.tot, sz, "Progreso del ayuno"); });
    if (fi.done && !S.fast.active.notified) { S.fast.active.notified = true; save(); toast("Has cumplido tu ayuno de " + S.fast.active.hours + " h."); if (ui.tab === "ayuno" || ui.tab === "hoy") render(); }
  }
  const now = new Date(), hm = pad(now.getHours()) + ":" + pad(now.getMinutes());
  S.reminders.forEach(r => { const k = todayStr() + r.id; if (r.time === hm && !tick.fired[k]) { tick.fired[k] = 1; toast("Recordatorio: " + r.label); } });
}
tick.fired = {};
