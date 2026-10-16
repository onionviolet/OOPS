// R12: repeated explicit Craft 1 from a 12-chunk fixture; every receipt must match native deltas.
const T=require('./r12-lib.cjs');const {assert}=T;
const facts=p=>p.evaluate(()=>{const s=simulationTestHooks.snapshot();const inv={};for(const[k,v]of Object.entries(s.inventories.person.main_character)){const id=JSON.parse(k).id;inv[id]=(inv[id]||0)+v.count;}return{inv,xp:s.levels.person.main_character.skill_xp.Cooking||0};});
(async()=>{const b=await T.launch();const out=[];try{const {ctx,p}=await T.open(b,{data:T.fs.readFileSync(T.path.join(T.E,'cooking-fixture-12.save.json'),'utf8')});await T.openCooking(p);await T.pick(p,'Roasted rat meat');
 for(let i=0;i<6;i++){const a=await facts(p);const att=await p.locator('[data-craft-attempts]').textContent();await p.locator('[data-craft-commit]').click({noWaitAfter:true,force:true});await p.waitForTimeout(250);const z=await facts(p);
  const made=(z.inv['Roasted rat meat']||0)-(a.inv['Roasted rat meat']||0),used=(a.inv['Rat meat chunks']||0)-(z.inv['Rat meat chunks']||0),xp=Math.round((z.xp-a.xp)*10)/10;const r=await p.locator('#crafting_detail [data-craft-receipt]').textContent();
  const want=used===0?'Nothing was crafted. Your materials are unchanged.':made>0?`Made ${made} Roasted rat meat from ${used} Rat meat chunks${xp>0?` (+${xp} XP)`:''}`:`Failed: ${used} Rat meat chunks used, nothing made${xp>0?` (+${xp} XP)`:''}`;
  assert.equal(r,want);out.push({i,attemptsShown:att,made,used,xp,receipt:r});}
 assert(out.some(o=>o.made>0),'at least one success observed');const last=await p.locator('[data-craft-attempts]').textContent();assert.equal(last,'Can craft now: 0 attempts');assert.deepEqual(p.errors,[]);await T.shot(p,'success-1366-14');await ctx.close();}
 finally{await b.close();}T.fs.writeFileSync(T.path.join(T.E,'craft-sequence.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,0));})().catch(e=>{console.error('FAIL',e.message);process.exit(1)});
