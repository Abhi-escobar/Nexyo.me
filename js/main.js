// ── Typewriter (heading role words) ──────────────────────────────────────────
const words = ["Developer.", "Builder.", "Creator.", "Problem Solver."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 80 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
}

// ── Hamburger menu ────────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const hamburgerIcon = document.querySelector('.hamburger i');
const navItems = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    if (navLinks.classList.contains('active')) {
        hamburgerIcon.classList.remove('bx-menu');
        hamburgerIcon.classList.add('bx-x');
    } else {
        hamburgerIcon.classList.remove('bx-x');
        hamburgerIcon.classList.add('bx-menu');
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburgerIcon.classList.remove('bx-x');
        hamburgerIcon.classList.add('bx-menu');
    });
});

// ── BlurText — faithful vanilla port of React Bits BlurText component ─────────
//
// Props replicated:
//   delay       = 200ms    stagger between each word
//   animateBy   = 'words'  split by words
//   direction   = 'top'    starts from y: -50px
//   stepDuration = 0.35s   per keyframe step (2 steps → 0.7s total)
//   threshold   = 0.1
//   rootMargin  = '0px'
//   onAnimationComplete
//
// Keyframe sequence (matches defaultFrom/defaultTo in source):
//   [0]  filter:blur(10px)  opacity:0    y:-50px   ← animationFrom
//   [1]  filter:blur(5px)   opacity:0.5  y:+5px    ← toSnapshots[0]
//   [2]  filter:blur(0px)   opacity:1    y:0px     ← toSnapshots[1]

function BlurText(el, options = {}) {
    const {
        delay           = 200,
        animateBy       = 'words',
        direction       = 'top',
        stepDuration    = 0.35,
        threshold       = 0.1,
        rootMargin      = '0px',
        onAnimationComplete = null
    } = options;

    // ── 1. Build keyframe snapshots (mirrors buildKeyframes helper) ──────────
    const from = direction === 'top'
        ? { filter: 'blur(10px)', opacity: '0',   transform: 'translateY(-50px)' }
        : { filter: 'blur(10px)', opacity: '0',   transform: 'translateY(50px)'  };

    const toSnapshots = [
        { filter: 'blur(5px)',  opacity: '0.5', transform: direction === 'top' ? 'translateY(5px)' : 'translateY(-5px)' },
        { filter: 'blur(0px)',  opacity: '1',   transform: 'translateY(0px)' }
    ];

    const keyframes = [from, ...toSnapshots];

    // total duration = stepDuration × number of steps (2 steps)
    const totalDuration = stepDuration * toSnapshots.length * 1000; // ms

    // ── 2. Split text into token spans ───────────────────────────────────────
    const originalText = el.textContent.trim();
    el.textContent = '';
    el.style.display    = 'block';

    const tokens = animateBy === 'words' ? originalText.split(' ') : originalText.split('');
    const spans  = [];

    tokens.forEach((token, i) => {
        const span = document.createElement('span');
        // Match: segment === ' ' ? '\u00A0' : segment
        span.textContent = token === ' ' ? '\u00A0' : token;

        // Preserve space between words
        if (animateBy === 'words' && i < tokens.length - 1) {
            span.textContent += '\u00A0';
        }

        // Initial hidden state (matches initial={fromSnapshot})
        span.style.cssText = `
            display: inline-block;
            will-change: transform, filter, opacity;
            filter: ${from.filter};
            opacity: ${from.opacity};
            transform: ${from.transform};
        `;

        el.appendChild(span);
        spans.push(span);
    });

    // ── 3. Trigger on scroll (matches useEffect IntersectionObserver) ────────
    let animated = false;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                observer.disconnect();

                spans.forEach((span, i) => {
                    // Use Web Animations API — mirrors Framer Motion's keyframe + delay
                    const anim = span.animate(keyframes, {
                        duration:   totalDuration,
                        delay:      i * delay,         // (index * delay) / 1000 → ms
                        easing:     'ease',
                        fill:       'forwards'         // stay at final keyframe
                    });

                    // onAnimationComplete fires after the LAST word
                    if (i === spans.length - 1 && typeof onAnimationComplete === 'function') {
                        anim.onfinish = onAnimationComplete;
                    }
                });
            }
        });
    }, { threshold, rootMargin });

    observer.observe(el);
}




// ── Reveal on scroll ──────────────────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));

// ── Navbar scroll + active link ───────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(section => {
        if (scrollY >= (section.offsetTop - 200)) current = section.getAttribute('id');
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href').includes(current)) li.classList.add('active');
    });
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    if (typewriterElement) type();
});