"use strict";
class Toasts {
    constructor(t) {
        let s = {
            position: "top-right",
            stack: [],
            offsetX: 20,
            offsetY: 20,
            gap: 20,
            numToasts: 0,
            duration: ".5s",
            timing: "ease",
            dimOld: !0,
        };
        this.options = Object.assign(s, t);
    }
    push(t) {
        this.numToasts++;
        let s = document.createElement(t.link ? "a" : "div");
        t.link &&
            ((s.href = t.link),
            (s.target = t.linkTarget ? t.linkTarget : "_self")),
            (s.className =
                "toast-notification" +
                (t.style ? " toast-notification-" + t.style : "") +
                " toast-notification-" +
                this.position),
            (s.innerHTML = DOMPurify.sanitize(`
            <div class="toast-notification-wrapper">
                ${
                    t.title
                        ? '<h3 class="toast-notification-header">' +
                          t.title +
                          "</h3>"
                        : ""
                }
                ${
                    t.content
                        ? '<div class="toast-notification-content">' +
                          t.content +
                          "</div>"
                        : ""
                }
            </div>
            ${
                null == t.closeButton || !0 === t.closeButton
                    ? '<button class="toast-notification-close">&times;</button>'
                    : ""
            }
        `)),
            document.body.appendChild(s),
            s.getBoundingClientRect(),
            "top-left" == this.position
                ? ((s.style.top = 0), (s.style.left = this.offsetX + "px"))
                : "top-center" == this.position
                ? ((s.style.top = 0), (s.style.left = 0))
                : "top-right" == this.position
                ? ((s.style.top = 0), (s.style.right = this.offsetX + "px"))
                : "bottom-left" == this.position
                ? ((s.style.bottom = 0), (s.style.left = this.offsetX + "px"))
                : "bottom-center" == this.position
                ? ((s.style.bottom = 0), (s.style.left = 0))
                : "bottom-right" == this.position &&
                  ((s.style.bottom = 0), (s.style.right = this.offsetX + "px")),
            (t.width || this.width) &&
                (s.style.width = (t.width || this.width) + "px"),
            (s.dataset.transitionState = "queue");
        let e = this.stack.push({
            element: s,
            props: t,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            index: 0,
        });
        (this.stack[e - 1].index = e - 1),
            s.querySelector(".toast-notification-close") &&
                (s.querySelector(".toast-notification-close").onclick = (t) => {
                    t.preventDefault(), this.closeToast(this.stack[e - 1]);
                }),
            t.link && (s.onclick = () => this.closeToast(this.stack[e - 1])),
            this.openToast(this.stack[e - 1]),
            t.onOpen && t.onOpen(this.stack[e - 1]);
    }
    openToast(t) {
        if (!0 === this.isOpening()) return !1;
        (t.element.dataset.transitionState = "opening"),
            (t.element.style.transition =
                this.duration + " transform " + this.timing),
            this._transformToast(t),
            t.element.addEventListener("transitionend", () => {
                if ("opening" == t.element.dataset.transitionState) {
                    t.element.dataset.transitionState = "complete";
                    for (let s = 0; s < this.stack.length; s++)
                        "queue" ==
                            this.stack[s].element.dataset.transitionState &&
                            this.openToast(this.stack[s]);
                    t.props.dismissAfter &&
                        this.closeToast(t, t.props.dismissAfter);
                }
            });
        for (let s = 0; s < this.stack.length; s++)
            "complete" == this.stack[s].element.dataset.transitionState &&
                ((this.stack[s].element.dataset.transitionState = "opening"),
                (this.stack[s].element.style.transition =
                    this.duration +
                    " transform " +
                    this.timing +
                    (this.dimOld
                        ? ", " + this.duration + " opacity ease"
                        : "")),
                this.dimOld &&
                    this.stack[s].element.classList.add(
                        "toast-notification-dimmed"
                    ),
                (this.stack[s].offsetY += t.element.offsetHeight + this.gap),
                this._transformToast(this.stack[s]));
        return !0;
    }
    closeToast(t, s = null) {
        return !0 === this.isOpening()
            ? (setTimeout(() => this.closeToast(t, s), 100), !1)
            : "close" == t.element.dataset.transitionState ||
                  (t.element.querySelector(".toast-notification-close") &&
                      (t.element.querySelector(
                          ".toast-notification-close"
                      ).onclick = null),
                  (t.element.dataset.transitionState = "close"),
                  (t.element.style.transition =
                      ".2s opacity ease" + (s ? " " + s : "")),
                  (t.element.style.opacity = 0),
                  t.element.addEventListener("transitionend", () => {
                      if ("close" == t.element.dataset.transitionState) {
                          let s = t.element.offsetHeight;
                          t.props.onClose && t.props.onClose(t),
                              t.element.remove();
                          for (let e = 0; e < t.index; e++)
                              (this.stack[e].element.style.transition =
                                  this.duration + " transform " + this.timing),
                                  (this.stack[e].offsetY -= s + this.gap),
                                  this._transformToast(this.stack[e]);
                          let i = this.getFocusedToast();
                          i &&
                              i.element.classList.remove(
                                  "toast-notification-dimmed"
                              );
                      }
                  }),
                  !0);
    }
    isOpening() {
        let t = !1;
        for (let s = 0; s < this.stack.length; s++)
            "opening" == this.stack[s].element.dataset.transitionState &&
                (t = !0);
        return t;
    }
    getFocusedToast() {
        for (let t = 0; t < this.stack.length; t++)
            if (this.stack[t].offsetY == this.offsetY) return this.stack[t];
        return !1;
    }
    _transformToast(t) {
        "top-center" == this.position
            ? (t.element.style.transform = `translate(calc(50vw - 50%), ${t.offsetY}px)`)
            : "top-right" == this.position || "top-left" == this.position
            ? (t.element.style.transform = `translate(0, ${t.offsetY}px)`)
            : "bottom-center" == this.position
            ? (t.element.style.transform = `translate(calc(50vw - 50%), -${t.offsetY}px)`)
            : ("bottom-left" == this.position ||
                  "bottom-right" == this.position) &&
              (t.element.style.transform = `translate(0, -${t.offsetY}px)`);
    }
    set stack(t) {
        this.options.stack = t;
    }
    get stack() {
        return this.options.stack;
    }
    set position(t) {
        this.options.position = t;
    }
    get position() {
        return this.options.position;
    }
    set offsetX(t) {
        this.options.offsetX = t;
    }
    get offsetX() {
        return this.options.offsetX;
    }
    set offsetY(t) {
        this.options.offsetY = t;
    }
    get offsetY() {
        return this.options.offsetY;
    }
    set gap(t) {
        this.options.gap = t;
    }
    get gap() {
        return this.options.gap;
    }
    set numToasts(t) {
        this.options.numToasts = t;
    }
    get numToasts() {
        return this.options.numToasts;
    }
    set width(t) {
        this.options.width = t;
    }
    get width() {
        return this.options.width;
    }
    set duration(t) {
        this.options.duration = t;
    }
    get duration() {
        return this.options.duration;
    }
    set timing(t) {
        this.options.timing = t;
    }
    get timing() {
        return this.options.timing;
    }
    set dimOld(t) {
        this.options.dimOld = t;
    }
    get dimOld() {
        return this.options.dimOld;
    }
}
