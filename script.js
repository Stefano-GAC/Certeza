window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        'beer-dark': '#163d2a',
        'beer-gold': '#c9a53e',
        'beer-amber': '#3d8a5e',
        'beer-light': '#eee4d4',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  // ── Pantalla de carga ─────────────────────
  const loader = document.getElementById('pantalla-carga');
  const minDuration = 2200;
  const start = Date.now();
  const hideLoader = () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDuration - elapsed);
    setTimeout(() => loader && loader.classList.add('oculta'), remaining);
  };
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
  // ── Slider de cervezas estilo Alafut ────────────
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
    const LOOP_BEERS = [...ALAFUT_BEERS, ...ALAFUT_BEERS];
    sliderTrack.style.setProperty('--beers-count', String(ALAFUT_BEERS.length));
    sliderTrack.innerHTML = LOOP_BEERS.map((beer) => `
      <article class="alafut-beers-slide" role="listitem" aria-label="${beer.name}">
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
    const node = document.getElementById(id);
    if (!node) return;
    const onlyText = node.querySelector('.nav-logo-name-compact');
    if (onlyText && node.children.length === 1) return;
    node.innerHTML = '<span class="nav-logo-name nav-logo-name-compact">CERTEZA</span>';
  };

  ensureCompactText('nav-logo-compact');
  ensureCompactText('nav-logo-compact-mobile');

  const updateNavbarOnScroll = () => {
    const isScrolled = window.scrollY > 56;
    navbar.classList.toggle('scrolled', isScrolled);
    navbar.classList.toggle('logo-compact', isScrolled);
    // Mobile bar logos
    const lm = document.getElementById('nav-logo-large-mobile');
    const cm = document.getElementById('nav-logo-compact-mobile');
    if (lm) lm.style.opacity = isScrolled ? '0' : '1';
    if (cm) cm.style.opacity = isScrolled ? '1' : '0';
  };
  updateNavbarOnScroll();
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

  const I18N = {
    es: {
      pageTitle: 'Certeza — Cerveza Artesanal',
      loaderTagline: 'CERVECERÍA ARTESANAL',
      nav: {
        menu: 'MENU',
        book: 'BOOK',
        phoneTitle: 'Telefono',
        phoneAria: 'Telefono',
        mailTitle: 'Email',
        mailAria: 'Email',
        langTitle: 'Cambiar idioma',
        langAria: 'Cambiar idioma',
        searchTitle: 'Buscar',
        searchAria: 'Buscar',
        openMenuAria: 'Abrir menu',
        mobile: ['Inicio', 'Cervezas', 'Contacto', 'Book'],
      },
      hero: {
        sub: 'Cerveza Artesanal',
        desc: 'Espuma dorada, aroma intenso y un caracter que deja huella. Cada sorbo convierte el momento en una experiencia irresistible.',
        explore: 'Explorar Cervezas',
        contact: 'Contacto',
      },
      stats: {
        labels: ['Variedades artesanales', 'Clientes felices', 'Elaborando con pasión', 'Eventos realizados'],
        thirdSuffix: ' años',
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
        desc: 'Color, espuma y energia en una sola toma. Mira el video y deja que Certeza hable por si sola.',
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
        menu: 'MENU',
        book: 'BOOK',
        phoneTitle: 'Phone',
        phoneAria: 'Phone',
        mailTitle: 'Email',
        mailAria: 'Email',
        langTitle: 'Switch language',
        langAria: 'Switch language',
        searchTitle: 'Search',
        searchAria: 'Search',
        openMenuAria: 'Open menu',
        mobile: ['Home', 'Beers', 'Contact', 'Book'],
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

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  const applyLanguage = (lang) => {
    const t = I18N[lang] || I18N.es;
    document.documentElement.lang = lang;
    document.title = t.pageTitle;

    const img = document.getElementById('lang-flag');
    if (img) {
      img.src = LANG_IMGS[lang].src;
      img.srcset = LANG_IMGS[lang].src2x + ' 2x';
      img.alt = LANG_IMGS[lang].alt;
    }

    setText('.loader-tagline', t.loaderTagline);

    const navLabels = document.querySelectorAll('.nav-desktop-grid .nav-box-label');
    if (navLabels[0]) navLabels[0].textContent = t.nav.menu;
    if (navLabels[1]) navLabels[1].textContent = t.nav.book;
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

    setText('#hero-sub', t.hero.sub);
    setText('#hero-desc', t.hero.desc);
    const heroBtns = document.querySelectorAll('.hero-btns a');
    if (heroBtns[0]) heroBtns[0].textContent = t.hero.explore;
    if (heroBtns[1]) heroBtns[1].textContent = t.hero.contact;

    const statLabels = document.querySelectorAll('.stats-section .stat-label');
    statLabels.forEach((el, i) => {
      if (t.stats.labels[i]) el.textContent = t.stats.labels[i];
    });
    const statSuffix = document.querySelectorAll('.stats-section .stat-suffix');
    if (statSuffix[2]) statSuffix[2].textContent = t.stats.thirdSuffix;

    setText('.alafut-beers-heading', t.beersHeading);

    const galleryTitle = document.querySelector('#galeria h2');
    if (galleryTitle) {
      galleryTitle.innerHTML = `${t.gallery.titlePrefix}<span style="color:#c9a53e">${t.gallery.titleAccent}</span>`;
    }
    const gallerySub = document.querySelector('#galeria h2 + p');
    if (gallerySub) gallerySub.textContent = t.gallery.subtitle;
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

    setText('.impacto-kicker', t.impacto.kicker);
    const impactoTitle = document.querySelector('.impacto-copy h2');
    if (impactoTitle) {
      impactoTitle.innerHTML = `${t.impacto.title}<span>${t.impacto.titleAccent}</span>`;
    }
    setText('.impacto-desc', t.impacto.desc);
    setText('.impacto-cta', t.impacto.cta);
    setText('.impacto-video-tag', t.impacto.tag);

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

    const footerCols = document.querySelectorAll('footer .col-12.col-md-4');
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
    setText('footer .text-center .mb-0', t.footer.rights);

    const wa = document.getElementById('whatsapp-flotante');
    if (wa) {
      wa.title = t.wa.title;
      wa.setAttribute('aria-label', t.wa.aria);
    }

    setText('#cta-movil-fijo .cta-movil-btn', t.mobileCta);

    currentLang = lang;
    localStorage.setItem('certeza-lang', lang);
  };

  let currentLang = localStorage.getItem('certeza-lang') || document.documentElement.lang || 'es';
  if (!I18N[currentLang]) currentLang = 'es';

  window.toggleLang = function () {
    const next = currentLang === 'es' ? 'en' : 'es';
    applyLanguage(next);
  };

  applyLanguage(currentLang);

  // ── Hero: animaciones de entrada ────────────────
  window.addEventListener('load', () => {
    const ids = ['hero-content', 'hero-line', 'hero-h1', 'hero-sub', 'hero-desc', 'hero-btns'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('visible');
      }
    });
  });

  // ── Hero: crossfade de videos ───────────────────
  const CROSSFADE_MS = 1200;
  const videos = [
    document.getElementById('video0'),
    document.getElementById('video1'),
    document.getElementById('video2'),
  ].filter(Boolean);
  let activeIdx = 0;
  let isCrossfading = false;

  function startCrossfade() {
    if (isCrossfading) {
      return;
    }
    isCrossfading = true;

    const nextIdx = (activeIdx + 1) % videos.length;
    const nextVideo = videos[nextIdx];
    nextVideo.currentTime = 0;
    nextVideo.play().catch(() => {});

    // El siguiente sube encima y aparece
    nextVideo.style.zIndex = '2';
    nextVideo.style.opacity = '1';
    // El actual se queda abajo y desaparece
    videos[activeIdx].style.zIndex = '1';
    videos[activeIdx].style.opacity = '0';

    setTimeout(() => {
      activeIdx = nextIdx;
      isCrossfading = false;
    }, CROSSFADE_MS);
  }

  videos.forEach(v => v.addEventListener('ended', startCrossfade));

  // Iniciar primer video
  if (videos[0]) {
    videos[0].play().catch(() => {});
  }

  // ── Footer links hover ──────────────────────────
  document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.color = '#c9a53e';
    });
    link.addEventListener('mouseleave', () => {
      link.style.color = '#d1d5db';
    });
  });

  // ── Intersection Observer: animaciones al scrollear ──
  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observar elementos con animación on-scroll
  document.querySelectorAll('.gallery-title, .section-line, .beer-card, .footer-content, .timeline-card, .eventos-card, .timeline-header, .eventos-header').forEach(el => {
    observer.observe(el);
  });

  // ── Timeline: video hover ──
  document.querySelectorAll('.timeline-card').forEach(card => {
    const video = card.querySelector('.timeline-video');
    if (!video) return;
    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });

  // ── CTA Móvil Fijo (mostrar al scrollear) ────────────
  const ctaMovil = document.getElementById('cta-movil-fijo');
  const scrollThresholdCTA = 300;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThresholdCTA) {
      ctaMovil.classList.add('visible');
    } else {
      ctaMovil.classList.remove('visible');
    }
  }, { passive: true });
  // ── Stats: contador animado ─────────────────
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString(currentLang === 'en' ? 'en-US' : 'es-CO');
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      setTimeout(() => {
        item.classList.add('visible');
        const num = item.querySelector('.stat-num');
        if (num) animateCounter(num);
      }, i * 120);
      statsObserver.unobserve(item);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));});

