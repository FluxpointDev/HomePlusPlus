import DOM from "./DomModule.js";

!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = t())
        : "function" == typeof define && define.amd
        ? define(t)
        : ((e = e || self).MicroModal = t());
})(this, function () {
    "use strict";
    return (function () {
        var e = [
            "a[href]",
            "area[href]",
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            "select:not([disabled]):not([aria-hidden])",
            "textarea:not([disabled]):not([aria-hidden])",
            "button:not([disabled]):not([aria-hidden])",
            "iframe",
            "object",
            "embed",
            "[contenteditable]",
            '[tabindex]:not([tabindex^="-"])',
        ];
        class t {
            constructor({
                targetModal: e,
                triggers: t,
                onShow: o,
                onClose: i,
                openTrigger: n,
                closeTrigger: s,
                okTrigger: x,
                disableScroll: a,
                disableFocus: l,
                awaitCloseAnimation: d,
                awaitOpenAnimation: r,
                debugMode: c,
                message: m,
                title: tm,
                fullWidth: fm,
            }) {
                (this.modal = document.getElementById(e)),
                    (t = t || []),
                    (o = o || function () {}),
                    (i = i || function () {}),
                    (n = n || "data-micromodal-trigger"),
                    (s = s || "data-micromodal-close"),
                    (x = x || function () {}),
                    (a = a || !1),
                    (l = l || !1),
                    (d = d || !1),
                    (r = r || !1),
                    (c = c || !1),
                    (fm = fm || false),
                    (this.config = {
                        debugMode: c,
                        disableScroll: a,
                        openTrigger: n,
                        closeTrigger: s,
                        okTrigger: x,
                        onShow: o,
                        onClose: i,
                        awaitCloseAnimation: d,
                        awaitOpenAnimation: r,
                        disableFocus: l,
                        message: m,
                        title: tm,
                        fullWidth: fm,
                    }),
                    t.length > 0 && this.registerTriggers(...t),
                    (this.onClick = this.onClick.bind(this)),
                    (this.onKeydown = this.onKeydown.bind(this));
            }
            registerTriggers() {
                var e = Array.prototype.slice.call(arguments, 0);
                var that = this;
                e.filter(Boolean).forEach(function (e) {
                    e.addEventListener("click", function (e) {
                        return that.showModal(e);
                    });
                });
            }
            showModal() {
                if (
                    this.modal.id === "modal-error" ||
                    this.modal.id === "modal-option"
                ) {
                    var ModalObject = this.modal.children[0].children[0];
                    ModalObject.children[0].children[0].textContent =
                        this.config.title;
                    if (this.config.message) {
                        ModalObject.children[1].children[0].innerHTML =
                            DOMPurify.sanitize(this.config.message);
                    }
                }

                var FirstFocusElement = null;

                this.modal.children[0].children[0].children[1].childNodes.forEach(
                    (element) => {
                        if (element.tagName === "INPUT") {
                            if (element.value) {
                                element.value = "";
                            }
                            if (FirstFocusElement === null) {
                                FirstFocusElement = element;
                            }
                        }
                    }
                );

                if (
                    ((this.activeElement = document.activeElement),
                    this.modal.setAttribute("aria-hidden", "false"),
                    this.modal.classList.add("is-open"),
                    this.scrollBehaviour("disable"),
                    this.addEventListeners(),
                    this.config.awaitOpenAnimation)
                ) {
                    var that = this;
                    var e = function () {
                        that.modal.removeEventListener("animationend", e, !1),
                            that.setFocusToFirstNode();
                    };
                    this.modal.addEventListener("animationend", e, !1);
                } else this.setFocusToFirstNode();
                if (FirstFocusElement) {
                    FirstFocusElement.focus();
                }
                if (this.config.fullWidth) {
                    this.modal.classList.add("modal-fullwidth");
                } else {
                    this.modal.classList.remove("modal-fullwidth");
                }

                this.config.onShow(this.modal, this.activeElement);
            }
            closeModal() {
                var e = this.modal;
                //console.log('micromodal.min.js: this.config.awaitCloseAnimation: ',this.config.awaitCloseAnimation);

                this.modal.setAttribute("aria-hidden", "true"),
                    this.removeEventListeners(),
                    this.scrollBehaviour("enable"),
                    this.activeElement && this.activeElement.focus(),
                    this.config.onClose(this.modal),
                    this.config.awaitCloseAnimation
                        ? this.modal.addEventListener(
                              "animationend",
                              function t() {
                                  e.classList.remove("is-open"),
                                      e.removeEventListener(
                                          "animationend",
                                          t,
                                          !1
                                      );
                              },
                              !1
                          )
                        : e.classList.remove("is-open");
            }
            closeModalById(e) {
                (this.modal = document.getElementById(e)),
                    this.modal && this.closeModal();
            }
            scrollBehaviour(e) {
                if (!this.config.disableScroll) return;
                var t = document.querySelector("body");
                switch (e) {
                    case "enable":
                        Object.assign(t.style, { overflow: "", height: "" });
                        break;
                    case "disable":
                        Object.assign(t.style, {
                            overflow: "hidden",
                            height: "100vh",
                        });
                }
            }
            addEventListeners() {
                this.modal.addEventListener("touchstart", this.onClick),
                    this.modal.addEventListener("click", this.onClick),
                    document.addEventListener("keydown", this.onKeydown);
            }
            removeEventListeners() {
                this.modal.removeEventListener("touchstart", this.onClick),
                    this.modal.removeEventListener("click", this.onClick),
                    document.removeEventListener("keydown", this.onKeydown);
            }
            onClick(e) {
                if (
                    e.target.className !== "modal__overlay" &&
                    e.target.className !== "modal__close" &&
                    e.target.localName !== "button"
                ) {
                    return;
                }

                if (e.target.hasAttribute(this.config.closeTrigger)) {
                    this.closeModal();
                    e.preventDefault();
                    return;
                }

                if (e.target.hasAttribute("data-micromodal-ok")) {
                    this.config.okTrigger(
                        this.modal.children[0].children[0].children[1]
                    );
                    this.closeModal();
                    e.preventDefault();
                }
            }
            onKeydown(e) {
                27 === e.keyCode && this.closeModal(e),
                    9 === e.keyCode && this.maintainFocus(e);
            }
            getFocusableNodes() {
                var t = this.modal.querySelectorAll(e);
                return Array(...t);
            }
            setFocusToFirstNode() {
                if (this.config.disableFocus) return;
                var e = this.getFocusableNodes();
                e.length && e[0].focus();
            }
            maintainFocus(e) {
                var t = this.getFocusableNodes();
                if (this.modal.contains(document.activeElement)) {
                    var o = t.indexOf(document.activeElement);
                    e.shiftKey &&
                        0 === o &&
                        (t[t.length - 1].focus(), e.preventDefault()),
                        e.shiftKey ||
                            o !== t.length - 1 ||
                            (t[0].focus(), e.preventDefault());
                } else t[0].focus();
            }
        }
        var o = null;
        var i = function (e) {
                if (!document.getElementById(e))
                    return (
                        console.warn(
                            `MicroModal: ❗Seems like you have missed %c'${e}'`,
                            "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
                            "ID somewhere in your code. Refer example below to resolve it."
                        ),
                        console.warn(
                            "%cExample:",
                            "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
                            `<div class="modal" id="${e}"></div>`
                        ),
                        !1
                    );
            },
            n = function (e, t) {
                if (
                    ((function (e) {
                        if (e.length <= 0)
                            console.warn(
                                "MicroModal: ❗Please specify at least one %c'micromodal-trigger'",
                                "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
                                "data attribute."
                            ),
                                console.warn(
                                    "%cExample:",
                                    "background-color: #f8f9fa;color: #50596c;font-weight: bold;",
                                    '<a href="#" data-micromodal-trigger="my-modal"></a>'
                                );
                    })(e),
                    !t)
                )
                    return !0;
                for (var o in t) i(o);
                return !0;
            };
        return {
            init: function (e) {
                var i = Object.assign(
                        {},
                        { openTrigger: "data-micromodal-trigger" },
                        e
                    ),
                    s = [...document.querySelectorAll(`[${i.openTrigger}]`)],
                    a = (function (e, t) {
                        var o = [];
                        return (
                            e.forEach(function (e) {
                                var i = e.attributes[t].value;
                                void 0 === o[i] && (o[i] = []), o[i].push(e);
                            }),
                            o
                        );
                    })(s, i.openTrigger);
                if (!0 !== i.debugMode || !1 !== n(s, a))
                    for (var l in a) {
                        var e = a[l];
                        (i.targetModal = l),
                            (i.triggers = [...e]),
                            (o = new t(i));
                    }
            },
            show: function (e, n) {
                var s = n || {};

                (s.targetModal = e),
                    (!0 === s.debugMode && !1 === i(e)) ||
                        (o = new t(s)).showModal();
            },
            showError(title, message, n) {
                var e = "modal-error";
                var s = n || {};
                s.title = title;
                s.message = message;

                (s.targetModal = e),
                    (!0 === s.debugMode && !1 === i(e)) ||
                        (o = new t(s)).showModal();
            },
            showOption(title, message, n) {
                var e = "modal-option";
                var s = n || {};
                s.title = title;
                s.message = message;

                (s.targetModal = e),
                    (!0 === s.debugMode && !1 === i(e)) ||
                        (o = new t(s)).showModal();
            },
            close: function (e) {
                e ? o.closeModalById(e) : o.closeModal();
            },
        };
    })();
});
