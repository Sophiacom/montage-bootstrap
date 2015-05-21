/**
 * @module /ui/tooltip.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Tooltip
 * @extends Component
 */
exports.Tooltip = Component.specialize(/** @lends Tooltip# */ {
    hasTemplate: {value: false},

    constructor: {
        value: function Tooltip(targetComponent, title, placement, cssClass) {
            this.super();

            this._init(targetComponent, title, placement, cssClass);
        }
    },

    /**
     * The class to change the layout of the tooltip.
     */
    _cssClass: {
        value: null
    },

    /**
     * The placement of the tooltip.
     * values: left, top, right, bottom. default top
     */
    _placement: {
        value: "top"
    },

    /**
     * This property should point to the component which need tooltip.
     */
    _targetComponent: {
        value: null
    },

    /**
     * The message the tooltip should display
     */
    _title: {
        value: null
    },

    _tooltipElement: {
        value: null
    },

    _tooltipParentElement: {
        value: null
    },

    _init: {
        value: function (targetComponent, title, placement, cssClass) {
            if (targetComponent && title) {
                this._targetComponent = targetComponent;
                this._title = title;

                if(placement && (placement === "left" || placement === "top" || placement === "right" || placement === "bottom")) {
                    this._placement = placement;
                }

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
                    this._tooltipElement.classList.add(this._placement);

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
                    divTooltipInner.textContent = this._title;
                    this._tooltipElement.appendChild(divTooltipInner);

                    this._tooltipParentElement = this._targetComponent.element.ownerDocument.body;
                }
            }
        }
    },

    dispose: {
        value: function() {
            if (this._targetComponent && this._title) {
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
                this._title = null;
                this._placement = "top";
                this._tooltipElement = null;
                this._tooltipParentElement = null;
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

            if(this._placement === 'top') {
                return { top: top - tippedElementRect.height - height, left: left + tippedElementRect.width / 2 - width / 2};
            } else if(this._placement === 'bottom') {
                return { top: top, left: left + tippedElementRect.width / 2 - width / 2};
            } else if(this._placement === 'left') {
                return { top: top - tippedElementRect.height/2 - height/2, left: left - width};
            } else {
                return { top: top - tippedElementRect.height/2 - height/2, left: left + tippedElementRect.width};
            }
        }
    }
});
