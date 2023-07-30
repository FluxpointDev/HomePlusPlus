document
    .getElementById("nav-dropdown")
    .addEventListener("click", (elm) => Dropdown_OptionSettings(elm.target));

async function Dropdown_OptionSettings(element) {
    console.log("Dropdown clicked");
    console.log(element);
    switch (element.id) {
        case "dropdown-settings":
            {
                $("#SettingsPanel")[0].classList.add("panel-show");

                return;

                if (!window.IsExtension) {
                    MicroModal.showError(
                        "Addon Error",
                        "Addon has not been installed."
                    );
                    return;
                }
                chrome.runtime.openOptionsPage();
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
                return;
            }
            break;
    }
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
