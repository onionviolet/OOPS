// Development-only, read-only projections of public world definitions.
import {entityLibrary} from './entity-library.mjs';
import {execFile, execFileSync, spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {existsSync, readFileSync, openSync} from 'node:fs';
import {FLAGGED_PLACES} from '../../scripts/atlas/transfer_candidate.mjs';
import {dirname, join} from 'node:path';
import {promisify} from 'node:util';
import {implementation} from './implementation.mjs';
import {encodeSaveFile} from '../../src/save_files.js';
import {readLibrary} from './library-reading.mjs';
import {readSnapshot, buildSnapshot, latestProgress, latestBatchCollection, READERS} from './build.mjs';
import {readBatches, batchCommands} from './batch-status.mjs';
import {buildCodex, summary as codexSummary, pageRows as codexPage, readLedger as codexLedger, ledgerNames as codexNames, moveSlots} from './codex.mjs';
import {readCheats, summarize as cheatsSummary, pageCheats} from './cheats.mjs';
import {changesSince} from './changelog.mjs';
import {buildDraft, saveDraft, listDrafts} from './workbench.mjs';
import {readIdeas, summarize as ideasSummary, pageIdeas, pageBoards, rowDetail as ideaRow, familiesOf as ideaFamilies, residueOf as ideaResidue} from './ideas.mjs';
import {LOTM_DISTRICTS, districtCommands, lotmWalkRoute, LOTM_PLACE_KEYS} from '../../src/book_world_lotm_districts.js';
import {brewCommands} from '../../src/book_world_lotm_brew.js';
import {molCommands, molEncounters} from '../../src/book_world_mol_actions.js';
import {DEFAULT_DRAFT, DRAFT_FIELDS, compileDraft, exportAuthoredFile} from '../../src/authored_site.js';

import {householdAnimalView} from '../../src/absorb_p23/household/model.js';

const places = LOTM_DISTRICTS.flatMap(d => d.places.map(name => ({
    name, district:d.qlabel, team:d.q2team,
    actions:[...districtCommands,...brewCommands].filter(c => c.location === name && !c.id.startsWith('book.lotm.walk_'))
        .map(c => ({id:c.id, label:c.label, target:c.targetId, requires:c.requires})),
    routes:Object.keys(LOTM_PLACE_KEYS).filter(dest => dest !== name).map(dest => {
        const route = lotmWalkRoute(name,dest);
        return {dest, minutes:route.legs[0].minutes, id:'book.lotm.'+route.id};
    })
})));
const actors = new Map(LOTM_DISTRICTS.map(d => [d.officerId,d.officerLabel]));
const encounters = molEncounters.flatMap(e => molCommands.filter(c => c.encounterId === e.id).map(c => ({
    name:e.label, place:c.location, target:c.targetId, requires:c.requires,
    actions:molCommands.filter(a => a.actorId === c.targetId && a.location === c.location).map(a=>a.label),
    turns:e.turns.map(t => t.responses.map(r => r.label))
})));
// Explicit comparison fixtures. The text and storage totals come from the home and animal readers.
const observer={animalKnown:true,atHome:true,homeOwned:true,alive:true,controlled:true,homeId:'cottage'};
const target=['first meeting','after play','smoky hearth'].map((stage,i)=>householdAnimalView({
    homeId:'cottage',hearth:{smoke:i===2?1:0,fuelMinutes:0},
    animal:{metAt:0,ageMinutes:i?60:0,mood:i===2?'sheltering':'curious',bond:i?10:0,playVisits:i?1:0,playObject:'yarn',adopted:false}
},observer));
// Read collected batch receipts on each Atlas load. One shared build brings newly collected shards into the views.
let snap = (!process.env.ATLAS_REBUILD && readSnapshot()) || buildSnapshot();
let refresh, refreshError, attemptedCollection = 0;
const run = promisify(execFile);
const root = fileURLToPath(new URL('../../', import.meta.url));
const previewBooks = process.env.ATLAS_LOTM_CAST
    ? JSON.parse(execFileSync(process.execPath, [fileURLToPath(new URL('./cast-places.mjs', import.meta.url))], {encoding:'utf8', maxBuffer:64e6}))
    : null;
const currentBooks = () => previewBooks ?? snap.books;

function refreshAtlas() {
    if (!refresh) refresh = run(process.execPath, [fileURLToPath(new URL('./build.mjs', import.meta.url))], {cwd: root})
        .then(() => {snap = readSnapshot(); refreshError = null;})
        .catch(error => {refreshError = 'Atlas refresh failed. The previous snapshot is still available.'; throw error;})
        .finally(() => {refresh = null;});
    return refresh;
}
async function atlasData() {
    if (refresh) await refresh.catch(() => {});
    const reading = readLibrary();
    const batches = readBatches(reading.keys.map(k => k.key));
    const latestCollectedAt = latestBatchCollection(batches);
    const current = readSnapshot();
    if (current?.builtAt > snap.builtAt) snap = current;
    if (latestCollectedAt > Math.max(snap.latestCollectedAt ?? Date.parse(snap.builtAt), attemptedCollection)) {
        attemptedCollection = latestCollectedAt;
        await refreshAtlas().catch(() => {});
    }
    const {builtAt, commit, dirty, failures, findings, recipes, gameMaking, sources, mechanics, frontier, others} = snap;
    return {findings, recipes, gameMaking, transfer, snapshot:{builtAt, commit, dirty, failures}, sources, mechanics,
        progress: latestProgress(), batches, latestCollectedAt, refreshError, reading, readingRequests: loadRequests(),
        frontier, others, books:currentBooks(), library:entityLibrary(places,actors), target, places, actors:Object.fromEntries(actors),
        encounters, fields:DRAFT_FIELDS, draft:DEFAULT_DRAFT, implementation};
}
// Reading requests: the atlas's writeback for the library. Gitignored; nothing runs from it.
const requestFile=process.env.ATLAS_REQUESTS||fileURLToPath(new URL('../../work/atlas-reading-requests.json',import.meta.url));
const loadRequests=()=>existsSync(requestFile)?JSON.parse(readFileSync(requestFile,'utf8')).requests:[];
function readingRoute(world,aspect,reading){
    const keys=reading.keys.filter(k=>k.world===world);
    if(!keys.length||!reading.aspects.includes(aspect))throw Error('Unknown world or mechanic.');
    const names=keys.map(k=>k.key).join(',');
    if(!keys.some(k=>k.held))return {route:'acquire',next:'Check holdings, then the download wishlist (python3 -I scripts/wishlist_queue.py).'};
    if(!keys.every(k=>k.complete)){const open=keys.filter(k=>!k.complete).map(k=>k.key);return {route:'read',next:`Finish the five reading passes for ${open.join(',')}; paid runs need Weibao's yes.`,batch:batchCommands(open)};}
    return {route:'review',next:`node scripts/lead_run/reading_review.mjs --keys ${names} --topic ${aspect} --out work/reading-requests/${world}-${aspect}`};
}
// Placement picks: the atlas's writeback for places. Gitignored; transfer_candidate.mjs turns them into a candidate pack.
const picksFile=process.env.ATLAS_PICKS||root+'work/atlas-picks.json', transferDir=root+'work/atlas-transfer';
const loadPicks=()=>existsSync(picksFile)?JSON.parse(readFileSync(picksFile,'utf8')).picks:[];
const lotmPlaces = () => new Map((currentBooks().lotm?.places || []).map(p => [p.id, p]));
const transfer={districts:LOTM_DISTRICTS.map(d=>({id:d.id,label:d.label||d.qlabel||d.id})),flagged:FLAGGED_PLACES};
let running=null;
async function transferState(){
    const runs=[];
    if(existsSync(transferDir))for(const name of (await readdir(transferDir)).filter(n=>n.startsWith('atlas-')||n.startsWith('run-')).sort().reverse().slice(0,8)){
        const dir=transferDir+'/'+name,diffFile=dir+'/diff.json',exitFile=dir+'/exit.txt';
        const row={name,exit:existsSync(exitFile)?Number(readFileSync(exitFile,'utf8')):existsSync(diffFile)?0:null};
        if(existsSync(diffFile)){const d=JSON.parse(readFileSync(diffFile,'utf8')),pl=d.diff.places||{};
            row.diff={added:pl.added?.length||0,removed:pl.removed?.length||0,changed:pl.changed?.length||0,predicted:d.prediction?.predicted??null,lostKeys:d.lostKeys||[]};
            row.candidate='work/atlas-transfer/'+name+'/candidate-cast.json';
            row.adopt=`cp private_packs/lotm-cast/cast.json private_packs/lotm-cast/cast.json.bak-before-atlas-transfer\ncp ${row.candidate} private_packs/lotm-cast/cast.json`;}
        else if(existsSync(dir+'/run.log'))row.error=readFileSync(dir+'/run.log','utf8').trim().split('\n').slice(-3).join(' ');
        runs.push(row);
    }
    const byId = lotmPlaces();
    return {picks:loadPicks().map(p=>({...p,label:byId.get(p.place)?.name})),picksFile:picksFile.replace(root,''),running:!!running,runs};
}
const assets = {
    '/creature-record.js':['../../src/ui/creature_record.js','text/javascript'],
    '/kit.js':['../../src/ui/kit.js','text/javascript'],
    '/known_number.js':['../../src/ui/known_number.js','text/javascript'],
    '/number_format.js':['../../src/number_format.js','text/javascript'],
    '/semantic_ink.js':['../../src/ui/semantic_ink.js','text/javascript'],
    '/map-marks.js':['../../src/ui/map_marks.js','text/javascript'],
    '/styles/ui_tokens.css':['../../styles/ui_tokens.css','text/css'],
    '/styles/material_icons.css':['../../styles/material_icons.css','text/css'],
    '/resources/fonts/material-icons/material-icons.woff2':['../../resources/fonts/material-icons/material-icons.woff2','font/woff2'],
    '/resources/fonts/private/msgothic.ttc':['../../resources/fonts/private/msgothic.ttc','font/collection'],
    '/field-record.js':['../../src/ui/field_record.js','text/javascript'],
    '/field-record.css':['../../styles/field_record.css','text/css'],
    '/canvas.css':['./canvas.css','text/css'],
    '/canvas.mjs':['./canvas.mjs','text/javascript'],
    '/village-layout.mjs':['./village-layout.mjs','text/javascript'],
    '/creature-layout.mjs':['./creature-layout.mjs','text/javascript'],
    '/book-worlds.mjs':['./book-worlds.mjs','text/javascript'],
    '/other-places.mjs':['./other-places.mjs','text/javascript'],
    '/library-views.mjs':['./library-views.mjs','text/javascript'],
    '/atlas-views.mjs':['./atlas-views.mjs','text/javascript'],
    '/implementation-view.mjs':['./implementation-view.mjs','text/javascript'],
    '/transfer-view.mjs':['./transfer-view.mjs','text/javascript'],
    '/things-views.mjs':['./things-views.mjs','text/javascript'],
    '/codex-views.mjs':['./codex-views.mjs','text/javascript'],
    '/cheats-views.mjs':['./cheats-views.mjs','text/javascript'],
    '/ideas-views.mjs':['./ideas-views.mjs','text/javascript'],
    '/workbench-views.mjs':['./workbench-views.mjs','text/javascript'],
};
for (let size=7;size<=22;size++) {
    const path='resources/fonts/private/gothic-bitmap-'+size+'.woff2';
    assets['/'+path]=['../../'+path,'font/woff2'];
}
const server=createServer(async(req,res)=>{
    try{
        if(req.method==='GET' && Object.hasOwn(assets,req.url)){
            const [file,type]=assets[req.url];
            return res.writeHead(200,{'Content-Type':type}).end(await readFile(new URL(file,import.meta.url)));
        }
        if(req.method === 'GET' && req.url === '/data') {
            const data = await atlasData();
            return res.writeHead(200, {'Content-Type':'application/json', 'Cache-Control':'no-store'}).end(JSON.stringify(data));
        }
        if(req.method === 'POST' && req.url === '/refresh' && req.headers['content-type'] === 'application/json') {
            try {
                await refreshAtlas();
                return res.writeHead(204).end();
            } catch {
                return res.writeHead(500, {'Content-Type':'text/plain'}).end(refreshError);
            }
        }
        const workResource = /^\/implementation\/([a-z0-9-]+)\/(save|design|owner|proof)$/.exec(req.url);
        if(req.method === 'GET' && workResource) {
            const [, id, key] = workResource;
            const work = implementation.find(item => item.id === id);
            if (work && key === 'save') {
                const {scenarioSave} = await import('../../scripts/headless/scenarios.mjs');
                const save = await scenarioSave(work.id);
                return res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8',
                    'Content-Disposition':'attachment; filename="' + id + '.txt"'}).end(encodeSaveFile(save));
            }
            if (work?.references[key]) {
                const text = await readFile(join(root, work.references[key].path));
                return res.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'}).end(text);
            }
        }
        // Codex: /codex lists ledgers, /codex/<ledger> is its summary, /codex/<ledger>/rows pages its rows. Never in /data (C1).
        // WA24 (owned by scripts/check_passage.py): local-text check for one Gu row. JSON goes to the page only; match text is never written to tracked files.
        // WA23 (owned by scripts/gu_move_slots.py): recipe slots for one gu_moves row.
        if(req.method === 'GET' && /^\/codex\/gu_moves\/slots\?/.test(req.url)){
            const id = new URL(req.url,'http://x').searchParams.get('id') || '';
            const out = moveSlots(id);
            return res.writeHead(out ? 200 : 404,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(out || {error:'No slot evidence file.'}));
        }
        const passageUrl=/^\/codex\/(gu_kinds|gu_moves)\/check-passage\?/.exec(req.url);
        if(req.method === 'GET' && passageUrl){
            const id = new URL(req.url,'http://x').searchParams.get('id') || '';
            if(!/^[\w.:-]{1,160}$/.test(id))return res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Bad row id.'}));
            execFile('python3',['-I','scripts/check_passage.py','--ledger',passageUrl[1],'--id',id,'--json'],{cwd:root,timeout:30000,maxBuffer:16e6},(err,stdout,stderr)=>{
                if(err)return res.writeHead(502,{'Content-Type':'application/json'}).end(JSON.stringify({error:(stderr||err.message).split('\n').filter(Boolean).pop()||'check_passage failed'}));
                res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(stdout);
            });
            return;
        }
        // Workbench drafts (G4, contract at the top of workbench.mjs): preview, save (never overwrite) and list. Text is built here from the ledger row.
        const rowOf = (ledger, id) => codexNames().includes(ledger) ? codexLedger(ledger).rows.find(r => String(r.id) === id) ?? null : null;
        const draftUrl=/^\/codex\/([a-z0-9_]+)\/draft\?/.exec(req.url);
        if(req.method === 'GET' && draftUrl){
            const id = new URL(req.url,'http://x').searchParams.get('id') || '', row = rowOf(draftUrl[1], id);
            if(!row)return res.writeHead(404,{'Content-Type':'application/json'}).end(JSON.stringify({error:'No such row.'}));
            const codex = snap.codex?.canonical ? snap.codex : (snap.codex = buildCodex());
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(buildDraft(draftUrl[1],row,{canonical:codex.canonical})));
        }
        if(req.method === 'POST' && req.url === '/drafts'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>2000)throw Error('Request is too large.');}
            const {ledger,id}=JSON.parse(body), row = typeof ledger === 'string' && typeof id === 'string' ? rowOf(ledger, id) : null;
            if(!row)return res.writeHead(404,{'Content-Type':'application/json'}).end(JSON.stringify({error:'No such row.'}));
            const codex = snap.codex?.canonical ? snap.codex : (snap.codex = buildCodex());
            const out = saveDraft(buildDraft(ledger,row,{canonical:codex.canonical}));
            return res.writeHead(out.conflict ? 409 : 201,{'Content-Type':'application/json'}).end(JSON.stringify(out));
        }
        if(req.method === 'GET' && req.url === '/drafts')return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({drafts:listDrafts(rowOf)}));
        const codexUrl=/^\/codex(?:\/([a-z0-9_]+)(\/rows)?)?(?:\?.*)?$/.exec(req.url);
        if(req.method === 'GET' && codexUrl){
            const [, ledger, rows] = codexUrl, json = body => res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(body));
            const codex = snap.codex?.canonical ? snap.codex : (snap.codex = buildCodex()); // a snapshot built before nextAction lacks the canonical list
            if(!ledger)return json({ledgers:codex.ledgers.map(l=>({ledger:l.ledger,rows:l.rows,things:l.things,counts:l.counts}))});
            if(!codexNames().includes(ledger))return res.writeHead(404,{'Content-Type':'text/plain'}).end('No such ledger.');
            if(!rows)return json(codexSummary(codex,ledger));
            const q = new URL(req.url,'http://x').searchParams, entry = codexLedger(ledger);
            return json({...codexPage(ledger,entry.rows,{offset:q.get('offset'),limit:q.get('limit'),state:q.get('state'),q:q.get('q')}),hash:entry.hash});
        }
        // Cheats: /cheats is the summary, /cheats/rows pages catalogue rows (or `status=candidate` sweep rows). Never in /data (C1).
        const cheatsUrl=/^\/cheats(\/rows)?(?:\?.*)?$/.exec(req.url);
        if(req.method === 'GET' && cheatsUrl){
            const data = readCheats(), json = body => res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(body));
            if(!cheatsUrl[1])return json(cheatsSummary(data,{hash:data.hash,files:data.files}));
            const q = new URL(req.url,'http://x').searchParams;
            return json({...pageCheats(data,{offset:q.get('offset'),limit:q.get('limit'),q:q.get('q'),status:q.get('status'),world:q.get('world')}),hash:data.hash});
        }
        // Ideas: /ideas summary, /ideas/rows, /ideas/row, /ideas/families, /ideas/boards, /ideas/residue (contract at the top of ideas.mjs). Never in /data (C1).
        const ideasUrl=/^\/ideas(?:\/(rows|row|families|boards|residue))?(?:\?.*)?$/.exec(req.url);
        if(req.method === 'GET' && ideasUrl){
            const data = readIdeas(), q = new URL(req.url,'http://x').searchParams, json = body => res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(body));
            const miss = what => res.writeHead(404,{'Content-Type':'text/plain'}).end('No such '+what+'.');
            if(!ideasUrl[1])return json(ideasSummary(data,{hash:data.hash,files:data.files}));
            if(ideasUrl[1] === 'rows')return json({...pageIdeas(data,{offset:q.get('offset'),limit:q.get('limit'),q:q.get('q'),board:q.get('board'),family:q.get('family'),status:q.get('status'),kind:q.get('kind') || 'idea',links:q.get('links'),local:q.get('local')}),hash:data.hash});
            if(ideasUrl[1] === 'row'){const out = ideaRow(data,q.get('id') || ''); return out ? json(out) : miss('idea');}
            if(ideasUrl[1] === 'families')return json(ideaFamilies(data));
            if(ideasUrl[1] === 'boards')return json({...pageBoards(data,{offset:q.get('offset'),limit:q.get('limit'),q:q.get('q'),tier:q.get('tier')}),hash:data.hash});
            const out = ideaResidue(data,q.get('board') || ''); return out ? json(out) : miss('board');
        }
        // Changes: what moved in the atlas's inputs since the previous snapshot (or a given date or commit).
        const changesUrl=/^\/changes(?:\?.*)?$/.exec(req.url);
        if(req.method === 'GET' && changesUrl){
            const since = new URL(req.url,'http://x').searchParams.get('since');
            const body = JSON.stringify(changesSince(snap.changes,since)); // built first: a bad `since` must reach the 400 handler before headers are sent
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(body);
        }
        if(req.method === 'GET' && req.url === '/creatures')return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(new URL('../creature-desk/index.html',import.meta.url)));
        if(req.method === 'GET' && req.url === '/')return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(new URL('./index.html',import.meta.url)));
        if(req.method === 'POST' && req.url === '/reading-request'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>2000)throw Error('Request is too large.');}
            const {world,aspect}=JSON.parse(body);
            const reading = readLibrary();
            const requests=loadRequests();
            if(!requests.some(r=>r.world===world&&r.aspect===aspect))requests.push({world,aspect,keys:reading.keys.filter(k=>k.world===world).map(k=>k.key),...readingRoute(world,aspect,reading),requestedAt:new Date().toISOString()});
            await mkdir(dirname(requestFile),{recursive:true});
            await writeFile(requestFile,JSON.stringify({note:'Atlas reading requests. Proposals only; nothing runs from this file.',requests},null,1)+'\n');
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(requests));
        }
        // One reader digest per world, fetched when a Things or Making view opens (LOTM's is several MB).
        const reader=/^\/readers\/([a-z0-9-]+)$/.exec(req.url);
        if(req.method === 'GET' && reader){
            if (refresh) await refresh.catch(() => {});
            const file=READERS+'/'+reader[1]+'.json';
            if(!existsSync(file))return res.writeHead(404,{'Content-Type':'text/plain'}).end('No reader digest for this world. Run node prototypes/world-atlas/build.mjs.');
            return res.writeHead(200,{'Content-Type':'application/json'}).end(await readFile(file));
        }
        if(req.method === 'GET' && req.url === '/transfer')return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(await transferState()));
        if(req.method === 'POST' && req.url === '/pick'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>2000)throw Error('Request is too large.');}
            const {place,district}=JSON.parse(body);
            if(!lotmPlaces().has(place))throw Error('Unknown place.');
            if(FLAGGED_PLACES[place])throw Error('Not offered: '+FLAGGED_PLACES[place]);
            if(district!=null&&!transfer.districts.some(d=>d.id===district))throw Error('Unknown district.');
            const picks=loadPicks().filter(p=>p.place!==place);
            if(district)picks.push({place,district,pickedAt:new Date().toISOString()});
            await mkdir(dirname(picksFile),{recursive:true});
            await writeFile(picksFile,JSON.stringify({note:'Atlas placement picks. Proposals only; transfer_candidate.mjs builds a candidate from them, and the live pack changes only with Weibao\'s yes.',picks},null,1)+'\n');
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({picks}));
        }
        if(req.method === 'POST' && req.url === '/transfer'){
            if(running)throw Error('A candidate build is already running.');
            if(!existsSync(picksFile))throw Error('No picks yet.');
            const out=transferDir+'/atlas-'+new Date().toISOString().replace(/[:.]/g,'-');
            await mkdir(out,{recursive:true});
            const log=openSync(out+'/run.log','w');
            running=spawn(process.execPath,[root+'scripts/atlas/transfer_candidate.mjs','--world','lotm','--picks',picksFile,'--out',out],{cwd:root,stdio:['ignore',log,log]});
            running.on('exit',code=>{writeFile(out+'/exit.txt',String(code??1));running=null;});
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({out:out.replace(root,'')}));
        }
        if(req.method === 'POST' && req.url === '/export'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>16000)throw Error('Draft is too large.');}
            const draft=JSON.parse(body);compileDraft(draft);
            return res.writeHead(200,{'Content-Type':'application/json'}).end(exportAuthoredFile(draft));
        }
        res.writeHead(404).end();
    }catch(e){res.writeHead(400,{'Content-Type':'text/plain'}).end(e.message);}
});
if (import.meta.main) server.listen(Number(process.env.ATLAS_PORT || 4178),'127.0.0.1',()=>console.log('Atlas listening on http://127.0.0.1:'+server.address().port));
