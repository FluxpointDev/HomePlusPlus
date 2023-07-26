window.CurrentPage = {
    PageKey: "page-home",
    PageData: null,
    Save: function PageData_Save() {
        window.localStorage.setItem(PageKey, JSON.stringify(PageData));
    },
};

var CurrentPage = window.CurrentPage;

Load_Data();
function Load_Data() {
    Page_Load("page-home");

    for (let [key, value] of Object.entries(localStorage)) {
        if (key.startsWith("page-") && key !== "page-home") {
            var node = document.createElement("li");
            node.id = "nav-" + key;
            node.setAttribute("onclick", "Page_Load(" + key + ")");

            var pagelink = document.createElement("a");

            var PageSettings = JSON.parse(value);

            pagelink.innerHTML = PageSettings.name;
            node.append(pagelink);
            $("#nav-bar").append(node);
        }
    }

    LoadItems();
}

function LoadItems() {
    var sortableList = document.querySelector(".sortable-list");

    window.CurrentPage.PageData.sections[0].widgets.forEach((element) => {
        sortableList.append(window.DOM.CreateWidget(element));
    });

    window.GlobalSort.sort(function (item) {});
}

function Page_Load(page_key) {
    $(".section").each(function () {
        // $(this).remove();
    });

    var JsonContent = window.localStorage.getItem(page_key);
    if (JsonContent) {
        window.CurrentPage.PageData = JSON.parse(JsonContent);
        $("#nav-page-home")[0].children[0].innerHTML =
            window.CurrentPage.PageData.name;
    } else {
        window.CurrentPage.PageData = {};
        window.CurrentPage.PageData.name = "Home";
        window.CurrentPage.PageData.sections = Array({
            id: randomString(),
            widgets: Array(),
        });
        window.localStorage.setItem(
            window.CurrentPage.PageKey,
            JSON.stringify(window.CurrentPage.PageData)
        );
    }
}

// document
//    .getElementById("btn-page-delete")
//    .addEventListener("click", Page_Delete);

function Page_Delete() {
    if (CurrentPage.PageKey === "page-home") {
        return;
    }

    $("#nav-" + CurrentPage.PageKey).remove();
}

function randomString() {
    var length = 10;
    var chars =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split(
            ""
        );

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = "";
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
