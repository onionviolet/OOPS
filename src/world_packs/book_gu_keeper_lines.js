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
