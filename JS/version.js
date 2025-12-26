(function () {
    const badge = document.querySelector('.version-badge');
    if (!badge) return;
    fetch('version.json', { cache: 'no-store' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('version.json not found')))
        .then(data => {
            if (data && data.version) badge.textContent = `v${data.version}`;
        })
        .catch(() => {
            // Fallback: keep existing text
        });
})();
