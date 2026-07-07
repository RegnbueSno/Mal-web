
function toggleSidebar() {
    const title = document.getElementById("title");
    title.classList.toggle("open");
    const logo = document.getElementById("malsLogo");
    logo.classList.toggle("open");
    const sidebar = document.getElementById("my-sidebar");
    sidebar.classList.toggle("open");
    const toggleButton = document.getElementById("toggle-button");
    toggleButton.classList.toggle("open");
    const sidebarNav = document.getElementById("sidebar-nav");
    sidebarNav.classList.toggle("open");
    // Changed to querySelectorAll (note the dot for the class name)
    const sidebarContent = document.querySelectorAll(".sidebar-choice");
    sidebarContent.forEach(choice => {
        choice.classList.toggle("open");
    });
    

}

