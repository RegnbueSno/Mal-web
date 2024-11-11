var today = new Date();

var mm = today.getMonth() + 1;

if (mm < 10) {
    mm = '0' + mm;
}

today = mm;
var pic;

window.onload = function () {
    const test = document.getElementById('credImag');
    console.log(test);
    if (today == 10) {
        pic = "pictures/events/monthevents/Halloween.png";
        console.log(pic);
        test.src = pic
    } else if (today == 12) {
        pic = "pictures/events/monthevents/Christmas.png";
        console.log(pic);
        test.src = pic
    }

}




console.log(today);