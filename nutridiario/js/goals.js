/* ---------- acciones de objetivos y retos (se añaden a A y FORMS de events.js) ---------- */
const findObj = id => S.objectives.find(o => o.id === id);
Object.assign(A, {
  goalsub(b) { ui.goalsSub = b.dataset.v; render(); },
  objform() { ui.newObj = !ui.newObj; ui.objTpl = null; render(); },
  objtpl(b) { ui.objTpl = ui.objTpl === b.dataset.v ? null : b.dataset.v; render(); },
  actcheck(b) {
    const o = findObj(b.dataset.o); if (!o) return; const d = todayStr(), list = (o.done ||= {})[d] ||= [];
    const i = list.indexOf(b.dataset.id); if (i >= 0) list.splice(i, 1); else list.push(b.dataset.id);
    if (!list.length) delete o.done[d]; save(); render();
  },
  actdel(b) { const o = findObj(b.dataset.o); if (!o) return; o.actions = o.actions.filter(a => a.id !== b.dataset.id); save(); render(); },
  objdone(b) { const o = findObj(b.dataset.id); if (o) { o.status = "done"; save(); toast("¡Objetivo conseguido! Celébralo."); render(); } },
  objreopen(b) { const o = findObj(b.dataset.id); if (o) { o.status = "active"; save(); render(); } },
  objdel(b) { S.objectives = S.objectives.filter(o => o.id !== b.dataset.id); if (ui.aiObj && ui.aiObj.id === b.dataset.id) ui.aiObj = null; save(); render(); },
  chdel(b) { S.challenges = S.challenges.filter(c => c.id !== b.dataset.id); save(); render(); },
  aiacts(b) {
    const o = findObj(b.dataset.id); if (!o) return;
    runAI(`Eres coach de nutrición y hábitos. El usuario quiere lograr este objetivo: "${o.title}"${o.why ? ` (motivo: ${o.why})` : ""}, antes del ${o.deadline}.
Datos:\n${ctxText()}\nAcciones que ya tiene: ${o.actions.map(a => a.text).join("; ") || "ninguna"}.
Propón 4 acciones operativas nuevas, concretas, pequeñas y medibles (algo que se pueda marcar como hecho en un día). Responde SOLO con JSON: {"acciones":[{"texto":string,"veces_por_semana":number}]}. "veces_por_semana" entre 1 y 7. En español, sin consejos médicos.`,
      { modelTier: "quick" }, r => {
        const list = (r.acciones || []).map(a => ({ text: String(a.texto || "").slice(0, 120), freq: clamp(Math.round(+a.veces_por_semana) || 3, 1, 7) })).filter(a => a.text);
        if (!list.length) throw { code: "invalid_json" }; ui.aiObj = { id: o.id, list };
      });
  },
  aiactadd(b) { const o = ui.aiObj && findObj(ui.aiObj.id); if (!o) return; const a = ui.aiObj.list[+b.dataset.i]; if (!a) return; o.actions.push({ id: uid(), text: a.text, freq: a.freq }); ui.aiObj.list.splice(+b.dataset.i, 1); if (!ui.aiObj.list.length) ui.aiObj = null; save(); render(); }
});
Object.assign(FORMS, {
  objective(fd) {
    const metric = fd.get("metric"), target = +fd.get("target"), deadline = fd.get("deadline"), title = String(fd.get("title")).trim();
    if (!title || !isFinite(target) || target <= 0) return toast("Revisa el título y la meta.");
    if (deadline <= todayStr()) return toast("La fecha límite debe ser futura.");
    if (HABIT_TYPES.includes(metric) && target > 7) return toast("Para hábitos la meta son entre 1 y 7 días por semana.");
    const start = S.weights.length ? S.weights[S.weights.length - 1].v : S.profile.w, tp = OBJ_TEMPLATES.find(t => t.k === ui.objTpl);
    S.objectives.unshift({ id: uid(), title, why: String(fd.get("why") || "").trim(), metric, start, target, created: todayStr(), deadline, status: "active", done: {},
      actions: (tp && tp.m === metric ? tp.acts : []).map(([text, freq]) => ({ id: uid(), text, freq })) });
    ui.newObj = false; ui.objTpl = null; save(); toast("Objetivo creado. Añade o ajusta las acciones.");
  },
  action(fd, form) { const o = findObj(form.dataset.o), text = String(fd.get("text")).trim(); if (!o || !text) return; o.actions.push({ id: uid(), text, freq: +fd.get("freq") || 3 }); save(); },
  challenge(fd) { S.challenges.push({ id: uid(), type: fd.get("type"), days: +fd.get("days"), start: todayStr() }); save(); toast("Reto empezado."); }
});
