// Original Village prototype inspired by Weibao's Deluxe Meme RPG collection
// and item-gated events. This is not a direct Marvel or other source-world copy.
import {compileArtifactCollection, compileItemEncounter} from './artifact_collection.js';

export const ARTIFACT_WORKSHOP_IDS = Object.freeze({world: 'base.frontier', group: 'artifact_collection',
    maker: 'artifact_collection.mara', open: 'artifact_collection.open', situation: 'artifact_collection.workshop', scene: 'artifact_collection.tray', enter: 'artifact_collection.inspect_projection'});
const I = ARTIFACT_WORKSHOP_IDS;
const key = id => JSON.stringify({id});
export const ARTIFACT_WORKSHOP_KEYS = Object.freeze({frame: key('Empty resonance frame'), amber: key('Amber measuring prism'),
    blue: key('Blue aligning prism'), single: key('Single-prism resonance frame'), paired: key('Paired resonance frame'),
    pin: key('Fine alignment pin'), log: key('Rough wood log'), kit: key('Prepared survey kit')});
const K = ARTIFACT_WORKSHOP_KEYS;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules.filter(Boolean)});
const live = eq('actor.life', 'alive', 'Recover before using the workshop.');
const opened = eq('actor.artifact_collection.opened');
const af = (key, value = true) => ({type: 'fact', scope: 'actor', key: `artifact_collection.${key}`, value});
const stamina = amount => ({type: 'vital', key: 'stamina', amount});
const money = amount => ({type: 'resource', native: true, key: 'money', amount});
const item = (key, amount, actor) => ({type: 'item', key, amount, ...(actor ? {actor} : {})});
const transfer = (from, to, key, count = 1) => ({type: 'transfer', from, to, key, count});
const know = (key, value, attributedTo = 'player') => ({type: 'knowledge', key: `artifact_collection.${key}`, stage: 'seen', value,
    basis: {kind: attributedTo === 'player' ? 'observation' : 'recollection', attributedTo, situationId: I.situation}});
const command = d => ({revision: 1, worldId: I.world, group: I.group, actorId: 'player', location: 'Village',
    requires: all(opened, live), visibleWhen: opened, costs: [], effects: [], ...d, reservationReturns: 1});
const maker = {targetId: I.maker, coLocated: true, participants: ['$target']};

export const artifactWorkshopItemSpecifications = [
    {id: 'Empty resonance frame', value: 3, description: 'Vela\'s two-seat optical frame. Assembly needs the named real prisms; an empty frame grants no ability.'},
    {id: 'Amber measuring prism', value: 4, description: 'A loose optical measuring prism. It can reveal a local cut measurement; it is also an exact frame ingredient.'},
    {id: 'Blue aligning prism', value: 4, description: 'A loose aligning prism from Vela\'s finite stock. It can guide kit marking and fit the second frame seat.'},
    {id: 'Single-prism resonance frame', value: 7, description: 'One empty frame fitted with one amber measuring prism. Its stable measurement supports a faster local kit layout. Disassembly returns that exact frame and prism.'},
    {id: 'Paired resonance frame', value: 11, description: 'The single-prism frame fitted with one blue aligning prism. Its paired local projection reveals a test-tray scene. Taking it apart returns the single-prism frame and blue prism.'},
    {id: 'Fine alignment pin', value: 4, description: 'The one real pin Vela lodged in her test tray. A reusable guide for local kit marking, with ordinary wood still required.'}
];

export const artifactWorkshopCollection = compileArtifactCollection({id: 'artifact_collection', revision: 1, worldId: I.world,
    group: I.group, location: 'Village', requires: all(opened, live), visibleWhen: opened,
    pieces: [{id: 'frame', key: K.frame, label: 'Empty resonance frame'}, {id: 'amber', key: K.amber, label: 'Amber measuring prism'},
        {id: 'blue', key: K.blue, label: 'Blue aligning prism'}, {id: 'pin', key: K.pin, label: 'Fine alignment pin'}],
    recipes: [
        {id: 'single', key: K.single, label: 'Single-prism resonance frame', parts: [{id: 'frame', count: 1}, {id: 'amber', count: 1}],
            assembly: {label: 'Fit the amber prism into your empty frame · 2 min', duration: 2,
                description: 'Reserve one owned empty frame and one amber prism. Completion yields one single-prism frame; cancellation returns the same inputs.'},
            disassembly: {label: 'Remove the amber prism · 1 min', duration: 1,
                description: 'Take apart one actual single-prism frame and recover one empty frame and one amber prism. This grants no lesson or XP.'}},
        {id: 'paired', key: K.paired, label: 'Paired resonance frame', parts: [{id: 'single', count: 1}, {id: 'blue', count: 1}],
            assembly: {label: 'Fit the blue prism into your single-prism frame · 2 min', duration: 2,
                description: 'Reserve your actual amber frame and blue prism. The paired instrument has both functions and reveals its own local tray encounter.'},
            disassembly: {label: 'Remove the blue prism · 1 min', duration: 1,
                description: 'Recover one actual single-prism frame and one blue prism. Both pieces retain their own useful functions.'}}
    ],
    uses: [
        {id: 'measure', carrier: 'amber', label: 'Measure Vela\'s kit template with the loose amber prism · 1 stamina + 2 min', duration: 2,
            requires: eq('actor.artifact_collection.measured', false), costs: [stamina(-1)], effects: [af('measured'),
                know('measurement', 'Your amber prism revealed the exact kit-template cut. The reusable prism returned to your bag; the measurement is remembered separately from the apparatus.')],
            description: 'A useful loose-piece function. Reserve and return the actual prism, spend one stamina and retain the observed measurement.'},
        {id: 'blue_kit', carrier: 'blue', label: 'Mark one survey kit with the loose blue prism · 1 log + 2 stamina + 4 min', duration: 4,
            requires: eq('actor.artifact_collection.measured'), costs: [item(K.log, -1), stamina(-2)], effects: [item(K.kit, 1)],
            description: 'Use your remembered cut and reserve the actual aligning prism. One native log becomes one Prepared survey kit. The loose prism returns; no method or magical source is granted.'},
        {id: 'single_kit', carrier: 'single', label: 'Lay out one survey kit with the fitted amber frame · 1 log + 1 stamina + 3 min', duration: 3,
            requires: eq('actor.artifact_collection.measured'), costs: [item(K.log, -1), stamina(-1)], effects: [item(K.kit, 1)],
            description: 'The fitted measurement frame makes the same real kit in three minutes with less effort. Completion returns the physical frame; remembered measurements alone do not supply it.'},
        {id: 'paired_kit', carrier: 'paired', label: 'Lay out one survey kit with the paired frame · 1 log + 1 stamina + 2 min', duration: 2,
            requires: eq('actor.artifact_collection.measured'), costs: [item(K.log, -1), stamina(-1)], effects: [item(K.kit, 1)],
            description: 'Both fitted functions cooperate on this local template. One actual log becomes the same kit in two minutes. The paid apparatus returns and its function disappears if it is sold or taken apart.'},
        {id: 'pin_kit', carrier: 'pin', label: 'Use the recovered pin as a kit guide · 1 log + 1 stamina + 2 min', duration: 2,
            requires: eq('actor.artifact_collection.measured'), costs: [item(K.log, -1), stamina(-1)], effects: [item(K.kit, 1)],
            description: 'The finite recovered pin supplies an ordinary guide without either prism or the frame. It is reserved and returned; the real wood is consumed.'}
    ]});

const tray = compileItemEncounter({revision: 1, worldId: I.world, group: I.group, location: 'Village', requires: all(opened, live), visibleWhen: opened,
    items: [{key: K.paired, reason: 'Carry your actual paired resonance frame to reveal this projection.'}],
    command: {id: I.enter, label: 'Project your paired frame into Vela\'s test tray', ...maker,
        requires: eq('actor.artifact_collection.pinRecovered', false), claim: 'artifact_collection.tray_resolution',
        description: 'The carried paired instrument reveals one local scene. Entry spends nothing; you choose a paid extraction or leave. Withdrawing preserves the instrument and allows a later attempt.'},
    encounter: {id: I.scene, revision: 1, label: 'The paired projection', lethal: false, settlement: [], turns: [{
        cue: 'Two projected lines meet beneath Vela\'s test-tray lip. Her one fine alignment pin rests there. She permits either extraction; the frame supplies alignment, not a free pin.',
        responses: [
            {id: 'aligned', label: 'Align the lip and recover Vela\'s pin · 1 stamina', costs: [stamina(-1), transfer(I.maker, 'player', K.pin)],
                effects: [af('pinRecovered'), af('measured'), know('pin', 'Your carried paired instrument aligned the test-tray lip and showed its kit-template cut. With Vela\'s permission, one stamina and her actual pin transferred into your bag. You retained the observed cut; the frame and its constituents remain conserved.')]},
            {id: 'ordinary', label: 'Brace the lip with ordinary wood and recover the same pin · 1 log + 2 stamina',
                costs: [item(K.log, -1), stamina(-2), transfer(I.maker, 'player', K.pin)],
                effects: [af('pinRecovered'), af('measured'), know('pin', 'You chose an ordinary wood brace after seeing the projection and compared the pin with Vela\'s kit template. Your log and two stamina were spent; her same finite pin transferred into your bag. You retained the observed cut. The frame supplied discovery, not the extraction force.')]}
        ]}]}});

export const artifactWorkshopDefinitions = {
    situations: [{id: I.situation, revision: 1, label: 'Vela\'s finite prism workshop',
        context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        participants: ['player', I.maker], initialPhase: 'offered', phases: ['offered'],
        privateTruth: {stock: 'one_frame_one_amber_one_blue_one_pin', apparatus: 'two_named_optical_functions'}}],
    people: [{id: I.maker, revision: 1, label: 'Vela, Village instrument maker', worldId: I.world, location: 'Village', inventory: 'simulation',
        provision: false, resources: {coins: 0}, vitals: {health: 16, max_health: 16, stamina: 8, max_stamina: 8}, body: {hands: 2}}],
    encounters: [tray.encounter],
    commands: [
        command({id: I.open, label: 'Ask Vela about her prism collection', once: true,
            requires: all(live, eq('village.craftsmanMet')), visibleWhen: eq('village.craftsmanMet'),
            effects: [{type: 'spawn', personId: I.maker, definitionId: I.maker}, {type: 'situation', situationId: I.situation, operation: 'begin'}, ...[K.frame, K.amber, K.blue, K.pin].map(k => item(k, 1, I.maker)),
                af('opened'), af('measured', false), af('pinRecovered', false),
                know('offer', 'Vela has one empty frame, one amber prism, one blue prism and one fine pin. She offers the frame for three coins and amber prism for four; one real log earns her blue prism. A loose piece has a function before the collection is complete.', I.maker)],
            description: 'An optional local meeting. Ask without accepting a purchase or job. Vela\'s own finite stock is initialized once when this meeting commits.'}),
        ...[['frame', 3], ['amber', 4]].map(([part, price]) => command({id: `artifact_collection.buy_${part}`, ...maker,
            label: `Buy Vela\'s ${part === 'frame' ? 'one empty frame' : 'one amber prism'} · ${price} coins`,
            costs: [money(-price), transfer(I.maker, 'player', K[part])], effects: [{type: 'resource', actor: I.maker, key: 'coins', amount: price}],
            description: 'Payment enters Vela\'s purse and her one existing item enters your native bag. Revisiting does not replenish her stock.'})),
        command({id: 'artifact_collection.earn_blue', ...maker, label: 'Supply Vela one real log for her blue prism',
            costs: [transfer('player', I.maker, K.log)], effects: [transfer(I.maker, 'player', K.blue),
                know('blue', 'Vela accepted your one actual log and transferred her one blue prism to you. It is earned stock, not a random duplicate or free enrollment reward.', I.maker)],
            description: 'An immediate agreed material exchange. Vela keeps the log, her finite prism leaves her inventory, and the publisher commits both transfers together.'}),
        command({id: 'artifact_collection.manual_pin', ...maker, label: 'Recover Vela\'s tray pin by hand · 1 log + 2 stamina + 4 min',
            duration: 4, cancellation: 'refund', requires: all(opened, live, eq('actor.artifact_collection.pinRecovered', false)),
            costs: [item(K.log, -1), stamina(-2), transfer(I.maker, 'player', K.pin)], effects: [af('pinRecovered'), af('measured'),
                know('pin', 'You used ordinary wood and four minutes of manual work to recover Vela\'s same finite alignment pin and compare it with her kit template. You retained the observed cut, so the returned pin can guide actual native kit work without any prism, artifact or learned source.')],
            description: 'The ordinary alternative remains useful. The actual pin is reserved from Vela; completion also records the inspected kit-template cut. Both participants wait, and cancellation returns every reservation without a pin or measurement reward.'}),
        ...artifactWorkshopCollection.commands, tray.command
    ]};

export function registerArtifactWorkshopItems({itemTemplates, OtherItem}) {
    if(!itemTemplates || typeof OtherItem !== 'function') throw new Error('Artifacts require the current native item owner.');
    for(const d of artifactWorkshopItemSpecifications) {
        if(itemTemplates[d.id]) throw new Error(`Duplicate artifact item ${d.id}.`);
        itemTemplates[d.id] = new OtherItem({id: d.id, name: d.id, description: d.description, value: d.value, tags: {expedition: true}});
    }
}
