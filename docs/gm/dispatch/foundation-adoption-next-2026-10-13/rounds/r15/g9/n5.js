await start('N5','ST05');for(const id of ['meet_interpreter','borrow_translation','wear_translation_depot'])await fastAct(id);
globalThis.reserve=s=>s.expansion.simulation.energies['p08.mentor']['p08.provider_aether'].reserve;
let s=await saved();assert.equal(reserve(s),20);assert.equal(await enabled('meet'),false);await fastAct('learn_supply_words');assert.equal(await enabled('meet'),true);assert.equal(await enabled('ask_food_assignment'),false);record('N5-local-vocabulary',{supplyConversationAllowed:true,otherVocabularyRefused:true});await roundtrip('N5-provider-ready');
s=await act('charge_translation',true);assert.equal(reserve(s),19);assert(s.expansion.simulation.jobs.some(j=>j.commandId==='p08.charge_translation'));assert(!s.expansion.simulation.conditions.player?.['p08.translation_charge']);record('N5-reservation',{reserve:19,pending:true});await roundtrip('N5-pending');
// Hold immediately after reload so the two-minute job cannot beat the cancel click.
await page.evaluate(HOLD+'document.querySelector("[data-structured-cancel]").click();');s=await saved();assert.equal(reserve(s),20);assert(!s.expansion.simulation.jobs.length);assert(!s.expansion.simulation.conditions.player?.['p08.translation_charge']);record('N5-cancel',{reserve:20,charge:false,timerHeld:true});await roundtrip('N5-cancelled');
for(let i=0;i<20;i++){s=await fastAct('charge_translation');assert.equal(reserve(s),19-i);}
assert.equal(reserve(s),0);assert.equal(await enabled('charge_translation'),false);assert.equal(await enabled('meet'),true);record('N5-depletion',{completed:20,reserve:0});await roundtrip('N5-depleted');
s=await fastAct('recover_provider');assert.equal(reserve(s),4);s=await fastAct('charge_translation');assert.equal(reserve(s),3);record('N5-recovery',{recovered:4,afterUse:3});await roundtrip('N5-recovered');
for(const variant of ['source','body']){
 await importCheckpoint('N5-provider-ready');s=await act('charge_translation',true);assert.equal(reserve(s),19);
 await providerEffect(variant==='source'?[{type:'source',actor:'p08.mentor',sourceId:'p08.provider_channel',operation:'remove'}]:[{type:'body',actor:'p08.mentor',key:'channel',value:0}]);
 s=await advance(2);assert.equal(reserve(s),20);assert(!s.expansion.simulation.jobs.length);assert(!s.expansion.simulation.conditions.player?.['p08.translation_charge']);assert.equal(await enabled('charge_translation'),false);record('N5-changed-'+variant,{reserve:20,charge:false,realEffectFixture:true});await roundtrip('N5-changed-'+variant);
}
return results.map(r=>r.id);
