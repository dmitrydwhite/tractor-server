const fs = require('fs');
const TOML = require('fast-toml');
const HW = require('./HardwarePointingHarness');

const toml_file = fs.readFileSync('./pins.toml').toString();
const { pan, tilt, led } = TOML.parse(toml_file);

const harness = new HW({ pan, tilt, led });

function parse_stdin(input_buf) {
    const entry_string = input_buf.toString();
    const [azimuth, elevation, suppress] = entry_string.split(':').map(x => Number(x));

    harness.assign({ azimuth, elevation, suppress_indic: !!suppress });
}

process.stdin.on('data', parse_stdin);