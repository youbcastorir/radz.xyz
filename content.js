/* ═══════════════════════════════════════════
   radz.xyz — content.js
   Article Generator & SEO Tools
   ═══════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Register view renderers (called lazily by app.js renderView)
  const origRender = window.renderView;
  window.renderView = function(view) {
    if (view === 'article') {
      const el = document.getElementById('view-article');
      if (el && !el._rendered) { renderArticleView(el); el._rendered = true; }
      return;
    }
    if (view === 'seo') {
      const el = document.getElementById('view-seo');
      if (el && !el._rendered) { renderSEOView(el); el._rendered = true; }
      return;
    }
    origRender(view);
  };
});

// ══════════════════════════════════════════
// ARTICLE GENERATOR
// ══════════════════════════════════════════

function renderArticleView(el) {
  el.innerHTML = `
    <div class="grid-2" style="gap:24px;align-items:start">

      <!-- LEFT: Controls -->
      <div>
        <div class="section-header">
          <div class="section-title">✍️ Article Generator</div>
          <div class="section-desc">AI-powered articles for any purpose and platform</div>
        </div>

        <div class="card">
          <div class="tabs" id="articleTypeTabs">
            <button class="tab active" data-type="blog">Blog</button>
            <button class="tab" data-type="seo">SEO</button>
            <button class="tab" data-type="product">Product</button>
            <button class="tab" data-type="marketing">Marketing</button>
            <button class="tab" data-type="news">News</button>
          </div>

          <div class="form-group">
            <label class="form-label">Topic / Title</label>
            <input type="text" class="form-input" id="articleTopic"
              placeholder="e.g. 10 Tips for Remote Work Productivity" />
          </div>

          <div class="form-group">
            <label class="form-label">Target Audience</label>
            <input type="text" class="form-input" id="articleAudience"
              placeholder="e.g. Startup founders, marketing professionals" />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Tone</label>
              <select class="form-select" id="articleTone">
                <option value="professional">Professional</option>
                <option value="conversational">Conversational</option>
                <option value="authoritative">Authoritative</option>
                <option value="friendly">Friendly</option>
                <option value="humorous">Humorous</option>
                <option value="formal">Formal</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Language</label>
              <select class="form-select" id="articleLang">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Italian">Italian</option>
                <option value="Dutch">Dutch</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Length</label>
              <select class="form-select" id="articleLength">
                <option value="short">Short (~300 words)</option>
                <option value="medium" selected>Medium (~600 words)</option>
                <option value="long">Long (~1000 words)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Include Sections</label>
              <select class="form-select" id="articleSections">
                <option value="standard">Standard</option>
                <option value="with-faq">With FAQ</option>
                <option value="with-tips">With Tips List</option>
                <option value="with-conclusion">Strong Conclusion</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Keywords (comma separated)</label>
            <input type="text" class="form-input" id="articleKeywords"
              placeholder="e.g. productivity, remote work, tools" />
          </div>

          <div class="form-group">
            <label class="form-label">Additional Instructions (optional)</label>
            <textarea class="form-textarea" id="articleInstructions" rows="2"
              placeholder="e.g. Include statistics, mention competitors, focus on benefits..."></textarea>
          </div>

          <button class="btn btn-primary btn-full" id="generateArticleBtn" onclick="generateArticle()">
            ✨ Generate Article
          </button>
        </div>

        <!-- Templates -->
        <div class="card mt-4">
          <div class="card-title mb-3">📋 Quick Templates</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${articleTemplates().map(t => `
              <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;text-align:left"
                onclick="loadArticleTemplate(${JSON.stringify(t).replace(/"/g,'&quot;')})">
                ${t.icon} ${t.name}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- RIGHT: Output -->
      <div>
        <div class="card">
          <div class="card-header">
            <span class="card-title">Generated Article</span>
            <div class="flex gap-2">
              <span class="badge badge-accent" id="articleWordCount">0 words</span>
            </div>
          </div>

          <div class="output-area" id="articleOutput">
            <div class="output-placeholder">Your article will appear here. Fill in the topic and click Generate.</div>
          </div>

          <div class="output-actions" id="articleActions" style="display:none">
            <button class="btn btn-outline btn-sm btn-copy" onclick="copyArticle(this)">📋 Copy</button>
            <button class="btn btn-outline btn-sm" onclick="downloadArticle()">⬇️ Download .md</button>
            <button class="btn btn-outline btn-sm" onclick="downloadArticleHtml()">⬇️ Download .html</button>
            <button class="btn btn-ghost btn-sm" onclick="saveArticle()">💾 Save</button>
            <button class="btn btn-ghost btn-sm" onclick="regenerateArticle()">🔄 Regenerate</button>
          </div>
        </div>

        <!-- Meta Output -->
        <div class="card mt-4" id="articleMetaCard" style="display:none">
          <div class="card-title mb-3">🔍 SEO Meta (auto-generated)</div>
          <div class="form-group">
            <label class="form-label">Meta Title</label>
            <input type="text" class="form-input" id="metaTitle" readonly />
          </div>
          <div class="form-group">
            <label class="form-label">Meta Description</label>
            <textarea class="form-textarea" id="metaDesc" rows="2" readonly></textarea>
          </div>
          <div id="suggestedTags" class="keyword-list"></div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  document.getElementById('articleTypeTabs')?.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#articleTypeTabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

let lastArticleContent = '';

window.generateArticle = async function() {
  const topic = document.getElementById('articleTopic')?.value?.trim();
  if (!topic) { showToast('Please enter a topic first', 'error'); return; }

  const type = document.querySelector('#articleTypeTabs .tab.active')?.dataset?.type || 'blog';
  const audience = document.getElementById('articleAudience')?.value || 'general readers';
  const tone = document.getElementById('articleTone')?.value || 'professional';
  const lang = document.getElementById('articleLang')?.value || 'English';
  const length = document.getElementById('articleLength')?.value || 'medium';
  const sections = document.getElementById('articleSections')?.value || 'standard';
  const keywords = document.getElementById('articleKeywords')?.value || '';
  const instructions = document.getElementById('articleInstructions')?.value || '';

  const lengthMap = { short: 300, medium: 600, long: 1000 };
  const wordCount = lengthMap[length] || 600;

  const typePrompts = {
    blog: 'an engaging blog post',
    seo: 'an SEO-optimized article with natural keyword integration',
    product: 'a compelling product description and review-style article',
    marketing: 'persuasive marketing copy and content',
    news: 'a news-style article with journalistic structure',
  };

  const prompt = `Write ${typePrompts[type] || 'an article'} in ${lang}.

Topic: ${topic}
Target audience: ${audience}
Tone: ${tone}
Target length: approximately ${wordCount} words
Format: ${sections}
${keywords ? `Keywords to include: ${keywords}` : ''}
${instructions ? `Additional instructions: ${instructions}` : ''}

Structure the article with:
- A compelling headline (H1)
- An engaging introduction
- Well-organized body sections with subheadings (H2/H3)
- ${sections === 'with-faq' ? 'An FAQ section' : sections === 'with-tips' ? 'A numbered tips/key takeaways list' : 'A strong conclusion'}

Write in ${tone} tone targeting ${audience}. Make it genuinely useful and informative.`;

  const btn = document.getElementById('generateArticleBtn');
  const output = document.getElementById('articleOutput');
  if (!btn || !output) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating...';
  output.innerHTML = '<div class="output-placeholder">✨ Writing your article<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>';

  try {
    const text = await callAI(prompt, 'You are an expert content writer. Write high-quality, well-structured articles. Use Markdown formatting with # for H1, ## for H2 etc. Never add preamble like "Here is your article" — start directly with the content.');

    lastArticleContent = text;
    output.textContent = text;

    // Word count
    const wc = text.split(/\s+/).filter(Boolean).length;
    const wcEl = document.getElementById('articleWordCount');
    if (wcEl) wcEl.textContent = `${wc} words`;

    // Show actions
    document.getElementById('articleActions').style.display = 'flex';

    // Generate meta
    generateArticleMeta(topic, text, keywords);

    App.addToLibrary({ type: 'article', title: topic, content: text });
    showToast('Article generated!', 'success');
  } catch (err) {
    output.innerHTML = `<div class="output-placeholder" style="color:var(--accent-rose)">⚠️ ${err.message || 'Generation failed. Check your API key.'}</div>`;
    showToast(err.message || 'Generation failed', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✨ Generate Article';
  }
};

function generateArticleMeta(topic, content, keywords) {
  const card = document.getElementById('articleMetaCard');
  const titleEl = document.getElementById('metaTitle');
  const descEl = document.getElementById('metaDesc');
  const tagsEl = document.getElementById('suggestedTags');

  if (!card) return;
  card.style.display = 'block';

  // Simple meta generation from content
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  const metaTitle = topic.length <= 60 ? topic : topic.substring(0, 57) + '...';
  const metaDesc = sentences[0]?.trim().substring(0, 155) + '...' || topic;

  if (titleEl) titleEl.value = metaTitle;
  if (descEl) descEl.value = metaDesc;

  // Keyword tags
  const kws = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) :
    topic.split(' ').filter(w => w.length > 3).slice(0, 6);

  if (tagsEl) {
    tagsEl.innerHTML = kws.map(k =>
      `<span class="keyword-tag" onclick="copyText('${escHtml(k)}')">#${escHtml(k)}</span>`
    ).join('');
  }
}

window.copyArticle = function(btn) {
  copyText(lastArticleContent, btn);
};

window.downloadArticle = function() {
  if (!lastArticleContent) return;
  const topic = document.getElementById('articleTopic')?.value || 'article';
  const blob = new Blob([lastArticleContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Markdown downloaded!', 'success');
};

window.downloadArticleHtml = function() {
  if (!lastArticleContent) return;
  const topic = document.getElementById('articleTopic')?.value || 'article';
  // Basic markdown to HTML conversion
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${escHtml(topic)}</title>
<style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 20px;line-height:1.8;color:#1a1a1a}h1,h2,h3{font-weight:700}h1{font-size:2em}h2{font-size:1.4em;margin-top:2em}</style>
</head><body>
${lastArticleContent
  .replace(/^# (.+)$/gm, '<h1>$1</h1>')
  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/^- (.+)$/gm, '<li>$1</li>')
  .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^(?!<[hul])/gm, '')
}
</body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}.html`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('HTML downloaded!', 'success');
};

window.saveArticle = function() {
  if (!lastArticleContent) { showToast('Generate an article first', 'error'); return; }
  const topic = document.getElementById('articleTopic')?.value || 'Untitled Article';
  App.addToLibrary({ type: 'article', title: topic, content: lastArticleContent });
  showToast('Saved to library!', 'success');
};

window.regenerateArticle = function() {
  window.generateArticle();
};

function articleTemplates() {
  return [
    { name: 'Product Review', icon: '⭐', type: 'product', topic: 'Product Review: [Product Name]', tone: 'professional', length: 'medium' },
    { name: 'How-To Guide', icon: '📖', type: 'blog', topic: 'How to [Accomplish Goal]', tone: 'friendly', length: 'long' },
    { name: 'Listicle (10 Tips)', icon: '📋', type: 'blog', topic: '10 Tips for [Topic]', tone: 'conversational', length: 'medium' },
    { name: 'SEO Landing Page', icon: '🎯', type: 'seo', topic: 'Best [Service/Product] for [Audience]', tone: 'authoritative', length: 'long' },
    { name: 'Press Release', icon: '📰', type: 'news', topic: '[Company] Announces [News]', tone: 'formal', length: 'short' },
    { name: 'Email Newsletter', icon: '📧', type: 'marketing', topic: 'Monthly Update: [Topic]', tone: 'friendly', length: 'short' },
  ];
}

window.loadArticleTemplate = function(t) {
  const topicEl = document.getElementById('articleTopic');
  const toneEl = document.getElementById('articleTone');
  const lengthEl = document.getElementById('articleLength');

  if (topicEl) topicEl.value = t.topic;
  if (toneEl) toneEl.value = t.tone;
  if (lengthEl) lengthEl.value = t.length;

  // Set tab
  document.querySelectorAll('#articleTypeTabs .tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.type === t.type) tab.classList.add('active');
  });
  showToast(`Template loaded: ${t.name}`, 'success');
};

// ══════════════════════════════════════════
// SEO TOOLS
// ══════════════════════════════════════════

function renderSEOView(el) {
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">🔍 SEO Tools</div>
      <div class="section-desc">Optimize your content for search engines</div>
    </div>

    <div class="tabs" id="seoTabs">
      <button class="tab active" data-seo="analyzer">Content Analyzer</button>
      <button class="tab" data-seo="meta">Meta Generator</button>
      <button class="tab" data-seo="keywords">Keyword Research</button>
      <button class="tab" data-seo="hashtags">Hashtag Generator</button>
    </div>

    <div id="seoContent"></div>
  `;

  document.getElementById('seoTabs')?.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#seoTabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderSEOSection(tab.dataset.seo);
    });
  });

  renderSEOSection('analyzer');
}

function renderSEOSection(section) {
  const el = document.getElementById('seoContent');
  if (!el) return;

  const sections = {
    analyzer: renderSEOAnalyzer,
    meta: renderMetaGenerator,
    keywords: renderKeywordResearch,
    hashtags: renderHashtagGenerator,
  };

  (sections[section] || renderSEOAnalyzer)(el);
}

function renderSEOAnalyzer(el) {
  el.innerHTML = `
    <div class="grid-2" style="gap:24px;align-items:start">
      <div class="card">
        <div class="card-title mb-3">Paste Your Content</div>
        <div class="form-group">
          <label class="form-label">Target Keyword</label>
          <input type="text" class="form-input" id="seoKeyword" placeholder="e.g. remote work productivity" />
        </div>
        <div class="form-group">
          <label class="form-label">Content to Analyze</label>
          <textarea class="form-textarea" id="seoContent" rows="8"
            placeholder="Paste your article or content here to get SEO analysis..."></textarea>
        </div>
        <button class="btn btn-primary btn-full" onclick="analyzeSEO()">🔍 Analyze SEO</button>
      </div>

      <div>
        <div class="card mb-4" id="seoScoreCard" style="display:none">
          <div class="card-title mb-3">SEO Score</div>
          <div class="flex items-center gap-4 mb-4">
            <div class="seo-score-ring">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle class="seo-score-bg" cx="40" cy="40" r="35"/>
                <circle class="seo-score-fill" id="seoScoreCircle" cx="40" cy="40" r="35"/>
              </svg>
              <div class="seo-score-num" id="seoScoreNum">0</div>
            </div>
            <div>
              <div id="seoScoreLabel" style="font-size:15px;font-weight:600;margin-bottom:4px"></div>
              <div class="text-sm text-muted">Based on keyword usage, structure & readability</div>
            </div>
          </div>
          <div id="seoChecklist"></div>
        </div>

        <div class="card" id="seoSuggestCard" style="display:none">
          <div class="card-title mb-3">💡 AI Suggestions</div>
          <div id="seoSuggestions" class="text-sm" style="line-height:1.8;color:var(--text-secondary)"></div>
        </div>
      </div>
    </div>
  `;
}

window.analyzeSEO = async function() {
  const keyword = document.getElementById('seoKeyword')?.value?.trim();
  const content = document.getElementById('seoContent')?.value?.trim();
  if (!content) { showToast('Please enter content to analyze', 'error'); return; }

  // Local scoring
  const wc = content.split(/\s+/).length;
  const kwCount = keyword ? (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
  const hasH1 = /^#\s/.test(content) || content.includes('<h1');
  const hasH2 = /^##\s/m.test(content) || content.includes('<h2');
  const density = wc > 0 ? ((kwCount / wc) * 100).toFixed(1) : 0;

  let score = 0;
  const checks = [
    { label: 'Word count 300+', pass: wc >= 300, note: `${wc} words` },
    { label: 'Has H1 heading', pass: hasH1 },
    { label: 'Has H2 subheadings', pass: hasH2 },
    { label: 'Keyword present', pass: kwCount > 0, note: `${kwCount} occurrences` },
    { label: 'Keyword density 0.5–3%', pass: density >= 0.5 && density <= 3, note: `${density}%` },
    { label: 'Content length 600+', pass: wc >= 600, note: `${wc} words` },
    { label: 'Has paragraphs', pass: content.split('\n\n').length >= 3 },
    { label: 'No keyword stuffing (<3%)', pass: density < 3 },
  ];

  score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);

  const scoreCard = document.getElementById('seoScoreCard');
  const scoreNum = document.getElementById('seoScoreNum');
  const scoreLabel = document.getElementById('seoScoreLabel');
  const scoreCircle = document.getElementById('seoScoreCircle');
  const checklist = document.getElementById('seoChecklist');

  if (scoreCard) scoreCard.style.display = 'block';
  if (scoreNum) scoreNum.textContent = score;

  const circumference = 2 * Math.PI * 35;
  if (scoreCircle) {
    scoreCircle.style.strokeDasharray = circumference;
    scoreCircle.style.strokeDashoffset = circumference - (score / 100) * circumference;
    scoreCircle.style.stroke = score >= 70 ? 'var(--accent-3)' : score >= 40 ? 'var(--accent-warm)' : 'var(--accent-rose)';
  }

  if (scoreLabel) {
    scoreLabel.textContent = score >= 70 ? '🟢 Good SEO' : score >= 40 ? '🟡 Needs Work' : '🔴 Poor SEO';
    scoreLabel.style.color = score >= 70 ? 'var(--accent-3)' : score >= 40 ? 'var(--accent-warm)' : 'var(--accent-rose)';
  }

  if (checklist) {
    checklist.innerHTML = checks.map(c => `
      <div class="flex items-center gap-2 mb-2">
        <span style="color:${c.pass ? 'var(--accent-3)' : 'var(--accent-rose)'};font-size:12px">${c.pass ? '✓' : '✕'}</span>
        <span class="text-sm" style="color:${c.pass ? 'var(--text-secondary)' : 'var(--text-muted)'}">${c.label}</span>
        ${c.note ? `<span class="text-xs text-muted">(${c.note})</span>` : ''}
      </div>
    `).join('');
  }

  App.addToLibrary({ type: 'seo', title: keyword || 'SEO Analysis', content: JSON.stringify({ score, checks }) });

  // AI suggestions if key available
  if (App.apiKey && content.length > 50) {
    const suggestCard = document.getElementById('seoSuggestCard');
    const suggestions = document.getElementById('seoSuggestions');
    if (suggestCard) suggestCard.style.display = 'block';
    if (suggestions) suggestions.textContent = 'Generating AI suggestions...';

    try {
      const prompt = `Analyze this content for SEO and give 3-5 specific, actionable suggestions to improve it.
Keyword: "${keyword || 'not specified'}"
Content (first 800 chars): ${content.substring(0, 800)}
SEO Score: ${score}/100
Be concise and practical. Use bullet points.`;
      const aiSugg = await callAI(prompt, 'You are an SEO expert. Give practical, specific advice.');
      if (suggestions) suggestions.textContent = aiSugg;
    } catch {
      if (suggestions) suggestions.textContent = 'Connect your API key for AI-powered suggestions.';
    }
  }

  showToast(`SEO Score: ${score}/100`, score >= 70 ? 'success' : 'info');
};

function renderMetaGenerator(el) {
  el.innerHTML = `
    <div class="grid-2" style="gap:24px;align-items:start">
      <div class="card">
        <div class="card-title mb-3">Generate Meta Tags</div>
        <div class="form-group">
          <label class="form-label">Page Topic / Title</label>
          <input type="text" class="form-input" id="metaPageTitle" placeholder="e.g. Best Productivity Apps for Remote Workers" />
        </div>
        <div class="form-group">
          <label class="form-label">Main Keywords</label>
          <input type="text" class="form-input" id="metaPageKeywords" placeholder="e.g. productivity, apps, remote work" />
        </div>
        <div class="form-group">
          <label class="form-label">Website/Brand Name</label>
          <input type="text" class="form-input" id="metaBrand" placeholder="e.g. MyWebsite.com" />
        </div>
        <button class="btn btn-primary btn-full" onclick="generateMeta()">Generate Meta Tags</button>
      </div>

      <div class="card" id="metaOutput" style="display:none">
        <div class="card-title mb-3">Generated Meta Tags</div>
        <div id="metaResults"></div>
      </div>
    </div>
  `;
}

window.generateMeta = async function() {
  const title = document.getElementById('metaPageTitle')?.value?.trim();
  if (!title) { showToast('Enter a page title', 'error'); return; }
  const keywords = document.getElementById('metaPageKeywords')?.value || '';
  const brand = document.getElementById('metaBrand')?.value || '';

  const outputCard = document.getElementById('metaOutput');
  const results = document.getElementById('metaResults');
  if (outputCard) outputCard.style.display = 'block';
  if (results) results.innerHTML = '<div class="spinner"></div>';

  const metaTitle = brand ? `${title} | ${brand}` : title;
  const truncTitle = metaTitle.length > 60 ? metaTitle.substring(0, 57) + '...' : metaTitle;

  let metaDesc = `Discover the best ${title.toLowerCase()}. ${keywords ? 'Learn about ' + keywords.split(',')[0]?.trim() + ' and more.' : 'Read our comprehensive guide.'}`;
  metaDesc = metaDesc.substring(0, 155) + '...';

  const kwArray = keywords.split(',').map(k => k.trim()).filter(Boolean);

  const html = `
    <div class="form-group">
      <div class="flex justify-between mb-1">
        <label class="form-label">Meta Title (${truncTitle.length}/60)</label>
        <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escHtml(truncTitle)}\`)">📋</button>
      </div>
      <input type="text" class="form-input" value="${escHtml(truncTitle)}" readonly />
    </div>
    <div class="form-group">
      <div class="flex justify-between mb-1">
        <label class="form-label">Meta Description (${metaDesc.length}/160)</label>
        <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escHtml(metaDesc)}\`)">📋</button>
      </div>
      <textarea class="form-textarea" rows="3" readonly>${escHtml(metaDesc)}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">HTML Code</label>
      <textarea class="form-textarea" rows="4" readonly style="font-family:monospace;font-size:12px">&lt;title&gt;${escHtml(truncTitle)}&lt;/title&gt;
&lt;meta name="description" content="${escHtml(metaDesc)}"&gt;
&lt;meta name="keywords" content="${escHtml(keywords)}"&gt;
&lt;meta property="og:title" content="${escHtml(truncTitle)}"&gt;
&lt;meta property="og:description" content="${escHtml(metaDesc)}"&gt;</textarea>
    </div>
    ${kwArray.length ? `<div><label class="form-label">Suggested Keywords</label><div class="keyword-list">${kwArray.map(k => `<span class="keyword-tag">${escHtml(k)}</span>`).join('')}</div></div>` : ''}
    <button class="btn btn-outline btn-sm mt-3" onclick="copyText(document.querySelector('#metaResults textarea:last-of-type')?.value||'')">📋 Copy HTML</button>
  `;

  if (results) results.innerHTML = html;
  App.addToLibrary({ type: 'seo', title: `Meta: ${title}`, content: truncTitle + '\n' + metaDesc });
  showToast('Meta tags generated!', 'success');
};

function renderKeywordResearch(el) {
  el.innerHTML = `
    <div class="grid-2" style="gap:24px;align-items:start">
      <div class="card">
        <div class="card-title mb-3">Keyword Research</div>
        <div class="form-group">
          <label class="form-label">Seed Keyword or Topic</label>
          <input type="text" class="form-input" id="seedKeyword" placeholder="e.g. content marketing" />
        </div>
        <div class="form-group">
          <label class="form-label">Industry / Niche</label>
          <input type="text" class="form-input" id="keywordNiche" placeholder="e.g. digital marketing, SaaS, ecommerce" />
        </div>
        <div class="form-group">
          <label class="form-label">Intent Type</label>
          <select class="form-select" id="keywordIntent">
            <option>All intents</option>
            <option>Informational</option>
            <option>Commercial</option>
            <option>Transactional</option>
            <option>Navigational</option>
          </select>
        </div>
        <button class="btn btn-primary btn-full" onclick="researchKeywords()">🔍 Research Keywords</button>
      </div>

      <div class="card" id="keywordResults" style="display:none">
        <div class="card-title mb-3">Keyword Suggestions</div>
        <div id="keywordList"></div>
      </div>
    </div>
  `;
}

window.researchKeywords = async function() {
  const seed = document.getElementById('seedKeyword')?.value?.trim();
  if (!seed) { showToast('Enter a seed keyword', 'error'); return; }
  const niche = document.getElementById('keywordNiche')?.value || '';
  const intent = document.getElementById('keywordIntent')?.value || 'All intents';

  const card = document.getElementById('keywordResults');
  const list = document.getElementById('keywordList');
  if (card) card.style.display = 'block';
  if (list) list.innerHTML = '<div class="flex items-center gap-2"><div class="spinner"></div><span class="text-sm text-muted">Researching keywords...</span></div>';

  try {
    const prompt = `Generate 20 SEO keyword suggestions for:
Seed keyword: "${seed}"
Niche: "${niche || 'general'}"
Intent: ${intent}

For each keyword provide:
- The keyword phrase
- Search intent (Info/Commercial/Trans/Nav)
- Difficulty (Low/Med/High)
- A brief reason why it's valuable

Format as a JSON array: [{"keyword":"...","intent":"...","difficulty":"...","reason":"..."}]
Return ONLY the JSON array, no other text.`;

    const response = await callAI(prompt, 'You are an SEO keyword research expert. Return only valid JSON.');
    let keywords = [];
    try {
      const clean = response.replace(/```json|```/g, '').trim();
      keywords = JSON.parse(clean);
    } catch {
      keywords = seed.split(' ').flatMap(w => [
        { keyword: `best ${w}`, intent: 'Commercial', difficulty: 'Med', reason: 'High buyer intent' },
        { keyword: `how to use ${w}`, intent: 'Info', difficulty: 'Low', reason: 'Informational traffic' },
        { keyword: `${w} guide`, intent: 'Info', difficulty: 'Low', reason: 'Evergreen content' },
      ]);
    }

    if (list) {
      list.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:6px">
          ${keywords.slice(0, 20).map(k => `
            <div class="history-item" style="cursor:default">
              <div class="history-content">
                <div class="history-title">${escHtml(k.keyword)}</div>
                <div class="history-meta">${k.reason || ''}</div>
              </div>
              <div class="flex gap-2 items-center">
                <span class="badge ${k.intent==='Commercial'?'badge-accent':k.intent==='Info'?'badge-green':'badge-amber'}">${k.intent}</span>
                <span class="badge ${k.difficulty==='Low'?'badge-green':k.difficulty==='High'?'badge-rose':'badge-amber'}">${k.difficulty}</span>
                <button class="icon-btn" onclick="copyText('${escHtml(k.keyword)}')">📋</button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    App.addToLibrary({ type: 'seo', title: `Keywords: ${seed}`, content: keywords.map(k => k.keyword).join(', ') });
    showToast('Keywords generated!', 'success');
  } catch (err) {
    if (list) list.textContent = 'Add your API key to generate AI-powered keyword suggestions.';
    showToast(err.message || 'Failed', 'error');
  }
};

function renderHashtagGenerator(el) {
  el.innerHTML = `
    <div class="grid-2" style="gap:24px;align-items:start">
      <div class="card">
        <div class="card-title mb-3">Hashtag Generator</div>
        <div class="form-group">
          <label class="form-label">Topic or Post Content</label>
          <textarea class="form-textarea" id="hashtagTopic" rows="4"
            placeholder="Describe your post or paste the content..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Platform</label>
          <select class="form-select" id="hashtagPlatform">
            <option>Instagram</option>
            <option>Twitter/X</option>
            <option>TikTok</option>
            <option>LinkedIn</option>
            <option>YouTube</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Number of Hashtags</label>
          <select class="form-select" id="hashtagCount">
            <option value="10">10 hashtags</option>
            <option value="20">20 hashtags</option>
            <option value="30" selected>30 hashtags</option>
          </select>
        </div>
        <button class="btn btn-primary btn-full" onclick="generateHashtags()">Generate Hashtags</button>
      </div>

      <div class="card" id="hashtagOutput" style="display:none">
        <div class="card-header">
          <span class="card-title">Generated Hashtags</span>
          <button class="btn btn-outline btn-sm" onclick="copyHashtags()">📋 Copy All</button>
        </div>
        <div id="hashtagList" class="keyword-list"></div>
      </div>
    </div>
  `;
}

let lastHashtags = [];

window.generateHashtags = async function() {
  const topic = document.getElementById('hashtagTopic')?.value?.trim();
  if (!topic) { showToast('Enter a topic', 'error'); return; }
  const platform = document.getElementById('hashtagPlatform')?.value || 'Instagram';
  const count = document.getElementById('hashtagCount')?.value || '30';

  const card = document.getElementById('hashtagOutput');
  const list = document.getElementById('hashtagList');
  if (card) card.style.display = 'block';
  if (list) list.innerHTML = '<div class="spinner"></div>';

  try {
    const prompt = `Generate ${count} relevant hashtags for ${platform} based on this topic/content:
"${topic}"

Mix of:
- 30% broad/popular hashtags (millions of posts)
- 40% medium hashtags (100k-1M posts)
- 30% niche/specific hashtags (under 100k posts)

Return ONLY the hashtags, one per line, with # symbol. No other text.`;

    const response = await callAI(prompt, 'Generate hashtags only. One per line. Start each with #.');
    const tags = response.split('\n').map(t => t.trim()).filter(t => t.startsWith('#'));
    lastHashtags = tags;

    if (list) {
      list.innerHTML = tags.map(tag =>
        `<span class="keyword-tag" onclick="copyText('${escHtml(tag)}')">${escHtml(tag)}</span>`
      ).join('');
    }
    App.addToLibrary({ type: 'seo', title: `Hashtags: ${platform}`, content: tags.join(' ') });
    showToast(`${tags.length} hashtags generated!`, 'success');
  } catch (err) {
    // Fallback: generate from topic words
    const words = topic.split(/\s+/).filter(w => w.length > 2);
    const fallback = words.flatMap(w => [`#${w}`, `#${w}Tips`, `#${w}Life`]).slice(0, 20);
    lastHashtags = fallback;
    if (list) {
      list.innerHTML = fallback.map(tag =>
        `<span class="keyword-tag" onclick="copyText('${escHtml(tag)}')">${escHtml(tag)}</span>`
      ).join('');
    }
    showToast('Basic hashtags generated (add API key for AI-powered results)', 'info');
  }
};

window.copyHashtags = function() {
  copyText(lastHashtags.join(' '));
};
