// Knowledge fixtures (LTU4, RPX6, RPX12). Invented names only. The gallery runs the real adapter
// (knowledge_view.js) over a fixture state through the seat observer, so it proves the adapter,
// not a hand-drawn spec. The sealed lines are planted where a seat's knowledge must not reach.
import {observerView} from '../../../observer_view.js';
import {knowledgeView} from '../../../knowledge_view.js';
import {FIGURE_FIXTURES} from '../figure_fixtures.js';

export const SEALED_LINE = 'The ferryman Hollis Gray is the one who drowned the bell';
const DAY = 1440;
const basis = (kind, extra = {}) => ({kind, attributedTo: 'player', situationId: 'fixture.harbor', ...extra});

export function knowledgeFixtureState() {
    return {
        clock: 3 * DAY + 600,
        actors: {player: {worldId: 'fixture.harbor', facts: {'inference.bell.intention': 'active', 'inference.ledger.intention': 'considering'}}},
        worlds: {'fixture.harbor': {facts: {'secret.bell.truth': SEALED_LINE}}},
        simulation: {
            people: {player: {location: 'quay'}, warden: {location: 'quay'}},
            knowledge: {
                player: {
                    'harbor.bell.silent': {stage: 'seen', value: 'The harbor bell did not ring at the night tide.', at: 1 * DAY + 1300, cause: 'walk.quay', basis: basis('observation')},
                    'harbor.rope.cut': {stage: 'seen', value: 'The bell rope was cut clean, not frayed.', at: 2 * DAY + 400, cause: 'look.tower', basis: basis('observation')},
                    'harbor.warden.word': {stage: 'seen', value: 'Warden Ostra says the tower was locked all night.', at: 2 * DAY + 700, cause: 'talk.warden', basis: basis('instruction')},
                    'inference.bell.someone': {stage: 'interpreted', value: 'Someone with a key cut the rope on purpose.', at: 2 * DAY + 800, cause: 'think.bell',
                        basis: basis('inference', {evidence: ['harbor.rope.cut', 'harbor.warden.word'], uncertainty: 'the lock could have been picked'})},
                    'divination.tide.signal': {stage: 'seen', value: 'The bowl showed still water and a hand over it.', at: 3 * DAY + 100, cause: 'scry.tide',
                        basis: basis('observation', {queryId: 'tide', method: 'water bowl', status: 'signal'})},
                    'divination.tide.interpretation': {stage: 'interpreted', value: 'Whoever did it wanted the tide unannounced.', at: 3 * DAY + 120, cause: 'scry.tide',
                        basis: basis('inference', {queryId: 'tide', method: 'water bowl', evidence: ['divination.tide.signal']})},
                    'divination.ledger.signal': {stage: 'seen', value: 'You asked who keeps the tower keys. The smoke gave nothing.', at: 3 * DAY + 300, cause: 'scry.ledger',
                        basis: basis('observation', {queryId: 'ledger', method: 'smoke reading', status: 'unanswered'})},
                    'inference.ledger.ask': {stage: 'interpreted', value: 'The harbor ledger may list who holds keys.', at: 3 * DAY + 320, cause: 'think.ledger', basis: basis('inference', {uncertainty: 'not read yet'})},
                },
                // Another actor's knowledge holds the truth; the seat must not see it.
                warden: {'secret.bell': {stage: 'understood', value: SEALED_LINE, at: 1 * DAY, cause: 'fixture.seed'}},
            },
            // A queued job's frozen effect carries the truth before anyone has received it.
            jobs: [{id: 'job.reveal', commandId: 'scry.reveal', actorId: 'player', effects: [{type: 'knowledge', actor: 'player', key: 'divination.reveal', stage: 'understood', value: SEALED_LINE}]}],
        },
    };
}

export const KNOWLEDGE_FIXTURE = knowledgeView(observerView(knowledgeFixtureState()), {clock: knowledgeFixtureState().clock, id: 'knows-harbor-bell', title: 'What you know: the silent bell'}).board;
FIGURE_FIXTURES.push(KNOWLEDGE_FIXTURE);
