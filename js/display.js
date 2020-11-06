var userinputW = document.querySelector(".search-box");
userinputW.addEventListener("keypress", toggleDisplay);
var geoBtn = document.getElementById('geoBtn');
var x = document.getElementById("container");
var y = document.querySelector(".introTxt");

geoBtn.addEventListener('click', function () {
    if (x.style.display === "") {
        x.style.display = "block";
        y.style.display = "none";
    }
})

// This function will show the results when the input box has been submited.
function toggleDisplay(e) {
    if (e.keyCode == 13) {

        if (x.style.display === "") {
            x.style.display = "block";
            y.style.display = "none";
        }

    }
}


