(function () {
    // Expose config for other scripts
    const exposeConfig = (cfg) => {
        window.AppConfig = cfg;
        // Minimal dataset hints for styling or debug
        if (document.body) {
            document.body.dataset.env = cfg?.env?.name || 'unknown';
            if (cfg?.content) {
                Object.entries(cfg.content).forEach(([k, v]) => {
                    document.body.dataset[`content${k.charAt(0).toUpperCase() + k.slice(1)}`] = v;
                });
            }
        }
    };

    const applyBadge = (cfg) => {
        const badge = document.querySelector('.version-badge');
        if (!badge) return;
        if (cfg?.version) badge.textContent = `Last Updated: ${cfg.version}`;
        const parts = [];
        if (cfg?.type) parts.push(`type: ${cfg.type}`);
        if (cfg?.build?.number) parts.push(`build #${cfg.build.number}`);
        if (cfg?.build?.dateISO) parts.push(new Date(cfg.build.dateISO).toLocaleString());
        if (cfg?.build?.commit) parts.push(cfg.build.commit);
        badge.title = parts.join(' • ');
    };

    const applyDefaults = (cfg) => {
        // Theme default only if not previously saved
        if (cfg?.ui?.themeDefault && !localStorage.getItem('theme')) {
            const val = cfg.ui.themeDefault === 'dark' ? 'dark' : 'light';
            localStorage.setItem('theme', val);
        }
        // Default section only if not previously saved
        if (cfg?.ui?.defaultSection && !localStorage.getItem('active-section')) {
            localStorage.setItem('active-section', cfg.ui.defaultSection);
        }
        // Sidebar collapsed default hint (used by app code if reading localStorage)
        if (typeof cfg?.ui?.sidebarCollapsed === 'boolean' && !localStorage.getItem('hasVisited')) {
            // First-time hint preserved in existing logic
            localStorage.setItem('hasVisited', 'true');
        }
    };

    const applyFeatureToggles = (cfg) => {
        const features = cfg?.features || {};
        // Search toggle – safe because app checks for element before wiring
        if (features.enableSearch === false) {
            const sf = document.querySelector('.search-form');
            if (sf) sf.style.display = 'none';
        }
        // Debug UI: simple outline indicator
        if (features.debugUI) {
            document.documentElement.style.outline = '2px dashed #ff00a0';
        }
    };

    const applyLinks = (cfg) => {
        const links = cfg?.links || {};
        Object.entries(links).forEach(([key, url]) => {
            const el = document.querySelector(`[data-config-link="${key}"]`);
            if (el && url) {
                // Special handling for GitHub issue reporter
                if (key === 'reportBug') {
                    el.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Build a rich URL with context
                        const section = localStorage.getItem('active-section') || 'unknown';
                        const theme = localStorage.getItem('theme') || 'unspecified';
                        const version = cfg?.version || 'unknown';
                        const env = cfg?.env?.name || 'unknown';
                        const title = encodeURIComponent(`[${env}] Bug in section: ${section}`);
                        const body = encodeURIComponent(
                            `### Description\n\n<Describe the issue>\n\n### Context\n- Version: ${version}\n- Theme: ${theme}\n- Section: ${section}\n- URL: ${location.href}\n- User-Agent: ${navigator.userAgent}\n\n### Steps to Reproduce\n1. \n2. \n3. \n\n### Expected\n\n### Actual\n`);
                        const labels = encodeURIComponent('bug');
                        const finalUrl = `${url}?title=${title}&body=${body}&labels=${labels}`;
                        window.open(finalUrl, '_blank', 'noopener,noreferrer');
                    });
                } else {
                    // Attach cache-bust if provided
                    const finalUrl = cfg?.cacheBust ? `${url}${url.includes('?') ? '&' : '?'}cb=${cfg.cacheBust}` : url;
                    el.setAttribute('href', finalUrl);
                }
            }
        });
    };

    fetch('version.json', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('version.json not found')))
        .then(cfg => {
            exposeConfig(cfg);
            applyBadge(cfg);
            applyDefaults(cfg);
            applyFeatureToggles(cfg);
            applyLinks(cfg);
            // Optional maintenance banner
            if (cfg?.status?.maintenance) {
                const banner = document.createElement('div');
                banner.textContent = cfg?.status?.message || 'Site under maintenance';
                banner.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:10px 16px;background:#c0392b;color:#fff;z-index:1000;text-align:center;';
                document.body.appendChild(banner);
            }
        })
        .catch(() => {
            // Fallback: no config – leave defaults
        });
})();
