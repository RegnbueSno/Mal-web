document.addEventListener("DOMContentLoaded", () => {
    fetch('/UI.html')
        .then(response => response.text())
        .then(data => {
            // 1. Inject the UI layout structure cleanly
            document.getElementById('UIContainer').innerHTML = data;

            // 2. Safely trigger the json updater now that elements exist
            if (typeof checkUpdateTime === "function") {
                checkUpdateTime();
            }
        })
        .catch(error => console.error('Error loading the file:', error));
});
