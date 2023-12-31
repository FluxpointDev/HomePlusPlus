import Data from "./DataModule.js";
import DOM from "./DomModule.js";
import Page from "./PageModule.js";
import Modals from "./ModalsModule.js";

$("#nav-dropdown")[0].addEventListener("click", (elm) =>
    Dropdown_OptionSettings(elm.target)
);

let EnableDebugCount = 0;

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
                if (!Modals.IsLoaded) {
                    await Modals.LoadModals();
                }
                MicroModal.showError(
                    "About Home++",
                    `This extension was made by Builderb (Fluxpoint Development)<br />
                    Check out the source code on our <a rel="noreferrer" target="_blank" href="https://github.com/FluxpointDev/HomePlusPlus">GitHub</a><br />
                    Join our Discord server: <a rel="noreferrer" target="_blank" href="https://discord.gg/fluxpoint">https://discord.gg/fluxpoint</a><br /><br />
                    3rd party modules used<br />
                    JQuery by John Resig <a rel="noreferrer" target="_blank" href="https://github.com/jquery/jquery">Link</a><br />
                    Alwan color picker by Sofian - <a rel="noreferrer" target="_blank" href="https://github.com/SofianChouaib/alwan">Link</a><br />
                    MicroModal by Indrashish - <a rel="noreferrer" target="_blank" href="https://github.com/ghosh/Micromodal">Link</a><br />
                    Toasts by Varun - <a rel="noreferrer" target="_blank" href="https://github.com/apvarun/toastify-js">Link</a><br />
                    Json Editor by dblate <a rel="noreferrer" target="_blank" href="https://github.com/dblate/jquery.json-editor">Link</a>
                    `
                );
            }
            break;
        case "dropdown-debug":
            {
                if (!Modals.IsLoaded) {
                    await Modals.LoadModals();
                }

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
                    DOM.ToggleDebugOptions();
                }
            }
            break;
        case "dropdown-debug-settings":
            {
                if (!Modals.IsLoaded) {
                    await Modals.LoadModals();
                }
                MicroModal.showOption(
                    "Settings Json",
                    "<p>DO NOT EDIT id values or add unknown values as this can cause issues.</p><div id='json-viewer'></div></div><br /><p>Do you want to save these settings?</p>",
                    {
                        okTrigger: (data) => {
                            Data.Settings = JSON.parse(
                                $("#json-viewer")[0].textContent
                            );
                            Data.Save();
                            location.reload();
                        },
                        fullWidth: true,
                    }
                );
                new JsonEditor("#json-viewer", Data.Settings);
            }
            break;
        case "dropdown-debug-page":
            {
                if (!Modals.IsLoaded) {
                    await Modals.LoadModals();
                }
                MicroModal.showOption(
                    "Page Json",
                    "<p>DO NOT EDIT id values or add unknown values as this can cause issues.</p><div id='json-viewer'></div><br /><p>Do you want to save these settings?</p>",
                    {
                        okTrigger: (data) => {
                            Page.PageData = JSON.parse(
                                $("#json-viewer")[0].textContent
                            );
                            Page.Save();
                            location.reload();
                        },
                        fullWidth: true,
                    }
                );
                new JsonEditor("#json-viewer", Page.PageData);
            }
            break;
    }
    setTimeout(function () {
        $("#nav-dropdown")[0].children[1].style.display = "";
    }, 1);
}

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
