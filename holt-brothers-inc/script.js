// ================================
// NAVIGATION & SCROLL HANDLING
// ================================

const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Handle navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ================================
// SMOOTH SCROLLING & ACTIVE NAV
// ================================

// Update active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');

const updateActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', updateActiveNav);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// FORM HANDLING
// ================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.name || !data.email || !data.message || !data['project-type']) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // In a real implementation, you would send this data to a server
    // For now, we'll just show a success message
    console.log('Form submitted:', data);

    // Show success message
    alert('Thank you for your message! We will get back to you shortly.');

    // Reset form
    contactForm.reset();

    // In production, you would replace the above with an actual API call:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        alert('Thank you for your message! We will get back to you shortly.');
        contactForm.reset();
    })
    .catch(error => {
        alert('There was an error submitting your form. Please try again.');
        console.error('Error:', error);
    });
    */
});

// ================================
// INTERSECTION OBSERVER ANIMATIONS
// ================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate elements on scroll
const animateOnScroll = () => {
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .feature, .scope-item, .contact-item'
    );

    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        fadeInObserver.observe(element);
    });
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    updateActiveNav();
});

// ================================
// HERO PARALLAX EFFECT
// ================================

const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// ================================
// STATISTICS COUNTER ANIMATION
// ================================

const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const value = statNumber.textContent;

            // Only animate if it's a pure number
            if (!isNaN(value)) {
                animateCounter(statNumber, parseInt(value));
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ================================
// PERFORMANCE OPTIMIZATIONS
// ================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll-heavy functions
const debouncedUpdateNav = debounce(updateActiveNav, 10);
window.addEventListener('scroll', debouncedUpdateNav);

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================

// Trap focus in mobile menu when open
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

navMenu.addEventListener('keydown', (e) => {
    if (!navMenu.classList.contains('active')) return;

    const firstFocusable = navMenu.querySelectorAll(focusableElements)[0];
    const focusableContent = navMenu.querySelectorAll(focusableElements);
    const lastFocusable = focusableContent[focusableContent.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    // Close menu on Escape
    if (e.key === 'Escape') {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.focus();
    }
});

// ================================
// LOADING OPTIMIZATION
// ================================

// Add loaded class to body when page is fully loaded
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preload critical images (if you add actual images later)
const preloadImages = (imageUrls) => {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
};

// Call this with your image URLs when you add them
// preloadImages(['image1.jpg', 'image2.jpg']);
