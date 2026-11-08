/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const dstr = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const todayStr = () => dstr(new Date());
const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return dstr(d); };
const fmt = n => Math.round(+n || 0).toLocaleString("es-ES");
const f1 = n => (Math.round((+n || 0) * 10) / 10).toLocaleString("es-ES");
const uid = () => Math.random().toString(36).slice(2, 9);
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const dayLabel = s => parse(s).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
const DOW = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const dowIdx = s => (parse(s).getDay() + 6) % 7;
const lastDays = n => Array.from({ length: n }, (_, i) => addDays(todayStr(), i - n + 1));
