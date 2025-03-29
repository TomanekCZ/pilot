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

  // Store language preference in localStorage
  localStorage.setItem('language', lang);
  localStorage.setItem('i18nextLng', lang);
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
  
  // Update URL without reloading the page
  const currentUrl = new URL(window.location.href);
  const pathParts = currentUrl.pathname.split('/').filter(Boolean);
  
  // Check if current path starts with a language code
  const hasLangPrefix = supportedLanguages.includes(pathParts[0]);
  
  let newPath;
  if (hasLangPrefix) {
    // Replace the language code in the URL
    pathParts[0] = lang;
    newPath = '/' + pathParts.join('/');
  } else {
    // Add the language code to the URL
    newPath = '/' + lang + currentUrl.pathname;
  }
  
  // Update the URL using history.pushState
  window.history.pushState({}, '', newPath);
  
  // Update content
  await updateContent(lang);
  
  // Update UI elements
  updateLanguageUI();
  
  // Don't reload the page
  return false;
}

// Function to update page metadata based on current URL
function updatePageMetadata(lang) {
  // Get current page from URL
  const path = window.location.pathname;
  const pathParts = path.split('/').filter(Boolean);
  
  // Remove language code if present
  if (supportedLanguages.includes(pathParts[0])) {
    pathParts.shift();
  }
  
  // Determine page type from remaining path
  let pageType = pathParts.length > 0 ? pathParts[0].replace('.html', '') : 'home';
  if (pageType === '') pageType = 'home';
  
  // Default page title and description keys
  let titleKey = 'meta.title';
  let descriptionKey = 'meta.description';
  
  // Page-specific metadata
  if (pageType === 'career') {
    titleKey = 'career.page.title';
    descriptionKey = 'career.page.description';
  } else if (pageType === 'contact') {
    titleKey = 'contact.page.title';
    descriptionKey = 'contact.page.description';
  } else if (pageType === 'gallery') {
    titleKey = 'gallery.page.title';
    descriptionKey = 'gallery.page.description';
  }
  
  // Update title
  const titleTranslation = getTranslation(titleKey, lang);
  if (titleTranslation) {
    document.title = titleTranslation;
  }
  
  // Update description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    const descriptionTranslation = getTranslation(descriptionKey, lang);
    if (descriptionTranslation) {
      descriptionMeta.content = descriptionTranslation;
    }
  }
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
  updatePageMetadata(lang);
  
  // Update language selector UI
  updateLanguageSelector(lang);
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

// Function to handle URL updates and preserve language choice
function setupLinkInterceptor() {
  document.addEventListener('click', function(e) {
    // Find if a link was clicked
    let target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    
    // If it's a link with href attribute
    if (target && target.tagName === 'A' && target.href) {
      const href = target.getAttribute('href');
      
      // Skip external links, hash links, and language switcher links
      if (href.startsWith('http') || 
          href.startsWith('#') || 
          target.hasAttribute('data-lang') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:')) {
        return; // Let the default behavior handle these
      }
      
      // Get the current language
      const currentLang = getCurrentLanguage();
      
      // Parse the href
      const url = new URL(target.href);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      // Check if the URL already has a language prefix
      const hasLangPrefix = supportedLanguages.includes(pathParts[0]);
      
      // Skip if it already has the current language prefix
      if (hasLangPrefix && pathParts[0] === currentLang) {
        return;
      }
      
      // Construct new URL with language prefix
      let newPath;
      if (hasLangPrefix) {
        // Replace the language prefix
        pathParts[0] = currentLang;
        newPath = '/' + pathParts.join('/');
      } else {
        // Add the language prefix
        newPath = '/' + currentLang + url.pathname;
      }
      
      // Update the href
      e.preventDefault();
      window.location.href = newPath + url.search + url.hash;
    }
  });
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
  
  // Setup link interceptor to maintain language across navigation
  setupLinkInterceptor();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', async () => {
  // Get current language from URL
  const currentLang = getCurrentLanguage();
  
  // Update document language
  document.documentElement.lang = currentLang;
  
  // Update localStorage for consistency
  localStorage.setItem('language', currentLang);
  localStorage.setItem('i18nextLng', currentLang);
  
  // Update content without page reload
  await updateContent(currentLang);
  
  // Update language UI
  updateLanguageUI();
}); 