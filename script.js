// =============================================================
// script.js — Certeza Cervecería Artesanal
// Contiene TODA la lógica interactiva del sitio:
//   • Pantalla de carga con duración mínima garantizada
//   • Slider de latas de cerveza con loop infinito
//   • Navbar que cambia de estado al hacer scroll
//   • Sistema de internacionalización (ES / EN) con persistencia
//   • Hero con crossfade de tres videos de fondo
//   • Animaciones de entrada por scroll (IntersectionObserver)
//   • Parallax sutil en secciones seleccionadas
//   • Overlay de video al hacer hover en el timeline
//   • Contadores animados de estadísticas
//   • CTA fijo en mobile que aparece al scrollear
// =============================================================

// Esperamos DOMContentLoaded para que todos los elementos del HTML
// ya existan antes de buscarlos con getElementById/querySelector.
// Si ejecutáramos el código antes, obtendríamos null en los selectores.
document.addEventListener('DOMContentLoaded', () => {
  // ── Pantalla de carga ──────────────────────────────────────────
  // La pantalla cubre todo el sitio con z-index 120 hasta que cargue.
  // Se usa una duración mínima de 2200 ms para que la animación del
  // logo se vea completa incluso en conexiones muy rápidas.
  const loader = document.getElementById('pantalla-carga');
  const minDuration = 2200; // ms — duración mínima visible del loader
  const start = Date.now(); // momento exacto en que empezó el script

  const hideLoader = () => {
    // Calculamos cuánto tiempo ha pasado; si es menos del mínimo,
    // esperamos la diferencia antes de ocultar. Si ya pasó el tiempo,
    // Math.max(0, ...) da 0 y se oculta de inmediato.
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDuration - elapsed);
    // Agregar la clase 'oculta' activa una transición CSS de opacity+visibility.
    // El && evita errores si el elemento fue removido del DOM.
    setTimeout(() => loader && loader.classList.add('oculta'), remaining);
  };

  // readyState puede ser 'complete' si el script cargó tarde (ej. caché);
  // en ese caso no hay evento 'load' que esperar, llamamos directo.
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    // { once: true } elimina el listener automáticamente después de usarlo una vez.
    window.addEventListener('load', hideLoader, { once: true });
  }
  // ── Slider de cervezas estilo Alafut ────────────────────────────
  // Cada entrada del array define una lata. Propiedades:
  //   name         → texto accesible del slide (aria-label)
  //   image        → lata PNG sobre fondo transparente
  //   bg           → imagen de arte que aparece detrás al hover
  //   canWidth     → ancho en px de la lata; controla --beer-can-width en CSS
  //   artScale     → cuánto se expande el arte de fondo al hover
  //   canScale     → escala base de la lata (en reposo)
  //   canHoverScale → escala de la lata al hacer hover (siempre > canScale)
  const ALAFUT_BEERS = [
    {
      name: 'Mojito',
      image: './multimedia/latas/mojito.png',
      bg: './multimedia/latas/mojito2.png',
      canWidth: 278,
      artScale: 1.44,
      canScale: 1.34,
      canHoverScale: 1.4,
    },
    {
      name: 'Lobos',
      image: './multimedia/latas/lobos.png',
      bg: './multimedia/latas/lobos2.png',
      canWidth: 278,
      artScale: 1.44,
      canScale: 1.34,
      canHoverScale: 1.4,
    },
    {
      name: 'Perro Vaquero',
      image: './multimedia/latas/perrovaquero.png',
      bg: './multimedia/latas/perrovaquero2.png',
      canWidth: 278,
      artScale: 1.44,
      canScale: 1.34,
      canHoverScale: 1.4,
    },
    {
      name: 'Limonada',
      image: './multimedia/latas/limonada.png',
      bg: './multimedia/latas/limonada2.png',
      canWidth: 278,
      artScale: 1.44,
      canScale: 1.34,
      canHoverScale: 1.4,
    },
    {
      name: 'Danza',
      image: './multimedia/latas/danza.png',
      bg: './multimedia/latas/danza2.png',
      canWidth: 278,
      artScale: 1.44,
      canScale: 1.34,
      canHoverScale: 1.4,
    },
  ];

  const sliderRoot = document.querySelector('[data-alafut-slider]');
  const sliderTrack = document.getElementById('alafut-slider-track');

  if (sliderRoot && sliderTrack) {
    // TRUCO DE LOOP: duplicamos el array para que el CSS pueda desplazar
    // el track completo sin que el usuario note el salto al reiniciar.
    // La animación CSS mueve exactamente (slide-width + gap) × beers-count
    // hacia la izquierda, que equivale al primer set. Al llegar al fin,
    // el segundo set es idéntico al primero, así el reinicio es invisible.
    const LOOP_BEERS = [...ALAFUT_BEERS, ...ALAFUT_BEERS];

    // Le pasamos la cantidad ORIGINAL (sin duplicar) como variable CSS.
    // La keyframe 'alafut-loop' en style.css usa este valor para calcular
    // exactamente hasta dónde desplazar antes de reiniciar.
    sliderTrack.style.setProperty('--beers-count', String(ALAFUT_BEERS.length));

    // Inyectamos el HTML de cada slide dinámicamente.
    // Las propiedades CSS personalizadas (--beer-can-width etc.) se pasan
    // directamente en el atributo style para que cada card tenga su propia escala.
    sliderTrack.innerHTML = LOOP_BEERS.map((beer, index) => `
      <article class="alafut-beers-slide" role="listitem" aria-label="${beer.name}" data-beer-index="${index % ALAFUT_BEERS.length}" tabindex="0">
        <div class="alafut-beers-card" style="--beer-can-width:${beer.canWidth ?? 220}px;--beer-art-scale:${beer.artScale ?? 1.18};--beer-can-scale:${beer.canScale ?? 1};--beer-can-hover-scale:${beer.canHoverScale ?? 1.035}">
          <div class="alafut-beers-card-bg" aria-hidden="true">
            <img src="${beer.bg}" alt="" loading="lazy" />
          </div>
          <img class="alafut-beers-card-can" src="${beer.image}" alt="${beer.name}" loading="lazy" />
          <div class="alafut-beers-card-shadow" aria-hidden="true"></div>
        </div>
      </article>
    `).join('');
  }

  // ── Navbar: fondo y estado compacto al scrollear ─
  const navbar = document.getElementById('navbar');

  const ensureCompactText = (id) => {
    // El logo compacto solo debe mostrar el texto "CERTEZA".
    // Esta función lo verifica y corrige si alguien edita el HTML y agrega
    // elementos extra adentro. Si el único hijo ya es el span correcto,
    // no hace nada (evita reflowed innecesarios del DOM).
    const node = document.getElementById(id);
    if (!node) return; // el elemento no existe, nada que hacer
    const onlyText = node.querySelector('.nav-logo-name-compact');
    // Condición: ya tiene el texto Y no tiene otros hijos = está limpio
    if (onlyText && node.children.length === 1) return;
    // Si falla la condición, forzamos el contenido correcto
    node.innerHTML = '<span class="nav-logo-name nav-logo-name-compact">CERTEZA</span>';
  };

  ensureCompactText('nav-logo-compact');
  ensureCompactText('nav-logo-compact-mobile');

  const updateNavbarOnScroll = () => {
    // 56 px coincide con la altura inicial del navbar + 1 px de margen.
    // Por encima de ese valor se activa el modo compacto.
    const isScrolled = window.scrollY > 56;

    // 'scrolled' → activa fondo semitransparente + blur en CSS
    // 'logo-compact' → colapsa el logo grande y muestra el texto pequeño
    // classList.toggle(clase, condición) añade si true, quita si false.
    navbar.classList.toggle('scrolled', isScrolled);
    navbar.classList.toggle('logo-compact', isScrolled);

    // En mobile el logo se controla por opacity (no por clase) porque
    // la barra mobile es un elemento separado del grid desktop.
    const lm = document.getElementById('nav-logo-large-mobile');
    const cm = document.getElementById('nav-logo-compact-mobile');
    if (lm) lm.style.opacity = isScrolled ? '0' : '1';
    if (cm) cm.style.opacity = isScrolled ? '1' : '0';
  };

  // Ejecutamos de inmediato por si la página cargó con scroll previo (ej. F5 a mitad).
  updateNavbarOnScroll();
  // passive:true indica al navegador que no vamos a llamar preventDefault(),
  // permitiéndole optimizar el scroll sin esperar a que termine el listener.
  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

  // ── Mobile menu (llamado desde onclick en HTML) ─
  window.toggleMobileMenu = function () {
    document.getElementById('mobile-menu').classList.toggle('open');
  };
  window.closeMobileMenu = function () {
    document.getElementById('mobile-menu').classList.remove('open');
  };

  // ── Toggle idioma ES / EN + i18n global ───────────
  const LANG_IMGS = {
    es: { src: 'https://flagcdn.com/24x18/es.png', src2x: 'https://flagcdn.com/48x36/es.png', alt: 'Español' },
    en: { src: 'https://flagcdn.com/24x18/gb.png', src2x: 'https://flagcdn.com/48x36/gb.png', alt: 'English' },
  };

  // ── Diccionario de traducciones (i18n) ─────────────────────────
  // Estructura: I18N[lang][seccion][clave] = texto
  // Reglas para mantenerlo:
  //   1. Siempre que se añada texto visible al HTML, agregar la clave
  //      en I18N.es Y en I18N.en antes de publicar.
  //   2. Los textos que contienen HTML (ej. <br>, <span>) se insertan
  //      con innerHTML en applyLanguage(), no con textContent.
  //   3. Cambiar un texto aquí no rompe el layout; cambiar una clave sí
  //      (hay que actualizar la referencia en applyLanguage también).
  const I18N = {
    es: {
      pageTitle: 'Certeza — Cerveza Artesanal',
      loaderTagline: 'CERVECERÍA ARTESANAL',
      nav: {
        gallery: 'GALERIA',
        book: 'BOOK',
        events: 'EVENTOS',
        phoneTitle: 'Teléfono',
        phoneAria: 'Teléfono',
        mailTitle: 'Email',
        mailAria: 'Email',
        langTitle: 'Cambiar idioma',
        langAria: 'Cambiar idioma',
        searchTitle: 'Buscar',
        searchAria: 'Buscar',
        openMenuAria: 'Abrir menú',
        mobile: ['Galeria', 'Book', 'Eventos'],
      },
      hero: {
        sub: 'Cerveza Artesanal',
        desc: 'Espuma dorada, aroma intenso y un carácter que deja huella. Cada sorbo convierte el momento en una experiencia irresistible.',
        explore: 'Explorar Cervezas',
        contact: 'Contacto',
      },
      stats: {
        labels: ['Variedades artesanales', 'Clientes felices', 'Elaborando con pasión', 'Eventos realizados'],
        thirdSuffix: ' años',
      },
      manifesto: {
        kicker: 'FIRMA DE MARCA',
        title: 'No vendemos cerveza.',
        titleAccent: 'Creamos noches con memoria.',
        text: 'Cada lote se piensa para quedarse en la conversación, no solo en el vaso. Certeza mezcla ritual, diseño y sabor para que cada brindis tenga peso propio.',
      },
      beersHeading: 'Ilustradas para mirar, creadas para brindar.',
      gallery: {
        titlePrefix: 'Nuestra ',
        titleAccent: 'Galería',
        subtitle: 'Imágenes que cuentan lo que las palabras no pueden.',
        cards: [
          { title: 'Tres razones para brindar', text: 'Cada botella es una historia. Elige la tuya.', more: 'Ver más' },
          { title: 'IPA Neon City', text: 'Intensidad que enciende la noche.', more: 'Ver más' },
          { title: 'Lager Golden Splash', text: 'Frescura que no se negocia.', more: 'Ver más' },
          { title: 'La cerveza del momento', text: 'Los mejores planes merecen la mejor cerveza.', more: 'Ver más' },
          { title: 'Stout Smoky Bar', text: 'Chocolate, humo y carácter en cada sorbo.', more: 'Ver más' },
          { title: 'Artesanal de verdad', text: 'Elaborada con obsesión, servida con orgullo.', more: 'Ver más' },
          { title: 'Más que una cerveza', text: 'Es la excusa perfecta para reunirse.', more: 'Ver más' },
          { title: 'Lujo en cada copa', text: 'Porque los detalles marcan la diferencia.', more: 'Ver más' },
        ],
      },
      timeline: {
        label: 'NUESTRO PROCESO',
        title: 'De Grano a',
        titleAccent: 'Sorbo Perfecto',
        cards: [
          { title: 'Selección', text: 'Maltas premium 100% naturales' },
          { title: 'Maceración', text: '3 horas de extracción perfecta' },
          { title: 'Cocción', text: '90 min con lúpulo artesanal' },
          { title: 'Fermentación', text: '2-3 semanas a temperatura controlada' },
          { title: 'Maduración', text: 'Reposado en tanques de acero' },
          { title: 'Envasado', text: 'Botella fresca lista para disfrutar' },
        ],
      },
      events: {
        label: 'PRÓXIMOS EVENTOS',
        title: 'Vive la Experiencia',
        titleAccent: 'CERTEZA',
        frecuencia: [
          'Todos los martes',
          'Cada fin de semana',
          'Primer jueves de cada mes',
          'Último sábado de cada mes',
        ],
        hora: [
          'Desde las 7:00 PM',
          'Viernes y sábados, 8:00 PM',
          '8:30 PM',
          '9:00 PM',
        ],
        desc: [
          'Sesiones en vivo con cerveza fría, luces bajas y una mesa lista para quedarse toda la noche.',
          'El plan grande de la casa: barra encendida, mesas llenas y energía de rooftop para cerrar la semana.',
          'Una noche pensada para brindar: rondas compartidas, maridaje rápido y ambiente de celebración.',
          'Cata guiada frente a barra con servicio especial, pours perfectos y foco total en la experiencia.',
        ],
        limited: 'Cupo limitado cada edición',
        reserve: 'Reservar',
        all: 'Ver todos los eventos →',
      },
      impacto: {
        kicker: 'NUEVA EXPERIENCIA',
        title: 'El Momento ',
        titleAccent: 'Que Hace Boom',
        desc: 'Color, espuma y energía en una sola toma. Mira el video y deja que Certeza hable por sí sola.',
        cta: 'RESERVAR AHORA',
        tag: 'EXPERIENCIA CERTEZA',
      },
      visit: {
        badge: '★ Valoración<br>en Google',
        label: 'ESTAMOS ESPERANDO',
        title: 'Ven y',
        titleAccent: 'Vívelo en Persona',
        desc: 'Una barra diseñada para quedarse. Luz cálida, música en vivo los fines de semana y la mejor selección de cervezas artesanales del país.',
        where: 'Dónde estamos',
        whereText: 'Calle Embajadores 62, Madrid &mdash; ',
        map: 'Ver en mapa &#8599;',
        hours: 'Horarios',
        hoursText: 'Mar&mdash;Jue 4 pm &ndash; 11 pm &nbsp;&nbsp;|&nbsp;&nbsp; Vie&mdash;Sáb 12 pm &ndash; 2 am &nbsp;&nbsp;|&nbsp;&nbsp; Dom 12 pm &ndash; 9 pm',
        bookings: 'Reservas',
        cta: 'Reservar Mesa Ahora',
      },
      footer: {
        brand: 'Cervecería artesanal dedicada a crear experiencias únicas con ingredientes de primera calidad.',
        navTitle: 'Navegación',
        navLinks: ['Inicio', 'Nuestras Cervezas', 'Contacto'],
        contactTitle: 'Contacto',
        city: 'Madrid, España',
        rights: '© 2026 CERTEZA. Todos los derechos reservados.',
      },
      wa: {
        title: 'Contacta con nosotros por WhatsApp',
        aria: 'Contactar por WhatsApp',
      },
      mobileCta: 'Pedir Ahora',
    },
    en: {
      pageTitle: 'Certeza — Craft Beer',
      loaderTagline: 'CRAFT BREWERY',
      nav: {
        gallery: 'GALLERY',
        book: 'BOOK',
        events: 'EVENTS',
        phoneTitle: 'Phone',
        phoneAria: 'Phone',
        mailTitle: 'Email',
        mailAria: 'Email',
        langTitle: 'Switch language',
        langAria: 'Switch language',
        searchTitle: 'Search',
        searchAria: 'Search',
        openMenuAria: 'Open menu',
        mobile: ['Gallery', 'Book', 'Events'],
      },
      hero: {
        sub: 'Craft Beer',
        desc: 'Golden foam, bold aroma, and character that lingers. Every sip turns the moment into an irresistible experience.',
        explore: 'Explore Beers',
        contact: 'Contact',
      },
      stats: {
        labels: ['Craft varieties', 'Happy customers', 'Brewing with passion', 'Events hosted'],
        thirdSuffix: ' years',
      },
      manifesto: {
        kicker: 'BRAND SIGNATURE',
        title: 'We do not sell beer.',
        titleAccent: 'We create nights worth remembering.',
        text: 'Every batch is crafted to stay in the conversation, not just in the glass. Certeza blends ritual, design, and flavor so every toast carries its own weight.',
      },
      beersHeading: 'Illustrated to admire, crafted to celebrate.',
      gallery: {
        titlePrefix: 'Our ',
        titleAccent: 'Gallery',
        subtitle: 'Images that tell what words cannot.',
        cards: [
          { title: 'Three reasons to toast', text: 'Every bottle tells a story. Pick yours.', more: 'See more' },
          { title: 'IPA Neon City', text: 'Intensity that lights up the night.', more: 'See more' },
          { title: 'Lager Golden Splash', text: 'Freshness you do not compromise.', more: 'See more' },
          { title: 'The beer of the moment', text: 'The best plans deserve the best beer.', more: 'See more' },
          { title: 'Stout Smoky Bar', text: 'Chocolate, smoke, and character in every sip.', more: 'See more' },
          { title: 'Truly craft', text: 'Brewed with obsession, served with pride.', more: 'See more' },
          { title: 'More than a beer', text: 'The perfect excuse to get together.', more: 'See more' },
          { title: 'Luxury in every glass', text: 'Because details make all the difference.', more: 'See more' },
        ],
      },
      timeline: {
        label: 'OUR PROCESS',
        title: 'From Grain to',
        titleAccent: 'The Perfect Sip',
        cards: [
          { title: 'Selection', text: '100% natural premium malts' },
          { title: 'Mashing', text: '3 hours of perfect extraction' },
          { title: 'Boiling', text: '90 min with craft hops' },
          { title: 'Fermentation', text: '2-3 weeks at controlled temperature' },
          { title: 'Conditioning', text: 'Rested in steel tanks' },
          { title: 'Packaging', text: 'Fresh bottle ready to enjoy' },
        ],
      },
      events: {
        label: 'UPCOMING EVENTS',
        title: 'Live the',
        titleAccent: 'CERTEZA Experience',
        frecuencia: [
          'Every Tuesday',
          'Every weekend',
          'First Thursday of every month',
          'Last Saturday of every month',
        ],
        hora: [
          'From 7:00 PM',
          'Fridays and Saturdays, 8:00 PM',
          '8:30 PM',
          '9:00 PM',
        ],
        desc: [
          'Live sessions with cold beer, low lights, and a table ready for an all-night stay.',
          'The house flagship plan: glowing bar, full tables, and rooftop energy to close the week.',
          'A night made for toasting: shared rounds, quick pairings, and a celebration vibe.',
          'Guided tasting at the bar with special service, perfect pours, and total focus on the experience.',
        ],
        limited: 'Limited spots each edition',
        reserve: 'Reserve',
        all: 'See all events →',
      },
      impacto: {
        kicker: 'NEW EXPERIENCE',
        title: 'The Moment',
        titleAccent: 'That Hits Different',
        desc: 'Color, foam, and energy in a single shot. Watch the video and let Certeza speak for itself.',
        cta: 'BOOK NOW',
        tag: 'CERTEZA EXPERIENCE',
      },
      visit: {
        badge: '★ Rating<br>on Google',
        label: 'WE ARE WAITING FOR YOU',
        title: 'Come and',
        titleAccent: 'Live It in Person',
        desc: 'A bar designed to make you stay. Warm light, live music on weekends, and the best craft beer selection in the country.',
        where: 'Where we are',
        whereText: '62 Embajadores St, Madrid &mdash; ',
        map: 'View on map &#8599;',
        hours: 'Hours',
        hoursText: 'Tue&mdash;Thu 4 pm &ndash; 11 pm &nbsp;&nbsp;|&nbsp;&nbsp; Fri&mdash;Sat 12 pm &ndash; 2 am &nbsp;&nbsp;|&nbsp;&nbsp; Sun 12 pm &ndash; 9 pm',
        bookings: 'Bookings',
        cta: 'Book a Table Now',
      },
      footer: {
        brand: 'Craft brewery dedicated to creating unique experiences with top-quality ingredients.',
        navTitle: 'Navigation',
        navLinks: ['Home', 'Our Beers', 'Contact'],
        contactTitle: 'Contact',
        city: 'Madrid, Spain',
        rights: '© 2026 CERTEZA. All rights reserved.',
      },
      wa: {
        title: 'Contact us on WhatsApp',
        aria: 'Contact on WhatsApp',
      },
      mobileCta: 'Order Now',
    },
  };

  // setText: atajo para textContent seguro.
  // Usamos textContent (no innerHTML) para evitar inyección de HTML.
  // Si el selector no encuentra nada, el if evita un error de null.
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  // applyLanguage: aplica TODAS las traducciones del idioma recibido al DOM.
  // Se llama: 1) al iniciar la página, 2) cada vez que el usuario pulsa la bandera.
  // Modifica textContent / innerHTML / atributos aria según corresponde.
  const applyLanguage = (lang) => {
    // Si lang no existe en el diccionario (p.ej. valor corrupto en localStorage),
    // usamos español como idioma seguro por defecto.
    const t = I18N[lang] || I18N.es;

    // Actualiza el atributo lang del <html> para lectores de pantalla y SEO.
    document.documentElement.lang = lang;
    document.title = t.pageTitle;

    // 1) Bandera activa del selector de idioma.
    // Cambiamos src, srcset y alt de la imagen de bandera según el idioma.
    const img = document.getElementById('lang-flag');
    if (img) {
      img.src = LANG_IMGS[lang].src;
      img.srcset = LANG_IMGS[lang].src2x + ' 2x';
      img.alt = LANG_IMGS[lang].alt;
    }

    // 2) Loader y navbar (desktop + mobile).
    setText('.loader-tagline', t.loaderTagline);

    // CUIDADO: navLabels se obtiene por posición DOM, no por id.
    // El índice 0 = primer enlace del grid = BOOK, 1 = GALERIA, 2 = EVENTOS.
    // Si alguien reordena los enlaces en el HTML, este array cambia y
    // la asignación de texto quedaría mal. Verificar siempre en ambos lados.
    const navLabels = document.querySelectorAll('.nav-desktop-grid .nav-box-link .nav-box-label');
    if (navLabels[0]) navLabels[0].textContent = t.nav.book;
    if (navLabels[1]) navLabels[1].textContent = t.nav.gallery;
    if (navLabels[2]) navLabels[2].textContent = t.nav.events;
    const phone = document.querySelector('.nav-socials a[href^="tel:"]');
    if (phone) {
      phone.title = t.nav.phoneTitle;
      phone.setAttribute('aria-label', t.nav.phoneAria);
    }
    const mail = document.querySelector('.nav-socials a[href^="mailto:"]');
    if (mail) {
      mail.title = t.nav.mailTitle;
      mail.setAttribute('aria-label', t.nav.mailAria);
    }
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.title = t.nav.langTitle;
      langBtn.setAttribute('aria-label', t.nav.langAria);
    }
    const searchBtnDesktop = document.querySelector('.nav-desktop-grid > button.nav-box:not(#lang-toggle):not([onclick])');
    if (searchBtnDesktop) {
      searchBtnDesktop.title = t.nav.searchTitle;
      searchBtnDesktop.setAttribute('aria-label', t.nav.searchAria);
    }
    const menuButtons = document.querySelectorAll('button[onclick="toggleMobileMenu()"]');
    menuButtons.forEach((btn) => btn.setAttribute('aria-label', t.nav.openMenuAria));
    const mobileSearch = document.querySelector('.nav-mobile-bar button[title]');
    if (mobileSearch) {
      mobileSearch.title = t.nav.searchTitle;
      mobileSearch.setAttribute('aria-label', t.nav.searchAria);
    }
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach((a, i) => {
      if (t.nav.mobile[i]) a.textContent = t.nav.mobile[i];
    });

    // 3) Hero principal.
    setText('#hero-sub', t.hero.sub);
    setText('#hero-desc', t.hero.desc);
    const heroBtns = document.querySelectorAll('.hero-btns a');
    if (heroBtns[0]) heroBtns[0].textContent = t.hero.explore;
    if (heroBtns[1]) heroBtns[1].textContent = t.hero.contact;

    // 4) Estadisticas.
    const statLabels = document.querySelectorAll('.stats-section .stat-label');
    statLabels.forEach((el, i) => {
      if (t.stats.labels[i]) el.textContent = t.stats.labels[i];
    });
    const statSuffix = document.querySelectorAll('.stats-section .stat-suffix');
    if (statSuffix[2]) statSuffix[2].textContent = t.stats.thirdSuffix;

    // 5) Manifiesto de marca.
    setText('.manifiesto-kicker', t.manifesto.kicker);
    const manifestoTitle = document.querySelector('.manifiesto-title');
    if (manifestoTitle) {
      manifestoTitle.innerHTML = `${t.manifesto.title}<span>${t.manifesto.titleAccent}</span>`;
    }
    setText('.manifiesto-text', t.manifesto.text);

    // 6) Titulo del carrusel de latas.
    setText('.alafut-beers-heading', t.beersHeading);

    // 7) Galeria y overlays.
    const galleryTitle = document.querySelector('#galeria h2');
    if (galleryTitle) {
      galleryTitle.innerHTML = `${t.gallery.titlePrefix}<span style="color:#c9a53e">${t.gallery.titleAccent}</span>`;
    }
    const gallerySub = document.querySelector('#galeria h2 + p');
    if (gallerySub) gallerySub.textContent = t.gallery.subtitle;
    // Las foto-cells tienen los textos tanto en atributos data-* como en el HTML
    // del overlay (.foto-texto). Actualizamos ambos para que sean consistentes:
    // data-titulo y data-texto son los "datos fuente"; el overlay es lo visible.
    const photoCells = document.querySelectorAll('#galeria .foto-cell');
    photoCells.forEach((cell, i) => {
      const card = t.gallery.cards[i];
      if (!card) return;
      cell.dataset.titulo = card.title;
      cell.dataset.texto = card.text;
      const title = cell.querySelector('.foto-texto h3');
      const text = cell.querySelector('.foto-texto p:nth-of-type(2)');
      const more = cell.querySelector('.foto-texto span');
      if (title) title.textContent = card.title;
      if (text) text.textContent = card.text;
      if (more) more.textContent = card.more;
    });

    // 8) Timeline: texto de cada paso + título que aparece sobre el video.
    // El .timeline-video-title es el texto superpuesto al video en el overlay,
    // por eso se actualiza por separado del h3 de la card.
    setText('.timeline-label', t.timeline.label);
    const timelineTitle = document.querySelector('.timeline-title');
    if (timelineTitle) {
      timelineTitle.innerHTML = `${t.timeline.title}<span>${t.timeline.titleAccent}</span>`;
    }
    const timelineCards = document.querySelectorAll('.timeline-grid .timeline-card');
    timelineCards.forEach((card, i) => {
      const copy = t.timeline.cards[i];
      if (!copy) return;
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      const vt = card.querySelector('.timeline-video-title');
      if (h3) h3.textContent = copy.title;
      if (p) p.textContent = copy.text;
      if (vt) vt.textContent = copy.title;
    });

    // 9) Eventos y CTA de bloque.
    setText('.eventos-label', t.events.label);
    const eventsTitle = document.querySelector('.eventos-title');
    if (eventsTitle) {
      eventsTitle.innerHTML = `${t.events.title}<span>${t.events.titleAccent}</span>`;
    }
    const eventCards = document.querySelectorAll('.eventos-grid .eventos-card');
    eventCards.forEach((card, i) => {
      const freq = card.querySelector('.eventos-frecuencia');
      const hour = card.querySelector('.eventos-hora');
      const desc = card.querySelector('p');
      const limited = card.querySelector('.eventos-footer span');
      const reserveBtn = card.querySelector('.eventos-btn');
      if (freq && t.events.frecuencia[i]) freq.textContent = t.events.frecuencia[i];
      if (hour && t.events.hora[i]) hour.textContent = t.events.hora[i];
      if (desc && t.events.desc[i]) desc.textContent = t.events.desc[i];
      if (limited) limited.textContent = t.events.limited;
      if (reserveBtn) reserveBtn.textContent = t.events.reserve;
    });
    setText('.eventos-footer-cta a', t.events.all);

    // 10) Bloque de impacto con video.
    setText('.impacto-kicker', t.impacto.kicker);
    const impactoTitle = document.querySelector('.impacto-copy h2');
    if (impactoTitle) {
      impactoTitle.innerHTML = `${t.impacto.title}<span>${t.impacto.titleAccent}</span>`;
    }
    setText('.impacto-desc', t.impacto.desc);
    setText('.impacto-cta', t.impacto.cta);
    setText('.impacto-video-tag', t.impacto.tag);

    // 11) Sección "Visítanos".
    // Las tres filas de datos (dirección, horario, teléfono) se reconstruyen
    // completamente con innerHTML porque contienen iconos emoji + links anidados.
    // Es más seguro reconstruirlas que tratar de actualizar cada fragmento.
    const visitBadge = document.querySelector('.visitanos-badge-txt');
    if (visitBadge) visitBadge.innerHTML = t.visit.badge;
    setText('.visitanos-label', t.visit.label);
    const visitTitle = document.querySelector('.visitanos-title');
    if (visitTitle) {
      visitTitle.innerHTML = `${t.visit.title}<span>${t.visit.titleAccent}</span>`;
    }
    setText('.visitanos-desc', t.visit.desc);
    const visitRows = document.querySelectorAll('.visitanos-data .visitanos-row');
    if (visitRows[0]) {
      visitRows[0].innerHTML = `
        <span class="visitanos-icon">&#128205;</span>
        <div>
          <strong>${t.visit.where}</strong>
          <span>${t.visit.whereText}<a href="https://www.google.com/maps/search/?api=1&query=Calle+Embajadores+62+Madrid" target="_blank" rel="noopener" class="visitanos-map-link">${t.visit.map}</a></span>
        </div>
      `;
    }
    if (visitRows[1]) {
      visitRows[1].innerHTML = `
        <span class="visitanos-icon">&#128336;</span>
        <div>
          <strong>${t.visit.hours}</strong>
          <span>${t.visit.hoursText}</span>
        </div>
      `;
    }
    if (visitRows[2]) {
      visitRows[2].innerHTML = `
        <span class="visitanos-icon">&#128222;</span>
        <div>
          <strong>${t.visit.bookings}</strong>
          <span>+57 310 000 0000 &nbsp;&nbsp;|&nbsp;&nbsp; info@certeza.com</span>
        </div>
      `;
    }
    setText('.visitanos-cta', t.visit.cta);

    // 12) Footer completo.
    const footerCols = document.querySelectorAll('footer .footer-col');
    if (footerCols[0]) {
      const p = footerCols[0].querySelector('p');
      if (p) p.textContent = t.footer.brand;
    }
    if (footerCols[1]) {
      const h4 = footerCols[1].querySelector('h4');
      if (h4) h4.textContent = t.footer.navTitle;
      const links = footerCols[1].querySelectorAll('a');
      links.forEach((link, i) => {
        if (t.footer.navLinks[i]) link.textContent = t.footer.navLinks[i];
      });
    }
    if (footerCols[2]) {
      const h4 = footerCols[2].querySelector('h4');
      if (h4) h4.textContent = t.footer.contactTitle;
      const ps = footerCols[2].querySelectorAll('p');
      if (ps[2]) ps[2].textContent = t.footer.city;
    }
    setText('.footer-legal-text', t.footer.rights);

    // 13) Accesibilidad de boton flotante + CTA mobile.
    const wa = document.getElementById('whatsapp-flotante');
    if (wa) {
      wa.title = t.wa.title;
      wa.setAttribute('aria-label', t.wa.aria);
    }

    setText('#cta-movil-fijo .cta-movil-btn', t.mobileCta);

    // Persistencia para mantener idioma al recargar.
    currentLang = lang;
    localStorage.setItem('certeza-lang', lang);
  };

  // Prioridad de idioma inicial:
  //   1. Lo que guardó el usuario en la sesión anterior (localStorage)
  //   2. El atributo lang del <html> (definido en el HTML estático)
  //   3. Español como fallback final
  let currentLang = localStorage.getItem('certeza-lang') || document.documentElement.lang || 'es';
  // Doble seguridad: si el valor guardado no es una clave válida del diccionario,
  // lo reemplazamos por español en lugar de mostrar el sitio sin textos.
  if (!I18N[currentLang]) currentLang = 'es';

  // toggleLang es global (window.) porque se llama desde el atributo onclick
  // del botón de bandera en el HTML. No puede ser una variable local.
  window.toggleLang = function () {
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(next);
  };

  // Aplicación inicial: renderiza el idioma correcto desde el primer frame.
  applyLanguage(currentLang);

  // ── Hero: animaciones de entrada ────────────────────────────────
  // Usamos 'load' (no 'DOMContentLoaded') para que los videos del hero
  // ya estén inicializados antes de mostrar el contenido.
  // Cada elemento del hero empieza en opacity:0 en CSS y con la clase
  // 'visible' se activa una transición individual con delay escalonado
  // (definido en style.css) para crear un efecto de aparición en cascada.
  window.addEventListener('load', () => {
    const ids = ['hero-content', 'hero-line', 'hero-h1', 'hero-sub', 'hero-desc', 'hero-btns'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('visible'); // activa transition CSS del elemento
      }
    });
  });

  // ── Hero: crossfade de tres videos de fondo ────────────────────
  // Técnica: los tres videos están apilados en la misma posición absoluta.
  // El activo tiene opacity:1 y z-index:2; los inactivos tienen opacity:0.
  // Al terminar un video, 'startCrossfade' hace la transición al siguiente.
  const CROSSFADE_MS = 1200; // duración en ms de la transición (debe coincidir con CSS transition)

  const videos = [
    document.getElementById('video0'),
    document.getElementById('video1'),
    document.getElementById('video2'),
  ].filter(Boolean); // .filter(Boolean) elimina null si algún id no existe en el DOM

  let activeIdx = 0;        // índice del video que está visible ahora
  let isCrossfading = false; // bandera para evitar que 'ended' dispare dos veces seguidas

  function startCrossfade() {
    // Si el crossfade anterior no terminó aún (ej. video muy corto), ignoramos el evento.
    if (isCrossfading) {
      return;
    }
    isCrossfading = true;

    // Calculamos el índice circular del siguiente video (0→1→2→0→...)
    const nextIdx = (activeIdx + 1) % videos.length;
    const nextVideo = videos[nextIdx];

    // Reiniciamos el siguiente al segundo 0 por si ya había reproducido antes.
    nextVideo.currentTime = 0;
    // .catch(() => {}) silencia el rechazo de play() en navegadores que
    // bloquean autoplay hasta que el usuario interactúe con la página.
    nextVideo.play().catch(() => {});

    // El siguiente sube a primer plano: z-index alto + opacity visible
    nextVideo.style.zIndex = '2';
    nextVideo.style.opacity = '1';
    // El actual queda detrás y se desvanece — CSS lo anima con transition
    videos[activeIdx].style.zIndex = '1';
    videos[activeIdx].style.opacity = '0';

    // Después de que la transición CSS termina, actualizamos el índice activo
    // y liberamos la bandera para permitir el siguiente crossfade.
    setTimeout(() => {
      activeIdx = nextIdx;
      isCrossfading = false;
    }, CROSSFADE_MS);
  }

  // Cada video dispara el crossfade al terminar su reproducción.
  videos.forEach(v => v.addEventListener('ended', startCrossfade));

  // Arrancamos el primer video; el .catch silencia errores de autoplay bloqueado.
  if (videos[0]) {
    videos[0].play().catch(() => {});
  }

  // ── Footer links hover ──────────────────────────
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.color = '#c9a53e';
    });
    link.addEventListener('mouseleave', () => {
      link.style.color = '#c8ddd5';
    });
  });

  // ── Intersection Observer: reveals al scrollear ─────────────────
  // threshold: 0.15 significa que el elemento debe estar al menos un 15%
  // visible en el viewport para activarse. Evita activaciones prematuras.
  const observerOptions = { threshold: 0.15 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Añadimos 'visible' una sola vez y NO la quitamos al salir.
        // Esto es intencional: el reveal es permanente, no se repite
        // cada vez que el elemento entra/sale del viewport.
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Registramos todos los elementos que usan animación de entrada.
  // La clase 'visible' activa transitions de opacity y transform en CSS.
  document.querySelectorAll(
    '.gallery-title, .section-line, .beer-card, .footer-content, ' +
    '.timeline-card, .eventos-card, .timeline-header, .eventos-header, .reveal-on-scroll'
  ).forEach(el => {
    observer.observe(el);
  });

  // ── Parallax sutil ────────────────────────────────────────────────
  // Los elementos con data-parallax="0.09" (por ejemplo) definen la velocidad.
  // Un valor de 0.09 significa que el fondo se mueve 9 px por cada 100 px de scroll.
  // El signo negativo produce el efecto opuesto al scroll (sensación de profundidad).
  // El offset resultante se escribe en la variable CSS --parallax-offset, que
  // el CSS usa en background-position para mover el fondo sin reflow.
  const parallaxNodes = document.querySelectorAll('[data-parallax]');
  let parallaxTicking = false; // flag del patrón 'requestAnimationFrame throttle'

  const runParallax = () => {
    const y = window.scrollY;
    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.parallax) || 0;
      // Math.round evita valores subpíxel que pueden causar blur en algunos navegadores.
      node.style.setProperty('--parallax-offset', `${Math.round(y * speed * -1)}px`);
    });
    parallaxTicking = false; // libera el flag para el siguiente frame
  };

  window.addEventListener('scroll', () => {
    // Patrón rAF throttle: solo programamos un frame si no hay uno pendiente.
    // Sin esto, scroll puede disparar cientos de cálculos por segundo.
    if (!parallaxTicking) {
      window.requestAnimationFrame(runParallax);
      parallaxTicking = true;
    }
  }, { passive: true });

  // Ejecutamos al cargar para calcular el offset inicial si la página ya tiene scroll.
  runParallax();

  // ── Timeline: video de proceso al hacer hover ───────────────────
  // Cada card del timeline tiene un <video> oculto dentro de .timeline-video-overlay.
  // Al hacer hover mostramos ese video sobre la card (el CSS lo hace visible
  // cuando la card tiene la clase 'is-hovered' O cuando tiene :hover).
  // Usamos la clase JS 'is-hovered' como respaldo para dispositivos donde
  // :hover puede no funcionar correctamente (algunos navegadores móviles).
  document.querySelectorAll('.timeline-card').forEach(card => {
    const video = card.querySelector('.timeline-video');
    if (!video) return; // si una card no tiene video, la saltamos sin error

    // preload='metadata' descarga solo los primeros bytes del video para
    // tener disponible el primer frame lo antes posible sin descargar todo.
    // .load() fuerza al navegador a iniciar la descarga aunque el atributo
    // ya esté en el HTML (necesario si el src fue puesto después de cargar).
    video.preload = 'metadata';
    video.load();

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-hovered'); // activa overlay via CSS
      // El .catch vacío evita errores de consola si el video aún no cargó.
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovered'); // oculta overlay via CSS
      video.pause();
      video.currentTime = 0; // resetea al inicio para que la próxima vez empiece desde 0
    });
  });

  // ── CTA Móvil Fijo ────────────────────────────────────────────────
  // En mobile aparece un botón fijo "Pedir Ahora" en la parte inferior.
  // Solo se muestra cuando el usuario bajó más de 300 px (pasó el hero),
  // para no tapar el contenido del hero con el botón desde el inicio.
  // En desktop no es visible (style.css lo oculta con display:none en >767px).
  const ctaMovil = document.getElementById('cta-movil-fijo');
  const scrollThresholdCTA = 300; // px desde arriba para mostrar el botón

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThresholdCTA) {
      ctaMovil.classList.add('visible');    // opacity:1 + pointer-events:auto
    } else {
      ctaMovil.classList.remove('visible'); // oculto pero sigue en el DOM
    }
  }, { passive: true });
  // ── Stats: contador animado ─────────────────
  // ── Stats: contador animado con requestAnimationFrame ───────────
  // Los contadores leen su valor final desde el atributo data-target del HTML.
  // La animación usa rAF para actualizar el número en cada frame del navegador,
  // calculando el progreso de 0 a 1 en función del tiempo transcurrido.

  const resetCounter = (el) => {
    // Si hay un rAF activo guardado en data-rafId, lo cancelamos para no
    // acumular múltiples animaciones corriendo a la vez sobre el mismo elemento.
    if (el.dataset.rafId) {
      cancelAnimationFrame(Number(el.dataset.rafId));
      delete el.dataset.rafId;
    }
    el.textContent = '0'; // vuelve al estado inicial visible
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10); // valor final desde el HTML
    const duration = 1600; // ms que dura la animación completa
    const start = performance.now(); // referencia de tiempo de alta precisión

    const tick = () => {
      const elapsed = performance.now() - start;
      // progress va de 0.0 a 1.0; Math.min evita que pase de 1 en frames lentos
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * progress);
      // toLocaleString formatea el número con separadores según idioma:
      // 'es-CO' → 1.000  |  'en-US' → 1,000
      el.textContent = Math.floor(current).toLocaleString(currentLang === 'en' ? 'en-US' : 'es-CO');
      if (progress < 1) {
        // Guardamos el id del rAF en un data attribute para poder cancelarlo
        el.dataset.rafId = String(requestAnimationFrame(tick));
      } else {
        delete el.dataset.rafId; // limpiamos al terminar
      }
    };

    resetCounter(el); // asegura estado limpio antes de empezar
    el.dataset.rafId = String(requestAnimationFrame(tick)); // arranca el primer frame
  };

  // statsObserver re-anima los contadores si el usuario scrollea de vuelta
  // a la sección (el observer vigila entrada Y salida del viewport).
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      const item = entry.target;  // .stat-item
      const num = item.querySelector('.stat-num'); // el span con el número

      if (entry.isIntersecting) {
        // hasAnimated evita relanzar si el item nunca salió del viewport.
        if (item.dataset.hasAnimated === 'true') return;
        item.dataset.hasAnimated = 'true';
        // i * 120 ms de delay escalonado: cada stat aparece 120 ms después del anterior.
        setTimeout(() => {
          item.classList.add('visible'); // animación de entrada CSS
          if (num) animateCounter(num); // arranca el conteo numérico
        }, i * 120);
        return;
      }

      // Al salir del viewport reseteamos para que al volver se reanime.
      item.dataset.hasAnimated = 'false';
      item.classList.remove('visible');
      if (num) resetCounter(num);
    });
  }, { threshold: 0.3 }); // 30% visible para empezar (más conservador que el observer general)

  document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));
});

