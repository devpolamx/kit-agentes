# __NOMBRE__

Qué es, para quién y en qué etapa está (2 o 3 líneas). Stack: … Base de datos: …

Mapa del proyecto: `docs/arquitectura.md`. **Dónde estamos:** `docs/estado.md`. Historia entre IA: `docs/bitacora-ia.md` (solo las entradas de arriba).

<!-- Aquí va, tal cual, el bloque de plantillas/metodologia.md (de «metodologia-comun:inicio» a «metodologia-comun:fin»). -->

## Comandos
- Desarrollo: …
- Pruebas: … (una sola área: …)
- Compilar / tipos / estilo: …

## Verificación según el cambio
- Solo documentación o bitácora: nada.
- Cambio chico en un área: sus pruebas.
- Migraciones, permisos, dinero, modelos o middleware compartidos: la suite completa. Duda de alcance = suite completa.

## Reglas de negocio ya decididas (no las reabras)
- …

## Convenciones
- Idioma de la interfaz y del código, nomenclatura, multiempresa, modo claro y oscuro…

## Zonas delicadas (detente y pregunta)
- Dinero, permisos, datos personales, textos legales, borrado de datos, decisiones de producto no escritas…

## Voz y textos de la interfaz
Quién lee y con cuánto tiempo. Botones con verbo concreto.

| Decir | No decir |
|---|---|
| … | … |

## Trampas conocidas
- Errores que ya costaron una corrección (se agregan cuando pasan).

## Ramas y entrega
- Rama de trabajo: `develop`. `main` = producción; a `main` solo por PR cuando el dueño lo pide.
- Quién hace commit y push: …
