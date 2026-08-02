// Ensure this runs after DOM is ready so audio elements exist whether the script
// is included inline or injected dynamically by MasterScript.
(function () {
    function init() {
        // Select every <audio> tag on the page and set the volume to 20%
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => {
            audio.volume = 0.2;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
