// DEV/TEST ONLY: a fixture save for the HP exam browser run (route kind "fixture", FLR2). The headless engine runs about 40 s per game day in the lead life,
// so walking to the Easter holidays takes hours. This begins the lead life through the Beginning panel, then sets what the Arrival and the Sorting
// would have set (at school, Gryffindor, in the hall), moves the engine's own clocks to the day given, and saves through the normal save path with
// the native location patched to match. Nothing here ships in the player UI or adds a save field.
// Usage: node scripts/headless/hp_exam_fixture.mjs [day=247] [out.json] [seed=7]
import {boot} from './runner.mjs';
import {writeFileSync} from 'node:fs';
const say = (...a) => process.stdout.write(a.join(' ') + '\n');
const day = +process.argv[2] || 247, out = process.argv[3] || 'hp-exam-fixture.json', seed = +process.argv[4] || 7;
const P = 'book.hp.lead', game = await boot(null, {seed});
await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'beginning');
await game.fill(game.$('select[data-structured-choice="life"]'), P);
await game.click('[data-structured-begin]');
await game.settle(400);
const {expansionState: s, current_game_time: t} = game.internals, a = s.actors.player;
a.facts['hp.lead.atSchool'] = true; a.facts['hp.lead.house'] = 'gryffindor';
for(const id of ['arrive_school', 'sorting', 'w6.return']) a.completed[`${P}.${id}`] = 1; // the Arrival, the Sorting and the first school week
s.simulation.people.player.location = `${P}.school_hall`;
s.clock = day * 1440 + 60;                       // 09:00 on lead day `day` (lead clock anchor 08:00)
t.day_count = day + 1; t.hour = 9; t.minute = 0; { const m = 3 + Math.floor(day / 30); t.year = 999 + Math.floor(m / 12); t.month = 1 + m % 12; t.day = 1 + day % 30; }
const save = JSON.parse(JSON.stringify(await game.save()));
save['current location'] = `${P}.school_hall`;
writeFileSync(out, JSON.stringify(save));
say('saved', out, 'clock', s.clock, 'day_count', t.day_count);
game.close();
