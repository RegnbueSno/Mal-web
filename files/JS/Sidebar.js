
function toggleSidebar() {
    const title = document.getElementById("title");
    if (title) {
        title.classList.toggle("open");
    }
    const logo = document.getElementById("malsLogo");
    if (logo) {
        logo.classList.toggle("open");
    }
    const sidebar = document.getElementById("my-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
    const toggleButton = document.getElementById("toggle-button");
    if (toggleButton) {
        toggleButton.classList.toggle("open");
    }
    const sidebarNav = document.getElementById("sidebar-nav");
    if (sidebarNav) {
        sidebarNav.classList.toggle("open");
    }
    // Changed to querySelectorAll (note the dot for the class name)
    const sidebarContent = document.querySelectorAll(".sidebar-choice");
    sidebarContent.forEach(choice => {
        choice.classList.toggle("open");
    });
    

}

