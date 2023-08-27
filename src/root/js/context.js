import Page from "./PageModule.js";

window.Context = {
    AddContextMenu: (element) => AddContext(element),
};

var i = $("#menu")[0].style;

var PageBody = document.getElementsByClassName("page-body")[0];

var LastElement;

PageBody.childNodes.forEach((element) => {
    if (element.className == "section sortable-list") {
        element.childNodes.forEach((wd) => {
            AddContext(wd);
        });
    }
});

document.addEventListener(
    "click",
    function (e) {
        if (i.opacity === "0") return;

        i.opacity = "0";
        setTimeout(function () {
            i.visibility = "hidden";
        }, 60);

        if (
            LastElement.tagName !== "DIV" ||
            !LastElement.id.startsWith("widget-")
        ) {
            return;
        }

        try {
            if (e.target.tagName === "P") e.target = e.target.parentElement;
        } catch {}

        console.log(e.target);

        switch (e.target.id) {
            case "ContextLinkDelete":
                {
                    LastElement.remove();
                    delete Page.PageData.sections[
                        $(".section")[0].id.split("-")[1]
                    ].widgets[LastElement.id.split("-")[1]];
                    Page.Save();
                }
                break;
            case "ContextLinkRename":
                {
                    MicroModal.showOption(
                        "Rename Link",
                        '<label class="modal__label">Name</label><input id="input-modal-link-rename" class="modal__input" />',
                        {
                            okTrigger: (data) => RenameLink(data),
                        }
                    );
                    console.log(LastElement);
                    $("#input-modal-link-rename")[0].value =
                        LastElement.firstChild.href;
                }
                break;
            case "ContextLinkOpenTab":
                {
                    window.open(LastElement.firstChild.href);
                }
                break;
            case "ContextLinkCopy":
                {
                    var text = LastElement.firstChild.href;

                    navigator.clipboard.writeText(text).then(
                        () => {
                            /* success */
                        },
                        () => {
                            /* failure */
                        }
                    );
                }
                break;
        }
    },
    false
);

function RenameLink(data) {
    console.log(data);
}

function AddContext(element) {
    element.addEventListener(
        "contextmenu",
        function (e) {
            LastElement = e.target;
            switch (LastElement.tagName) {
                case "A":
                    LastElement = e.target.parentElement;
                    break;
                case "DIV":
                case "P":
                    LastElement = e.target.parentElement.parentElement;
                    break;
                case "IMG":
                    LastElement =
                        e.target.parentElement.parentElement.parentElement;
                    break;
            }

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
