import "./jquery-min.js";
import "./dom.js";

import "./data.js";
import "./http.js";
import "./colorpicker-min.js";

import "./order2.js";

import "./page_data.js";

import("./test.js");

// import("./context.js");
import("./micromodal.js");

var OptionalModules = ["./settings.js"];

async function getFileContentAsText(file) {
    const response = await fetch(file);
    const fileContent = await response.text();
    return fileContent;
}

insertContentsFromFiles();
async function insertContentsFromFiles() {
    console.log("Load files");
    const tbl = document.querySelectorAll("[data-src]");
    for (var i = 0; i < tbl.length; i++) {
        try {
            tbl[i].outerHTML = await getFileContentAsText(tbl[i].dataset.src);
        } catch {}
    }

    window.Data.LoadSettingsPanel();

    OptionalModules.forEach((element) => {
        import(element);
    });

    document
        .getElementById("btn-add")
        .addEventListener("click", OpenCreateModal);

    document
        .getElementById("btn-modal-addpage")
        .addEventListener("click", OpenPageModal);

    MicroModal.init({
        disableScroll: false,
        awaitCloseAnimation: true,
    });
}

function ToastService() {
    return new Toasts({
        width: 300,
        timing: "ease",
        duration: ".5s",
        dimOld: false,
        position: "top-left",
    });
}

function OpenModals() {
    var Toasts = ToastService();
    Toasts.push({
        title: "My Toast Notification Title",
        content: "My toast notification description.",
        style: "success",
        dismissAfter: "5s",
    });
    Toasts.push({
        title: "My Toast Notification Title",
        content: "My toast notification description.",
        style: "error",
        dismissAfter: "5s",
    });
}

function OpenCreateModal() {
    MicroModal.show("modal-create", {
        okTrigger: (data) => ModalSuccess(data),
    });
}

function OpenPageModal() {
    var pageCount = 0;
    for (let [key, value] of Object.entries(localStorage)) {
        if (key.startsWith("page-")) {
            pageCount += 1;
        }
    }

    // MicroModal.close("modal-create");

    if (pageCount >= 5) {
        MicroModal.showError("Page Limit", "You can only add up to 5 pages!");
    } else {
        MicroModal.show("modal-page-create", {
            okTrigger: (data) => ModalSuccess(data),
        });
    }
}

function ModalSuccess(data) {
    console.log("Modal success page");
    console.log(data);

    MicroModal.show("modal-link-create", {
        okTrigger: (data) => ModalSuccesLinkCreate(data),
    });
}

async function ModalSuccesLinkCreate(data) {
    var Link = data.children[2].value;

    if (Link === "undefined") {
        return;
    }

    var Json = await window.Http.GetFaviconBase64(Link);

    window.CurrentPage.PageData.sections[0].widgets.push({
        name: Json.Name,
        link: Link,
        type: "link",
        image: Json.Image,
        color: Json.Color,
    });
    window.GlobalSort.sort(function (item) {});
    window.CurrentPage.Save();
}

window.onload = function () {
    console.log("Initialize home");

    if (typeof browser !== "undefined") {
        $("#dropdown-version")[0].innerHTML =
            "v" + browser.runtime.getManifest().version;
    }

    getClockTime();
    setInterval(getClockTime, 15000);
};

function CreateItem(name) {
    "https://cdn.discordapp.com/avatars/1039854207559282729/c2a9cd24f464b310080a6a7d52a45f46.webp?size=256";
}

function getClockTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var meridiem = "AM";

    if (hour > 12) {
        hour = hour - 12;
        meridiem = "PM";
    }
    if (hour == 0) {
        hour = 12;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var timeString = hour + ":" + minute + " " + meridiem;
    document.getElementById("clock").innerHTML = timeString;
}
