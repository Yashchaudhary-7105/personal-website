document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initContactForm();
    initAnimations();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    // Handle scroll effect on navbar
    function handleScroll() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = !mobileNav.classList.contains('hidden');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        mobileNav.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileNav.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Smooth scrolling for navigation links
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            scrollToSection(targetId);
            closeMobileMenu();
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Add click listeners to all navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

// Smooth scrolling function
function scrollToSection(targetId) {
    const element = document.querySelector(targetId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .project-card, .skill-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Run on load
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Simulate form submission
        submitForm(data);
    }
    
    function validateForm(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject.trim()) {
            errors.push('Subject is required');
        }
        
        if (!data.message.trim()) {
            errors.push('Message is required');
        }
        
        if (errors.length > 0) {
            showNotification('Please fill in all required fields correctly.', 'error');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function submitForm(data) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            console.log('Form submitted:', data);
        }, 2000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981; color: white;' : ''}
        ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
        ${type === 'info' ? 'background: #3b82f6; color: white;' : ''}
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Initialize Lucide icons for the notification
    lucide.createIcons();
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Initialize animations and interactions
function initAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.about-card, .project-card, .skill-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Parallax effect for hero background
    function handleParallax() {
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    }
    
    // Throttled scroll handler for parallax
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Handle tab navigation for better accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initLazyLoading();

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const mobileNav = document.getElementById('mobileNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileNav && !mobileNav.classList.contains('hidden')) {
            mobileNav.classList.add('hidden');
            mobileMenuBtn.querySelector('.menu-icon').classList.remove('hidden');
            mobileMenuBtn.querySelector('.close-icon').classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}, 250));

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
