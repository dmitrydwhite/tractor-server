/**
 * @typedef {object} NextData
 * @property {number} azimuth
 * @property {number} elevation
 * @property {boolean} [suppress_indic]
 */

const PanControl = require('./PanControl');
const TiltControl = require('./TiltControl');
const IndicatorControl = require('./IndicatorControl');

const RESTING_AZ = 270;
const RESTING_EL = 0;

let _az = 0;
let _el = 0;
let _in = false;

/**
 * @type {TiltControl}
 */
let _tilt;
/**
 * @type {PanControl}
 */
let _pan;
/**
 * @type {IndicatorControl}
 */
let _indic;

/**
 * 
 * @param {NextData | null} next_data 
 */
function update_hardware(next_data) {
    if (!next_data) {
        _pan.move(RESTING_AZ);
        _tilt.move(RESTING_EL);
        _indic.turn_off();
        _az = RESTING_AZ;
        _el = RESTING_EL;
        _in = false;

        return;
    }

    const { azimuth, elevation, suppress_indic } = next_data;

    _pan.move(azimuth);
    _tilt.move(elevation);
    _az = azimuth;
    _el = elevation;

    if (suppress_indic) {
        _indic.turn_off();
        _in = false;
    } else {
        _indic.turn_on();
        _in = true;
    }
}

/**
 * 
 * @param {NextData} next_data 
 */
function assign_next(next_data) {
    if (!next_data) {
        return update_hardware(null);
    }

    const { azimuth, elevation, suppress_indic } = next_data;

    if (azimuth === _az && elevation === _el && !suppress_indic === _in) {
        return;
    }

    update_hardware(next_data);
}

/**
 * Singleton hardware integration
 */
class HardwarePointingHarness {
    get azimuth() {
        return _az;
    }

    get elevation() {
        return _el;
    }

    get indicator() {
        return _in;
    }

    /**
     * @param {object} param0 
     * @param {number} param0.pan
     * @param {number} param0.tilt
     * @param {number} param0.led
     */
    constructor({ pan, tilt, led }) {
        _pan = new PanControl(pan);
        _tilt = new TiltControl(tilt);
        _indic = new IndicatorControl(led);
    }

    /**
     * Direct the hardware pointing harness to the provided parameters
     * @param {NextData | null} [next_data] 
     */
    assign(next_data) {
        assign_next(next_data)
    }
}

module.exports = HardwarePointingHarness;
