// ===== Select main elements =====
const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggler");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector(".theme-icon") : null;
const searchForm = document.querySelector(".search-form");

// ===== Settings: Reset button =====
const resetButton = document.getElementById("resetSettings");
resetButton.addEventListener("click", () => {
    localStorage.clear();
    alert("✅ Local storage emptied!");
    location.reload();
});

// ===== Overlay functionality =====
const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

document.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".popout-enabled");
    if (clickedCard) {
        const clone = clickedCard.cloneNode(true);
        const hiddenInfo = clone.querySelector(".hidden-info");
        if (hiddenInfo) hiddenInfo.style.display = "block";
        overlayContent.innerHTML = "";
        overlayContent.appendChild(clone);
        overlay.classList.add("active");
    }
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
        overlayContent.innerHTML = "";
    }
});

// ===== Theme icon update =====
const updateThemeIcon = () => {
    if (!themeIcon || !sidebar) return;
    const isDark = document.body.classList.contains("dark-theme");
    const isCollapsed = sidebar.classList.contains("collapsed");
    themeIcon.textContent = (isCollapsed && isDark) ? "light_mode" : "dark_mode";
};

// ===== Image theme swap =====
const malsLogos = document.querySelectorAll("[id='malsLogo']");
const images = {
    light: "Imgs/Logo/Regular_PNG.png",
    dark: "Imgs/Logo/Mals_Den_dark_mode.png"
};
function updateThemeImages() {
    const isDark = document.body.classList.contains("dark-theme");
    malsLogos.forEach(img => {
        img.src = isDark ? images.dark : images.light;
    });
}

// ===== Apply saved theme on load =====
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme ? (savedTheme === "dark") : systemPrefersDark;
document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();
updateThemeImages(); // set correct image on load

// ===== Sidebar toggle =====
sidebarToggleBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon();
    });
});

if (window.innerWidth > 768) sidebar.classList.add("collapsed");

// ===== Theme toggle button =====
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeIcon();
        updateThemeImages(); // swap images immediately
    });
}

// ===== Menu navigation =====
const menuLinks = document.querySelectorAll(".menu-link");
const contentSections = document.querySelectorAll(".content-section");

// Track current active link to prevent race conditions
let currentActiveLink = null;
let lastClickTime = 0;
const CLICK_COOLDOWN = 600; // milliseconds

function waitForTransition(el, timeout = 500) {
    return new Promise(resolve => {
        if (!el) return resolve();
        const onEnd = (e) => {
            if (e.target !== el) return;
            el.removeEventListener("transitionend", onEnd);
            clearTimeout(timer);
            resolve();
        };
        const timer = setTimeout(() => {
            el.removeEventListener("transitionend", onEnd);
            resolve();
        }, timeout);
        el.addEventListener("transitionend", onEnd);
    });
}

async function showSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const current = document.querySelector(".content-section.active");
    if (current === target) return;

    if (current) {
        current.classList.remove("active");
        await waitForTransition(current);
    }

    target.classList.add("active");
    console.log(`[WEB]: Changed to "${id}"`);
    await Promise.resolve();
}

// attach handlers
menuLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
        // Allow external links (e.g., report bug) to bypass SPA handler
        if (link.dataset.external === 'true') {
            return;
        }
        e.preventDefault();
        e.stopImmediatePropagation(); // Stop other handlers from firing

        // Check if clicking the same link that's already active
        if (currentActiveLink === link) {
            console.log(`[WEB]: Already on "${link.dataset.section}"`);
            return;
        }

        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        // Block clicks during cooldown period - don't modify anything
        if (timeSinceLastClick < CLICK_COOLDOWN) {
            console.log(`[WEB]: Navigation blocked - cooldown active (${CLICK_COOLDOWN - timeSinceLastClick}ms remaining)`);
            return; // Exit completely without changing any classes
        }

        // Update timestamp immediately
        lastClickTime = now;

        // Disable all menu links physically
        menuLinks.forEach(l => l.style.pointerEvents = "none");

        // Store current active link
        currentActiveLink = link;

        // Update visuals synchronously BEFORE async operations
        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const sectionId = link.dataset.section;
        if (sectionId) {
            localStorage.setItem("active-section", sectionId);
            await showSection(sectionId);
        }

        // Re-enable clicks after cooldown
        setTimeout(() => {
            menuLinks.forEach(l => l.style.pointerEvents = "");
        }, CLICK_COOLDOWN);
    });
});

// initialize view from the active menu item
const initial = document.querySelector(".menu-link.active");
if (initial && initial.dataset.section) showSection(initial.dataset.section);

// live filter + enter-to-navigate for search
if (searchForm) {
    const searchInput = searchForm.querySelector('input');
    const menuItems = document.querySelectorAll('.menu-item');
    const normalize = s => (s || '').trim().toLowerCase();

    const clearFilter = () => {
        menuItems.forEach(li => li.style.display = '');
        searchForm.classList.remove('no-result');
    };

    const filterMenu = (q) => {
        if (!q) return clearFilter();
        if (sidebar?.classList.contains('collapsed')) sidebar.classList.remove('collapsed');

        let hasMatch = false;
        menuItems.forEach(li => {
            const link = li.querySelector('.menu-link');
            const text = normalize(`${link?.dataset.section || ''} ${link?.textContent || ''}`);
            const matches = text.includes(q);
            li.style.display = matches ? '' : 'none';
            if (matches) hasMatch = true;
        });
        searchForm.classList.toggle('no-result', !hasMatch);
    };

    const findBestMatch = (q) => {
        if (!q) return null;
        q = normalize(q);
        return Array.from(menuLinks).find(l =>
            normalize(l.dataset.section) === q || normalize(l.textContent) === q
        ) || Array.from(menuLinks).find(l =>
            normalize(l.dataset.section).includes(q) || normalize(l.textContent).includes(q)
        );
    };

    const doSearch = () => {
        const match = findBestMatch(searchInput.value);
        if (match) {
            match.click();
            searchInput.value = '';
            searchInput.blur();
            clearFilter();
        } else {
            searchForm.classList.add('no-result');
            setTimeout(() => searchForm.classList.remove('no-result'), 900);
        }
    };

    // When the search icon/button is clicked, ensure the sidebar is expanded and focus the input
    const searchIcon = searchForm.querySelector('span');
    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            // Prevent default form-related behavior
            e.preventDefault();
            if (sidebar?.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                updateThemeIcon();
            }
            // Focus and select the input so the user can start typing immediately
            if (searchInput) {
                searchInput.focus();
                try { searchInput.select(); } catch (err) { /* ignore if not supported */ }
            }
        });
    }

    searchInput.addEventListener('input', (e) => filterMenu(normalize(e.target.value)));
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            clearFilter();
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        doSearch();
    });
}

// ===== Sidebar first-time behavior =====
const hasVisited = localStorage.getItem("hasVisited");
if (!hasVisited) {
    sidebar.classList.remove("collapsed");
    localStorage.setItem("hasVisited", "true");
} else {
    sidebar.classList.add("collapsed");
}

// Collapse sidebar when clicking outside
document.addEventListener("click", (e) => {
    const isOutsideClick = !sidebar.contains(e.target) &&
        !Array.from(sidebarToggleBtn).some(btn => btn.contains(e.target)) &&
        !(searchForm?.contains(e.target));

    if (isOutsideClick && !sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed");
        updateThemeIcon();
    }
});

// ===== Restore last active section OR default to "home" =====
const savedSection = localStorage.getItem("active-section");
const defaultSection = "home";
const sectionToShow = savedSection || defaultSection;

menuLinks.forEach(l => {
    l.classList.toggle("active", l.dataset.section === sectionToShow);
});

showSection(sectionToShow);
