const gate=require('../cultivation-spacing-2026-10-22/browser-helper.cjs');
gate('w3-two-origins',async h=>{
 const {p,boot,load,enroll,act,save,roundtrip,assert,gates}=h;
 const {createStreams,scopedStream,keyedUnit}=await import(process.cwd()+'/src/seeded_streams.js');const seen=new Set();
 for(let seed=1;seed<30&&seen.size<2;seed++){
  const streams=createStreams(seed),id=keyedUnit({streams},scopedStream('world.events:p23.mistglass.history','p23.mistglass'),'origin')<.5?'keeper-built':'mill-race';if(seen.has(id))continue;
  let s=await boot();s.expansion.streams=streams;await load(s,'ordinary-opening-seed-'+seed);await enroll();await act('data-mistglass-action','enter');s=await save();assert.equal(s.expansion.mistglassRealm.history.id,id);
  await act('data-mistglass-action','learn');await act('data-mistglass-action','method:history:inspect');s=await save();const owner=s.expansion.worlds['p23.mistglass'].facts['p23.mistglass.sluiceOwner'],money=s.character.money,standing=s.character.reputation?.Village||0;
  await act('data-mistglass-action','method:history:restore');s=await save();assert.equal(s.expansion.worlds['p23.mistglass'].facts['p23.mistglass.sluiceOwner'],owner);
  if(id==='keeper-built')assert.equal(s.character.money,money+2);else assert.equal(s.character.reputation.Village,standing+1);
  await roundtrip('w3-origin-'+seed,s=>({history:s.expansion.mistglassRealm.history,lore:s.expansion.loreHistory,world:s.expansion.worlds['p23.mistglass'],knowledge:s.expansion.simulation.knowledge.player,stock:s.inventories.person.main_character}));
  await act('data-mistglass-action','exit');await act('data-mistglass-action','enter');assert.equal((await save()).expansion.mistglassRealm.history.id,id);seen.add(id);
 }
 assert.equal(seen.size,2);gates.push('Two seeded original histories have different actual owners and obligations; native discovery, restoration, persistence and revisits retain each exact cause');
},{deterministic:true}).catch(e=>{console.error(e);process.exitCode=1;});
