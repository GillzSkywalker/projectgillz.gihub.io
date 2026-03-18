// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════════

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateCursor() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Enhance cursor on interactive elements
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '6px';
    cursor.style.height = '6px';
    cursor.style.background = 'var(--cyan)';
    cursorRing.style.width = '52px';
    cursorRing.style.height = '52px';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursor.style.background = 'transparent';
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STARFIELD ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const NUM_STARS = 300;
const NEBULA_PARTICLES = 8;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', () => {
  resize();
  initStars();
});

function initStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.85 ? '#00d4ff' : Math.random() > 0.9 ? '#ff2d78' : '#e8f4ff'
    });
  }
}

initStars();

// Nebula blobs for background effect
const nebulas = Array.from({ length: NEBULA_PARTICLES }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 200 + 100,
  color: Math.random() > 0.5 ? 'rgba(0,212,255,' : 'rgba(255,45,120,',
  alpha: Math.random() * 0.03 + 0.01
}));

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw nebula effects
  nebulas.forEach(n => {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grad.addColorStop(0, n.color + n.alpha + ')');
    grad.addColorStop(1, n.color + '0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw and animate stars
  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const a = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
    ctx.globalAlpha = a;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // Scroll drift effect
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(drawFrame);
}

drawFrame();

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════════

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Toggle mobile navigation
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close navigation when a link is clicked
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL REVEAL EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

const revealEls = document.querySelectorAll(
  '.project-card, .about-text, .profile-frame, .certificates-achievements, .featured-card, .skill-card, .contact-info'
);

// FIX: observer was missing — the querySelectorAll string was broken and
// the new IntersectionObserver() call was cut off entirely
const observer = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Apply reveal animation to elements
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHTBOX FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════════

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxPrev = document.querySelector('.lightbox-prev');

if (lightbox) {
  const galleryImages = Array.from(document.querySelectorAll('.showcase-images-grid .description-image'));
  let currentIndex = 0;

  function updateImage(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    if (lightboxCaption) lightboxCaption.textContent = galleryImages[currentIndex].alt;
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      lightbox.classList.add('active');
      updateImage(index);
    });
  });

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateImage(currentIndex + 1);
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateImage(currentIndex - 1);
    });
  }

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowRight') updateImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') updateImage(currentIndex - 1);
  });
}