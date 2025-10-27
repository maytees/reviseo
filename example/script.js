// ================================
// NAVBAR SCROLL EFFECT
// ================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ================================
// MOBILE MENU TOGGLE
// ================================
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('active')
    ? 'rotate(45deg) translateY(8px)'
    : 'none';
  spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('active')
    ? 'rotate(-45deg) translateY(-8px)'
    : 'none';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// ================================
// FLAVOR CAROUSEL
// ================================
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const flavorsContainer = document.getElementById('flavorsContainer');

let currentIndex = 0;
const cards = document.querySelectorAll('.flavor-card');
const totalCards = cards.length;

function updateCarousel() {
  // For mobile, show one at a time
  if (window.innerWidth <= 768) {
    const cardWidth = cards[0].offsetWidth;
    flavorsContainer.style.transform = `translateX(-${currentIndex * (cardWidth + 30)}px)`;
  }
}

prevBtn.addEventListener('click', () => {
  currentIndex = currentIndex > 0 ? currentIndex - 1 : totalCards - 1;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
  updateCarousel();
});

// Auto-rotate carousel every 5 seconds
setInterval(() => {
  currentIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
  updateCarousel();
}, 5000);

// ================================
// VIDEO PLAY FUNCTIONALITY
// ================================
const videoCover = document.getElementById('videoCover');
const playBtn = document.getElementById('playBtn');
const videoFrame = document.getElementById('videoFrame');

playBtn.addEventListener('click', () => {
  videoCover.style.display = 'none';
  videoFrame.style.display = 'block';
  videoFrame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
});

// ================================
// FORM VALIDATION
// ================================
const sampleForm = document.getElementById('sampleForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const zipInput = document.getElementById('zip');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const zipError = document.getElementById('zipError');

function validateName() {
  if (nameInput.value.trim().length < 2) {
    nameError.textContent = 'Please enter a valid name';
    return false;
  }
  nameError.textContent = '';
  return true;
}

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = 'Please enter a valid email address';
    return false;
  }
  emailError.textContent = '';
  return true;
}

function validateZip() {
  const zipRegex = /^\d{5}$/;
  if (!zipRegex.test(zipInput.value)) {
    zipError.textContent = 'Please enter a valid 5-digit zip code';
    return false;
  }
  zipError.textContent = '';
  return true;
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
zipInput.addEventListener('blur', validateZip);

sampleForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isZipValid = validateZip();

  if (isNameValid && isEmailValid && isZipValid) {
    alert('Thank you! Your free sample request has been submitted. Check your email for confirmation!');
    sampleForm.reset();
  }
});

// ================================
// COUNTDOWN TIMER
// ================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// Set countdown to 2 days from now
const countdownDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  if (distance < 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ================================
// FAQ ACCORDION
// ================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    // Close other open items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });

    // Toggle current item
    item.classList.toggle('active');
  });
});

// ================================
// BACK TO TOP BUTTON
// ================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ================================
// MODAL POPUP
// ================================
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalCta = document.querySelector('.modal-cta');

// Show modal after 5 seconds
setTimeout(() => {
  modal.classList.add('active');
}, 5000);

// Show modal on scroll (50% down the page)
let modalShownOnScroll = false;
window.addEventListener('scroll', () => {
  if (!modalShownOnScroll && window.scrollY > document.body.scrollHeight * 0.5) {
    modal.classList.add('active');
    modalShownOnScroll = true;
  }
});

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
});

modalCta.addEventListener('click', () => {
  modal.classList.remove('active');
  // Scroll to pricing section
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
  }
});

// ================================
// CTA BUTTON HANDLERS
// ================================
const ctaButtons = document.querySelectorAll('.cta-btn');

ctaButtons.forEach(btn => {
  // Skip form submit button
  if (btn.type === 'submit') return;

  btn.addEventListener('click', () => {
    // Scroll to lead form
    document.querySelector('.lead-form').scrollIntoView({ behavior: 'smooth' });
  });
});

// ================================
// NEWSLETTER FORM
// ================================
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector('input[type="email"]');

  if (emailInput.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    alert('Thank you for subscribing! Check your email for exclusive offers.');
    newsletterForm.reset();
  } else {
    alert('Please enter a valid email address.');
  }
});

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe benefit cards
document.querySelectorAll('.benefit-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Observe flavor cards
document.querySelectorAll('.flavor-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Observe testimonial cards
document.querySelectorAll('.testimonial-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Observe pricing cards
document.querySelectorAll('.pricing-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.6s ease ${index * 0.1}s`;
  observer.observe(card);
});

// ================================
// PARALLAX EFFECT ON HERO
// ================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector('.hero-image');

  if (heroImage && window.innerWidth > 768) {
    heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ================================
// DYNAMIC PRICING BUTTON TEXT
// ================================
const pricingButtons = document.querySelectorAll('.pricing-card .cta-btn');

pricingButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    btn.textContent = 'Get Started ’';
  });

  btn.addEventListener('mouseleave', () => {
    btn.textContent = 'Order Now';
  });
});

// ================================
// CONSOLE EASTER EGG
// ================================
console.log('%c¡ VoltRush Energy ¡', 'color: #00ff88; font-size: 24px; font-weight: bold;');
console.log('%cFuel Your Fire!', 'color: #ff6b35; font-size: 16px;');
console.log('%cLooking for a career in energy? Email us at careers@voltrush.com', 'color: #b8b8b8; font-size: 12px;');

// ================================
// PERFORMANCE: LAZY LOAD IMAGES
// ================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ================================
// WINDOW RESIZE HANDLER
// ================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateCarousel();
  }, 250);
});

// ================================
// PAGE LOAD COMPLETE
// ================================
window.addEventListener('load', () => {
  console.log('VoltRush landing page loaded successfully!');

  // Add loaded class to body for any CSS transitions
  document.body.classList.add('loaded');
});

// ================================
// PREVENT RIGHT CLICK ON IMAGES (OPTIONAL)
// ================================
// Uncomment if you want to prevent image downloading
// document.querySelectorAll('img').forEach(img => {
//   img.addEventListener('contextmenu', e => e.preventDefault());
// });
