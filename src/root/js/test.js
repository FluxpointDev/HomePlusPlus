import Data from "./DataModule.js";
import DOM from "./DomModule.js";
import Page from "./PageModule.js";

document
    .getElementById("nav-dropdown")
    .addEventListener("click", (elm) => Dropdown_OptionSettings(elm.target));

let EnableDebugCount = 0;

let NavBar = $(".page-head")[0];

window.addEventListener("scroll", (e) => {
    if (window.scrollY > 16) {
        NavBar.classList.add("sticky-head");
    } else {
        NavBar.classList.remove("sticky-head");
    }
});

async function Dropdown_OptionSettings(element) {
    if (element.tagName !== "p") {
        $("#nav-dropdown")[0].children[1].style.display = "none";
    }

    switch (element.id) {
        case "dropdown-settings":
            {
                window.Settings.OpenSettingsPanel();

                // chrome.runtime.openOptionsPage();
            }
            break;
        case "dropdown-about":
            {
                MicroModal.showError(
                    "About Home++",
                    `This extension was made by Builderb (Fluxpoint Development)<br />
                    Check out the source code on our <a target="_blank" href="https://github.com/FluxpointDev/HomePlusPlus">GitHub</a><br />
                    Join our Discord server: <a target="_blank" href="https://discord.gg/fluxpoint">https://discord.gg/fluxpoint</a><br /><br />
                    3rd party modules used<br />
                    JQuery by John Resig <a target="_blank" href="https://github.com/jquery/jquery">Link</a><br />
                    Alwan color picker by Sofian - <a target="_blank" href="https://github.com/SofianChouaib/alwan">Link</a><br />
                    MicroModal by Indrashish - <a target="_blank" href="https://github.com/ghosh/Micromodal">Link</a><br />
                    Toasts by Varun - <a target="_blank" href="https://github.com/apvarun/toastify-js">Link</a><br />
                    `
                );
            }
            break;
        case "dropdown-debug":
            {
                if (!window.IsExtension) {
                    MicroModal.showError(
                        "Addon Error",
                        "Addon has not been installed."
                    );
                    return;
                }

                var BrowserName = "Unknown";
                var BrowserBuild = "Unknown";
                if (window.IsFirefox) {
                    var Browser = await browser.runtime.getBrowserInfo();
                    BrowserName = Browser.name + ` (v${Browser.version})`;
                    BrowserBuild = Browser.buildID;
                } else if (window.IsChrome) {
                    BrowserName = "Chrome";
                }

                var Platform = await chrome.runtime.getPlatformInfo();
                var AddonId = chrome.runtime.id;
                MicroModal.showError(
                    "Debug Info",
                    `Extension ID: ${AddonId}<br /><br />
                    Browser: ${BrowserName}<br />
                        Build: ${BrowserBuild}<br /><br />
                        OS: ${Platform.os} (${Platform.arch})`
                );
            }
            break;
        case "dropdown-version":
            {
                EnableDebugCount += 1;
                if (EnableDebugCount >= 3) {
                    Data.Settings.Debug = !Data.Settings.Debug;
                    Data.Save();
                    window.DOM.ToggleDebugOptions();
                }
            }
            break;
        case "dropdown-debug-settings":
            {
                MicroModal.showOption(
                    "Settings Json",
                    "<div id='json-viewer'></div>",
                    {
                        okTrigger: (data) => JsonSaveSettings(data),
                    }
                );
                new JsonEditor("#json-viewer", Data.Settings);
            }
            break;
        case "dropdown-debug-page":
            {
                MicroModal.showOption(
                    "Page Json",
                    "<div id='json-viewer'></div>",
                    {
                        okTrigger: (data) => JsonSaveSettings(data),
                    }
                );
                new JsonEditor("#json-viewer", Page.PageData);
            }
            break;
        case "dropdown-request-topsite":
            {
                chrome.permissions.request({
                    permissions: ["topSites"],
                });
            }
            break;
    }
    setTimeout(function () {
        $("#nav-dropdown")[0].children[1].style.display = "";
    }, 1);
}

function JsonSaveSettings() {}

function ModalClose(data) {
    console.log("Modal close");
    console.log(data);
}

function ModalSuccess(data) {
    console.log("Modal success");
    console.log(data);
}

//document.getElementById("btn-toggleedit").addEventListener("click", ToggleEdit);

function ToggleEdit() {
    var edit_button = document.getElementById("btn-toggleedit");
    if (edit_button.classList.contains("edit-toggled"))
        edit_button.classList.remove("edit-toggled");
    else edit_button.classList.add("edit-toggled");
}
