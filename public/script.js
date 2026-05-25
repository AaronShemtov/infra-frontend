// Vanilla JS — no framework, no build step. Three responsibilities:
//   1. Toggle individual experience blocks on header click / Enter / Space.
//   2. Collapse-all / Expand-all button at top of the experience list.
//   3. Theme switcher (dark/light) with localStorage persistence and OS-preference fallback.
//
// Kept intentionally readable: this is also a portfolio artifact, so I'd
// rather a recruiter see clean code than a one-line clever solution.

(function () {
    'use strict';

    // ---------- Individual experience toggle ----------

    const experiences = document.querySelectorAll('.experience');

    function setExpanded(article, expanded) {
        article.classList.toggle('expanded', expanded);
        const header = article.querySelector('.experience-header');
        if (header) {
            header.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
    }

    experiences.forEach(function (article) {
        const header = article.querySelector('.experience-header');
        if (!header) return;

        function toggle() {
            setExpanded(article, !article.classList.contains('expanded'));
            updateBulkButtonLabel();
        }

        header.addEventListener('click', toggle);
        // Keyboard accessibility — the header is role="button", tabindex=0,
        // so it needs to respond to Enter and Space the way a real button does.
        header.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    // ---------- Bulk collapse/expand button ----------

    const bulkBtn = document.getElementById('bulk-toggle');

    function updateBulkButtonLabel() {
        if (!bulkBtn) return;
        // If any one is collapsed, the button offers "Expand all"; otherwise "Collapse all".
        // This way the button always offers the action that's useful right now.
        const anyCollapsed = Array.from(experiences).some(function (e) {
            return !e.classList.contains('expanded');
        });
        bulkBtn.textContent = anyCollapsed ? 'Expand all' : 'Collapse all';
    }

    if (bulkBtn) {
        bulkBtn.addEventListener('click', function () {
            const anyCollapsed = Array.from(experiences).some(function (e) {
                return !e.classList.contains('expanded');
            });
            // If any are collapsed, expand all; otherwise collapse all.
            const targetExpanded = anyCollapsed;
            experiences.forEach(function (article) {
                setExpanded(article, targetExpanded);
            });
            updateBulkButtonLabel();
        });
    }

    // ---------- Theme switch ----------

    const themeToggle = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    const STORAGE_KEY = 'cv-theme';

    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            if (iconSun) iconSun.style.display = 'none';
            if (iconMoon) iconMoon.style.display = '';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (iconSun) iconSun.style.display = '';
            if (iconMoon) iconMoon.style.display = 'none';
        }
    }

    function detectInitialTheme() {
        // 1. Explicit user choice in localStorage wins.
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') return stored;
        } catch (e) {
            // localStorage can throw in private mode — ignore and fall through.
        }
        // 2. Otherwise follow OS preference.
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        // 3. Default dark.
        return 'dark';
    }

    applyTheme(detectInitialTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentLight = document.documentElement.getAttribute('data-theme') === 'light';
            const next = currentLight ? 'dark' : 'light';
            applyTheme(next);
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch (e) { /* ignore */ }
        });
    }
})();
