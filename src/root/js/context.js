var i = document.getElementById("menu").style;

var Page = document.getElementById("body");

Page.childNodes.forEach((element) => {
    if (element.className == "section sortable-list") {
        element.childNodes.forEach((wd) => {
            console.log("Add widget context: ");
            AddContext(wd);
        });
    }
});

function AddContext(element) {
    element.addEventListener(
        "contextmenu",
        function (e) {
            var posX = e.clientX;
            var posY = e.clientY;
            menu(posX, posY);
            e.preventDefault();
        },
        false
    );
    element.addEventListener(
        "click",
        function (e) {
            i.opacity = "0";
            setTimeout(function () {
                i.visibility = "hidden";
            }, 501);
        },
        false
    );
}

function menu(x, y) {
    i.top = y + "px";
    i.left = x + "px";
    i.visibility = "visible";
    i.opacity = "1";
}
