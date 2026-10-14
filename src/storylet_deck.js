import {assert, meets, natural} from './simulation_contracts.js';
import {drawUnit,scopedStream} from './seeded_streams.js';
import {deriveSimulationSeed} from './simulation_resolution.js';

export const STORYLET_DECKS = [
    {id:'village.daily',interval:12,quiet:3}, {id:'village.people',interval:18,quiet:4},
    {id:'village.chances',interval:30,quiet:4}, {id:'village.threats',interval:36,quiet:6},
];
const enabled = state => state.actors.player.facts['storylets.enabled']===true;
const object = value => value && typeof value==='object' && !Array.isArray(value);
export function initializeStoryletDecks(state) {
    if(!state.simulation || !enabled(state) || state.simulation.decks) return;
    // The old shower remains registered for legacy pending instances; new draws
    // use the deck after opt-in, avoiding a second independent shower director.
    delete state.simulation.checks['village.shower'];
    state.simulation.storyletSchema=1;
    state.simulation.decks=Object.fromEntries(STORYLET_DECKS.map(d=>[d.id,{due:state.clock+d.interval,interval:d.interval,
        rng:deriveSimulationSeed(state.simulation.seed,`deck:${d.id}`),...(state.streams?{randomSource:'named'}:{}),ticks:0,drawn:0,nulls:0,cards:{},miss:{},lastFamily:null,receipts:[]}]));
}
export function nextStoryletBoundary(state) {
    if(!state.simulation || !enabled(state)) return Infinity;
    if(!state.simulation.decks) return state.clock;
    return Math.min(...Object.values(state.simulation.decks).map(d=>d.due));
}
export function storyletFacts(facts) {
    return {'actor.tag.dog':false,'actor.storylet.roof.fixed':false,'actor.storylet.fever.treated':false,
        'actor.storylet.fever.contained':false,'actor.storylet.scouts.warned':false,
        [`item.${JSON.stringify({id:'Survey rope'})}`]:0,...facts};
}
export function storyletCandidates(state,registry,deckId,factsFor) {
    const record=state.simulation.decks[deckId];
    return [...registry.simulation.events.values()].filter(d=>d.storylet?.deck===deckId).sort((a,b)=>a.id.localeCompare(b.id)).flatMap(d=>{
        const card=record.cards[d.id], config=d.storylet, facts=storyletFacts(factsFor(d));
        if(config.once && card?.seen || card && state.clock < card.last+config.cooldown || !meets(d.requires,facts) ||
            Object.values(state.simulation.events).some(e=>e.definitionId===d.id && e.status==='open')) return [];
        let weight=config.weight.base;
        for(const plus of config.weight.plus || []) if(meets(plus.when,facts)) weight+=plus.add;
        weight=Math.max(0,weight)*Math.max(0.1,0.6**(card?.seen || 0));
        if(config.family===record.lastFamily) weight*=0.5;
        weight*=Math.min(4,1+0.25*Math.max(0,(record.miss[config.family] || 0)-6));
        return weight>0?[{definition:d,weight}]:[];
    });
}
function roll(record) {
    let n=record.rng; n^=n<<13; n^=n>>>17; n^=n<<5; record.rng=n>>>0;
    return record.rng/0x100000000;
}
// Called only at the existing common-clock boundary; each tick compares a deck.
export function advanceStoryletDecks(state,registry,factsFor,emit) {
    initializeStoryletDecks(state);
    if(!enabled(state))return 0;
    validateStoryletState(state);
    let work=0;
    for(const config of STORYLET_DECKS) {
        const record=state.simulation.decks[config.id];
        // Existing scheduler owns catch-up; never turn absence into retroactive draws.
        if(record.due>state.clock)continue;
        record.due=state.clock+record.interval; record.ticks++; work++;
        const location=factsFor({actorId:'player'} )['actor.location'];
        if(state.actors.player.worldId!=='base.frontier' || location!=='Village' || state.simulation.people.player.life!=='alive')continue;
        if(Object.values(state.simulation.events).filter(e=>e.status==='open' && e.storylet?.deck===config.id).length>=3)continue;
        const candidates=storyletCandidates(state,registry,config.id,factsFor);
        const total=config.quiet+candidates.reduce((n,c)=>n+c.weight,0), r=record.randomSource==='named'?drawUnit(state,scopedStream(`deck:${config.id}`),`tick:${record.ticks}`):roll(record);
        let cursor=r*total, selected=null;
        for(const candidate of candidates) {cursor-=candidate.weight;if(cursor<0){selected=candidate.definition;break;}}
        const receipt={at:state.clock,tick:record.ticks,roll:r,total,cardId:selected?.id || null,
            weights:candidates.map(c=>({id:c.definition.id,weight:c.weight})).sort((a,b)=>b.weight-a.weight).slice(0,3)};
        record.receipts.push(receipt);record.receipts=record.receipts.slice(-20);
        const families=new Set(candidates.map(c=>c.definition.storylet.family));
        for(const family of families)record.miss[family]=selected?.storylet.family===family?0:(record.miss[family]||0)+1;
        if(!selected){record.nulls++;continue;}
        const card=record.cards[selected.id] ||= {seen:0,last:0};card.seen++;card.last=state.clock;
        record.drawn++;record.lastFamily=selected.storylet.family;
        emit(selected,receipt);
    }
    return work;
}
export function validateStoryletState(state) {
    const s=state?.simulation;if(!s)return;
    if(s.decks==null && s.storyletSchema==null) {
        assert(!Object.values(s.events || {}).some(e=>e.storylet || e.nonBlocking),'Storylet events require a saved deck.');
        return;
    }
    assert(enabled(state) && s.storyletSchema===1 && object(s.decks),'Invalid storylet deck schema.');
    assert(Object.keys(s.decks).length===STORYLET_DECKS.length,'Unsupported storylet decks.');
    for(const definition of STORYLET_DECKS) {
        const d=s.decks[definition.id];
        assert(d.randomSource==null || d.randomSource==='named' && state.streams,'Invalid storylet random source.');
        assert(object(d) && natural(d.due) && d.due>=state.clock && d.interval===definition.interval && natural(d.rng) && d.rng>0 && d.rng<=0xffffffff &&
            [d.ticks,d.drawn,d.nulls].every(natural) && d.drawn+d.nulls<=d.ticks && object(d.cards) && object(d.miss) && Array.isArray(d.receipts) && d.receipts.length<=20,'Invalid saved storylet deck.');
        assert(Object.keys(d.cards).length<=400,'Storylet card history is too large.');
        for(const [id,c] of Object.entries(d.cards))assert(id.startsWith('village.') && object(c) && natural(c.seen) && c.seen>0 && natural(c.last) && c.last<=state.clock,'Invalid saved storylet cooldown.');
        for(const n of Object.values(d.miss))assert(natural(n),'Invalid storylet pity.');
        for(const r of d.receipts)assert(object(r) && natural(r.at) && r.at<=state.clock && natural(r.tick) && r.tick<=d.ticks && Number.isFinite(r.roll) && r.roll>=0 && r.roll<1 && Number.isFinite(r.total) && r.total>0 && Array.isArray(r.weights) && r.weights.length<=3,'Invalid storylet receipt.');
    }
    for(const event of Object.values(s.events))if(event.storylet || event.nonBlocking) {
        assert(event.storylet && s.decks[event.storylet.deck] && ['ambient','soft','hard','crisis'].includes(event.storylet.urgency) &&
            (event.mode!=='decision' || event.nonBlocking===true && natural(event.expiresAt) && event.expiresAt>event.at),'Invalid nonblocking storylet.');
    }
}
