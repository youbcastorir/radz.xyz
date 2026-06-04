# radz.xyz — CreatorSuite AI

> **The all-in-one AI-powered content creation platform for modern creators.**

Generate articles, social media posts, image prompts, and SEO content — all from one beautiful dashboard.

![radz.xyz Preview](screenshots/dashboard.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| ✍️ **Article Generator** | Blog posts, SEO articles, product descriptions, marketing content, news articles in 10+ languages |
| 🖼️ **Image Generator** | Optimized prompts for Midjourney, DALL·E, Stable Diffusion, and more |
| 📱 **Social Media** | Platform-native posts for Facebook, Instagram, X, LinkedIn, TikTok, YouTube |
| 🔍 **SEO Tools** | Content analyzer, meta generator, keyword research, hashtag generator |
| 📚 **Content Library** | Save, organize, and reuse all generated content |
| 📊 **Dashboard** | Stats, quick actions, recent content overview |
| 💰 **Pricing Plans** | Free, Pro, Creator, Agency tiers |
| 🌙 **Dark / Light Mode** | Beautiful in both themes |
| 📱 **Mobile Friendly** | Fully responsive on all devices |
| 🔑 **Bring Your Own Key** | Uses Anthropic Claude API — your key, your control |

---

## 🚀 Quick Start

### Option 1 — Open Directly
Just open `index.html` in any modern browser. No build step required.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/creatorsuite-ai.git
cd creatorsuite-ai

# Open in browser
open index.html
# or on Linux:
xdg-open index.html
# or on Windows:
start index.html
```

### Option 2 — Local Server (recommended)
```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx serve .

# Then visit:
# http://localhost:8080
```

---

## 🌐 GitHub Pages Deployment

### Step 1 — Initialize Repository
```bash
git init
git add .
git commit -m "Launch CreatorSuite AI"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/creatorsuite-ai.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select `main` branch, `/ (root)` folder
4. Click **Save**
5. Your site will be live at `https://YOUR_USERNAME.github.io/creatorsuite-ai`

### Step 3 — Custom Domain (optional)
1. In GitHub Pages settings, add your custom domain: `radz.xyz`
2. Create a `CNAME` file in the root:
```
radz.xyz
```
3. Add DNS records with your domain registrar:
   - `A` record → `185.199.108.153`
   - `A` record → `185.199.109.153`
   - `A` record → `185.199.110.153`
   - `A` record → `185.199.111.153`
   - `CNAME` record: `www` → `YOUR_USERNAME.github.io`

---

## 🔑 AI Integration Guide

radz.xyz uses the **Anthropic Claude API** for AI generation.

### Getting Your API Key
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account and go to **API Keys**
3. Click **Create Key** and copy it
4. In radz.xyz, click the status indicator in the top bar
5. Paste your key and click **Save**

### How It Works
- Your API key is stored **locally in your browser** (localStorage)
- Keys are **never sent to our servers**
- All AI calls go directly from your browser to Anthropic's API
- Using model: `claude-sonnet-4-20250514`

### API Costs (Anthropic Pricing)
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens
- Average generation: ~0.5–2k tokens = ~$0.001–$0.005 per generation

### Without an API Key
The platform works without an API key using:
- Smart fallback content generation
- Template-based outputs
- Basic local processing

---

## 🎨 Customization Guide

### Changing Colors / Theme
Edit the CSS variables in `style.css`:

```css
[data-theme="dark"] {
  --accent:   #6366f1;  /* Primary accent (indigo) */
  --accent-2: #a78bfa;  /* Secondary accent (violet) */
  --accent-3: #34d399;  /* Success/green accent */
  --bg-base:  #09090e;  /* Main background */
  --bg-card:  #16161f;  /* Card background */
}
```

### Changing the Brand Name
Search and replace `radz.xyz` with your brand name across:
- `index.html` — title, meta tags, logo
- `README.md` — documentation
- `manifest.json` — PWA name
- `sitemap.xml` — URLs

### Adding New Content Types
1. Create a new section in `content.js` or a new `.js` file
2. Register the view renderer by extending the `renderView` function chain
3. Add a nav item in `index.html` with `data-view="your-view"`
4. Add the view container: `<div id="view-your-view" class="view"></div>`

### Adding New AI Prompts
All AI calls use the `callAI(prompt, systemPrompt)` function in `app.js`:

```javascript
const result = await callAI(
  'Your user prompt here',
  'Optional system instruction'
);
```

### Changing the AI Model
In `app.js`, find and update:
```javascript
model: 'claude-sonnet-4-20250514',
```

Available models:
- `claude-haiku-4-5-20251001` — fastest, cheapest
- `claude-sonnet-4-20250514` — balanced (default)
- `claude-opus-4-20250514` — most powerful

---

## 📁 File Structure

```
radz-xyz/
├── index.html          # Main HTML shell + navigation
├── style.css           # Complete design system + dark/light themes
├── app.js              # Core: routing, dashboard, settings, contact, utilities
├── content.js          # Article Generator + SEO Tools
├── image-generator.js  # Image Prompt Generator
├── social-posts.js     # Social Media Generator (6 platforms + threads)
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine directives
├── manifest.json       # PWA manifest
├── README.md           # This file
├── .gitignore          # Git ignore rules
└── icons/              # PWA icons (add icon-192.png, icon-512.png)
```

---

## 🛠️ Tech Stack

- **Pure HTML5** — No frameworks, no build step
- **Vanilla CSS** — Custom design system with CSS variables
- **Vanilla JavaScript** — ES6+, modular architecture
- **Anthropic Claude API** — AI generation via REST
- **localStorage** — Client-side persistence
- **Google Fonts** — Syne + DM Sans typography

---

## 📊 Pricing Plans

| Plan | Price | Generations |
|---|---|---|
| Free | $0/mo | 10/month |
| Pro | $19/mo | 100/month |
| Creator | $49/mo | 500/month |
| Agency | $99/mo | Unlimited |

> **Note:** With your own API key, the built-in limits don't apply — you pay Anthropic directly per generation.

---

## 📧 Contact & Support

- **Email:** [salatrir@gmail.com](mailto:salatrir@gmail.com)
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/creatorsuite-ai/issues)
- **Subject line:** `[radz.xyz] Your Topic`

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Credits

Built with ❤️ using:
- [Anthropic Claude](https://anthropic.com) for AI
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) fonts
- Inspired by modern SaaS design systems

---

*radz.xyz © 2026 — Contact: salatrir@gmail.com*
