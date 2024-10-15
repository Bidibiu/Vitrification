"use strict";

class Utils {
    constructor() {}

    $(id) {
        return document.getElementById(id);
    }

    addHandler(elem, type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, handler);
        } else {
            elem["on" + type] = handler;
        }
    }

    getEvent(event) {
        return event || window.event;
    }

    getTarget(event) {
        return event.target || event.srcElement;
    }

    preventDefault(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }

    stopPropagation(event) {
        event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
    }
}

const utils = new Utils();