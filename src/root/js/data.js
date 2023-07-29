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
};

LoadSettings();
function LoadSettings() {
    var JsonContent = window.localStorage.getItem("settings");
    if (JsonContent) {
        window.Data.Settings = JSON.parse(JsonContent);
        if (window.Data.Settings.Theme.Color !== "#479cd0") {
            SetDocumentStyle("--theme-color", window.Data.Settings.Theme.Color);
        }
        window.DOM.LoadBackground();
    } else {
        window.Data.Save();
    }
}

function LoadSettingsPanel() {
    /* var ThemeBackgroundPicker = new Alwan("#theme-color-picker", {
        theme: "dark",
        toggle: true,
        color: window.Data.Settings.Theme.Color,
        popover: false,
        preset: true,
        toggleSwatches: false,
        preview: true,
        opacity: false,
        format: "hex",
        target: "#theme-color-menu",
        inputs: {
            rgb: true,
            hex: true,
            hsl: false,
        },
    });

    ThemeBackgroundPicker.on("change", function (colorObject, source) {
        console.log("color changed: ");
        console.log(colorObject.hex);

        SetDocumentStyle("--theme-color", colorObject.hex);
        window.Data.Settings.Save();
    }); */

    var ThemeColorPicker = LoadThemePicker(
        window.Data.Settings.Theme.Color,
        "#theme-color-picker",
        "#theme-color-menu"
    );

    ThemeColorPicker.on("change", function (colorObject, source) {
        SetDocumentStyle("--theme-color", colorObject.hex);
        window.Data.Settings.Theme.Color = colorObject.hex;
        window.Data.Save();
    });

    var ThemeBackgroundColorPicker = LoadThemePicker(
        window.Data.Settings.Theme.BackgroundColor,
        "#theme-background-color-picker",
        "#theme-background-color-menu"
    );

    ThemeBackgroundColorPicker.on("change", function (colorObject, source) {
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

function LoadThemePicker(setting, button, menu) {
    return new Alwan(button, {
        theme: "dark",
        toggle: true,
        color: setting,
        popover: false,
        preset: true,
        toggleSwatches: false,
        preview: true,
        opacity: false,
        format: "hex",
        target: menu,
        inputs: {
            rgb: true,
            hex: true,
            hsl: false,
        },
    });
}

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
}
