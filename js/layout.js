/**
 * layout.js — Single source of truth for the site header and footer.
 *
 * Usage in each page:
 *   <div id="site-header"></div>
 *   <div id="site-footer"></div>
 *   <script src="js/layout.js"></script>
 *   <script>
 *     initLayout([
 *       { href: '#papers', label: 'research', delay: 'delay2', icon: 'uil-corner-down-right' },
 *       { href: '/misc.html', label: 'misc.', delay: 'delay4', icon: 'uil-external-link-alt', external: true },
 *       { href: 'https://theoretickles.netlify.app/', label: 'Blog', delay: 'delay5', icon: 'uil-external-link-alt', external: true },
 *       { href: './assets/SagnikCV.pdf', label: 'CV', delay: 'delay5', icon: 'uil-download-alt', download: true },
 *     ]);
 *   </script>
 *
 * Nav item shape:
 *   { href, label, delay, icon, external?, download? }
 *   external: true  → opens in new tab, uses external-link icon style
 *   download: true  → uses download icon, also opens in new tab
 */

// ── Social icons (unified set from both pages) ────────────────────────────────
const SOCIAL_ICONS = [
  {
    href: 'https://dblp.org/pid/279/3927.html',
    title: 'DBLP',
    svg: `<svg style="color:currentColor" class="bi bi-dblp" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>dblp</title>
      <path d="M3.075.002c-.096.013-.154.092-.094.31L4.97 7.73 3.1 8.6s-.56.26-.4.85l2.45 9.159s.16.59.72.33l6.169-2.869 1.3-.61s.52-.24.42-.79l-.01-.06-1.13-4.22-.658-2.45-.672-2.49v-.04s-.16-.59-.84-1L3.5.141s-.265-.16-.425-.139zM18.324 5.03a.724.724 0 0 0-.193.06l-5.602 2.6.862 3.2 1.09 4.08.01.06c.05.47-.411.79-.411.79l-1.88.87.5 1.89.04.1c.07.17.28.6.81.91l6.95 4.269s.68.41.52-.17l-1.981-7.4 1.861-.86s.56-.26.4-.85L18.85 5.42s-.116-.452-.526-.39z" fill="#5e81ac"></path>
    </svg>`
  },
  {
    href: 'https://scholar.google.com/citations?hl=en&user=TVzLYlAAAAAJ&view_op=list_works&sortby=pubdate',
    title: 'Google Scholar',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 23 23">
      <path d="M12 2L0 7l12 5 10-4.17V17h2V7L12 2zm0 11L4 9.5V15c0 2.76 3.58 5 8 5s8-2.24 8-5V9.5L12 13z" fill="#5e81ac"/>
    </svg>`
  },
  {
    href: 'https://orcid.org/0000-0001-9003-1676',
    title: 'ORCID',
    svg: `<svg class="bi bi-orcid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z" fill="#5e81ac"></path>
    </svg>`
  },
  {
    href: 'https://github.com/chatsagnik',
    title: 'GitHub',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-github" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" fill="#5e81ac"/>
    </svg>`
  },
  {
    href: 'https://qubit-social.xyz/web/@chatsagnik',
    title: 'Mastodon',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-mastodon" viewBox="0 0 24 24">
      <path d="M1.004 7.879c0 6.197-.347 13.894 5.559 15.486 2.132.574 3.964.696 5.438.61 2.674-.15 4.175-.969 4.175-.969l-.09-1.977s-1.911.61-4.059.54c-2.127-.075-4.37-.235-4.717-2.892a5.514 5.514 0 0 1-.047-.745c4.507 1.12 8.349.488 9.408.359 2.954-.359 5.528-2.212 5.855-3.905.515-2.667.474-6.508.474-6.508 0-5.206-3.353-6.733-3.353-6.733-3.291-1.537-12.029-1.521-15.288 0-.002.002-3.355 1.528-3.355 6.734zm4.923-2.667c1.363-1.548 4.201-1.65 5.465.327l.611 1.044.611-1.044c1.269-1.987 4.112-1.864 5.465-.327 1.248 1.463.969 2.838.969 9.373H16.593V8.469c0-2.662-3.369-2.764-3.369.369v3.348h-2.437V8.838c0-3.133-3.369-3.031-3.369-.369v6.117H4.959c0-6.54-.274-7.922.968-9.374z" fill="#5e81ac"/>
    </svg>`
  },
  {
    href: 'https://twitter.com/chatsagnik',
    title: 'Twitter',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-twitter" viewBox="0 0 16 16">
      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" fill="#5e81ac"/>
    </svg>`
  },
  {
    href: 'https://www.linkedin.com/in/chatsagnik/',
    title: 'LinkedIn',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi bi-linkedin" viewBox="0 0 16 16">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" fill="#5e81ac"/>
    </svg>`
  }
];

// ── CV version cache-busting (Task 3) ─────────────────────────────────────────
const CV_URL = './assets/SagnikCV.pdf';
const CV_FALLBACK_VERSION = '?v=2026-03';

function fetchCvVersion() {
  return fetch(CV_URL, { method: 'HEAD' })
    .then(function (res) {
      const lastModified = res.headers.get('Last-Modified');
      if (!lastModified) return CV_FALLBACK_VERSION;
      const d = new Date(lastModified);
      if (isNaN(d.getTime())) return CV_FALLBACK_VERSION;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return '?v=' + yyyy + '-' + mm;
    })
    .catch(function () {
      return CV_FALLBACK_VERSION;
    });
}

// ── Header builder ────────────────────────────────────────────────────────────
function buildHeader(navItems, cvVersion) {
  // Inject CV version into any nav item flagged as download
  const items = navItems.map(function (item) {
    if (item.download) {
      return Object.assign({}, item, { href: item.href + cvVersion });
    }
    return item;
  });

  const navLis = items.map(function (item) {
    const target = (item.external || item.download)
      ? 'target="_blank" rel="noopener noreferrer me"'
      : '';
    return `<li class="navitem ${item.delay || ''}">
        <a href="${item.href}" ${target}>
          <span aria-hidden="true" class="nav-icon">
            <i class="uil ${item.icon}"></i>/</span>${item.label}
        </a>
      </li>`;
  }).join('\n');

  return `<header class="primary-header flex">
    <button class="mobile-nav-toggle" aria-controls="navul" aria-expanded="false">
      <span class="sr-only">Menu</span>
      <div id="menu" class="hamburgerMenu">
        <div id="bar1" class="bar"></div>
        <div id="bar2" class="bar"></div>
        <div id="bar3" class="bar"></div>
      </div>
    </button>
    <div class="herotext delay1">
      <a href="/index.html">Sagnik</a>
    </div>
    <nav>
      <ul id="navul" role="list" class="primary-navigation flex" data-visible="false">
        ${navLis}
      </ul>
    </nav>
    <button
      id="theme-toggle-btn"
      class="theme-toggle"
      aria-label="Switch to dark mode"
      onclick="toggleTheme()">
      <i class="uil uil-moon"></i>
    </button>
  </header>`;
}

// ── Footer builder ────────────────────────────────────────────────────────────
function buildFooter() {
  const links = SOCIAL_ICONS.map(function (icon) {
    return `<a href="${icon.href}" target="_blank" rel="noopener noreferrer me" title="${icon.title}" style="color:currentColor;">
      ${icon.svg}
    </a>`;
  }).join('\n');

  return `<footer class="footer">
    <div class="footer-socials socials">
      ${links}
    </div>
  </footer>`;
}

// ── Hamburger toggle (moved from resources.js) ────────────────────────────────
function initNavToggle() {
  const primaryNav = document.querySelector('.primary-navigation');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const hamMenu = document.querySelector('.hamburgerMenu');
  const primaryHeader = document.querySelector('.primary-header');

  if (!primaryNav || !navToggle) return;

  // Set scroll padding
  const navHeight = document.querySelector('.navitem')
    ? document.querySelector('.navitem').offsetHeight
    : 0;
  document.documentElement.style.setProperty('--scroll-padding', navHeight + 'px');

  navToggle.addEventListener('click', function () {
    const visible = primaryNav.getAttribute('data-visible');
    if (visible === 'false') {
      primaryNav.setAttribute('data-visible', 'true');
      navToggle.setAttribute('aria-expanded', 'true');
      hamMenu.classList.add('change');
    } else {
      primaryNav.setAttribute('data-visible', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
      hamMenu.classList.remove('change');
    }
  });

  // Scroll-watcher for sticky shadow
  if (primaryHeader) {
    const scrollWatcher = document.createElement('div');
    scrollWatcher.setAttribute('data-scroll-watcher', '');
    primaryHeader.before(scrollWatcher);

    const navObserver = new IntersectionObserver(function (entries) {
      if (window.matchMedia('(min-width: 851px)').matches) {
        primaryHeader.classList.toggle('sticking', !entries[0].isIntersecting);
      }
    });
    navObserver.observe(scrollWatcher);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
function initLayout(navItems) {
  // 1. Apply theme immediately (before header renders to avoid flash)
  if (typeof window.toggleTheme === 'undefined') {
    // theme.js not loaded separately — inline a minimal version
    (function () {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  }

  // 2. Render footer immediately (no async dependency)
  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.outerHTML = buildFooter();

  // 3. Fetch CV version then render header
  fetchCvVersion().then(function (cvVersion) {
    const headerEl = document.getElementById('site-header');
    if (headerEl) {
      headerEl.outerHTML = buildHeader(navItems, cvVersion);
    }
    // 4. Wire up nav toggle after header is in DOM
    initNavToggle();
    // 5. Sync theme toggle button icon with current theme
    if (typeof window.toggleTheme !== 'undefined') {
      const theme = document.documentElement.getAttribute('data-theme') || 'light';
      const btn = document.getElementById('theme-toggle-btn');
      if (btn) {
        btn.querySelector('i').className = theme === 'dark' ? 'uil uil-sun' : 'uil uil-moon';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      }
    }
  });
}

// ── mytoggle: abstract/citation expander (must stay globally available) ───────
window.mytoggle = function (iden) {
  var x = document.getElementById(iden);
  if (!x) return;
  x.style.display = x.style.display === 'block' ? 'none' : 'block';
};
