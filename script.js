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
                const navbarHeight = 70; // Height of fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form');
const donationForm = document.querySelector('.donation-form');
const newsletterForm = document.querySelector('.newsletter-form');

// Contact form submission - handled below with Netlify Forms integration

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
    const faqItems = document.querySelectorAll('.faq-list .faq-item');
    
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

// Science section accordion
document.addEventListener('DOMContentLoaded', () => {
    const scienceItems = document.querySelectorAll('.science-item');

    function openScienceItem(item, scrollIntoView = false) {
        scienceItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('open');
                const heading = otherItem.querySelector('.science-item-heading');
                if (heading) {
                    heading.setAttribute('aria-expanded', 'false');
                }
            }
        });

        item.classList.add('open');
        const heading = item.querySelector('.science-item-heading');
        if (heading) {
            heading.setAttribute('aria-expanded', 'true');
        }

        if (scrollIntoView) {
            const navbarHeight = 70;
            const targetPosition = item.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }

    scienceItems.forEach(item => {
        const heading = item.querySelector('.science-item-heading');
        if (!heading) return;

        const toggleItem = () => {
            const isOpen = item.classList.contains('open');
            if (isOpen) {
                item.classList.remove('open');
                heading.setAttribute('aria-expanded', 'false');
            } else {
                openScienceItem(item);
            }
        };

        heading.addEventListener('click', toggleItem);
        heading.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleItem();
            }
        });
    });

    document.querySelectorAll('.science-jump-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetItem = document.querySelector(targetId);
            if (targetItem) {
                openScienceItem(targetItem, true);
            }
        });
    });

    if (window.location.hash.startsWith('#science')) {
        const hashTarget = document.querySelector(window.location.hash);
        if (hashTarget && hashTarget.classList.contains('science-item')) {
            openScienceItem(hashTarget, true);
        }
    }
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
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton);
        
        // Get form data
        const formData = new FormData(this);
        
        try {
            // Submit to Netlify Forms
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                resetLoading();
                showMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
                this.reset();
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (error) {
            resetLoading();
            showMessage(error.message || 'There was an error sending your message. Please try again or contact us directly.', 'error');
        }
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
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const resetLoading = addLoadingState(submitButton);

        const formData = new FormData(this);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                resetLoading();
                showMessage('Thank you for subscribing to our newsletter! You will receive healing tips and updates.', 'success');
                this.reset();
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        } catch (error) {
            resetLoading();
            showMessage(error.message || 'There was an error subscribing. Please try again later.', 'error');
        }
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
    
    // Add main content landmark on homepage
    const existingMain = document.getElementById('main-content');
    const hero = document.querySelector('.hero');
    if (hero && !existingMain) {
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

// Green Lotus "A Space to Let Go" — monthly Mindbody registration links.
// Add new months to this list as links become available; the site picks the next upcoming date automatically.
const GREEN_LOTUS_EVENTS = [
    {
        date: '2026-08-02',
        label: 'August 2, 2026',
        url: 'https://clients.mindbodyonline.com/classic/ws?studioid=3142&stype=-7&sTG=10&sView=day&sLoc=2&sTrn=100000804&date=08/02/26'
    },
    {
        date: '2026-09-06',
        label: 'September 6, 2026',
        url: 'https://clients.mindbodyonline.com/classic/ws?studioid=3142&stype=-7&sTG=10&sView=day&sLoc=2&sTrn=100000804&date=09/06/26'
    },
    {
        date: '2026-10-04',
        label: 'October 4, 2026',
        url: 'https://clients.mindbodyonline.com/classic/ws?studioid=3142&stype=-7&sTG=10&sView=day&sLoc=2&sTrn=100000804&date=10/04/26'
    },
    {
        date: '2026-11-01',
        label: 'November 1, 2026',
        url: 'https://clients.mindbodyonline.com/classic/ws?studioid=3142&stype=-7&sTG=10&sView=day&sLoc=2&sTrn=100000804&date=11/01/26'
    },
    {
        date: '2026-12-06',
        label: 'December 6, 2026',
        url: 'https://clients.mindbodyonline.com/classic/ws?studioid=3142&stype=-7&sTG=10&sView=day&sLoc=2&sTrn=100000804&date=12/06/26'
    }
];

function initGreenLotusEvent() {
    const dateEl = document.getElementById('green-lotus-next-date');
    const linkEl = document.getElementById('green-lotus-register-link');
    if (!dateEl || !linkEl || GREEN_LOTUS_EVENTS.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = GREEN_LOTUS_EVENTS.find((event) => {
        const eventDate = new Date(`${event.date}T00:00:00`);
        return eventDate >= today;
    }) || GREEN_LOTUS_EVENTS[GREEN_LOTUS_EVENTS.length - 1];

    dateEl.textContent = `Next: ${upcoming.label}`;
    linkEl.href = upcoming.url;
}

document.addEventListener('DOMContentLoaded', initGreenLotusEvent);

// Console welcome message
console.log('%c🌸 Ember in Bloom Foundation', 'color: #8B5A8C; font-size: 20px; font-weight: bold;');
console.log('%cReclaiming herself, one breath at a time.', 'color: #F4A6A6; font-size: 14px; font-style: italic;');
console.log('%cThank you for supporting our mission of healing and empowerment.', 'color: #666; font-size: 12px;');
