// Section-based scrolling functionality
function initSectionScroll() {
    const sections = ['hero', 'about', 'resume'];
    const dots = document.querySelectorAll('.dot-large');
    
    // Add click event listeners to dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', function() {
        const sectionId = dot.getAttribute('data-section');
        const sectionElement = document.getElementById(sectionId + '-container');
        if (sectionElement) {
          window.scrollTo({
            top: sectionElement.offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Update active dot on scroll
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      sections.forEach((section, index) => {
        const sectionElement = document.getElementById(section + '-container');
        if (sectionElement) {
          const sectionTop = sectionElement.offsetTop - 100;
          const sectionBottom = sectionTop + sectionElement.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Remove active class from all dots
            dots.forEach(dot => dot.classList.remove('active'));
            // Add active class to current dot
            dots[index].classList.add('active');
          }
        }
      });
    });
  }