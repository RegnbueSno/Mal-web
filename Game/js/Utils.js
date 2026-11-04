
//#regions saving and loading game state

/**
 * Ensures the global gameState object exists and is populated with 
 * baseline properties if anything is missing.
 */
function validateGameState() {
    // 1. If gameState doesn't exist globally at all, create it from the blueprint baseline
    if (typeof gameState === 'undefined' || !gameState) {
        initializeFreshState(chosenStory || "DefaultStory");
        return;
    }

    // 2. Ensure critical properties exist so engine tracks progress without throwing errors
    if (!gameState.sceneID) {
        gameState.sceneID = "Starting Scene";
    }

    // Enforce STRICTLY uppercase objects. Remove all lowercase mappings.
    if (!gameState.Items) {
        gameState.Items = {};
    }
    if (!gameState.Flags) {
        gameState.Flags = {};
    }

    // 🟩 ARRAY PROTECTION: Force structural persistence for endings registry matrix
    if (!gameState.Endings || !Array.isArray(gameState.Endings)) {
        gameState.Endings = [];
    }
}
function saveGameState(storyName) {
    if (!storyName) {
        log('error', 'saving', "Failed to save gameState: story identifier namespace is missing.");
        return;
    }

    validateGameState();

    // Create a clean deep clone of your state
    const cleanSaveData = JSON.parse(JSON.stringify(gameState));

    // 🟩 FIX: Removed the delete operations since cleanSaveData.items / flags no longer exist

    localStorage.setItem(storyName, JSON.stringify(cleanSaveData));
    log('log', 'saving', `Saved gameState for slot [${storyName}]:`, cleanSaveData);
}


/**
 * Funksjon for å laste inn spilltilstanden fra localStorage.
 */
function loadGameState(storyName) {
    if (!storyName) {
        log('error', 'loading', "Failed to load gameState: story identifier namespace is missing.");
        return false;
    }

    const savedDataString = localStorage.getItem(storyName);

    if (savedDataString) {
        try {
            const rawData = JSON.parse(savedDataString);
            gameState = cleanFetchedJson(rawData, gameStateBlueprint);

            validateGameState();
            log('log', 'loading', `Loaded and verified gameState for slot [${storyName}]:`, gameState);
            return true; // 🟩 Successfully found data
        } catch (err) {
            log('error', 'loading', `Failed to parse localStorage data for slot [${storyName}]:`, err);
            return false;
        }
    }
    return false; // 🟩 No save found, needs fresh baseline parameters
}


function initializeFreshState(storyName) {
    // 1. Build the fresh uppercase object baseline cleanly with Endings tracking included
    gameState = {
        version: 0,
        story: storyName || "",
        sceneID: "Starting Scene",
        Items: {},
        Flags: {},
        Endings: [] // 🟩 Initialized as empty array
    };

    // 2. Validate standard layout variables
    validateGameState();

    // 3. Return the state object so Game.js can safely use it immediately
    return gameState;
}

//#endregion

function saveJSON(filename, data) {
    try {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
        log('log','saving', "Saved file:", filename);
    } catch (e) {
        log('error','saving', "Failed to save file:", e);
    }
}

/**
 * Reads a local file sequentially, sanitizes it, and returns the validated object.
 * Can be called programmatically from anywhere in your code.
 * @param {File} file - The file object obtained from an input element or drag-and-drop.
 * @param {Object} blueprint - The structural blueprint template to validate against.
 * @returns {Promise<Object|null>} The cleaned object data, or null if loading failed.
 */
async function loadJSONFile(file, blueprint) {
    if (!file) {
        log('warn', 'loading', "No file provided to loadJSONFile.");
        return null;
    }

    try {
        // Pauses execution here until the browser finishes reading the file
        const textContent = await file.text();

        // Execution resumes step-by-step
        const rawData = JSON.parse(textContent);

        // Protect your code: sanitize the uploaded JSON before returning it
        const verifiedData = cleanFetchedJson(rawData, blueprint);

        log('log', 'loading', `File "${file.name}" loaded sequentially and structural verification complete.`);

        // 🟩 UPDATE UI: Refresh the top-right display list immediately with the newly loaded backup items
        if (typeof updateInventoryUI === 'function') {
            updateInventoryUI();
        }

        return verifiedData;
    } catch (err) {
        log('error', 'loading', `Failed to parse or validate file "${file.name}":`, err);
        return null;
    }
}
const fileInput = document.getElementById('saveFileInput');
const statusText = document.getElementById("fileStatusText");

if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
        // 🟩 FIX: Target index [0] to get the file object, not the FileList array container
        const file = event.target.files[0];
        if (!file) {
            if (statusText) statusText.textContent = "No JSON file loaded";
            return;
        }

        if (statusText) statusText.textContent = file.name;
        log('log', 'loading', `Reading uploaded backup profile: "${file.name}"`);

        // Pass the file instance straight into your sequential text reader utility
        const loadedData = await loadJSONFile(file, gameStateBlueprint);

        if (loadedData) {
            gameState = loadedData;
            window.gameState = loadedData; // Synchronize window layer variables

            if (window.gameState && window.gameState.story) {
                chosenStory = window.gameState.story;
                localStorage.setItem('lastActiveStory', chosenStory);

                // Commit straight into localStorage parameters tracking slot
                localStorage.setItem(chosenStory, JSON.stringify(window.gameState));
                log('log', 'loading', "Save data successfully imported to disk. Reloading interface...");

                location.reload();
            } else {
                if (statusText) statusText.textContent = "Error: Missing story identifier property.";
            }
        } else {
            if (statusText) statusText.textContent = "Error: Invalid save blueprint format.";
        }
    });
}
//#region Debugging functions
const debugs = document.getElementsByClassName('debug');
let debugShown = false;

function logDebugElem() {
    for (let i = 0; i < debugs.length; i++) {
        log('log', debugs[i]);
    }
}

const Debug = {
    Toggle() {
        if (debugShown) {
            Debug.Disable();
        } else {
            Debug.Enable();
        }
    },
    Enable() {
        if (!debugShown) {
            for (let i = 0; i < debugs.length; i++) {
                debugs[i].removeAttribute('hidden');
            }
            debugShown = true;
            return 'Debug unlocked';
        } else {
            return 'Debug already shown';
        }
    },

    Disable() {
        if (debugShown) {
            for (let i = 0; i < debugs.length; i++) {
                debugs[i].setAttribute('hidden', '');
            }
            debugShown = false;
            return 'Debug hidden';
        } else {
            return 'Debug already hidden';
        }
    },

    Loging: {
        Disable(config = 'global') {
            if (config && loggingConfig[config] !== undefined) {
                if (loggingConfig[config]) {
                    loggingConfig[config] = false;
                    return 'Logging disabled';
                }
            }
            return 'Invalid logging config';
        },
        Enable(config = 'global') {
            if (config && loggingConfig[config] !== undefined) {
                if (!loggingConfig[config]) {
                    loggingConfig[config] = true;
                    return 'Logging enabled';
                }
            }
            return 'Invalid logging config';
        },
        Toggle(config = 'global') {
            if (config && loggingConfig[config] !== undefined) {
                loggingConfig[config] = !loggingConfig[config];
                return loggingConfig[config] ? 'Logging enabled' : 'Logging disabled';
            }
            return 'Invalid logging config';
        }
    }
};



function log(method, feature, ...messages) {
    if (!loggingConfig.global) return;

    // SMART CHECK: Is the first argument actually a valid console method?
    let activeMethod = 'log';
    if (typeof console[method] === 'function') {
        activeMethod = method;
    } else {
        // If 'method' isn't a valid console function, treat it as a feature or message
        // by pushing it back down the argument chain.
        if (feature !== undefined && feature !== null) {
            messages.unshift(feature);
        }
        feature = method;
    }

    let currentFeature = 'global';
    // SMART CHECK: Is the second argument actually one of our defined features?
    if (feature in loggingConfig) {
        currentFeature = feature;
    } else {
        // If it's NOT a feature, then 'feature' is actually the first message!
        // We put it back at the front of the messages array.
        if (feature !== undefined && feature !== null) {
            messages.unshift(feature);
        }
    }

    // Check if this feature is allowed to log
    if (loggingConfig[currentFeature] === false) return;

    // CAPTURE LINE NUMBER: Grab the stack trace and find the caller line
    let callerInfo = '';
    try {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            // Index 0: Error label
            // Index 1: This current log() function
            // Index 2: The actual place where log() was called
            const callerLine = stackLines[2] || '';

            // Clean up the string to extract just the file, line, and column
            const match = callerLine.match(/(?:\(|\s)(https?:\/\/|file:\/\/|\/|\.)([^)]+)(?:\)|$)/);
            if (match) {
                callerInfo = `[${match[2]}] `;
            } else {
                callerInfo = `[${callerLine.trim()}] `;
            }
        }
    } catch (e) {
        // Fallback if stack tracing fails
    }

    if (currentFeature !== 'global') {
        console[activeMethod](`${callerInfo}[${currentFeature.toUpperCase()}]\n`, ...messages);
    } else {
        console[activeMethod](callerInfo, ...messages);
    }
}



//#endregion

//#region The cleaning function
/**
 * Recursively sanitizes and validates an object against a blueprint definition.
 * Properly processes complex wildcard zones and multi-layered configurations.
 * 
 * @param {Object} target - The raw data object to clean.
 * @param {Object} blueprint - The structural template/rules to validate against.
 * @returns {Object} A fresh, structurally verified object matching the blueprint.
 */
function cleanFetchedJson(target, blueprint) {
    if (!target || typeof target !== 'object' || Array.isArray(target)) {
        return {};
    }

    let cleaned = {};

    // Check if the current level of this blueprint layer contains a generic wildcard fallback rule
    const blueprintHasWildcard = blueprint && blueprint.hasOwnProperty("*");
    const wildcardRule = blueprintHasWildcard ? blueprint["*"] : null;

    // 1. ANCHOR ROUTINE: Loop over the BLUEPRINT rules to enforce configuration structure
    for (let key in blueprint) {
        if (!blueprint.hasOwnProperty(key) || key === "*") continue;

        // Skip safely if the target JSON object simply doesn't contain this optional choice/bubble index
        if (!target.hasOwnProperty(key)) continue;

        let targetVal = target[key];
        let blueprintVal = blueprint[key];

        // 🟩 NESTED WILDCARD CHECK: If a sub-object is an explicit placeholder map like {"*": true}, allow all matching targets through instantly!
        if (blueprintVal && typeof blueprintVal === 'object' && blueprintVal.hasOwnProperty("*") && blueprintVal["*"] === true) {
            if (typeof targetVal === 'object' && targetVal !== null && !Array.isArray(targetVal)) {
                cleaned[key] = { ...targetVal }; // Pass the dynamic custom items/flags data block directly!
            }
            continue;
        }

        // Deep Sub-Object Recursive Validation
        if (typeof blueprintVal === 'object' && blueprintVal !== null) {
            // 🟩 ARRAY INTERCEPT RULE: Handle ending milestone data structures accurately
            if (Array.isArray(blueprintVal)) {
                if (Array.isArray(targetVal)) {
                    cleaned[key] = [...targetVal];
                } else {
                    cleaned[key] = [];
                }
                continue;
            }

            if (typeof targetVal === 'object' && targetVal !== null && !Array.isArray(targetVal)) {
                cleaned[key] = cleanFetchedJson(targetVal, blueprintVal);
            } else {
                log('warn', 'cleaning', `[REMOVED] Type mismatch at "${key}": Expected nested object.`);
            }
            continue;
        }

        // Primitive String Type Verification
        if (typeof blueprintVal === 'string') {
            if (typeof targetVal === blueprintVal) {
                cleaned[key] = targetVal;
            } else {
                log('warn', 'cleaning', `[REMOVED] Type mismatch at "${key}": Expected ${blueprintVal}.`);
            }
            continue;
        }

        // Primitive Custom Direct Rule Validation
        if (blueprintVal === true) {
            cleaned[key] = targetVal;
            continue;
        }

        // General Primitive Type Mappings
        if (typeof blueprintVal === typeof targetVal) {
            cleaned[key] = targetVal;
        } else {
            log('warn', 'cleaning', `[REMOVED] Type mismatch at "${key}": Expected type ${typeof blueprintVal}.`);
        }
    }

    // 2. ROOT WILDCARD FALLBACK ZONE: Capture dynamic scene maps and dynamic room IDs
    if (blueprintHasWildcard) {
        for (let key in target) {
            if (!target.hasOwnProperty(key) || cleaned.hasOwnProperty(key)) continue;

            let targetVal = target[key];
            if (wildcardRule === true || wildcardRule === '*') {
                cleaned[key] = targetVal;
            } else if (typeof wildcardRule === 'object' && wildcardRule !== null) {
                cleaned[key] = cleanFetchedJson(targetVal, wildcardRule);
            }
        }
    }

    return cleaned;
}

//#endregion

//#region fadetoggle logic
/**
 * Toggles the fade visibility of an element and waits for its fade animation to finish.
 * @param {HTMLElement} el - The DOM element to fade.
 * @param {boolean} hide - True to fade out/hide, False to fade in/show.
 * @returns {Promise} Resolves when the fade transition ends.
 */
function fadeToggle(el, hide) { 
    return new Promise((resolve) => {
        if (!el) { resolve(); return; }

        // Redundant state check: Don't animate hiding an already hidden element
        if (hide && el.hasAttribute('hidden')) {
            resolve();
            return;
        }

        // Auto-apply the CSS transition style directly to the element if not already present
        if (!el.style.transition.includes('opacity')) {
            el.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        }

        function callback(event) {
            // Only trigger for the opacity transition to prevent multiple firings
            if (event.propertyName !== 'opacity') return;

            el.removeEventListener('transitionend', callback);

            if (hide) { // 👈 Changed from shouldHide to hide
                el.setAttribute('hidden', '');
            }
            resolve();
        }

        el.addEventListener('transitionend', callback);

        if (hide) { // 👈 Changed from shouldHide to hide
            // FADING OUT: Simply add the invisible class
            el.classList.add('js-fade-hiding');
        } else {
            // FADING IN:
            el.classList.add('js-fade-hiding');
            el.removeAttribute('hidden');

            // Force a browser layout paint so the transition registers correctly
            void el.offsetWidth;

            // Remove the class to trigger the smooth fade-in animation
            el.classList.remove('js-fade-hiding');
        }

        // 2. Failsafe check: If computed duration is 0s, resolve immediately to prevent freezing
        const duration = window.getComputedStyle(el).transitionDuration;
        if (duration === '0s' || parseFloat(duration) === 0) {
            el.removeEventListener('transitionend', callback);
            if (hide) el.setAttribute('hidden', '');
            resolve();
        }
    });
}


//#endregion