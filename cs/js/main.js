/**
 * C10D s.r.o. Website Main JavaScript
 * Initializes all functionality
 * Version: 1.0
 */

// Global variables
let currentLanguage = 'cs';

// Helper functions
function getTranslation(key, lang) {
  const keys = key.split('.');
  let current = translations;
  
  for (const k of keys) {
    if (!current[k]) {
      console.warn(`Missing translation: ${key}`);
      return key; // Return key as fallback
    }
    current = current[k];
  }
  
  return current[lang] || current['cs'] || key;
}

function applyTranslations(language) {
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, language);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
}

function updateLanguageUI() {
  const language = currentLanguage || 'cs'; // Ensure we have a default value
  
  // Update both desktop and mobile language buttons
  const languageButtons = document.querySelectorAll('.current-language');
  const languageDropdowns = document.querySelectorAll('.language-dropdown');
  
  languageButtons.forEach(button => {
    const flagImg = button.querySelector('img');
    const langCode = button.querySelector('span');
    
    if (flagImg && langCode) {
      // Use gb.svg for English flag
      const flagName = language === 'en' ? 'gb' : language;
      flagImg.src = `/images/flags/${flagName}.svg`;
      flagImg.alt = language === 'cs' ? 'Čeština' : language === 'en' ? 'English' : 'Deutsch';
      langCode.textContent = language.toUpperCase();
    }
  });
  
  // Update active class in all dropdowns
  languageDropdowns.forEach(dropdown => {
    const links = dropdown.querySelectorAll('a');
    links.forEach(link => {
      if (link.getAttribute('data-lang') === language) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

function updateTranslations() {
  const language = currentLanguage || 'cs'; // Ensure we have a default value
  applyTranslations(language);
}

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');
  
  // Czech phone number format: +420 XXX XXX XXX
  if (digits.length === 9) {
    // Assume Czech number without country code
    return `+420 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  } else if (digits.length > 9) {
    // Assume number with country code
    const countryCode = digits.substring(0, digits.length - 9);
    const nationalNumber = digits.substring(digits.length - 9);
    return `+${countryCode} ${nationalNumber.substring(0, 3)} ${nationalNumber.substring(3, 6)} ${nationalNumber.substring(6)}`;
  }
  
  // If not matching known formats, return formatted as is
  return phoneNumber;
}

function getLanguageFromURL() {
  const path = window.location.pathname;
  const match = path.match(/^\/(cs|en|de)\//);
  return match ? match[1] : null;
}

function redirectToLanguage(lang) {
  const currentPath = window.location.pathname;
  const newPath = currentPath.replace(/^\/(cs|en|de)\//, '/');
  window.location.href = `/${lang}/${newPath.replace(/^\//, '')}`;
}

// Setup functions
function setupLanguageSwitcher() {
  const urlLang = getLanguageFromURL();
  if (urlLang) {
    currentLanguage = urlLang;
    localStorage.setItem('selectedLanguage', urlLang);
  } else {
    currentLanguage = localStorage.getItem('selectedLanguage') || 'cs';
  }

  document.querySelectorAll('[data-lang]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = element.getAttribute('data-lang');
      redirectToLanguage(lang);
    });
  });

  updateLanguageUI();
  updateTranslations();
}

function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Load translations
  await loadTranslations();

  // Load saved language or use default
  const savedLanguage = localStorage.getItem('language') || 'cs';
  currentLanguage = savedLanguage;

  // Apply translations and update UI
  applyTranslations(currentLanguage);
  updateLanguageUI();

  // Set up language switcher
  setupLanguageSwitcher();

  // Initialize lazy loading
  const observer = lozad();
  observer.observe();

  // Back to Top functionality
  const backToTopButton = document.getElementById('backToTop');
  let isThrottled = false;

  // Show button after scrolling down 500px
  const toggleBackToTopButton = () => {
    if (isThrottled) return;
    isThrottled = true;

    requestAnimationFrame(() => {
      if (window.scrollY > 500) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100');
      } else {
        backToTopButton.classList.add('opacity-0');
        backToTopButton.classList.remove('opacity-100');
        // Add small delay before making it invisible to allow fade out animation
        setTimeout(() => {
          if (window.scrollY <= 500) {
            backToTopButton.classList.add('invisible');
          }
        }, 300);
      }
      isThrottled = false;
    });
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Event listeners
  window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
  backToTopButton.addEventListener('click', scrollToTop);

  // Initial check for button visibility
  toggleBackToTopButton();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize scroll animations
  initScrollAnimations();
});

// Language switcher functionality
function initLanguageSwitcher() {
  const currentLangBtn = document.querySelector('.current-language');
  const langDropdown = document.querySelector('.language-dropdown');
  
  if (currentLangBtn && langDropdown) {
    currentLangBtn.addEventListener('click', () => {
      langDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-switcher')) {
        langDropdown.classList.remove('active');
      }
    });
  }
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      body.classList.toggle('nav-open');
    });

    // Close menu when clicking navigation links
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        body.classList.remove('nav-open');
      });
    });
  }
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Close mobile menu on window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    
    if (mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      body.classList.remove('nav-open');
    }
  }
});