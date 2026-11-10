// Host port for the Zorian month loop (G7). One state-driven tick, through the existing continuation command route, no state of its own:
//  - anchor: every real game already holds a continuation whose first life starts in the Village, so once the seat is in the Zorian start the
//    tick branches a tethered life whose initial snapshot is this moment (day 1 in Cyoria); the restarts return there, not to the Village;
//  - an ended life restarts (`restart:initial`); otherwise the loop row selects the first due ending.
// Every step reads the state again on the next tick, so a reload between two steps (the continuation host reloads after each) loses nothing.
import {loopStartOf,monthEndAt,MOL_WORLD} from './mol_zorian_loop.js';
import {loopPlan} from './harm_loops.js';
export const ZORIAN_LIFE_LABEL = 'Zorian · Cyoria';
export function createZorianLoopHost({state,continuation,command,alive,writable,busy,report}) {
    let running = false;
    const run = fn => { if(running) return; running = true; fn().catch(error => report?.(error.message)).finally(() => { running = false; }); };
    return {
        // Which step the state calls for now, or null.
        next() {
            const s = state(), c = continuation();
            const startId = loopStartOf(s);
            if(!c || !startId) return null;
            const life = c.lives?.[c.active];
            if(!life || c.challenge) return null;
            if(!loopStartOf(life.initial)) return 'branch:' + encodeURIComponent(ZORIAN_LIFE_LABEL);
            if(s.simulation?.people.player.life === 'dead' &&
                s.simulation.knowledge.player?.['book.mol.zorian.arc1.arc_one_finished']) return null;
            if(life.ended) return 'restart:initial';
            const events = [];
            const dateAt = monthEndAt(s);
            if(dateAt !== null) events.push({kind:'date',at:dateAt});
            // The chronicle keeps an exact end time. For a bare native dead
            // flag the current clock is the first evidence the host has.
            const seat = s.simulation?.people.player;
            if(!alive() || seat?.life === 'dead') events.push({kind:'death',at:seat?.lifeCause?.at ?? s.chronicle?.life.endedAt ?? s.clock});
            const end = loopPlan(MOL_WORLD,{startId,events});
            if(!end) return null;
            return end.trigger==='date' ? 'loop-end:date' : 'die:harm';
        },
        tick() {
            if(!writable() || busy()) return;
            const step = this.next();
            if(step) run(() => command(step));
        }
    };
}
