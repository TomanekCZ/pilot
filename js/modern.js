/**
 * C10D s.r.o. Website Modern JavaScript Enhancements
 * Version: 1.0
 */

// Modern JavaScript using ES6+ features
const ModernFeatures = {
  // Setup Intersection Observer for scroll animations
  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  },

  // Enhanced smooth scrolling with offset support
  setupSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (!scrollLinks.length) return;
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        // Get header height for offset (if fixed header)
        const headerOffset = document.querySelector('header')?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      });
    });
  },

  // Lazy loading for images
  setupLazyLoading() {
    // Use native lazy loading if available
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      images.forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
        img.removeAttribute('data-src');
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      images.forEach(img => {
        imageObserver.observe(img);
      });
    }
  },

  // Enhanced gallery with modern features
  enhanceGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!galleryItems.length) return;
    
    // Add masonry layout effect
    this.setupMasonryLayout();
    
    // Add touch swipe support for lightbox
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      let touchStartX = 0;
      let touchEndX = 0;
      
      lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, false);
      
      lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, false);
      
      function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left - next image
          document.querySelector('.lightbox-next')?.click();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right - previous image
          document.querySelector('.lightbox-prev')?.click();
        }
      }
    }
  },

  // Masonry layout for gallery
  setupMasonryLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) return;
    
    // Simple masonry layout without external libraries
    function resizeGridItems() {
      const grid = galleryGrid;
      const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
      
      const items = grid.querySelectorAll('.gallery-item');
      items.forEach(item => {
        const content = item.querySelector('.gallery-item-inner');
        const rowSpan = Math.ceil((content.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = `span ${rowSpan}`;
      });
    }
    
    // Initial resize
    window.addEventListener('load', resizeGridItems);
    window.addEventListener('resize', resizeGridItems);
    
    // Also resize when images load to handle dynamic content
    const allImages = galleryGrid.querySelectorAll('img');
    allImages.forEach(img => {
      img.addEventListener('load', resizeGridItems);
    });
  },

  // Modern form validation
  setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    if (!forms.length) return;
    
    forms.forEach(form => {
      // Add novalidate to use custom validation
      form.setAttribute('novalidate', '');
      
      // Handle form submission
      form.addEventListener('submit', function(e) {
        if (!this.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();
          this.highlightInvalidFields();
        }
        
        this.classList.add('was-validated');
      });
      
      // Real-time validation feedback
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          this.validateInput();
        });
        
        input.addEventListener('input', function() {
          validateInput(this);
        });
      });
    });
  },
  
  // Helper function to highlight invalid fields
  highlightInvalidFields(form) {
    const invalidFields = form.querySelectorAll(':invalid');
    invalidFields.forEach(field => {
      field.classList.add('is-invalid');
      const feedback = field.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = field.validationMessage;
      }
    });
  },

  // Helper function to validate individual input
  validateInput(input) {
    if (input.validity.valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = '';
      }
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      const feedback = input.nextElementSibling;
      if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = input.validationMessage;
      }
    }
  },
  
  // Initialize all features
  init() {
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    this.setupLazyLoading();
    this.enhanceGallery();
    this.setupFormValidation();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ModernFeatures.init();
});