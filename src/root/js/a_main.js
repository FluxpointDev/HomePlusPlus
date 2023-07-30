window.IsExtension = typeof chrome !== "undefined";

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

    if (typeof Link === "undefined") {
        return;
    }

    Link = Link.toLowerCase();

    if (Link.startsWith("https://") === false) {
        Link = "https://" + Link;
    }
    if (Link.startsWith("http://") === false) {
        Link = "http://" + Link;
    }

    var Data = null;

    if (Link.includes("://localhost") || Link.includes("://127.0.0.1")) {
        Data = {
            id: randomString(),
            name: "Localhost",
            link: Link,
            type: "link",
            image: 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="96" height="96" viewBox="0 0 256 256"%3E%3Cg fill="%23479cd0"%3E%3Cpath d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96Z" opacity=".2"%2F%3E%3Cpath d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-26.37 144h52.74C149 186.34 140 202.87 128 215.89c-12-13.02-21-29.55-26.37-47.89ZM98 152a145.72 145.72 0 0 1 0-48h60a145.72 145.72 0 0 1 0 48Zm-58-24a87.61 87.61 0 0 1 3.33-24h38.46a161.79 161.79 0 0 0 0 48H43.33A87.61 87.61 0 0 1 40 128Zm114.37-40h-52.74C107 69.66 116 53.13 128 40.11c12 13.02 21 29.55 26.37 47.89Zm19.84 16h38.46a88.15 88.15 0 0 1 0 48h-38.46a161.79 161.79 0 0 0 0-48Zm32.16-16h-35.43a142.39 142.39 0 0 0-20.26-45a88.37 88.37 0 0 1 55.69 45ZM105.32 43a142.39 142.39 0 0 0-20.26 45H49.63a88.37 88.37 0 0 1 55.69-45ZM49.63 168h35.43a142.39 142.39 0 0 0 20.26 45a88.37 88.37 0 0 1-55.69-45Zm101.05 45a142.39 142.39 0 0 0 20.26-45h35.43a88.37 88.37 0 0 1-55.69 45Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
            defaultImage: true,
        };
    } else {
        var Json = await window.Http.GetFaviconBase64(Link);

        Data = {
            id: randomString(),
            name: Json.Name,
            link: Link,
            type: "link",
            image: Json.Image,
            color: Json.Color,
        };
    }

    Object.values(window.CurrentPage.PageData.sections)[0].widgets[Data.id] =
        Data;

    var sortableList = document.querySelector(".sortable-list");

    sortableList.append(window.DOM.CreateWidget(Data));
    window.CurrentPage.Save();

    window.GlobalSort.sort(function (item) {});
}

window.onload = function () {
    console.log("Initialize home");

    if (window.IsExtension) {
        $("#dropdown-version")[0].innerHTML =
            "v" + chrome.runtime.getManifest().version;
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
