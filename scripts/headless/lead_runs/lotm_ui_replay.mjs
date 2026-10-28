// CL161-CL190 / CLR3: public driver; source text, IDs and screenshots come from private inputs.
// node .../lotm_ui_replay.mjs --mapping <private.json> --scenes <private.jsonl>
//   --l4b-gaps <private.jsonl> --out <private-dir> [--audit-only | --build <isolated-build>]
// UI clicks and natural clock only. Test hooks are used solely to READ snapshots.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash, randomInt} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const hash = x => createHash('sha256').update(x).digest('hex');
const jsonl = file => fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
export const GAP_KINDS = ['missing verb', 'missing UI path', 'hidden by disclosure', 'missing knowledge', 'blocked by mechanism', 'needs seat: be'];
const LAYERS = {'missing verb':'verb', 'missing UI path':'verb', 'hidden by disclosure':'detail', 'missing knowledge':'aftermath', 'blocked by mechanism':'rule', 'needs seat: be':'rule'};
export function validateMapping(mapping, scenes) {
    const selected = scenes.filter(s => s.pov === 'lead' && s.evidence?.length && Math.min(...s.evidence.map(e => Number(/第(\d+)章/.exec(e.locator)?.[1] ?? Infinity))) <= 3);
    const expected = selected.flatMap(s => s.steps.map((_, i) => `${s.beat}#${i + 1}`));
    // Midpoints of the brief's approximate ranges: 10 scenes / 32.5 steps.
    assert.ok(selected.length >= 5 && expected.length >= 16.25, 'CLR2: under half the expected midpoint');
    assert.equal(new Set(expected).size, expected.length, 'duplicate source steps');
    assert.deepEqual(mapping.rows.map(r => r.id).sort(), [...expected].sort(), 'every source step exactly once');
    for (const s of selected) {
        const rows = mapping.rows.filter(r => r.scene === s.beat);
        for (const [i, step] of s.steps.entries()) {
            const r = rows.find(r => r.id === `${s.beat}#${i + 1}`);
            assert.equal(r.verb, step.verb); assert.equal(r.object, step.object);
            if (r.sourceReview?.status === 'rejected_actor') assert.equal(r.status,'gap','rejected source rows cannot execute');
            assert.ok(r.locator && r.class && r.time && r.place, 'step table fields');
            assert.ok(Array.isArray(r.inputs) && Array.isArray(r.outputs) && Array.isArray(r.loses));
            assert.ok(['mapped', 'clean_fold', 'lossy_fold', 'gap'].includes(r.status));
            if (r.status === 'gap' || r.status === 'lossy_fold') assert.ok(GAP_KINDS.includes(r.gapKind));
            if (r.status === 'lossy_fold') assert.ok(r.loses.length, 'lossy folds list losses');
            if (r.status === 'mapped' || r.status === 'clean_fold') {
                assert.equal(r.loses.length, 0, 'executable folds must be lossless');
                assert.ok(r.route?.length && r.anchors?.place && r.anchors?.purseDelta !== undefined);
                assert.ok(r.route.every(a => a.actionId && a.place), 'real action ids and place anchors required');
            }
        }
    }
    const order = selected.sort((a,b) => a.order - b.order).flatMap(s => s.steps.map((_,i) => `${s.beat}#${i+1}`));
    assert.deepEqual(mapping.rows.map(r => r.id), order, 'source order must be preserved');
    return {scenes:selected.length, steps:expected.length};
}
export function scoreRows(rows, verified = new Set()) {
    const score = group => {
        const counts = {steps:group.length, reproducible:0, cleanFold:0, pendingUI:0, lossyFold:0, gaps:0, gapKinds:{}};
        for (const r of group) {
            if (r.status === 'gap' || r.status === 'lossy_fold') {
                counts.gaps++; if (r.status === 'lossy_fold') counts.lossyFold++;
                counts.gapKinds[r.gapKind] = (counts.gapKinds[r.gapKind] || 0) + 1;
            } else if (!verified.has(r.id)) counts.pendingUI++;
            else counts[r.status === 'mapped' ? 'reproducible' : 'cleanFold']++;
        }
        counts.fidelity = group.length ? (counts.reproducible + counts.cleanFold) / group.length : 0;
        return counts;
    };
    return {overall:score(rows), scenes:Object.fromEntries([...new Set(rows.map(r => r.scene))].map(s => [s,score(rows.filter(r => r.scene === s))]))};
}
export function mergeGapLedger(rows, existing) {
    const added = rows.filter(r => r.status === 'gap' || r.status === 'lossy_fold').map(r => ({
        scene:r.scene, step:r.id, kind:'UI replay', layer:LAYERS[r.gapKind], gapKind:r.gapKind,
        locator:r.locator, reason:r.reason, code:r.codes.join('/'), status:'open', basis:'Source-reviewed step versus existing player controls; not a runtime success claim.', lane:'L5r'
    }));
    // Keep the sibling ledger read-only. One combined private list with explicit lane provenance.
    const merged = [...existing.map(r => ({...r,lane:r.lane || 'L4b'})), ...added];
    const counts = Object.fromEntries([...new Set(merged.map(r => r.layer))].sort().map(k => [k,merged.filter(r => r.layer === k).length]));
    return {rows:merged.sort((a,b) => counts[b.layer]-counts[a.layer] || a.layer.localeCompare(b.layer) || a.scene.localeCompare(b.scene)), counts};
}
export async function executeRows(page, rows, io) {
    const verified = new Set(), receipts = [];
    for (const row of rows) {
        if (row.status === 'gap' || row.status === 'lossy_fold') {
            receipts.push({id:row.id,status:'gap',gapKind:row.gapKind}); continue;
        }
        // Missing earlier steps remain named gaps. The row's explicit supporting route is not book proof.
        for (const leg of row.setup || []) await io.move(page, leg, null);
        await io.waitBand(page, row.time);
        const before = await io.read(page);
        await io.screenshot(page,`${row.id.replace(/[^a-z0-9]/gi,'_')}-before.png`);
        for (const [i,leg] of row.route.entries()) {
            await io.move(page,leg,row.time);
            await io.screenshot(page,`${row.id.replace(/[^a-z0-9]/gi,'_')}-${i+1}.png`);
        }
        const after = await io.read(page);
        assert.equal(after.place,row.anchors.place);
        assert.equal(after.cash-before.cash,row.anchors.purseDelta);
        for (const key of row.anchors.knowledge || []) assert.ok(after.knowledge[key], 'required knowledge note');
        verified.add(row.id);
        receipts.push({id:row.id,status:row.status,place:after.place,purseDelta:after.cash-before.cash,knowledge:(row.anchors.knowledge || []).map(key => ({key,present:!!after.knowledge[key]}))});
    }
    return {receipts,score:scoreRows(rows,verified)};
}
async function browserRun(mapping, build, out, run) {
    const require = createRequire(import.meta.url), {launchChrome} = require('../../ui_helpers.cjs');
    const browser = await launchChrome();
    try {
        const context = await browser.newContext({viewport:{width:1920,height:1080}});
        const origin = `http://127.0.0.1:${randomInt(20000,60000)}`;
        await context.route(origin+'/**', async route => {
            const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
            const file = path.resolve(build,'.'+(pathname === '/' ? '/index.html' : pathname));
            assert.ok(file.startsWith(path.resolve(build)+path.sep));
            try {await route.fulfill({path:file,contentType:({'.js':'text/javascript','.json':'application/json','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'})[path.extname(file)] || 'application/octet-stream'});}
            catch {await route.fulfill({status:404,body:''});}
        });
        const page = await context.newPage(), errors = [];
        page.on('pageerror',e => errors.push(e.message));
        const read = () => page.evaluate(() => {
            const s = window.simulationTestHooks.snapshot(), e = s.expansion;
            return {place:e.simulation.people.player.location,cash:s.character.money,knowledge:e.simulation.knowledge?.player || {},elapsed:e.clock-e.lotm.initializedAt};
        });
        const until = async (predicate,what) => {
            const deadline = Date.now()+12*60*1000;
            while (!await predicate()) {
                if (Date.now()>=deadline) assert.fail(`natural clock stalled or route failed: ${what}; last ${JSON.stringify(await read().catch(e => String(e)))}`);
                await page.waitForTimeout(250);
            }
        };
        await page.goto(origin+'/?test_hooks=1');
        await page.locator('#loading_screen_play_button').click();
        const confirm = page.locator('#hero_creation_panel_confirmation');
        if (await confirm.isVisible()) await confirm.click();
        await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
        const panel = page.locator('#lotm_panel');
        const click = async id => {
            const control = panel.locator(`[data-lotm="${id}"]`);
            await control.waitFor({state:'visible'}); assert.ok(await control.isEnabled(),'required control disabled');
            await control.scrollIntoViewIfNeeded(); await control.click();
        };
        await click(mapping.entry.pick); await click(mapping.entry.enroll);
        await until(async () => {try {return (await read()).place === mapping.entry.place;} catch {return false;}},'entry');
        const io = {
            read,
            waitBand:async (_,time) => {
                const start = (time.day-1)*1440+time.from;
                await until(async () => (await read()).elapsed>=start,'source band');
                assert.ok((await read()).elapsed<(time.day-1)*1440+time.to,'missed source time band');
            },
            move:async (_,leg,time) => {
                await click(leg.actionId);
                await until(async () => (await read()).place===leg.place,'walk leg');
                if (leg.label) assert.ok((await panel.innerText()).includes(leg.label),'arrival must be shown in the real panel');
                if (time) assert.ok((await read()).elapsed<(time.day-1)*1440+time.to,'walk finished outside source band');
            },
            screenshot:async (_,name) => page.screenshot({path:path.join(out,`run${run}-${name}`)})
        };
        await page.screenshot({path:path.join(out,`run${run}-entry.png`)});
        const result = await executeRows(page,mapping.rows,io);
        assert.deepEqual(errors,[],'page errors belong to this run until proven otherwise');
        return {...result,pageErrors:errors};
    } finally {await browser.close();}
}
async function main() {
    const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all) => v.startsWith('--') ? [...a,[v.slice(2),all[i+1]?.startsWith('--') ? true : all[i+1] || true]] : a,[]));
    for (const name of ['mapping','scenes','l4b-gaps','out']) assert.equal(typeof args[name],'string',`--${name} required`);
    const out = path.resolve(args.out), mapping = JSON.parse(fs.readFileSync(args.mapping));
    fs.mkdirSync(out,{recursive:true});
    if (mapping.inputHashes?.['scenes.jsonl']) assert.equal(hash(fs.readFileSync(args.scenes)),mapping.inputHashes['scenes.jsonl'],'scene inputs changed since mapping');
    const probe = validateMapping(mapping,jsonl(args.scenes));
    const ledger = mergeGapLedger(mapping.rows,jsonl(args['l4b-gaps']));
    fs.writeFileSync(path.join(out,'combined_gaps.jsonl'),ledger.rows.map(r => JSON.stringify(r)).join('\n')+'\n');
    const audit = {probe,score:scoreRows(mapping.rows),combinedGapLayers:ledger.counts,inputHash:hash(fs.readFileSync(args.mapping))};
    fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
    if (args['audit-only']) {console.log(JSON.stringify(audit)); return;}
    assert.equal(typeof args.build,'string','--build required for UI proof');
    const bundleHash = hash(fs.readFileSync(path.join(args.build,'dist/bundle.js')));
    const runs = [];
    try {
        for (const run of [1,2]) {
            const result = await browserRun(mapping,args.build,out,run); runs.push(result);
            fs.writeFileSync(path.join(out,`run${run}.json`),JSON.stringify(result,null,2)+'\n');
        }
        assert.deepEqual(runs[0],runs[1],'fresh UI runs must agree');
        const result = {...audit,bundleHash,score:runs[0].score,identical:true,pageErrors:[],state:'agent-verified, not human-reviewed',route:'fresh beside life; visible clicks; natural clock; explicit supporting walks; prior gaps remain unexecuted'};
        fs.writeFileSync(path.join(out,'proof.json'),JSON.stringify(result,null,2)+'\n');
        console.log(JSON.stringify(result));
    } catch (error) {
        fs.writeFileSync(path.join(out,'blocked.json'),JSON.stringify({bundleHash,completedRuns:runs.length,error:String(error),state:'UI proof incomplete'},null,2)+'\n');
        throw error;
    }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => {console.error(e);process.exitCode=1;});
