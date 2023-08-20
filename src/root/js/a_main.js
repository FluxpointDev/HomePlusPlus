// Do not set window objects here

// Important defaults
import "./jquery-min.js";
import "./purify-min.js";
import "./toast-min.js";

// Basic modules
import Utils from "./UtilsModule.js";
import StorageHelper from "./StorageHelper.js";
import Http from "./HttpModule.js";
import Data from "./DataModule.js"; // Requires StorageHelper and Utils
import DOM from "./DomModule.js"; // Requires Utils and Data
import Page from "./PageModule.js"; // Requires StorageHelper, Data, Utils and DOM
import Modals from "./ModalsModule.js";

Data.LoadSettings(DOM);
Page.LoadInitialData();
Data.CreateDataUpdater(Page);

// Extra modules
import "./colorpicker-min.js";
import "./order.js";
import("./test.js"); // Requires DOM and Data
import("./micromodal.js");
import "./setup.js";
import("./settings.js"); // Requires Data, Http, Page, Utils and DOM

// Load settings data

var OptionalModules = ["./json_editor-min.js"];

window.onload = function () {
    console.log("Initialize home");

    // Setup page here
    // DOM.LoadHtmlPart("#PartSetup", "parts/setup.html");

    if (window.IsExtension) {
        $("#dropdown-version")[0].textContent =
            "v" + chrome.runtime.getManifest().version;
    }

    getClockTime();
    setInterval(getClockTime, 15000);
    Modals.LoadEvents();

    OptionalModules.forEach((element) => {
        import(element);
    });

    if (window.IsExtension && window.IsChrome) {
        // Check for update here
    }
};

function ToastService() {
    return new Toasts({
        width: 300,
        timing: "ease",
        duration: ".5s",
        dimOld: false,
        position: "top-left",
    });
}

function LoadToastsTest() {
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
    $("#clock")[0].textContent = timeString;
}
