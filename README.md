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
