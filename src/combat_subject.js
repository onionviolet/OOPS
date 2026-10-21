// Runtime occurrence identity, independent of reusable UI slots and template ids.
// Weak maps do not expose model truth, persist saves, or consume gameplay RNG.
const encounters=new WeakMap();let nextEncounter=0;
export function encounterSerial(combat) {
    if(!combat || typeof combat!=='object') return 0;
    if(!encounters.has(combat)) encounters.set(combat,{id:++nextEncounter,next:0,actors:new WeakMap()});
    return encounters.get(combat).id;
}
export function combatSubject(combat,fighter) {
    if(!combat || !fighter) return null;
    encounterSerial(combat);
    const encounter=encounters.get(combat);
    if(!encounter.actors.has(fighter))encounter.actors.set(fighter,`encounter-${encounter.id}-fighter-${++encounter.next}`);
    return encounter.actors.get(fighter);
}
// Explicit selection keeps an ended reference when its actor disappears. New
// current opponents require another deliberate selection, even in the same slot.
export function retainCombatInspection(opponents,selected,previous) {
    if(selected==null)return opponents[0]||null;
    const current=opponents.find(o=>o.id===selected);
    if(current)return current;
    return previous?.id===selected?{...previous,ended:true,role:'Last observed opponent · inspection ended',cycle:null}:null;
}
