(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    window["FLS"] = false;
    isWebp();
    class VideoWithBackground {
        video;
        canvas;
        step;
        ctx;
        frameRate=200;
        constructor(videoElement, canvasElement) {
            const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            if (!mediaQuery.matches) {
                this.video = videoElement;
                this.canvas = canvasElement;
                window.addEventListener("load", this.init, false);
                window.addEventListener("unload", this.cleanup, false);
                console.log("video init");
            }
        }
        draw=() => {
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        };
        drawLoop=() => {
            this.draw();
            this.step = setTimeout((() => {
                window.requestAnimationFrame(this.drawLoop);
            }), this.frameRate);
        };
        drawPause=() => {
            clearTimeout(this.step);
            this.step = void 0;
        };
        init=() => {
            this.ctx = this.canvas.getContext("2d");
            this.video.addEventListener("loadeddata", this.draw, false);
            this.video.addEventListener("seeked", this.draw, false);
            this.video.addEventListener("play", this.drawLoop, false);
            this.video.addEventListener("pause", this.drawPause, false);
            this.video.addEventListener("ended", this.drawPause, false);
            this.video.controls = false;
            if (!this.video.paused) this.drawLoop();
        };
        cleanup=() => {
            this.video.removeEventListener("loadeddata", this.draw);
            this.video.removeEventListener("seeked", this.draw);
            this.video.removeEventListener("play", this.drawLoop);
            this.video.removeEventListener("pause", this.drawPause);
            this.video.removeEventListener("ended", this.drawPause);
        };
    }
    const videoContainers = document.querySelectorAll("[data-video-ambient]");
    if (videoContainers.length) videoContainers.forEach((container => {
        const videoElement = container.querySelector("[data-video]");
        const canvasElement = container.querySelector("[data-canvas]");
        if (videoElement && canvasElement) new VideoWithBackground(videoElement, canvasElement);
    }));
    function customSpollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        const dataSpollerItem = spollerTitle.closest("[data-spoller-item]");
                        const dataSpollerContent = dataSpollerItem.querySelector("[data-spoller-content]");
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) dataSpollerContent.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            dataSpollerContent.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller-item]") && el.closest("[data-spoller]")) {
                    const spollerItem = el.closest("[data-spoller-item]");
                    const spollerTitle = spollerItem.querySelector("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    const dataSpollerContent = spollerItem.querySelector("[data-spoller-content]");
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(dataSpollerContent, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    const dataSpollerItem = spollerActiveTitle.closest("[data-spoller-item]");
                    const dataSpollerContent = dataSpollerItem.querySelector("[data-spoller-content]");
                    _slideUp(dataSpollerContent, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerClose.classList.remove("_spoller-active");
                    const dataSpollerItem = spollerClose.closest("[data-spoller-item]");
                    const dataSpollerContent = dataSpollerItem.querySelector("[data-spoller-content]");
                    _slideUp(dataSpollerContent, spollerSpeed);
                }));
            }));
        }
    }
    customSpollers();
    function animateCount(element, duration = 2e3) {
        const DURATION = duration;
        let start = 0;
        const end = 100;
        const increment = end / (DURATION / 16);
        const interval = 16;
        function updateCount() {
            start += increment;
            if (start >= end) element.textContent = end; else {
                element.textContent = Math.floor(start);
                setTimeout(updateCount, interval);
            }
        }
        updateCount();
    }
    function observeElements(observeElements) {
        observeElements.forEach((({element, callback, threshold = 1, offset = "0px"}) => {
            if (!element || typeof callback !== "function") {
                console.warn("Element is not correct:", element, callback);
                return;
            }
            const options = {
                threshold,
                rootMargin: offset
            };
            const observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    if (entry.isIntersecting) {
                        callback();
                        observer.unobserve(entry.target);
                    }
                }));
            }), options);
            observer.observe(element);
        }));
    }
    function parseOffset(offset) {
        if (typeof offset === "string") {
            if (offset.endsWith("%")) return Math.floor(parseFloat(offset) / 100 * window.innerHeight);
            return Math.floor(parseFloat(offset));
        } else if (typeof offset === "number") return Math.floor(offset);
        return 0;
    }
    observeElements([ {
        element: document.querySelector("#counter"),
        callback: () => animateCount(document.querySelector("#counter"), 1500),
        offset: `${parseOffset("-10%")}px 0px`
    }, {
        element: document.querySelector("#socials-platforms"),
        callback: () => {
            document.querySelector("#socials-platforms").classList.add("_anim");
        },
        offset: `${parseOffset("-10%")}px 0px`
    } ]);
})();