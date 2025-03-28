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

// Function to handle project tab navigation
function initProjectTabs() {
  const projectTabs = document.querySelectorAll('.project-tab');
  const projectContents = document.querySelectorAll('.project-content');
  
  projectTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      projectTabs.forEach(t => t.classList.remove('active'));
      projectContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
          // Update any STL viewers in the newly visible tab
      setTimeout(() => {
        const activeTab = document.querySelector('.project-content.active');
        if (activeTab) {
          const viewers = activeTab.querySelectorAll('.cad-viewer');
          viewers.forEach(viewer => {
            if (viewer.id && window.stlViewers[viewer.id]) {
              window.stlViewers[viewer.id].resize();
            }
          });
        }
      }, 50); // Small timeout to ensure DOM is updated
      // Show corresponding content
      const projectId = this.getAttribute('data-project');
      document.getElementById(`${projectId}-project`).classList.add('active');
    });
  });
}

// Handle expandable content sections
function initExpandableContent() {
  const expandButtons = document.querySelectorAll('.expand-button');
  
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      
      targetContent.classList.toggle('expanded');
      
      // Toggle button text
      if (targetContent.classList.contains('expanded')) {
        this.innerHTML = 'See Less <i class="fas fa-chevron-up"></i>';
      } else {
        this.innerHTML = 'See More <i class="fas fa-chevron-down"></i>';
      }
    });
  });
}

function initPaperToggle() {
  const paperSections = document.querySelectorAll('.paper-section');
  
  paperSections.forEach(section => {
    const toggleButton = section.querySelector('.toggle-paper');
    const paperContainer = section.querySelector('.paper-container');
    
    if (toggleButton && paperContainer) {
      toggleButton.addEventListener('click', () => {
        const isCurrentlyVisible = paperContainer.style.display === 'block';
        
        paperContainer.style.display = isCurrentlyVisible ? 'none' : 'block';
        toggleButton.textContent = isCurrentlyVisible ? 'Show Full Paper' : 'Hide Full Paper';
      });
    }
  });
}


// Initialize all page functionality
function initUndergraduatePage() {
  initProjectTabs();
  initExpandableContent();
  initPaperToggle();
  revealOnScroll(); // Call once on load to reveal visible elements
}