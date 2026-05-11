# Certeza - Landing Web de Cerveceria Artesanal

Sitio web para la marca Certeza, construido con HTML, CSS y JavaScript puro.

## 1) Que incluye el proyecto

- Pantalla de carga inicial con identidad de marca.
- Navbar responsive con estado compacto al hacer scroll.
- Hero con videos en crossfade.
- Carrusel visual de latas (estilo Alafut).
- Galeria interactiva.
- Timeline de proceso con videos por hover.
- Seccion de eventos.
- Secciones de impacto, visita y cierre cinematico.
- Footer y CTA movil.
- Soporte de idioma ES/EN por i18n en `script.js`.

## 2) Estructura de carpetas

```text
.
|-- index.html
|-- style.css
|-- script.js
|-- README.md
`-- multimedia/
	|-- alafut2/
	`-- latas/
```

## 3) Tecnologias

- HTML5
- CSS3 (sin framework)
- JavaScript vanilla (sin build step)

## 4) Como ejecutar en local

Opciones recomendadas:

1. Abrir `index.html` directamente en el navegador (rapido para revisar contenido).
2. Servir con Live Server en VS Code para desarrollo comodo.
3. Servir con cualquier servidor local estatico:

```bash
# ejemplo con Node
npx serve .
```

## 5) Flujo de navegacion principal

Orden actual del navbar desktop:

1. Puntos (waffle/menu movil)
2. Book (ancla a `#cervezas`)
3. Galeria (ancla a `#galeria`)
4. Logo
5. Eventos (ancla a `#eventos`)
6. Redes sociales
7. Bandera de idioma

## 6) i18n (Español/Ingles)

La traduccion esta centralizada en el objeto `I18N` dentro de `script.js`.

Puntos importantes:

- `applyLanguage(lang)` aplica textos en navbar, hero, galeria, timeline, eventos, manifiesto, impacto, visita y footer.
- El idioma se guarda en `localStorage` (`certeza-lang`).
- Si agregas una seccion nueva, debes añadir claves en `I18N.es` y `I18N.en` y aplicar esas claves en `applyLanguage`.

## 7) Secciones clave del codigo

### `index.html`

- Estructura semantica de la landing.
- IDs usados por JS para i18n, scroll y animaciones.
- Referencias de video/imagen y anclas de navegacion.

### `style.css`

- Variables de marca (`:root`).
- Sistema visual de navbar (estado normal y compacto).
- Animaciones del hero, cards, timeline y eventos.
- Estilos responsive y componentes de CTA flotantes.

### `script.js`

- Loader inicial.
- Slider de latas.
- Navbar compacto por scroll.
- Menu movil.
- i18n ES/EN.
- Crossfade de videos del hero.
- Hover de videos en timeline.
- Observer de animaciones on-scroll.

## 8) Convenciones para editar sin romper

- Mantener IDs/clases que ya consume `script.js`.
- Si renombras clases de UI, actualizar selectores en JS.
- Evitar eliminar `data-*` usados para slider o parallax.
- Verificar anclas (`#cervezas`, `#galeria`, `#eventos`, `#contacto`) cuando cambies el nav.

## 9) Checklist de QA manual antes de publicar

1. Navbar: links y orden correctos.
2. Cambio de idioma: todas las secciones traducen.
3. Hero: videos crossfade sin cortes visibles.
4. Timeline: videos aparecen al hover y se reinician al salir.
5. Responsive: revisar desktop y movil.
6. Rendimiento: videos cargan sin bloquear primera pintura.

## 10) Mejoras futuras sugeridas

- Optimizar y comprimir videos/imagenes.
- Añadir prueba visual automatizada (Playwright).
- Integrar formulario real para reservas/contacto.
- Implementar versionado de assets con hash.
- Agregar analitica de eventos (clicks del nav y CTA).

## 11) Estado actual

Proyecto funcional en estatico, con foco en experiencia visual e identidad de marca.