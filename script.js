const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
const readingMode = document.querySelector('.reading-mode');

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
});
