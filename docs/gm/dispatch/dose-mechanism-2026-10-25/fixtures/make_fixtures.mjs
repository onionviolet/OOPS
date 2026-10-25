// Old-save fixtures written with the PRE-DWF101 code (2026-10-25). Run once before the port: node make_fixtures.mjs
// The same files are loaded by tests/dose_process.test.js to prove old saves still finish on the ported code.
import fs from 'node:fs';
import {fresh,run,wait,at} from '../../../../../tests/lotm_helpers.js';
import {LOTM_LOCATIONS as L} from '../../../../../src/book_world_lotm_ids.js';
import {begin,commit,settle,HP} from '../../../../../src/hp_brewing_state.js';
const dir=new URL('.',import.meta.url).pathname;
const frog=p=>{p=at(p,L.docks);for(const t of ['pay','verify','settle'])p=run(p,`lot_${t}_frog`);return at(p,L.workroom);};
const started=run(run(frog(run(fresh(5000),'report_in')),'buy_formula_cc'),'brew_start_cc');
const pack=p=>({state:p.state,external:p.external,gameplay:p.gameplay});
fs.writeFileSync(dir+'cc-brew-started.json',JSON.stringify({note:'CC brew started at clock '+started.state.clock+', 120 minutes needed',...pack(started)}));
const ready=wait(structuredClone(started),120);
fs.writeFileSync(dir+'cc-brew-ready.json',JSON.stringify({note:'CC brew ready, not collected',...pack(ready)}));
// HP: engine-level Polyjuice brew in progress (same recipe path as tests/hp_brewing.test.js).
const I=id=>`book.hp.ing.${id}`,STORE='book.hp.route.student_store',TRUST='book.hp.route.trusted_supplier',HARVEST='book.hp.route.harvest';
let s=begin({seed:11,now:0}),now=0;const moon='Full';
const d=req=>{s=commit(s,{now,moon},req).state;};const lot=ing=>Object.values(s.lots).filter(l=>l.ingredient===ing).at(-1).id;
const get=(ing,route)=>{d({type:'acquire',route,ingredient:ing});return lot(ing);};
const flux=get(I('fluxweed'),HARVEST),lace=get(I('lacewing_flies'),STORE),leech=get(I('leeches'),STORE),knot=get(I('knotgrass'),STORE),horn=get(I('bicorn_horn'),TRUST),skin=get(I('boomslang_skin'),TRUST);
d({type:'stew',lotId:lace});now+=30240;settle(s,now);
d({type:'prepare',lotId:horn,variant:'book.hp.prep.powder_fine'});d({type:'prepare',lotId:skin,variant:'book.hp.prep.shred_fine'});
d({type:'brew',slots:{lacewing:lace,leeches:leech,fluxweed:flux,knotgrass:knot,bicorn:horn,boomslang:skin}});
fs.writeFileSync(dir+'hp-brewing.json',JSON.stringify({note:'HP Polyjuice brew simmering; ready at brew.readyAt',now,moon,slice:s}));
console.log('ok',started.state.clock,now,s.cauldron.brew);
