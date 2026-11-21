// Development-only, read-only projections of public world definitions.
import {entityLibrary} from './entity-library.mjs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createServer} from 'node:http';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {readLibrary} from './library-reading.mjs';
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
const books=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./cast-places.mjs',import.meta.url))],{encoding:'utf8',maxBuffer:64e6}));
const {frontier,others}=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./native-map.mjs',import.meta.url))],{encoding:'utf8'}));
const reading=readLibrary();
// Reading requests: the atlas's writeback for the library. Gitignored; nothing runs from it.
const requestFile=process.env.ATLAS_REQUESTS||fileURLToPath(new URL('../../work/atlas-reading-requests.json',import.meta.url));
const loadRequests=()=>existsSync(requestFile)?JSON.parse(readFileSync(requestFile,'utf8')).requests:[];
function readingRoute(world,aspect){
    const keys=reading.keys.filter(k=>k.world===world);
    if(!keys.length||!reading.aspects.includes(aspect))throw Error('Unknown world or mechanic.');
    const names=keys.map(k=>k.key).join(',');
    if(!keys.some(k=>k.held))return {route:'acquire',next:'Check holdings, then the download wishlist (python3 -I scripts/wishlist_queue.py).'};
    if(!keys.every(k=>k.complete))return {route:'read',next:`Finish the five reading passes for ${keys.filter(k=>!k.complete).map(k=>k.key).join(',')}; paid runs need Weibao's yes.`};
    return {route:'review',next:`node scripts/lead_run/reading_review.mjs --keys ${names} --topic ${aspect} --out work/reading-requests/${world}-${aspect}`};
}
export const api = {reading,readingRequests:loadRequests(),frontier,others,books,library:entityLibrary(places,actors),target,places, actors:Object.fromEntries(actors), encounters, fields:DRAFT_FIELDS, draft:DEFAULT_DRAFT};
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
        if(req.method === 'POST' && req.url === '/export'){
            let body='';for await(const chunk of req){body+=chunk;if(body.length>16000)throw Error('Draft is too large.');}
            const draft=JSON.parse(body);compileDraft(draft);
            return res.writeHead(200,{'Content-Type':'application/json'}).end(exportAuthoredFile(draft));
        }
        res.writeHead(404).end();
    }catch(e){res.writeHead(400,{'Content-Type':'text/plain'}).end(e.message);}
});
if (import.meta.main) server.listen(Number(process.env.ATLAS_PORT || 4178),'127.0.0.1',()=>console.log('Atlas listening on http://127.0.0.1:'+server.address().port));
