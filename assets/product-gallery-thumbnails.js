// Product Gallery Thumbnails Functionality
class ProductGalleryThumbnails {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupThumbnails());
    } else {
      this.setupThumbnails();
    }
  }

  setupThumbnails() {
    const mediaGalleries = document.querySelectorAll('media-gallery');
    
    mediaGalleries.forEach(gallery => {
      this.setupGallery(gallery);
    });
  }

  setupGallery(gallery) {
    const viewer = gallery.querySelector('[id^="GalleryViewer"]');
    const thumbnails = gallery.querySelector('[id^="GalleryThumbnails"]');
    
    if (!viewer || !thumbnails) {
      console.log('Gallery components not found, retrying...');
      // Retry after a short delay in case components are still loading
      setTimeout(() => this.setupGallery(gallery), 100);
      return;
    }

    const thumbnailButtons = thumbnails.querySelectorAll('.thumbnail');
    const mediaItems = viewer.querySelectorAll('[data-media-id]');

    // Add click event listeners to thumbnail buttons
    thumbnailButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const targetMediaId = button.closest('[data-target]')?.dataset.target;
        if (targetMediaId) {
          this.switchToMedia(gallery, targetMediaId);
        }
      });
    });

    // Set initial active state
    this.updateActiveStates(gallery);
    
    // Also handle window resize to ensure thumbnails work after layout changes
    window.addEventListener('resize', () => {
      setTimeout(() => this.updateActiveStates(gallery), 100);
    });
  }

  switchToMedia(gallery, mediaId) {
    const viewer = gallery.querySelector('[id^="GalleryViewer"]');
    const thumbnails = gallery.querySelector('[id^="GalleryThumbnails"]');
    
    if (!viewer || !thumbnails) return;

    // Remove active class from all media items
    viewer.querySelectorAll('[data-media-id]').forEach(item => {
      item.classList.remove('is-active');
    });

    // Add active class to target media item
    const targetMedia = viewer.querySelector(`[data-media-id="${mediaId}"]`);
    if (targetMedia) {
      targetMedia.classList.add('is-active');
      
      // Scroll to the active media item
      targetMedia.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // Update thumbnail active states
    this.updateActiveStates(gallery);
  }

  updateActiveStates(gallery) {
    const viewer = gallery.querySelector('[id^="GalleryViewer"]');
    const thumbnails = gallery.querySelector('[id^="GalleryThumbnails"]');
    
    if (!viewer || !thumbnails) return;

    // Get the currently active media item
    const activeMedia = viewer.querySelector('[data-media-id].is-active');
    if (!activeMedia) return;

    const activeMediaId = activeMedia.dataset.mediaId;

    // Update thumbnail active states
    thumbnails.querySelectorAll('.thumbnail').forEach(button => {
      const thumbnailItem = button.closest('[data-target]');
      if (thumbnailItem && thumbnailItem.dataset.target === activeMediaId) {
        button.setAttribute('aria-current', 'true');
        button.classList.add('is-active');
      } else {
        button.removeAttribute('aria-current');
        button.classList.remove('is-active');
      }
    });
  }
}

// Initialize the thumbnail functionality
new ProductGalleryThumbnails();

// Also initialize when sections are updated (for dynamic content)
document.addEventListener('shopify:section:load', (event) => {
  if (event.target.querySelector('media-gallery')) {
    new ProductGalleryThumbnails();
  }
});

// Initialize on page load and after any AJAX updates
document.addEventListener('DOMContentLoaded', () => {
  new ProductGalleryThumbnails();
});

// Also initialize when the page is fully loaded
window.addEventListener('load', () => {
  new ProductGalleryThumbnails();
}); 