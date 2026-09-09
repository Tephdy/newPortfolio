/**
 * Portfolio Interactive Scripts & Dynamic Data Integration
 * Author: Joseph Amandy
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set Current Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize Canvas Particle Background
  initParticleCanvas();

  // Initialize Dynamic GitHub Repositories
  initGitHubIntegration('Tephdy');

  // Initialize Dynamic Behance Portfolio Items
  initBehanceIntegration('sephamandy');

  // Initialize Navigation Controls & Smooth Scrolling
  initNavigation();

  // Initialize Interactive Live Preview Modal
  initPreviewModal();

  // Initialize Web3Forms Ajax Contact Form
  initContactForm();

  // Initialize Scroll Reveal Animations
  initScrollReveal();
});

/* ==========================================================================
   1. Canvas Interactive Particle Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.8 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles with subtle lines
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. GitHub Integration (Dynamic Repositories via API)
   ========================================================================== */
function initGitHubIntegration(username) {
  const container = document.getElementById('github-container');
  if (!container) return;

  fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch repositories');
      return res.json();
    })
    .then((repos) => {
      container.innerHTML = '';

      if (repos.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs col-span-full text-center">No public repositories found.</p>`;
        return;
      }

      repos.forEach((repo) => {
        const desc = repo.description || 'Full-Stack Software Development Repository';
        const lang = repo.language || 'Code';
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        const homepage = repo.homepage;

        const card = document.createElement('div');
        card.className =
          'glass glass-hover p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 reveal';

        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                ${lang}
              </span>
              <div class="flex items-center space-x-3 text-xs text-gray-400">
                <span title="Stars"><i class="far fa-star text-yellow-400 mr-1"></i>${stars}</span>
                <span title="Forks"><i class="fas fa-code-branch text-blue-400 mr-1"></i>${forks}</span>
              </div>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-1">${repo.name}</h3>
            <p class="text-xs text-gray-400 leading-relaxed mb-6 line-clamp-3">${desc}</p>
          </div>

          <div class="pt-4 border-t border-gray-800/80 flex items-center justify-between">
            <a href="${repo.html_url}" target="_blank" class="text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center space-x-1.5">
              <i class="fab fa-github text-sm"></i>
              <span>Code</span>
            </a>
            ${
              homepage
                ? `<button onclick="openPreview('${repo.name}', '${homepage}')" class="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-semibold transition-all flex items-center space-x-1">
                    <i class="fas fa-eye text-[10px]"></i>
                    <span>Live Preview</span>
                   </button>`
                : ''
            }
          </div>
        `;

        container.appendChild(card);
      });

      // Refresh reveal observer for dynamically created cards
      initScrollReveal();
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `
        <div class="col-span-full text-center py-8 text-xs text-gray-500">
          Unable to dynamically load GitHub repositories right now. Visit 
          <a href="https://github.com/${username}" target="_blank" class="text-blue-400 hover:underline">GitHub directly</a>.
        </div>
      `;
    });
}

/* ==========================================================================
   3. Behance Portfolio Integration
   ========================================================================== */
function initBehanceIntegration(username) {
  const container = document.getElementById('behance-container');
  if (!container) return;

  const designItems = [
    {
      title: 'Brand Identity & Visual Graphics',
      category: 'Branding & UI',
      desc: 'High-impact promotional media, social collateral, and vector graphics built with custom design workflows.',
      link: `https://www.behance.net/${username}`
    },
    {
      title: 'UI / UX Design Systems',
      category: 'Interface Design',
      desc: 'Modern web layouts, dark-mode color palettes, and component library wireframes tailored for software systems.',
      link: `https://www.behance.net/${username}`
    },
    {
      title: 'Digital Artwork & Media Assets',
      category: 'Graphic Design',
      desc: 'Vector illustrations, logo compositions, and digital marketing materials focused on sleek aesthetics.',
      link: `https://www.behance.net/${username}`
    }
  ];

  container.innerHTML = '';
  designItems.forEach((item) => {
    const card = document.createElement('div');
    card.className =
      'glass glass-hover p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 reveal';

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
            ${item.category}
          </span>
          <i class="fab fa-behance text-purple-400 text-base"></i>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">${item.title}</h3>
        <p class="text-xs text-gray-400 leading-relaxed mb-6">${item.desc}</p>
      </div>

      <div class="pt-4 border-t border-gray-800/80">
        <a href="${item.link}" target="_blank" class="inline-flex items-center space-x-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          <span>Explore Behance Project</span>
          <i class="fas fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   4. Navigation & Mobile Menu Handler
   ========================================================================== */
function initNavigation() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================================
   5. Interactive Live Preview Modal & Viewport Controls
   ========================================================================== */
function initPreviewModal() {
  const modal = document.getElementById('preview-modal');
  const closeModal = document.getElementById('close-modal');
  const iframe = document.getElementById('modal-iframe');

  if (!modal || !closeModal) return;

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (iframe) iframe.src = 'about:blank';
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      if (iframe) iframe.src = 'about:blank';
    }
  });
}

function openPreview(title, url) {
  const modal = document.getElementById('preview-modal');
  const modalTitle = document.getElementById('modal-title');
  const externalLink = document.getElementById('modal-external-link');
  const iframe = document.getElementById('modal-iframe');

  if (!modal || !iframe) return;

  modalTitle.textContent = title;
  externalLink.href = url;
  iframe.src = url;

  setViewport('desktop');
  modal.classList.remove('hidden');
}

function setViewport(device) {
  const iframe = document.getElementById('modal-iframe');
  if (!iframe) return;

  iframe.classList.remove('viewport-desktop', 'viewport-tablet', 'viewport-mobile');
  iframe.classList.add(`viewport-${device}`);
}

/* ==========================================================================
   6. Web3Forms Ajax Contact Submission & Toast Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner animate-spin"></i> <span>Sending...</span>`;
    }

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          showToast('Message sent successfully! I will reply shortly.');
          form.reset();
        } else {
          showToast(json.message || 'Something went wrong. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        showToast('Submission error. Please email directly.');
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> <span>Send Message</span>`;
        }
      });
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 4000);
}

/* ==========================================================================
   7. Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
}