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
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Check if we're on a specific page and highlight the corresponding nav link
  function highlightCurrentPageNav() {
    // Get current page path
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop();
    
    // Remove active class from all links first
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // If we're on the homepage (index.html or /)
    if (pageName === '' || pageName === 'index.html' || currentPath.endsWith('/')) {
      // On homepage, the first link (Home) should be active by default
      // unless scroll position activates another link
      const homeLink = document.querySelector('.nav-links a[href="#hero"]');
      if (homeLink) homeLink.classList.add('active');
    } else {
      // On other pages, find the nav link that points to the current page
      let activeFound = false;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Extract the base filename without extension for comparison
        const hrefBase = href.split('#')[0];
        const pageNameWithoutExt = pageName.split('.')[0];
        
        // Check if href matches the current page name exactly or as part of the URL
        if (href === pageName || 
            hrefBase === pageName || 
            hrefBase === pageNameWithoutExt || 
            href === pageNameWithoutExt) {
          link.classList.add('active');
          activeFound = true;
        }
      });
      
      // If no active link was found, try a more flexible matching approach
      if (!activeFound && pageName) {
        const pageNameWithoutExt = pageName.split('.')[0];
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          // More flexible matching for pages with different URL structures
          if ((href.includes(pageNameWithoutExt) && pageNameWithoutExt !== '') || 
              (href.startsWith('#') && href.substring(1) === pageNameWithoutExt)) {
            link.classList.add('active');
          }
        });
      }
    }
  }
  
  // Call once on page load
  highlightCurrentPageNav();
  
  // Only set up scroll spy if we have sections with IDs (typically on index.html)
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPosition = window.scrollY;
      
      // Get header height for offset
      const headerHeight = document.querySelector('header').offsetHeight;
      
      sections.forEach(section => {
        // Adjust the offset for better detection of the EU Projekty section
        let sectionOffset = 100;
        if (section.id === 'projects') {
          sectionOffset = 80; // Smaller offset for projects section for better detection
        } else if (section.id === 'contact') {
          sectionOffset = 120; // Larger offset for contact section
        }
        
        const sectionTop = section.offsetTop - headerHeight - sectionOffset;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href && href.includes(`#${current}`)) {
          link.classList.add('active');
        }
      });
    });
  }
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