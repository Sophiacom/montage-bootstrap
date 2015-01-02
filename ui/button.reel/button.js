/**
 * @module /ui/button.reel
 */
var AbstractButton = require("montage/ui/base/abstract-button").AbstractButton;

/**
 * @class Button
 * @extends AbstractButton
 */
exports.Button = AbstractButton.specialize( /** @lends Button# */ {

    hasTemplate: {
        value: false
    },

    constructor: {
        value: function Button() {
            this.super();
        }
    },

    labelSave: {
        value: null
    },
    dataLoadingText: {
        value: null
    },

    enabled: {
        value: true
    },

    visible: {
        value: true
    },

    style: {
        value: null
    },

    block: {
        value: false
    },

    size: {
        value: null
    },

    glyphicon: {
        value: null
    },

    enterDocument: {
        value: function(firstDraw) {
            this.super(firstDraw);

            if (firstDraw) {
                this.defineBindings({
                    "classList.has('disabled')": {"<-": "!enabled"},
                    "classList.has('hidden')": {"<-": "!visible"},
                    "classList.has('btn')": {"<-": "style.defined()"},
                    "classList.has('btn-default')": {"<-": "style == 'default'"},
                    "classList.has('btn-primary')": {"<-": "style == 'primary'"},
                    "classList.has('btn-success')": {"<-": "style == 'success'"},
                    "classList.has('btn-info')": {"<-": "style == 'info'"},
                    "classList.has('btn-warning')": {"<-": "style == 'warning'"},
                    "classList.has('btn-danger')": {"<-": "style == 'danger'"},
                    "classList.has('btn-link')": {"<-": "style == 'link'"},
                    "classList.has('btn-block')": {"<-": "block"},
                    "classList.has('btn-lg')": {"<-": "size == 'lg'"},
                    "classList.has('btn-sm')": {"<-": "size == 'sm'"},
                    "classList.has('btn-xs')": {"<-": "size == 'xs'"}
                });

                if (!!this.glyphicon){
                    var span = document.createElement("span");
                    span.className = "glyphicon " + "glyphicon-" + this.glyphicon;
                    var originalElement = this.element;
                    originalElement.insertBefore(span, originalElement.childNodes[0]);
                    originalElement.insertBefore(document.createTextNode(" "), span.nextSibling);
                }
            }
        }
    },

    draw: {
        value: function() {
            this.super();

            if (this.dataLoadingText !== null) {
                this.element.setAttribute("data-loading-text", this.dataLoadingText);
            }
        }
    },

    startLoadingState: {
        value: function() {
            if (this.dataLoadingText !== null) {
                this.classList.add("disabled");
                this.labelSave = this.label;
                this.label = this.dataLoadingText;
            }
        }
    },

    stopLoadingState: {
        value: function() {
            if (this.dataLoadingText !== null) {
                this.classList.remove("disabled");
                this.label = this.labelSave;
            }
        }
    }

});
