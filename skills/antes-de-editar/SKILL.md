---
name: antes-de-editar
description: Reconocimiento obligatorio antes de tocar código - leer, buscar usos, trazar el flujo y decidir el alcance de pruebas. Usar al recibir una tarea o un brief, antes de editar cualquier archivo.
---

# Antes de editar

Recibiste una tarea o un brief. **No edites nada todavía.** Haz el reconocimiento y repórtalo:

1. Lee `docs/estado.md` y el brief completo. Lee completos los archivos que tocarías (los grandes, por partes) y lista cuáles son.
2. Busca con `grep` todos los usos de lo que cambiarías (funciones, rutas, tablas, campos, componentes, tipos) en el código y en las pruebas. Lista los llamadores.
3. Traza el flujo de punta a punta: entrada (ruta o pantalla) → validación → lógica → datos → respuesta → pantalla siguiente.
4. Lista las pruebas que ya cubren eso y cuáles cambiarían de significado.
5. Busca si ya existe una función, servicio o componente que haga lo mismo: se reutiliza, no se reescribe.
6. Decide el **alcance de pruebas** con la tabla de `AGENTS.md` («Qué pruebas correr según el cambio»): nada, solo el módulo o suite completa. Si los usos del paso 2 cruzan a otro módulo, es transversal.
7. Revisa las «Zonas delicadas» de `AGENTS.md`. Si la tarea toca una y el brief no lo prevé, detente y pregunta.
8. Lista tus suposiciones y dudas abiertas.

Termina con un plan de 3 a 8 pasos, el alcance de pruebas elegido y lo que **no** vas a tocar. Si hay dudas abiertas, espera el visto bueno.
