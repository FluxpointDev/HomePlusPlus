import "./jquery-min.js";

import("./test.js");
import("./order2.js");
import("./data.js");
import("./context.js");
import("./micromodal.js");

// Initial config for setting up modals

async function getFileContentAsText(file) {
    const response = await fetch(file);
    const fileContent = await response.text();
    return fileContent;
}

insertContentsFromFiles();
async function insertContentsFromFiles() {
    console.log("Load files");
    const tbl = document.querySelectorAll("[data-src]"); // get elements with the data attribute "data-src"
    for (
        var i = 0;
        i < tbl.length;
        i++ // loop over the elements contained in tbl
    ) {
        try {
            tbl[i].outerHTML = await getFileContentAsText(tbl[i].dataset.src);
        } catch {}
    }

    MicroModal.init({
        disableScroll: false,
        awaitCloseAnimation: true,
    });
}

window.onload = function () {
    console.log("Initialize home");
    LoadItems();
    getClockTime();
    setInterval(getClockTime, 3000 * 15);
};

function LoadItems() {
    var sortableList = document.querySelector(".sortable-list");

    var item = CreateItem();
    sortableList.append(item);
    LoadDragItems();
    SetDragEvents(item);
}
function CreateItem() {
    var node = document.createElement("div");
    node.setAttribute("draggable", true);
    node.className = "widget widget-link";

    var item_inner = document.createElement("div");
    item_inner.className = "widget-inner";
    item_inner.setAttribute("ondragstart", "event.preventDefault();");
    item_inner.setAttribute("draggable", "false");

    var item_a = document.createElement("a");

    var item_image = document.createElement("img");
    item_image.setAttribute(
        "src",
        "https://cdn.discordapp.com/avatars/1039854207559282729/c2a9cd24f464b310080a6a7d52a45f46.webp?size=256"
    );

    item_a.append(item_image);

    var item_name = document.createElement("p");
    item_name.textContent = "Test Name";

    item_a.append(item_name);

    item_inner.append(item_a);

    node.append(item_inner);
    return node;
}

function getClockTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var meridiem = "AM";

    if (hour > 12) {
        hour = hour - 12;
        $meridiem = "PM";
    }
    if (hour == 0) {
        hour = 12;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    var timeString = hour + ":" + minute + " " + meridiem;
    document.getElementById("clock").innerHTML = timeString;
}
