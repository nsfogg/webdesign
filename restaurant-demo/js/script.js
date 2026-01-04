// ================================
// NAVIGATION & MOBILE MENU
// ================================

const navbar = document.getElementById('navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Handle navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

        // Animate hamburger
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';

        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ================================
// SMOOTH SCROLLING & ACTIVE NAV
// ================================

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
// MENU TABS
// ================================

const menuTabs = document.querySelectorAll('.menu-tab');
const menuContents = document.querySelectorAll('.menu-content');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');

        // Remove active class from all tabs and contents
        menuTabs.forEach(t => t.classList.remove('active'));
        menuContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.querySelector(`.menu-content[data-category="${category}"]`).classList.add('active');
    });
});

// ================================
// RESERVATION FORM HANDLING
// ================================

const reservationForm = document.getElementById('reservationForm');

// Set minimum date to today
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(reservationForm);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.name || !data.email || !data.phone || !data.guests || !data.date || !data.time) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number (e.g., 555-123-4567).');
        return;
    }

    // Check if selected date is not in the past
    const selectedDate = new Date(data.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
        alert('Please select a future date.');
        return;
    }

    // Success message
    console.log('Reservation submitted:', data);

    const guestText = data.guests === '1' ? '1 guest' : `${data.guests} guests`;
    const confirmationMessage = `Thank you, ${data.name}!\n\nYour reservation has been confirmed:\n\n` +
        `Date: ${new Date(data.date).toLocaleDateString()}\n` +
        `Time: ${convertTime(data.time)}\n` +
        `Guests: ${guestText}\n\n` +
        `We'll send a confirmation email to ${data.email}.`;

    alert(confirmationMessage);

    // Reset form
    reservationForm.reset();

    // In production, you would send this to a server:
    /*
    fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        // Handle success
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
});

// Helper function to convert 24h time to 12h format
function convertTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ================================
// SCROLL ANIMATIONS
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
        '.menu-item, .gallery-item, .feature-item, .info-item'
    );

    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;

        fadeInObserver.observe(element);
    });
};

// ================================
// PARALLAX EFFECT
// ================================

const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    }
});

// ================================
// GALLERY LIGHTBOX (Simple version)
// ================================

const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // In a real implementation, you would open a lightbox modal here
        // For this demo, we'll just add a subtle feedback
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    });
});

// ================================
// INITIALIZE
// ================================

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    updateActiveNav();

    // Add loaded class for any CSS transitions
    document.body.classList.add('loaded');
});

// ================================
// ACCESSIBILITY
// ================================

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';

        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Debounce scroll events
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

const debouncedUpdateNav = debounce(updateActiveNav, 10);
window.addEventListener('scroll', debouncedUpdateNav);
