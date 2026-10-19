// Opaque controls only. All definitions and generated envelopes remain private.
await start('ordinary','ST05');await page.evaluate(HOLD);
globalThis.pFact=(s,k)=>s.expansion.actors.player.facts['p09.'+k];
globalThis.current=()=>saved();
assert.equal((await saved()).content_packs.structured.packId,'p09');
assert.equal((await saved()).expansion.simulation.containers['p09.compartment'].installed,false);
assert.equal((await saved()).expansion.simulation.people.player.body.channel,0);
record('C01-normal-installed-entry',{fixtureDefinitionMapEdits:false,magicalAccessGranted:false});
await fastAct('meet_interpreter');assert.equal(await enabled('rehearse_route_words'),false);
await fastAct('learn_route_words');let s=await saved();assert(pFact(s,'route_words_known'));assert(!pFact(s,'route_words'));assert(!pFact(s,'local_fluent'));assert.equal(await enabled('meet'),false);assert.equal(await enabled('ask_food_assignment'),false);
await roundtrip('C01-known');
s=await act('rehearse_route_words',true);assert(s.expansion.simulation.jobs.length);assert(!pFact(s,'route_words'));await roundtrip('C01-pending');
await page.evaluate(HOLD+'document.querySelector("[data-structured-cancel]").click();');s=await saved();assert(!s.expansion.simulation.jobs.length);assert(!pFact(s,'route_words'));assert(pFact(s,'route_words_known'));record('C01-cancel',{lessonNotGranted:true});await roundtrip('C01-cancelled');
await fastAct('rehearse_route_words');s=await saved();assert(pFact(s,'route_words'));assert(!pFact(s,'local_fluent'));assert.equal(await enabled('ask_food_assignment'),false);await roundtrip('C01-practiced');
for(const id of ['learn_supply_words','meet','walk_stable','walk_woods','meet_warden','gather_mushroom_good','observe_woodland','write_woodland_report','introduce_warden','ask_gate_review','ask_warden_oath','recognize_warden','sell_mushroom'])await fastAct(id);
s=await saved();assert.equal(s.expansion.simulation.claims['p09.mushroom01.title'].owner,'p09.buyer');assert.equal(s.inventories.person.main_character[key('silver')].count,2);assert(!pFact(s,'local_fluent'));assert(!s.expansion.simulation.custody['p09.translation_loan']);
record('C01-regional-conversation-sale',{sameOrdinaryLife:true,withoutAid:true,fullFluencyGranted:false,silver:2});await roundtrip('C01-sold');
s=await saved();const due=s.expansion.simulation.conditions.player['p09.report_wait'].expiresAt;await advance(due-s.expansion.clock);await fastAct('weekly_warden_report');s=await saved();assert.equal(s.expansion.simulation.owners['p09.warden'][key('silver')],3);record('C01-regional-report',{wardenPaid:3});await roundtrip('C01-reported');
for(const id of ['escort_warden_home','walk_home_woods','stable_return'])await fastAct(id);assert.equal((await saved())['current location'],'p09.depot');await roundtrip('C01-returned');
// Alternative: actual aid, expiry during practice, then renewed aid and return.
await start('aided','ST05');for(const id of ['meet_interpreter','borrow_translation','wear_translation_depot','learn_route_words','charge_translation','walk_to_language_yard'])await fastAct(id);
s=await saved();const expiry=s.expansion.simulation.conditions.player['p09.translation_charge'].expiresAt;await advance(expiry-s.expansion.clock-3);s=await act('pair_route_words_with_aid',true);assert(s.expansion.simulation.jobs.length);await advance(6);s=await saved();assert(!pFact(s,'route_words'));assert(pFact(s,'route_words_known'));assert(!s.expansion.simulation.jobs.length);record('C01-expired-aid',{noPracticeGranted:true});await roundtrip('C01-expired');
for(const id of ['walk_back_language_yard','charge_translation','walk_to_language_yard','pair_route_words_with_aid','walk_back_language_yard','remove_translation_depot','return_translation'])await fastAct(id);
s=await saved();assert(pFact(s,'route_words'));assert(!pFact(s,'local_fluent'));assert(!s.expansion.simulation.custody['p09.translation_loan']);record('C01-aided-retention',{returnedSameAid:true,practicedWordsRetained:true});await roundtrip('C01-aided-returned');
assert.equal(log.bundle.loaded,log.bundle.disk);assert.deepEqual(log.errors,[]);return results.map(r=>r.id);
