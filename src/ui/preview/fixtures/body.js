// Body fixtures (RPX4, RPX9, RPX10) for the figure gallery and tests. Each goes through the same adapters
// the game uses, from a hand-written state in the real save shape. Invented names only.
import {bodyFigureSpec, bodyViewModel, channelFigureSpec, secondBodyFigureSpec} from '../../../body_figure.js';
import {bodyCommands, FRAIL_FRAME, PALM_MARK, SORE_HANDS, UNDERFED} from '../../../body_progression.js';

const source = origin => ({acquiredAt: 0, expiresAt: null, origin, revision: 1});
// A frail start mid-recovery: underfed, sore from one grip drill, with a palm mark from the rough kit.
export const BODY_STATE = {clock: 30,
    actors: {player: {facts: {'body.enrolled': true, 'body.frailStart': true, 'body.gripLearned': false, 'body.steadied': false},
        resources: {grip_practice: 1, steady_walks: 2}, sources: {[FRAIL_FRAME]: source('acquired'), [PALM_MARK]: source('acquired')}}},
    simulation: {conditions: {player: {[UNDERFED]: {intensity: 1, expiresAt: null}, [SORE_HANDS]: {intensity: 1, expiresAt: 39}}}}};
export const BODY_FIXTURE = bodyFigureSpec(BODY_STATE);
// BC7/BC8 body by part (not a figure spec): for renderBodyView and the character sheet. Round 1's map stays as BODY_FIXTURE.
export const BODY_VIEW_FIXTURE = bodyViewModel(BODY_STATE, {commands: bodyCommands});
export const CHANNEL_FIXTURE = channelFigureSpec({flow: 3, still: 1, tested: true}, {name: 'Measured channels'});
export const SECOND_BODY_FIXTURE = secondBodyFigureSpec({effect: {kind: 'transform', donorName: 'Wren Ashby', minutesLeft: 35}, condition: null});
export const BODY_FIXTURES = [BODY_FIXTURE, CHANNEL_FIXTURE, SECOND_BODY_FIXTURE];
