<!-- metodologia-comun:inicio · v2026-11-13d · igual en todos los proyectos; no se edita aquí: se cambia en github.com/devpolamx/kit-agentes y se trae con `npx github:devpolamx/kit-agentes actualizar` -->
## Metodología común (todos los agentes)

Este archivo es la **única fuente de reglas** del proyecto. `CLAUDE.md` y `GEMINI.md` lo importan y `.github/copilot-instructions.md` apunta aquí: una regla nueva se escribe **solo aquí**, nunca en copias.

### Quién hace qué
- **Claude Code orquesta** con el dueño: planea, decide, escribe los briefs, revisa lo que entregan los demás y mantiene `docs/estado.md` al día.
- **Gemini, Codex, Copilot u otros ejecutan** tareas acotadas, normalmente de un brief. Hacen solo lo que pide; si algo no está claro o cae en una zona delicada, se detienen y preguntan.
- Si quien orquesta no está disponible, **cualquiera continúa**: todo el contexto vive en `docs/estado.md`, la bitácora y los briefs. Lo que no está escrito ahí no existe para el siguiente.

### Archivos de continuidad
| Archivo | Para qué | Cómo se escribe |
|---|---|---|
| `docs/estado.md` | Dónde estamos: en curso, siguiente, decisiones pendientes del dueño, no asumir | Se **reescribe**; corto (~80 líneas), sin historia |
| `docs/bitacora-ia.md` | Qué se hizo, sesión por sesión; lo más reciente arriba | Se **agrega** una entrada al terminar; tope 60 KB |
| `docs/bitacora/AAAA-MM.md` | Entradas viejas, archivadas tal cual | Solo con el comando de archivar |
| Briefs en `docs/` | Qué se le pidió a un agente | Se conservan, nunca se borran. Nombre `AAMMDDHHMM-titulo.md`, salvo que este proyecto diga otra cosa abajo |
| `docs/arquitectura.md` | Mapa del proyecto y decisiones vigentes | Se actualiza en la misma sesión si cambia la estructura o una decisión |

### Al empezar una sesión
1. Lee `docs/estado.md` y las **3 a 5 entradas de arriba** de `docs/bitacora-ia.md`. No leas la bitácora completa ni `docs/bitacora/`, salvo que busques algo puntual.
2. Si te dieron un brief, léelo completo. Lee `docs/arquitectura.md` si no conoces el módulo. No leas todo el proyecto: entra solo a lo que vas a tocar.
3. `git branch --show-current` (debe ser la rama de trabajo de este proyecto) y `git status`. Puede haber cambios sin commit de otras sesiones: **no los reviertas ni los «limpies»**.
4. Si el cambio lo amerita, corre la línea base de pruebas. Si ya falla antes de que toques algo, **dilo** y no lo arregles a escondidas.

### Antes de editar
- Lee completo el archivo que vas a cambiar (los grandes, por partes) y busca con `grep` todos sus usos.
- Traza el flujo de punta a punta (entrada → lógica → datos → salida) y lee las pruebas que ya lo cubren.
- Busca si ya existe un componente, helper o servicio que lo haga: se reutiliza, no se reescribe.
- Zona delicada o decisión no escrita (dinero, permisos, datos personales, textos legales, precios, borrado o migración de datos, algo que no se puede deshacer) → **detente y pregunta**. No inventes datos.

### Cómo trabajar
- Resume en 3 a 5 líneas qué vas a cambiar y qué **no** vas a tocar.
- **Ponytail:** la mejor línea es la que no se escribe. ¿Hace falta? → ¿ya existe aquí? → ¿lo da el lenguaje o el framework? → ¿una dependencia ya instalada? → mínimo código. Arreglos en la causa raíz, sin abstracciones ni dependencias que nadie pidió. **Nunca** recortes validación, autorización, seguridad ni accesibilidad.
- Con lógica (reglas, permisos, cálculos, estados): primero la prueba, comprueba que falla por la razón correcta y luego implementa.
- Un problema fuera de tu tarea se **reporta**, no se arregla en silencio ni se mezcla.
- Las skills de terceros son guías generales: **si una contradice este archivo** (herramientas, comandos, estructura, estilo), **manda este archivo** y las skills propias del proyecto.
- No instales dependencias ni hagas `commit` o `push` salvo que el dueño o el brief lo pidan (las excepciones de este proyecto están abajo).
- **Codificación:** UTF-8 sin BOM y finales LF. En Windows no escribas archivos con `>`, `Out-File` ni `Set-Content` de PowerShell 5.1: usa la herramienta de edición. No reescribas archivos enteros solo para «normalizar».

### Qué pruebas correr según el cambio
La suite completa es cara (minutos y créditos): **se corre solo cuando el cambio puede afectar a otros módulos**. Antes de decidir, busca los usos con `grep`. Los comandos exactos están en la sección de verificación de este proyecto.

| Qué cambiaste | Qué corres |
|---|---|
| Solo documentación: bitácora, `estado.md`, briefs, `.md`, comentarios | **Nada.** |
| Interfaz sin lógica: texto de un botón, una etiqueta, clases o estilos de una sola pantalla | Tipos y compilación del frontend (si los hay). **Sin** pruebas de backend. |
| Lógica dentro de un solo módulo: su vista, controlador, servicio o validación | **Solo las pruebas de ese módulo** (filtro por nombre o carpeta). |
| **Transversal:** base de datos (migraciones, modelos o tablas compartidas), permisos, autenticación, multiempresa, middleware, rutas o configuración compartidas, dependencias, dinero o facturación, componentes o helpers que usan varias pantallas | Pruebas del módulo y luego **la suite completa, una vez**. |
| Duda sobre el alcance | Si los usos cruzan a otro módulo, suite completa. Si no, solo el módulo. |

- La suite completa se corre **una vez al final**, no tras cada ajuste, y nunca dos a la vez (suelen compartir la base de pruebas).
- Cada tarea de un brief dice su alcance de pruebas. En la bitácora, «Verificado» dice qué alcance elegiste y por qué (p. ej. «solo texto: sin pruebas» o «toca permisos: suite completa»).

### Definición de «hecho»
- Corriste las pruebas que tocan según la tabla de arriba y citas la salida real. No borras ni debilitas pruebas para que pasen.
- Hay pruebas para la lógica nueva o cambiada, incluidos los casos de error.
- Si tocaste interfaz, la viste en móvil (375 px), claro y oscuro; si no pudiste, escribe «no verificado en navegador».
- Nunca «debería funcionar»: lo que no comprobaste se dice tal cual. Si te equivocaste o una suposición resultó falsa, dilo directo.

### Al terminar una sesión (obligatorio, aunque el cambio sea pequeño y nadie lo pida)
1. Entrada **arriba** en `docs/bitacora-ia.md` (debajo de `---`), firmada con tu nombre, máximo ~15 líneas (el detalle va en el brief o en el commit):
   `## AAAA-MM-DD · quién · tema` y las viñetas **Hecho / Verificado (con el alcance de pruebas y por qué) / Falta / No asumir / Ponytail**.
2. Actualiza `docs/estado.md`: quita lo terminado, agrega lo nuevo, cambia la fecha. No le pegues historia.
3. Corre `node scripts/bitacora.mjs check` (en proyectos Python: `python scripts/bitacora.py check`). Si pasa del tope: primero lleva a `docs/estado.md` los «Falta» y «No asumir» que sigan vigentes en las entradas viejas, y luego el mismo comando con `archive` (mueve las viejas a `docs/bitacora/AAAA-MM.md`, no borra nada).
4. Si se acaba tu ventana de uso a media tarea: deja todo continuable (nada roto sin avisar) y haz los pasos 1 y 2 antes que cualquier otra cosa.
<!-- metodologia-comun:fin -->
