const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const form = document.querySelector('.contact-form');
const phoneInput = document.querySelector('input[name="phone"]');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !burger.contains(event.target)) {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}


if (phoneInput) {
  const cleanPhoneValue = () => {
    const startsWithPlus = phoneInput.value.trim().startsWith('+');
    const digits = phoneInput.value.replace(/\D/g, '');
    phoneInput.value = `${startsWithPlus ? '+' : ''}${digits}`;
  };

  phoneInput.addEventListener('keydown', (event) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (event.key === '+' && phoneInput.selectionStart === 0 && !phoneInput.value.includes('+')) {
      return;
    }

    if (/^\d$/.test(event.key)) {
      return;
    }

    event.preventDefault();
  });

  phoneInput.addEventListener('input', cleanPhoneValue);
  phoneInput.addEventListener('paste', () => {
    setTimeout(cleanPhoneValue, 0);
  });
}

if (form) {
  const formFields = form.querySelectorAll('input[type="text"], input[type="tel"], textarea');

  formFields.forEach((field) => {
    field.addEventListener('blur', () => {
      field.classList.add('is-touched');
    });

    field.addEventListener('input', () => {
      if (field.checkValidity()) {
        field.classList.remove('is-touched');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.classList.add('is-validated');
    formFields.forEach((field) => field.classList.add('is-touched'));

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
    form.reset();
    form.classList.remove('is-validated');
    formFields.forEach((field) => field.classList.remove('is-touched'));
  });
}
