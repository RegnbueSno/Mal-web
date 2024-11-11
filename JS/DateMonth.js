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
var pic;
console.log(birthday);
window.onload = function () {
    const test = document.getElementById('credImag');
    if (today == 10) {
        pic = "pictures/events/monthevents/Halloween.png";
        test.src = pic
    } else if (today == 12) {
        pic = "pictures/events/monthevents/Christmas.png";
        test.src = pic
    } else if (birthday == "01-03") {
        pic = "pictures/events/birthday.png";
        test.src = pic
    }
        

    }