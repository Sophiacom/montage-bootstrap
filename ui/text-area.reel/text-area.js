/**
 * @module /ui/text-area.reel
 */
var AbstractTextArea = require("montage/ui/base/abstract-text-area").AbstractTextArea;

/**
 * @class TextArea
 * @extends Component
 */
exports.TextArea = AbstractTextArea.specialize( /** @lends TextArea# */ {

    hasTemplate: {
        value: false
    },

    constructor: {
        value: function TextArea() {
            this.super();

            this.defineBindings({
                "element.rows": {
                    "<-": "rows"
                }
            });
            this.classList.add('form-control');
        }
    },

    rows: {
        value: null
    }
});
