// GM11 loop/reset rows: per-world reset palette in the six dials (trigger, anchor,
// carry set, cost, witnesses, exit). Data and a resolver only: the connection
// commands (cycle, restart:*) stay in continuation_state. Every row is a proposed
// default under a dial with a reason (AD5); no book text, rows are by archetype.
const freeze=v=>{for(const c of Object.values(v))if(c&&typeof c==='object')freeze(c);return Object.freeze(v);};
const KINDS=['cycle','restart:initial','restart:checkpoint'];
const TRIGGERS=['player','death','date','switch','exhaustion'];
const ANCHORS=['initial','checkpoint'];
// Carry classes for a structured carry entry. 'multiplier' is the aptitude-multiplier route (continuation_retention);
// which of soul-bound or multiplier a world uses is the row's choice, not a default here (R2).
export const CARRY_CLASSES=['soul-bound','carried','reset','multiplier'];
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
  budget:{unit:'tries',spentPer:1,effectWhenLow:'a short budget makes the first run a scouting run'},
  reason:'Proposed archetype: knowledge-only carry, so skill must be rebuilt; a world widens carry per its mechanism.'},
 // Row v2 (AB11, proposal): the seat's month loop, keyed per start so the visitor start keeps no loop. Sources: progression gates MLG24-MLG28.
 'book.mol.cyoria#zorian':{label:'Month loop',trigger:'date',command:'cycle',anchor:'initial',
  triggers:[{kind:'date',anchor:'initial',command:'cycle'},{kind:'death',anchor:'initial',command:'restart:initial'},{kind:'switch',anchor:'initial',command:'restart:initial'}],
  carry:[
   {what:'Memory of every run',class:'soul-bound',carrier:'the self',reason:'The soul crosses the cut, so memory rides on it (c6 p3, c55).'},
   {what:'Trained skill and reserve',class:'soul-bound',carrier:'the self',reason:'Proposed first-slice default; soul-bound or an aptitude multiplier is Weibao\'s open call (R2), so this entry names the class and a world may swap it for multiplier.'},
   {what:'Soul damage',class:'soul-bound',carrier:'the self',reason:'Damage to the soul persists in full (c55).'},
   {what:'What allies know of you',class:'carried',carrier:'notebook',reason:'A notebook rides on the soul and can be lost (c78 p133).'},
   {what:'Proof of identity to an ally',class:'carried',carrier:'code phrase',reason:'A phrase plus predictions from a prior run proves who you are (c49, c53).'},
   {what:'A stored form or lesson',class:'carried',carrier:'memory packet',reason:'Packets decay and take long effort to open (c17 p147).'},
   {what:'Items and money',class:'reset',reason:'The world returns to the iteration start (c55).'},
   {what:'Body, injuries and bought standing',class:'reset',reason:'Bodies reset to the iteration start (c55).'}],
  budget:{unit:'iterations',remaining:52,spentPer:1,effectWhenLow:'the keeper may inspect the loop; the loop ends when the budget empties',reason:'Stated by the keeper at c55 (967 used, 52 left); idle restarts spend it too (c84).'},
  cost:'Each run spends one iteration of a finite budget, whatever ended it; the world resets, the soul does not.',
  witnesses:[{who:'a conferred temporary looper',how:'a marker conferred from outside, remembers across runs',since:'the run it was conferred',lapses:{after:6,unit:'runs',reason:'Temporary markers last up to 6 iterations (c55, c105 p14).'}},
   {who:'an ally won again by code phrase and notebook',how:'told each run, proved by the phrase',since:'the run they were won',lapses:null}],
  staleness:{sourceKind:'foreknowledge',reliableDays:3,after:'divergence',reason:'Routines repeat until nudged, then cascade; a few days stay reliable (c49). Inertia is weak in this world.'},
  exit:[{when:'the loop\'s cause is broken or the keeper\'s gate is opened',cost:'lives, abilities or an obligation (c90-c92)'},
   {when:'a death-pact exit',cost:'a kill switch, one person at a time (c90)'},
   {when:'the budget empties',cost:'the loop ends with the run unfinished'}],
  reason:'Proposed (AD32): Zorian\'s start on the Cyoria pack; fills every v2 field from the P1 paper test.'}
});
// Keys: a world's own row is `worldId`; a start's row is `worldId#startId` (for example book.mol.cyoria#zorian). A start with no row of its own
// falls back to the world's row, then to the default, so a start never has to define one.
export const loopKey=(worldId,startId)=>startId?`${worldId}#${startId}`:worldId;
export function loopRule(worldId,startId){
 if(startId&&Object.hasOwn(LOOP_RESETS,loopKey(worldId,startId)))return LOOP_RESETS[loopKey(worldId,startId)];
 return Object.hasOwn(LOOP_RESETS,worldId)?LOOP_RESETS[worldId]:LOOP_RESETS.default;
}
// The row's triggers as a list; a row with the old single trigger/anchor/command is a one-item list.
export const rowTriggers=r=>r.triggers??[{kind:r.trigger,anchor:r.anchor,command:r.command}];
const text=v=>typeof v==='string'&&v!=='';
const entries=(v,ok)=>Array.isArray(v)&&v.every(x=>x&&typeof x==='object'&&ok(x));
function validV2(r){
 const t=r.triggers===undefined||(Array.isArray(r.triggers)&&r.triggers.length>0&&r.triggers.every(x=>x&&TRIGGERS.includes(x.kind)&&ANCHORS.includes(x.anchor)&&(x.command===undefined||KINDS.includes(x.command)))&&
  r.triggers.some(x=>x.kind===r.trigger));
 const c=r.carry.every(x=>typeof x==='string'||(x&&typeof x==='object'&&text(x.what)&&CARRY_CLASSES.includes(x.class)&&text(x.reason)&&(x.class!=='carried'||text(x.carrier))));
 const b=r.budget===undefined||(r.budget&&text(r.budget.unit)&&['remaining','spentPer'].every(k=>r.budget[k]===undefined||Number.isFinite(r.budget[k])));
 const w=typeof r.witnesses==='string'||entries(r.witnesses,x=>text(x.who)&&text(x.how));
 const s=r.staleness===undefined||(r.staleness&&text(r.staleness.sourceKind)&&Number.isFinite(r.staleness.reliableDays));
 const e=typeof r.exit==='string'||(entries(r.exit,x=>text(x.when)&&text(x.cost))&&r.exit.length>0);
 return t&&c&&b&&w&&s&&e;
}
export function validateLoopRows(rows=LOOP_RESETS){
 for(const [id,r] of Object.entries(rows)){
  const ok=['label','trigger','command','anchor','carry','cost','witnesses','exit','reason'].every(k=>r[k]!==undefined&&r[k]!=='')&&
   KINDS.includes(r.command)&&TRIGGERS.includes(r.trigger)&&Array.isArray(r.carry)&&ANCHORS.includes(r.anchor)&&validV2(r);
  if(!ok)throw Error(`Invalid loop row: ${id}`);
 }
 return rows;
}
// Which event ends the run when several fall in the same window (R1): the earliest in the clock wins, a tie counts as the date end,
// then the remaining ties keep the order given. events: [{kind, at}].
export function endingEvent(events){
 const list=[...events].filter(e=>e&&TRIGGERS.includes(e.kind)&&Number.isFinite(e.at));
 if(!list.length)return null;
 return list.reduce((a,b)=>b.at<a.at||(b.at===a.at&&b.kind==='date'&&a.kind!=='date')?b:a);
}
// Which connection command answers a trigger now, or null (the row says no). Pass `events` instead of `trigger` when more than one
// thing could end the run: the earliest wins (endingEvent) and a death event means the life ended.
export function loopPlan(worldId,{trigger,events,lifeEnded=false,hasCheckpoint=false,startId}){
 const r=loopRule(worldId,startId);
 if(events){const w=endingEvent(events);if(!w)return null;trigger=w.kind;lifeEnded=lifeEnded||w.kind==='death';}
 const t=rowTriggers(r).find(x=>x.kind===trigger);
 if(!t)return null;
 if(t.kind==='death'&&!lifeEnded)return null;
 const command=t.command??r.command;
 if(t.anchor==='checkpoint'&&!hasCheckpoint)return {command:t.kind==='death'?'restart:initial':'cycle',fellBack:true,carry:r.carry,trigger};
 return {command,fellBack:false,carry:r.carry,trigger};
}
validateLoopRows();
