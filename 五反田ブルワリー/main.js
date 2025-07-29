// Gotanda Brewery - Main JavaScript File

// Page loading animation
window.addEventListener('load', function() {
  setTimeout(() => {
    document.getElementById('loading').classList.add('hide');
  }, 1000);
});

// Main visual image loaded animation
function imageLoaded() {
  document.getElementById('mv').classList.add('loaded');
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Elements to observe
const elementsToAnimate = [
  'conceptTitle',
  'conceptText1', 
  'conceptText2',
  'aboutImage',
  'aboutTitle',
  'aboutText1',
  'aboutText2', 
  'aboutText3',
  'mapButton',
  'galleryTitle',
  'footer'
];

// Gallery items with stagger effect
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.1}s`;
  observer.observe(item);
});

// Observe all elements
elementsToAnimate.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    observer.observe(element);
  }
});

// Header scroll effect and performance optimization
let lastScrollTop = 0;
const header = document.getElementById('header');

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Header effect
  if (scrollTop > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Progress bar
  const scrollProgress = document.getElementById('scrollProgress');
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / windowHeight) * 100;
  scrollProgress.style.width = scrolled + '%';

  // Parallax effect
  const mv = document.getElementById('mv');
  const rate = scrollTop * -0.3;
  mv.style.transform = `translateY(${rate}px)`;

  lastScrollTop = scrollTop;
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Gallery modal functionality
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');

galleryItems.forEach(item => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img');
    modal.classList.add('show');
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
closeModal.addEventListener('click', function() {
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

// Keyboard navigation for modal
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

// Random beer facts tooltip (fun feature)
const beerFacts = [
  "クラフトビールは小規模醸造所で作られる個性豊かなビールです",
  "ホップは天然の防腐剤として使われています",
  "五反田は江戸時代から続く歴史ある街です",
  "ビールの泡は炭酸ガスとタンパク質でできています",
  "日本のクラフトビール文化は1990年代から始まりました"
];

let factIndex = 0;
const createFloatingFact = () => {
  const fact = document.createElement('div');
  fact.textContent = beerFacts[factIndex % beerFacts.length];
  fact.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(166, 134, 95, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    max-width: 250px;
    z-index: 1000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    cursor: pointer;
  `;
  
  document.body.appendChild(fact);
  
  setTimeout(() => {
    fact.style.opacity = '1';
    fact.style.transform = 'translateY(0)';
  }, 100);
  
  setTimeout(() => {
    fact.style.opacity = '0';
    fact.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (document.body.contains(fact)) {
        document.body.removeChild(fact);
      }
    }, 300);
  }, 4000);
  
  fact.addEventListener('click', () => {
    fact.style.opacity = '0';
    fact.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (document.body.contains(fact)) {
        document.body.removeChild(fact);
      }
    }, 300);
  });
  
  factIndex++;
};

// Show beer facts periodically (every 15 seconds)
setInterval(createFloatingFact, 15000);

// Button click effects
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      if (this.contains(ripple)) {
        this.removeChild(ripple);
      }
    }, 600);
  });
});

// Enhanced scroll effects
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.mv img');
  
  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Preload images for better performance
const imageUrls = [
  'img/fig-mv-pc.png',
  'img/fig-mv-sp.png',
  'img/fig-about.png',
  'img/fig-gallery-item-01.png',
  'img/fig-gallery-item-02.png',
  'img/fig-gallery-item-03.png',
  'img/fig-gallery-item-04.png',
  'img/fig-gallery-item-05.png',
  'img/fig-gallery-item-06.png'
];

imageUrls.forEach(url => {
  const img = new Image();
  img.src = url;
});

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe up - scroll to next section
      const currentSection = getCurrentSection();
      const nextSection = getNextSection(currentSection);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Swipe down - scroll to previous section
      const currentSection = getCurrentSection();
      const prevSection = getPrevSection(currentSection);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

function getCurrentSection() {
  const sections = document.querySelectorAll('section, .mv');
  const scrollPos = window.pageYOffset + window.innerHeight / 2;
  
  for (let section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.pageYOffset;
    const sectionBottom = sectionTop + rect.height;
    
    if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
      return section;
    }
  }
  return null;
}

function getNextSection(currentSection) {
  if (!currentSection) return null;
  const sections = document.querySelectorAll('section, .mv');
  const currentIndex = Array.from(sections).indexOf(currentSection);
  return sections[currentIndex + 1] || null;
}

function getPrevSection(currentSection) {
  if (!currentSection) return null;
  const sections = document.querySelectorAll('section, .mv');
  const currentIndex = Array.from(sections).indexOf(currentSection);
  return sections[currentIndex - 1] || null;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add accessibility features
  document.body.classList.add('keyboard-nav');
  
  // Make gallery items keyboard accessible
  galleryItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'ギャラリー画像を拡大表示');
    
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Animate elements on page load
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Error handling for missing images
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    console.warn(`Image failed to load: ${this.src}`);
  });
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}: ${entry.duration}ms`);
    }
  }
});

if ('PerformanceObserver' in window) {
  performanceObserver.observe({ entryTypes: ['measure'] });
}