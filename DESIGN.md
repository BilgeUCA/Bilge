# BILGE Design System

A portable description of BILGE's visual language, UX patterns, and motion, written so the same look and feel can be rebuilt in any other project. Everything here comes from the real code: [src/styles/globals.css](src/styles/globals.css), the components in [src/components/](src/components/), and the page stylesheets in [src/pages/](src/pages/).

**Stack it was built on:** React 19 + Vite, plain CSS (one `.css` file per component, BEM class names), `lucide-react` icons, Inter from Google Fonts. There's no CSS framework or animation library, so everything below ports to any stack as-is.

---

## 1. Design philosophy

The look is calm and editorial, and most of the "polish" comes from motion. Five rules drive every decision:

1. **White space and grayscale first, one blue accent.** Surfaces are white or `gray-50`. Text is a gray ramp. Blue (`#2563EB`) marks what's interactive or important: links, the primary CTA, active states, tags, key numbers. Nothing else competes with it.
2. **Borders, not shadows, at rest.** Cards sit flat with a 1px `gray-100` border. Shadows show up **only on hover** to signal "this lifts / is clickable".
3. **Soft, generous geometry.** Radii of 12–16px on cards, full pills for badges and tags, 88px → 60px navbar, 80px (`spacing-20`) section rhythm.
4. **Feedback on press, not on release** (Apple's fluid-interface principle; see the `SKILL.md` one level up). Every clickable element has an `:active` state that fires in 100ms.
5. **One easing curve everywhere.** A spring-like `cubic-bezier(0.22, 1, 0.36, 1)`: fast start, long soft settle. It's used for all transitions, reveals, and the tab pill.

---

## 2. Design tokens (copy these verbatim)

Put this at the top of your global stylesheet. All components reference these variables. Nothing hard-codes values except a few one-off gradients.

```css
:root {
  /* Primary (Tailwind "blue" scale) */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-light: #DBEAFE;
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;

  /* Neutrals (Tailwind "gray" scale) */
  --color-white: #FFFFFF;
  --color-black: #000000;
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;    /* 12 */
  --font-size-sm: 0.875rem;   /* 14 */
  --font-size-base: 1rem;     /* 16 */
  --font-size-lg: 1.125rem;   /* 18 */
  --font-size-xl: 1.25rem;    /* 20 */
  --font-size-2xl: 1.5rem;    /* 24 */
  --font-size-3xl: 1.875rem;  /* 30 */
  --font-size-4xl: 2.25rem;   /* 36 */
  --font-size-5xl: 3rem;      /* 48 */

  /* Spacing (4px grid) */
  --spacing-1: 0.25rem;  --spacing-2: 0.5rem;   --spacing-3: 0.75rem;
  --spacing-4: 1rem;     --spacing-5: 1.25rem;  --spacing-6: 1.5rem;
  --spacing-8: 2rem;     --spacing-10: 2.5rem;  --spacing-12: 3rem;
  --spacing-16: 4rem;    --spacing-20: 5rem;    --spacing-24: 6rem;

  /* Radius */
  --radius-sm: 0.375rem;  /* 6  – small chips, lang tags */
  --radius-md: 0.5rem;    /* 8  – nav links, inputs, pagination */
  --radius-lg: 0.75rem;   /* 12 – buttons, icon tiles, search */
  --radius-xl: 1rem;      /* 16 – cards (the default) */
  --radius-2xl: 1.5rem;   /* 24 – hero cards, big feature panels */
  --radius-full: 9999px;  /* pills, badges, tags */

  /* Shadows (only used on hover / floating elements) */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1);

  /* Motion */
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring-snappy: cubic-bezier(0.32, 0.72, 0, 1);
  --transition-fast: 150ms var(--ease-spring);    /* color, bg, gap */
  --transition-normal: 250ms var(--ease-spring);  /* card lift, shadow */
  --transition-slow: 350ms var(--ease-spring);    /* drawers */
  --press-duration: 100ms;                        /* :active feedback */

  /* Layout */
  --container-max: 1200px;
  --container-padding: 1.5rem;
}
```

Load the font in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Re-theming for another brand

Swap only the `--color-primary-*` block (keep the same 50/100/600/700 shape). Also search for these hard-coded tints, which are the primary color at low alpha:

- `rgba(37, 99, 235, 0.3)`: primary button hover glow
- `rgba(37, 99, 235, 0.1)`: focus ring on search inputs
- `rgba(37, 99, 235, 0.03–0.04)`: hero background glow
- `#3B82F6`, `#60A5FA`, `#1E40AF`: gradient stops (primary-500/400/800)

---

## 3. Color usage rules

| Role | Token | Where |
|---|---|---|
| Page background | `white` | default |
| Alternating section / footer / sidebar panels | `gray-50` | "Featured" section, footer, About hero, toolbars |
| Card border at rest | `gray-100` | every card |
| Card border on hover, dividers, input borders | `gray-200` | |
| Headings | `gray-900` | h1–h3, card titles |
| Body text | `gray-800` (body default), `gray-600/700` (secondary) | |
| Muted/supporting text | `gray-500` | subtitles, descriptions |
| Placeholder, meta, icons in inputs | `gray-400` | |
| Interactive / accent | `primary` | links, CTAs, active states, numbers |
| Soft accent fill | `primary-50` bg + `primary-100` border | badges, tags, active nav link, icon tiles on hover |
| Positive / "Free" | `success` / `#059669` | |
| Deadline warning / danger | `#D97706` / `#DC2626` | |

**Semantic badge pairs** (bg / text), used for status tags:
- Blue `#DBEAFE / #2563EB` · Green `#ECFDF5 / #059669` · Red `#FEF2F2 / #DC2626` · Violet `#F5F3FF / (violet)`

**Card header gradients.** Cards with an "image" area use a 3-stop 135° gradient from a dark shade to a light tint of the same hue:

```css
background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%);
/* same pattern with teal, violet, green, orange, rose, indigo… */
```

Text selection is also branded:

```css
::selection { background: var(--color-primary-light); color: var(--color-primary-700); }
```

---

## 4. Typography

Inter only, with antialiasing on (`-webkit-font-smoothing: antialiased`). Body `line-height: 1.6`; descriptive paragraphs `1.7`.

| Element | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Hero H1 | `clamp(2rem, 5vw, 3rem)` | 800 | `-0.03em` | 1.15 |
| Page title (inner pages) | `clamp(2xl, 4vw, 4xl)` | 800 | `-0.03em` | — |
| Section H2 | `clamp(2xl, 3vw, 3xl)` | 700 | `-0.02em` | — |
| Card title | `base`–`lg` | 600–700 | — | 1.3 |
| Body / subtitle | `lg` (hero), `base` | 400 | — | 1.7 |
| Card description | `sm` | 400, `gray-500` | — | 1.7 |
| Eyebrow / badge / label | `xs` | 600 | `0.05em`, UPPERCASE | — |
| Logo wordmark | `xl` | 800, primary | `-0.02em` | — |
| Big stat number | `4xl` | 800, gradient text | `-0.02em` | — |

**Rules:** big type gets tighter tracking and small uppercase labels get wider tracking. Use `clamp()` for all display sizes so there are no breakpoint jumps. Keep text measure short: hero subtitle `max-width: 520px`, page subtitles ~620px.

**Gradient text** (hero highlight words, stat numbers, 404 code):

```css
.gradient-text {
  background: linear-gradient(135deg, var(--color-primary) 0%, #3B82F6 50%, #60A5FA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 5. Layout & spacing

- **Container:** `max-width: 1200px; margin: 0 auto; padding: 0 1.5rem`.
- **Section rhythm:** `.section { padding: 5rem 0 }`. Alternate `white` / `gray-50` backgrounds between sections instead of using dividers.
- **Fixed navbar is 88px at rest** (`--navbar-height`), so every page's first block starts with `padding-top: calc(var(--navbar-height) + var(--spacing-10 or 16))`.
- **Grids:** CSS Grid with `gap: var(--spacing-6)` (24px). Card grids are 3 or 4 columns on desktop.
- **Sidebar layouts:** `grid-template-columns: 240px 1fr` (filters) or `1fr 340px` (detail page). Sidebars are `position: sticky; top: 80px` (navbar + 16px).
- **Section header pattern:** title + subtitle on the left, a quiet text link ("View all →") on the right, `justify-content: space-between`, `margin-bottom: spacing-10/12`.

### Breakpoints (desktop-first, `max-width`)

| Breakpoint | What changes |
|---|---|
| `1024px` | 4-col / 3-col grids → 2 cols; footer stacks brand above columns |
| `868px` | Navbar → hamburger + slide-in drawer; sidebar layouts → single column, sticky → static |
| `768px` | Step/timeline rows stack; section headers stack vertically |
| `600px` / `580px` | Card grids → 1 col; toolbars stack |
| `480px` | Hero CTAs stack; features → 1 col; footer columns → 1 col |

---

## 6. Components

All components share one "card language":

```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-100);
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
}
.card:hover {
  border-color: var(--color-gray-200);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);          /* the signature "lift" */
}
.card:active {                           /* only on cards that are links */
  transform: translateY(-1px) scale(0.99);
  transition-duration: var(--press-duration);
}
```

### 6.1 Button

Variants: `primary`, `secondary`, `ghost`, `outline-primary`. Sizes: `sm`, `md`, `lg`. Optional icon (left/right) with an 8px gap. The same component renders a router `<Link>`, an external `<a>`, or a `<button>` depending on the props ([Button.jsx](src/components/ui/Button.jsx)).

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--spacing-2);
  font-weight: 600; line-height: 1.4; white-space: nowrap;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}
.btn--sm { padding: var(--spacing-2) var(--spacing-4); font-size: var(--font-size-sm); }
.btn--md { padding: var(--spacing-3) var(--spacing-6); font-size: var(--font-size-sm); }
.btn--lg { padding: var(--spacing-4) var(--spacing-8); font-size: var(--font-size-base); }

.btn--primary { color: #fff; background: var(--color-primary); }
.btn--primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);   /* colored glow, not gray */
}
.btn--secondary { color: var(--color-gray-700); background: #fff; border: 1px solid var(--color-gray-200); }
.btn--secondary:hover { background: var(--color-gray-50); border-color: var(--color-gray-300); transform: translateY(-1px); }
.btn--ghost { color: var(--color-gray-700); background: transparent; }
.btn--ghost:hover { background: var(--color-gray-100); color: var(--color-gray-900); }
.btn--outline-primary { color: var(--color-primary); border: 1px solid var(--color-primary); background: transparent; }
.btn--outline-primary:hover { background: var(--color-primary); color: #fff; transform: translateY(-1px); }

/* Press feedback: fires on pointer-down */
.btn:active { transform: scale(0.97); transition-duration: var(--press-duration); }
```

**On dark or gradient panels**, restyle the button as frosted glass: `background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3); color: #fff`, and `.25` on hover.

### 6.2 Text link with arrow ("Learn more →")

The arrow slides because the **gap** animates. The icon itself doesn't move.

```css
.link-arrow {
  display: inline-flex; align-items: center; gap: var(--spacing-1);
  font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary);
  transition: gap var(--transition-fast);
}
.link-arrow:hover  { gap: var(--spacing-2); }
.link-arrow:active { opacity: .6; transition: opacity var(--press-duration) var(--ease-spring); }
```

Quiet variant ("View all"): `gray-500` → `primary` on hover.

### 6.3 Badge / pill (hero eyebrow)

```css
.badge {
  display: inline-flex; align-items: center; gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-4) var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs); font-weight: 600;
  letter-spacing: .05em; text-transform: uppercase;
  color: var(--color-primary);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-100);
  border-radius: var(--radius-full);
}
.badge__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-primary); animation: pulse 2s ease infinite; }
```

### 6.4 Tags and chips

- **Info tag:** `xs`, weight 500, `primary` text on `primary-50`, pill. Inside a hovered card it deepens to `primary-100`.
- **Filter chip:** `gray-600` on `gray-50` with a `gray-200` border, pill. Active state: white text on `primary`.
- **Small code tag** (e.g. "EN", "RU"): `2px 8px`, `radius-sm`, `gray-100` bg, weight 600.

### 6.5 Feature card with icon tile

A 48×48 icon tile (`radius-lg`, `gray-50` bg, `gray-100` border, `gray-700` icon, lucide `size={24} strokeWidth={1.5}`). **When the parent card is hovered, the tile turns blue:** `primary-50` bg, `primary-100` border, `primary` icon. It pairs with the card lift. Card body is a flex column with the description `flex: 1`, so the bottom links line up across a row.

### 6.6 Media card (list/grid item with a gradient header)

- A 140px gradient header area (see §3) that holds **frosted-glass controls**:
  - Round 36px favorite button: `rgba(255,255,255,.2)` + `backdrop-filter: blur(4px)`, `scale(1.1)` on hover, red `rgba(239,68,68,.7)` when active.
  - 44px logo badge: `rgba(255,255,255,.2)`, `blur(6px)`, 1px `rgba(255,255,255,.3)` border, white initials.
  - Country pill: `rgba(0,0,0,.3)` + blur, white text.
  - Floating score chip on light headers: `rgba(255,255,255,.95)` + `blur(8px)` + `shadow-sm`.
- Body: `padding: spacing-5`, flex column. Detail rows are an icon (`gray-400`) plus an uppercase `xs` label and a `sm` value.
- Footer row pinned with `margin-top: auto`, separated by a `gray-100` top border.
- Full-width soft CTA: `primary` text on `primary-50`, `primary-100` on hover.

### 6.7 Navbar

- `position: fixed`, `z-index: 1000`. Two states, toggled by one class (`.navbar--compact`) on the `<header>`:
  - **At rest (top of page):** 88px tall (`--navbar-height`), transparent background, no border or shadow, a large `3xl` wordmark, `base`-size links spaced `spacing-4` apart, and an **outline** `gray-900` "Log in" button.
  - **Compact (`scrollY > 40`, or while the mobile drawer is open):** 60px tall (`--navbar-height-compact`), `white` background, `gray-100` hairline bottom border, a soft shadow `0 4px 16px -8px rgba(0,0,0,.12)`, an `xl` wordmark, `sm` links, and a **filled** `gray-900` button. In both states the button turns `primary` blue on hover.
  - Height, background, border, shadow, font sizes and link gap all transition with `transition-normal`.
- **Reading progress:** a 2px `primary` (blue) line pinned to the header's bottom edge. The scroll handler (passive, rAF-throttled) writes its `width` straight to the DOM as `scrollY / (scrollHeight - innerHeight)`, so scrolling never re-renders React.
- Wordmark on the left (800, primary). Links are 500 `gray-600`, with a `gray-50` bg on hover and `primary` on `primary-50` when active (pill-ish `radius-md`).
- On the right: the **segmented language switcher** (§7.3), the theme toggle, and the "Log in" button (or the account pill when signed in).
- **Under 868px:** a 320px drawer slides in from the right under the compact bar (`top: var(--navbar-height-compact)`, `transition-slow`) with `shadow-xl`, plus a `rgba(0,0,0,.35)` overlay that fades in. The hamburger morphs into ✕ (§7.4). Actions move to the bottom of the drawer (`margin-top: auto`) and become full width.
- Under `prefers-reduced-motion: reduce` the state change is instant.

### 6.8 Sub-navigation tabs (inner pages)

A sticky bar under the compact navbar (`top: var(--navbar-height-compact)`, `z-index: 40–50`, white, `gray-100/200` bottom border). Two styles are used:
- **Underline tabs:** `gray-500` text. The active tab gets `primary` text, weight 600, and a 2px primary bottom border. Scrolls horizontally on mobile (`overflow-x: auto`).
- **Floating-bar tabs:** the active tab gets an `::after` 2px pill bar under it.

### 6.9 Filter sidebar & form inputs

- White panel, `gray-100` border, `radius-xl`, `shadow-sm`, sticky.
- Groups are separated by `gray-100` bottom borders with `spacing-6` padding.
- Inputs are wrapped in a bordered box (`gray-200`, `radius-lg`) that holds a `gray-400` icon. **Focus is shown on the wrapper** with `:focus-within { border-color: primary }`. The large search adds a ring: `box-shadow: 0 0 0 3px rgba(37,99,235,.1)`.
- Checkboxes use native inputs with `accent-color: var(--color-primary)`.
- Number inputs hide their spin buttons.

### 6.10 Toolbar, pagination, empty state

- **Toolbar:** a `gray-50` strip with `radius-lg`. Results count on the left (`gray-500`, with a bolded number), sort `<select>` on the right.
- **Pagination:** 40×40 square buttons, `radius-md`, `gray-200` border. Hover gives a primary border + text. Active is solid primary. Disabled is `opacity: .4`. Prev/next arrows have transparent borders.
- **Empty state:** centered, `gray-400` text, soft `primary-50` "Reset filters" button.

### 6.11 Accordion, FAQ, tables

- **Accordion:** `gray-100` bordered box, `radius-xl`, `overflow: hidden`. The trigger row is `sm`/600 with a leading icon and a trailing chevron (`ChevronDown`/`ChevronUp` swap), and gets a `gray-50` bg on hover/open. Items use green `CheckCircle2` icons and `gray-50` hairline dividers.
- **Tables:** a rounded container, `gray-50` head, and rows that turn `gray-50` on hover (`transition-fast`).

### 6.12 Vertical timeline

A 2px `gray-200` line drawn with `::before` on the list. 10px primary dots with a 2px white border and a `0 0 0 2px primary-100` halo ring. The date is `11px`, 700, primary. There's also a center-line zig-zag variant (left/right alternating cards) for larger timelines.

### 6.13 Section accent heading

A 4×28px rounded primary bar placed before an H2 (`display: flex; gap: spacing-3`). It's used for long-form content pages.

### 6.14 Numbered steps ("How it works")

3-column grid. Each step is a bold primary number, then a 2px connector line with `linear-gradient(90deg, primary, primary-100)` that fades toward the next step (hidden on the last step and on mobile), then a `lg` title and a `sm gray-500` description.

### 6.15 Callout panels

- **Soft hero card:** `gray-50` bg, `gray-100` border, `radius-2xl`, big padding, primary pill badge on top.
- **Strong promo panel:** `linear-gradient(135deg, #1E40AF, #2563EB)`, white text, `radius-2xl`. List items inside are frosted (`rgba(255,255,255,.1)` bg, `.15` border, `blur(4px)`, `.18` on hover).
- **Stat card:** centered, gradient-text number, `gray-500` label, card lift on hover.

### 6.16 Footer

`gray-50` bg, `gray-200` top border. Two-column grid (`280px 1fr`): wordmark + description, then 3 link columns. Column headings are uppercase `sm`/700 `gray-900`. Links are `gray-600` → primary on hover and `opacity .6` on press. A centered copyright row sits below a `gray-200` divider.

### 6.17 404 page

Full-height split layout: text on the left, illustration on the right, over a faint blue→violet diagonal wash. Two blurred radial "orbs" (`::before`/`::after`) float on 6s/8s loops, the second reversed. There's a giant gradient "404" with a slow pulse, an illustration that bobs (`translateY(-15px)`, 3s), and a radial glow behind it that breathes (`scale 1→1.1`, opacity `.8→.4`). The columns slide in from opposite sides on load. This is the one place the system allows playful, looping motion.

### 6.18 Hero background

No images. Two very faint radial gradients on an absolutely positioned layer:

```css
.hero__bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 600px 400px at 80% 20%, rgba(37,99,235,.04), transparent),
    radial-gradient(ellipse 500px 300px at 20% 80%, rgba(37,99,235,.03), transparent);
}
```

---

## 7. Motion & animation

### 7.1 Timing table

| Interaction | Duration | Easing | Property |
|---|---|---|---|
| Press (`:active`) | 100ms | spring | `transform: scale(.97)` (buttons), `.94` (tabs), `.88` (icon buttons), `.99` (cards), or `opacity: .6` (text links) |
| Hover color / bg / gap | 150ms | spring | `color`, `background`, `gap`, `border-color` |
| Card lift / shadow | 250ms | spring | `transform: translateY(-4px)` + `shadow-lg` |
| Button hover lift | 150ms | spring | `translateY(-1px)` + colored glow |
| Tab pill slide | 250ms | spring | `transform` + `width` |
| Icon morph | 250ms | ease-in-out | `opacity`, `filter: blur`, `transform: scale` |
| Mobile drawer | 350ms | spring | `right` |
| Overlay | 200ms | ease | `fadeIn` |
| Scroll reveal | 600ms | spring | `opacity` + `translateY(30px → 0)` |
| Pulse (live dot) | 2s loop | ease | `opacity 1 → .7` |

**Magnitudes stay small:** lifts of 1–4px, presses of 1–6%, reveal travel of 30px. It should feel responsive without being showy.

### 7.2 Scroll reveal with stagger (`SectionReveal`)

Every content block on the site is wrapped in this component. It fades up once, when 10% of it is visible and at least 50px inside the viewport.

```jsx
import { useRef, useEffect, useState } from 'react';

const SectionReveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), reduced ? 0 : delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, reduced]);

  const travel = reduced ? '0' : '30px';
  const duration = reduced ? '0.2s' : '0.6s';

  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : `translateY(${travel})`,
      transition: `opacity ${duration} var(--ease-spring) ${delay}ms, transform ${duration} var(--ease-spring) ${delay}ms`,
    }}>
      {children}
    </div>
  );
};
```

**Stagger conventions:**
- Hero: badge 0 → title 100 → subtitle 200 → CTA 300ms.
- Grids: `delay={index * 100}` (features), `index * 120` (cards), `index * 150` (steps).
- Section header reveals first with delay 0, then its grid items stagger.

Vanilla/other frameworks: the same logic is an IntersectionObserver that adds a `.is-visible` class, with the delay passed via a `--delay` CSS variable.

### 7.3 Sliding segmented control (language switcher)

A white pill slides between options on a light-gray track. On first render and on resize, the pill **snaps** into place: transition off, set position, force reflow, transition back on. It only **animates** when the user picks a new option.

```html
<div class="t-tabs" role="tablist">
  <span class="t-tabs-pill"></span>
  <button class="t-tab" role="tab" aria-selected="true">EN</button>
  <button class="t-tab" role="tab" aria-selected="false">RU</button>
</div>
```

```css
:root { --tabs-dur: 250ms; --tabs-ease: cubic-bezier(0.22,1,0.36,1); }
.t-tabs { position: relative; display: inline-flex; gap: 3px; padding: 3px; border-radius: 48px; background: #f1f1f1; }
.t-tab {
  position: relative; z-index: 1; height: 30px; padding: 4px 12px; border-radius: 48px;
  background: transparent; color: rgba(15,15,15,.8);
  font-size: var(--font-size-sm); font-weight: 500;
  transition: color var(--tabs-dur) var(--tabs-ease);
}
.t-tab[aria-selected="true"], .t-tab:hover { color: #0f0f0f; }
.t-tab:active { transform: scale(.94); transition: transform var(--press-duration) var(--ease-spring); }
.t-tabs-pill {
  position: absolute; top: 3px; left: 0; height: 30px; width: 0; z-index: 0;
  background: #fff; border-radius: 48px; pointer-events: none;
  transition: transform var(--tabs-dur) var(--tabs-ease), width var(--tabs-dur) var(--tabs-ease);
  will-change: transform, width;
}
```

```js
function placePill(tabs, pill) {
  const active = tabs.querySelector('[aria-selected="true"]');
  if (!active) return;
  pill.style.transition = 'none';
  pill.style.transform = `translateX(${active.offsetLeft}px)`;
  pill.style.width = `${active.offsetWidth}px`;
  void pill.offsetHeight; // force reflow
  pill.style.transition = 'transform 250ms cubic-bezier(0.22,1,0.36,1), width 250ms cubic-bezier(0.22,1,0.36,1)';
}
// call on mount, when the selection changes, and on window resize
```

### 7.4 Icon morph (hamburger ↔ close)

Both icons are stacked in one grid cell. The one leaving blurs, shrinks, and fades while the one arriving does the reverse, so they cross-fade in place.

```html
<button class="t-icon-swap" data-state="a">
  <span class="t-icon" data-icon="a"><!-- Menu --></span>
  <span class="t-icon" data-icon="b"><!-- X --></span>
</button>
```

```css
.t-icon-swap { display: inline-grid; }
.t-icon-swap .t-icon {
  grid-area: 1 / 1;
  transition: opacity 250ms ease-in-out, filter 250ms ease-in-out, transform 250ms ease-in-out;
}
.t-icon-swap[data-state="a"] [data-icon="a"],
.t-icon-swap[data-state="b"] [data-icon="b"] { opacity: 1; filter: blur(0); transform: scale(1); }
.t-icon-swap[data-state="a"] [data-icon="b"],
.t-icon-swap[data-state="b"] [data-icon="a"] { opacity: 0; filter: blur(2px); transform: scale(.25); }
```

Reuse it for any two-state icon: play/pause, copy/check, heart/filled heart.

### 7.5 Keyframes

```css
@keyframes fadeInUp    { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
@keyframes fadeIn      { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: none; } }
@keyframes pulse       { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
@keyframes float       { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(20px); } }
```

### 7.6 Hover choreography inside cards

When a card is hovered, several things change together: the card lifts, its border darkens, the shadow grows, the icon tile turns blue (§6.5), and tags deepen from `primary-50` to `primary-100`. Style the children with `.card:hover .child { … }` so the whole card reacts as one unit.

### 7.7 Page transitions

There are no route animations. On every route change, `ScrollToTop` calls `window.scrollTo({ top: 0, behavior: 'smooth' })`, and the new page's `SectionReveal` blocks fade up. That combination does the job of a page transition.

---

## 8. Accessibility & preferences

These are built into the system. Keep them when porting.

```css
/* Reduced motion: keep a quick fade, drop travel and loops */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Higher contrast: darken the muted grays */
@media (prefers-contrast: more) {
  :root { --color-gray-500: #4B5563; --color-gray-400: #374151; }
}
```

- `SectionReveal` still fades under reduced motion (0.2s, no travel), so users get "gentler" motion rather than none.
- `.sr-only` utility for visually hidden labels.
- Segmented controls use `role="tablist"` / `role="tab"` / `aria-selected`. Icon-only buttons get `aria-label`.
- The `<html lang>` attribute is updated when the UI language changes.
- Custom scrollbar: 8px, `gray-100` track, `gray-300` pill thumb (`gray-400` on hover).

---

## 9. UX patterns

- **One primary action per view.** The hero has a single large CTA. Secondary actions are text links with arrows.
- **Progressive disclosure:** accordions for requirements, FAQs, and tabs on detail pages. Sticky sub-nav and sticky sidebars keep the next action in reach while reading.
- **Scan-friendly cards:** uppercase micro-labels above values, icons in front of metadata, key facts (score, free tuition, deadline) as colored chips.
- **Deadline urgency coloring:** neutral by default, amber when close, red when urgent, green when open or far away.
- **Filter UX:** live results count ("**12** universities"), a "Clear all" link in the filter header, and an empty state with a one-click reset.
- **Remembered preferences:** language is saved to `localStorage` and falls back to English per key when a translation is missing.
- **Stable IDs** on sections, cards, and CTAs (`id="hero-explore-btn"`, `id="university-auca"`) for analytics and testing.

---

## 10. Code conventions

- **BEM naming:** `.block`, `.block__element`, `.block--modifier` (e.g. `.uni-card__fav--active`). Page-level blocks are prefixed (`uni-page`, `sch-card`, `ort-*`, `unidet-*`).
- **One CSS file per component,** imported by that component. Globals live only in `globals.css`.
- **Tokens only:** use `var(--…)` for all color, space, radius, shadow, and timing values. Per-item data like gradients or icon tints goes in data objects and is applied with inline `style`.
- **Icons:** `lucide-react`, 14–18px inline with text, 24px in tiles, `strokeWidth={1.5}` for large decorative icons.
- **Reset:** `box-sizing: border-box`, zeroed margins, unstyled lists and links, `button`/`input` inherit the font with no border.

---

## 11. Porting checklist

1. Copy the `:root` tokens (§2) and the reset, utilities, keyframes, and accessibility blocks from `globals.css`.
2. Load Inter 400–800.
3. Swap the `--color-primary-*` scale and the hard-coded `rgba(37,99,235,…)` tints if the brand color changes.
4. Rebuild `Button` (§6.1) and `SectionReveal` (§7.2) first, since almost everything else depends on them.
5. Use the card recipe (§6) for every surface: border at rest, lift + shadow on hover, press on `:active`.
6. Add the fixed navbar (§6.7) with its tall-to-compact scroll states, reading-progress line and mobile drawer, plus the segmented control (§7.3) and icon morph (§7.4).
7. Keep the timing table (§7.1). Don't add new durations or easings without a reason.
8. Test with reduced motion, higher contrast, and reduced transparency turned on, and at 480 / 768 / 1024px.

### Known inconsistencies to clean up when porting

- `@keyframes pulse` is defined in both `globals.css` and `NotFoundPage.css`, and `slideInLeft` exists twice with different distances (24px vs 50px). Define each keyframe once.
- The 404 page uses `ease-out`/`ease-in-out` instead of `--ease-spring`.
- Some status colors are hard-coded hex values (`#DC2626`, `#D97706`, `#059669`, badge backgrounds). Consider adding `--color-danger-*` / `--color-warning-*` / `--color-success-*` scales.
- The language tabs use their own `--tabs-*` color variables (`#f1f1f1`, `#0f0f0f`) instead of the gray ramp. Map them to `gray-100` / `gray-900` for consistency.
