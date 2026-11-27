// Readiness selects no save and grants no authority. The native loader still
// validates the exact source-backed definitions and reports incompatible data.
import {whenCastLoaded} from './book_world_lotm_cast_days.js';
const needsCast = bytes => {
    try {
        const raw=JSON.parse(bytes);
        const snapshots=typeof raw?.current==='string'?[raw.current,raw.previous].filter(x=>typeof x==='string').map(x=>JSON.parse(x)):[raw];
        // A settled cast life still needs the derived place registry at envelope
        // validation. Waiting grants no admission and leaves stored bytes intact.
        return snapshots.some(save=>!!save?.expansion?.lotm);
    } catch {return false;}
};
export async function waitForLotmSourceJobs({storage,keys,probe=false,ready=whenCastLoaded}) {
    // Probe candidates arrive after their ready message. Fresh and unrelated
    // lives retain asynchronous display hydration rather than waiting here.
    if(probe || keys.some(key=>needsCast(storage.getItem(key))))await ready();
}
