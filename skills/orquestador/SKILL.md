---
name: orquestador
description: Para Claude como orquestador. Usar al planear una tarea o fase, escribir un brief para Gemini, Codex o Copilot, auditar lo que entregó un ejecutor, decidir si se corrige o se pide un ajuste, o avanzar al siguiente paso.
---

# Orquestador

Claude **planea y audita**; Gemini, Codex y Copilot **ejecutan** un brief. El reparto está en «Quién hace qué» de `AGENTS.md`. Esta skill es el procedimiento.

## A. Planear: escribir un brief

1. Lee `docs/estado.md`, las 3 a 5 entradas de arriba de `docs/bitacora-ia.md`, `docs/arquitectura.md` y las listas largas (`docs/pendientes.md`, `docs/deuda-tecnica.md`) por si algo bloquea o se puede pagar de paso.
2. Verifica contra el código **todo lo que el brief va a citar** (funciones, rutas, tablas, componentes). Un brief con nombres inventados hace que el ejecutor invente también.
3. Escribe el brief en `docs/AAMMDDHHMM-titulo.md` (o la convención del proyecto) con:
   - **Contexto**: qué existe hoy y por qué se hace esto.
   - **Tareas en orden**, cada una con los archivos concretos, **su alcance de pruebas** (nada / solo el módulo / suite completa, según la tabla de `AGENTS.md`) y la prueba que debe pasar.
   - **Fuera de alcance**: lo que no se toca.
   - **Cuándo detenerse y preguntar.**
4. Un brief = un paso. Si pasa de ~6 tareas o toca dos zonas delicadas, pártelo y pide al ejecutor que se detenga entre partes.
5. Las decisiones de producto que no estén escritas se le preguntan al dueño **antes** de escribir el brief; no se delegan.
6. Anota el brief en «En curso» de `docs/estado.md`, con quién lo tiene.

## B. Auditar una entrega

No te fíes de lo que dice el ejecutor: compruébalo.

1. **Lee** el brief y la entrada de bitácora del ejecutor. ¿Lo que declaran coincide con el código?
2. **Alcance:** `git status` y `git diff --stat`. ¿Se tocó algo de «Fuera de alcance»? ¿Archivos sin relación? ¿Una migración ya desplegada editada?
3. **Verificación propia** con la tabla de pruebas de `AGENTS.md` (no copies las cifras del informe). Cita las salidas reales.
4. **Revisión de código:** si hay subagentes revisores (`code-reviewer`, `security-reviewer`), lánzalos sobre el diff y contrasta lo que encuentren con el código; descarta lo que no resista la lectura.
5. **Reglas del proyecto:** recorre las «Reglas de negocio», «Zonas delicadas» y «Trampas conocidas» de `AGENTS.md` contra el diff.
6. Lo que el ejecutor haya descubierto fuera de su tarea debe estar en las listas largas; si falta algo que tú ves, agrégalo.

### Veredicto (en tu entrada de bitácora)

| Veredicto | Cuándo | Qué haces |
|---|---|---|
| **Aprobado** | Cumple el brief, tu verificación en verde, sin hallazgos. | Actualiza `docs/estado.md` y escribe el siguiente brief si lo hay. |
| **Aprobado con correcciones menores** | Hallazgos que **no** tocan zonas delicadas, base de datos ni seguridad, y caben en pocas ediciones (un texto, un nombre, una prueba que falta). | Corrígelos tú, vuelve a verificar, anótalos y aprueba. |
| **Rechazado** | Hallazgo en una zona delicada, regla de negocio mal hecha, pruebas que no prueban lo que dicen, alcance excedido o demasiado para parchar. | **No parches.** Escribe un brief de ajustes: cada hallazgo con `archivo:línea`, qué falla, por qué importa y la prueba que debe pasar. Al volver, audita solo lo pedido. |

Dos rechazos seguidos del mismo paso: detente y pregunta al dueño si el brief estaba mal planteado.

## C. Avanzar

- Paso aprobado: `docs/estado.md` al día y siguiente brief.
- Antes de pasar a producción: la suite completa una vez y lo que pida «Ramas y entrega» de `AGENTS.md`.
- No hagas `commit` ni `push` salvo que el dueño lo pida en ese momento.
