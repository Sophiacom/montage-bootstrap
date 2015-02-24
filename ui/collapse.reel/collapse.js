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
            if(this.collapseBody.classList.contains("in")) {
                this.collapseBody.classList.remove("in");
            }
            else {
                this.collapseBody.classList.add("in");
            }
        }
    }
});
