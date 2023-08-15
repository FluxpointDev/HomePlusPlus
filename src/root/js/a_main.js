// Do not set window objects here

// Important defaults
import "./jquery-min.js";
import "./purify-min.js";
import "./toast-min.js";

// Basic modules
import Utils from "./UtilsModule.js";
import StorageHelper from "./StorageHelper.js";
import Http from "./HttpModule.js";
import Data from "./DataModule.js"; // Requires StorageHelper
import DOM from "./DomModule.js"; // Requires Utils and Data
import Page from "./PageModule.js"; // Requires StorageHelper, Data, Utils and DOM

Data.LoadSettings(DOM);
Page.LoadInitialData();
Data.CreateDataUpdater(Page);

// Extra modules
import "./colorpicker-min.js";
import "./order.js";
import("./test.js"); // Requires DOM and Data
import("./micromodal.js");
import "./setup.js";
import("./settings.js"); // Requires Data and Http

// Load settings data

var OptionalModules = ["./json_editor-min.js"];

async function getFileContentAsText(file) {
    const response = await fetch(file);
    const fileContent = await response.text();
    return fileContent;
}

window.onload = function () {
    console.log("Initialize home");

    if (window.IsExtension) {
        $("#dropdown-version")[0].textContent =
            "v" + chrome.runtime.getManifest().version;
    }

    getClockTime();
    setInterval(getClockTime, 15000);
    insertContentsFromFiles();
};

function TestFunctionHere() {
    console.log("Test function");
}

//insertContentsFromFiles();
//window.Setup.LoadSetupWindow();
async function insertContentsFromFiles() {
    const tbl = document.querySelectorAll("[data-src]");
    for (var i = 0; i < tbl.length; i++) {
        try {
            tbl[i].outerHTML = await getFileContentAsText(tbl[i].dataset.src);
        } catch {}
    }

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

    if (window.IsExtension && window.IsChrome) {
        // Check for update here
    }
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
    ModalSuccess("");
    //MicroModal.show("modal-create", {
    //    okTrigger: (data) => ModalSuccess(data),
    //});
}

function OpenPageModal() {
    var pageCount = 0;
    for (let [key, value] of StorageHelper.GetAllItems()) {
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
        event.preventDefault();
    }
}

async function ModalSuccesLinkCreate(data) {
    var Link = data.children[2].value;

    if (typeof Link === "undefined") {
        return;
    }

    Link = Link.toLowerCase();

    if (!Link.startsWith("https://")) {
        Link = "https://" + Link;
    }

    var Data = null;

    if (Link.includes("://localhost") || Link.includes("://127.0.0.1")) {
        Data = {
            id: Utils.GenerateRandomID(),
            name: "Localhost",
            link: Link,
            type: "link",
            image: "",
            defaultImage: true,
            position: 0,
        };
    } else {
        var Json = await Http.GetFaviconBase64(Link);

        Data = {
            id: Utils.GenerateRandomID(),
            name: Json.Name,
            link: Link,
            type: "link",
            image: Json.Image,
            color: Json.Color,
            position: 0,
        };
    }

    Object.values(Page.PageData.sections)[0].widgets[Data.id] = Data;

    var sortableList = document.querySelector(".sortable-list");

    sortableList.append(DOM.CreateWidget(Data));
    Page.Save();

    //window.GlobalSort.sort(function (item) {});
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
    document.getElementById("clock").textContent = timeString;
}
