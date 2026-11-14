# Bitácora de sesiones entre IA

Lo más reciente va **arriba**, debajo de la línea `---`. Quien termine una sesión (Claude, Gemini, Codex, Copilot u otro) agrega su entrada, aunque el cambio sea pequeño. Reglas completas: «Metodología común» en `AGENTS.md`.

- **Dónde estamos hoy:** `docs/estado.md` (léelo primero; esta bitácora es la historia).
- Lee solo las 3 a 5 entradas de arriba. Las viejas están en `docs/bitacora/AAAA-MM.md`.
- **Tope: 60 KB.** `node scripts/bitacora.mjs check` avisa; `node scripts/bitacora.mjs archive` mueve lo viejo sin borrar nada.

Formato (máximo ~15 líneas por entrada; el detalle va en el brief o en el commit). Las entradas antiguas pueden no traer todos los campos.

```
## AAAA-MM-DD · quién (Claude / Gemini / Codex / Copilot) · tema
- **Hecho:** qué cambió (archivos clave).
- **Verificado:** alcance de pruebas elegido y por qué (solo texto: nada; un módulo: sus pruebas; transversal: suite completa), comandos y resultado real; lo que NO se pudo comprobar.
- **Falta:** siguiente paso concreto.
- **No asumir:** lo que parece resuelto y no lo está, decisiones abiertas.
- **Ponytail:** qué se reutilizó, qué se dejó fuera a propósito y el techo del atajo («Nada» si no hubo).
```

---
