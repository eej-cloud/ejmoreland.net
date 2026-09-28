const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const readingMode = document.querySelector('.reading-mode');
const contactDrawer = document.querySelector('#contact-drawer');
const contactDrawerTriggers = document.querySelectorAll('[data-contact-drawer-trigger]');
const contactDrawerClose = document.querySelector('.contact-drawer-close');
const contactForm = document.querySelector('#contact-form');
const contactSubmit = contactForm?.querySelector('.contact-submit');
const contactStatus = document.querySelector('#contact-status');
const contactDock = document.querySelector('.contact-dock');
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeColorLight = themeColor?.content || '#fbf4e7';
let contactDrawerLastFocus;

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  if (isOpen) {
    navigation.querySelector('a')?.focus();
  }
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a') && navigation.classList.contains('open')) {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.focus();
  }
});

readingMode?.addEventListener('click', () => {
  const isDimmed = document.body.classList.toggle('dimmed');
  readingMode.setAttribute('aria-pressed', String(isDimmed));
  readingMode.setAttribute('aria-label', isDimmed ? 'Use light reading palette' : 'Use dim reading palette');
  const readingIcon = readingMode.querySelector('[data-reading-icon]');
  if (readingIcon) readingIcon.setAttribute('d', isDimmed
    ? 'M20.8 15.2A8.4 8.4 0 0 1 8.8 3.3 8.5 8.5 0 1 0 20.8 15.2Z'
    : 'M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z');
  if (themeColor) themeColor.content = isDimmed ? '#18213c' : themeColorLight;
});

const closeContactDrawer = () => {
  if (!contactDrawer?.open || contactDrawer.classList.contains('is-closing')) return;
  contactDrawer.classList.remove('is-open');
  contactDrawer.classList.add('is-closing');
  window.setTimeout(() => {
    contactDrawer.close();
    contactDrawer.classList.remove('is-closing');
    contactDrawerLastFocus?.focus();
  }, 460);
};

const openContactDrawer = (trigger = document.activeElement) => {
  if (contactDrawer?.open) return;
  contactDrawerLastFocus = trigger;
  contactDrawer?.showModal();
  window.requestAnimationFrame(() => contactDrawer?.classList.add('is-open'));
  contactDrawerClose?.focus();
};

contactDrawerTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openContactDrawer(trigger);
  });
});

contactDrawerClose?.addEventListener('click', closeContactDrawer);

contactDrawer?.addEventListener('click', (event) => {
  if (event.target === contactDrawer) closeContactDrawer();
});

contactDrawer?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeContactDrawer();
});

contactDrawer?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...contactDrawer.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute('disabled'));
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }

  const submitLabel = contactSubmit?.querySelector('span:first-child');
  contactSubmit?.setAttribute('disabled', '');
  if (submitLabel) submitLabel.textContent = 'Sending…';
  contactStatus.textContent = 'Sending your message…';
  contactStatus.className = 'contact-status';

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Form submission failed');
    contactForm.reset();
    if (submitLabel) submitLabel.textContent = 'Message sent';
    contactStatus.textContent = 'Thanks—your message has been sent.';
    contactStatus.className = 'contact-status is-success';
  } catch {
    contactSubmit?.removeAttribute('disabled');
    if (submitLabel) submitLabel.textContent = 'Send message';
    contactStatus.textContent = 'Your message could not be sent. Please try again in a moment.';
    contactStatus.className = 'contact-status is-error';
  }
});

if (contactDock && 'IntersectionObserver' in window) {
  const dockObserver = new IntersectionObserver((entries) => {
    contactDock.classList.toggle('is-suppressed', entries.some((entry) => entry.isIntersecting));
  }, { threshold: 0.12 });
  document.querySelectorAll('.contact-panel, footer').forEach((target) => dockObserver.observe(target));
}

if (contactDrawer && new URLSearchParams(window.location.search).get('message') === '1') {
  window.requestAnimationFrame(() => openContactDrawer());
}

// Article 2's optional BTS layer is built from moments explicitly discussed in
// the essay; it leaves the published text and citation apparatus untouched.
const articleTwo = document.querySelector('meta[property="og:title"][content="What Comes Before Confidence"]');
if (articleTwo) {
  const page = document.querySelector('.site-shell');
  const article = document.querySelector('.published-article');
  const body = article?.querySelector('.article-body');
  if (page && article && body) {
    page.classList.add('article-bts-page');
    page.dataset.bts = 'on';

    const moments = [
      {
        match: 'The AI did not need to invent false information to make that harder.',
        title: 'Two ideas connected',
        teaser: 'Research and a podcast raised a related question.',
        image: '../assets/article-2-bts-connection.jpg',
        imagePosition: '49% 52%',
        detail: 'I noticed a link between the week’s AI research and a conversation between Hasan Minhaj and Charlie Warzel: true information can still distort the picture when it is selected or framed.'
      },
      {
        match: 'The information may still be true while the sample is bad.',
        title: 'A phrase we didn’t keep',
        teaser: '“Truthful poisoning” stayed tied to its source.',
        image: '../assets/article-2-bts-sourced-term.jpg',
        imagePosition: '8% 52%',
        detail: '“Truthful poisoning” was considered as a possible label, then kept as source-specific Minhaj and Warzel language. The article makes its point through evidence selection instead.'
      },
      {
        match: 'That matters, but I don’t think the useful conclusion is that AI simply makes people overconfident.',
        title: 'Counterevidence stayed in',
        teaser: 'Some research showed AI advice improving decisions.',
        image: '../assets/article-2-bts-counterevidence.jpg',
        imagePosition: '91% 35%',
        detail: 'The research didn’t support a blanket claim that AI worsens judgment. Some findings showed informative advice improving or depolarizing decisions, even when sycophancy was present.'
      },
      {
        match: 'True facts can still leave you with the wrong picture.',
        title: 'The idea stayed; the opening changed',
        teaser: 'The first prose didn’t feel like my voice.',
        image: '../assets/article-2-bts-revision.jpg',
        imagePosition: '58% 42%',
        detail: 'The first opening felt too dramatic and too certain. I set it aside; the research worked better as what changed my question than as proof in a finished argument.'
      }
    ];

    const layout = document.createElement('div');
    layout.className = 'article-bts-layout';
    body.parentNode.insertBefore(layout, body);
    layout.append(body);

    const rail = document.createElement('aside');
    rail.className = 'article-bts-rail';
    rail.setAttribute('aria-label', 'Behind-the-scenes notes');
    const anchors = [];
    const notes = [];
    moments.forEach((moment, index) => {
      const anchor = [...body.querySelectorAll(':scope > p')].find((paragraph) => paragraph.textContent.trim().startsWith(moment.match));
      if (!anchor) return;
      anchor.classList.add('bts-paired');
      anchor.id = 'article-2-bts-anchor-' + (index + 1);
      anchors.push(anchor);

      const note = document.createElement('details');
      note.className = 'article-bts-note';
      note.dataset.anchor = anchor.id;
      note.innerHTML = '<summary><img class="article-bts-art" alt="" aria-hidden="true"><span class="article-bts-copy"><span class="article-bts-title"></span><span class="article-bts-teaser"></span></span><svg class="article-bts-disclosure" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="article-bts-quest" aria-hidden="true">?</span></summary><div class="article-bts-detail"><p></p></div>';
      note.querySelector('.article-bts-title').textContent = moment.title;
      note.querySelector('.article-bts-teaser').textContent = moment.teaser;
      note.querySelector('.article-bts-art').src = moment.image;
      note.querySelector('.article-bts-art').style.objectPosition = moment.imagePosition;
      note.querySelector('.article-bts-detail p').textContent = moment.detail;
      rail.append(note);
      notes.push(note);
    });
    const compareEssayPosition = (left, right) => {
      const relation = left.compareDocumentPosition(right);
      if (relation & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (relation & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    };
    anchors.sort(compareEssayPosition);
    notes.sort((left, right) => compareEssayPosition(
      document.getElementById(left.dataset.anchor),
      document.getElementById(right.dataset.anchor)
    ));
    layout.append(rail);

    const shelf = document.createElement('aside');
    shelf.className = 'site-shelf article-bts-shelf';
    shelf.dataset.sharedShelf = 'true';
    shelf.setAttribute('aria-label', 'Quick actions');
    shelf.innerHTML = '<nav class="shelf-menu" aria-label="Quick links" id="article-2-shelf-menu" aria-hidden="true" inert><a href="../index.html" aria-label="Home" title="Home"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m3 10.5 9-7.2 9 7.2v10h-6v-6H9v6H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></a><a href="../essays/index.html" aria-label="Essays" title="Essays"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 5.2c3.1-.8 6-.3 8.5 1.5v13c-2.5-1.8-5.4-2.3-8.5-1.5zM20.5 5.2c-3.1-.8-6-.3-8.5 1.5v13c-2.5-1.8-5.4-2.3-8.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></a><a href="../about/?message=1#contact-form" aria-label="Contact EJ" title="Contact EJ"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 5.5h17v13h-17zM4 6l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a><a href="https://www.linkedin.com/in/ej-moreland-a79a42" aria-label="LinkedIn" title="LinkedIn"><img src="../assets/linkedin-in-opaque-white.png" alt=""></a></nav><div class="shelf-bar"><button class="shelf-primary article-bts-toggle" type="button" role="switch" aria-checked="true" aria-label="Behind-the-scenes layer"><span class="article-bts-toggle-label">BTS</span><span class="article-bts-switch" aria-hidden="true"><span></span></span></button><button class="shelf-menu-toggle" type="button" aria-expanded="false" aria-controls="article-2-shelf-menu" aria-label="Open quick links"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>';
    document.body.append(shelf);

    const menuToggle = shelf.querySelector('.shelf-menu-toggle');
    const menu = shelf.querySelector('.shelf-menu');
    const setMenuOpen = (open) => {
      shelf.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close quick links' : 'Open quick links');
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
    };
    menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) setMenuOpen(false); });
    document.addEventListener('click', (event) => { if (!shelf.contains(event.target)) setMenuOpen(false); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    const mobileQuery = window.matchMedia('(max-width: 650px)');
    const slots = new Map();
    anchors.forEach((anchor, index) => {
      const slot = document.createElement('div');
      slot.className = 'article-bts-slot';
      anchor.after(slot);
      slots.set(notes[index], slot);
    });
    const placeNotes = () => {
      if (mobileQuery.matches) {
        rail.style.minHeight = '';
        notes.forEach((note) => {
          note.style.top = '';
          slots.get(note)?.append(note);
        });
        return;
      }
      notes.forEach((note) => rail.append(note));
      let priorBottom = -24;
      const railTop = rail.getBoundingClientRect().top;
      notes.forEach((note) => {
        const anchor = document.getElementById(note.dataset.anchor);
        if (!anchor) return;
        const rect = anchor.getBoundingClientRect();
        const ideal = rect.top + rect.height / 2 - railTop - note.querySelector('summary').getBoundingClientRect().height / 2;
        const top = Math.max(0, ideal, priorBottom + 26);
        note.style.top = top + 'px';
        priorBottom = top + note.getBoundingClientRect().height;
      });
      rail.style.minHeight = Math.max(body.offsetHeight, priorBottom) + 'px';
    };
    notes.forEach((note) => note.addEventListener('toggle', () => {
      if (note.open) notes.forEach((other) => { if (other !== note) other.open = false; });
      window.requestAnimationFrame(placeNotes);
    }));
    const applyBtsState = (on) => {
      page.dataset.bts = on ? 'on' : 'off';
      shelf.querySelector('.article-bts-toggle').setAttribute('aria-checked', String(on));
      notes.forEach((note) => { note.open = false; });
      applyFocus();
      window.requestAnimationFrame(placeNotes);
    };
    shelf.querySelector('.article-bts-toggle').addEventListener('click', () => applyBtsState(page.dataset.bts !== 'on'));

    let currentAnchor = null;
    const applyFocus = () => {
      anchors.forEach((anchor) => anchor.classList.toggle('is-current', page.dataset.bts === 'on' && anchor.id === currentAnchor));
      notes.forEach((note) => note.classList.toggle('is-current', page.dataset.bts === 'on' && note.dataset.anchor === currentAnchor));
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { entry.target.dataset.focus = entry.isIntersecting ? '1' : '0'; });
        const focused = anchors.filter((anchor) => anchor.dataset.focus === '1')
          .sort((a, b) => Math.abs(a.getBoundingClientRect().top + a.offsetHeight / 2 - window.innerHeight * .48) - Math.abs(b.getBoundingClientRect().top + b.offsetHeight / 2 - window.innerHeight * .48))[0];
        currentAnchor = focused?.id || null;
        applyFocus();
      }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
      anchors.forEach((anchor) => observer.observe(anchor));
    }
    window.addEventListener('resize', placeNotes, { passive: true });
    window.addEventListener('load', placeNotes, { once: true });
    if (document.fonts?.ready) document.fonts.ready.then(placeNotes);
    placeNotes();
  }
}

if (!document.querySelector('.site-shelf')) {
  const shelf = document.createElement('aside');
  const essayRoot = /\/essays\//.test(window.location.pathname);
  const aboutRoot = /\/about\//.test(window.location.pathname);
  const relativeRoot = essayRoot || aboutRoot ? '../' : './';
  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m3 10.5 9-7.2 9 7.2v10h-6v-6H9v6H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    essays: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 5.2c3.1-.8 6-.3 8.5 1.5v13c-2.5-1.8-5.4-2.3-8.5-1.5zM20.5 5.2c-3.1-.8-6-.3-8.5 1.5v13c2.5-1.8 5.4-2.3 8.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 5.5h17v13h-17zM4 6l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    notes: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 4.5h14v15H5zM8 8h8M8 12h8m-8 4h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    top: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  let primary = '<a class="shelf-primary" href="' + relativeRoot + 'index.html#writing" aria-label="Browse essays" title="Browse essays">' + icons.essays + '</a>';
  if (document.querySelector('.notes')) primary = '<a class="shelf-primary" href="#notes-title" aria-label="Go to sources" title="Sources">' + icons.notes + '</a>';
  else if (document.querySelector('.contact-panel')) primary = '<a class="shelf-primary" href="' + relativeRoot + 'about/?message=1#contact-form" aria-label="Contact EJ" title="Contact EJ">' + icons.contact + '</a>';
  else if (document.querySelector('.essay-index')) primary = '<a class="shelf-primary" href="#main" aria-label="Back to top" title="Back to top">' + icons.top + '</a>';
  else if (document.querySelector('.article-body')) primary = '<a class="shelf-primary" href="#article-title" aria-label="Back to article title" title="Back to article title">' + icons.top + '</a>';
  else if (document.querySelector('.featured-essay')) primary = '<a class="shelf-primary" href="#writing" aria-label="Browse selected writing" title="Selected writing">' + icons.essays + '</a>';
  else if (aboutRoot) primary = '<a class="shelf-primary" href="?message=1#contact-form" aria-label="Contact EJ" title="Contact EJ">' + icons.contact + '</a>';
  else if (document.querySelector('.page-hero')) primary = '<a class="shelf-primary" href="#main" aria-label="Back to top" title="Back to top">' + icons.top + '</a>';
  shelf.className = 'site-shelf';
  shelf.dataset.sharedShelf = 'true';
  shelf.setAttribute('aria-label', 'Quick actions');
  shelf.innerHTML = '<nav class="shelf-menu" aria-label="Quick links" id="shared-shelf-menu" aria-hidden="true" inert>' +
    '<a href="' + relativeRoot + 'index.html" aria-label="Home" title="Home">' + icons.home + '</a>' +
    '<a href="' + relativeRoot + 'essays/index.html" aria-label="Essays" title="Essays">' + icons.essays + '</a>' +
    '<a href="' + relativeRoot + 'about/?message=1#contact-form" aria-label="Contact EJ" title="Contact EJ">' + icons.contact + '</a>' +
    '<a href="https://www.linkedin.com/in/ej-moreland-a79a42" aria-label="LinkedIn" title="LinkedIn"><img src="' + relativeRoot + 'assets/linkedin-in-opaque-white.png" alt=""></a>' +
    '</nav><div class="shelf-bar">' + primary +
    '<button class="shelf-menu-toggle" type="button" aria-expanded="false" aria-controls="shared-shelf-menu" aria-label="Open quick links">' +
    '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button></div>';
  document.body.append(shelf);

  const menuToggle = shelf.querySelector('.shelf-menu-toggle');
  const menu = shelf.querySelector('.shelf-menu');
  const setMenuOpen = (open) => {
    shelf.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close quick links' : 'Open quick links');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
  };
  menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!shelf.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}
