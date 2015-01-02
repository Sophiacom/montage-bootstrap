/**
 * @module ui//timepicker.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var PressComposer = require("montage/composer/press-composer").PressComposer;
var KeyComposer = require("montage/composer/key-composer").KeyComposer;
var Moment = require("montage-moment").Moment;

/**
 * @class Timepicker
 * @extends Component
 *
 * code translation from https://github.com/rendom/bootstrap-3-timepicker (MIT license)
 */
exports.Timepicker = Component.specialize( /** @lends Timepicker# */ {
    constructor: {
        value: function Timepicker() {
            this.super();

            this._pressComposer = new PressComposer();
            this._pressComposer.lazyLoad = true;
        }
    },

    enabled: {
        value: true
    },

    /**
     * Dispatched when the user dismiss the dropdown by clicking outside of it.
     * @event dismiss
     * @memberof DropdownLi
     * @param {Event} event
     */

    _pressComposer: {
        value: null
    },

    _keyComposer: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this.super();
        }
    },

    enterDocument: {
        value: function() {
            this.super();

            this.timepickerElement = this.element.lastElementChild;

            this.isOpen = this.options.isOpen;
            this.minuteStep = this.options.minuteStep;
            this.secondStep = this.options.secondStep;
            this.showInputs = this.options.showInputs;
            this.showMeridian = this.options.showMeridian;
            this.showSeconds = this.options.showSeconds;

            var self = this;

            var timeInputListener = {
                handleFocus: function(event) {
                    event.preventDefault();
                    self.show();
                    self.highlightHour();
                },
                handleBlur: function(event) {
                    self.highlightedUnit = undefined;
                },
                handleSelect: function(event) {
                    self.highlightUnit();
                },
                handleKeypress: function(event) {
                    // This is needed so the user can't type any letter
                    event.preventDefault();
                },
                handleKeydown: function(event) {
                    // This is needed so the user can't type any letter
                    event.preventDefault();
                },
                handleKeyup: function(event) {
                    // This is needed so the user can't type any letter
                    event.preventDefault();
                }
            };

            this.timeInputListener = timeInputListener;

            this.templateObjects.timeInput.element.addEventListener("focus", timeInputListener, false);
            this.templateObjects.timeInput.element.addEventListener("blur", timeInputListener, false);
            this.templateObjects.timeInput.element.addEventListener("select", timeInputListener, false);
            this.templateObjects.timeInput.element.addEventListener("keypress", timeInputListener, false);
            this.templateObjects.timeInput.element.addEventListener("keydown", timeInputListener, false);
            this.templateObjects.timeInput.element.addEventListener("keyup", timeInputListener, false);

            var inputListener = {
                handleInput: function(event) {
                    var targetComponent = event.target.component;
                    var componentValue = parseInt(event.target.value);

                    if (targetComponent === self.templateObjects.meridianUnit.unitInput) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }

                    if (isNaN(componentValue)){
                        componentValue = 0;
                    }

                    if (targetComponent === self.templateObjects.hourUnit.unitInput && (self.showMeridian && componentValue > 12 || !self.showMeridian && componentValue >= 24)) {
                        componentValue = (self.showMeridian ? 12 : 23);
                    }
                    if (targetComponent === self.templateObjects.hourUnit.unitInput && self.showMeridian && componentValue < 1){
                        componentValue = 1;
                    }
                    if ((targetComponent === self.templateObjects.minuteUnit.unitInput || targetComponent === self.templateObjects.secondUnit.unitInput) && componentValue >= 60) {
                        componentValue = 59;
                    }

                    targetComponent.value = componentValue;
                    event.target.value = componentValue;
                },
                handleKeypress: function(event) {
                    var targetComponent = event.target.component;

                    if (targetComponent === self.templateObjects.meridianUnit.unitInput) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }

                    var key = String.fromCharCode(event.keyCode);
                    var number = parseInt(key);

                    if (isNaN(number)) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }
                },
                handleBackspaceKeyPress: function(event){
                    event.preventDefault();
                    event.stopPropagation();
                }
            };

            this.inputListener = inputListener;

            this.templateObjects.hourUnit.unitInput.element.addEventListener("input", inputListener, false);
            this.templateObjects.minuteUnit.unitInput.element.addEventListener("input", inputListener, false);
            this.templateObjects.secondUnit.unitInput.element.addEventListener("input", inputListener, false);
            this.templateObjects.meridianUnit.unitInput.element.addEventListener("input", inputListener, false);

            this.templateObjects.hourUnit.unitInput.element.addEventListener("keypress", inputListener, false);
            this.templateObjects.minuteUnit.unitInput.element.addEventListener("keypress", inputListener, false);
            this.templateObjects.secondUnit.unitInput.element.addEventListener("keypress", inputListener, false);
            this.templateObjects.meridianUnit.unitInput.element.addEventListener("keypress", inputListener, false);

            KeyComposer.createKey(this.templateObjects.meridianUnit.unitInput, "backspace", "backspace").addEventListener("keyPress", inputListener, false);

            // Press listener :

            this.addComposerForElement(this._pressComposer, this.element.ownerDocument);

            var pressListener = {
                handlePressStart: function(event) {
                    if (!self.isOpen) {
                        return;
                    }
                    var element = self.element;
                    var target = event.targetElement;

                    if (!element.contains(target)) {
                        self.hide();
                    }
                }
            };

            this.pressListener = pressListener;

            this._pressComposer.addEventListener("pressStart", pressListener, false);

            var keyListener = {
                handleEscapeKeyPress: function(event) {
                    self.hide();
                },
                handleTabKeyPress: function(event) {
                    switch (self.highlightedUnit) {
                        case 'hour':
                            self.highlightNextUnit();
                            break;
                        case 'minute':
                            if (self.showMeridian || self.showSeconds) {
                                self.highlightNextUnit();
                            }
                            break;
                        case 'second':
                            if (self.showMeridian) {
                                self.highlightNextUnit();
                            }
                            break;
                    }
                },
                handleUpKeyPress: function(event) {
                    switch (self.highlightedUnit) {
                        case 'hour':
                            self.incrementHour();
                            break;
                        case 'minute':
                            self.incrementMinute();
                            break;
                        case 'second':
                            self.incrementSecond();
                            break;
                        case 'meridian':
                            self.toggleMeridian();
                            break;
                    }
                },
                handleDownKeyPress: function(event) {
                    switch (self.highlightedUnit) {
                        case 'hour':
                            self.decrementHour();
                            break;
                        case 'minute':
                            self.decrementMinute();
                            break;
                        case 'second':
                            self.decrementSecond();
                            break;
                        case 'meridian':
                            self.toggleMeridian();
                            break;
                    }
                },
                handleRightKeyPress: function(event) {
                    self.highlightNextUnit();
                },
                handleLeftKeyPress: function(event) {
                    self.highlightPrevUnit();
                }
            };

            this.keyListener = keyListener;

            KeyComposer.createKey(this.templateObjects.timeInput, "escape", "escape").addEventListener("keyPress", keyListener, false);
            KeyComposer.createKey(this.templateObjects.timeInput, "tab", "tab").addEventListener("keyPress", keyListener, false);
            KeyComposer.createKey(this.templateObjects.timeInput, "up", "up").addEventListener("keyPress", keyListener, false);
            KeyComposer.createKey(this.templateObjects.timeInput, "down", "down").addEventListener("keyPress", keyListener, false);
            KeyComposer.createKey(this.templateObjects.timeInput, "right", "right").addEventListener("keyPress", keyListener, false);
            KeyComposer.createKey(this.templateObjects.timeInput, "left", "left").addEventListener("keyPress", keyListener, false);


            // Increment + decrement buttons :

            var incrementHourListener = {
                handleClick: function (event){
                    self.incrementHour();
                }
            };
            var decrementHourListener = {
                handleClick: function (event){
                    self.decrementHour();
                }
            };
            var incrementMinuteListener = {
                handleClick: function (event){
                    self.incrementMinute();
                }
            };
            var decrementMinuteListener = {
                handleClick: function (event){
                    self.decrementMinute();
                }
            };
            var incrementSecondListener = {
                handleClick: function (event){
                    self.incrementSecond();
                }
            };
            var decrementSecondListener = {
                handleClick: function (event){
                    self.decrementSecond();
                }
            };
            var toggleMeridianListener = {
                handleClick: function (event){
                    self.toggleMeridian();
                }
            };

            this.incrementHourListener = incrementHourListener;
            this.incrementMinuteListener = incrementMinuteListener;
            this.incrementSecondListener = incrementSecondListener;
            this.decrementHourListener = decrementHourListener;
            this.decrementMinuteListener = decrementMinuteListener;
            this.decrementSecondListener = decrementSecondListener;
            this.toggleMeridianListener = toggleMeridianListener;


            this.templateObjects.hourUnit.incrementButton.element.addEventListener("click", incrementHourListener, false);
            this.templateObjects.minuteUnit.incrementButton.element.addEventListener("click", incrementMinuteListener, false);
            this.templateObjects.secondUnit.incrementButton.element.addEventListener("click", incrementSecondListener, false);
            this.templateObjects.meridianUnit.incrementButton.element.addEventListener("click", toggleMeridianListener, false);

            this.templateObjects.hourUnit.decrementButton.element.addEventListener("click", decrementHourListener, false);
            this.templateObjects.minuteUnit.decrementButton.element.addEventListener("click", decrementMinuteListener, false);
            this.templateObjects.secondUnit.decrementButton.element.addEventListener("click", decrementSecondListener, false);
            this.templateObjects.meridianUnit.decrementButton.element.addEventListener("click", toggleMeridianListener, false);

            this.addPathChangeListener("second", this, "refreshValue");
            this.addPathChangeListener("minute", this, "refreshValue");
            this.addPathChangeListener("hour", this, "refreshValue");
        }
    },

    exitDocument: {
        value: function() {
            this.removePathChangeListener("hour", this);
            this.removePathChangeListener("minute", this);
            this.removePathChangeListener("second", this);

            this.templateObjects.timeInput.element.removeEventListener("focus", this.timeInputListener, false);
            this.templateObjects.timeInput.element.removeEventListener("blur", this.timeInputListener, false);
            this.templateObjects.timeInput.element.removeEventListener("select", this.timeInputListener, false);
            this.templateObjects.timeInput.element.removeEventListener("keypress", this.timeInputListener, false);
            this.templateObjects.timeInput.element.removeEventListener("keydown", this.timeInputListener, false);
            this.templateObjects.timeInput.element.removeEventListener("keyup", this.timeInputListener, false);

            this.templateObjects.hourUnit.unitInput.element.removeEventListener("input", this.inputListener, false);
            this.templateObjects.minuteUnit.unitInput.element.removeEventListener("input", this.inputListener, false);
            this.templateObjects.secondUnit.unitInput.element.removeEventListener("input", this.inputListener, false);
            this.templateObjects.meridianUnit.unitInput.element.removeEventListener("input", this.inputListener, false);

            this.templateObjects.hourUnit.unitInput.element.removeEventListener("keypress", this.inputListener, false);
            this.templateObjects.minuteUnit.unitInput.element.removeEventListener("keypress", this.inputListener, false);
            this.templateObjects.secondUnit.unitInput.element.removeEventListener("keypress", this.inputListener, false);
            this.templateObjects.meridianUnit.unitInput.element.removeEventListener("keypress", this.inputListener, false);

            this._pressComposer.removeEventListener("pressStart", this.pressListener, false);

            this.templateObjects.hourUnit.incrementButton.element.removeEventListener("click", this.incrementHourListener, false);
            this.templateObjects.minuteUnit.incrementButton.element.removeEventListener("click", this.incrementMinuteListener, false);
            this.templateObjects.secondUnit.incrementButton.element.removeEventListener("click", this.incrementSecondListener, false);
            this.templateObjects.meridianUnit.incrementButton.element.removeEventListener("click", this.toggleMeridianListener, false);

            this.templateObjects.hourUnit.decrementButton.element.removeEventListener("click", this.decrementHourListener, false);
            this.templateObjects.minuteUnit.decrementButton.element.removeEventListener("click", this.decrementMinuteListener, false);
            this.templateObjects.secondUnit.decrementButton.element.removeEventListener("click", this.decrementSecondListener, false);
            this.templateObjects.meridianUnit.decrementButton.element.removeEventListener("click", this.toggleMeridianListener, false);

            this.super();
        }
    },

    didDraw: {
        value: function(){
            this.super();

            this.updateTimeInput();
        }
    },

    options: {
        value: {
            isOpen: false,
            minuteStep: 1,
            secondStep: 15,
            showSeconds: false,
            showInputs: true,
            showMeridian: true
        }
    },

    show: {
        value: function() {
            if (this.isOpen) {
                return;
            }
            this.isOpen = true;
        }
    },

    hide: {
        value: function() {
            if (!this.isOpen) {
                return;
            }
            this.isOpen = false;
        }
    },

    // Zone offset in milliseconds
    zoneOffset: {
        get: function(){
            return Moment().zone() * 60 * 1000;
        }
    },

    // time value in milliseconds :
    _value: { value: null },
    value: {
        get: function() {
            return Moment(this._value);
        },
        // value should be an epoch time (GMT)
        set: function(value) {
            this._value = value;

            if(!value)
                return;

            if(this._refreshing)
                return;

            var milliseconds = value.valueOf() - this.zoneOffset;

            var totalHour = Math.floor(milliseconds / (60 * 60 * 1000)) % 24;
            var rest = milliseconds % (60 * 60 * 1000);
            var totalMinute = Math.floor(rest / (60 * 1000));
            rest %= (60 * 1000);
            var totalSecond = Math.floor(rest / 1000);

            this.meridian = (this.hour === 0 || this.hour > 12) ? "PM" : "AM";

            this.hour = this.showMeridian ? totalHour % 12 : totalHour;
            if (this.hour === 0){
                this.hour === 12;
            }
            this.minute = totalMinute;
            this.second = totalSecond;
        }
    },

    _refreshing: { value: false },
    refreshValue: {
        value: function() {
            this._refreshing = true;

            var totalMillis = this.minute * 60 * 1000 + this.second * 1000;
            var hour = this.hour;

            if (this.showMeridian) {
                if (this.meridian === "PM"){
                    hour += (hour === 12 ? 0 : 12);
                } else {
                    if (hour === 12){
                        hour = 0;
                    }
                }
            }

            var totalMillis = hour;
            totalMillis = totalMillis * 60 + this.minute;
            totalMillis = totalMillis * 60 + this.second;
            totalMillis = totalMillis * 1000;

            this.value = totalMillis;

            this._refreshing = false;
        }
    },

    updateTimeInput: {
        value: function() {
            if (this.templateObjects === null) {
                return;
            }
            if (this.showMeridian && this.hour < 1){
                this.hour = 12;
                this.toggleMeridian(false);
            }
            if (this.showMeridian && this.hour > 12){
                this.hour -= 12;
                this.meridian = "PM";
            }
            this.templateObjects.timeInput.element.value = this.formatTime(this.hour, this.minute, this.second, this.meridian);
        }
    },

    _hour: {
        value: 0
    },

    _minute: {
        value: 0
    },

    _second: {
        value: 0
    },

    hour: {
        get: function(){
            return this._hour;
        },
        set: function(value){
            if (typeof value === "string"){
                value = parseInt(value);
            }
            this._hour = value;
            this.updateTimeInput();
        }
    },

    minute: {
        get: function(){
            return this._minute;
        },
        set: function(value){
            if (typeof value === "string"){
                value = parseInt(value);
            }
            this._minute = value;
            this.updateTimeInput();
        }
    },

    second: {
        get: function(){
            return this._second;
        },
        set: function(value){
            if (typeof value === "string"){
                value = parseInt(value);
            }
            this._second = value;
            this.updateTimeInput();
        }
    },

    _meridian: {
        value: "AM"
    },

    meridian: {
        get: function(){
            return this._meridian;
        },
        set: function(value){
            this._meridian = value;
            this.updateTimeInput();
        }
    },

    formatTime: {
        value: function(hour, minute, second, meridian) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;

            return hour + ':' + minute + (this.showSeconds ? ':' + second : '') + (this.showMeridian ? ' ' + meridian : '');
        }
    },

    getCursorPosition: {
        value: function() {
            var input = this.templateObjects.timeInput.element;
            return input.selectionStart;
        }
    },

    highlightUnit: {
        value: function() {
            this.position = this.getCursorPosition();
            if (this.position >= 0 && this.position <= 2) {
                this.highlightHour();
            } else if (this.position >= 3 && this.position <= 5) {
                this.highlightMinute();
            } else if (this.position >= 6 && this.position <= 8) {
                if (this.showSeconds) {
                    this.highlightSecond();
                } else {
                    this.highlightMeridian();
                }
            } else if (this.position >= 9 && this.position <= 11) {
                this.highlightMeridian();
            }
        }
    },

    highlightNextUnit: {
        value: function() {
            switch (this.highlightedUnit) {
                case 'hour':
                    this.highlightMinute();
                    break;
                case 'minute':
                    if (this.showSeconds) {
                        this.highlightSecond();
                    } else if (this.showMeridian) {
                        this.highlightMeridian();
                    } else {
                        this.highlightHour();
                    }
                    break;
                case 'second':
                    if (this.showMeridian) {
                        this.highlightMeridian();
                    } else {
                        this.highlightHour();
                    }
                    break;
                case 'meridian':
                    this.highlightHour();
                    break;
            }
        }
    },

    highlightPrevUnit: {
        value: function() {
            switch (this.highlightedUnit) {
                case 'hour':
                    this.highlightMeridian();
                    break;
                case 'minute':
                    this.highlightHour();
                    break;
                case 'second':
                    this.highlightMinute();
                    break;
                case 'meridian':
                    if (this.showSeconds) {
                        this.highlightSecond();
                    } else {
                        this.highlightMinute();
                    }
                    break;
            }
        }
    },

    highlightHour: {
        value: function() {
            var timeInput = this.templateObjects.timeInput.element;
            this.highlightedUnit = 'hour';

            if (timeInput.setSelectionRange) {
                setTimeout(function() {
                    timeInput.setSelectionRange(0, 2);
                }, 0);
            }
        }
    },

    highlightMinute: {
        value: function() {
            var timeInput = this.templateObjects.timeInput.element;
            this.highlightedUnit = 'minute';

            if (timeInput.setSelectionRange) {
                setTimeout(function() {
                    timeInput.setSelectionRange(3, 5);
                }, 0);
            }
        }
    },

    highlightSecond: {
        value: function() {
            var timeInput = this.templateObjects.timeInput.element;
            this.highlightedUnit = 'second';

            if (timeInput.setSelectionRange) {
                setTimeout(function() {
                    timeInput.setSelectionRange(6, 8);
                }, 0);
            }
        }
    },

    highlightMeridian: {
        value: function() {
            var timeInput = this.templateObjects.timeInput.element;
            this.highlightedUnit = 'meridian';

            if (timeInput.setSelectionRange) {
                if (this.showSeconds) {
                    setTimeout(function() {
                        timeInput.setSelectionRange(9, 11);
                    }, 0);
                } else {
                    setTimeout(function() {
                        timeInput.setSelectionRange(6, 8);
                    }, 0);
                }
            }
        }
    },

    incrementHour: {
        value: function() {
            if (this.showMeridian) {
                if (this.hour === 11) {
                    this.hour++;
                    return this.toggleMeridian(false);
                } else if (this.hour === 12) {
                    this.hour = 0;
                }
            }
            if (this.hour === 23) {
                this.hour = 0;

                return;
            }
            this.hour++;

            this.updateTimeInput();
            this.highlightHour();
        }
    },

    incrementMinute: {
        value: function(step) {
            var newVal;

            if (step) {
                newVal = this.minute + step;
            } else {
                newVal = this.minute + this.minuteStep - (this.minute % this.minuteStep);
            }

            if (newVal > 59) {
                this.incrementHour();
                this.minute = newVal - 60;
            } else {
                this.minute = newVal;
            }

            this.updateTimeInput();
            this.highlightMinute();
        }
    },

    incrementSecond: {
        value: function() {
            var newVal = this.second + this.secondStep - (this.second % this.secondStep);

            if (newVal > 59) {
                this.incrementMinute(true);
                this.second = newVal - 60;
            } else {
                this.second = newVal;
            }

            this.updateTimeInput();
            this.highlightSecond();
        }
    },

    decrementHour: {
        value: function() {
            if (this.showMeridian) {
                if (this.hour === 1) {
                    this.hour = 12;
                } else if (this.hour === 12) {
                    this.hour--;

                    return this.toggleMeridian(false);
                } else if (this.hour === 0) {
                    this.hour = 11;

                    return this.toggleMeridian(false);
                } else {
                    this.hour--;
                }
            } else {
                if (this.hour === 0) {
                    this.hour = 23;
                } else {
                    this.hour--;
                }
            }

            this.updateTimeInput();
            this.highlightHour();
        }
    },

    decrementMinute: {
        value: function(step) {
            var newVal;

            if (step) {
                newVal = this.minute - step;
            } else {
                newVal = this.minute - this.minuteStep;
            }

            if (newVal < 0) {
                this.decrementHour();
                this.minute = newVal + 60;
            } else {
                this.minute = newVal;
            }

            this.updateTimeInput();
            this.highlightMinute();
        }
    },

    decrementSecond: {
        value: function() {
            var newVal = this.second - this.secondStep;

            if (newVal < 0) {
                this.decrementMinute(true);
                this.second = newVal + 60;
            } else {
                this.second = newVal;
            }

            this.updateTimeInput();
            this.highlightSecond();
        }
    },

    toggleMeridian: {
        value: function(shouldHighlight) {
            this.meridian = this.meridian === 'AM' ? 'PM' : 'AM';

            this.updateTimeInput();
            if (shouldHighlight){
                this.highlightMeridian();
            }
        }
    }
});
