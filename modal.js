/**
 * Modal.js - Fullscreen Image Viewer for Gallery
 * Handles opening/closing modal and navigation between images
 */

(function() {
    'use strict';

    // Get DOM elements
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // State
    let currentIndex = 0;
    let images = [];

    // Initialize: Collect all image sources
    function init() {
        if (!modal || !modalImage) return;
        
        images = Array.from(galleryItems).map(item => {
            const img = item.querySelector('img');
            return img ? img.src : null;
        }).filter(Boolean);

        // Attach click handlers to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openModal(index));
        });

        // Close modal handlers
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        // Get modal nav container
        const modalNav = document.querySelector('.modal-nav');

        // Close on background click
        modal.addEventListener('click', (e) => {
            // Only close if clicking directly on modal background, not on nav or its children
            if (e.target === modal) {
                closeModal();
            }
        });

        // Prevent nav container from closing modal when clicking in empty space between buttons
        if (modalNav) {
            modalNav.addEventListener('click', (e) => {
                // Stop propagation for clicks on nav container (empty space between buttons)
                // Button clicks are handled separately and already stop propagation
                if (e.target === modalNav) {
                    e.stopPropagation();
                }
            });
        }

        // Navigation handlers
        if (modalPrev) {
            modalPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                navigatePrev();
            });
        }

        if (modalNext) {
            modalNext.addEventListener('click', (e) => {
                e.stopPropagation();
                navigateNext();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    // Open modal with specific image
    function openModal(index) {
        if (index < 0 || index >= images.length) return;
        
        currentIndex = index;
        modalImage.src = images[currentIndex];
        modal.classList.add('active');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Update navigation button visibility
        updateNavigation();
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate to previous image
    function navigatePrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImage.src = images[currentIndex];
        updateNavigation();
    }

    // Navigate to next image
    function navigateNext() {
        currentIndex = (currentIndex + 1) % images.length;
        modalImage.src = images[currentIndex];
        updateNavigation();
    }

    // Update navigation button states (if needed for edge cases)
    function updateNavigation() {
        // Could add logic here to hide/show prev/next buttons
        // For now, we allow circular navigation
    }

    // Handle keyboard navigation
    function handleKeyboard(e) {
        if (!modal.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigatePrev();
                break;
            case 'ArrowRight':
                navigateNext();
                break;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

