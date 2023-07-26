const list = document.querySelector(".sortable-list");
const listItems = list.querySelectorAll(".widget");

// let dragIndex, dragSource

const getMouseOffset = (evt) => {
    const targetRect = evt.target.getBoundingClientRect();
    const offset = {
        x: evt.pageX - targetRect.left,
        y: evt.pageY - targetRect.top,
    };
    return offset;
};

const getElementVerticalCenter = (el) => {
    const rect = el.getBoundingClientRect();
    return (rect.bottom - rect.top) / 2;
};

const appendPlaceholder = (evt, idx) => {
    evt.preventDefault();
    if (idx === dragIndex) {
        return;
    }

    const offset = getMouseOffset(evt);
    const middleY = getElementVerticalCenter(evt.target);
    const placeholder = list.children[dragIndex];

    // console.log(`hover on ${idx} ${offset.y > middleY ? 'bottom half' : 'top half'}`)
    if (offset.y > middleY) {
        list.insertBefore(evt.target, placeholder);
    } else if (list.children[idx + 1]) {
        list.insertBefore(evt.target.nextSibling || evt.target, placeholder);
    }
    return;
};

function sortAdd(item) {}

function sortable(onUpdate) {
    var dragEl;

    var rootEl = list;

    // Making all siblings movable
    [].slice.call(rootEl.children).forEach(function (itemEl) {
        itemEl.draggable = true;
    });

    // Function responsible for sorting
    function _onDragOver(evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";

        var target = evt.target;
        if (target && target !== dragEl && target.nodeName == "DIV") {
            // Sorting
            const offset = getMouseOffset(evt);
            const middleY = getElementVerticalCenter(evt.target);

            if (offset.y > middleY) {
                rootEl.insertBefore(dragEl, target.nextSibling);
            } else {
                rootEl.insertBefore(dragEl, target);
            }
        }
    }

    // End of sorting
    function _onDragEnd(evt) {
        evt.preventDefault();

        console.log("Drag ended");

        dragEl.classList.remove("ghost");
        rootEl.removeEventListener("dragover", _onDragOver, false);
        rootEl.removeEventListener("dragend", _onDragEnd, false);

        // Notification about the end of sorting
        onUpdate(dragEl);
    }

    // Sorting starts
    rootEl.addEventListener(
        "dragstart",
        function (evt) {
            dragEl = evt.target; // Remembering an element that will be moved

            console.log(dragEl);
            // Limiting the movement type
            evt.dataTransfer.effectAllowed = "move";
            evt.dataTransfer.setData("Text", dragEl.textContent);

            // Subscribing to the events at dnd
            rootEl.addEventListener("dragover", _onDragOver, false);
            rootEl.addEventListener("dragend", _onDragEnd, false);

            setTimeout(function () {
                // If this action is performed without setTimeout, then
                // the moved object will be of this class.
                dragEl.classList.add("ghost");
            }, 0);
        },
        false
    );
}

window.GlobalSort = {
    add: sortAdd,
    sort: sortable,
};
