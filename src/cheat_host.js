import {accrueFurnace,runPatientFurnace} from './patient_furnace.js';
import {readCheatSave,emptyCheatQuarantine,validateCheatQuarantine} from './cheat_save.js';
export {readCheatSave};
// Cheat envelope owner. Storage, the clock and native mutations remain injected.
import {executeCheatAction,cheatProjection,systemQuestProjection} from './cheat_mechanisms.js';
import {createCheatPanel} from './cheat_ui.js';
import {registerDomain} from './domain_registry.js';
import {defaultCheatState,validateCheatState,seedBeginningCheats,awakenCheats} from './cheat_cards.js';
export let cheatState=defaultCheatState();
export function setCheatState(value){cheatState=validateCheatState(value??defaultCheatState());}
let ports,panel,quarantine=emptyCheatQuarantine();
export function configureCheatHost(operations){
    ports=operations;
    if(quarantine.entries.length)ports.log('Some saved records need a compatible reader. Their original data is retained in your full backup.');
    panel??=createCheatPanel({read:()=>cheatProjection({...ports.read(),cheats:cheatState}),act:commandCheat,nameItem:operations.nameItem});
}
export function commandCheat(request){
    if(!ports.writable())throw Error('Use the writable game tab.');
    if(ports.occupied(request))throw Error('Finish the current activity before concentrating on the faculty.');
    if(request.type==='settle-furnace'){runPatientFurnace({...ports.furnace,note:reason=>{const next=ports.capture();next.cheats.held['patient-furnace'].card.state.away.stop=reason;ports.commit(next,()=>setCheatState(next.cheats));}});panel?.render(true);ports.refresh();return;}
    if(request.type==='assign-furnace')request={...request,now:Date.now()};
    if(request.type==='appraise')request={...request,skill:ports.harvestSkill()};
    if(request.type==='peek'){
        const target=ports.read().decisions?.find(d=>d.id===request.target);
        if(!target)throw Error('That foe is no longer present to read.');
        request={...request,key:target.key,keyed:target.keyed,label:target.label};
    }
    executeCheatAction({capture:ports.capture,commit:ports.commit,publish:next=>{setCheatState(next.cheats);ports.publish(next);}},request);
    panel?.render(true);ports.refresh();
}

export function seedCheatBeginning(request){setCheatState(seedBeginningCheats(cheatState,request));}
export function observeCheats(wonFight=false){
    if(!ports?.writable())return;
    const result=awakenCheats(cheatState,{...ports.moment(),wonFight:wonFight||ports.wonFight()});
    if(!result.messages.length)return;
    // Reveal after the existing guarded writer has accepted the full envelope.
    const save=ports.capture();if(!save)return;save.cheats=result.state;
    try {
        ports.commit(save,()=>{setCheatState(result.state);});
    } catch(error) {ports.log(error.message);return;}
    for(const message of result.messages)ports.log(message);
    ports.refresh();
}
registerDomain({id:'cheats',initialState:defaultCheatState,save:()=>validateCheatState(cheatState),projection:()=>systemQuestProjection({...ports?.read(),cheats:cheatState}),
    validate:value=>{if(value!=null)validateCheatState(value);},load:value=>setCheatState(accrueFurnace(value??defaultCheatState(),Date.now())),refresh:()=>panel?.render()});

registerDomain({id:'cheats_quarantine',initialState:emptyCheatQuarantine,save:()=>validateCheatQuarantine(quarantine),validate:value=>{if(value!=null)validateCheatQuarantine(value);},load:value=>{quarantine=validateCheatQuarantine(value??emptyCheatQuarantine());}});
