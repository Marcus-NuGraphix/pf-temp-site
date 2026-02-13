import { initDeleteMyDataForm } from './forms.js';

document.documentElement.classList.add('has-js');

function initYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = year;
  });
}

function initThemeToggle() {
  const toggles = Array.from(document.querySelectorAll('[data-theme-toggle]')).filter((node) => node instanceof HTMLButtonElement);
  if (toggles.length === 0) {
    return;
  }

  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'site-theme';

  const getSystemTheme = () => (mediaQuery.matches ? 'dark' : 'light');

  const readStoredTheme = () => {
    try {
      const value = localStorage.getItem(storageKey);
      if (value === 'light' || value === 'dark') {
        return value;
      }
    } catch {
      // no-op
    }

    return '';
  };

  const saveTheme = (value) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // no-op
    }
  };

  const applyTheme = (value) => {
    if (value === 'light' || value === 'dark') {
      root.setAttribute('data-theme', value);
      return;
    }

    root.removeAttribute('data-theme');
  };

  const getActiveTheme = () => {
    const explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') {
      return explicit;
    }

    return getSystemTheme();
  };

  const updateThemeLogos = () => {
    const activeTheme = getActiveTheme();
    const logos = Array.from(document.querySelectorAll('[data-theme-logo]')).filter((node) => node instanceof HTMLImageElement);
    logos.forEach((logo) => {
      const lightSrc = logo.getAttribute('data-src-light') || '';
      const darkSrc = logo.getAttribute('data-src-dark') || '';
      const nextSrc = activeTheme === 'dark' ? darkSrc : lightSrc;
      if (nextSrc && logo.getAttribute('src') !== nextSrc) {
        logo.setAttribute('src', nextSrc);
      }
    });
  };

  const updateUi = () => {
    const activeTheme = getActiveTheme();
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    const text = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';

    toggles.forEach((toggle) => {
      toggle.setAttribute('aria-label', `Switch to ${text.toLowerCase()}`);
      toggle.setAttribute('title', `Switch to ${text.toLowerCase()}`);
      const label = toggle.querySelector('[data-theme-toggle-label]');
      if (label instanceof HTMLElement) {
        label.textContent = text;
      }
    });

    updateThemeLogos();
  };

  applyTheme(readStoredTheme());
  updateUi();

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      saveTheme(nextTheme);
      updateUi();
    });
  });

  const syncSystemTheme = () => {
    if (readStoredTheme()) {
      return;
    }

    updateUi();
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', syncSystemTheme);
  } else if (typeof mediaQuery.addListener === 'function') {
    mediaQuery.addListener(syncSystemTheme);
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function initPolicyToc() {
  const tocRoot = document.querySelector('[data-policy-toc]');
  const contentRoot = document.querySelector('[data-policy-content]');
  if (!(tocRoot instanceof HTMLOListElement) || !(contentRoot instanceof HTMLElement)) {
    return;
  }

  const headings = Array.from(contentRoot.querySelectorAll('h2'));
  if (headings.length === 0) {
    return;
  }

  const used = new Set();
  const entries = headings.map((heading) => {
    const base = heading.id || slugify(heading.textContent || 'section');
    let id = base || 'section';
    let suffix = 2;
    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(id);
    heading.id = id;

    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = heading.textContent || id;
    li.append(link);
    tocRoot.append(li);

    return { heading, link };
  });

  const setActive = (id) => {
    entries.forEach((entry) => {
      if (entry.heading.id === id) {
        entry.link.setAttribute('aria-current', 'true');
      } else {
        entry.link.removeAttribute('aria-current');
      }
    });
  };

  setActive(entries[0].heading.id);

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (observerEntries) => {
      const visible = observerEntries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const top = visible[0].target;
        if (top instanceof HTMLElement) {
          setActive(top.id);
        }
      }
    },
    {
      rootMargin: '-18% 0px -65% 0px',
      threshold: [0, 1],
    }
  );

  entries.forEach((entry) => observer.observe(entry.heading));
}

function initSite() {
  initYear();
  initThemeToggle();
  initPolicyToc();
  initDeleteMyDataForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}
