const MalsElement = document.querySelector(".mals-widget");
const RegsElement = document.querySelector(".regs-widget");
const button = document.getElementById('widget-toggle-btn');
const buttonSpan = document.getElementById("widget-button-span");
const element = document.getElementById('widget-container-main');
const logo = document.getElementsByClassName('widget-button-logo')[0];
const malimg = document.getElementById("malimg");
const regimg = document.getElementById("regimg");

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
if (logo) {
    console.log("Logo found");
}

console.groupEnd("DiscordElements");
let time = 30;
time = time * 1000; // Convert seconds to milliseconds
console.log(`Interval set to ${time} milliseconds`);

const active = true;

function toggleDiscord() {
    console.log("Toggling Discord widget visibility");
    element.classList.toggle('closed');
    if (element.classList.contains('closed')) {
        buttonSpan.classList.add('non-display');
        logo.classList.remove('non-display');
        element.classList.add("closed");
        malimg.classList.add("closed");
        regimg.classList.add("closed");
        console.log("Widget closed");
    } else {
        buttonSpan.classList.remove('non-display');
        logo.classList.add('non-display');
        element.classList.remove("closed");
        malimg.classList.remove("closed");
        regimg.classList.remove("closed");
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
        malimg.classList.remove("non-display");
        RegsElement.classList.add("widget-off");
        regimg.classList.add("non-display");
    } else {
        // Show Regs first, then hide Mals
        RegsElement.classList.remove("widget-off");
        regimg.classList.remove("non-display");
        MalsElement.classList.add("widget-off");
        malimg.classList.add("non-display");
        
    }
}, time);

document.getElementById("widget-toggle-btn").addEventListener("click", toggleDiscord);