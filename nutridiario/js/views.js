/* ---------- vistas ---------- */
function vHoy() {
  const d = ui.date, T = targets(), x = dayTot(d), burn = S.burned[d] || 0, w = S.water[d] || 0, isT = d === todayStr();
  const rem = T.k + burn - x.k, sc = scoreOf(d), fi = fastInfo(), st = streak();
  const meals = [...new Set([...mealsList(), ...entries(d).map(e => e.meal)])];
  return `
  <div class="row sb"><div class="row"><button class="btn sm" data-act="day" data-v="-1" aria-label="Día anterior">&larr;</button><h2>${isT ? "Hoy" : dayLabel(d)}</h2><button class="btn sm" data-act="day" data-v="1" aria-label="Día siguiente"${isT ? " disabled" : ""}>&rarr;</button></div>
  ${isT ? "" : `<button class="btn sm" data-act="day" data-v="0">Volver a hoy</button>`}</div>
  ${S.profile.isDefault ? `<div class="alert">Tus metas usan datos de ejemplo. <button class="btn sm" data-act="goto" data-tab="mas" data-sub="perfil">Poner mis datos</button></div>` : ""}
  ${isT ? alerts().map(a => `<div class="alert ${a[0]}">${esc(a[1])}</div>`).join("") : ""}
  ${isT ? objToday() : ""}
  <div class="grid">
    <section class="card"><h3>Calorías</h3><div class="row" style="flex-wrap:nowrap;gap:16px">
      <div style="flex:0 0 120px">${ring(x.k, T.k + burn, 120, "Calorías consumidas")}</div>
      <div class="col"><div class="big">${fmt(Math.abs(rem))}</div><span class="muted small">${rem >= 0 ? "kcal restantes" : "kcal por encima"}</span>
      <span class="small muted">Comidas ${fmt(x.k)} · Meta ${fmt(T.k)}${burn ? " · Actividad +" + fmt(burn) : ""}</span></div></div>
      <div class="row"><button class="btn sm" data-act="burn">Añadir actividad</button></div></section>
    <section class="card"><h3>Macros</h3>
      ${[["Proteína", x.p, T.p, "p"], ["Carbohidratos", x.c, T.c, "c"], ["Grasas", x.f, T.f, "f"]].map(m => `<div class="col" style="gap:4px"><div class="row sb small"><span>${m[0]}</span><span class="num muted">${fmt(m[1])} / ${fmt(m[2])} g</span></div>${meter(m[1], m[2], m[3])}</div>`).join("")}
      <p class="small muted num">Fibra ${fmt(x.fi)}/${T.fi} g · Azúcar ${fmt(x.s)}/${T.s} g · Sodio ${fmt(x.na)}/${fmt(T.na)} mg</p></section>
    <section class="card"><h3>Agua</h3><div class="big">${fmt(w)} <span class="small muted">/ ${fmt(T.water)} ml</span></div>${meter(w, T.water)}
      <div class="row"><button class="btn sm" data-act="water" data-v="250">+250</button><button class="btn sm" data-act="water" data-v="500">+500</button><button class="btn sm" data-act="water" data-v="-250">-250</button></div></section>
    <section class="card"><h3>Ayuno</h3>${fi ? `<div class="big" id="fastMini">${hms(fi.left)}</div><span class="muted small">${fi.done ? "Ayuno cumplido" : "para terminar el ayuno de " + S.fast.active.hours + " h"}</span>${meter(fi.el, fi.tot)}` : `<p class="muted">Sin ayuno en curso.</p>`}
      <div class="row"><button class="btn sm" data-act="goto" data-tab="ayuno">${fi ? "Ver ayuno" : "Empezar ayuno"}</button></div></section>
    <section class="card"><h3>Racha y puntuación</h3><div class="row" style="gap:24px"><div><div class="big">${st}</div><span class="muted small">días seguidos</span></div>
      <div><div class="big">${sc ? sc.score : "-"}</div><span class="muted small">puntuación /100</span></div></div>
      ${sc ? sc.parts.filter(p => p.tip).slice(0, 2).map(p => `<p class="small">${esc(p.tip)}</p>`).join("") || `<p class="small">Buen día de nutrición.</p>` : `<p class="small muted">Registra una comida para ver tu puntuación.</p>`}</section>
  </div>
  <section class="card"><div class="row sb"><h2>Comidas</h2><button class="btn sm" data-act="goto" data-tab="registrar">Registrar</button></div>
    ${!entries(d).length ? `<p class="muted">Aún no hay comidas. Pulsa "Registrar" para añadir la primera: puedes buscar, hacer una foto o escribirla.</p>` : ""}
    ${meals.map(m => { const es = entries(d).filter(e => e.meal === m), t = totalOf(es); return `<div class="col"><div class="row sb"><h3>${esc(m)} <span class="muted small num">${fmt(t.k)} kcal</span></h3><button class="btn sm" data-act="addmeal" data-v="${esc(m)}">+ Añadir</button></div>
      <div class="list">${es.map(e => `<div class="item"><div>${esc(e.name)} ${e.g ? `<span class="muted small">${fmt(e.g)} g</span>` : ""}<br><span class="small muted num">P ${f1(e.p)} · C ${f1(e.c)} · G ${f1(e.f)}</span></div><div class="row" style="flex-wrap:nowrap"><span class="num">${fmt(e.k)} kcal</span><button class="btn sm danger" data-act="delentry" data-id="${e.id}" aria-label="Borrar">&times;</button></div></div>`).join("") || `<p class="small muted">Sin alimentos.</p>`}</div></div>`; }).join("")}
  </section>`;
}

function aiPanel(saveFood) {
  if (!ui.ai) return "";
  const it = ui.ai.items, t = totalOf(it);
  return `<section class="card"><div class="row sb"><h3>Resultado <span class="badge ia">Estimado por IA</span></h3><span class="num">${fmt(t.k)} kcal</span></div>
    <div class="list">${it.map(e => `<div class="item"><div>${esc(e.name)} <span class="muted small">${fmt(e.g)} g</span><br><span class="small muted num">P ${f1(e.p)} · C ${f1(e.c)} · G ${f1(e.f)}</span></div><div class="row" style="flex-wrap:nowrap"><span class="num">${fmt(e.k)} kcal</span><button class="btn sm danger" data-act="aidel" data-id="${e.id}" aria-label="Quitar">&times;</button></div></div>`).join("")}</div>
    <p class="small muted">Son estimaciones. Revisa las cantidades antes de guardarlas.</p>
    <div class="row">${mealSel()}<button class="btn primary" data-act="aiadd">Añadir al diario</button>${saveFood ? `<button class="btn" data-act="aifood">Guardar como alimento</button>` : ""}</div></section>`;
}
function searchResults() {
  const q = norm(ui.q.trim()), all = pool(), res = (q ? all.filter(f => norm(f.n).includes(q)).sort((a, b) => (norm(b.n).startsWith(q) - norm(a.n).startsWith(q)) || a.n.length - b.n.length) : all.slice(0, 12)).slice(0, 30);
  if (!res.length) return `<p class="muted">No hay resultados. Prueba con otra palabra o créalo con IA.</p>`;
  return `<div class="list">${res.map(f => `<div class="item"><div>${esc(f.n)} ${f.src !== "base" ? `<span class="badge">${f.src === "mio" ? "mío" : "receta"}</span>` : ""}<br><span class="small muted num">${fmt(f.k)} kcal · P ${f1(f.p)} · C ${f1(f.c)} · G ${f1(f.f)} por 100 g</span></div>
    <button class="btn sm" data-act="pick" data-id="${f.id}">Elegir</button></div>`).join("")}</div>`;
}
function pickPanel() {
  const f = ui.pick && pool().find(x => x.id === ui.pick); if (!f) return "";
  return `<div class="card" style="border-color:var(--free)"><h3>${esc(f.n)}</h3><div class="row"><label style="max-width:140px">Gramos<input id="pickG" type="number" inputmode="decimal" min="1" value="${f.src === "receta" ? Math.round(f.total) : 100}"></label>${mealSel()}</div>
    <p class="small muted num" id="pickInfo"></p><div class="row"><button class="btn primary" data-act="pickadd">Añadir al diario</button><button class="btn" data-act="pickplan">Añadir al plan</button><button class="btn" data-act="cmpadd">Comparar</button></div></div>`;
}
function vRegistrar() {
  const tabs = [["buscar", "Buscar"], ["foto", "Foto"], ["voz", "Voz"], ["texto", "Texto"], ["codigo", "Código"], ["crear", "Crear con IA"], ["manual", "Manual"], ["comparar", "Comparar"]];
  let body = "";
  const ph = LIM && LIM.images ? "" : `<div class="alert">El envío de imágenes no está disponible aquí. Usa la opción de texto.</div>`;
  if (ui.reg === "buscar") body = `<div class="card"><h3>Buscar alimento</h3><p class="small muted">Base local con ${BASE.length} alimentos comunes (valores aproximados por 100 g) más tus alimentos y recetas.</p>
    <input id="q" type="search" placeholder="Pollo, arroz, manzana…" value="${esc(ui.q)}" aria-label="Buscar alimento"><div id="results">${searchResults()}</div></div><div id="pickBox">${pickPanel()}</div>`;
  if (ui.reg === "foto") body = `<div class="card"><h3>Calcular con una foto</h3>${aiNote()}${ph}<label>Foto del plato<input id="photoIn" type="file" accept="image/*"></label>
    <div class="row"><button class="btn primary" data-act="photo"${!SAMPLE || ui.busy ? " disabled" : ""}>Analizar foto</button></div>${busyTxt()}${errTxt()}</div>${aiPanel()}`;
  if (ui.reg === "voz") body = `<div class="card"><h3>Registrar con la voz</h3>${aiNote()}<p class="small muted">Dicta lo que has comido y Claude calcula calorías y macros. Si el micrófono no está disponible en esta vista, usa el dictado del teclado de tu móvil dentro de la caja.</p>
    <textarea data-bind="text" placeholder="Ej: dos huevos revueltos, una tostada con aceite y un café con leche">${esc(ui.text)}</textarea>
    <div class="row"><button class="btn" data-act="mic">Hablar</button><button class="btn primary" data-act="txt"${!SAMPLE || ui.busy ? " disabled" : ""}>Calcular</button></div>${busyTxt()}${errTxt()}</div>${aiPanel()}`;
  if (ui.reg === "texto") body = `<div class="card"><h3>Escribir lo que has comido</h3>${aiNote()}<textarea data-bind="text" placeholder="Ej: 150 g de pechuga a la plancha con 200 g de arroz">${esc(ui.text)}</textarea>
    <div class="row"><button class="btn primary" data-act="txt"${!SAMPLE || ui.busy ? " disabled" : ""}>Calcular</button></div>${busyTxt()}${errTxt()}</div>${aiPanel()}`;
  if (ui.reg === "codigo") body = `<div class="card"><h3>Producto envasado</h3>${aiNote()}<p class="small muted">No hay cámara en esta vista. Escribe el código de barras o sube una foto del producto o de su etiqueta. El resultado es una estimación: contrasta siempre con la etiqueta.</p>
    <div class="form"><label>Código de barras<input data-bind="code" inputmode="numeric" value="${esc(ui.code)}" placeholder="8410000000000"></label><label>O foto del producto<input id="codeImg" type="file" accept="image/*"></label></div>
    <div class="row"><button class="btn primary" data-act="barcode"${!SAMPLE || ui.busy ? " disabled" : ""}>Buscar producto</button></div>${busyTxt()}${errTxt()}</div>${aiPanel()}`;
  if (ui.reg === "crear") body = `<div class="card"><h3>Crear un alimento con IA</h3>${aiNote()}<p class="small muted">Describe cualquier alimento o plato. Podrás guardarlo en tu lista y reutilizarlo.</p>
    <textarea data-bind="text" placeholder="Ej: bocadillo de tortilla de patatas, 180 g">${esc(ui.text)}</textarea>
    <div class="row"><button class="btn primary" data-act="txt"${!SAMPLE || ui.busy ? " disabled" : ""}>Calcular</button></div>${busyTxt()}${errTxt()}</div>${aiPanel(true)}`;
  if (ui.reg === "manual") body = `<form class="card" data-form="manual"><h3>Añadir a mano</h3><div class="form">
    <label>Nombre<input name="n" required></label><label>Gramos<input name="g" type="number" step="any" value="100"></label><label>Kcal<input name="k" type="number" step="any" required></label>
    <label>Proteína (g)<input name="p" type="number" step="any" value="0"></label><label>Carbohidratos (g)<input name="c" type="number" step="any" value="0"></label><label>Grasas (g)<input name="f" type="number" step="any" value="0"></label>
    <label>Fibra (g)<input name="fi" type="number" step="any" value="0"></label><label>Azúcar (g)<input name="s" type="number" step="any" value="0"></label><label>Sodio (mg)<input name="na" type="number" step="any" value="0"></label>
    ${mealSel()}</div><div class="row"><button class="btn primary" type="submit">Añadir al diario</button></div></form>`;
  if (ui.reg === "comparar") body = vCompare();
  return `<div class="row sb"><h2>Registrar</h2><span class="muted small">${ui.date === todayStr() ? "Hoy" : dayLabel(ui.date)}</span></div>${chipRow(ui.reg, tabs, "reg")}${body}`;
}
function vCompare() {
  const all = pool(), sel = ui.cmp.map(id => all.find(f => f.id === id)).filter(Boolean);
  const rows = [["Calorías", "k", "min"], ["Proteína (g)", "p", "max"], ["Carbohidratos (g)", "c", ""], ["Grasas (g)", "f", "min"], ["Fibra (g)", "fi", "max"], ["Azúcar (g)", "s", "min"], ["Sodio (mg)", "na", "min"]];
  return `<div class="card"><h3>Comparar alimentos</h3><p class="small muted">Valores por 100 g. En verde, el mejor valor de cada fila (menos calorías, grasa, azúcar y sodio; más proteína y fibra).</p>
    <div class="row"><input id="cmpIn" list="foodlist" placeholder="Escribe un alimento y pulsa Añadir" style="flex:1 1 200px"><button class="btn" data-act="cmpin">Añadir</button>${sel.length ? `<button class="btn" data-act="cmpclear">Vaciar</button>` : ""}</div>
    ${sel.length < 2 ? `<p class="muted">Añade al menos dos alimentos.</p>` : `<div class="tw"><table><thead><tr><th></th>${sel.map(f => `<th>${esc(f.n)}</th>`).join("")}</tr></thead><tbody>${rows.map(r => {
      const vals = sel.map(f => +f[r[1]] || 0), best = r[2] === "min" ? Math.min(...vals) : r[2] === "max" ? Math.max(...vals) : null;
      return `<tr><td>${r[0]}</td>${vals.map(v => `<td class="${best !== null && v === best && new Set(vals).size > 1 ? "best" : ""}">${f1(v)}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div>`}</div>${datalist()}`;
}
const datalist = () => `<datalist id="foodlist">${pool().map(f => `<option value="${esc(f.n)}">`).join("")}</datalist>`;

function planDay(i) { return (S.plan[i] ||= {}); }
const planItems = i => Object.values(planDay(i)).flat();
function vPlan() {
  const tabs = [["hoy", "Día"], ["semana", "Semana"], ["recetas", "Recetas"], ["compra", "Compra"], ["compartir", "Compartir y PDF"]];
  const T = targets(), i = ui.pday, dayChips = `<div class="chips">${DOW.map((n, k) => `<button type="button" class="chip" aria-pressed="${k === i}" data-act="pday" data-v="${k}">${n.slice(0, 3)}</button>`).join("")}</div>`;
  let body = "";
  if (ui.plan === "hoy") {
    const tot = totalOf(planItems(i)), pd = planDay(i), meals = [...new Set([...mealsList(), ...Object.keys(pd)])];
    body = `<div class="card"><h3>Plan de ${DOW[i]}</h3>${dayChips}${aiNote()}
      <label>Alergias, gustos o restricciones (opcional)<input data-bind="prefs" value="${esc(ui.prefs)}" placeholder="Sin lactosa, no me gusta el pescado…"></label>
      <p class="small muted">Dieta: ${DIETS[S.profile.diet].n} · Objetivo ${fmt(T.k)} kcal, ${T.p} g P, ${T.c} g C, ${T.f} g G</p>
      <div class="row"><button class="btn primary" data-act="genplan"${!SAMPLE || ui.busy ? " disabled" : ""}>Generar plan con Claude</button><button class="btn" data-act="planscale">Ajustar porciones al objetivo</button><button class="btn" data-act="planlog">Pasar al diario de hoy</button><button class="btn" data-act="planweek">Repetir toda la semana</button><button class="btn danger" data-act="planclear">Vaciar día</button></div>${busyTxt()}${errTxt()}</div>
      <div class="card"><div class="row sb"><h3>Resumen del día</h3><span class="num">${fmt(tot.k)} / ${fmt(T.k)} kcal</span></div>${meter(tot.k, T.k)}<p class="small muted num">P ${fmt(tot.p)} g · C ${fmt(tot.c)} g · G ${fmt(tot.f)} g</p>
      ${planItems(i).length ? meals.map(m => (pd[m] || []).length ? `<div class="col"><h3>${esc(m)}</h3><div class="list">${pd[m].map(e => `<div class="item"><div>${esc(e.name)} <span class="muted small">${fmt(e.g)} g</span></div><div class="row" style="flex-wrap:nowrap"><span class="num">${fmt(e.k)} kcal</span><button class="btn sm danger" data-act="plandel" data-m="${esc(m)}" data-id="${e.id}" aria-label="Quitar">&times;</button></div></div>`).join("")}</div></div>` : "").join("") : `<p class="muted">Este día está vacío. Genera un plan o añade alimentos en la pestaña Semana.</p>`}</div>`;
  }
  if (ui.plan === "semana") body = `<form class="card" data-form="planadd"><h3>Añadir al plan a mano</h3><div class="form"><label>Día<select name="day">${DOW.map((n, k) => `<option value="${k}"${k === i ? " selected" : ""}>${n}</option>`).join("")}</select></label>
    <label>Comida<select name="meal">${mealsList().map(m => `<option>${m}</option>`).join("")}</select></label><label>Alimento o receta<input name="food" list="foodlist" required></label><label>Gramos<input name="g" type="number" step="any" value="100"></label></div>
    <div class="row"><button class="btn primary" type="submit">Añadir</button></div></form>${datalist()}
    <div class="card"><h3>Resumen semanal</h3><div class="list">${DOW.map((n, k) => { const t = totalOf(planItems(k)); return `<div class="item"><div>${n}<br><span class="small muted num">P ${fmt(t.p)} · C ${fmt(t.c)} · G ${fmt(t.f)}</span></div><div class="row" style="flex-wrap:nowrap"><span class="num">${fmt(t.k)} kcal</span><button class="btn sm" data-act="pday" data-v="${k}" data-go="hoy">Abrir</button></div></div>`; }).join("")}</div></div>`;
  if (ui.plan === "recetas") {
    const r = ui.recipe;
    body = `<div class="card"><h3>Crear receta con Claude</h3>${aiNote()}<textarea data-bind="rtext" placeholder="Ej: cena rápida con pollo, unas 500 kcal y mucha proteína">${esc(ui.rtext)}</textarea>
      <div class="row"><button class="btn primary" data-act="genrecipe"${!SAMPLE || ui.busy ? " disabled" : ""}>Crear receta</button></div>${busyTxt()}${errTxt()}</div>
      ${r ? `<div class="card"><div class="row sb"><h3>${esc(r.name)} <span class="badge ia">Estimado por IA</span></h3><span class="num">${fmt(totalOf(r.items).k)} kcal</span></div>
        <p class="small">${r.items.map(e => esc(e.name) + " " + fmt(e.g) + " g").join(" · ")}</p><ol class="small" style="margin:0;padding-left:18px">${r.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
        <div class="row"><button class="btn primary" data-act="saverecipe">Guardar receta</button></div></div>` : ""}
      <div class="card"><h3>Mis recetas</h3>${S.recipes.length ? `<div class="list">${S.recipes.map(x => { const t = totalOf(x.items), g = x.items.reduce((a, e) => a + e.g, 0); return `<div class="item"><div>${esc(x.name)}<br><span class="small muted num">${fmt(t.k)} kcal · P ${fmt(t.p)} · C ${fmt(t.c)} · G ${fmt(t.f)} · ${fmt(g)} g</span></div><div class="row"><button class="btn sm" data-act="reciplan" data-id="${x.id}">Al plan</button><button class="btn sm" data-act="reclog" data-id="${x.id}">Al diario</button><button class="btn sm danger" data-act="recdel" data-id="${x.id}" aria-label="Borrar">&times;</button></div></div>`; }).join("")}</div>` : `<p class="muted">Aún no has guardado recetas.</p>`}</div>`;
  }
  if (ui.plan === "compra") {
    const agg = {}; for (let k = 0; k < 7; k++) planItems(k).forEach(e => { agg[e.name] = (agg[e.name] || 0) + e.g; });
    const names = Object.keys(agg).sort((a, b) => a.localeCompare(b, "es"));
    body = `<div class="card"><div class="row sb"><h3>Lista de la compra</h3>${names.length ? `<button class="btn sm" data-act="shopclear">Quitar marcados</button>` : ""}</div>
      ${names.length ? `<div class="list">${names.map(n => `<label class="item" style="flex-direction:row;color:var(--ink);font-size:15px"><span style="display:flex;gap:10px;align-items:center"><input type="checkbox" style="width:auto" data-act="shop" data-n="${esc(n)}"${S.shop[n] ? " checked" : ""}>${esc(n)}</span><span class="num muted">${fmt(agg[n])} g</span></label>`).join("")}</div>` : `<p class="muted">Se genera sola a partir de tu plan semanal. Aún no hay alimentos en el plan.</p>`}</div>`;
  }
  if (ui.plan === "compartir") {
    const my = totalOf(planItems(i)).k;
    body = `<div class="card"><h3>Planes sincronizados</h3><p class="small muted">Cocina una sola vez y ajusta las raciones a las calorías de cada persona. Las raciones se calculan a partir del plan de ${DOW[i]}.</p>${dayChips}
      <form class="row" data-form="person"><input name="n" placeholder="Nombre" required style="flex:1 1 140px"><input name="k" type="number" placeholder="Kcal al día" required style="flex:1 1 120px"><button class="btn" type="submit">Añadir persona</button></form>
      ${S.people.length ? `<div class="chips">${S.people.map(p => `<span class="chip">${esc(p.n)} · ${fmt(p.k)} kcal <button class="btn sm danger" data-act="persondel" data-id="${p.id}" aria-label="Quitar">&times;</button></span>`).join("")}</div>` : ""}
      ${my && S.people.length ? `<div class="tw"><table><thead><tr><th>Plato</th><th>Tú (${fmt(T.k)})</th>${S.people.map(p => `<th>${esc(p.n)}</th>`).join("")}</tr></thead><tbody>${planItems(i).map(e => `<tr><td>${esc(e.name)}</td><td>${fmt(e.g)} g</td>${S.people.map(p => `<td>${fmt(e.g * p.k / my)} g</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : `<p class="muted">Añade personas y un plan para ver las raciones.</p>`}</div>
      <div class="card"><h3>Exportar plan a PDF</h3><p class="small muted">Genera un PDF con la semana completa para imprimirlo o pasárselo a quien cocina.</p><div class="row"><button class="btn primary" data-act="pdf">Guardar PDF</button></div></div>`;
  }
  return `<h2>Plan de comidas</h2>${chipRow(ui.plan, tabs, "plansub")}${body}`;
}

function vProgreso() {
  const tabs = [["peso", "Peso"], ["grasa", "Grasa corporal"], ["medidas", "Medidas"], ["fotos", "Fotos"], ["nutrientes", "Nutrientes"]];
  let body = "";
  const td = todayStr();
  if (ui.prog === "peso") {
    const r = weeklyRate(), tr = targetRate(), T = targets();
    let adj = "";
    if (r !== null) { const diff = (tr - r) * 7700 / 7, na = clamp(Math.round(((S.kAdj || 0) + diff) / 25) * 25, -500, 500);
      adj = `<div class="card"><h3>Ajuste dinámico de calorías</h3><p>Tu ritmo real es de <b>${f1(r)} kg/semana</b> y tu objetivo es de ${f1(tr)} kg/semana.</p>
      ${Math.abs(na - (S.kAdj || 0)) >= 25 ? `<p>Te sugiero ${na - (S.kAdj || 0) > 0 ? "subir" : "bajar"} ${Math.abs(na - (S.kAdj || 0))} kcal al día.</p><div class="row"><button class="btn primary" data-act="applyadj" data-v="${na}">Aplicar ajuste</button></div>` : `<p class="muted">No hace falta cambiar nada ahora.</p>`}</div>`; }
    else adj = `<div class="card"><h3>Ajuste dinámico de calorías</h3><p class="muted">Registra al menos 3 pesos que abarquen una semana y te diré si ajustar tus calorías. Ajuste actual: ${S.kAdj || 0} kcal.</p></div>`;
    const last = S.weights.slice(-1)[0], goalW = null;
    body = `<form class="card" data-form="weight"><h3>Registrar peso</h3><div class="form"><label>Fecha<input name="d" type="date" value="${td}" max="${td}"></label><label>Peso (kg)<input name="v" type="number" step="0.1" required value="${last ? last.v : S.profile.w}"></label></div><div class="row"><button class="btn primary" type="submit">Guardar</button></div></form>
      ${adj}<div class="card"><h3>Evolución</h3>${lineChart(S.weights.slice(-60), "kg", goalW)}${S.weights.length ? `<div class="list">${S.weights.slice(-6).reverse().map(p => `<div class="item"><span>${dayLabel(p.d)}</span><div class="row"><span class="num">${f1(p.v)} kg</span><button class="btn sm danger" data-act="serdel" data-k="weights" data-d="${p.d}" aria-label="Borrar">&times;</button></div></div>`).join("")}</div>` : ""}</div>`;
  }
  if (ui.prog === "grasa") {
    const last = S.meas.slice(-1)[0] || {};
    body = `<form class="card" data-form="bfcalc"><h3>Calcular grasa corporal</h3><p class="small muted">Método de la Marina de EE. UU. con medidas en cm. Es una estimación.</p><div class="form">
      <label>Altura<input name="h" type="number" step="any" value="${S.profile.h}" required></label><label>Cuello<input name="neck" type="number" step="any" value="${last.cuello || ""}" required></label>
      <label>Cintura<input name="waist" type="number" step="any" value="${last.cintura || ""}" required></label><label>Cadera (mujeres)<input name="hip" type="number" step="any" value="${last.cadera || ""}"></label></div>
      <div class="row"><button class="btn primary" type="submit">Calcular y guardar</button></div></form>
      <form class="card" data-form="fat"><h3>Registrar porcentaje de grasa</h3><div class="form"><label>Fecha<input name="d" type="date" value="${td}" max="${td}"></label><label>% de grasa<input name="v" type="number" step="0.1" required></label></div><div class="row"><button class="btn primary" type="submit">Guardar</button></div></form>
      <div class="card"><h3>Evolución</h3>${lineChart(S.fats, "%")}${S.fats.length ? `<div class="list">${S.fats.slice(-6).reverse().map(p => `<div class="item"><span>${dayLabel(p.d)}</span><div class="row"><span class="num">${f1(p.v)} %</span><button class="btn sm danger" data-act="serdel" data-k="fats" data-d="${p.d}" aria-label="Borrar">&times;</button></div></div>`).join("")}</div>` : ""}</div>`;
  }
  if (ui.prog === "medidas") {
    const fs = ["cuello", "pecho", "cintura", "cadera", "brazo", "muslo"];
    body = `<form class="card" data-form="meas"><h3>Registrar medidas (cm)</h3><div class="form"><label>Fecha<input name="d" type="date" value="${td}" max="${td}"></label>${fs.map(f => `<label>${f[0].toUpperCase() + f.slice(1)}<input name="${f}" type="number" step="0.1"></label>`).join("")}</div><div class="row"><button class="btn primary" type="submit">Guardar</button></div></form>
      <div class="card"><h3>Historial</h3>${S.meas.length ? `<div class="tw"><table><thead><tr><th>Fecha</th>${fs.map(f => `<th>${f}</th>`).join("")}<th></th></tr></thead><tbody>${S.meas.slice().reverse().map(m => `<tr><td>${dayLabel(m.d)}</td>${fs.map(f => `<td>${m[f] ?? "-"}</td>`).join("")}<td><button class="btn sm danger" data-act="measdel" data-d="${m.d}" aria-label="Borrar">&times;</button></td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">Aún no hay medidas.</p>`}</div>`;
  }
  if (ui.prog === "fotos") {
    const ps = S.photos;
    body = `<div class="card"><h3>Fotos de progreso</h3><p class="small muted">Se guardan solo en este navegador, reducidas para ocupar poco. Haz una copia en Más &gt; Datos si no quieres perderlas.</p>
      <label>Subir foto<input id="progPhoto" type="file" accept="image/*"></label>
      ${ps.length >= 2 ? `<div class="grid"><div><p class="mono muted">Primera · ${dayLabel(ps[0].d)}</p><img class="ph" src="${ps[0].src}" alt="Primera foto"></div><div><p class="mono muted">Última · ${dayLabel(ps[ps.length - 1].d)}</p><img class="ph" src="${ps[ps.length - 1].src}" alt="Última foto"></div></div>` : ""}
      ${ps.length ? `<div class="photos">${ps.slice().reverse().map(p => `<div class="col" style="gap:4px"><img class="ph" src="${p.src}" alt="Foto del ${p.d}"><div class="row sb small"><span>${dayLabel(p.d)}</span><button class="btn sm danger" data-act="photodel" data-id="${p.id}" aria-label="Borrar">&times;</button></div></div>`).join("")}</div>` : `<p class="muted">Todavía no hay fotos.</p>`}</div>`;
  }
  if (ui.prog === "nutrientes") {
    const T = targets(), days = lastDays(14), act = lastDays(7).filter(d => entries(d).length), avg = k => act.length ? act.reduce((a, d) => a + dayTot(d)[k], 0) / act.length : 0;
    body = `<div class="card"><h3>Calorías de los últimos 14 días</h3>${barChart(days, T.k)}<p class="small muted">La línea discontinua es tu meta de ${fmt(T.k)} kcal. En rojo, días con más de un 10% de exceso.</p></div>
      <div class="card"><h3>Media de los días registrados (7 días)</h3>${act.length ? `<div class="tw"><table><thead><tr><th>Nutriente</th><th>Media</th><th>Meta</th></tr></thead><tbody>${[["Calorías", "k", T.k, "kcal"], ["Proteína", "p", T.p, "g"], ["Carbohidratos", "c", T.c, "g"], ["Grasas", "f", T.f, "g"], ["Fibra", "fi", T.fi, "g"], ["Azúcar", "s", T.s, "g"], ["Sodio", "na", T.na, "mg"]].map(r => `<tr><td>${r[0]}</td><td>${fmt(avg(r[1]))} ${r[3]}</td><td>${fmt(r[2])} ${r[3]}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">Registra comidas para ver tus medias.</p>`}</div>`;
  }
  return `<h2>Progreso</h2>${chipRow(ui.prog, tabs, "progsub")}${body}`;
}

function vAyuno() {
  const fi = fastInfo(), hist = S.fast.history.slice(-8).reverse();
  return `<h2>Ayuno intermitente</h2>
  <div class="card">${fi ? `<div class="row" style="flex-wrap:nowrap;gap:18px"><div style="flex:0 0 150px" id="fastRingBox">${ring(fi.el, fi.tot, 150, "Progreso del ayuno")}</div>
    <div class="col"><div class="big" id="fastTime">${hms(fi.left)}</div><span class="muted">${fi.done ? "Ayuno cumplido" : "restantes de " + S.fast.active.hours + " h"}</span><span class="small muted">Empezó ${new Date(S.fast.active.start).toLocaleString("es-ES", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span></div></div>
    <div class="row"><button class="btn primary" data-act="fastend">Terminar ayuno</button><button class="btn" data-act="live">Vista en vivo</button><button class="btn danger" data-act="fastcancel">Cancelar</button></div>`
    : `<h3>Empezar un ayuno</h3>${chipRow(String(ui.tmpFast), [["12", "12:12"], ["14", "14:10"], ["16", "16:8"], ["18", "18:6"], ["20", "20:4"]], "fastpick")}
    <div class="row"><label style="max-width:160px">Horas personalizadas<input id="fastH" type="number" min="1" max="72" value="${ui.tmpFast}"></label><button class="btn primary" data-act="faststart">Empezar ahora</button></div>`}</div>
  <div class="card"><h3>Historial</h3>${hist.length ? `<div class="list">${hist.map(h => `<div class="item"><span>${dayLabel(dstr(new Date(h.start)))} · objetivo ${h.hours} h</span><span class="num ${h.ok ? "" : "muted"}">${f1(h.dur / 36e5)} h ${h.ok ? "cumplido" : "incompleto"}</span></div>`).join("")}</div>` : `<p class="muted">Aún no has completado ayunos.</p>`}</div>
  <p class="small muted">Los avisos de fin de ayuno suenan como mensaje dentro de la página mientras la tengas abierta.</p>`;
}

function ctxText() {
  const T = targets(), pr = S.profile, d = todayStr(), x = dayTot(d), act = lastDays(7).filter(k => entries(k).length);
  const avg = k => act.length ? Math.round(act.reduce((a, q) => a + dayTot(q)[k], 0) / act.length) : "sin datos", r = weeklyRate();
  return `Perfil: ${pr.sex === "m" ? "hombre" : "mujer"}, ${pr.age} años, ${pr.h} cm, ${pr.w} kg, objetivo ${{ lose: "perder peso", gain: "ganar músculo", maintain: "mantener peso" }[pr.goal]}, dieta ${DIETS[pr.diet].n}.
Metas diarias: ${T.k} kcal, ${T.p} g proteína, ${T.c} g carbohidratos, ${T.f} g grasas.
Hoy lleva: ${Math.round(x.k)} kcal, ${Math.round(x.p)} g proteína, ${Math.round(x.c)} g carbohidratos, ${Math.round(x.f)} g grasas, ${Math.round(x.fi)} g fibra, ${Math.round(x.na)} mg sodio.
Media 7 días: ${avg("k")} kcal, ${avg("p")} g proteína. Tendencia de peso: ${r === null ? "sin datos suficientes" : f1(r) + " kg/semana"}.`;
}
function vCoach() {
  const quick = ["¿Qué ceno hoy según lo que llevo?", "Dame ideas de snack con proteína", "¿Cómo voy esta semana?"];
  return `<h2>Coach</h2>${aiNote()}
  <div class="card"><h3>Revisión semanal con ajuste automático</h3><p class="small muted">Claude revisa tus últimos 14 días y propone un ajuste de calorías y consejos. Tú decides si lo aplicas.</p>
    <div class="row"><button class="btn primary" data-act="review"${!SAMPLE || ui.busy ? " disabled" : ""}>Revisar mi semana</button></div>${busyTxt()}${errTxt()}
    ${ui.review ? `<div class="col"><p>${esc(ui.review.resumen)}</p><p class="small muted">${esc(ui.review.motivo)}</p><ul class="small" style="margin:0;padding-left:18px">${(ui.review.consejos || []).map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      ${ui.review.ajuste ? `<div class="row"><span class="badge ia">Propone ${ui.review.ajuste > 0 ? "+" : ""}${ui.review.ajuste} kcal/día</span><button class="btn" data-act="applyreview">Aplicar</button></div>` : `<span class="badge">Sin cambios de calorías</span>`}</div>` : ""}</div>
  <div class="card"><h3>Pregúntale al coach</h3><div class="chips">${quick.map(q => `<button class="chip" data-act="quick" data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
    <label>Ingredientes que tienes en casa (opcional)<input data-bind="pantry" value="${esc(ui.pantry || "")}" placeholder="huevos, arroz, tomate, atún"></label>
    <div class="col" id="chat">${S.coach.map(m => `<div class="bubble ${m.role === "user" ? "u" : "a"}">${esc(m.content)}</div>`).join("")}<div class="bubble a" id="coachOut" hidden></div></div>
    <form class="row" data-form="chat" style="flex-wrap:nowrap"><input name="m" placeholder="Escribe tu pregunta" aria-label="Pregunta al coach" required><button class="btn primary" type="submit"${!SAMPLE ? " disabled" : ""}>Enviar</button></form>
    ${S.coach.length ? `<div class="row"><button class="btn sm" data-act="chatclear">Borrar conversación</button></div>` : ""}</div>`;
}

function vMas() {
  const tabs = [["perfil", "Perfil"], ["metas", "Metas"], ["alimentos", "Mis alimentos"], ["sync", "Actividad"], ["datos", "Datos"], ["avisos", "Recordatorios"]], pr = S.profile, T = targets();
  let body = "";
  if (ui.mas === "perfil") body = `<form class="card" data-form="profile"><h3>Tu perfil</h3><div class="form">
    <label>Sexo<select name="sex"><option value="m"${pr.sex === "m" ? " selected" : ""}>Hombre</option><option value="f"${pr.sex === "f" ? " selected" : ""}>Mujer</option></select></label>
    <label>Edad<input name="age" type="number" value="${pr.age}" required></label><label>Altura (cm)<input name="h" type="number" value="${pr.h}" required></label><label>Peso (kg)<input name="w" type="number" step="0.1" value="${pr.w}" required></label>
    <label>Actividad<select name="act">${[[1.2, "Sedentaria"], [1.375, "Ligera"], [1.55, "Moderada"], [1.725, "Alta"]].map(a => `<option value="${a[0]}"${pr.act === a[0] ? " selected" : ""}>${a[1]}</option>`).join("")}</select></label>
    <label>Objetivo<select name="goal"><option value="lose"${pr.goal === "lose" ? " selected" : ""}>Perder peso</option><option value="maintain"${pr.goal === "maintain" ? " selected" : ""}>Mantener</option><option value="gain"${pr.goal === "gain" ? " selected" : ""}>Ganar músculo</option></select></label>
    <label>Tipo de dieta<select name="diet">${Object.entries(DIETS).map(([k, v]) => `<option value="${k}"${pr.diet === k ? " selected" : ""}>${v.n}</option>`).join("")}</select></label>
    <label>Comidas al día<select name="meals">${[3, 4, 5, 6].map(n => `<option${pr.meals === n ? " selected" : ""}>${n}</option>`).join("")}</select></label></div>
    <div class="row"><button class="btn primary" type="submit">Guardar y recalcular metas</button></div></form>`;
  if (ui.mas === "metas") body = `<form class="card" data-form="goals"><h3>Calorías y macros</h3><p class="small muted">Calculadas con la ecuación de Mifflin-St Jeor, tu actividad, tu objetivo y tu tipo de dieta. Gasto estimado: ${fmt(T.tdee)} kcal. Ajuste dinámico: ${S.kAdj || 0} kcal.</p>
    <label style="flex-direction:row;align-items:center;color:var(--ink)"><input type="checkbox" name="custom" style="width:auto"${S.goals.custom ? " checked" : ""}>Usar mis propias metas</label>
    <div class="form"><label>Calorías<input name="k" type="number" value="${T.k}"></label><label>Proteína (g)<input name="p" type="number" value="${T.p}"></label><label>Carbohidratos (g)<input name="c" type="number" value="${T.c}"></label><label>Grasas (g)<input name="f" type="number" value="${T.f}"></label></div>
    <div class="row"><button class="btn primary" type="submit">Guardar metas</button>${S.kAdj ? `<button class="btn" type="button" data-act="resetadj">Quitar ajuste dinámico</button>` : ""}</div></form>`;
  if (ui.mas === "alimentos") body = `<form class="card" data-form="food"><h3>Crear alimento propio (por 100 g)</h3><div class="form"><label>Nombre<input name="n" required></label><label>Kcal<input name="k" type="number" step="any" required></label><label>Proteína<input name="p" type="number" step="any" value="0"></label><label>Carbohidratos<input name="c" type="number" step="any" value="0"></label><label>Grasas<input name="f" type="number" step="any" value="0"></label><label>Fibra<input name="fi" type="number" step="any" value="0"></label><label>Azúcar<input name="s" type="number" step="any" value="0"></label><label>Sodio (mg)<input name="na" type="number" step="any" value="0"></label></div><div class="row"><button class="btn primary" type="submit">Guardar</button></div></form>
    <div class="card"><h3>Mis alimentos</h3>${S.foods.length ? `<div class="list">${S.foods.map(f => `<div class="item"><div>${esc(f.n)}<br><span class="small muted num">${fmt(f.k)} kcal · P ${f1(f.p)} · C ${f1(f.c)} · G ${f1(f.f)} por 100 g</span></div><button class="btn sm danger" data-act="fooddel" data-id="${f.id}" aria-label="Borrar">&times;</button></div>`).join("")}</div>` : `<p class="muted">Aún no has creado alimentos. También puedes crearlos con IA en Registrar.</p>`}</div>
    <div class="card"><h3>Mis recetas</h3><p class="small muted">Se crean y se gestionan en Plan &gt; Recetas. Tienes ${S.recipes.length}.</p></div>`;
  if (ui.mas === "sync") body = `<div class="card"><h3>Actividad y calorías quemadas</h3><p class="small muted">Esta página no puede conectarse a Apple Health, Health Connect, Garmin ni Strava. Puedes importar un archivo exportado (CSV o JSON con fecha y calorías) o anotar la actividad a mano.</p>
    <form class="form" data-form="burn"><label>Fecha<input name="d" type="date" value="${todayStr()}" max="${todayStr()}"></label><label>Kcal de actividad<input name="v" type="number" required></label><button class="btn primary" type="submit">Guardar</button></form>
    <label>Importar archivo (.csv o .json)<input id="syncIn" type="file" accept=".csv,.json,.txt"></label><p class="small muted">Formato: una línea por día, por ejemplo 2026-11-08,350</p></div>
    <div class="card"><h3>Últimos registros</h3>${Object.keys(S.burned).length ? `<div class="list">${Object.keys(S.burned).sort().reverse().slice(0, 8).map(d => `<div class="item"><span>${dayLabel(d)}</span><span class="num">${fmt(S.burned[d])} kcal</span></div>`).join("")}</div>` : `<p class="muted">Sin datos de actividad.</p>`}</div>`;
  if (ui.mas === "datos") body = `<div class="card"><h3>Exportar</h3><div class="row"><button class="btn" data-act="expmeals">Historial de comidas (CSV)</button><button class="btn" data-act="expweight">Peso y medidas (CSV)</button><button class="btn primary" data-act="expall">Copia completa (JSON)</button></div></div>
    <div class="card"><h3>Importar copia</h3><label>Archivo JSON de una copia anterior<input id="impIn" type="file" accept=".json"></label><p class="small muted">Sustituye los datos actuales.</p></div>
    <div class="card"><h3>Borrar todo</h3><p class="small muted">Elimina los datos de este navegador. No se puede deshacer.</p>${ui.confirmWipe ? `<div class="row"><button class="btn danger" data-act="wipe">Sí, borrar todo</button><button class="btn" data-act="wipecancel">Cancelar</button></div>` : `<div class="row"><button class="btn danger" data-act="wipeask">Borrar datos</button></div>`}</div>
    <p class="small muted">${storeOK ? "Tus datos se guardan en este navegador. No se comparten con nadie." : "No se puede guardar en este navegador: exporta una copia para no perder los datos."}</p>`;
  if (ui.mas === "avisos") body = `<form class="card" data-form="reminder"><h3>Recordatorios</h3><p class="small muted">Aparecen como mensaje mientras tengas la página abierta.</p><div class="form"><label>Aviso<input name="label" placeholder="Beber agua" required></label><label>Hora<input name="time" type="time" required></label><button class="btn primary" type="submit">Añadir</button></div>
    <div class="row"><button class="chip" type="button" data-act="remdef">Añadir los habituales (comidas, agua, peso)</button></div></form>
    <div class="card">${S.reminders.length ? `<div class="list">${S.reminders.slice().sort((a, b) => a.time < b.time ? -1 : 1).map(r => `<div class="item"><span><b class="num">${r.time}</b> ${esc(r.label)}</span><button class="btn sm danger" data-act="remdel" data-id="${r.id}" aria-label="Borrar">&times;</button></div>`).join("")}</div>` : `<p class="muted">No tienes recordatorios.</p>`}</div>`;
  return `<h2>Más</h2>${chipRow(ui.mas, tabs, "massub")}${body}`;
}
