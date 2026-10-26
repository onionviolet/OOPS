// Reverend Insanity setting, original adult clan-sponsored novice branch.
// RI-c0022-01/03 (ch22 b010–028/067–073): learned motion and essence activation.
// RI-c0023-02 (ch23 b031–064): four Moon Orchid petals/day, five-day freshness.
// Reserve normalization, starting provisions, supervised work and starvation
// timing are authored dials, not a complete aptitude or Gu refinement model.
export const GU_PREFIX = 'book.ri.academy';
export const guId = n => `${GU_PREFIX}.${n}`;
export const guKey = n => JSON.stringify({id: guId(n)});
const id = guId, key = guKey, keeper = id('keeper'), gu = id('moonlight');
export const GU_DAY = 1440, GU_FRESHNESS = 5 * GU_DAY, GU_INITIAL_PETALS = 16;
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const ge = (fact, value, reason) => ({fact, op: 'gte', value, ...(reason ? {reason} : {})});
const le = (fact, value) => ({fact, op: 'lte', value});
const all = (...rules) => ({all: rules});
const note = (n, value) => ({type: 'knowledge', actor: 'player', key: id(n), stage: 'understood', value});
const item = (n, amount, actor) => ({type: 'item', key: key(n), amount, ...(actor ? {actor} : {})});
const flag = (n, value, actor) => ({type: 'fact', scope: 'actor', key: id(n), value, ...(actor ? {actor} : {})});
const essence = output => ({type: 'energy', energyId: id('primeval'), operation: 'use', output, control: 1});
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'), eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const faculty = eq(`faculty.${id('aperture')}.active`, true, 'Your opened aperture must be available.');
const controlled = all(ready, faculty, eq(`claim.${id('gu_title')}.held`), eq(`claim.${id('gu_title')}.owner`, 'player', 'Complete supervised refinement to take this Gu into your care.'),
    eq('target.life', 'alive', 'This living Gu is no longer available.'), eq('target.body.controllerId', 'player', 'This Gu is not under your refined control.'), ge('target.vital.health', 1));
const cmd = (n, label, extra = {}) => ({id: id(n), revision: 1, label, group: 'structured_local', worldId: id('world'), actorId: 'player', location: id('annex'),
    audience: ['$actor'], requires: ready, costs: [], effects: [], ...extra});
const timed = (duration, support) => ({duration, cancellation: 'refund', reservationReturns: 1, completionRequires: support, completionCoLocated: true, completionFailure: 'refund'});
const guWork = {targetId: gu, coLocated: true, participants: ['$target'], participantsCoLocated: true};
const fresh = ge(`target.condition.${id('fresh_petals')}`, 1, 'The opening petal lot has spoiled. Assigning it again cannot refresh it.');
const unrefined = all(ready, faculty, eq(`claim.${id('gu_title')}.owner`, keeper), eq('target.body.controllerId', gu), ge('target.vital.health', 1));

export const guAcademyLife = {
    schema: 2, id: GU_PREFIX, revision: 1, title: 'Reverend Insanity · Moonlight Gu care',
    description: 'Refine one living Moonlight Gu under supervision, prepare its daily food, then learn a deliberate cutting exercise.',
    compatibility: {legacy: 'preserve-dormant', origin: 'mandatory'}, capabilities: ['native-stock', 'jobs'],
    world: {id: id('world'), label: 'Reverend Insanity · original novice life'},
    locations: [{id: id('annex'), label: 'Clan academy annex', underRoof: true, description: 'An original supervised annex for an adult clan-sponsored novice. Your opened Rank-one aperture is a starting grant; this is not Fang Yuan’s life or an earned awakening.'}],
    sources: [{id: id('aperture'), revision: 1, label: 'Opened Rank-one aperture', kind: 'trait', origin: 'acquired', grants: [], bioDetail: 'Declared starting means. This life uses an authored six-unit primeval reserve; one practice Moonblade spends one unit. Aptitude grades and later ranks are not simulated by this normalization.'}],
    items: [
        ['gu', 'Moonlight Gu · academy specimen', 'The same living Gu is represented by this titled carrier and its own body. Refinement changes its controller and the carrier’s title; death is not cured by possession.'],
        ['petals', 'Moon Orchid petal · opening lot', 'One finite opening lot. Four petals feed the Gu daily; this lot spoils five played days after arrival, including petals assigned later.'],
        ['bamboo', 'Keeper’s bamboo practice piece', 'One actual close-range target. A taught Moonblade consumes it and leaves a cut piece.'],
        ['cut_bamboo', 'Moonblade-cut bamboo', 'The actual result of your supervised cutting exercise. Return it to the keeper’s stock.']
    ].map(([n, label, description]) => ({id: id(n), label, description, value: 1})),
    units: [{id: id('gu_unit'), titleOwner: keeper, titleRecipients: ['player'], titleClaimId: id('gu_title'), keys: [key('gu')]}],
    starts: [{id: id('start'), locationId: id('annex'), description: 'You are an adult clan-sponsored novice with an opened Rank-one aperture and six primeval units. Keeper Lin supervises one Moonlight Gu. Four fresh petals are already prepared for it, twelve remain in your allowance, and Lin holds three bamboo targets.',
        body: {id: id('body'), ownerId: 'player', controllerId: 'player', form: 'human', lifeStage: 'adult', hands: 2, mobile: true},
        effects: [{type: 'source', sourceId: id('aperture'), operation: 'grant', origin: 'acquired', awakened: true, active: true},
            {type: 'energy', energyId: id('primeval'), operation: 'learn'}, {type: 'energy', energyId: id('primeval'), operation: 'recover', amount: 6},
            item('gu', 1, keeper), {type: 'claim', actor: keeper, key: id('gu_title'), operation: 'acquire'}, item('petals', 4, gu), item('petals', 12), item('bamboo', 3, keeper),
            {type: 'condition', actor: gu, id: id('fresh_petals'), operation: 'apply', intensity: 1, duration: GU_FRESHNESS}, flag('fed_today', false, gu),
            note('keeper_known', 'Keeper Lin has agreed to supervise this original novice exercise and release the same Gu after successful refinement. Training takes played time; cancellation refunds reserved essence.'),
            note('gu_known', 'Moonlight Gu is a living creature. Four fresh petals are eaten each played day, separately from the primeval essence used to activate it. Missed meals gradually weaken it; this life’s four-point care condition and one-point daily loss are authored tuning.'),
            note('opening', 'The fresh opening lot has sixteen petals in total and expires five days after arrival. Prepared food is eaten automatically on daily care deadlines, even during work. This finite first-care provision is not a renewable food market.')]
    }],
    simulation: {
        people: [
            {id: keeper, revision: 1, label: 'Keeper Lin', worldId: id('world'), location: id('annex'), inventory: 'simulation', provision: false,
                body: {id: id('keeper_body'), ownerId: keeper, controllerId: keeper, form: 'human', hands: 2, mobile: true}, vitals: {health: 100, max_health: 100, stamina: 100, max_stamina: 100}},
            {id: gu, revision: 1, label: 'Moonlight Gu', worldId: id('world'), location: id('annex'), inventory: 'simulation', provision: false,
                body: {id: id('gu_body'), ownerId: gu, controllerId: gu, form: 'gu', mobile: true}, vitals: {health: 4, max_health: 4, stamina: 1, max_stamina: 1}}
        ],
        energies: [{id: id('primeval'), revision: 1, label: 'Rank-one primeval essence', capacity: 6, output: 1, control: 1, efficiencyNumerator: 1, efficiencyDenominator: 1, strainLimit: 0, strainPerUse: 0}],
        powers: [{id: id('moonblade'), revision: 1, label: 'Taught close-target Moonblade', model: 'practice', capacity: 1, cooldown: 0}],
        conditions: [{id: id('fresh_petals'), revision: 1, label: 'Opening petal lot freshness', stacking: 'max', absence: 'zero'}],
        commands: [], events: []
    },
    abilities: [{id: id('cutting_ability'), commandId: id('cut'), powerId: id('moonblade'), sourceId: id('aperture'), function: 'physical', acquisition: 'learned', executionKind: 'ordinary-technique', control: controlled, target: null, counters: [], carriers: []}],
    presentation: {people: {[keeper]: {introductionKnowledgeKey: id('keeper_known')}, [gu]: {introductionKnowledgeKey: id('gu_known')}},
        status: ['opening', 'refinement', 'lesson', 'cutting', 'care_notice'].map(n => ({id: id(n + '_status'), label: {opening: 'Opening food lot', refinement: 'Gu control', lesson: 'Learned method', cutting: 'Cutting result', care_notice: 'Latest care'}[n], knowledgeKey: id(n)}))}
};
guAcademyLife.simulation.commands.push(
    cmd('refine', 'Refine the keeper’s Moonlight Gu · 30 min, 1 essence', {...guWork, participants: ['$target', keeper], once: true, requires: unrefined, ...timed(30, unrefined),
        description: 'Lin supervises you while this living Gu remains reserved for thirty played minutes. Spend one essence now; completion transfers the same titled carrier into your bag and changes that same creature’s controller. Stop or lose support to recover the essence without gaining control.', costs: [essence(1)],
        effects: [{type: 'transfer', from: keeper, to: 'player', key: key('gu'), count: 1}, {type: 'claim', actor: keeper, key: id('gu_title'), operation: 'transfer', target: 'player'},
            {type: 'body', actor: gu, key: 'controllerId', value: 'player'}, note('refinement', 'This same Moonlight Gu is now under your refined control. Its titled carrier is in your bag; care and activation remain separate commitments.')]}),
    cmd('learn', 'Learn a close-target Moonblade · 5 min', {...guWork, participants: ['$target', keeper], once: true, requires: controlled, ...timed(5, controlled),
        description: 'Practice the hand motion with Lin for five played minutes. This learns a deliberate close-range bamboo exercise; it does not grant the elder’s range, accuracy or damage. The Gu and Lin must remain available.',
        effects: [{type: 'power', powerId: id('moonblade'), operation: 'learn'}, {type: 'unlock', kind: 'skill', id: 'Woodcutting'}, note('lesson', 'You learned the close-target cutting exercise. One actual bamboo piece and one primeval unit produce one cut piece and one Woodcutting XP; daily petals are unaffected.')]}),
    cmd('request_bamboo', 'Take one practice target from Lin', {targetId: keeper, coLocated: true, participants: ['$target'], requires: ready,
        description: 'Lin gives you one of his three actual bamboo targets. His stock does not refresh on reload.', costs: [{type: 'transfer', from: keeper, to: 'player', key: key('bamboo'), count: 1}]}),
    cmd('cut', 'Cut one bamboo target · 1 essence', {...guWork, powerId: id('moonblade'), requires: all(controlled, ge(`item.${key('gu')}`, 1, 'Keep your own refined Gu carrier with you.')),
        description: 'Activate your owned, controlled living Gu using the taught motion. One essence and one held bamboo piece become one cut piece and one native Woodcutting XP. Prepared petals are not activation fuel. A hungry living Gu can still work; a dead or uncontrolled one cannot.',
        costs: [essence(1), item('bamboo', -1)], effects: [item('cut_bamboo', 1), {type: 'xp', skill: 'Woodcutting', amount: 1}, note('cutting', 'Your Moonblade cut an actual bamboo target. The cut piece remains in your bag and native Woodcutting gained one XP.')]}),
    cmd('return_bamboo', 'Return one cut piece to Lin', {targetId: keeper, coLocated: true, participants: ['$target'], description: 'Return the actual cut practice piece to Lin’s stock.', costs: [{type: 'transfer', from: 'player', to: keeper, key: key('cut_bamboo'), count: 1}]}),
    cmd('recover', 'Recover primeval essence · 5 min, up to 2 units', {requires: all(ready, faculty, le(`energy.${id('primeval')}.reserve`, 5)), ...timed(5, all(ready, faculty)),
        description: 'Spend five played minutes in deliberate recovery. Restore up to two primeval units, stopping at this beginning’s six-unit capacity. This local recovery rate is authored tuning.', effects: [{type: 'energy', energyId: id('primeval'), operation: 'recover', amount: 2}]})
);
for(const count of [4, 8, 12]) guAcademyLife.simulation.commands.push(cmd('prepare_' + count, `Prepare ${count} petals for daily care`, {...guWork, requires: all(controlled, fresh),
    description: `Move ${count} actual petals from your opening allowance to this Gu’s prepared stock. Four are eaten at each daily deadline while fresh. Preparing them later does not change the lot’s five-day expiry; this spends no primeval essence.`,
    costs: [{type: 'transfer', from: 'player', to: gu, key: key('petals'), count}]}));

const edible = all(ge(`condition.${id('fresh_petals')}`, 1), ge(`item.${key('petals')}`, 4));
const noMeal = {any: [le(`condition.${id('fresh_petals')}`, 0), le(`item.${key('petals')}`, 3)]};
const event = (n, label, requires, effects, isPublic = false) => ({id: id(n), revision: 1, label, worldId: id('world'), actorId: gu, interval: GU_DAY, automatic: true, mode: 'ambient', chance: 1, public: isPublic, requires, effects});
guAcademyLife.simulation.events.push(
    event('care.a_reset', 'Daily Gu care begins', null, [flag('fed_today', false)]),
    event('care.b_death', 'Moonlight Gu died after repeated missed meals', all(noMeal, le('vital.health', 1)), [{type: 'vital', key: 'health', amount: -1}, {type: 'life', status: 'dead', lethal: true, reason: 'Repeated missed daily meals exhausted this Gu’s authored care condition.'}, note('care_notice', 'Moonlight Gu has died after repeated missed meals. Prepared spoiled petals cannot restore it; its carrier does not create another living Gu.')], true),
    event('care.c_meal', 'Moonlight Gu ate four fresh petals', edible, [item('petals', -4), {type: 'vital', key: 'health', amount: 1}, flag('fed_today', true), note('care_notice', 'The Gu ate four prepared fresh petals. Daily care used no primeval essence; its care condition recovered by up to one point.')], true),
    event('care.d_hunger', 'Moonlight Gu missed its daily meal', all(eq(`actor.${id('fed_today')}`, false), noMeal, ge('vital.health', 2)), [{type: 'vital', key: 'health', amount: -1}, note('care_notice', 'The Gu lacked four fresh prepared petals at its daily deadline. Its care condition fell by one; it remains usable while alive. Prepare food before another missed meal.')], true)
);
