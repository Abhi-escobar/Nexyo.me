/* ===================== CURSOR GLOW ===================== */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ===================== NAVBAR ===================== */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 120) current = sec.id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ===================== SCROLL REVEAL ===================== */
const revealEls = document.querySelectorAll('.reveal-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ===================== TYPEWRITER ===================== */
const words = ['Full Stack Developer', 'App Builder',  'Problem Solver'];
let wordIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriter-text');

function typewriter() {
  if (!twEl) return;
  const word = words[wordIdx];
  if (deleting) {
    charIdx--;
    twEl.textContent = word.slice(0, charIdx);
    if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
    setTimeout(typewriter, 60);
  } else {
    charIdx++;
    twEl.textContent = word.slice(0, charIdx);
    if (charIdx === word.length) { deleting = true; setTimeout(typewriter, 1800); return; }
    setTimeout(typewriter, 90);
  }
}
setTimeout(typewriter, 600);