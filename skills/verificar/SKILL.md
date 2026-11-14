---
name: verificar
description: Corre las verificaciones que tocan según el cambio (nada, solo el módulo o suite completa) y reporta resultados reales. Usar antes de dar algo por terminado o de entregarlo a auditoría.
metadata:
  origen: kit-agentes
---

# Verificar

Reporta **solo resultados reales**. Los comandos exactos están en «Comandos» y en la sección de verificación de `AGENTS.md`.

1. **Elige el alcance** con la tabla «Qué pruebas correr según el cambio» de `AGENTS.md` y di por qué:
   - Solo documentación: nada; salta al paso 4.
   - Interfaz sin lógica: tipos y compilación del frontend.
   - Lógica de un módulo: solo sus pruebas.
   - Transversal (base de datos, permisos, middleware, dinero, componentes compartidos…): pruebas del módulo y luego la suite completa, **una vez**.
2. Estilo y tipos que el proyecto pida (linters, `tsc`, formateadores), solo sobre lo que tocaste si el proyecto lo permite.
3. Las pruebas del alcance elegido. Nunca corras dos suites a la vez.
4. `node scripts/bitacora.mjs check` (o `python scripts/bitacora.py check`) y `git status --short`.

Responde con:

- (a) El alcance elegido y por qué.
- (b) Tabla de comandos con su salida real.
- (c) Fallas con su causa probable.
- (d) Lo que **no** pudiste comprobar (navegador, móvil 375 px, modo oscuro, servicios externos).

Nunca digas «debería funcionar»: cita la salida.
