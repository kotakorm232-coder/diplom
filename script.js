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

const privacyModal = document.querySelector('[data-privacy-modal]');
const privacyOpenButtons = document.querySelectorAll('[data-privacy-open]');
const privacyCloseButtons = document.querySelectorAll('[data-privacy-close]');

if (privacyModal) {
  const openPrivacyModal = () => {
    privacyModal.classList.add('is-open');
    privacyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closePrivacyModal = () => {
    privacyModal.classList.remove('is-open');
    privacyModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  privacyOpenButtons.forEach((button) => {
    button.addEventListener('click', openPrivacyModal);
  });

  privacyCloseButtons.forEach((button) => {
    button.addEventListener('click', closePrivacyModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && privacyModal.classList.contains('is-open')) {
      closePrivacyModal();
    }
  });
}

const projectCards = document.querySelectorAll('[data-project-card]');
const projectModal = document.querySelector('[data-project-modal]');
const projectModalTitle = document.querySelector('#project-modal-title');
const projectModalImage = document.querySelector('[data-gallery-image]');
const projectDots = document.querySelector('[data-gallery-thumbs]');
const projectPrevButton = document.querySelector('[data-gallery-prev]');
const projectNextButton = document.querySelector('[data-gallery-next]');
const projectCloseButtons = document.querySelectorAll('[data-project-close]');

const projectGalleries = {
  1: {
    title: 'Белая угловая кухня',
    images: [
      { src: '1.png', alt: 'Белая угловая кухня — фото 1' },
      { src: '2.png', alt: 'Белая угловая кухня — фото 2' },
      { src: '3.png', alt: 'Белая угловая кухня — фото 3' },
    ],
  },
  2: {
    title: 'Шкаф-купе с рисунком',
    images: [
      { src: '4.png', alt: 'Шкаф-купе с рисунком — фото 1' },
      { src: '5.png', alt: 'Шкаф-купе с рисунком — фото 2' },
      { src: '6.png', alt: 'Шкаф-купе с рисунком — фото 3' },
    ],
  },
  3: {
    title: 'Шкаф в мансарде',
    images: [
      { src: '7.png', alt: 'Шкаф в мансарде — фото 1' },
      { src: '8.png', alt: 'Шкаф в мансарде — фото 2' },
    ],
  },
  4: {
    title: 'Кухня с мраморной панелью',
    images: [
      { src: '9.png', alt: 'Кухня с мраморной панелью — фото 1' },
      { src: '10.png', alt: 'Кухня с мраморной панелью — фото 2' },
    ],
  },
  5: {
    title: 'Светлая деревянная кухня',
    images: [
      { src: '11.png', alt: 'Светлая деревянная кухня — фото 1' },
      { src: '12.png', alt: 'Светлая деревянная кухня — фото 2' },
      { src: '13.png', alt: 'Светлая деревянная кухня — фото 3' },
    ],
  },
  6: {
    title: 'Белая кухня с островом',
    images: [
      { src: '14.png', alt: 'Белая кухня с островом — фото 1' },
      { src: '15.png', alt: 'Белая кухня с островом — фото 2' },
      { src: '16.png', alt: 'Белая кухня с островом — фото 3' },
    ],
  },
};

let activeProjectId = null;
let activeImageIndex = 0;
let lastFocusedProjectCard = null;

const setProjectImage = (index) => {
  const gallery = projectGalleries[activeProjectId];
  if (!gallery || !projectModalImage || !projectDots) {
    return;
  }

  activeImageIndex = (index + gallery.images.length) % gallery.images.length;
  const image = gallery.images[activeImageIndex];
  projectModalImage.src = image.src;
  projectModalImage.alt = image.alt;

  const dots = projectDots.querySelectorAll('.project-gallery__dot');
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeImageIndex;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-current', String(isActive));
  });
};

const renderProjectDots = () => {
  const gallery = projectGalleries[activeProjectId];
  if (!gallery || !projectDots) {
    return;
  }

  projectDots.innerHTML = '';
  gallery.images.forEach((image, index) => {
    const button = document.createElement('button');
    button.className = 'project-gallery__dot';
    button.type = 'button';
    button.setAttribute('aria-label', `Показать фото ${index + 1}`);
    button.addEventListener('click', () => setProjectImage(index));
    projectDots.appendChild(button);
  });
};

const openProjectModal = (projectId, opener) => {
  const gallery = projectGalleries[projectId];
  if (!projectModal || !gallery) {
    return;
  }

  activeProjectId = projectId;
  activeImageIndex = 0;
  lastFocusedProjectCard = opener || null;

  if (projectModalTitle) {
    projectModalTitle.textContent = gallery.title;
  }

  renderProjectDots();
  setProjectImage(0);

  projectModal.classList.add('is-open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const closeButton = projectModal.querySelector('[data-project-close]');
  if (closeButton) {
    closeButton.focus();
  }
};

const closeProjectModal = () => {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (projectModalImage) {
    projectModalImage.removeAttribute('src');
    projectModalImage.alt = '';
  }

  if (lastFocusedProjectCard) {
    lastFocusedProjectCard.focus();
  }
};

projectCards.forEach((card) => {
  card.addEventListener('click', () => openProjectModal(card.dataset.projectId, card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectModal(card.dataset.projectId, card);
    }
  });
});

projectCloseButtons.forEach((button) => {
  button.addEventListener('click', closeProjectModal);
});

if (projectPrevButton) {
  projectPrevButton.addEventListener('click', () => setProjectImage(activeImageIndex - 1));
}

if (projectNextButton) {
  projectNextButton.addEventListener('click', () => setProjectImage(activeImageIndex + 1));
}

document.addEventListener('keydown', (event) => {
  if (!projectModal || !projectModal.classList.contains('is-open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeProjectModal();
  }

  if (event.key === 'ArrowLeft') {
    setProjectImage(activeImageIndex - 1);
  }

  if (event.key === 'ArrowRight') {
    setProjectImage(activeImageIndex + 1);
  }
});
