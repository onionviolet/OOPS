// Original reversible fieldcraft proposal. Definitions create no stock or actors
// until an explicit, once-only meeting; no copied NetHack code or fiction.
import {all, eq, not} from './basics.js';
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as OK} from './feature_expansion_objects.js';
import {REFERENCE_GAMEPLAY_KEYS as RK} from './reference_gameplay_content.js';
export const NETHACK_FIELDCRAFT_IDS = Object.freeze({world: O.world, group: 'nethack_fieldcraft', eda: O.miri, site: O.site,
    dog: 'nethack_fieldcraft.rill', open: 'nethack_fieldcraft.open', oil: 'nethack_fieldcraft.reed_oil', scent: 'nethack_fieldcraft.scented_recess', train: 'nethack_fieldcraft.train', assay: 'nethack_fieldcraft.assay',
    trialPlain: 'nethack_fieldcraft.trial_dull', trialFine: 'nethack_fieldcraft.trial_fineDull', scentCommand: 'nethack_fieldcraft.scent',
    recoverManual: 'nethack_fieldcraft.recover_manual', recoverDog: 'nethack_fieldcraft.recover_dog'});
const I = NETHACK_FIELDCRAFT_IDS, key = id => JSON.stringify({id});
export const NETHACK_FIELDCRAFT_KEYS = Object.freeze({vial: key('Unmarked pale vial'), empty: key('Empty bench vial'),
    ration: key('Workshop ration'), pin: key('Recovered fitting pin'), dull: OK.dull, fineDull: OK.fineDull,
    sharp: OK.sharp, fine: OK.fine, sound: OK.sound, resin: RK.resin, kit: OK.kit});
const K = NETHACK_FIELDCRAFT_KEYS;
export const nethackFieldcraftItemSpecifications = Object.freeze([
    {id: 'Unmarked pale vial', description: 'A full pale vial of one fixed bench substance. Its appearance alone does not identify its function. Apply only at the fitting bench; it is neither a drink nor dog food. Each use returns an Empty bench vial.', value: 2},
    {id: 'Empty bench vial', description: 'The owned container after one measured bench application. It has no remaining charge and no automatic refill.', value: 1},
    {id: 'Workshop ration', description: 'One actual portion suitable for Rill, Eda\'s workshop dog. Feeding supplies disclosed satiety and effort capacity; it creates no friendship reward.', value: 1},
    {id: 'Recovered fitting pin', description: 'One actual fitting pin retrieved from Eda\'s recess with her permission. Bind it with one sound stave and one set resin into an existing Prepared survey kit.', value: 1},
]);
const gte = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const item = (key, amount, actor = 'player', returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const stamina = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const resource = (key, amount, actor = I.dog) => ({type: 'resource', actor, key, amount});
const fact = (name, value = true, actor = 'player') => ({type: 'fact', scope: 'actor', actor, key: `nethack_fieldcraft.${name}`, value});
const know = (name, value, stage = 'seen', actor = 'player', attributedTo = 'player', kind = 'observation') =>
    ({type: 'knowledge', actor, key: `nethack_fieldcraft.${name}`, stage, value, basis: {kind, attributedTo, situationId: O.situation}});
const identity = () => know('reed_oil', 'Firsthand bench application identified the pale substance as reed oil. Other full vials of this same fixed bench stock contain reed oil; empty containers remain empty.', 'understood');
const opened = eq('fieldcraft.opened');
const live = all(eq('fieldcraft.supported', true, 'Return to the Village with your supported living body and local played clock.'),
    eq('fieldcraft.handsUsable', true, 'Recover your usable hands for bench work.'), gte('vital.health', 2));
const eda = eq('fieldcraft.edaSupported', true, 'Eda needs her present living body and permission.');
const dog = eq('fieldcraft.dogSupported', true, 'Rill needs present willingness, a living body, usable jaws and all four legs.');
const cared = all(dog, gte('fieldcraft.dogSatiety', 1, 'Feed Rill a Workshop ration before asking for effort.'), gte('fieldcraft.dogStamina', 1, 'Rill needs one actual stamina.'));
const identified = eq('fieldcraft.identified');
const vial = eq('fieldcraft.own.vial', true, 'Carry one owned, unborrowed and unequipped full pale vial.');
const command = d => ({revision: 1, worldId: I.world, actorId: 'player', location: 'Village', group: I.group, costs: [], effects: [], ...d,
    requires: d.id === I.open ? d.requires : all(opened, d.requires)});
const job = (duration, support, participants = []) => ({duration, cancellation: 'refund', siteId: I.site,
    completionRequires: all(opened, support), completionFailure: 'refund', ...(participants.length ? {participants, completionCoLocated: true} : {})});
const withEda = {targetId: I.eda, coLocated: true, participants: ['$target']};
const discharge = () => item(K.empty, 1, 'player', true);
const effort = [resource('satiety', -1), stamina(-1, I.dog), stamina(-1)];
export const nethackFieldcraftDefinitions = {
    people: [{id: I.dog, revision: 1, label: 'Rill, Eda\'s workshop dog', worldId: I.world, location: 'Village', inventory: 'simulation', provision: false,
        resources: {satiety: 0, lessons: 0}, body: {legs: 4, jaws: 1}, vitals: {health: 10, max_health: 10, stamina: 4, max_stamina: 4}}],
    conditions: [{id: I.scent, revision: 1, label: 'Reed-oil scent on Eda\'s recess'}],
    commands: [
        command({id: I.open, label: 'Ask Eda about her pale vials and workshop dog', once: true, ...withEda,
            visibleWhen: eq('fieldcraft.canMeet'), requires: all(live, eda, eq('fieldcraft.canMeet')),
            effects: [fact('opened'), {type: 'spawn', personId: I.dog, definitionId: I.dog}, fact('willing', true, I.dog),
                item(K.vial, 3, I.eda), item(K.ration, 4, I.eda), item(K.pin, 2, I.eda),
                know('offer', 'Eda shows three full Unmarked pale vials at two coins each and four Workshop rations at one coin each. Two actual fitting pins lie in her inaccessible bench recess. She permits safe external bench trials and pin retrieval. Do not drink the vial or feed it to Rill. Asking buys nothing and accepts no debt. This is her finite existing supply; return visits do not replenish it.', 'seen', 'player', I.eda, 'instruction'),
                know('rill', 'Rill stays in the Village under Eda\'s care. Workshop rations restore up to two satiety (maximum four) and two stamina (maximum four). Only accepted lessons and retrievals spend care; no timer, offscreen starvation or death applies. Two scent lessons permit directed retrieval. You may calmly hand attention back to Eda.', 'seen', 'player', I.eda, 'instruction'),
                know('offer_record', 'I permitted this traveler to use my finite bench supplies and meet Rill. My two lost pins remain mine until an actual paid-effort recovery transfers one.', 'seen', I.eda, I.eda, 'instruction')],
            description: 'Meet a local actor with finite effort and explicit care. Rill does not join native battles or travel; this meeting replenishes no earlier stock.'}),
        ...[['vial', K.vial, 2, 'Unmarked pale vial'], ['ration', K.ration, 1, 'Workshop ration']].map(([name, stock, price, label]) => command({
            id: `nethack_fieldcraft.buy_${name}`, label: `Buy one ${label} · ${price} coin${price > 1 ? 's' : ''}`, ...withEda, visibleWhen: opened,
            requires: all(live, eda, eq(`fieldcraft.stock.${name}`, true, 'Eda needs one actual remaining item from her finite stock.')),
            costs: [{type: 'resource', native: true, actor: 'player', key: 'money', amount: -price}, {type: 'transfer', from: I.eda, to: 'player', key: stock, count: 1}],
            effects: [resource('coins', price, I.eda), know(`purchase_${name}`, `You paid Eda ${price} native coin${price > 1 ? 's' : ''} for one actual ${label}. Her stock decreased and her purse received the money. Purchase reveals no substance identity.`)],
            description: 'Transfers real seller stock and native coins atomically. No stock renewal or hidden obligation.'})),
        command({id: 'nethack_fieldcraft.assay', label: 'Observe one pale vial on the bench sample · 1 stamina + 3 min', once: true,
            visibleWhen: all(opened, not(identified)), requires: all(live, vial), ...job(3, live), costs: [item(K.vial, -1), stamina(-1)],
            effects: [discharge(), identity(), know('assay', 'You used one full pale vial on the bench sample. Its lasting lubricating film and distinct reed scent identified reed oil through your own observation. The spent charge left one actual Empty bench vial.')],
            description: 'External application only. Paid played-time observation teaches the substance, consumes the full charge and returns its container; it creates no free sample.'}),
        ...[['dull', 'sharp', 'plain'], ['fineDull', 'fine', 'fine guided']].map(([from, to, label]) => command({
            id: `nethack_fieldcraft.trial_${from}`, label: `Apply a pale vial to your own dull ${label} knife · 1 stamina + 3 min`,
            visibleWhen: all(opened, eq(`fieldcraft.own.${from}`)), requires: all(live, vial, eq(`fieldcraft.own.${from}`)), ...job(3, live),
            costs: [item(K.vial, -1), item(K[from], -1), stamina(-1)], effects: [discharge(), item(K[to], 1, 'player', true), identity(),
                know(`trial_${from}`, `Your own dull ${label} knife received the full measured substance and bench abrasive. It returned as its exact sharp counterpart, preserving any fine guide. The firsthand useful effect identified reed oil; one Empty bench vial remained.`)],
            description: 'One owned knife transforms into one corresponding sharp knife. Borrowed and equipped knives are excluded. Cancellation restores exact inputs and teaches nothing.'})),
        command({id: 'nethack_fieldcraft.scent', label: 'Scent Eda\'s recess with identified reed oil · 1 stamina', ...withEda,
            visibleWhen: all(opened, identified), requires: all(live, eda, identified, vial, not(eq('fieldcraft.scented'))),
            costs: [item(K.vial, -1), stamina(-1)], effects: [discharge(), {type: 'condition', actor: I.eda, id: I.scent, operation: 'apply', duration: 12},
                know('scent', 'You applied one actual reed-oil charge to Eda\'s permitted recess, not to Rill. Its scent lasts twelve played minutes and helps trained local retrieval only while that same field remains live. The spent container remains yours.')],
            description: 'A second use of the same identified substance. Its bounded condition expires on the existing scheduler and is checked again when dog retrieval completes.'}),
        command({id: 'nethack_fieldcraft.feed', label: 'Feed Rill one Workshop ration · up to 2 satiety + 2 dog stamina', ...withEda, participants: ['$target', I.dog],
            visibleWhen: opened, requires: all(live, eda, eq('fieldcraft.dogPresent'), eq('fieldcraft.canFeed', true, 'Rill is already full; keep the ration.')),
            costs: [item(K.ration, -1)], effects: [resource('satiety', {fact: 'fieldcraft.feedAmount'}), stamina(2, I.dog),
                know('fed', 'Rill ate one actual suitable Workshop ration. It restored up to two disclosed satiety and two stamina within his finite bounds. Feeding earned no lesson, mood, loyalty or stock reward.')],
            description: 'Rations are dog food; pale vials are not. Full satiety refuses feeding without spending anything. Feeding remains possible during a calm handoff.'}),
        command({id: I.train, label: 'Practice one ordinary scent lesson with Rill · 2 min + care effort', ...withEda,
            visibleWhen: all(opened, not(gte('fieldcraft.dogLessons', 2))), requires: all(live, eda, cared, not(gte('fieldcraft.dogLessons', 2))),
            ...job(2, all(live, eda, dog, not(gte('fieldcraft.dogLessons', 2))), ['$target', I.dog]), costs: effort,
            effects: [resource('lessons', 1), know('training', 'One ordinary directed scent lesson completed with Eda\'s permission. You and Rill each spent actual stamina, and Rill spent one satiety. Two completed lessons suffice; practice stops there.', 'understood'),
                know('lesson', 'I completed one willing scent-following lesson with this traveler and Eda at the bench.', 'understood', I.dog),
                {type: 'relationship', actor: I.dog, target: 'player', axis: 'scent_lessons', amount: 1, text: 'Completed one directed scent-following lesson at Eda\'s bench.'}],
            description: 'Mundane learning, no magic or oil required. At most two actual lessons. Cancellation returns reserved care and player effort without awarding learning.'}),
        command({id: 'nethack_fieldcraft.recover_manual', label: 'Recover one of Eda\'s actual pins by hand · 2 stamina + 4 min', ...withEda,
            visibleWhen: opened, requires: all(live, eda, eq('fieldcraft.pinAvailable', true, 'Both finite pins have already been retrieved or reserved.')),
            ...job(4, all(live, eda), ['$target']), costs: [stamina(-2), item(K.pin, -1, I.eda)],
            effects: [item(K.pin, 1), know('manual_pin', 'You carefully recovered one actual fitting pin from Eda\'s recess with her permission. That same finite pin is now yours. This needed neither oil nor a trained dog.')],
            description: 'A complete ordinary route. The accepted recovery removes one actual pin into reservation; completion hands that pin to you. Cancellation returns it to Eda.'}),
        command({id: 'nethack_fieldcraft.recover_dog', label: 'Ask trained Rill to retrieve one actual pin · care + 1 stamina + 1 min', ...withEda,
            visibleWhen: all(opened, gte('fieldcraft.dogLessons', 2)), requires: all(live, eda, cared, gte('fieldcraft.dogLessons', 2), eq('fieldcraft.scented', true, 'Apply identified reed oil to this recess first.'), eq('fieldcraft.pinAvailable')),
            ...job(1, all(live, eda, dog, gte('fieldcraft.dogLessons', 2), eq('fieldcraft.scented')), ['$target', I.dog]),
            costs: [...effort, item(K.pin, -1, I.eda)],
            effects: [item(K.pin, 1), know('dog_pin', 'With the actual scent still live, trained willing Rill retrieved one of Eda\'s finite fitting pins. His satiety and stamina and your stamina paid for the accepted help. The same pin is now yours; no duplicate reward was created.'),
                know('retrieval', 'I followed the live reed scent and retrieved one real pin with the traveler and Eda present.', 'seen', I.dog),
                {type: 'relationship', actor: I.dog, target: 'player', axis: 'pin_retrievals', amount: 1, text: 'Completed a willing retrieval of one actual fitting pin.'}],
            description: 'Requires two earned lessons, current consent, jaws, four legs, health, attention and co-location. Lost scent or support at completion returns reserved pin and effort and produces no result.'}),
        command({id: 'nethack_fieldcraft.pin_kit', label: 'Bind one pin, sound stave and set resin into a survey kit · 1 stamina + 3 min',
            visibleWhen: opened, requires: live, ...job(3, live), costs: [item(K.pin, -1), item(K.sound, -1), item(K.resin, -1), stamina(-1)],
            effects: [item(K.kit, 1), know('pin_kit', 'One actual recovered fitting pin, one Sound repair stave and one Set repair resin became one existing Prepared survey kit. Existing native preparation, trade and finite orders use that same item.')],
            description: 'A practical native inventory output, using real recovered stock. Cancellation returns all exact reserved inputs.'}),
        ...[[false, 'handoff', 'Hand Rill\'s workshop attention back to Eda'], [true, 'resume', 'Ask Eda and Rill to resume willing workshop practice']].map(([willing, name, label]) => command({
            id: `nethack_fieldcraft.${name}`, label, ...withEda, participants: ['$target', I.dog], visibleWhen: all(opened, eq('fieldcraft.dogWilling', !willing)),
            requires: all(live, eda, eq('fieldcraft.dogPresent'), eq('fieldcraft.dogWilling', !willing)),
            effects: [fact('willing', willing, I.dog), know(name, willing ? 'Eda and Rill agreed to resume local practice. Existing care, lessons and finite stock remain as they were.' : 'You calmly returned Rill\'s workshop attention to Eda. Practice and help pause with no penalty, stock reset, refund or lost learning.', 'seen', 'player', I.eda, 'instruction')],
            description: 'Changes only present workshop willingness. Rill remains a Village resident under Eda\'s care.'})),
    ],
};
export function registerNethackFieldcraftItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('Fieldcraft requires the existing native item owner.');
    for(const d of nethackFieldcraftItemSpecifications) {
        if(itemTemplates[d.id]) throw new Error(`Duplicate fieldcraft item ${d.id}.`);
        itemTemplates[d.id] = new OtherItem({id: d.id, name: d.id, description: d.description, value: d.value, tags: {expedition: true}});
    }
}
