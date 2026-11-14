---
name: mx-privacy-compliance
description: Aplica el Aviso de Privacidad y el aviso de cookies correctos para un sitio o app dirigido a México, conforme a la LFPDPPP (reformada en marzo 2025). Úsalo SIEMPRE que el usuario mencione aviso de privacidad, política de privacidad, banner de cookies, LFPDPPP, protección de datos personales, derechos ARCO, cumplimiento legal de un formulario/landing/sitio, o pregunte si necesita un banner de consentimiento — incluso si no usa esas palabras exactas, por ejemplo "¿necesito algo legal antes de recibir datos en este formulario?" o "¿tengo que pedir permiso para usar Google Analytics?". También aplica cuando se agrega Google Analytics, Meta Pixel, un formulario que recaba datos personales, o cualquier mecanismo de login/registro a un sitio mexicano, para recordar proactivamente que falta el aviso de privacidad si el proyecto no lo tiene.
metadata:
  origen: kit-agentes
---

# Cumplimiento de privacidad para sitios dirigidos a México (LFPDPPP)

Este skill condensa la investigación ya hecha una vez (en iosoluciones.com.mx) para no repetirla en cada proyecto nuevo. Resume el marco legal, qué es obligatorio, qué no lo es claramente, y trae plantillas listas para adaptar.

**No es asesoría legal formal.** Es una guía práctica para moverse rápido en proyectos reales de un desarrollador/negocio pequeño. Antes de publicar algo con implicaciones serias (muchos usuarios, datos sensibles, un cliente grande), recomienda al usuario verificar el texto vigente en el [DOF](https://www.dof.gob.mx/) y, si el caso lo amerita, consultar a un abogado. Dilo explícitamente en la conversación, no lo des por sentado en silencio.

## 1. Marco legal (resumen, verifica vigencia antes de citar fechas exactas)

- La **LFPDPPP** (Ley Federal de Protección de Datos Personales en Posesión de los Particulares) es la ley aplicable a empresas privadas en México. Se reformó y publicó en el DOF el 20 de marzo de 2025, vigente desde el 21 de marzo de 2025.
- El **INAI desapareció**. Las funciones de protección de datos del sector privado pasaron a **"Transparencia para el Pueblo"**, un órgano dentro de la Secretaría Anticorrupción y Buen Gobierno. Hay dudas públicas sobre qué tan activa es la vigilancia bajo este nuevo esquema — no asumas que no pasa nada si no se cumple, pero tampoco cites al INAI como autoridad vigente.
- **Antes de dar una fecha o cita textual de la ley a un usuario**, confírmala con una búsqueda rápida — las leyes mexicanas de protección de datos han cambiado más de una vez en los últimos años, y este resumen puede quedar desactualizado.

## 2. Lo que SÍ es obligatorio: el Aviso de Privacidad

En cuanto un sitio recaba **cualquier** dato personal —nombre, correo, teléfono, IP, un identificador en una cookie o localStorage que permita distinguir a una persona, etc.— a través de un formulario, un login, un chat, o incluso solo con Analytics, la LFPDPPP exige tener un **Aviso de Privacidad disponible antes de ese tratamiento**. Esto no es opcional ni depende de si usas cookies o no.

### Formatos (usa los tres cuando el espacio lo permita)

| Formato | Dónde va | Contenido |
|---|---|---|
| **Integral** | Página dedicada (`/aviso-de-privacidad` o similar) | Todos los elementos mínimos, completo |
| **Simplificado** | Junto a cada formulario que recaba datos | Versión corta que remite al integral |
| **Corto** | Espacios muy reducidos (SMS, un solo campo) | Una o dos líneas + enlace |

### Elementos mínimos del Aviso Integral

1. **Identidad y domicilio** del responsable (quién recaba los datos, dónde contactarlo).
2. **Datos tratados**, señalando explícitamente si hay **datos sensibles** (salud, financieros, biométricos, etc. — si el proyecto no los toca, dilo también, es una forma de transparencia).
3. **Finalidades**, separando:
   - **Primarias**: necesarias para el servicio que el usuario pidió (ej. responder un contacto).
   - **Secundarias**: todo lo demás (marketing, medición de anuncios) — el usuario debe poder **oponerse** a estas sin perder el servicio primario.
4. **Mecanismo para limitar uso o divulgación** (cómo oponerse a las finalidades secundarias).
5. **Mecanismo para ejercer derechos ARCO** (ver abajo) — gratuito, sin trámite complicado.
6. **Procedimiento para comunicar cambios** al aviso (normalmente: "lo publicamos en esta misma página con fecha de actualización").

La reforma de 2025 **eliminó la obligación de detallar transferencias de datos** en el aviso (antes era obligatorio listar a quién se transfieren los datos). Aun así, es buena práctica mencionar brevemente qué proveedores externos tocan los datos (Google Analytics, Meta, el hosting), porque genera confianza y reduce sorpresas.

### Derechos ARCO

El usuario (titular de los datos) tiene derecho a:
- **A**cceder a sus datos.
- **R**ectificarlos si están desactualizados o son incorrectos.
- **C**ancelarlos (pedir que se eliminen).
- **O**ponerse a un uso específico.

Debe poder ejercerlos gratis, normalmente escribiendo a un correo de contacto. No hace falta un portal complejo para un sitio pequeño — un correo claro en el aviso es suficiente.

Plantilla completa lista para adaptar: **`references/aviso-de-privacidad-plantilla.md`**.

## 3. Lo que NO está claramente exigido: un banner de cookies bloqueante estilo UE

A diferencia del RGPD europeo, **no hay evidencia clara de que la ley mexicana exija un muro de consentimiento (opt-in) que bloquee el sitio o las cookies hasta que el usuario acepte**. El texto de la LFPDPPP apunta a que el **consentimiento tácito es válido por defecto**, salvo que:
- Otra disposición legal exija expresamente consentimiento expreso, o
- Se trate de **datos financieros/patrimoniales** o **datos sensibles** — ahí sí se requiere consentimiento expreso (y para sensibles, por escrito/firma).

Analytics y píxeles publicitarios normales **no** caen en esas categorías. Muchas páginas que afirman "necesitas opt-in obligatorio en México" son de empresas que venden software de banners (CookieChimp, FlexyConsent, etc.) y se contradicen entre ellas — trátalas con escepticismo, no como fuente legal.

**Dónde sí aplica un consent gate real:** Meta y Google sí exigen su propio "Consent Mode"/"Pixel Consent Mode" — pero **solo para tráfico de la Unión Europea, Reino Unido o Suiza** (por el RGPD, que aplica extraterritorialmente). Si el sitio target es México y no hay campañas ni tráfico relevante de esas regiones, esto no aplica. Pregúntale al usuario si espera tráfico real de la UE/UK antes de descartarlo — si lo hay, este skill no cubre RGPD, hace falta revisarlo aparte.

### Lo que sí conviene hacer

Un **aviso informativo, NO bloqueante**: una barra (normalmente inferior) que dice qué cookies/herramientas de terceros se usan, enlaza al Aviso de Privacidad, y se puede cerrar — pero **no detiene la carga de Analytics ni del píxel**. Esto cumple el deber de transparencia de la LFPDPPP sin construir un Consent Management Platform completo que nadie pidió (eso sería sobre-ingeniería para un sitio MX-only).

Snippet vainilla (HTML/CSS/JS, sin dependencias) para adaptar a cualquier stack: **`assets/cookie-notice.html`**.

Puntos de accesibilidad ya resueltos en el snippet, mantenlos al adaptar:
- Es un `<aside aria-label="...">`, no un `<dialog>` — al no ser modal, no necesita trampa de foco ni bloquear el scroll.
- El botón de cerrar es un `<button>` nativo con texto claro ("Entendido"), no un ícono sin etiqueta.
- El cierre se recuerda en `localStorage` envuelto en `try/catch` (si el navegador bloquea `localStorage`, el aviso simplemente se muestra siempre en vez de romper).
- Respeta el tema claro/oscuro si el sitio ya tiene variables CSS de diseño — usa esas variables en vez de colores fijos.

## 4. Flujo al aplicar esto a un proyecto nuevo

1. **Audita qué se recaba de verdad.** No copies genérico — lee los formularios, el backend/API, y cualquier `localStorage`/cookie real del proyecto (pregúntale al usuario o revisa el código). El Aviso de Privacidad debe reflejar la realidad del sitio, no una plantilla sin adaptar.
2. **Identifica qué terceros tocan los datos**: Analytics, píxeles de ads, el proveedor de hosting/base de datos, captchas (Turnstile/reCAPTCHA cuentan como "estrictamente necesario", no hace falta ofrecer rechazarlos).
3. **Llena la plantilla** de `references/aviso-de-privacidad-plantilla.md` con eso y publícala en una página dedicada del sitio.
4. **Agrega el aviso simplificado** junto a cada formulario que recabe datos (una línea + enlace al integral, cerca del botón de enviar).
5. **Adapta el snippet de cookies** de `assets/cookie-notice.html` al stack del proyecto (Astro, Next, HTML plano, etc.) y a sus tokens de diseño existentes — no inventes una paleta nueva, reutiliza la que ya tiene el sitio.
6. **Enlaza el aviso desde el footer** del sitio, donde cualquier visitante pueda encontrarlo.
7. Dile al usuario, en una frase, qué decidiste sobre el banner bloqueante y por qué (normalmente: "no lo bloqueo porque la ley mexicana no lo exige claramente para este caso; si esperas tráfico real de la UE, avísame y lo reviso aparte").

## 5. Precedente real

Este patrón ya se implementó completo en **iosoluciones.com.mx** (Astro): `src/pages/aviso-de-privacidad.astro` (integral) + `src/components/CookieNotice.astro` (banner no bloqueante) + una línea junto al botón de envío del formulario de contacto. Si el usuario tiene acceso a ese repo, úsalo como referencia de implementación real además de las plantillas de este skill.
