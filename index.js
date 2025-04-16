document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    
    // Configuration
    const SLIDE_DURATION = 500; // Transition duration in ms
    const AUTO_SLIDE_DELAY = 4000; // Auto slide delay in ms
    
    // State
    let currentIndex = 0;
    let isAnimating = false;
    let autoSlideInterval;
    
    // Calculate dimensions
    const slideWidth = slides[0].offsetWidth + 20; // Include gap
    
    // Core slider functionality
    function updateSliderPosition(instant = false) {
        track.style.transition = instant ? 'none' : `transform ${SLIDE_DURATION}ms ease-in-out`;
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
        
        // Update active and adjacent slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === currentIndex + 1) {
                slide.classList.add('active');
            } else if (index === currentIndex) {
                slide.classList.add('prev');
            } else if (index === currentIndex + 2) {
                slide.classList.add('next');
            }
        });
    }
    
    function moveSlider(direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        const maxIndex = slides.length - 3; // Show 3 slides at a time
        
        if (direction === 'next') {
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        } else {
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        }
        
        updateSliderPosition();
        
        setTimeout(() => {
            isAnimating = false;
        }, SLIDE_DURATION);
    }
    
    // Auto slide functionality
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => moveSlider('next'), AUTO_SLIDE_DELAY);
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Event listeners
    prevButton.addEventListener('click', () => {
        moveSlider('prev');
        startAutoSlide(); // Reset interval
    });
    
    nextButton.addEventListener('click', () => {
        moveSlider('next');
        startAutoSlide(); // Reset interval
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate dimensions and update position
            const newSlideWidth = slides[0].offsetWidth + 20;
            currentIndex = Math.min(currentIndex, slides.length - 3);
            updateSliderPosition(true);
        }, 250);
    });
    
    // Initialize slider
    updateSliderPosition(true);
    startAutoSlide();
});
