// Function to load HTML components
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
      // If it's the resume, initialize its JavaScript
      if (elementId === 'resume-container') {
        initResumeToggle();
      }
      if (elementId === 'hero-container') {
        initVideoLoader();
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

  
  // Load HTML components
  loadComponent('nav-container', 'components/navbar.html');
  loadComponent('hero-container', 'components/hero.html');

  const loadRemainingContent = () => {
    loadStylesheet('styles/about.css');
    loadStylesheet('styles/resume.css');
    loadComponent('about-container', 'components/about.html');
    loadComponent('resume-container', 'components/resume.html');
    initSectionScroll();
  };
  
  if (window.requestIdleCallback) {
    requestIdleCallback(loadRemainingContent, {timeout: 100});
  } else {
    setTimeout(loadRemainingContent, 100);
  }

});
// Resume toggle functionality
function initResumeToggle() {
  // Resume file mappings
  const resumeFiles = {
    hardware: {
      file: "landing/assets/pdfs/ShubhRaval-Mechanical-7-25.pdf",
      title: "Hardware Resume"
    },
    robotics: {
      file: "landing/assets/pdfs/ShubhRaval-Robotic-Software-7-25.pdf", 
      title: "Robotic Software Resume"
    },
    project: {
      file: "landing/assets/pdfs/ShubhRaval-Project-Management-7-25.pdf",
      title: "Project Management Resume"
    }
  };
 
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  const resumeIframe = document.getElementById('resume-iframe');
  const downloadBtn = document.getElementById('download-btn');
  let currentResume = 'hardware';
 
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const resumeType = this.getAttribute('data-resume');
      
      toggleButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      currentResume = resumeType;
      resumeIframe.classList.add('loading');
      resumeIframe.src = resumeFiles[resumeType].file;
      downloadBtn.href = resumeFiles[resumeType].file;
      downloadBtn.setAttribute('download', resumeFiles[resumeType].file.split('/').pop());
      
      resumeIframe.onload = function() {
        resumeIframe.classList.remove('loading');
      };
    });
  });
 
  // Mobile-friendly download handling
  downloadBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = resumeFiles[currentResume].file;
    link.download = resumeFiles[currentResume].file.split('/').pop();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
 
  // Initialize default download
  downloadBtn.href = resumeFiles[currentResume].file;
  downloadBtn.setAttribute('download', resumeFiles[currentResume].file.split('/').pop());
 }
// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  let lastScrollTop = 0;

  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
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

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
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
function initVideoLoader() {
  const video = document.querySelector('.video-background');
  const poster = document.querySelector('.video-poster');
  
  if (video && poster) {
    video.addEventListener('canplay', () => {
      poster.classList.add('hidden');
    });

    // Start playing low-quality video
    video.src = 'landing/assets/videos/machining-compressed.mp4';
    video.load();
    video.play();

    // Preload high-quality video
    preloadHighQualityVideo('landing/assets/videos/machining.mov', () => {
      // Replace low-quality video with high-quality video
      const currentTime = video.currentTime;
      video.src = 'landing/assets/videos/machining.mov';
      video.load();
      video.currentTime = currentTime; // Maintain playback position
      video.play();
    });
  }

  function preloadHighQualityVideo(url, callback) {
    const highQualityVideo = document.createElement('video');
    highQualityVideo.src = url;
    highQualityVideo.preload = 'auto';
    highQualityVideo.oncanplaythrough = () => {
      callback();
    };
  }
}

// Load section scrolling functionality script
document.addEventListener('DOMContentLoaded', function() {
  initSectionScroll();
});
