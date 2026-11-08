/* ---------- componentes de interfaz ---------- */
function ring(val, max, size, label) {
  const r = 52, c = 2 * Math.PI * r, p = clamp(val / (max || 1), 0, 1), over = val > max;
  return `<svg viewBox="0 0 130 130" width="${size}" height="${size}" role="img" aria-label="${esc(label)}"><circle class="ring-bg" cx="65" cy="65" r="${r}" fill="none" stroke-width="12"/><circle class="ring-fg${over ? " over" : ""}" cx="65" cy="65" r="${r}" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 65 65)"/></svg>`;
}
const meter = (v, m, cls = "") => `<div class="meter ${cls}${v > m ? " over" : ""}"><i style="width:${clamp(v / (m || 1) * 100, 0, 100)}%"></i></div>`;
function lineChart(pts, unit, ref) {
  if (pts.length < 2) return `<p class="muted small">Añade al menos dos registros para ver la gráfica.</p>`;
  const W = 560, H = 190, L = 40, R = 12, T = 12, B = 26, vals = pts.map(p => p.v).concat(ref != null ? [ref] : []);
  let mn = Math.min(...vals), mx = Math.max(...vals); if (mx - mn < 1) { mx += .5; mn -= .5; }
  const pd = (mx - mn) * .12; mn -= pd; mx += pd;
  const t0 = parse(pts[0].d).getTime(), t1 = parse(pts[pts.length - 1].d).getTime() || t0 + 1;
  const X = d => L + (parse(d).getTime() - t0) / ((t1 - t0) || 1) * (W - L - R), Y = v => T + (1 - (v - mn) / (mx - mn)) * (H - T - B);
  let grid = ""; for (let i = 0; i <= 3; i++) { const v = mn + (mx - mn) * i / 3, y = Y(v); grid += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L - 6}" y="${y + 4}" text-anchor="end">${f1(v)}</text>`; }
  const path = pts.map((p, i) => (i ? "L" : "M") + X(p.d).toFixed(1) + " " + Y(p.v).toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return `<div class="tw"><svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:420px" role="img" aria-label="Evolución en ${unit}">${grid}
    ${ref != null ? `<line x1="${L}" x2="${W - R}" y1="${Y(ref)}" y2="${Y(ref)}" stroke="var(--prem)" stroke-dasharray="4 4"/>` : ""}
    <path d="${path}" fill="none" stroke="var(--free)" stroke-width="2.5"/>${pts.map(p => `<circle cx="${X(p.d)}" cy="${Y(p.v)}" r="3" style="fill:var(--free)"/>`).join("")}
    <text x="${L}" y="${H - 6}">${dayLabel(pts[0].d)}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${dayLabel(last.d)}</text></svg></div>`;
}
function barChart(days, goal) {
  const W = 560, H = 190, L = 44, R = 8, T = 12, B = 28, vals = days.map(d => dayTot(d).k), mx = Math.max(goal * 1.15, ...vals, 1), bw = (W - L - R) / days.length;
  const Y = v => T + (1 - v / mx) * (H - T - B);
  return `<div class="tw"><svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:420px" role="img" aria-label="Calorías de los últimos días">
    ${[0, .5, 1].map(f => { const v = mx * f; return `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${fmt(v)}</text>`; }).join("")}
    ${days.map((d, i) => `<rect x="${L + i * bw + 3}" y="${Y(vals[i])}" width="${bw - 6}" height="${H - B - Y(vals[i])}" rx="3" style="fill:${vals[i] > goal * 1.1 ? "var(--bad)" : "var(--free)"}"/><text x="${L + i * bw + bw / 2}" y="${H - 8}" text-anchor="middle">${parse(d).getDate()}</text>`).join("")}
    <line x1="${L}" x2="${W - R}" y1="${Y(goal)}" y2="${Y(goal)}" stroke="var(--prem)" stroke-dasharray="4 4"/></svg></div>`;
}
const chipRow = (cur, opts, attr) => `<div class="chips">${opts.map(([k, l]) => `<button type="button" class="chip" aria-pressed="${cur === k}" data-act="${attr}" data-v="${k}">${l}</button>`).join("")}</div>`;
const mealSel = () => `<label>Comida<select data-bind="meal">${[...new Set([...mealsList(), ui.meal])].map(m => `<option${m === ui.meal ? " selected" : ""}>${m}</option>`).join("")}</select></label>`;
const aiNote = () => SAMPLE ? "" : `<div class="alert">Esta función usa Claude. Aquí no está disponible, pero puedes registrar a mano.</div>`;
const busyTxt = () => ui.busy ? `<p class="muted"><span class="spin"></span>Claude está trabajando. Puede tardar unos segundos.</p>` : "";
const errTxt = () => ui.err ? `<div class="alert bad">${esc(ui.err)}</div>` : "";
