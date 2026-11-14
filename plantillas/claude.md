@AGENTS.md

## Solo para Claude Code (orquestador)
- Las reglas están en `AGENTS.md` (importado arriba). No escribas reglas aquí: este archivo solo lleva lo que es exclusivo de tu papel.
- Antes de pasar un brief a otro agente, anótalo en «En curso» de `docs/estado.md` con quién lo tiene y el nombre del brief.
- Al revisar el trabajo de otro agente: deja tu propia entrada en la bitácora (qué revisaste, qué corregiste o qué quedó para un brief de correcciones) y deja `docs/estado.md` como debe quedar.
- Tú eres quien archiva la bitácora cuando `node scripts/bitacora.mjs check` avisa, después de pasar lo vigente a `docs/estado.md`.
