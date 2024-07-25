const { Gpio } = require('pigpio');

const ANGLE_VAL = 2.776;

/**
 * @type {number | null}
 */
let _last_pw = null;

/**
 * @type {Gpio | null}
 */
let _pin = null;

/**
 * @param {number} angle 
 */
function angle_is_valid(angle) {
    return angle >= 0 && angle < 360;
}

/**
 * @param {number} angle 
 */
function calculate_pw_for_angle(angle) {
    return Math.round(1000 + (angle * ANGLE_VAL));
}

class PanControl {
    /**
     * @param {number} data_pin 
     */
    constructor(data_pin) {
        // TODO: Add controls to make this effectively a singleton; i.e. do not allow the creation of a new
        // istance if the value for _pin is not null.
        _pin = new Gpio(data_pin, { mode: Gpio.OUTPUT });
    }

    move(angle) {
        if (angle_is_valid(angle)) {
            const next_pw = calculate_pw_for_angle(angle);

            if (next_pw !== _last_pw) {
                _pin.servoWrite(next_pw);
                _last_pw = next_pw;
            }
        } else {
            console.error(`Invalid angle for pan control: ${angle}`);
        }
    }
}

module.exports = PanControl;
