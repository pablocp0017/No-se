/* ---------- estado ---------- */
const KEY = "nutridiario_v1";
const DIETS = {
  equilibrada: { n: "Equilibrada", p: 20, c: 50, f: 30 }, proteica: { n: "Alta en proteínas", p: 35, c: 35, f: 30 },
  bajacarb: { n: "Baja en carbohidratos", p: 30, c: 25, f: 45 }, keto: { n: "Keto", p: 25, c: 5, f: 70 },
  bajagrasa: { n: "Baja en grasa", p: 25, c: 55, f: 20 }
};
const DEF = () => ({
  profile: { sex: "m", age: 25, h: 175, w: 70, act: 1.375, goal: "lose", diet: "equilibrada", meals: 4, isDefault: true },
  goals: { custom: false, k: 2000, p: 120, c: 220, f: 65 }, kAdj: 0,
  log: {}, water: {}, burned: {}, weights: [], fats: [], meas: [], photos: [],
  foods: [], recipes: [], plan: {}, shop: {}, people: [],
  fast: { active: null, history: [] }, challenges: [], objectives: [], reminders: [], coach: []
});
let S = DEF(), storeOK = true;
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(DEF(), JSON.parse(raw)); } catch (e) { storeOK = false; }
let saveT = null;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storeOK = false; toast("No hay espacio o permiso para guardar. Exporta una copia en Más > Datos."); } }, 200);
}
const ui = { tab: "hoy", reg: "buscar", plan: "hoy", prog: "peso", mas: "perfil", date: todayStr(), meal: "Desayuno", q: "", pick: null,
  ai: null, err: "", busy: false, text: "", code: "", pday: dowIdx(todayStr()), prefs: "", rtext: "", recipe: null, cmp: [], live: false, chat: false, review: null, tmpFast: 16, goalsSub: "objetivos", newObj: false, objTpl: null, aiObj: null };
