window.Context = {
    AddContextMenu: (element) => AddContext(element),
};

var i = document.getElementById("menu").style;

var Page = document.getElementById("body");

var LastElement;

Page.childNodes.forEach((element) => {
    if (element.className == "section sortable-list") {
        element.childNodes.forEach((wd) => {
            console.log("Add widget context: " + wd);
            AddContext(wd);
        });
    }
});

document.addEventListener(
    "click",
    function (e) {
        if (i.opacity === "0") return;
        console.log("Click");
        console.log(LastElement);

        if (
            LastElement.tagName === "DIV" &&
            LastElement.id.startsWith("widget-")
        ) {
            LastElement.remove();
            delete window.CurrentPage.PageData.sections[
                $(".section")[0].id.split("-")[1]
            ].widgets[LastElement.id.split("-")[1]];
            window.CurrentPage.Save();
        }

        i.opacity = "0";
        setTimeout(function () {
            i.visibility = "hidden";
        }, 501);
    },
    false
);

function AddContext(element) {
    element.addEventListener(
        "contextmenu",
        function (e) {
            LastElement = e.target.parentElement.parentElement;
            if (LastElement.tagName === "A")
                LastElement =
                    e.target.parentElement.parentElement.parentElement;
            var posX = e.clientX;
            var posY = e.clientY;
            menu(posX, posY);
            e.preventDefault();
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
