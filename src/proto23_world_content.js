import {PROTO23_IDS as I, PROTO23_LOCATIONS as L, PROTO23_KEYS as K} from './proto23_world_ids.js';
export * from './proto23_world_ids.js';
export const proto23Worlds = [{id: I.world, label: 'Proto23 village · furnished visitor life', publicName: 'Proto23 village',
    continuityLabel: 'Original independent retained-body visitor branch',
    provenance: '23html, Proto23; official HTML e93a8cd61793. Village Center/Dojo, reading and counted furnishings inspire this original branch. No source pupil, deed, tutorial, runtime or assets are copied.'}];
export const proto23Sources = [];
export const PROTO23_INITIAL_FACTS = {[I.world]: {'proto23.arrivalMet': false, 'proto23.arcClosed': false,
    'proto23.bedInstalled': false, 'proto23.hearthInstalled': false, 'proto23.bookstandInstalled': false}};
export const PROTO23_NATIVE_PEOPLE = {
    [I.steward]: {inventory: {}, skills: {}, reputation: {}},
    [I.tutor]: {inventory: {[K.sharp]: 1}, skills: {}, reputation: {}},
};
export const PROTO23_NATIVE_STOCK = {[I.stock]: {}, [I.shop]: {
    [K.bed]: 1, [K.hearth]: 1, [K.bookstand]: 1, [K.log]: 14, [K.sap]: 6,
    [K.sharp]: 2, [K.paper]: 3, [K.ink]: 3,
}};
const people = [
    [I.steward, 'Mara, original guest steward', L.center, {coins: 12, attention: 10}],
    [I.tutor, 'Toma, original handling tutor', L.dojo, {coins: 0, attention: 6}],
].map(([id, label, location, resources]) => ({id, label, revision: 1, worldId: I.world, location,
    description: 'Original independent village resident. Own body, finite purse, attention and stock; no source protagonist or automatic private knowledge.',
    inventory: 'native', provision: false, resources, body: {form: 'human', hands: 2, mobile: true},
    vitals: {health: 24, max_health: 24, stamina: 18, max_stamina: 18}}));
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const af = (name, value = true) => ({type: 'fact', scope: 'actor', actor: 'player', key: I.prefix + name, value});
const wf = (name, value = true) => ({type: 'world', worldId: I.world, key: I.prefix + name, value});
const item = (key, amount, returned = false, actor = 'player') => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const purse = (actor, amount) => ({type: 'resource', actor, key: 'coins', amount});
const attention = actor => ({type: 'resource', actor, key: 'attention', amount: -1});
const effort = (amount, actor = 'player') => ({type: 'vital', actor, key: 'stamina', amount});
const know = (name, value, stage = 'seen', attributedTo = 'player', kind = 'observation') => ({type: 'knowledge', actor: 'player', key: I.prefix + name,
    stage, value, basis: {kind, attributedTo, situationId: I.situation}});
const has = name => eq('actor.' + I.prefix + name);
const ready = eq('proto23.playerSupported', true, 'Use your actual living controlled human body in this retained Proto23 visit with supported hands.');
const rights = all(ready, has('cottageRight'));
const own = name => eq('proto23.own.' + name, true, 'Carry the exact owned, unborrowed, unequipped item or this job’s unchanged reserved item.');
const fixtures = all(eq('world.proto23.bedInstalled'), eq('world.proto23.hearthInstalled'), eq('world.proto23.bookstandInstalled'));
function cmd(name, label, location, d = {}) {
    const requires = all(ready, ...(d.targetId ? [eq('proto23.support.' + d.targetId)] : []), ...(d.requires ? [d.requires] : []));
    return {id: I.prefix + name, revision: 1, label, group: I.group, actorId: 'player', worldId: I.world, location,
        once: true, costs: [], effects: [], visibleWhen: d.visibleWhen || d.requires || ready, ...d, requires,
        ...(d.targetId ? {coLocated: true, participants: ['$target']} : {}),
        ...(d.duration ? {reservationReturns: 1, cancellation: 'refund', completionFailure: 'refund',
            completionRequires: requires, completionCoLocated: !!d.targetId} : {})};
}
const shop = (name, key, price) => cmd('buy_' + name, `Buy ${JSON.parse(key).id} · ${price} native coin${price === 1 ? '' : 's'}`, L.center, {
    once: false, targetId: I.steward, visibleWhen: has('stewardMet'),
    requires: all(has('stewardMet'), {fact: `proto23.stock.${I.shop}.${key}`, op: 'gte', value: 1}),
    proto23Stock: [{owner: I.shop, key, count: -1}], costs: [money(-price)],
    effects: [purse(I.steward, price), item(key, 1), know('purchase_' + name, 'Bought one actual counted supply. The original branch explicitly accepts native coins; Mara keeps the payment. The finite desk has no daily, visit, menu or absence refill.', 'seen', I.steward)]});
const installed = name => eq('world.proto23.' + name + 'Installed');
const install = name => cmd('install_' + name, `Install your counted ${name} as a fixed cottage fixture · 1 stamina + 2 min`, L.cottage, {
    siteId: I.site, claim: I.prefix + 'fixture.' + name, visibleWhen: all(has('cottageRight'), not(installed(name))),
    requires: all(rights, own(name), not(installed(name))), duration: 2,
    costs: [item(K[name], -1), effort(-1)], effects: [wf(name + 'Installed'),
        know('installed_' + name, `Your one actual owned ${name} was installed at your permitted cottage station. Its inventory object was consumed into a fixed local fixture, with your settled installation claim retained. It cannot remain carried or be exported, removed or installed again. Cancel before completion to return the same reserved object and effort. No duplicate room, bed, resident or global percentage bonus was created.`)]});
const method = all(has('handlingLearned'), has('handlingPracticed'));
const shape = learned => cmd(learned ? 'shape_practiced' : 'shape_ordinary', `${learned ? 'Use your practiced handling' : 'Work slowly by ordinary handling'} · 1 log + sharp knife → wet stave + 2 green offcuts`, L.cottage, {
    once: false, siteId: I.site, visibleWhen: has('cottageRight'), requires: all(rights, own('sharp'), ...(learned ? [method] : [])),
    duration: learned ? 3 : 5, costs: [item(K.log, -1), item(K.sharp, -1), effort(learned ? -2 : -3)],
    effects: [item(K.dull, 1, true), item(K.wet, 1), item(K.green, 2), af('staveShaped'),
        know('shape_' + (learned ? 'practiced' : 'ordinary'), `One actual log was divided into one Wet repair stave and two Green repair offcuts. The actual sharp fitting knife returned as its dulled variant once. ${learned ? 'Your personally demonstrated narrow handling method saved two minutes and one stamina.' : 'The slower ordinary method remains available without buying a lesson.'} Material still needs real drying. No Sword Mastery, attack, free stock or source XP was copied.`)]});
export const proto23Commands = [
    {id: 'proto23.chart', revision: 1, label: 'Read the Proto23 independent visitor terms', group: I.group, actorId: 'player',
        worldId: 'base.frontier', location: 'Village', once: true, costs: [], visibleWhen: eq('village.elderMet'),
        requires: all(eq('village.elderMet'), eq('proto23.chartSupported')),
        effects: [{type: 'situation', situationId: I.situation, operation: 'begin'}, af('chart'),
            know('chart', '23html’s Proto23 supplies attributed village/dojo, activity reading and counted home-furniture ideas. Choose an original independent visitor in your present body. This branch grants no source pupil biography, inherited deed, tutorial reward, blade rank, memories, magical source or prestige. Native coins are accepted for this finite authored desk. One played-clock retained village freezes during unsupported absence; return does not refill anyone.', 'understood', 'player', 'instruction')]},
    cmd('arrival', 'Read the guest steward’s current village board', L.center, {requires: not(eq('world.proto23.arrivalMet')),
        effects: [wf('arrivalMet'), af('stewardMet'), know('arrival', 'Mara offers finite paid sorting, an ordinary paid cottage agreement and counted supplies. Toma offers one willing handling lesson in the dojo. Their names, fees, stock, rights and schedules are original branch proposals; you are an independent visitor, not the source opening pupil.', 'seen', I.steward)]}),
    cmd('sorting_work', 'Complete Mara’s finite supply sorting · earn 8 native coins, 5 min', L.center, {targetId: I.steward,
        claim: 'proto23.sorting_work', visibleWhen: has('stewardMet'), requires: has('stewardMet'), duration: 5,
        costs: [purse(I.steward, -8), attention(I.steward), effort(-2)], effects: [money(8), af('worked'),
            know('wage', 'Completed the real finite desk sorting. Eight coins moved from Mara’s own reserved purse into your native money owner. Mara spent one attention; you spent two stamina and five minutes. No recurring wage or job demand refill follows.', 'seen', I.steward)]}),
    cmd('cottage_agreement', 'Pay for this ordinary visitor cottage right · 2 coins + 2 min', L.center, {targetId: I.steward,
        claim: 'proto23.cottage_right', visibleWhen: has('stewardMet'), requires: has('stewardMet'), duration: 2,
        costs: [money(-2), attention(I.steward)], effects: [purse(I.steward, 2), af('cottageRight'),
            know('cottage_right', 'Paid two native coins for an original ordinary cottage agreement. The access right covers one existing local guest station and fixed fixtures you actually install. It supplies no inherited source hut/deed, family, free furnishing, rent timer, resident or home-world residence.', 'understood', I.steward, 'instruction')]}),
    cmd('decline', 'Decline the optional cottage/lesson project and keep ordinary life available', L.center, {visibleWhen: has('stewardMet'),
        effects: [af('declined'), know('declined', 'Declined this optional project without cost, skill, property, payout or loss of your home adventure. You may still buy counted supplies, work slowly, return, or later choose the project; this observation does not reset Mara’s demand.')]}),
    shop('bed', K.bed, 2), shop('hearth', K.hearth, 2), shop('bookstand', K.bookstand, 1),
    shop('log', K.log, 1), shop('sap', K.sap, 1), shop('knife', K.sharp, 2), shop('paper', K.paper, 1), shop('ink', K.ink, 1),
    cmd('read_handling', 'Read the paid annotated handling lesson at the public desk · 1 coin + 6 min', L.center, {targetId: I.steward,
        claim: 'proto23.learned_handling', visibleWhen: has('stewardMet'), requires: all(has('stewardMet'), not(has('handlingLearned'))), duration: 6,
        costs: [money(-1), attention(I.steward), effort(-1)], effects: [purse(I.steward, 1), af('handlingLearned'), af('learningRoute', 'reading'),
            know('handling', 'Read the paid original public handling annotation for six actual activity minutes. Grip, safe edge direction and measured cuts are information; possession/title alone would not grant execution. Toma’s actual practice trial is still required before the faster personal cut. This is a bounded native method, not the source Bladesman Manual reward or Sword Mastery.', 'understood', I.steward, 'instruction')]}),
    cmd('instruction_handling', 'Ask willing Toma for a supervised handling lesson · 2 coins + 4 min', L.dojo, {targetId: I.tutor,
        claim: 'proto23.learned_handling', visibleWhen: eq('world.proto23.arrivalMet'), requires: all(not(has('handlingLearned')), own('sharp'), eq('proto23.tutorMethod')),
        duration: 4, costs: [money(-2), attention(I.tutor), effort(-1, I.tutor), effort(-1), item(K.sharp, -1)],
        effects: [purse(I.tutor, 2), item(K.sharp, 1, true), af('handlingLearned'), af('learningRoute', 'instruction'),
            know('handling', 'Toma actually attended a four-minute paid demonstration, spending his own attention and stamina while you held and returned your sharp knife once. You learned the same narrow grip/edge/datum procedure as the reading route. His body, knife, private knowledge, source rank and competence stay his. Your personal trial remains separate.', 'understood', I.tutor, 'instruction')]}),
    cmd('instruction_study_conditioning', 'Ask Toma about optional study conditioning · 2 coins + 4 min', L.dojo, {targetId: I.tutor,
        claim: 'proto23.study_conditioning_lesson', visibleWhen: eq('world.proto23.arrivalMet'),
        requires: not(has('studyConditioningLearned')), duration: 4,
        costs: [money(-2), attention(I.tutor), effort(-1, I.tutor), effort(-1)],
        effects: [purse(I.tutor, 2), af('studyConditioningLearned'),
            know('study_conditioning', 'Toma personally demonstrated a quiet posture method during four paid supported minutes. You may explicitly enroll in this optional visitor method, then enable conditioning during actual ordinary book reading. The lesson itself grants no profile, XP, tonic, healing or native Literacy change.', 'understood', I.tutor, 'instruction')]}),
    cmd('practice_handling', 'Personally demonstrate the learned handling · held sharp knife + 2 stamina + 3 min', L.dojo, {
        claim: 'proto23.handling_practice', visibleWhen: has('handlingLearned'), requires: all(has('handlingLearned'), own('sharp')), siteId: I.dojo,
        duration: 3, costs: [item(K.sharp, -1), effort(-2)], effects: [item(K.sharp, 1, true), af('handlingPracticed'),
            know('practice', 'Personally rehearsed the safe grip, edge clearance and marked cut path with your actual sharp fitting knife for three minutes and two stamina. The same knife returned once. This concrete demonstration enables only the faster local stave cut and your eventual noted home kit operation; it supplies no damage bonus, native skill unlock or combat mastery.', 'understood')]}),
    install('bed'), install('hearth'), install('bookstand'),
    cmd('bed_rest', 'Rest on your installed plain bed · 4 min, recover up to 4 stamina', L.cottage, {once: false, siteId: I.site,
        visibleWhen: installed('bed'), requires: all(rights, installed('bed')), duration: 4,
        effects: [effort(4), af('bedUsed'), know('bed_rest', 'Used your actually installed local bed for four played minutes. Up to four missing stamina returned within the real maximum; health, permanent markings and other people’s reserves were not restored. There is no global bedding multiplier or automatic absence recovery.')]}),
    shape(false), shape(true),
    cmd('sharpen', 'Restore your own dulled fitting knife · 1 sap + 1 stamina + 3 min', L.dojo, {once: false, siteId: I.dojo,
        visibleWhen: eq('world.proto23.arrivalMet'), requires: own('dull'), duration: 3,
        costs: [item(K.dull, -1), item(K.sap, -1), effort(-1)], effects: [item(K.sharp, 1, true),
            know('sharpen', 'Spent one real sap, one stamina and three dojo activity minutes restoring the same dulled fitting knife to its existing sharp variant. No second knife or new training was awarded.')]}),
    cmd('hearth_dry_stave', 'Dry one actual wet stave at your installed hearth · 1 fuel log + 1 stamina + 4 min', L.cottage, {once: false,
        siteId: I.site, visibleWhen: installed('hearth'), requires: all(rights, installed('hearth')), duration: 4,
        costs: [item(K.log, -1), item(K.wet, -1), effort(-1)], effects: [item(K.sound, 1), af('hearthUsed'), af('stavePrepared'),
            know('hearth_stave', 'One actual fuel log powered four minutes of supported hearth drying. Your one Wet repair stave became one Sound repair stave and stayed yours. Fuel is consumed by this committed operation, not an endless fireplace or an absence timer. The actual sound stave can supply existing repair, kit and home-world work.')]}),
    cmd('hearth_dry_offcuts', 'Dry two actual green offcuts at your installed hearth · 1 fuel log + 1 stamina + 4 min', L.cottage, {once: false,
        siteId: I.site, visibleWhen: installed('hearth'), requires: all(rights, installed('hearth')), duration: 4,
        costs: [item(K.log, -1), item(K.green, -2), effort(-1)], effects: [item(K.offcut, 2), af('hearthUsed'),
            know('hearth_offcuts', 'Your two Green repair offcuts became two Compatible repair offcuts using one real fuel log and four supported played minutes. Counted matter changed condition; the local fixture grants no arbitrary crafting, permanent drying aura or overnight stock.')]}),
    cmd('bookstand_compare', 'Compare your personally tested cut at the installed bookstand · 1 stamina + 3 min', L.cottage, {
        claim: 'proto23.bookstand_use', siteId: I.site, visibleWhen: installed('bookstand'),
        requires: all(rights, installed('bookstand'), method, has('stavePrepared')), duration: 3, costs: [effort(-1)],
        effects: [af('bookstandUsed'), know('comparison', 'At your actual installed bookstand, compared the paid lesson with your own demonstrated grip, cut and fueled drying result. The station’s fixed annotation and deliberate comparison support a useful personal record; sitting here grants no passive Literacy XP, universal recipe or spell knowledge.', 'understood')]}),
    cmd('compile_notebook', 'Compile your own tested practice notebook · real paper + ink + 1 stamina + 4 min', L.cottage, {
        claim: 'proto23.own_notebook', siteId: I.site, visibleWhen: has('bookstandUsed'),
        requires: all(rights, fixtures, method, has('bedUsed'), has('hearthUsed'), has('stavePrepared'), has('bookstandUsed')), duration: 4,
        costs: [item(K.paper, -1), item(K.ink, -1), effort(-1)], effects: [item(K.notes, 1), af('noteCompiled'), wf('arcClosed'),
            know('own_notebook', 'Your actual imported ordinary paper and ink became one player-authored annotated practice notebook, combining your personally demonstrated handling, measured cut, material drying and purposeful cottage uses. No magical ink property is applied. The physical record and its retained compilation receipt permit the narrow Shack kit consumer with real stave/sap/knife inputs. Your fixed cottage fixtures remain installed on return.', 'understood')]}),
    cmd('received_review', 'Show Mara your actual personal notebook · earn her remaining 4 work coins, 2 min', L.center, {targetId: I.steward,
        claim: 'proto23.received_review', visibleWhen: has('noteCompiled'), requires: all(has('noteCompiled'), own('notes')), duration: 2,
        costs: [purse(I.steward, -4), attention(I.steward), item(K.notes, -1)], effects: [money(4), item(K.notes, 1, true),
            {type: 'knowledge', actor: I.steward, key: 'proto23.received_note', stage: 'understood', value: 'The visitor actually showed their compiled physical practiced-handling record. I paid four of my own coins for this one bounded supply-work review; I know only the delivered account.', basis: {kind: 'instruction', attributedTo: 'player', situationId: I.situation}},
            know('review', 'Mara actually received your offered physical record and paid four remaining reserved work coins once. Your actual notebook returned. She received only this delivered account; her finite purse/demand and your changed cottage persist.', 'seen', I.steward)]}),
    {id: 'proto23.home_kit', revision: 1, label: 'Use your Proto23 practice notebook at home · stave + sap + held knife/notebook + 1 stamina + 3 min',
        group: I.group, actorId: 'player', worldId: 'base.frontier', location: 'Shack', once: false, duration: 3,
        reservationReturns: 1, cancellation: 'refund', completionFailure: 'refund', completionCoLocated: false,
        visibleWhen: has('noteCompiled'), requires: all(eq('proto23.homeSupported'), has('noteCompiled'), own('notes'), own('sharp')),
        completionRequires: all(eq('proto23.homeSupported'), has('noteCompiled'), own('notes'), own('sharp')),
        costs: [item(K.sound, -1), item(K.sap, -1), item(K.sharp, -1), item(K.notes, -1), effort(-1)],
        effects: [item(K.dull, 1, true), item(K.notes, 1, true), item(K.kit, 1),
            know('home_kit', 'At your actual Shack, your owned personal Proto23 notebook guided one counted native kit operation. One Sound repair stave and one Tree sap became one Prepared survey kit in three minutes and one stamina. Your sharp knife returned dulled and the same physical notebook returned once. The kit supplies existing preparation, packing, orders and trade; this narrow adaptation supplies no copied source rank, universal crafting, automatic output or permanent home buff.')],
        description: 'Useful material return from this visitor branch. Current inputs, your living controlled hands and your actual compiled notebook are required for every job.'},
];
export const proto23Definitions = {people, sites: [{id: I.site, revision: 1, label: 'Proto23 cottage shared work station', capacity: 1, provision: false},
    {id: I.dojo, revision: 1, label: 'Proto23 dojo shared practice station', capacity: 1, provision: false}], commands: proto23Commands,
    situations: [{id: I.situation, revision: 1, label: 'Original independent Proto23 visitor account',
        context: {worldId: 'base.frontier', instanceId: 'frontier.main', continuityId: 'reference.proto23.independent_visitor.branch',
            eraId: 'reference.proto23.ordinary_village', regionId: 'frontier.village'}, participants: ['player'],
        initialPhase: 'present', phases: ['present'], privateTruth: {role: 'independent_visitor', scope: 'ordinary_finite_furnished_life'}}]};
export const proto23ItemSpecifications = [
    ['Proto23 plain bed', 'One owned counted local furnishing. Install it as a fixed cottage bed to choose supported four-minute rest; installation removes the carried item.'],
    ['Proto23 cottage hearth', 'One owned counted local fixture. After fixed cottage installation, each selected drying job consumes actual fuel and material; no absence fire is simulated.'],
    ['Proto23 bookstand', 'One owned counted station with an original fixed safe-handling annotation. Install it to compare personal tested work and compile a physical record; no passive XP is awarded.'],
    ['Proto23 annotated practice notebook', 'One actual player-authored record from practiced handling, real drying and furnished cottage use. Hold it for the named material-funded Shack kit job. Possession alone grants no source skill.'],
].map(([id, description]) => ({id, name: id, description, value: 1, tags: {expedition: true, proto23_world: true}}));
export const PROTO23_ITEM_SPECIFICATIONS = proto23ItemSpecifications;
export function registerProto23Items({itemTemplates, OtherItem}) {for(const spec of proto23ItemSpecifications) {if(itemTemplates[spec.id]) throw Error(`Duplicate Proto23 item ${spec.id}.`); itemTemplates[spec.id] = new OtherItem(spec);}}
const freeze = v => {if(v && typeof v === 'object') {Object.values(v).forEach(freeze); Object.freeze(v);} return v;};
[proto23Definitions, proto23Worlds, proto23ItemSpecifications, PROTO23_INITIAL_FACTS, PROTO23_NATIVE_PEOPLE, PROTO23_NATIVE_STOCK].forEach(freeze);
