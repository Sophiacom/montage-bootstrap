/**
 * @module /ui/text-area.reel
 */
var AbstractTextArea = require("montage/ui/base/abstract-text-area").AbstractTextArea;

/**
 * @class TextArea
 * @extends Component
 */
exports.TextArea = AbstractTextArea.specialize(/** @lends TextArea# */ {

    hasTemplate: {value: false},

    constructor: {
        value: function TextArea() {
            this.super();
        }
    },

    rows: {value: null},

    enterDocument: {
        value: function(firstTime) {
            this.super(firstTime);

            if (firstTime){
                this.defineBindings({
                    "element.rows": { "<-": "rows" }
                });
            }
        }
    }
});
