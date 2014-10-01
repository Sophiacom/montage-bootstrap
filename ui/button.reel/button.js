/**
 * @module /ui/button.reel
 */
var AbstractButton = require("montage/ui/base/abstract-button").AbstractButton;

/**
 * @class Button
 * @extends AbstractButton
 */
exports.Button = AbstractButton.specialize( /** @lends Button# */ {

    hasTemplate: {
        value: false
    },

    constructor: {
        value: function Button() {
            this.super();
        }
    },

    labelSave: {
        value: null
    },
    dataLoadingText: {
        value: null
    },

    enterDocument: {
        value: function(firstDraw) {
            this.super(firstDraw);

            if (firstDraw) {
                if (this.originalElement.tagName === "BUTTON") {
                    this.classList.add("btn");
                }

                this.defineBindings({
                    "element.disabled": { "<-": "!enabled" }
                });
            }
        }
    },

    draw: {
        value: function() {
            this.super();

            if (this.dataLoadingText !== null) {
                this.element.setAttribute("data-loading-text", this.dataLoadingText);
            }
        }
    },

    startLoadingState: {
        value: function() {
            if (this.dataLoadingText !== null) {
                this.classList.add("disabled");
                this.labelSave = this.label;
                this.label = this.dataLoadingText;
            }
        }
    },

    stopLoadingState: {
        value: function() {
            if (this.dataLoadingText !== null) {
                this.classList.remove("disabled");
                this.label = this.labelSave;
            }
        }
    }

});
