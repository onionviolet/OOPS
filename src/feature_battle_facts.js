import {featurePowerFacts} from './feature_expansion_powers.js';
// Facts for the sluice tollkeeper battle. Split from feature_expansion_battle.js
// so simulation_effects.js can read them without importing the battle module (AR5).
export const FEATURE_SHIELD='featureBattleShield',FEATURE_HOOK='featureBattleHook';
export const FEATURE_BATTLE_FOES=[FEATURE_SHIELD,FEATURE_HOOK];
export function featureBattleFacts(state,context={}) {
    const foes=FEATURE_BATTLE_FOES,s=state.simulation,a=state.actors[context.actorId||'player'],fighters=foes.map(id=>s?.people[id]);
    return {...featurePowerFacts(state,context),
        'actor.feature.battle.seen':a?.facts['feature.battle.seen']===true,
        'feature.battle.foesReady':fighters.every(p=>p?.life==='alive'&&p.location==='Village'&&p.vitals?.health>1)&&foes.every(id=>state.actors[id]?.worldId===a?.worldId),
        'feature.battle.playerReady':context.vitals?.player?.health>1,
        'feature.battle.foesNeedRest':fighters.some(p=>p?.vitals&&(p.vitals.health<p.vitals.max_health||p.vitals.stamina<p.vitals.max_stamina)),
        'feature.battle.rationsReady':foes.every(id=>(state.actors[id]?.resources.watch_rations||0)>=1)};
}
