// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Special handling for home link - scroll to top
        if (href === '#home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form');
const donationForm = document.querySelector('.donation-form');
const newsletterForm = document.querySelector('.newsletter-form');

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.firstName || !data.lastName || !data.email || !data.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate form submission
        showMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
        this.reset();
    });
}

// Donation form submission
if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        if (!data.name || !data.email) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const amount = data.amount === 'custom' ? 'custom amount' : `$${data.amount}`;
        const monthly = data.monthly ? ' (monthly)' : '';
        
        showMessage(`Thank you for your donation of ${amount}${monthly}! Your support helps us provide free healing programs to survivors.`, 'success');
        this.reset();
    });
}

// Newsletter form submission
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        
        showMessage('Thank you for subscribing to our newsletter! You will receive healing tips and updates.', 'success');
        this.reset();
    });
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section, .service-item, .team-member, .involve-card, .event-item, .blog-post, .product-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');
        
        if (question && answer) {
            // Add click handler to question
            question.style.cursor = 'pointer';
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('p');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.paddingTop = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0';
                } else {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.paddingTop = '1rem';
                }
            });
            
            // Initialize closed state
            answer.style.maxHeight = '0';
            answer.style.paddingTop = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.3s ease-out, padding-top 0.3s ease-out';
        }
    });
});

// Stats counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Custom amount input for donation form
document.addEventListener('DOMContentLoaded', () => {
    const amountSelect = document.getElementById('amount');
    if (amountSelect) {
        amountSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                // Create custom amount input
                const customInput = document.createElement('input');
                customInput.type = 'number';
                customInput.name = 'customAmount';
                customInput.placeholder = 'Enter amount';
                customInput.style.cssText = `
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #E5E5E5;
                    border-radius: 10px;
                    font-size: 1rem;
                    margin-top: 0.5rem;
                `;
                
                // Remove existing custom input if any
                const existingCustom = document.querySelector('input[name="customAmount"]');
                if (existingCustom) {
                    existingCustom.remove();
                }
                
                this.parentNode.appendChild(customInput);
            } else {
                // Remove custom input if switching back to preset amounts
                const customInput = document.querySelector('input[name="customAmount"]');
                if (customInput) {
                    customInput.remove();
                }
            }
        });
    }
});

// Add loading states to forms
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;
    button.style.opacity = '0.7';
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    };
}

// Enhanced form submissions with loading states
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton);
        
        // Simulate API call
        setTimeout(() => {
            resetLoading();
            showMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
            this.reset();
        }, 2000);
    });
}

if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton);
        
        setTimeout(() => {
            resetLoading();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const amount = data.amount === 'custom' ? data.customAmount || 'custom amount' : `$${data.amount}`;
            const monthly = data.monthly ? ' (monthly)' : '';
            
            showMessage(`Thank you for your donation of ${amount}${monthly}! Your support helps us provide free healing programs to survivors.`, 'success');
            this.reset();
        }, 2000);
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton);
        
        setTimeout(() => {
            resetLoading();
            showMessage('Thank you for subscribing to our newsletter! You will receive healing tips and updates.', 'success');
            this.reset();
        }, 1500);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.id = 'main-content';
        hero.setAttribute('role', 'main');
    }
});

// Performance optimization: Lazy load images (if any are added later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Console welcome message
console.log('%c🌸 Ember in Bloom Foundation', 'color: #8B5A8C; font-size: 20px; font-weight: bold;');
console.log('%cReclaiming herself, one breath at a time.', 'color: #F4A6A6; font-size: 14px; font-style: italic;');
console.log('%cThank you for supporting our mission of healing and empowerment.', 'color: #666; font-size: 12px;');
