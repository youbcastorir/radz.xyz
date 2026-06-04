/* ═══════════════════════════════════════════
   radz.xyz — app.js
   Core: routing, dashboard, settings, pricing, contact
   ═══════════════════════════════════════════ */

'use strict';

// ── STATE ──
const App = {
  currentView: 'dashboard',
  theme: localStorage.getItem('rz-theme') || 'dark',
  apiKey: localStorage.getItem('rz-apikey') || '',
  library: JSON.parse(localStorage.getItem('rz-library') || '[]'),
  stats: JSON.parse(localStorage.getItem('rz-stats') || JSON.stringify({
    articles: 0, images: 0, social: 0, seo: 0, total: 0
  })),

  saveLibrary() {
    localStorage.setItem('rz-library', JSON.stringify(this.library));
  },
  saveStats() {
    localStorage.setItem('rz-stats', JSON.stringify(this.stats));
  },
  addToLibrary(item) {
    this.library.unshift({ ...item, id: Date.now(), date: new Date().toISOString() });
    if (this.library.length > 100) this.library = this.library.slice(0, 100);
    this.saveLibrary();
    this.stats[item.type] = (this.stats[item.type] || 0) + 1;
    this.stats.total = (this.stats.total || 0) + 1;
    this.saveStats();
  }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(App.theme);
  setupNav();
  setupThemeToggle();
  setupMobileMenu();
  setupApiModal();
  updateApiStatus();
  renderView('dashboard');
});

// ── THEME ──
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  App.theme = t;
  localStorage.setItem('rz-theme', t);
}

function setupThemeToggle() {
  const btns = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
  btns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      applyTheme(App.theme === 'dark' ? 'light' : 'dark');
    });
  });
}

// ── NAVIGATION ──
function setupNav() {
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const view = el.dataset.view;
      navigateTo(view);
      closeMobileMenu();
    });
  });

  // topbar upgrade btn
  const upgBtn = document.querySelector('[data-view="pricing"]');
  if (upgBtn && upgBtn.classList.contains('btn')) {
    upgBtn.addEventListener('click', () => navigateTo('pricing'));
  }
}

function navigateTo(viewName) {
  // deactivate all nav items
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNav) activeNav.classList.add('active');

  // hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById(`view-${viewName}`);
  if (!viewEl) return;
  viewEl.classList.add('active');

  App.currentView = viewName;
  updateTopbar(viewName);
  renderView(viewName);
}

function updateTopbar(view) {
  const titles = {
    dashboard: ['Dashboard', 'Welcome back — let\'s create something'],
    article: ['Article Generator', 'Craft compelling articles with AI'],
    image: ['Image Generator', 'Generate creative image prompts'],
    social: ['Social Media', 'Create platform-perfect posts'],
    seo: ['SEO Tools', 'Optimize your content for search'],
    library: ['Content Library', 'Your saved projects & history'],
    pricing: ['Pricing', 'Choose the plan that\'s right for you'],
    settings: ['Settings', 'Configure your workspace'],
    contact: ['Contact', 'Get in touch with us'],
  };
  const [title, subtitle] = titles[view] || ['radz.xyz', ''];
  const t = document.getElementById('pageTitle');
  const s = document.getElementById('pageSubtitle');
  if (t) t.textContent = title;
  if (s) s.textContent = subtitle;
}

// ── MOBILE MENU ──
function setupMobileMenu() {
  const btn = document.getElementById('hamburger');
  const overlay = document.getElementById('sidebarOverlay');
  if (btn) btn.addEventListener('click', toggleMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);
}

function toggleMobileMenu() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebarOverlay')?.classList.toggle('open');
}

function closeMobileMenu() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

// ── API MODAL ──
function setupApiModal() {
  const modal = document.getElementById('apiModal');
  const status = document.getElementById('apiKeyStatus');
  const close = document.getElementById('modalClose');
  const cancel = document.getElementById('modalCancel');
  const save = document.getElementById('modalSave');
  const input = document.getElementById('apiKeyInput');

  if (status) status.addEventListener('click', () => openApiModal());
  if (close) close.addEventListener('click', closeApiModal);
  if (cancel) cancel.addEventListener('click', closeApiModal);
  if (save) save.addEventListener('click', () => {
    const key = input?.value?.trim();
    if (key && key.startsWith('sk-ant')) {
      App.apiKey = key;
      localStorage.setItem('rz-apikey', key);
      updateApiStatus();
      closeApiModal();
      showToast('API key saved! AI generation enabled.', 'success');
    } else {
      showToast('Please enter a valid Anthropic API key (sk-ant-...)', 'error');
    }
  });

  modal?.addEventListener('click', e => { if (e.target === modal) closeApiModal(); });
  if (input && App.apiKey) input.value = App.apiKey;
}

function openApiModal() {
  document.getElementById('apiModal')?.classList.add('open');
}

function closeApiModal() {
  document.getElementById('apiModal')?.classList.remove('open');
}

function updateApiStatus() {
  const el = document.getElementById('apiKeyStatus');
  if (!el) return;
  const text = el.querySelector('.status-text');
  if (App.apiKey) {
    el.classList.add('connected');
    if (text) text.textContent = 'API';
  } else {
    el.classList.remove('connected');
    if (text) text.textContent = 'No API Key';
  }
}

// ── TOAST ──
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = { success: '✓', error: '✕', info: '●' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '●'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutDown 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ── COPY HELPER ──
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    if (btn) {
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.classList.remove('copied');
      }, 2000);
    }
    showToast('Copied to clipboard!', 'success');
  } catch {
    showToast('Copy failed — please select manually.', 'error');
  }
}

// ── AI CALL ──
async function callAI(prompt, systemPrompt = '') {
  if (!App.apiKey) {
    openApiModal();
    throw new Error('API key required');
  }

  const messages = [{ role: 'user', content: prompt }];
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages
  };
  if (systemPrompt) body.system = systemPrompt;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.map(c => c.text || '').join('\n') || '';
}

// ── RENDER VIEWS ──
function renderView(view) {
  const el = document.getElementById(`view-${view}`);
  if (!el || el._rendered) return;

  const renders = {
    dashboard: renderDashboard,
    pricing: renderPricing,
    settings: renderSettings,
    contact: renderContact,
    library: renderLibrary,
  };

  if (renders[view]) {
    renders[view](el);
    el._rendered = true;
  }
}

// Invalidate library on each open (dynamic data)
function navigateToWithRefresh(viewName) {
  if (viewName === 'library') {
    const el = document.getElementById('view-library');
    if (el) el._rendered = false;
  }
  navigateTo(viewName);
}

// ── DASHBOARD ──
function renderDashboard(el) {
  const s = App.stats;
  el.innerHTML = `
    <div class="hero-gradient mb-6">
      <div class="hero-title">Welcome to <span>radz.xyz</span></div>
      <div class="hero-subtitle">Your AI-powered content creation studio. Generate, refine, and publish faster.</div>
      <div class="flex gap-2" style="flex-wrap:wrap">
        <button class="btn btn-primary" onclick="navigateTo('article')">✍️ Write Article</button>
        <button class="btn btn-ghost" onclick="navigateTo('social')">📱 Social Posts</button>
        <button class="btn btn-ghost" onclick="navigateTo('image')">🖼️ Image Prompts</button>
        <button class="btn btn-ghost" onclick="navigateTo('seo')">🔍 SEO Tools</button>
      </div>
    </div>

    <div class="grid-4 mb-6">
      <div class="stat-card">
        <div class="stat-value">${s.total || 0}</div>
        <div class="stat-label">Total Generations</div>
        <div class="stat-delta up">↑ All time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${s.articles || 0}</div>
        <div class="stat-label">Articles Written</div>
        <div class="stat-delta up">✍️ Content</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${s.social || 0}</div>
        <div class="stat-label">Social Posts</div>
        <div class="stat-delta up">📱 Social</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${s.seo || 0}</div>
        <div class="stat-label">SEO Analyses</div>
        <div class="stat-delta up">🔍 SEO</div>
      </div>
    </div>

    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Quick Actions</span>
        </div>
        <div class="grid-2">
          ${quickActions().map(a => `
            <button class="quick-action" onclick="navigateTo('${a.view}')">
              <div class="quick-action-icon" style="background:${a.bg}">${a.icon}</div>
              <div class="quick-action-title">${a.title}</div>
              <div class="quick-action-desc">${a.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Content</span>
          <button class="btn btn-ghost btn-sm" onclick="navigateToWithRefresh('library')">View All</button>
        </div>
        <div id="recentList">
          ${renderRecentList()}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">API Status</span>
        <span class="badge ${App.apiKey ? 'badge-green' : 'badge-rose'}">${App.apiKey ? '● Connected' : '○ Not Connected'}</span>
      </div>
      <p class="text-sm text-muted mb-3">
        ${App.apiKey
          ? 'Your Anthropic API key is active. AI generation is enabled across all tools.'
          : 'Connect your Anthropic API key to enable real AI-powered generation. Click the status indicator in the top bar.'
        }
      </p>
      ${!App.apiKey ? `<button class="btn btn-primary btn-sm" onclick="openApiModal()">🔑 Add API Key</button>` : ''}
    </div>
  `;
}

function quickActions() {
  return [
    { view: 'article', icon: '✍️', title: 'Blog Article', desc: 'SEO-optimized posts', bg: 'rgba(99,102,241,0.12)' },
    { view: 'social', icon: '📱', title: 'Social Posts', desc: '6 platforms', bg: 'rgba(52,211,153,0.12)' },
    { view: 'image', icon: '🖼️', title: 'Image Prompts', desc: 'AI art direction', bg: 'rgba(167,139,250,0.12)' },
    { view: 'seo', icon: '🔍', title: 'SEO Analyzer', desc: 'Optimize content', bg: 'rgba(245,158,11,0.12)' },
  ];
}

function renderRecentList() {
  const recent = App.library.slice(0, 5);
  if (!recent.length) {
    return `<div class="empty-state" style="padding:24px">
      <div class="empty-icon">📭</div>
      <div class="empty-title">No content yet</div>
      <div class="empty-desc">Generate your first piece of content to see it here</div>
    </div>`;
  }
  return recent.map(item => `
    <div class="history-item" style="margin-bottom:8px">
      <div class="history-icon">${typeIcon(item.type)}</div>
      <div class="history-content">
        <div class="history-title">${escHtml(item.title || 'Untitled')}</div>
        <div class="history-meta">${item.type} · ${timeAgo(item.date)}</div>
      </div>
    </div>
  `).join('');
}

// ── LIBRARY ──
function renderLibrary(el) {
  const items = App.library;
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">Content Library</div>
      <div class="section-desc">All your saved content, templates and history</div>
    </div>

    <div class="flex justify-between items-center mb-4">
      <div class="tabs" style="margin-bottom:0">
        <button class="tab active" onclick="filterLibrary(this,'all')">All (${items.length})</button>
        <button class="tab" onclick="filterLibrary(this,'article')">Articles</button>
        <button class="tab" onclick="filterLibrary(this,'social')">Social</button>
        <button class="tab" onclick="filterLibrary(this,'image')">Images</button>
        <button class="tab" onclick="filterLibrary(this,'seo')">SEO</button>
      </div>
      ${items.length ? `<button class="btn btn-ghost btn-sm" onclick="clearLibrary()">🗑 Clear All</button>` : ''}
    </div>

    <div id="libraryItems">
      ${renderLibraryItems(items)}
    </div>
  `;
}

function renderLibraryItems(items) {
  if (!items.length) {
    return `<div class="empty-state">
      <div class="empty-icon">📚</div>
      <div class="empty-title">Your library is empty</div>
      <div class="empty-desc">Generated content will appear here automatically</div>
    </div>`;
  }
  return `<div style="display:flex;flex-direction:column;gap:8px">` +
    items.map(item => `
      <div class="history-item" data-type="${item.type}">
        <div class="history-icon">${typeIcon(item.type)}</div>
        <div class="history-content">
          <div class="history-title">${escHtml(item.title || 'Untitled')}</div>
          <div class="history-meta">${item.type} · ${timeAgo(item.date)} · ${(item.content || '').length} chars</div>
        </div>
        <div class="history-actions">
          <button class="icon-btn" title="Copy" onclick="copyText(${JSON.stringify(escHtml(item.content || ''))})">📋</button>
          <button class="icon-btn" title="Delete" onclick="deleteLibraryItem(${item.id})">🗑</button>
        </div>
      </div>
    `).join('') + '</div>';
}

window.filterLibrary = function(btn, type) {
  document.querySelectorAll('#view-library .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const items = type === 'all' ? App.library : App.library.filter(i => i.type === type);
  const el = document.getElementById('libraryItems');
  if (el) el.innerHTML = renderLibraryItems(items);
};

window.deleteLibraryItem = function(id) {
  App.library = App.library.filter(i => i.id !== id);
  App.saveLibrary();
  const el = document.getElementById('view-library');
  if (el) { el._rendered = false; renderLibrary(el); el._rendered = true; }
};

window.clearLibrary = function() {
  if (!confirm('Clear all saved content?')) return;
  App.library = [];
  App.saveLibrary();
  const el = document.getElementById('view-library');
  if (el) { el._rendered = false; renderLibrary(el); el._rendered = true; }
};

// ── PRICING ──
function renderPricing(el) {
  const plans = [
    {
      name: 'Free', price: 0, color: '#8b8ba8',
      features: ['10 AI generations/month', '3 article types', 'Basic SEO tools', 'Social posts (3 platforms)', 'Content history (7 days)', 'Community support']
    },
    {
      name: 'Pro', price: 19, color: '#6366f1', featured: true,
      features: ['100 AI generations/month', 'All article types', 'Full SEO suite', 'All 6 social platforms', 'Unlimited history', 'Image prompt generator', 'Priority support', 'Export to Markdown/HTML']
    },
    {
      name: 'Creator', price: 49, color: '#a78bfa',
      features: ['500 AI generations/month', 'Everything in Pro', 'Bulk generation', 'Custom templates', 'API access', 'Multi-language (10+ langs)', 'Advanced analytics', 'Email support']
    },
    {
      name: 'Agency', price: 99, color: '#34d399',
      features: ['Unlimited generations', 'Everything in Creator', '5 team seats', 'White-label option', 'Custom AI fine-tuning', 'Dedicated account manager', 'SLA guarantee', 'Invoice billing']
    }
  ];

  el.innerHTML = `
    <div class="section-header" style="text-align:center;max-width:500px;margin:0 auto 32px">
      <div class="section-title" style="font-size:28px">Simple, transparent pricing</div>
      <div class="section-desc" style="font-size:15px">Start free. Scale when you're ready. No hidden fees.</div>
    </div>

    <div class="pricing-grid mb-6">
      ${plans.map(p => `
        <div class="pricing-card ${p.featured ? 'featured' : ''}">
          <div>
            <div class="pricing-name" style="color:${p.color}">${p.name}</div>
            <div class="pricing-price">
              <span class="pricing-amount">$${p.price}</span>
              <span class="pricing-period">/mo</span>
            </div>
          </div>
          <ul class="pricing-features">
            ${p.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <button class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-full"
            onclick="showToast('${p.price === 0 ? 'You\'re on Free plan!' : p.name + ' plan — coming soon!'}','${p.price===0?'success':'info'}')">
            ${p.price === 0 ? 'Current Plan' : `Get ${p.name}`}
          </button>
        </div>
      `).join('')}
    </div>

    <div class="card" style="text-align:center;padding:32px">
      <div class="section-title mb-2">Need a custom plan?</div>
      <p class="text-sm text-muted mb-4">Enterprise pricing for large teams, custom integrations, or specific compliance requirements.</p>
      <a href="mailto:salatrir@gmail.com" class="btn btn-outline">📧 Contact Sales</a>
    </div>
  `;
}

// ── SETTINGS ──
function renderSettings(el) {
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">Settings</div>
      <div class="section-desc">Manage your API keys, preferences, and account</div>
    </div>

    <div class="grid-2">
      <div>
        <div class="card mb-4">
          <div class="card-title mb-3">🔑 API Configuration</div>
          <div class="form-group">
            <label class="form-label">Anthropic API Key</label>
            <input type="password" class="form-input" id="settingsApiKey"
              placeholder="sk-ant-api03-..."
              value="${App.apiKey}" />
            <div class="text-xs text-muted mt-2">Get your key at <a href="https://console.anthropic.com" target="_blank" style="color:var(--accent)">console.anthropic.com</a></div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="saveSettingsKey()">Save API Key</button>
          ${App.apiKey ? `<button class="btn btn-ghost btn-sm" style="margin-left:8px" onclick="removeApiKey()">Remove Key</button>` : ''}
        </div>

        <div class="card mb-4">
          <div class="card-title mb-3">🎨 Appearance</div>
          <div class="toggle-wrap">
            <div>
              <div class="toggle-label">Dark Mode</div>
              <div class="toggle-desc">Switch between dark and light themes</div>
            </div>
            <div class="toggle ${App.theme === 'dark' ? 'on' : ''}" id="themeToggleSettings" onclick="toggleThemeSettings(this)"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-title mb-3">🌐 Language & Region</div>
          <div class="form-group">
            <label class="form-label">Default Output Language</label>
            <select class="form-select" id="settingsLang">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
              <option value="it">Italian</option>
              <option value="nl">Dutch</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          <button class="btn btn-outline btn-sm" onclick="showToast('Language preference saved','success')">Save</button>
        </div>
      </div>

      <div>
        <div class="card mb-4">
          <div class="card-title mb-3">📊 Usage & Limits</div>
          <div class="mb-3">
            <div class="flex justify-between mb-2">
              <span class="text-sm">Monthly Generations</span>
              <span class="text-sm text-accent">${App.stats.total}/10 used</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(App.stats.total*10,100)}%"></div>
            </div>
          </div>
          <div class="text-xs text-muted mb-3">Resets monthly. Upgrade for more generations.</div>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('pricing')">⚡ Upgrade Plan</button>
        </div>

        <div class="card mb-4">
          <div class="card-title mb-3">💾 Data & Privacy</div>
          <div class="toggle-wrap">
            <div>
              <div class="toggle-label">Save Content History</div>
              <div class="toggle-desc">Store generated content in library</div>
            </div>
            <div class="toggle on" onclick="this.classList.toggle('on')"></div>
          </div>
          <div class="toggle-wrap">
            <div>
              <div class="toggle-label">Analytics</div>
              <div class="toggle-desc">Help improve the platform</div>
            </div>
            <div class="toggle on" onclick="this.classList.toggle('on')"></div>
          </div>
          <div class="divider"></div>
          <button class="btn btn-ghost btn-sm" onclick="exportData()">📤 Export My Data</button>
          <button class="btn btn-ghost btn-sm" style="margin-left:8px;color:var(--accent-rose)" onclick="clearAllData()">🗑 Clear All Data</button>
        </div>

        <div class="card">
          <div class="card-title mb-3">ℹ️ About</div>
          <div class="text-sm text-muted" style="line-height:1.8">
            <strong style="color:var(--text-primary)">radz.xyz CreatorSuite AI</strong><br/>
            Version 1.0.0<br/>
            Built for content creators worldwide<br/>
            Contact: <a href="mailto:salatrir@gmail.com" style="color:var(--accent)">salatrir@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.saveSettingsKey = function() {
  const key = document.getElementById('settingsApiKey')?.value?.trim();
  if (key && key.startsWith('sk-ant')) {
    App.apiKey = key;
    localStorage.setItem('rz-apikey', key);
    updateApiStatus();
    showToast('API key saved!', 'success');
    // re-render settings to show remove button
    const el = document.getElementById('view-settings');
    if (el) { el._rendered = false; renderSettings(el); el._rendered = true; }
  } else {
    showToast('Enter a valid Anthropic API key', 'error');
  }
};

window.removeApiKey = function() {
  App.apiKey = '';
  localStorage.removeItem('rz-apikey');
  updateApiStatus();
  showToast('API key removed', 'info');
  const el = document.getElementById('view-settings');
  if (el) { el._rendered = false; renderSettings(el); el._rendered = true; }
};

window.toggleThemeSettings = function(el) {
  el.classList.toggle('on');
  applyTheme(el.classList.contains('on') ? 'dark' : 'light');
};

window.exportData = function() {
  const data = JSON.stringify({ library: App.library, stats: App.stats }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'radz-xyz-export.json';
  a.click(); URL.revokeObjectURL(url);
  showToast('Data exported!', 'success');
};

window.clearAllData = function() {
  if (!confirm('Clear ALL data including library, stats and API key?')) return;
  localStorage.clear();
  App.library = []; App.stats = { articles: 0, images: 0, social: 0, seo: 0, total: 0 };
  App.apiKey = '';
  updateApiStatus();
  showToast('All data cleared', 'info');
  document.querySelectorAll('.view').forEach(v => delete v._rendered);
  navigateTo('dashboard');
};

// ── CONTACT ──
function renderContact(el) {
  el.innerHTML = `
    <div style="max-width:600px;margin:0 auto">
      <div class="section-header" style="text-align:center">
        <div class="section-title">Get in Touch</div>
        <div class="section-desc">We'd love to hear from you. Send us a message and we'll respond within 24 hours.</div>
      </div>

      <div class="card mb-4">
        <div class="card-title mb-4">📧 Send a Message</div>
        <div class="form-group">
          <label class="form-label">Your Name</label>
          <input type="text" class="form-input" id="contactName" placeholder="John Doe" />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="contactEmail" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select" id="contactSubject">
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Billing Question</option>
            <option>Feature Request</option>
            <option>API Integration Help</option>
            <option>Partnership Opportunity</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-textarea" id="contactMessage" rows="5" placeholder="Tell us how we can help..."></textarea>
        </div>
        <button class="btn btn-primary btn-full" onclick="submitContact()">Send Message →</button>
      </div>

      <div class="grid-2">
        <div class="card" style="text-align:center">
          <div style="font-size:28px;margin-bottom:8px">📧</div>
          <div class="card-title mb-2">Email Support</div>
          <a href="mailto:salatrir@gmail.com" style="color:var(--accent);font-size:13px;text-decoration:none">salatrir@gmail.com</a>
          <div class="text-xs text-muted mt-2">Response within 24h</div>
        </div>
        <div class="card" style="text-align:center">
          <div style="font-size:28px;margin-bottom:8px">💬</div>
          <div class="card-title mb-2">Community</div>
          <div class="text-sm text-muted">Join our Discord for tips, templates, and early access features.</div>
          <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="showToast('Community coming soon!','info')">Join Discord</button>
        </div>
      </div>
    </div>
  `;
}

window.submitContact = function() {
  const name = document.getElementById('contactName')?.value?.trim();
  const email = document.getElementById('contactEmail')?.value?.trim();
  const msg = document.getElementById('contactMessage')?.value?.trim();
  if (!name || !email || !msg) {
    showToast('Please fill in all fields', 'error'); return;
  }
  // In a real app, send to a backend. Here we open mailto:
  const subject = document.getElementById('contactSubject')?.value || 'Inquiry';
  window.location.href = `mailto:salatrir@gmail.com?subject=${encodeURIComponent(`[radz.xyz] ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`)}`;
  showToast('Opening your email client...', 'success');
};

// ── UTILS ──
function typeIcon(type) {
  return { article: '✍️', social: '📱', image: '🖼️', seo: '🔍' }[type] || '📄';
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Expose globals needed across modules
window.App = App;
window.callAI = callAI;
window.showToast = showToast;
window.copyText = copyText;
window.navigateTo = navigateTo;
window.navigateToWithRefresh = navigateToWithRefresh;
window.openApiModal = openApiModal;
window.escHtml = escHtml;
