/**
 * @module ui/text.reel
 * @requires montage/ui/text
 */

var MontageText = require("montage/ui/text.reel").Text;

/**
 * @class Text
 * @extends MontageText
 */
exports.Text = MontageText.specialize(/** @lends Text# */ {
    hasTemplate: {value: false},

    constructor: {
        value: function Text() {
            this.super();
        }
    },

    enterDocument: {
        value: function(firstTime) {
            this.super(firstTime);

            if (firstTime) {
                this.element.classList.remove("montage-Text");
            }
        }
    }
});
