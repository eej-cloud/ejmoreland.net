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
let contactDrawerLastFocus;

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.lastElementChild.textContent = isOpen ? '−' : '+';
  if (isOpen) {
    navigation.querySelector('a')?.focus();
  }
});

navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a') && navigation.classList.contains('open')) {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.lastElementChild.textContent = '+';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.lastElementChild.textContent = '+';
    menuToggle.focus();
  }
});

readingMode?.addEventListener('click', () => {
  const isDimmed = document.body.classList.toggle('dimmed');
  readingMode.setAttribute('aria-pressed', String(isDimmed));
  readingMode.textContent = isDimmed ? 'Restore page' : 'Dim the page';
  if (themeColor) themeColor.content = isDimmed ? '#18213c' : '#fbf4e7';
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

contactDrawerTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    contactDrawerLastFocus = document.activeElement;
    contactDrawer?.showModal();
    window.requestAnimationFrame(() => contactDrawer?.classList.add('is-open'));
    contactDrawerClose?.focus();
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
