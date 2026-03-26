/* =============================================
   SAYYED TAHA — PORTFOLIO SCRIPTS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ===========================================
       1. INTRO / PRELOADER
       =========================================== */
    const intro = document.getElementById('intro-screen');
    const fillBar = document.getElementById('introLoaderFill');
    const introParticlesContainer = document.getElementById('introParticles');

    // Spawn floating particles in intro
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('intro-particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 4 + 's';
        p.style.animationDuration = (3 + Math.random() * 3) + 's';
        introParticlesContainer.appendChild(p);
    }

    // Animate loader bar 0→100%
    let progress = 0;
    const loaderInterval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loaderInterval);
            setTimeout(() => {
                intro.classList.add('hide');
                document.body.style.overflow = '';
                initPageAnimations();
            }, 400);
        }
        fillBar.style.width = progress + '%';
    }, 80);

    // Prevent scroll while loading
    document.body.style.overflow = 'hidden';

    /* ===========================================
       2. CUSTOM CURSOR
       =========================================== */
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });
        (function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        })();
        // Grow cursor on links/buttons
        document.querySelectorAll('a, button, .project-card, .skill-category, .contact-card, .social-link').forEach(el => {
            el.addEventListener('mouseenter', () => {
                dot.classList.add('hover');
                outline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                dot.classList.remove('hover');
                outline.classList.remove('hover');
            });
        });
    }

    /* ===========================================
       3. NAVBAR
       =========================================== */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll → shrink nav
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        highlightNavLink();
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Highlight current section
    function highlightNavLink() {
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.scrollY >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    /* ===========================================
       4. TYPEWRITER
       =========================================== */
    const phrases = [
        'scalable web apps.',
        'AI-powered dashboards.',
        'secure systems.',
        'elegant UIs.',
        'automation tools.',
        'cybersecurity solutions.'
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;
    const typewriterEl = document.getElementById('typewriter');

    function typeEffect() {
        const current = phrases[phraseIdx];
        typewriterEl.textContent = current.substring(0, charIdx);

        if (!isDeleting) {
            charIdx++;
            if (charIdx > current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1800);
                return;
            }
        } else {
            charIdx--;
            if (charIdx < 0) {
                isDeleting = false;
                charIdx = 0;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }
        setTimeout(typeEffect, isDeleting ? 35 : 70);
    }

    /* ===========================================
       5. PARTICLE CANVAS
       =========================================== */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99,102,241,${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        animId = requestAnimationFrame(animateParticles);
    }

    /* ===========================================
       6. SCROLL ANIMATIONS (IntersectionObserver)
       =========================================== */
    function initPageAnimations() {
        // Typewriter
        typeEffect();

        // Particles
        initParticles();
        animateParticles();

        // Counter animation
        animateCounters();

        // Observe elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => entry.target.classList.add('animated'), Number(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }

    /* ===========================================
       7. COUNTER ANIMATION
       =========================================== */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count);
                    let current = 0;
                    const increment = Math.ceil(target / 40);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        el.textContent = current;
                    }, 50);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    /* ===========================================
       8. CONTACT FORM (Frontend only)
       =========================================== */
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !subject || !message) return;

        // Open mailto as fallback
        const mailtoLink = `mailto:sayyedtaha02@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        window.location.href = mailtoLink;
        form.reset();
    });

    /* ===========================================
       9. SMOOTH SCROLL FOR ANCHOR LINKS
       =========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
