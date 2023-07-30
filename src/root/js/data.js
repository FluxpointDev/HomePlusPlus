window.Data = {
    Settings: {
        Theme: {
            Mode: "dark",
            BackgroundColor: "#2b2b36",
            BackgroundImage: "background.jpg",
            BackgroundImagePrimaryColor: "",
            NavbarUseBackgroundColor: false,
            NavbarColor: "#666E99",
            Color: "#479cd0",
        },
        MainClock: {
            Show: true,
            Color: "#ffffff",
        },
    },
    Save: function Data_Save() {
        window.localStorage.setItem(
            "settings",
            JSON.stringify(window.Data.Settings)
        );
    },
    LoadSettingsPanel: () => LoadSettingsPanel(),
    ThemeModeChanged: () => ThemeModeChanged(),
};

LoadSettings();
function LoadSettings() {
    var JsonContent = window.localStorage.getItem("settings");
    if (JsonContent) {
        window.Data.Settings = JSON.parse(JsonContent);
        if (window.Data.Settings.Theme.Color !== "#479cd0") {
            SetDocumentStyle("--theme-color", window.Data.Settings.Theme.Color);
        }
    } else {
        window.Data.Save();
    }
    window.DOM.LoadBackground();
}

function ThemeModeChanged() {
    console.log("TRIGGER MODE");
    console.log(PickerThemeColor);
    PickerThemeColor.setOptions({ theme: window.Data.Settings.Theme.Mode });
    PickerBackgroundColor.setOptions({
        theme: window.Data.Settings.Theme.Mode,
    });
}

var PickerThemeColor;
var PickerBackgroundColor;

function LoadSettingsPanel() {
    PickerThemeColor = LoadThemePicker(
        window.Data.Settings.Theme.Color,
        "#theme-color-picker",
        "#theme-color-menu",
        ["#479cd0", "#fd3585", "#be5b31", "#1aa056"]
    );

    PickerThemeColor.on("change", function (colorObject, source) {
        SetDocumentStyle("--theme-color", colorObject.hex);
        window.Data.Settings.Theme.Color = colorObject.hex;
        window.Data.Save();
    });

    PickerBackgroundColor = LoadThemePicker(
        window.Data.Settings.Theme.BackgroundColor,
        "#theme-background-color-picker",
        "#theme-background-color-menu",
        ["#161719"]
    );

    PickerBackgroundColor.on("change", function (colorObject, source) {
        SetDocumentStyle("--theme-background-color", colorObject.hex);
        window.Data.Settings.Theme.BackgroundColor = colorObject.hex;
        window.Data.Save();
    });
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function LoadThemePicker(setting, button, menu, defaults) {
    return new Alwan(button, {
        theme: "dark",
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
