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
// SMOOTH SCROLLING
// ================================

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
// ACTIVE NAV HIGHLIGHTING
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

// ================================
// MENU CATEGORY TABS
// ================================

const categoryBtns = document.querySelectorAll('.category-btn');
const menuSections = document.querySelectorAll('.menu-section');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');

        // Remove active class from all buttons and sections
        categoryBtns.forEach(b => b.classList.remove('active'));
        menuSections.forEach(s => s.classList.remove('active'));

        // Add active class to clicked button and corresponding section
        btn.classList.add('active');
        document.querySelector(`.menu-section[data-category="${category}"]`).classList.add('active');
    });
});

// ================================
// CONTACT FORM HANDLING
// ================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Validation
    if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields! 😊');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address! 📧');
        return;
    }

    // Success message
    const messages = [
        `Thanks ${data.name}! We can't wait to chat with you! ☕`,
        `Awesome! We'll get back to you super soon, ${data.name}! 🎉`,
        `You rock, ${data.name}! Message received! 💌`,
        `Woohoo! Thanks for reaching out, ${data.name}! ✨`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    alert(randomMessage);

    // Reset form
    contactForm.reset();

    // In production, send to server:
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

// Animate cards on scroll
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.value-card, .menu-card, .special-card'
    );

    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;

        fadeInObserver.observe(element);
    });
});

// ================================
// FUN INTERACTIONS
// ================================

// Add fun hover sounds (optional - commented out)
const menuCards = document.querySelectorAll('.menu-card');
menuCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Could add a subtle sound effect here
        card.style.transform = 'translateY(-8px) rotate(-1deg)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Random emoji rotation on logo
const logoIcon = document.querySelector('.logo-icon');
const coffeeEmojis = ['☕', '🥐', '🧁', '🍪', '🥯', '🍩'];
let currentEmojiIndex = 0;

if (logoIcon) {
    setInterval(() => {
        currentEmojiIndex = (currentEmojiIndex + 1) % coffeeEmojis.length;
        logoIcon.textContent = coffeeEmojis[currentEmojiIndex];
    }, 3000);
}

// ================================
// ACCESSIBILITY
// ================================

// Close menu on Escape
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
// EASTER EGGS
// ================================

// Click coffee cup for fun message
const coffeeCup = document.querySelector('.coffee-cup');
if (coffeeCup) {
    let clickCount = 0;
    coffeeCup.addEventListener('click', () => {
        clickCount++;
        const messages = [
            'Keep clicking! ☕',
            'You found the secret! 🎉',
            'Coffee lover detected! ❤️',
            'One more click... 😄',
            'Okay, you can stop now! 😂'
        ];

        if (clickCount <= messages.length) {
            coffeeCup.textContent = messages[clickCount - 1];
            setTimeout(() => {
                coffeeCup.textContent = '☕';
            }, 2000);
        }
    });
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('☕ Welcome to Cozy Corner Cafe! ☕');
    document.body.classList.add('loaded');
});
