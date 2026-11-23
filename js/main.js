/* Mobile navigation, filters, FAQ accordion, and quote request dialog. */
(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  // Keep the compact menu keyboard and touch accessible on small screens.
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'মেনু খুলুন' : 'মেনু বন্ধ করুন');
    navigation.classList.toggle('open', !isOpen);
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'মেনু খুলুন');
  }));

  // Filter service cards by the selected category.
  const serviceButtons = [...document.querySelectorAll('[data-filter]')];
  const serviceCards = [...document.querySelectorAll('.service-card')];
  serviceButtons.forEach((button) => button.addEventListener('click', () => {
    serviceButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    serviceCards.forEach((card) => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  }));

  // Case study filters share the same accessible pressed state pattern.
  const projectButtons = [...document.querySelectorAll('[data-project-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  projectButtons.forEach((button) => button.addEventListener('click', () => {
    projectButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach((card) => {
      card.hidden = button.dataset.projectFilter !== 'all' && card.dataset.project !== button.dataset.projectFilter;
    });
  }));

  // Use native details for keyboard and screen-reader friendly FAQ disclosures;
  // keep only one answer expanded at a time.
  document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('toggle', () => {
    if (item.open) document.querySelectorAll('.faq-item').forEach((other) => {
      if (other !== item) other.open = false;
    });
  }));

  const dialog = document.querySelector('.booking-modal');
  const form = document.querySelector('.booking-form');
  const status = document.querySelector('.form-status');
  const serviceSelect = form.elements.service;

  document.querySelectorAll('[data-open-modal]').forEach((trigger) => trigger.addEventListener('click', () => {
    const requestedService = trigger.dataset.service;
    if (requestedService) {
      const matchingOption = [...serviceSelect.options].find((option) => option.textContent.trim() === requestedService);
      serviceSelect.value = matchingOption ? matchingOption.value : 'অন্য / কাস্টম প্রজেক্ট';
    }
    status.textContent = '';
    if (!dialog.open) dialog.showModal();
  }));

  document.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const subject = encodeURIComponent(`নতুন প্রজেক্ট অনুরোধ — ${values.get('service')}`);
    const body = encodeURIComponent(
      `নাম: ${values.get('name')}\nফোন: ${values.get('phone')}\nইমেইল: ${values.get('email') || 'দেওয়া হয়নি'}\nসেবা: ${values.get('service')}\n\nপ্রজেক্টের বিবরণ:\n${values.get('message')}`
    );
    // No backend is configured in this static site, so hand the completed
    // request to the visitor's email app instead of pretending it was sent.
    window.location.href = `mailto:hello@uttoron.agency?subject=${subject}&body=${body}`;
    status.textContent = 'আপনার ইমেইল অ্যাপে অনুরোধটি তৈরি করা হয়েছে। সেখান থেকে পাঠিয়ে দিন।';
    form.reset();
  });
})();
