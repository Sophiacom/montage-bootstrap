/**
 * @module core/tooltip
 */
var Montage = require("montage/core/core").Montage;
/**
 * @class Tooltip
 * @extends Montage
 */
exports.Tooltip = Montage.specialize(/** @lends Tooltip# */ {
    constructor: {
        value: function Tooltip(targetComponent, placement, cssClass) {
            this.super();

            this.defineBindings({
                "text": {"<->": "_textElement.textContent"},
                "_tooltipElement.classList.has('bottom')": {"<-": "placement == 'bottom'"},
                "_tooltipElement.classList.has('top')": {"<-": "placement == 'top'"},
                "_tooltipElement.classList.has('left')": {"<-": "placement == 'left'"},
                "_tooltipElement.classList.has('right')": {"<-": "placement == 'right'"}
            });

            this._init(targetComponent, cssClass);
        }
    },

    /**
     * The message the tooltip should display
     */
    text: {
        value: null
    },

    placement: {
        value: "top"
    },

    /**
     * The class to change the layout of the tooltip.
     */
    _cssClass: {
        value: null
    },

    /**
     * This property should point to the component which need tooltip.
     */
    _targetComponent: {
        value: null
    },

    _textElement: {
        value: null
    },

    _tooltipElement: {
        value: null
    },

    _tooltipParentElement: {
        value: null
    },

    _init: {
        value: function (targetComponent, cssClass) {
            if (!targetComponent) {
                console.error("tooltip requires a target component");
                return;
            }

            this._targetComponent = targetComponent;

            this._cssClass = cssClass;

            if(window.Touch) {
                this._targetComponent.addEventListener("focusin", this, false);
                this._targetComponent.addEventListener("focusout", this, false);

                this._targetComponent.element.addEventListener("focusin", this, false);
                this._targetComponent.element.addEventListener("focusout", this, false);
            } else {
                this._targetComponent.addEventListener("mouseover", this, false);
                this._targetComponent.addEventListener("mouseout", this, false);

                this._targetComponent.element.addEventListener("mouseover", this, false);
                this._targetComponent.element.addEventListener("mouseout", this, false);
            }

            if(!this._tooltipElement) {
                this._tooltipElement = document.createElement("div");
                this._tooltipElement.classList.add("tooltip");

                var divTooltipArrow = document.createElement("div");
                divTooltipArrow.className = "tooltip-arrow";
                if(this._cssClass) {
                    divTooltipArrow.classList.add(this._cssClass);
                }
                this._tooltipElement.appendChild(divTooltipArrow);

                var divTooltipInner = document.createElement("div");
                divTooltipInner.className = "tooltip-inner";
                if(this._cssClass) {
                    divTooltipInner.classList.add(this._cssClass);
                }

                this._textElement = divTooltipInner;

                this._tooltipElement.appendChild(divTooltipInner);

                this._tooltipParentElement = this._targetComponent.element.ownerDocument.body;
            }
        }
    },

    dispose: {
        value: function() {
            if (this._targetComponent && this.text) {
                this._hideTooltip();

                if(window.Touch) {
                    this._targetComponent.removeEventListener("focusin", this, false);
                    this._targetComponent.removeEventListener("focusout", this, false);

                    this._targetComponent.element.removeEventListener("focusin", this, false);
                    this._targetComponent.element.removeEventListener("focusout", this, false);
                } else {
                    this._targetComponent.removeEventListener("mouseover", this, false);
                    this._targetComponent.removeEventListener("mouseout", this, false);

                    this._targetComponent.element.removeEventListener("mouseover", this, false);
                    this._targetComponent.element.removeEventListener("mouseout", this, false);
                }

                this._targetComponent = null;
                this.text = null;
                this.placement = "top";
                this._tooltipElement = null;
                this._tooltipParentElement = null;
                this._textElement = null;
            }
        }
    },

    _showTooltip: {
        value: function(event) {
            if(this._tooltipElement && this._targetComponent) {
                this._tooltipParentElement.appendChild(this._tooltipElement);

                var position = this.tooltipPosition();
                this._tooltipElement.style.top = position.top + "px";
                this._tooltipElement.style.left = position.left + "px";

                this._tooltipElement.classList.add("in");
            }
        }
    },

    _hideTooltip: {
        value: function(event) {
            if(this._tooltipElement && this._tooltipElement.classList.contains("in")) {
                this._tooltipElement.classList.remove("in");
                this._tooltipParentElement.removeChild(this._tooltipElement);
            }
        }
    },

    handleMouseover: {
        value: function(event) {
            this._showTooltip(event);
        }
    },

    handleMouseout: {
        value: function(event) {
            this._hideTooltip(event);
        }
    },

    handleFocusin: {
        value: function(event) {
            this._showTooltip(event);
        }
    },

    handleFocusout: {
        value: function(event) {
            this._hideTooltip(event);
        }
    },

    tooltipPosition: {
        value: function() {
            // tooltip size
            var width = this._tooltipElement.offsetWidth;
            var height = this._tooltipElement.offsetHeight;

            // tipped element position and size
            var tippedElement = this._targetComponent.element;
            var tippedElementRect = tippedElement.getBoundingClientRect();
            var left = tippedElementRect.left + window.pageXOffset;
            var top = tippedElementRect.bottom + window.pageYOffset;

            if(this.placement === 'top') {
                return { top: top - tippedElementRect.height - height, left: left + tippedElementRect.width / 2 - width / 2};
            } else if(this.placement === 'bottom') {
                return { top: top, left: left + tippedElementRect.width / 2 - width / 2};
            } else if(this.placement === 'left') {
                return { top: top - tippedElementRect.height/2 - height/2, left: left - width};
            } else {
                return { top: top - tippedElementRect.height/2 - height/2, left: left + tippedElementRect.width};
            }
        }
    }
});
