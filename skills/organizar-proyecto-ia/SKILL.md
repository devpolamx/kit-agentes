---
name: organizar-proyecto-ia
description: Organiza un proyecto, nuevo o existente, para trabajar con varios agentes (Claude Code orquesta; Gemini, Codex y Copilot ejecutan) con AGENTS.md como única fuente de reglas, docs/estado.md, bitácora con tope y briefs. Úsala al crear un proyecto, al alinear uno existente o cuando el dueño pida organizarlo «como los demás».
metadata:
  origen: kit-agentes
---

# Organizar un proyecto para varios agentes

**Objetivo:** que cualquier agente sepa qué reglas seguir, **dónde estamos** y qué sigue, y pueda continuar aunque quien estaba no esté disponible. Todo en Markdown dentro del repositorio: sin bases de datos de memoria ni servicios.

Todo sale del kit público **`devpolamx/kit-agentes`** (plantillas, scripts y las skills `orquestador`, `antes-de-editar`, `verificar`, `traspaso` y `mx-privacy-compliance`). Desde la carpeta del proyecto:

```
npx github:devpolamx/kit-agentes instalar --stack laravel-react   # o laravel-blade, astro, django, ninguno
```

Crea lo que falta, actualiza el bloque «Metodología común» y las skills del kit, y no toca lo que ya escribió el dueño. Esta skill es para lo que el instalador no puede hacer solo: llenar `AGENTS.md` con lo propio del proyecto y alinear proyectos que ya tenían reglas.

## La estructura

```
AGENTS.md                         ← ÚNICA fuente de reglas (Codex y Copilot lo leen directo)
CLAUDE.md                         ← "@AGENTS.md" + lo exclusivo de Claude (orquestador)
GEMINI.md                         ← "@./AGENTS.md" + lo exclusivo de Gemini
.github/copilot-instructions.md   ← puerta de entrada corta que apunta a AGENTS.md
docs/estado.md                    ← dónde estamos HOY (se reescribe)
docs/bitacora-ia.md               ← historia reciente (se agrega; tope 60 KB)
docs/bitacora/AAAA-MM.md          ← entradas archivadas por el script
docs/arquitectura.md              ← mapa y decisiones vigentes
docs/AAMMDDHHMM-titulo.md         ← briefs para agentes (se conservan, nunca se borran)
docs/pendientes.md, deuda-tecnica.md (opcionales) ← listas largas
scripts/bitacora.mjs (o .py)      ← check y archive de la bitácora
.agents/skills/                   ← skills compartidas (en Claude, enlazadas desde .claude/skills)
```

Tres reglas que sostienen todo:
1. **Una regla se escribe una sola vez, en `AGENTS.md`.** Nunca copias de `CLAUDE.md` ↔ `AGENTS.md`: en días ya no coinciden y un agente trabaja con reglas viejas.
2. **El estado de las tareas no va en archivos de reglas.** Una «tarea en curso» en `GEMINI.md` se queda vieja y el agente retoma algo terminado.
3. **`estado.md` se reescribe; la bitácora se agrega; lo viejo se archiva con el script**, no a mano y sin borrar.

## Orden de `AGENTS.md`
Plantilla: `plantillas/agents-proyecto.md` del kit.
1. Título y 2 o 3 líneas: qué es, para quién, stack.
2. Línea de entrada: mapa (`docs/arquitectura.md`), **dónde estamos** (`docs/estado.md`) e historia (`docs/bitacora-ia.md`).
3. El bloque **«Metodología común»**: `plantillas/metodologia.md` tal cual, con sus marcadores. Es igual en todos los proyectos.
4. Lo propio del proyecto: comandos; verificación según el cambio; reglas de negocio ya decididas; convenciones; zonas delicadas; voz de la interfaz; trampas conocidas; ramas y quién hace commit; convención de briefs si es distinta.

## Proyecto nuevo
1. Corre el instalador del kit (arriba). Deja creada la estructura con plantillas.
2. Pregunta al dueño lo que no esté escrito: qué es y para quién, stack, comandos de prueba y compilación, rama de trabajo, quién hace commit, zonas delicadas y quién lee la interfaz. No lo inventes.
3. Llena en `AGENTS.md` las secciones del proyecto (debajo del bloque de metodología): comandos, verificación, reglas de negocio, convenciones, zonas delicadas, voz, trampas, ramas.
4. Llena `docs/arquitectura.md` con lo que ya se sepa y deja el primer `docs/estado.md` real.
5. Sin el instalador (sin red): copia a mano `plantillas/` y `scripts/` del kit; con Node, agrega a `package.json` `"bitacora:check"` y `"bitacora:archivar"`.
6. Verifica: `node scripts/bitacora.mjs check` en verde; ninguna regla repetida fuera de `AGENTS.md`; archivos en UTF-8 sin BOM y LF.

## Alinear un proyecto existente
1. Lee `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.gemini/commands/*` y la cabecera de la bitácora. Compáralos con `diff`: busca reglas que estén en uno y no en los otros.
2. Toma la versión más completa como base de `AGENTS.md` y mueve ahí lo que solo exista en los demás. **No borres reglas.** Si dos chocan, gana la más reciente con fecha («regla del dueño, AAAA-MM-DD»); si no hay fecha, pregunta.
3. Inserta (o actualiza) el bloque «Metodología común» y quita del resto del archivo las viñetas que lo repiten (p. ej. «Todo cambio se anota»).
4. Reduce `CLAUDE.md`, `GEMINI.md` y copilot a sus plantillas más lo exclusivo de cada agente. Lo que sea «tarea en curso» u «orden de trabajo» va a `docs/estado.md`.
5. Donde algo cite `CLAUDE.md` como fuente de reglas (`.gemini/commands`, `.claude/agents`, `.codex/agents`), cámbialo por `AGENTS.md`. En el comando o skill de traspaso agrega: actualizar `docs/estado.md` y correr el check.
6. Escribe `docs/estado.md` con los «Falta», «No asumir» y decisiones pendientes de las entradas recientes de la bitácora. Di que se reconstruyó y que el dueño lo confirme.
7. Cambia la cabecera de la bitácora por la plantilla (las entradas se conservan), agrega tu entrada y corre el check; si pasa del tope, `archive`.
8. Verifica: entradas antes = bitácora + archivo, sin duplicados; codificación; `package.json` solo con las dos líneas nuevas (`diff` contra `git show HEAD:package.json`).
9. No hagas commit salvo que el dueño lo pida.

## Si el proyecto ya tiene un sistema equivalente
Si ya tiene un plan único de fases y pendientes (como `docs/plan-implementacion.md` en ToCheckin) y su propia skill de traspaso, no dupliques: ese plan hace de `estado.md`. Solo agrega el script de la bitácora (ajusta `CARPETA` y `ESTADO` arriba del archivo) y el paso del check en el traspaso.

## Cambiar la metodología común en todos los proyectos
Edita `plantillas/metodologia.md` en el repo del kit, sube la versión del marcador (`vAAAA-MM-DD`) y publica. Luego, en cada proyecto: `npx github:devpolamx/kit-agentes actualizar`. Reemplaza el bloque entre `<!-- metodologia-comun:inicio` y `<!-- metodologia-comun:fin -->` y las skills del kit; no toca nada más.

## El script de la bitácora
- `check`: falla si `docs/bitacora-ia.md` pasa de 60 KB.
- `archive [--dry-run]`: deja arriba las entradas más recientes (hasta 30 KB, mínimo 5) y mueve las demás, tal cual, a `docs/bitacora/AAAA-MM.md` (lo más reciente arriba). Nunca borra texto. Ignora el formato de ejemplo que esté dentro de un bloque de código.
- Antes de archivar, quien lo haga lleva a `docs/estado.md` lo que siga vigente de las entradas que se van.
