// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

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
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', function() {
  navLinks.classList.toggle('active');
});

// Scroll reveal animation
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 150;
    
    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('active');
    }
  }
}

window.addEventListener('scroll', revealOnScroll);

// Section-based scrolling functionality
function initSectionScroll() {
  const sections = ['hero', 'main-content', 'section-alt-main', 'timeline-content', 'call-to-action-content'];
  const dots = document.querySelectorAll('.dot-large');
  
  // Add click event listeners to dots
  dots.forEach((dot, index) => {
    if (!dot.getAttribute('data-section')) {
      dot.setAttribute('data-section', sections[index]);
    }
    
    dot.addEventListener('click', function() {
      const sectionId = dot.getAttribute('data-section');
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        window.scrollTo({
          top: sectionElement.offsetTop,
          behavior: 'smooth'
        });
        
        // Update active dot on click
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  });
  
  // Update active dot on scroll
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + (window.innerHeight / 2);
    let activeIndex = 0;
    
    // Find which section is currently most visible
    sections.forEach((section, index) => {
      const sectionElement = document.getElementById(section);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop;
        const sectionBottom = sectionTop + sectionElement.offsetHeight;
        
        // If we're within this section
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeIndex = index;
        }
        
        // Special case for last section
        if (index === sections.length - 1 && window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
          activeIndex = sections.length - 1;
        }
      }
    });
    
    // Update active dots
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });
}

// Make sure to call the initSectionScroll function
window.addEventListener('DOMContentLoaded', initSectionScroll);