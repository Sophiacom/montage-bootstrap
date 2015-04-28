/**
 * @module /ui/dropdown.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class DropdownLi
 * @extends Component
 */
exports.Dropdown = Component.specialize( /** @lends DropdownLi# */ {

    hasTemplate: {
        value: false
    },

    constructor: {
        value: function Dropdown() {
            this.super();

            this._pressComposer = new PressComposer();

            // The composers are only loaded when the overlay is shown.
            // This is because the composers are added to the document, and so
            // interferes with the default actions of all clicks by calling
            // preventDefault on click when the pointer is surrendered ,which
            // is whenever the dropdown isn't shown.
            this._pressComposer.lazyLoad = false;

            this.classList.add("dropdown");
        }
    },

    /**
     * Dispatched when the user dismiss the dropdown by clicking outside of it.
     * @event dismiss
     * @memberof DropdownLi
     * @param {Event} event
     */

    _pressComposer: {
        value: null
    },

    _isShown: {
        value: false
    },

    isShown: {
        get: function() {
            return this._isShown;
        }
    },

    // Dropdown type : "hover" or "click"
    type: {
        value: "hover"
    },

    toggleElement: {
        value: null
    },

    enterDocument: {
        value: function(firstTime) {
            this.super();
            if (firstTime) {
                this.addComposerForElement(this._pressComposer, this.element.ownerDocument);
            }

            this.toggleElement = this.element.querySelector('[data-toggle="dropdown"]');
            if (this.toggleElement === null){
                console.error('there is no element with attribute data-toggle="dropdown" in your dropdown component');
            }

            var self = this;

            this.dropdownHoverHandler = {
                handleMouseover: function(event) {
                    self.show();
                },
                handleMouseout: function(event) {
                    self.hide();
                }
            };

            if(window.Touch) {
                this.type = "click";
            }

            if (this.type === "hover") {
                if (this.toggleElement !== null) {
                    this.element.addEventListener("mouseover", this.dropdownHoverHandler, false);
                    this.element.addEventListener("mouseout", this.dropdownHoverHandler, false);
                } else {
                    console.error('there is no element with attribute data-toggle="dropdown" in your dropdown component');
                }
            } else if (this.type === "click") {
                this._addEventListeners();
                this._pressComposer.addEventListener("pressStart", this, false);
            } else {
                console.error("unknown dropdown type : " + this.type);
            }
        }
    },

    exitDocument: {
        value: function() {
            this.super();

            this.hide();

            if (this.type === "hover") {
                if (this.toggleElement !== null) {
                    this.element.removeEventListener("mouseover", this.dropdownHoverHandler, false);
                    this.element.removeEventListener("mouseout", this.dropdownHoverHandler, false);
                } else {
                    console.error('there is no element with attribute data-toggle="dropdown" in your dropdown component');
                }
            } else if (this.type === "click") {
                this._removeEventListeners();
                this._pressComposer.removeEventListener("pressStart", this, false);
            }

            this.toggleElement = null;
        }
    },

    handlePressStart: {
        value: function(event) {
            if (!this.element.contains(event.targetElement)) {
                this.dismissDropdown(event);
            }
        }
    },

    handleMousedown: {
        value: function(event) {
            this.clickAction();
        }
    },

    handleTouchstart: {
        value: function(event) {
            this.clickAction();
        }
    },

    clickAction: {
        value: function() {
            if (this.isShown) {
                this.hide();
            } else {
                this.show();
            }
        }
    },

    /**
     * User event has requested that we dismiss the dropdown. Give the delegate
     * an opportunity to prevent it. Returns whether the dropdown was hidden.
     */
    dismissDropdown: {
        value: function(event) {
            if (this._isShown) {
                this.hide();
                this._dispatchDismissEvent();
            }
        }
    },

    _dispatchDismissEvent: {
        value: function() {
            var dismissEvent = document.createEvent("CustomEvent");
            dismissEvent.initCustomEvent("dismiss", true, true, null);
            this.dispatchEvent(dismissEvent);
        }
    },

    hide: {
        value: function() {
            if (!this._isShown) {
                return;
            }
            if (this.type === "click") {
                this._pressComposer.unload();
            }
            this.classList.remove("open");
            this._isShown = false;
        }
    },

    show: {
        value: function() {
            if (this.isShown) {
                return;
            }
            if (this.type === "click") {
                this._pressComposer.load();
            }
            this.classList.add("open");
            this._isShown = true;
        }
    },

    _addEventListeners: {
        value: function() {
            // support touching the scale to select only in Desktop
            if(window.Touch) {
                this.element.addEventListener('touchstart', this, false);
            } else {
                this.element.addEventListener('mousedown', this, false);
            }
        }
    },

    _removeEventListeners: {
        value: function() {
            // support touching the scale to select only in Desktop
            if(window.Touch) {
                this.element.removeEventListener('touchstart', this, false);
            } else {
                this.element.removeEventListener('mousedown', this, false);
            }
        }
    },
});
