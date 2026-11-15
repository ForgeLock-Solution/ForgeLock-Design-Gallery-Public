const menuButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');
if (menuButton && nav) {
  const closeMenu = (restoreFocus = false) => {
    const wasOpen = nav.classList.contains('is-open');
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    if (restoreFocus && wasOpen) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  if (window.matchMedia) {
    const desktop = window.matchMedia('(min-width: 921px)');
    desktop.addEventListener?.('change', e => { if (e.matches) closeMenu(); });
  }
}
const buttons = Array.from(document.querySelectorAll('.filter'));
const cards = Array.from(document.querySelectorAll('.service-card'));
const filterStatus = document.querySelector('#filter-status');
buttons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  let count = 0;
  buttons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => {
    const show = category === 'todos' || card.dataset.category === category;
    card.hidden = !show;
    if (show) count++;
  });
  if (filterStatus) filterStatus.textContent = `${count} ${count === 1 ? 'tratamiento' : 'tratamientos'} de demostración`;
}));
const form = document.querySelector('#booking-form');
if (form) {
  const result = document.querySelector('#booking-result');
  const service = form.elements.namedItem('service');
  const dateInput = form.elements.namedItem('date');
  const time = form.elements.namedItem('time');
  const today = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };
  const show = (message, error = false) => {
    result.textContent = message;
    result.classList.toggle('is-error', error);
  };
  const updateDate = () => { dateInput.min = today(); };
  updateDate();
  form.addEventListener('submit', event => {
    event.preventDefault();
    updateDate();
    const value = dateInput.value;
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : null;
    const validDate = parsed && !Number.isNaN(parsed.valueOf()) &&
      `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}` === value;
    if (!['Renacer', 'Equilibrio', 'Esencia'].includes(service.value) ||
        !['09:00','11:30','15:00','17:00'].includes(time.value) || !validDate) {
      show('Selecciona un ritual, una fecha válida y una hora para probar el simulador.', true);
      return;
    }
    if (value < today()) {
      show('Selecciona una fecha de hoy en adelante.', true);
      dateInput.focus();
      return;
    }
    show(`Simulación: ${service.value}, ${value} a las ${time.value}. Esta NO es una cita real; no se enviaron ni guardaron datos.`);
  });
}
