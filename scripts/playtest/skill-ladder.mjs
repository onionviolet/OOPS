// SLC121: Sleeping and Patience ladder on a rebuilt bundle, headless, fresh private origin, 1920x1080.
// Usage: node scripts/playtest/skill-ladder.mjs . docs/gm/dispatch/skill-ladder-slice-2026-11-03/evidence
import assert from 'node:assert/strict';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, join} from 'node:path';
import {serve} from '../perf/lib.mjs';
import {Session} from './lib.mjs';
import {canonicalSave, diffSaves} from '../headless/runner.mjs';
const root = resolve(process.argv[2] || '.'), out = resolve(process.argv[3] || '/tmp/skill-ladder-evidence');
await mkdir(out, {recursive: true});
const server = await serve(root), s = new Session({url: server.url + '?test_hooks=1&skill_inspector=1', seed: 23, wall: Date.UTC(2026, 10, 3), opTimeout: 10000});
const checks = []; let p;
const snapshot = () => p.evaluate(() => simulationTestHooks.snapshot());
const play = async () => {await p.waitForFunction(() => typeof simulationTestHooks === 'object'); await p.evaluate(() => simulationTestHooks.pause()); await p.locator('#loading_screen_play_button').click(); await p.waitForTimeout(250);};
const tip = id => p.locator(`[data-skill="${id}"] .skill_tooltip`).evaluate(el => el.textContent);
const xp = (save, id) => save.levels.person.main_character.skill_xp[id];
async function roundtrip() {
    await p.waitForTimeout(1500); const before = await s.save(); await p.reload(); await play(); await p.waitForTimeout(1500);
    assert.deepEqual(diffSaves(canonicalSave(await s.save()), canonicalSave(before)), []);
    const literal = await p.evaluate(() => save_to_file()), exported = await s.save();
    await Promise.all([p.waitForEvent('load'), p.evaluate(x => load_progress(x), literal)]); await play();
    assert.deepEqual(diffSaves(canonicalSave(await s.save()), canonicalSave(exported)), []);
    assert.doesNotMatch(await p.locator('#message_log_div').innerText(), /Title earned: Sound Sleeper|Titles recognized from your past/);
}
const maxStamina = async () => (await p.evaluate(() => document.getElementById('character_stats_div')?.innerText || document.body.innerText)).match(/Max stamina:?\s*([\d.,]+)/i)?.[1];
try {
    await s.start();
    const fixture = JSON.parse(await readFile('tests/fixtures/perf/mid.json', 'utf8'));
    delete fixture.availabilities.recipe.undefined; fixture['current location'] = 'Shack'; fixture.availabilities.location.Shack = 1;
    fixture.locations.Shack = {...fixture.locations.Shack, housing_unlocked: true};
    fixture.character.titles = {}; fixture.levels.person.main_character.skill_xp.Sleeping = 30990; // level 4, 10 xp short of 5 (named fixture)
    await s.open(fixture); p = s.page;
    let t = await tip('Sleeping');
    assert.match(t, /Sleeping 3: Easy rest\..*\+5 max stamina\. \(active\)/);
    assert.match(t, /Sleeping 5: Sound sleeper\..*\(needs Sleeping 5\)/);
    assert.match(t, /Sleeping 10: \?\?\?\?\?\?/); assert.doesNotMatch(t, /dream catcher/i);
    assert.match(t, /Sleeping feeds Patience: \+4% Patience xp/);
    checks.push('Level 4: row 3 active, row 5 waiting, sealed row shows a level only, edge +4% on the Sleeping panel');
    // Earn level 5 by native sleeping.
    if(await p.locator('#center_mode_back').isVisible()) await p.locator('#center_mode_back').click(); await p.locator('#start_sleeping_div').click(); await s.step(12); await p.waitForTimeout(2200);
    let snap = await snapshot();
    assert.ok(xp(snap, 'Sleeping') >= 31000, 'Sleeping reached level 5 natively');
    for(let i = 0; i < 4 && !(await snapshot()).character.titles.sound_sleeper; i++) { await s.step(5); await p.waitForTimeout(1500); }
    snap = await snapshot(); const granted = snap.character.titles.sound_sleeper;
    assert.ok(granted && Number.isSafeInteger(granted.at), 'deed title saved as a dated grant');
    t = await tip('Sleeping');
    assert.match(t, /Sleeping 5: Sound sleeper\..*\(active\)/); assert.match(t, /\+5% Patience xp/);
    checks.push(`Level 5 earned by sleeping: row 5 active, edge +5%, Sound Sleeper granted at ${granted.at}`);
    await p.locator('#center_mode_back').click(); // wake: resting trains Patience natively
    await s.step(600); await p.waitForTimeout(500);
    const patience = xp(await s.save(), 'Patience'); assert.ok(patience > 0, 'resting trained Patience: ' + patience);
    const pt = await tip('Patience'); assert.match(pt, /Sleeping feeds Patience: \+5% Patience xp/); assert.match(pt, /Patience 2: Unhurried/);
    checks.push(`Patience trained by native resting (${patience} xp); its panel shows the same edge row`);
    await s.open(await s.save()); p = s.page; // normalise lazily created cast rows, as the title journey does
    await roundtrip();
    assert.deepEqual((await snapshot()).character.titles.sound_sleeper, granted);
    checks.push('Save, reload, Export and literal Import: save unchanged, no replayed title grant, title date kept');
    // Rust: turn the dial on, idle three weeks of game time.
    const rusty = await s.save(); rusty.skillRecords = rusty.skillRecords || {schema: 1, tracked: {}, rustOn: {}, nearMisses: []};
    rusty.skillRecords.rustOn['base.frontier'] = true; await s.open(rusty); p = s.page;
    await s.step(21000); await p.waitForTimeout(800);
    const rs = await s.save(); assert.equal(rs.skillRecords.tracked.Sleeping.peak, 5);
    assert.ok(rs.skillRecords.tracked.Sleeping.rust >= 1, 'Sleeping rusted');
    t = await tip('Sleeping');
    assert.match(t, /Rust holds Sleeping at 4 \(your best is 5\)/); assert.match(t, /Sleeping 5: Sound sleeper\..*resting while Sleeping is below 5/);
    assert.match(t, /Sleeping feeds Patience: \+4% Patience xp/);
    assert.deepEqual(rs.character.titles.sound_sleeper, granted);
    checks.push('Rust to level 4: row 5 rests, edge +4%, title and its date unchanged');
    await roundtrip();
    t = await tip('Sleeping'); assert.match(t, /Rust holds Sleeping at 4/);
    assert.deepEqual((await snapshot()).character.titles.sound_sleeper, granted);
    checks.push('Reload and literal Import while rusted: same level 4 view, no double perk, title kept');
    // Inspector line (dev view, localhost) and titles panel.
    await p.locator('#workspace_navigation select').first().selectOption('preparation'); await p.locator('#character_show_bio').click();
    await p.locator('[data-skill-inspector]').evaluate(el => el.open = true);
    const why = await p.locator('[data-ladder-why]').allInnerTexts(); assert.ok(why.some(l => /max stamina \+10: Sleeping 3 Easy rest \+5; Patience 4/.test(l) && /Sound Sleeper \(granted day/.test(l)), why.join(' | '));
    assert.ok(why.some(l => /Patience xp x1\.04: Sleeping 4 feeds Patience/.test(l)), why.join(' | '));
    await p.locator('#titles_panel').evaluate(el => el.open = true);
    assert.match(await p.locator('[data-title-id="sound_sleeper"]').innerText(), /Sound Sleeper.*Recognition; no held bonus/);
    checks.push('Inspector lists each ladder row, the edge and the title for max stamina and Patience xp; Titles panel shows Sound Sleeper');
    await p.screenshot({path: join(out, 'bio-inspector.png')});
    assert.deepEqual(s.errors.filter(e => e.kind === 'pageerror'), []);
    await writeFile(join(out, 'receipt.json'), JSON.stringify({checks, errors: s.errors, fixture: 'tests/fixtures/perf/mid.json with Shack and Sleeping seeded to 30990 xp; rust earned by 21000 stepped minutes with the dial on'}, null, 1));
    console.log(checks.join('\n'));
} catch(error) {await writeFile(join(out, 'failure.txt'), error.stack); await p?.screenshot({path: join(out, 'failure.png')}).catch(() => {}); throw error;}
finally {await s.close(); await server.close();}
