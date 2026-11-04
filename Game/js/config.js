const loggingConfig = {
    global: true,
    cleaning: true,
    loading: true,
    saving: true,
    gameActions: true,
    blueprints: true,
    transitions: true
};

//#region Blueprints
// Define the exact valid blueprint structure for characters
const CHARACTERS_BLUEPRINT = {
    "*": {
        Image: "string",
        HiddenImage: "string",
        RevealedByFlag: "string"
    }
};
log('log', 'blueprints', "Characters Blueprint:", CHARACTERS_BLUEPRINT);

// Define the exact valid blueprint structure for scenes
const STORY_BLUEPRINT = {
    "Meta": {
        "StartingState": {
            "Items": {
                "Give": { "*": true } 
            },
            "Flags": {
                "Give": { "*": true } 
            }
        }
    },

    "*": {
        Bubbles: {
        Bubble1: {
            Text: "string",
            Character: "string"
        },
        Bubble2: {
            Text: "string",
            Character: "string"
        },
        Bubble3: {
            Text: "string",
            Character: "string"
        },
        Bubble4: {
            Text: "string",
            Character: "string"
        }
    },
    Choices: {
        Choice1: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }

        },
        Choice2: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }
        },
        Choice3: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                    
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }
        },
        Choice4: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }
        },
        Choice5: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }
        },
        Choice6: {
            Text: "string",
            ["Next Scene"]: "string",
            Requierments: {
                Flags: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                },
                Items: {
                    Requier: {
                        Take: { "*": true },
                        "*": true
                    },
                    Exclude: { "*": true },
                    Give: { "*": true }
                }
            }
        }

    },
    Ending: "string"}
        
};
log('log', 'blueprints', "Story Blueprint:", STORY_BLUEPRINT);

// 1. Define the exact valid blueprint structure for gamestate
const gameStateBlueprint = {
    version: 0,
    story: "string",
    sceneID: "string",
    Items: { "*": true },
    Flags: { "*": true },
    Endings: []
};
log('log', 'blueprints', "Game State Blueprint:", gameStateBlueprint);

//#endregion


// Global gamestate declaration
let gameState = {
    version: 0,
    story: "RegsStory",
    sceneID: "Starting Scene",
    Items: {},
    Flags: {},
    Endings: []
};
