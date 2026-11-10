// The academy opens its Gu room after the first week. Custody of this
// particular Gu is distinct from refining it or making it a vital Gu.
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';

export const GU_LEAD_SELECTION = id('selection');
const selectionId = name => `${GU_LEAD_SELECTION}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const week = 7 * 1440;
const world = id('world');
const academy = id('academy');
const elder = id('academy_elder');
const awakening = id('awakening');
const wait = selectionId('week');
export const leadMoonlightKey = JSON.stringify({id: selectionId('moonlight_gu')});

const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const note = (name, value) => ({type: 'knowledge', actor: 'player', key: selectionId(name), stage: 'understood', value});
const pupil = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq('body.mobile'),
    eq(`faculty.${id('aperture')}.active`), eq(`claim.${id('academy_roll')}.owner`, 'player'),
    eq(`claim.${id('academy_roll')}.held`), eq(`completed.${id('circulate')}`),
    eq(`knowledge.${awakening}.seen`), eq('actor.location', academy));
const admitted = eq(extensionFact(GU_LEAD_SELECTION));
const roomOpen = eq(`completed.${wait}`);

function academyAct(id, label, duration, support, visibleWhen, description, effects, extra = {}) {
    return {
        id, revision: 1, label, description, group: 'structured_local',
        worldId: world, actorId: 'player', location: academy, audience: ['$actor'],
        once: true, duration, visibleWhen, requires: support, completionRequires: support, completionCoLocated: true,
        cancellation: 'refund', completionFailure: 'refund', reservationReturns: 1, costs: [], effects, ...extra
    };
}

export const guLeadSelection = {
    schema: 1, id: GU_LEAD_SELECTION, revision: 1,
    base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'the academy Gu selection',
    description: 'Finish the first week at the academy and choose a starter Gu when the elder opens the Gu room.',
    requires: pupil,
    reason: 'Complete the first exercise and return to the academy with your opened aperture and a place on the roll.',
    items: [{id: selectionId('moonlight_gu'), label: 'Moonlight Gu',
        description: 'A living blue crescent, small enough to keep in your pocket. It has its own will. Refining it takes primeval essence.', value: 1}],
    status: [{id: selectionId('assessment_status'), label: 'Academy assessment', knowledgeKey: selectionId('assessment')},
        {id: selectionId('selection_status'), label: 'Chosen Gu', knowledgeKey: selectionId('chosen')}],
    commands: [
        academyAct(wait, 'Finish the first week of lessons', week, all(pupil, admitted), admitted,
            'Pass the remaining days of lessons. The elder opens the Gu room seven days after the ceremony. You can stop and come back without losing the time that has passed.',
            [note('assessment', 'The elder sends pupils to choose one Rank-one Gu. Refine a Gu before you return to class. The first pupil to finish earns 20 primeval stones.')],
            {durationSinceKnowledge: awakening}),
        academyAct(selectionId('take_moonlight'), 'Queue and choose a Moonlight Gu', 2, all(pupil, admitted, roomOpen),
            all(admitted, roomOpen),
            'Wait your turn at the Gu room beside the academy. A row of blue crescents rests on silver dishes. The clan issues one Gu to each pupil.',
            [{type: 'item', actor: 'player', key: leadMoonlightKey, amount: 1},
                note('chosen', 'You pocket a Rank-one Moonlight Gu. It is still unrefined. The first Gu you successfully refine will become your vital Gu.')],
            {targetId: elder, coLocated: true, participants: ['$target']})
    ]
};

let installed;
export async function registerGuLeadSelection(register, base) {
    installed = null;
    if(!register.extension || base.contentHash !== baseHash) return null;
    installed = await register.extension(guLeadSelection, base);
    return installed;
}

export function guLeadAcademyPassageClockRequest(state, record, extension = installed) {
    const pupil = state.simulation?.people?.player;
    if(!extension || record?.packId !== GU_LEAD || record.contentHash !== baseHash ||
        record.revision !== extension.base.revision || state.actors?.player?.worldId !== world ||
        pupil?.location !== academy || pupil.life !== 'alive' || pupil.body?.mobile !== true ||
        pupil.body.ownerId !== 'player' || pupil.body.controllerId !== 'player') return null;
    const pin = record.extensions?.find(e => e.id === GU_LEAD_SELECTION);
    if(!pin || pin.revision !== extension.revision || pin.contentHash !== extension.contentHash) return null;
    const job = state.simulation.jobs.find(j => j.actorId === 'player' && j.commandId === wait);
    if(!job || job.revision !== 1 || job.targetId !== null || job.participants?.length !== 1 ||
        job.participants[0] !== 'player' || job.completionSupport?.location !== academy) return null;
    const remaining = job.due - state.clock;
    return Number.isSafeInteger(remaining) && remaining > 0 && remaining <= week ? Math.min(120, remaining) : null;
}
