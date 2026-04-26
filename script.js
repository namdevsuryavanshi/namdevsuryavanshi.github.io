
document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .cert-card, .cta-button, .tab-button');

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Typewriter Effect - Disabled for static role title
    // new Typed('#typewriter', {
    //     strings: ['Data Scientist', 'GenAI Engineer', 'ML Solutions Architect', 'RAG Specialist'],
    //     typeSpeed: 50,
    //     backSpeed: 50,
    //     loop: true
    // });

    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('is-active'); // For hamburger animation
    });

    // Close nav when a link is clicked (for mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('is-active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animate Sections on Scroll
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Staggered animation for items inside the section
                const items = entry.target.querySelectorAll('.project-card, .cert-card, .activity-list li, .logo-item, .achievement-item');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 0.1}s`;
                });

                // Count-up Animation for Highlights
                if (entry.target.classList.contains('highlights-section')) {
                    const counters = entry.target.querySelectorAll('.highlight');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const suffix = counter.innerText.includes('%') || target > 50 ? '%' : '';
                        let current = 0;
                        const increment = target / 100; // Adjust for speed

                        const updateCounter = () => {
                            if (current < target) {
                                current += increment;
                                counter.innerText = Math.ceil(current) + suffix;
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target + suffix;
                            }
                        };
                        updateCounter();
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    const highlightsSection = document.querySelector('.highlights-section');
    if (highlightsSection) {
        observer.observe(highlightsSection);
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Experience Tabs Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Function to switch tabs
    function switchTab(targetTab) {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('hidden', '');
        });
        
        // Add active class to clicked button and corresponding panel
        const activeButton = document.querySelector(`.tab-button[data-tab="${targetTab}"]`);
        const activePanel = document.getElementById(`exp-${targetTab}`);
        
        if (activeButton && activePanel) {
            activeButton.classList.add('active');
            activeButton.setAttribute('aria-selected', 'true');
            
            activePanel.classList.add('active');
            activePanel.removeAttribute('hidden');
            
            // Announce to screen readers
            if (announcer) {
                const companyName = activeButton.querySelector('.tab-company').textContent;
                announcer.textContent = `Now showing experience at ${companyName}`;
            }
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
        
        // Keyboard navigation support
        button.addEventListener('keydown', (e) => {
            const currentIndex = Array.from(tabButtons).indexOf(button);
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabButtons.length;
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[prevIndex].focus();
                tabButtons[prevIndex].click();
            }
        });
    });

    // Add screen reader announcements
    const experienceSection = document.getElementById('experience');
    let announcer = null;
    if (experienceSection) {
        announcer = document.createElement('div');
        announcer.classList.add('sr-only');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        experienceSection.appendChild(announcer);
    }
});
