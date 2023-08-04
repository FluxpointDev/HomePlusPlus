window.Setup = {
    LoadSetupWindow: () => LoadSetupWindow(),
};

async function getFileContentAsText(file) {
    const response = await fetch(file);
    const fileContent = await response.text();
    return fileContent;
}

async function LoadSetupWindow() {
    const tbl = document.querySelectorAll("[data-srco]");
    for (var i = 0; i < tbl.length; i++) {
        try {
            tbl[i].outerHTML = await getFileContentAsText(tbl[i].dataset.srco);
        } catch {}
    }
}
