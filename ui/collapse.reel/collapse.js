/**
 * @module /ui//collapse.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Collapse
 * @extends Component
 */
exports.Collapse = Component.specialize(/** @lends Collapse# */ {
    constructor: {
        value: function Collapse() {
            this.super();
        }
    },

    captureToggleButtonAction: {
        value: function(event) {
            if(this.collapseBody.classList.contains("collapse")) {
                this.collapseBody.classList.remove("collapse");
                this.collapseBody.classList.add("collapse.in");
            }
            else {
                this.collapseBody.classList.remove("collapse.in");
                this.collapseBody.classList.add("collapse");
            }
        }
    }
});
