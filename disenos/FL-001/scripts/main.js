const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-principal');
if (menuToggle && navigation) {
  const closeNav = ({ restoreFocus = false } = {}) => {
    const wasOpen = navigation.classList.contains('open');
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    if (restoreFocus && wasOpen) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  navigation.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => closeNav())
  );
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav({ restoreFocus: true });
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeNav();
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) closeNav();
  });
}
const filters = [...document.querySelectorAll('.filter')];
const dishes = [...document.querySelectorAll('.dish')];
const feedback = document.querySelector('#filter-feedback');
filters.forEach((button) => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach((other) => {
    const active = other === button;
    other.classList.toggle('active', active);
    other.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  dishes.forEach((dish) => {
    const visible = category === 'todos' || dish.dataset.category === category;
    dish.hidden = !visible;
    if (visible) count += 1;
  });
  if (feedback) feedback.textContent = `${count} ${count === 1 ? 'propuesta' : 'propuestas'} de demostración`;
}));
const form = document.querySelector('#reservation-form');
const result = document.querySelector('#form-result');
if (form && result) {
  const dateInput = form.elements.namedItem('date');
  const timeInput = form.elements.namedItem('time');
  const peopleInput = form.elements.namedItem('people');
  const todayLocal = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const showMessage = (message, invalid = false) => {
    result.classList.toggle('error', invalid);
    result.textContent = message;
  };
  const updateMinDate = () => {
    if (dateInput) dateInput.min = todayLocal();
  };
  updateMinDate();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateMinDate();
    const date = dateInput?.value ?? '';
    const time = timeInput?.value ?? '';
    const people = peopleInput?.value ?? '';
    const validTime = ['12:00','13:30','19:00','20:30'].includes(time);
    const validPeople = ['1','2','3','4','5','6'].includes(people);
    const selected = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00`) : null;
    const validDate = selected !== null && !Number.isNaN(selected.valueOf())
      && `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}` === date;
    if (!validDate || !validTime || !validPeople) {
      showMessage('Selecciona una fecha válida, un horario y el número de personas para probar el formulario.', true);
      return;
    }
    if (date < todayLocal()) {
      showMessage('Elige una fecha de hoy en adelante para la simulación.', true);
      dateInput?.focus();
      return;
    }
    showMessage(`Simulación completada: ${people} ${people === '1' ? 'persona' : 'personas'}, ${date} a las ${time}. Esto NO es una reserva real; no se enviaron ni guardaron datos.`);
  });
}
