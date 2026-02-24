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

// ===== Scroll Reveal Animation =====
const revealElements = () => {
    // Select all elements to animate
    const elementsToReveal = document.querySelectorAll(`
        .section-header,
        .hero-text,
        .hero-visual,
        .about-content > *,
        .education-card,
        .terminal-window,
        .project-card,
        .skill-category,
        .skill-category-card,
        .concept-item,
        .tool-card,
        .certificate-card,
        .contact-card,
        .contact-form-wrapper
    `);

    // Add reveal class to all elements
    elementsToReveal.forEach(el => {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
        }
    });

    // Add stagger class to grid containers
    document.querySelectorAll('.projects-grid, .certificates-grid, .skills-grid, .skills-categories, .concepts-grid, .tools-grid').forEach(el => {
        el.classList.add('reveal-stagger');
    });

    // Create observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing (animation plays once)
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
};

// ===== Skill Progress Bar Animation =====
const animateSkillBars = () => {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger the progress bar animation
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
};

// ===== Skill Category Filtering =====
const initSkillFilters = () => {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const categoryCards = document.querySelectorAll('.skill-category-card');
    
    if (!filterButtons.length || !categoryCards.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            categoryCards.forEach((card, index) => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    // Show matching cards with stagger delay
                    card.classList.remove('hidden');
                    card.style.transitionDelay = `${index * 0.1}s`;
                    
                    // Re-trigger skill animations
                    const skillItems = card.querySelectorAll('.skill-item');
                    skillItems.forEach((item, i) => {
                        item.classList.remove('animate');
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, (index * 100) + (i * 100));
                    });
                } else {
                    // Hide non-matching cards
                    card.classList.add('hidden');
                    card.style.transitionDelay = '0s';
                }
            });
        });
    });
};

// Initialize reveal animations after DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure styles are applied
    setTimeout(revealElements, 100);
    setTimeout(animateSkillBars, 200);
    initSkillFilters();
});

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
%c🚀 Hey there, Developer!
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%cThanks for exploring my portfolio.
%cBuilt with passion + neon vibes ✨

%c📧 bhurgrimustafa203@gmail.com
%c💼 linkedin.com/in/ahmed-mustafa
%c🌐 github.com/ahmed-mustafa
`, 
'font-size: 18px; font-weight: bold; color: #00F5D4; text-shadow: 0 0 10px #00F5D4;',
'color: #A855F7;',
'font-size: 13px; color: #F9FAFB;',
'font-size: 12px; color: #A855F7;',
'font-size: 11px; color: #00F5D4;',
'font-size: 11px; color: #00F5D4;',
'font-size: 11px; color: #00F5D4;'
);

// ===== Enhanced Neon Glow Animation on Scroll =====
const addNeonInteractivity = () => {
    // Add glow pulse to nav links on hover
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.animation = 'neon-pulse 1.5s ease-in-out infinite';
        });
        link.addEventListener('mouseleave', () => {
            link.style.animation = '';
        });
    });

    // Add magnetic effect to buttons 
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // Add parallax to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        }, { passive: true });
    }
};

// Initialize neon interactivity
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addNeonInteractivity, 200);
});

// ===== Card Tilt Effect =====
const addTiltEffect = () => {
    const cards = document.querySelectorAll('.project-card, .certificate-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
};

// Initialize tilt effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addTiltEffect, 300);
});
