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
    schema: 2, id: P, revision: 2, title: 'Shadow Slave · Memory apprentice',
    description: 'Study a Memory, fit its protective pattern, then develop a paired ward with your own coat and gloves.',
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
            equipment: {slot, baseDefense: defense, weight: 1, layer: 1, coverage, forms: ['human'], titleClaimId: id(n + '_title'), fitFlag: 'actor.' + id(n + '_fitted'), unfitMultiplier: 0.5,
                powerFlag: 'actor.' + id(n + '_ward_active'), powerMultiplier: 1.25}
        }))
    ],
    units: ['donor', 'coat', 'gloves'].map(n => ({id: id(n + '_unit'), titleOwner: 'player', titleClaimId: id(n + '_title'), keys: [key(n)]})),
    starts: [{id: id('start'), locationId: id('workroom'),
        description: 'In this divergent life, you are an Awakened artisan with rare acquired weave sight and replication training. Your keepsake, unfinished coat and gloves, two shards and twelve essence are laid out at the work desk.',
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

// Original paired-ward practice within this explicitly divergent life. The
// source supports learning compatible weaves; this bond, attendant, first
// practiced grade and restoration terms are authored, not universal canon.
const attendant = id('attendant');
shadowSlaveApprentice.simulation.people.push({id: attendant, revision: 1, label: 'Iven, ward attendant', worldId: id('world'), location: id('workroom'), inventory: 'simulation', provision: false,
    body: {id: id('attendant_body'), ownerId: attendant, controllerId: attendant, form: 'human', hands: 2, mobile: true}, vitals: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}});
shadowSlaveApprentice.presentation.people[attendant] = {introductionKnowledgeKey: id('attendant_known')};
shadowSlaveApprentice.starts[0].effects.push(note('attendant_known', 'Iven holds entrusted pieces while you work. Finish or cancel the work to recover them.'),
    ...['coat', 'gloves'].flatMap(n => [fact(n + '_bound', false), fact(n + '_ward_trained', false), fact(n + '_ward_active', false)]));
shadowSlaveApprentice.presentation.status.push({id: id('bond_status'), label: 'Paired ward', knowledgeKey: id('bond_receipt')},
    ...['coat', 'gloves'].map(n => ({id: id(n + '_bond_status'), label: n === 'coat' ? 'Coat bond' : 'Glove bond', knowledgeKey: id(n + '_bond_receipt')})));
const piece = (n, suffix, value) => eq(`actor.${id(n + '_' + suffix)}`, value);
const pair = ['coat', 'gloves'];
const supportedPair = all(ready, sight, ...pair.flatMap(n => [owned(n), piece(n, 'fitted', true)]));
const entrust = (n, returning = false) => ({type: 'custody', from: returning ? attendant : 'player', to: returning ? 'player' : attendant,
    key: key(n), count: 1, loanId: id(n + '_ward_loan'), ...(returning ? {returning: true} : {})});
const pairJob = (n, label, support, energy, effects, description) => cmd(n, label, {
    description, targetId: attendant, coLocated: true, participants: ['$target'], once: true,
    requires: all(support, ...pair.map(bag)), ...timed(support), costs: [...pair.map(n => entrust(n)), essence(energy)],
    effects: [...pair.map(n => entrust(n, true)), ...effects]
});
shadowSlaveApprentice.simulation.commands.push(
    pairJob('bind_pair', 'Bind the coat and gloves together · 5 min, 2 essence',
        all(supportedPair, ...pair.map(n => piece(n, 'bound', false))), 2,
        [...pair.map(n => fact(n + '_bound', true)), note('beacon', 'You traced a personal beacon into this pair. Their first ward practice can now settle the connection.'), note('bond_receipt', 'Your coat and gloves are bound. Practice the pair to develop their protective weave.')],
        'Lay both fitted pieces on the desk. Iven holds both exact items while you bind the pair. They cannot be equipped or used elsewhere during the work; completion or cancellation returns the same pieces. Binding enables paid ward practice.'),
    pairJob('practice_pair', 'Practice the paired ward · 5 min, 1 essence',
        all(supportedPair, ...pair.flatMap(n => [piece(n, 'bound', true), piece(n, 'ward_trained', false)])), 1,
        [...pair.flatMap(n => [fact(n + '_ward_trained', true), fact(n + '_ward_active', true), note(n + '_bond_receipt', 'Active, practiced bond: this exact piece gives 25% more protection while worn. Dormancy retains the practice; severing requires a new binding.')]), note('bond_receipt', 'The practiced pair gives 25% more worn protection: coat 8 → 10, gloves 4 → 5. These pieces retain their identity and learned weave.')],
        'Entrust both bound pieces for a first paired exercise. Tracing their linked pattern settles the protective weave: this coat and these gloves each gain 25% worn protection. Loose pieces give no worn bonus. Lost support or cancellation returns both pieces and reserved essence without granting practice.'),
    cmd('rest_essence', 'Rest at the desk · 5 min, recover up to 4 essence', {description: 'Rest for five played minutes. Your existing soul reserve recovers up to four essence, stopping at its twelve-unit capacity.',
        requires: all(ready, {fact: `energy.${id('essence')}.reserve`, op: 'lte', value: 11}), ...timed(ready),
        effects: [{type: 'energy', energyId: id('essence'), operation: 'recover', amount: 4}]})
);
for(const n of pair) {
    const desk = all(ready, sight, owned(n), bag(n)), bound = piece(n, 'bound', true), trained = piece(n, 'ward_trained', true), active = piece(n, 'ward_active', true);
    shadowSlaveApprentice.simulation.commands.push(
        cmd('dormant_' + n, `Let the ${n} bond lie dormant`, {description: 'Lay this piece on the desk and quiet its bond. It keeps its practiced weave and ordinary protection; its extra worn protection stops until awakened.',
            visibleWhen: active, requires: all(desk, bound, trained, active), effects: [fact(n + '_ward_active', false), note(n + '_bond_receipt', 'Dormant: learned growth remains, extra protection is suspended. Awaken at the desk for one essence.')]}),
        cmd('wake_' + n, `Awaken the ${n} bond · 1 essence`, {description: 'Trace the beacon on this carried, bound piece. Spend one essence to restore its practiced 25% worn enhancement.',
            visibleWhen: all(bound, trained, piece(n, 'ward_active', false)), requires: all(desk, bound, trained, piece(n, 'ward_active', false)), costs: [essence(1)],
            effects: [fact(n + '_ward_active', true), note(n + '_bond_receipt', 'Active again: this same practiced piece gives 25% more worn protection.')]}),
        cmd('sever_' + n, `Sever the ${n} bond`, {description: 'Unweave this piece’s connection at the desk. Its material and practiced pattern remain yours, but the extra protection stops. Rebinding takes three played minutes and one essence; awakening then costs one essence.',
            visibleWhen: bound, requires: all(desk, bound), effects: [fact(n + '_bound', false), fact(n + '_ward_active', false), note(n + '_bond_receipt', 'Severed: the physical piece and practice remain. Rebind at the desk, then awaken the dormant pattern.')]}),
        cmd('rebind_' + n, `Rebind the ${n} · 3 min, 1 essence`, {description: 'Iven holds this exact piece while you rebuild its severed connection. The learned weave survives. Completion returns the same piece with a dormant bond; cancel or lose support to recover the piece and essence.',
            targetId: attendant, coLocated: true, participants: ['$target'], visibleWhen: all(eq(`knowledge.${id('beacon')}.seen`), piece(n, 'bound', false)),
            requires: all(desk, eq(`knowledge.${id('beacon')}.seen`), piece(n, 'bound', false)),
            ...timed(all(ready, sight, owned(n), piece(n, 'bound', false))), duration: 3,
            costs: [entrust(n), essence(1)], effects: [entrust(n, true), fact(n + '_bound', true), note(n + '_bond_receipt', 'Rebound: this same piece has a dormant connection. Its retained practiced weave can be awakened for one essence.')]})
    );
}
