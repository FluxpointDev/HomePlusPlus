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
        setItem("settings", JSON.stringify(window.Data.Settings));
    },
    LoadSettingsPanel: () => LoadSettingsPanel(),
    ThemeModeChanged: () => ThemeModeChanged(),
    getAll: () => getAll(),
    getItem: (key) => getItem(key),
    setItem: (key, value) => setItem(key, value),
};

if (window.IsExtension) {
    chrome.storage.onChanged.addListener(async (changes, namespace) => {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            if (key === "settings") {
                window.Data.Settings = JSON.parse(newValue);
            }
            if (window.CurrentPage.PageKey === key) {
                window.CurrentPage.PageData = JSON.parse(newValue);
            }

            //console.log(
            //    `Storage key "${key}" in namespace "${namespace}" changed.`,
            //    `Old value was "${oldValue}", new value is "${newValue}".`
            //);
        }
    });
}

function getAll() {
    return Object.entries(window.localStorage);
}

function getItem(key) {
    return window.localStorage.getItem(key);
}

function setItem(key, value) {
    if (window.IsExtension) {
        chrome.storage.local.set({ [key]: value });
    }
    window.localStorage.setItem(key, value);
    try {
        window.Settings.UpdateDataSize();
    } catch {}
}

await LoadSettings();
async function LoadSettings() {
    var JsonContent = window.Data.getItem("settings");

    if (JsonContent) {
        window.Data.Settings = JSON.parse(JsonContent);
    } else {
        var HasContent = false;
        if (window.IsExtension) {
            JsonContent = await chrome.storage.local.get("settings");
            if (JsonContent.settings) {
                HasContent = true;
                window.Data.Settings = JSON.parse(JsonContent.settings);
                window.Data.Save();
            }
        }

        if (!HasContent) {
            window.Data.Settings.Theme.Mode = window?.matchMedia?.(
                "(prefers-color-scheme:dark)"
            )?.matches
                ? "dark"
                : "light";
            window.Data.Save();
        }
    }

    if (JsonContent) {
        if (window.Data.Settings.Theme.Color !== "#479cd0") {
            SetDocumentStyle("--theme-color", window.Data.Settings.Theme.Color);
        }
        if (window.Data.Settings.Theme.Mode === "light") {
            document.body.classList.add("theme-light");
            document.body.classList.remove("theme-dark");
        }
    }
    window.DOM.LoadBackground();
}

function ThemeModeChanged() {
    console.log("Theme change");
    PickerThemeColor.setOptions({ theme: window.Data.Settings.Theme.Mode });
    PickerBackgroundColor.setOptions({
        theme: window.Data.Settings.Theme.Mode,
    });
}

var PickerThemeColor;
var PickerBackgroundColor;

function LoadSettingsPanel() {
    if (window.Data.Settings.Theme.Mode !== $("#select-theme-mode")[0].value) {
        $("#select-theme-mode")[0].value = window.Data.Settings.Theme.Mode;
    }

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
