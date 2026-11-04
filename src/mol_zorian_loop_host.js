// Host port for the Zorian month loop (G7). One state-driven tick, through the existing continuation command route, no state of its own:
//  - anchor: every real game already holds a continuation whose first life starts in the Village, so once the seat is in the Zorian start the
//    tick branches a tethered life whose initial snapshot is this moment (day 1 in Cyoria); the restarts return there, not to the Village;
//  - an ended life restarts (`restart:initial`); a dead seat is ended first (`die:harm`); a finished month restarts the run (`loop-end:date`).
// Every step reads the state again on the next tick, so a reload between two steps (the continuation host reloads after each) loses nothing.
import {loopStartOf,monthEnded} from './mol_zorian_loop.js';
export const ZORIAN_LIFE_LABEL = 'Zorian · Cyoria';
export function createZorianLoopHost({state,continuation,command,alive,writable,busy,report}) {
    let running = false;
    const run = fn => { if(running) return; running = true; fn().catch(error => report?.(error.message)).finally(() => { running = false; }); };
    return {
        // Which step the state calls for now, or null.
        next() {
            const s = state(), c = continuation();
            if(!c || !loopStartOf(s)) return null;
            const life = c.lives?.[c.active];
            if(!life || c.challenge) return null;
            if(!loopStartOf(life.initial)) return 'branch:' + encodeURIComponent(ZORIAN_LIFE_LABEL);
            if(life.ended) return 'restart:initial';
            if(!alive()) return 'die:harm';
            return monthEnded(s) ? 'loop-end:date' : null;
        },
        tick() {
            if(!writable() || busy()) return;
            const step = this.next();
            if(step) run(() => command(step));
        }
    };
}
