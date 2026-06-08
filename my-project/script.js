const progress = document.querySelector('.progress-bar');
const cursor = document.querySelector('.cursor');
const trail = document.querySelector('.cursor-trail');
const heroCard = document.querySelector('.holo-card');
const revealNodes = document.querySelectorAll('.reveal');
const timelineItems = document.querySelectorAll('.timeline-item');
const projectCards = document.querySelectorAll('.project-card');

const words = ['Python Developer', 'Machine Learning Enthusiast', 'Spring Boot Developer', 'Problem Solver', 'Tech Explorer'];
const typeEl = document.querySelector('.typewriter');
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = words[wordIndex];
  typeEl.textContent = deleting
    ? current.slice(0, charIndex--)
    : current.slice(0, charIndex++);

  if (!deleting && charIndex === current.length + 1) {
    deleting = true;
    setTimeout(typeLoop, 1100);
    return;
  }
  if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(typeLoop, deleting ? 35 : 80);
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressRatio = docHeight > 0 ? scrollTop / docHeight : 0;
  progress.style.transform = `scaleX(${progressRatio})`;
  document.querySelector('.timeline-line').style.transform = `scaleY(${Math.min(progressRatio * 1.35, 1)})`;
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  revealNodes.forEach((node) => observer.observe(node));
  timelineItems.forEach((item) => observer.observe(item));
}

function initTilt() {
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = (0.5 - (y / rect.height)) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  if (heroCard) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
  }
}

function initCursor() {
  document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    trail.style.transform = `translate(${e.clientX - 19}px, ${e.clientY - 19}px)`;
  });
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const dots = Array.from({ length: 84 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2.2 + 0.8, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(146, 194, 255, 0.75)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      } catch {
        btn.textContent = 'Copy failed';
        setTimeout(() => (btn.textContent = 'Copy'), 1200);
      }
    });
  });
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('load', () => {
  updateScrollProgress();
  typeLoop();
  initReveal();
  initTilt();
  initCursor();
  initParticles();
  initCopyButtons();
});
