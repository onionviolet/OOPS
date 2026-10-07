// Original finite workshop proposal, inspired by Brogue's evidence-constrained
// identification after a harmless spent throw. No reference code is copied.
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as OK} from './feature_expansion_objects.js';
import {NETHACK_FIELDCRAFT_KEYS as NK} from './nethack_fieldcraft_content.js';

export const GAME_ABSORPTION_ASSAY_IDS = Object.freeze({
    world: O.world, eda: O.miri, site: O.site, situation: O.situation,
    group: 'game_absorption_assay', commandType: 'game_absorption_assay',
    prefix: 'game_absorption_assay.', open: 'game_absorption_assay.open',
    compare: 'game_absorption_assay.compare', examine: 'game_absorption_assay.examine',
    rinse: 'game_absorption_assay.rinse', identity: 'game_absorption_assay.identity',
});
const I = GAME_ABSORPTION_ASSAY_IDS;
export const GAME_ABSORPTION_ASSAY_KEYS = Object.freeze({
    full: JSON.stringify({id: 'Clouded bench vial'}), dirty: JSON.stringify({id: 'Gummed fitting pin'}),
    empty: NK.empty, pin: NK.pin, dull: OK.dull, fineDull: OK.fineDull,
});
const K = GAME_ABSORPTION_ASSAY_KEYS;
export const gameAbsorptionAssayItemSpecifications = Object.freeze([
    {id: 'Clouded bench vial', description: 'One full external bench charge from Eda\'s finite clouded batch. Appearance does not establish its function. A performed trial or useful application spends the charge and leaves an Empty bench vial. Neither a drink nor dog food.', value: 2},
    {id: 'Gummed fitting pin', description: 'An actual fitting pin recovered from Eda\'s old packing case, still covered by packing gum. Washing or scraping can recover it for the existing pin-and-resin kit recipe.', value: 1},
]);

const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const fact = (name, value = true) => ({type: 'fact', scope: 'actor', actor: 'player', key: `${I.prefix}${name}`, value});
const item = (key, amount, actor = 'player', reservationReturn = false) => ({type: 'item', actor, key, amount,
    ...(reservationReturn ? {reservationReturn: true} : {})});
const stamina = amount => ({type: 'vital', actor: 'player', key: 'stamina', amount});
const know = (name, value, stage = 'seen', kind = 'observation', attributedTo = 'player', actor = 'player') => ({type: 'knowledge', actor,
    key: `${I.prefix}${name}`, stage, value, basis: {kind, attributedTo, situationId: I.situation}});
const discharge = () => item(K.empty, 1, 'player', true);
const live = all(eq('absorption.assay.supported', true, 'Return to the Village with your living native body, stock and local clock.'),
    eq('absorption.assay.handsUsable', true, 'Recover your usable hands before bench work.'),
    eq('absorption.assay.siteSupported', true, 'Use Eda\'s actual fitting bench under her retained external-trial permission.'),
    {fact: 'vital.health', op: 'gte', value: 2, reason: 'Recover above one HP before work.'});
const opened = eq('absorption.assay.opened', true, 'Hear Eda\'s closed-batch terms first.');
const eda = eq('absorption.assay.edaSupported', true, 'Eda needs present consent, usable hands, health and free attention.');
const own = kind => eq(`absorption.assay.own.${kind}`, true, 'Carry your own unencumbered, unequipped matching input, or retain this job\'s exact reservation.');
const identified = eq('absorption.assay.identified');
const failed = eq('absorption.assay.negativeObserved');
const command = d => ({revision: 1, worldId: I.world, actorId: 'player', location: 'Village', group: I.group,
    costs: [], effects: [], ...d});
const job = (duration, support) => ({duration, cancellation: 'refund', siteId: I.site,
    completionRequires: support, completionFailure: 'refund'});
const identity = (kind = 'observation') => know('identity',
    kind === 'inference'
        ? 'Identified by elimination: the clouded batch contains gum wash. Eda\'s closed list allowed only gum wash or reed oil; your actual failed edge trial left the knife dull, while your separately acquired reed-oil record established that oil sharpens under those same bench conditions. The spent vial stays empty; other full vials of this exact batch retain one wash charge.'
        : 'Identified by your own bench application: the clouded batch contains gum wash. The water-based wash lifts packing gum without restoring a knife edge. Other full vials of this exact batch retain one external wash charge; spent containers remain empty.',
    'understood', kind);

export const gameAbsorptionAssayDefinitions = {commands: [
    command({id: I.open, once: true, label: 'Ask Eda about the clouded batch and packing case · free, optional',
        targetId: I.eda, coLocated: true, participants: ['$target'],
        visibleWhen: all(eq('absorption.assay.canMeet'), not(opened)), requires: all(live, eda, eq('absorption.assay.canMeet'), not(opened)),
        effects: [fact('opened'), fact('termsRevision', 1), item(K.full, 2, I.eda), item(K.dirty, 2, I.eda),
            know('terms', 'Eda opens one old packing case: two Clouded bench vials at two coins each and two Gummed fitting pins at one coin each. Her retained packing list limits this exact vial batch to one substance: either reed oil, which restores an edge with the bench abrasive, or water-based gum wash, which lifts packing gum but leaves a dull edge dull. Clouding obscures the label; no third mixture is in this batch. This is her once-only finite consignment, separate from her pale oil vials and recess pins. An edge trial spends a charge and effort even when no sharpening occurs. That failure identifies nothing without your own prior or later reed-oil evidence. You may instead perform a direct sample examination, wash a pin, scrape it by hand, or leave the supply alone. External bench use only; cancellation returns exact held inputs, while elapsed played time remains spent.', 'understood', 'instruction', I.eda),
            know('consignment', 'I opened my one old packing case for the traveler: two full clouded-batch vials and two gummed packing pins, separate from my other stock. I permit external trials and pin cleaning at my existing fitting bench. Purchases transfer my actual stock and credit my purse; revisits do not restock this case.', 'seen', 'instruction', I.eda, I.eda)],
        description: 'Optional terms and actual finite seller stock, with no free player supplies or accepted debt. The exact batch alternatives are disclosed; its identity still requires evidence. Existing pale-oil assays, recess retrieval and ordinary kit work remain available.'}),
    ...[['full', 2, 'Clouded bench vial'], ['dirty', 1, 'Gummed fitting pin']].map(([kind, price, label]) => command({
        id: `${I.prefix}buy_${kind}`, label: `Buy one ${label} · ${price} coin${price === 1 ? '' : 's'}`, targetId: I.eda,
        coLocated: true, participants: ['$target'], visibleWhen: opened, requires: all(live, opened, eda, eq(`absorption.assay.stock.${kind}`, true, 'Eda has no remaining item of this finite consignment.')),
        costs: [{type: 'resource', actor: 'player', native: true, key: 'money', amount: -price},
            {type: 'transfer', from: I.eda, to: 'player', key: K[kind], count: 1}],
        effects: [{type: 'resource', actor: I.eda, key: 'coins', amount: price},
            know(`purchase_${kind}`, `You paid ${price} native coin${price === 1 ? '' : 's'} into Eda's purse and received one actual ${label} from her finite packing-case stock. Purchase alone establishes no substance identity.`)],
        description: 'Actual stock transfer and payment commit together through the existing publisher. No automatic refill, guessed identification or receipt reward.'})),
    ...['dull', 'fineDull'].map(kind => {
        const admission = all(live, opened, own('full'), own(kind), not(failed), not(identified));
        const completion = all(live, opened, own(kind), not(failed), not(identified));
        return command({id: `${I.prefix}trial_${kind}`, once: true,
            label: `Try the clouded charge on your dull ${kind === 'fineDull' ? 'guided ' : ''}knife · 1 stamina + 2 min`,
            visibleWhen: all(opened, own(kind), not(failed), not(identified)), requires: admission, ...job(2, completion),
            costs: [item(K.full, -1), item(K[kind], -1), stamina(-1)],
            effects: [discharge(), item(K[kind], 1, 'player', true), fact('negativeTrial', kind),
                know('negative', 'Your full clouded-batch charge and the fitting bench abrasive failed to restore the owned knife edge. The same knife remains dull, including any fine guide. One charge, one stamina and two played minutes were spent; one Empty bench vial remains. This observed failure alone does not establish which substance was used.')],
            description: 'An external edge experiment spends its charge and effort even if no improvement occurs. Observe the result before inferring an identity. The exact knife is held by this job; cancellation returns it and the other reserved inputs. Comparison, direct examination and pin cleaning are separate choices.'});
    }),
    command({id: I.compare, once: true, label: 'Compare the failed trial with your reed-oil evidence · 1 min',
        visibleWhen: all(opened, failed, not(identified)),
        requires: all(live, opened, failed, not(identified), eq('absorption.assay.controlKnown', true, 'Actually identify the separate pale reed-oil stock through its existing assay or sharpening trial first. A rumor or purchase is not a control.')),
        ...job(1, all(live, opened, failed, not(identified), eq('absorption.assay.controlKnown'))),
        effects: [know('control', '', 'seen', 'inference'), identity('inference'),
            know('comparison', 'You compared your retained failed clouded-batch edge trial with your own understood reed-oil application and Eda\'s closed two-substance packing list. Only gum wash remained possible. The comparison restored no charge and changed no knife or stock.', 'understood', 'inference')],
        description: 'Evidence-based identification can follow the failed trial either immediately or after later acquiring the missing control. One played minute records the deduction. Empty containers stay empty; no privately known answer is substituted for missing evidence.'}),
    command({id: I.examine, label: 'Examine one clouded charge on the bench sample · 1 stamina + 3 min', once: true,
        visibleWhen: all(opened, not(identified)), requires: all(live, opened, own('full'), not(identified)), ...job(3, all(live, opened, not(identified))),
        costs: [item(K.full, -1), stamina(-1)], effects: [discharge(), identity(),
            know('examination', 'You applied one actual clouded charge to the existing disposable packing-gum bench sample. The washable gum and water-based residue directly identified gum wash. The paid sample examination recovered no loose pin; one actual Empty bench vial remained.')],
        description: 'A direct observation route independent of the negative trial and prior oil knowledge. Spends one real charge and effort; cancellation returns them and teaches nothing.'}),
    command({id: I.rinse, label: 'Wash one gummed pin with a clouded charge · 1 stamina + 2 min',
        visibleWhen: opened, requires: all(live, opened, own('full'), own('dirty')), ...job(2, all(live, opened)),
        costs: [item(K.full, -1), item(K.dirty, -1), stamina(-1)], effects: [discharge(), item(K.pin, 1), identity(),
            know('washing', 'One actual clouded-batch wash charge lifted the packing gum from one owned Gummed fitting pin over two played minutes, spending one stamina. The same material became one existing Recovered fitting pin, and the spent charge left an Empty bench vial. The useful observation directly identified gum wash. Combine this pin with one Sound repair stave and one Set repair resin in the existing fieldcraft kit action.')],
        description: 'An external pin-cleaning experiment reserves one full charge and one actual gummed pin. Observe the reaction before identifying the batch. Any recovered pin uses the existing native recipe and kit consumers. Ordinary scraping remains an alternative without a vial.'}),
    ...['dull', 'fineDull'].map(kind => {
        const support = all(live, opened, own(kind));
        return command({id: `${I.prefix}scrape_${kind}`, label: `Scrape a gummed pin with your dull ${kind === 'fineDull' ? 'guided ' : ''}knife spine · 2 stamina + 5 min`,
            visibleWhen: all(opened, own(kind)), requires: all(support, own('dirty')), ...job(5, support),
            costs: [item(K.dirty, -1), item(K[kind], -1), stamina(-2)],
            effects: [item(K[kind], 1, 'player', true), item(K.pin, 1),
                know(`scraping_${kind}`, 'You spent five played minutes and two stamina scraping packing gum from one actual pin with the blunt spine of your owned dull knife. One existing Recovered fitting pin remains, and the exact dull knife returns unchanged with its guide preserved. No vial was spent and no substance identity was learned.')],
            description: 'The ordinary route costs more time and effort, needs no vial or identification, and never restores a knife edge. Exact reserved inputs return on cancellation or lost support; the pin can supply the same existing kit recipe.'});
    }),
]};

export function registerGameAbsorptionAssayItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('The batch needs the existing native item owner.');
    for(const d of gameAbsorptionAssayItemSpecifications) {
        if(itemTemplates[d.id]) throw new Error(`Duplicate absorption item ${d.id}.`);
        itemTemplates[d.id] = new OtherItem({id: d.id, name: d.id, description: d.description, value: d.value, tags: {expedition: true}});
    }
}
