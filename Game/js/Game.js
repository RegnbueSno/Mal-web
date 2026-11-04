// gameState is the state of the game that is saved and loaded from a file.
// It contains the current scene ID and any other relevant data for the game.
// The code listens for a file input change event, reads the selected file, and updates the gameState object with the parsed JSON data.
// It also includes debugging functions to show or hide debug elements in the UI.
import { loadFile } from './Module.js';


// Keep them const! We are allowed to mutate what is INSIDE them.
let storyData = {};
let characterData = {};

// 🟩 Check if a story was unlocked via upload or choice first, otherwise fallback to default
let chosenStory = localStorage.getItem('lastActiveStory');

if (!chosenStory || chosenStory === "null" || chosenStory === "undefined") {
    chosenStory = 'RegsStory'; // Make sure this perfectly matches your default folder name!
    localStorage.setItem('lastActiveStory', chosenStory);
}

let story = chosenStory + '/Story.json';
let characters = chosenStory + '/Characters.json';


// Create an isolated initialization function to load the defaults safely
async function initializeDefaultStory() {
    try {
        const rawStory = await loadFile(story);
        const rawChars = await loadFile(characters);

        const cleanedStory = cleanFetchedJson(rawStory, STORY_BLUEPRINT);
        const cleanedChars = cleanFetchedJson(rawChars, CHARACTERS_BLUEPRINT);

        Object.assign(storyData, cleanedStory);
        Object.assign(characterData, cleanedChars);

        // Expose files to the window pointer layer safely
        window.storyData = storyData;

        if (typeof loadGameState === 'function') {
            const hasExistingSave = loadGameState(chosenStory);

            // 🟩 FIX: Detect if the state has been reset back to the beginning by a Main Menu loop
            const isStateReset = hasExistingSave &&
                gameState.sceneID === "Starting Scene" &&
                Object.keys(gameState.Items || {}).length === 0 &&
                Object.keys(gameState.Flags || {}).length === 0;

            if ((!hasExistingSave || isStateReset) && typeof initializeFreshState === 'function') {

                // 🟩 PRESERVE PROGRESSION: Extract earned achievements before clearing the workspace
                const cachedEndings = hasExistingSave ? [...(gameState.Endings || [])] : [];

                // Initialize the structural payload variables cleanly
                initializeFreshState(chosenStory);

                // 🟩 RESTORE PROGRESSION: Inject master history back into active memory
                gameState.Endings = cachedEndings;

                // Run mutations using your natively accessible function tracks!
                if (storyData.Meta && storyData.Meta.StartingState) {
                    log('log', 'saving', "Applying default startup configuration assets into fresh game profile:", storyData.Meta.StartingState);
                    applyConsequences(storyData.Meta.StartingState);
                }

                // Save the mutated payload directly to local storage
                localStorage.setItem(chosenStory, JSON.stringify(gameState));

                // 🟩 UPDATE UI: Refresh display with new starting items
                if (typeof updateInventoryUI === 'function') {
                    updateInventoryUI();
                }
            } else if (hasExistingSave) {
                // 🟩 UPDATE UI: Refresh display for a returning player with loaded items
                if (typeof updateInventoryUI === 'function') {
                    updateInventoryUI();
                }
            }
        }

    } catch (error) {
        log('error', 'startup', "Failed to initialize standard default story layout database context:", error);
    }
}


async function bootEngine() {
    log('log', 'startup', "Booting game engine and attaching event listeners...");

    // 1. Try to load story assets, but don't let a corrupt JSON crash the UI buttons
    try {
        await initializeDefaultStory();
    } catch (startError) {
        log('error', 'startup', "Engine boot warning: Story assets failed to load, but UI binding will proceed.", startError);
    }

    // 2. Run your module's dynamic button binding loop
    try {
        const currentModule = await import(import.meta.url);

        for (const button of Object.values(elems.button)) {
            if (!button) continue;

            if (!button.hasAttribute('function')) {
                log('warn', 'Skipping button: Missing "function" attribute.', button);
                continue;
            }

            const actionName = button.getAttribute('function');
            const actionFunction = currentModule[actionName];

            if (typeof actionFunction !== 'function') {
                log('warn', `Skipping button: Function "${actionName}" does not exist.`);
                continue;
            }

            // Clean attachment
            button.addEventListener('click', actionFunction);

            // Failsafe: Expose to window layer for explicit button routing integration
            window[actionName] = actionFunction;
        }
    } catch (bindingError) {
        log('error', 'startup', "Failed to execute module action binding tracks:", bindingError);
    }
}

// Fire the master engine boot sequence safely
bootEngine();


// Game Logic
const elems = {
    button: {
        start: document.getElementById('startGame'),
        chooseStory: document.getElementById('chooseStory'),
        backToStart: document.getElementById('backToStart'),

        // 🟩 FIX: Target the exact IDs from your new HTML structure!
        testStoryBtn: document.getElementById('test'),        // Matches <button id="test">
        regsStoryBtn: document.getElementById('RegsStory'),    // Matches <button id="RegsStory">

        backupSave: document.getElementById('backupSaveBtn'),

        viewEndings: document.getElementById('viewEndingsBtn'),
        closeGallery: document.getElementById('closeGalleryBtn')
    },

    screen: {
        start: document.getElementById('startScreen'),
        storySelection: document.getElementById('storySelection'),
        game: document.getElementById('gameContainer'),
    },
    game: {
        Content: Array.from(document.getElementById('gameContent').querySelectorAll(':scope > *')),
        Actions: Array.from(document.getElementById('gameActions').querySelectorAll(':scope > * > *')),
    }
};


(async () => {
    // 1. Dynamic import of the current module's exports
    const currentModule = await import(import.meta.url);

    for (const button of Object.values(elems.button)) {

        // 🟩 FIX: Safety Guard Clause! Skip checking the button if it doesn't exist in the current DOM layout
        if (!button) {
            continue;
        }

        // 1. Safety Check: Does the button even have the attribute?
        if (!button.hasAttribute('function')) {
            log('warn', 'Skipping button: Missing "function" attribute entirely.', button);
            continue; // Skip this button and move to the next one in the loop
        }

        const actionName = button.getAttribute('function');

        // 2. Look up the function by its string name from the module exports
        const actionFunction = currentModule[actionName];

        // 2. Safety Check: Does the exported function exist?
        if (typeof actionFunction !== 'function') {
            log('warn', `Skipping button: Exported function "${actionName}" does not exist.`);
            continue;
        }

        // If all checks pass, safely attach the listener
        button.addEventListener('click', actionFunction);
    }
})();

export function backupSave() {
    const secureState = (typeof gameState !== 'undefined' && gameState) ? gameState : window.gameState;

    if (secureState) {
        log('log', 'saving', "Creating clean serialization payload for export...");
        const cleanSaveData = JSON.parse(JSON.stringify(secureState));

        // Strip temporary items/flags variables to match profile state designs
        delete cleanSaveData.Items;
        delete cleanSaveData.Flags;

        if (typeof saveJSON === 'function') {
            saveJSON(`${chosenStory}.json`, cleanSaveData);
        } else {
            log('error', 'saving', "Engine Error: 'saveJSON' helper function missing from global scope.");
        }
    } else {
        log('error', 'saving', "Backup download failed: active gameState is uninitialized.");
    }
}

//#region Start Screen Functions
async function toggleStartScreen() {
    await fadeToggle(elems.screen.start);
    log('log', 'gameActions', "Start screen toggled. Current state:", elems.screen.start.hasAttribute('hidden') ? "Hidden" : "Visible");
}
async function hideStartScreen() {
    await fadeToggle(elems.screen.start, true);
    log('log', 'gameActions', "Start screen hidden. Current state: Hidden");
}

async function showStartScreen() {
    await fadeToggle(elems.screen.start, false);
    log('log', 'gameActions', "Start screen shown. Current state: Visible");
}
//#endregion

//#region Story Selection Functions
async function toggleStorySelection() {
    await fadeToggle(elems.screen.storySelection);
    log('log', 'gameActions', "Story selection toggled. Current state:", elems.screen.storySelection.hasAttribute('hidden') ? "Hidden" : "Visible");
}

async function hideStorySelection() {
    await fadeToggle(elems.screen.storySelection, true);
    log('log', 'gameActions', "Story selection hidden. Current state: Hidden");
}

async function showStorySelection() {
    if (elems.screen.storySelection.hasAttribute('hidden')) {
        await fadeToggle(elems.screen.storySelection, false);
        log('log', 'gameActions', "Story selection shown. Current state: Visible");
    } else { log('error', 'gameActions', "Story selection is already visible."); }
}

//#endregion

//#region Game Screen Functions

async function toggleGameScreen() {
    await fadeToggle(elems.screen.game);
    log('log', 'gameActions', "Game screen toggled. Current state:", elems.screen.game.hasAttribute('hidden') ? "Hidden" : "Visible");
}

async function hideGameScreen() {
    await fadeToggle(elems.screen.game, true);
    log('log', 'gameActions', "Game screen hidden. Current state: Hidden");
}

async function showGameScreen() {
    await fadeToggle(elems.screen.game, false);
    log('log', 'gameActions', "Game screen shown. Current state: Visible");
}

//#endregion

// 1. Add the async keyword here
export async function backToStartScreen() {
    // 1. Guard clause: Exit early if we are already on the start screen
    if (!elems.screen.start.hasAttribute('hidden')) {
        log('error', 'gameActions', "Already on start screen.");
        return;
    }

    log('log', 'gameActions', "Returning to start screen. Hiding active panels...");

    // 2. Automatically queue fade outs for ALL screens (except 'start') plus the back button
    const fadePromises = Object.entries(elems.screen)
        .filter(([key]) => key !== 'start')
        .map(([_, el]) => fadeToggle(el, true));

    fadePromises.push(fadeToggle(elems.button.backToStart, true));

    // 3. Wait for all exit animations to finish completely at the same time
    await Promise.all(fadePromises);

    // 4. Safely bring the start screen back into view
    await showStartScreen();
    log('log', 'gameActions', "Start screen successfully restored.");
}


export async function chooseStory(event) {
    const buttonTarget = event.target.closest('button');
    if (!buttonTarget) return;

    let storyTarget = buttonTarget.id;

    if (chosenStory !== storyTarget) {
        chosenStory = storyTarget;
        localStorage.setItem('lastActiveStory', chosenStory);

        const rawStory = await loadFile(chosenStory + '/Story.json');
        const rawChars = await loadFile(chosenStory + '/Characters.json');

        storyData = cleanFetchedJson(rawStory, STORY_BLUEPRINT);
        characterData = cleanFetchedJson(rawChars, CHARACTERS_BLUEPRINT);

        // Keep the global pointer synchronized on story changes!
        window.storyData = storyData;

        // 1. Load the corresponding game save variables context map from local storage arrays
        const hasExistingSave = loadGameState(chosenStory);

        // 🟩 FIX: Apply fresh reset verification rules natively on folder swap tracks!
        const isStateReset = hasExistingSave &&
            gameState.sceneID === "Starting Scene" &&
            Object.keys(gameState.Items || {}).length === 0 &&
            Object.keys(gameState.Flags || {}).length === 0;

        if ((!hasExistingSave || isStateReset) && typeof initializeFreshState === 'function') {
            const cachedEndings = hasExistingSave ? [...(gameState.Endings || [])] : [];

            initializeFreshState(chosenStory);
            gameState.Endings = cachedEndings;

            if (storyData.Meta && storyData.Meta.StartingState) {
                log('log', 'saving', "Applying folder-swap startup parameters context cleanly into profile:", storyData.Meta.StartingState);
                applyConsequences(storyData.Meta.StartingState);
            }

            localStorage.setItem(chosenStory, JSON.stringify(gameState));
        }

        // Re-render the gallery entries list layout immediately on context shift
        if (typeof renderEndingsGallery === 'function') {
            renderEndingsGallery();
        }

        // Synchronize the active inventory display UI with the newly loaded story variables
        if (typeof updateInventoryUI === 'function') {
            updateInventoryUI();
        }

        await showStoryScreen();
    }
}

async function loadState() {
    await hideGameScreen()
}

export async function showStoryScreen() {
    await hideStartScreen();

    const storyButtons = [elems.button.testStoryBtn, elems.button.regsStoryBtn];

    storyButtons.forEach(btn => {
        if (!btn) return;

        // 🟩 Read the clean button ID target directly
        let storyNameId = btn.id;

        if (storyNameId === chosenStory) {
            btn.textContent = "Activated";
            btn.classList.add('js-story-active');
        } else {
            btn.textContent = "Activate";
            btn.classList.remove('js-story-active');
        }
    });

    await showStorySelection();
    fadeToggle(elems.button.backToStart, false);
}

// Game can start
export async function startGame() {
    await loadState();
    await hideStartScreen();

    // 🟩 FIX: If we are on the starting scene and variables are blank, re-apply starter assets immediately!
    if (typeof gameState !== 'undefined' && gameState.sceneID === "Starting Scene") {
        const itemsCount = Object.keys(gameState.Items || {}).length;
        const flagsCount = Object.keys(gameState.Flags || {}).length;

        if (itemsCount === 0 && flagsCount === 0) {
            if (storyData && storyData.Meta && storyData.Meta.StartingState) {
                log('log', 'saving', "Start Game triggered on clear profile. Injecting narrative default assets...");
                applyConsequences(storyData.Meta.StartingState);

                // Commit to localStorage straight away
                localStorage.setItem(chosenStory, JSON.stringify(gameState));
            }
        }
    }

    // Run the gameplay screen updater loop directly 
    await game();

    fadeToggle(elems.button.backToStart, false);
}

/**
 * Main game runtime loop. Inspects fixed UI nodes, switches panels, 
 * updates texts, and links relative character asset images dynamically.
 */

// Global tracking variables for typewriter animation cycles
let typewriterInterval = null;
let isTypingActive = false;

async function game() {
    if (!storyData) {
        log('error', 'runtime', "Game cannot progress: storyData is uninitialized.");
        return;
    }

    if (typeof gameState === 'undefined') {
        window.gameState = { sceneID: "Starting Scene", bubbleIndex: 0, Flags: {}, Items: {}, Endings: [] };
    }
    if (!gameState.sceneID) gameState.sceneID = "Starting Scene";
    if (gameState.bubbleIndex === undefined) gameState.bubbleIndex = 0;
    if (!gameState.Endings) gameState.Endings = [];

    const currentSceneKey = gameState.sceneID;
    const scene = storyData[currentSceneKey];

    if (!scene) {
        log('error', 'runtime', `Scene lookup failed! "${currentSceneKey}" does not exist in storyData.`);
        return;
    }

    // Fetch bubble arrays safely
    const bubbleKeys = scene.Bubbles ? Object.keys(scene.Bubbles) : [];
    const totalBubbles = bubbleKeys.length;
    const currentBubbleKey = bubbleKeys[gameState.bubbleIndex];
    const bubbleData = currentBubbleKey ? scene.Bubbles[currentBubbleKey] : null;

    // STEP 1: VANISH ENTIRE SCREEN ONLY ON THE FIRST BUBBLE INITIALIZATION STEP
    if (gameState.bubbleIndex === 0) {
        await hideGameScreen();

        // 🟩 NEW: Destroy any leftover structural ending cards from previous playthrough tracks
        const lingeringCard = document.getElementById('runtimeEndingCard');
        if (lingeringCard) lingeringCard.remove();

        // Clear lingering typewriter cycles and reset ALL display slots to hidden baseline layers
        if (typewriterInterval) clearInterval(typewriterInterval);
        isTypingActive = false;

        elems.game.Content.forEach(el => el.setAttribute('hidden', ''));
        elems.game.Actions.forEach(el => el.setAttribute('hidden', ''));
    }

    // Check if we are currently displaying speech bubbles
    if (bubbleData) {
        log('log', 'runtime', `Processing Bubble ${gameState.bubbleIndex + 1}/${totalBubbles} on [${currentSceneKey}]`);

        // STEP 2: TARGET THE EXACT CONTAINER ELEMENT SLOT MATCHING THIS BUBBLE'S LOOP INDEX
        const bubbleElem = elems.game.Content[gameState.bubbleIndex];
        if (bubbleElem) {
            const imgElem = bubbleElem.querySelector('img');
            const nameElem = bubbleElem.querySelector('name');
            const pElem = bubbleElem.querySelector('p');

            // Clear old text strings instantly before rendering updates to prevent flashes
            if (pElem) pElem.textContent = "";

            const hasCharacter = bubbleData.Character && bubbleData.Character.trim() !== "";
            // Special Guard Clause: Treat "Narrator" exactly like an empty character slot
            const isNarrator = bubbleData.Character === "Narrator";

            if (hasCharacter && !isNarrator) {
                const characterProfile = characterData[bubbleData.Character] || {};

                // 🟩 READ BLUEPRINT SPECIFIC ATTRIBUTES
                const standardImage = characterProfile.image || characterProfile.Image || "";
                const hiddenImage = characterProfile.HiddenImage || "";
                const conditionFlag = characterProfile.RevealedByFlag || "";

                // Evaluate if the reveal condition is met
                let isRevealed = true;
                if (conditionFlag && conditionFlag.trim() !== "") {
                    const flagsState = gameState.Flags || {};
                    if (!flagsState[conditionFlag]) {
                        isRevealed = false;
                    }
                }

                // Determine which image file to use based on the reveal status
                let imageName = "";
                if (isRevealed) {
                    imageName = standardImage;
                } else if (hiddenImage && hiddenImage.trim() !== "") {
                    imageName = hiddenImage;
                }

                if (imgElem) {
                    if (imageName && imageName.trim() !== "") {
                        const targetSrc = `Stories/${chosenStory}/Images/${imageName}`;
                        imgElem.src = targetSrc;
                        imgElem.alt = isRevealed ? bubbleData.Character : "Unknown Character";
                        imgElem.classList.remove('hide');

                        imgElem.onerror = () => {
                            log('error', 'assets', `Asset Error: Image file not found at directory: "${targetSrc}"`);
                            imgElem.classList.add('hide');
                        };
                    } else {
                        log('log', 'assets', `Character "${bubbleData.Character}" is unrevealed and has no HiddenImage fallback.`);
                        imgElem.classList.add('hide');
                    }
                }

                if (nameElem) {
                    nameElem.textContent = isRevealed ? bubbleData.Character : "???";
                    nameElem.classList.remove('hide');
                }
            } else {
                if (imgElem) imgElem.classList.add('hide');
                if (nameElem) {
                    nameElem.textContent = "\u00A0";
                    nameElem.classList.add('hide');
                }
            }

            bubbleElem.removeAttribute('hidden');
        }

        // Map a SINGLE Continue button ONLY if there are remaining bubbles left to show in the scene
        const showContinueButton = totalBubbles > 1 && (gameState.bubbleIndex < totalBubbles - 1);

        if (showContinueButton) {
            const continueBtn = elems.game.Actions[0];
            if (continueBtn) {
                const updatedBtn = continueBtn.cloneNode(true);
                continueBtn.parentNode.replaceChild(updatedBtn, continueBtn);
                elems.game.Actions[0] = updatedBtn;

                updatedBtn.textContent = "Continue";
                updatedBtn.setAttribute('hidden', '');

                updatedBtn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    updatedBtn.setAttribute('hidden', '');
                    gameState.bubbleIndex++;
                    await game();
                });
            }
        }

        if (gameState.bubbleIndex === 0) {
            await showGameScreen();
        }

        // 5. ANIMATION & SKIP SYSTEM: Start the text cycle loop
        const pTarget = bubbleElem?.querySelector('p');
        const fullText = bubbleData.Text || "";

        if (pTarget && fullText.length > 0) {
            let currentIdx = 0;
            isTypingActive = true;

            function revealChoicesOrContinue() {
                if (showContinueButton) {
                    const actionBtn = elems.game.Actions[0];
                    if (actionBtn) actionBtn.removeAttribute('hidden');
                } else {
                    // 🟩 AUTOMATED INJECTION: Fire UI rendering helpers if closing narrative limits are found
                    if (scene.Ending) {
                        displayEndingCardBelowBubbles(scene.Ending);
                    }
                    renderSceneChoices(scene, currentSceneKey);
                }
            }

            function skipTypewriter() {
                if (!isTypingActive) return;

                clearInterval(typewriterInterval);
                isTypingActive = false;
                pTarget.textContent = fullText;

                revealChoicesOrContinue();
                bubbleElem.removeEventListener('click', skipTypewriter);
            }

            bubbleElem.addEventListener('click', skipTypewriter);

            typewriterInterval = setInterval(() => {
                pTarget.textContent += fullText.charAt(currentIdx);
                currentIdx++;

                if (currentIdx >= fullText.length) {
                    clearInterval(typewriterInterval);
                    isTypingActive = false;
                    revealChoicesOrContinue();
                    bubbleElem.removeEventListener('click', skipTypewriter);
                }
            }, 30);
        } else {
            if (showContinueButton) {
                const actionBtn = elems.game.Actions[0];
                if (actionBtn) actionBtn.removeAttribute('hidden');
            } else {
                if (scene.Ending) {
                    displayEndingCardBelowBubbles(scene.Ending);
                }
                renderSceneChoices(scene, currentSceneKey);
            }
        }

    } else {
        if (scene.Ending) {
            displayEndingCardBelowBubbles(scene.Ending);
        }
        renderSceneChoices(scene, currentSceneKey);
        if (gameState.bubbleIndex === 0) {
            await showGameScreen();
        }
    }
}

/**
 * Isolated helper script designed to build and display your 6 designated choice paths.
 * Logs a direct core module error if no options are visible to the player.
 */
function renderSceneChoices(scene, currentSceneKey) {
    const choiceElements = elems.game.Actions;

    // 🟩 FIX: If this scene has a final ending tag, suppress regular choice generation!
    if (scene.Ending) {
        log('log', 'runtime', `Rendering Ending Layout for scene [${currentSceneKey}]: ${scene.Ending}`);

        // 🟩 PERSISTENT ARCHIVE RECOVERY TRACKS: Keep milestones logged permanently
        if (!gameState.Endings) gameState.Endings = [];
        if (!gameState.Endings.includes(scene.Ending)) {
            gameState.Endings.push(scene.Ending);
            log('log', 'saving', `New unlock recorded! Adding ending token: "${scene.Ending}" into profile list storage.`);
            if (typeof saveGameState === 'function') {
                saveGameState(chosenStory);
            }
        }

        // Hide all action elements first
        for (let i = 0; i < choiceElements.length; i++) {
            if (choiceElements[i]) choiceElements[i].setAttribute('hidden', '');
        }

        // Repurpose the very first action button to act as a Main Menu navigation anchor
        const endingButton = choiceElements[0];
        if (endingButton) {
            const updatedButton = endingButton.cloneNode(true);
            endingButton.parentNode.replaceChild(updatedButton, endingButton);
            elems.game.Actions[0] = updatedButton;

            updatedButton.textContent = "Return to Main Menu";
            updatedButton.removeAttribute('hidden');
            updatedButton.classList.add('js-menu-reset-button');

            updatedButton.addEventListener("click", async () => {
                log('log', 'gameActions', "Ending acknowledged. Wiping story variables, preserving master profile records...");

                // 1. Extract unlocked milestones so they survive item wipes
                const preservedEndingsRecord = [...(gameState.Endings || [])];

                // 2. Remove active playthrough live state trace from localStorage
                localStorage.removeItem(chosenStory);

                // 3. Re-initialize blank baseline state properties natively
                if (typeof initializeFreshState === 'function') {
                    initializeFreshState(chosenStory);
                }

                // 4. Restore accomplishments context into memory before writing to disk
                gameState.Endings = preservedEndingsRecord;

                // 🟩 FIX: Commit the completely cleared state back to localStorage instantly!
                localStorage.setItem(chosenStory, JSON.stringify(gameState));

                // 🟩 FIX: Force the UI list element container to re-render empty ("No items carried")
                if (typeof updateInventoryUI === 'function') {
                    updateInventoryUI();
                }

                // 5. Navigate safely back out to screen overlays
                if (typeof backToStartScreen === 'function') {
                    await backToStartScreen();
                }
            });

        }
        return; // Exit early
    }

    // --- Standard choice processing routine ---
    let visibleChoicesCount = 0;

    for (let i = 0; i < 6; i++) {
        const choiceButton = choiceElements[i];
        if (!choiceButton) continue;

        const updatedButton = choiceButton.cloneNode(true);
        choiceButton.parentNode.replaceChild(updatedButton, choiceButton);
        elems.game.Actions[i] = updatedButton;

        const choiceKey = `Choice${i + 1}`;
        const choiceData = scene.Choices ? scene.Choices[choiceKey] : null;

        if (choiceData && evaluateRequirements(choiceData.Requierments)) {
            updatedButton.textContent = choiceData.Text;
            updatedButton.removeAttribute('hidden');
            visibleChoicesCount++;

            updatedButton.addEventListener("click", async () => {
                applyConsequences(choiceData.Requierments);

                const nextSceneDestination = choiceData["Next Scene"] || choiceKey;
                gameState.sceneID = nextSceneDestination;
                gameState.bubbleIndex = 0;

                if (typeof validateGameState === 'function') {
                    validateGameState();
                }
                if (typeof saveGameState === 'function') {
                    saveGameState(chosenStory);
                }

                await game();
            });
        } else {
            updatedButton.setAttribute('hidden', '');
        }
    }

    if (visibleChoicesCount === 0) {
        log('error', 'gameActions', `No valid choices found or requirements met for scene: [${currentSceneKey}]`);
    }
}

/**
 * Checks player progress values directly inside the global gameState object.
 */
/**
 * Checks player progress values directly inside the global gameState object.
 * Maps both Flags and Items using the dynamic multi-attribute container blueprint.
 */
function evaluateRequirements(reqs) {
    if (!reqs) return true;

    const itemsState = gameState.Items || {};
    const flagsState = gameState.Flags || {};

    function checkCategory(reqKey, stateObject) {
        const config = reqs[reqKey];
        if (!config) return true;

        // 🟩 FIX: Explicitly match the exact spelling "Requier" from your test story JSON!
        const requireConfig = config.Requier || config.Require || config.require;
        if (requireConfig) {
            for (const [key, totalNeeded] of Object.entries(requireConfig)) {
                if (key === "Take" || key === "take") continue;

                const currentValue = stateObject[key];
                if (typeof totalNeeded === 'number') {
                    if ((currentValue || 0) < totalNeeded) return false;
                } else {
                    if (currentValue !== totalNeeded) return false;
                }
            }
        }

        const excludeConfig = config.Exclude || config.exclude;
        if (excludeConfig) {
            for (const [key, shouldExclude] of Object.entries(excludeConfig)) {
                if (shouldExclude && stateObject[key]) return false;
            }
        }
        return true;
    }

    if (!checkCategory('Flags', flagsState)) return false;
    if (!checkCategory('Items', itemsState)) return false;

    return true;
}

/**
 * Modifies parameters directly on your global gameState layout object.
 * Processes mutated modifications for flags and items identically.
 */
function applyConsequences(reqs) {
    if (!reqs) return;

    // Enforce clean targets
    if (!gameState.Items) gameState.Items = {};
    if (!gameState.Flags) gameState.Flags = {};

    function mutationHandler(reqKey, stateObject) {
        // Read strictly by the provided key casing (e.g., 'Items' or 'Flags')
        const config = reqs[reqKey];
        if (!config) return;

        // Target capitalized "Give" from your story JSON file
        const giveConfig = config.Give;
        if (giveConfig) {
            Object.entries(giveConfig).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    stateObject[key] = (stateObject[key] || 0) + value;
                } else {
                    stateObject[key] = value;
                }
            });
        }

        // Target capitalized "Requier" or "Require" and its "Take" properties
        const requireConfig = config.Requier || config.Require;
        const takeConfig = requireConfig ? requireConfig.Take : null;
        if (takeConfig) {
            Object.entries(takeConfig).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    stateObject[key] = Math.max(0, (stateObject[key] || 0) - value);
                } else if (value === true) {
                    delete stateObject[key];
                }
            });
        }
    }

    // Pass direct capitalized properties matching your keys
    mutationHandler('Flags', gameState.Flags);
    mutationHandler('Items', gameState.Items);

    updateInventoryUI();

    if (typeof saveGameState === 'function') {
        saveGameState(chosenStory);
    }
}

/**
* Synchronizes the top-right fixed UI inventory block with the active gameState.Items layout.
*/
export function updateInventoryUI() {
    const inventoryContainer = document.getElementById('inventoryDisplay'); // Target your corner element ID
    if (!inventoryContainer) {
        log('warn', 'runtime', 'Inventory container element "#inventoryDisplay" not found in the DOM.');
        return;
    }

    // Clear old elements to prevent list duplication flashes
    inventoryContainer.innerHTML = '';

    const items = gameState.Items || {};
    const itemEntries = Object.entries(items);

    if (itemEntries.length === 0) {
        inventoryContainer.innerHTML = '<div class="inventory-empty">No items carried</div>';
        return;
    }

    // Loop over entries and build clean fragments
    itemEntries.forEach(([itemName, itemValue]) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';

        // Format depending on whether it is a numeric counter (Gold: 15) or a flag item (Map: true)
        if (typeof itemValue === 'number') {
            itemRow.innerHTML = `<span class="item-name">${itemName}</span>: <span class="item-qty">${itemValue}</span>`;
        } else if (itemValue === true) {
            itemRow.innerHTML = `<span class="item-name">${itemName}</span>`;
        } else {
            itemRow.innerHTML = `<span class="item-name">${itemName}</span>: <span class="item-value">${itemValue}</span>`;
        }

        inventoryContainer.appendChild(itemRow);
    });
}


/**
* Dynamically builds and inserts an ending notification card 
* directly underneath the active dialogue bubbles list context.
*/
function displayEndingCardBelowBubbles(endingName) {
    const contentContainer = document.getElementById('gameContent');
    if (!contentContainer) {
        log('warn', 'runtime', 'Unable to locate #gameContent layout frame.');
        return;
    }

    // 🟩 Prevent duplicate cards if re-rendering
    const existingWrapper = document.getElementById('runtimeEndingWrapper');
    if (existingWrapper) existingWrapper.remove();

    // 🟩 FIX: Create a full-width flex wrapper to force a row line break
    const wrapper = document.createElement('div');
    wrapper.id = 'runtimeEndingWrapper';
    wrapper.style.width = '100%';
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.marginTop = '20px';

    const endingCard = document.createElement('div');
    endingCard.className = 'ending-display-card';

    const formattedEnding = endingName.replace(/_/g, ' ').toUpperCase();

    endingCard.innerHTML = `
        <div class="ending-card-title">Ending Achived</div>
        <div class="ending-card-value">${formattedEnding}</div>
    `;

    // Nest the card inside the row breaker and append to the stage
    wrapper.appendChild(endingCard);
    contentContainer.appendChild(wrapper);

    log('log', 'runtime', `Ending card wrapper attached cleanly beneath active bubbles list.`);
}

let isGalleryOpen = false;

/**
 * Toggles the visibility of the Endings Gallery and refreshes its items.
 */
export async function toggleEndingsGallery() {
    const galleryEl = document.getElementById('endingsGalleryContainer');
    if (!galleryEl) {
        log('warn', 'runtime', 'Gallery element "#endingsGalleryContainer" not found in the DOM.');
        return;
    }

    isGalleryOpen = !isGalleryOpen;

    if (isGalleryOpen) {
        // Build and display active milestones before fading it into view
        renderEndingsGallery();
        await fadeToggle(galleryEl, false);
    } else {
        await fadeToggle(galleryEl, true);
    }
}

/**
 * Dynamically updates the endings grid view using unlocked parameters 
 * from the global registry array track.
 */
function renderEndingsGallery() {
    const gridContainer = document.getElementById('endingsGrid');
    if (!gridContainer) return;

    // Clear old layout artifacts
    gridContainer.innerHTML = '';

    // Safeguard missing structures smoothly
    const unlockedEndings = gameState.Endings || [];

    // 🟩 DYNAMIC DISCOVERY RULE: Extract all unique ending configurations defined across the current storyData!
    const storyEndingList = [];
    if (storyData) {
        Object.entries(storyData).forEach(([sceneKey, sceneValue]) => {
            if (sceneValue && sceneValue.Ending) {
                const endingId = sceneValue.Ending;

                // Prevent duplicate map registrations if multiple path scenes share an ending label
                if (!storyEndingList.some(e => e.id === endingId)) {
                    storyEndingList.push({
                        id: endingId,
                        label: endingId.replace(/_/g, ' '),
                        desc: `Discovered by reaching scene checkpoint track location: [${sceneKey}].`
                    });
                }
            }
        });
    }

    // CALCULATE PROGRESS STATISTICS
    const totalEndingsCount = storyEndingList.length;
    const unlockedCount = storyEndingList.filter(ending => unlockedEndings.includes(ending.id)).length;
    const completionPercentage = totalEndingsCount > 0 ? Math.round((unlockedCount / totalEndingsCount) * 100) : 0;

    // REWRITE THE GALLERY STATUS SUBHEADER SLOTS
    const statsTitleElement = document.getElementById('galleryProgressStats');
    const progressBarFillElement = document.getElementById('galleryProgressBarFill');

    if (statsTitleElement) {
        statsTitleElement.textContent = `COMPLETION: ${unlockedCount}/${totalEndingsCount} (${completionPercentage}%)`;
    }
    if (progressBarFillElement) {
        progressBarFillElement.style.width = `${completionPercentage}%`;
    }

    // 🟩 DYNAMIC PLUG: If the current story file simply contains no ending scenes configured
    if (totalEndingsCount === 0) {
        gridContainer.innerHTML = '<div class="gallery-empty-state">No ending branches found configured within this story profile folder module.</div>';
        return;
    }

    // Loop over dynamic discoveries and render individual grid layout nodes
    storyEndingList.forEach(ending => {
        const hasUnlocked = unlockedEndings.includes(ending.id);
        const card = document.createElement('div');

        card.className = `ending-gallery-card ${hasUnlocked ? 'unlocked' : 'locked'}`;

        if (hasUnlocked) {
            card.innerHTML = `
                <div class="gallery-card-badge">🏆 UNLOCKED</div>
                <div class="gallery-card-title">${ending.label.toUpperCase()}</div>
                <div class="gallery-card-desc">${ending.desc}</div>
            `;
        } else {
            card.innerHTML = `
                <div class="gallery-card-badge">🔒 LOCKED</div>
                <div class="gallery-card-title">???</div>
                <div class="gallery-card-desc">Keep exploring alternative choice combinations to discover this memory.</div>
            `;
        }

        gridContainer.appendChild(card);
    });

    log('log', 'runtime', `Rendered dynamic gallery profiles. Progression Tracked: ${completionPercentage}%`);
}