/* ---------- eventos ---------- */
const A = {
  tab(b) { ui.tab = b.dataset.v; render(); window.scrollTo(0, 0); },
  goto(b) { ui.tab = b.dataset.tab; if (b.dataset.sub) ui.mas = b.dataset.sub; render(); window.scrollTo(0, 0); },
  day(b) { const v = +b.dataset.v; ui.date = v === 0 ? todayStr() : clamp(0, 0, 0) || (addDays(ui.date, v) > todayStr() ? todayStr() : addDays(ui.date, v)); render(); },
  addmeal(b) { ui.meal = b.dataset.v; ui.tab = "registrar"; ui.reg = "buscar"; render(); },
  delentry(b) { S.log[ui.date] = entries(ui.date).filter(e => e.id !== b.dataset.id); save(); render(); },
  water(b) { const d = ui.date; S.water[d] = Math.max(0, (S.water[d] || 0) + +b.dataset.v); save(); render(); },
  burn() { ui.tab = "mas"; ui.mas = "sync"; render(); },
  reg(b) { ui.reg = b.dataset.v; ui.ai = null; ui.err = ""; render(); },
  pick(b) { ui.pick = b.dataset.id; $("#pickBox").innerHTML = pickPanel(); updatePick(); $("#pickBox").scrollIntoView({ block: "nearest" }); },
  pickadd() { const f = pool().find(x => x.id === ui.pick), g = +$("#pickG").value; if (!f || !g) return; addEntry(snap(f, g), ui.meal, ui.date); toast(f.n + " añadido a " + ui.meal); ui.pick = null; $("#pickBox").innerHTML = ""; },
  pickplan() { const f = pool().find(x => x.id === ui.pick), g = +$("#pickG").value; if (!f || !g) return; (planDay(ui.pday)[ui.meal] ||= []).push(snap(f, g)); save(); toast("Añadido al plan de " + DOW[ui.pday]); },
  cmpadd() { const f = ui.pick; if (f && !ui.cmp.includes(f)) ui.cmp.push(f); ui.cmp = ui.cmp.slice(-4); ui.reg = "comparar"; render(); },
  cmpin() { const v = norm($("#cmpIn").value.trim()), f = pool().find(x => norm(x.n) === v) || pool().find(x => norm(x.n).includes(v)); if (!f) return toast("No encuentro ese alimento."); if (!ui.cmp.includes(f.id)) ui.cmp.push(f.id); ui.cmp = ui.cmp.slice(-4); render(); },
  cmpclear() { ui.cmp = []; render(); },
  aidel(b) { ui.ai.items = ui.ai.items.filter(e => e.id !== b.dataset.id); if (!ui.ai.items.length) ui.ai = null; render(); },
  aiadd() { ui.ai.items.forEach(e => addEntry(e, ui.meal, ui.date)); toast("Añadido a " + ui.meal); ui.ai = null; ui.tab = "hoy"; render(); },
  aifood() { ui.ai.items.forEach(e => { if (!e.g) return; const m = 100 / e.g; S.foods.push({ id: uid(), n: e.name, k: e.k * m, p: e.p * m, c: e.c * m, f: e.f * m, fi: e.fi * m, s: e.s * m, na: e.na * m }); }); save(); toast("Guardado en Mis alimentos."); },
  photo() { const f = $("#photoIn").files[0]; if (!f) return toast("Elige primero una foto."); estimate("Esta imagen es una foto de una comida. Identifica cada alimento y estima su cantidad en gramos y sus valores nutricionales.", [f]); },
  txt() { if (!ui.text.trim()) return toast("Escribe primero qué has comido."); estimate("Eres un nutricionista. Calcula los valores nutricionales de lo siguiente, separando cada alimento:\n" + ui.text.trim()); },
  barcode() { const f = $("#codeImg") && $("#codeImg").files[0]; if (f) return estimate("La imagen muestra un producto envasado o su etiqueta. Identifica el producto y estima los valores de UNA ración habitual.", [f]);
    if (!ui.code.trim()) return toast("Escribe un código o sube una foto."); estimate("Código de barras: " + ui.code.trim() + ". Si reconoces el producto, estima una ración habitual; si no, responde []."); },
  mic() { const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) return toast("El dictado por voz no está disponible aquí. Usa el micrófono del teclado.");
    try { const r = new SR(); r.lang = "es-ES"; r.onresult = e => { ui.text = (ui.text + " " + e.results[0][0].transcript).trim(); render(); }; r.onerror = () => toast("No puedo usar el micrófono aquí. Usa el dictado del teclado."); r.start(); toast("Escuchando…"); } catch (e) { toast("No puedo usar el micrófono aquí."); } },
  plansub(b) { ui.plan = b.dataset.v; render(); },
  pday(b) { ui.pday = +b.dataset.v; if (b.dataset.go) ui.plan = b.dataset.go; render(); },
  genplan() {
    const T = targets(), ms = mealsList();
    runAI(`Eres nutricionista. Crea un plan de comidas de UN día, en español, para: ${T.k} kcal, ${T.p} g de proteína, ${T.c} g de carbohidratos y ${T.f} g de grasas. Dieta: ${DIETS[S.profile.diet].n}. Comidas del día: ${ms.join(", ")}. Preferencias o restricciones: ${ui.prefs || "ninguna"}. Usa alimentos comunes en España.
Responde SOLO con JSON: {"comidas":[{"comida":string,"platos":[{"nombre":string,"gramos":number,"kcal":number,"proteinas":number,"carbohidratos":number,"grasas":number}]}]}. "comida" debe ser exactamente uno de: ${ms.join(", ")}. Los valores nutricionales son del plato completo con esos gramos. El total del día debe estar dentro del 5% del objetivo.`,
      { modelTier: "default" }, r => { const day = {}; (r.comidas || []).forEach(c => { const m = ms.includes(c.comida) ? c.comida : ms[0]; (day[m] ||= []).push(...(c.platos || []).map(p => toItem({ ...p, fibra: 0, azucar: 0, sodio_mg: 0 }))); }); if (!Object.keys(day).length) throw { code: "invalid_json" }; S.plan[ui.pday] = day; save(); });
  },
  planscale() { const T = targets(), tot = totalOf(planItems(ui.pday)).k; if (!tot) return toast("El día está vacío."); const m = T.k / tot, pd = planDay(ui.pday); Object.keys(pd).forEach(k => pd[k] = pd[k].map(e => scaleItem(e, m))); save(); toast("Porciones ajustadas a " + fmt(T.k) + " kcal."); render(); },
  planlog() { const pd = planDay(ui.pday); let n = 0; Object.keys(pd).forEach(m => pd[m].forEach(e => { addEntry(e, m, todayStr()); n++; })); toast(n ? "Plan pasado al diario de hoy." : "El día está vacío."); },
  planweek() { const src = JSON.stringify(S.plan[ui.pday] || {}); if (src === "{}") return toast("El día está vacío."); for (let k = 0; k < 7; k++) if (k !== ui.pday) { const c = JSON.parse(src); Object.values(c).forEach(a => a.forEach(e => e.id = uid())); S.plan[k] = c; } save(); toast("Copiado a toda la semana."); render(); },
  planclear() { S.plan[ui.pday] = {}; save(); render(); },
  plandel(b) { const pd = planDay(ui.pday); pd[b.dataset.m] = (pd[b.dataset.m] || []).filter(e => e.id !== b.dataset.id); save(); render(); },
  genrecipe() {
    const T = targets(); if (!ui.rtext.trim()) return toast("Cuéntame qué receta quieres.");
    runAI(`Eres nutricionista y cocinero. Crea UNA receta en español para esta petición: "${ui.rtext.trim()}". Contexto del usuario: dieta ${DIETS[S.profile.diet].n}, ${T.k} kcal al día.
Responde SOLO con JSON: {"nombre":string,"ingredientes":[{"nombre":string,"gramos":number,"kcal":number,"proteinas":number,"carbohidratos":number,"grasas":number}],"pasos":[string]}. Los valores nutricionales son del ingrediente con esos gramos. Receta para 1 ración.`,
      { modelTier: "default" }, r => { if (!r.ingredientes || !r.ingredientes.length) throw { code: "invalid_json" }; ui.recipe = { id: uid(), name: String(r.nombre || "Receta"), items: r.ingredientes.map(p => toItem({ ...p, fibra: 0, azucar: 0, sodio_mg: 0 })), steps: (r.pasos || []).map(String) }; });
  },
  saverecipe() { S.recipes.push(ui.recipe); ui.recipe = null; save(); toast("Receta guardada."); render(); },
  recdel(b) { S.recipes = S.recipes.filter(r => r.id !== b.dataset.id); save(); render(); },
  reciplan(b) { const r = S.recipes.find(x => x.id === b.dataset.id), g = r.items.reduce((a, e) => a + e.g, 0), f = recipeFood(r); (planDay(ui.pday)[mealsList()[2] || mealsList()[0]] ||= []).push(snap({ ...f, n: r.name }, g)); save(); toast("Añadida al plan de " + DOW[ui.pday] + "."); },
  reclog(b) { const r = S.recipes.find(x => x.id === b.dataset.id), g = r.items.reduce((a, e) => a + e.g, 0); addEntry(snap({ ...recipeFood(r), n: r.name }, g), mealsList()[2] || mealsList()[0], todayStr()); toast("Añadida al diario de hoy."); },
  shop(b) { S.shop[b.dataset.n] = b.checked; save(); },
  shopclear() { Object.keys(S.shop).filter(k => S.shop[k]).forEach(k => { for (let d = 0; d < 7; d++) Object.keys(planDay(d)).forEach(m => planDay(d)[m] = planDay(d)[m].filter(e => e.name !== k)); delete S.shop[k]; }); save(); render(); },
  persondel(b) { S.people = S.people.filter(p => p.id !== b.dataset.id); save(); render(); },
  pdf() {
    const J = window.jspdf && window.jspdf.jsPDF; if (!J) return toast("No se ha podido cargar el generador de PDF.");
    const doc = new J({ unit: "mm", format: "a4" }); let y = 18; const line = (t, s = 10, b = false) => { if (y > 280) { doc.addPage(); y = 18; } doc.setFont("helvetica", b ? "bold" : "normal"); doc.setFontSize(s); doc.text(String(t), 14, y); y += s * .5 + 2; };
    line("Plan de comidas semanal", 18, true); y += 2;
    DOW.forEach((n, k) => { const pd = planDay(k), t = totalOf(planItems(k)); line(n + "  (" + fmt(t.k) + " kcal)", 13, true); if (!planItems(k).length) line("Sin plan", 10); Object.keys(pd).forEach(m => { if (!pd[m].length) return; line(m, 10, true); pd[m].forEach(e => line("   " + e.name + " - " + fmt(e.g) + " g - " + fmt(e.k) + " kcal", 10)); }); y += 3; });
    saveFile("plan-semanal.pdf", doc.output("blob"));
  },
  progsub(b) { ui.prog = b.dataset.v; render(); },
  applyadj(b) { S.kAdj = +b.dataset.v; save(); toast("Ajuste aplicado: " + S.kAdj + " kcal."); render(); },
  serdel(b) { S[b.dataset.k] = S[b.dataset.k].filter(p => p.d !== b.dataset.d); save(); render(); },
  measdel(b) { S.meas = S.meas.filter(m => m.d !== b.dataset.d); save(); render(); },
  photodel(b) { S.photos = S.photos.filter(p => p.id !== b.dataset.id); save(); render(); },
  fastpick(b) { ui.tmpFast = +b.dataset.v; render(); },
  faststart() { const h = clamp(+$("#fastH").value || 16, 1, 72); S.fast.active = { start: Date.now(), hours: h }; save(); render(); },
  fastend() { const f = S.fast.active, dur = Date.now() - f.start; S.fast.history.push({ start: f.start, hours: f.hours, dur, ok: dur >= f.hours * 36e5 }); S.fast.active = null; ui.live = false; save(); render(); },
  fastcancel() { S.fast.active = null; ui.live = false; save(); render(); },
  live() { ui.live = true; renderLive(); }, liveclose() { ui.live = false; renderLive(); },
  review() {
    const days = lastDays(14).map(d => { const t = dayTot(d); return entries(d).length ? `${d}: ${Math.round(t.k)} kcal, P ${Math.round(t.p)}, C ${Math.round(t.c)}, G ${Math.round(t.f)}` : null; }).filter(Boolean);
    const ws = S.weights.slice(-8).map(p => `${p.d}: ${p.v} kg`);
    if (days.length < 3) { ui.err = "Necesito al menos 3 días registrados para revisar tu semana."; return render(); }
    runAI(`Eres un coach de nutrición prudente. Datos del usuario:\n${ctxText()}\nRegistros de los últimos 14 días:\n${days.join("\n")}\nPesos recientes: ${ws.join("; ") || "sin datos"}.
Responde SOLO con JSON: {"resumen":string,"motivo":string,"ajuste":number,"consejos":[string]}. "ajuste" son kcal diarias a sumar o restar (entre -300 y 300, múltiplo de 25, 0 si no hace falta). Escribe en español, sin diagnósticos médicos.`,
      { modelTier: "default" }, r => { ui.review = { resumen: String(r.resumen || ""), motivo: String(r.motivo || ""), ajuste: clamp(Math.round((+r.ajuste || 0) / 25) * 25, -300, 300), consejos: (r.consejos || []).map(String).slice(0, 5) }; });
  },
  applyreview() { S.kAdj = clamp((S.kAdj || 0) + ui.review.ajuste, -500, 500); ui.review = null; save(); toast("Ajuste aplicado."); render(); },
  quick(b) { chat(b.dataset.q); },
  chatclear() { S.coach = []; save(); render(); },
  massub(b) { ui.mas = b.dataset.v; render(); },
  resetadj() { S.kAdj = 0; save(); render(); },
  fooddel(b) { S.foods = S.foods.filter(f => f.id !== b.dataset.id); save(); render(); },
  expmeals() { const rows = [["fecha", "comida", "alimento", "gramos", "kcal", "proteina_g", "carbohidratos_g", "grasas_g", "fibra_g", "azucar_g", "sodio_mg"]];
    Object.keys(S.log).sort().forEach(d => S.log[d].forEach(e => rows.push([d, e.meal, e.name, Math.round(e.g), Math.round(e.k), f1(e.p), f1(e.c), f1(e.f), f1(e.fi), f1(e.s), Math.round(e.na)]))); saveFile("historial-comidas.csv", rows.map(r => r.map(csvCell).join(",")).join("\n")); },
  expweight() { const rows = [["fecha", "peso_kg", "grasa_pct", "cuello", "pecho", "cintura", "cadera", "brazo", "muslo"]]; const ds = [...new Set([...S.weights.map(p => p.d), ...S.fats.map(p => p.d), ...S.meas.map(p => p.d)])].sort();
    ds.forEach(d => { const w = S.weights.find(p => p.d === d), f = S.fats.find(p => p.d === d), m = S.meas.find(p => p.d === d) || {}; rows.push([d, w ? w.v : "", f ? f.v : "", m.cuello ?? "", m.pecho ?? "", m.cintura ?? "", m.cadera ?? "", m.brazo ?? "", m.muslo ?? ""]); }); saveFile("peso-y-medidas.csv", rows.map(r => r.map(csvCell).join(",")).join("\n")); },
  expall() { saveFile("nutridiario-copia.json", JSON.stringify(S)); },
  wipeask() { ui.confirmWipe = true; render(); }, wipecancel() { ui.confirmWipe = false; render(); },
  wipe() { S = DEF(); ui.confirmWipe = false; try { localStorage.removeItem(KEY); } catch (e) { } toast("Datos borrados."); render(); },
  remdef() { [["08:30", "Registrar el desayuno"], ["14:00", "Registrar la comida"], ["17:00", "Beber agua"], ["21:00", "Registrar la cena"], ["08:00", "Pesarte (en ayunas)"]].forEach(([time, label]) => S.reminders.push({ id: uid(), time, label })); save(); render(); },
  remdel(b) { S.reminders = S.reminders.filter(r => r.id !== b.dataset.id); save(); render(); }
};
document.addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (!b || b.tagName === "INPUT") return; const f = A[b.dataset.act]; if (f) f(b, e); });
document.addEventListener("change", e => { const b = e.target; if (b.dataset && b.dataset.act === "shop") A.shop(b); if (b.id === "progPhoto") addPhoto(b.files[0]); if (b.id === "syncIn") importSync(b.files[0]); if (b.id === "impIn") importBackup(b.files[0]); if (b.dataset && b.dataset.bind === "meal") ui.meal = b.value; });
document.addEventListener("input", e => { const t = e.target;
  if (t.id === "q") { ui.q = t.value; $("#results").innerHTML = searchResults(); }
  else if (t.id === "pickG") updatePick();
  else if (t.dataset && t.dataset.bind && t.dataset.bind !== "meal") ui[t.dataset.bind] = t.value; });
const FORMS = {
  manual(fd) { const g = +fd.get("g") || 0, it = { id: uid(), name: fd.get("n"), g }; ["k", "p", "c", "f", "fi", "s", "na"].forEach(k => it[k] = +fd.get(k) || 0); addEntry(it, ui.meal, ui.date); toast("Añadido a " + ui.meal); ui.tab = "hoy"; },
  planadd(fd) { const v = norm(String(fd.get("food")).trim()), f = pool().find(x => norm(x.n) === v) || pool().find(x => norm(x.n).includes(v)); if (!f) return toast("No encuentro ese alimento. Créalo en Más > Mis alimentos."); (planDay(+fd.get("day"))[fd.get("meal")] ||= []).push(snap(f, +fd.get("g") || 100)); save(); toast("Añadido al plan."); },
  person(fd) { S.people.push({ id: uid(), n: fd.get("n"), k: +fd.get("k") }); save(); },
  weight(fd) { setSeries("weights", fd.get("d"), +fd.get("v")); if (S.profile.isDefault) { } toast("Peso guardado."); },
  fat(fd) { setSeries("fats", fd.get("d"), +fd.get("v")); toast("Guardado."); },
  bfcalc(fd) { const h = +fd.get("h"), n = +fd.get("neck"), w = +fd.get("waist"), hip = +fd.get("hip") || 0; let bf;
    if (S.profile.sex === "m") bf = w - n > 0 ? 495 / (1.0324 - .19077 * Math.log10(w - n) + .15456 * Math.log10(h)) - 450 : NaN;
    else bf = (w + hip - n > 0 && hip) ? 495 / (1.29579 - .35004 * Math.log10(w + hip - n) + .221 * Math.log10(h)) - 450 : NaN;
    if (!isFinite(bf) || bf < 2 || bf > 60) return toast("Revisa las medidas: no salen valores coherentes."); setSeries("fats", todayStr(), Math.round(bf * 10) / 10); toast("Grasa estimada: " + f1(bf) + " %"); },
  meas(fd) { const m = { d: fd.get("d") }; ["cuello", "pecho", "cintura", "cadera", "brazo", "muslo"].forEach(k => { const v = fd.get(k); if (v) m[k] = +v; }); S.meas = S.meas.filter(x => x.d !== m.d).concat(m).sort((a, b) => a.d < b.d ? -1 : 1); save(); toast("Medidas guardadas."); },
  chat(fd, form) { form.reset(); chat(fd.get("m")); return "keep"; },
  profile(fd) { const p = S.profile; p.sex = fd.get("sex"); p.age = +fd.get("age"); p.h = +fd.get("h"); p.w = +fd.get("w"); p.act = +fd.get("act"); p.goal = fd.get("goal"); p.diet = fd.get("diet"); p.meals = +fd.get("meals"); p.isDefault = false; S.kAdj = 0; save(); toast("Perfil guardado. Metas recalculadas."); },
  goals(fd) { S.goals = { custom: !!fd.get("custom"), k: +fd.get("k"), p: +fd.get("p"), c: +fd.get("c"), f: +fd.get("f") }; save(); toast("Metas guardadas."); },
  food(fd) { const f = { id: uid(), n: fd.get("n") }; ["k", "p", "c", "f", "fi", "s", "na"].forEach(k => f[k] = +fd.get(k) || 0); S.foods.push(f); save(); toast("Alimento guardado."); },
  burn(fd) { S.burned[fd.get("d")] = +fd.get("v"); save(); toast("Actividad guardada."); },
  reminder(fd) { S.reminders.push({ id: uid(), time: fd.get("time"), label: fd.get("label") }); save(); }
};
document.addEventListener("submit", e => { const f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault(); const r = FORMS[f.dataset.form](new FormData(f), f); if (r !== "keep") render(); });
