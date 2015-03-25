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
    textFieldShouldAcceptValue: {
        value: function() {
            return true;
        }
    },
    enterDocument: {
        value: function(){
            this.super();

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
            var newValue = this.inputElement.value;
            if (newValue !== undefined && newValue !== null && newValue !== ""){
                if(!this.list) {
                    this.list = [];
                }
                this.list.push(newValue);
                this.inputElement.element.value = "";
                this.inputElement.value = "";
            }
            this.inputElement.element.focus();
        }
    }
});
