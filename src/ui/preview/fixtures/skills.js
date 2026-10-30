// "Skills and techniques" fixtures: invented learn views through the real bridge (skillsTabRows). One card per stage, one
// understood (its next sign shows), one the seat has not heard of (no row, ABR19).
import {skillsTabRows} from '../../../read_models/learn_tab_bridge.js';

const view = (id, stage, extra = {}) => ({id, stage, canLearn: false, refusedBy: [], gates: [], mastery: 0, masteryNeeded: 6, practiceMinutes: 30, sign: null, nextSignAt: null, unstated: ['hidden cost'], ...extra});
export const SKILL_VIEWS = [
    view('lamp_read', 'unlearned', {refusedBy: ['The harbour warden has not agreed to teach you.'], gates: [{label: 'A teacher: the harbour warden', met: false}, {label: 'Steady hands by night', met: true}]}),
    view('smoke_turn', 'practicing', {mastery: 2, nextSignAt: 3, sign: 'The smoke leans toward you.', gates: [{label: 'A teacher: the harbour warden', met: true}]}),
    view('wick_cut', 'castable', {mastery: 6, canLearn: false, sign: 'The flame holds still when asked.', gates: [{label: 'A teacher: the harbour warden', met: true}]}),
    view('night_oil', 'practicing', {mastery: 1, gates: []}),
];
const labels = {lamp_read: 'Read the lamp', smoke_turn: 'Turn the smoke', wick_cut: 'Cut the wick', night_oil: 'Night oil'};
export const SKILL_ROWS = skillsTabRows(SKILL_VIEWS, {labelOf: id => labels[id], known: new Set(['lamp_read', 'smoke_turn', 'wick_cut']), understood: new Set(['smoke_turn'])});
