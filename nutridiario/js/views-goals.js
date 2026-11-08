/* ---------- Objetivos y retos ----------
   Un objetivo tiene una meta medible (peso, o días a la semana cumpliendo un hábito) y unas
   acciones operativas con frecuencia semanal que se marcan cada día. */
const OBJ_METRICS = {
  weight: "Peso corporal (kg)",
  log: "Registrar mis comidas", water: "Llegar a mi meta de agua", prot: "Llegar al 90% de mi proteína",
  fiber: "Llegar al 80% de mi fibra", cal: "Quedarme en mi rango de calorías", fast: "Cumplir un ayuno", free: "Otro (solo acciones)"
};
const HABIT_TYPES = ["log", "water", "prot", "fiber", "cal", "fast"];
const CH_TYPES = {
  log: "Registrar comidas cada día", water: "Cumplir la meta de agua", prot: "Llegar al 90% de proteína",
  fiber: "Llegar al 80% de fibra", cal: "Quedarme en mi rango de calorías (±10%)", sugar: "No pasarme del azúcar", fast: "Cumplir un ayuno"
};
const OBJ_TEMPLATES = [
  { k: "peso", l: "Perder 3 kg en 8 semanas", m: "weight", delta: -3, weeks: 8, title: "Perder 3 kg en 8 semanas", why: "Sentirme con más energía y a gusto con mi cuerpo",
    acts: [["Registrar todas las comidas del día", 7], ["Pesarme en ayunas", 1], ["Preparar el menú del día siguiente por la noche", 5]] },
  { k: "prot", l: "Proteína 5 días a la semana", m: "prot", target: 5, weeks: 6, title: "Llegar a mi proteína 5 días a la semana", why: "Mantener la masa muscular y la saciedad",
    acts: [["Incluir una fuente de proteína en cada comida", 7], ["Tener huevos, legumbres o yogur a mano", 3]] },
  { k: "agua", l: "Beber agua 6 días a la semana", m: "water", target: 6, weeks: 4, title: "Cumplir mi meta de agua 6 días a la semana", why: "Rendir mejor y tener menos antojos",
    acts: [["Un vaso de agua al levantarme", 7], ["Llevar botella a clase o al trabajo", 5]] },
  { k: "fibra", l: "Más fibra y verdura", m: "fiber", target: 5, weeks: 6, title: "Llegar a mi fibra 5 días a la semana", why: "Mejor digestión y más saciedad",
    acts: [["Verdura en la comida y en la cena", 7], ["Una fruta de media mañana", 5], ["Legumbres 2 veces por semana", 2]] }
];
const objDays = o => Math.max(0, Math.round((parse(o.deadline) - parse(todayStr())) / 864e5));
const weekDates = () => { const t = todayStr(); const mon = addDays(t, -dowIdx(t)); return Array.from({ length: 7 }, (_, i) => addDays(mon, i)); };
const actDone = (o, d) => (o.done && o.done[d]) || [];

/* Cumplimiento automático de un día para hábitos medibles (retos y objetivos de hábito). */
function habitOK(type, d) {
  const T = targets(), x = dayTot(d), has = entries(d).length > 0;
  switch (type) {
    case "log": return has;
    case "water": return (S.water[d] || 0) >= T.water;
    case "prot": return has && x.p >= T.p * .9;
    case "fiber": return has && x.fi >= T.fi * .8;
    case "cal": return has && Math.abs(x.k - (T.k + (S.burned[d] || 0))) <= T.k * .1;
    case "sugar": return has && x.s <= T.s;
    case "fast": return S.fast.history.some(h => h.ok && dstr(new Date(h.start + h.dur)) === d);
  }
  return false;
}

/* Progreso 0..1 de la meta del objetivo y progreso esperado según el tiempo transcurrido. */
function objProgress(o) {
  let cur = null, pct = 0, label = "";
  if (o.metric === "weight") {
    const last = S.weights.length ? S.weights[S.weights.length - 1].v : o.start;
    cur = last; const span = o.start - o.target;
    pct = span ? clamp((o.start - last) / span, 0, 1) : (last === o.target ? 1 : 0);
    label = `${f1(o.start)} → ${f1(last)} kg (meta ${f1(o.target)} kg)`;
  } else if (HABIT_TYPES.includes(o.metric)) {
    const days = weekDates().filter(d => d <= todayStr()), n = lastDays(7).filter(d => habitOK(o.metric, d)).length;
    cur = n; pct = clamp(n / o.target, 0, 1); label = `${n} de ${o.target} días en los últimos 7`; void days;
  } else { const a = actAdherence(o); pct = a.pct; label = `${Math.round(a.pct * 100)}% de acciones de esta semana`; }
  const total = Math.max(1, (parse(o.deadline) - parse(o.created)) / 864e5), el = clamp((parse(todayStr()) - parse(o.created)) / 864e5, 0, total);
  return { cur, pct, label, expected: o.metric === "weight" ? el / total : null };
}
function actAdherence(o) {
  const wd = weekDates(), upto = wd.filter(d => d <= todayStr()).length;
  if (!o.actions.length) return { pct: 0, rows: [] };
  const rows = o.actions.map(a => { const n = wd.filter(d => actDone(o, d).includes(a.id)).length; return { a, n, goal: a.freq, pct: clamp(n / a.freq, 0, 1), behind: n + (7 - upto) < a.freq }; });
  return { pct: rows.reduce((s, r) => s + r.pct, 0) / rows.length, rows };
}

function objCard(o) {
  const pr = objProgress(o), ad = actAdherence(o), left = objDays(o), td = todayStr(), isDone = o.status === "done";
  const late = o.metric === "weight" && pr.expected !== null && pr.pct + .1 < pr.expected;
  const pace = isDone ? `<span class="badge">Conseguido</span>` : late ? `<span class="badge ia">Algo por detrás del ritmo</span>` : `<span class="badge">En ritmo</span>`;
  return `<section class="card obj${isDone ? " is-done" : ""}">
    <div class="row sb"><div class="col" style="gap:2px"><h3>${esc(o.title)}</h3>${o.why ? `<span class="small muted">Para: ${esc(o.why)}</span>` : ""}</div>${pace}</div>
    <div class="col" style="gap:4px"><div class="row sb small"><span>${esc(pr.label)}</span><span class="num muted">${isDone ? "Cerrado" : left + " días restantes"}</span></div>${meter(pr.pct, 1)}</div>
    <div class="col" style="gap:2px"><h3 class="mono muted" style="font-weight:500">ACCIONES (hoy y esta semana)</h3>
    ${o.actions.length ? `<div class="list">${ad.rows.map(r => { const on = actDone(o, td).includes(r.a.id);
      return `<div class="item"><div>${esc(r.a.text)}<br><span class="small muted num">${r.n}/${r.goal} esta semana${r.behind && !isDone ? " · te conviene hacerla pronto" : ""}</span></div>
      <div class="row" style="flex-wrap:nowrap"><button class="check" aria-pressed="${on}" data-act="actcheck" data-o="${o.id}" data-id="${r.a.id}" aria-label="Marcar hecha hoy: ${esc(r.a.text)}">${on ? "&#10003;" : ""}</button>
      <button class="btn sm danger" data-act="actdel" data-o="${o.id}" data-id="${r.a.id}" aria-label="Quitar acción">&times;</button></div></div>`; }).join("")}</div>` : `<p class="muted small">Sin acciones todavía. Un objetivo sin acciones concretas se queda en deseo.</p>`}</div>
    ${isDone ? "" : `<form class="form" data-form="action" data-o="${o.id}"><label>Nueva acción<input name="text" placeholder="Ej: Cenar verdura 5 noches" required maxlength="120"></label>
      <label>Veces/semana<select name="freq">${[1, 2, 3, 4, 5, 6, 7].map(n => `<option${n === 3 ? " selected" : ""}>${n}</option>`).join("")}</select></label><button class="btn" type="submit">Añadir</button></form>`}
    <div class="row">${isDone ? `<button class="btn sm" data-act="objreopen" data-id="${o.id}">Reabrir</button>` : `<button class="btn sm" data-act="objdone" data-id="${o.id}">Marcar conseguido</button>
      <button class="btn sm" data-act="aiacts" data-id="${o.id}"${!SAMPLE || ui.busy ? " disabled" : ""}>Proponer acciones con IA</button>`}
      <button class="btn sm danger" data-act="objdel" data-id="${o.id}">Borrar</button></div>
    ${ui.aiObj && ui.aiObj.id === o.id ? `<div class="card" style="border-color:var(--prem)"><div class="row"><span class="badge ia">Sugerencias de IA</span></div>
      ${ui.aiObj.list.map((a, i) => `<div class="item"><div>${esc(a.text)}<br><span class="small muted">${a.freq} veces por semana</span></div><button class="btn sm" data-act="aiactadd" data-i="${i}">Añadir</button></div>`).join("")}</div>` : ""}
  </section>`;
}

function vObjForm() {
  const w = S.weights.length ? S.weights[S.weights.length - 1].v : S.profile.w, tp = ui.objTpl ? OBJ_TEMPLATES.find(t => t.k === ui.objTpl) : null;
  const m = tp ? tp.m : "weight", dl = addDays(todayStr(), (tp ? tp.weeks : 8) * 7);
  return `<form class="card" data-form="objective"><h3>Nuevo objetivo</h3>
    <p class="small muted">Un buen objetivo es concreto, medible y con fecha. Parte de una plantilla o escribe el tuyo.</p>
    ${chipRow(ui.objTpl || "", OBJ_TEMPLATES.map(t => [t.k, t.l]), "objtpl")}
    <label>Objetivo<input name="title" required maxlength="100" value="${esc(tp ? tp.title : "")}" placeholder="Ej: Perder 3 kg antes de verano"></label>
    <label>¿Para qué? (tu motivo)<input name="why" maxlength="120" value="${esc(tp ? tp.why : "")}" placeholder="Ej: Tener más energía para entrenar"></label>
    <div class="form"><label>Cómo lo mido<select name="metric">${Object.entries(OBJ_METRICS).map(([k, v]) => `<option value="${k}"${k === m ? " selected" : ""}>${v}</option>`).join("")}</select></label>
      <label>Meta (kg, o días/semana)<input name="target" type="number" step="0.1" min="0" required value="${tp ? (tp.m === "weight" ? f1(w + tp.delta).replace(",", ".") : tp.target) : ""}"></label>
      <label>Fecha límite<input name="deadline" type="date" min="${addDays(todayStr(), 1)}" required value="${dl}"></label></div>
    <p class="small muted">Si mides el peso, el punto de partida es tu último peso (${f1(w)} kg). Para hábitos, la meta son los días de los últimos 7 que quieres cumplir (1-7).</p>
    <div class="row"><button class="btn primary" type="submit">Crear objetivo</button><button class="btn" type="button" data-act="objform">Cancelar</button></div></form>`;
}

function chCard(c) {
  const ds = Array.from({ length: c.days }, (_, i) => addDays(c.start, i)).filter(d => d <= todayStr());
  const ok = ds.filter(d => habitOK(c.type, d)).length, finished = ds.length >= c.days, pct = Math.round(ok / c.days * 100);
  let cur = 0, best = 0, run = 0; ds.forEach(d => { run = habitOK(c.type, d) ? run + 1 : 0; best = Math.max(best, run); }); cur = run;
  if (!habitOK(c.type, todayStr()) && ds.includes(todayStr())) { let r = 0; for (let i = ds.length - 2; i >= 0 && habitOK(c.type, ds[i]); i--) r++; cur = r; }
  const medal = finished ? (pct >= 90 ? "Oro" : pct >= 75 ? "Plata" : pct >= 50 ? "Bronce" : "") : "";
  const dots = Array.from({ length: c.days }, (_, i) => { const d = addDays(c.start, i), fut = d > todayStr(); return `<i class="dot ${fut ? "" : habitOK(c.type, d) ? "on" : d === todayStr() ? "now" : "off"}" title="${dayLabel(d)}"></i>`; }).join("");
  return `<section class="card"><div class="row sb"><h3>${CH_TYPES[c.type]}</h3><div class="row">${medal ? `<span class="badge ia">${medal}</span>` : ""}<button class="btn sm danger" data-act="chdel" data-id="${c.id}" aria-label="Borrar reto">&times;</button></div></div>
    <div class="dots" aria-hidden="true">${dots}</div>${meter(ok, c.days)}
    <div class="row sb small muted num"><span>${ok} de ${c.days} días (${pct}%)</span><span>Racha ${cur} · Mejor ${best}</span></div>
    ${finished ? `<p class="small">${pct >= 75 ? "Reto superado. ¿Subes la dificultad con otro más largo?" : "Reto terminado. Lo que has aprendido de los días fallados vale más que la medalla."}</p>` : `<p class="small muted">Quedan ${c.days - ds.length} días.</p>`}</section>`;
}

function vObjetivos() {
  const sub = ui.goalsSub, active = S.objectives.filter(o => o.status !== "done"), done = S.objectives.filter(o => o.status === "done");
  let body = "";
  if (sub === "objetivos") {
    body = (ui.newObj ? vObjForm() : `<div class="row"><button class="btn primary" data-act="objform">+ Nuevo objetivo</button></div>`)
      + (active.length ? active.map(objCard).join("") : ui.newObj ? "" : `<div class="card"><h3>Todavía no tienes objetivos</h3><p class="muted">Define qué quieres conseguir, para cuándo, y qué vas a hacer cada semana para lograrlo. Las acciones son lo que de verdad mueve el resultado.</p></div>`)
      + (done.length ? `<h3 class="mono muted">CONSEGUIDOS</h3>` + done.map(objCard).join("") : "");
  } else {
    body = `<form class="card" data-form="challenge"><h3>Nuevo reto</h3><p class="small muted">Retos cortos y personales para construir un hábito. Se marcan solos con lo que registras en el diario.</p>
      <div class="form"><label>Reto<select name="type">${Object.entries(CH_TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></label><label>Duración<select name="days"><option value="7">7 días</option><option value="14">14 días</option><option value="21" selected>21 días</option><option value="30">30 días</option></select></label></div>
      <div class="row"><button class="btn primary" type="submit">Empezar reto</button></div></form>`
      + (S.challenges.length ? S.challenges.map(chCard).join("") : `<div class="card"><p class="muted">No tienes retos activos. Empieza uno de 7 días y ve subiendo.</p></div>`);
  }
  return `<h2>Objetivos y retos</h2>${chipRow(sub, [["objetivos", "Objetivos"], ["retos", "Retos"]], "goalsub")}${body}`;
}

/* Resumen en "Hoy": acciones pendientes de los objetivos activos. */
function objToday() {
  const act = S.objectives.filter(o => o.status !== "done" && o.actions.length), td = todayStr(); if (!act.length) return "";
  const rows = act.flatMap(o => o.actions.map(a => ({ o, a, on: actDone(o, td).includes(a.id) })));
  const n = rows.filter(r => r.on).length;
  return `<section class="card"><div class="row sb"><h3>Acciones de hoy</h3><span class="badge">${n}/${rows.length}</span></div>${meter(n, rows.length)}
    <div class="list">${rows.slice(0, 6).map(r => `<div class="item"><div>${esc(r.a.text)}<br><span class="small muted">${esc(r.o.title)}</span></div><button class="check" aria-pressed="${r.on}" data-act="actcheck" data-o="${r.o.id}" data-id="${r.a.id}" aria-label="Marcar hecha: ${esc(r.a.text)}">${r.on ? "&#10003;" : ""}</button></div>`).join("")}</div>
    ${rows.length > 6 ? `<button class="btn sm" data-act="tab" data-v="objetivos">Ver todas</button>` : ""}</section>`;
}
