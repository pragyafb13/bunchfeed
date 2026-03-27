/* ============================================================
   ThriveMag — CMS System
   localStorage-backed content management
   ============================================================ */

window.ThriveMag = window.ThriveMag || {};

ThriveMag.cms = (function () {
  'use strict';

  const POSTS_KEY = 'thrivemag_posts';
  const SEED_VERSION = 4;

  /* ---- Seed posts ---- */
  const SEED_POSTS = [
    {
      id: 'post_seed_1',
      title: 'Thriving at Work: The Modern Professional\'s Playbook',
      slug: 'post-thriving-at-work',
      category: 'Career',
      excerpt: 'Discover how today\'s most effective professionals navigate hustle culture, protect their energy, and build careers that actually last. From boundary-setting to deep work, this is the modern playbook.',
      content: 'The modern workplace demands more than technical skills...',
      author: 'Sarah Chen',
      heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
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
      excerpt: 'Science-backed morning habits that transform your energy, focus, and mood — without waking up at 5am. Learn what the research really says about morning routines.',
      content: 'A great morning starts the night before...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
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
      excerpt: 'Stop avoiding your bank account. This friendly guide breaks down budgeting, saving, and first investments in plain language anyone can follow.',
      content: 'Financial clarity doesn\'t require a finance degree...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
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
      excerpt: 'Vibrant, satisfying plant-based cooking for people who actually love food — no bland salads required. These recipes will change how you think about vegetables.',
      content: 'Plant-based eating has a reputation problem...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
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
      excerpt: 'Your phone is designed to be addictive. Here\'s how to take back your focus, one intentional choice at a time. A practical guide to digital minimalism.',
      content: 'The average person checks their phone 96 times a day...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      tags: ['mind', 'digital detox', 'mindfulness'],
      status: 'published',
      createdAt: '2026-02-18T14:00:00Z',
      updatedAt: '2026-02-18T14:00:00Z'
    },
    {
      id: 'post_seed_6',
      title: 'Strength Training for the Time-Starved',
      slug: 'post-strength-training',
      category: 'Wellness',
      excerpt: 'Build real strength in just 3 days a week with compound movements that deliver maximum results. Designed for busy people who want to train smarter, not longer.',
      content: 'You don\'t need to spend hours in the gym to build meaningful strength...',
      author: 'Alex Morgan',
      heroImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      tags: ['wellness', 'fitness', 'strength training'],
      status: 'published',
      createdAt: '2026-01-22T10:00:00Z',
      updatedAt: '2026-01-22T10:00:00Z'
    },
    {
      id: 'post_seed_7',
      title: 'The Freelance Blueprint: Going Independent Without the Fear',
      slug: 'post-freelance-blueprint',
      category: 'Career',
      excerpt: 'Clients, rates, contracts, and freelance finances — a complete guide for the aspiring independent. Everything you need to make the leap with confidence.',
      content: 'Freelancing is one of the most rewarding career paths you can take...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
      tags: ['career', 'freelance', 'entrepreneurship'],
      status: 'published',
      createdAt: '2026-01-28T09:00:00Z',
      updatedAt: '2026-01-28T09:00:00Z'
    },
    {
      id: 'post_seed_8',
      title: 'Fermented Foods: The Gut Health Revolution',
      slug: 'post-fermented-foods',
      category: 'Food',
      excerpt: 'How kimchi, kefir, and kombucha are transforming what we understand about wellness and the gut-brain connection. Your microbiome is waiting.',
      content: 'Fermented foods have been part of human diets for thousands of years...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
      tags: ['food', 'gut health', 'fermentation'],
      status: 'published',
      createdAt: '2026-02-05T11:00:00Z',
      updatedAt: '2026-02-05T11:00:00Z'
    },
    {
      id: 'post_seed_9',
      title: 'The Science of Sleep: Why 8 Hours Isn\'t Enough',
      slug: 'post-sleep-science',
      category: 'Mind',
      excerpt: 'Sleep quality, circadian rhythms, and the evening routines that help your brain actually restore itself overnight. The science will surprise you.',
      content: 'We\'ve been told to get 8 hours of sleep, but the science is more nuanced...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
      tags: ['mind', 'sleep', 'health'],
      status: 'published',
      createdAt: '2026-02-12T08:00:00Z',
      updatedAt: '2026-02-12T08:00:00Z'
    },
    {
      id: 'post_seed_10',
      title: 'Investing in Your 20s: The Unfair Advantage',
      slug: 'post-invest-twenties',
      category: 'Money',
      excerpt: 'Compound interest, index funds, Roth IRAs — the financial edge that only starts when you start. Here\'s how to get a decade ahead of everyone else.',
      content: 'The best time to start investing was yesterday. The second best time is today...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
      tags: ['money', 'investing', 'personal finance'],
      status: 'published',
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-02-20T10:00:00Z'
    },
    {
      id: 'post_seed_11',
      title: 'Yoga for Beginners: Your First 30 Days',
      slug: 'post-yoga-for-beginners',
      category: 'Wellness',
      excerpt: 'No flexibility required. A practical, no-nonsense guide to building a yoga practice that actually sticks beyond the first week.',
      content: 'Starting yoga doesn\'t require you to be flexible or spiritual...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      tags: ['wellness', 'yoga', 'beginners'],
      status: 'published',
      createdAt: '2026-02-03T09:00:00Z',
      updatedAt: '2026-02-03T09:00:00Z'
    },
    {
      id: 'post_seed_12',
      title: 'Cold Showers Changed My Life — Here\'s the Science',
      slug: 'post-cold-shower-benefits',
      category: 'Wellness',
      excerpt: 'What actually happens when you take a cold shower every morning. The evidence is more interesting than the hype, and the benefits are real.',
      content: 'Cold exposure has gained enormous popularity in wellness circles...',
      author: 'Alex Morgan',
      heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      tags: ['wellness', 'cold therapy', 'habits'],
      status: 'published',
      createdAt: '2026-02-08T08:00:00Z',
      updatedAt: '2026-02-08T08:00:00Z'
    },
    {
      id: 'post_seed_13',
      title: 'How to Build a Running Habit That Lasts',
      slug: 'post-running-habit',
      category: 'Wellness',
      excerpt: 'Most people quit running within a month. Here\'s what the research says about building a durable running habit that fits your real life.',
      content: 'Running is one of the most accessible forms of exercise, yet most beginners quit...',
      author: 'Alex Morgan',
      heroImage: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
      tags: ['wellness', 'running', 'habits'],
      status: 'published',
      createdAt: '2026-02-14T07:00:00Z',
      updatedAt: '2026-02-14T07:00:00Z'
    },
    {
      id: 'post_seed_14',
      title: '25 Healthy Snacks That Actually Taste Good',
      slug: 'post-healthy-snacks',
      category: 'Food',
      excerpt: 'Ditch the rice cakes. These 25 snacks are nutritious, satisfying, and genuinely delicious — no willpower required.',
      content: 'Healthy snacking doesn\'t have to mean boring snacking...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      tags: ['food', 'snacks', 'nutrition'],
      status: 'published',
      createdAt: '2026-02-10T11:00:00Z',
      updatedAt: '2026-02-10T11:00:00Z'
    },
    {
      id: 'post_seed_15',
      title: 'Sunday Meal Prep: Eat Well All Week in 2 Hours',
      slug: 'post-meal-prep-sunday',
      category: 'Food',
      excerpt: 'The component method that sets you up for a full week of healthy eating without the overwhelm. Two hours on Sunday, five easy meals all week.',
      content: 'Meal prep doesn\'t have to mean eating the same thing every day...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      tags: ['food', 'meal prep', 'nutrition'],
      status: 'published',
      createdAt: '2026-02-17T10:00:00Z',
      updatedAt: '2026-02-17T10:00:00Z'
    },
    {
      id: 'post_seed_16',
      title: 'The Coffee Lover\'s Guide to Brewing Better at Home',
      slug: 'post-coffee-guide',
      category: 'Food',
      excerpt: 'Stop paying $7 for mediocre lattes. Exceptional home coffee starts with fresh beans, a burr grinder, and a few simple techniques.',
      content: 'Great coffee at home is more achievable than most people think...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      tags: ['food', 'coffee', 'brewing'],
      status: 'published',
      createdAt: '2026-02-22T09:00:00Z',
      updatedAt: '2026-02-22T09:00:00Z'
    },
    {
      id: 'post_seed_17',
      title: 'Stress Management: 10 Techniques Backed by Science',
      slug: 'post-stress-management',
      category: 'Mind',
      excerpt: 'Not all stress-relief advice is created equal. These 10 techniques have the research to back them up — and most take less than five minutes.',
      content: 'Stress is an inevitable part of modern life, but chronic stress doesn\'t have to be...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      tags: ['mind', 'stress', 'mental health'],
      status: 'published',
      createdAt: '2026-01-28T10:00:00Z',
      updatedAt: '2026-01-28T10:00:00Z'
    },
    {
      id: 'post_seed_18',
      title: 'The Life-Changing Power of a Daily Journaling Practice',
      slug: 'post-journaling-practice',
      category: 'Mind',
      excerpt: 'Why journaling works — the psychology, the neuroscience, and how to build a practice that actually lasts beyond January.',
      content: 'Journaling has been shown to reduce anxiety, improve memory, and boost creativity...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
      tags: ['mind', 'journaling', 'habits'],
      status: 'published',
      createdAt: '2026-02-05T09:00:00Z',
      updatedAt: '2026-02-05T09:00:00Z'
    },
    {
      id: 'post_seed_19',
      title: 'Mindfulness at Work: Stay Calm in a Chaotic Office',
      slug: 'post-mindfulness-at-work',
      category: 'Mind',
      excerpt: 'Practical mindfulness techniques that actually fit into a full workday — no meditation cushion or hour-long sessions required.',
      content: 'The modern office is designed for distraction, not focus...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
      tags: ['mind', 'mindfulness', 'work'],
      status: 'published',
      createdAt: '2026-02-19T09:00:00Z',
      updatedAt: '2026-02-19T09:00:00Z'
    },
    {
      id: 'post_seed_20',
      title: 'How to Negotiate Your Salary (And Actually Win)',
      slug: 'post-salary-negotiation',
      category: 'Career',
      excerpt: 'What to say, when to say it, and how to handle pushback without leaving money on the table. A step-by-step negotiation framework.',
      content: 'Most people leave tens of thousands of dollars on the table over their careers by not negotiating...',
      author: 'Sarah Chen',
      heroImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
      tags: ['career', 'salary', 'negotiation'],
      status: 'published',
      createdAt: '2026-01-25T10:00:00Z',
      updatedAt: '2026-01-25T10:00:00Z'
    },
    {
      id: 'post_seed_21',
      title: 'Remote Work Tips: Thrive Without an Office',
      slug: 'post-remote-work-tips',
      category: 'Career',
      excerpt: 'The habits, tools, and mindset shifts that separate remote workers who flourish from those who burn out within six months.',
      content: 'Remote work offers tremendous freedom — and comes with real challenges...',
      author: 'Sarah Chen',
      heroImage: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
      tags: ['career', 'remote work', 'productivity'],
      status: 'published',
      createdAt: '2026-02-01T09:00:00Z',
      updatedAt: '2026-02-01T09:00:00Z'
    },
    {
      id: 'post_seed_22',
      title: 'Build a LinkedIn Profile That Gets You Noticed',
      slug: 'post-linkedin-profile',
      category: 'Career',
      excerpt: 'Most LinkedIn profiles are forgettable. This guide shows you exactly how to build one that opens doors — using what recruiters actually look for.',
      content: 'LinkedIn has become the most important professional networking tool of our era...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&q=80',
      tags: ['career', 'linkedin', 'job search'],
      status: 'published',
      createdAt: '2026-02-12T10:00:00Z',
      updatedAt: '2026-02-12T10:00:00Z'
    },
    {
      id: 'post_seed_23',
      title: '10 Side Hustle Ideas You Can Start This Weekend',
      slug: 'post-side-hustle-ideas',
      category: 'Money',
      excerpt: 'Realistic, proven side hustles ranked by startup cost, time commitment, and earning potential. At least one of these will work for you.',
      content: 'A side hustle isn\'t just about extra money — it\'s about building optionality...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
      tags: ['money', 'side hustle', 'entrepreneurship'],
      status: 'published',
      createdAt: '2026-02-06T10:00:00Z',
      updatedAt: '2026-02-06T10:00:00Z'
    },
    {
      id: 'post_seed_24',
      title: 'Build Your Emergency Fund: A Step-by-Step Plan',
      slug: 'post-emergency-fund',
      category: 'Money',
      excerpt: 'How much you actually need, where to keep it, and a realistic plan for building your financial safety net — even on a tight budget.',
      content: 'An emergency fund is the foundation of financial security...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
      tags: ['money', 'emergency fund', 'savings'],
      status: 'published',
      createdAt: '2026-02-11T10:00:00Z',
      updatedAt: '2026-02-11T10:00:00Z'
    },
    {
      id: 'post_seed_25',
      title: 'Boost Your Credit Score in 90 Days',
      slug: 'post-credit-score',
      category: 'Money',
      excerpt: 'The exact steps that move the needle on your credit score — and the common mistakes that hold people back from 700+.',
      content: 'Your credit score affects more than just loan rates...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      tags: ['money', 'credit score', 'personal finance'],
      status: 'published',
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-02-20T10:00:00Z'
    },
    {
      id: 'post_seed_26',
      title: 'Gut Health 101: Feed Your Microbiome Right',
      slug: 'post-gut-health',
      category: 'Wellness',
      excerpt: 'What your gut microbiome actually is, why it matters for everything from immunity to mood, and exactly how to nurture it with food.',
      content: 'The gut microbiome is one of the most exciting frontiers in health science...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      tags: ['wellness', 'gut health', 'nutrition'],
      status: 'published',
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z'
    },
    {
      id: 'post_seed_27',
      title: '4 Breathing Exercises That Calm Your Nervous System',
      slug: 'post-breathing-exercises',
      category: 'Wellness',
      excerpt: 'Box breathing, 4-7-8, physiological sighs — these science-backed techniques work in minutes and you can use them anywhere.',
      content: 'Your breath is the only part of your autonomic nervous system you can consciously control...',
      author: 'Alex Morgan',
      heroImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
      tags: ['wellness', 'breathing', 'stress relief'],
      status: 'published',
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-01T10:00:00Z'
    },
    {
      id: 'post_seed_28',
      title: 'Intermittent Fasting: What It Is, What It Isn\'t',
      slug: 'post-intermittent-fasting',
      category: 'Food',
      excerpt: 'Separating the hype from the evidence on intermittent fasting. What the research actually says about weight, metabolism, and long-term health.',
      content: 'Intermittent fasting has been one of the most talked-about dietary approaches of the past decade...',
      author: 'Lin Torres',
      heroImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
      tags: ['food', 'intermittent fasting', 'nutrition'],
      status: 'published',
      createdAt: '2026-03-05T10:00:00Z',
      updatedAt: '2026-03-05T10:00:00Z'
    },
    {
      id: 'post_seed_29',
      title: 'Practical Coping Skills for Everyday Anxiety',
      slug: 'post-anxiety-coping',
      category: 'Mind',
      excerpt: 'Evidence-based tools that actually work — from grounding techniques to cognitive defusion. No toxic positivity, just real strategies.',
      content: 'Anxiety is the most common mental health challenge in the modern world...',
      author: 'Maya Patel',
      heroImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
      tags: ['mind', 'anxiety', 'mental health'],
      status: 'published',
      createdAt: '2026-03-08T10:00:00Z',
      updatedAt: '2026-03-08T10:00:00Z'
    },
    {
      id: 'post_seed_30',
      title: 'Passive Income Streams You Can Build While You Sleep',
      slug: 'post-passive-income',
      category: 'Money',
      excerpt: 'Realistic strategies for building passive income — what each requires, what it pays, and how long before you see results. No get-rich-quick nonsense.',
      content: 'Passive income is one of the most misunderstood concepts in personal finance...',
      author: 'James Rivera',
      heroImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
      tags: ['money', 'passive income', 'investing'],
      status: 'published',
      createdAt: '2026-03-12T10:00:00Z',
      updatedAt: '2026-03-12T10:00:00Z'
    }
  ];

  /* ---- Init / seed ---- */
  function init() {
    const storedVersion = localStorage.getItem('thrivemag_seed_v');
    if (storedVersion !== String(SEED_VERSION)) {
      // Preserve any user-created posts (id doesn't start with 'post_seed_')
      const existing = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
      const userPosts = existing.filter(p => !p.id.startsWith('post_seed_'));
      localStorage.setItem(POSTS_KEY, JSON.stringify([...SEED_POSTS, ...userPosts]));
      localStorage.setItem('thrivemag_seed_v', String(SEED_VERSION));
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
