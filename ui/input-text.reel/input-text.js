/**
 * @module /ui/input-text.reel
 */
var AbstractTextField = require("montage/ui/base/abstract-text-field").AbstractTextField;

/**
 * @class InputText
 * @extends Component
 */
exports.InputText = AbstractTextField.specialize(/** @lends InputText# */ {

    hasTemplate: { value: false },

    enabled: { value: true },

    constructor: {
        value: function InputText() {
            this.super();

            this.classList.add("form-control");
        }
    },

    enterDocument: {
        value: function(firstTime){
            this.super(firstTime);

            if (firstTime){
                this.defineBindings({
                    "element.disabled": {"<-": "!enabled"}
                });
            }
        }
    }
});
