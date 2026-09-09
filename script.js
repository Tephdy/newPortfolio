// ==========================================
// JOSEPH AMANDY PORTFOLIO - RETRO OS SCRIPT
// ==========================================

// Copyright year initialization
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Live OS Clock update
setInterval(() => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const clockEl = document.getElementById('os-clock');
  if (clockEl) clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}, 1000);

// ==========================================
// RETRO OS LOADING SEQUENCE
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  const hours = new Date().getHours();
  let greeting = "HELLO!";
  if (hours < 12) greeting = "GOOD MORNING!";
  else if (hours < 18) greeting = "GOOD AFTERNOON!";
  else greeting = "GOOD EVENING!";
  
  const greetingHeader = document.getElementById('greeting-header');
  if (greetingHeader) greetingHeader.textContent = greeting;

  let progress = 0;
  const progressBar = document.getElementById('loading-progress');
  const statusText = document.getElementById('loading-status');

  const interval = setInterval(() => {
    progress += 20;
    if (progressBar) progressBar.style.width = progress + '%';
    if (statusText) {
      if (progress === 40) statusText.textContent = "Loading Joseph Amandy OS v1.0 modules...";
      if (statusText && progress === 80) statusText.textContent = "Mounting virtual file system & GUI...";
    }
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(dismissLoader, 1000);
    }
  }, 600);
});

function dismissLoader() {
  const loader = document.getElementById('loading-screen');
  if (loader) loader.classList.add('hidden');
}

// ==========================================
// WINDOW MANAGER LOGIC
// ==========================================
function openWindow(id) {
  // Hide all main content windows
  ['about-window', 'projects-window', 'skills-window', 'contact-window'].forEach(winId => {
    const win = document.getElementById(winId);
    if (win) win.classList.add('hidden');
  });
  
  const targetWin = document.getElementById(id);
  if (targetWin) {
    targetWin.classList.remove('hidden');
  }
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.add('hidden');
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.add('hidden');
}

function maximizeWindow(id) {
  const win = document.getElementById(id);
  if (win) {
    win.classList.toggle('fixed');
    win.classList.toggle('inset-4');
    win.classList.toggle('z-40');
  }
}

function toggleStartMenu() {
  const menu = document.getElementById('start-menu');
  if (menu) menu.classList.toggle('hidden');
}

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  const startBtn = e.target.closest('button');
  if (menu && !menu.contains(e.target) && (!startBtn || !startBtn.getAttribute('onclick')?.includes('toggleStartMenu'))) {
    menu.classList.add('hidden');
  }
});

// ==========================================
// DYNAMIC GITHUB REPOSITORIES FETCHING (ALL PUBLIC REPOS)
// ==========================================
async function fetchGitHubProjects() {
  const container = document.getElementById('github-container');
  if (!container) return;

  try {
    const repos = [];
    let page = 1;

    while (true) {
      const response = await fetch(`https://api.github.com/users/Tephdy/repos?sort=updated&per_page=100&page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch GitHub repos');
      const pageRepos = await response.json();
      repos.push(...pageRepos);
      if (pageRepos.length < 100) break;
      page += 1;
    }
    
    container.innerHTML = '';
    
    if (repos.length === 0) {
      container.innerHTML = '<p class="text-xs text-gray-700 col-span-3 text-center">No public repositories found.</p>';
      return;
    }

    repos.forEach(repo => {
      const card = document.createElement('div');
      card.className = 'retro-window p-4 bg-white border-2 border-[#1e1e1e] flex flex-col justify-between shadow-[2px_2px_0px_#1e1e1e]';
      const liveView = repo.homepage?.trim()
        ? '<button type="button" class="retro-btn live-view-button px-2.5 py-1 text-[10px] bg-[#f4a261]"><i class="fas fa-eye mr-1"></i>Live View</button>'
        : '<span class="text-[10px] text-gray-500" title="No live site is configured for this repository">No live view</span>';
      card.innerHTML = `
        <div>
          <div class="flex items-center space-x-2 mb-2">
            <i class="fas fa-folder text-[#f4a261] text-xl"></i>
            <h4 class="font-bold text-xs truncate max-w-[150px]" title="${repo.name}">${repo.name}</h4>
          </div>
          <p class="text-[10px] text-gray-600 mb-4 line-clamp-2">${repo.description || 'No description provided.'}</p>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
          <span class="text-[9px] font-mono bg-gray-100 px-1 border border-gray-400">${repo.language || 'Code'}</span>
          <div class="flex items-center gap-1">
            ${liveView}
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="retro-btn px-2.5 py-1 text-[10px]"><i class="fab fa-github mr-1"></i>Open Repo</a>
          </div>
        </div>
      `;
      container.appendChild(card);
      const liveButton = card.querySelector('.live-view-button');
      if (liveButton) {
        liveButton.dataset.liveUrl = repo.homepage.trim();
        liveButton.addEventListener('click', () => openLiveView(repo.name, liveButton.dataset.liveUrl));
      }
    });
  } catch (error) {
    console.error('GitHub fetch error:', error);
    container.innerHTML = '<p class="text-xs text-red-600 col-span-3 text-center">Failed to load repositories.</p>';
  }
}

function openLiveView(repoName, url) {
  const modal = document.getElementById('live-view-modal');
  const frame = document.getElementById('live-view-frame');
  const title = document.getElementById('live-view-title');
  if (!modal || !frame || !title || !url) return;

  title.textContent = `Live View - ${repoName}`;
  frame.src = url;
  modal.classList.remove('hidden');
}

function openLiveViewInNewTab() {
  const frame = document.getElementById('live-view-frame');
  if (frame?.src) window.open(frame.src, '_blank', 'noopener,noreferrer');
}

function closeLiveView() {
  const modal = document.getElementById('live-view-modal');
  const frame = document.getElementById('live-view-frame');
  if (!modal || !frame) return;

  modal.classList.add('hidden');
  frame.src = '';
}

document.addEventListener('click', event => {
  if (event.target.id === 'live-view-modal') closeLiveView();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeLiveView();
});

function showContactStatus(success, message) {
  const modal = document.getElementById('contact-status-modal');
  const title = document.getElementById('contact-status-title');
  const bar = document.getElementById('contact-status-bar');
  const icon = document.getElementById('contact-status-icon');
  const messageEl = document.getElementById('contact-status-message');
  if (!modal || !title || !bar || !icon || !messageEl) return;

  title.textContent = success ? 'Message Sent' : 'Message Error';
  bar.classList.toggle('blue', success);
  bar.classList.toggle('yellow', !success);
  icon.className = success
    ? 'fas fa-check-circle text-4xl text-green-600 mb-3'
    : 'fas fa-exclamation-triangle text-4xl text-red-600 mb-3';
  messageEl.textContent = message;
  modal.classList.remove('hidden');
}

function closeContactStatus() {
  document.getElementById('contact-status-modal')?.classList.add('hidden');
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalLabel = submitButton?.textContent;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });
      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = { message: responseText };
      }
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || `Web3Forms returned HTTP ${response.status}.`);
      }

      contactForm.reset();
      showContactStatus(true, 'Your message was sent successfully. Thank you for reaching out.');
    } catch (error) {
      showContactStatus(false, error.message || 'Your message could not be sent. Please try again.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }
  });
}

document.addEventListener('click', event => {
  if (event.target.id === 'contact-status-modal') closeContactStatus();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeContactStatus();
});

// Run GitHub fetch if container exists
fetchGitHubProjects();