/* ---------- acciones de datos ---------- */
function addEntry(it, meal, date) { (S.log[date] ||= []).push({ ...it, id: uid(), meal }); save(); }
const toast = msg => { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 3200); };
function setSeries(key, d, v) { const a = S[key].filter(p => p.d !== d); a.push({ d, v }); a.sort((x, y) => x.d < y.d ? -1 : 1); S[key] = a; save(); }
/* Guarda un archivo. Dentro de claude.ai usa la capability "downloads"; fuera (servidor propio) descarga con un enlace. */
function saveFile(filename, data) {
  const viaLink = () => {
    const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data]));
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Archivo guardado.");
  };
  const dl = window.claude && window.claude.use ? window.claude.use("downloads") : Promise.resolve(null);
  dl.then(d => { if (!d) return viaLink(); return d.save({ filename, data }).then(() => toast("Archivo guardado."), e => { if (e.code !== "declined") toast("No se ha podido guardar el archivo."); }); }, viaLink);
}
const csvCell = v => '"' + String(v ?? "").replace(/"/g, '""') + '"';
