/* ============================================================
   ThriveMag — Main JavaScript
   ============================================================ */

window.ThriveMag = window.ThriveMag || {};

(function () {
  'use strict';

  /* ============================================================
     POSTS DATA (for search)
     ============================================================ */
  const POSTS = [
    {
      title: "Thriving at Work: The Modern Professional's Playbook",
      url: "post-thriving-at-work.html",
      category: "Career",
      excerpt: "Navigate hustle culture, protect your energy, and build a career that actually lasts.",
      readTime: "8 min read"
    },
    {
      title: "Morning Rituals That Actually Stick",
      url: "post-morning-rituals.html",
      category: "Wellness",
      excerpt: "Science-backed morning habits that transform your energy and focus.",
      readTime: "6 min read"
    },
    {
      title: "Mind Your Money: A Beginner's Guide to Financial Clarity",
      url: "post-mind-your-money.html",
      category: "Money",
      excerpt: "Budgeting, saving, and first investments explained in plain language.",
      readTime: "10 min read"
    },
    {
      title: "Plant-Based Meals That Won't Bore You",
      url: "post-plant-based-meals.html",
      category: "Food",
      excerpt: "Vibrant, satisfying plant-based cooking for people who actually love food.",
      readTime: "7 min read"
    },
    {
      title: "The Digital Detox: Reclaiming Your Attention",
      url: "post-digital-detox.html",
      category: "Mind",
      excerpt: "Your phone is designed to be addictive. Here's how to take back your focus.",
      readTime: "6 min read"
    },
    {
      title: "Strength Training for the Time-Starved",
      url: "post-strength-training.html",
      category: "Wellness",
      excerpt: "Efficient strength training programs for people with busy schedules.",
      readTime: "8 min read"
    },
    {
      title: "The Freelance Blueprint: Going Independent Without the Fear",
      url: "post-freelance-blueprint.html",
      category: "Career",
      excerpt: "Transition to freelance work with a solid plan for clients, pricing, and finances.",
      readTime: "12 min read"
    },
    {
      title: "Fermented Foods: The Gut Health Revolution",
      url: "post-fermented-foods.html",
      category: "Food",
      excerpt: "How kimchi, kefir, and kombucha are changing what we know about health.",
      readTime: "7 min read"
    },
    {
      title: "The Science of Sleep: Why 8 Hours Isn't Enough",
      url: "post-sleep-science.html",
      category: "Mind",
      excerpt: "Sleep quality vs. quantity, circadian rhythms, and building a better wind-down.",
      readTime: "9 min read"
    },
    {
      title: "Investing in Your 20s: The Unfair Advantage",
      url: "post-invest-twenties.html",
      category: "Money",
      excerpt: "Compound interest, index funds, and Roth IRAs — explained for beginners.",
      readTime: "11 min read"
    }
  ];

  /* ============================================================
     STICKY HEADER
     ============================================================ */
  function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ============================================================
     SEARCH OVERLAY
     ============================================================ */
  function initSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const openBtn = document.getElementById('header-search-btn');
    const closeBtn = document.getElementById('search-close');

    if (!overlay || !input) return;

    function openSearch() {
      overlay.classList.add('open');
      setTimeout(() => input.focus(), 50);
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      overlay.classList.remove('open');
      input.value = '';
      if (results) results.innerHTML = '';
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    // Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });

    // Live search
    if (input && results) {
      input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (q.length < 2) {
          results.innerHTML = '';
          return;
        }

        const matches = POSTS.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );

        if (matches.length === 0) {
          results.innerHTML = `<div class="search-empty">No results for "<strong>${escapeHtml(q)}</strong>"</div>`;
          return;
        }

        results.innerHTML = matches.map(p => `
          <a href="${p.url}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('open')">
            <span class="cat-tag ${p.category.toLowerCase()}">${p.category}</span>
            <div class="search-result-info">
              <h4>${highlightText(escapeHtml(p.title), q)}</h4>
              <p>${highlightText(escapeHtml(p.excerpt), q)}</p>
            </div>
            <small style="color:var(--text-muted);white-space:nowrap;font-size:.75rem">${p.readTime}</small>
          </a>
        `).join('');
      });
    }
  }

  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(244,165,53,0.25);border-radius:2px;padding:0 2px">$1</mark>');
  }

  /* ============================================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  function initRevealAnimations() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    if (!elements.length || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const staggerGroups = {};

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.classList.contains('stagger')) {
          const parent = el.parentElement;
          const groupKey = parent ? parent.dataset.staggerGroup || parent.className : 'default';
          staggerGroups[groupKey] = (staggerGroups[groupKey] || 0) + 1;
          const delay = (staggerGroups[groupKey] - 1) * 80;
          setTimeout(() => el.classList.add('visible'), delay);
        } else {
          el.classList.add('visible');
        }

        observer.unobserve(el);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ============================================================
     READING PROGRESS BAR
     ============================================================ */
  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    const article = document.querySelector('.article-content') || document.querySelector('main');
    if (!article) return;

    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  function initNewsletterForms() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input ? input.value.trim() : '';

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }

        showToast("You're in! Welcome to ThriveMag. \u2728", 'success');
        if (input) input.value = '';
      });
    });
  }

  /* ============================================================
     TOAST NOTIFICATIONS
     ============================================================ */
  function showToast(message, type) {
    type = type || 'default';
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '\u2713',
      error: '\u2715',
      warning: '\u26a0\ufe0f',
      default: '\u2139\ufe0f'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.default}</span>
      <span>${escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    setTimeout(() => removeToast(toast), 4000);
  }

  function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }

  // Expose globally
  window.ThriveMag.showToast = showToast;

  /* ============================================================
     TRENDING STRIP AUTO-SCROLL
     ============================================================ */
  function initTrendingStrip() {
    const strip = document.querySelector('.trending-scroll');
    if (!strip) return;

    let isPaused = false;
    let scrollAmount = 0;

    strip.addEventListener('mouseenter', () => { isPaused = true; });
    strip.addEventListener('mouseleave', () => { isPaused = false; });

    // Auto-scroll on a slow interval
    setInterval(() => {
      if (isPaused) return;
      scrollAmount += 1;
      strip.scrollLeft = scrollAmount;

      // Reset when reached end
      if (strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 5) {
        scrollAmount = 0;
        strip.scrollLeft = 0;
      }
    }, 30);
  }

  /* ============================================================
     CATEGORY FILTER BUTTONS
     ============================================================ */
  function initCategoryFilters() {
    const filtersEl = document.getElementById('category-filters');
    if (!filtersEl) return;

    const grid = document.getElementById('posts-grid');
    if (!grid) return;

    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category || 'all';
      const cards = grid.querySelectorAll('[data-category]');

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category.toLowerCase() === cat.toLowerCase()) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /* ============================================================
     IMAGE LAZY LOADING
     ============================================================ */
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if ('IntersectionObserver' in window) {
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.addEventListener('load', () => img.classList.add('loaded'));
          imgObserver.unobserve(img);
        });
      }, { rootMargin: '200px' });

      images.forEach(img => imgObserver.observe(img));
    } else {
      // Fallback: load all
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
    }
  }

  /* ============================================================
     ACTIVE NAV LINK
     ============================================================ */
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.site-nav a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     NUMBER COUNTER ANIMATION
     ============================================================ */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ============================================================
     UTILS
     ============================================================ */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  function init() {
    initStickyHeader();
    initMobileMenu();
    initSearch();
    initRevealAnimations();
    initReadingProgress();
    initNewsletterForms();
    initTrendingStrip();
    initCategoryFilters();
    initLazyLoad();
    initActiveNav();
    initCounterAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add fadeIn keyframe if missing
  if (!document.getElementById('tm-keyframes')) {
    const style = document.createElement('style');
    style.id = 'tm-keyframes';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: none; }
      }
    `;
    document.head.appendChild(style);
  }

})();
