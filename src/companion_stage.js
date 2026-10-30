import {RELATIONSHIP_STAGES} from './ui/relationship_web.js';

// Companion bond level (rites and granted wishes) onto the shared relationship stage words (bk-party,
// proposal). Same ladder as the People cards, so a bond reads the same everywhere (UR74). The 6 rung is
// the profile's hold level: a free companion at "Relied on" no longer leaves over an unanswered wish.
export const BOND_STAGE_AT = Object.freeze([0, 1, 3, 6, 10]);
export function bondStage(level) {
    let index = 0;
    BOND_STAGE_AT.forEach((at, i) => { if (level >= at) index = i; });
    const stage = RELATIONSHIP_STAGES[index], to = BOND_STAGE_AT[index + 1];
    return {...stage, index, max: RELATIONSHIP_STAGES.length - 1, toNext: to === undefined ? 0 : to - level};
}
/** A meter_bar spec for a companion's bond, with what moves it next. */
export function bondMeter(key, level) {
    const stage = bondStage(level);
    return {id: `companion.${key}`, label: `Bond: ${stage.word}`, kind: 'track', value: stage.index, max: stage.max, discrete: true,
        note: stage.toNext ? `${stage.toNext} more bond to the next stage. Rites and answered wishes add it.` : 'The highest stage this world names.'};
}
export const STANCES = Object.freeze({
    ready: {word: 'braces at once', command: 'party.stance.ready'},
    hold: {word: 'holds his guard until you are hurt', command: 'party.stance.hold'},
});
