window.Data = {
    Settings: {
        Debug: false,
        Theme: {
            Mode: "dark",
            BackgroundColor: "#2b2b36",
            BackgroundImage: "background.webp",
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
    if (window.Data.Settings.Debug) {
        window.DOM.ToggleDebugOptions();
    }
}

function ThemeModeChanged() {}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
}
