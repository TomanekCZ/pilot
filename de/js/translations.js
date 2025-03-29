// Translations object - will be loaded from JSON
let translations = {};

// Language configuration
const defaultLanguage = 'cs';
const supportedLanguages = ['cs', 'en', 'de'];

// Load translations
async function loadTranslations() {
  try {
    const response = await fetch('/locales/translations.json');
    translations = await response.json();
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Function to get translation
function getTranslation(key, lang) {
  const keys = key.split('.');
  let current = translations;
  
  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    current = current[k];
  }
  
  return current[lang] || current[defaultLanguage] || key;
}

// Function to get current language from URL
function getCurrentLanguage() {
  const path = window.location.pathname;
  const langMatch = path.match(/^\/(cs|en|de)/);
  return langMatch ? langMatch[1] : defaultLanguage;
}

// Function to change language
async function changeLanguage(lang) {
  if (!supportedLanguages.includes(lang)) {
    console.error('Unsupported language:', lang);
    return;
  }

  const currentPath = window.location.pathname;
  
  // Generate new URL
  let newPath;
  if (currentPath === '/' || currentPath === '') {
    newPath = lang === defaultLanguage ? '/' : `/${lang}`;
  } else {
    // Remove current language prefix if it exists
    const pathWithoutLang = currentPath.replace(/^\/(cs|en|de)/, '');
    newPath = lang === defaultLanguage ? pathWithoutLang : `/${lang}${pathWithoutLang}`;
  }

  // Update URL using History API
  window.history.pushState({}, '', newPath);
  
  // Update page content
  await updateContent(lang);
  
  // Store language preference
  localStorage.setItem('i18nextLng', lang);
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// Function to update page content
async function updateContent(lang) {
  // Ensure translations are loaded
  if (Object.keys(translations).length === 0) {
    await loadTranslations();
  }

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, lang);
    if (translation) {
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
        element.setAttribute('content', translation);
      } else {
        element.textContent = translation;
      }
    }
  });

  // Update meta tags
  updateMetaTags(lang);
  
  // Update language selector UI
  updateLanguageSelector(lang);
}

// Function to update meta tags for SEO
function updateMetaTags(lang) {
  // Update title
  const titleTranslation = getTranslation('meta.title', lang);
  if (titleTranslation) {
    document.title = titleTranslation;
  }
  
  // Update description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    const descriptionTranslation = getTranslation('meta.description', lang);
    if (descriptionTranslation) {
      descriptionMeta.content = descriptionTranslation;
    }
  }

  // Update hreflang tags
  updateHreflangTags();
}

// Function to update language selector UI
function updateLanguageSelector(currentLang) {
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(button => {
    const buttonLang = button.getAttribute('data-lang');
    if (buttonLang === currentLang) {
      button.classList.add('active');
      // Update the displayed language in the selector
      const langDisplay = button.querySelector('span');
      if (langDisplay) {
        langDisplay.textContent = getTranslation(`languages.${currentLang}`, currentLang);
      }
    } else {
      button.classList.remove('active');
    }
  });
}

// Function to update hreflang tags
function updateHreflangTags() {
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Get current path without language prefix
  const currentPath = window.location.pathname.replace(/^\/(cs|en|de)/, '') || '/';
  const head = document.head;
  
  // Add new hreflang tags for each supported language
  supportedLanguages.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang;
    link.href = `${window.location.origin}${lang === defaultLanguage ? '' : '/' + lang}${currentPath}`;
    head.appendChild(link);
  });
  
  // Add x-default hreflang
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = `${window.location.origin}${currentPath}`;
  head.appendChild(defaultLink);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Load translations first
  await loadTranslations();
  
  // Get initial language from URL or localStorage
  const currentLang = getCurrentLanguage();
  
  // Initialize content
  await updateContent(currentLang);
  
  // Add click handlers to language switcher buttons
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = button.getAttribute('data-lang');
      changeLanguage(lang);
    });
  });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', async () => {
  const currentLang = getCurrentLanguage();
  await updateContent(currentLang);
}); 