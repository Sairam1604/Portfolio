/**
 * SAIRAM R - Portfolio Interactive Engine
 * Handles interactive buttons, clipboard copying, modal view, terminal emulation, and filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBackgroundCanvas();
  initCopyButtons();
  initSkillsFilter();
  initProjectModal();
  initContactForm();
});

// Toast notification helper
function showToast(message, iconType = 'check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const checkIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
  
  const infoIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`;

  toast.innerHTML = `${iconType === 'check' ? checkIcon : infoIcon}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

// Navigation & Scroll Spy
function initNavbar() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Copy to Clipboard with Visual Feedback
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied ${label} to clipboard!`);
        
        // Brief button state change
        const originalContent = btn.innerHTML;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.classList.remove('copied');
        }, 1500);
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied ${label} to clipboard!`);
      });
    });
  });
}

// Technical Skills Filter
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Project Architecture Modals (DineAt & AgriBridge)
function initProjectModal() {
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const allModals = document.querySelectorAll('.modal-backdrop');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = btn.getAttribute('data-open-modal');
      openModal(targetModalId);
    });
  });

  allModals.forEach(modal => {
    const closeBtns = modal.querySelectorAll('.modal-close-trigger');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(modal);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });
}



// Quick Contact Form Simulation
function initContactForm() {
  const form = document.getElementById('quick-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all fields', 'info');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    // Simulate network submission and fallback to mailto
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast(`Thank you ${name}! Directing to email client...`, 'check');
      
      const mailtoUrl = `mailto:sairambramesh@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
      window.location.href = mailtoUrl;
    }, 900);
  });
}


// Unique Constellation Particle Background (Smooth, lag-free, non-linear)
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 20000), 70);
  const particles = [];
  const neonColors = [
    { r: 0,   g: 255, b: 136 }, // neon green
    { r: 176, g: 38,  b: 255 }, // neon violet
    { r: 0,   g: 255, b: 136 }, // neon green (weighted more)
    { r: 0,   g: 220, b: 110 }, // soft green
    { r: 212, g: 107, b: 255 }, // light violet
  ];

  for (let i = 0; i < particleCount; i++) {
    const col = neonColors[Math.floor(Math.random() * neonColors.length)];
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.7,
      alpha: Math.random() * 0.4 + 0.12,
      r: col.r, g: col.g, b: col.b
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw particle — neon green or neon violet
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.r}, ${p.g}, ${p.b}, 0.5)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect nearby particles with duo-color lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.1;
          // Blend colors between two connected particles
          const mr = Math.round((p.r + p2.r) / 2);
          const mg = Math.round((p.g + p2.g) / 2);
          const mb = Math.round((p.b + p2.b) / 2);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${mr}, ${mg}, ${mb}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse if close — bright neon green
      const mdx = p.x - mouse.x;
      const mdy = p.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 150) {
        const mAlpha = (1 - mdist / 150) * 0.3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${mAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
