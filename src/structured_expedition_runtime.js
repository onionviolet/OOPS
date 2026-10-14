// Adapted from MIT Air wider-gameplay snapshot at:
// /Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/wider-gameplay/yet-another-idle-rpg/src/structured_expedition_runtime.js
// Copyright (c) 2021 Miktaew; see LICENSE. Reversible proposal.
import {assert, jsonData, stableId, validatePredicate} from './simulation_contracts.js';
import {previewSimulationCommand} from './simulation.js';

export const EXPEDITION_PHASES = Object.freeze(['idle','prepared','inside','resolved','returned','ended']);
const eq = (rule, fact, value) => rule?.fact === fact && rule.op === 'eq' && rule.value === value;
const mandatory = rule => rule?.all ? rule.all.flatMap(mandatory) : [rule];
const phaseValues = (rule, fact) => {
    if(rule?.fact === fact && rule.op === 'eq') return [rule.value];
    if(rule?.any && rule.any.every(r => r.fact === fact && r.op === 'eq')) return rule.any.map(r => r.value);
    return null;
};
const playerEffect=e=>e.actor == null || ['$actor','player'].includes(e.actor);
const writes = (command,key,value) => (command.effects || []).some(e => e.type === 'fact' && e.scope === 'actor' && (e.actor == null || ['$actor','player'].includes(e.actor)) && e.key === key && e.value === value);

// Discovery is held actor knowledge, never a UI-only filter. Compile these
// mandatory gates into the commands actually admitted to the shared registry.
export function compileStructuredExpeditions(d) {
    const compiled=structuredClone(d),commands=compiled.simulation?.commands || [];
    const byId=new Map(commands.map(c=>[c.id,c]));
    assert(!Object.hasOwn(compiled,'expeditions') || Array.isArray(compiled.expeditions), 'Invalid structured expeditions.');
    for(const site of compiled.expeditions || []) {
        const known={fact:`knowledge.${site.knowledgeKey}.seen`,op:'eq',value:true};
        for(const id of [site.prepareId,site.enterId,...(site.approaches || []),site.retreatId,site.extractId,site.treatmentId,site.lethalId].filter(Boolean)) {
            const c=byId.get(id);assert(c,'Unknown expedition command.');
            c.requires={all:[c.requires || {all:[]},structuredClone(known)]};
            c.visibleWhen={all:[c.visibleWhen || {all:[]},structuredClone(known)]};
            if(c.duration>0 && c.cancellation==='refund') {
                c.completionRequires={all:[c.completionRequires || {all:[]},structuredClone(c.requires)]};
                c.completionFailure='refund';
            }
        }
    }
    validateStructuredExpeditionDefinition(compiled);
    return {commands};
}

// Metadata qualifies a connected loop of existing simulation commands. It owns
// no timer, random draw, inventory, reward dispatcher or additional save domain.
export function validateStructuredExpeditionDefinition(d) {
    if(!Object.hasOwn(d,'expeditions')) return [];
    jsonData(d.expeditions);
    assert(Array.isArray(d.expeditions), 'Invalid structured expeditions.');
    const scoped = id => stableId(id) && id.startsWith(d.id+'.');
    const commands = new Map((d.simulation?.commands || []).map(c => [c.id,c]));
    const ids = new Set(), keys = new Set(), bound = new Set();
    for(const site of d.expeditions) {
        assert(site && Object.keys(site).every(k=>['id','label','phaseKey','injuryKey','knowledgeKey','locationIds','prepareId','enterId','approaches','retreatId','extractId','treatmentId','lethalId'].includes(k)), 'Unsupported expedition metadata.');
        assert(scoped(site.id) && !ids.has(site.id) && typeof site.label === 'string' && site.label.trim(), 'Invalid expedition identity.'); ids.add(site.id);
        assert([site.phaseKey,site.injuryKey,site.knowledgeKey].every(scoped) && site.phaseKey !== site.injuryKey, 'Invalid expedition keys.');
        for(const key of [site.phaseKey,site.injuryKey]) {assert(!keys.has(key),'Expeditions must have independent state keys.');keys.add(key);}
        assert(Array.isArray(site.locationIds) && site.locationIds.length && site.locationIds.every(id => d.locations?.some(l => l.id === id)), 'Invalid expedition locations.');
        assert(Array.isArray(site.approaches) && site.approaches.length >= 2, 'An expedition needs held-means and ordinary alternatives.');
        const roles = [[site.prepareId,[0,4],1],[site.enterId,[1],2],...site.approaches.map(id=>[id,[2],3]),[site.retreatId,[2,3],4],[site.extractId,[3],4],[site.treatmentId,[0,4],null],...(site.lethalId?[[site.lethalId,[2],5]]:[])];
        for(const [id,allowed,next] of roles) {
            const c=commands.get(id);
            assert(scoped(id) && !bound.has(id) && c?.actorId === 'player' && c.worldId === d.world.id, 'Invalid expedition command binding.');bound.add(id);
            assert(site.locationIds.includes(c.location), 'Expedition actions need their authored location.');
            validatePredicate(c.requires);
            const knows=r=>mandatory(r).some(p=>eq(p,`knowledge.${site.knowledgeKey}.seen`,true));
            assert(knows(c.requires) && knows(c.visibleWhen), 'Expedition actions require held discovery knowledge.');
            const guard=mandatory(c.requires).map(r=>phaseValues(r,`actor.${site.phaseKey}`)).find(Boolean);
            assert(guard?.length && guard.every(v=>allowed.includes(v)), 'Expedition action must require its current phase.');
            const phaseEffects=(c.effects || []).filter(e=>e.type==='fact' && e.scope==='actor' && e.key===site.phaseKey);
            assert(next == null ? phaseEffects.length===0 : phaseEffects.length===1 && writes(c,site.phaseKey,next), 'Expedition action must settle its phase.');
            assert((c.effects || []).every(e => e.type !== 'life' || id === site.lethalId && e.status === 'dead' && e.lethal === true && playerEffect(e)), 'Expedition cannot resurrect or silently end a life.');
        }
        const prepare=commands.get(site.prepareId),treatment=commands.get(site.treatmentId),extract=commands.get(site.extractId),lethal=commands.get(site.lethalId);
        assert(mandatory(prepare.requires).some(r=>eq(r,`actor.${site.injuryKey}`,0)), 'Treat expedition injuries before another attempt.');
        assert(writes(treatment,site.injuryKey,0) && (treatment.effects || []).some(e=>e.type==='vital' && e.key==='health' && playerEffect(e) && typeof e.amount==='number' && e.amount>0), 'Treatment must affect the actual body and injury.');
        assert(!extract.claim && extract.once !== true && (extract.effects || []).some(e=>['item','resource','xp'].includes(e.type) && typeof e.amount==='number' && e.amount>0), 'Extraction settles only the current resolved attempt, without a lifetime replay limit.');
        if(lethal)assert(/death|die|fatal|lethal/i.test(lethal.label) && /death|die|fatal|lethal/i.test(lethal.description || '') && (lethal.effects || []).some(e=>e.type==='life' && e.status==='dead' && e.lethal===true && playerEffect(e)), 'True death must be an explicit authored choice.');
    }
    return d.expeditions;
}

// A hidden site and its unchosen outcomes never enter this observer view.
export function previewStructuredExpeditions(state,d,context) {
    const sites=validateStructuredExpeditionDefinition(d),actor=state.actors.player,s=state.simulation;
    if(!s || actor.worldId !== d.world.id)return [];
    return sites.filter(site=>s.knowledge.player?.[site.knowledgeKey]).map(site=>{
        const phase=actor.facts[site.phaseKey],injury=actor.facts[site.injuryKey];
        assert(Number.isInteger(phase) && phase >= 0 && phase < EXPEDITION_PHASES.length && Number.isFinite(injury) && injury>=0, 'Invalid saved expedition facts.');
        const actionIds=[site.prepareId,site.enterId,...site.approaches,site.retreatId,site.extractId,site.treatmentId,site.lethalId].filter(Boolean);
        const actions=actionIds.map(id=>previewSimulationCommand(state,context.registry,id,{...context,actorId:'player'})).filter(q=>q.visible).map(q=>({id:q.id,label:q.label,description:q.description,eligible:q.eligible,reasons:q.reasons,duration:q.duration}));
        return {id:site.id,label:site.label,phase:EXPEDITION_PHASES[phase],injury,life:s.people.player.life,actions};
    });
}
