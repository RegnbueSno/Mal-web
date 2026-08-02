// Ensure this runs whether DOMContentLoaded already fired or not.
// When scripts are injected dynamically after the event, adding a listener
// alone would miss the event. Use a ready-check and run immediately if needed.
(function () {
    function loadUI() {
        fetch('/UI.html')
            .then(response => response.text())
            .then(data => {
                // 1. Inject the HTML safely
                const container = document.getElementById('UIContainer');
                if (!container) {
                    console.warn('UIContainer element not found.');
                    return;
                }
                container.innerHTML = data;

                // 2. Trigger the JSON updater now that elements exist in the DOM
                if (typeof checkJsonUpdateInfo === 'function') {
                    checkJsonUpdateInfo();
                } else {
                    console.warn('Could not find checkJsonUpdateInfo function.');
                }

                // 3. Trigger the date script now that elements exist in the DOM
                if (typeof checkUpdateTime === 'function') {
                    checkUpdateTime();
                } else {
                    console.warn('Could not find checkUpdateTime function.');
                }
            })
            .catch(error => console.error('Error loading the file:', error));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadUI);
    } else {
        loadUI();
    }
})();
