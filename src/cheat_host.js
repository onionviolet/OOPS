// Cheat envelope owner. Storage, the clock and native mutations remain injected.
import {registerDomain} from './domain_registry.js';
import {defaultCheatState,validateCheatState,seedBeginningCheats,awakenCheats} from './cheat_cards.js';
export let cheatState=defaultCheatState();
export function setCheatState(value){cheatState=validateCheatState(value??defaultCheatState());}
let ports;
export function configureCheatHost(operations){ports=operations;}
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
registerDomain({id:'cheats',initialState:defaultCheatState,save:()=>validateCheatState(cheatState),
    validate:value=>{if(value!=null)validateCheatState(value);},load:value=>setCheatState(value??defaultCheatState())});
