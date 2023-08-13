window.IsExtension = typeof chrome !== "undefined";
window.IsFirefox = navigator.userAgent.indexOf("Firefox") > 0;
window.IsChrome = navigator.userAgent.indexOf("Chrome") > 0;

window.DOM = {
    CreateWidget: function DOM_CreateWidget(data) {
        var Object = document.createElement("div");
        Object.id = "widget-" + data.id;
        Object.classList.add("widget");

        var Inner = document.createElement("div");
        Inner.className = "widget-inner";
        //Inner.setAttribute("ondragstart", "event.preventDefault();");

        Inner.setAttribute("draggable", "false");
        if (data.color) {
            var RGB = hexToRgb(data.color);
            RGB += ",0.3";
            Inner.style.setProperty("background-color", "RGBA(" + RGB + ")");
        }

        switch (data.type) {
            case "link":
                {
                    var LinkObj = document.createElement("a");
                    LinkObj.href = data.link;

                    LinkObj.setAttribute("draggable", "false");

                    Object.classList.add("widget-link");
                    Object_CreateWidgetLink(data, Inner);

                    LinkObj.append(Inner);

                    var Name = document.createElement("p");
                    Name.textContent = data.name;

                    LinkObj.append(Name);

                    Object.append(LinkObj);
                }
                break;
            case "clock":
                {
                    Object.classList.add("widget-clock");
                    Object.prepend(Inner);
                }
                break;
        }
        if (window.Context) {
            window.Context.AddContextMenu(Object);
        }

        return Object;
    },
    LoadBackground: () => LoadBackground(),
    ToggleDebugOptions: () => ToggleDebugOptions(),
};

function ToggleDebugOptions() {
    var Options = ["#dropdown-debug-settings", "#dropdown-debug-page"];

    Options.forEach((element) => {
        if (window.Data.Settings.Debug) {
            $(element)[0].style = "";
        } else {
            $(element)[0].style = "display: none;";
        }
    });
}

function Object_CreateWidgetLink(data, main) {
    var Image = document.createElement("img");
    Image.src = data.image;
    if (data.defaultImage) {
        Image.src =
            'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="96" height="96" viewBox="0 0 256 256"%3E%3Cg fill="%23479cd0"%3E%3Cpath d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96Z" opacity=".2"%2F%3E%3Cpath d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm-26.37 144h52.74C149 186.34 140 202.87 128 215.89c-12-13.02-21-29.55-26.37-47.89ZM98 152a145.72 145.72 0 0 1 0-48h60a145.72 145.72 0 0 1 0 48Zm-58-24a87.61 87.61 0 0 1 3.33-24h38.46a161.79 161.79 0 0 0 0 48H43.33A87.61 87.61 0 0 1 40 128Zm114.37-40h-52.74C107 69.66 116 53.13 128 40.11c12 13.02 21 29.55 26.37 47.89Zm19.84 16h38.46a88.15 88.15 0 0 1 0 48h-38.46a161.79 161.79 0 0 0 0-48Zm32.16-16h-35.43a142.39 142.39 0 0 0-20.26-45a88.37 88.37 0 0 1 55.69 45ZM105.32 43a142.39 142.39 0 0 0-20.26 45H49.63a88.37 88.37 0 0 1 55.69-45ZM49.63 168h35.43a142.39 142.39 0 0 0 20.26 45a88.37 88.37 0 0 1-55.69-45Zm101.05 45a142.39 142.39 0 0 0 20.26-45h35.43a88.37 88.37 0 0 1-55.69 45Z"%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    }
    main.append(Image);

    return main;
}

function hexToRgb(hex) {
    if (hex) {
        if (hex[0] === "#") {
            hex = hex.substring(1);
        }

        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        return r + "," + g + "," + b;
    }
    return "255,255,255";
}

function LoadBackground() {
    if (window.Data.Settings.Theme.BackgroundImage) {
        document.documentElement.classList.add("html-background");
        if (
            window.Data.Settings.Theme.BackgroundImage === "background.jpg" ||
            window.Data.Settings.Theme.BackgroundImage === "background.webp"
        ) {
            SetDocumentStyle(
                "background-image",
                "url('parts/background.webp'), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"
            );
        } else {
            SetDocumentStyle(
                "background-image",
                "url('" +
                    window.Data.Settings.Theme.BackgroundImage +
                    "'), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"
            );
        }
    } else {
        document.documentElement.classList.remove("html-background");
        document.documentElement.style.removeProperty("background-image");
    }
}

function SetDocumentStyle(key, style) {
    document.documentElement.style.setProperty(key, style);
}
