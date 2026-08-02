// 1. Locate this exact script tag on the page safely (case-insensitive fallback)
const currentScript = document.querySelector('script[src$="MasterScript.js"]') ||
    document.querySelector('script[src$="masterScript.js"]') ||
    document.querySelector('script[src$="master.js"]');

// 2. Helper function to check if a script is enabled (defaults to true if missing or null)
const isEnabled = (flagAttribute) => {
    if (!currentScript) return true;
    // Convert to lowercase because HTML data-attributes (like data-Updatechecker) 
    // are automatically read by JavaScript in pure lowercase if they have no dashes
    const cleanAttr = flagAttribute.toLowerCase();
    return currentScript.dataset[cleanAttr] !== "false";
};

// 3. Define the script configurations with dynamic imports
const scripts = [
    { name: 'Redirect', load: () => import('./Redirect.js') },      // 1. Check date/redirect immediately (Notice absolute '/' path)
    { name: 'Updatechecker', load: () => import('./Updatechecker.js') }, // 2. Check system updates
    { name: 'DateChanges', load: () => import('./DateChanges.js') },     // 3. Process calendar states
    { name: 'UIFetch', load: () => import('./UIFetch.js') },         // 4. Fetch/inject subfolder HTML safely
    { name: 'Sidebar', load: () => import('./Sidebar.js') }          // 5. Render secondary UI elements last
];

// 4. Load scripts sequentially using an async execution queue
async function initializeModules() {
    for (const script of scripts) {
        if (isEnabled(script.name)) {
            try {
                // await forces the script to fully run and finish before moving to the next one
                await script.load();
                console.log(`${script.name} module is active`);
            } catch (err) {
                console.error(`Error loading ${script.name}:`, err);
            }
        } else {
            console.log(`${script.name} module was explicitly disabled`);
        }
    }
}

// Kick off the strict order execution
initializeModules();