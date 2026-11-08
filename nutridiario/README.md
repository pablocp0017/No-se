# NutriDiario

App web de nutrición: diario de comidas, plan semanal, progreso, ayuno intermitente y coach. Sin dependencias de build: HTML, CSS y JavaScript puro.

## Cómo ejecutarla

```bash
cd nutridiario
python3 -m http.server 8000      # solo web, sin IA fuera de claude.ai
# o, con IA propia:
ANTHROPIC_API_KEY=sk-ant-... node server/server.js
# abre http://localhost:8000
```

Los datos se guardan en `localStorage` del navegador (clave `nutridiario_v1`).

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura de la página y carga de scripts, en orden |
| `css/styles.css` | Estilos, con tokens de color claro y oscuro |
| `js/utils.js` | Helpers de fechas, formato y escape de HTML |
| `js/state.js` | Estado `S` (persistido), estado de interfaz `ui` y guardado |
| `js/data.js` | Base inicial de ~60 alimentos (por 100 g) y funciones de alimentos |
| `js/data-extra.js` | Ampliación de la base (~270 alimentos más, platos y productos habituales en España) |
| `js/calc.js` | Metas de calorías y macros, puntuación, alertas, ritmo de peso, ayuno |
| `js/ai.js` | Conexión con Claude (`sample`) y estimación de nutrientes |
| `js/actions-data.js` | Altas y bajas de datos, toasts y descarga de archivos |
| `js/components.js` | Anillos, medidores y gráficas SVG |
| `js/views.js` | Vistas: Hoy, Registrar, Plan, Progreso, Ayuno, Coach, Más |
| `js/render.js` | Render principal, reloj y temporizadores |
| `js/events.js` | Acciones (`A`), formularios (`FORMS`) y delegación de eventos |
| `js/coach.js` | Chat con el coach |
| `js/views-goals.js` | Pestaña Objetivos: objetivos con acciones semanales, retos y resumen en Hoy |
| `js/goals.js` | Acciones y formularios de objetivos y retos |
| `server/server.js` | Servidor sin dependencias: sirve la web y hace de proxy con la API de Anthropic |
| `js/files.js` | Fotos de progreso, importación de actividad y copias |
| `js/boot.js` | Arranque |

Los scripts son clásicos (no módulos) y comparten ámbito global, así que el orden de `index.html` importa.

## Funciones de IA

Hay dos modos, con la misma interfaz interna (`SAMPLE(input, opts)` y `SAMPLE.json(input, opts)`):

- **Dentro de claude.ai**: la página recibe `window.claude` y la IA funciona con la cuenta de quien la abre.
- **Servidor propio**: `node server/server.js` sirve la web y expone `POST /api/ai` y `GET /api/health`. La clave `ANTHROPIC_API_KEY` solo vive en el servidor, nunca en el navegador. El cliente detecta `/api/health` y activa la IA; si no hay clave, oculta esas funciones y avisa.

### IA local y gratuita con Ollama

Sin clave de pago y sin salir de tu ordenador:

```bash
ollama pull llama3.2 && ollama pull llama3.2-vision
node server/server.js
```

Si no hay `ANTHROPIC_API_KEY`, el servidor usa Ollama (`AI_PROVIDER=ollama|anthropic` lo fuerza). Variables: `OLLAMA_URL`, `OLLAMA_MODEL`, `OLLAMA_VISION_MODEL`. Los modelos locales son menos precisos que Claude, sobre todo con fotos y en JSON: revisa siempre los valores.

Si no hay ni `window.claude` ni servidor, la IA se desactiva y todo lo manual sigue funcionando.

Variables del servidor: `PORT` (8000), `MODEL_QUICK` (`claude-haiku-5-5`), `MODEL_DEFAULT` (`claude-sonnet-5-5`), `RATE_PER_MIN` (20 por IP), `ALLOWED_ORIGIN` (CORS, si la web está en otro dominio; en ese caso define `window.NUTRI_API = "https://tu-servidor"` antes de cargar `js/ai.js`).

El servidor valida el cuerpo (tamaño, nº de mensajes e imágenes, tipos de imagen), limita peticiones por IP y solo publica la web (no `server/` ni archivos ocultos). Para exponerlo a internet, ponlo detrás de HTTPS y de un proxy inverso. Con respuestas largas no hay streaming: el coach muestra el texto al terminar.

## Objetivos y retos

- **Objetivos**: título, motivo, meta medible (peso, o días por semana cumpliendo un hábito que se mide solo con el diario), fecha límite y **acciones operativas** con frecuencia semanal que se marcan cada día. Hay plantillas y un botón para pedir acciones a la IA. Las acciones de hoy salen también en la pestaña Hoy.
- **Retos**: 7, 14, 21 o 30 días, se marcan solos con lo registrado; muestran racha, mejor racha y medalla al terminar.

## Límites conocidos

- La base de alimentos (~330) es aproximada; para productos concretos usa Crear con IA o Mis alimentos.
- No hay sincronización con Apple Health, Garmin, etc. Solo importación de CSV/JSON.
- Retos y objetivos son personales; no hay equipos con chat.
- Los recordatorios y el fin de ayuno solo avisan con la página abierta.
