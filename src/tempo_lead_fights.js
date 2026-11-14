// One live fight in each lead's world (Weibao, 2026-11-14: "refining combat system to account for new possiblity while still being
// familar? and transfering across all the worlds"). The same tempo fight, card and result line run in Klein's Tingen, Harry's Hogwarts and
// Fang Yuan's mountain; each world supplies its usual frame (PROCEDURAL_CARRY_OUT round 2, WS1-WS3) as a preset with its reasons, and its
// own means as kit rows (tempo_kit.js). Proposals under AD32/AD56: the openers are original encounters beside canon, not book scenes, and
// every number is an authored dial with its reason (AD49 calibration against held-back source fights is the next step, WS5).
// Leaf of the world packs: reads each world's own facts, registers through tempo_starters.js, writes back in the fight's own commit.
import {registerTempoOpener} from './tempo_starters.js';
import {drawFraction} from './gen_kit.js';
import {riLeadDayFacts, RI_DAY_ITEMS, RI_WOLF_AT_WALL} from './ri_lead_day_facts.js';

const key = id => JSON.stringify({id});
const held = (context, id) => Number(context.gameplay?.player?.inventory?.[key(id)] || 0);
const busy = state => !!(state.simulation?.sessions && Object.keys(state.simulation.sessions).length);
const you = ({me, vitals, parts}, extra = {}) => ({id: 'player', name: 'You', side: 'a', speed: 100, parts, hp: vitals.health, maxHp: vitals.max_health,
    stamina: vitals.stamina, maxStamina: vitals.max_stamina, profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5, ...extra});
const foe = (helpers, {id, name, hp, body, ...extra}) => ({id, name, side: 'b', speed: 100, hp, maxHp: hp, stamina: 10, maxStamina: 10,
    profile: helpers.enemyProfile({...body, health: hp, max_stamina: 10}, name, id), perception: 5, stealth: 5, ...extra});
const PLAIN = ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield'];

// --- Lord of the Mysteries: Tingen. WS3 (inference): open fights are rare and dangerous, and a death brings the police and the
// Nighthawks' attention. The usual frame for an ordinary man is a street robbery that goes wrong: no rules, knives out.
export const TINGEN_BRAWL = Object.freeze({
    foeHp: {value: 24, why: 'A desperate dock labourer: tougher than a clerk, no trained fighter (tempo scale, as the road rival).'},
    temper: {value: .7, why: 'Authored: he keeps the knife under his coat until he has taken about a third of a beating; then his temper goes.'},
    knife: {value: 1.3, why: 'A short knife cuts harder than a fist and is as quick; it does not reach further.'},
});
// The stakes move during the fight (Weibao, 2026-11-14: "Can change mid way through"): it starts as a robbery, and the knife comes out when
// he is hurt or you go for the kill. Once it can kill, a man you drop waits for your choice.
const TINGEN_STAKES = {preset: 'mugging', stakes: 'your purse',
    text: 'A robbery in a back lane. He wants your purse, not your life, and keeps a knife under his coat. Hurt him and it may come out.',
    why: 'WS3: open fights in Tingen are rare and dangerous. A drawn knife makes it a fight that can kill; a plea can take it back. A death in a Tingen lane brings the police.'};
registerTempoOpener({id: 'lotm.lane.knife', label: 'Face the knifeman in the back lane',
    text: 'A man with a knife steps out of an alley off Iron Cross Street and wants your purse. It can turn deadly either way.',
    owns: id => id === 'lotm-lane-knife',
    quote(state) {
        if(state.actors?.player?.worldId !== 'book.lotm.tingen' || !state.lotm) return {visible: false};
        if(busy(state)) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
        return {visible: true, eligible: true, reason: 'A robbery, until the knife comes out. Then whether he lives is your choice. If he drops you, you wake hurt.'};
    },
    spec: (state, context, helpers) => ({id: 'lotm-lane-knife', title: 'A knifeman in the back lane', floor: 1, stakes: TINGEN_STAKES,
        conditions: {light: 'day', place: 'Tingen back lane'},
        fighters: [you(helpers, {moves: PLAIN}),
            foe(helpers, {id: 'lotm.lane.knifeman', name: 'The knifeman', hp: TINGEN_BRAWL.foeHp.value, body: {attack: 6, agility: 5, dexterity: 6, intuition: 5, attack_speed: .9, defense: 1, crit_rate: .08, crit_multiplier: 1.5, attack_count: 1},
                goals: {survive: .7, aim: .3}, tags: ['person'],
                fateText: {finish: 'He dies in the lane. A death in Tingen brings the police, and someone may have seen.', spare: 'He crawls off into the alley. He will remember your face.'},
                kit: {knife: {label: 'Knife thrust', text: 'A short, quick stab.', cost: 3, power: TINGEN_BRAWL.knife.value, escalates: true, whenHurt: TINGEN_BRAWL.temper.value, why: TINGEN_BRAWL.knife.why}}})]}),
});

// --- Harry Potter: Hogwarts. WS1: fights end in disarming, a jinx, a bind or a teacher arriving. A student's repertoire is jinxes; adults
// step in; a wand keeps a record of its casts and the Ministry answers serious harm. Not lethal by default.
export const HOGWARTS_DUEL = Object.freeze({
    stopAt: {value: 60, why: 'A corridor is never empty for long: about a minute of fighting before a teacher rounds the corner (WS1).'},
    snatch: {value: .9, why: 'Grabbing a wand hand at arm\'s reach is a plain struggle, a little harder than landing a punch.'},
});
const SPELL = {
    legLock: {label: 'Locomotor Mortis', text: 'The Leg-Locker Curse: the legs snap together.', cost: 4, power: 0, hit: 1.2, needs: {wand: 1}, stun: 8,
        why: 'The Leg-Locker Curse (B1 p175, p178): the target hops or falls and loses time. Taught as a first-year jinx; holds about two moves (authored).'},
    bind: {label: 'Petrificus Totalus', text: 'The Full Body-Bind: the body locks rigid and topples.', cost: 6, power: 0, hit: .8, needs: {wand: 1}, binds: true,
        why: 'The Full Body-Bind (B1 p219): the body stays rigid after it falls. Harder to land than a jinx; it ends their part in the fight unharmed.'},
    snatch: {label: 'Snatch the wand', text: 'Close in and wrench the wand out of their hand.', cost: 4, power: 0, hit: HOGWARTS_DUEL.snatch.value, takes: {wand: 1},
        why: 'Disarming by hand: a first-year does not yet know the Disarming Charm (taught at the Duelling Club, B2), but a wand can be grabbed. In a duel, losing the wand ends it. ' + HOGWARTS_DUEL.snatch.why},
};
const HOGWARTS_STAKES = {preset: 'duel', stopAt: HOGWARTS_DUEL.stopAt.value, stakes: 'house pride',
    stopText: 'Professor McGonagall rounds the corner. "Wands away, both of you!" The duel is over.',
    text: 'A corridor duel: it ends when someone loses their wand, is bound, gives way, or a teacher arrives. Nobody dies in a school corridor.',
    why: 'WS1: students know jinxes, adults step in, and the Ministry answers serious harm, so this frame is not lethal.'};
registerTempoOpener({id: 'hp.corridor.draco', label: 'Answer Malfoy in the corridor (duel)',
    text: 'Malfoy blocks the third-floor corridor with his wand out. A schoolyard duel: wands, jinxes, and a teacher never far.',
    owns: id => id === 'hp-corridor-draco',
    quote(state) {
        const a = state.actors?.player;
        if(a?.worldId !== 'book.hp.lead.world' || !a.facts?.['hp.lead.atSchool']) return {visible: false};
        if(busy(state)) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
        return {visible: true, eligible: true, reason: 'Not deadly: a teacher stops it within about a minute. Losing your wand ends it.'};
    },
    spec: (state, context, helpers) => ({id: 'hp-corridor-draco', title: 'Malfoy in the corridor', floor: 1, stakes: HOGWARTS_STAKES,
        conditions: {light: 'day', place: 'Third-floor corridor'},
        fighters: [you(helpers, {moves: [...PLAIN, 'leg_lock', 'body_bind', 'snatch'], kit: {leg_lock: SPELL.legLock, body_bind: SPELL.bind, snatch: SPELL.snatch}, means: {wand: 1}}),
            foe(helpers, {id: 'hp.corridor.draco', name: 'Draco Malfoy', hp: 20, body: {attack: 4, agility: 6, dexterity: 6, intuition: 5, attack_speed: 1, defense: 1, crit_rate: .05, crit_multiplier: 1.3, attack_count: 1},
                goals: {survive: .6, aim: .4}, means: {wand: 1}, kit: {leg_lock: SPELL.legLock, snatch: SPELL.snatch}})]}),
});

// --- Reverend Insanity: the wolf tide (Fang Yuan's lead life). WS2: killing is common outside the walls. His Gu are items in his own
// inventory and his essence is his own reserve; the fight spends both for real and writes them back once, in its own commit.
export const WOLF_HUNT = Object.freeze({
    wolfHp: {value: 30, why: 'One ordinary lightning wolf: a patrol meets two (ri_lead_day_facts patrol dial), so one is half a patrol.'},
    largeChance: {value: .2, why: 'Authored: about one wolf in five that comes close is a big one, a pack\'s strong member; the source\'s packs are led by bigger wolves (ch122-123).'},
    largeHp: {value: 44, why: 'Authored: half again an ordinary wolf: four clean throws rather than three.'},
    bladeForce: {value: 12, why: 'A Moonglow blade cuts by the Gu, not the arm: about two fifths of a wolf, so three clean throws kill one (the contest pack\'s moonglow_blade drops a crippled wolf in one; a healthy one takes more).'},
    boarForce: {value: 6, why: 'Authored: a boar\'s strength behind a fist, half a blade. Enough to kill a hurt wolf.'},
    moonblade: {value: 4, why: 'Four parts a throw (the contest pack\'s moonglow_blade row, ch122-123).'},
    jade: {value: 2, why: 'Authored: White Jade Gu holds while it is fed essence; two parts keep it up for one blow.'},
    boar: {value: 1, why: 'Authored: Black Boar Gu\'s strength is cheap to call on, one part a blow.'},
    woundCarried: {value: .7, why: 'Authored: a wound from the same night\'s patrol (the day report\'s injured fact) leaves about seven tenths of your health for the fight.'},
    hidden: {value: 7, why: 'Authored: the killer move pays both Gu at once, the blade\'s four and three for the Stealth Rock Gu to hide the gathering.'},
});
const ESSENCE = 'book.ri.lead.primeval';
const GU = {moonglow: RI_DAY_ITEMS.moonglow, jade: RI_DAY_ITEMS.whiteJade, boar: 'book.ri.lead.river_toad.refined_black_boar_gu', rock: 'book.ri.lead.stone_forest.stealth_rock_gu'};
const reserve = state => Number(state.simulation?.energies?.player?.[ESSENCE]?.reserve || 0);
// The patrol's report can say he came back hurt (daily-loops lane: fact `book.ri.lead.day.injured`); the fight then starts from that wound.
const INJURED = 'book.ri.lead.day.injured';
// The patrol's report can leave a wolf at the wall (daily-loops lane, RI_WOLF_AT_WALL owns its fact and merit). The patrol is pack data and
// cannot open a fight, so this opener is the trigger: with a wolf waiting it fights that wolf at night and settles the patrol's facts.
const wolfWaiting = state => !!riLeadDayFacts(state)['book.ri.lead.day.wolf_waiting'];
const PATROL_ID = 'ri-wolf-tide-patrol';
// Which wolf comes close is one keyed draw on the world's seed and the hour (same hour, same wolf on a replay).
export const wolfIsLarge = state => drawFraction(state.simulation?.seed ?? 1, `ri.wolf.tide:size:${Math.floor((state.clock || 0) / 60)}`) < WOLF_HUNT.largeChance.value;
export const woundCarried = state => !!(state.actors?.player?.facts?.[INJURED] || riLeadDayFacts(state)[INJURED]);
export function wolfKit(state, context) {
    const hungry = !!riLeadDayFacts(state)['book.ri.lead.day.moonglow.hungry'];
    const blocked = hungry ? {blocked: 'The Moonglow Gu is hungry and will not cut. Feed it first.'} : {};
    const kit = {};
    if(held(context, GU.moonglow)) kit.moonblade = {label: 'Moonblade', text: 'Moonglow Gu throws a crescent of moonlight.', cost: 5, force: WOLF_HUNT.bladeForce.value, hit: 1.7, spends: {essence: WOLF_HUNT.moonblade.value}, ...blocked,
        why: `A thrown crescent of light from the Moonglow Gu. ${WOLF_HUNT.moonblade.why}`};
    if(held(context, GU.moonglow) && held(context, GU.rock)) kit.hidden_blade = {label: 'Stone-hidden moonblade', text: 'Killer move: the Stealth Rock Gu hides the gathering, then the Moonglow Gu cuts.', cost: 7, force: WOLF_HUNT.bladeForce.value, hit: 2.4,
        spends: {essence: WOLF_HUNT.hidden.value}, roles: [{role: 'hide the gathering', by: 'Stealth Rock Gu'}, {role: 'cut', by: 'Moonglow Gu'}], ...blocked,
        why: `A killer move as roles filled by Gu you hold (GP4; authored, not a book move): a wolf cannot dodge what it does not see coming. ${WOLF_HUNT.hidden.why}`};
    if(held(context, GU.boar)) kit.boar_fist = {label: 'Black Boar fist', text: 'A fist with a boar\'s strength behind it.', cost: 3, force: WOLF_HUNT.boarForce.value, spends: {essence: WOLF_HUNT.boar.value},
        why: `Black Boar Gu lends raw strength. A fist like that can kill. ${WOLF_HUNT.boar.why}`};
    if(held(context, GU.jade)) kit.jade_skin = {label: 'White Jade skin', text: 'White Jade Gu hardens your skin against the next bite.', cost: 2, ward: 7, spends: {essence: WOLF_HUNT.jade.value},
        why: `A guarding Gu: the next blow mostly glances off, and a cast at you is harder to land. ${WOLF_HUNT.jade.why}`};
    return kit;
}
registerTempoOpener({id: 'ri.wolf.tide', label: 'Hunt a lightning wolf on the tide (play it out)',
    text: 'Instead of a compressed patrol, meet one lightning wolf beyond the wall and fight it move by move. A killed wolf leaves an eye for the alliance board.',
    owns: id => id === 'ri-wolf-tide' || id === PATROL_ID,
    quote(state, context) {
        if(state.actors?.player?.worldId !== 'book.ri.lead.world') return {visible: false};
        if(!held(context, GU.moonglow)) return {visible: false};
        if(busy(state)) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
        const parts = reserve(state), kit = wolfKit(state, context), waiting = wolfWaiting(state) ? 'The wolf from tonight\'s watch is at the wall. ' : '';
        if(kit.moonblade.blocked) return {visible: true, eligible: true, reason: `${waiting}${kit.moonblade.blocked} You can still go out with fists.${woundCarried(state) ? ' You carry tonight\'s wound into it.' : ''}`};
        return {visible: true, eligible: true, reason: `${waiting}${parts} parts of essence in your sea; a moonblade costs ${WOLF_HUNT.moonblade.value}.${woundCarried(state) ? ' You carry tonight\'s wound into it.' : ''} Outside the wall a blow that drops the wolf kills it.`};
    },
    spec(state, context, helpers) {
        const kit = wolfKit(state, context);
        const patrol = wolfWaiting(state), large = wolfIsLarge(state);
        return {id: patrol ? PATROL_ID : 'ri-wolf-tide', title: patrol ? 'The wolf at the wall' : 'A lightning wolf beyond the wall', floor: 1,
            conditions: {light: patrol ? 'dark' : 'day', footing: 'bad', place: patrol ? 'The village wall' : 'Beyond the wall'},
            stakes: {preset: 'hunt', stakes: 'the wolf\'s life, and wolf parts for the board', text: 'A hunt beyond the wall: the wolf fights for its life. A blow that drops it kills it; if it drops you, you wake badly hurt.',
                why: 'WS2: killing is common outside the walls; the tide is why you are here.'},
            fighters: [you(helpers, {moves: [...PLAIN, ...Object.keys(kit)], kit, means: {essence: reserve(state)}, meansLabels: {essence: 'essence'},
                ...(woundCarried(state) ? {hp: Math.max(1, Math.round(helpers.vitals.health * WOLF_HUNT.woundCarried.value * 10) / 10)} : {})}),
                foe(helpers, {id: 'ri.wolf.tide.wolf', name: large ? 'A large lightning wolf' : 'A lightning wolf', hp: large ? WOLF_HUNT.largeHp.value : WOLF_HUNT.wolfHp.value, tags: large ? ['beast', 'large'] : ['beast'],
                    body: {attack: large ? 7 : 5, agility: 5, dexterity: 6, intuition: 4, attack_speed: 1.1, defense: 1, crit_rate: .1, crit_multiplier: 1.5, attack_count: 1},
                    goals: {survive: .4, aim: .6}, moves: ['jab', 'swing', 'withdraw'],
                    fateText: {finish: 'It dies. You can cut out its eye; the board pays for the eye.', spare: 'It limps back into the trees. The woods keep one more wolf.',
                        detail: 'One wolf eye to hand in at the alliance board.'}})]};
    },
    // Essence spent in the fight leaves the reserve once; a killed wolf leaves an eye the day's alliance board reads (FLR4: hand_in_eye).
    // From the patrol, it also frees the patrol, pays the kill merit, and leaves him injured when he was hurt or did not win (plain facts the
    // pack's rules read), plus a readable record for Reports and later readers.
    after(plan, result, b) {
        const me = b.fighters.player, start = reserve(plan.state), left = me.means?.essence, pool = plan.state.simulation?.energies?.player?.[ESSENCE];
        if(pool && Number.isFinite(left)) pool.reserve = Math.max(0, Math.min(pool.reserve, left));
        const wolf = b.fighters['ri.wolf.tide.wolf'], killed = result === 'won' && wolf?.end === 'killed' ? 1 : 0;
        const inv = ((plan.gameplay ||= {}).player ||= {}).inventory ||= {}, add = (id, n) => { inv[key(id)] = (inv[key(id)] || 0) + n; };
        if(killed) add(RI_DAY_ITEMS.eye, 1);
        // What he carries away, in player words, for the result line (PS26).
        plan.fightCarry = killed ? ['A wolf eye is in your pack for the board.'] : wolf?.end === 'knocked_out' ? ['The wolf limped off into the trees.'] : [];
        const facts = plan.state.actors.player.facts, wounded = Object.keys(me.parts || {}).length > 0;
        if(b.id === PATROL_ID) {
            facts[RI_WOLF_AT_WALL.fact] = false;
            if(killed) add(RI_DAY_ITEMS.merit, RI_WOLF_AT_WALL.killMerit);
            else if(result === 'won') add(RI_DAY_ITEMS.merit, RI_WOLF_AT_WALL.driveOffMerit); // held back: it limps off over the wall, as when the watch drives it off
            if(wounded || result === 'lost' || result === 'withdrawn' || result === 'yielded') facts['book.ri.lead.day.injured'] = true;
        }
        facts['book.ri.lead.day.wolf_fight'] = JSON.stringify({from: b.id === PATROL_ID ? 'patrol' : 'hunt', result, killed, wolf: wolf?.end ?? (wolf?.status === 'left' ? 'withdrew' : 'stood'),
            essenceSpent: Number.isFinite(left) ? Math.max(0, start - left) : 0, healthMissing: Math.max(0, Math.round((me.maxHp - me.hp) * 10) / 10), wounded, at: plan.state.clock});
    },
});
