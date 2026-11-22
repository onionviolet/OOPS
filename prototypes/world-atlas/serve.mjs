// Development-only, read-only projections of public world definitions.
import {entityLibrary} from './entity-library.mjs';
import {execFileSync, spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir, readdir} from 'node:fs/promises';
import {existsSync, readFileSync, openSync} from 'node:fs';
import {FLAGGED_PLACES} from '../../scripts/atlas/transfer_candidate.mjs';
import {dirname} from 'node:path';
import {readLibrary} from './library-reading.mjs';
import {readSnapshot, buildSnapshot, latestProgress, READERS} from './build.mjs';
import {readBatches, batchCommands} from './batch-status.mjs';
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
// The batch build (build.mjs) writes one snapshot; the server reads it, or builds one when it is missing or ATLAS_REBUILD=1.
const snap=(!process.env.ATLAS_REBUILD&&readSnapshot())||buildSnapshot();
// ATLAS_LOTM_CAST previews a scratch pack, so the cast projection reruns instead of coming from the snapshot.
const books=process.env.ATLAS_LOTM_CAST?JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./cast-places.mjs',import.meta.url))],{encoding:'utf8',maxBuffer:64e6})):snap.books;
const {frontier,others,sources,mechanics,findings,recipes,gameMaking}=snap;
const progress=latestProgress(); // read live: a new /progress-atlas file shows without a rebuild
const reading=readLibrary();
const batches=readBatches(reading.keys.map(k=>k.key));
// Reading requests: the atlas's writeback for the library. Gitignored; nothing runs from it.
const requestFile=process.env.ATLAS_REQUESTS||fileURLToPath(new URL('../../work/atlas-reading-requests.json',import.meta.url));
const loadRequests=()=>existsSync(requestFile)?JSON.parse(readFileSync(requestFile,'utf8')).requests:[];
function readingRoute(world,aspect){
    const keys=reading.keys.filter(k=>k.world===world);
    if(!keys.length||!reading.aspects.includes(aspect))throw Error('Unknown world or mechanic.');
    const names=keys.map(k=>k.key).join(',');
    if(!keys.some(k=>k.held))return {route:'acquire',next:'Check holdings, then the download wishlist (python3 -I scripts/wishlist_queue.py).'};
    if(!keys.every(k=>k.complete)){const open=keys.filter(k=>!k.complete).map(k=>k.key);return {route:'read',next:`Finish the five reading passes for ${open.join(',')}; paid runs need Weibao's yes.`,batch:batchCommands(open)};}
    return {route:'review',next:`node scripts/lead_run/reading_review.mjs --keys ${names} --topic ${aspect} --out work/reading-requests/${world}-${aspect}`};
}
// Placement picks: the atlas's writeback for places. Gitignored; transfer_candidate.mjs turns them into a candidate pack.
const root=fileURLToPath(new URL('../../',import.meta.url));
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
export const api = {findings,recipes,gameMaking,transfer,snapshot:{builtAt:snap.builtAt,commit:snap.commit,failures:snap.failures},sources,mechanics,progress,batches,reading,readingRequests:loadRequests(),frontier,others,books,library:entityLibrary(places,actors),target,places, actors:Object.fromEntries(actors), encounters, fields:DRAFT_FIELDS, draft:DEFAULT_DRAFT};
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
    '/transfer-view.mjs':['./transfer-view.mjs','text/javascript'],
    '/things-views.mjs':['./things-views.mjs','text/javascript'],
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
        if(req.method === 'GET' && req.url === '/data')return res.writeHead(200,{'Content-Type':'application/json'}).end(JSON.stringify(api));
        if(req.method === 'GET' && req.url === '/creatures')return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(new URL('../creature-desk/index.html',import.meta.url)));
        if(req.method === 'GET' && req.url === '/')return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(new URL('./index.html',import.meta.url)));
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
            return res.writeHead(200,{'Content-Type':'application/json'}).end(await readFile(file));
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
    }catch(e){res.writeHead(400,{'Content-Type':'text/plain'}).end(e.message);}
});
if (import.meta.main) server.listen(Number(process.env.ATLAS_PORT || 4178),'127.0.0.1',()=>console.log('Atlas listening on http://127.0.0.1:'+server.address().port));
