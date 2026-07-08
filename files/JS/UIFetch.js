document.addEventListener("DOMContentLoaded", () => {
    fetch('/UI.html')
        .then(response => response.text())
        .then(data => {
            // 1. Inject the HTML safely
            document.getElementById('UIContainer').innerHTML = data;

            // 2. Trigger the JSON updater now that elements exist in the DOM
            if (typeof checkJsonUpdateInfo === "function") {
                checkJsonUpdateInfo();
            } else {
                console.warn("Could not find checkJsonUpdateInfo function.");
            }

            // 3. Trigger the date script now that elements exist in the DOM
            if (typeof checkUpdateTime === "function") {
                checkUpdateTime();
            } else {
                console.warn("Could not find checkUpdateTime function.");
            }
        })
        .catch(error => console.error('Error loading the file:', error));
});

// REMOVED THE TWO EXTRA FUNCTION CALLS FROM HERE
