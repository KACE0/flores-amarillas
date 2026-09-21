# florecer. — taller y regalo

**Abre `index.html` en Chrome, Edge, Firefox o Safari.** Es el maestro: pulsa **Crear mi regalo**, cambia el nombre, la firma, la carta y los ocho mensajes. **Vista previa** muestra exactamente la experiencia de la destinataria. Pulsa **Generar regalo** y luego **Descargar HTML del regalo**.

Envía el HTML descargado. El regalo no incluye editor, formularios, plantilla del maestro ni botones de personalización. No requiere internet: el motor 3D y todos los modelos están incluidos. El maestro guarda el último borrador en ese navegador, cuando el navegador permite almacenamiento local.

`regalo-ejemplo.html` es una muestra completa de lo que recibe la persona, con la dedicatoria predeterminada.

La persona toca el sello del sobre, descubre su ramo y arrastra para girarlo. Al tocar una flor, sus pétalos se abren y aparece su mensaje. Los botones 1–8 permiten abrir las flores también con teclado. Si el dispositivo no admite WebGL, se conservan la carta y los ocho mensajes mediante esos botones.

Para GitHub Pages, publica el **regalo descargado** con el nombre `index.html`. Si publicas el maestro, estarás publicando el taller.

## Archivos de desarrollo

Los fuentes están en `src/`. Para reconstruir ambos HTML después de editarlos:

```powershell
python src/build.py
```

Los pétalos, tallos, hojas, papel, lazo y etiquetas se modelan por código. Three.js 0.160.1 se incluye bajo licencia MIT, conservada dentro de cada HTML y en `src/THREE-LICENSE.txt`. La versión anterior está guardada en `src/version-1.html`.
