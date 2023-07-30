window.DOM = {
    CreateWidget: function DOM_CreateWidget(data) {
        var Object = document.createElement("div");
        Object.classList.add("widget");

        var Inner = document.createElement("div");
        Inner.className = "widget-inner";
        Inner.setAttribute("ondragstart", "event.preventDefault();");
        Inner.setAttribute("draggable", "false");
        if (data.color) {
            var RGB = hexToRgb(data.color);
            RGB += ",0.3";
            Inner.style.setProperty("background-color", "RGBA(" + RGB + ")");
        }

        switch (data.type) {
            case "link":
                {
                    Object.classList.add("widget-link");
                    Inner.append(Object_CreateWidgetLink(data, Object));
                }
                break;
            case "clock":
                {
                    Object.classList.add("widget-clock");
                }
                break;
        }
        Object.prepend(Inner);
        return Object;
    },
    LoadBackground: () => LoadBackground(),
};

function Object_CreateWidgetLink(data, main) {
    var Object = document.createElement("a");
    Object.href = data.link;
    Object.setAttribute("target", "_blank");

    var Image = document.createElement("img");
    Image.src = data.image;

    Object.append(Image);

    var Name = document.createElement("p");
    Name.innerHTML = data.name;

    main.append(Name);
    return Object;
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
        if (window.Data.Settings.Theme.BackgroundImage === "background.jpg") {
            SetDocumentStyle(
                "background-image",
                "url('parts/background.jpg'), linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))"
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
