/**
 * @module /ui/alerts.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Alerts
 * @extends Component
 */
exports.Alerts = Component.specialize(/** @lends Alerts# */ {
    constructor: {
        value: function Alerts() {
            this.super();
        }
    },

    _isShown: {
        value: false
    },

    isShown: {
        get: function() {
            return this._isShown;
        }
    },

    hide: {
        value: function() {
            if (this._isShown) {
                this.templateObjects.label.value = null;

                this.templateObjects.owner.classList.clear();
                this.templateObjects.owner.classList.add("alert");
                this.templateObjects.owner.classList.add("hide");

                this._isShown = false;
            }
        }
    },

    _show: {
        value: function(message, className) {
            this.templateObjects.label.value = message;

            this.templateObjects.owner.classList.add(className);
            this.templateObjects.owner.classList.remove("hide");

            this._isShown = true;
        }
    },

    showAlertSuccess: {
        value: function(message) {
            this._show(message, "alert-success");
        }
    },

    showAlertInfo: {
        value: function(message) {
            this._show(message, "alert-info");
        }
    },

    showAlertWarning: {
        value: function(message) {
            this._show(message, "alert-warning");
        }
    },

    showAlertDanger: {
        value: function(message) {
            this._show(message, "alert-danger");
        }
    }
});
