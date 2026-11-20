# Sector Restaurantes — fase de desarrollo (sin despliegue)

Rama: `feature/restaurantes-tres-disenos-borrador`. Producción y rama `main` intactas.

## Diseños
- FL-001 Sabor Clásico: demo preexistente. Se corrigió únicamente WhatsApp en esta rama. Queda pendiente mejorar fotografías y revisar accesibilidad.
- FL-013 Origen Premium: nueva demo original con estética editorial, menú filtrable y CTA de cotización.
- FL-014 Fuego Urbano: nueva demo original de comida urbana, menú filtrable y CTA de cotización.

## Estado
Los dos nuevos diseños tienen HTML, CSS y JavaScript propios. No están incorporados a `data/designs-public.json` ni al catálogo público. No se ha creado PR ni fusionado la rama. Las imágenes se cargan desde Unsplash; revisar selección, licencias, disponibilidad y consistencia antes de publicar. Los nombres, productos y restaurantes son ficticios.

## QA pendiente
- Revisar escritorio 1440 px, tablet 768 px y móvil 360 px, navegación, contraste y teclado.
- Verificar carga de imágenes, enlaces, seguridad de navegación y noindex.
- Sustituir imágenes ilustrativas por recursos visuales aprobados cuando estén disponibles.
- Validar que el visor del catálogo abra ambas demos y que el CTA de cotización use +57 312 300 7530.
- Revisar con el usuario y solicitar autorización expresa antes de integrar en `main`.
