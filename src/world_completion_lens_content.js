// Original finite P3 lens proposals. Registry loading grants no stock, loan,
// procedure or body. Vela and her one amber prism keep their existing owners.
import {allTruthy as all, eq, not} from './basics.js';
import {ARTIFACT_WORKSHOP_IDS as A, ARTIFACT_WORKSHOP_KEYS as AK} from './artifact_workshop_content.js';
import {REMAINDER_HOME_IDS as H} from './audit_remainder_home_content.js';

export const WORLD_COMPLETION_LENS_IDS = Object.freeze({
    world: A.world, maker: A.maker, group: 'world_completion_lens', prefix: 'world.completion.lens.',
    situation: 'world.completion.lens.terms', loanId: 'lore.instrument.amber',
    deposit: 'world.completion.lens.deposit', room: H.workshop,
    open: 'world.completion.lens.open', borrow: 'world.completion.lens.borrow',
    invite: 'world.completion.lens.invite_room', accompany: 'world.completion.lens.accompany_home',
});
export const WORLD_COMPLETION_LENS_KEYS = Object.freeze({amber: AK.amber});
export const WORLD_COMPLETION_LENS_POLICY = Object.freeze({revision: 1, deposit: 4, duration: 30, fee: 1});
const I = WORLD_COMPLETION_LENS_IDS, K = WORLD_COMPLETION_LENS_KEYS, P = WORLD_COMPLETION_LENS_POLICY;
const f = (name, value = true, reason) => eq(`worldCompletionLens.${name}`, value, reason);
const af = (name, value = true) => ({type: 'fact', actor: 'player', scope: 'actor', key: I.prefix + name, value});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const reserve = (actor, amount, loan = false) => ({type: 'item', actor, key: K.amber, amount,
    ...(amount > 0 ? {reservationReturn: true} : {}), ...(loan ? {custodyUse: {
        schema: 1, loanId: I.loanId, owner: I.maker, holder: 'player', key: K.amber, count: 1,
    }} : {})});
const know = (name, value, attributedTo = 'player') => ({type: 'knowledge', actor: 'player', key: I.prefix + name,
    stage: 'seen', value, basis: {kind: 'observation', attributedTo, situationId: I.situation}});
const contact = {targetId: I.maker, coLocated: true, participants: ['$target']};
const local = f('local', true, 'Use your current living human body in the supported home realm.');
const hands = f('hands', true, 'Recover your two usable hands before this precision work.');
const enrolled = f('enrolled', true, 'Hear Vela’s distinct sample-service and loan terms first.');
const maker = f('makerPresent', true, 'Meet the same living, available Vela at her actual location.');
const willing = f('makerWilling', true, 'Vela declines new service after the agreed lens return becomes overdue.');
const sample = f('currentSample', true, 'Inspect the actual current notch sample again; its assumptions or observation changed.');
const unmeasured = f('unmeasuredSample', true, 'This exact current sample already has your performed lens measurement.');
const command = d => ({revision: P.revision, worldId: I.world, group: I.group, actorId: 'player', location: 'Village',
    visibleWhen: enrolled, requires: all(enrolled, local), costs: [], effects: [], reservationReturns: 1, ...d});
const timed = (duration, support, siteId = null, coLocated = false) => ({duration, cancellation: 'refund',
    completionRequires: support, completionFailure: 'refund', completionCoLocated: coLocated, ...(siteId ? {siteId} : {})});

const measurements = ['owned', 'loan', 'service'].flatMap(mode => ['outside', 'room'].map(place => {
    const service = mode === 'service', room = place === 'room', actor = service ? I.maker : 'player';
    const tool = f(`${mode}Lens`, true, mode === 'loan' ? 'Carry the same unexpired consented loan with its unchanged four-coin deposit.' :
        service ? 'Vela needs her actual owned, unequipped amber prism and available effort.' : 'Carry your actual owned, loose and unequipped amber prism.');
    const support = all(enrolled, local, hands, sample, tool, ...(mode === 'loan' ? [f(room ? 'loanRoomTime' : 'loanOutsideTime', true, 'Finish this disclosed examination before the agreed return deadline.')] : []), ...(service ? [maker, willing, f('makerHands')] : []),
        ...(room ? [f('dryRoom', true, 'Use the actually repaired, occupied and permitted Shack room.')] : []));
    const subject = mode === 'owned' ? 'your owned prism' : mode === 'loan' ? 'Vela’s exact borrowed prism' : 'Vela’s owner-operated prism';
    return command({id: I.prefix + `measure_${mode}_${place}`, location: room ? 'Shack' : 'Village',
        label: `Measure the current notch ${room ? 'in the dry room' : 'outdoors'} with ${subject} · ${service ? '1 coin + Vela’s' : 'your'} 1 stamina + ${room ? 2 : 4} min`,
        visibleWhen: all(enrolled, ...(room ? [f('roomPermission')] : [])), requires: all(support, unmeasured),
        ...timed(room ? 2 : 4, support, room ? I.room : null, service), ...(service ? contact : {}),
        costs: [...(service ? [money(-P.fee)] : []), reserve(actor, -1, mode === 'loan'), stamina(actor, -1)],
        effects: [reserve(actor, 1, mode === 'loan'), ...(service ? [{type: 'resource', actor: I.maker, key: 'coins', amount: P.fee}] : []),
            know('measurement', `Performed a ${room ? 'two-minute dry-room' : 'four-minute outdoor'} examination of the current notch sample using ${subject}. ${service ? 'Vela spent her own stamina and earned the one-coin fee' : 'I spent one stamina'}; the same prism returned once. The observed width and alignment concern this sample only, not hidden poison, another source or future weather.`, service ? I.maker : 'player')],
        description: `${room ? 'The installed shutter and actual room permission support the faster check.' : 'The slower outdoor check needs no repaired room.'} Hold and restore the same loose lens. ${service ? 'Reserve your one-coin fee; pay Vela only on completion.' : mode === 'loan' ? 'Keep ownership and deposit separate; assembly and destructive use remain forbidden.' : 'An owned loose prism remains available for ordinary assembly after this work.'} A changed sample or lost support refunds unperformed inputs and awards no measurement.`,
    });
}));

export const worldCompletionLensDefinitions = {
    situations: [{id: I.situation, revision: P.revision, label: 'Vela’s useful lens and exact return',
        context: {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'},
        participants: ['player', I.maker], initialPhase: 'offered', phases: ['offered', 'borrowed', 'returned'],
        privateTruth: {instrument: 'existing_finite_amber_prism', ownership: 'maker_until_existing_purchase', deposit: 'separate_native_coin_escrow'}}],
    commands: [
        command({id: I.open, ...contact, once: true, label: 'Ask Vela about a current sample and a lens loan · free',
            visibleWhen: all(f('rootEnrolled'), eq('actor.artifact_collection.opened')),
            requires: all(f('rootEnrolled'), local, maker, eq('actor.artifact_collection.opened')),
            effects: [{type: 'situation', situationId: I.situation, operation: 'begin'}, af('enrolled'), af('revision', P.revision),
                know('terms', 'Vela offers her actual loose amber prism through the existing four-coin purchase, a one-coin owner-operated current sample check, or one consenting thirty-supported-minute loan for a separate refundable four-coin deposit. Borrowing grants use and an exact return duty, never ownership. A returned loan refunds that deposit once; a late return closes only her new voluntary lens service.', I.maker)],
            description: 'A separate free conversation after the home-world opening and Vela’s original meeting. No new prism, funds, body or sample is provisioned.'}),
        command({id: I.borrow, ...contact, once: true, label: 'Borrow Vela’s one amber prism · 4-coin refundable deposit + 30 supported min',
            visibleWhen: all(enrolled, f('loanNotTaken')), requires: all(enrolled, local, hands, maker, willing, f('makerHands'), f('serviceLens'), f('loanNotTaken'), f('custodySupported', true, 'The exact custody-safe inspection and return consumer must be integrated before lending.')),
            costs: [money(-P.deposit), {type: 'custody', actor: 'player', from: I.maker, to: 'player', key: K.amber, count: 1, loanId: I.loanId}],
            effects: [{type: 'resource', actor: 'player', key: I.deposit, amount: P.deposit}, af('loanHeld'),
                {type: 'situation', situationId: I.situation, operation: 'advance', expected: ['offered'], phase: 'borrowed'},
                know('loan', 'Received Vela’s same loose amber prism by consent, with four of my native coins held separately as deposit. I owe the exact unequipped prism back within thirty supported home-world minutes. The lens remains hers; paid completed work stays paid and unrelated relationships retain their own histories.', I.maker)],
            description: 'Available only while Vela still owns her one loose prism and can consent. The deposit is conserved escrow, not a sale or a fee. Unsupported realm/body absence retains the unexpired local return window.'}),
        ...['Village', 'Shack'].map(location => command({id: I.prefix + `return_${location === 'Village' ? 'village' : 'room'}`, ...contact, location,
            label: 'Return Vela’s exact loose lens · refund original 4-coin deposit once',
            visibleWhen: all(enrolled, f('loanHeld')), requires: all(enrolled, local, maker, f('returnLens'), f('custodySupported')),
            costs: [{type: 'custody', actor: 'player', from: 'player', to: I.maker, key: K.amber, count: 1, loanId: I.loanId, returning: true},
                {type: 'resource', actor: 'player', key: I.deposit, amount: -P.deposit}],
            effects: [money(P.deposit), af('loanHeld', false), af('returned'),
                {type: 'situation', situationId: I.situation, operation: 'advance', expected: ['borrowed'], phase: 'returned'},
                know('return', 'Handed the exact loose amber prism back to its consenting owner and recovered the unchanged original four-coin deposit once. Previous measurements remain observed; completed fees and any recorded lateness remain retained.', I.maker)],
            description: 'Requires actual Vela contact and the unreserved, unequipped custodial carrier. Return is still possible after the deadline. No extra funds, pardon, stock reset or refund for completed service is awarded.'})),
        command({id: I.invite, ...contact, label: 'Accompany willing Vela to the repaired room · her 1 stamina + 2 min',
            visibleWhen: all(enrolled, f('roomPermission')), requires: all(enrolled, local, maker, willing, f('makerHands'), f('roomPermission')),
            ...timed(2, all(enrolled, local, maker, willing, f('makerHands'), f('roomPermission')), null, true),
            costs: [stamina(I.maker, -1)], effects: [{type: 'relocate', actor: I.maker, location: 'Shack'},
                know('room_visit', 'Vela spent one of her own stamina and two played minutes on the agreed visit to the repaired, occupied Shack room. Her stock and purse remained hers. I still use actual native travel to meet her there.', I.maker)],
            description: 'Reserve Vela as an actual willing participant during the walk. Completion moves her own body to Shack; it neither teleports the player nor moves stock ownership. Failed room support refunds unperformed effort.'}),
        command({id: I.accompany, ...contact, location: 'Shack', label: 'Accompany Vela back to her Village stall · her 1 stamina + 2 min',
            visibleWhen: enrolled, requires: all(enrolled, local, maker, f('makerMobile')),
            ...timed(2, all(enrolled, local, maker, f('makerMobile')), null, true),
            costs: [stamina(I.maker, -1)], effects: [{type: 'relocate', actor: I.maker, location: 'Village'},
                know('stall_return', 'Vela spent one of her own stamina and two played minutes returning to her actual Village stall. Her lens, other pieces, earned coins and any unresolved loan retained their owners. I still travel through the native route.', I.maker)],
            description: 'A real return journey remains possible after lateness or a lost room right. It spends Vela’s own effort and grants no player movement or stock.'}),
        ...['Village', 'Shack'].map(location => command({id: I.prefix + `late_terms_${location === 'Village' ? 'village' : 'room'}`, ...contact, location, once: true,
            label: 'Hear Vela’s late-return terms · free', visibleWhen: all(enrolled, f('overdue')), requires: all(enrolled, local, maker, f('overdue')),
            effects: [know('late_terms', 'Vela confirmed that the agreed lens return became overdue. She declines this new voluntary lens service, while still accepting the exact prism back and refunding the original deposit. Her earlier workshop trade and everyone else’s relationships keep their own rules.', I.maker)],
            description: 'This actual contact discloses Vela’s narrow refusal. It does not reveal her private thoughts or another person’s knowledge.'})),
        ...measurements,
    ],
};
export const worldCompletionLensCommand = id => worldCompletionLensDefinitions.commands.find(d => d.id === id) || null;
export const worldCompletionLensIsMeasurement = id => measurements.some(d => d.id === id);

// A fresh host quote materializes only the exact current loan cause. Root must
// integrate the narrow custodyUse executor before these controls become legal.
export function worldCompletionLensFrozenDefinition(definition, loanCause) {
    const out = structuredClone(definition);
    for(const e of [...out.costs, ...out.effects]) if(e.custodyUse) e.custodyUse.cause = loanCause;
    for(const e of out.costs) if(e.type === 'custody' && e.returning) e.loanCause = loanCause;
    return out;
}
