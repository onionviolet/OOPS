// Non-node figure forms (COV4): the Owed ledger table, the crossing threshold card, a day band (TC2), a chip row and
// bar rows. Invented names only (CLR3). The table and card are built by the same adapters the game uses, from the
// existing economy and worlds fixtures, so each has one drawing and one text form.
import {owedLedgerView, gatherOwed} from '../../../owed_ledger_view.js';
import {owedTableFigure, thresholdCardFigure} from '../../form_adapters.js';
import {OWED_MIXED} from './economy.js';
import {WORLDS_FIXTURES} from './worlds.js';

const OWED_WITH_TERMS = {...OWED_MIXED, standing: {...OWED_MIXED.standing, credit: OWED_MIXED.standing.factions.map(f => ({factionId: f.id, termDays: 30}))}};
export const OWED_TABLE_FIXTURE = owedTableFigure(owedLedgerView({...gatherOwed(OWED_WITH_TERMS), selected: null}), {id: 'owed-table-mixed', title: 'Ledger → Owed, as a table'});
export const THRESHOLD_FIXTURES = WORLDS_FIXTURES.map(view => thresholdCardFigure(view));

// TC2: a day along an hour axis. Spans are what the player did and what the weather did; level says how heavy, in words.
export const DAY_BAND_FIXTURE = {
    id: 'time-day-band', title: 'A day on a band', size: 760, summary: 'Hours 0 to 24. The line is now.',
    bands: [{id: 'day', label: 'Tuesday, hours', lanes: ['You', 'Around you'],
        axis: {from: 0, to: 24, ticks: [0, 6, 12, 18, 24].map(at => ({at, label: String(at)})), mark: {at: 15, label: 'now'}},
        spans: [
            {from: 0, to: 6, label: 'Slept', state: 'done', level: .2, note: 'light'},
            {from: 6, to: 9, label: 'Walked', state: 'done', level: .4, note: 'steady'},
            {from: 9, to: 14, label: 'Worked at the bench', state: 'done', level: .8, note: 'heavy'},
            {from: 14, to: 17, label: 'Study', state: 'current', level: .6, note: 'ongoing'},
            {from: 17, to: 21, label: 'Planned: market', state: 'pending'},
            {from: 5, to: 10, lane: 1, label: 'Mist', state: 'done'},
            {from: 13, to: 18, lane: 1, label: 'Rain', state: 'strained', level: .7, note: 'steady rain'},
        ]}],
    legend: [{state: 'done', label: 'happened'}, {state: 'current', label: 'under way'}, {state: 'pending', label: 'planned'}, {state: 'strained', label: 'works against you'}]};

export const CHIP_ROW_FIXTURE = {
    id: 'forms-chip-row', title: 'Chip row: what is true of you now', size: 760,
    chips: [{id: 'now', label: 'Condition', items: [
        {label: 'Rested', state: 'done'}, {label: 'Hungry', state: 'strained', note: 'since noon'}, {label: 'Left hand', state: 'broken', note: 'cannot grip'},
        {label: 'Known by name in the market', state: 'filled'}, {label: 'Owes a favour', state: 'pending'}, {label: 'Rumoured to be a healer', state: 'guessed'}, {label: 'Old scar', state: 'unknown'}]}]};

export const BAR_ROWS_FIXTURE = {
    id: 'forms-bar-rows', title: 'Bar rows: study and craft', size: 760,
    bars: [{id: 'work', label: 'In progress', rows: [
        {label: 'Reading the tide tables', value: 6, max: 10, words: '6 of 10 sittings', state: 'current'},
        {label: 'Rope-making', value: 2, max: 8, words: '2 of 8 hanks, fibre running low', state: 'strained'},
        {label: 'Lamp repair', value: 9, max: 9, words: 'done, ready to collect', state: 'done'},
        {label: 'Letter of introduction', value: 0, max: 3, words: 'not started', state: 'pending'}]}]};

export const FORMS_FIXTURES = [OWED_TABLE_FIXTURE, ...THRESHOLD_FIXTURES, DAY_BAND_FIXTURE, CHIP_ROW_FIXTURE, BAR_ROWS_FIXTURE];
