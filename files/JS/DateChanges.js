// 1. Get the current date
const today = new Date();
// const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, '0');

// 2. Format the date (Example: "2026-07-07")
const dateString = `${month}-${day}`;

// 3. Select all images with the specific class
const images = document.querySelectorAll('img.RegImg');

// 4. Loop through and change the src using the date
images.forEach(img => {
    if (dateString == '03-01') {

    } else if (dateString == '12-24') {

    }

    // img.src = `images/archive-${dateString}.jpg`; 
    // Result: images/archive-2026-07-07.jpg
})