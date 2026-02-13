# Temporary Site Redesign Plan

## Goals
- Transform the 3-page temp site into a refined **editorial design with a Portuguese twist**.
- Achieve a premium, civic, trustworthy tone befitting a community organisation.
- Home splash must be **above-the-fold** on 360x800 (mobile) and 1366x768 (laptop).
- Maintain full accessibility (WCAG AA), dark mode, and performance.

## Non-Goals
- No CMS, build pipeline, or JS framework.
- No backend rewrite of `/delete-my-data/submit.php`.
- No legal-content rewrite beyond structure and readability improvements.
- No heavy JS animation or UI libraries.

## Design Principles
1. **Content-first** — strong typographic hierarchy, generous white space, readable line lengths.
2. **Portuguese twist (subtle)** — azulejo-inspired geometric borders/dividers, not kitsch decoration.
3. **Restrained colour** — brand greens/reds as small accents (rules, links, buttons, dots), never as aggressive saturation blocks.
4. **Editorial rhythm** — consistent spacing scale, balanced sections, classy section breaks.
5. **Minimal footprint** — static HTML/CSS/JS, modular styles, zero unnecessary dependencies.

## File map
- `index.html`: splash-only home layout (no header, footer links only).
- `privacy-policy/index.html`: editorial legal reading layout + generated anchor navigation.
- `delete-my-data/index.html`: editorial layout + accessible delete request form.
- `styles/tokens.css`: brand/neutrals, semantic colors, typography tokens, spacing tokens.
- `styles/base.css`: reset, base typography/elements, container helpers, focus and motion defaults.
- `styles/components.css`: motif utility, masthead/footer, links/buttons, form primitives.
- `styles/pages.css`: page-level layout rules for home/privacy/delete.
- `scripts/main.js`: shared init (year + privacy heading anchors + active TOC).
- `scripts/forms.js`: delete form validation, async submission, success/error handling.
- `docs/temp-site-redesign-plan.md`: implementation plan, palette output, QA checklists.
- `README.md`: maintenance note for contact links and placeholder copy.

## Phase 2: Palette output

### Asset note
- Logo assets are now sourced from `assets/png/logo.png` and `assets/png/logo-white.png`.
- Neutral extraction is based on logo-associated neutrals from the provided brand mark and expanded into editorial support tones.

### Core brand colors (guide)
- `#000000` (brand black)
- `#ff0000` (brand red)
- `#95ba3a` (green light)
- `#175e20` (green)
- `#0c3111` (green deep)

### Neutral scale (N0-N6)
- `N0: #f7f4ef`
- `N1: #ece6dd`
- `N2: #d7cdc0`
- `N3: #b3a798`
- `N4: #73695f`
- `N5: #4a5565`
- `N6: #1a1a1a`

### Semantic roles (light)
- `--color-bg: #f7f4ef`
- `--color-surface: #fffdf9`
- `--color-surface-soft: #ece6dd`
- `--color-text: #111111`
- `--color-text-muted: #3d4249`
- `--color-border: #c6bcaf`
- `--color-border-strong: #a79b8c`
- `--color-link: #175e20`
- `--color-link-hover: #0c3111`
- `--color-accent: #ff0000`
- `--color-focus: #c10000`
- `--color-danger: #b70000`
- `--color-success: #175e20`

### Semantic roles (dark)
- `--color-bg: #111714`
- `--color-surface: #171f1c`
- `--color-surface-soft: #1e2824`
- `--color-text: #f6f1e8`
- `--color-text-muted: #d3c8b8`
- `--color-border: #3f4843`
- `--color-border-strong: #707c74`
- `--color-link: #a9cf4f`
- `--color-link-hover: #c8e47e`
- `--color-accent: #ff4a4a`
- `--color-focus: #ff5c5c`
- `--color-danger: #ff5c5c`
- `--color-success: #95ba3a`

### Contrast notes (AA-oriented)
- Body text on primary backgrounds uses high-contrast pairings in both themes (dark-on-light and light-on-dark).
- Link colors were selected to remain distinguishable from body text while staying within the green brand family.
- Focus ring uses strong red contrast against both light and dark surfaces for keyboard visibility.
- Form error/success state colors are paired with bordered callouts, not color-only signaling.

## Phase 3: Typography system output
- Base/UI font: `Poppins` (`400`, `600`, `700`).
- Editorial heading font: `Cormorant Garamond` (`600`, `700`) from Google Fonts.
- Tokenized scale: `--step--1` through `--step-4` in `styles/tokens.css`.
- Line-height rules:
  - `--line-heading: 1.14`
  - `--line-body: 1.62`
- Reading measure targets:
  - General content: `--measure: 68ch`
  - Legal reading width cap: `--reading-max: 72ch`

## Implementation checklist status
1. Audit and baseline
- [x] Review current structure and reusable pieces.
- [x] Define shared primitives and modular architecture.

2. Palette and tokens
- [x] Apply brand core colors from guide.
- [x] Build neutral scale and semantic roles for light/dark.
- [x] Implement tokenized palette in `styles/tokens.css`.

3. Typography system
- [x] Keep Poppins as primary UI/body font.
- [x] Add one editorial serif for headings.
- [x] Implement scale, line heights, and reading measure tokens.

4. Shared UI system
- [x] Add azulejo-inspired motif utility.
- [x] Build reusable masthead/footer/button/form components.
- [x] Keep visible focus and reduced-motion support.

5. Page implementations
- [x] Home: no header, editorial splash, footer-only contact/legal links.
- [x] Privacy: editorial legal page with generated anchor TOC.
- [x] Delete: accessible form with front-end validation and state messaging.

6. JavaScript simplification
- [x] Consolidate shared behavior in `scripts/main.js`.
- [x] Move form behavior to `scripts/forms.js`.
- [x] Keep non-JS fallback form submission path.

7. QA and polish
- [x] JS lint pass (`npm run lint:js`).
- [x] Structural check: home has no header; pages reference only redesigned style/script modules.
- [ ] Manual viewport verification snapshots (`360x800`, `1366x768`).
- [ ] Final manual contrast spot-check in browser dev tools.

## QA checklist
- [x] Home has no header and footer contains contact/privacy links.
- [x] Privacy page uses shared visual system and constrained reading column.
- [x] Privacy page provides anchored section navigation for long content.
- [x] Delete page form has labels, required consent, and inline error text.
- [x] Success/error feedback is visible and announced via live regions.
- [x] All pages use tokenized palette and typography values.
- [x] Reduced-motion handling is present in base styles.
- [ ] Confirm no-scroll home behavior manually at `360x800` and `1366x768`.

## Acceptance checklist
- [x] Editorial redesign is materially different from prior template style.
- [x] Portuguese tile motif is subtle and reused consistently.
- [x] Brand red/green accents are restrained and purposeful.
- [x] Typography hierarchy feels editorial and trustworthy.
- [x] Footer/legal/contact treatment is consistent across pages.
- [x] Result remains static, lightweight, and easy to maintain.
