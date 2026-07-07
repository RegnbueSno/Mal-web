async function loadJsonFile() {
    try {
        const response = await fetch('/files/Json/Info.json');
        if (!response.ok) throw new Error('Network response was not ok');

        const jsonObject = await response.json();
        return jsonObject;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function checkUpdateTime() {
    const container = document.getElementById("updateContainer");
    const jsonObject = await loadJsonFile();

    if (container && jsonObject && jsonObject["updated"]) {
        container.textContent = `Last Updated: ${jsonObject["updated"]}`;
    }
}
