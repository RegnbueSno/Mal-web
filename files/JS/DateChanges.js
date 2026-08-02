import { dateString, month, getDailyElement } from './utils.js';

// Export for module consumers, and also expose globally for scripts injected as modules
export function checkUpdateTime() {

    const images = document.querySelectorAll('.RegImg');
    console.log('Images found after fetch injection:', images.length);

    images.forEach(img => {
        let image;
        if (dateString === '03-01') {
            image = 'Birthday.png';
        } else if (dateString === '05-17') {
            const chs = ['Regnbue.png', 'Flag.png'];
            image = getDailyElement(chs);
        } else if (dateString === '02-14') {
            const chs = ['Flower.png', 'Kiss.png'];
            image = getDailyElement(chs);
        } else if (month === '10') {
            const chs = ['Halloween.png', 'Autumn.png', 'Fire.png'];
            image = getDailyElement(chs);
        } else if ((month === '09') || (month === '11')) {
            image = 'Autumn.png';
        } else if (month === '12') {
            const chs = ['Christmas.png', 'Staryeye.png'];
            image = getDailyElement(chs);
        } else {
            const chs = ['Regnbue.png', 'Staryeye.png', 'Main.png'];
            image = getDailyElement(chs);
        }

        const fallbackPath = '/files/Imgs/placeholder.png';

        // VALIDATION INJECTION: Catch broken paths immediately when they try to render
        img.onerror = function () {
            console.warn(
                `Image path not found: ${this.src}. \nReverting to fallback.\n%cFallback Path: %c${fallbackPath}`,
                'color: lightgreen; font-weight: bold;', // Styles "Fallback Path: "
                'color: lightblue; font-weight: bold;'    // Styles the variable content
            );
            this.onerror = null; // Disconnect listener to prevent an infinite loop if fallback also fails
            this.src = fallbackPath;
        };

        if (image) {
            img.src = '/files/Imgs/Reg/' + image;
        } else {
            img.src = '/files/Imgs/placeholder.png'; // Fallback image
            console.error('No image found for the current date. \nvariable dateString: ' + dateString + '\nvariable image: ' + image);
        }
    });
}

// Expose globally for non-module consumers (UIFetch expects this to exist on window)
try {
    window.checkUpdateTime = checkUpdateTime;
} catch (e) {
    // ignore in restricted environments
}

// Ensure any initialization that needs DOM runs after ready — none needed here because
// checkUpdateTime is invoked by UIFetch after injection. Still keep pattern for safety.
(function () {
    function init() {
        // no-op
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
