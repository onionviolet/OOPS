// Walks Harry's lead life through the same buttons a player presses, headless and fast, then saves near the Easter holidays.
// Usage: node scripts/headless/hp_lead_walk.mjs [seed] [stopDay] [outSave]. Prints one line per 25 presses and the state at the stop.
import {boot} from './runner.mjs';
import {writeFileSync} from 'node:fs';
const say = (...a) => process.stdout.write(a.join(" ") + "\n");
const seed = +process.argv[2] || 7, stopDay = +process.argv[3] || 246, outSave = process.argv[4] || null;
const game = await boot(null, {seed});
const day = () => game.snapshot()['current time'].day_count;
const PANEL = '#workspace_navigation select[aria-label="Other known panels"]';
const open = id => game.fill(PANEL, id).catch(() => game.fill('#workspace_navigation select', id));
say('booted day', day());
await open('beginning');
await game.fill(game.$('select[data-structured-choice="life"]'), 'book.hp.lead');
await game.click('[data-structured-begin]');
await game.settle(400);
let presses = 0, idle = 0;
const pick = () => ['[data-hp-excursion-start]', '[data-hp-lesson]', '[data-hp]']
    .map(s => game.$$(s + ':not([disabled])').filter(b => !game.css.hiddenReason(b))[0]).find(Boolean);
while(idle < 8 && presses < 1500 && day() < stopDay) {
    if(presses % 5 === 0) await open('hp').catch(() => {});
    game.css.reset();
    const b = pick(), d0 = day();
    if(b) { await game.click(b); presses++; }
    await game.step(b ? 30 : 1440);
    idle = (b || day() !== d0) ? 0 : idle + 1;
    if(b && presses % 10 === 0) say('presses', presses, 'day', day(), (game.$('#hp_panel')?.textContent || '').replace(/\s+/g, ' ').slice(0, 110));
}
say('stopped day', day(), 'presses', presses, 'idle', idle);
say((game.$('#hp_panel')?.textContent || '').replace(/\s+/g, ' ').slice(0, 700));
if(outSave) { const s = await game.save(); writeFileSync(outSave, JSON.stringify(s)); say('saved', outSave); }
game.close();
