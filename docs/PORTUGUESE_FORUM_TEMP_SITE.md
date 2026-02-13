# Portuguese Forum Temporary Site

## Purpose
Temporary production-ready holding site for `https://portugueseforum.org.za/` while the full platform rebuild is in progress.

This version keeps the required legal and compliance endpoints online, remains lightweight (static HTML/CSS/JS + one PHP handler), and is compatible with shared Apache + PHP hosting.

## Route Overview
- `/`
  - Under-construction splash page.
  - Includes primary contact details and links to legal/compliance pages.
- `/privacy-policy/`
  - Live privacy policy content retained from the current Portuguese Forum site.
  - Includes `Last Updated: 05 February 2025` and delete-form reference.
- `/delete-my-data/`
  - Delete request form (same-origin POST to `/delete-my-data/submit.php`).
- `/delete-my-data/submit.php`
  - PHP endpoint for deletion requests.
  - JSON response only.
- Legacy redirects (301):
  - `/privacy-policy.html` -> `/privacy-policy/`
  - `/delete-my-data.html` -> `/delete-my-data/`

## Hosting and Security Notes
- `.htaccess` enforces:
  - HTTP -> HTTPS
  - canonical host redirect to `portugueseforum.org.za`
  - legacy redirects
  - security headers (`CSP`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
  - no-store cache policy for HTML/PHP
  - short cache policy for static assets
- `/.data/.htaccess` denies web access to fallback storage.
- `robots.txt` currently disallows indexing for this temporary phase.
- `sitemap.xml` includes:
  - `https://portugueseforum.org.za/`
  - `https://portugueseforum.org.za/privacy-policy/`
  - `https://portugueseforum.org.za/delete-my-data/`

## Delete Request Handler Summary
`/delete-my-data/submit.php` includes:
- Required-field validation (`full_name`, `email`, `request_details`, `confirmation`).
- Authoritative server-side checks.
- Honeypot check (`company`).
- Minimum submit time check (`submitted_at`).
- IP rate-limiting backed by `.data/rate-limit` with temp-dir fallback.
- Header-injection defenses.
- JSON responses:
  - success: `{ "ok": true, "referenceId": "..." }`
  - failure: `{ "ok": false, "error": "..." }`
- Mail routing:
  - To: `delete@portugueseforum.org.za`
  - From: `no-reply@portugueseforum.org.za`
  - Reply-To: requester email

## xneelo-Style Deployment Steps
1. Confirm SSL is active for `portugueseforum.org.za`.
2. Upload repository web files to domain `public_html/` (keep folder structure intact).
3. Ensure the uploaded `.htaccess` remains in web root.
4. Ensure `.data/.htaccess` is uploaded with `.data/rate-limit/` directory.
5. Confirm PHP mail is available on hosting package.
6. Test endpoints:
   - `GET /`
   - `GET /privacy-policy/`
   - `GET /delete-my-data/`
   - `POST /delete-my-data/submit.php`

## Mail Forwarding Requirement
Configure mailbox/forwarding in hosting control panel:
- `delete@portugueseforum.org.za` -> operational inbox(es) for privacy team.
- `info@portugueseforum.org.za` -> main communication inbox.
- `no-reply@portugueseforum.org.za` should exist as valid sender identity.

Recommended: keep forwarding at domain level so form destination can remain stable even if internal team inboxes change.

## Placeholder Asset Notes
Current logo assets are PNG:
- `assets/png/logo.png`
- `assets/png/logo-white.png`
- `assets/png/` is the active source for logo references in page markup and config.
- `assets/favicon.ico` (optional refresh)

## Local Testing
- Static-only preview:
  - `python -m http.server 8080`
  - Useful for checking HTML/CSS/JS and links.
- PHP handler testing:
  - Python server does **not** execute PHP.
  - Use PHP built-in server instead:
    - `php -S localhost:8080`

## Pre-Launch Checklist
- [ ] All required routes resolve with `200`.
- [ ] Legacy redirects return `301` to trailing-slash routes.
- [ ] HTTP requests redirect to HTTPS.
- [ ] Canonical host redirect behaves correctly.
- [ ] Delete form submits and returns JSON success/failure correctly.
- [ ] Mail delivery reaches `delete@portugueseforum.org.za`.
- [ ] `From` and `Reply-To` headers verified in received email.
- [ ] Rate-limit behavior verified (multiple rapid submissions).
- [ ] `robots.txt` still disallows indexing for temporary phase.
- [ ] `sitemap.xml` URLs are correct and reachable.
- [ ] No residual legacy/template branding references remain in repo.
