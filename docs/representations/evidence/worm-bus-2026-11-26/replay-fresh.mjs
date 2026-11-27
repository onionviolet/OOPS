import {boot} from '../../../../scripts/headless/runner.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const game=await boot(null,{seed:7}),P='book.worm.lead',E=P+'.bus',key=JSON.stringify({id:E+'.backpack'});
const proof={setup:'Ordinary fresh Village entry; no edited save or fixture',steps:[],errors:[]};
const snap=()=>game.snapshot(),count=()=>snap().inventories.person.main_character[key]?.count||0;
const known=()=>!!snap().expansion.simulation.knowledge.player?.[E+'.inspection'];
const swarm=()=>snap().expansion.simulation.people[P+'.insects'].location;
async function beginning(){const button=game.clickables().find(x=>x.text==='Beginning');if(button)await game.click(button.el);}
async function act(name,minutes=1){await game.click('[data-structured-action="'+name+'"]');await game.step(minutes);}
try{
 await beginning();const choice=game.document.querySelector('[data-structured-choice="life"]');choice.value=P;
 choice.dispatchEvent(new game.dom.classes.Event('change',{bubbles:true}));await game.settle();await game.click('[data-structured-begin="begin"]');
 assert.equal(count(),0);assert.equal(known(),false);await act(P+'.disperse');assert.equal(swarm(),P+'.outside');
 await game.click('[data-structured-extension="'+E+'"]');assert.equal(count(),0);await act(E+'.collect');assert.equal(count(),1);assert.equal(known(),false);
 proof.steps.push('Fresh normal beginning; disperse; choose The way home; one neutral backpack collected in washroom');
 await act(P+'.leave');await act(E+'.leave_school',2);await act(E+'.board_home');await act(E+'.inspect_ride',10);
 assert.equal(snap().expansion.simulation.people.player.location,E+'.home_stop');assert.equal(known(),true);assert.equal(count(),1);
 proof.steps.push('Inspect on bus ride; arrival reveals private notebook damage through actual bag access');
 await game.save();await game.reload();assert.equal(known(),true);assert.equal(count(),1);
 const exported=await game.exportFile();await game.importFile(exported);assert.equal(known(),true);assert.equal(count(),1);assert.equal(swarm(),P+'.outside');
 proof.steps.push('Native Save/reload and Export/Import retain one bag, observed contents and earlier dispersal');
 proof.errors=game.errors;assert.deepEqual(game.errors,[]);
}catch(e){proof.failure=e.stack;process.exitCode=1;}finally{writeFileSync('native-fresh-proof.json',JSON.stringify(proof,null,2));game.close();}
