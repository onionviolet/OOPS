import {playerActionDisclosure, projectSimulationActionLegibility} from './action_legibility.js';

const walk = (rule, visit) => {if(!rule)return;if(rule.all||rule.any)(rule.all||rule.any).forEach(r=>walk(r,visit));else if(rule.not)walk(rule.not,visit);else visit(rule);};
const ownLabel = key => {try {return JSON.parse(key).id;} catch {return null;}};
// Visible authored offers may disclose their stated requirements and fixed
// payment terms. Private participant means and hidden future output are omitted.
export function featureActionDisclosure(state, registry, context, definition) {
    const items = {}, facts = {}, people = {}, locations = {}, sites = {}, powers = {}, reasons = [];
    for(const [key,count] of Object.entries(context.gameplay?.player?.inventory || {})) {
        const label=ownLabel(key);if(label&&count>0)items[key]={known:true,label};
    }
    walk(definition.requires, r => {
        if(typeof r.reason !== 'string' || !r.reason.trim()) return;
        facts[r.fact]={known:true,label:r.reason,requirementText:r.reason};
        reasons.push({known:true,match:r.reason,text:r.reason});
    });
    for(const c of definition.costs || []) if(c.type==='item'||c.type==='transfer'||c.type==='custody') {
        const label=ownLabel(c.key);if(label)items[c.key]={known:true,label};
    }
    if(definition.location)locations[definition.location]={known:true,label:definition.location};
    if(definition.siteId)sites[definition.siteId]={known:true,label:registry.simulation.sites.get(definition.siteId)?.label || 'the agreed work site',observed:true,termsKnown:true};
    if(definition.powerId&&state.simulation?.powers.player?.[definition.powerId]?.owned)powers[definition.powerId]={known:true,label:registry.simulation.powers.get(definition.powerId)?.label || 'Your learned method'};
    for(const id of [definition.targetId,...(definition.participants||[])])if(id&&id!=='$actor'&&id!=='$target'&&id!=='player') {
        const observed=Object.keys(state.simulation?.knowledge.player||{}).some(k=>k.startsWith(`person.${id}.`));
        // An explicit co-located offer names its recipient but supplies no purse,
        // body, intent or private condition beyond the agreed terms.
        if(observed || id===definition.targetId&&definition.coLocated)people[id]={known:true,label:registry.simulation.people.get(id)?.label||'Your agreed participant',termsKnown:true};
    }
    return {...playerActionDisclosure({state,context,items,facts,people,locations,sites,powers}),reasons};
}

export function featureLegibilityRow(state,registry,context,commandId,preview) {
    const d=registry.simulation.commands.get(commandId);if(!d)return null;
    return projectSimulationActionLegibility({state,registry,context,commandId,preview,
        disclosure:featureActionDisclosure(state,registry,context,d)});
}
