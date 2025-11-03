const sidebar = document.querySelector(".sidebar")
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggler")
const themeToggleBtn = document.querySelector(".theme-toggle")
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector(".theme-icon") : null;
const searchForm = document.querySelector(".search-form");
// settings elements
const resetButton = document.getElementById("resetSettings");

resetButton.addEventListener("click", () => {
    // Clear ALL saved data in localStorage
    localStorage.clear();

    // Show a simple popup message
    alert("✅ Local storage emptied!");

    // Reload page to apply defaults again
    location.reload();
});



const overlay = document.getElementById("overlay");
const overlayContent = document.getElementById("overlayContent");

document.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".popout-enabled");

    if (clickedCard) {
        // Clone the card so we can modify it safely
        const clone = clickedCard.cloneNode(true);

        // Reveal any hidden info in the clone
        const hiddenInfo = clone.querySelector(".hidden-info");
        if (hiddenInfo) hiddenInfo.style.display = "block";

        // Insert the cloned card into the overlay
        overlayContent.innerHTML = "";
        overlayContent.appendChild(clone);

        // Activate overlay
        overlay.classList.add("active");
    }
});

// Click outside to close
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
        overlayContent.innerHTML = "";
    }
});



// updates the theme icon based on current theme and sidebar state
const updateThemeIcon = () => {
    const isDark = document.body.classList.contains("dark-theme");
    if (!themeIcon || !sidebar) return;
    themeIcon.textContent = sidebar.classList.contains("collapsed")
        ? (isDark ? "light_mode" : "dark_mode")
        : "dark_mode";
}

//apply saved theme on initial load
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = savedTheme ? (savedTheme === "dark") : systemPrefersDark;

document.body.classList.toggle("dark-theme", shouldUseDarkTheme);
updateThemeIcon();

// Toggle sidebar collapsed state on button click
sidebarToggleBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        updateThemeIcon();
    })
});

// Expand sidebar when search form is clicked
if (searchForm) {
    searchForm.addEventListener("click", () => {
        if (sidebar.classList.contains("collapsed")) {
            sidebar.classList.remove("collapsed");
            const input = searchForm.querySelector("input");
            if (input) input.focus(); // Focus the input
        }
    });
}

// Toggle between themes on theme button click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeIcon();
    });
}

if (window.innerWidth > 768) sidebar.classList.add("collapsed");

// ===== menu navigation =====
const menuLinks = document.querySelectorAll(".menu-link");
const contentSections = document.querySelectorAll(".content-section");

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

    // exit animation for current
    if (current) {
        current.classList.remove("active");
        // wait for its transition to finish (fade-out)
        await waitForTransition(current);
    }

    // enter animation for target
    target.classList.add("active");
    // optional: wait a tick so the browser applies the class for enter transition
    await Promise.resolve();
}

// attach handlers
menuLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        const sectionId = link.dataset.section;
        if (sectionId) await showSection(sectionId);
    });
});

// initialize view from the active menu item
const initial = document.querySelector(".menu-link.active");
if (initial && initial.dataset.section) showSection(initial.dataset.section);

// live filter + enter-to-navigate for search
if (searchForm) {
    const searchInput = searchForm.querySelector('input');
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    const menuLinks = Array.from(document.querySelectorAll('.menu-link'));

    const normalize = s => (s || '').trim().toLowerCase();

    const clearFilter = () => {
        menuItems.forEach(li => li.style.display = '');
        searchForm.classList.remove('no-result');
    };

    const filterMenu = (q) => {
        if (!q) return clearFilter();
        // if collapsed expand for easier picking
        if (sidebar && sidebar.classList.contains('collapsed')) sidebar.classList.remove('collapsed');

        let any = false;
        menuItems.forEach(li => {
            const link = li.querySelector('.menu-link');
            const label = normalize(link && (link.dataset.section || '') + ' ' + link.textContent);
            const matches = label.includes(q);
            li.style.display = matches ? '' : 'none';
            if (matches) any = true;
        });
        searchForm.classList.toggle('no-result', !any);
    };

    const findBestMatch = (q) => {
        if (!q) return null;
        q = normalize(q);
        // prefer exact data-section or exact visible label
        let match = menuLinks.find(l =>
            (l.dataset.section && normalize(l.dataset.section) === q) ||
            normalize(l.textContent) === q
        );
        // fallback partial match
        if (!match) {
            match = menuLinks.find(l =>
                (l.dataset.section && normalize(l.dataset.section).includes(q)) ||
                normalize(l.textContent).includes(q)
            );
        }
        return match || null;
    };

    const doSearch = () => {
        const q = normalize(searchInput.value);
        const match = findBestMatch(q);
        if (match) {
            match.click(); // uses existing click handler to show section
            searchInput.blur();
            clearFilter();
            searchInput.value = '';
        } else {
            searchForm.classList.add('no-result');
            setTimeout(() => searchForm.classList.remove('no-result'), 900);
        }
    };

    // live filter as user types
    searchInput.addEventListener('input', (e) => filterMenu(normalize(e.target.value)));

    // Enter -> go to matched tab; Escape -> clear
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            clearFilter();
            if (sidebar && !sidebar.classList.contains('collapsed')) {
                // optional: collapse back after clearing
            }
        }
    });

    // form submit as fallback
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        doSearch();
    });

    // Restore active section
    const savedSection = localStorage.getItem("active-section");
    if (savedSection) showSection(savedSection);

    // When a menu item is clicked, save the active section
    menuLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            menuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            const sectionId = link.dataset.section;
            if (sectionId) {
                localStorage.setItem("active-section", sectionId);
                await showSection(sectionId);
            }
        });
    });
}
// ===== Sidebar First-Time Behavior =====

// Check if the user has visited before
const hasVisited = localStorage.getItem("hasVisited");

// Open sidebar on first visit only
if (!hasVisited) {
    sidebar.classList.remove("collapsed");
    localStorage.setItem("hasVisited", "true"); // mark as visited
} else {
    sidebar.classList.add("collapsed");
}
updateThemeIcon();

// Collapse sidebar when clicking outside
document.addEventListener("click", (e) => {
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnToggle = Array.from(sidebarToggleBtn).some(btn => btn.contains(e.target));
    const isClickOnSearch = searchForm && searchForm.contains(e.target);

    // Collapse if clicking outside sidebar, toggle, or search
    if (!isClickInsideSidebar && !isClickOnToggle && !isClickOnSearch) {
        if (!sidebar.classList.contains("collapsed")) {
            sidebar.classList.add("collapsed");
            updateThemeIcon();
        }
    }
});


// Save active section when clicked
menuLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const sectionId = link.dataset.section;
        if (sectionId) {
            localStorage.setItem("active-section", sectionId);
            await showSection(sectionId);
        }
    });
});

// ===== Remember and Restore Active Section =====
menuLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const sectionId = link.dataset.section;
        if (sectionId) {
            localStorage.setItem("active-section", sectionId);
            await showSection(sectionId);
        }
    });
});

// Restore last active section OR default to "home"
const savedSection = localStorage.getItem("active-section");
const defaultSection = "home"; // <-- your default section ID
const sectionToShow = savedSection || defaultSection;

// Update sidebar link styling
menuLinks.forEach(l => {
    l.classList.toggle("active", l.dataset.section === sectionToShow);
});

// Show the correct section
showSection(sectionToShow);
