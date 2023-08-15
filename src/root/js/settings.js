import Data from "./DataModule.js";
import Http from "./HttpModule.js";

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
        SetDocumentStyle("--theme-color", colorObject.hex);
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
        SetDocumentStyle("--theme-background-color", colorObject.hex);
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

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
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
