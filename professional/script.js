// Company data
const companies = [
  {
    id: "kazvu-labs",
    name: "Kazvu Labs",
    year: "Current",
    logo: "kazvu_labs_logo.jpg" // Replace with actual logo filename
  },
  {
    id: "amazon-robotics",
    name: "Amazon Robotics",
    year: "2022",
    logo: "amazon_logo.png"
  },
  {
    id: "medtronic",
    name: "Medtronic",
    year: "2021",
    logo: "medtronic_logo.png"
  },
  {
    id: "kairos-power",
    name: "Kairos Power",
    year: "2020",
    logo: "kairos_logo.png"
  },
  {
    id: "applied-composites",
    name: "Applied Composites",
    year: "2019",
    logo: "applied_logo.png"
  },
  {
    id: "boring-company",
    name: "The Boring Company",
    year: "2018",
    logo: "boring_logo.png"
  },
  {
    id: "parker-hannifin",
    name: "Parker Hannifin",
    year: "2017",
    logo: "parker_logo.png"
  }
];

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

// Initialize timeline bubbles
function initTimeline() {
  const timelineTrack = document.querySelector('.timeline-track');
  
  // Create bubbles for each company
  companies.forEach((company, index) => {
    const bubble = document.createElement('div');
    bubble.className = 'company-bubble';
    bubble.setAttribute('data-company', company.id);
    bubble.setAttribute('data-year', company.year);
    
    // Add company logo or initials if no logo
    if (company.logo) {
      const img = document.createElement('img');
      img.src = `assets/logos/${company.logo}`;
      img.alt = company.name;
      bubble.appendChild(img);
    } else {
      // Use company initials if no logo
      const initials = company.name.split(' ').map(word => word[0]).join('');
      bubble.textContent = initials;
    }
    
    // Add click event to navigate to company section
    bubble.addEventListener('click', () => {
      navigateToCompany(company.id);
    });
    
    timelineTrack.appendChild(bubble);
  });
  
  // Set the first company as active by default
  const firstBubble = document.querySelector('.company-bubble');
  if (firstBubble) {
    firstBubble.classList.add('active');
    
    // Set first section as active
    const firstSection = document.querySelector('.experience-section');
    if (firstSection) {
      firstSection.classList.add('active');
    }
  }
}

// Navigate to specific company section
function navigateToCompany(companyId) {
  // Update active bubble
  const bubbles = document.querySelectorAll('.company-bubble');
  bubbles.forEach(bubble => {
    if (bubble.getAttribute('data-company') === companyId) {
      bubble.classList.add('active');
    } else {
      bubble.classList.remove('active');
    }
  });
  
  // Update active section
  const sections = document.querySelectorAll('.experience-section');
  sections.forEach(section => {
    if (section.id === companyId) {
      section.classList.add('active');
      // Scroll to this section
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      section.classList.remove('active');
    }
  });
}

// Update active company based on scroll position
function updateActiveCompanyOnScroll() {
  const sections = document.querySelectorAll('.experience-section');
  
  let activeSection = null;
  const scrollPosition = window.scrollY + window.innerHeight / 2;
  
  // Find which section is currently most visible
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    // If we're within this section
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      activeSection = section.id;
    }
  });
  
  // Update active elements if we found an active section
  if (activeSection) {
    const bubbles = document.querySelectorAll('.company-bubble');
    bubbles.forEach(bubble => {
      if (bubble.getAttribute('data-company') === activeSection) {
        bubble.classList.add('active');
      } else {
        bubble.classList.remove('active');
      }
    });
  }
}

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

// Initialize everything when DOM is loaded
window.addEventListener('DOMContentLoaded', function() {
  initTimeline();
  initSectionScroll();
  revealOnScroll(); // Initial check for elements in view on page load
  
  // Set up scroll event for updating active company
  window.addEventListener('scroll', updateActiveCompanyOnScroll);
});
