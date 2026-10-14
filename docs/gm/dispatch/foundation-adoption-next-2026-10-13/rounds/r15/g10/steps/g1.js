const E={label:'seeded-native',cases:[]};
const boot=async(contact=false)=>{await reload();await fixture('g1','fa18-ticket-held-export.txt');await page.evaluate(contact=>{G.character.name='TEST FIXTURE R15 G10 FA18';if(contact){const s={...G.localLife,encounter:'runner',runnerMealsIssued:0,runnerMealsUsed:0};G.seedLocal(s);}G.refresh();},contact);await save();};
const snap=async()=>page.evaluate(()=>({life:G.localLife,money:G.character.money,inventory:Object.fromEntries(Object.entries(G.character.getItems()).map(([k,v])=>[k,v.count]))}));
for(const id of ['decline','help-poor','meal-poor','outside','busy','dead','failed-help','failed-meal']){
 await boot(['decline','help-poor','failed-help'].includes(id));
 await page.evaluate(id=>{if(id.includes('poor'))G.character.money=id==='help-poor'?4:0;if(id==='outside')G.forceLocation('Shack');if(id==='busy')G.negativeBusy(true);if(id==='dead')G.negativeAlive(false);G.refresh();},id);
 await save();const before=await snap(),durable=await s();
 if(id.startsWith('failed'))await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;window.failedWrites=0;Storage.prototype.setItem=function(k,v){if(k==='save data'){window.failedWrites++;throw new DOMException('G10 storage fault','QuotaExceededError');}return window.originalSet.call(this,k,v);};});
 const action=id==='decline'?'decline':id==='help-poor'||id==='failed-help'?'help':'runner_meal';
 const result=await page.evaluate(action=>{try{G.local(action);return {ok:true};}catch(e){return {ok:false,error:e.message};}},action);
 const after=await snap();
 if(id==='decline'){assert.equal(after.life.declined,before.life.declined+1);assert.equal(after.life.runnerMealsIssued,0);assert.equal(after.money,before.money);}
 else {assert.equal(result.ok,false,id);assert.ok(eq(before,after),id+' live unchanged');assert.ok(eq(durable,await s()),id+' durable unchanged');}
 E.cases.push({id,result,unchanged:id!=='decline',writes:id.startsWith('failed')?await page.evaluate(()=>window.failedWrites):undefined});
 if(id.startsWith('failed')){await reload();await page.evaluate(action=>G.local(action),action);const retry=await snap();assert.equal(retry.life[action==='help'?'runnerMealsIssued':'runnerMealsUsed'],1);E.cases.at(-1).retryOnce=true;}
 if(id==='decline'||id.startsWith('failed'))E.cases.at(-1).persistence=await persist('fa18-'+id);
}
h.write('g1.json',E);return E;
