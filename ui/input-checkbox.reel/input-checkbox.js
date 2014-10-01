/**
 * @module /ui/input-checkbox.reel
 */
var AbstractCheckbox = require("montage/ui/base/abstract-checkbox").AbstractCheckbox;

/**
 * @class InputCheckbox
 */
exports.InputCheckbox = AbstractCheckbox.specialize(/** @lends InputCheckbox# */ {

    hasTemplate: {value: false},

    constructor: {
        value: function InputCheckbox() {
            this.super();
        }
    },

    enterDocument: {
        value: function(firstDraw) {
            this.super(firstDraw);

            if(firstDraw) {
                this.classList.clear();

                this.element.disabled = !this.enabled;
            }
        }
    },
});
