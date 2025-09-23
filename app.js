// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
        // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Initialize contact links
    initContactLinks();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize navbar effects
    initNavbarEffects();
        
        // Initialize mobile navigation
        initMobileNavigation();
    });

// Smooth scrolling navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(this);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Typing animation for hero section
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach((element, index) => {
        const text = element.getAttribute('data-text');
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        
        // Clear initial content
        element.textContent = '';
        
        setTimeout(() => {
            typeText(element, text, 100);
        }, delay);
    });
}

// Type text character by character
function typeText(element, text, speed = 100) {
    let i = 0;
    element.style.borderRight = '2px solid #00ff00';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    type();
}

// Contact links handling
function initContactLinks() {
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click effect
            const ripple = createRippleEffect(e, this);
            this.appendChild(ripple);
            
            // Show terminal message for feedback
            const linkType = this.classList.contains('email-link') ? 'email' : 'linkedin';
            const message = linkType === 'email' 
                ? 'Opening email client...' 
                : 'Opening LinkedIn profile...';
            
            showTerminalMessage(message, 'info');
            
            // Remove ripple after animation
            setTimeout(() => {
                if (this.contains(ripple)) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
        
        // Add hover sound effect (optional)
        link.addEventListener('mouseenter', function() {
            // Create a subtle terminal beep effect
            playTerminalBeep();
        });
    });
}

// Create ripple effect for contact links
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 255, 0, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        z-index: 2;
    `;
    
    return ripple;
}

// Play terminal beep sound (using Web Audio API)
function playTerminalBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio context is not supported
    }
}

// Show terminal-style messages
function showTerminalMessage(message, type = 'info') {
    const messageContainer = createTerminalMessage(message, type);
    document.body.appendChild(messageContainer);
    
    // Remove message after delay
    setTimeout(() => {
        messageContainer.style.opacity = '0';
        messageContainer.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(messageContainer)) {
                document.body.removeChild(messageContainer);
            }
        }, 300);
    }, 3000);
}

// Create terminal message element
function createTerminalMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 16px;
        color: #00ff00;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: ${type === 'success' ? '#00ff00' : type === 'error' ? '#ff5f56' : '#6B73FF'};">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Trigger animation
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    return messageDiv;
}

// Initialize scroll effects
function initScrollEffects() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards and sections for scroll animations
    const animatedElements = document.querySelectorAll('.card, .skill-category, .timeline-item');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
}

// Update navigation based on scroll position
function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navHeight = document.querySelector('.nav').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize navbar effects
function initNavbarEffects() {
    const navbar = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class for styling
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Utility function for throttling
function throttle(func, wait) {
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

// Add matrix rain effect (optional easter egg)
function initMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.05';
    
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px JetBrains Mono';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Add some interactive elements
document.addEventListener('DOMContentLoaded', function() {
        // Add hover effects to skill items
    const skillItems = document.querySelectorAll('.skill-list li');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.color = '#00ff00';
        
        // Initialize mobile navigation
        initMobileNavigation();
    });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = '';
        });
    });
    
    // Add click effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(event) {
            // Add click ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(0, 255, 0, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (this.contains(ripple)) {
                    this.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Konami code easter egg for matrix rain
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showTerminalMessage('Matrix mode activated! 🔥', 'success');
            initMatrixRain();
            konamiCode = [];
        }
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav.scrolled {
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(15px);
    }
    
    .nav-link.active {
        color: #00ff00;
        background: rgba(0, 255, 0, 0.1);
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }
    
    .nav-link.active::before {
        opacity: 1;
        transform: translateX(0);
    }
    
    .contact-link {
        position: relative;
    }
`;
// Mobile Navigation Handler
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }
}

document.head.appendChild(style);

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (!navToggle || !navLinks) {
        console.warn('Hamburger menu elements not found');
        return;
    }

    // Toggle mobile menu
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMobileMenu();
    });

    // Close menu when clicking on nav links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInsideNav = navToggle.contains(e.target) || navLinks.contains(e.target);
        const isMenuOpen = navLinks.classList.contains('active');

        if (!isClickInsideNav && isMenuOpen) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isActive = navLinks.classList.contains('active');

        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navToggle.classList.add('active');
        navLinks.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add mobile-specific class for styling
        body.classList.add('mobile-menu-open');

        // Terminal-style message
        // showTerminalMessage('> Opening navigation menu...', 'info');

        // Haptic feedback on mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Focus management for accessibility
        setTimeout(() => {
            const firstLink = navLinks.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }, 300);
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; // Restore scrolling

        // Remove mobile-specific class
        body.classList.remove('mobile-menu-open');

        // Return focus to hamburger button
        navToggle.focus();
    }

    // Enhanced terminal message for mobile
    function showTerminalMessage(message, type = 'info') {
        const messageContainer = createTerminalMessage(message, type);
        document.body.appendChild(messageContainer);

        // Position and animate
        setTimeout(() => {
            messageContainer.style.transform = 'translateX(0)';
            messageContainer.style.opacity = '1';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            messageContainer.style.opacity = '0';
            messageContainer.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (document.body.contains(messageContainer)) {
                    document.body.removeChild(messageContainer);
                }
            }, 300);
        }, 2000);
    }

    function createTerminalMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: var(--terminal-bg-light);
            border: 1px solid var(--terminal-green);
            border-radius: var(--radius-sm);
            padding: var(--space-12);
            color: var(--terminal-green);
            font-family: var(--font-family-mono);
            font-size: var(--font-size-sm);
            z-index: 10001;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
            transition: all 0.3s ease;
            transform: translateX(-100%);
            opacity: 0;
            backdrop-filter: blur(10px);
        `;

        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-8);">
                <span style="color: var(--terminal-green);">[${icon}]</span>
                <span>${message}</span>
            </div>
        `;

        return messageDiv;
    }
}

// Enhanced mobile navigation with better touch handling
function initMobileNavEnhancements() {
    const navLinks = document.querySelectorAll('.nav-link');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        navLinks.forEach(link => {
            // Enhanced touch feedback
            link.addEventListener('touchstart', function(e) {
                this.style.transform = 'translateX(8px) scale(1.02)';
                this.style.background = 'rgba(0, 255, 0, 0.15)';

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(25);
                }
            }, { passive: true });

            link.addEventListener('touchend', function(e) {
                this.style.transform = '';
                setTimeout(() => {
                    this.style.background = '';
                }, 150);
            }, { passive: true });

            link.addEventListener('touchcancel', function(e) {
                this.style.transform = '';
                this.style.background = '';
            }, { passive: true });
        });
    }
}

// Keyboard navigation for mobile menu
function initKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            const menuOpen = document.querySelector('.nav-links').classList.contains('active');

            if (!menuOpen) return;

            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextLink = navLinks[index + 1] || navLinks[0];
                    nextLink.focus();
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    const prevLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    prevLink.focus();
                    break;

                case 'Home':
                    e.preventDefault();
                    navLinks[0].focus();
                    break;

                case 'End':
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                    break;
            }
        });
    });
}

// Smart menu positioning for different screen sizes
function adjustMenuPosition() {
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');

    if (navLinks && navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const menuHeight = navLinks.offsetHeight;

        // Adjust menu position if it would go off-screen
        if (containerRect.bottom + menuHeight > viewportHeight) {
            navLinks.style.bottom = '100%';
            navLinks.style.top = 'auto';
            navLinks.style.borderRadius = 'var(--radius-lg) var(--radius-lg) 0 0';
        } else {
            navLinks.style.top = '100%';
            navLinks.style.bottom = 'auto';
            navLinks.style.borderRadius = '0 0 var(--radius-lg) var(--radius-lg)';
        }
    }
}

// Initialize all mobile navigation features
function initMobileNavigation() {
    initHamburgerMenu();
    initMobileNavEnhancements();
    initKeyboardNavigation();

    // Adjust menu position on resize
    window.addEventListener('resize', adjustMenuPosition);
    window.addEventListener('orientationchange', function() {
        setTimeout(adjustMenuPosition, 100);
    });
}