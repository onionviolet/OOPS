// Supplemental desktop checks from an untouched, previously UI-earned arrival.
// No incident outcome, regard, reward or completed-command field is inserted.
import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Session} from '../scripts/playtest/lib.mjs';
import {serve} from '../scripts/perf/lib.mjs';
import {TENT,TENT_COMMANDS,tentIncidentData} from '../src/lotm_tent_incident.js';
const [buildArg,outArg,expectedBundle,inputArg,expectedInput]=process.argv.slice(2);
assert.ok(buildArg&&outArg&&expectedBundle&&inputArg&&expectedInput,'Pass build, output, final bundle SHA, earned input and input SHA.');
const build=resolve(buildArg),out=resolve(outArg),input=resolve(inputArg);
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=await readFile(input),meta=JSON.parse(await readFile(input.replace(/\.json$/,'.meta.json'),'utf8'));
assert.equal(hash(bytes),expectedInput);assert.equal(meta.sha256,expectedInput);
assert.equal(meta.bundleSha256,'d8152afb60928749285da28f088c1750ac0ef2c2ba7e4efd7a13ab1100bb3b89');
const seed=JSON.parse(bytes),packBytes=await readFile('private_packs/lotm-cast/cast.json');
const pack=JSON.parse(packBytes),data=tentIncidentData(pack);assert.ok(data);
const elsewhere=pack.places.find(p=>p.indexId==='lotm.place.sline-bakery');assert.ok(elsewhere);
assert.equal(seed.expansion.lotm.entryProfile,pack.host.profile.id);
const elapsed=s=>s.expansion.clock-s.expansion.lotm.initializedAt;
assert.equal(elapsed(seed),TENT.open);
assert.equal(seed.expansion.actors.player.facts[TENT.prefix+'witness'],undefined);
assert.equal(hash(await readFile(join(build,'dist/bundle.js'))),expectedBundle);
await mkdir(out,{recursive:true});assert.equal((await readdir(out)).length,0,'Use a fresh supplement output directory.');
const server=await serve(build),responses=[],served=new Set();
const session=new Session({url:server.url+'?test_hooks=1',seed:87,wall:Date.UTC(2026,10,25,15),opTimeout:160000,
 hooks:{beforeOpen:async context=>context.on('response',r=>{if(new URL(r.url()).pathname==='/dist/bundle.js')responses.push(r.body().then(b=>served.add(hash(b))));})}});
const snap=()=>session.page.evaluate(()=>simulationTestHooks.snapshot());
const panel=()=>session.page.locator('#lotm_panel');
const button=id=>panel().locator(`[data-lotm="${id}"]`).first();
async function ready(){
 await session.page.waitForFunction(()=>!!window.simulationTestHooks);await session.page.evaluate(()=>simulationTestHooks.pause());
 const play=session.page.locator('#loading_screen_play_button');if(await play.isVisible())await play.click({force:true});
 await session.page.getByRole('combobox',{name:'Other known panels'}).selectOption('lotm');
 await panel().getByRole('tab',{name:'Here',exact:true}).click();
}
async function reveal(id){
 const b=button(id);assert.equal(await b.count(),1,'Native control exists: '+id);
 for(let i=0;i<12;i++){const d=b.locator('xpath=ancestor::details[not(@open)][last()]');if(!await d.count())break;await d.locator(':scope > summary').click();}
 await b.scrollIntoViewIfNeeded();return b;
}
async function walk(place){
 const before=await snap(),b=await reveal('lotm.move.'+place);assert.ok(await b.isEnabled());await b.click();
 const current=await snap(),job=current.expansion.simulation.jobs.find(j=>j.actorId==='player');assert.ok(job);
 await session.step(job.due-current.expansion.clock);const after=await snap();
 assert.equal(after.expansion.simulation.people.player.location,place);assert.equal(after['current location'],place);
 assert.ok(after.expansion.clock>before.expansion.clock);return after;
}
function unobserved(s){
 const e=s.expansion,f=e.actors.player.facts;
 assert.notEqual(f[TENT.prefix+'witness'],true);assert.notEqual(f[TENT.prefix+'paid'],true);
 assert.equal(e.simulation.relationships[data.reader]?.player?.axes?.trust||0,0);
 assert.equal(e.simulation.knowledge.player?.['book.lotm.excursion.reading.seen'],undefined);
 assert.equal(e.simulation.jobs.filter(j=>j.actorId==='player'&&j.commandId.startsWith(TENT.prefix)).length,0);
}
async function capture(name){
 await panel().locator('[data-lotm-tent-incident]').scrollIntoViewIfNeeded();
 await session.page.screenshot({path:join(out,name+'.png')});assert.equal((await session.uiCheck()).pageOverflow,0);
}
const branches=[];
try{
 await session.start();await session.open(seed);await ready();unobserved(await snap());
 await session.step(TENT.close-TENT.open);let current=await snap();assert.equal(elapsed(current),TENT.close);unobserved(current);
 assert.match(await panel().locator('[data-lotm-tent-incident]').innerText(),/exchange has ended without your involvement/i);
 assert.ok(await(await reveal(TENT_COMMANDS.watch)).isDisabled());
 await capture('exact-close');branches.push({kind:'exact-close',elapsed:elapsed(current),watchDisabled:true,unobserved:true});

 await session.open(seed);await ready();current=await walk(elsewhere.id);const awayFrom=elapsed(current);
 assert.notEqual(current.expansion.simulation.people.player.location,data.place);
 await session.step(60);current=await snap();assert.equal(elapsed(current),awayFrom+60);
 assert.equal(current.expansion.simulation.people.player.location,elsewhere.id);unobserved(current);
 const awayUntil=elapsed(current);current=await walk(data.place);unobserved(current);
 assert.match(await panel().locator('[data-lotm-tent-incident]').innerText(),/exchange has ended without your involvement/i);
 assert.ok(await(await reveal(TENT_COMMANDS.inquire)).isDisabled(),'Ordinary inquiry remains visible with its next-day timing.');
 await capture('actual-hour-elsewhere');branches.push({kind:'actual-hour-elsewhere',placeReference:elsewhere.indexId,awayFrom,awayUntil,returnedAt:elapsed(current),unobserved:true,noTentPay:true,ordinaryInquiryVisible:true});
 assert.deepEqual(session.errors.filter(e=>e.kind==='pageerror'),[]);
 await Promise.all(responses);assert.deepEqual([...served],[expectedBundle]);
 assert.equal(hash(await readFile(join(build,'dist/bundle.js'))),expectedBundle);assert.equal(hash(await readFile(input)),expectedInput);
 assert.equal(hash(await readFile('private_packs/lotm-cast/cast.json')),hash(packBytes));
 const result={status:'agent-verified-not-human-reviewed',viewport:{width:1920,height:1080},bundleSha256:expectedBundle,servedBundleSha256:[...served],packSha256:hash(packBytes),
  input:{kind:'unchanged actual UI-earned ordinary-local arrival checkpoint',sha256:expectedInput,earnedOnBundleSha256:meta.bundleSha256,elapsed:TENT.open},
  setup:'Load the authentic earned checkpoint; actual native walk controls and native test-tick time advancement, with no outcome edits.',branches,pageErrors:[],inputUnchanged:true,packUnchanged:true};
 await writeFile(join(out,'result.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
}catch(error){await session.page?.screenshot({path:join(out,'failed.png')}).catch(()=>{});await writeFile(join(out,'failure.txt'),String(error.stack||error)+'\n');throw error;}
finally{await session.close();await server.close();}
