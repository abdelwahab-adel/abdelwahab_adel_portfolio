# Abdelwahab Adel — Premium Portfolio

A complete redesign of the personal portfolio into a premium, light, editorial software-engineering studio website — visually inspired by [CodeMZ](https://www.codemz.com/) with full original identity, content, and structure preserved.

## What you get

- **No build step, no framework** — just open `index.html`
- **Fully responsive** — desktop, tablet, and mobile
- **SEO-ready** — meta tags, Open Graph, Twitter cards, JSON-LD structured data
- **Accessible** — skip link, semantic HTML, ARIA labels, keyboard support
- **Animated** — reveal on scroll, count-up stats, marquee, custom cursor (desktop), smooth scrolling
- **Self-contained** — zero third-party requests: fonts, tech icons, screenshots and scripts are all served from this folder (so a strict Content-Security-Policy works)
- **Works without JavaScript** — content is readable, the contact form falls back to email / WhatsApp links

## File structure

```
portfolio/
├── index.html          ← homepage
├── projects.html       ← full project list
├── style.css           ← all styles (CSS variables, light theme, responsive)
├── script.js           ← animations, mobile menu, filters, project modal, contact form
├── vercel.json         ← security headers + caching (Vercel)
├── _headers            ← same headers for Netlify / Cloudflare Pages
├── AUDIT.md            ← what was reviewed, fixed, and what still needs a decision
├── README.md           ← this file
└── assets/
    ├── favicon.svg
    ├── noscript.css     ← loaded only when JavaScript is off
    ├── fonts/           ← self-hosted Inter + JetBrains Mono (variable, latin subset)
    ├── icons/           ← tech-stack icons (Simple Icons, CC0) + certificate icons
    ├── images/          ← profile photos, logo, og-cover.jpg (1200×630 share card), WebP project screenshots
    └── vendor/          ← self-hosted gsap.min.js + ScrollTrigger.min.js
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
Deploy the **whole folder** (there is no build step):
- **Vercel** — `vercel deploy` (or push to GitHub and import). `vercel.json` adds the security headers.
- **Netlify** — drag & drop the folder at app.netlify.com/drop. `_headers` adds the security headers.
- **Cloudflare Pages** — connect the repo, no build command needed. `_headers` is honoured too.
- **GitHub Pages** — works, but it cannot set HTTP headers, so the CSP is not applied (see *Security*).

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
| Text low | `#596273` (5.6:1 on the page background) |
| Text faint | `#636b7a` (4.9:1) |
| **Accent** | `#10b981` (emerald — backgrounds, dots, borders) |
| **Accent (text/icons/focus)** | `#047857` (`--accent-strong`, passes WCAG AA on light surfaces) |
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

## Security

- **No inline scripts, inline styles or inline event handlers** anywhere, so a strict CSP can be enforced. The policy (see `vercel.json` / `_headers`):
  `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
- Extra headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, `Cross-Origin-Opener-Policy`.
- All `target="_blank"` links use `rel="noopener"`; the pop-up opened by the contact form has its `opener` severed.
- The contact form has no backend: it only opens WhatsApp with the message pre-filled. Nothing is sent until the visitor presses Send in WhatsApp, and nothing is stored.
- **GitHub Pages** cannot send headers. If you host there, add this to the `<head>` of both pages (it cannot express `frame-ancestors`, and it makes opening the files straight from disk stop working):
  `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'">`
- When you change code, re-check that you did not add an inline `style=""`, `onclick=""` or `<script>` block — the browser console will report a CSP violation if you did.

## Browser support

- Chrome / Edge / Brave (current)
- Firefox (current)
- Safari 15+ (graceful fallbacks for backdrop-filter)
- Mobile Safari & Chrome on Android

Reduced-motion users get instant renders (no animations).

## Performance

- Only dependency is GSAP + ScrollTrigger (~117KB, self-hosted in `assets/vendor/`) for scroll animations — no React, no jQuery, no build step
- Single CSS file, no preprocessor needed
- Fonts are self-hosted (variable Inter + JetBrains Mono, latin subset, ~88 KB) with `font-display: swap` and the main face preloaded
- Project screenshots are compressed WebP (resized to their actual display size — ~19MB of PNGs reduced to under 1MB total)
- Project images use `loading="lazy"`; an image that fails to load is hidden by `script.js` (no inline `onerror`)
- Lighthouse-friendly: semantic landmarks, alt text, proper heading order, focus styles, color contrast
