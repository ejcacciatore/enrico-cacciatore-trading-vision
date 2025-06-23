/**
 * Enrico Cacciatore - Trading Vision Presentation
 * Interactive presentation controller
 */

class PresentationController {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.startDataFlowAnimation();
        this.animateProgressBars();
        
        // Auto-start progress bar animations for first slide
        setTimeout(() => {
            this.animateCurrentSlideElements();
        }, 1000);
    }

    bindEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'Space':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only respond to horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    this.nextSlide();
                } else if (diffX < -50) {
                    this.prevSlide();
                }
            }
        });

        // Navigation dots click events
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                }
            });
        });

        // Prevent context menu on right click for cleaner presentation
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    showSlide(index) {
        if (index < 0 || index >= this.totalSlides || this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;

        // Hide current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.navDots[this.currentSlide].classList.remove('active');
        
        // Show new slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.navDots[this.currentSlide].classList.add('active');
        
        // Animate elements in the new slide
        setTimeout(() => {
            this.animateCurrentSlideElements();
            this.isTransitioning = false;
        }, 400);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    animateCurrentSlideElements() {
        const currentSlideElement = this.slides[this.currentSlide];
        
        // Animate progress bars
        const progressBars = currentSlideElement.querySelectorAll('.progress-fill');
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300 + (index * 100));
        });

        // Animate cards with stagger effect
        const cards = currentSlideElement.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 200 + (index * 100));
        });

        // Animate performance indicators
        const indicators = currentSlideElement.querySelectorAll('.performance-indicator');
        indicators.forEach((indicator, index) => {
            const value = indicator.querySelector('.indicator-value');
            if (value) {
                value.style.transform = 'scale(0)';
                setTimeout(() => {
                    value.style.transform = 'scale(1)';
                    value.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }, 400 + (index * 150));
            }
        });

        // Animate timeline items
        const timelineItems = currentSlideElement.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.style.transition = 'all 0.6s ease';
            }, 300 + (index * 200));
        });
    }

    startDataFlowAnimation() {
        // Restart data flow animations periodically
        setInterval(() => {
            const flows = document.querySelectorAll('.data-flow');
            flows.forEach(flow => {
                flow.style.animationDelay = Math.random() * 6 + 's';
            });
        }, 7000);
    }

    animateProgressBars() {
        // Animate progress bars when they come into view
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const width = bar.getAttribute('data-width') || bar.style.width;
                            bar.style.width = width;
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);

        this.slides.forEach(slide => {
            observer.observe(slide);
        });
    }

    // Utility method to get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide + 1,
            total: this.totalSlides,
            percentage: ((this.currentSlide + 1) / this.totalSlides) * 100
        };
    }

    // Add fullscreen toggle functionality
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Auto-advance functionality (optional)
    startAutoAdvance(intervalMs = 10000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else {
                this.stopAutoAdvance();
            }
        }, intervalMs);
    }

    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    
    // Make presentation controller globally available for debugging
    window.presentation = presentation;
    
    // Add keyboard shortcuts display (optional)
    console.log(`
        🎯 Enrico Cacciatore - Trading Vision Presentation
        
        Keyboard shortcuts:
        → / Space: Next slide
        ← : Previous slide
        Home: First slide
        End: Last slide
        
        Current slide: ${presentation.getCurrentSlideInfo().current}/${presentation.getCurrentSlideInfo().total}
    `);
});

// Utility function for external navigation
window.showSlide = function(index) {
    if (window.presentation) {
        window.presentation.goToSlide(index);
    }
};

// Performance optimization: Preload critical resources
window.addEventListener('load', () => {
    // Preload fonts
    const fontUrls = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    fontUrls.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
    
    // Add loading complete class for any additional animations
    document.body.classList.add('loaded');
});