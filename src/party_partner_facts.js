import {PARTY_HELPER} from './native_battle_contracts.js';
// Defaults are a read projection only. Older saves gain no enrolled state.
export function partnerFacts(state) {
    const f=state.actors.player.facts;
    return {'actor.party.lp6.helped':f['party.lp6.helped']===true,
        'actor.party.lp6.history':f['party.lp6.history']||'unanswered',
        'party.lp6.willing':state.actors[PARTY_HELPER]?.facts['party.willing']===true};
}
