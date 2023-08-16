import Data from "./DataModule.js";
import Http from "./HttpModule.js";
import Page from "./PageModule.js";
import Utils from "./UtilsModule.js";
import DOM from "./DomModule.js";

window.Settings = {
    OpenSettingsPanel: () => OpenSettingsPanel(),
    UpdateDataSize: () => UpdateDataSize(),
    HasPanelHandle: false,
};

var PickerThemeColor;
var PickerBackgroundColor;

async function getFileContentAsText(file) {
    const response = await fetch(file);
    const fileContent = await response.text();
    return fileContent;
}

async function OpenSettingsPanel() {
    var SettingsPanel = $("#page-panel-right")[0];
    SettingsPanel.innerHTML = await getFileContentAsText("parts/settings.html");
    window.Settings.HasPanelHandle = true;
    UpdateDataSize();

    if (Data.Settings.Theme.Mode !== $("#select-theme-mode")[0].value) {
        $("#select-theme-mode")[0].value = Data.Settings.Theme.Mode;
    }

    PickerThemeColor = LoadThemePicker(
        Data.Settings.Theme.Color,
        "#theme-color-picker",
        "#theme-color-menu",
        ["#479cd0", "#fd3585", "#be5b31", "#1aa056"]
    );

    PickerThemeColor.on("change", function (colorObject, source) {
        Utils.SetDocumentStyle("--theme-color", colorObject.hex);
        Data.Settings.Theme.Color = colorObject.hex;
        Data.Save();
    });

    PickerBackgroundColor = LoadThemePicker(
        Data.Settings.Theme.BackgroundColor,
        "#theme-background-color-picker",
        "#theme-background-color-menu",
        ["#161719"]
    );

    PickerBackgroundColor.on("change", function (colorObject, source) {
        Utils.SetDocumentStyle("--theme-background-color", colorObject.hex);
        Data.Settings.Theme.BackgroundColor = colorObject.hex;
        Data.Save();
    });

    $("#btn-settings-theme-background-image-save")[0].addEventListener(
        "click",
        UpdateBackgroundImage
    );

    $("#btn-settings-theme-background-image-default")[0].addEventListener(
        "click",
        DefaultBackgroundImage
    );

    $("#btn-settings-theme-background-image-clear")[0].addEventListener(
        "click",
        ClearBackgroundImage
    );

    $("#btn-settings-close")[0].addEventListener("click", CloseSettingsPanel);

    $("#select-theme-mode")[0].addEventListener("change", ThemeModeChange);

    $("#btn-settings-data-delete")[0].addEventListener(
        "click",
        OpenResetDataModal
    );

    $("#btn-settings-data-backup-settings")[0].addEventListener(
        "click",
        BackupSettings
    );

    $("#btn-settings-data-restore-settings")[0].addEventListener(
        "click",
        RestoreSettings
    );

    $("#input-settings-data-restore-settings").change(RestoreSettingsSelected);

    $("#btn-settings-data-backup-page")[0].addEventListener(
        "click",
        BackupPage
    );

    $("#btn-settings-data-restore-page")[0].addEventListener(
        "click",
        RestorePage
    );

    $("#input-settings-data-restore-page").change(RestorePageSelected);

    if (Data.Settings.Theme.BackgroundImagePosition) {
        $("#text-settings-background-position")[0].textContent =
            Data.Settings.Theme.BackgroundImagePosition + "%";

        $("#slider-settings-background-position")[0].value = String(
            Data.Settings.Theme.BackgroundImagePosition
        );
    }

    $("#slider-settings-background-position")[0].addEventListener(
        "change",
        BackgroundPosition
    );
}

function BackgroundPosition(event) {
    $("#text-settings-background-position")[0].textContent =
        event.target.valueAsNumber + "%";
    Utils.SetDocumentStyle(
        "--theme-background-position",
        event.target.valueAsNumber
    );
    Data.Settings.Theme.BackgroundImagePosition = event.target.valueAsNumber;
    Data.Save();
}

function BackupSettings() {
    var myString = JSON.stringify(Data.Settings);

    Utils.SaveToFile(myString, "hpp_settings.json");
}

function RestoreSettings() {
    $("#input-settings-data-restore-settings")[0].click();
}

function RestoreSettingsSelected(event) {
    var reader = new FileReader();
    reader.onload = (event) => {
        var obj = JSON.parse(event.target.result);
        if (obj.Theme === "undefined") {
            console.log("Failed to validate settings json.");
        } else {
            Data.Settings = obj;
            Data.Save();
            location.reload();
        }
    };
    reader.readAsText(event.target.files[0]);
}

function BackupPage() {
    var myString = JSON.stringify(Page.PageData);

    Utils.SaveToFile(myString, "hpp_page_" + Page.PageData.name + ".json");
}

function RestorePage() {
    $("#input-settings-data-restore-page")[0].click();
}

function RestorePageSelected(event) {
    var reader = new FileReader();
    reader.onload = (event) => {
        var obj = JSON.parse(event.target.result);
        if (obj.Theme === "undefined") {
            console.log("Failed to validate settings json.");
        } else {
            Page.PageData = obj;
            Page.Save();
            location.reload();
        }
    };
    reader.readAsText(event.target.files[0]);
}

function CloseSettingsPanel() {
    $("#page-panel-right")[0].innerHTML = "";
    window.Settings.HasPanelHandle = false;
}

function UpdateDataSize() {
    var _lsTotal = 0,
        _xLen,
        _x;
    for (_x in localStorage) {
        if (!localStorage.hasOwnProperty(_x)) {
            continue;
        }
        _xLen = (localStorage[_x].length + _x.length) * 2;
        _lsTotal += _xLen;
    }

    if (window.Settings.HasPanelHandle) {
        $("#text-settings-data-size")[0].textContent =
            (_lsTotal / 1024).toFixed(2) + " KB";
    }
}

async function UpdateBackgroundImage() {
    var b64 = null;
    if (
        $("#input-settings-theme-background-image-file")[0].files.length !== 0
    ) {
        if (
            $("#input-settings-theme-background-image-file")[0].files[0].size >
            1000000
        ) {
            MicroModal.showError(
                "Upload Limit",
                "You can only upload an image less than 1 MB."
            );
            return;
        }

        var ImageArray = await $(
            "#input-settings-theme-background-image-file"
        )[0].files[0].arrayBuffer();

        var b64 = await Http.GetBackgroundUploadBase64({
            Image: ImageArray,
            Type: $("#input-settings-theme-background-image-file")[0].files[0]
                .type,
        });
    } else {
        var WebURL = $("#input-settings-theme-background-image")[0].value;

        if (WebURL !== "undefined") {
            MicroModal.showError(
                "URL Required",
                "You need to enter an image url to show as background."
            );
        }
        if (typeof WebURL === "undefined") return;

        var b64 = await Http.GetImageBase64(WebURL);
    }

    Data.Settings.Theme.BackgroundImage = b64.Image;
    Data.Settings.Theme.BackgroundImagePrimaryColor = b64.Color;
    Data.Save();

    DOM.LoadBackground();
}

function DefaultBackgroundImage() {
    Data.Settings.Theme.BackgroundImage = "background.webp";
    Data.Settings.Theme.BackgroundImagePrimaryColor = null;
    Data.Save();

    DOM.LoadBackground();
}

function ClearBackgroundImage() {
    Data.Settings.Theme.BackgroundImage = null;
    Data.Settings.Theme.BackgroundImagePrimaryColor = null;
    Data.Save();

    DOM.LoadBackground();
}

function ThemeModeChange() {
    Data.Settings.Theme.Mode = this.value;
    if (Data.Settings.Theme.Mode === "dark") {
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-light");
    } else {
        document.body.classList.add("theme-light");
        document.body.classList.remove("theme-dark");
    }
    Data.Save();

    PickerThemeColor.setOptions({ theme: Data.Settings.Theme.Mode });
    PickerBackgroundColor.setOptions({
        theme: Data.Settings.Theme.Mode,
    });
}

function LoadThemePicker(setting, button, menu, defaults) {
    return new Alwan(button, {
        theme: Data.Settings.Theme.Mode,
        toggle: true,
        color: setting,
        popover: false,
        preset: true,
        toggleSwatches: true,
        preview: true,
        opacity: false,
        format: "hex",
        target: menu,
        inputs: {
            rgb: true,
            hex: true,
            hsl: false,
        },
        swatches: defaults,
    });
}

function OpenResetDataModal() {
    MicroModal.showOption(
        "Reset Data",
        "Are you sure you want to reset all data?",
        {
            okTrigger: (data) => ResetDataConfirm(data),
        }
    );
}

async function ResetDataConfirm(data) {
    if (window.IsExtension) {
        await chrome.storage.location.clear();
    }
    window.localStorage.clear();

    location.reload();
}
