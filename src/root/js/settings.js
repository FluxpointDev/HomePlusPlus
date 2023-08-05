window.Settings = {
    UpdateDataSize: () => UpdateDataSize(),
};

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

    $("#text-settings-data-size")[0].textContent =
        (_lsTotal / 1024).toFixed(2) + " KB";
}

$("#btn-settings-theme-background-image-save")[0].addEventListener(
    "click",
    UpdateBackgroundImage
);

async function UpdateBackgroundImage() {
    var WebURL = $("#input-settings-theme-background-image")[0].value;

    if (typeof WebURL === "undefined") return;

    var b64 = await window.Http.GetImageBase64(WebURL);

    window.Data.Settings.Theme.BackgroundImage = b64.Image;
    window.Data.Settings.Theme.BackgroundImagePrimaryColor = b64.Color;
    window.Data.Save();

    DOM.LoadBackground();
}

$("#btn-settings-theme-background-image-default")[0].addEventListener(
    "click",
    DefaultBackgroundImage
);

function DefaultBackgroundImage() {
    window.Data.Settings.Theme.BackgroundImage = "background.jpg";
    window.Data.Settings.Theme.BackgroundImagePrimaryColor = null;
    window.Data.Save();

    DOM.LoadBackground();
}

$("#btn-settings-theme-background-image-clear")[0].addEventListener(
    "click",
    ClearBackgroundImage
);

function ClearBackgroundImage() {
    window.Data.Settings.Theme.BackgroundImage = null;
    window.Data.Settings.Theme.BackgroundImagePrimaryColor = null;
    window.Data.Save();

    DOM.LoadBackground();
}

$("#btn-settings-close")[0].addEventListener("click", CloseSettingsPanel);

function CloseSettingsPanel() {
    $("#SettingsPanel")[0].classList.remove("panel-show");
}

$("#select-theme-mode")[0].addEventListener("change", ThemeModeChange);

function ThemeModeChange() {
    window.Data.Settings.Theme.Mode = this.value;
    if (window.Data.Settings.Theme.Mode === "dark") {
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-light");
    } else {
        document.body.classList.add("theme-light");
        document.body.classList.remove("theme-dark");
    }
    window.Data.Save();
    window.Data.ThemeModeChanged();
}

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
}

$("#btn-settings-data-delete")[0].addEventListener("click", OpenResetDataModal);

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
