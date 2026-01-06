// ================================
// MOBILE MENU
// ================================

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const spans = mobileMenuToggle.querySelectorAll('span');

        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans.forEach(span => span.style.transform = 'none');
            spans[1].style.opacity = '1';
            document.body.style.overflow = '';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
        document.body.style.overflow = '';
    });
});

// ================================
// SMOOTH SCROLLING & ACTIVE NAV
// ================================

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
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
});

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
// EVENT FILTER
// ================================

const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter events
        eventCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ================================
// TICKET/EVENT BUTTONS
// ================================

const eventBtns = document.querySelectorAll('.event-btn');

eventBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const eventCard = e.target.closest('.event-card');
        const eventName = eventCard.querySelector('.event-name').textContent;

        alert(`🎫 Ticket purchase for "${eventName}" would open here!\n\nIn production, this would connect to your ticketing system.`);
    });
});

// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.name || !data.email || !data.inquiry || !data.message) {
        alert('⚠️ Please fill in all required fields!');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('⚠️ Please enter a valid email address!');
        return;
    }

    // Success message based on inquiry type
    let message = '';
    switch(data.inquiry) {
        case 'vip':
            message = `🍾 VIP Table Inquiry Received!\n\nThanks ${data.name}! Our VIP coordinator will contact you within 24 hours to discuss your reservation.`;
            break;
        case 'event':
            message = `🎉 Private Event Inquiry Received!\n\nThanks ${data.name}! Our events team will reach out shortly to plan your special night!`;
            break;
        case 'performance':
            message = `🎵 Performance Inquiry Received!\n\nThanks ${data.name}! Our booking manager will review your submission and get back to you soon!`;
            break;
        default:
            message = `✅ Message Received!\n\nThanks ${data.name}! We'll get back to you as soon as possible.`;
    }

    alert(message);
    contactForm.reset();

    // In production:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    */
});

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

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.feature-card, .stat-box, .drink-card, .vip-package'
    );

    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;

        fadeInObserver.observe(element);
    });

    // Add initial transition to event cards
    eventCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease, display 0.3s ease';
    });
});

// ================================
// NEON GLOW EFFECTS
// ================================

// Random glow intensity on drink cards
const drinkCards = document.querySelectorAll('.drink-card');

drinkCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const colors = ['#FF006E', '#00F5FF', '#A855F7', '#39FF14'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        card.style.boxShadow = `0 10px 40px ${randomColor}40`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// ================================
// PARALLAX EFFECT
// ================================

const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// ================================
// ACCESSIBILITY
// ================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
        document.body.style.overflow = '';
    }
});

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ NEON NIGHTS - Where the city comes alive ⚡');
    document.body.classList.add('loaded');
});
