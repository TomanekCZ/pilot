/**
 * C10D s.r.o. Website One-Page Slide Functionality
 * Modern, light one-page slide design with smooth scrolling
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize one-page slide functionality
  initOnePageSlide();
  // Add scroll animations
  initScrollAnimations();
  // Update active navigation based on scroll position
  initScrollSpy();
  // Initialize parallax effects
  initParallaxEffects();
});

/**
 * Initialize one-page slide functionality
 */
function initOnePageSlide() {
  // Add scroll-snap class to sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('slide-section');
  });

  // Enhanced smooth scrolling
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only process internal links
      if (this.getAttribute('href').startsWith('#') || 
          this.getAttribute('href').includes('#')) {
        
        let targetId;
        if (this.getAttribute('href').startsWith('#')) {
          targetId = this.getAttribute('href');
        } else {
          // Extract the hash part from URLs like "page.html#section"
          const hashIndex = this.getAttribute('href').indexOf('#');
          if (hashIndex !== -1) {
            targetId = this.getAttribute('href').substring(hashIndex);
          }
        }
        
        // Only process if we have a valid target
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            e.preventDefault();
            
            // Get header height for offset
            const headerHeight = document.querySelector('header').offsetHeight;
            
            // Add additional offset for specific sections to improve positioning
            let additionalOffset = 0;
            if (targetId === '#projects') {
              additionalOffset = 20; // Add extra space for EU Projekty section
            } else if (targetId === '#contact') {
              additionalOffset = 10; // Add extra space for Contact section
            }
            
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - additionalOffset;
            
            // Smooth scroll to target
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
            
            // Close mobile menu if open
            const mainNav = document.querySelector('.main-nav');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (mainNav && mainNav.classList.contains('active')) {
              mainNav.classList.remove('active');
              if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
            }
          }
        }
      }
    });
  });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
  // Add animation classes to elements
  const animateElements = [
    { selector: '.hero-content h1', animation: 'animate-fade-in', delay: 0 },
    { selector: '.hero-content p', animation: 'animate-fade-in', delay: 200 },
    { selector: '.hero-buttons', animation: 'animate-slide-up', delay: 400 },
    { selector: '.section-title', animation: 'animate-slide-up', delay: 0 },
    { selector: '.about-text p', animation: 'animate-fade-in', delay: 200 },
    { selector: '.stat-item', animation: 'animate-slide-up', delay: 300 },
    { selector: '.service-card', animation: 'animate-slide-up', delay: 200 },
    { selector: '.tech-preview-text', animation: 'animate-fade-in', delay: 0 },
    { selector: '.tech-preview-image', animation: 'animate-slide-up', delay: 300 }
  ];
  
  // Apply initial animations to visible elements
  animateOnScroll();
  
  // Set up intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find the animation data for this element
        const animData = animateElements.find(item => {
          return entry.target.matches(item.selector);
        });
        
        if (animData) {
          // Add animation class with delay
          setTimeout(() => {
            entry.target.classList.add(animData.animation);
            entry.target.style.opacity = '1';
          }, animData.delay);
        } else {
          // Default animation
          entry.target.classList.add('animate-fade-in');
          entry.target.style.opacity = '1';
        }
        
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe all elements that should be animated
  animateElements.forEach(item => {
    document.querySelectorAll(item.selector).forEach(element => {
      // Set initial opacity
      element.style.opacity = '0';
      observer.observe(element);
    });
  });
  
  // Function to animate elements that are already visible on page load
  function animateOnScroll() {
    animateElements.forEach(item => {
      document.querySelectorAll(item.selector).forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight) {
          setTimeout(() => {
            element.classList.add(item.animation);
            element.style.opacity = '1';
          }, item.delay);
        } else {
          element.style.opacity = '0';
        }
      });
    });
  }
}

/**
 * Initialize scroll spy to update active navigation
 */
function initScrollSpy() {
  // Get all sections that have an ID defined
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  // Keep track of the current active section
  let currentActiveSection = null;
  let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let updateTimeout = null;

  // Function to remove active classes from all links
  const removeActiveClasses = () => {
    navLinks.forEach(link => {
      link.classList.remove('text-blue-400', 'border-blue-400');
      link.classList.add('border-transparent');
    });
  };

  // Function to add active classes to links for a specific section
  const setActiveSection = (sectionId) => {
    if (currentActiveSection === sectionId) return;
    
    removeActiveClasses();
    const links = document.querySelectorAll(`nav a[href="#${sectionId}"]`);
    links.forEach(link => {
      link.classList.add('text-blue-400', 'border-blue-400');
      link.classList.remove('border-transparent');
    });
    currentActiveSection = sectionId;
  };

  // Function to get the most visible section
  const getMostVisibleSection = () => {
    let maxVisibleSection = null;
    let maxVisibleRatio = 0;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const sectionHeight = rect.height;
      const visibilityRatio = visibleHeight / sectionHeight;

      if (visibilityRatio > maxVisibleRatio) {
        maxVisibleRatio = visibilityRatio;
        maxVisibleSection = section;
      }
    });

    return maxVisibleSection;
  };

  // Update active section on scroll
  const handleScroll = () => {
    if (updateTimeout) {
      window.cancelAnimationFrame(updateTimeout);
    }

    updateTimeout = window.requestAnimationFrame(() => {
      const mostVisibleSection = getMostVisibleSection();
      if (mostVisibleSection) {
        setActiveSection(mostVisibleSection.id);
      }
    });
  };

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial check for active section
  handleScroll();

  // Remove default active state from home link
  removeActiveClasses();
}

/**
 * Initialize parallax effects for background elements
 */
function initParallaxEffects() {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Parallax for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.style.backgroundPositionY = `${scrollPosition * 0.2}px`;
    }
    
    // Subtle parallax for other sections with background
    const parallaxSections = document.querySelectorAll('.services-section, .cta-section');
    parallaxSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      
      if (scrollPosition + window.innerHeight > sectionTop && scrollPosition < sectionBottom) {
        const yPos = (scrollPosition - sectionTop) * 0.1;
        section.style.backgroundPositionY = `${yPos}px`;
      }
    });
  });
}