// Original, reversible P5 work. Existing crop/site/inventory owners keep their
// authority. Importing this file creates no stock, plot, permission or storm.
import {all, eq, sameJson as equal} from './basics.js';
import {assert, copy} from './simulation_contracts.js';
import {worldCompletionStripStamp} from './world_completion_strip.js';
import {REMAINDER_HOME_KEYS as H} from './audit_remainder_home_content.js';
import {REMAINDER_CONSEQUENCES_IDS as C, REMAINDER_CONSEQUENCES_KEYS as CK,
    remainderConsequencesDefinitions} from './audit_remainder_consequences_content.js';

export const WORLD_COMPLETION_MATERIALS_IDS = Object.freeze({
    world: C.frontier, group: 'world_completion_materials', prefix: 'world.completion.materials.',
    enrollment: 'world.completion.begin', plot: C.plot, bed: C.bed, steward: C.steward,
    plotRight: C.plotRight, harvest: C.harvest, frost: C.frost,
    coverOffcuts: 'world.completion.materials.cover_offcuts',
    coverMeasured: 'world.completion.materials.cover_measured',
    keep: 'world.completion.materials.keep_scraps', discard: 'world.completion.materials.discard',
    account: 'world.completion.materials.account',
});
export const WORLD_COMPLETION_MATERIALS_KEYS = Object.freeze({
    green: H.green, offcut: H.offcut, log: H.log, herbs: CK.herbs,
    strip: JSON.stringify({id: 'Measured drain strip'}),
});
const I = WORLD_COMPLETION_MATERIALS_IDS, K = WORLD_COMPLETION_MATERIALS_KEYS;
export const worldCompletionMaterialsSources = [];
export const worldCompletionMaterialsItemSpecifications = [];
const f = (key, reason) => eq('worldCompletionMaterials.' + key, true, reason);
const enrolled = f('enrolled', 'Accept the connected home-world work explicitly first.');
const local = f('local', 'Use your own living supported body in the home realm.');
const hands = f('hands', 'Recover your own two usable hands before material work.');
const notch = all(enrolled, local, hands,
    f('notchInspected', 'Inspect this actual opted-in drain before putting scraps into it.'),
    f('notchRight', 'This local drain work needs its actual current permission.'),
    f('notchSupported', 'Return to the actual inspected notch with supported access.'));
const measured = f('measuredSample', 'Complete a real lens measurement of the current notch sample first.');
const crop = all(enrolled, local, hands, measured,
    f('plotRight', 'Retain your actual right to Nell\'s planted bed.'),
    f('bedPresent', 'The existing association bed must remain actual.'),
    f('stewardPresent', 'Meet living, willing Nell at the bed.'),
    f('cropWarned', 'This cover can settle only the same actual warned crop.'),
    f('frostOpen', 'The same six-minute crop window has expired.'),
    f('noCoverJob', 'Finish or cancel the existing cover of this same crop first.'));
const wf = (key, value = true) => ({type: 'world', worldId: I.world, key: I.prefix + key, value});
const item = (key, amount) => ({type: 'item', actor: 'player', key, amount});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const know = (key, text, speaker = 'player', situationId = I.plot) => ({type: 'knowledge', actor: 'player',
    key: I.prefix + key, stage: 'seen', value: text,
    basis: {kind: 'observation', attributedTo: speaker, situationId}});
const command = d => ({revision: 1, group: I.group, worldId: I.world, actorId: 'player',
    location: 'Village', costs: [], effects: [], reservationReturns: 1, ...d});
const timed = (duration, support, siteId, coLocated = false) => ({duration, cancellation: 'refund',
    completionRequires: all(support, f('acceptedSupport', 'This job needs its exact admitted body and sample at completion.')),
    completionFailure: 'refund', completionCoLocated: coLocated, siteId});

export const worldCompletionMaterialsCoverTexts = Object.freeze({
    offcuts: 'You fitted two actual Compatible repair offcuts using the measured current sample, two stamina and two supported played minutes. They remain in the cover on Nell\'s same warned herb bed. Its single final harvest added five real Cooking herbs to your native inventory. No log, second crop, seed packet or scalar ecology reward was created.',
    measured: 'You consumed one separately made Measured drain strip to fit the narrow draft opening on Nell\'s same warned herb bed using the current measured datum, one stamina and two supported played minutes. The real strip remains in that cover. Its single final harvest added five real Cooking herbs to your native inventory. This original local fit uses one prepared timber piece rather than two offcuts; it is not a universal material bonus. The strip cannot line the drain too, and no second crop or seed packet is created.',
});
export const worldCompletionMaterialsKnowledgeTexts = Object.freeze({
    keep: 'You kept your actual two green offcuts. This decision spent no material, stamina or time and changed no drain or crop. Ordinary six-minute drying can turn these counted scraps into two compatible offcuts; later repair, salvage or a measured cover must still spend their actual inputs.',
    discard: 'You deliberately placed your two actual Green repair offcuts in the inspected narrow notch over one supported played minute, spending one stamina. They are no longer in your bag. The performed obstruction changes this opted-in drain at this completion boundary; if the one rain boundary already passed, it changes only later site state and cannot replay that storm.',
    account: 'You revisited the actual inspected notch. Retained material receipts distinguish stock kept, scraps actually discarded and a real crop cover. A later clearance changes the current drain without deleting those spent inputs, the earlier warning or the single rain result. Nell\'s finite crop never replants itself.',
});

const baseDefinitions = ({notchLocation, notchSiteId}) => ({commands: [
    command({id: I.keep, label: 'Keep your two green scraps for ordinary drying · free', once: true,
        location: notchLocation, visibleWhen: all(enrolled, f('notchInspected')), requires: all(notch, f('hasTwoGreen')),
        effects: [know('kept', worldCompletionMaterialsKnowledgeTexts.keep, 'player', 'lore.warning.rain')]}),
    command({id: I.discard, label: 'Block the inspected notch · 2 green offcuts + 1 stamina + 1 min', once: true,
        location: notchLocation, visibleWhen: all(enrolled, f('notchInspected')), requires: notch,
        ...timed(1, notch, notchSiteId), costs: [item(K.green, -2), stamina(-1)],
        effects: [wf('discarded'), know('disposal', worldCompletionMaterialsKnowledgeTexts.discard, 'player', 'lore.warning.rain')],
        description: 'These real scraps are consumed only on supported completion. Before the one rain boundary this can restore physical flood support after a clearance. After that boundary it changes only the retained notch. Cancel or lose support to return the exact inputs.'}),
    command({id: I.account, label: 'Inspect the changed notch and material account · free', once: true,
        location: notchLocation, visibleWhen: all(enrolled, f('hasMaterialRecord')), requires: notch,
        effects: [know('account', worldCompletionMaterialsKnowledgeTexts.account, 'player', 'lore.warning.rain')]}),
]});

// This is an honest disjoint base, not an alternate crop owner. Root registers
// the complete factory result once the existing crop owner exports its narrow
// covered terminal factory. No nonexistent shared API is imported here.
export const worldCompletionMaterialsDefinitions = baseDefinitions({notchLocation: 'Village', notchSiteId: 'lore.warning.notch'});

export function assertWorldCompletionMaterialsCropEffects(effects, text) {
    const original = remainderConsequencesDefinitions.commands.find(d => d.id === C.prefix + 'plot_cover');
    assert(original && Array.isArray(effects), 'The existing finite crop owner must supply its covered effects.');
    const expected = copy(original.effects);
    const receipt = expected.find(e => e.type === 'knowledge' && e.key === C.facts + 'plot.result');
    assert(receipt, 'The existing crop must retain its single declared result receipt.');
    receipt.value = text;
    assert(equal(effects, expected), 'Only the existing covered phase, five-herb harvest, claim and attributed crop receipt are admitted.');
    return true;
}

export function createWorldCompletionMaterialsDefinitions({coveredPlotEffects, notchLocation = 'Village', notchSiteId = 'lore.warning.notch'} = {}) {
    assert(typeof coveredPlotEffects === 'function', 'Root must join the real existing covered-crop terminal factory.');
    assert(notchLocation === 'Village' && notchSiteId === 'lore.warning.notch', 'This revision supports only the actual native Village notch.');
    const covers = [
        ['offcuts', I.coverOffcuts, 'Fit the measured bed cover · 2 compatible offcuts + 2 stamina + 2 min · 5 herbs', [item(K.offcut, -2), stamina(-2)]],
        ['measured', I.coverMeasured, 'Fit the narrow bed opening · measured strip + 1 stamina + 2 min · 5 herbs', [item(K.strip, -1), stamina(-1)]],
    ].map(([name, id, label, costs]) => {
        const text = worldCompletionMaterialsCoverTexts[name], terminal = coveredPlotEffects(text);
        assertWorldCompletionMaterialsCropEffects(terminal, text);
        return command({id, label, once: true, targetId: I.steward, coLocated: true, participants: ['$target'],
            visibleWhen: all(enrolled, f('cropWarned')),
            requires: name === 'measured' ? all(crop, f('measuredStrip', 'Use the actual strip made for this same measured sample.')) : crop,
            ...timed(2, crop, I.bed, true), costs,
            effects: [...terminal, wf('coverRoute', name), know('cover', text, I.steward)],
            description: 'Use two dry compatible offcuts, or consume the actual taught strip in this original locally matched narrow opening. Both settle the same planted crop before its retained six-minute deadline. Wet pieces, encumbered stock, missing Nell, lost right or late completion yield no extra harvest; reserved inputs return. The ordinary one-log cover and three/one-herb alternatives keep their old meaning.'});
    });
    return {commands: [...covers, ...baseDefinitions({notchLocation, notchSiteId}).commands]};
}

export const worldCompletionMaterialsPublicCommandIds = Object.freeze([I.coverOffcuts, I.coverMeasured, I.keep, I.discard, I.account]);

// Interface revision2 binds this one recipe to an actual sample-stamped native
// key. The unbound plain key is only a disabled definition/display template.
export function worldCompletionMaterialsFrozenDefinition(definition, measuredStripKey) {
    if(definition.id !== I.coverMeasured || measuredStripKey == null) return definition;
    assert(worldCompletionStripStamp(measuredStripKey), 'Use one exact provenance-stamped measured strip.');
    const out = copy(definition);
    const cost = out.costs.find(e => e.type === 'item' && JSON.parse(e.key).id === 'Measured drain strip');
    assert(cost?.actor === 'player' && cost.amount === -1, 'Only the declared one-strip material debit may bind dynamically.');
    cost.key = measuredStripKey;
    return out;
}

// Load/import validation needs a source shape even before a live registry is
// constructed. This reads the incumbent exported command's frozen effects for
// comparison only; playable registration still calls the real owner factory.
export function worldCompletionMaterialsValidationDefinitions() {
    return createWorldCompletionMaterialsDefinitions({coveredPlotEffects: text => {
        const original = remainderConsequencesDefinitions.commands.find(d => d.id === C.prefix + 'plot_cover');
        const effects = copy(original.effects);
        effects.find(e => e.type === 'knowledge' && e.key === C.facts + 'plot.result').value = text;
        return effects;
    }});
}
