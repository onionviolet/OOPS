// CL161-CL190 / CLR3: public driver; source text, IDs and screenshots come from private inputs.
// node .../lotm_ui_replay.mjs --mapping <private.json> --scenes <private.jsonl>
//   --l4b-gaps <private.jsonl> --out <private-dir> [--audit-only | --build <isolated-build>]
// UI clicks with the engine paused; explicit test-hook ticks advance replay time.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash, randomInt} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {TIME_BANDS} from '../../../src/cast_schedule.js';
import {createStreams} from '../../../src/seeded_streams.js';
const DEFAULT_READY_TIMEOUT_MS = 180000;
const REPLAY_SEED = 1592594996;
export const COMPARISON_OMISSIONS = Object.freeze([
    'saved_at', 'total_playtime', 'last_rewarded_export',
    'absorb_local_life.lastClock', 'absorb_local_life.lastHubAttempt',
    'levels.person.main_character.skill_xp.Breathing', 'skillRecords.tracked'
]);
export const CLOCK_COMPARISON_OMISSIONS = Object.freeze([
    'current time.minute', 'expansion.clock',
    'expansion.simulation.controllers.village.craftsman_controller.due'
]);
const hash = x => createHash('sha256').update(x).digest('hex');
const jsonl = file => fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
export const GAP_KINDS = ['missing verb', 'missing UI path', 'hidden by disclosure', 'missing knowledge', 'blocked by mechanism', 'needs seat: be'];
const LAYERS = {'missing verb':'verb', 'missing UI path':'verb', 'hidden by disclosure':'detail', 'missing knowledge':'aftermath', 'blocked by mechanism':'rule', 'needs seat: be':'rule'};
export function replayWindow(row) {
    const time = row.time || {};
    if (Number.isFinite(time.day) && Number.isFinite(time.from) && Number.isFinite(time.to)) return {...time};
    const day = Number.isFinite(row.day) ? row.day : Number.isFinite(time.day) ? time.day : Number.isFinite(time.date?.day) ? time.date.day : null;
    if (day == null) return null;
    const value = typeof time.value === 'string' ? time.value.trim().toLowerCase() : '';
    const band = TIME_BANDS[value];
    if (band) return {day, from:band.from, to:band.to};
    const clock = /^(\d{1,2}):(\d{2})$/.exec(value);
    if (clock) { const from=Number(clock[1])*60+Number(clock[2]); return {day,from,to:from+1}; }
    if (Number.isFinite(time.minute)) return {day,from:time.minute,to:time.minute+1};
    return null;
}
export function replayLocatorKey(locator) {
    const match=/(?:\bb(\d+)\s+)?第(\d+)章/.exec(locator || '');
    if (!match) return null;
    const volume=Number(match[1] || 1),chapter=Number(match[2]);
    return Number.isSafeInteger(volume)&&volume>0&&Number.isSafeInteger(chapter)&&chapter>0 ? {volume,chapter} : null;
}
const compareLocatorKeys=(a,b)=>a.volume-b.volume || a.chapter-b.chapter;
export function parseReplayLocatorRange(value) {
    const parts=typeof value==='string' ? value.split('..') : [];
    const from=replayLocatorKey(parts[0]),to=replayLocatorKey(parts[1]);
    assert.ok(parts.length===2 && from && to && compareLocatorKeys(from,to)<=0, '--locator-range must be an ordered pair of chapter locators separated by ..');
    return {from,to};
}
const inReplayRange=(key,range)=>!range || (compareLocatorKeys(key,range.from)>=0 && compareLocatorKeys(key,range.to)<=0);
const rowChapter = row => Number.isFinite(row.chapter) ? row.chapter : (replayLocatorKey(row.locator)?.chapter ?? Infinity);
export function adaptReplayRows(rows, {chapters = null, volume = 1, locatorRange = null, maxSteps = Infinity, offset = 0, scenes = []} = {}) {
    const sceneById=new Map(scenes.map(scene=>[scene.beat,scene]));
    const enriched=rows.map(row=>{
        const source=sceneById.get(row.scene);
        const locators=(source?.evidence||[]).map(e=>e.locator).filter(x=>replayLocatorKey(x));
        if (!locators.length && row.locator && replayLocatorKey(row.locator)) locators.push(row.locator);
        const keys=locators.map(replayLocatorKey).filter(key=>(volume==null||key.volume===volume)&&(!chapters||(key.chapter>=chapters[0]&&key.chapter<=chapters[1]))&&inReplayRange(key,locatorRange));
        const unique=[...new Map(keys.map(key=>[`${key.volume}:${key.chapter}`,key])).values()].sort(compareLocatorKeys);
        return {...row,chapter:unique.length===1?unique[0].chapter:null,volume:unique.length===1?unique[0].volume:null,chapterAmbiguous:unique.length>1,chapters:unique.map(key=>key.chapter),locator:unique.length===1?locators.find(locator=>compareLocatorKeys(replayLocatorKey(locator),unique[0])===0):null,selectedLocatorCount:keys.length};
    });
    const selected = enriched.filter(row=>row.selectedLocatorCount>0);
    return selected.slice(offset, offset + maxSteps).map((row,index) => {
        const adapted={...row,sourceTime:row.time,time:replayWindow(row),replayOrder:index};
        const isWait=row.routeMode==='wait'||row.method==='wait';
        const badRoute=!isWait&&(!(row.route?.length)||row.route.some(leg=>!leg.actionId||!leg.place));
        if (isWait&&!adapted.time) return {...adapted,status:'gap',gapKind:'missing UI path',reason:'Wait intent has no numeric day window; retained as order-only gap.'};
        if ((row.status==='mapped'||row.status==='clean_fold')&&(badRoute||!row.anchors?.place)) return {...adapted,status:'gap',gapKind:'missing UI path',reason:'Generated row lacks a complete player route or place anchor.'};
        return adapted;
    });
}
export function diffPaths(a,b,prefix='') {
    if (Object.is(a,b)) return [];
    if (!a || !b || typeof a!=='object' || typeof b!=='object' || Array.isArray(a)!==Array.isArray(b)) return [prefix || '$'];
    const keys=[...new Set([...Object.keys(a),...Object.keys(b)])].sort();
    return keys.flatMap(key=>diffPaths(a[key],b[key],prefix ? `${prefix}.${key}` : key));
}
export function compareRunSnapshots(first,second,extraOmissions=[]) {
    const paths=diffPaths(canonicalReplaySnapshot(first,extraOmissions),canonicalReplaySnapshot(second,extraOmissions));
    return {identical:paths.length===0,differingPaths:paths,mismatch:paths.length?{run1:{differingPaths:paths},run2:{differingPaths:paths},state:'mismatch recorded'}:null};
}
export async function compareAtGameMinute(snapshots,advance) {
    const clocks=snapshots.map(s=>s.expansion?.clock);
    let aligned=snapshots, target=null, mode='exact', reason=null, exclusions=[];
    try {
        if (!clocks.every(Number.isSafeInteger)) throw new Error('A paused expansion clock is unavailable.');
        target=Math.max(...clocks);
        aligned=[...snapshots];
        for (let i=0;i<aligned.length;i++) if (clocks[i]<target) {
            aligned[i]=await advance(i,target);
            if (aligned[i]?.expansion?.clock!==target) throw new Error('Stepper did not reach the exact target minute.');
        }
    } catch (error) {
        if (error?.snapshotFailure) throw error;
        aligned=snapshots; mode='clock-excluded'; exclusions=[...CLOCK_COMPARISON_OMISSIONS];
        reason=String(error?.message || error);
    }
    return {snapshots:aligned,clocks,target,mode,exclusions,reason,comparison:compareRunSnapshots(aligned[0],aligned[1],exclusions)};
}
export function scoreReproducibleReplay(first,second,identical) {
    const other=new Map(second.rows.map(row=>[row.id,row]));
    const reproduced=identical ? first.rows.filter(row=>row.inOrder && other.get(row.id)?.inOrder && other.get(row.id)?.kind===row.kind).length : 0;
    return {steps:first.steps,reproduced,fidelity:first.steps ? reproduced/first.steps : 0};
}
export function validateMapping(mapping, scenes) {
    const generated = mapping.schema === 'lead-ui-replay/2';
    const from = generated ? Number(mapping.scope?.fromChapter) : 1;
    const to = generated ? Number(mapping.scope?.toChapter) : 3;
    const fromLocator=mapping.scope?.fromLocator,toLocator=mapping.scope?.toLocator;
    assert.ok(!generated || Boolean(fromLocator)===Boolean(toLocator), 'mapping locator bounds must be paired');
    const mappingRange=generated && fromLocator ? parseReplayLocatorRange(`${fromLocator}..${toLocator}`) : null;
    const selected = scenes.filter(s => s.pov === 'lead' && s.evidence?.length && s.evidence.some(e => {
        const key=replayLocatorKey(e.locator);
        return key && (mappingRange ? inReplayRange(key,mappingRange) : key.chapter >= from && key.chapter <= to);
    })).sort((a,b) => a.order-b.order);
    const expected = selected.flatMap(s => s.steps.map((_, i) => `${s.beat}#${i + 1}`));
    if (!generated) assert.ok(selected.length >= 5 && expected.length >= 16.25, 'CLR2: under half the expected midpoint');
    else assert.ok(expected.length > 0, 'CLR2: generated chapter range has no lead steps');
    assert.equal(new Set(expected).size, expected.length, 'duplicate source steps');
    assert.deepEqual(mapping.rows.map(r => r.id).sort(), [...expected].sort(), 'every source step exactly once');
    if (generated) {
        for (const row of mapping.rows) {
            assert.ok(typeof row.id==='string', 'generated row identity');
            if (!row.time || typeof row.time!=='object') {
                row.time={value:null,date:null}; row.status='gap'; row.gapKind='missing UI path';
                row.reason='Generated row has no usable time object; retained as an order-only typed gap.';
            }
            if (!['mapped','clean_fold','lossy_fold','gap'].includes(row.status)) {
                row.status='gap'; row.gapKind='missing UI path'; row.reason='Generated row has an unknown status; retained as a typed gap.';
            }
            if ((row.status==='gap'||row.status==='lossy_fold') && !GAP_KINDS.includes(row.gapKind)) row.gapKind='missing UI path';
        }
        return {scenes:selected.length,steps:expected.length};
    }
    for (const s of selected) {
        const rows = mapping.rows.filter(r => r.scene === s.beat);
        for (const [i, step] of s.steps.entries()) {
            const r = rows.find(r => r.id === `${s.beat}#${i + 1}`);
            assert.equal(r.verb, step.verb); assert.equal(r.object, step.object);
            if (r.sourceReview?.status === 'rejected_actor') assert.equal(r.status,'gap','rejected source rows cannot execute');
            assert.ok(r.locator && r.class && r.time && r.place, 'step table fields');
            if (generated) assert.ok(r.time.value != null || r.time.day != null || r.day != null || Number.isFinite(r.time.minute), 'generated row needs a time or order edge');
            assert.ok(Array.isArray(r.inputs) && Array.isArray(r.outputs) && Array.isArray(r.loses));
            assert.ok(['mapped', 'clean_fold', 'lossy_fold', 'gap'].includes(r.status));
            if (r.status === 'gap' || r.status === 'lossy_fold') assert.ok(GAP_KINDS.includes(r.gapKind));
            if (r.status === 'lossy_fold') assert.ok(r.loses.length, 'lossy folds list losses');
            if (r.status === 'mapped' || r.status === 'clean_fold') {
                assert.equal(r.loses.length, 0, 'executable folds must be lossless');
                // A wait row is reached by the time stage alone (an intention wait in the be seat); it has no walk legs.
                const waitRow = r.routeMode === 'wait' || r.method === 'wait';
                assert.ok((waitRow || r.route?.length) && r.anchors?.place);
                if (!generated) assert.ok(r.anchors?.purseDelta !== undefined);
                assert.ok((r.route || []).every(a => a.actionId && a.place), 'real action ids and place anchors required');
            }
        }
    }
    const order = selected.flatMap(s => s.steps.map((_,i) => `${s.beat}#${i+1}`));
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
export function scoreReplay(rows, outcomes = []) {
    const byId = new Map(outcomes.map(o => [o.id, o]));
    let lastReached = -1, reachedInOrder = 0;
    const scored = rows.map((row, index) => {
        const outcome = byId.get(row.id) || {kind:'gap', reason:row.reason || row.gapKind || 'No route recorded'};
        assert.ok(['control','wait','blocked','gap'].includes(outcome.kind), `unknown outcome for ${row.id}`);
        if (outcome.kind === 'blocked') assert.ok(outcome.reason, `blocked row needs displayed reason: ${row.id}`);
        const reached = outcome.kind === 'control' || outcome.kind === 'wait';
        const inWindow = reached && outcome.inWindow !== false;
        const inOrder = inWindow && (outcome.orderIndex ?? index) > lastReached;
        if (inOrder) { reachedInOrder++; lastReached = outcome.orderIndex ?? index; }
        return {id:row.id,kind:outcome.kind,reason:outcome.reason || null,inWindow,inOrder};
    });
    const counts = Object.fromEntries(['control','wait','blocked','gap'].map(k => [k,scored.filter(x => x.kind === k).length]));
    const chapterNumbers = [...new Set(rows.map(rowChapter).filter(Number.isFinite))].sort((a,b)=>a-b);
    const byChapter = Object.fromEntries(chapterNumbers.map(chapter => {
        const group=scored.filter((_,i)=>rowChapter(rows[i])===chapter);
        return [chapter,{steps:group.length,reachedInOrder:group.filter(x=>x.inOrder).length,fidelity:group.length?group.filter(x=>x.inOrder).length/group.length:0}];
    }));
    return {counts,steps:rows.length,reachedInOrder,fidelity:rows.length ? reachedInOrder / rows.length : 0,byChapter,ambiguousChapterSteps:rows.filter(row=>row.chapterAmbiguous).length,rows:scored};
}
function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]).filter(([,x])=>
        !(x===0 || x===false || x===null || (Array.isArray(x)?!x.length:typeof x==='object'&&!Object.keys(x).length))));
}
export function canonicalReplaySnapshot(snapshot,extraOmissions=[]) {
    const copy=structuredClone(snapshot);
    for (const field of [...COMPARISON_OMISSIONS,...extraOmissions]) {
        const path=field.split('.'), key=path.pop();
        let parent=copy;
        for (const part of path) parent=parent?.[part];
        if (parent && typeof parent==='object') delete parent[key];
    }
    return canonical(copy);
}
export function stateHashWithoutNaturalClock(snapshot,extraOmissions=[]) {
    return hash(JSON.stringify(canonicalReplaySnapshot(snapshot,extraOmissions)));
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
export function createReplayDiagnostics(run) {
    const data={run,consoleMessages:[],pageErrors:[],lastExecutedStepId:null,lastControlId:null,firstSnapshotFailureAfter:null,snapshotFailureObserved:false};
    let currentStep=null;
    return {data,beginStep:id=>{currentStep=id;},controlClicked:id=>{if(currentStep!==null){data.lastExecutedStepId=currentStep;data.lastControlId=id;}},
        snapshotFailure:error=>{
            if (!data.snapshotFailureObserved) {data.firstSnapshotFailureAfter=data.lastExecutedStepId;data.snapshotFailureObserved=true;}
            const marked=error instanceof Error ? error : new Error(String(error));
            marked.snapshotFailure=true;marked.replayRun=run;return marked;
        }};
}
export function makeBlockedReceipt({bundleHash=null,completedRuns=0,error,diagnostics={},visibleLines=[]}) {
    return {bundleHash,completedRuns,error:String(error),state:'UI proof incomplete',run:diagnostics.run ?? null,
        consoleMessages:(diagnostics.consoleMessages || []).slice(-40),pageErrors:diagnostics.pageErrors || [],
        lastExecutedStepId:diagnostics.lastExecutedStepId ?? null,lastControlId:diagnostics.lastControlId ?? null,
        firstSnapshotFailureAfter:diagnostics.firstSnapshotFailureAfter ?? null,snapshotFailureObserved:!!diagnostics.snapshotFailureObserved,
        visibleSaveErrorLines:visibleLines.filter(line=>/save|saving|error|went wrong|disabled/i.test(line)).slice(0,20)};
}
export async function executeRows(page, rows, io, {canonOnly = false} = {}) {
    const verified = new Set(), receipts = [], outcomes = [];
    for (const row of rows) {
        if ((row.status === 'gap' || row.status === 'lossy_fold') && !((row.routeMode === 'wait' || row.method === 'wait') && row.time)) {
            const reason = row.reason || row.gapKind || 'No route recorded';
            receipts.push({id:row.id,status:'gap',gapKind:row.gapKind,reason});
            outcomes.push({id:row.id,kind:'gap',reason}); continue;
        }
        // Missing earlier steps remain named gaps. The row's explicit supporting route is not book proof.
        // A missing control, missed window or wrong anchor is a scored gap for this row, not the end of the run.
        io.beginStep?.(row.id);
        try {
        if (!canonOnly) for (const leg of row.setup || []) await io.move(page, leg, null);
        if (row.time) await io.waitBand(page, row.time);
        const before = await io.read(page);
        await io.screenshot(page,`${row.id.replace(/[^a-z0-9]/gi,'_')}-before.png`);
        let blocked = null;
        for (const [i,leg] of (row.routeMode === 'wait' || row.method === 'wait' ? [] : row.route || []).entries()) {
            const result = await io.move(page,leg,row.time);
            if (result?.blocked) { blocked = result.blocked; break; }
            if (result?.gap) throw new Error(result.gap);
            await io.screenshot(page,`${row.id.replace(/[^a-z0-9]/gi,'_')}-${i+1}.png`);
        }
        if (blocked) {
            receipts.push({id:row.id,status:'blocked',reason:blocked});
            outcomes.push({id:row.id,kind:'blocked',reason:blocked});
            continue;
        }
        const after = await io.read(page);
        if (row.anchors?.destination || row.anchors?.place) assert.equal(after.place,row.anchors.destination || row.anchors.place);
        if (row.anchors.purseDelta !== undefined) assert.equal(after.cash-before.cash,row.anchors.purseDelta);
        for (const key of row.anchors.knowledge || []) assert.ok(after.knowledge[key], 'required knowledge note');
        verified.add(row.id);
        receipts.push({id:row.id,status:row.status,place:after.place,purseDelta:after.cash-before.cash,knowledge:(row.anchors.knowledge || []).map(key => ({key,present:!!after.knowledge[key]}))});
        outcomes.push({id:row.id,kind:(row.routeMode === 'wait' || row.method === 'wait' || row.verb === 'wait') ? 'wait' : 'control',inWindow:true,orderIndex:outcomes.length});
        } catch (error) {
            if (error?.snapshotFailure) throw error;
            const reason = `replay: ${String(error?.message || error).split('\n')[0].slice(0,200)}`;
            receipts.push({id:row.id,status:'gap',gapKind:'missing UI path',reason});
            outcomes.push({id:row.id,kind:'gap',reason});
        }
    }
    return {receipts,score:scoreRows(rows,verified),replayScore:scoreReplay(rows,outcomes)};
}
// The UI may commit a timed job or consume its time synchronously (waits).
// Step only a newly committed player job, and verify its actual deadline.
export async function performReplayControl(io,leg) {
    const before=await io.snapshot();
    const result=await io.click(leg.actionId);
    if (result?.blocked || result?.gap) return result;
    const after=await io.snapshot();
    const oldIds=new Set((before.expansion?.simulation?.jobs || []).map(job=>job.id));
    const jobs=(after.expansion?.simulation?.jobs || []).filter(job=>job.actorId==='player'&&!oldIds.has(job.id));
    if (jobs.length>1) return {gap:'Control started multiple player jobs; completion is ambiguous.'};
    let finished=after;
    if (jobs.length===1) {
        const due=jobs[0].due, clock=after.expansion.clock;
        if (!Number.isSafeInteger(due) || due<=clock) return {gap:'Control did not produce a valid future job deadline.'};
        if (result?.quotedMinutes != null && due-clock!==result.quotedMinutes) return {gap:'Control job duration differs from the visible quote.'};
        finished=await io.advanceTo(due);
        if ((finished.expansion?.simulation?.jobs || []).some(job=>job.id===jobs[0].id)) return {gap:'Control job did not finish at its deadline.'};
    } else if (result?.quotedMinutes>0 && after.expansion.clock-before.expansion.clock!==result.quotedMinutes) {
        return {gap:'Timed control did not consume its visible quote.'};
    } else if (after.expansion.clock===before.expansion.clock && compareRunSnapshots(before,after).identical) {
        return {gap:'Control produced no observable state change.'};
    }
    const destination=leg.destination || leg.place;
    if (destination && finished.expansion?.simulation?.people?.player?.location!==destination) return {gap:'Control did not reach its expected place.'};
    return null;
}
async function browserRun(mapping, build, out, run, seat = 'beside', nullPlayer = false, readyTimeoutMs = DEFAULT_READY_TIMEOUT_MS, recordPackLoad = () => {}) {
    const require = createRequire(import.meta.url), {launchChrome} = require('../../ui_helpers.cjs');
    const browser = await launchChrome();
    const diagnostics=createReplayDiagnostics(run);
    let retained=false,page=null;
    const collectDiagnostics=async()=>{
        let visibleLines=[];
        try {if(page) visibleLines=await page.evaluate(()=>(document.body?.innerText || '').split(/\r?\n/).map(line=>line.trim()).filter(Boolean));} catch {}
        return {diagnostics:diagnostics.data,visibleLines};
    };
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
        page = await context.newPage();
        const errors=diagnostics.data.pageErrors;
        page.on('console',message=>diagnostics.data.consoleMessages.push({type:message.type(),text:message.text()}));
        page.on('pageerror',e => errors.push(e.message));
        const snapshot = async () => {
            try {return await page.evaluate(() => window.simulationTestHooks.snapshot());}
            catch(error) {throw diagnostics.snapshotFailure(error);}
        };
        const evaluateWithSnapshots=async(fn,arg)=>{
            try {return await page.evaluate(fn,arg);}
            catch(error) {if (String(error).includes('REPLAY_SNAPSHOT_FAILURE:')) throw diagnostics.snapshotFailure(error);throw error;}
        };
        const read = async () => {
            const s = await snapshot(), e = s.expansion, lotm = s.lotm || e?.lotm || {};
            return {place:e.simulation.people.player.location,cash:s.character.money,knowledge:e.simulation.knowledge?.player || {},elapsed:e.clock-(lotm.initializedAt ?? 0),
                entryProfile:lotm.entryProfile};
        };
        const until = async (predicate,what) => {
            const deadline = Date.now()+12*60*1000;
            while (!await predicate()) {
                if (Date.now()>=deadline) assert.fail(`page readiness or route failed: ${what}; last ${JSON.stringify(await read().catch(e => String(e)))}`);
                await page.waitForTimeout(250);
            }
        };
        const packLoadMs = {};
        const playButton = page.locator('#loading_screen_play_button');
        let navigationStarted = Date.now();
        const replaySeed = seat === 'be' ? REPLAY_SEED : null;
        await page.goto(origin+`/?test_hooks=1${replaySeed === null ? '' : `&replay_seed=${replaySeed}`}`,{timeout:readyTimeoutMs});
        await playButton.waitFor({state:'visible',timeout:readyTimeoutMs});
        packLoadMs.initial = Date.now()-navigationStarted;
        recordPackLoad('initial',packLoadMs.initial);
        await page.waitForFunction(() => !!window.simulationTestHooks && typeof window.advanceTicks==='function',null,{timeout:readyTimeoutMs});
        await page.evaluate(() => window.simulationTestHooks.pause());
        await playButton.click();
        const confirm = page.locator('#hero_creation_panel_confirmation');
        if (await confirm.isVisible()) await confirm.click();
        await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
        const panel = page.locator('#lotm_panel');
        const click = async id => {
            const control = panel.locator(`[data-lotm="${id}"]`).first();
            // Walks sit in collapsed district groups (UR42): open the enclosing groups first.
            await control.waitFor({state:'attached',timeout:30000}).catch(() => {});
            if (!await control.count()) return {gap:`no control ${id} in this seat`};
            await control.evaluate(e => {for (let d = e.closest('details'); d; d = d.parentElement?.closest('details')) d.open = true;});
            await control.waitFor({state:'visible'});
            if (!await control.isEnabled()) {
                const reason = (await control.getAttribute('title')) || (await control.getAttribute('aria-label')) || (await control.innerText());
                assert.ok(reason?.trim(),'disabled control has no displayed reason');
                return {blocked:reason.trim()};
            }
            const label=await control.innerText();
            const quoted=/\b(\d+)\s*(?:min|minutes?)\b/i.exec(label);
            await control.scrollIntoViewIfNeeded(); await snapshot(); await control.click();
            diagnostics.controlClicked(id);
            return {quotedMinutes:quoted ? Number(quoted[1]) : null};
        };
        if (seat === 'be') {
            await click('pick_be');
            // The new life starts through a page reload; press Play again on the fresh page.
            navigationStarted = Date.now();
            await Promise.all([page.waitForEvent('load',{timeout:readyTimeoutMs}), click('enroll_be')]);
            await playButton.waitFor({state:'visible',timeout:readyTimeoutMs});
            packLoadMs.reload = Date.now()-navigationStarted;
            recordPackLoad('reload',packLoadMs.reload);
            await page.waitForFunction(() => !!window.simulationTestHooks && typeof window.advanceTicks==='function',null,{timeout:readyTimeoutMs});
            await page.evaluate(() => window.simulationTestHooks.pause());
            await playButton.click();
            if (await confirm.isVisible()) await confirm.click();
            await page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm').catch(() => {});
            await until(async () => {try {return (await read()).entryProfile === 'book.lead.be@1';} catch(error) {if(error?.snapshotFailure)throw error;return false;}},'be-life reload');
            if (replaySeed !== null) assert.equal((await snapshot()).expansion?.streams?.root,createStreams(replaySeed).root,'fixed replay seed was not applied to the fresh be life; apply V2_INTEGRATION.patch and rebuild');
        } else {
            await click(mapping.entry.pick); await click(mapping.entry.enroll);
            await until(async () => {try {return (await read()).place === mapping.entry.place;} catch(error) {if(error?.snapshotFailure)throw error;return false;}},'beside entry');
        }
        const replayStartClock=(await snapshot()).expansion.clock;
        const advanceReplayTo = target => evaluateWithSnapshots(target => {
            if (typeof window.advanceTicks!=='function') throw new Error('Paused tick stepper is unavailable.');
            window.simulationTestHooks.pause();
            const readSnapshot=()=>{try{return window.simulationTestHooks.snapshot();}catch(error){throw new Error(`REPLAY_SNAPSHOT_FAILURE: ${String(error)}`);}};
            let state=readSnapshot(),clock=state.expansion?.clock,stalled=0;
            if (!Number.isSafeInteger(target) || !Number.isSafeInteger(clock) || target<clock || target-clock>20000) throw new Error('Invalid or over-budget replay clock target.');
            for (let ticks=0;clock<target;ticks++) {
                if (ticks>=20000) throw new Error('Replay clock exceeded the tick budget.');
                window.advanceTicks(1);
                state=readSnapshot();
                const next=state.expansion?.clock;
                if (!Number.isSafeInteger(next) || next<clock || next>target) throw new Error('Replay clock did not land on the exact target minute.');
                stalled=next===clock ? stalled+1 : 0;
                if (stalled>=10) throw new Error('Replay clock is blocked.');
                clock=next;
            }
            return state;
        },target);
        const io = {
            read,beginStep:diagnostics.beginStep,
            waitBand:async (_,time) => {
                const start = (time.day-1)*1440+time.from;
                if (seat === 'be' && (await read()).elapsed < start) {
                    const buttons = panel.locator('button[data-lotm]');
                    for (const button of await buttons.all()) {
                        const label = (await button.innerText()).trim();
                        const minutes = /Wait until\b.*?·\s*(\d+)\s*min\b/i.exec(label)?.[1];
                        if (!minutes || !await button.isEnabled()) continue;
                        const arrival = (await read()).elapsed + Number(minutes);
                        if (arrival < start || arrival >= (time.day-1)*1440+time.to) continue;
                        await button.scrollIntoViewIfNeeded();
                        const controlId=await button.getAttribute('data-lotm');
                        await snapshot();
                        await button.click();
                        diagnostics.controlClicked(controlId);
                        if ((await read()).elapsed<arrival) throw new Error('Wait stopped before its quoted target.');
                        break;
                    }
                }
                const state=await snapshot();
                if ((await read()).elapsed<start) await advanceReplayTo((state.lotm || state.expansion?.lotm).initializedAt+start);
                assert.ok((await read()).elapsed<(time.day-1)*1440+time.to,'missed source time band');
            },
            move:async (_,leg,time) => {
                const result=await performReplayControl({snapshot,click,advanceTo:advanceReplayTo},leg);
                if (result) return result;
                if (leg.label) assert.ok((await panel.innerText()).includes(leg.label),'arrival must be shown in the real panel');
                if (time) assert.ok((await read()).elapsed<(time.day-1)*1440+time.to,'walk finished outside source band');
            },
            screenshot:async (_,name) => page.screenshot({path:path.join(out,`run${run}-${name}`)})
        };
        await page.screenshot({path:path.join(out,`run${run}-entry.png`)});
        const result = await executeRows(page,mapping.rows,io,{canonOnly:nullPlayer});
        assert.deepEqual(errors,[],'page errors belong to this run until proven otherwise');
        await page.evaluate(() => window.simulationTestHooks.pause());
        const finalSnapshot=await snapshot();
        const advanceTo = target => evaluateWithSnapshots(target => {
            if (typeof window.advanceTicks!=='function') throw new Error('Paused tick stepper is unavailable.');
            window.simulationTestHooks.pause();
            const readSnapshot=()=>{try{return window.simulationTestHooks.snapshot();}catch(error){throw new Error(`REPLAY_SNAPSHOT_FAILURE: ${String(error)}`);}};
            let state=readSnapshot(), clock=state.expansion?.clock;
            if (!Number.isSafeInteger(clock) || target-clock>1000) throw new Error('Clock cannot be aligned within the step budget.');
            for (let ticks=0;clock<target;ticks++) {
                if (ticks>=1000) throw new Error('Clock did not reach the target within the step budget.');
                window.advanceTicks(1);
                state=readSnapshot();
                const next=state.expansion?.clock;
                if (!Number.isSafeInteger(next) || next<clock || next>target) throw new Error('Tick stepper cannot reach the exact target minute.');
                clock=next;
            }
            return state;
        },target);
        retained=true;
        return {result:{...result,packLoadMs,replayStartClock,stateHash:stateHashWithoutNaturalClock(finalSnapshot),_snapshot:finalSnapshot,consoleMessages:diagnostics.data.consoleMessages,pageErrors:errors,firstSnapshotFailureAfter:diagnostics.data.firstSnapshotFailureAfter},advanceTo,close:()=>browser.close(),errors,collectDiagnostics,run};
    } catch(cause) {
        const captured=await collectDiagnostics();
        const error=cause instanceof Error ? cause : new Error(String(cause));
        fs.writeFileSync(path.join(out,`run${run}.json`),JSON.stringify({...captured.diagnostics,error:String(error),state:'UI proof incomplete'},null,2)+'\n');
        error.replayDiagnostics=captured;
        throw error;
    } finally {if (!retained) await browser.close();}
}
async function main() {
    const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,all) => v.startsWith('--') ? [...a,[v.slice(2),all[i+1]?.startsWith('--') ? true : all[i+1] || true]] : a,[]));
    const seat = args.seat || 'beside';
    assert.ok(['be','beside'].includes(seat),'--seat must be be or beside');
    for (const name of ['mapping','scenes','l4b-gaps','out']) assert.equal(typeof args[name],'string',`--${name} required`);
    const out = path.resolve(args.out), mapping = JSON.parse(fs.readFileSync(args.mapping));
    fs.mkdirSync(out,{recursive:true});
    if (mapping.inputHashes?.['scenes.jsonl']) assert.equal(hash(fs.readFileSync(args.scenes)),mapping.inputHashes['scenes.jsonl'],'scene inputs changed since mapping');
    const chapterRange = args.chapters ? String(args.chapters).split('-').map(Number) : null;
    if (chapterRange) assert.ok(chapterRange.length===2 && chapterRange.every(n=>Number.isSafeInteger(n)&&n>0) && chapterRange[0]<=chapterRange[1], '--chapters must be a-b');
    const locatorRange=args['locator-range'] === undefined ? null : parseReplayLocatorRange(args['locator-range']);
    const volume=args.volume === undefined ? (locatorRange ? null : 1) : Number(args.volume);
    assert.ok(volume===null || (typeof args.volume!=='boolean' && Number.isSafeInteger(volume)&&volume>0), '--volume must be a positive integer');
    const scenes=jsonl(args.scenes);
    const probe = validateMapping(mapping,scenes);
    const maxSteps=args['max-steps'] ? Number(args['max-steps']) : Infinity;
    assert.ok(maxSteps===Infinity || (Number.isInteger(maxSteps)&&maxSteps>0), '--max-steps must be a positive integer');
    const offset=args.offset ? Number(args.offset) : 0;
    assert.ok(Number.isInteger(offset)&&offset>=0, '--offset must be a non-negative integer');
    const replayRows = adaptReplayRows(mapping.rows,{chapters:chapterRange,volume,locatorRange,maxSteps,offset,scenes});
    assert.ok(replayRows.length, 'no rows selected for replay');
    const ledger = mergeGapLedger(replayRows,jsonl(args['l4b-gaps']));
    fs.writeFileSync(path.join(out,'combined_gaps.jsonl'),ledger.rows.map(r => JSON.stringify(r)).join('\n')+'\n');
    const kindOf=r=>r.routeMode==='wait'||r.method==='wait'?'wait':r.status==='gap'||r.status==='lossy_fold'?'gap':r.route?.some(x=>x.actionId?.startsWith('lotm.move.'))?'walk':r.route?.length?'control':'gap';
    const rowKinds = Object.fromEntries([...new Set(replayRows.map(kindOf))].sort().map(kind=>[kind,replayRows.filter(r=>kindOf(r)===kind).length]));
    const readyTimeoutMs = args['ready-timeout-ms'] === undefined ? DEFAULT_READY_TIMEOUT_MS : Number(args['ready-timeout-ms']);
    assert.ok((args['ready-timeout-ms'] === undefined || typeof args['ready-timeout-ms'] === 'string') && Number.isSafeInteger(readyTimeoutMs) && readyTimeoutMs>0, '--ready-timeout-ms must be a positive integer');
    const audit = {seat,probe,selectedSteps:replayRows.length,selection:{volume,chapters:chapterRange,locatorRange},offset,windowed:replayRows.filter(r=>r.time).length,orderOnly:replayRows.filter(r=>!r.time).length,rowKinds,score:scoreRows(replayRows).overall,combinedGapLayers:ledger.counts,inputHash:hash(fs.readFileSync(args.mapping)),readyTimeoutMs,packLoadMs:[],replayClock:{mode:'paused; explicit job and wait advancement',startClocks:[]},comparisonOmissions:COMPARISON_OMISSIONS,comparisonCanonicalization:'sorted keys; omit zero, false, null and empty object/array properties as in floor canonical',clockAlignment:{mode:'pending',excludedPaths:[]},replaySeed:seat==='be'?REPLAY_SEED:null};
    fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
    if (args['audit-only']) {console.log(JSON.stringify(audit)); return;}
    assert.equal(typeof args.build,'string','--build required for UI proof');
    const bundleHash = hash(fs.readFileSync(path.join(args.build,'dist/bundle.js')));
    const runs = [], sessions = [];
    try {
        for (const run of [1,2]) {
            const runMapping={...mapping,rows:replayRows};
            const recordPackLoad = (phase,ms) => {
                let entry = audit.packLoadMs.find(item=>item.run===run);
                if (!entry) { entry={run}; audit.packLoadMs.push(entry); }
                entry[phase]=ms;
                fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
            };
            const session = await browserRun(runMapping,args.build,out,run,seat,!!args['null-player'],readyTimeoutMs,recordPackLoad);
            sessions.push(session);
            const result=session.result; runs.push(result);
            audit.replayClock.startClocks.push(result.replayStartClock);
            fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
            fs.writeFileSync(path.join(out,`run${run}.json`),JSON.stringify(result,null,2)+'\n');
        }
        const alignment=await compareAtGameMinute(runs.map(run=>run._snapshot),(index,target)=>sessions[index].advanceTo(target));
        for (const session of sessions) {
            try {assert.deepEqual(session.errors,[],'page errors belong to this run until proven otherwise');}
            catch(error) {error.replayRun=session.run;throw error;}
        }
        audit.clockAlignment={mode:alignment.mode,runClocks:alignment.clocks,target:alignment.target,excludedPaths:alignment.exclusions,reason:alignment.reason};
        fs.writeFileSync(path.join(out,'audit.json'),JSON.stringify(audit,null,2)+'\n');
        for (let i=0;i<runs.length;i++) {
            runs[i]._snapshot=alignment.snapshots[i];
            runs[i].snapshotClock=alignment.clocks[i];
            runs[i].comparisonClock=alignment.snapshots[i].expansion?.clock ?? null;
            runs[i].stateHash=stateHashWithoutNaturalClock(alignment.snapshots[i],alignment.exclusions);
            fs.writeFileSync(path.join(out,`run${i+1}.json`),JSON.stringify(runs[i],null,2)+'\n');
        }
        const comparison=alignment.comparison;
        const differences=comparison.differingPaths;
        const reproducibility=scoreReproducibleReplay(runs[0].replayScore,runs[1].replayScore,comparison.identical);
        for (const run of runs) { delete run._snapshot; }
        const result = {...audit,bundleHash,score:runs[0].score,replayScore:runs[0].replayScore,reproducibility,stateHash:runs[0].stateHash,nullPlayer:!!args['null-player'],identical:comparison.identical,differingPaths:differences,pageErrors:[],state:'agent-verified, not human-reviewed',route:`fresh ${seat} life; visible clicks; paused engine and explicit game-time advancement; prior gaps remain unexecuted`};
        if (comparison.mismatch) fs.writeFileSync(path.join(out,'mismatch.json'),JSON.stringify(comparison.mismatch,null,2)+'\n');
        fs.writeFileSync(path.join(out,'proof.json'),JSON.stringify(result,null,2)+'\n');
        console.log(JSON.stringify(result));
    } catch (error) {
        const session=sessions.find(item=>item.run===error?.replayRun) || sessions.at(-1);
        const captured=error?.replayDiagnostics || (session ? await session.collectDiagnostics() : {});
        if (captured.diagnostics) {
            const failedSession=sessions.find(item=>item.run===captured.diagnostics.run);
            fs.writeFileSync(path.join(out,`run${captured.diagnostics.run}.json`),JSON.stringify({...failedSession?.result,...captured.diagnostics,error:String(error),state:'UI proof incomplete'},null,2)+'\n');
        }
        fs.writeFileSync(path.join(out,'blocked.json'),JSON.stringify(makeBlockedReceipt({bundleHash,completedRuns:runs.length,error,...captured}),null,2)+'\n');
        throw error;
    } finally {
        await Promise.allSettled(sessions.map(session=>session.close()));
        for (const session of sessions) {
            const file=path.join(out,`run${session.run}.json`);
            if (!fs.existsSync(file)) continue;
            const receipt=JSON.parse(fs.readFileSync(file));
            receipt.consoleMessages=session.result.consoleMessages;
            receipt.pageErrors=session.errors;
            fs.writeFileSync(file,JSON.stringify(receipt,null,2)+'\n');
        }
    }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => {console.error(e);process.exitCode=1;});
