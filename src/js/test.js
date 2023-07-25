document.getElementById("btn-add").addEventListener("click", AddData);

function AddData() {
    console.log("Clicked add");

    var pageCount = 0;
    for (let [key, value] of Object.entries(localStorage)) {
        if (key.startsWith("page-")) {
            pageCount += 1;
        }
    }

    if (pageCount >= 5) {
        MicroModal.showError("Page Limit", "You can only add up to 5 pages!");
    } else {
        MicroModal.show("modal-page-create", {
            okTrigger: (data) => ModalSuccess(data),
            onClose: (data) => ModalClose(data),
        });
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
