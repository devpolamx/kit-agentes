# kit-agentes

Organiza cualquier proyecto para trabajar con **varios agentes de IA a la vez**: Claude Code orquesta, y Gemini, Codex y Copilot ejecutan. Si uno no está disponible, cualquier otro sabe en qué va el proyecto y puede continuar.

No es una base de datos de memoria ni un servicio: son archivos Markdown dentro del repositorio, un script de ~130 líneas sin dependencias y unas skills. Todos los agentes ya saben leer archivos, así que todos ven lo mismo.

## Para qué sirve

Cuando trabajas con varios agentes aparecen tres problemas:

1. **Reglas copiadas que ya no coinciden.** `CLAUDE.md`, `AGENTS.md` y `GEMINI.md` empiezan iguales y en una semana ya dicen cosas distintas. Cada agente trabaja con reglas diferentes.
2. **Nadie sabe en qué vamos.** El que continúa tiene que leer una bitácora de cientos de KB o adivinar.
3. **Pruebas de más.** Un agente corre la suite completa (minutos y créditos) por cambiar el texto de un botón o escribir en la bitácora.

El kit lo resuelve así:

| Archivo | Para qué |
|---|---|
| `AGENTS.md` | **Única fuente de reglas.** Codex y Copilot lo leen directo; Claude y Gemini lo importan. Trae el bloque **«Metodología común»** (igual en todos tus proyectos) y abajo las reglas propias del proyecto. |
| `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` | Solo importan o apuntan a `AGENTS.md`, más lo exclusivo de cada agente. |
| `docs/estado.md` | **Dónde estamos hoy**: en curso, siguiente, decisiones pendientes, qué no asumir. Se reescribe, no crece. |
| `docs/bitacora-ia.md` | Qué se hizo, sesión por sesión. Tope de 60 KB. |
| `docs/bitacora/AAAA-MM.md` | Entradas viejas, archivadas tal cual por el script. |
| `docs/arquitectura.md` | Mapa del proyecto y decisiones vigentes. |
| `scripts/bitacora.mjs` (o `.py`) | `check` avisa si la bitácora pasa del tope; `archive` mueve lo viejo sin borrar nada. |
| `.agents/skills/` y `.claude/skills/` | Skills del kit: `organizar-proyecto-ia`, `orquestador`, `antes-de-editar`, `verificar`, `traspaso` y `mx-privacy-compliance` (aviso de privacidad y de cookies conforme a la LFPDPPP para sitios y apps dirigidos a México). |
| `.gemini/commands/` | `/antes-de-editar`, `/verificar` y `/traspaso` para Gemini. |

La «Metodología común» incluye una tabla de **qué pruebas correr según el cambio**: nada (solo documentación), solo tipos y compilación (interfaz sin lógica), solo el módulo (lógica de un módulo) o la suite completa una vez (cambios transversales: base de datos, permisos, middleware, dinero, componentes compartidos).

## Cómo instalarlo

Necesitas Node 20 o más. No hace falta instalar nada antes ni tener cuenta de npm. Desde la carpeta del proyecto:

```bash
npx github:devpolamx/kit-agentes instalar --stack laravel-react
```

La primera vez, npx pregunta `Ok to proceed? (y)`: responde `y`.

| Opción | Qué hace |
|---|---|
| `--stack laravel-react` \| `astro` \| `django` \| `ninguno` | Qué paquete de skills de terceros instalar. Si no lo das, se adivina (`artisan` → Laravel, `astro.config.*` → Astro, `manage.py` → Django). |
| `--nombre "Mi proyecto"` | Nombre para los encabezados. Por omisión, el de la carpeta. |
| `--dir ruta` | Carpeta del proyecto. Por omisión, la actual. |
| `--sin-terceros` | No instala skills de terceros (solo muestra los comandos). |
| `--ensayo` | Solo muestra lo que haría, sin escribir nada. |

Después abre Claude Code en el proyecto y pide:

> Revisa AGENTS.md y docs/estado.md con la skill organizar-proyecto-ia.

Claude llena las secciones propias del proyecto (comandos, reglas de negocio, zonas delicadas…) preguntándote lo que no esté escrito.

### Proyectos que ya existen

Es seguro correrlo en un proyecto con reglas propias: **crea lo que falta y no toca lo que ya escribiste** (estado, bitácora, `CLAUDE.md`, `GEMINI.md`). Tampoco pisa una skill propia del proyecto que se llame igual que una del kit. Si tu `AGENTS.md` todavía no tiene el bloque de metodología, te avisa. Entonces pide a Claude: «alinea este proyecto con la skill organizar-proyecto-ia». Junta las reglas repetidas en `AGENTS.md` sin borrar ninguna.

### Actualizar

Cuando el kit mejore, en cada proyecto:

```bash
npx github:devpolamx/kit-agentes actualizar
```

Solo reemplaza lo que es del kit: el bloque entre `<!-- metodologia-comun:inicio` y `<!-- metodologia-comun:fin -->` de `AGENTS.md` y las skills propias del kit.

## Skills de terceros

Las skills de otros autores **no se copian a este repositorio**: `paquetes.json` dice cuáles van en cada paquete y de dónde salen, y el instalador las baja de su fuente con [`npx skills add`](https://github.com/vercel-labs/skills). Así siempre tienes la versión del autor y su licencia.

| Paquete | Incluye |
|---|---|
| `comun` (siempre) | ponytail (`ponytail`, `-review`, `-audit`, `-debt`), `writing-for-interfaces`, `security-review`, `verification-loop` |
| `laravel-react` | Laravel (patrones, seguridad, TDD, verificación, migraciones, especialista, PHP), React (incluye las de Vercel), TypeScript, Tailwind v4 / shadcn, Vite, diseño de interfaz, accesibilidad |
| `astro` | SEO, accesibilidad, diseño de interfaz, Vite, TypeScript, Node |
| `django` | Seguridad, TDD con pytest-django y factory_boy, Celery y migraciones seguras (everything-claude-code); antipatrones de Python, diseño de tablas en PostgreSQL y `uv` (wshobson/agents) |

Si una skill de terceros choca con `AGENTS.md` (por ejemplo, recomienda `black` y el proyecto usa `ruff`), manda `AGENTS.md`: la metodología común lo dice.

Las que están en `_fuente_por_confirmar` se usan en algunos proyectos, pero todavía no se confirma de qué repositorio salen; no se instalan solas.

## Flujo de trabajo

1. **Claude Code (orquestador)** lee `docs/estado.md`, escribe un brief en `docs/AAMMDDHHMM-titulo.md` (con el alcance de pruebas de cada tarea) y lo anota en «En curso».
2. **Gemini, Codex o Copilot (ejecutor)** lee `AGENTS.md`, `docs/estado.md` y el brief; corre `antes-de-editar`, implementa, corre `verificar` y cierra con `traspaso` (bitácora + estado).
3. **Claude** audita con la skill `orquestador`: aprueba, corrige lo menor o escribe un brief de ajustes.
4. Si Claude no está, cualquiera continúa desde `docs/estado.md`.

## Licencia

MIT para lo que es de este repositorio. Las skills de terceros conservan la licencia de su autor.
