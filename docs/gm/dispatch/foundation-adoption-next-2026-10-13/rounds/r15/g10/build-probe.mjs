// Test-only instrumentation of the same main entry, no production source edits.
// Real host commands and native models are exposed solely for QA prerequisites
// and impossible-state rejection/support-loss injection. Never shipped/committed dist.
import {build} from 'esbuild';
import fs from 'node:fs';
import crypto from 'node:crypto';
const bridge=`
globalThis.G={
 get state(){return expansionState;},get character(){return character;},get career(){return villageCareer;},get localLife(){return localLife;},get calendar(){return current_game_time;},get traders(){return traders;},get locations(){return locations;},get templates(){return item_templates;},
 context:get_context,save:()=>JSON.parse(create_save()),encode:s=>encodeSaveFile(JSON.stringify(s)),load:s=>load(s),
 advance:n=>update_timer(n),feature:c=>actFeatureExpansion({...c,sequence:c.sequence??expansionState.sequence}),management:c=>actManagement({...c,sequence:c.sequence??expansionState.sequence}),simulation:c=>actSimulation({...c,sequence:c.sequence??expansionState.sequence}),chronicle:actChronicle,
 local:id=>dispatchLocalLifePlan(localLifeAction(localLife,localLifeContext(),id)),
 move:id=>change_location({location_id:id,skip_travel_time:true}),forceLocation:id=>change_current_location(id),
 refresh:()=>{featureExpansionPanel?.render();managementPanel?.render();localLifePanel?.render();chroniclePanel?.render();},
 seedLocal:s=>{localLife=normalizeLocalLife(s);},careerDebt:()=>{villageCareer=resolveVillageKit(finishVillageShift(beginVillageShift(villageCareer,false),false),'keep');},
 negativeAlive:b=>{character.is_alive=b;},negativeBusy:b=>{current_activity=b?{id:'TEST FIXTURE busy'}:null;},
 exportFile:save_to_file
};`;
// Resolve exact panel/function names from live source; this script intentionally
// fails compilation if a name drifts.
await build({entryPoints:['src/main.js'],bundle:true,sourcemap:true,minify:true,outfile:'dist/bundle.js',platform:'browser',target:'es2022',format:'esm',plugins:[{name:'g10-test-bridge',setup(b){b.onLoad({filter:/\/src\/main\.js$/},a=>({contents:fs.readFileSync(a.path,'utf8')+'\n'+bridge,resolveDir:process.cwd()+'/src'}));}}]});
const sha=crypto.createHash('sha256').update(fs.readFileSync('dist/bundle.js')).digest('hex');
fs.writeFileSync('docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g10/evidence/probe-build.json',JSON.stringify({sha256:sha,instrumentation:'Same rebuilt main entry plus test-only G bridge; no command or gameplay implementation replaced'},null,1));
console.log(sha);
