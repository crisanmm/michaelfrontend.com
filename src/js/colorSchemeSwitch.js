const colorSchemeSwitch = document.querySelector('.header__color-scheme-switch');
const sunIcon = document.querySelector('.header_color-scheme-switch-icon--sun');
const moonIcon = document.querySelector('.header_color-scheme-switch-icon--moon');

colorSchemeSwitch.classList.remove('hidden');
colorSchemeSwitch.addEventListener('click', () => {
  const currentLightScheme = getCurrentLightScheme();
  if (currentLightScheme === 'dark') {
    switchToLightScheme();
  } else {
    switchToDarkScheme();
  }
});

window.addEventListener('load', () => {
  if (window.matchMedia) {
    const currentLightScheme = getCurrentLightScheme();
    if (currentLightScheme === 'light') {
      switchToLightScheme();
    } else {
      switchToDarkScheme();
    }
  }
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (mediaQueryEvent) => {
  if (mediaQueryEvent.matches) {
    switchToLightScheme();
  } else {
    switchToDarkScheme();
  }
});

function getCurrentLightScheme() {
  if (document.body.classList.contains('dark')) return 'dark';
  if (document.body.classList.contains('light')) return 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  if (mediaQuery.matches) return 'light';

  return 'dark';
}

function switchToLightScheme() {
  moonIcon.classList.add('hidden');
  sunIcon.classList.remove('hidden');
  document.body.classList.remove('dark');
  document.body.classList.add('light');
}

function switchToDarkScheme() {
  sunIcon.classList.add('hidden');
  moonIcon.classList.remove('hidden');
  document.body.classList.remove('light');
  document.body.classList.add('dark');
}
