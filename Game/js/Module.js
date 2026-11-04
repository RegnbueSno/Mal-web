export async function loadFile(path) {
    try {
        // The path template must be partially static so bundlers (like Vite/Webpack) know where to look
        const fileData = await import(`../Stories/${path}`, {
            with: { type: 'json' }
        });

        // The imported module data resides in the .default property for JSON files
        return fileData.default;
    } catch (error) {
        log('error', "Failed to load the file:", error);
        return null;
    }
}

// How to use it:
// const currentStory = await loadFile('RegsStory/Story.json');
// log('log', currentStory);