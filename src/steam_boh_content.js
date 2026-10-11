// BOH-P01: original deterministic workshop study. All fiction/costs are proposals.
import {FEATURE_OBJECT_IDS as O, FEATURE_OBJECT_KEYS as K} from './feature_expansion_objects.js';
import {PROTO23_KEYS as P} from './proto23_world_ids.js';

export const STEAM_BOH_IDS = Object.freeze({world: O.world, group: 'steam_boh', prefix: 'steam.boh.',
    owner: O.miri, site: O.site, situation: O.situation, authorMethod: O.method,
    begin: 'steam.boh.begin', copy: 'steam.boh.copy_manual', trial: 'steam.boh.trial', rest: 'steam.boh.rest',
    compare: 'steam.boh.compare', guided: 'steam.boh.guided', read: 'steam.boh.read',
    enrolled: 'steam.boh.enrolled', diagnostic: 'steam.boh.diagnosticAvailable', prepared: 'steam.boh.preparationVersion',
    procedure: 'steam.boh.procedureVersion', fatigue: 'steam.boh.study_fatigue', version: 1});
export const STEAM_BOH_KEYS = Object.freeze({...K, paper: P.paper, ink: P.ink,
    manual: JSON.stringify({id: 'Bench clearance manual'})});
export const steamBOHItemSpecifications = Object.freeze([{id: 'Bench clearance manual', value: 4, kind: 'manual',
    description: 'Eda’s notes on setting a working strip and checking the knife’s clearance. The diagrams help at the bench once you understand the method.'}]);
const I = STEAM_BOH_IDS, B = STEAM_BOH_KEYS;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const enrolled = eq('steamBOH.enrolled', true, 'Ask Eda about the clearance manual first.');
const body = eq('steamBOH.supported', true, 'Return to the Village, recover above one health and finish any battle or journey first.');
const live = all(body, eq('steamBOH.handsUsable', true, 'Let your hands recover before bench study or cutting.'),
    eq('steamBOH.benchSupported', true, 'You need access to Eda’s fitting bench.'));
const owner = eq('steamBOH.authorSupported', true, 'Eda must be here, willing to help, healthy enough to work and able to use her fitting method.');
const rested = eq('steamBOH.fatigued', false, 'Study fatigue must expire in played time or clear through the two-minute study rest.');
const unprepared = all(eq('steamBOH.prepared', false, 'You have already worked through the clearance comparison.'),
    eq('steamBOH.learned', false, 'You already know the clearance-check method.'));
const prepared = eq('steamBOH.prepared', true, 'Work through the clearance comparison yourself after a trial, or ask Eda to guide it.');
const learned = eq('steamBOH.learned', true, 'Read the manual after preparing the clearance comparison.');
const diagnostic = eq('steamBOH.diagnosticAvailable', true, 'First try the difficult reading and discover the missing comparison.');
const own = (name, reason) => eq(`steamBOH.own.${name}`, true, reason || `Carry your own ${name === 'manual' ? 'Bench clearance manual' : 'Sound repair stave sample'}; put it away from equipment and return any borrowed one first.`);
const item = (key, amount, returned = false) => ({type: 'item', actor: 'player', key, amount, ...(returned ? {reservationReturn: true} : {})});
const stamina = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const wage = amount => ({type: 'resource', actor: I.owner, key: 'coins', amount});
const fact = (key, value) => ({type: 'fact', scope: 'actor', actor: 'player', key, value});
const know = (key, value, stage = 'seen', attributedTo = 'player') => ({type: 'knowledge', actor: 'player', key: `${I.prefix}${key}`, stage, value,
    basis: {kind: 'observation', attributedTo, situationId: I.situation}});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village', costs: [], effects: [], ...d});
const timed = (d, support, withEda = false) => command({...d, cancellation: 'refund', reservationReturns: 1,
    completionRequires: all(enrolled, support, eq('steamBOH.workCurrent', true, 'This clearance work has changed; cancel it and begin again.')), completionFailure: 'refund',
    ...(withEda ? {targetId: I.owner, participants: ['$target'], coLocated: true, completionCoLocated: true} : {})});
const hold = [item(B.manual, -1), item(B.sound, -1)];
const returnHeld = [item(B.manual, 1, true), item(B.sound, 1, true)];
const pendingTerms = 'Cancel to recover the items, coins and stamina set aside for this work. If the work cannot be finished, they return without a result.';
const kits = ['sharp', 'fine'].map(variant => timed({id: `${I.prefix}kits_${variant}`, label: `Make 2 survey kits with ${variant === 'fine' ? 'your sharp fine fitting knife' : 'your sharp field fitting knife'} · 2 staves + 1 sap + 1 stamina + 3 min`,
    duration: 3, siteId: I.site, visibleWhen: all(enrolled, eq('steamBOH.learned')),
    requires: all(enrolled, live, rested, learned, own('manual'), own(variant, `Carry your own sharp ${variant === 'fine' ? 'Fine field fitting knife' : 'Field fitting knife'}; unequip it and return any borrowed one first.`)),
    costs: [item(B.manual, -1), item(B[variant], -1), item(B.sound, -2), item(B.sap, -1), stamina(-1)],
    effects: [item(B.manual, 1, true), item(B[variant === 'fine' ? 'fineDull' : 'dull'], 1, true), item(B.kit, 2),
        know(`kits_${variant}`, `The clearance check saves a second positioning pass. With Eda’s manual beside you, your ${variant === 'fine' ? 'sharp fine fitting knife' : 'sharp field fitting knife'}, two Sound repair staves and one Tree sap became two Prepared survey kits in three minutes for one stamina. The manual came back, and the same knife’s edge is now dulled.`)],
    description: `Set aside your manual and sharp ${variant === 'fine' ? 'fine fitting knife' : 'field fitting knife'} while you work. The manual returns and the knife comes back dulled. Your usual four-minute, two-stamina kit method remains available. ${pendingTerms}`},
    all(live, rested, learned)));

export const steamBOHDefinitions = {conditions: [{id: I.fatigue, revision: 1, label: 'Clearance-study fatigue', stacking: 'max', bioVisible: true,
    bioDetail: 'The clearance diagrams blur together. Further study must wait for two minutes of quiet rest or four minutes of elapsed game time. Ordinary work remains possible.'}], commands: [
    command({id: I.begin, label: 'Ask Eda about the bench clearance manual', once: true, targetId: I.owner, participants: ['$target'], coLocated: true,
        visibleWhen: all(eq('actor.feature_objects.introduced'), eq('steamBOH.enrolled', false)), requires: all(eq('actor.feature_objects.introduced'), live, owner),
        effects: [fact(I.enrolled, true), know('opening', '“The strip is easy to mark,” Eda says. “It’s the room for the edge that trips people up.” She can copy her notes with your Cyorian research paper and formula ink for two coins, one of her stamina and three minutes. Bring your own copy and a Sound repair stave to study. Her guided comparison costs three coins; trying the difficult reading first will expose the gap, but leave you tired for four minutes.', 'seen', I.owner)],
        description: 'Ask what the manual teaches. This conversation is free; copying and guidance are separate choices.'}),
    timed({id: I.copy, label: 'Commission a clearance manual · paper + ink + 2 coins + 3 min', duration: 3, siteId: I.site,
        visibleWhen: enrolled, requires: all(enrolled, live, owner),
        costs: [item(B.paper, -1), item(B.ink, -1), money(-2), stamina(-1, I.owner)],
        effects: [wage(2), item(B.manual, 1), know('copy', 'Eda lays out your Cyorian research paper and formula ink, then copies her clearance notes. Three minutes and one of her stamina produce a Bench clearance manual. She takes your two coins for the work; you can commission another copy whenever you need one.', 'seen', I.owner)],
        description: `Bring one Cyorian research paper, one Cyorian formula ink and two coins. Eda spends one stamina and three minutes copying a manual for you. ${pendingTerms}`}, all(live, owner), true),
    timed({id: I.trial, label: 'Try the difficult reading · manual + sample set aside + 2 stamina + 3 min', once: true, duration: 3, siteId: I.site,
        visibleWhen: all(enrolled, unprepared), requires: all(enrolled, live, rested, unprepared, own('manual'), own('sound')),
        costs: [...hold, stamina(-2)], effects: [...returnHeld, fact(I.diagnostic, true),
            know('diagnostic', 'You can identify the sound stave, but the diagrams leave one question unanswered: how much room does the knife’s edge need beside the marked working strip? This missing edge-clearance comparison is where the reading stopped. Your manual and sample return. You still need to settle that comparison before learning the method.'),
            {type: 'condition', actor: 'player', id: I.fatigue, operation: 'apply', duration: 4}],
        description: `This attempt will stop at the missing clearance comparison. Set aside your manual and one Sound repair stave, then spend two stamina and three minutes to find that gap. Both items return; four minutes of study fatigue follow. Eda’s guided preparation lets you skip this attempt. ${pendingTerms}`}, all(live, rested, unprepared)),
    timed({id: I.rest, label: 'Rest from clearance study · 2 min', once: true, duration: 2,
        visibleWhen: all(enrolled, eq('steamBOH.fatigued')), requires: all(enrolled, body, eq('steamBOH.fatigued')),
        effects: [{type: 'condition', actor: 'player', id: I.fatigue, operation: 'remove'},
            know('rest', 'After two quiet minutes, the clearance diagrams stop swimming together. The question about the edge remains ready to revisit. Your hands and stamina are as they were; this rest settled only the study fatigue.')],
        description: `Two quiet minutes clear this study fatigue. You may also wait for its four-minute expiry. This rest restores no stamina and does not treat sore hands. It can finish even if the fatigue expires while you rest. ${pendingTerms}`}, body),
    timed({id: I.compare, label: 'Resolve the missing clearance comparison · manual + sample set aside + 2 min', once: true, duration: 2, siteId: I.site,
        visibleWhen: all(enrolled, eq('steamBOH.diagnosticAvailable'), unprepared),
        requires: all(enrolled, live, rested, unprepared, diagnostic, own('manual'), own('sound')),
        costs: hold, effects: [...returnHeld, fact(I.diagnostic, false), fact(I.prepared, I.version),
            know('comparison', 'Recovered, you lay the manual against your Sound repair stave and compare the marked strip with the room the knife edge needs. After two minutes the question from your failed reading is settled. The manual and sample return, and you are ready to read for the full method.', 'understood')],
        description: `Return to the exact question your trial uncovered, once the study fatigue clears. Your manual and Sound repair stave are set aside for two minutes and then return. Resolving the gap prepares you for reading. ${pendingTerms}`}, all(live, rested, unprepared, diagnostic)),
    timed({id: I.guided, label: 'Ask Eda to guide the comparison · manual + sample set aside + 3 coins + 3 min', once: true, duration: 3, siteId: I.site,
        visibleWhen: all(enrolled, unprepared), requires: all(enrolled, live, owner, rested, unprepared, own('manual'), own('sound')),
        costs: [...hold, money(-3), stamina(-1, I.owner)], effects: [...returnHeld, wage(3), fact(I.prepared, I.version),
            know('guided', 'Eda sets your manual beside the Sound repair stave and walks you through the room the knife’s edge needs. Three minutes, three coins and one of her stamina settle the comparison. She returns both materials; you are ready to read for the full method.', 'understood', I.owner)],
        description: `Skip the difficult trial by paying Eda to prepare the comparison with you. Set aside your manual and one Sound repair stave, pay three coins and use three minutes of Eda’s time plus one of her stamina. Reading for the method comes next. ${pendingTerms}`}, all(live, owner, rested, unprepared), true),
    timed({id: I.read, label: 'Read the prepared manual · manual set aside + 1 stamina + 3 min', once: true, duration: 3, siteId: I.site,
        visibleWhen: all(enrolled, eq('steamBOH.prepared'), eq('steamBOH.learned', false)),
        requires: all(enrolled, live, rested, prepared, eq('steamBOH.learned', false, 'You already know the clearance-check method.'), own('manual')),
        costs: [item(B.manual, -1), stamina(-1)], effects: [item(B.manual, 1, true), fact(I.procedure, I.version),
            know('procedure', 'The comparison makes the rest of Eda’s notes fall into place. After three minutes and one stamina, you know the clearance check: set the marked strip, compare the edge clearance, then cut each sound stave without a second positioning pass. Your manual returns. Keep a copy beside your own sharp fitting knife to make two survey kits from two Sound repair staves and one Tree sap in three minutes for one stamina.', 'understood')],
        description: `Spend three minutes and one stamina reading with the comparison settled. Your manual is set aside and then returned. The method stays with you if you lose the copy, but kit work still needs a copy at the bench. ${pendingTerms}`}, all(live, rested, prepared, eq('steamBOH.learned', false, 'You already know the clearance-check method.'))),
    ...kits,
]};
