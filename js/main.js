// Global variables
let currentLanguage = 'cs';

// Helper functions
function applyTranslations(language) {
  const elements = document.querySelectorAll('[data-key]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-key');
    if (translations[language] && translations[language][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[language][key];
      } else {
        element.textContent = translations[language][key];
      }
    }
  });
}

function updateLanguageUI(language) {
  // Update both desktop and mobile language buttons
  const languageButtons = document.querySelectorAll('.current-language');
  const languageDropdowns = document.querySelectorAll('.language-dropdown');
  
  languageButtons.forEach(button => {
    const flagImg = button.querySelector('img');
    const langCode = button.querySelector('span');
    
    if (flagImg && langCode) {
      flagImg.src = `images/flags/${language}.svg`;
      flagImg.alt = language === 'cs' ? 'Česky' : language === 'en' ? 'English' : 'Deutsch';
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

// Setup functions
function setupLanguageSwitcher() {
  const languageButtons = document.querySelectorAll('.current-language');
  const languageDropdowns = document.querySelectorAll('.language-dropdown');
  
  // Load language preference from localStorage
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    currentLanguage = savedLanguage;
    applyTranslations(currentLanguage);
    updateLanguageUI(currentLanguage);
  }
  
  // Toggle dropdown visibility for all language switchers
  languageButtons.forEach((button, index) => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns first
      languageDropdowns.forEach((dropdown, dropdownIndex) => {
        if (dropdownIndex !== index) {
          dropdown.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      languageDropdowns[index].classList.toggle('active');
    });
  });
  
  // Handle language selection for all dropdowns
  languageDropdowns.forEach(dropdown => {
    const links = dropdown.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const lang = this.getAttribute('data-lang');
        currentLanguage = lang;
        
        // Save language preference
        localStorage.setItem('language', lang);
        
        // Apply translations
        applyTranslations(lang);
        updateLanguageUI(lang);
        
        // Close all dropdowns
        languageDropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.language-switcher') && !e.target.closest('.mobile-language-switcher')) {
      languageDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
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
document.addEventListener('DOMContentLoaded', function() {
  setupLanguageSwitcher();
  setupSmoothScrolling();
  
  // Apply initial translations
  applyTranslations(currentLanguage);
});