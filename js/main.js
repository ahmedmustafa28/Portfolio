// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const backToTopBtn = document.getElementById('backToTop');
const dynamicText = document.getElementById('dynamic-text');
const contactForm = document.getElementById('contact-form');
const toastContainer = document.getElementById('toast-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// ===== Theme Toggle =====
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    if (theme === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Check for saved theme or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('dark'); // Default to dark
    }
}

// Initialize theme on load
initTheme();

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// ===== Typing Animation (Limited roles) =====
const roles = [
    'code meets creativity',
    'problems get solved',
    'ideas become reality'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        dynamicText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        dynamicText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
    }

    setTimeout(typeRole, typeSpeed);
}

// Start typing with delay
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeRole, 800);
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    // Add scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (currentScroll > 400) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
    
    lastScroll = currentScroll;
}, { passive: true });

// ===== Mobile Menu =====
hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ===== Update Active Nav Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

// ===== Back to Top =====
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Toast Notification System =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}"></i>
        </div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
}

// ===== Form Validation & Submission =====
const formFields = {
    name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Please enter your name (at least 2 characters)'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    subject: {
        validate: (value) => value.trim().length >= 3,
        message: 'Please enter a subject (at least 3 characters)'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Please enter a message (at least 10 characters)'
    }
};

// Real-time validation
Object.keys(formFields).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', () => validateField(fieldName));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(fieldName);
            }
        });
    }
});

function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = field.parentElement.querySelector('.error-message');
    const { validate, message } = formFields[fieldName];
    
    if (!validate(field.value)) {
        field.classList.add('error');
        errorElement.textContent = message;
        return false;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        return true;
    }
}

function validateForm() {
    let isValid = true;
    Object.keys(formFields).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });
    return isValid;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Get form data
    const formData = new FormData(contactForm);
    
    try {
        // Submit to Formspree
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            // Server error
            const data = await response.json();
            if (data.errors) {
                showToast(data.errors.map(err => err.message).join(', '), 'error');
            } else {
                showToast('Oops! Something went wrong. Please try again.', 'error');
            }
        }
    } catch (error) {
        // Network error
        console.error('Form submission error:', error);
        showToast('Network error. Please check your connection and try again.', 'error');
    }
    
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in animation to elements
document.querySelectorAll('.education-card, .exp-card, .project-card, .skill-category, .contact-card, .contact-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeInObserver.observe(el);
});

// Add visible styles
const style = document.createElement('style');
style.textContent = `
    .education-card.visible, .exp-card.visible, .project-card.visible, 
    .skill-category.visible, .contact-card.visible, .contact-form-wrapper.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// ===== Focus Trap for Mobile Menu =====
function trapFocus(element) {
    const focusableElements = element.querySelectorAll('a, button, input, textarea, select');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        
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
    });
}

// ===== Lazy Loading Images (for when real images are added) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Console Message =====
console.log(`
%c👋 Hey there!
%cThanks for checking out my portfolio.
%cLooking for someone to build something great? Let's connect!

📧 bhurgrimustafa203@gmail.com
💼 linkedin.com/in/ahmed-mustafa
`, 
'font-size: 20px; font-weight: bold; color: #6366f1;',
'font-size: 14px; color: #94a3b8;',
'font-size: 12px; color: #64748b;'
);
