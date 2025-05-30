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
  const mainSection = document.getElementById('main-content');
  const altSection = document.getElementById('section-alt-main');
  
  // Handle main section tabs
  if (mainSection) {
    const mainTabs = mainSection.querySelectorAll('.project-tab');
    const mainContents = mainSection.querySelectorAll('.project-content');
    
    mainTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents in this section
        mainTabs.forEach(t => t.classList.remove('active'));
        mainContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const projectId = this.getAttribute('data-project');
        document.getElementById(`${projectId}-project`).classList.add('active');
        
        // Update any STL viewers in the newly visible tab
        setTimeout(() => {
          const activeTab = mainSection.querySelector('.project-content.active');
          if (activeTab) {
            const viewers = activeTab.querySelectorAll('.cad-viewer');
            viewers.forEach(viewer => {
              if (viewer.id && window.stlViewers[viewer.id]) {
                window.stlViewers[viewer.id].resize();
              }
            });
          }
        }, 50); // Small timeout to ensure DOM is updated
      });
    });
  }
  
  // Handle alternative section tabs
  if (altSection) {
    const altTabs = altSection.querySelectorAll('.project-tab');
    const altContents = altSection.querySelectorAll('.project-content');

    // Modify your tab click handler in initProjectTabs function
    altTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents in this section
        altTabs.forEach(t => t.classList.remove('active'));
        altContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding content
        const projectId = this.getAttribute('data-project');
        const contentElement = document.getElementById(`${projectId}-content`);
        contentElement.classList.add('active');
        
        // Force update any STL viewers in the newly visible tab
        setTimeout(() => {
          const viewers = contentElement.querySelectorAll('.cad-viewer');
          viewers.forEach(viewer => {
            if (viewer.id && window.stlViewers && window.stlViewers[viewer.id]) {
              // Force a resize and render cycle
              window.stlViewers[viewer.id].resize();
              window.stlViewers[viewer.id].renderer.render(
                window.stlViewers[viewer.id].scene, 
                window.stlViewers[viewer.id].camera
              );
            }
          });
        }, 100); // Slightly longer timeout to ensure DOM is fully updated
      });
    });
  }
}

// Add to your script.js file
function reinitializeVisibleViewers() {
  // Find all active tabs
  const activeTabs = document.querySelectorAll('.project-content.active');
  
  activeTabs.forEach(tab => {
    // Find all viewers in active tabs
    const viewers = tab.querySelectorAll('.cad-viewer');
    viewers.forEach(viewer => {
      if (viewer.id && window.stlViewers && window.stlViewers[viewer.id]) {
        // Import the reinitializeViewer function and use it here
        if (typeof reinitializeViewer === 'function') {
          reinitializeViewer(viewer.id);
        } else {
          // Fallback if function not available
          window.stlViewers[viewer.id].resize();
        }
      }
    });
  });
}


// Call when tabs are switched
document.querySelectorAll('.project-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    // Wait for tab switch animation to complete
    setTimeout(reinitializeVisibleViewers, 200);
  });
});

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


// Initialize all page functionality
function initUndergraduatePage() {
  initProjectTabs();
  initExpandableContent();
  revealOnScroll(); // Call once on load to reveal visible elements
}