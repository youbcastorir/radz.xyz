/* ═══════════════════════════════════════════
   radz.xyz — image-generator.js
   AI Image Prompt Generator
   ═══════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const origRender = window.renderView;
  window.renderView = function(view) {
    if (view === 'image') {
      const el = document.getElementById('view-image');
      if (el && !el._rendered) { renderImageView(el); el._rendered = true; }
      return;
    }
    origRender(view);
  };
});

// ══════════════════════════════════════════
// IMAGE PROMPT GENERATOR
// ══════════════════════════════════════════

function renderImageView(el) {
  el.innerHTML = `
    <div class="section-header">
      <div class="section-title">🖼️ Image Prompt Generator</div>
      <div class="section-desc">Create detailed AI image prompts for Midjourney, DALL·E, Stable Diffusion & more</div>
    </div>

    <div class="tabs" id="imageTypeTabs">
      <button class="tab active" data-img="general">General</button>
      <button class="tab" data-img="social">Social Media</button>
      <button class="tab" data-img="blog">Blog Illustration</button>
      <button class="tab" data-img="thumbnail">Thumbnail</button>
      <button class="tab" data-img="banner">Marketing Banner</button>
    </div>

    <div class="grid-2" style="gap:24px;align-items:start">

      <!-- LEFT: Controls -->
      <div>
        <div class="card mb-4">
          <div class="card-title mb-3">Image Details</div>

          <div class="form-group">
            <label class="form-label">Subject / Scene Description</label>
            <textarea class="form-textarea" id="imgSubject" rows="3"
              placeholder="e.g. A futuristic workspace with holographic screens, minimalist design, cool blue lighting"></textarea>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Art Style</label>
              <select class="form-select" id="imgStyle">
                <option value="photorealistic">Photorealistic</option>
                <option value="digital art">Digital Art</option>
                <option value="illustration">Illustration</option>
                <option value="oil painting">Oil Painting</option>
                <option value="watercolor">Watercolor</option>
                <option value="minimalist">Minimalist</option>
                <option value="flat design">Flat Design</option>
                <option value="3D render">3D Render</option>
                <option value="cinematic">Cinematic</option>
                <option value="anime">Anime</option>
                <option value="concept art">Concept Art</option>
                <option value="vintage">Vintage/Retro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Mood / Atmosphere</label>
              <select class="form-select" id="imgMood">
                <option value="professional">Professional</option>
                <option value="vibrant and energetic">Vibrant & Energetic</option>
                <option value="calm and serene">Calm & Serene</option>
                <option value="dramatic and intense">Dramatic & Intense</option>
                <option value="warm and cozy">Warm & Cozy</option>
                <option value="dark and mysterious">Dark & Mysterious</option>
                <option value="futuristic">Futuristic</option>
                <option value="playful and fun">Playful & Fun</option>
                <option value="luxurious">Luxurious</option>
                <option value="minimalist clean">Minimalist Clean</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Color Palette</label>
              <select class="form-select" id="imgColors">
                <option value="natural">Natural</option>
                <option value="blue and white">Blue & White</option>
                <option value="dark purple and gold">Purple & Gold</option>
                <option value="warm orange and red">Warm Orange & Red</option>
                <option value="green and earth tones">Green & Earth</option>
                <option value="black and white">Black & White</option>
                <option value="pastel soft tones">Pastel Soft</option>
                <option value="neon cyberpunk">Neon Cyberpunk</option>
                <option value="monochromatic">Monochromatic</option>
                <option value="custom">Custom...</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Aspect Ratio</label>
              <select class="form-select" id="imgRatio">
                <option value="1:1 square format">1:1 Square</option>
                <option value="16:9 landscape widescreen">16:9 Landscape</option>
                <option value="9:16 portrait vertical">9:16 Portrait</option>
                <option value="4:3 standard">4:3 Standard</option>
                <option value="3:2 photography">3:2 Photo</option>
                <option value="21:9 ultrawide cinematic">21:9 Ultrawide</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">AI Tool Target</label>
            <select class="form-select" id="imgTool">
              <option value="Midjourney">Midjourney</option>
              <option value="DALL-E 3">DALL·E 3</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
              <option value="Adobe Firefly">Adobe Firefly</option>
              <option value="Leonardo AI">Leonardo AI</option>
              <option value="Ideogram">Ideogram</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Negative Prompts (things to avoid)</label>
            <input type="text" class="form-input" id="imgNegative"
              placeholder="e.g. blurry, low quality, text, watermark" />
          </div>

          <button class="btn btn-primary btn-full" id="generateImgBtn" onclick="generateImagePrompt()">
            🎨 Generate Prompt
          </button>
        </div>

        <!-- Quick Style Presets -->
        <div class="card">
          <div class="card-title mb-3">⚡ Style Presets</div>
          <div class="grid-2">
            ${imagePresets().map(p => `
              <button class="quick-action" onclick="loadImagePreset(${JSON.stringify(p).replace(/"/g,'&quot;')})">
                <div class="quick-action-icon" style="background:${p.bg}">${p.icon}</div>
                <div class="quick-action-title">${p.name}</div>
                <div class="quick-action-desc">${p.desc}</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- RIGHT: Output -->
      <div>
        <div class="card mb-4">
          <div class="card-header">
            <span class="card-title">Generated Prompt</span>
            <span class="badge badge-accent" id="imgToolBadge">Midjourney</span>
          </div>

          <div class="output-area" id="imageOutput">
            <div class="output-placeholder">Your optimized image prompt will appear here. Describe what you want to create.</div>
          </div>

          <div class="output-actions" id="imageActions" style="display:none">
            <button class="btn btn-outline btn-sm" onclick="copyImagePrompt(this)">📋 Copy Prompt</button>
            <button class="btn btn-ghost btn-sm" onclick="saveImagePrompt()">💾 Save</button>
            <button class="btn btn-ghost btn-sm" onclick="generateImagePrompt()">🔄 Regenerate</button>
          </div>
        </div>

        <!-- Variations -->
        <div class="card mb-4" id="imgVariationsCard" style="display:none">
          <div class="card-title mb-3">🎲 Prompt Variations</div>
          <div id="imgVariations" style="display:flex;flex-direction:column;gap:8px"></div>
        </div>

        <!-- Tips -->
        <div class="card" id="imgTipsCard">
          <div class="card-title mb-3">💡 Prompting Tips</div>
          <div style="display:flex;flex-direction:column;gap:8px" id="imgTipsContent">
            ${promptingTips().map(t => `
              <div class="flex gap-2 items-center">
                <span style="color:var(--accent);font-size:14px">${t.icon}</span>
                <span class="text-sm" style="color:var(--text-secondary)">${t.tip}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  document.getElementById('imageTypeTabs')?.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#imageTypeTabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateImageTypeHints(tab.dataset.img);
    });
  });

  // Update badge on tool change
  document.getElementById('imgTool')?.addEventListener('change', function() {
    const badge = document.getElementById('imgToolBadge');
    if (badge) badge.textContent = this.value;
  });
}

let lastImagePrompt = '';

window.generateImagePrompt = async function() {
  const subject = document.getElementById('imgSubject')?.value?.trim();
  if (!subject) { showToast('Describe your image subject first', 'error'); return; }

  const style = document.getElementById('imgStyle')?.value || 'digital art';
  const mood = document.getElementById('imgMood')?.value || 'professional';
  const colors = document.getElementById('imgColors')?.value || 'natural';
  const ratio = document.getElementById('imgRatio')?.value || '1:1 square format';
  const tool = document.getElementById('imgTool')?.value || 'Midjourney';
  const negative = document.getElementById('imgNegative')?.value || '';
  const imgType = document.querySelector('#imageTypeTabs .tab.active')?.dataset?.img || 'general';

  const toolInstructions = {
    'Midjourney': 'Format for Midjourney: detailed prompt followed by --ar ratio --style raw --q 2. Use :: for weight emphasis.',
    'DALL-E 3': 'Format for DALL·E 3: natural language, describe details clearly, avoid restricted content terms.',
    'Stable Diffusion': 'Format for Stable Diffusion: comma-separated tags, include quality boosters like (masterpiece:1.2), (best quality:1.4). Add negative prompt separately.',
    'Adobe Firefly': 'Format for Adobe Firefly: descriptive natural language, emphasize style and composition.',
    'Leonardo AI': 'Format for Leonardo AI: detailed descriptive prompt with style tags.',
    'Ideogram': 'Format for Ideogram: clear description with style notes, good for text-in-image.',
  };

  const typeContext = {
    general: '',
    social: 'This is for a social media post. Make it eye-catching and platform-optimized.',
    blog: 'This is a blog header illustration. Should be professional and content-relevant.',
    thumbnail: 'This is a YouTube thumbnail. Should be bold, high contrast, and immediately attention-grabbing.',
    banner: 'This is a marketing banner. Should be professional, brand-consistent, and call-to-action oriented.',
  };

  const prompt = `Create an optimized image generation prompt for ${tool}.

Subject/Scene: ${subject}
Art Style: ${style}
Mood/Atmosphere: ${mood}
Color Palette: ${colors}
Aspect Ratio: ${ratio}
Image Type: ${imgType} ${typeContext[imgType] || ''}
${negative ? `Avoid: ${negative}` : ''}

${toolInstructions[tool] || ''}

Generate ONE highly detailed, professional prompt that will produce a stunning image. Include:
- Detailed visual description
- Lighting details
- Composition notes
- Technical quality markers
- Style references if appropriate

Also generate 2 shorter variation prompts.

Format your response as:
MAIN PROMPT:
[your main prompt here]

VARIATION 1:
[variation 1]

VARIATION 2:
[variation 2]`;

  const btn = document.getElementById('generateImgBtn');
  const output = document.getElementById('imageOutput');
  if (!btn || !output) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Crafting prompt...';
  output.innerHTML = '<div class="output-placeholder">🎨 Creating your image prompt<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span></div>';

  try {
    const text = await callAI(prompt, 'You are an expert AI image prompt engineer. Create vivid, detailed, effective prompts that produce stunning results. Follow the exact format requested.');

    // Parse sections
    const mainMatch = text.match(/MAIN PROMPT:\s*([\s\S]*?)(?=VARIATION|$)/i);
    const var1Match = text.match(/VARIATION 1:\s*([\s\S]*?)(?=VARIATION 2|$)/i);
    const var2Match = text.match(/VARIATION 2:\s*([\s\S]*?)$/i);

    const mainPrompt = mainMatch?.[1]?.trim() || text.split('\n')[0];
    const var1 = var1Match?.[1]?.trim();
    const var2 = var2Match?.[1]?.trim();

    lastImagePrompt = mainPrompt;
    output.textContent = mainPrompt;

    document.getElementById('imageActions').style.display = 'flex';
    const badge = document.getElementById('imgToolBadge');
    if (badge) badge.textContent = tool;

    // Show variations
    const varsCard = document.getElementById('imgVariationsCard');
    const varsList = document.getElementById('imgVariations');
    if (varsCard && varsList && (var1 || var2)) {
      varsCard.style.display = 'block';
      varsList.innerHTML = [var1, var2].filter(Boolean).map((v, i) => `
        <div class="card" style="padding:12px">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-muted">Variation ${i + 1}</span>
            <button class="btn btn-ghost btn-sm" onclick="copyText(\`${escHtml(v)}\`)">📋 Copy</button>
          </div>
          <div class="text-sm" style="color:var(--text-secondary);line-height:1.6">${escHtml(v)}</div>
        </div>
      `).join('');
    }

    App.addToLibrary({ type: 'image', title: subject.substring(0, 60), content: mainPrompt });
    showToast('Image prompt generated!', 'success');
  } catch (err) {
    // Fallback: generate basic prompt from inputs
    const fallback = buildFallbackPrompt(subject, style, mood, colors, ratio, tool);
    lastImagePrompt = fallback;
    output.textContent = fallback;
    document.getElementById('imageActions').style.display = 'flex';
    showToast('Basic prompt generated (add API key for AI-enhanced results)', 'info');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '🎨 Generate Prompt';
  }
};

function buildFallbackPrompt(subject, style, mood, colors, ratio, tool) {
  const quality = {
    'Midjourney': '--ar 16:9 --style raw --q 2 --v 6',
    'Stable Diffusion': ', (masterpiece:1.2), (best quality:1.4), 8k, highly detailed',
    'DALL-E 3': ', photorealistic, highly detailed, professional photography',
  };
  const base = `${subject}, ${style}, ${mood} atmosphere, ${colors} color palette, ${ratio}`;
  return base + (quality[tool] ? ' ' + quality[tool] : ', high quality, detailed, professional');
}

window.copyImagePrompt = function(btn) {
  copyText(lastImagePrompt, btn);
};

window.saveImagePrompt = function() {
  if (!lastImagePrompt) { showToast('Generate a prompt first', 'error'); return; }
  const subject = document.getElementById('imgSubject')?.value || 'Image Prompt';
  App.addToLibrary({ type: 'image', title: subject.substring(0, 60), content: lastImagePrompt });
  showToast('Saved to library!', 'success');
};

function updateImageTypeHints(type) {
  const hints = {
    social: 'Best for: Instagram posts, Facebook covers, Twitter headers',
    blog: 'Best for: Article headers, featured images, content illustrations',
    thumbnail: 'Best for: YouTube thumbnails, video covers',
    banner: 'Best for: Ads, email headers, landing page heroes',
    general: '',
  };
  // Could update a hint element if desired
}

window.loadImagePreset = function(preset) {
  const styleEl = document.getElementById('imgStyle');
  const moodEl = document.getElementById('imgMood');
  const colorsEl = document.getElementById('imgColors');
  const subjectEl = document.getElementById('imgSubject');

  if (styleEl) styleEl.value = preset.style;
  if (moodEl) moodEl.value = preset.mood;
  if (colorsEl) colorsEl.value = preset.colors;
  if (subjectEl && preset.subject) subjectEl.value = preset.subject;
  showToast(`Preset loaded: ${preset.name}`, 'success');
};

function imagePresets() {
  return [
    {
      name: 'Tech Blog',
      icon: '💻',
      desc: 'Clean tech illustrations',
      bg: 'rgba(99,102,241,0.12)',
      style: '3D render',
      mood: 'futuristic',
      colors: 'blue and white',
      subject: 'Abstract technology concept with geometric shapes and circuit patterns'
    },
    {
      name: 'Social Post',
      icon: '📱',
      desc: 'Eye-catching social content',
      bg: 'rgba(52,211,153,0.12)',
      style: 'flat design',
      mood: 'vibrant and energetic',
      colors: 'neon cyberpunk',
      subject: 'Colorful abstract social media post background with geometric elements'
    },
    {
      name: 'Product Photo',
      icon: '🛍️',
      desc: 'Clean product photography',
      bg: 'rgba(245,158,11,0.12)',
      style: 'photorealistic',
      mood: 'luxurious',
      colors: 'natural',
      subject: 'Premium product on clean white background with soft shadows'
    },
    {
      name: 'Hero Banner',
      icon: '🎯',
      desc: 'Marketing hero images',
      bg: 'rgba(167,139,250,0.12)',
      style: 'cinematic',
      mood: 'dramatic and intense',
      colors: 'dark purple and gold',
      subject: 'Epic landscape hero image with dramatic lighting and depth'
    },
    {
      name: 'Portrait',
      icon: '👤',
      desc: 'Professional portraits',
      bg: 'rgba(244,63,94,0.12)',
      style: 'photorealistic',
      mood: 'professional',
      colors: 'natural',
      subject: 'Professional portrait with studio lighting and clean background'
    },
    {
      name: 'Nature Art',
      icon: '🌿',
      desc: 'Nature illustrations',
      bg: 'rgba(52,211,153,0.12)',
      style: 'watercolor',
      mood: 'calm and serene',
      colors: 'green and earth tones',
      subject: 'Peaceful natural landscape with soft light and organic textures'
    },
  ];
}

function promptingTips() {
  return [
    { icon: '🎯', tip: 'Be specific about subject, setting, lighting and composition' },
    { icon: '🎨', tip: 'Name specific artists or styles for consistent results (e.g. "in the style of Studio Ghibli")' },
    { icon: '📐', tip: 'Always specify aspect ratio and orientation for the best fit' },
    { icon: '⚡', tip: 'Add quality boosters: "highly detailed, 8k, professional, masterpiece"' },
    { icon: '🚫', tip: 'Use negative prompts to exclude unwanted elements' },
    { icon: '💡', tip: 'Describe lighting: "golden hour, soft diffused light, dramatic shadows"' },
  ];
}
