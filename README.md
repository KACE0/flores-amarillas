# flores-amarillas

Un regalo interactivo de flores amarillas: un sobre animado y un ramo 3D con girasoles, rosas, tulipanes y una margarita. Cada flor se abre para revelar un mensaje personalizable.

## Crear un regalo

1. Abre `index.html` en tu navegador: es el maestro.
2. Pulsa **Crear mi regalo** y personaliza el nombre, la firma, la carta y los ocho mensajes.
3. Revisa la **Vista previa**, pulsa **Generar regalo** y descarga el HTML.
4. Envía el archivo descargado. No contiene el editor ni opciones de personalización.

Todo funciona sin internet, incluido el ramo 3D. `regalo-ejemplo.html` muestra la experiencia de la persona que recibe el regalo.

## GitHub Pages

El sitio es estático y no necesita compilación para publicarse. La raíz de la rama `main` contiene el maestro (`index.html`) y la muestra (`regalo-ejemplo.html`). Para compartir un regalo mediante un enlace, añade su HTML generado al sitio. Para que un regalo sea la portada, publícalo con el nombre `index.html` en lugar del maestro.

## Desarrollo

```sh
python src/build.py
python src/verify.py
```

Los fuentes y la licencia MIT de Three.js están en `src/`. Consulta [LEEME.md](LEEME.md) para más detalles.
