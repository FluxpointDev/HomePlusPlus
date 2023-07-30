import "./jquery-min.js";
import "./dom.js";

import "./data.js";
import "./http.js";
import "./colorpicker-min.js";

import "./order2.js";

import "./page_data.js";

import("./test.js");

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
    $("#input-modal-create-link")[0].value = "https://";
    $("#input-modal-create-link")[0].addEventListener(
        "keypress",
        ModalSuccessLinkEnter
    );
    $("#input-modal-create-link")[0].addEventListener("paste", OnPasteLink);
}

function ModalSuccessLinkEnter(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("btn-modal-create-link-success").click();
    }
}

function OnPasteLink(event) {
    var PasteData = event.clipboardData.getData("Text");
    if (
        this.value &&
        this.value.startsWith("https://") &&
        PasteData.startsWith("https://")
    ) {
        this.value = PasteData;
    }
}

async function ModalSuccesLinkCreate(data) {
    var Link = data.children[2].value;

    if (Link === "undefined") {
        return;
    }

    if (Link.startsWith("https://") === false) {
        Link = "https://" + Link;
    }

    var Json = await window.Http.GetFaviconBase64(Link);

    var Data = {
        id: randomString(),
        name: Json.Name,
        link: Link,
        type: "link",
        image: Json.Image,
        color: Json.Color,
    };
    Object.values(window.CurrentPage.PageData.sections)[0].widgets[Data.id] =
        Data;

    var sortableList = document.querySelector(".sortable-list");

    sortableList.append(window.DOM.CreateWidget(Data));
    window.CurrentPage.Save();

    window.GlobalSort.sort(function (item) {});
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
