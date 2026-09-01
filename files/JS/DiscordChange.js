const MalsElement = document.querySelector(".mals-widget");
const RegsElement = document.querySelector(".regs-widget");
const button = document.getElementById('widget-toggle-btn');
const buttonSpan = document.getElementById("widget-button-span");
const element = document.getElementById('widget-container-main');
console.groupCollapsed("DiscordElements");
if (MalsElement) {
    console.log("MalsElement found");
}
if (RegsElement) {
    console.log("RegsElement found");
}
if (button) {
    console.log("Button found");
}
if (element) {
    console.log("Element found");
}

console.groupEnd("DiscordElements");
let time = 30;
time = time * 1000; // Convert seconds to milliseconds
console.log(`Interval set to ${time} milliseconds`);

const active = false;

function toggleDiscord() {
    console.log("Toggling Discord widget visibility");
    element.classList.toggle('closed');
    if (element.classList.contains('closed')) {
        buttonSpan.textContent = 'open_in_full';
        element.classList.add("closed");
        console.log("Widget closed");
    } else {
        buttonSpan.textContent = 'close';
        element.classList.remove("closed");
        console.log("Widget opened");

    }
}

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
        }, 100); // 300ms delay eliminates the empty gap
    } else {
        // Show Regs first, then hide Mals
        RegsElement.classList.remove("widget-off");
        setTimeout(() => {
            MalsElement.classList.add("widget-off");
        }, 100);
    }
}, time);

document.getElementById("widget-toggle-btn").addEventListener("click", toggleDiscord);