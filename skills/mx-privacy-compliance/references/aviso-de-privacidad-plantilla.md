# Plantilla: Aviso de Privacidad Integral (México, LFPDPPP)

Reemplaza todo lo que está entre `{{ }}`. Borra las secciones que no apliquen (ej. "datos sensibles"
si el sitio no los toca — pero dilo explícitamente, no la borres en silencio, es parte de la transparencia).

No copies esto literal a producción sin ajustarlo a lo que el sitio realmente recaba — ver el paso 1
del flujo en SKILL.md.

---

```markdown
# Aviso de Privacidad

Última actualización: {{fecha}}

**{{Nombre de la empresa}}**, con domicilio en {{ciudad, estado, país}}, es responsable del
tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en
Posesión de los Particulares (LFPDPPP). Puedes contactarnos en {{correo de contacto}}.

## ¿Qué datos recabamos?

Recabamos datos personales cuando:

- **{{Acción 1, ej. "Llenas el formulario de contacto"}}:** {{lista de campos: nombre, correo, teléfono, mensaje...}}
- **{{Acción 2, ej. "Te registras / inicias sesión"}}:** {{campos}}
- **Navegas el sitio:** datos de uso recabados por {{Google Analytics / Meta Pixel / otras herramientas}}.

{{Si NO recaban datos sensibles (salud, financieros, biométricos, origen étnico, creencias, etc.):}}
No te pedimos ni almacenamos datos financieros, de salud ni otros datos sensibles.

{{Si SÍ los recaban, sé explícito sobre cuáles y que requieren consentimiento expreso y por escrito.}}

## ¿Para qué usamos tus datos?

**Finalidades primarias** (necesarias para atenderte):

- {{ej. "Responder tu mensaje y darte seguimiento a tu solicitud"}}
- {{ej. "Procesar tu pedido/suscripción"}}

**Finalidades secundarias** (puedes oponerte sin que afecte el servicio):

- {{ej. "Medir visitas y el desempeño de campañas de publicidad"}}
- {{ej. "Enviarte información sobre nuestros productos/servicios"}}

Si no deseas que usemos tus datos para las finalidades secundarias, escríbenos a
{{correo de contacto}} indicando tu oposición.

## Cookies y tecnologías de rastreo

Usamos las siguientes herramientas de terceros:

- **{{Google Analytics (GA4)}}:** mide visitas y comportamiento de navegación de forma agregada.
- **{{Meta Pixel}}:** mide conversiones de anuncios y permite mostrarte publicidad relevante.
- **{{Captcha, ej. Cloudflare Turnstile}}:** verifica que quien usa el formulario es una persona.
  Es estrictamente necesario para la seguridad del sitio.

Puedes bloquear estas cookies desde la configuración de tu navegador; algunas funciones podrían
dejar de funcionar si bloqueas herramientas de seguridad como el captcha.

## ¿Con quién compartimos tus datos?

No vendemos tus datos personales. Los compartimos únicamente con los proveedores que nos ayudan a
operar el sitio: {{lista: Google, Meta, el hosting/base de datos, pasarela de pagos si aplica}},
conforme a sus propias políticas de privacidad.

## Derechos ARCO

Tienes derecho a **Acceder, Rectificar, Cancelar** tus datos personales u **Oponerte** a su
tratamiento (derechos ARCO), así como a revocar tu consentimiento en cualquier momento. Para
ejercerlos, escríbenos a {{correo de contacto}} indicando tu nombre, el dato sobre el que quieres
ejercer tu derecho y una forma de contactarte. Es un trámite gratuito.

## Cambios a este aviso

Podemos actualizar este aviso de privacidad. Publicaremos cualquier cambio en esta misma página,
con la fecha de "Última actualización" al inicio.
```

---

## Versión simplificada (para junto a un formulario)

```markdown
Al enviar este formulario aceptas nuestro [Aviso de Privacidad]({{enlace al integral}}). Usamos tus
datos solo para {{finalidad primaria, ej. "responder tu mensaje"}}; puedes oponerte a otros usos
escribiendo a {{correo de contacto}}.
```

## Versión corta (espacio muy reducido)

```markdown
Al continuar aceptas nuestro [Aviso de Privacidad]({{enlace}}).
```
