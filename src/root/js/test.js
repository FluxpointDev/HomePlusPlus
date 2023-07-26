document
    .getElementById("nav-dropdown")
    .addEventListener("click", (elm) => Dropdown_OptionSettings(elm.target));

async function Dropdown_OptionSettings(element) {
    console.log("Dropdown clicked");
    console.log(element);
    switch (element.id) {
        case "dropdown-settings":
            {
                if (typeof browser === "undefined") {
                    MicroModal.showError(
                        "Addon Error",
                        "Addon has not been installed."
                    );
                    return;
                }
                browser.runtime.openOptionsPage();
            }
            break;
        case "dropdown-debug":
            {
                if (typeof browser === "undefined") {
                    MicroModal.showError(
                        "Addon Error",
                        "Addon has not been installed."
                    );
                    return;
                }

                var Browser = await browser.runtime.getBrowserInfo();
                var Platform = await browser.runtime.getPlatformInfo();
                MicroModal.showError(
                    "Debug Info",
                    `Browser: ${Browser.name} (v${Browser.version})<br />
                        Build: ${Browser.buildID}<br /><br />
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