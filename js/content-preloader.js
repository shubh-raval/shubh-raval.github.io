// content-preloader.js
class ContentPreloader {
  constructor(options = {}) {
    this.options = {
      maxConcurrentLoads: 3,
      timeout: 5000,
      prefetchSelectors: [
        'section',
        '.project-slide',
        '.cad-viewer',
        'img',
        'video',
        'iframe'
      ],
      ...options
    };

    this.preloadedContent = new Map();
    this.activeRequests = new Set();
  }

  // Fetch and cache HTML content
  async preloadSection(url) {
    // Prevent duplicate or ongoing requests
    if (this.preloadedContent.has(url) || this.activeRequests.has(url)) {
      return this.preloadedContent.get(url);
    }

    try {
      // Add to active requests
      this.activeRequests.add(url);

      // Fetch the HTML content
      const response = await fetch(url, { 
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }

      const html = await response.text();
      
      // Parse and prefetch additional resources
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Prefetch images, videos, iframes
      const resources = tempDiv.querySelectorAll(this.options.prefetchSelectors);
      await this.prefetchResources(resources);

      // Cache the content
      this.preloadedContent.set(url, html);
      
      // Remove from active requests
      this.activeRequests.delete(url);

      return html;
    } catch (error) {
      console.warn(`Preload failed for ${url}:`, error);
      this.activeRequests.delete(url);
      return null;
    }
  }

  // Prefetch resources (same as previous implementation)
  async prefetchResources(resources) {
    const prefetchPromises = Array.from(resources).map(async (el) => {
      if (el.tagName === 'IMG') {
        return this.prefetchImage(el.src);
      }
      
      if (el.tagName === 'VIDEO') {
        return this.prefetchVideo(el.src);
      }
      
      if (el.tagName === 'IFRAME') {
        return this.prefetchIframe(el.src);
      }
      
      if (el.classList.contains('cad-viewer')) {
        const modelPath = el.getAttribute('data-model');
        return this.prefetchSTL(modelPath);
      }
    });

    await Promise.allSettled(prefetchPromises);
  }

  // Individual resource prefetch methods remain the same as in previous implementation

  // Preload all specified URLs
  async preloadAllContent(urls) {
    const loadPromises = urls.map(url => this.preloadSection(url));
    await Promise.allSettled(loadPromises);
  }

  // New method to handle navigation
  setupNavigationPreloading() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const url = link.getAttribute('href');
        
        try {
          // Preload the page if not already cached
          if (!this.preloadedContent.has(url)) {
            await this.preloadSection(url);
          }

          // Navigate to the page
          window.location.href = url;
        } catch (error) {
          console.error('Preload navigation error:', error);
          // Fallback to normal navigation
          window.location.href = url;
        }
      });
    });
  }
}

// Create a global instance
window.contentPreloader = new ContentPreloader();

// Export for module usage if needed
export default ContentPreloader;
