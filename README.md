# Abdelwahab Adel — Premium Portfolio

A complete redesign of the personal portfolio into a premium, light, editorial software-engineering studio website — visually inspired by [CodeMZ](https://www.codemz.com/) with full original identity, content, and structure preserved.

## What you get

- **3 files** — no build step, no framework, just open `index.html`
- **Fully responsive** — desktop, tablet, and mobile
- **SEO-ready** — meta tags, Open Graph, Twitter cards, JSON-LD structured data
- **Accessible** — skip link, semantic HTML, ARIA labels, keyboard support
- **Animated** — reveal on scroll, count-up stats, marquee, custom cursor (desktop), smooth scrolling
- **Self-contained** — only external requests are Google Fonts and the project images served from your existing Vercel CDN

## File structure

```
portfolio/
├── index.html      ← the entire site
├── style.css       ← all styles (CSS variables, dark theme, responsive)
├── script.js       ← animations, mobile menu, counters, cursor
├── README.md       ← this file
└── assets/         ← empty (project images load from your Vercel site)
```

## Quick start

### Option 1 — Open locally
```bash
# Just open the file
open index.html     # macOS
xdg-open index.html # Linux
start index.html    # Windows
```

### Option 2 — Serve with any static server
```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`.

### Option 3 — Deploy
Drop the 3 files into:
- **Vercel** — `vercel deploy` (or just push to GitHub and import)
- **Netlify** — drag & drop the folder at app.netlify.com/drop
- **GitHub Pages** — commit and enable Pages in repo settings
- **Cloudflare Pages** — connect the repo, no build command needed

## What's inside the redesign

| Section | Description |
|---|---|
| **Navbar** | Floating pill-shaped, glass blur on scroll, active section indicator, mobile drawer |
| **Hero** | Centered "Let's build your next system." with 4 floating glassmorphic cards in background |
| **Stats** | 49+ / 5+ / 100% / 7+ with count-up animation, light editorial typography |
| **Marquee** | Continuous tech stack: PHP, Laravel, JavaScript, React, MySQL, REST API… |
| **About** | "I build software that solves real business problems." with side description + sidebar cards |
| **Solutions** | 6 large feature cards (alternating left/right) — code panels, stack visuals, 3D sphere, mesh |
| **Process** | 4 image cards with abstract 3D visuals (skewed square, triangle, stacked squares, sphere) |
| **Selected Work** | **Horizontal scroll carousel** of 6 project cards with arrow controls |
| **Engineering** | Capabilities grid + extended light system dashboard |
| **Experience** | Clean enterprise timeline with achievement lists |
| **Education** | Minimal Luxor University card |
| **Why Me** | 6 engineering principles in a 3×2 grid |
| **Availability** | AVAILABLE pill + live terminal mockup |
| **Contact CTA** | Large editorial "Let's build something great." + radial blue glow |
| **Footer** | 4-column enterprise footer with tagline |

## Design system

| Token | Value |
|---|---|
| Background | `#f0f4fa` (soft blue-tinted light) |
| Surface | `#ffffff` (clean white cards) |
| Border | `rgba(10, 10, 10, 0.06–0.16)` |
| Text high | `#0a0a0a` |
| Text mid | `#4b5563` |
| Text low | `#6b7280` |
| **Accent** | `#10b981` (emerald — used sparingly) |
| Display font | Inter (200–800, with 300 as the editorial default) |
| Mono font | JetBrains Mono (400–600) |
| Border radius | `6–24px` (pill-shaped controls, soft cards) |
| Spacing | 8px base scale |

## Customisation quick reference

- **Change accent color** → edit `--accent` in `style.css` (one value, propagates everywhere)
- **Add/remove a project** → copy any `<article class="project-card">` block in `index.html`
- **Update contact info** → search the email, phone, social links in `index.html`
- **Tweak copy** → all text is plain HTML — no template engine, no JS data binding
- **Project images** → update the `<img src="…">` URL on each project
- **Background tint** → adjust the body `background-image` in `style.css`
- **Carousel scroll step** → edit the `cardWidth` in the `script.js` projects section

## Content preserved from your original portfolio

- Name: Abdelwahab Adel
- Title: Full-Stack Software Engineer
- Location: Aswan, Egypt 🇪🇬
- Email: abdelwahabadel777@gmail.com
- Phone: +20 110 034 0198
- WhatsApp: wa.me/201100340198
- LinkedIn, GitHub, Telegram, Facebook links
- CV: Google Drive folder link
- All 6 featured projects with their original live demos and GitHub repos
- Skills: PHP, Laravel, JavaScript, React.js, MySQL, REST API, HTML, CSS, Sass, Bootstrap, Git, Linux
- Experience: CodeAlpha internship, freelance front-end, freelance back-end
- Education: Luxor University, Bachelor of Computer Science

## Browser support

- Chrome / Edge / Brave (current)
- Firefox (current)
- Safari 15+ (graceful fallbacks for backdrop-filter)
- Mobile Safari & Chrome on Android

Reduced-motion users get instant renders (no animations).

## Performance

- 0 JS dependencies (no React, no jQuery, no GSAP)
- Single CSS file, no preprocessor needed
- All fonts preconnected, swapped asynchronously
- Project images use `loading="lazy"` with a CSS fallback when blocked
- Lighthouse-friendly: semantic landmarks, alt text, proper heading order, focus styles, color contrast
