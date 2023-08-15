import StorageHelper from "./StorageHelper.js";

class Data {
    constructor() {
        console.log(window.IsFirefox);
        this.Settings = {
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
        };
        this.HasLoaded = false;

        if (window.IsExtension) {
            chrome.storage.onChanged.addListener(async (changes, namespace) => {
                for (let [key, { oldValue, newValue }] of Object.entries(
                    changes
                )) {
                    if (key === "settings") {
                        if (this.HasLoaded) {
                            this.Settings = JSON.parse(newValue);
                        }
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
    }

    async LoadSettings() {
        var JsonString = StorageHelper.GetLocalData("settings2");
        if (JsonString) {
            this.Settings = JSON.parse(JsonString);
        } else {
            if (window.IsExtension) {
                try {
                    JsonString = await StorageHelper.GetExtensionData(
                        "settings"
                    );
                    this.Settings = JSON.parse(JsonString);
                } catch {}
            }

            if (!JsonString) {
                this.Settings.Theme.Mode = window?.matchMedia?.(
                    "(prefers-color-scheme:dark)"
                )?.matches
                    ? "dark"
                    : "light";
                this.Save();
            }
        }
        this.HasLoaded = true;

        if (JsonString) {
            if (this.Settings.Theme.Color !== "#479cd0") {
                SetDocumentStyle("--theme-color", this.Settings.Theme.Color);
            }
            if (this.Settings.Theme.Mode === "light") {
                document.body.classList.add("theme-light");
                document.body.classList.remove("theme-dark");
            }
        }

        window.DOM.LoadBackground();
        if (this.Settings.Debug) {
            window.DOM.ToggleDebugOptions();
        }
    }

    Save() {
        StorageHelper.SaveData("settings", this.Settings);
    }
}

export default new Data();
