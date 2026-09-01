import { dateString, dateSeed, getDailyElement } from './utils.js';

// Wrap redirect logic so it behaves the same when loaded dynamically
(function () {

    function rickroll() {
        // SAFETY CHECK: Prevent redirecting if the browser is already on the target URL
        if (window.location.pathname !== "/xBadtShict" && !window.location.href.includes("/xBadtShict")) {
            // window.location.replace() prevents the user from getting stuck in a back-button loop
            window.location.replace('/xBadtShict');
            console.log("Redirecting to April Fools' destination:", '/xBadtShict');
        } else {
            console.log('Loop intercepted: Already at the target destination:', '/xBadtShict');
        }
    }

    function startCatClickSound() {
        document.addEventListener("click", function () {
            var sound = document.getElementById("clickSound");
            if (sound) {
                sound.currentTime = 0; // Rewinds the audio to the start
                sound.play();
            }
        });
    }

    function malrankow() {
        const originMatches = window.location.href === 'https://malden.gg/Home/';

        if (originMatches) {
            const el = document.getElementById('HomeTitle');
            if (el) {
                el.textContent = 'Mal has reached Champion 1 in Overwatch!!';
                console.log('HomeTitle updated for malden.gg/Home');
            } else {
                console.log('HomeTitle element not found on malden.gg/Home');
            }
        }
    }

    function flip() {
        document.body.style.transform = 'scaleX(-1)';
        document.body.style.transformOrigin = 'center top';
    }

    function reset() {
        // FIX: Check the CURRENT browser path instead of document.referrer
        // Normalize pathname (removes trailing slashes and forces lowercase)
        const currentPath = window.location.pathname.replace(/\/$/, "").toLowerCase();

        // If the path is empty or just "/" it means they are on the root index (malden.gg)
        if (currentPath === "" || currentPath === "/" || currentPath === "/xbadtshict") {
            console.log('Not April 1st or leaving prank page, redirecting to Home.');
            let destinationURL = '/Home';

            if (window.location.pathname !== destinationURL && !window.location.href.includes(destinationURL)) {
                window.location.replace(destinationURL);
            } else {
                console.log('Loop intercepted: Already at the target destination:', destinationURL);
            }
        }
    }

    function init() {
        // Kept for logging context, though no longer breaking the redirect rules
        const incomingLink = document.referrer;
        console.log('Incoming link:', incomingLink);

        if (dateString === '04-01') {
            let trolls = ["Malrankow", "Rickroll", "flip", "Cat"];
            let check = getDailyElement(trolls);

            if (check == "Rickroll") {
                rickroll();
                console.log('Date is 04-01, executed today\'s troll:', check);
            } else if (check == "Malrankow") {
                malrankow();
                console.log('Date is 04-01, executed today\'s troll:', check);
                reset();
            } else if (check == "flip") {
                flip();
                console.log('Date is 04-01, executed today\'s troll:', check);
                reset();
            } else if (check == "Cat") {
                startCatClickSound();
                console.log('Date is 04-01, executed today\'s troll:', check);
                reset();
            }
        } else {
            // Only reset if it is NOT April 1st
            reset();
        }
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
