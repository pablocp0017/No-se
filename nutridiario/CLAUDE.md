# NutriDiario

App de nutrición en HTML, CSS y JS puros, sin build. Interfaz y textos en español.

## Reglas del proyecto
- Scripts clásicos que comparten ámbito global. Respeta el orden de `index.html`; una función puede usar otra de un archivo posterior solo si se llama después de cargar todo.
- El estado vive en `S` (se persiste con `save()`) y en `ui` (solo sesión). Tras cambiar `S`, llama a `save()` y a `render()`.
- Las vistas devuelven strings HTML. Todo texto del usuario pasa por `esc()`.
- Los eventos se delegan con `data-act` (objeto `A` en `js/events.js`) y `data-form` (objeto `FORMS`).
- Colores solo con las variables de `css/styles.css`; hay tema claro y oscuro.
- Las funciones de IA dependen de `window.claude` (capability `sample`). Deben degradar bien si es `null`.
- Valores nutricionales de la IA son estimaciones: se marcan como tales en la interfaz.

- `js/goals.js` extiende `A` y `FORMS` con `Object.assign`; `js/data-extra.js` extiende `BASE`.
- La IA fuera de claude.ai pasa por `server/server.js`. Nunca pongas la clave en el navegador.

## Pendiente de ideas
- Más alimentos y búsqueda por marca / código de barras real.
- Equipos y retos compartidos (necesitan almacenamiento común).
- Streaming de respuestas en el coach con el servidor propio.
