window.DOM = {
    CreateWidget: function DOM_CreateWidget(data) {
        var Object = document.createElement("div");
        Object.id = "widget-" + data.id;
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
                    var LinkObj = document.createElement("a");
                    LinkObj.href = data.link;

                    LinkObj.setAttribute(
                        "ondragstart",
                        "event.preventDefault();"
                    );
                    LinkObj.setAttribute("draggable", "false");

                    Object.classList.add("widget-link");
                    Object_CreateWidgetLink(data, Inner);

                    LinkObj.append(Inner);

                    var Name = document.createElement("p");
                    Name.innerHTML = data.name;

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
};

function Object_CreateWidgetLink(data, main) {
    var Image = document.createElement("img");
    Image.src = data.image;

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
