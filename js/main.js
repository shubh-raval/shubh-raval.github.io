// Function to load HTML components
function loadComponent(elementId, componentPath) {
  fetch(componentPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error loading ${componentPath}: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
      // If it's the navbar, initialize its JavaScript
      if (elementId === 'nav-container') {
        initNavbar();
      }
      // Initialize reveal animations after all components are loaded
      revealOnScroll();
    })
    .catch(error => {
      console.error("Error loading component:", error);
    });
}

// Load style sheet dynamically
function loadStylesheet(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = path;
  document.head.appendChild(link);
}

// Load all components
document.addEventListener('DOMContentLoaded', function() {
  // Load CSS files
  loadStylesheet('styles/navbar.css');
  loadStylesheet('styles/hero.css');
  loadStylesheet('styles/about.css');
  loadStylesheet('styles/resume.css');
  
  // Load HTML components
  loadComponent('nav-container', 'components/navbar.html');
  loadComponent('hero-container', 'components/hero.html');
  loadComponent('about-container', 'components/about.html');
  loadComponent('resume-container', 'components/resume.html');
  // Ensure section scroll functionality runs after components load
  setTimeout(() => {
    initSectionScroll();
  }, 500); // Slight delay to ensure all elements exist

});

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  let lastScrollTop = 0;

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    // Add scrolled class when scrolled down
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide nav on scroll down, show on scroll up
    let currentScroll = window.scrollY;
    if (currentScroll > lastScrollTop && currentScroll > 100) {
      navbar.classList.add('hidden');
    } else if (currentScroll < lastScrollTop || currentScroll < window.innerHeight * 0.25) {
      navbar.classList.remove('hidden');
    }
    lastScrollTop = currentScroll;
  });

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
}

// Scroll reveal animation
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  function checkReveal() {
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const revealTop = reveals[i].getBoundingClientRect().top;
      const revealPoint = 150;
      
      if (revealTop < windowHeight - revealPoint) {
        reveals[i].classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', checkReveal);
  // Initial check
  checkReveal();
}

// Load section scrolling functionality script
document.addEventListener('DOMContentLoaded', function() {
  initSectionScroll();
});
