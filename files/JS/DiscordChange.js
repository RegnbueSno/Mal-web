const MalsElement = document.querySelector(".mals-widget");
console.log(MalsElement);
const RegsElement = document.querySelector(".regs-widget");
console.log(RegsElement);

let time = 30;
time = time * 1000; // Convert seconds to milliseconds

const active = false;

setInterval(() => {
    if (!active) return; // Only run if the script is active
    if (!MalsElement || !RegsElement) return;

    // Check which one is currently hidden
    const isMalsHidden = MalsElement.classList.contains("widget-off");

    if (isMalsHidden) {
        // Show Mals first, then hide Regs
        MalsElement.classList.remove("widget-off");
        setTimeout(() => {
            RegsElement.classList.add("widget-off");
        }, 300); // 300ms delay eliminates the empty gap
    } else {
        // Show Regs first, then hide Mals
        RegsElement.classList.remove("widget-off");
        setTimeout(() => {
            MalsElement.classList.add("widget-off");
        }, 300);
    }
}, time);
