# Portuguese Forum Temporary Holding Site

Temporary production-ready static site for `https://portugueseforum.org.za/`.

## Stack
- Static `HTML/CSS/JS`
- `PHP` endpoint for delete requests: `/delete-my-data/submit.php`
- Apache `.htaccess` rules for HTTPS, redirects, headers, and caching

## Required Routes
- `/`
- `/privacy-policy/`
- `/delete-my-data/`
- `/delete-my-data/submit.php`

Legacy redirects:
- `/privacy-policy.html` -> `/privacy-policy/`
- `/delete-my-data.html` -> `/delete-my-data/`

## Design System

The site uses an **editorial design with a Portuguese twist**:

- **Typography**: Cormorant Garamond (serif headings) + Poppins (body/UI) via Google Fonts.
- **Palette**: Warm neutral scale with brand green/red accents. Light and dark mode via CSS variables.
- **Motif**: Subtle azulejo-inspired tile pattern applied via `.azulejo-motif` CSS class.
- **Tokens**: All design values (colours, spacing, type scale) are in `/styles/tokens.css`.

### Style architecture
| File | Purpose |
|------|---------|
| `styles/tokens.css` | Design tokens: palette, typography, spacing, motion |
| `styles/base.css` | Reset, base elements, container, utilities |
| `styles/components.css` | Masthead, footer, buttons, forms, panels, tile motif |
| `styles/pages.css` | Page-specific layout (home splash, privacy, delete) |

## Updating Contact Links and Placeholder Copy

**Contact links** appear in:
- `index.html` (home footer)
- `privacy-policy/index.html` (footer)
- `delete-my-data/index.html` (footer)

Current values from `site.config.json`:
- Email: `info@portugueseforum.org.za`
- Delete email: `delete@portugueseforum.org.za`
- Phone: `086 111 1126`
- Facebook: `https://www.facebook.com/groups/portugueseforumsa`
- Instagram: `https://www.instagram.com/portugueseforum/`

**To update contact links**: edit the `<a href="...">` values in the footer sections of each HTML file.

**To update splash copy**: edit the `<h1>` and `<p class="splash-lead">` in `index.html`.

**To update page intros**: edit the `<h1>`, `.editorial-lead`, and `.meta-line` elements in the editorial-intro section of each content page.

**Form endpoint** must remain `action="/delete-my-data/submit.php"` unless backend routing changes.

## Deployment (xneelo-style shared hosting)
1. Upload files to `public_html/`.
2. Keep root `.htaccess` and `.data/.htaccess` in place.
3. Ensure SSL is active.
4. Configure mail forwarding for:
   - `delete@portugueseforum.org.za`
   - `info@portugueseforum.org.za`
5. Verify `POST /delete-my-data/submit.php` sends mail and returns JSON.

## Local Testing
- Static preview: `python -m http.server 8080`
- PHP testing: `php -S localhost:8080`

See `docs/PORTUGUESE_FORUM_TEMP_SITE.md` for full deployment and pre-launch checklist.
