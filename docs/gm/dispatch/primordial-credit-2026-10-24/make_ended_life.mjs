// Harness shortcut (labelled): the chronicle ends a mortal life only at its lifespan deadline, 62 game years
// after enrollment. This builds an ended-life variant of a literal export so the existing heir route can be
// played. Run: node make_ended_life.mjs <in.txt> <out.txt>
import fs from 'node:fs';
import {decodeSaveFile, encodeSaveFile} from '../../../../src/save_files.js';
import {createChronicle, advanceChronicle, GAME_YEAR} from '../../../../src/chronicle.js';
const [inp, out] = process.argv.slice(2);
const env = decodeSaveFile(fs.readFileSync(inp, 'utf8'), 'v0.6');
const clock0 = env.expansion?.clock ?? 0, cal = structuredClone(env['current time']);
const end = clock0 + 62 * GAME_YEAR;
const c = advanceChronicle(createChronicle(clock0, cal, true), end);
env.expansion = {...env.expansion, chronicle: c, clock: end};
env['current time'] = {...cal, year: cal.year + 62}; // the game checks the chronicle against the calendar; the loan stays as signed (62 years unpaid)
fs.writeFileSync(out, encodeSaveFile(JSON.stringify(env)));
console.log('ended at', end, 'ok', c.life.endedAt);
