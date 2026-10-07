import {bodyFacts} from './body_progression.js';

const MIRI='repositories.miri', METHOD='repositories.wick_control';
const local=state=>state.actors.player.worldId==='base.frontier'&&!state.realmPrototype?.activeVisitId;

// Small current-state query, consumed inside simulationFacts as well as host
// previews. It creates no facts, supplies, clock, observation or enrollment.
export function repositoryAbsorptionFacts(state, context) {
    const s=state.simulation, miri=s?.people[MIRI], a=state.actors[MIRI], actorId=context.actorId || 'player';
    const location=context.facts?.location || s?.people[actorId]?.location;
    const vitals=context.vitals?.player || (actorId==='player'&&context.vitals?.stamina!=null?context.vitals:null);
    const supported=!!miri&&miri.life==='alive'&&a?.worldId===state.actors[actorId]?.worldId&&miri.location===location&&
        miri.body?.hands>=1&&miri.vitals?.health>=2&&a.facts['repositories.willing']===true;
    const source=a?.sources[METHOD], faculty=s?.faculties[MIRI]?.[METHOD];
    return {
        'repositories.clockSupported':local(state),
        'repositories.playerHandsUsable':(s?.people.player?.body?.hands ?? 2)>=2&&!bodyFacts(state)['body.handsTender'],
        'repositories.miriSupported':supported,
        'repositories.miriMethodSupported':supported&&!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&
            !!faculty?.awakened&&!!faculty.active&&!faculty.suppressed&&s?.knowledge[MIRI]?.['repositories.wick_method']?.stage==='understood',
        'repositories.waterOffered':supported&&a.resources.water>0,
        'repositories.needsStamina':Number.isFinite(vitals?.stamina)&&Number.isFinite(vitals?.max_stamina)&&vitals.stamina<vitals.max_stamina,
        [`power.${METHOD}.owned`]:!!s?.powers.player?.[METHOD]?.owned,
    };
}

// Join the existing common clock's before-increment seam. Unaccepted offers
// freeze while native Frontier contact is unsupported. Paid jobs retain their
// frozen due times and explicit completion/refund support policy.
export function retainRepositoryAbsorptionWindows(state, from, through) {
    if(local(state))return;
    for(const id of ['repositories.lantern','repositories.pump']) {
        const offer=state.simulation?.situations?.[id];
        if(offer&&['offered','exposed'].includes(offer.phase)&&offer.deadline>from)offer.deadline+=through-from;
    }
}
