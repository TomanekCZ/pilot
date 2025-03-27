document.addEventListener('DOMContentLoaded', () => {
  // Gallery categories and their paths
  const categories = {
    'all': {
      title: 'Všechny',
      path: null
    },
    'laser': {
      title: 'Laserové řezání',
      path: 'images/assets/img/gallery/laser'
    },
    'ohranovaci-lisy': {
      title: 'Ohraňovací lisy',
      path: 'images/assets/img/gallery/ohranovaci-lisy-ohybani-plechu'
    },
    'obrabeci-stroje': {
      title: 'Obráběcí stroje',
      path: 'images/assets/img/gallery/obrabeci-stroje'
    },
    'svarovani': {
      title: 'Svařování',
      path: 'images/assets/img/gallery/svarovani-ocelovych-konstrukci-a-navesu'
    },
    'vrtani': {
      title: 'Vrtání',
      path: 'images/assets/img/gallery/vrtani-magnetickou-vrtackou'
    },
    'areal': {
      title: 'Areál firmy',
      path: 'images/assets/img/gallery/areal'
    }
  };

  let allImages = [];
  let filteredImages = [];
  let currentImageIndex = 0;

  // Filter buttons functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active button state
      filterButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
      });
      button.classList.add('active', 'bg-blue-600', 'text-white');
      button.classList.remove('bg-gray-200', 'text-gray-700');

      // Filter and display images
      filterImages(category);
    });
  });

  // Initialize gallery
  loadAllImages().then(() => {
    filterImages('all');
  });

  async function loadAllImages() {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.remove('hidden');

    allImages = [];
    
    // Load images from each category
    for (const [category, info] of Object.entries(categories)) {
      if (category === 'all') continue;
      
      try {
        const categoryImages = await loadCategoryImages(category);
        allImages = [...allImages, ...categoryImages];
      } catch (error) {
        console.error(`Error loading images for category ${category}:`, error);
      }
    }

    loadingIndicator.classList.add('hidden');
  }

  function filterImages(category) {
    const galleryGrid = document.getElementById('gallery-grid');
    
    // Filter images based on category
    filteredImages = category === 'all' 
      ? allImages 
      : allImages.filter(img => img.category === category);

    // Clear current gallery
    galleryGrid.innerHTML = '';

    // Add filtered images to gallery
    filteredImages.forEach((image, index) => {
      const imageCard = createImageCard(image, index);
      galleryGrid.appendChild(imageCard);
    });
  }

  function createImageCard(image, index) {
    const card = document.createElement('div');
    card.className = 'relative group cursor-pointer overflow-hidden rounded-lg shadow-lg aspect-square';
    card.innerHTML = `
      <img 
        src="${image.src}" 
        alt="${image.caption || categories[image.category].title}"
        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 p-4">
          <p class="text-white text-sm">${image.caption || ''}</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      currentImageIndex = index;
      openGalleryModal(image);
    });

    return card;
  }

  function openGalleryModal(image) {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('gallery-image');
    const modalCaption = document.getElementById('gallery-caption');

    modalImage.src = image.src;
    modalCaption.textContent = image.caption || '';
    modal.classList.remove('hidden');
  }

  // Modal navigation
  document.getElementById('gallery-prev').addEventListener('click', () => {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      openGalleryModal(filteredImages[currentImageIndex]);
    }
  });

  document.getElementById('gallery-next').addEventListener('click', () => {
    if (currentImageIndex < filteredImages.length - 1) {
      currentImageIndex++;
      openGalleryModal(filteredImages[currentImageIndex]);
    }
  });

  document.getElementById('gallery-close').addEventListener('click', () => {
    document.getElementById('gallery-modal').classList.add('hidden');
  });

  // Close modal on backdrop click
  document.getElementById('gallery-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('gallery-modal')) {
      e.target.classList.add('hidden');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal.classList.contains('hidden')) return;

    switch (e.key) {
      case 'Escape':
        modal.classList.add('hidden');
        break;
      case 'ArrowLeft':
        if (currentImageIndex > 0) {
          currentImageIndex--;
          openGalleryModal(filteredImages[currentImageIndex]);
        }
        break;
      case 'ArrowRight':
        if (currentImageIndex < filteredImages.length - 1) {
          currentImageIndex++;
          openGalleryModal(filteredImages[currentImageIndex]);
        }
        break;
    }
  });

  // Function to load images from a category
  async function loadCategoryImages(category) {
    const categoryInfo = categories[category];
    
    // Definice obrázků pro každou kategorii
    const categoryImages = {
      'laser': [
        'vop_2385.jpg', 'vop_2399.jpg', 'vop_2422.jpg', 'vop_2431.jpg',
        'vop_2459.jpg', 'vop_2460.jpg', 'vop_2468.jpg', 'vop_2664.jpg', 'vop_2872.jpg'
      ],
      'ohranovaci-lisy': [
        'vop_2479.jpg', 'vop_2511.jpg', 'vop_2674.jpg', 'vop_2842.jpg',
        'vop_2998.jpg', 'vop_3012.jpg', 'vop_3085.jpg'
      ],
      'obrabeci-stroje': [
        'vop_2525.jpg', 'vop_2527.jpg', 'vop_2528.jpg', 'vop_2531.jpg',
        'vop_2540.jpg', 'vop_2550.jpg', 'vop_3262.jpg', 'vop_3294.jpg'
      ],
      'svarovani': [
        'vop_2357.jpg', 'vop_2562.jpg', 'vop_2576.jpg', 'vop_2595.jpg',
        'vop_2603.jpg', 'vop_2615.jpg', 'vop_2642.jpg', 'vop_2720.jpg',
        'vop_2794.jpg', 'vop_3128.jpg', 'vop_3302.jpg', 'vop_3307.jpg',
        'vop_3363.jpg'
      ],
      'vrtani': [
        'vop_2652.jpg'
      ],
      'areal': [
        'vop_2364.jpg', 'vop_2371.jpg', 'vop_2494.jpg', 'vop_2659.jpg',
        'vop_3221.jpg', 'vop_3406.jpg'
      ]
    };

    // Získání seznamu obrázků pro danou kategorii
    const images = categoryImages[category] || [];
    
    // Vytvoření pole objektů s informacemi o obrázcích
    return images.map(imageName => ({
      src: `${categoryInfo.path}/${imageName}`,
      caption: `${categoryInfo.title}`,
      category: category
    }));
  }
}); 