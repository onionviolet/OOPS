// GM11 loop/reset rows: per-world reset palette in the six dials (trigger, anchor,
// carry set, cost, witnesses, exit). Data and a resolver only: the connection
// commands (cycle, restart:*) stay in continuation_state. Every row is a proposed
// default under a dial with a reason (AD5); no book text, rows are by archetype.
const freeze=v=>{for(const c of Object.values(v))if(c&&typeof c==='object')freeze(c);return Object.freeze(v);};
const KINDS=['cycle','restart:initial','restart:checkpoint'];
export const LOOP_RESETS=freeze({
 default:{label:'Deliberate repetition',trigger:'player',command:'cycle',anchor:'checkpoint',
  carry:['knowledge','mastery','retention','preferences'],cost:'Time passed in the abandoned run is gone from the world; the dial is the connection cost in the continuation row.',
  witnesses:'none: the world does not remember',exit:'the player stops, or the checkpoint no longer lies in the past',
  reason:'Proposed default: the existing deliberate loop (AD12). A world replaces any dial.'},
 'book.lotm.tingen':{label:'Restart after a death',trigger:'death',command:'restart:initial',anchor:'initial',
  carry:['knowledge','mastery','retention','preferences'],cost:'This life ends for good; only this world and the seat slice rewind, other worlds and the Village keep state.',
  witnesses:'people the lead met this life forget; sealed matters stay sealed',exit:'choose a later checkpoint, or stop restarting',
  reason:'Proposed: scoped restart (L9 slice 2). Loss of control and other deaths use this row.'},
 'loop.time-bound':{label:'Fixed-length loop',trigger:'date',command:'cycle',anchor:'initial',
  carry:['knowledge','mastery','retention'],cost:'Everything bought or built in the run is lost; a skill is kept only through mastery carry.',
  witnesses:'one or two others may keep memory, each by an in-world reason and cost',exit:'break the cause of the loop, or reach the final date unrepeated',
  reason:'Proposed archetype: the world sets the length and the exit mechanism; the default carries knowledge and trained mastery, not stock.'},
 'loop.perfect-run':{label:'Death-triggered retry',trigger:'death',command:'restart:checkpoint',anchor:'checkpoint',
  carry:['knowledge'],cost:'Each retry spends from a world-set budget of tries; a short budget makes the first run a scouting run.',
  witnesses:'none by default',exit:'finish the run, or run out of tries',
  reason:'Proposed archetype: knowledge-only carry, so skill must be rebuilt; a world widens carry per its mechanism.'}
});
export function loopRule(worldId){
 return Object.hasOwn(LOOP_RESETS,worldId)?LOOP_RESETS[worldId]:LOOP_RESETS.default;
}
export function validateLoopRows(rows=LOOP_RESETS){
 for(const [id,r] of Object.entries(rows)){
  const ok=['label','trigger','command','anchor','carry','cost','witnesses','exit','reason'].every(k=>r[k]!==undefined&&r[k]!=='')&&
   KINDS.includes(r.command)&&['player','death','date'].includes(r.trigger)&&Array.isArray(r.carry)&&['initial','checkpoint'].includes(r.anchor);
  if(!ok)throw Error(`Invalid loop row: ${id}`);
 }
 return rows;
}
// Which connection command answers a trigger now, or null (the row says no).
export function loopPlan(worldId,{trigger,lifeEnded=false,hasCheckpoint=false}){
 const r=loopRule(worldId);
 if(r.trigger!==trigger)return null;
 if(r.trigger==='death'&&!lifeEnded)return null;
 if(r.anchor==='checkpoint'&&!hasCheckpoint)return {command:r.trigger==='death'?'restart:initial':'cycle',fellBack:true,carry:r.carry};
 return {command:r.command,fellBack:false,carry:r.carry};
}
validateLoopRows();
