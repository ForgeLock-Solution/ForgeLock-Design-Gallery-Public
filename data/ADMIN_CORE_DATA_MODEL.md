# Modelo de datos propuesto · ForgeLock Admin Core

Este documento describe un modelo conceptual para una futura administración real. El SQL adjunto es material de diseño: no es una migración aplicada y no hay conexión desde las páginas, variables de entorno, credenciales, proyecto de base de datos ni datos reales.

## Entidades

- `businesses`: tenant y configuración pública de un negocio.
- `business_members`: usuario asociado a un negocio y rol asignado. El identificador del usuario se reservaría para el proveedor de identidad elegido posteriormente.
- `content_items`: productos, servicios, cursos, profesionales y promociones en una tabla común tipada; atributos sectoriales en JSON estructurado.
- `categories`: categorías administrables por negocio.
- `media_assets`: metadatos y URL de imágenes, con texto alternativo y crédito/licencia.
- `marketplace_channels`: nombre, enlace, recurso de logotipo autorizado, visibilidad y orden para el carrusel de Atelier.
- `business_hours`: horarios del negocio o de un servicio.

Cada dato de negocio lleva `business_id`. Una futura conexión deberá resolver autenticación, aislamiento por tenant, políticas de acceso, validación de URLs e imágenes, límites de carga, consentimiento y retención antes de almacenar contenido real. El modelo no autoriza por sí mismo acceso o despliegue.

## Roles previstos

`owner`, `administrator`, `editor` y `viewer`. Son valores de diseño, no roles activos: la interfaz demostrativa no autentica, no aplica permisos de seguridad y no conecta con esta base de datos.

## Datos de solicitudes

Las páginas públicas solo hacen simulaciones locales y no capturan nombres, teléfonos, correos ni solicitudes. El modelo no incluye una tabla de visitantes ni de reservas. Si se requiere gestionar citas o inscripciones reales, habrá que diseñar por separado los datos mínimos, consentimiento, retención, controles de acceso y proceso de eliminación.

## Implementación futura

Revisar este modelo con el alcance comercial y técnico antes de elegir plataforma o ejecutar migraciones. Supabase/PostgreSQL se mantiene como una opción por evaluar; no existe un proyecto Supabase conectado a esta galería.
