// Shadow Slave setting; divergent apprentice, named items, costs and timings are
// original proposals. No novel prose/assets. Source: ITEMS_SOCIETY reader notes
// §3.1–3.3, ch613/618/695–701/1605/2048: sight, learned pattern, compatible
// substrate, anchors and essence are distinct. This start explicitly supplies
// rare acquired sight/training, not a faculty every Awakened possesses.
const P = 'book.ss.apprentice';
const id = n => `${P}.${n}`;
const key = n => JSON.stringify({id: id(n)});
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules});
const fact = (n, value) => ({type: 'fact', scope: 'actor', key: id(n), value});
const note = (n, value) => ({type: 'knowledge', key: id(n), stage: 'understood', value});
const item = (n, amount) => ({type: 'item', key: key(n), amount});
const owned = n => all(eq(`claim.${id(n + '_title')}.held`), eq(`claim.${id(n + '_title')}.owner`, 'player'));
const bag = n => ({fact: `item.${key(n)}`, op: 'gte', value: 1, reason: 'Keep the selected owned carrier in your bag while working on it.'});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'), eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const sight = eq(`faculty.${id('weave_sight')}.active`, true, 'This work needs the acquired weave sight declared by this beginning.');
const cmd = (n, label, extra = {}) => ({id: id(n), revision: 1, label, group: 'structured_local', worldId: id('world'),
    actorId: 'player', location: id('workroom'), audience: ['$actor'], requires: ready, costs: [], effects: [], ...extra});
const timed = requires => ({duration: 5, cancellation: 'refund', reservationReturns: 1,
    completionRequires: requires, completionCoLocated: true, completionFailure: 'refund'});
const essence = amount => ({type: 'energy', energyId: id('essence'), operation: 'use', output: amount, control: 1});

export const shadowSlaveApprentice = {
    schema: 2, id: P, revision: 1, title: 'Shadow Slave · Memory apprentice',
    description: 'A divergent Awakened artisan life. Study a held Memory, then fit its learned protective pattern to your own compatible carrier. Rare acquired weave sight and prior training are declared starting means; the named items and work terms are original proposals.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'custody', 'jobs'],
    world: {id: id('world'), label: 'Shadow Slave · divergent artisan life'},
    locations: [{id: id('workroom'), label: 'Awakened artisan workroom', underRoof: true,
        description: 'An original rented workroom in the waking world. A desk supports deliberate weave study and compatible fitting. It grants no access to Sunny’s private workshop or soul.'}],
    sources: [{id: id('weave_sight'), revision: 1, label: 'Acquired weave sight and apprentice training', kind: 'trait', origin: 'acquired', grants: [],
        bioDetail: 'Divergent starting grant: rare perception and prior practice support simple pattern replication. This is not an ordinary Awakened faculty or Sunny’s identity.'}],
    items: [
        {id: id('donor'), label: 'Lattice keepsake · study specimen', description: 'Your owned simple protective Memory. Its inner pattern is unfamiliar; studying it may teach a compatible fitting. It is retained after study.', value: 1},
        {id: id('shard'), label: 'Prepared Awakened soul shard', description: 'A physical anchor set aside for simple Memory work. Each fitting consumes one shard; it is separate from your essence reserve.', value: 1},
        ...[['coat', 'Shelter coat', 'torso', {chest: 1, back: 1}, 8], ['gloves', 'Shelter gloves', 'arms', {forearm: 1, hand: 1}, 4]].map(([n, label, slot, coverage, defense]) => ({
            id: id(n), label, description: `${label}: protective Memory with an unfinished lattice. Fitting the learned protective pattern doubles this piece’s modeled impact protection while worn. The exact piece stays yours.`, value: 1,
            equipment: {slot, baseDefense: defense, weight: 1, layer: 1, coverage, forms: ['human'], titleClaimId: id(n + '_title'), fitFlag: 'actor.' + id(n + '_fitted'), unfitMultiplier: 0.5}
        }))
    ],
    units: ['donor', 'coat', 'gloves'].map(n => ({id: id(n + '_unit'), titleOwner: 'player', titleClaimId: id(n + '_title'), keys: [key(n)]})),
    starts: [{id: id('start'), locationId: id('workroom'),
        description: 'You are an Awakened artisan with acquired weave sight and prior replication practice. This divergent opening supplies your own study specimen, unfinished coat and gloves, two prepared shards and twelve local essence units. The setting’s craft distinctions are sourced; this person, materials, simple protective pattern and numeric work terms are authored proposals.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [{type: 'source', sourceId: id('weave_sight'), operation: 'grant', origin: 'acquired', awakened: true, active: true},
            ...['donor', 'coat', 'gloves'].flatMap(n => [item(n, 1), {type: 'claim', key: id(n + '_title'), operation: 'acquire'}]),
            item('shard', 2), {type: 'energy', energyId: id('essence'), operation: 'learn'}, {type: 'energy', energyId: id('essence'), operation: 'recover', amount: 12}, fact('coat_fitted', false), fact('gloves_fitted', false),
            note('opening', 'The desk and your prior practice support one simple protective pattern. Study costs five played minutes and two essence; fitting costs five played minutes, three essence and one shard per carrier. Cancellation or loss of working support refunds reserved costs. Your carried carrier is checked again at completion.'),
            note('pattern_state', 'The specimen’s inner pattern is still unfamiliar. Study it before attempting a deliberate replication.')]
    }],
    simulation: {people: [], commands: [], energies: [{id: id('essence'), revision: 1, label: 'Apprentice soul essence', capacity: 12, output: 6, control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0}]},
    presentation: {people: {}, status: [
        {id: id('opening_status'), label: 'Working means and costs', knowledgeKey: id('opening')},
        {id: id('pattern_status'), label: 'Pattern knowledge', knowledgeKey: id('pattern_state')},
        ...['coat', 'gloves'].map(n => ({id: id(n + '_status'), label: n === 'coat' ? 'Coat fitting' : 'Glove fitting', knowledgeKey: id(n + '_receipt')}))
    ]}
};
const studySupport = all(ready, sight, owned('donor'));
shadowSlaveApprentice.simulation.commands.push(cmd('study', 'Study your lattice keepsake · 5 min, 2 essence', {
    description: 'Reserve your own specimen for five played minutes. Acquired sight and prior practice let you understand its protective pattern; seeing it alone teaches nothing. Completion returns that same specimen and records the learned pattern.',
    once: true, requires: studySupport, ...timed(studySupport),
    costs: [item('donor', -1), essence(2)],
    effects: [item('donor', 1), note('pattern', 'A simple protective lattice: spread impact through a compatible protective carrier. This authored pattern needs one prepared Awakened shard and three essence per fitting.'),
        note('pattern_state', 'You traced and understood the protective lattice. The pattern can be fitted to the unfinished coat or gloves; destructive patterns would need a different compatible carrier.')]
}));
for (const n of ['coat', 'gloves']) {
    const label = n === 'coat' ? 'coat' : 'gloves';
    const support = all(ready, sight, owned(n), bag(n), eq(`knowledge.${id('pattern')}.understood`, true, 'Study your specimen until you understand its pattern first.'), eq(`actor.${id(n + '_fitted')}`, false, 'This exact carrier already has the fitting.'));
    shadowSlaveApprentice.simulation.commands.push(cmd('fit_' + n, `Fit the protective lattice to your ${label} · 5 min, 3 essence, 1 shard`, {
        description: `Work on your own carried ${label}, retaining its exact key and title. The known compatible pattern raises this piece’s worn protection from ${n === 'coat' ? '4 to 8' : '2 to 4'}. Keep it in your bag until completion; loss of custody, sight or work support refunds the reserved shard and essence. These work values are proposals.`,
        once: true, requires: support, ...timed(support), costs: [item('shard', -1), essence(3)],
        effects: [fact(n + '_fitted', true), note(n + '_receipt', `The protective lattice is fitted to your same ${label}. Equip it through Inventory to use its stronger impact protection; loose storage supplies no worn benefit.`)]
    }));
}
