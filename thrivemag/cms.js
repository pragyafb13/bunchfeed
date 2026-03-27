/* ============================================================
   ThriveMag — CMS System
   localStorage-backed content management
   ============================================================ */

window.ThriveMag = window.ThriveMag || {};

ThriveMag.cms = (function () {
  'use strict';

  const POSTS_KEY = 'thrivemag_posts';

  /* ---- Seed posts ---- */
  const SEED_POSTS = [
    {
      id: 'post_seed_1',
      title: 'Thriving at Work: The Modern Professional\'s Playbook',
      slug: 'post-thriving-at-work',
      category: 'Career',
      excerpt: 'Discover how today\'s most effective professionals navigate hustle culture, protect their energy, and build careers that actually last.',
      content: 'The modern workplace demands more than technical skills...',
      author: 'Sarah Chen',
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop',
      tags: ['career', 'productivity', 'work-life balance'],
      status: 'published',
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-15T10:00:00Z'
    },
    {
      id: 'post_seed_2',
      title: 'Morning Rituals That Actually Stick',
      slug: 'post-morning-rituals',
      category: 'Wellness',
      excerpt: 'Science-backed morning habits that transform your energy, focus, and mood — without waking up at 5am.',
      content: 'A great morning starts the night before...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
      tags: ['wellness', 'morning routine', 'habits'],
      status: 'published',
      createdAt: '2026-01-20T09:00:00Z',
      updatedAt: '2026-01-20T09:00:00Z'
    },
    {
      id: 'post_seed_3',
      title: 'Mind Your Money: A Beginner\'s Guide to Financial Clarity',
      slug: 'post-mind-your-money',
      category: 'Money',
      excerpt: 'Stop avoiding your bank account. This friendly guide breaks down budgeting, saving, and first investments in plain language.',
      content: 'Financial clarity doesn\'t require a finance degree...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80&auto=format&fit=crop',
      tags: ['money', 'budgeting', 'personal finance'],
      status: 'published',
      createdAt: '2026-02-01T08:00:00Z',
      updatedAt: '2026-02-01T08:00:00Z'
    },
    {
      id: 'post_seed_4',
      title: 'Plant-Based Meals That Won\'t Bore You',
      slug: 'post-plant-based-meals',
      category: 'Food',
      excerpt: 'Vibrant, satisfying plant-based cooking for people who actually love food — no bland salads required.',
      content: 'Plant-based eating has a reputation problem...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
      tags: ['food', 'plant-based', 'recipes'],
      status: 'published',
      createdAt: '2026-02-10T11:00:00Z',
      updatedAt: '2026-02-10T11:00:00Z'
    },
    {
      id: 'post_seed_5',
      title: 'The Digital Detox: Reclaiming Your Attention',
      slug: 'post-digital-detox',
      category: 'Mind',
      excerpt: 'Your phone is designed to be addictive. Here\'s how to take back your focus, one intentional choice at a time.',
      content: 'The average person checks their phone 96 times a day...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
      tags: ['mind', 'digital detox', 'mindfulness'],
      status: 'published',
      createdAt: '2026-02-18T14:00:00Z',
      updatedAt: '2026-02-18T14:00:00Z'
    }
  ];

  /* ---- Init / seed ---- */
  function init() {
    const existing = localStorage.getItem(POSTS_KEY);
    if (!existing || JSON.parse(existing).length === 0) {
      localStorage.setItem(POSTS_KEY, JSON.stringify(SEED_POSTS));
    }
  }

  /* ---- CRUD ---- */
  function getAllPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function getPost(id) {
    return getAllPosts().find(p => p.id === id) || null;
  }

  function generateId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }

  function createPost(data) {
    const posts = getAllPosts();
    const now = new Date().toISOString();
    const post = {
      id: generateId(),
      title: data.title || 'Untitled',
      slug: data.slug || generateSlug(data.title || 'untitled'),
      category: data.category || 'Wellness',
      excerpt: data.excerpt || '',
      content: data.content || '',
      author: data.author || 'ThriveMag Staff',
      heroImage: data.heroImage || '',
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      status: data.status || 'draft',
      createdAt: now,
      updatedAt: now
    };
    posts.unshift(post);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return post;
  }

  function updatePost(id, data) {
    const posts = getAllPosts();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...posts[idx],
      ...data,
      id,
      updatedAt: new Date().toISOString(),
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags || posts[idx].tags || [])
    };
    if (typeof data.tags === 'string') {
      updated.tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    posts[idx] = updated;
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return updated;
  }

  function deletePost(id) {
    const posts = getAllPosts().filter(p => p.id !== id);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    return true;
  }

  /* ---- Render: Admin Posts Table ---- */
  function renderAdminPosts() {
    const tbody = document.getElementById('admin-posts-tbody');
    if (!tbody) return;

    const posts = getAllPosts();
    if (posts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No posts yet. Create your first post!</td></tr>';
      return;
    }

    tbody.innerHTML = posts.map(post => `
      <tr data-post-id="${post.id}">
        <td class="post-title-cell">${escapeHtml(post.title)}</td>
        <td><span class="cat-tag ${post.category.toLowerCase()}">${escapeHtml(post.category)}</span></td>
        <td>
          <span class="status-badge ${post.status}">
            ${post.status === 'published' ? '&#9679; Published' : '&#9675; Draft'}
          </span>
        </td>
        <td>${formatDate(post.createdAt)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline" onclick="ThriveMag.cms.showEditForm('${post.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="ThriveMag.cms.confirmDelete('${post.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ---- Render: Dashboard Stats ---- */
  function renderDashboardStats() {
    const posts = getAllPosts();
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    const cats = [...new Set(posts.map(p => p.category))].length;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl('stat-total', posts.length);
    setEl('stat-published', published);
    setEl('stat-drafts', drafts);
    setEl('stat-categories', cats);
  }

  /* ---- Render: Post Form ---- */
  function renderPostForm(id) {
    const container = document.getElementById('post-form-container');
    if (!container) return;

    const post = id ? getPost(id) : null;
    const title = post ? 'Edit Post' : 'New Post';

    container.innerHTML = `
      <h2 class="admin-section-title">${title}</h2>
      <form id="cms-post-form" onsubmit="ThriveMag.cms.handleFormSubmit(event, '${id || ''}')">
        <div class="post-form-grid">
          <div>
            <div class="form-card">
              <div class="form-card-header"><h3>Post Content</h3></div>
              <div class="form-card-body">
                <div class="form-group">
                  <label class="form-label">Title *</label>
                  <input type="text" class="form-input" name="title" required
                    value="${escapeHtml(post ? post.title : '')}" placeholder="Enter post title...">
                </div>
                <div class="form-group">
                  <label class="form-label">Excerpt</label>
                  <textarea class="form-textarea" name="excerpt" rows="3"
                    placeholder="Short summary shown in post cards...">${escapeHtml(post ? post.excerpt : '')}</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Content</label>
                  <textarea class="form-textarea" name="content" rows="12"
                    placeholder="Write your full article content here...">${escapeHtml(post ? post.content : '')}</textarea>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="form-card" style="margin-bottom:1rem">
              <div class="form-card-header"><h3>Post Details</h3></div>
              <div class="form-card-body">
                <div class="form-group">
                  <label class="form-label">Category *</label>
                  <select class="form-select" name="category" required>
                    ${['Wellness','Career','Food','Mind','Money'].map(cat =>
                      `<option value="${cat}" ${post && post.category === cat ? 'selected' : ''}>${cat}</option>`
                    ).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Author</label>
                  <input type="text" class="form-input" name="author"
                    value="${escapeHtml(post ? post.author : 'ThriveMag Staff')}" placeholder="Author name">
                </div>
                <div class="form-group">
                  <label class="form-label">Hero Image URL</label>
                  <input type="url" class="form-input" name="heroImage"
                    value="${escapeHtml(post ? post.heroImage : '')}" placeholder="https://...">
                </div>
                <div class="form-group">
                  <label class="form-label">Tags</label>
                  <input type="text" class="form-input" name="tags"
                    value="${escapeHtml(post ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '')}"
                    placeholder="wellness, habits, sleep (comma separated)">
                </div>
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select class="form-select" name="status">
                    <option value="draft" ${!post || post.status === 'draft' ? 'selected' : ''}>Draft</option>
                    <option value="published" ${post && post.status === 'published' ? 'selected' : ''}>Published</option>
                  </select>
                </div>
              </div>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
              <button type="submit" class="btn btn-primary">Save Post</button>
              <button type="button" class="btn btn-outline" onclick="ThriveMag.cms.showSection('posts')">Cancel</button>
            </div>
          </div>
        </div>
      </form>
    `;
  }

  /* ---- Handle form submit ---- */
  function handleFormSubmit(e, id) {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value.trim(),
      excerpt: form.excerpt.value.trim(),
      content: form.content.value.trim(),
      category: form.category.value,
      author: form.author.value.trim(),
      heroImage: form.heroImage.value.trim(),
      tags: form.tags.value,
      status: form.status.value
    };

    if (id) {
      updatePost(id, data);
      showToast('Post updated successfully!', 'success');
    } else {
      createPost(data);
      showToast('Post created successfully!', 'success');
    }

    showSection('posts');
    renderAdminPosts();
    renderDashboardStats();
  }

  /* ---- Show edit form ---- */
  function showEditForm(id) {
    showSection('new-post');
    renderPostForm(id);
  }

  /* ---- Confirm delete ---- */
  function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      deletePost(id);
      renderAdminPosts();
      renderDashboardStats();
      showToast('Post deleted.', 'warning');
    }
  }

  /* ---- Show section ---- */
  function showSection(name) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));

    const section = document.getElementById('section-' + name);
    if (section) section.classList.add('active');

    const navItem = document.querySelector(`[data-section="${name}"]`);
    if (navItem) navItem.classList.add('active');

    if (name === 'posts') renderAdminPosts();
    if (name === 'dashboard') renderDashboardStats();
    if (name === 'new-post') renderPostForm(null);
  }

  /* ---- Toast helper ---- */
  function showToast(message, type) {
    if (window.ThriveMag.showToast) {
      window.ThriveMag.showToast(message, type);
    } else {
      alert(message);
    }
  }

  /* ---- Utils ---- */
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  /* ---- Auto-init ---- */
  init();

  return {
    init,
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    renderAdminPosts,
    renderDashboardStats,
    renderPostForm,
    handleFormSubmit,
    showEditForm,
    confirmDelete,
    showSection
  };
})();
