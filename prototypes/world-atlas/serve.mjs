// Development-only, read-only projections of public world definitions.
import {entityLibrary} from './entity-library.mjs';
import {execFileSync, spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {existsSync, readFileSync, openSync} from 'node:fs';
import {FLAGGED_PLACES} from '../../scripts/atlas/transfer_candidate.mjs';
import {dirname} from 'node:path';
import {readLibrary, registeredBooks} from './library-reading.mjs';
import {readBatchOutputs} from './batch-output-index.mjs';
import {boundedCache} from './bounded-cache.mjs';
import {recordHandoffQuery,handoffsForRecord} from './record-handoffs.mjs';
import {readMeasuredReadiness,readReadinessFollowups} from './reading-readiness.mjs';
import {savedReadingSurvey} from './reading-survey.mjs';
import {loadWorldRules,queryWorldRules} from './world-rules.mjs';
import {loadCheatCatalogue} from './cheat-catalogue.mjs';
import {readFindSubjects,buildFindIndex,searchAtlas,findWorldChoices} from './atlas-find.mjs';
import {loadNativePlayEvidence,loadNativePlayRecord,loadPaidInnEvidence,loadBreakfastEvidence} from './atlas-native-evidence.mjs';
import {campaignSequencing} from './campaign-sequencing.mjs';
import {CAMPAIGN_TRACKS} from './campaign-sequencing-tracks.mjs';
import {SNAPSHOT as readinessSnapshot} from './build.mjs';
import {createHash as travelHash} from 'node:crypto';
import {selectRegisteredTravel} from './registered-travel.mjs';
const travelFile=dirname(readinessSnapshot)+'/registered-travel.json';
let travelLeaf=null;
try{if(existsSync(travelFile))travelLeaf=JSON.parse(readFileSync(travelFile,'utf8'));}catch{}
import {readIdeaOwners} from './idea-owners.mjs';
import {readOwnerIdeas} from './owner-ideas.mjs';
import {searchOwnerIdeas} from './owner-idea-search.mjs';
import {saveIdeaHandoff} from './idea-handoffs.mjs';
import {readingReferenceBundle} from './reading-reference-bundle.mjs';
import {prepareHandoff, saveHandoff, readHandoffs, attachImplementationReport, attachNativePlaytest, compareNativePlaytest, compareQueuePlaytests, attachProposalQualification} from './reading-handoffs.mjs';
import {readSnapshot, buildSnapshot, latestProgress, READERS} from './build.mjs';
import {gameMaking as readGameMaking} from './game-making.mjs';
import {readBatches, batchCommands} from './batch-status.mjs';
import {LOTM_DISTRICTS, districtCommands, lotmWalkRoute, LOTM_PLACE_KEYS} from '../../src/book_world_lotm_districts.js';
import {brewCommands} from '../../src/book_world_lotm_brew.js';
import {defineActs} from '../../src/book_world_lotm_acts_host.js';
import {charmMaterialActs} from '../../src/lotm_charm_materials.js';
import {tingenSilverWorkshop} from '../../src/lotm_amulet_crafting.js';
import {projectOfficeMaterialActivities,projectHpLibraryActivities,handoffsForActivityReceipt} from './place-activities.mjs';
import {HP_LIBRARY_COMMANDS} from '../../src/hp_library_work.js';
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
const actionsBy = (commands, field) => Object.fromEntries([...Map.groupBy(commands.filter(c => c[field] &&
    !/(?:^|[._-])(?:walk|travel|move)(?:[._-]|$)/.test(c.id)), c => c[field])].map(([id, rows]) => [id,
    rows.map(c => ({id:c.id, label:c.label}))]));
const commandsByWorld = {lotm:[...districtCommands,...brewCommands,...defineActs().commands], mol:molCommands,hp:HP_LIBRARY_COMMANDS};
const placeActions = Object.fromEntries(Object.entries(commandsByWorld).map(([world, rows]) => [world, actionsBy(rows, 'location')]));
const placeActivities={lotm:projectOfficeMaterialActivities(commandsByWorld.lotm,charmMaterialActs(tingenSilverWorkshop).rows,{worldId:'book.lotm.tingen'}),
    hp:projectHpLibraryActivities(HP_LIBRARY_COMMANDS,{worldId:'book.hp.lead.world'})};
const personActions = Object.fromEntries(Object.entries(commandsByWorld).map(([world, rows]) => [world, actionsBy(rows, 'targetId')]));
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
// The batch build (build.mjs) writes one snapshot; the server reads it, or builds one when it is missing or ATLAS_REBUILD=1.
const cachedSnap=!process.env.ATLAS_REBUILD&&readSnapshot();
const snap=cachedSnap||buildSnapshot();
const registeredTravel=selectRegisteredTravel(snap,travelLeaf,cachedSnap&&existsSync(readinessSnapshot)?travelHash('sha256').update(readFileSync(readinessSnapshot)).digest('hex'):null);
// ATLAS_LOTM_CAST previews a scratch pack, so the cast projection reruns instead of coming from the snapshot.
const books=process.env.ATLAS_LOTM_CAST?JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./cast-places.mjs',import.meta.url))],{encoding:'utf8',maxBuffer:64e6})):snap.books;
const {frontier,others,sources,mechanics,findings,recipes}=snap;
const gameMaking=snap.gameMaking?.worlds?.lotm?.slumber ? snap.gameMaking : readGameMaking();
const progress=latestProgress(); // read live: a new /progress-atlas file shows without a rebuild
const registered=registeredBooks();
const reading=readLibrary(registered);
const outputByBook=boundedCache();
const batches=readBatches(reading.keys.map(k=>k.key));
// Reading requests: the atlas's writeback for the library. Gitignored; nothing runs from it.
const requestFile=process.env.ATLAS_REQUESTS||fileURLToPath(new URL('../../work/atlas-reading-requests.json',import.meta.url));
const loadRequests=()=>existsSync(requestFile)?JSON.parse(readFileSync(requestFile,'utf8')).requests:[];
function readingRoute(world,aspect){
    const keys=reading.keys.filter(k=>k.world===world);
    if(!keys.length||!reading.aspects.includes(aspect))throw Error('Unknown world or mechanic.');
    const names=keys.map(k=>k.key).join(',');
    if(keys.some(k=>k.observedOutputFiles)&&!keys.some(k=>k.shards))return {route:'inspect',next:'Inspect the available batch outputs. Prepared chapter ranges and source availability remain separate; no new reading is inferred.'};
    if(!keys.some(k=>k.held))return {route:'acquire',next:'Check holdings, then the download wishlist (python3 -I scripts/wishlist_queue.py).'};
    if(!keys.every(k=>k.complete)){const open=keys.filter(k=>!k.complete).map(k=>k.key);return {route:'read',next:`Finish the five reading passes for ${open.join(',')}; paid runs need Weibao's yes.`,batch:batchCommands(open)};}
    return {route:'review',next:`node scripts/lead_run/reading_review.mjs --keys ${names} --topic ${aspect} --out work/reading-requests/${world}-${aspect}`};
}
// Placement picks: the atlas's writeback for places. Gitignored; transfer_candidate.mjs turns them into a candidate pack.
const root=fileURLToPath(new URL('../../',import.meta.url));
let worldRuleCatalogue;
let atlasFindIndex;
function findIndex() {
    if(atlasFindIndex)return atlasFindIndex;
    atlasFindIndex=(async()=>{
        worldRuleCatalogue??=loadWorldRules(root);
        const subjects=await readFindSubjects({readers:READERS,library:api.library,books});
        const cheats=await loadCheatCatalogue(root);
        // One bounded public evidence check per lazy Find index, not per query.
        let playEvidence;
        try{playEvidence=await loadNativePlayEvidence(root);}catch{}
        const index=buildFindIndex({subjects:subjects.rows,rules:worldRuleCatalogue,cheats,playEvidence});
        return {
            ...index,
            sourceScope:{readerFiles:subjects.files,unreadableReaderFiles:subjects.unreadable,playableRoutesUnavailable:!playEvidence},
        };
    })().catch(error=>{
        atlasFindIndex=null;
        throw error;
    });
    return atlasFindIndex;
}
const handoffDirectory = process.env.ATLAS_HANDOFFS || root+'work/atlas-reading-handoffs';
async function outputPage(key, prefix, pass, kind, offset, explain = false, mentions = false, mentionOffset = 0) {
    const book = registered.find(row => row.key === key);
    if (!book) return null;
    const file = READERS + '/' + book.world + '.json';
    const digest = existsSync(file) ? JSON.parse(await readFile(file,'utf8')) : null;
    const {readOutputRecords} = await import('./output-records.mjs');
    return readOutputRecords(book,{prefix,pass,kind,offset,explain,mentions,mentionOffset},{registry:registered,digest});
}
const picksFile=process.env.ATLAS_PICKS||root+'work/atlas-picks.json', transferDir=root+'work/atlas-transfer';
const loadPicks=()=>existsSync(picksFile)?JSON.parse(readFileSync(picksFile,'utf8')).picks:[];
const lotmPlaces=new Map((books.lotm?.places||[]).map(p=>[p.id,p]));
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
    return {picks:loadPicks().map(p=>({...p,label:lotmPlaces.get(p.place)?.name})),picksFile:picksFile.replace(root,''),running:!!running,runs};
}
const hasAsset = file => existsSync(new URL(file, import.meta.url));
const mapMarksAvailable = hasAsset('../../src/ui/map_marks.js');
const creatureRecordAvailable = ['../../src/ui/creature_record.js', '../../src/ui/field_record.js', '../../styles/field_record.css'].every(hasAsset);
export const api = {registeredTravel,findings,recipes,gameMaking,transfer,snapshot:{builtAt:snap.builtAt,commit:snap.commit,failures:snap.failures},sources,mechanics,progress,batches,reading,readingRequests:loadRequests(),frontier,others,books,library:entityLibrary(places,actors),target,places,placeActions,placeActivities,personActions, actors:Object.fromEntries(actors), encounters, fields:DRAFT_FIELDS, draft:DEFAULT_DRAFT,mapMarksAvailable,creatureRecordAvailable};
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
    '/atlas-type.css':['./atlas-type.css','text/css'],
    '/canvas.mjs':['./canvas.mjs','text/javascript'],
    '/village-layout.mjs':['./village-layout.mjs','text/javascript'],
    '/creature-layout.mjs':['./creature-layout.mjs','text/javascript'],
    '/book-worlds.mjs':['./book-worlds.mjs','text/javascript'],
    '/other-places.mjs':['./other-places.mjs','text/javascript'],
    '/library-views.mjs':['./library-views.mjs','text/javascript'],
    '/tracked-readings.mjs':['./tracked-readings.mjs','text/javascript'],
    '/reading-output-view.mjs':['./reading-output-view.mjs','text/javascript'],
    '/reading-reference-bundle.mjs':['./reading-reference-bundle.mjs','text/javascript'],
    '/reading-handoffs-view.mjs':['./reading-handoffs-view.mjs','text/javascript'],
    '/handoff-route-export.mjs':['./handoff-route-export.mjs','text/javascript'],
    '/record-handoffs-view.mjs':['./record-handoffs-view.mjs','text/javascript'],
    '/reading-readiness-view.mjs':['./reading-readiness-view.mjs','text/javascript'],
    '/reading-survey-view.mjs':['./reading-survey-view.mjs','text/javascript'],
    '/campaign-sequencing-view.mjs':['./campaign-sequencing-view.mjs','text/javascript'],
    '/world-rules-view.mjs':['./world-rules-view.mjs','text/javascript'],
    '/cheat-catalogue-view.mjs':['./cheat-catalogue-view.mjs','text/javascript'],
    '/cheat-catalogue.css':['./cheat-catalogue.css','text/css'],
    '/cheat-proof/CTC21':['../../docs/representations/evidence/cheat-starting-insight-normal-2026-11-25/proof.json','application/json'],
    '/cheat-proof/CTC64':['../../docs/representations/evidence/cheat-loaded-dice-normal-2026-11-25/proof.json','application/json'],
    '/atlas-find-view.mjs':['./atlas-find-view.mjs','text/javascript'],
    '/world-entry-inventory.mjs':['./world-entry-inventory.mjs','text/javascript'],
    '/atlas-native-evidence-view.mjs':['./atlas-native-evidence-view.mjs','text/javascript'],
    '/paid-inn-evidence-view.mjs':['./paid-inn-evidence-view.mjs','text/javascript'],
    '/breakfast-evidence-view.mjs':['./breakfast-evidence-view.mjs','text/javascript'],
    '/cheat-catalogue-source':['../../docs/CHEAT_CATALOGUE.md','text/plain; charset=utf-8'],
    '/registered-travel.mjs':['./registered-travel.mjs','text/javascript'],
    '/bounded-cache.mjs':['./bounded-cache.mjs','text/javascript'],
    '/idea-owners-view.mjs':['./idea-owners-view.mjs','text/javascript'],
    '/card-world-trial.mjs':['./card-world-trial.mjs','text/javascript'],
    '/idea-owner-references.mjs':['./idea-owner-references.mjs','text/javascript'],
    '/cited-reference-contract.mjs':['./cited-reference-contract.mjs','text/javascript'],
    '/place-activities.mjs':['./place-activities.mjs','text/javascript'],
    '/activity-evidence/lotm-materials':['../../docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_CHARM_MATERIAL_HANDOFF_2026-11-25.md','text/plain; charset=utf-8'],
    '/activity-evidence/hp-library':['../../docs/gm/dispatch/play-surface-2026-11-14/HARRY_LIBRARY_WORK_2026-11-25.md','text/plain; charset=utf-8'],
    '/tracked-reading-evidence/hp':['../../docs/worlds/harry-potter/SOURCE_LEDGER.md','text/plain; charset=utf-8'],
    '/tracked-reading-evidence/ri':['../../docs/gm/dispatch/cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md','text/plain; charset=utf-8'],
    '/tracked-reading-evidence/mol':['../../docs/worlds/mother-of-learning/LIGHT_FORMULA_CORRECTION_2026-11-25.md','text/plain; charset=utf-8'],
    '/atlas-views.mjs':['./atlas-views.mjs','text/javascript'],
    '/transfer-view.mjs':['./transfer-view.mjs','text/javascript'],
    '/things-views.mjs':['./things-views.mjs','text/javascript'],
    '/people-detail-views.mjs':['./people-detail-views.mjs','text/javascript'],
    '/place-details-view.mjs':['./place-details-view.mjs','text/javascript'],
    '/texture-life.mjs':['./texture-life.mjs','text/javascript'],
    '/census-details-view.mjs':['./census-details-view.mjs','text/javascript'],
};
for (let size=7;size<=22;size++) {
    const path='resources/fonts/private/gothic-bitmap-'+size+'.woff2';
    assets['/'+path]=['../../'+path,'font/woff2'];
}
const server=createServer(async(req,res)=>{
    try{
        if(req.method==='GET' && Object.hasOwn(assets,req.url)){
            const [file,type]=assets[req.url];
            const body=await readFile(new URL(file,import.meta.url));
            return res.writeHead(200,{'Content-Type':type}).end(body);
        }
        if(req.method === 'GET' && req.url === '/data')return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(api));
        if(req.method==='GET'&&req.url==='/cheat-catalogue')return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(await loadCheatCatalogue(root)));
        if(req.method==='GET'&&['/native-play-record/taylor','/native-play-record/alden','/native-play-record/ryan','/native-play-record/fang'].includes(req.url)){
            const record=await loadNativePlayRecord(fileURLToPath(new URL('../..',import.meta.url)),req.url);
            return res.writeHead(record?200:404,{'Content-Type':'application/json; charset=utf-8'}).end(JSON.stringify(record));
        }
        if(req.method==='GET'&&req.url==='/native-breakfast-evidence'){
            return res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(await loadBreakfastEvidence(root)));
        }
        if(req.method==='GET'&&req.url==='/native-paid-inn-evidence'){
            return res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}).end(JSON.stringify(await loadPaidInnEvidence(root)));
        }
        if(req.method==='GET'&&req.url==='/native-play-evidence'){
            const report=await loadNativePlayEvidence(root);
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(report));
        }
        if(req.method==='GET'&&(req.url==='/atlas-find'||req.url.startsWith('/atlas-find?'))){
            const p=new URL(req.url,'http://localhost').searchParams;
            try{const request={q:p.get('q')||'',type:p.get('type')||'all',world:p.get('world')||'',page:Number(p.get('page')||1)};
                // Validate before any corpus work, and keep an empty Find cheap.
                searchAtlas({rows:[],worlds:[]},request);
                let index;
                if(request.q.trim())index=await findIndex();
                else {
                    worldRuleCatalogue??=loadWorldRules(root);
                    const choices=new Map(worldRuleCatalogue.worlds.map(world=>[world.id,world]));
                    for(const world of findings?.worlds||[])if(!choices.has(world.world))choices.set(world.world,{id:world.world,label:world.world});
                    for(const world of Object.keys(books))if(!choices.has(world))choices.set(world,{id:world,label:world});
                    index={rows:[],worlds:findWorldChoices([...choices.values()]).sort((a,b)=>a.label.localeCompare(b.label))};
                }
                return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({...searchAtlas(index,request),sourceScope:index.sourceScope}));
            }catch{return res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Invalid or unavailable Atlas Find query.'}));}
        }
        if(req.method==='GET'&&(req.url.startsWith('/world-rules?')||req.url==='/world-rules'||req.url.startsWith('/world-rule-evidence?'))){
            const query=new URL(req.url,'http://localhost').searchParams;
            worldRuleCatalogue??=loadWorldRules(root);
            try{const page=queryWorldRules(worldRuleCatalogue,{world:query.get('world')||'',q:query.get('q')||'',kind:query.get('kind')||'',record:query.get('record')||'',offset:Number(query.get('offset')||0),limit:Number(query.get('limit')||40)});
                if(req.url.startsWith('/world-rule-evidence?'))return res.writeHead(page.records.length===1?200:404,{'Content-Type':'application/json'}).end(JSON.stringify(page.records.length===1?page.records[0]:{error:'Unknown public rule.'},null,2));
                return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(page));
            }catch{return res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Invalid rules query.'}));}
        }
        if(req.method === 'GET' && req.url === '/idea-owners'){
            const handoffs=await readHandoffs(handoffDirectory).catch(()=>({entries:[]}));
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(readIdeaOwners(root,handoffs.entries)));
        }
        if(req.method==='GET'&&(req.url==='/idea-owner-ideas'||req.url.startsWith('/idea-owner-ideas?'))){
            const url=new URL(req.url,'http://localhost');
            try{const page=readOwnerIdeas(root,url.searchParams.get('owner'),{idea:url.searchParams.get('idea')});return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(page));}
            catch(error){return res.writeHead(error.status||400,{'Content-Type':'text/plain'}).end(error.message);}
        }
        if(req.method==='GET'&&(req.url==='/idea-owner-search'||req.url.startsWith('/idea-owner-search?'))){
            const url=new URL(req.url,'http://localhost');
            try{const result=searchOwnerIdeas(root,url.searchParams.get('q'),{offset:Number(url.searchParams.get('offset')||0),limit:Number(url.searchParams.get('limit')||25),kind:url.searchParams.get('kind')??''});return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result));}
            catch(error){return res.writeHead(error.status||400,{'Content-Type':'text/plain'}).end(error.message);}
        }
        if(req.method==='POST'&&req.url==='/idea-handoffs'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>12000)throw Error('Request is too large.');}
            try{
                const result=await saveIdeaHandoff(handoffDirectory,root,JSON.parse(body));
                return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result));
            }catch(error){return res.writeHead(error.status||400,{'Content-Type':'text/plain'}).end(error.message);}
        }
        if (req.method === 'GET' && req.url.startsWith('/record-handoffs?')) {
            const params=new URL(req.url,'http://localhost').searchParams;
            const target=recordHandoffQuery(Object.fromEntries(['world','view','focus','type'].map(key=>[key,params.get(key)])));
            if(!registered.some(book=>book.world===target.world))return res.writeHead(404).end('Unknown world.');
            const queue=await readHandoffs(handoffDirectory,{root});
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({
                entries:handoffsForRecord(queue.entries,target),unreadable:(queue.unreadable||0)+(queue.unreadableReports||0)+(queue.unreadablePlaytests||0)}));
        }
        if (req.method === 'GET' && req.url.startsWith('/activity-handoffs?')) {
            const query = new URL(req.url,'http://localhost').searchParams;
            const world = query.get('world');
            const activity = Object.hasOwn(placeActivities,world) &&
                placeActivities[world].find(row=>row.id===query.get('activity'));
            if (!activity) return res.writeHead(404).end('Unknown native activity.');
            const queue = await readHandoffs(handoffDirectory);
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({
                entries:handoffsForActivityReceipt(queue.entries,activity.verification.receipt),
                unreadable:(queue.unreadable||0)+(queue.unreadableReports||0),
            }));
        }
        if (req.method === 'GET' && req.url.startsWith('/reading-handoff-links/')) {
            const [book,prefix,pass,kind] = req.url.slice('/reading-handoff-links/'.length).split('/').map(decodeURIComponent);
            const queue = await readHandoffs(handoffDirectory);
            const entries = queue.entries.filter(entry => entry.source.book === book && entry.source.prefix === prefix &&
                entry.source.pass === pass && entry.source.kind === kind).map(entry => ({
                    id:entry.id, route:entry.record.route, fileLines:entry.source.fileLines, contentHash:entry.source.contentHash,
                    reported:Boolean(entry.implementationReports?.length),
                }));
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(entries));
        }
        if (req.url === '/reading-handoffs/build-check' && req.method === 'GET') {
            const comparison = await compareQueuePlaytests(handoffDirectory,root);
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(comparison));
        }
        if (req.url === '/reading-handoffs' && req.method === 'GET') {
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(await readHandoffs(handoffDirectory,{root})));
        }
        if (req.url === '/reading-survey' && req.method === 'GET') {
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(savedReadingSurvey(registered,readinessSnapshot)));
        }
        if (req.url?.startsWith('/reading-readiness-followups?') && req.method === 'GET') {
            const query=new URL(req.url,'http://localhost').searchParams,world=query.get('world');
            if(!registered.some(book=>book.world===world))return res.writeHead(404).end();
            try{const page=readReadinessFollowups({world,registry:registered,snapshot:readinessSnapshot,digestFile:READERS+'/'+world+'.json'},
                {reason:query.get('reason')??'unindexed',offset:Number(query.get('offset')??0),limit:Number(query.get('limit')??25)});
                return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(page));
            }catch{return res.writeHead(400,{'Content-Type':'application/json'}).end(JSON.stringify({error:'Invalid follow-up query.'}));}
        }
        if (req.url?.startsWith('/reading-readiness?') && req.method === 'GET') {
            const world=new URL(req.url,'http://localhost').searchParams.get('world');
            if(!registered.some(book=>book.world===world))return res.writeHead(404).end();
            const summary=readMeasuredReadiness({world,registry:registered,snapshot:readinessSnapshot,digestFile:READERS+'/'+world+'.json'});
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(summary));
        }
        if (req.url?.startsWith('/campaign-sequencing?') && req.method === 'GET') {
            const world=new URL(req.url,'http://localhost').searchParams.get('world'),track=CAMPAIGN_TRACKS.find(row=>row.world===world);
            if(!track)return res.writeHead(404).end();
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(campaignSequencing(track,{root,readers:READERS,snapshot:snap})));
        }
        const qualificationRoute = /^\/reading-handoffs\/([a-f0-9]{64})\/qualifications$/.exec(req.url);
        if (qualificationRoute && req.method === 'POST') {
            if (req.headers['content-type']?.split(';')[0] !== 'application/json' ||
                (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host)) return res.writeHead(403).end();
            req.setEncoding('utf8');let body='';
            for await (const chunk of req) {body+=chunk;if(body.length>4096)return res.writeHead(413).end();}
            const result=await attachProposalQualification(handoffDirectory,root,qualificationRoute[1],JSON.parse(body));
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result));
        }
        const playtestRoute = /^\/reading-handoffs\/([a-f0-9]{64})\/implementation-reports\/([a-f0-9]{64})\/playtests$/.exec(req.url);
        if (playtestRoute && req.method === 'POST') {
            if (req.headers['content-type']?.split(';')[0] !== 'application/json' ||
                (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host)) return res.writeHead(403).end();
            req.setEncoding('utf8'); let body = '';
            for await (const chunk of req) {body += chunk; if (body.length > 4096) return res.writeHead(413).end();}
            const result = await attachNativePlaytest(handoffDirectory,root,playtestRoute[1],playtestRoute[2],JSON.parse(body));
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result));
        }
        const buildCheck = /^\/reading-handoffs\/([a-f0-9]{64})\/implementation-reports\/([a-f0-9]{64})\/playtests\/([a-f0-9]{64})\/build-check$/.exec(req.url);
        if (buildCheck && req.method === 'GET') {
            const result = await compareNativePlaytest(handoffDirectory,root,buildCheck[1],buildCheck[2],buildCheck[3]);
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result));
        }
        const implementationRoute = /^\/reading-handoffs\/([a-f0-9]{64})\/implementation-reports$/.exec(req.url);
        if (implementationRoute && req.method === 'POST') {
            if (req.headers['content-type']?.split(';')[0] !== 'application/json' ||
                (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host)) return res.writeHead(403).end();
            req.setEncoding('utf8');
            let body = '';
            for await (const chunk of req) {body += chunk; if (body.length > 10000) return res.writeHead(413).end();}
            const result = await attachImplementationReport(handoffDirectory,root,implementationRoute[1],JSON.parse(body));
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result));
        }
        if (req.url === '/reading-handoffs' && req.method === 'POST') {
            if (req.headers['content-type']?.split(';')[0] !== 'application/json' ||
                (req.headers.origin && req.headers.origin !== 'http://' + req.headers.host)) return res.writeHead(403).end();
            req.setEncoding('utf8');
            let body = '';
            for await (const chunk of req) {body += chunk; if (body.length > 10000) return res.writeHead(413).end();}
            const request = JSON.parse(body);
            const page = await outputPage(request.book,request.prefix,request.pass,request.kind,request.offset);
            const packet = prepareHandoff(request, page);
            const id = await saveHandoff(handoffDirectory,packet);
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify({id}));
        }
        if(req.method === 'GET' && req.url.startsWith('/reading-output-records/')){
            const url = new URL(req.url, 'http://localhost');
            const [key,prefix,pass,kind] = url.pathname.slice('/reading-output-records/'.length).split('/').map(decodeURIComponent);
            const page = await outputPage(key,prefix,pass,kind,Number(url.searchParams.get('offset')||0),url.searchParams.get('explain') === '1',
                url.searchParams.get('mentions') === '1',Number(url.searchParams.get('mentionOffset')||0));
            if (!page) return res.writeHead(404).end('Unknown reading key');
            const result = url.searchParams.get('format') === 'references' ? readingReferenceBundle(page,snap) : page;
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(result));
        }
        if(req.method === 'GET' && req.url.startsWith('/reading-chapter-coverage/')){
            const url = new URL(req.url, 'http://localhost');
            const [key,prefix] = url.pathname.slice('/reading-chapter-coverage/'.length).split('/').map(decodeURIComponent);
            const book = registered.find(row=>row.key===key);
            if(!book)return res.writeHead(404).end('Unknown reading key');
            const file = READERS + '/' + book.world + '.json';
            const digest = existsSync(file) ? JSON.parse(await readFile(file,'utf8')) : null;
            const {readChapterCoverage} = await import('./chapter-coverage.mjs');
            const coverage = readChapterCoverage(book,prefix,{registry:registered,digest,complete:url.searchParams.get('complete')==='1'});
            if(!coverage)return res.writeHead(400).end('Invalid chapter range');
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(coverage));
        }
        if(req.method === 'GET' && req.url.startsWith('/reading-outputs/')){
            const url = new URL(req.url,'http://localhost');
            const book=registered.find(b=>encodeURIComponent(b.key)===url.pathname.slice('/reading-outputs/'.length));
            if(!book)return res.writeHead(404).end('Unknown reading key');
            let result = url.searchParams.get('refresh')==='1' ? undefined : outputByBook.get(book.key);
            if(result===undefined)result=outputByBook.set(book.key,JSON.stringify(readBatchOutputs(book,{registry:registered})));
            return res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(result);
        }
        if(req.method === 'GET' && (req.url === '/creatures' || req.url === '/')){
            const body=await readFile(new URL(req.url === '/' ? './index.html' : '../creature-desk/index.html',import.meta.url));
            return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(body);
        }
        if(req.method === 'POST' && req.url === '/reading-request'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>2000)throw Error('Request is too large.');}
            const {world,aspect}=JSON.parse(body);
            const requests=loadRequests();
            if(!requests.some(r=>r.world===world&&r.aspect===aspect))requests.push({world,aspect,keys:reading.keys.filter(k=>k.world===world).map(k=>k.key),...readingRoute(world,aspect),requestedAt:new Date().toISOString()});
            await mkdir(dirname(requestFile),{recursive:true});
            await writeFile(requestFile,JSON.stringify({note:'Atlas reading requests. Proposals only; nothing runs from this file.',requests},null,1)+'\n');
            api.readingRequests=requests;
            return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(requests));
        }
        // One reader digest per world, fetched when a Things or Making view opens (LOTM's is several MB).
        const reader=/^\/readers\/([a-z0-9-]+)$/.exec(req.url);
        if(req.method === 'GET' && reader){
            const file=READERS+'/'+reader[1]+'.json';
            if(!existsSync(file))return res.writeHead(404,{'Content-Type':'text/plain'}).end('No reader digest for this world. Run node prototypes/world-atlas/build.mjs.');
            const body=await readFile(file);
            return res.writeHead(200,{'Content-Type':'application/json'}).end(body);
        }
        if(req.method === 'GET' && req.url === '/transfer')return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(await transferState()));
        if(req.method === 'POST' && req.url === '/pick'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>2000)throw Error('Request is too large.');}
            const {place,district}=JSON.parse(body);
            if(!lotmPlaces.has(place))throw Error('Unknown place.');
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
    }catch(e){res.writeHead(e.code==='ENOENT'?404:400,{'Content-Type':'text/plain'}).end(e.code==='ENOENT'?'File unavailable.':e.message);}
});
if (import.meta.main) server.listen(Number(process.env.ATLAS_PORT || 4178),'127.0.0.1',()=>console.log('Atlas listening on http://127.0.0.1:'+server.address().port));
