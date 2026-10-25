import {defaultCheatState,validateCheatState} from './cheat_cards.js';
export const emptyCheatQuarantine=()=>({schema:1,entries:[]});
export function validateCheatQuarantine(value) {
    if(!value||value.schema!==1||!Array.isArray(value.entries))throw Error('Invalid retained faculty data.');
    for(const row of value.entries){
        if(!row||!(row.id===null||typeof row.id==='string')||typeof row.raw!=='string')throw Error('Invalid retained faculty entry.');
        // Raw bytes are inert, including a damaged older quarantine payload.
    }
    return structuredClone(value);
}
// Local restore is tolerant; explicit import remains strict in save_files.js.
// Failed entries are retained verbatim as JSON, retried at every later load.
export function readCheatSave(envelope) {
    const quarantine=validateCheatQuarantine(envelope.cheats_quarantine??emptyCheatQuarantine());
    const source=envelope.cheats??defaultCheatState();
    let cheats=defaultCheatState();const pending=[];
    try {
        cheats=validateCheatState({...source,held:{}});
        pending.push(...Object.entries(source.held).map(([id,entry])=>({id,raw:JSON.stringify(entry)})));
    } catch {pending.push({id:null,raw:JSON.stringify(source)});}
    pending.push(...quarantine.entries);quarantine.entries=[];
    for(const row of pending){
        try {
            const raw=JSON.parse(row.raw);
            if(row.id===null){
                const restored=validateCheatState(raw);
                if(Object.keys(cheats.held).length)throw Error('Held data already exists.');
                cheats=restored;
            } else {
                if(Object.hasOwn(cheats.held,row.id))throw Error('Held data already exists.');
                cheats=validateCheatState({...cheats,held:{...cheats.held,[row.id]:raw}});
            }
        } catch {quarantine.entries.push(row);}
    }
    return {...envelope,cheats,cheats_quarantine:quarantine};
}
