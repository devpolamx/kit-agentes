---
name: traspaso
description: Cierra la sesión para que otro agente continúe sin adivinar - verificación, bitácora, docs/estado.md y revisión del tope de la bitácora. Usar al terminar una tarea o cuando se acaba la ventana de uso.
---

# Traspaso

Deja el trabajo listo para que otra IA (o la auditoría de Claude) continúe sin adivinar.

1. Corre `verificar` con el alcance que corresponde. Anota las cifras reales.
2. Si dejaste algo a medias, termínalo de forma segura o revierte **solo tus** cambios a medias (nunca los de otras sesiones) y avísalo.
3. Agrega una entrada **arriba** en `docs/bitacora-ia.md` (debajo de `---`), firmada con tu nombre, de máximo ~15 líneas:
   `## AAAA-MM-DD · quién · tema` y **Hecho** · **Verificado** (alcance de pruebas y por qué, cifras reales, lo que NO se comprobó) · **Falta** (solo el siguiente paso) · **No asumir** · **Ponytail** (qué se reutilizó, qué se evitó y el techo del atajo).
4. Actualiza `docs/estado.md`: quita lo terminado, agrega lo nuevo, cambia la fecha. Sin historia.
5. Lo que descubriste fuera de tu tarea va a las listas largas (`docs/pendientes.md`, `docs/deuda-tecnica.md`); no lo implementes.
6. Si cambiaste la estructura o una decisión, actualiza `docs/arquitectura.md`.
7. `node scripts/bitacora.mjs check` (o `python scripts/bitacora.py check`). Si avisa: lleva a `docs/estado.md` lo vigente de las entradas viejas y corre el mismo comando con `archive`.
8. Responde con un resumen de **5 líneas máximo**: qué quedó, qué falta y el primer paso de la siguiente sesión. **Detente**: no abras la siguiente tarea.

No hagas `commit` ni `push` salvo que el dueño lo pida.
