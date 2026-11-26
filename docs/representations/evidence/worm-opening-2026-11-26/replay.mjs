import {boot} from '../../../../scripts/headless/runner.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const game=await boot(null,{seed:7});
const proof={route:[],errors:[]};
try {
 await game.click(game.clickables().find(x=>x.text==='Beginning').el);
 const choice=game.document.querySelector('[data-structured-choice="life"]');
 assert.ok(choice);choice.value='book.worm.lead';choice.dispatchEvent(new game.dom.classes.Event('change',{bubbles:true}));await game.settle();
 await game.click('[data-structured-begin="begin"]');
 proof.route.push('Village > Beginning > Worm / Taylor > Confirm arrival');
 const insectPlace=()=>game.snapshot().expansion.simulation.people['book.worm.lead.insects'].location;
 assert.equal(insectPlace(),'book.worm.lead.washroom');
 await game.click('[data-structured-action="book.worm.lead.leave"]');await game.step(1);
 assert.equal(insectPlace(),'book.worm.lead.washroom');
 proof.route.push('Leave first: insects remain in washroom');
 await game.save();await game.reload();
 await game.click(game.clickables().find(x=>x.text==='Beginning').el);
 assert.equal(insectPlace(),'book.worm.lead.washroom');
 await game.click('[data-structured-action="book.worm.lead.return"]');await game.step(1);
 await game.click('[data-structured-action="book.worm.lead.disperse"]');await game.step(1);
 assert.equal(insectPlace(),'book.worm.lead.outside');
 const encoded=await game.exportFile();await game.importFile(encoded);
 assert.equal(insectPlace(),'book.worm.lead.outside');
 proof.route.push('Return > disperse > insects outside > native Export/Import');
 proof.persistence={saveReload:true,exportImport:true};proof.errors=game.errors;assert.deepEqual(game.errors,[]);
} catch(e){proof.failure=e.stack;process.exitCode=1;} finally {writeFileSync(process.env.WORM_PROOF_OUT || 'worm-opening-result.json',JSON.stringify(proof,null,2));game.close();}
