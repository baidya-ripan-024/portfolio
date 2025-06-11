document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const dynamicHeadline = document.getElementById('dynamic-headline');
    const toggleMoreAboutBtn = document.getElementById('toggle-more-about');
    const moreAboutContent = document.getElementById('more-about-me');
    const backToTopButton = document.querySelector('.back-to-top');
    const currentYearSpan = document.getElementById('current-year');


    // Sticky Navbar & Active Link Highlighting
    const sections = document.querySelectorAll('section[id]'); // All sections with an ID

    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    function highlightNavLink() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; 
            let sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        scrollHeader();
        highlightNavLink();
        toggleBackToTopButton();
    });

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }


    // Light/Dark Mode Toggle
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggleCheckbox.checked = true;
        }
    }

    themeToggleCheckbox.addEventListener('change', () => {
        if (themeToggleCheckbox.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Hero Section: Dynamic Typing Headline
    const roles = [
        "Turning Coffee into Code ☕💻",
        "Java|Spring Boot|Microservices 🚀",
        "AI-Powered Development 🤖",
        "Open to Collaboration 🤝"
    ];
            
    let roleIndex = 0;
    let charIndex = 0;
    let currentText = '';
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenRoles = 1500;

    function type() {
        const fullText = roles[roleIndex];
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
        }

        dynamicHeadline.textContent = currentText;

        let typeSpeedToUse = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === fullText.length) {
            typeSpeedToUse = delayBetweenRoles;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeedToUse = typingSpeed;
        }

        setTimeout(type, typeSpeedToUse);
    }
    if (dynamicHeadline) type(); // Start typing effect if element exists


    // About Section: Toggleable "More About Me"
    if (toggleMoreAboutBtn && moreAboutContent) {
        toggleMoreAboutBtn.addEventListener('click', () => {
            const isExpanded = moreAboutContent.classList.contains('expanded');
            moreAboutContent.classList.toggle('expanded');
            moreAboutContent.classList.toggle('collapsed', !isExpanded); // Add collapsed if not expanded
            toggleMoreAboutBtn.textContent = isExpanded ? 'Read More' : 'Read Less';
        });
    }

    // Intersection Observer for Animations (Skills progress bars, general section fade-ins)
    const animatedElements = document.querySelectorAll('.content-section, .skill-category, .project-card, .timeline-item');
    const progressBars = document.querySelectorAll('.progress-bar');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-anim'); // General fade-in animation

                // Specific for progress bars
                if (entry.target.classList.contains('progress-bar')) {
                    // entry.target.style.width = entry.target.dataset.progress + '%'; // Assuming data-progress attribute
                    // No, we set width directly from its style attribute in HTML (which is the target value)
                    entry.target.style.width = entry.target.parentElement.querySelector('.progress-bar').style.width;
                }
                // For skill categories that contain progress bars, animate them when category is visible
                if (entry.target.classList.contains('skill-category')) {
                    const barsInSkillCat = entry.target.querySelectorAll('.progress-bar');
                    barsInSkillCat.forEach(bar => {
                        // The width is already set via inline style in HTML.
                        // We just need to ensure the transition happens.
                        // The 'visible-anim' might trigger it if transition is on width.
                        // Let's explicitly trigger re-application if needed, but CSS transition should handle it.
                        bar.style.width = bar.style.width; // Re-apply to trigger transition if needed
                    });
                }


                if (!entry.target.classList.contains('progress-bar')) { // Don't unobserve progress bars directly
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            }
        });
    };

    const animationObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
        // Add hidden-anim class initially for elements to be animated on scroll
        if (!el.classList.contains('progress-bar')) { // Progress bars don't need this fade-in
            el.classList.add('hidden-anim');
        }
        animationObserver.observe(el);
    });

    // Observe progress bars separately for their width animation
    progressBars.forEach(bar => {
        animationObserver.observe(bar);
    });


    // 6. Footer: Current Year & Back-to-Top Button
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    if (backToTopButton) { // Initial check on load
        toggleBackToTopButton();
    }


    // Contact Form Submission (Basic - No actual sending without backend)
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            formStatus.textContent = "Sending...";
            formStatus.className = '';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Message sent successfully!";
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    formStatus.textContent = `Error: ${errorData.error || 'Could not send message.'}`;
                    formStatus.classList.add('error');
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formStatus.textContent = "An error occurred. Please try again.";
                formStatus.classList.add('error');
            }

            setTimeout(() => {
                formStatus.textContent = "";
                formStatus.className = "";
            }, 5000);
        });
    }


    // Lazy Loading for Images (Example setup)
    // Add class "lazy" to your <img> tags and specify src in data-src
    // <img data-src="image.jpg" alt="..." class="lazy">
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded'); // Optional: for styling loaded images
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 100px 0px" }); // Load 100px before it enters viewport

    lazyImages.forEach(img => lazyLoadObserver.observe(img));

});

// Optional: Particle.js Initialization (if you choose to use it)

// if (document.getElementById('particles-js')) { // Assuming hero background div has id 'particles-js'
//     particlesJS.load('particles-js', 'assets/particles.json', function() {
//         console.log('particles.js loaded - callback');
//     });
// }

// smooth scroll to top functionality
document.querySelector('.back-to-top').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// scrool visibly toggle
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});


// Modal functionality
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const closeBtn = document.getElementById('modal-close');

document.querySelectorAll('.profile-clickable').forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
    });
});

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// project tech stack
document.querySelectorAll('.project-tech-stack').forEach(el => {
    const items = el.textContent.split(',').map(s => s.trim());
    el.innerHTML = '';
    items.forEach(item => {
        const span = document.createElement('span');
        span.textContent = item;
        el.appendChild(span);
    });
});