// Developer calibration route, XP3. Local canon numbers remain unknown; gameplay
// dial observations are printed as such. --input allows source-backed anchors.
import {readFileSync, writeFileSync} from 'node:fs';
import {fitPowerPrices} from '../src/power_grammar.js';
import {hpPowerPrices, lotmPowerPrices, POWER_CALIBRATION_ANCHORS} from '../src/power_grammar_worlds.js';
const args = process.argv.slice(2), option = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const anchors = option('--input') ? JSON.parse(readFileSync(option('--input'), 'utf8')) : POWER_CALIBRATION_ANCHORS;
const report = [fitPowerPrices(hpPowerPrices, anchors.hp ?? [], {tiers: [1, 2, 3, 4, 5, 6, 7]}),
    fitPowerPrices(lotmPowerPrices, anchors.lotm ?? [], {tiers: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]})];
const json = JSON.stringify(report, null, 2);
if(option('--json')) writeFileSync(option('--json'), json + '\n');
console.log(json);
if(args.includes('--strict') && report.some(r => r.rows.some(a => a.outlier))) process.exitCode = 1;
