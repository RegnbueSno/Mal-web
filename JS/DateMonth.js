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
        pic = "pictures/Halloween.png";
        console.log(pic);
        test.src = pic
    } else if (today == 12) {
        pic = "pictures/Christmas.png";
        console.log(pic);
        test.src = pic
    }
    
}




console.log(today);