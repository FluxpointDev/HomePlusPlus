$("#btn-settings-theme-background-image-save")[0].addEventListener(
    "click",
    UpdateBackgroundImage
);

async function UpdateBackgroundImage() {
    var WebURL = $("#input-settings-theme-background-image")[0].value;

    if (WebURL === "undefined") return;

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

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
}
