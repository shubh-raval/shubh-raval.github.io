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

// Function to initialize Three.js STL viewers
function initSTLViewers() {
  if (typeof THREE === 'undefined') {
    // Add Three.js script if not already loaded
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = setupSTLViewers;
    document.head.appendChild(script);
  } else {
    setupSTLViewers();
  }
}

function setupSTLViewers() {
  const viewers = document.querySelectorAll('.cad-viewer');
  
  viewers.forEach(viewer => {
    const modelPath = viewer.getAttribute('data-model');
    if (!modelPath) return;
    
    // Create Three.js scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    
    // Clear placeholder content and add renderer
    viewer.innerHTML = '';
    viewer.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(ambientLight);
    scene.add(directionalLight);
    
    // Load STL file
    const loader = new THREE.STLLoader();
    loader.load(modelPath, function(geometry) {
      const material = new THREE.MeshPhongMaterial({ color: 0x2d4059, specular: 0x111111, shininess: 200 });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Center the model
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      const center = new THREE.Vector3();
      box.getCenter(center);
      mesh.position.sub(center);
      
      scene.add(mesh);
      
      // Setup orbit controls for the viewer
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      // Handle control buttons
      const container = viewer.closest('.cad-model-container');
      if (container) {
        const rotateBtn = container.querySelector('[data-action="rotate"]');
        const zoomBtn = container.querySelector('[data-action="zoom"]');
        const panBtn = container.querySelector('[data-action="pan"]');
        
        if (rotateBtn) rotateBtn.addEventListener('click', () => { controls.enableRotate = true; });
        if (zoomBtn) zoomBtn.addEventListener('click', () => { controls.enableZoom = true; });
        if (panBtn) panBtn.addEventListener('click', () => { controls.enablePan = true; });
      }
      
      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    });
  });
}

// Initialize all page functionality
function initUndergraduatePage() {
  initProjectTabs();
  initExpandableContent();
  initSTLViewers();
  revealOnScroll(); // Call once on load to reveal visible elements
}