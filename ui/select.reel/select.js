/**
 * @module /ui/select.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Select
 * @extends Component
 */
exports.Select = Component.specialize( /** @lends Select# */ {

    constructor: {
        value: function Select() {
            this.super();
        }
    },

    /*
     * labelPropertyName is the name of the field to display in the select.
     * if not set, the component will try to use the object itself
     */
    labelPropertyName: {
        value: null
    },

    /*
     * valuePropertyName is the name of the field that will be set in @owner.value
     * if not set, the object itself will be set.
     */
    valuePropertyName: {
        value: null
    },

    /*
     * comparePropertyName is the name of the field that will be used to compare two objects
     * if not set, valuePropertyName will be used or the object itself as last resort.
     */
    comparePropertyName: {
        value: null
    },

    /*
     * array of possible objects
     */
    content: { value: null },

    allowsNull: { value: false },

    enabled: { value: true },

    /*
     * value of the curently selected object
     */
    value: {
        value: null
    },

    nullLabel: {
        value: "N/A"
    },

    enterDocument: {
        value: function(firstTime) {
            this.super(firstTime);

            if (firstTime) {
                var self = this;
                if (this.comparePropertyName)
                    this._compareValues = function(x, y) {
                        return x[self.comparePropertyName] == y[self.comparePropertyName];
                    };
                else if (this.valuePropertyName)
                    this._compareValues = function(x, y) {
                        return x == y[self.valuePropertyName];
                    };
                else
                    this._compareValues = function(x, y) {
                        return x == y;
                    };

                this.defineBindings({
                    "_selected": {
                        "<->": "value",
                        convert: function(value) {
                            if (value !== undefined && value !== null && self.content) {
                                for (var i = 0; i < self.content.length; i++){
                                    if (self.content[i] && self._compareValues(value, self.content[i])){
                                        return self.content[i];
                                    }
                                }
                                console.warn('"' + self._label(value) + '" not in possible values.');
                            }

                            if (self.allowsNull){
                                return null;
                            }

                            if(self.content){
                                return self.content[0];
                            }

                            return null;
                        },
                        revert: function(value) {
                            if (value === undefined || value === null){
                                return null;
                            }

                            if (self.valuePropertyName) {
                                return value[self.valuePropertyName];
                            } else {
                                return value;
                            }
                        }
                    }
                });
            }
        }
    },

    _compareValues: {
        value: null
    },

    _selected: {
        value: null
    },

    _label: {
        value: function(item) {
            if (this.labelPropertyName){
                return item[this.labelPropertyName];
            }
            return item;
        }
    },

    captureEntryAction: {
        value: function(event) {
            this._selected = event.detail.entry;
            this.dropdown.hide();
        }
    }
});
