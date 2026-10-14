const E={label:'seeded-native',cases:[]};
const boot=async(kind)=>{await reload();let file='/private/tmp/r15-g10-g2-fixtures/TEST-FIXTURE-R15-G2-'+kind+'.txt';if(kind==='retort')file=path.join(h.root,'docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g2/fixture/TEST-FIXTURE-R15-G2-retort.txt');await importFile(file);await page.evaluate(kind=>G.character.name='TEST FIXTURE R15 G10 '+kind,kind);await save();};
for(const kind of ['reserve','retort']){
 await boot(kind);const before=await s();await feature(kind==='reserve'?'Keep a finite survey-kit reserve':'Plan three retort batches');const pending=await s();assert.ok(jobs(pending).length);
 await page.evaluate(()=>G.forceLocation('Shack'));let done=(await advance(4)).save;
 assert.equal(jobs(done).filter(j=>j.actorId==='player').length,0);for(const id of ['Tree sap','Rough wood log','Set repair resin','Sound repair stave','Empty retort resin tray','Empty retort residue tray'])assert.equal(inv(done,id),inv(before,id),id+' refund');
 const c=done.expansion.simulation.workPlans.cursors.player;assert.equal(c.status,'paused');if(kind==='reserve')assert.equal(c.stockAcceptedBatches,1);
 await page.evaluate(()=>G.forceLocation('Village'));await save();E.cases.push({id:kind+'-support',refunded:true,cursor:c,persistence:await persist(kind+'-support-refund')});h.write('g2.json',E);
}
await boot('mixed');await feature('Supply, funded repair and a personal method');await page.evaluate(()=>G.state.actors['feature_society.orr'].resources.attention=0);const mixed=(await advance(14)).save;const c=mixed.expansion.simulation.workPlans.cursors.player;assert.equal(c.status,'paused');assert.match(c.reason,/resident has not accepted/);assert.equal(jobs(mixed).some(j=>j.actorId==='feature_society.orr'),false);E.cases.push({id:'mixed-attention',cursor:c,noResidentJob:true,persistence:await persist('mixed-attention')});h.write('g2.json',E);return E;
