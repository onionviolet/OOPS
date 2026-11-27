import {boot} from '../../../../scripts/headless/runner.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const bytes=readFileSync(process.env.TAYLOR_BUS_EXPORT || new URL('../../../../work/taylor-bus-acceptance-20261126/pre-extension-corridor.txt', import.meta.url));
const inputSha256=createHash('sha256').update(bytes).digest('hex');assert.equal(inputSha256,'ef11bffa5f5f536cf3b77e6aeb5f4be6e65493e1f8d920665f8bf97fbe305dba');
const game=await boot(null,{seed:7}),P='book.worm.lead',E=P+'.bus',key=JSON.stringify({id:E+'.backpack'});
const proof={setup:'Unedited real earned corridor export',inputSha256,steps:[],errors:[]};
const snap=()=>game.snapshot(),count=()=>snap().inventories.person.main_character[key]?.count||0;
const known=()=>!!snap().expansion.simulation.knowledge.player?.[E+'.inspection'];
const swarm=()=>snap().expansion.simulation.people[P+'.insects'].location;
async function opening(){const b=game.clickables().find(x=>x.text==='Beginning');if(b)await game.click(b.el);}
async function act(name,minutes=1){await game.click('[data-structured-action="'+name+'"]');await game.step(minutes);}
try{
 await game.importFile(bytes.toString('utf8').trim());await opening();const money=snap().character.money;
 assert.equal(count(),0);assert.equal(swarm(),P+'.washroom');await game.click('[data-structured-extension="'+E+'"]');assert.equal(count(),0);
 await act(P+'.return');await act(E+'.collect');assert.equal(count(),1);await act(E+'.put_washroom');assert.equal(count(),0);
 await act(P+'.leave');await act(E+'.leave_school',2);await act(E+'.board_home');
 assert.ok(game.document.querySelector('[data-structured-action="'+E+'.inspect_ride"]').disabled);
 await act(E+'.ride_home',10);assert.equal(count(),0);assert.equal(known(),false);
 proof.steps.push('Collected one source bag; set it down in school; walked, boarded and rode home without it; no notebook observation');
 await game.save();await game.reload();await opening();assert.equal(count(),0);assert.equal(known(),false);
 const exported=await game.exportFile();await game.importFile(exported);await opening();assert.equal(count(),0);
 await act(E+'.board_return');await act(E+'.ride_return',10);await act(E+'.return_school',2);await act(P+'.return');
 assert.ok(game.document.querySelector('[data-structured-action="'+E+'.collect"]').disabled);
 await act(E+'.take_washroom');assert.equal(count(),1);assert.equal(known(),false);assert.equal(swarm(),P+'.washroom');
 proof.steps.push('Native Save/reload+Export/Import; returned without bag; retrieved the same bag at its real school location');
 await game.click('[data-structured-action="'+E+'.inspect_washroom"]');await game.step(1);await game.save();await game.reload();await opening();assert.equal(known(),false);assert.equal(count(),1);
 await game.click(game.clickables().find(x=>x.text==='Cancel Check your soaked backpack').el);assert.equal(known(),false);assert.equal(count(),1);
 await act(E+'.inspect_washroom',2);assert.equal(known(),true);await game.save();await game.reload();assert.equal(count(),1);assert.equal(known(),true);
 assert.equal(snap().character.money,money);assert.deepEqual(game.errors,[]);proof.errors=game.errors;
 proof.steps.push('Pending inspection reload then cancellation reveals nothing; completed retry grants private observation; one bag and original insects retained');
 proof.results={bagCount:count(),swarm:swarm(),inspectionKnown:known(),moneyUnchanged:true};
}catch(e){proof.failure=e.stack;process.exitCode=1;}finally{writeFileSync('native-earned-left-bag-proof.json',JSON.stringify(proof,null,2));game.close();}
