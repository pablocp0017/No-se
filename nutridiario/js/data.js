/* ---------- base local de alimentos (por 100 g, aproximado) ---------- */
const BASE = [
["Arroz blanco cocido",130,2.7,28,.3,.4,0,1],["Arroz integral cocido",123,2.7,26,1,1.8,.4,4],["Pasta cocida",158,5.8,31,.9,1.8,.6,1],
["Pan blanco",265,9,49,3.2,2.7,5,490],["Pan integral",247,13,41,3.4,7,6,450],["Avena en copos",389,17,66,7,10,1,2],
["Patata cocida",87,1.9,20,.1,1.8,.9,5],["Boniato cocido",90,2,21,.2,3.3,6.5,36],["Pechuga de pollo cocida",165,31,0,3.6,0,0,74],
["Muslo de pollo sin piel",179,24,0,8.5,0,0,90],["Ternera magra cocida",217,26,0,12,0,0,60],["Lomo de cerdo",143,26,0,3.5,0,0,60],
["Jamón serrano",241,31,0,13,0,0,1500],["Pavo en fiambre",104,17,2,2.5,0,1,1000],["Salmón cocido",206,22,0,12,0,0,60],
["Atún al natural",116,26,0,1,0,0,300],["Merluza cocida",90,19,0,1.3,0,0,80],["Gambas cocidas",99,24,.2,.3,0,0,111],
["Huevo cocido",155,13,1.1,11,0,1.1,124],["Clara de huevo",52,11,.7,.2,0,.7,166],["Leche semidesnatada",46,3.4,4.8,1.6,0,4.8,44],
["Yogur natural",61,3.5,4.7,3.3,0,4.7,46],["Yogur griego",97,9,4,5,0,4,35],["Queso fresco",98,11,3.4,4.3,0,3.4,300],
["Queso curado",402,25,1.3,33,0,.5,700],["Mozzarella",280,28,3,17,0,1,600],["Lentejas cocidas",116,9,20,.4,7.9,1.8,2],
["Garbanzos cocidos",164,8.9,27,2.6,7.6,4.8,7],["Alubias cocidas",127,8.7,23,.5,6.4,.3,1],["Tofu",76,8,1.9,4.8,.3,.6,7],
["Brócoli cocido",35,2.4,7,.4,3.3,1.4,41],["Espinacas crudas",23,2.9,3.6,.4,2.2,.4,79],["Tomate",18,.9,3.9,.2,1.2,2.6,5],
["Zanahoria cruda",41,.9,10,.2,2.8,4.7,69],["Lechuga",15,1.4,2.9,.2,1.3,.8,28],["Pepino",15,.7,3.6,.1,.5,1.7,2],
["Pimiento rojo",31,1,6,.3,2.1,4.2,4],["Calabacín",17,1.2,3.1,.3,1,2.5,8],["Cebolla",40,1.1,9.3,.1,1.7,4.2,4],
["Champiñones",22,3.1,3.3,.3,1,2,5],["Plátano",89,1.1,23,.3,2.6,12,1],["Manzana",52,.3,14,.2,2.4,10,1],
["Naranja",47,.9,12,.1,2.4,9,0],["Fresas",32,.7,7.7,.3,2,4.9,1],["Uvas",69,.7,18,.2,.9,16,2],["Aguacate",160,2,8.5,15,6.7,.7,7],
["Almendras",579,21,22,50,12,4,1],["Nueces",654,15,14,65,6.7,2.6,2],["Crema de cacahuete",588,25,20,50,6,9,400],
["Aceite de oliva",884,0,0,100,0,0,2],["Mantequilla",717,.9,.1,81,0,.1,11],["Azúcar",387,0,100,0,0,100,1],["Miel",304,.3,82,0,.2,82,4],
["Chocolate negro 70%",598,7.8,46,43,11,24,20],["Hummus",166,8,14,10,6,.3,379],["Pizza margarita",266,11,33,10,2.3,3.6,598],
["Patatas fritas de bolsa",536,7,53,35,4.8,.3,525],["Cerveza",43,.5,3.6,0,0,0,4],["Zumo de naranja",45,.7,10,.2,.2,8.4,1],
["Proteína whey en polvo",400,80,8,6,0,4,300]
].map((r, i) => ({ id: "b" + i, n: r[0], k: r[1], p: r[2], c: r[3], f: r[4], fi: r[5], s: r[6], na: r[7], src: "base" }));

function recipeFood(r) {
  const t = totalOf(r.items), g = r.items.reduce((a, i) => a + i.g, 0) || 1, m = 100 / g;
  return { id: "r" + r.id, n: "Receta: " + r.name, k: t.k * m, p: t.p * m, c: t.c * m, f: t.f * m, fi: t.fi * m, s: t.s * m, na: t.na * m, src: "receta", total: g };
}
const pool = () => [...BASE, ...S.foods.map(f => ({ ...f, src: "mio" })), ...S.recipes.map(recipeFood)];
const KEYS = ["k", "p", "c", "f", "fi", "s", "na"];
const totalOf = arr => arr.reduce((a, e) => { KEYS.forEach(k => a[k] += +e[k] || 0); return a; }, { k: 0, p: 0, c: 0, f: 0, fi: 0, s: 0, na: 0 });
const snap = (food, g) => { const m = g / 100, o = { id: uid(), name: food.n, g }; KEYS.forEach(k => o[k] = (+food[k] || 0) * m); return o; };
const scaleItem = (it, m) => { const o = { ...it, id: uid(), g: it.g * m }; KEYS.forEach(k => o[k] = (+it[k] || 0) * m); return o; };
