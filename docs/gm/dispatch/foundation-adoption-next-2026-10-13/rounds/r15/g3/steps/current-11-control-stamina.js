const C="Eda's clouded batch",F="Eda's bench fieldcraft";
const out={inconclusive:await rowText(C,'Compare the failed trial')};
let pre=await save();out.blockedKey=await keyAct(C,'Compare the failed trial');
let s=await save();
check(!s.expansion.simulation.jobs.length && !s.expansion.simulation.knowledge.player['game_absorption_assay.identity'],'unavailable comparison records no identity or job');
// Capture the native debit before ordinary Village regeneration can obscure it. Clearing only
// wall-clock timers after the real durable reservation is equivalent to closing this test tab.
// No game value or job is changed; reload restarts the normal loop.
await page.evaluate(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
    const result=original.call(this,k,v);
    if(k==='save data'){
      const s=JSON.parse(v);
      if(s.expansion?.simulation?.jobs.some(j=>j.commandId==='nethack_fieldcraft.trial_dull')){
        Storage.prototype.setItem=original;window.__r15Debit=s.character.stamina_to_full;
        const id=setTimeout(()=>{},0);for(let i=0;i<=id+10;i++){clearTimeout(i);clearInterval(i);}
      }
    }
    return result;
  };
});
pre=await save();out.controlKey=await keyAct(F,'Apply a pale vial to your own dull plain knife');
s=await stored();out.pending=brief(s);out.liveStamina=await page.locator('#character_stamina_value').innerText();
check(s.character.stamina_to_full===pre.character.stamina_to_full+1,'actual durable one-stamina debit');
const liveSave=await save();
check(liveSave.character.stamina_to_full===s.character.stamina_to_full,'live native debit agrees with durable reservation');
check(n(s,'Unmarked pale vial')===n(pre,'Unmarked pale vial')-1 && n(s,'Dulled field fitting knife')===n(pre,'Dulled field fitting knife')-1,'full charge and owned dull tool reserved');
out.pendingPersistence=await checkpoint2('current-fa13-control-pending');
await waitJobs();s=await stored();out.completed=brief(s);
check(n(s,'Empty bench vial')===n(pre,'Empty bench vial')+1 && n(s,'Field fitting knife')===n(pre,'Field fitting knife')+1,'spent container and sharp counterpart returned');
check(s.expansion.simulation.knowledge.player['nethack_fieldcraft.reed_oil'].basis.attributedTo==='player','firsthand control attributed to player');
check(s.expansion.referenceGameplay.feats.earned.some(f=>f.id==='bench_liquid_discovery'),'discovery feat');
await record('current-control-stamina',out);
return out;
