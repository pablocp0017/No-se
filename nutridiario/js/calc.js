/* ---------- cálculos ---------- */
const mealsList = () => { const n = S.profile.meals; return n === 3 ? ["Desayuno", "Comida", "Cena"] : n === 4 ? ["Desayuno", "Comida", "Merienda", "Cena"] : n === 5 ? ["Desayuno", "Media mañana", "Comida", "Merienda", "Cena"] : ["Desayuno", "Media mañana", "Comida", "Merienda", "Cena", "Snack"]; };
function targets() {
  const pr = S.profile, r5 = v => Math.round(v / 5) * 5;
  const bmr = 10 * pr.w + 6.25 * pr.h - 5 * pr.age + (pr.sex === "m" ? 5 : -161), tdee = bmr * pr.act;
  let k = pr.goal === "lose" ? tdee - Math.min(500, tdee * .2) : pr.goal === "gain" ? tdee * 1.1 : tdee;
  k = Math.max(1200, k + (S.kAdj || 0));
  const d = DIETS[pr.diet] || DIETS.equilibrada;
  let T = { k: r5(k), p: r5(k * d.p / 400), c: r5(k * d.c / 400), f: r5(k * d.f / 900), tdee: Math.round(tdee) };
  if (S.goals.custom) T = { ...T, k: S.goals.k, p: S.goals.p, c: S.goals.c, f: S.goals.f };
  T.fi = Math.round(T.k / 1000 * 14); T.na = 2300; T.s = Math.round(T.k * .1 / 4); T.water = Math.round(pr.w * 35 / 50) * 50;
  return T;
}
const entries = d => S.log[d] || [];
const dayTot = d => totalOf(entries(d));
function streak() { let n = 0, d = todayStr(); if (!entries(d).length) d = addDays(d, -1); while (entries(d).length) { n++; d = addDays(d, -1); } return n; }
function scoreOf(d) {
  const t = targets(), x = dayTot(d); if (!entries(d).length) return null;
  const parts = [];
  const kr = x.k / t.k; parts.push({ n: "Calorías", w: 25, v: clamp(1 - Math.abs(1 - kr) * 2.5, 0, 1), tip: kr < .85 ? "Te faltan calorías para tu objetivo." : kr > 1.1 ? "Te has pasado de calorías." : "" });
  parts.push({ n: "Proteína", w: 25, v: clamp(x.p / (t.p * .9), 0, 1), tip: x.p < t.p * .9 ? "Añade una fuente de proteína (huevo, legumbres, pescado, yogur)." : "" });
  parts.push({ n: "Fibra", w: 20, v: clamp(x.fi / t.fi, 0, 1), tip: x.fi < t.fi * .8 ? "Te falta fibra: suma verdura, fruta o legumbres." : "" });
  parts.push({ n: "Azúcar", w: 15, v: x.s <= t.s ? 1 : clamp(1 - (x.s - t.s) / t.s, 0, 1), tip: x.s > t.s ? "El azúcar supera tu límite orientativo." : "" });
  parts.push({ n: "Sodio", w: 15, v: x.na <= t.na ? 1 : clamp(1 - (x.na - t.na) / t.na, 0, 1), tip: x.na > t.na ? "Mucho sodio: reduce embutidos y procesados." : "" });
  return { score: Math.round(parts.reduce((a, p) => a + p.w * p.v, 0)), parts };
}
function alerts() {
  const out = [], d = todayStr(), t = targets(), x = dayTot(d), h = new Date().getHours(), w = S.water[d] || 0;
  if (h >= 11 && !entries(d).length) out.push(["", "Todavía no has registrado nada hoy."]);
  if (h >= 15 && entries(d).length && x.p < t.p * .4) out.push(["", "Vas bajo en proteína para esta hora del día."]);
  if (h >= 12 && w < t.water * .35) out.push(["", "Llevas poca agua. Bebe un vaso ahora."]);
  if (x.na > t.na) out.push(["bad", "Has superado el límite de sodio de hoy."]);
  if (x.k > t.k * 1.1 + (S.burned[d] || 0)) out.push(["bad", "Has superado tu objetivo de calorías."]);
  const lw = S.weights.length ? S.weights[S.weights.length - 1].d : null;
  if (!lw || (parse(d) - parse(lw)) / 864e5 >= 7) out.push(["", "Hace una semana o más que no registras tu peso."]);
  const fi = fastInfo(); if (fi && fi.done) out.push(["ok", "Has cumplido tu ayuno. Puedes terminarlo."]);
  return out;
}
function weeklyRate() {
  const pts = S.weights.filter(p => (parse(todayStr()) - parse(p.d)) / 864e5 <= 21); if (pts.length < 3) return null;
  const x0 = parse(pts[0].d), xs = pts.map(p => (parse(p.d) - x0) / 864e5), ys = pts.map(p => p.v), n = pts.length;
  if (xs[n - 1] < 7) return null;
  const mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
  const den = xs.reduce((a, x) => a + (x - mx) ** 2, 0); if (!den) return null;
  return xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / den * 7;
}
const targetRate = () => ({ lose: -.5, gain: .25, maintain: 0 }[S.profile.goal] || 0);
const fastInfo = () => { const f = S.fast.active; if (!f) return null; const el = Date.now() - f.start, tot = f.hours * 36e5; return { el, tot, left: Math.max(0, tot - el), pct: Math.min(1, el / tot), done: el >= tot }; };
const hms = ms => { const s = Math.floor(ms / 1000); return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s % 3600 / 60)) + ":" + pad(s % 60); };
