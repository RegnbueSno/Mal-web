// 1. Move everything into the function so it only runs when explicitly called
function checkUpdateTime() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${month}-${day}`;

    // FIX: This query must happen inside the function, AFTER the HTML injection
    const images = document.querySelectorAll('.RegImg');
    console.log("Images found after fetch injection:", images.length);

    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    function getDailyElement(arr, seed) {
        if (!Array.isArray(arr) || arr.length === 0) return undefined;
        let hash = (seed * 16807) % 2147483647;
        const index = Math.abs(hash) % arr.length;
        return arr[index];
    }

    images.forEach(img => {
        let image;
        if (dateString === '03-01') {
            image = "Birthday.png";
        } else if (dateString === '05-17') {
            const chs = ["Regnbue.png", "Flag.png"];
            image = getDailyElement(chs, dateSeed);
        } else if (dateString === '02-14') {
            const chs = ["Flower.png", "Kiss.png"];
            image = getDailyElement(chs, dateSeed);
        } else if (month === '10') {
            const chs = ["Halloween.png", "Autumn.png", "Fire.png"];
            image = getDailyElement(chs, dateSeed);
        } else if ((month === '09') || (month === '11')) {
            image = "Autumn.png";
        } else if (month === '12') {
            const chs = ["Christmas.png", "Staryeye.png"];
            image = getDailyElement(chs, dateSeed);
        } else {
            const chs = ["Regnbue.png", "Staryeye.png", "Main.png"];
            image = getDailyElement(chs, dateSeed);
        }

        if (image) {
            img.src = "/files/Imgs/Reg/" + image;
        } else {
            console.error("No image found for the current date. \nvariable dateString: " + dateString + "\nvariable image: " + image);
        }
    });
}
