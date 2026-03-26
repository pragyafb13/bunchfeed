/* ==========================================================================
   BunchFeed — Main JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Scroll-triggered reveal animations (Intersection Observer)
  ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) =>
    revealObserver.observe(el)
  );

  /* Staggered children */
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(':scope > *').forEach((child) => {
            child.classList.add('visible');
          });
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.stagger').forEach((el) => staggerObserver.observe(el));

  /* ------------------------------------------------------------------
     Sticky header — add class on scroll
  ------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------------
     Mobile menu toggle
  ------------------------------------------------------------------ */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav  = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ------------------------------------------------------------------
     Search overlay
  ------------------------------------------------------------------ */
  const searchBtns    = document.querySelectorAll('.nav-search-btn');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput   = document.querySelector('.search-input-wrap input');
  const searchClose   = document.querySelector('.search-close');

  const posts = [
    { title: 'Budget Friendly Tours on Viator', cat: 'Travel', href: 'post-viator.html' },
    { title: 'Airport Car Rentals With Turo', cat: 'Travel', href: 'post-turo.html' },
    { title: 'Rest Bedding Buying Guide for Beginners', cat: 'Lifestyle', href: 'post-bedding-guide.html' },
    { title: 'Top 5 Rest Bedding Products You Should Try', cat: 'Lifestyle', href: 'post-bedding-top5.html' },
    { title: 'How to Travel Southeast Asia on a Budget', cat: 'Travel', href: '#' },
    { title: 'The Ultimate Guide to Remote Work Travel', cat: 'Lifestyle', href: '#' },
    { title: 'Choosing the Right Travel Insurance Policy', cat: 'Finance', href: '#' },
  ];

  function renderSearchResults(query) {
    const container = document.querySelector('.search-results');
    if (!container) return;
    if (!query.trim()) {
      container.innerHTML = '';
      return;
    }
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.cat.toLowerCase().includes(query.toLowerCase())
    );
    if (!filtered.length) {
      container.innerHTML = '<p style="color:#888;font-size:.88rem;padding:12px">No results found.</p>';
      return;
    }
    container.innerHTML = filtered
      .map(
        (p) => `
        <a class="search-result-item" href="${p.href}">
          <div>
            <div class="result-cat">${p.cat}</div>
            <div class="result-title">${p.title}</div>
          </div>
        </a>`
      )
      .join('');
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => searchInput && searchInput.focus(), 200);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
    const container = document.querySelector('.search-results');
    if (container) container.innerHTML = '';
  }

  searchBtns.forEach((btn) => btn.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  /* ------------------------------------------------------------------
     Reading progress bar (article pages only)
  ------------------------------------------------------------------ */
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /* ------------------------------------------------------------------
     Newsletter form
  ------------------------------------------------------------------ */
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      if (!input || !input.value) return;

      btn.textContent = 'Subscribing...';
      btn.disabled    = true;

      setTimeout(() => {
        input.value    = '';
        btn.textContent = 'Subscribed!';
        showToast('You are now subscribed. Welcome aboard.', 'success');
        setTimeout(() => {
          btn.textContent = 'Subscribe Now';
          btn.disabled    = false;
        }, 3000);
      }, 1200);
    });
  });

  /* ------------------------------------------------------------------
     Toast notification helper
  ------------------------------------------------------------------ */
  function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ------------------------------------------------------------------
     Trending strip auto-scroll
  ------------------------------------------------------------------ */
  const trendingInner = document.querySelector('.trending-inner');
  if (trendingInner) {
    let scrollDir = 1;
    let paused = false;

    trendingInner.addEventListener('mouseenter', () => (paused = true));
    trendingInner.addEventListener('mouseleave', () => (paused = false));

    const autoScroll = () => {
      if (!paused) {
        trendingInner.scrollLeft += scrollDir * 0.6;
        if (
          trendingInner.scrollLeft + trendingInner.clientWidth >= trendingInner.scrollWidth - 2
        ) {
          scrollDir = -1;
        }
        if (trendingInner.scrollLeft <= 0) {
          scrollDir = 1;
        }
      }
      requestAnimationFrame(autoScroll);
    };
    requestAnimationFrame(autoScroll);
  }

  /* ------------------------------------------------------------------
     Active nav link highlight
  ------------------------------------------------------------------ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------
     Number counter animation (About page stats)
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el     = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            let start    = 0;
            const step   = target / 60;
            const tick   = () => {
              start = Math.min(start + step, target);
              el.textContent = Math.floor(start).toLocaleString() + suffix;
              if (start < target) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     Category filter buttons (Category page)
  ------------------------------------------------------------------ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.filter || 'all';
      filterCards.forEach((card) => {
        const match = target === 'all' || card.dataset.category === target;
        card.style.transition = 'opacity .3s, transform .3s';
        if (match) {
          card.style.opacity   = '1';
          card.style.transform = 'none';
          card.style.display   = '';
        } else {
          card.style.opacity   = '0';
          card.style.transform = 'scale(.97)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ------------------------------------------------------------------
     Image lazy-load with smooth fade
  ------------------------------------------------------------------ */
  document.querySelectorAll('img[data-src]').forEach((img) => {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src    = img.dataset.src;
            img.style.transition = 'opacity .4s';
            img.onload = () => (img.style.opacity = '1');
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' }
    );
    img.style.opacity = '0';
    imgObserver.observe(img);
  });

})();
