import Http from "./HttpModule.js";
import Utils from "./UtilsModule.js";
import DOM from "./DomModule.js";
import Page from "./PageModule.js";

class ModalsModule {
    constructor() {
        this.IsLoaded = false;
    }
    LoadEvents() {
        $("#btn-add")[0].addEventListener("click", () => {
            this.OpenCreateModal();
        });
    }

    async LoadModals() {
        console.log("Load DOM modules");
        await DOM.LoadHtmlPart("#PartModals", "parts/modals.html");

        MicroModal.init({
            disableScroll: false,
            awaitCloseAnimation: true,
        });

        $("#btn-modal-addpage")[0].addEventListener(
            "click",
            this.OpenPageModal
        );

        this.IsLoaded = true;
    }

    OpenCreateModal() {
        this.ModalSuccess();
        //MicroModal.show("modal-create", {
        //    okTrigger: (data) => ModalSuccess(data),
        //});
    }

    async OpenPageModal() {
        var pageCount = 0;
        for (let [key, value] of StorageHelper.GetAllItems()) {
            if (key.startsWith("page-")) {
                pageCount += 1;
            }
        }

        // MicroModal.close("modal-create");

        if (pageCount >= 5) {
            MicroModal.showError(
                "Page Limit",
                "You can only add up to 5 pages!"
            );
        } else {
            if (!this.IsLoaded) {
                await this.LoadModals();
            }

            MicroModal.show("modal-page-create", {
                okTrigger: (data) => ModalSuccess(data),
            });
        }
    }

    async ModalSuccess() {
        if (!this.IsLoaded) {
            await this.LoadModals();
        }

        MicroModal.show("modal-link-create", {
            okTrigger: (data) => this.ModalSuccesLinkCreate(data),
        });
        $("#input-modal-create-link")[0].value = "https://";
        $("#input-modal-create-link")[0].addEventListener(
            "keypress",
            this.ModalSuccessLinkEnter
        );
        $("#input-modal-create-link")[0].addEventListener(
            "paste",
            this.OnPasteLink
        );
    }

    ModalSuccessLinkEnter(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            $("#btn-modal-create-link-success")[0].click();
        }
    }

    async ModalSuccesLinkCreate(data) {
        var Link = data.children[2].value;

        if (typeof Link === "undefined") {
            return;
        }

        Link = Link.toLowerCase();

        if (!Link.startsWith("https://")) {
            Link = "https://" + Link;
        }

        var Data = null;

        if (Link.includes("://localhost") || Link.includes("://127.0.0.1")) {
            Data = {
                id: Utils.GenerateRandomID(),
                name: "Localhost",
                link: Link,
                type: "link",
                image: "",
                defaultImage: true,
                position: 0,
            };
        } else {
            var Json = await Http.GetFaviconBase64(Link);

            Data = {
                id: Utils.GenerateRandomID(),
                name: Json.Name,
                link: Link,
                type: "link",
                image: Json.Image,
                color: Json.Color,
                position: 0,
            };
        }

        Object.values(Page.PageData.sections)[0].widgets[Data.id] = Data;

        var sortableList = document.querySelector(".sortable-list");

        sortableList.append(DOM.CreateWidget(Data));
        Page.Save();

        //window.GlobalSort.sort(function (item) {});
    }

    OnPasteLink(event) {
        var PasteData = event.clipboardData.getData("Text");
        if (
            this.value &&
            this.value.startsWith("https://") &&
            PasteData.startsWith("https://")
        ) {
            this.value = PasteData;
            event.preventDefault();
        }
    }
}

export default new ModalsModule();
