// Run safely whether this file is loaded before or after DOMContentLoaded.
(function () {
    async function loadJsonFile() {
        try {
            const response = await fetch('/files/Json/Info.json');
            if (!response.ok) throw new Error('Network response was not ok');

            const jsonObject = await response.json();
            return jsonObject;
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    }

    async function checkJsonUpdateInfo() {
        const container = document.getElementById('updateContainer');
        const jsonObject = await loadJsonFile();

        if (container && jsonObject && jsonObject['updated']) {
            container.textContent = `Last Updated: ${jsonObject['updated']}`;
        }
    }

    // Expose globally so scripts loaded as modules can still call this function
    try {
        window.checkJsonUpdateInfo = checkJsonUpdateInfo;
    } catch (e) {
        // In restricted environments, ignore
    }

    function init() {
        // If any immediate behavior is needed on load, call it here.
        // Otherwise exposing the function is sufficient for UIFetch to call later.
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
