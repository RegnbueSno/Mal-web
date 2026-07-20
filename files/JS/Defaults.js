// Selects every <audio> tag on the page
const allAudio = document.querySelectorAll('audio');

// Loop through each element and set the volume to 40%
allAudio.forEach(audio => {
    audio.volume = 0.2;
});