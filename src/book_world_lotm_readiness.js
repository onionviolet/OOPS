// Readiness selects no save and grants no authority. The native loader still
// validates the exact source-backed definitions and reports incompatible data.
import {whenCastLoaded} from './book_world_lotm_cast_days.js';
const pending = bytes => {
    try {
        const raw=JSON.parse(bytes);
        const snapshots=typeof raw?.current==='string'?[raw.current,raw.previous].filter(x=>typeof x==='string').map(x=>JSON.parse(x)):[raw];
        return snapshots.some(save=>save?.expansion?.lotm&&save.expansion.simulation?.jobs?.some(j=>j.commandId?.startsWith('book.lotm.')));
    } catch {return false;}
};
export async function waitForLotmSourceJobs({storage,keys,probe=false,ready=whenCastLoaded}) {
    // Probe candidates arrive after their ready message. Settled/fresh lives
    // retain asynchronous display hydration rather than waiting for this pack.
    if(probe || keys.some(key=>pending(storage.getItem(key))))await ready();
}
