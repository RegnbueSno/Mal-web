var today = new Date();

var mm = today.getMonth() + 1;
var dd = today.getDate()

if (dd < 10) {
    dd = '0' + dd;
}

if (mm < 10) {
    mm = '0' + mm;
}

birthday = dd + '-' + mm;

today = mm;
var picReg;
console.log(birthday);
window.onload = function () {
    // Select all elements with an id starting with "regImg"
    const regImgs = document.querySelectorAll('[id^="regimg"]');

    console.log("Found", regImgs.length, "regImg elements");

    let picReg = "Imgs/Music/placeholder.jpg"; // fallback image

    if (today == 10) {
        picReg = "Imgs/Events/Monthly/Halloween.png";
        console.log("Halloween image selected");
    } else if (today == 12) {
        picReg = "Imgs/Events/Monthly/Christmas.png";
        console.log("Christmas image selected");
    } else if (birthday == "01-03") {
        picReg = "Imgs/Events/Birthday.png";
        console.log("Birthday image selected");
    } else if (birthday == "17-05") {
        picReg = "Imgs/Events/17thmay.png";
        console.log("17th May image selected");
    } else {
        picReg = "Imgs/Crew/RegnbueSnø.png";
        console.log("Default image selected");
    }

    regImgs.forEach((img, index) => {
        console.log(`Setting image ${index + 1}:`, picReg);
        img.src = picReg;
    });
};
