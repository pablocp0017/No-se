#!/usr/bin/env node
/* Servidor de NutriDiario: sirve la web y hace de proxy con la API de Anthropic.
   Sin dependencias (Node 18+). La clave vive SOLO aquí, nunca en el navegador.

   Uso:
     ANTHROPIC_API_KEY=sk-ant-... node server/server.js
   Variables opcionales:
     PORT                 puerto (8000)
     MODEL_QUICK          modelo rápido  (claude-haiku-5-5)
     MODEL_DEFAULT        modelo normal  (claude-sonnet-5-5)
     RATE_PER_MIN         peticiones por minuto y por IP (20)
     ALLOWED_ORIGIN       origen CORS permitido si la web se sirve desde otro dominio
     ANTHROPIC_API_URL    URL base (para pruebas con un servidor simulado) */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8000;
const API = (process.env.ANTHROPIC_API_URL || "https://api.anthropic.com").replace(/\/$/, "");
const MODELS = { quick: process.env.MODEL_QUICK || "claude-haiku-5-5", default: process.env.MODEL_DEFAULT || "claude-sonnet-5-5" };
const RATE = +process.env.RATE_PER_MIN || 20;
const MAX_BODY = 8 * 1024 * 1024;           // 8 MB (fotos ya reducidas por el cliente)
const MAX_MESSAGES = 20, MAX_TEXT = 12000, MAX_IMAGES = 4;
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };

const hits = new Map();                      // ip -> [timestamps]
function limited(ip) {
  const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 60000);
  a.push(now); hits.set(ip, a);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some(t => now - t < 60000)) hits.delete(k);
  return a.length > RATE;
}
const send = (res, code, obj, extra = {}) => { res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra }); res.end(JSON.stringify(obj)); };

function readBody(req) {
  return new Promise((ok, ko) => {
    let n = 0; const chunks = [];
    req.on("data", c => { n += c.length; if (n > MAX_BODY) { ko({ code: 413 }); req.destroy(); } else chunks.push(c); });
    req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
    req.on("error", () => ko({ code: 400 }));
  });
}

/* Valida y convierte lo que manda el cliente al formato de la API de Anthropic. */
function buildPayload(b) {
  if (!b || typeof b !== "object") throw { code: 400, msg: "Petición no válida." };
  const tier = b.tier === "quick" ? "quick" : "default";
  let msgs = Array.isArray(b.messages) ? b.messages : [];
  if (!msgs.length || msgs.length > MAX_MESSAGES) throw { code: 400, msg: "Mensajes no válidos." };
  let system = typeof b.system === "string" ? b.system.slice(0, MAX_TEXT) : undefined;
  let imgCount = 0;
  const messages = msgs.map(m => {
    const role = m.role === "assistant" ? "assistant" : "user";
    const content = [];
    if (role === "user" && Array.isArray(m.images)) for (const im of m.images) {
      if (++imgCount > MAX_IMAGES) throw { code: 400, msg: "Demasiadas imágenes." };
      if (!/^image\/(jpeg|png|webp|gif)$/.test(im.type) || typeof im.data !== "string" || !/^[A-Za-z0-9+/=]+$/.test(im.data)) throw { code: 400, msg: "Imagen no válida.", err: "image_rejected" };
      content.push({ type: "image", source: { type: "base64", media_type: im.type, data: im.data } });
    }
    const text = String(m.content ?? "").slice(0, MAX_TEXT);
    if (text) content.push({ type: "text", text });
    if (!content.length) throw { code: 400, msg: "Mensaje vacío." };
    return { role, content };
  });
  if (messages[0].role !== "user") throw { code: 400, msg: "El primer mensaje debe ser del usuario." };
  const body = { model: MODELS[tier], max_tokens: tier === "quick" ? 1500 : 3000, messages };
  if (system) body.system = system;
  return body;
}

async function handleAI(req, res) {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { error: "rate_limited" }, { "Retry-After": "30" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return send(res, 503, { error: "sampling_disabled", message: "Falta ANTHROPIC_API_KEY en el servidor." });
  let payload;
  try { payload = buildPayload(JSON.parse(await readBody(req))); }
  catch (e) { return send(res, e.code || 400, { error: e.err || "bad_request", message: e.msg || "Petición no válida." }); }
  try {
    const r = await fetch(API + "/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(60000) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { console.error("Anthropic", r.status, j.error && j.error.message); return send(res, r.status === 429 ? 429 : 502, { error: r.status === 429 ? "rate_limited" : "upstream_error" }); }
    const text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
    send(res, 200, { text });
  } catch (e) { console.error("Fallo de red con Anthropic:", e.message); send(res, 502, { error: "upstream_error" }); }
}

function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.resolve(ROOT, "." + p);
  const rel = path.relative(ROOT, file);
  // Solo se publica la web: nada de server/, ni archivos ocultos, ni fuera de la carpeta.
  if (rel.startsWith("..") || path.isAbsolute(rel) || /^(server|node_modules)([\\/]|$)/.test(rel) || rel.split(path.sep).some(s => s.startsWith("."))) { res.writeHead(404); return res.end("No encontrado"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("No encontrado"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "X-Content-Type-Options": "nosniff" });
    res.end(data);
  });
}

http.createServer((req, res) => {
  const origin = process.env.ALLOWED_ORIGIN;
  if (origin) { res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Access-Control-Allow-Headers", "content-type"); res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS"); }
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, "http://x").pathname;
  if (url === "/api/health" && req.method === "GET") return send(res, 200, { ok: true, ai: !!process.env.ANTHROPIC_API_KEY, images: true });
  if (url === "/api/ai" && req.method === "POST") return handleAI(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => console.log(`NutriDiario en http://localhost:${PORT}  (IA: ${process.env.ANTHROPIC_API_KEY ? "activada" : "desactivada, falta ANTHROPIC_API_KEY"})`));
