/**
 * @module ui//list-editor.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class ListEditor
 * @extends Component
 */
exports.ListEditor = Component.specialize(/** @lends ListEditor# */ {
    constructor: {
        value: function ListEditor() {
            this.super();
        }
    },
    enabled: {
        value: true
    },
    list: {
        value: null
    },
    fieldValue: {
        value: null
    },
    enterDocument: {
        value: function(){
            this.super();
            if (!this.list)
                this.list = [];

            var self = this;
            this.keyPressListener = {
                handleEnterKeyPress: function(event){
                    self.captureAddButtonAction();
                    event.preventDefault();
                }
            }

            this.keyComposer = KeyComposer.createKey(this.inputElement, "enter", "enter");
            this.keyComposer.addEventListener("keyPress", this.keyPressListener, false);
        }
    },
    exitDocument: {
        value: function(){
            this.super();

            this.keyComposer.removeEventListener("keyPress", this.keyPressListener, false);

            this.list = [];
            this.inputElement.value = null;
        }
    },
    captureListButtonAction: {
        value: function(event) {
            this.list.splice(event.target.detail.index, 1);
        }
    },
    captureAddButtonAction: {
        value: function(){
            if (!!this.fieldValue){
                this.list.push(this.fieldValue);
                this.fieldValue = null;
                this.inputElement.element.value = null;
            }
            this.inputElement.element.focus();
        }
    }
});
