// Developer-only semantic readers. No owner initialization, resolver, scheduler,
// save writer, or random API belongs here. M1 roles do not imply a new schema.
import {HARVEST_SPECIES, HARVEST_PARTS, HARVEST_CAP, GRADED_IDS, partNames} from './harvest.js';
import {INGREDIENTS, MIXTURE_ID} from './mixture_state.js';
import {FEATURE_OBJECT_KEYS, featureObjectDefinitions} from './feature_expansion_objects.js';
import {evaluateGate} from './progression_gates.js';
import {HERB_LESSON_GATE, herbLessonFacts} from './reveal_chain.js';

const show = value => JSON.stringify(value);
const count = value => value?.count ?? (typeof value === 'number' ? value : 0);
const row = (role, ref, detail, why = '') => ({role, ref, detail, why});
const entries = value => Object.entries(value || {});
const itemLabel = key => {try {return JSON.parse(key).id || key;} catch {return key;}};
const effectLabel = e => `${Math.abs(e.amount)} ${e.type === 'item' ? itemLabel(e.key) : e.key || e.type} (${e.actor || 'player'})`;
const quantity = stock => entries(stock).map(([id,n]) => `${count(n)} × ${itemLabel(id)}`).join('; ') || 'none';

function projectHarvest({harvest: s, inventory = {}, handling = {}} = {}) {
    const rows = [];
    if (!s) return [row('source', 'HV1', 'No retained harvest owner. Inspector does not create one.')];
    for (const species of HARVEST_SPECIES) {
        const lot = s.lots[species] || [];
        if (!lot.length && s.job?.specimen.species !== species && s.last?.species !== species) continue;
        rows.push(row('source', species, `${lot.length} waiting; ${Number(s.job?.specimen.species === species)} held; cap ${HARVEST_CAP}. FIFO head: ${show(lot[0] ?? null)}`));
        rows.push(row('part template', species, partNames(species).map(p => `${p}: ${HARVEST_PARTS[p].count} ${HARVEST_PARTS[p].id}, ${HARVEST_PARTS[p].minutes} base min`).join('; ')));
    }
    rows.push(row('operation', 'HV1 scheduling', `Auto ${s.auto ? 'on' : 'off'}; automatic work currently ${handling.automaticReady ? 'eligible' : 'paused'}. Manual admission ${handling.ready ? 'eligible' : 'blocked'}. Fixed priority: ${HARVEST_SPECIES.join(' → ')}.`,
        'Automatic work can accompany combat; excludes activity, action, dialogue, sleep, reading, trade and native occupation. One tick settles at most one job, then admits the next without surplus time.'));
    rows.push(row('operation', 'HV1 overflow', `Incoming overflow: ${s.auto ? 'immediate whole settlement, no timed job' : 'left behind'}. ${s.left} left; ${s.processed} processed.`,
        'Capacity includes the held specimen. Take-one completion discards the rest. Cancel returns the held specimen to the front.'));
    if (s.job) rows.push(row('operation', s.job.specimen.key, show(s.job), `Current handling: ${show(handling.context)}. Grade uses settlement context, not admission context.`));
    for (const [key, value] of entries(inventory)) {
        let item; try { item = JSON.parse(key); } catch { continue; }
        if (GRADED_IDS.includes(item.id) && item.quality != null)
            rows.push(row('output batch', key, `${count(value)} owned; quality ${item.quality}%; completeness ${item.completeness ?? 'not retained (legacy)'}.`, 'Inventory keeps this key/count, not per-copy provenance or freshness.'));
    }
    if (s.last) {
        rows.push(row('source', s.last.key, `Consumed specimen snapshot: ${show(s.last.specimen)}`, 'From the latest settlement receipt; no longer an available carcass.'));
        rows.push(row('observation', 'HV1 latest receipt', show(s.last), 'Latest-only receipt; no reconstructed history. Draw, damage and handling are retained receipt facts.'));
        for (const o of s.last.outputs) rows.push(row('output batch', o.item_key, show(o), `Latest settlement from ${s.last.key}; receipt output count is not current owned count.`));
    }
    return rows;
}

function projectMixtures({mixtures: s, inventory = {}, clock} = {}) {
    if (!s) return [row('source', 'P2', 'No retained mixture owner. Inspector does not generate ingredient profiles or laws.')];
    const rows = INGREDIENTS.map(i => row('source', i.id, `${count(inventory[JSON.stringify({id:i.id})])} owned; profile ${show(s.profiles[i.id])}`));
    rows.push(row('part template', 'P2 revision 1', 'Whole ingredient packs; fictional-mass basis 1000. Steep or boil; oral-village@1 consumer. Product identity is composition/recipe, not a physical vial lot.'));
    for (const p of Object.values(s.products)) {
        rows.push(row('output batch', p.id, `${count(inventory[JSON.stringify({id:MIXTURE_ID,mixture:p.id})])} owned; retained product ${show(p)}`));
        if (s.methods[p.id]) rows.push(row('operation', 'Learned method', show(s.methods[p.id]), `Saved observed product: ${p.id}`));
        if (s.knowledge[p.id]) rows.push(row('observation', p.id, show(s.knowledge[p.id]), 'Retained oral experiment, separate from product truth.'));
    }
    rows.push(row('operation', 'P2 repeat', s.job ? `${Math.max(0,s.job.due-clock)} min to due; ${s.job.remaining} batches including held batch; held ${quantity(s.job.held)}; product ${s.job.product}` : 'Vessel free.',
        'Mix is immediate. Repeat holds one exact batch, settles after 3 played minutes, then attempts one new reservation. Shortage stops repeat; cancel returns held inputs.'));
    if (s.lastObservation) rows.push(row('observation', 'P2 latest observation', s.lastObservation));
    return rows;
}

function projectFeatureObjects({expansion = {}, inventory = {}} = {}) {
    const s = expansion.simulation, rows = [], templates = [];
    rows.push(row('source', 'Feature objects native stock', quantity(Object.fromEntries(Object.values(FEATURE_OBJECT_KEYS).filter(k => count(inventory[k])).map(k => [k,inventory[k]]))),
        'Carried tools and actual keyed materials. Borrowed tools remain under simulation custody, not a second stock.'));
    for (const [id,c] of entries(s?.custody)) if (id.startsWith('feature_objects.')) rows.push(row('source', id, show(c)));
    const definitions = featureObjectDefinitions.commands.filter(d => /^feature_objects\.(cut_|dry_|match_|kit_)/.test(d.id));
    for (const stage of ['cut','dry','match','kit']) {
        const ds = definitions.filter(d => d.id.startsWith(`feature_objects.${stage}_`));
        templates.push(row('part template', `Feature ${stage}`, ds.map(d => `${d.id}: ${d.duration} min\nInputs: ${d.costs.map(effectLabel).join('; ')}\nOutputs: ${d.effects.filter(e => e.type === 'item' && e.amount > 0).map(effectLabel).join('; ')}`).join('\n'),
            stage === 'kit' ? 'Kits use sound staves and sap; matching is a separate fitting branch, not a kit prerequisite.' : 'Authored command definitions, not eligibility evaluations or a new chain executor.'));
    }
    for (const j of s?.jobs || []) if (definitions.some(d => d.id === j.commandId))
        rows.push(row('operation', j.id, show(j), 'Existing simulation reservation; cancellation and completion belong to its host.'));
    for (const [id,k] of entries(s?.knowledge?.player)) if (id.startsWith('feature_objects.'))
        rows.push(row('observation', id, show(k), typeof k.value === 'string' ? k.value : 'Retained knowledge record.'));
    for (const name of ['wet','sound','matched','kit']) {
        const key = FEATURE_OBJECT_KEYS[name];
        if (count(inventory[key])) rows.push(row('output batch', key, `${count(inventory[key])} owned.`, 'Native fungible key/count; no inferred per-copy lineage.'));
    }
    return [...rows, ...templates];
}

// GTL3 (2026-10-23): shared gate descriptors with their current inputs. Author
// truth, so undiscovered conditions show here; evaluation is a pure read.
const INSPECTED_GATES = [{gate: HERB_LESSON_GATE, facts: f => herbLessonFacts(f.inventory || {}, f.expansion?.actors?.player?.facts?.['reveal.herbLesson']), completed: input => input['reveal.herbLesson'] === true}];
function projectGates(frame) {
    return INSPECTED_GATES.flatMap(({gate, facts, completed = () => false}) => {
        const input = facts(frame), r = evaluateGate(gate, input), done = completed(input);
        return [row('source', gate.id, `${gate.kind} gate, ${gate.closes}. Reason: ${gate.reason}\nDials: ${show(r.dials)}\nRoutes: ${gate.routes.map(x => `${x.id} (${x.reason} Cost: ${x.cost})`).join('; ')}${gate.overflow ? `\nOverflow: ${gate.overflow.policy}, ${gate.overflow.reason}` : ''}`),
            row('observation', `${gate.id} now`, `${done ? 'learned (persistent)' : r.met ? 'open' : 'waiting'}${done || r.known ? '' : ' (inputs unknown)'}. Inputs: ${show(input)}`,
                done ? 'Lesson already learned; repeat acquisition is not needed.' : r.met ? '' : `Author: ${r.authorReasons.join(' ')} Player sees: ${r.shown.join(' ')}`)];
    });
}

// T3 integration slot: pass a retained resolver-produced trace as ruleTrace.
// The inspector clones/displays it verbatim. Never call a resolver here or infer
// missing traces from products. This field is transient view input, not a save domain.
export function projectChains(frame = {}, {developer = false} = {}) {
    // Fail closed before reading any truth, including IDs/counts and future traces.
    if (developer !== true) return [];
    return [
        {id:'harvest', label:'HV1 carcass → graded parts', rows:projectHarvest(frame)},
        {id:'mixtures', label:'P2 ingredients → mixture → observed method', rows:projectMixtures(frame)},
        {id:'feature', label:'Feature objects: cut → dry → kit; match branch', rows:projectFeatureObjects(frame)},
        {id:'rules', label:'Resolver rule trace', rows:[row('observation','T3 trace', frame.ruleTrace == null ? 'No resolver trace supplied. Reserved for T3; no recomputation.' : show(structuredClone(frame.ruleTrace)))]},
        {id:'gates', label:'Progression gates (GTR) · inputs → open or waiting', rows:projectGates(frame)},
    ];
}
