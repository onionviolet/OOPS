// Authored proposals that bind L4 rite and craft rows to the act engine
// (lotm_act_engine.js): place, minutes, stock, output, owner effects, risk.
// `place` is a pack alias the host resolves (the Klein lodging room). `means` is what makes the row's own
// eligibility flag true in play: the lead holds the kit (default; dial: a knowledge grant), or the run is
// already under way, since the kit is spent as the steps go. `layout.stations` are ordered placements, each
// spending its stock. Backlash carriers name the Tingen world's `power` carrier (harm_state HARM_WORLDS).
// Every number here is a prototype choice, not a source claim (WPR5); a row
// without an entry stays unbound and is reported by defineLotmActs.
const key = id => JSON.stringify({id});
export const LOTM_ACT_KEYS = {
    botanicals: key('lotm.stock.botanicals-five'), bottle: key('lotm.stock.empty-bottle'),
    essenceOil: key('lotm.item.ritual-essence-oil'), metalBox: key('lotm.item.metal-box'),
    peppercorns: key('lotm.stock.peppercorns'), mintOintment: key('lotm.stock.mint-ointment'),
    setup: key('lotm.item.fish-man-hunting-setup'), candle: key('lotm.item.ritual-candle'),
    fragrance: key('lotm.stock.quiet-fragrance'),
};
const K = LOTM_ACT_KEYS;
const fact = (k, value) => ({type: 'fact', scope: 'actor', key: k, value});
export const LOTM_ACT_BINDINGS = {
    // Volume 1: making, then the bath aid uses the made oil (one product, two stages).
    'lotm.craft.ritual-essence-oil': {
        place: 'lotm.place.klein-room', costStep: 'distill',
        steps: {select: {minutes: 10}, distill: {minutes: 120}, 'set-out': {minutes: 5}},
        inputs: {'Moon flower': {key: K.botanicals, qty: 1}, 'Golden mint': null, 'Deep-sleep flower': null,
            'Golden bergamot': null, 'Rock rose': null, 'Bottle for the extracted oil': {key: K.bottle, qty: 1}},
        output: {key: K.essenceOil, qty: 1}, means: {kit: [{key: K.botanicals, qty: 1}, {key: K.bottle, qty: 1}]},
        owners: {'inventory-crafting': [], 'aid-preparations': [fact('lotm.aid.ritual-oil-bath.ready', true)]},
    },
    'lotm.aid.ritual-oil-bath': {
        place: 'lotm.place.klein-room', steps: {add: {minutes: 15, costs: [{type: 'item', key: K.essenceOil, amount: -1}]}}, inputs: {},
        requires: {fact: `item.${K.essenceOil}`, op: 'gte', value: 1, reason: 'Hold the prepared oil.'}, means: {kit: [{key: K.essenceOil, qty: 1}]},
        owners: {'inventory-consumption': [], 'mood-state': [fact('actor.lotm.mood.relaxed', true)]},
    },
    // Volume 2: a sacrifice that sends a box and carries a backlash risk.
    'lotm.rite.fool-sacrifice': {
        place: 'lotm.place.klein-room',
        means: {kit: [{key: K.candle, qty: 1}, {key: K.metalBox, qty: 1}]},
        steps: {candle: {minutes: 2, costs: [{type: 'item', key: K.candle, amount: -1}]}, petition: {minutes: 3}, channel: {minutes: 1},
            send: {minutes: 1, costs: [{type: 'item', key: K.metalBox, amount: -1}]}},
        inputs: {},
        owners: {'offering-channel': [fact('lotm.channel.fool.open', true)], 'item-custody': [fact('lotm.custody.metal-box.sent', true)]},
        risk: {carrier: 'power', source: 'lotm.rite.fool-sacrifice', weight: 2,
            protections: [{rule: {fact: 'actor.lotm.protect.ward', op: 'eq', value: true}, reduces: 1}]},
    },
    // Volume 3: a rite with no authored owner effect stays honest about it.
    'lotm.rite.self-summon-transfer-v3': {
        place: 'lotm.place.klein-room', steps: {'phase-1': {minutes: 5}, 'phase-2': {minutes: 5}, 'phase-3': {minutes: 5}}, inputs: {},
        means: {kit: [{key: K.candle, qty: 1}]}, owners: {},
    },
    // Contact a remnant spirit: a simple altar of four corner candles and a quiet fragrance, set in order, then
    // the petition and the answer. Proposal binding; the match to the book windows (ch57 P022, ch60 P067) is unverified
    // because the row carries zh locators only (WPR5).
    'lotm.rite.spirit-call': {
        place: 'lotm.place.klein-room', means: {kit: [{key: K.candle, qty: 4}, {key: K.fragrance, qty: 1}]},
        layout: {order: 'fixed', stations: ['north', 'east', 'south', 'west'].map(c => ({id: `candle-${c}`, label: `a candle at the ${c} corner`, minutes: 1, stock: {key: K.candle, qty: 1}}))},
        costStep: 'altar',
        steps: {altar: {minutes: 10, costs: [{type: 'item', key: K.fragrance, amount: -1}]}, petition: {minutes: 5}, answer: {minutes: 15}},
        inputs: {},
        owners: {'spirit-contact': [fact('lotm.spirit-call.contact', 'attempted')]}, // spirituality-cost stays unowned: reported, not faked
        risk: {carrier: 'power', source: 'lotm.rite.spirit-call', weight: 1.5,
            protections: [{rule: {fact: 'actor.lotm.protect.ward', op: 'eq', value: true}, reduces: 0.5}]},
    },
    'lotm.craft.fish-man-hunting-preparation': {
        place: 'lotm.place.klein-room', steps: {bait: {minutes: 10}, coat: {minutes: 10}, arrange: {minutes: 20}},
        inputs: {'Pig or cattle entrails, with canned entrails described as an alternative': null,
            Peppercorns: {key: K.peppercorns, qty: 1}, 'Mint ointment': {key: K.mintOintment, qty: 1},
            'Trident, dagger and short knife': null, 'Borrowed rifles': null},
        output: {key: K.setup, qty: 1}, means: {kit: [{key: K.peppercorns, qty: 1}, {key: K.mintOintment, qty: 1}]},
        owners: {'hunting-preparation': [fact('lotm.hunt.prepared', true)], 'body-state': []},
    },
};
