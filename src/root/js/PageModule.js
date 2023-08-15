import StorageHelper from "./StorageHelper.js";
import Data from "./DataModule.js";
import Utils from "./UtilsModule.js";
import DOM from "./DomModule.js";

class PageModule {
    constructor() {
        this.CurrentPage = "page-home";
        this.PageData = {
            id: "home",
            name: "Home",
            sections: {},
        };
    }

    async LoadInitialData() {
        await this.LoadPage();

        $("#nav-page-home")[0].addEventListener(
            "click",
            this.SwitchPage("page-home")
        );
        if (this.PageData.name !== "Home") {
            $("#nav-page-home")[0].children[0].textContent = this.PageData.name;
        }
        this.LoadNavLinks();
    }

    LoadNavLinks() {
        for (let [key, value] of Object.entries(localStorage)) {
            if (key.startsWith("page-") && key !== "page-home") {
                var node = document.createElement("li");
                node.id = "nav-" + key;
                node.addEventListener("click", () => this.SwitchPage(key));
                var pagelink = document.createElement("a");

                var PageSettings = JSON.parse(value);

                pagelink.textContent = PageSettings.name;
                node.append(pagelink);
                $("#nav-bar").append(node);
            }
        }
    }

    SwitchPage(id) {
        this.CurrentPage = id;
        this.LoadPage();
    }

    async LoadPage() {
        var JsonString = StorageHelper.GetLocalData(this.CurrentPage);
        if (JsonString) {
            this.PageData = JSON.parse(JsonString);
        } else {
            if (window.IsExtension) {
                try {
                    JsonString = await StorageHelper.GetExtensionData(
                        this.CurrentPage
                    );
                    this.PageData = JSON.parse(JsonString);
                } catch {}
            }

            if (JsonString) {
                if (this.CurrentPage == "page-home") {
                    var BackupPages = await chrome.storage.local.get(null);

                    for (let [key, value] of Object.entries(BackupPages)) {
                        if (key.startsWith("page-")) {
                            localStorage.setItem(key, value);
                        }
                    }
                }
            } else {
                if (this.CurrentPage == "page-home") {
                    var SectionId = Utils.GenerateRandomID();
                    this.PageData.sections[SectionId] = {
                        id: SectionId,
                        widgets: {},
                    };
                    this.Save();
                } else {
                    this.PageData = null;
                }
            }
        }
        this.LoadSections();
    }

    LoadSections() {
        var sortableList = document.querySelector(".sortable-list");
        sortableList.innerHTML = "";
        $(".section")[0].id =
            "section-" + Object.values(this.PageData.sections)[0].id;

        for (let [key, value] of Object.entries(
            Object.values(this.PageData.sections)[0].widgets
        )) {
            sortableList.append(DOM.CreateWidget(value));
        }

        import("./context.js");
        //this.GlobalSort.sort(function (item) {});
    }

    Save() {
        StorageHelper.SaveData(this.CurrentPage, this.PageData);
    }
}

export default new PageModule();
