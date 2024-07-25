const { Gpio } = require('pigpio');

/**
 * @type {Gpio}
 */
let _pin;

class IndicatorControl {
    constructor(data_pin) {
        _pin = new Gpio(data_pin, { mode: Gpio.OUTPUT });
    }

    turn_on() {
        _pin.digitalWrite(1);
    }

    turn_off() {
        _pin.digitalWrite(0);
    }
}

module.exports = IndicatorControl;
