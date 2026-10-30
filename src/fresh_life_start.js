// Detached fresh-life transaction. All native state and publication are ports;
// the probe can capture only the be enrollment it was created to prepare.
import {BE_PROFILE_ID} from './seat_profiles.js';
import {whenCastLoaded} from './book_world_lotm_cast_days.js';
import {validLeadLife} from './book_world_lotm_lives.js';
import {showWorkingNote,hideWorkingNote,markWorking,resumeWorking} from './working_state.js';

export function createFreshLifeStart(ports){
 const probe=!!ports.token&&ports.freshProbe&&ports.beRequested;
 let captured=null,capturing=false,lockOwned=!!ports.token,packHold=false;
 resumeWorking();
 const isBe=state=>state?.lotm?.entryProfile===BE_PROFILE_ID;
 const canCapture=plan=>probe&&capturing&&isBe(plan?.state)&&plan.state.lotm.runMode==='canon'&&!plan.state.lotm.entry;
 const storage=(ordinary,plan)=>canCapture(plan)?{setEnvelope:(_key,envelope)=>{captured=structuredClone(envelope);}}:ordinary;
 function onLoad(save){
  packHold=isBe(save?.expansion);
  if(!packHold){ports.setOwned(lockOwned);return;}
  ports.setOwned(false);
  whenCastLoaded().then(pack=>{
   if(!isBe(ports.state()))return;
   packHold=!validLeadLife(pack);ports.setOwned(lockOwned&&!packHold);ports.refresh();
  });
 }
 function onOwnership(owned){lockOwned=owned;return owned&&!packHold;}
 async function start(be){
  if(!ports.canWrite()||ports.busy())throw Error('Finish current work and use the writable game tab. Your current save is kept.');
  const release=ports.freeze();
  // Preparing the life and reloading take seconds; say so now, and let the loading screen after the reload say it too.
  const label=be?'Starting your new life. The page reloads when it is ready; your current life is kept until then.':'Starting a new life. The page reloads when it is ready; your current life is kept until then.';
  showWorkingNote(label);
  try{
   const before=ports.revision(),next=JSON.parse(await ports.fresh({be}));
   if(next.continuation||(be&&(next.expansion?.lotm?.entry||next.expansion?.lotm?.runMode!=='canon')))
    throw Error('The independent life was not prepared. Your current save is kept.');
   await ports.preflight(next);
   if(!ports.canWrite()||ports.revision()!==before)throw Error('The active save changed. Your current save is kept.');
   ports.publish(next);ports.blockOldRuntime();markWorking('Entering your new life…');ports.reload();
  }catch(error){hideWorkingNote();throw error;}
  finally{ports.thaw(release);}
 }
 function mountMenu(){
  if(!isBe(ports.state()))return;
  // The native level and XP describe the default hero, not this life.
  for(const id of ['character_vitals_level','character_xp_div','character_level_div']){
   const element=document.getElementById(id);if(element){element.hidden=true;element.style.display='none';}
  }
  const button=document.createElement('button');button.id='be_new_life';button.className='options_button';button.type='button';button.textContent='Start a new life';
  button.addEventListener('click',()=>start(false).catch(error=>ports.report(error.message)));
  document.getElementById('hard_reset_button')?.before(button);
 }
 function postFreshProbe(){
  if(!ports.token||!ports.freshProbe)return;
  if(!probe){ports.post({type:'save-fresh-result',token:ports.token,serialized:ports.createSave()});return;}
  whenCastLoaded().then(()=>{
   capturing=true;try{ports.enrollBe();}finally{capturing=false;}
   if(!captured)throw Error('Fresh book life was not captured.');
   ports.post({type:'save-fresh-result',token:ports.token,serialized:JSON.stringify(captured)});
  }).catch(error=>ports.post({type:'save-fresh-result',token:ports.token,error:error?.message||'The fresh life could not be prepared.'}));
 }
 return {probe,canCapture,storage,onLoad,onOwnership,start,mountMenu,postFreshProbe,isHeld:()=>packHold};
}
