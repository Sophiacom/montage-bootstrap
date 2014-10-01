/**
 * @module ui/input-file.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class InputFile
 * @extends Component
 */
exports.InputFile = Component.specialize( /** @lends InputFile# */ {
    constructor: {
        value: function InputFile() {
            this.super();
        }
    },

    enterDocument: {
        value: function() {
            this.inputFile.addEventListener("change", this, false);
        }
    },

    exitDocument: {
        value: function() {
            this.inputFile.removeEventListener("change", this, false);
        }
    },

    fileName: {
        value: null
    },
    data: {
        value: null
    },

    handleChange: {
        value: function(event) {
            var file = this.inputFile.files[0];
            if (file) {
                this.fileName = this.inputFile.value.replace(/\\/g, '/').replace(/.*\//, '');

                var self = this;
                var reader = new FileReader();
                reader.onload = function(readerEvent) {
                    self.data = btoa(readerEvent.target.result);
                };
                reader.readAsBinaryString(file);
            }
        }
    },

    captureDeleteButtonAction: {
        value: function(event) {
            this.fileName = null;
            this.data = null;
        }
    }
});
