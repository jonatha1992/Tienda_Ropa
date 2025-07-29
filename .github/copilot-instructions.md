
# Reglas para Copilot (workspace)

1) Antes de actuar, leer en este orden: `README.md` → `docs/planning.md` (o issues) → `docs/tech-stack.md` → `docs/structure.md`.
2) Si falta alguno, crearlo con un esqueleto mínimo y confirmar.
3) Solo implementar/editar una feature o endpoint si está en `planning.md` (o issues); si no, agregarlo primero.
4) Tras cambios relevantes (feature/endpoint/config), **actualizar README** (sección API: ruta, método, ejemplos de request/response, errores).
5) **Frontend:** TypeScript estricto; lint con ESLint/Prettier; tests (Vitest) cuando corresponda.
6) **Backend:** Validación con Pydantic; tests con pytest (y/o requests a la API); seguir convenciones.
7) **Limpieza de código:** identificar y eliminar imports, funciones, tipos, módulos y archivos no usados.
   - Comprobar referencias en todo el workspace antes de borrar.
   - Si algo es parte de una API pública, marcar deprecado y planificar su remoción en `docs/planning.md`.
   - Si hay dudas, abrir PR explicando qué se elimina y por qué; actualizar `README`/`planning` si corresponde.

9) Cuando completes una tarea de `docs/planning.md`, muévela de la sección 'Tareas' a 'Hecho' y agrega la fecha de finalización. Ejemplo:
   - Tarea completada [29/07/2025]