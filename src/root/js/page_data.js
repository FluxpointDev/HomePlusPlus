window.CurrentPage = {
    PageKey: "page-home",
    PageData: null,
    Save: function PageData_Save() {
        window.Data.setItem(
            window.CurrentPage.PageKey,
            JSON.stringify(window.CurrentPage.PageData)
        );
    },
};

await Load_Data();
async function Load_Data() {
    var JsonContent = window.Data.getItem(window.CurrentPage.PageKey);
    if (JsonContent) {
    } else if (window.IsExtension) {
        if (window.CurrentPage.PageKey === "page-home") {
            console.log("Loading pages from extension data.");
            var BackupPages = await chrome.storage.local.get(null);

            for (let [key, value] of Object.entries(BackupPages)) {
                if (key.startsWith("page-")) {
                    window.Data.setItem(key, value);
                }
            }
        }
    }

    Page_Load("page-home");

    for (let [key, value] of Object.entries(window.localStorage)) {
        if (key.startsWith("page-") && key !== "page-home") {
            var node = document.createElement("li");
            node.id = "nav-" + key;
            node.setAttribute("onclick", "Page_Load(" + key + ")");

            var pagelink = document.createElement("a");

            var PageSettings = JSON.parse(value);

            pagelink.textContent = PageSettings.name;
            node.append(pagelink);
            $("#nav-bar").append(node);
        }
    }

    LoadItems();
}

function LoadItems() {
    var sortableList = document.querySelector(".sortable-list");

    $(".section")[0].id =
        "section-" + Object.values(window.CurrentPage.PageData.sections)[0].id;

    for (let [key, value] of Object.entries(
        Object.values(window.CurrentPage.PageData.sections)[0].widgets
    )) {
        sortableList.append(window.DOM.CreateWidget(value));
    }

    import("./context.js");

    window.GlobalSort.sort(function (item) {});
}

async function Page_Load(page_key) {
    $(".section").each(function () {
        // $(this).remove();
    });

    var JsonContent = window.Data.getItem(page_key);
    if (JsonContent) {
        window.CurrentPage.PageData = JSON.parse(JsonContent);
    }
    if (JsonContent) {
        if (page_key === "page-home") {
            $("#nav-page-home")[0].children[0].textContent =
                window.CurrentPage.PageData.name;
        }
    } else {
        window.CurrentPage.PageData = {};
        window.CurrentPage.PageData.id = "home";
        window.CurrentPage.PageData.name = "Home";
        var SectionId = randomString();
        window.CurrentPage.PageData.sections = {};

        if (page_key === "page-home") {
            window.CurrentPage.PageData.sections[SectionId] = {
                id: SectionId,
                widgets: {},
            };
            window.Data.setItem(
                window.CurrentPage.PageKey,
                JSON.stringify(window.CurrentPage.PageData)
            );
        }
    }

    if (JsonContent) {
    } else {
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
