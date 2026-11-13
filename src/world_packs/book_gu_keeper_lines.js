import {guCatalogue} from '../gu_catalogue.js';
// Reverend Insanity Keeper essence lines as data (chat G phase 2b). Each row is one scene that the generic
// line host (gu_essence_line.js) runs on the Gu working law: a fed converter raises essence one stage and
// a cast spends the raised pool through a catalogue ability. Ids keep their saved facts keys.
export const keeperRedSteel = 'book.ri.keeper.red_steel_refinement';
export const keeperRankTrialId = 'book.ri.keeper.rank_trial';
export const keeperMoonglowLoan = JSON.stringify({id: `${keeperRankTrialId}.loan`});

export const redSteelLine = Object.freeze({
    id: keeperRedSteel, world: 'book.ri.keeper.world',
    converter: 'four-flavors-liquor-worm',
    // Authored: a day between meals (the novel gives no feeding interval for Four Flavors).
    feed: {op: 'feed_four', minutes: 1440, key: `${keeperRedSteel}.fed_at`},
    convert: {op: 'concentrate_red'},
    cast: {op: 'cast_upper', kind: 'moonglow', key: `${keeperRedSteel}.last_cut`, pool: 'upper-red-steel', source: 'condensed',
        gu: {id: `${keeperRankTrialId}.loan`, rank: 2}, loanItem: keeperMoonglowLoan,
        requiresFact: `${keeperRankTrialId}.moonglow_sound`},
});


export const keeperSeven = 'book.ri.keeper.seven_fragrances';
export const keeperNine = 'book.ri.keeper.nine_eyes';
export const nineFarBank = `${keeperNine}.far_bank`;
// Authored scene clocks and meal interval; the chapters do not set these durations.
export const sevenMinutes = 20;
export const nineSettleMinutes = 15;
export const nineHoldMinutes = 30;
export const crashCut = 160; // Authored practice-cut width, in paces.
const thunder = guCatalogue.thunderclap.ability.value;
const crash = guCatalogue['charging-crash'].ability.value;
const thunderStrike = thunder.effect.magnitude * thunder.stageFuel.upper.magnitudeFactor;
const crashDistances = [crash.effect.magnitude * crash.stageFuel.initial.magnitudeFactor, crash.effect.magnitude];
export const sevenLine = Object.freeze({
    id: keeperSeven, world: redSteelLine.world, kind: 'seven-fragrances-liquor-worm',
    attemptPrefix: 'seven-fragrances', second: `${keeperSeven}.loan`, inputRank: 2,
    minutes: sevenMinutes, mealMinutes: 1440, requiresParentFed: true,
    ops: {prepare: 'prepare_seven', finish: 'finish_seven', cancel: 'cancel_seven',
        feed: 'feed_seven', convert: 'concentrate_silver'},
    casts: [{op: 'cast_seven', field: 'lastStrike', port: 'hosted', stage: 'upper', cost: thunder.cost, values: [thunderStrike]}],
});
export const nineLine = Object.freeze({
    id: keeperNine, world: redSteelLine.world, kind: 'nine-eyes-liquor-worm',
    attemptPrefix: 'nine-eyes', second: `${keeperNine}.market_worm`, inputRank: 3,
    minutes: nineSettleMinutes, holdMinutes: nineHoldMinutes, mealMinutes: 1440,
    ops: {buy: 'buy_second', prepare: 'prepare_nine', finish: 'settle_nine', cancel: 'cancel_nine',
        feed: 'feed_nine', convert: 'concentrate_gold', collect: 'collect'},
    casts: [
        {op: 'test_initial', field: 'lastDistance', kind: 'charging-crash', stage: 'initial',
            pool: 'gold-initial', source: 'stored', funded: true, values: crashDistances, below: crashCut},
        {op: 'cross_cut', field: 'lastDistance', kind: 'charging-crash', stage: 'middle',
            pool: 'gold-middle', source: 'condensed', values: crashDistances, minimum: crashCut},
    ],
});

export const sevenConversion = guCatalogue[sevenLine.kind].conversion.value;

export const nineConversion = guCatalogue[nineLine.kind].conversion.value;
export const crashCost = guCatalogue['charging-crash'].ability.value.cost;
