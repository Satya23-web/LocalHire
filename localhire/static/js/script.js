const SEARCH_SUGGESTIONS = [
  'Plumber', 'Electrician', 'AC Repair', 'Painter', 'Carpenter',
  'Cleaner', 'Pest Control', 'CCTV Installation', 'Water Heater Repair'
];

const CHATBOT_RESPONSES = {
  'book':      'To book a service, scroll to the **Book a Professional** section, select your service type, preferred date and time slot, and fill in your details. Confirmation is instant! 📅',
  'price':     'Pricing varies by service:\n• Plumber: from $45/hr\n• Electrician: from $40/hr\n• AC Repair: from $35/hr\n• Cleaner: from $25/hr\nAll prices are transparent — no hidden fees! 💰',
  'pay':       'We accept all major payment methods. Payment is made after service completion, ensuring you\'re fully satisfied first. We also offer secure online payment tracking. 💳',
  'verify':    'Every professional on LocalHire is background-checked, credential-verified by our admin team, and must maintain a minimum rating to stay listed. 🛡️',
  'cancel':    'You can cancel a booking before the cutoff time (usually 2 hours before the scheduled slot) at no charge. After that, a small cancellation fee may apply. 📋',
  'service':   'We offer: ⚡ Electrician, 🔧 Plumber, ❄️ AC Repair, 🎨 Painter, 🪚 Carpenter, 🧹 Cleaner, 🧱 Mason, 🛠️ Handyman, and more! Browse all services in the section below.',
  'review':    'After your service is marked as complete, you\'ll be prompted to leave a star rating (1–5) and a written review. Your feedback helps others find great pros! ⭐',
  'hello':     'Hey there! 👋 I\'m the LocalHire AI assistant. How can I help you today? You can ask me about booking, pricing, services, or how LocalHire works.',
  'hi':        'Hi! 😊 Great to see you on LocalHire! I\'m here to help. What do you need?',
  'default':   'Thanks for your message! For specific queries, try asking about "booking", "pricing", "services", "cancellation", or "payment". I\'ll also connect you with our team if needed. 😊'
};

// ── STATE ────────────────────────────────────
let currentFilter   = 'all';
let reviewIndex     = 0;
let reviewAutoTimer = null;
let chatOpen        = false;

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initFilterTabs();
  initSearchAutocomplete();
  initScrollEffects();
  animateCounters();
  setMinBookingDate();
  initReviewAutoplay();
  initNavHighlight();
});

// ══════════════════════════════════════════════
// SERVICES
// ══════════════════════════════════════════════
function renderServices(filter) {
  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = '';

  const filtered = filter === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === filter);

  filtered.forEach((svc, i) => {
    const stars = '★'.repeat(Math.floor(svc.rating)) + (svc.rating % 1 ? '½' : '');
    const card = document.createElement('div');
    card.className = 'service-card';
    card.style.animationDelay = `${i * 0.06}s`;
    card.innerHTML = `
      <div class="sc-emoji">${svc.emoji}</div>
      <div class="sc-name">${svc.name}</div>
      <div class="sc-desc">${svc.desc}</div>
      <div class="sc-meta">
        <span class="sc-rate">${svc.rate}</span>
        <span class="sc-rating">${stars} <span style="color:var(--gray);font-weight:400">(${svc.count})</span></span>
      </div>
      <button class="sc-book" onclick="quickBook('${svc.name}')">Book Now →</button>
    `;
    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--gray);padding:3rem">No services found for this category.</div>`;
  }
}

function initFilterTabs() {
  const tabs = document.querySelectorAll('#filterTabs .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.dataset.filter;
      renderServices(currentFilter);
    });
  });
}

function quickBook(serviceName) {
  document.getElementById('bookService').value = serviceName;
  document.getElementById('book').scrollIntoView({ behavior:'smooth', block:'start' });
  setTimeout(() => showToast(`"${serviceName}" selected. Fill in your details below!`, 'info', '📋'), 600);
}

// ══════════════════════════════════════════════
// SEARCH AUTOCOMPLETE
// ══════════════════════════════════════════════
function initSearchAutocomplete() {
  const input    = document.getElementById('heroSearch');
  const dropdown = document.getElementById('searchDropdown');

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) { dropdown.classList.remove('open'); return; }

    const matches = SEARCH_SUGGESTIONS.filter(s => s.toLowerCase().includes(val));
    if (!matches.length) { dropdown.classList.remove('open'); return; }

    dropdown.innerHTML = matches.map(m =>
      `<div class="dropdown-item" onclick="selectSuggestion('${m}')">${m}</div>`
    ).join('');
    dropdown.classList.add('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-field')) dropdown.classList.remove('open');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
}

function selectSuggestion(val) {
  document.getElementById('heroSearch').value = val;
  document.getElementById('searchDropdown').classList.remove('open');
}

function handleSearch() {
  const service  = document.getElementById('heroSearch').value.trim();
  const location = document.getElementById('heroLocation').value.trim();

  if (!service) {
    showToast('Please enter a service type to search.', 'error', '⚠️');
    document.getElementById('heroSearch').focus();
    return;
  }

  showToast(`Searching for "${service}"${location ? ' in ' + location : ''}...`, 'info', '🔍');

  // Scroll to services and apply filter
  const match = SERVICES.find(s => s.name.toLowerCase().includes(service.toLowerCase()));
  if (match) {
    const filterBtn = document.querySelector(`[data-filter="${match.category}"]`);
    if (filterBtn) { filterBtn.click(); }
  }

  setTimeout(() => {
    document.getElementById('services').scrollIntoView({ behavior:'smooth' });
  }, 300);
}

// ══════════════════════════════════════════════
// REVIEWS CAROUSEL
// ══════════════════════════════════════════════
function renderReviews() {
  const track = document.getElementById('reviewsTrack');
  const dots  = document.getElementById('reviewsDots');

  track.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="rc-stars">${'★'.repeat(r.rating)}</div>
      <div class="rc-text">${r.text}</div>
      <div class="rc-author">
        <div class="rc-avatar">${r.initial}</div>
        <div>
          <div class="rc-name">${r.name}</div>
          <div class="rc-service">${r.service} customer</div>
        </div>
      </div>
    </div>
  `).join('');

  const totalDots = Math.ceil(REVIEWS.length / 3);
  dots.innerHTML = Array.from({length: totalDots}, (_, i) =>
    `<div class="rdot ${i===0?'active':''}" onclick="goToReview(${i})"></div>`
  ).join('');
}

function goToReview(idx) {
  const track    = document.getElementById('reviewsTrack');
  const cards    = track.querySelectorAll('.review-card');
  const cardW    = cards[0] ? cards[0].offsetWidth + 24 : 0;
  const perPage  = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const maxIdx   = Math.ceil(REVIEWS.length / perPage) - 1;

  reviewIndex = Math.max(0, Math.min(idx, maxIdx));
  track.style.transform = `translateX(-${reviewIndex * perPage * (cardW)}px)`;

  document.querySelectorAll('.rdot').forEach((d,i) => d.classList.toggle('active', i === reviewIndex));
}

function initReviewAutoplay() {
  reviewAutoTimer = setInterval(() => {
    const totalDots = document.querySelectorAll('.rdot').length;
    goToReview((reviewIndex + 1) % totalDots);
  }, 4000);

  document.getElementById('reviewsTrack').addEventListener('mouseenter', () => clearInterval(reviewAutoTimer));
  document.getElementById('reviewsTrack').addEventListener('mouseleave', initReviewAutoplay);
}

// ══════════════════════════════════════════════
// BOOKING FORM
// ══════════════════════════════════════════════
function handleBooking(e) {
  e.preventDefault();
  const service = document.getElementById('bookService').value;
  const date    = document.getElementById('bookDate').value;
  const slot    = document.getElementById('bookSlot').value;
  const name    = document.getElementById('bookName').value;

  // Simulate API call
  const btn = e.target.querySelector('button[type=submit]');
  btn.innerHTML = '<span>Booking...</span>';
  btn.disabled = true;

  // Fake API — replace with real fetch('/api/book/', { method:'POST', body:... })
  setTimeout(() => {
    document.getElementById('confirmText').textContent =
      `${service} booked for ${formatDate(date)}, ${slot}. A confirmation has been sent, ${name.split(' ')[0]}!`;
    openModal('confirmModal');
    e.target.reset();
    btn.innerHTML = '<span>Confirm Booking</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    btn.disabled = false;
  }, 1200);
}

function setMinBookingDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bookDate').setAttribute('min', today);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
}

// ══════════════════════════════════════════════
// AI CHATBOT
// ══════════════════════════════════════════════
function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chatbox');
  box.classList.toggle('open', chatOpen);
  document.getElementById('fabNotif').classList.remove('show');
  if (chatOpen) {
    setTimeout(() => document.getElementById('chatInput').focus(), 200);
    // Hide suggestions after first interaction if there are messages
    const msgs = document.querySelectorAll('.msg');
    if (msgs.length > 1) document.getElementById('chatSuggestions').style.display = 'none';
  }
}

function quickAsk(text) {
  document.getElementById('chatInput').value = text;
  document.getElementById('chatSuggestions').style.display = 'none';
  sendMessage();
}

async function sendMessage() {
  const input   = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  input.value = '';
  appendMessage('user', message);
  document.getElementById('chatSuggestions').style.display = 'none';

  // Show typing indicator
  const typingId = showTyping();

  try {
    // Try real API first
    const response = await fetch('/api/chatbot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    removeTyping(typingId);

    if (response.ok) {
      const data = await response.json();
      appendMessage('ai', data.reply || 'I\'m here to help! Could you rephrase your question?');
    } else {
      // Fallback to local responses
      appendMessage('ai', getLocalResponse(message));
    }
  } catch {
    // Offline fallback — local keyword matching
    removeTyping(typingId);
    appendMessage('ai', getLocalResponse(message));
  }
}

function getLocalResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('book') || msg.includes('appoint') || msg.includes('schedule')) return CHATBOT_RESPONSES.book;
  if (msg.includes('pric') || msg.includes('cost') || msg.includes('fee')   || msg.includes('charge')) return CHATBOT_RESPONSES.price;
  if (msg.includes('pay')  || msg.includes('payment') || msg.includes('card'))  return CHATBOT_RESPONSES.pay;
  if (msg.includes('verif') || msg.includes('safe') || msg.includes('trust'))   return CHATBOT_RESPONSES.verify;
  if (msg.includes('cancel') || msg.includes('refund'))  return CHATBOT_RESPONSES.cancel;
  if (msg.includes('service') || msg.includes('what do you')) return CHATBOT_RESPONSES.service;
  if (msg.includes('review') || msg.includes('rate') || msg.includes('rating')) return CHATBOT_RESPONSES.review;
  if (msg === 'hi' || msg === 'hey' || msg === 'hello')  return CHATBOT_RESPONSES.hi;
  if (msg.includes('hi') || msg.includes('hello'))       return CHATBOT_RESPONSES.hello;
  return CHATBOT_RESPONSES.default;
}

function appendMessage(role, text) {
  const container = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${role}`;

  // Format bold **text**
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });

  div.innerHTML = `<div class="msg-bubble">${formatted}</div><div class="msg-time">${time}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const id = 'typing_' + Date.now();
  const div = document.createElement('div');
  div.className = 'msg ai'; div.id = id;
  div.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ══════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ══════════════════════════════════════════════
function showToast(message, type='success', icon='✓') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

// ══════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow=''; }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }
function switchModal(from, to)    { closeModal(from); setTimeout(() => openModal(to), 200); }

function handleLogin(e) {
  e.preventDefault();
  showToast('Signing you in...', 'info', '🔐');
  setTimeout(() => {
    closeModal('loginModal');
    showToast('Welcome back to LocalHire! 🎉', 'success', '✓');
  }, 900);
  // Real: fetch('/api/auth/login/', { method:'POST', body:... })
}

function handleRegister(e) {
  e.preventDefault();
  showToast('Creating your account...', 'info', '✦');
  setTimeout(() => {
    closeModal('registerModal');
    showToast('Account created! Welcome to LocalHire 🎉', 'success', '✓');
    document.getElementById('fabNotif').classList.add('show');
  }, 900);
}

// ══════════════════════════════════════════════
// SCROLL EFFECTS
// ══════════════════════════════════════════════
function initScrollEffects() {
  const navbar = document.getElementById('navbar');

  // Sticky nav shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Reveal on scroll
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// ANIMATED COUNTERS
// ══════════════════════════════════════════════
function animateCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;
      const timer  = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = target > 99
          ? Math.round(current).toLocaleString() + '+'
          : Math.round(current) + '%';
        if (current >= target) clearInterval(timer);
      }, step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════
// NAV HIGHLIGHT ON SCROLL
// ══════════════════════════════════════════════
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ══════════════════════════════════════════════
// MOBILE NAV
// ══════════════════════════════════════════════
function toggleMobileNav() {
  const links = document.getElementById('navLinks');
  const burger = document.getElementById('hamburger');
  links.classList.toggle('mobile-open');
  burger.classList.toggle('open');
}

// Close mobile nav when link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('mobile-open');
    });
  });
});

// Keyboard: close modal with Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['loginModal','registerModal','confirmModal'].forEach(closeModal);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const cards = document.querySelectorAll(".service-card");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === "all" || card.dataset.category.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

