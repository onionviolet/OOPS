// Foundation R, MS5: the Frontier tempering route on R's path rule (PRG13), played headless from a
// fresh life by earned steps: the elder sends you to the Infested field, fighting there trains Combat,
// then the Vows and trials panel tempers the body. Then save, reload, export and import.
// Usage: node scripts/headless/r_tempering_walk.mjs [--out receipt.json] [--export save.txt]
import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {boot} from './runner.mjs';

const out = {route: 'natural', seed: 20261112, steps: []};
const note = (step, data = {}) => out.steps.push({step, ...data});
const game = await boot(null, {seed: out.seed});
const doc = () => game.document;
const text = sel => doc().querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? null;
const hasText = t => game.clickables().some(c => (c.text || '').includes(t));
const panelValue = () => [...doc().querySelectorAll('select option')].find(o => /Vows and trials/.test(o.textContent))?.value;
const openPledges = async () => {
    const select = [...doc().querySelectorAll('select')].find(s => [...s.options].some(o => /Vows and trials/.test(o.textContent)));
    select.value = panelValue(); select.dispatchEvent(new game.dom.classes.Event('change', {bubbles: true}));
    await game.settle(300);
};
const tempering = () => [...doc().querySelectorAll('*')].map(n => n.childNodes.length === 1 && n.textContent).find(t => t && /^Current body tempering:/.test(t.trim()))?.trim() ?? null;

try {
    for (const sel of ['.choice_dialogue', '[data-dialogue="villageElder"]', '[data-textline="hello"]', '[data-textline="where am i"]',
        '[data-textline="ask to leave 1"]', '[data-textline="need to"]', '#center_mode_back']) await game.click(sel);
    await game.step(15);
    note('elder', {field: hasText('Infested field')});
    await openPledges();
    note('before', {tempering: tempering(), notReady: hasText('Not ready yet.')});
    // The travel button's own entry point (the action list is hidden while a centre panel is open).
    await game.call('change_location', {location_id: 'Infested field'});
    await game.step(10);
    note('arrived', {location: text('#location_name_span') ?? text('.location-name')});
    let fought = 0;
    while (fought < 24 && !game.clickables().some(c => /Temper without rations/.test(c.text || '') && !c.disabled)) {
        await game.step(30); fought++;
        await openPledges();
        if (!hasText('Not ready yet.')) break;
    }
    note('fought', {halfHours: fought, notReady: hasText('Not ready yet.'), hp: text('#character_health_div')?.slice(0, 20)});
    const go = game.clickables().find(c => /^Temper without rations/.test((c.text || '').trim()));
    note('temper button', {text: go?.text?.slice(0, 80) ?? null});
    if (go) await game.clickText(go.text);
    await game.settle(300);
    note('after', {tempering: tempering()});
    const saved = await game.save();
    const stage = s => s.expansion ? JSON.stringify(s).match(/"pledges"[^]*?"stage":(\d)/)?.[1] : null;
    note('saved', {stage: stage(saved)});
    await game.reload(); await openPledges();
    note('reloaded', {tempering: tempering()});
    const file = await game.exportFile();
    const fileAt = process.argv.indexOf('--export');
    if (fileAt > 0) writeFileSync(process.argv[fileAt + 1], typeof file === 'string' ? file : JSON.stringify(file));
    await game.importFile(file); await openPledges();
    note('imported', {tempering: tempering()});
    out.bundle = 'sha256:' + createHash('sha256').update(readFileSync(new URL('../../dist/bundle.js', import.meta.url))).digest('hex');
    out.pageErrors = game.check?.() ?? null;
} catch (e) { out.error = String(e?.stack || e).slice(0, 800); }
await game.close();
const outIdx = process.argv.indexOf('--out');
if (outIdx > 0) writeFileSync(process.argv[outIdx + 1], JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
