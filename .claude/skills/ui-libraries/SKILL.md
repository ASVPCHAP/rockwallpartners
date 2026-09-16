---
name: ui-libraries
description: Curated component-library sources for building and restyling the Rockwall Partners site — Spectrum UI, 21st.dev, shadcnblocks, React Bits, 8bitcn, Evil Charts, Coss UI, Rare UI, beUI. Use when adding a new section, hero, pricing block, testimonial, chart, or animation to any page, when the user asks for something that "looks expensive," or when sourcing a UI pattern instead of writing one from scratch. Covers what each source is good for, how to pull from it, license limits, and how to port React/Tailwind components into this site's vanilla HTML + CSS.
---

# UI component sources

## Read this first: the stack mismatch

This repo is **vanilla static HTML + CSS + one plain `script.js`**, deployed on Cloudflare
Pages with an empty build command. There is **no React, no Tailwind, no bundler, no
`package.json`.**

Every library below ships **React + Tailwind** (most of them on top of shadcn/ui). None of
them can be dropped into this repo as-is. `npx shadcn add ...` has nothing to install into.

So there are two modes. Default to Mode A unless the user has explicitly chosen to migrate.

**Mode A — reference and port (default).** Browse the library, take the *design*: layout,
spacing rhythm, type scale, shadow and border treatment, interaction. Rewrite it as semantic
HTML plus CSS using this site's existing tokens. Nothing is installed; no dependency is added.

**Mode B — migrate first.** If the user wants to CLI-install components directly, the site has
to become a React/Tailwind project (Astro or Next both work on Cloudflare Pages). That is a
real migration — build step, deploy config, and a rewrite of all five pages. Raise it as a
decision, don't start it unprompted.

## Quick pick

| Need | Go to |
|---|---|
| Hero / pricing / feature / testimonial page sections | shadcnblocks, 21st.dev |
| Something that reads premium and animated | Spectrum UI, beUI, Rare UI |
| Text and background motion effects | React Bits |
| Charts for the vendor-savings numbers | Evil Charts |
| Broad, accessible primitives (buttons, inputs, pickers) | Coss UI |
| Unusual, memorable one-off pieces | Rare UI |
| Retro / pixel treatment | 8bitcn |

## The sources

### Spectrum UI — `ui.spectrumhq.in`
250+ animated components. React + Tailwind + shadcn/ui, Framer Motion for animation. Offers an
MCP server for direct agent access, and everything is browsable and copy-pasteable from the
site. Free, commercial use permitted, open source (Vercel OSS program).
**Best for:** polished animated sections when the brief is "make it look expensive."

### 21st.dev — `21st.dev`
Community registry, 12,000+ React + TypeScript + Tailwind components, templates, and shadcn
themes. Installs via shadcn CLI or a copy-prompt aimed at coding agents. Free to browse;
**2 free component copies per day**, more behind membership.
**Best for:** breadth — when you want ten takes on the same section to compare.

### shadcnblocks — `shadcnblocks.com`
~2,028 blocks / 2,104 components / 20 templates for shadcn + Tailwind + React. Heavy on page
sections: 285 heroes, 313 feature blocks, 96 pricing, 39 testimonial, plus data tables and
auth. **Paid — $149–$399 lifetime**, with a free tier for logged-in users. Not affiliated with
shadcn/ui.
**Best for:** full marketing-page sections. Check the user has a license before leaning on
paid blocks; use the free tier otherwise.

### React Bits — `reactbits.dev`
165+ animated text, background, and UI components. Ships **four variants per component —
JS-CSS, JS-TW, TS-CSS, TS-TW**. Minimal dependencies, tree-shakeable. Install via shadcn or
jsrepo CLI, or copy-paste. **MIT + Commons Clause** — free for personal and commercial use,
but you may not sell the components themselves. Fine for this site.
**Note:** the **JS-CSS variant is the most portable to this repo** — plain CSS, no Tailwind to
unwind. Start there when porting motion effects.

### 8bitcn — `8bitcn.com`
Retro 8-bit components and blocks with multiple themes, copy-paste, open source, free
(OrcDev + community).
**Best for:** a deliberate retro moment. Off-brand for the current navy/clay identity — only
use if the user asks for it.

### Evil Charts — `evilcharts.com`
Animated, interactive chart components for React, built on **Recharts and Apache ECharts**,
styled for shadcn/ui. Copy-paste workflow. Open source on GitHub; confirm the license in the
repo before shipping.
**Best for:** visualizing vendor-savings figures. In Mode A, port the *visual* treatment to
inline SVG — this site has no charting dependency and shouldn't gain one lightly. Load the
`dataviz` skill before building any chart.

### Coss UI — `coss.com/ui`
508 components built on Base UI (headless, accessibility-focused React primitives). Ranges
from buttons and inputs to command palettes and date pickers. Open source and free.
**Best for:** accessible interactive primitives — the contact form, disclosure behavior, the
nav toggle.

### Rare UI — `rareui.com`
19+ distinctive animated components (Fluid Orb, Gravity Letters, Duration Picker, OTP Input).
Uses Motion; installs one file at a time via shadcn CLI
(`npx shadcn@latest add swamimalode07/rare-ui/<name>`). Free and open source.
**Best for:** a single memorable hero flourish. One per page, not a whole system.

### beUI — `beui.dev`
Animated components on **React 19 + Tailwind 4 + Framer Motion**, distributed through the
shadcn registry (`bunx --bun shadcn add @beui/tilt-card`). **MIT**, with a paid Pro tier at
`pro.beui.dev`.
**Best for:** tasteful micro-interaction — tilt cards, reveals, hover states.

## Porting into this site (Mode A)

The design system lives in `styles.css` under `:root`. **Always map to these tokens — never
paste a raw hex or a Tailwind class into this repo.**

```
--navy #10243E   --navy-deep #0B1A2D   --navy-lift #16304F
--clay #B4552F   --clay-bright #C9683F --clay-soft #E8A877
--paper #FAF8F4  --paper-card #FFFEFB  --paper-deep #ECE7DE
--line #E1DACE
--ink #10243E    --ink-soft #4A545F    --ink-mute #6B7480
--sans Archivo   --mono "IBM Plex Mono"   --wrap 1180px
```

Procedure:

1. **Fetch the component** and read its actual markup and styles. Several of these sites
   (React Bits, 8bitcn) render client-side and return almost nothing to a plain fetch —
   read their GitHub repo or `raw.githubusercontent.com` README instead.
2. **Strip the React.** Props become static content; `className` chains become one semantic
   class; state becomes either a CSS `:hover`/`:focus-within` rule or a small vanilla handler
   appended to `script.js` in that file's existing IIFE style.
3. **Translate Tailwind to tokens.** `bg-slate-900` → `var(--navy)`, `text-gray-500` →
   `var(--ink-mute)`, `border-gray-200` → `var(--line)`. Keep the library's *spacing and size
   relationships*; take none of its palette.
4. **Keep the type stack.** Archivo for everything, IBM Plex Mono for figures and labels.
   Headings are already `font-weight: 800` with tight negative letter-spacing — match that
   rather than importing a new scale.
5. **Animation:** prefer CSS transitions and `@keyframes`. Do not add Framer Motion or GSAP.
   Wrap anything that moves in `@media (prefers-reduced-motion: reduce)`.
6. **Accessibility:** real landmarks and heading order, visible `:focus` styles, and contrast
   held at WCAG AA against `--paper`. The site already has `.skip-link` and
   `.visually-hidden` — reuse them. Run `design:accessibility-review` on new sections.
7. **Check it renders** at phone width before committing. No horizontal scroll.

## Attribution and licensing

Most of these are free for commercial use, but the terms differ: shadcnblocks is paid,
21st.dev meters free copies, React Bits carries a Commons Clause, beUI splits free and Pro.
Confirm the specific component's terms before shipping it, and keep any attribution comment
the source requires.
