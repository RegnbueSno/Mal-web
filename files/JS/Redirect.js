import {dateString, dateSeed, getDailyElement } from './utils.js';

// Wrap redirect logic so it behaves the same when loaded dynamically
(function () {

    function rickroll() {
        // window.location.replace() prevents the user from getting stuck in a back-button loop
        // SAFETY CHECK: Prevent redirecting if the browser is already on the target URL
        if (window.location.pathname !== destinationURL && !window.location.href.includes(destinationURL)) {
            // window.location.replace() prevents the user from getting stuck in a back-button loop
            window.location.replace('/xBadtShict');
            console.log("Redirecting to April Fools' destination:", '/xBadtShict');
        } else {
            console.log('Loop intercepted: Already at the target destination:', '/xBadtShict');
        }
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

    function reset(incomingLink) {
        if (incomingLink == 'https://malden.gg' || incomingLink == 'https://malden.gg/xBadtShict/') {
            console.log('Not April 1st, redirecting to Home.');
            let destinationURL = '/Home'
            if (window.location.pathname !== destinationURL && !window.location.href.includes(destinationURL)) {
                // window.location.replace() prevents the user from getting stuck in a back-button loop
                window.location.replace(destinationURL);
            } else {
                console.log('Loop intercepted: Already at the target destination:', destinationURL);
            }
        }
    }

    function init() {

        const incomingLink = document.referrer;
        console.log('Incoming link:', incomingLink);
        if (dateString === '04-01') {
            let trolls = ["Malrankow", "Rickroll", "flip"];
            let check = getDailyElement(trolls);
            if (check == "Rickroll") {
                rickroll();
                console.log('Date is 04-01, executed today\'s troll:', check);
            } else if (check == "Malrankow") {
                malrankow();
                console.log('Date is 04-01, executed today\'s troll:', check);
                reset(incomingLink)
            } else if (check == "flip") {
                flip();
                console.log('Date is 04-01, executed today\'s troll:', check);
                reset(incomingLink)
            } else {
                reset(incomingLink)
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

