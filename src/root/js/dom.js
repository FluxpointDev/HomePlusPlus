window.DOM = {
    CreateWidget: function DOM_CreateWidget(data) {
        var Object = document.createElement("div");
        Object.classList.add("widget");

        var Inner = document.createElement("div");
        Inner.className = "widget-inner";
        Inner.setAttribute("ondragstart", "event.preventDefault();");
        Inner.setAttribute("draggable", "false");

        switch (data.type) {
            case "link":
                {
                    Object.classList.add("widget-link");
                    Inner.append(Object_CreateWidgetLink(data));
                }
                break;
            case "clock":
                {
                    Object.classList.add("widget-clock");
                }
                break;
        }
        Object.append(Inner);
        return Object;
    },
};

function Object_CreateWidgetLink(data) {
    var Object = document.createElement("a");
    Object.href = data.link;
    Object.setAttribute("target", "_blank");

    var Image = document.createElement("img");
    Image.src = data.image;

    Object.append(Image);

    var Name = document.createElement("p");
    Name.innerHTML = data.name;

    Object.append(Name);
    return Object;
}
