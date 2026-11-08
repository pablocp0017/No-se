/* ---------- archivos ---------- */
function addPhoto(file) {
  if (!file) return; const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => { const r = 480 / Math.max(img.width, img.height, 480), c = document.createElement("canvas"); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); S.photos.push({ id: uid(), d: todayStr(), src: c.toDataURL("image/jpeg", .7) }); save(); toast("Foto guardada."); render(); };
  img.onerror = () => toast("No he podido leer esa foto.");
  img.src = url;
}
function importSync(file) {
  if (!file) return; file.text().then(t => { let n = 0;
    try { const j = JSON.parse(t); (Array.isArray(j) ? j : Object.entries(j).map(([d, v]) => ({ fecha: d, kcal: v }))).forEach(r => { const d = r.fecha || r.date || r.d, v = +(r.kcal ?? r.calories ?? r.v); if (/^\d{4}-\d{2}-\d{2}$/.test(d) && isFinite(v)) { S.burned[d] = v; n++; } }); }
    catch (e) { t.split(/\r?\n/).forEach(l => { const m = l.match(/(\d{4}-\d{2}-\d{2})\D+(\d+(?:[.,]\d+)?)/); if (m) { S.burned[m[1]] = +m[2].replace(",", "."); n++; } }); }
    save(); toast(n ? n + " días de actividad importados." : "No he encontrado datos con formato AAAA-MM-DD,kcal."); render(); });
}
function importBackup(file) {
  if (!file) return; file.text().then(t => { try { const j = JSON.parse(t); if (!j || typeof j !== "object" || !j.profile || !j.log) throw 0; S = Object.assign(DEF(), j); save(); toast("Copia importada."); render(); } catch (e) { toast("Ese archivo no es una copia válida."); } });
}
