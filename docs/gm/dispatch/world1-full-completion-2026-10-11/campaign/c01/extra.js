// Visible desktop controls are a separate assertion from command execution.
await start('visible-controls','ST05');await page.evaluate(HOLD);
await page.locator('.workspace-layout-menu > summary').click();
await page.locator('.workspace-picker > summary').click();
await page.locator('[data-workspace-action="restore"][data-module="beginning"]').click();
assert(await page.locator('[data-structured-action="p09.meet_interpreter"]').isVisible());
await page.locator('[data-structured-action="p09.meet_interpreter"]').click();
await page.locator('[data-structured-action="p09.learn_route_words"]').click();
let s=await saved();assert(s.expansion.simulation.jobs.some(j=>j.commandId==='p09.learn_route_words'));await advance(6);
await page.locator('[data-structured-action="p09.rehearse_route_words"]').click();await advance(6);
s=await saved();assert(pFact(s,'route_words'));await page.locator('[data-structured-action="p09.rehearse_route_words"]').scrollIntoViewIfNeeded();await page.screenshot({path:tmp+'/desktop-controls.png'});
record('C01-visible-desktop-controls',{realPointerClicks:true,viewport:[1600,1100]});await roundtrip('C01-visible-practiced');
// The same ordinary form has exterior exposure, even without magical access.
for(const id of ['learn_supply_words','meet','walk_stable','walk_woods','meet_warden','gather_mushroom_good','walk_city','ask_gate_review'])await fastAct(id);
s=await saved();const age=s.expansion.simulation.objectClocks['p09.unit_mushroom01'].elapsed;await advance(120-age);assert.equal(await enabled('sell_mushroom'),false);assert.equal((await saved()).expansion.simulation.claims['p09.mushroom01.title'].owner,'player');assert.equal((await saved()).expansion.simulation.owners['p09.buyer'][key('silver')],12);record('C01-ordinary-exposure',{saleRefused:true,titleRetained:true,buyerUncharged:true});await roundtrip('C01-stale');
// Retained G9 fixture, verified against its public hash. No human save input.
const file='/private/tmp/r15-g9-artifacts/N5-provider-ready.txt';const bytes=fs.readFileSync(file);
const oldEvidence=JSON.parse(fs.readFileSync(root+'/docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g9/EVIDENCE.json'));
assert.equal(hash(bytes),oldEvidence.results.find(r=>r.id==='N5-provider-ready').exportSha256);
const expected=decode(bytes.toString());assert(expected.character.name.includes('TEST FIXTURE R15 G9'));
await page.evaluate(HOLD+'localStorage.clear();');await Promise.all([page.waitForEvent('framenavigated'),page.locator('#saved_file_input').setInputFiles(file)]);await page.waitForLoadState('domcontentloaded');await page.locator('#loading_screen_play_button').waitFor({state:'visible',timeout:30000});
assert.deepEqual(stable(await saved()),stable(expected));await play();await page.evaluate(HOLD);await roundtrip('C01-prior-p08');assert.equal((await saved()).content_packs.structured.packId,'p08');
record('C01-prior-exact-content',{priorPackRetained:true,noConversion:true});
assert.equal(log.bundle.loaded,log.bundle.disk);assert.deepEqual(log.errors,[]);return results.map(r=>r.id);
