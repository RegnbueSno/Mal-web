const classOpen = "open"
function toggleSidebar() {
    const title = document.getElementById("title");
    if (title) {
        title.classList.toggle(classOpen);
    }
    const logo = document.getElementById("malsLogo");
    if (logo) {
        logo.classList.toggle(classOpen);
    }
    const sidebar = document.getElementById("my-sidebar");
    if (sidebar) {
        sidebar.classList.toggle(classOpen);
    }
    const toggleButton = document.getElementById("toggle-button");
    if (toggleButton) {
        toggleButton.classList.toggle(classOpen);
    }
    const sidebarNav = document.getElementById("sidebar-nav");
    if (sidebarNav) {
        sidebarNav.classList.toggle(classOpen);
    }
    const mobileSidebarToggle = document.getElementById("mobile-toggle-button")
    if (mobileSidebarToggle) {
        mobileSidebarToggle.classList.toggle(classOpen);
    }
    const updateTime = document.getElementById("updateContainer")
    if (updateTime) {
        updateTime.classList.toggle(classOpen);
    }
    // Changed to querySelectorAll (note the dot for the class name)
    const sidebarContent = document.querySelectorAll(".sidebar-choice");
    sidebarContent.forEach(choice => {
        choice.classList.toggle(classOpen);
    });
    

}

