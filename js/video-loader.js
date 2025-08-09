// videoLoader.js
class SmartVideoLoader {
    constructor(videoElement, options = {}) {
      this.video = videoElement;
      this.options = {
        poster: options.poster,
        compressed: options.compressed, 
        highQuality: options.highQuality,
        webm: options.webm,
        ...options
      };
      this.currentQuality = 'poster';
      this.init();
    }
  
    init() {
      this.showPoster();
      this.loadProgressive();
    }
  
    showPoster() {
      if (this.options.poster) {
        this.video.poster = this.options.poster;
      }
    }
  
    async loadProgressive() {
      try {
        // Load compressed first
        if (this.options.compressed) {
          await this.loadVideo(this.options.compressed);
          this.currentQuality = 'compressed';
        }
  
        // Load high quality if on good connection
        if (this.shouldLoadHQ()) {
          await this.loadVideo(this.options.highQuality);
          this.currentQuality = 'hq';
        }
      } catch (error) {
        console.warn('Video loading fallback:', error);
      }
    }
  
    loadVideo(src) {
      return new Promise((resolve, reject) => {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'auto';
        tempVideo.src = src;
        
        tempVideo.addEventListener('canplaythrough', () => {
          this.swapSource(src);
          resolve();
        });
        
        tempVideo.addEventListener('error', reject);
      });
    }
  
    swapSource(newSrc) {
      this.video.src = newSrc;
      this.video.load();
    }
  
    shouldLoadHQ() {
      const connection = navigator.connection;
      return !connection || connection.effectiveType === '4g';
    }
  }
  
  // Auto-initialize
  document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.video-background');
    if (heroVideo) {
        new SmartVideoLoader(heroVideo, {
            poster: 'landing/assets/videos/machining-poster.jpg',
            compressed: 'landing/assets/videos/machining-compressed.mp4',
            highQuality: 'landing/assets/videos/machining.mov',
            webm: 'landing/assets/videos/machining-compressed.webm'
          });
    }
  });