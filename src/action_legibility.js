// Read-only action terms and retained observations. Disclosure is explicit:
// a registry entry, a private fact or a raw evaluator error is not knowledge.
import {evaluateRule} from './rules.js';
import {previewSimulationCommand, simulationFacts} from './simulation.js';
import {energyCharge} from './energy_resources.js';

export const ACTION_LEGIBILITY_VERSION = 2;
const text = value => typeof value === 'string' ? value.trim() : '';
const list = value => Array.isArray(value) ? value : [];
const number = value => Number.isFinite(value) && value >= 0;
const known = value => value?.known === true;
const named = value => known(value) && !!text(value.label);
const describe = (value, fallback) => known(value) ? text(value.text) || fallback : '';
const actorOf = (value, context) => !value || value === '$actor' ? context.actorId
    : value === '$target' ? context.targetId : value;
const unique = rows => [...new Map(rows.filter(r => r && text(r.text)).map(r => [r.text, r])).values()];
const qualified = rows => unique(list(rows).filter(known).map((r, i) => ({id: text(r.id) || `known-${i}`, text: text(r.text),
    ...(typeof r.met === 'boolean' ? {met: r.met} : {})})));
const cancellation = policy => ({policy: ['refund', 'forfeit', 'none'].includes(policy) ? policy : 'none',
    canCancel: ['refund', 'forfeit'].includes(policy),
    text: policy === 'refund' ? 'Cancelling returns reserved inputs. Time already played is not returned.'
        : policy === 'forfeit' ? 'Cancelling keeps spent inputs spent. Time already played is not returned.'
        : 'This accepted work has no cancellation option.'});

/** Only observer-qualified leaves become requirements. A hidden alternative
 * never reveals its identity, threshold, count or current truth through an OR.
 * A descriptor may supply requirementText/notText; otherwise its public label
 * and known threshold express the existing evaluator's actual comparison. */
export function projectKnownActionRequirements(rule, facts = {}, disclosure = {}) {
    const walk = (r, path) => {
        if(!r) return {rows: [], complete: true, truthKnown: true, met: true};
        if(r.all) {
            const children = list(r.all).map((c, i) => walk(c, `${path}-${i}`));
            return {rows: children.flatMap(c => c.rows), complete: children.every(c => c.complete),
                truthKnown: children.every(c => c.truthKnown) || children.some(c => c.truthKnown && !c.met),
                met: children.every(c => c.truthKnown && c.met)};
        }
        if(r.any) {
            const children = list(r.any).map((c, i) => walk(c, `${path}-${i}`));
            const visible = children.filter(c => c.rows.length), complete = children.every(c => c.complete);
            if(!visible.length) return {rows: [], complete: false, met: false};
            const met = visible.some(c => c.truthKnown && c.met);
            const truthKnown = met || complete && children.every(c => c.truthKnown);
            const labels = visible.map(c => c.rows.map(x => x.text).join(' and '));
            return {rows: [{id: path, text: `${complete ? 'One of' : 'Known ways to prepare'}: ${labels.join('; ')}.`,
                ...(truthKnown ? {met} : {})}], complete, truthKnown, met};
        }
        if(r.not) {
            // Do not invert a partially disclosed composite into a false claim.
            const child = walk(r.not, `${path}-not`);
            if(!child.complete || !child.rows.length) return {rows: [], complete: false, met: false};
            const d = disclosure.facts?.[r.not.fact];
            let result;
            try {result = evaluateRule(r, facts);} catch {return {rows: [], complete: false, met: false};}
            return {rows: [{id: path, text: known(d) && text(d.notText) || `Must not apply: ${child.rows.map(x => x.text).join(' and ')}.`,
                ...(child.truthKnown && result.known ? {met: result.met} : {})}], complete: true,
                truthKnown: child.truthKnown && result.known, met: child.truthKnown && result.known && result.met};
        }
        const d = disclosure.facts?.[r.fact];
        if(!named(d)) return {rows: [], complete: false, met: false};
        let result;
        try {result = evaluateRule(r, facts);} catch {return {rows: [], complete: false, met: false};}
        const value = r.value;
        // IDs and hidden enum values require an explicit value label or text.
        const suffix = r.op === 'gte' && number(value) ? `at least ${value}`
            : r.op === 'lte' && number(value) ? `at most ${value}`
            : r.op === 'eq' && typeof value === 'boolean' ? value ? '' : 'must be absent'
            : r.op === 'eq' && Number.isFinite(value) ? `equal to ${value}`
            : r.op === 'eq' && text(d.values?.[value]) ? d.values[value] : null;
        const requirementText = text(d.requirementText) || (suffix !== null ? `${d.label}${suffix ? `: ${suffix}` : ''}.` : '');
        if(!requirementText) return {rows: [], complete: false, met: false};
        const truthKnown = d.valueKnown === true && result.known;
        return {rows: [{id: path, text: requirementText, ...(truthKnown ? {met: result.met} : {})}], complete: true,
            truthKnown, met: truthKnown && result.met};
    };
    return unique(walk(rule, 'requirement').rows);
}

function costDescriptor(effect, disclosure, context) {
    const actorId = actorOf(effect.actor || effect.from, context), own = actorId === (context.observerId || context.actorId);
    const person = disclosure.people?.[actorId];
    // An introduced person is not permission to disclose their private means.
    if(!own && !(named(person) && person.termsKnown === true)) return null;
    const prefix = own ? '' : `${person.label}: `;
    const kind = effect.type;
    const d = kind === 'item' || kind === 'transfer' || kind === 'custody' ? disclosure.items?.[effect.key]
        : kind === 'resource' ? disclosure.resources?.[effect.key]
        : kind === 'vital' ? disclosure.vitals?.[effect.key]
        : kind === 'energy' ? disclosure.energies?.[effect.energyId] : null;
    if(!named(d)) return null;
    let amount = ['transfer', 'custody'].includes(kind) ? effect.count
        : kind === 'energy' ? null : Number.isFinite(effect.amount) && effect.amount < 0 ? -effect.amount : null;
    if(kind === 'energy') {
        if(effect.operation !== 'use' || !number(effect.output) || !number(effect.control)) return null;
        // Use the actual acquired, frozen policy, never a new registry default.
        if(d.policy) {try {amount = energyCharge(d.policy, effect);} catch {return null;}}
        const usage = amount !== null ? `${amount} ${d.label}` : `${d.label}: output ${effect.output}, control ${effect.control}`;
        return {text: `${prefix}${usage}${d.policy && number(d.policy.strainPerUse) ? `; ${d.policy.strainPerUse} strain` : ''}.`, amount,
            available: own && number(d.available) ? d.available : null, label: d.label, kind};
    }
    if(!number(amount) || amount === 0) return null;
    const destination = effect.to && disclosure.people?.[actorOf(effect.to, context)];
    const suffix = ['transfer', 'custody'].includes(kind) && named(destination) ? ` to ${destination.label}` : '';
    return {text: `${prefix}${amount} ${d.label}${suffix}.`, amount,
        available: own && number(d.available) ? d.available : null, label: d.label, kind};
}

/** Numbers in an eligible preview are a current quote. Fixed definition costs
 * on an early rejected preview are only known terms. Formula costs are omitted
 * until resolved by the real evaluator; effects/outcomes are never inspected. */
export function projectActionCosts(costs = [], disclosure = {}, context = {actorId: 'player'}) {
    return list(costs).map((effect, i) => {
        const row = costDescriptor(effect, disclosure, context);
        return row ? {id: `cost-${i}`, text: `${row.text}${number(row.available) ? ` You have ${row.available} available.` : ''}`} : null;
    }).filter(Boolean);
}

const safeReasons = new Map([
    ['Finish your current activity first.', 'Finish or cancel your current activity before starting this action.'],
    ['Resolve the waiting encounter or life ending first.', 'Resolve your waiting encounter or life ending first.'],
    ['This action has already been completed.', 'You have already completed this action.'],
    ['Borrowed goods cannot be consumed without an explicit custody policy.', 'These borrowed goods cannot be spent under the current terms.'],
    ['Borrowed goods cannot be transferred to another claimant.', 'These borrowed goods cannot be passed on under the current terms.'],
    ['Unequip the item before consuming it.', 'Put the required item in your bag before spending it.'],
    ['Unequip the item before transfer.', 'Put the required item in your bag before handing it over.'],
    ['This local work has no supported clock or contact while you are in another realm.', 'Return from the other realm before taking this local work.'],
    ['That participant is unavailable.', 'Contact for this action is currently unavailable.'],
    ['Meet the participant at their location.', 'Meet your agreed participant before taking this action.'],
    ['A participating person is unavailable or already working.', 'The agreed participants cannot currently take this work together.'],
]);

function evaluatorBlockers(preview, definition, requirements, disclosure, context) {
    if(preview?.eligible) return [];
    const rows = requirements.filter(r => r.met === false).map(r => ({id: `blocked-${r.id}`, text: r.text}));
    for(const [i, reason] of list(preview?.reasons).entries()) {
        const authorized = list(disclosure.reasons).find(r => known(r) && r.match === reason);
        let message = text(authorized?.text) || safeReasons.get(reason);
        const ownNamedCost = list(preview?.costs).concat(list(definition?.costs)).some(e =>
            actorOf(e.actor || e.from, context) === context.actorId && named(disclosure.items?.[e.key]));
        if(!authorized && /^(Borrowed goods|Unequip the item)/.test(reason) && !ownNamedCost) message = null;
        if(!message && definition?.location && reason === `Return to ${definition.location}.` && named(disclosure.locations?.[definition.location])) {
            message = `Return to ${disclosure.locations[definition.location].label}.`;
        }
        if(!message && reason === 'The work site is at capacity.' && named(disclosure.sites?.[definition?.siteId]) && disclosure.sites[definition.siteId].observed === true
            && (!definition.location || context.facts?.location === definition.location)) {
            message = `${disclosure.sites[definition.siteId].label} has no free place for this work now.`;
        }
        if(!message && /^Power recovers in \d+(?:\.\d+)? game minutes\.$/.test(reason) && named(disclosure.powers?.[definition?.powerId])) {
            message = reason.replace('Power', disclosure.powers[definition.powerId].label).replace('game minutes', 'played minutes');
        }
        if(!message) for(const effect of list(preview?.costs).length ? preview.costs : list(definition?.costs)) {
            if(actorOf(effect.actor || effect.from, context) !== context.actorId) continue;
            const d = costDescriptor(effect, disclosure, context);
            if(d && reason === `Insufficient ${effect.key}.`) {message = `You need ${d.amount} ${d.label} available for this action.`; break;}
        }
        if(message) rows.push({id: `evaluator-${i}`, text: message});
    }
    rows.push(...qualified(disclosure.blockers));
    if(!rows.length) rows.push({id: 'contact', text: 'This action is not available under the current conditions. Review the known preparation or choose another action.'});
    return unique(rows);
}

function reservations(definition, disclosure, context) {
    const rows = qualified(disclosure.reservations);
    const observerId=context.observerId||context.actorId,owner=disclosure.people?.[context.actorId];
    if(definition?.duration > 0 || definition?.due != null) {
        if(observerId===context.actorId)rows.push({id:'attention',text:'Your attention is reserved while the accepted work runs.'});
        else if(named(owner)&&owner.termsKnown===true)rows.push({id:'attention',text:`${owner.label} is reserved for this accepted work.`});
    }
    for(const [i, id] of list(definition?.participants).entries()) {
        const actorId = actorOf(id, context), d = disclosure.people?.[actorId];
        if(actorId === observerId) rows.push({id: `participant-${i}`, text: 'Your attention is reserved while the accepted work runs.'});
        else if(named(d) && d.termsKnown === true) rows.push({id: `participant-${i}`, text: `${d.label} is reserved for this accepted work.`});
    }
    const site = disclosure.sites?.[definition?.siteId];
    if(named(site) && site.termsKnown === true) rows.push({id: 'site', text: `A place at ${site.label} is reserved for this work.`});
    return unique(rows);
}

/** Core projection also accepts external evaluators (Ink choices, native
 * combat, passages or work-plan cursors). Hosts qualify discovery, text and
 * known metadata and supply the real eligible result, never a guessed result. */
export function projectActionLegibility({id, label, description = '', discovered = false, unlocked = true,
    preview = {}, definition = {}, facts = {}, disclosure = {}, context = {actorId: 'player'}} = {}) {
    if(discovered !== true || preview.visible === false || !text(id) || !text(label)) return null;
    const requirements = unique([...projectKnownActionRequirements(definition.requires, facts, disclosure), ...qualified(disclosure.requirements)]);
    const eligible = preview.eligible === true && unlocked === true;
    const quote = preview.eligible === true && Array.isArray(preview.costs);
    const costs = unique([...projectActionCosts(quote ? preview.costs : list(preview.costs).length ? preview.costs : definition.costs, disclosure, context),
        ...qualified(disclosure.costs)]);
    const minutes = number(preview.duration) ? preview.duration : number(definition.duration) ? definition.duration
        : known(disclosure.duration) && number(disclosure.duration.minutes) ? disclosure.duration.minutes : null;
    const duration = minutes === null ? null : {minutes, kind: preview.eligible === true ? 'quote' : 'terms',
        text: minutes === 0 ? 'Immediate action.' : `${minutes} played minutes${preview.eligible === true ? '' : ' under the known terms'}.`};
    const alternatives = list(disclosure.alternatives).filter(r => known(r) && text(r.id) && text(r.label) && r.visible !== false)
        .map(r => ({id: r.id, label: r.label, description: text(r.description), enabled: r.eligible === true}));
    const row = {id, label, description: text(description), status: !unlocked ? 'discovered' : eligible ? 'available' : 'blocked',
        control: {visible: unlocked === true, enabled: eligible}, requirements,
        blockers: eligible ? [] : evaluatorBlockers(preview, definition, requirements, disclosure, context), costs,
        costKind: quote ? 'quote' : 'terms', duration,
        cancellation: definition.cancellation != null || minutes > 0 ? cancellation(definition.cancellation) : null,
        reservations: reservations(definition, disclosure, context), preparation: qualified(disclosure.preparation), alternatives,
        completion: qualified(disclosure.completion)};
    row.searchText = [row.label, row.description, ...row.requirements.map(r => r.text), ...row.blockers.map(r => r.text),
        ...row.costs.map(r => r.text), ...row.preparation.map(r => r.text), ...row.alternatives.map(r => r.label)].join(' ');
    return row;
}

/** Read-only evaluator adapter. Pass an already-computed preview/facts when the
 * host has them to avoid a second clone. Invisible commands return null before
 * labels, requirements, costs or IDs enter the rendered collection. */
export function projectSimulationActionLegibility({state, registry, context, commandId, disclosure = {}, preview, facts} = {}) {
    const definition = registry?.simulation?.commands?.get(commandId);
    if(!definition || !state?.simulation || !context?.actorId) return null;
    const actionContext = {...context, targetId: definition.targetId || context.targetId || null};
    const p = preview || previewSimulationCommand(state, registry, commandId, actionContext);
    if(p.visible !== true || p.id && p.id !== commandId) return null;
    const actor = state.actors[context.actorId];
    if(definition.once && actor?.completed?.[commandId] || definition.claim && state.simulation.claims?.[definition.claim]) return null;
    return projectActionLegibility({id: commandId, label: definition.label, description: definition.description, discovered: true,
        preview: p, definition, facts: facts || simulationFacts(state, actionContext, registry), disclosure, context: actionContext});
}

/** Default disclosure uses the player's actual visible body/bag/resources.
 * Native labels must be supplied as plain snapshots; do not call getters that
 * initialize XP or parse a private registry key into a newly revealed name. */
export function playerActionDisclosure({state, context = {}, items = {}, people = {}, facts = {}, locations = {}, sites = {}, powers = {}, energies = {}} = {}) {
    const actorId = context.actorId || 'player', actor = state?.actors?.[actorId], s = state?.simulation;
    const native = s?.people?.[actorId]?.inventory === 'native';
    const vitals = context.vitals?.[actorId] || (!native ? s?.people?.[actorId]?.vitals : null) || {};
    const inventory = native ? context.gameplay?.[actorId]?.inventory : s?.owners?.[actorId];
    const labeledItems = Object.fromEntries(Object.entries(items).filter(([, d]) => named(d)).map(([id, d]) => {
        const {available: _unboundCount, ...label} = d;
        return [id, {...label, ...(inventory ? {available: inventory[id] || 0} : {})}];
    }));
    const labeledEnergies = Object.fromEntries(Object.entries(energies).filter(([, d]) => named(d)).map(([id, d]) => {
        const record = s?.energies?.[actorId]?.[id];
        const {available: _unboundReserve, policy: _unboundPolicy, ...label} = d;
        return [id, {...label, ...(record ? {available: record.reserve, policy: record.policy} : {})}];
    }));
    return {items: labeledItems, people, locations, sites, powers, energies: labeledEnergies,
        vitals: {health: {known: true, label: 'health', available: vitals.health}, stamina: {known: true, label: 'stamina', available: vitals.stamina}},
        resources: {money: {known: true, label: 'coins', available: context.external?.money},
            ...Object.fromEntries(Object.entries(actor?.resources || {}).filter(([id]) => id === 'coins').map(([id, value]) => [id, {known: true, label: 'coins', available: value}]))},
        facts: {'actor.life': {known: true, valueKnown: true, label: 'Your ability to work', values: {alive: 'requires being alive and able to act'}},
            'vital.health': {known: true, valueKnown: true, label: 'Your health'}, 'vital.stamina': {known: true, valueKnown: true, label: 'Your stamina'},
            ...Object.fromEntries(Object.entries(labeledItems).map(([id, d]) => [`item.${id}`, {known: true, valueKnown: true, label: `Available ${d.label}`} ])), ...facts}};
}

/** Frozen costs and cancellation belong to the accepted commitment. Never
 * inspect job.effects/roll/outcomeId or promise completion from a frozen result.
 * Other observers need explicitly disclosed agreement terms. A known command label must be
 * supplied separately; no pending outcome label becomes a player-facing recap. */
export function projectAcceptedWorkLegibility({job, clock, actorId = 'player', observerId = actorId, label, disclosure = {}, context = {actorId: 'player'}} = {}) {
    if(!job || job.actorId !== actorId || !text(job.id) || !number(clock) || !number(job.due)) return null;
    if(observerId!==actorId&&!(named(disclosure.people?.[actorId])&&disclosure.people[actorId].termsKnown===true))return null;
    const remainingMinutes = Math.max(0, job.due - clock);
    return {id: job.id, label: text(label) || 'Your accepted work', status: 'accepted', remainingMinutes,
        remainingText: remainingMinutes > 0 ? `${remainingMinutes} played minutes remaining.` : 'Waiting for the accepted work to settle.',
        control: {visible: true, enabled: false}, cancellation: cancellation(job.cancellation),
        costs: projectActionCosts(job.costs, disclosure, {...context, actorId, observerId, targetId: job.targetId || context.targetId}),
        reservations: reservations(job, disclosure, {...context, actorId, observerId, targetId: job.targetId}),
        completion: qualified(disclosure.completion)};
}

/** Only retained observer-addressed records are projected. A common cause ID
 * alone is not evidence of causal explanation. A witnessedCause needs explicit
 * known text and matching retained cause; private truth/current NPC facts are
 * never consulted. Inference, recollection and report remain qualified belief. */
export function projectActionAftermath({records = [], observerId = 'player', people = {}, witnessedCauses = []} = {}) {
    const basisLabels = {observation: 'Observed', inference: 'Your interpretation', recollection: 'Recollection', instruction: 'Reported instruction'};
    return list(records).filter(r => known(r) && r.observerId === observerId && text(r.id) && text(r.text)).map(r => {
        const basis = r.basis, source = people[basis?.attributedTo];
        const causes = list(witnessedCauses).filter(c => known(c) && c.observerId === observerId && r.cause && c.cause === r.cause && text(c.text))
            .map((c, i) => ({id: text(c.id) || `witnessed-${i}`, text: c.text}));
        return {id: r.id, text: r.text, ...(number(r.at) ? {at: r.at, timeText: `Recorded at played minute ${r.at}.`} : {}),
            basisLabel: basisLabels[basis?.kind] || 'Retained account', sourceLabel: named(source) ? source.label : '', causes};
    });
}

/** Adapter for the actual per-observer knowledge ledger, never simulation.log,
 * actor-private facts, another person's belief or a pending job's outcomes. */
export function projectSimulationAftermath({state, observerId = 'player', prefix = '', people = {}, witnessedCauses = []} = {}) {
    const records = Object.entries(state?.simulation?.knowledge?.[observerId] || {}).filter(([id]) => !prefix || id.startsWith(prefix))
        .filter(([, r]) => text(r.value)).map(([id, r]) => ({id, observerId, known: true, text: r.value, at: r.at, cause: r.cause, basis: r.basis}));
    return projectActionAftermath({records, observerId, people, witnessedCauses});
}

// A private observer ledger is not a public report. Another observer's account
// needs a retained communication to this viewer; shared place/registry/actor
// membership or a real underlying identity never supplies that communication.
function addressedTo(record, viewerId) {
    if(record.recipientId === viewerId || list(record.recipients).includes(viewerId)) return true;
    return record.observerId === viewerId && record.recipientId == null && record.recipients == null;
}
function addressedAccount(record, viewerId) {
    return known(record) && !!text(record.id) && !!text(record.text) && addressedTo(record, viewerId);
}
function visibleAccounts(records, viewerId) {
    const ids = new Set();
    return list(records).filter(r => {
        if(!addressedAccount(r, viewerId) || ids.has(r.id)) return false;
        ids.add(r.id); return true;
    });
}
const recognitionKinds = {appearance: 'Appearance', credential: 'Credential', memory: 'Personal recollection',
    demonstration: 'Demonstrated method', registry: 'Institutional record', body: 'Body or faculty', soul: 'Occupant signature'};
const carrierKinds = {appearance: 'Appearance', credential: 'Credential', role: 'Role', credit: 'Credit', opportunity: 'Opportunity',
    body: 'Body', occupant: 'Occupant', controller: 'Controller', soul: 'Soul', memory: 'Memory', source: 'Source', faculty: 'Faculty',
    fuel: 'Fuel', capacity: 'Capacity', mastery: 'Learned mastery', method: 'Learned method', lineage: 'Lineage',
    holdings: 'Possessions', equipped: 'Equipped goods', carried: 'Carried goods', custody: 'Custody', rights: 'Rights',
    title: 'Title', authority: 'Authority', obligations: 'Obligations', curse: 'Curse', oath: 'Oath', debt: 'Debt', allies: 'Supported allies'};
function localWord(kind, neutral, vocabulary) {
    const term = known(vocabulary) && vocabulary.terms?.[kind];
    return named(term) ? term.label : neutral;
}
function accountQualifier(record) {
    if(record.medium === 'heard') return record.basis?.kind === 'inference' ? 'Heard interpretation' : 'Heard account';
    if(record.medium === 'remembered' || record.basis?.kind === 'recollection') return 'Remembered account';
    if(record.medium === 'inferred' || record.basis?.kind === 'inference') return 'Interpretation';
    if(record.basis?.kind === 'instruction') return 'Reported instruction';
    return record.medium === 'witnessed' || record.basis?.kind === 'observation' ? 'Observed account' : 'Retained account';
}
function accountRow(record, people, causes = []) {
    const speaker = people[record.basis?.attributedTo || record.observerId];
    return {id: record.id, text: record.text,
        ...(number(record.at) ? {at: record.at, timeText: `Recorded at played minute ${record.at}.`} : {}),
        basisLabel: accountQualifier(record), sourceLabel: named(speaker) ? speaker.label : '', causes};
}
function addressedCauses(record, viewerId) {
    return qualified(list(record.witnessedCauses).filter(c => known(c) && text(c.cause) && c.cause === record.cause && addressedTo(c, viewerId)));
}

/** Recovery/testing offers use actual host previews and displayed command
 * tokens. Being essential never supplies missing means or bypasses a live
 * boundary; it only prevents a separate undiscovered family from hiding a
 * known return, honest entry, rest, compensation or release option. */
export function projectEssentialRecovery({actions = [], viewerId = 'player'} = {}) {
    return list(actions).filter(a => known(a) && text(a.id) && text(a.label) &&
        (a.recipientId === viewerId || list(a.recipients).includes(viewerId) || a.observerId === viewerId && a.recipientId == null && a.recipients == null))
        .map(a => {
            const row = projectActionLegibility({id: a.id, label: a.label, description: a.description, discovered: true,
                unlocked: a.unlocked !== false, preview: a.preview || {}, definition: a.definition || {}, facts: a.facts || {},
                disclosure: a.disclosure || {}, context: a.context || {actorId: viewerId}});
            if(!row) return null;
            // Preserve a plain, exact displayed token; do not generate a fresh
            // sequence/identity at click time or create a new command planner.
            const blockMissingBinding = () => {
                row.control.enabled = false; row.status = 'blocked';
                row.blockers = unique([...row.blockers, {id: 'recovery-binding', text: 'This action needs a supported current offer before it can be accepted.'}]);
            };
            if(a.command && typeof a.command === 'object' && !Array.isArray(a.command)) {
                try {row.command = structuredClone(a.command);} catch {blockMissingBinding();}
            } else {
                blockMissingBinding();
            }
            return row;
        }).filter(Boolean);
}

/** Attributed recognition, suspicion and corrections are accounts, never a
 * renderer's determination of the actual actor/body/soul. A face match does
 * not pass another observer's credential, memory, method or signature test.
 * Both the old account and its explicit correction remain visible. */
export function projectRecognitionLegibility({records = [], viewerId = 'player', people = {}, vocabulary = {}, tests = []} = {}) {
    const visible = visibleAccounts(records, viewerId), byId = new Map(visible.map(r => [r.id, r]));
    const amendments = new Map();
    for(const r of visible) {
        const previous = byId.get(r.supersedes);
        const correction = r.statusKnown === true ? r.status === 'corrected' : !!text(r.supersedes) && r.correctionKnown !== false;
        if(correction && previous && previous.id !== r.id &&
            text(r.observerId) && r.observerId === previous.observerId &&
            (!number(r.at) || !number(previous.at) || r.at >= previous.at)) amendments.set(previous.id, r.id);
    }
    const statusWords = {claimed: 'Identity claim', recognized: 'Recorded recognition', suspected: 'Suspicion',
        disputed: 'Disputed account', corrected: 'Updated account'};
    const aftermath = visible.map(r => {
        const row = accountRow(r, people, addressedCauses(r, viewerId)), qualifiers = [row.basisLabel];
        const observer = people[r.observerId];
        if(named(observer) && observer.label !== row.sourceLabel) qualifiers.push(`Judgment by ${observer.label}`);
        if(r.statusKnown === true && statusWords[r.status]) qualifiers.push(localWord(r.status, statusWords[r.status], vocabulary));
        if(known(r.test) && (named(r.test) || recognitionKinds[r.test.kind])) {
            qualifiers.push(named(r.test) ? r.test.label : `Reported test: ${localWord(r.test.kind, recognitionKinds[r.test.kind], vocabulary)}`);
        }
        if(amendments.has(r.id)) qualifiers.push('Earlier account, since amended');
        const previous = byId.get(r.supersedes);
        if(previous && amendments.get(previous.id) === r.id) {
            if(r.statusKnown !== true) qualifiers.push('Updated account');
            row.causes.push({id: `correction-${r.id}`, text: number(previous.at)
                ? `Updates the same observer's retained account from played minute ${previous.at}.`
                : "Updates the same observer's earlier retained account."});
        }
        row.basisLabel = qualifiers.join(' · ');
        return row;
    });
    return {actions: projectEssentialRecovery({actions: tests, viewerId}), aftermath};
}

/** Qualified carrier changes come from actual retained replacement receipts.
 * No actual/private identity field is consulted and no inheritance is inferred
 * for unmentioned memory, powers, stock, duties or a former occupant's fate. */
export function projectReplacementLegibility({receipts = [], viewerId = 'player', people = {}, vocabulary = {}, recovery = []} = {}) {
    const aftermath = visibleAccounts(receipts, viewerId).map(r => {
        const row = accountRow(r, people);
        const changes = list(r.changes).filter(c => known(c) && carrierKinds[c.carrier] && text(c.text)).map((c, i) => {
            const label = localWord(c.carrier, carrierKinds[c.carrier], vocabulary);
            const before = describe(c.before, ''), after = describe(c.after, '');
            return {id: `${r.id}-carrier-${text(c.id) || i}`, text: `${label}: ${c.text}${before ? ` Before: ${before}` : ''}${after ? ` After: ${after}` : ''}`};
        });
        // The receipt explains only the changes explicitly seen/heard. These
        // are account details, not independently inferred causal explanations.
        row.text = [row.text, ...changes.map(c => c.text)].join(' ');
        row.causes = addressedCauses(r, viewerId);
        return row;
    });
    return {actions: projectEssentialRecovery({actions: recovery, viewerId}), aftermath};
}

/** Concrete native/Backlog/Ink join: use only the viewer's retained knowledge.
 * Metadata qualifies how an existing account was acquired; it cannot create a
 * record, replace its text/time/cause or read private recognition/carrier state.
 * For example clerk_report and correction can name the same actual observer,
 * with correction.supersedes pointing at the already retained clerk_report. */
export function projectSubtletyKnowledgeLegibility({state, viewerId = 'player', prefix = 'backlog.registry.', metadata = {},
    people = {}, vocabulary = {}, tests = [], recovery = []} = {}) {
    const records = Object.entries(state?.simulation?.knowledge?.[viewerId] || {}).filter(([id, r]) =>
        id.startsWith(prefix) && text(r.value)).map(([id, r]) => {
            const m = known(metadata[id]) ? metadata[id] : {};
            return {id, known: true, recipientId: viewerId, observerId: text(m.observerId) || viewerId,
                text: r.value, at: r.at, cause: r.cause, basis: r.basis,
                medium: m.medium, statusKnown: m.statusKnown === true, status: m.status, test: m.test,
                supersedes: m.supersedes, correctionKnown: m.correctionKnown, changes: m.changes, witnessedCauses: m.witnessedCauses};
        });
    const recognition = projectRecognitionLegibility({records, viewerId, people, vocabulary, tests});
    const replacement = projectReplacementLegibility({receipts: records, viewerId, people, vocabulary, recovery});
    const changes = new Map(replacement.aftermath.map(r => [r.id, r]));
    return {actions: [...new Map([...recognition.actions, ...replacement.actions].map(r => [r.id, r])).values()],
        aftermath: recognition.aftermath.map(r => {
            const change = changes.get(r.id);
            return {...r, text: change.text, causes: unique([...r.causes, ...change.causes])};
        })};
}

function knownGroup(header, viewerId) {
    return named(header) && !!text(header.id) && addressedTo(header, viewerId);
}
function contractRows(id, kind, rows, label, people, issuerId) {
    const issuer = people[issuerId];
    return qualified(rows).map((r, i) => ({id: `${id}-${kind}-${r.id || i}`, text: `${label}: ${r.text}`,
        basisLabel: 'Known terms', sourceLabel: named(issuer) ? issuer.label : '', causes: []}));
}
function retainedRows(records, viewerId, people) {
    return visibleAccounts(records, viewerId).map(r => accountRow(r, people, addressedCauses(r, viewerId)));
}

/** A mission is a known issued contract over a destination, not that world's
 * identity. These are explicit host terms/current receipts; no author outcomes,
 * private issuer goal, destination state, wall clock or payout is evaluated. */
export function projectMissionLegibility({mission, viewerId = 'player', people = {}, vocabulary = {}, actions = [], recovery = []} = {}) {
    if(!knownGroup(mission, viewerId)) return {visible: false, actions: [], aftermath: []};
    const id = mission.id, aftermath = [
        ...contractRows(id, 'terms', mission.terms, localWord('contractTerms', 'Contract terms', vocabulary), people, mission.issuerId),
        ...contractRows(id, 'preparation', mission.preparation, localWord('preparation', 'Known preparation', vocabulary), people, mission.issuerId),
        ...contractRows(id, 'portability', mission.portability, localWord('portability', 'Passage and portability terms', vocabulary), people, mission.issuerId),
    ];
    for(const [i, objective] of list(mission.objectives).entries()) {
        if(!known(objective) || !text(objective.text) || !['issuer', 'local'].includes(objective.scope)) continue;
        const label = objective.scope === 'issuer' ? localWord('issuerObjective', 'Issuer objective', vocabulary)
            : localWord('localObjective', 'Local objective', vocabulary);
        aftermath.push({id: `${id}-objective-${text(objective.id) || i}`, text: `${label}: ${objective.text}`,
            basisLabel: 'Known objective', sourceLabel: '', causes: []});
    }
    for(const [i, clock] of list(mission.clocks).entries()) {
        if(!named(clock)) continue;
        const unit = named(clock.unit) ? clock.unit.label : 'played minutes';
        const parts = [clock.label, text(clock.text), number(clock.remainingMinutes) ? `${clock.remainingMinutes} ${unit} remaining.` : '',
            number(clock.elapsedMinutes) ? `${clock.elapsedMinutes} ${unit} elapsed.` : '', describe(clock.policy, '')].filter(Boolean);
        aftermath.push({id: `${id}-clock-${text(clock.id) || i}`, text: parts.join(' '),
            ...(number(clock.at) ? {at: clock.at, timeText: `Recorded at played minute ${clock.at}.`} : {}),
            basisLabel: 'Reported clock snapshot', sourceLabel: '', causes: []});
    }
    // Future promised extraction protocol belongs to terms. Only actual current
    // or occurred stages and completed settlements belong to this aftermath.
    aftermath.push(...retainedRows(list(mission.stages).filter(r => r?.current === true || r?.occurred === true), viewerId, people),
        ...retainedRows(list(mission.settlements).filter(r => r?.occurred === true), viewerId, people),
        ...retainedRows(mission.aftermath, viewerId, people));
    return {visible: true, id, label: mission.label,
        actions: projectEssentialRecovery({actions: [...list(actions), ...list(recovery)], viewerId}), aftermath};
}

/** Discovered causal links need not be a linear quest checklist. Only retained
 * player/heard links and actual closure accounts are shown; no source graph,
 * undiscovered branch count, private plan or replacement enemy is inspected. */
export function projectTropeChainLegibility({chain, viewerId = 'player', people = {}, vocabulary = {}, actions = [], recovery = []} = {}) {
    if(!knownGroup(chain, viewerId)) return {visible: false, actions: [], aftermath: []};
    const aftermath = visibleAccounts(chain.links, viewerId).map(r => {
        const row = accountRow(r, people, addressedCauses(r, viewerId));
        if(text(r.label)) row.text = `${localWord('chainLink', 'Known link', vocabulary)}: ${r.label}. ${row.text}`;
        if(named(r.phase)) row.basisLabel += ` · ${r.phase.label}`;
        return row;
    });
    aftermath.push(...retainedRows(list(chain.closures).filter(r => r?.occurred === true), viewerId, people),
        ...retainedRows(chain.aftermath, viewerId, people));
    return {visible: true, id: chain.id, label: chain.label,
        actions: projectEssentialRecovery({actions: [...list(actions), ...list(recovery)], viewerId}), aftermath};
}

/** Compose only known hub/services/contracts/chains. Native hub/instance/mission
 * identity, resident stock, commitments, clock and settlement retain their
 * actual owners. Each group can feed the existing shared action list directly. */
export function projectHubCampaignLegibility({hub, missions = [], chains = [], viewerId = 'player', people = {}, vocabulary = {}} = {}) {
    if(!knownGroup(hub, viewerId)) return {visible: false, groups: []};
    const groups = [{id: hub.id, label: hub.label,
        actions: projectEssentialRecovery({actions: [...list(hub.actions), ...list(hub.recovery)], viewerId}),
        aftermath: retainedRows(hub.accounts, viewerId, people)}];
    for(const mission of list(missions)) {
        const row = projectMissionLegibility({mission, viewerId, people, vocabulary, actions: mission?.actions, recovery: mission?.recovery});
        if(row.visible) groups.push(row);
    }
    for(const chain of list(chains)) {
        const row = projectTropeChainLegibility({chain, viewerId, people, vocabulary, actions: chain?.actions, recovery: chain?.recovery});
        if(row.visible) groups.push(row);
    }
    return {visible: true, groups};
}
