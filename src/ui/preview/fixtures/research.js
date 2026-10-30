// Gallery fixtures for the Study figures (docs/representations/RESEARCH.md). The view is built by the
// real researchView() from a hand-made seat (no game startup); the ids are the lever lesson's, which
// are plain ids, so no canon names live here.
import {FIGURE_FIXTURES} from '../figure_fixtures.js';
import {researchView, researchLadderSpec, researchMapSpec} from '../../../research_view.js';

const seat = (completed, knowledge = {}) => [{
    actorId: 'player', worldId: 'base.frontier', knowledge: () => knowledge, completed: id => !!completed[id],
}, {clock: 600, actors: {player: {completed}}, simulation: {jobs: [{id: 'j1', actorId: 'player', commandId: 'field.lp1.practice', due: 603}], powers: {}}}];
const entry = (stage, value, kind = 'instruction') => ({stage, value, at: 590, basis: {kind}});
const [observer, state] = seat(
    {'field.lp1.hand': 1, 'field.lp1.demonstrate': 1, 'field.lp1.return': 1, 'field.lp1.explain': 1},
    {'field.lp1.demonstration': entry('seen', 'You watched a pivot set beside the wedged timber.', 'observation'), 'field.lp1.rule': entry('understood', 'Brace near the pivot, lift the far end.')});
const lever = researchView(observer, state).projects.find(p => p.id === 'frontier.lever');

FIGURE_FIXTURES.push(researchMapSpec(lever), researchLadderSpec(lever));
