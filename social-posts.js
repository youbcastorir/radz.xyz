/* ═══════════════════════════════════════════
   radz.xyz — social-posts.js
   Social Media Content Generator
   ═══════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const origRender = window.renderView;
  window.renderView = function(view) {
    if (view === 'social') {
      const el = document.getElementById('view-social');
      if (el && !el._rendered) { renderSocialView(el); el._rendered = true; }
      return;
    }
    origRender(view);
  };
});

// ══════════════════════════════════════════
// PLATFORMS CONFIG
// ══════════════════════════════════════════

const PLATFORMS = {
  facebook: {
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    maxChars: 63206,
    displayMax: 400,
    tips: 'Conversational tone, stories, longer posts work well. Include a call-to-action.',
    hashtagStyle: '3–5 hashtags',
    emoji: true,
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: '#E1306C',
    maxChars: 2200,
    displayMax: 150,
    tips: 'Hook in first line (before "more"). Visual storytelling. Up to 30 hashtags in first comment.',
    hashtagStyle: '20–30 hashtags',
    emoji: true,
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '🐦',
    color: '#000000',
    maxChars: 280,
    displayMax: 280,
    tips: 'Punchy, direct. Hook + value + CTA. Threads work for longer content.',
    hashtagStyle: '1–2 hashtags',
    emoji: true,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    maxChars: 3000,
    displayMax: 300,
    tips: 'Professional but personal. Insights, lessons, story format. Line breaks matter.',
    hashtagStyle: '3–5 hashtags',
    emoji: false,
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#010101',
    maxChars: 2200,
    displayMax: 150,
    tips: 'Casual, trendy, authentic. Hook within first second. Use trending sounds reference.',
    hashtagStyle: '3–5 hashtags',
    emoji: true,
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    color: '#FF0000',
    maxChars: 5000,
    displayMax: 200,
    tips: 'Community posts are conversational. Ask questions. Polls work great.',
    hashtagStyle: '3–5 hashtags',
    emoji: true,
  },
};

// ══════════════════════════════════════════
// RENDER
// ══════════════════════════════════════════

function renderSocialView(el) {
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">📱 Social Media Generator</div>
      <div class="section-desc">Create platform-optimized content for every channel</div>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">

      <!-- LEFT: Controls -->
      <div>
        <div class="card mb-4">
          <div class="card-title mb-3">Select Platforms</div>
          <div class="platform-grid" id="platformGrid">
            ${Object.entries(PLATFORMS).map(([key, p]) => `
              <button class="platform-btn ${key === 'instagram' ? 'active' : ''}"
                data-platform="${key}"
                onclick="togglePlatform(this,'${key}')">
                <div class="platform-icon" style="background:${p.color}22">${p.icon}</div>
                ${p.name}
              </button>
            `).join('')}
          </div>
          <div class="text-xs text-muted">Select one or multiple platforms</div>
        </div>

        <div class="card mb-4">
          <div class="card-title mb-3">Content Details</div>

          <div class="form-group">
            <label class="form-label">Topic / Message</label>
            <textarea class="form-textarea" id="socialTopic" rows="3"
              placeholder="e.g. We just launched our new AI product, announcing a sale, sharing a productivity tip..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Content Goal</label>
            <select class="form-select" id="socialGoal">
              <option value="engagement">Drive Engagement</option>
              <option value="awareness">Brand Awareness</option>
              <option value="traffic">Drive Traffic / Clicks</option>
              <option value="sales">Promote Product/Sale</option>
              <option value="community">Build Community</option>
              <option value="education">Educate / Inform</option>
              <option value="entertainment">Entertain</option>
              <option value="announcement">Make Announcement</option>
            </select>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Brand Tone</label>
              <select class="form-select" id="socialTone">
                <option value="professional">Professional</option>
                <option value="casual and friendly">Casual & Friendly</option>
                <option value="humorous and witty">Humorous & Witty</option>
                <option value="inspirational">Inspirational</option>
                <option value="authoritative">Authoritative</option>
                <option value="empathetic">Empathetic</option>
                <option value="bold and direct">Bold & Direct</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Language</label>
              <select class="form-select" id="socialLang">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Italian">Italian</option>
                <option value="Arabic">Arabic</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Include CTA (Call to Action)</label>
            <select class="form-select" id="socialCTA">
              <option value="none">No CTA</option>
              <option value="visit link in bio">Visit link in bio</option>
              <option value="comment below">Comment below</option>
              <option value="share with a friend">Share with a friend</option>
              <option value="follow for more">Follow for more</option>
              <option value="save this post">Save this post</option>
              <option value="click the link">Click the link</option>
              <option value="DM us">DM us</option>
              <option value="buy now">Buy Now</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Brand/Product Name (optional)</label>
            <input type="text" class="form-input" id="socialBrand"
              placeholder="e.g. radz.xyz, Nike, Your Brand" />
          </div>

          <div class="flex gap-2">
            <button class="btn btn-primary" style="flex:1" id="generateSocialBtn" onclick="generateSocialPosts()">
              ✨ Generate Posts
            </button>
            <button class="btn btn-ghost" onclick="generateAllPlatforms()" title="Generate for all platforms">
              🔄 All Platforms
            </button>
          </div>
        </div>

        <!-- Thread Generator -->
        <div class="card">
          <div class="card-title mb-3">🧵 Twitter Thread Generator</div>
          <div class="form-group">
            <label class="form-label">Thread Topic</label>
            <input type="text" class="form-input" id="threadTopic"
              placeholder="e.g. 10 lessons I learned building my startup" />
          </div>
          <div class="form-group">
            <label class="form-label">Number of Tweets</label>
            <select class="form-select" id="threadCount">
              <option value="5">5 tweets</option>
              <option value="7" selected>7 tweets</option>
              <option value="10">10 tweets</option>
              <option value="15">15 tweets</option>
            </select>
          </div>
          <button class="btn btn-outline btn-full" onclick="generateThread()">🧵 Generate Thread</button>
        </div>
      </div>

      <!-- RIGHT: Output -->
      <div id="socialOutputArea">
        <div class="card">
          <div class="output-area" style="min-height:300px">
            <div class="output-placeholder">
              Select platforms, describe your content, and click Generate.
              <br/><br/>
              💡 Tip: Select multiple platforms to get all posts in one click.
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// ── Platform Selection ──
const selectedPlatforms = new Set(['instagram']);

window.togglePlatform = function(btn, key) {
  btn.classList.toggle('active');
  if (selectedPlatforms.has(key)) {
    selectedPlatforms.delete(key);
  } else {
    selectedPlatforms.add(key);
  }
};

// ── Generate Social Posts ──
let socialResults = {};

window.generateSocialPosts = async function() {
  const topic = document.getElementById('socialTopic')?.value?.trim();
  if (!topic) { showToast('Please enter a topic', 'error'); return; }
  if (selectedPlatforms.size === 0) { showToast('Select at least one platform', 'error'); return; }

  const goal = document.getElementById('socialGoal')?.value || 'engagement';
  const tone = document.getElementById('socialTone')?.value || 'professional';
  const lang = document.getElementById('socialLang')?.value || 'English';
  const cta = document.getElementById('socialCTA')?.value || 'none';
  const brand = document.getElementById('socialBrand')?.value || '';

  const btn = document.getElementById('generateSocialBtn');
  const outputArea = document.getElementById('socialOutputArea');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Generating...'; }
  if (outputArea) outputArea.innerHTML = `<div class="card"><div class="output-area"><div class="output-placeholder">✨ Crafting your social posts<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div></div></div>`;

  const platformList = [...selectedPlatforms].map(k => PLATFORMS[k]);
  const platformDetails = platformList.map(p =>
    `${p.name}: max ${p.displayMax} chars, ${p.hashtagStyle}, ${p.tips}`
  ).join('\n');

  const prompt = `Create social media posts for the following platforms in ${lang}:

Topic/Message: ${topic}
Goal: ${goal}
Brand/Tone: ${tone}${brand ? `, Brand: ${brand}` : ''}
CTA: ${cta !== 'none' ? cta : 'no specific CTA'}

Platforms and requirements:
${platformDetails}

For EACH platform, write an optimized post following the platform's best practices.
Format your response EXACTLY like this (use platform names as headers):

### FACEBOOK
[post content]

### INSTAGRAM
[post content with relevant hashtags]

### TWITTER
[tweet content under 280 chars]

### LINKEDIN
[professional post]

### TIKTOK
[casual video caption]

### YOUTUBE
[community post content]

Only include posts for the requested platforms: ${[...selectedPlatforms].map(k => PLATFORMS[k].name).join(', ')}`;

  try {
    const text = await callAI(prompt, `You are an expert social media content creator. Write engaging, platform-native content that gets results. Each post must feel natural for its platform. Never add meta-commentary like "Here is your post".`);

    socialResults = parseSocialResponse(text, [...selectedPlatforms]);
    renderSocialResults(outputArea, socialResults);

    // Save to library
    const combinedContent = Object.entries(socialResults)
      .map(([k, v]) => `=== ${PLATFORMS[k]?.name} ===\n${v}`).join('\n\n');
    App.addToLibrary({ type: 'social', title: topic.substring(0, 60), content: combinedContent });

    showToast(`Posts generated for ${selectedPlatforms.size} platform(s)!`, 'success');
  } catch (err) {
    // Fallback: generate simple posts
    const fallbacks = {};
    [...selectedPlatforms].forEach(key => {
      fallbacks[key] = buildFallbackPost(key, topic, tone, cta, brand);
    });
    socialResults = fallbacks;
    renderSocialResults(outputArea, fallbacks);
    showToast('Basic posts generated (add API key for AI results)', 'info');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '✨ Generate Posts'; }
  }
};

function parseSocialResponse(text, platforms) {
  const results = {};
  platforms.forEach(key => {
    const pName = PLATFORMS[key]?.name?.toUpperCase();
    if (!pName) return;
    // Try to find section
    const patterns = [
      new RegExp(`###\\s*${pName}\\s*\\n([\\s\\S]*?)(?=###|$)`, 'i'),
      new RegExp(`\\*\\*${pName}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\*\\*|$)`, 'i'),
      new RegExp(`${pName}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z]+:|$)`, 'i'),
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]?.trim()) {
        results[key] = match[1].trim();
        break;
      }
    }
    // If not found, use a chunk of text
    if (!results[key]) {
      const lines = text.split('\n');
      const startIdx = lines.findIndex(l => l.toLowerCase().includes(key));
      if (startIdx !== -1) {
        results[key] = lines.slice(startIdx + 1, startIdx + 10).join('\n').trim();
      } else {
        results[key] = text.substring(0, 300);
      }
    }
  });
  return results;
}

function buildFallbackPost(key, topic, tone, cta, brand) {
  const p = PLATFORMS[key];
  const brandTag = brand ? ` | ${brand}` : '';
  const ctaText = cta !== 'none' ? `\n\n${cta.charAt(0).toUpperCase() + cta.slice(1)} ↗` : '';

  const posts = {
    twitter: `${topic.substring(0, 220)}${ctaText}\n\n#${topic.split(' ')[0]} #ContentCreator`,
    instagram: `${topic}\n\nDouble tap if you agree! 👇${ctaText}\n\n#${topic.split(' ').slice(0,3).join(' #')} #instagood #contentcreator`,
    facebook: `${topic}${brandTag}\n\nWhat do you think? Let us know in the comments! 👇${ctaText}`,
    linkedin: `${topic}${brandTag}\n\nKey takeaway: Every piece of content is an opportunity to provide value.\n\nWhat's your experience with this?${ctaText}`,
    tiktok: `${topic} ✨${ctaText}\n\n#fyp #foryoupage #${topic.split(' ')[0]}`,
    youtube: `${topic}${brandTag}\n\nDrop your thoughts below! 💬${ctaText}`,
  };
  return posts[key] || topic;
}

function renderSocialResults(container, results) {
  if (!container) return;

  const html = `
    <div style="display:flex;flex-direction:column;gap:16px">
      <!-- Bulk actions -->
      <div class="flex gap-2 flex-wrap">
        <button class="btn btn-outline btn-sm" onclick="copyAllPosts()">📋 Copy All</button>
        <button class="btn btn-ghost btn-sm" onclick="downloadAllPosts()">⬇️ Download</button>
        <button class="btn btn-ghost btn-sm" onclick="saveAllPosts()">💾 Save All</button>
      </div>

      ${Object.entries(results).map(([key, content]) => {
        const p = PLATFORMS[key];
        if (!p) return '';
        const charCount = content.length;
        const isOver = charCount > p.maxChars;
        return `
          <div class="card" style="border-left:3px solid ${p.color}">
            <div class="card-header" style="margin-bottom:12px">
              <div class="flex items-center gap-2">
                <span style="font-size:20px">${p.icon}</span>
                <span class="card-title">${p.name}</span>
                <span class="badge ${isOver ? 'badge-rose' : 'badge-green'}">${charCount}/${p.displayMax}</span>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-ghost btn-sm" onclick="copyPost('${key}')">📋</button>
                <button class="btn btn-ghost btn-sm" onclick="rewritePost('${key}')">🔄</button>
              </div>
            </div>
            <div class="output-area" id="post-${key}" style="min-height:auto;white-space:pre-wrap">${escHtml(content)}</div>
            ${isOver ? `<div class="text-xs" style="color:var(--accent-rose);margin-top:6px">⚠️ Exceeds ${p.name} character limit</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
}

window.copyPost = function(key) {
  const content = socialResults[key];
  if (content) copyText(content);
};

window.copyAllPosts = function() {
  const all = Object.entries(socialResults)
    .map(([k, v]) => `=== ${PLATFORMS[k]?.name} ===\n${v}`)
    .join('\n\n---\n\n');
  copyText(all);
};

window.downloadAllPosts = function() {
  const topic = document.getElementById('socialTopic')?.value || 'social-posts';
  const content = Object.entries(socialResults)
    .map(([k, v]) => `# ${PLATFORMS[k]?.name}\n\n${v}`)
    .join('\n\n---\n\n');
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}-social-posts.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Posts downloaded!', 'success');
};

window.saveAllPosts = function() {
  const topic = document.getElementById('socialTopic')?.value || 'Social Posts';
  const combined = Object.entries(socialResults)
    .map(([k, v]) => `=== ${PLATFORMS[k]?.name} ===\n${v}`).join('\n\n');
  App.addToLibrary({ type: 'social', title: topic.substring(0, 60), content: combined });
  showToast('Saved to library!', 'success');
};

window.rewritePost = async function(key) {
  const topic = document.getElementById('socialTopic')?.value?.trim() || '';
  const p = PLATFORMS[key];
  if (!p) return;

  const postEl = document.getElementById(`post-${key}`);
  if (postEl) postEl.textContent = '🔄 Rewriting...';

  const prompt = `Rewrite this ${p.name} post about "${topic}" with a fresh angle.
Keep it under ${p.displayMax} characters.
Tone: ${document.getElementById('socialTone')?.value || 'professional'}
${p.tips}
Return ONLY the post text, no explanation.`;

  try {
    const newPost = await callAI(prompt);
    socialResults[key] = newPost.trim();
    if (postEl) postEl.textContent = newPost.trim();
    showToast(`${p.name} post rewritten!`, 'success');
  } catch {
    if (postEl) postEl.textContent = socialResults[key];
    showToast('Add API key to rewrite posts', 'error');
  }
};

// ── Generate All Platforms ──
window.generateAllPlatforms = function() {
  // Select all platforms
  Object.keys(PLATFORMS).forEach(key => {
    selectedPlatforms.add(key);
    const btn = document.querySelector(`[data-platform="${key}"]`);
    if (btn) btn.classList.add('active');
  });
  window.generateSocialPosts();
};

// ── Twitter Thread Generator ──
window.generateThread = async function() {
  const topic = document.getElementById('threadTopic')?.value?.trim();
  if (!topic) { showToast('Enter a thread topic', 'error'); return; }
  const count = parseInt(document.getElementById('threadCount')?.value || '7');

  const outputArea = document.getElementById('socialOutputArea');
  if (outputArea) {
    outputArea.innerHTML = `<div class="card"><div class="output-area"><div class="output-placeholder">🧵 Crafting your thread<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div></div></div>`;
  }

  const prompt = `Write a compelling Twitter/X thread about: "${topic}"

Requirements:
- Exactly ${count} tweets
- Each tweet under 280 characters
- First tweet is a strong hook that makes people want to read more
- Number each tweet: 1/${count}, 2/${count}, etc.
- Last tweet has a call-to-action (follow, retweet, comment)
- Use line breaks for readability
- Include 1-2 relevant hashtags only in the last tweet

Format each tweet on a new line starting with the number (1/${count}:)`;

  try {
    const text = await callAI(prompt, 'You are a Twitter growth expert. Write viral, engaging threads. Each tweet must stand alone but connect to the narrative.');

    const tweets = text.split('\n')
      .filter(line => /^\d+\/\d+/.test(line.trim()) || line.trim().match(/^tweet \d+/i))
      .map(line => line.replace(/^\d+\/\d+:?\s*/, '').replace(/^tweet \d+:?\s*/i, '').trim())
      .filter(Boolean);

    // If parsing fails, split by numbered lines differently
    const allLines = text.split('\n').filter(l => l.trim());
    const parsedTweets = tweets.length >= 3 ? tweets : allLines.filter(l => l.length > 10 && l.length < 320);

    renderThreadResults(outputArea, topic, parsedTweets.slice(0, count));
    App.addToLibrary({ type: 'social', title: `Thread: ${topic}`, content: parsedTweets.join('\n\n') });
    showToast(`${parsedTweets.length}-tweet thread created!`, 'success');
  } catch (err) {
    if (outputArea) {
      outputArea.innerHTML = `<div class="card"><div class="output-area"><div class="output-placeholder" style="color:var(--accent-rose)">⚠️ ${err.message || 'Add API key to generate threads'}</div></div></div>`;
    }
    showToast(err.message || 'Failed', 'error');
  }
};

function renderThreadResults(container, topic, tweets) {
  if (!container) return;
  container.innerHTML = `
    <div class="card" style="border-left:3px solid #000">
      <div class="card-header" style="margin-bottom:12px">
        <div class="flex items-center gap-2">
          <span style="font-size:20px">🐦</span>
          <span class="card-title">Twitter Thread: ${escHtml(topic)}</span>
          <span class="badge badge-accent">${tweets.length} tweets</span>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="copyThread()">📋 Copy All</button>
          <button class="btn btn-ghost btn-sm" onclick="downloadThread('${escHtml(topic)}')">⬇️</button>
        </div>
      </div>
      <div id="threadTweets" style="display:flex;flex-direction:column;gap:10px">
        ${tweets.map((tweet, i) => `
          <div class="card" style="padding:14px;background:var(--bg-elevated)">
            <div class="flex justify-between items-start gap-2">
              <div>
                <div class="text-xs text-muted mb-1">${i + 1}/${tweets.length}</div>
                <div class="text-sm" style="line-height:1.7;white-space:pre-wrap">${escHtml(tweet)}</div>
                <div class="text-xs text-muted mt-1">${tweet.length}/280 chars</div>
              </div>
              <button class="icon-btn" onclick="copyText(\`${escHtml(tweet)}\`)">📋</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  window._lastThread = tweets;
}

window.copyThread = function() {
  const tweets = window._lastThread || [];
  const text = tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`).join('\n\n');
  copyText(text);
};

window.downloadThread = function(topic) {
  const tweets = window._lastThread || [];
  const text = tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`).join('\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thread-${(topic || 'thread').toLowerCase().replace(/\s+/g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Thread downloaded!', 'success');
};
