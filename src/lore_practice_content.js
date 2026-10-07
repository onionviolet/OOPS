// Original, opt-in P1/P2 proposals. No source-world people, automatic stock,
// second clock or publisher are created by these definitions.
import {REMAINDER_HOME_IDS as H, REMAINDER_HOME_KEYS as K} from './audit_remainder_home_content.js';
import {REMAINDER_LIVELIHOOD_IDS as L} from './audit_remainder_livelihood_content.js';

export const LORE_PRACTICE_IDS = Object.freeze({world: H.world, neri: H.resident, orr: L.orr, ressa: 'remainder.offers.ressa',
    workshop: H.workshop, residence: H.residence, shift: 'lore.work.shift', rain: 'lore.warning.rain',
    drain: 'lore.warning.notch', shelf: 'lore.warning.low_shelf', exposure: 'lore.warning.exposure_job'});
export const LORE_PRACTICE_KEYS = K;
export const lorePracticeSources = [];
export const lorePracticeItemSpecifications = [];
const I = LORE_PRACTICE_IDS;
export const lorePracticeGroups = Object.freeze(['lore_work', 'lore_warning']);
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason ? {reason} : {})});
const all = (...rules) => ({all: rules}), not = rule => ({not: rule});
const f = (name, value = true, reason) => eq(`lore.${name}`, value, reason);
const local = f('local', true, 'Use your actual living human body in the supported home realm and played clock.');
const hands = f('playerHands', true, 'Recover your two usable hands first.');
const wf = (name, value = true) => ({type: 'world', worldId: I.world, key: `lore.${name}`, value});
const money = amount => ({type: 'resource', actor: 'player', native: true, key: 'money', amount});
const resource = (actor, key, amount) => ({type: 'resource', actor, key, amount});
const stamina = (actor, amount) => ({type: 'vital', actor, key: 'stamina', amount});
const item = (actor, key, amount, returned = false) => ({type: 'item', actor, key, amount, ...(returned ? {reservationReturn: true} : {})});
const transfer = (from, to, key, returned = false) => ({type: 'transfer', from, to, key, count: 1, ...(returned ? {reservationReturn: true} : {})});
export const lorePracticeKnowledge = (key, text, actor = 'player', speaker = actor, situationId = key.startsWith('lore.work.') ? I.shift : I.rain) =>
    ({type: 'knowledge', actor, key, stage: 'seen', value: text, basis: {kind: 'observation', attributedTo: speaker, situationId}});
const know = (name, text, actor = 'player', speaker = actor) => lorePracticeKnowledge(`lore.${name}`, text, actor, speaker);
const command = d => ({revision: 1, group: d.id.startsWith('lore.work.') ? 'lore_work' : 'lore_warning', worldId: I.world,
    actorId: 'player', location: 'Village', costs: [], effects: [], visibleWhen: f('enrolled'), reservationReturns: 1, ...d});
const timed = (duration, support, siteId, coLocated = false) => ({duration, cancellation: 'refund', completionFailure: 'refund',
    completionRequires: support, completionCoLocated: coLocated, ...(siteId ? {siteId} : {})});
const contact = id => ({targetId: id, coLocated: true, participants: ['$target']});
const npc = d => command({audience: ['$actor'], ...d});
const room = all(local, f('work.roomRight'));
const repair = actor => all(room, f(`${actor === 'player' ? 'player' : 'orr'}Hands`), f(`${actor === 'player' ? 'player' : 'orr'}Kit`), ...(actor === I.orr ? [f('orrMethod')] : []));
const observe = all(local, hands, f('warning.started'));
const currentSample = f('warning.currentSample', true, 'Inspect the current notch again: the observed drain, place, recipient or rain window changed.');
const beforeRain = f('warning.beforeRain', true, 'The one retained rain boundary has already passed.');
const recipient = f('ressaContact', true, 'Meet the same living, available Ressa in Village.');
const neriWork = all(room, f('neriHands'), f('neriMethod'), f('neriKit'), f('work.shutterRepaired'), f('work.neriAccepted'));
const signed = all(observe, currentSample, recipient, f('warning.preResponse'));
const ressaWork = all(local, f('ressaHands'), f('ressaKit'), f('warning.ressaFunded'), beforeRain);

const commands = [
    command({id: 'lore.work.begin', label: 'Negotiate one extra shutter and kit commission · optional 18-minute inspection', location: 'Shack', once: true,
        ...contact(I.neri), visibleWhen: f('work.canBegin'), requires: all(local, hands, f('work.canBegin')),
        effects: [{type: 'situation', operation: 'begin', situationId: I.shift}, wf('work.pauseMinutes', 0),
            know('work.terms', 'Neri’s first service and its collection are settled. This is a separate optional commission: repair the occupied room yourself with one compatible offcut, your held kit, two stamina and four minutes, or ask willing Orr to cover it for one coin. A separate log and two-coin escrow offers Neri one new five-minute binding job. She spends her own tool, finite attention and effort; one funded coin buys fittings and the other becomes her wage only on completion. Withdrawal returns only new unchanged stock and escrow after reservation refund. The inspection opportunity lasts eighteen supported played minutes. Her old invitation and property remain hers.', 'player', I.neri)]}),
    command({id: 'lore.work.repair_player', label: 'Repair the occupied shutter · 1 compatible offcut + held kit + 2 stamina + 4 min', location: 'Shack', once: true,
        visibleWhen: all(f('work.started'), not(f('work.shutterRepaired'))), requires: all(repair('player'), f('work.active'), f('work.noOrrOffer')),
        ...timed(4, all(repair('player'), not(f('work.shutterRepaired'))), I.workshop),
        costs: [item('player', K.offcut, -1), item('player', K.kit, -1), stamina('player', -2)],
        effects: [item('player', K.kit, 1, true), wf('work.shutterRepaired'), wf('work.repairWorker', 'player'),
            know('work.repair_player', 'My actual compatible offcut became the room’s shutter fastening. My counted kit returned once. This stationary installation supports only the newly negotiated dry-room sampling and indoor examination; existing home jobs retain their old rules.')]}),
    command({id: 'lore.work.repair_steady', label: 'Use earned steady grip on the shutter · 1 compatible offcut + held kit + 1 stamina + 3 min', location: 'Shack', once: true,
        visibleWhen: all(f('work.started'), f('steadyGrip'), not(f('work.shutterRepaired'))), requires: all(repair('player'), f('work.active'), f('work.noOrrOffer'), f('steadyGrip')),
        ...timed(3, all(repair('player'), f('steadyGrip', true, 'Your actually prepared steady grip must last through the shutter work.'), not(f('work.shutterRepaired'))), I.workshop),
        costs: [item('player', K.offcut, -1), item('player', K.kit, -1), stamina('player', -1)],
        effects: [item('player', K.kit, 1, true), wf('work.shutterRepaired'), wf('work.repairWorker', 'player'),
            know('work.repair_steady', 'My actually prepared steady grip lasted through three minutes of precise shutter work. One actual compatible offcut became the same room fastening with one stamina; my counted kit returned once. The preparation saved effort and time, and ordinary four-minute repair remains available without it.')]}),
    command({id: 'lore.work.ask_orr', label: 'Ask Orr to cover the shutter · offer 1 offcut + 1 coin escrow', once: true, ...contact(I.orr),
        visibleWhen: all(f('work.started'), not(f('work.shutterRepaired'))), requires: all(local, f('work.active'), f('orrContact'), room, f('work.noRepairJob')),
        costs: [money(-1), transfer('player', I.orr, K.offcut)], effects: [resource(I.orr, 'lore.work.orrEscrow', 1), wf('work.orrResponse', 'pending'),
            know('work.orr_offer', 'Offered Orr one actual offcut and one separately held coin for the room repair. Acceptance is still Orr’s decision. A completed cover occupies their own body during those four minutes, so an overlapping independent shift cannot start.', 'player', I.orr),
            know('work.orr_offer', 'The traveler offered one supplied offcut and one repair-escrow coin. I may accept or refuse; this is not a claim on my old purse, tool or shifts.', I.orr)]}),
    npc({id: 'lore.work.orr_accept', actorId: I.orr, once: true, label: 'Orr accepts the bounded shutter work and goes to the permitted room',
        requires: all(local, f('work.orrPending'), f('orrAccepts')), effects: [wf('work.orrResponse', 'accepted'), {type: 'relocate', actor: I.orr, location: 'Shack'},
            know('work.orr_accept', 'I accepted only the supplied shutter repair and moved to the actual permitted Shack room. My body, kit and attention remain mine; I cannot start a Village shift from here.', I.orr)]}),
    npc({id: 'lore.work.orr_refuse', actorId: I.orr, once: true, label: 'Orr declines the extra shutter work', requires: all(local, f('work.orrPending'), not(f('orrAccepts'))),
        effects: [wf('work.orrResponse', 'refused'), know('work.orr_refuse', 'I declined this extra cover. No offcut was consumed or wage earned; the unchanged supplied escrow can be withdrawn.', I.orr)]}),
    npc({id: 'lore.work.orr_repair', actorId: I.orr, location: 'Shack', once: true, label: 'Orr repairs the shutter with their own counted tool and effort',
        requires: all(repair(I.orr), f('work.orrAccepted')), ...timed(4, all(repair(I.orr), f('work.orrAccepted'), not(f('work.shutterRepaired'))), I.workshop),
        costs: [item(I.orr, K.offcut, -1), item(I.orr, K.kit, -1), resource(I.orr, 'lore.work.orrEscrow', -1), resource(I.orr, 'attention', -1), stamina(I.orr, -2)],
        effects: [item(I.orr, K.kit, 1, true), resource(I.orr, 'coins', 1), wf('work.shutterRepaired'), wf('work.repairWorker', I.orr), wf('work.orrResponse', 'complete'),
            know('work.orr_repair', 'My four-minute repair consumed the supplied offcut and my own effort/attention. My counted tool returned; the performed repair earned its one escrowed coin. The retained installation is in Neri’s occupied room.', I.orr)]}),
    npc({id: 'lore.work.orr_return', actorId: I.orr, location: 'Shack', once: true, label: 'Orr returns to ordinary Village work',
        requires: all(local, f('work.orrReturn')), effects: [{type: 'relocate', actor: I.orr, location: 'Village'},
            know('work.orr_return', 'Returned to Village after the completed or withdrawn cover. Existing funded shifts can still admit their own actual work; no invented debt or replacement stock was recorded.', I.orr)]}),
    command({id: 'lore.work.withdraw_orr', label: 'Withdraw the unperformed Orr cover · return the new offcut and 1 coin', location: null, once: true,
        visibleWhen: f('work.orrWithdrawable'), requires: all(local, f('work.orrWithdrawable')),
        costs: [resource(I.orr, 'lore.work.orrEscrow', -1), transfer(I.orr, 'player', K.offcut, true)], effects: [money(1), wf('work.orrResponse', 'withdrawn'),
            know('work.orr_withdrawal', 'Only the newly supplied unchanged offcut and one unearned escrow coin returned. Orr’s old tool, wages and completed work remain theirs.')]}),
    command({id: 'lore.work.fund_neri', label: 'Offer Neri a separate binding job · 1 log + 2 coins escrow', location: 'Shack', once: true, ...contact(I.neri),
        visibleWhen: all(f('work.started'), f('work.shutterRepaired'), f('neriContact')), requires: all(room, f('work.active'), f('neriContact'), f('work.shutterRepaired')),
        costs: [money(-2), transfer('player', I.neri, K.log)], effects: [resource(I.neri, 'lore.work.neriEscrow', 2), wf('work.neriResponse', 'pending'),
            know('work.neri_offer', 'Offered a new actual log and two separate escrow coins. Neri still decides whether her remaining attention, tool and effort support another commission. Collection earns no second wage.', 'player', I.neri),
            know('work.neri_offer', 'Received one new supplied log and two separately held binding coins. My old invitation, tool and first service are separate. I may refuse this extra work.', I.neri)]}),
    npc({id: 'lore.work.neri_accept', actorId: I.neri, location: 'Shack', once: true, label: 'Neri accepts one separately funded binding commission',
        requires: all(local, f('work.neriPending'), f('neriAccepts')), effects: [wf('work.neriResponse', 'accepted'),
            know('work.neri_accept', 'I accepted one separate binding commission after checking my own remaining attention, kit, room and stamina. The paid invitation does not replenish any of those means.', I.neri)]}),
    npc({id: 'lore.work.neri_refuse', actorId: I.neri, location: 'Shack', once: true, label: 'Neri postpones the extra binding commission',
        requires: all(local, f('work.neriPending'), not(f('neriAccepts'))), effects: [wf('work.neriResponse', 'refused'),
            know('work.neri_refuse', 'I cannot undertake this extra binding with my present means. The new unchanged escrow and supplied log can be withdrawn. My prior property and residence do not become a refundable wage.', I.neri)]}),
    npc({id: 'lore.work.neri_bind', actorId: I.neri, location: 'Shack', once: true, powerId: H.method, label: 'Neri makes the newly negotiated kit',
        requires: neriWork, ...timed(5, neriWork, I.workshop), costs: [item(I.neri, K.log, -1), item(I.neri, K.kit, -1),
            resource(I.neri, 'lore.work.neriEscrow', -2), resource(I.neri, 'attention', -1), stamina(I.neri, -2)],
        effects: [item(I.neri, K.kit, 1, true), item(I.neri, K.kit, 1), resource(I.neri, 'coins', 1), wf('work.neriResponse', 'complete'),
            know('work.neri_bind', 'My new supplied log and one fittings coin made one new kit. The other funded coin became my wage. My own counted tool returned once; my attention and two stamina were spent during the actual five-minute job. The new product stays mine until separate collection.', I.neri)]}),
    command({id: 'lore.work.collect_kit', label: 'Collect Neri’s actual extra kit · preserve her tool', location: 'Shack', once: true, ...contact(I.neri),
        visibleWhen: all(f('work.neriComplete'), f('neriContact')), requires: all(room, f('neriContact'), f('work.neriCollectable')),
        costs: [transfer(I.neri, 'player', K.kit)], effects: [wf('work.kitCollected'),
            know('work.collected', 'Neri transferred the one extra kit from her completed separate commission. Her original counted tool and earned wage stayed hers. This real kit can supply current field preparation; the local inspection deadline is checked separately at this collection.', 'player', I.neri)]}),
    command({id: 'lore.work.withdraw_neri', label: 'Withdraw the unperformed extra binding · return new log and 2 coins', location: null, once: true,
        visibleWhen: f('work.neriWithdrawable'), requires: all(local, f('work.neriWithdrawable')),
        costs: [resource(I.neri, 'lore.work.neriEscrow', -2), transfer(I.neri, 'player', K.log, true)], effects: [money(2), wf('work.neriResponse', 'withdrawn'),
            know('work.neri_withdrawal', 'Only the separately supplied unchanged log and two unearned escrow coins returned after reservations ended. The installed repair, Neri’s first invitation, returned tool, prior product and earned wages remain retained.')]}),
    command({id: 'lore.work.decline', label: 'Leave this extra commission and prepare your own kit · free', location: 'Shack', once: true,
        visibleWhen: f('work.active'), requires: all(local, f('work.active'), f('work.noFunding')),
        effects: [wf('work.declined'), know('work.declined', 'Declined this extra commission without a stock transfer or fee. Ordinary kit preparation remains available. Neri keeps her existing home, tool, wage and prior service; Orr keeps independent ordinary work.')]}),
    command({id: 'lore.work.account', label: 'Hear the actual shutter and inspection account', location: 'Shack', ...contact(I.neri),
        visibleWhen: f('work.started'), requires: all(local, f('neriContact'), room), effects: [know('work.account', 'Met Neri at the retained occupied room. The attributed account distinguishes the performed installation, extra binding, actual collection and eighteen-minute inspection opportunity.', 'player', I.neri)]}),
    command({id: 'lore.work.orr_account', label: 'Ask Orr which actual work the cover occupied', ...contact(I.orr), visibleWhen: f('work.started'),
        requires: all(local, f('orrContact')), effects: [know('work.orr_account', 'Met Orr after the separately offered cover. Their actual repair admission and overlapping already funded work remain separate from hypothetical wages or debt.', 'player', I.orr)]}),
    command({id: 'lore.warning.begin', label: 'Observe the low shelf and opt into one 20-minute rain window', once: true, ...contact(I.ressa),
        visibleWhen: f('warning.canBegin'), requires: all(local, hands, recipient, f('warning.canBegin')),
        effects: [{type: 'situation', operation: 'begin', situationId: I.rain}, {type: 'site', siteId: I.drain, operation: 'open'},
            {type: 'site', actor: I.ressa, siteId: I.shelf, operation: 'open'}, wf('warning.pauseMinutes', 0), wf('warning.drainOpen', false), wf('warning.rainOccurred', false),
            {type: 'observation', scope: 'world', key: 'lore.warning.drainOpen', as: 'lore.warning.sampleDrainOpen'},
            know('warning.sample', 'Observed the local notch and low shelf in Village. Rain could wet a deliberately entrusted sound stave while this narrow notch remains blocked. This is a current conditional observation, not future sight or an instruction to expose Ressa’s old stock.'),
            know('warning.terms', 'This distinct rain window lasts twenty supported played minutes. Deliver an attributed warning, fund a willing check, inspect yourself, clear the notch or continue ordinary work. Ressa’s old request, purse, kit need and detour provision keep their meanings. Any trial load must be a newly transferred sound stave; Ressa’s independent response finishes before its admission.', 'player', I.ressa)]}),
    ...[['outside', 3, 'Village'], ['room', 2, 'Shack']].map(([name, duration, location]) => {
        const support = all(observe, f('playerKit'), ...(name === 'room' ? [f('work.indoorSupport', true, 'Use the actually repaired, occupied and permitted room.')] : []));
        return command({id: `lore.warning.inspect_${name}`, label: `Inspect the current notch ${name === 'room' ? 'from the dry room' : 'outdoors'} · held kit + 1 stamina + ${duration} min`, location,
            visibleWhen: all(f('warning.started'), ...(name === 'room' ? [f('work.shutterRepaired')] : [])), requires: support,
            ...timed(duration, support, name === 'room' ? I.workshop : I.drain), costs: [item('player', K.kit, -1), stamina('player', -1)],
            effects: [item('player', K.kit, 1, true), {type: 'observation', scope: 'world', key: 'lore.warning.drainOpen', as: 'lore.warning.sampleDrainOpen'},
                know('warning.sample', 'Completed an actual local notch/shelf sample using my counted kit and effort. The recorded drain state and observation time support a current warning; the sample says nothing certain about future weather.')],});
    }),
    ...[['outside', 2, 'Village'], ['room', 1, 'Shack']].map(([name, duration, location]) => {
        const support = all(observe, f('playerKit'), f('focusedInspection', true, 'Your earned settled focus must remain active through this shorter actual inspection.'),
            ...(name === 'room' ? [f('work.indoorSupport')] : []));
        return command({id: `lore.warning.inspect_focused_${name}`, label: `Use settled focus ${name === 'room' ? 'in the repaired dry room' : 'outdoors'} · held kit + 1 stamina + ${duration} min`, location,
            visibleWhen: all(f('warning.started'), f('focusedInspection'), ...(name === 'room' ? [f('work.shutterRepaired')] : [])), requires: support,
            ...timed(duration, support, name === 'room' ? I.workshop : I.drain), costs: [item('player', K.kit, -1), stamina('player', -1)],
            effects: [item('player', K.kit, 1, true), {type: 'observation', scope: 'world', key: 'lore.warning.drainOpen', as: 'lore.warning.sampleDrainOpen'},
                know('warning.sample', 'My actually prepared settled focus lasted through a shorter kit-supported notch/shelf inspection. The physical sample records this current drain state and time; focus grants no future sight or new stock. Ordinary inspection remains available without preparation.')],});
    }),
    command({id: 'lore.warning.signed', label: 'Deliver your current signed warning · 1 min', ...contact(I.ressa),
        visibleWhen: all(f('warning.started'), f('warning.preResponse')), requires: signed, ...timed(1, signed, null, true),
        effects: [wf('warning.messageKind', 'signed'), wf('warning.messageDelivered'), wf('warning.ressaResponse', 'pending'),
            know('warning.signed_delivery', 'Delivered my signed, dated local observation to the actual Ressa. Receipt is separate from her independent response.', 'player', I.ressa),
            know('warning.received', 'Received the traveler’s personally signed local notch report. I have not yet chosen or completed any response.', I.ressa, 'player')]}),
    command({id: 'lore.warning.ask_relay', label: 'Ask Orr to relay without naming you to Ressa · 1 coin escrow', once: true, ...contact(I.orr),
        visibleWhen: all(f('warning.started'), f('warning.preResponse')), requires: all(observe, currentSample, beforeRain, f('orrContact'), f('warning.preResponse')),
        costs: [money(-1)], effects: [resource(I.orr, 'lore.warning.relayEscrow', 1), wf('warning.relayResponse', 'pending'),
            know('warning.relay_offer', 'Placed one real relay coin in a separate escrow. Orr knows that I paid; Ressa will be told only Orr’s message if the delivery actually happens. Acceptance, delivery and recipient receipt are separate.', 'player', I.orr),
            know('warning.relay_payer', 'The traveler privately asked and paid for one warning relay without naming them to Ressa. I retain the payer’s actual identity; this promise has not delivered a message.', I.orr, 'player')]}),
    npc({id: 'lore.warning.orr_relay_accept', actorId: I.orr, once: true, label: 'Orr accepts one private warning relay',
        requires: all(local, f('warning.relayPending'), f('orrRelayAccepts')), effects: [wf('warning.relayResponse', 'accepted'),
            know('warning.relay_accepted', 'Accepted the one separately paid relay. I know the payer privately, and will not name them to Ressa.', I.orr)]}),
    npc({id: 'lore.warning.orr_relay_refuse', actorId: I.orr, once: true, label: 'Orr declines the warning relay',
        requires: all(local, f('warning.relayPending'), not(f('orrRelayAccepts'))), effects: [wf('warning.relayResponse', 'refused'),
            know('warning.relay_refused', 'Declined this relay with my present means. No message was delivered; the unchanged new escrow remains refundable.', I.orr)]}),
    npc({id: 'lore.warning.orr_relay', actorId: I.orr, once: true, label: 'Orr performs the actual one-minute private relay', ...contact(I.ressa),
        requires: all(local, recipient, f('orrHands'), f('warning.relayAccepted'), currentSample, beforeRain),
        ...timed(1, all(local, recipient, f('orrHands'), currentSample, beforeRain), null, true),
        costs: [resource(I.orr, 'lore.warning.relayEscrow', -1), stamina(I.orr, -1)], effects: [resource(I.orr, 'coins', 1), wf('warning.relayResponse', 'delivered'),
            wf('warning.messageKind', 'anonymous'), wf('warning.messageDelivered'), wf('warning.ressaResponse', 'pending'),
            know('warning.relay_delivered', 'Performed the paid one-minute delivery to Ressa and spent my own stamina. The postage became my earned coin even if she decides not to act.', I.orr),
            know('warning.received', 'Orr delivered a dated conditional notch report. Orr did not name the sender to me. I have not yet checked or moved a load.', I.ressa, I.orr)]}),
    command({id: 'lore.warning.withdraw_relay', label: 'Withdraw the unperformed relay · return 1 escrow coin', once: true,
        visibleWhen: f('warning.relayWithdrawable'), requires: all(local, f('warning.relayWithdrawable')),
        costs: [resource(I.orr, 'lore.warning.relayEscrow', -1)], effects: [money(1), wf('warning.relayResponse', 'withdrawn'),
            know('warning.relay_withdrawn', 'The unperformed relay’s one escrow coin returned. A performed delivery would have earned its postage and cannot be unwritten.')]}),
    command({id: 'lore.warning.fund_check', label: 'Offer Ressa a separate owner-operated check · 2 coin escrow', once: true, ...contact(I.ressa),
        visibleWhen: all(f('warning.started'), f('warning.preResponse')), requires: all(local, recipient, beforeRain, f('warning.preResponse')),
        costs: [money(-2)], effects: [resource(I.ressa, 'lore.warning.workEscrow', 2), wf('warning.fundingOffered'),
            know('warning.funding', 'Offered two actual coins in a new, separate work escrow. Ressa must still choose and use her own available kit, body, effort and three minutes. One coin buys fittings; one becomes a wage only on performed completion. The old association purse is not replenished.', 'player', I.ressa)]}),
    npc({id: 'lore.warning.ressa_check', actorId: I.ressa, once: true, label: 'Ressa chooses and performs the supplied inspection and sheltering',
        requires: all(ressaWork, f('warning.ressaPending'), f('warning.ressaPaidChoice')), ...timed(3, ressaWork, I.drain),
        costs: [resource(I.ressa, 'lore.warning.workEscrow', -2), item(I.ressa, K.kit, -1), stamina(I.ressa, -1)],
        effects: [item(I.ressa, K.kit, 1, true), resource(I.ressa, 'lore.warning.earnedCoins', 1), wf('warning.ressaResponse', 'sheltered'),
            know('warning.ressa_check', 'I chose and completed the three-minute supplied check with my own actual kit and one stamina. One escrow coin paid fittings and the other became my earned wage in this separate purse. I chose the sheltered trial position for any newly entrusted stave; no old property was moved.', I.ressa)]}),
    npc({id: 'lore.warning.ressa_small_check', actorId: I.ressa, once: true, label: 'Ressa chooses a smaller ordinary check of the signed warning',
        requires: all(local, f('ressaHands'), beforeRain, f('warning.ressaPending'), f('warning.ressaSmallChoice')),
        ...timed(1, all(local, f('ressaHands'), beforeRain), I.drain), costs: [stamina(I.ressa, -1)],
        effects: [wf('warning.ressaResponse', 'checked'), know('warning.ressa_small_check', 'I used one of my own stamina and one minute for a smaller ordinary check of the personally delivered report. This supplied less detail and no sheltered-load commitment; my old detour means were not reused.', I.ressa)]}),
    npc({id: 'lore.warning.ressa_refuse', actorId: I.ressa, once: true, label: 'Ressa declines to undertake this warning response',
        requires: all(local, f('warning.ressaPending'), f('warning.ressaRefuses')), effects: [wf('warning.ressaResponse', 'declined'),
            know('warning.ressa_refuse', 'I received the warning and declined the extra response with my present means and terms. Receipt did not become a performed move, renewed detour effort or a duty to the sender.', I.ressa)]}),
    npc({id: 'lore.warning.ressa_trial_accept', actorId: I.ressa, once: true, label: 'Ressa independently agrees to the new material trial',
        requires: all(local, f('ressaHands'), beforeRain, f('warning.responseSettled'), f('warning.trialUndecided'), f('warning.trialWilling')),
        effects: [wf('warning.trialConsent', 'accepted'), know('warning.trial_consent', 'After my performed check, I agree to receive one new sound stave for the expressly disclosed trial at my already chosen exposed or sheltered position. I do not consent to risking my old property. The trial will occupy my body until the rain endpoint.', I.ressa)]}),
    npc({id: 'lore.warning.ressa_trial_refuse', actorId: I.ressa, once: true, label: 'Ressa declines the new material trial',
        requires: all(local, f('warning.responseSettled'), f('warning.trialUndecided'), not(f('warning.trialWilling'))),
        effects: [wf('warning.trialConsent', 'refused'), know('warning.trial_consent', 'I declined the separate new material trial. The traveler may still inspect or open the notch; none of my old property will be exposed by their request.', I.ressa)]}),
    command({id: 'lore.warning.withdraw_check', label: 'Withdraw unperformed Ressa check · return its 2 escrow coins', once: true,
        visibleWhen: f('warning.checkWithdrawable'), requires: all(local, f('warning.checkWithdrawable')),
        costs: [resource(I.ressa, 'lore.warning.workEscrow', -2)], effects: [money(2), wf('warning.fundingWithdrawn'),
            know('warning.check_withdrawn', 'Returned only the two unchanged new work-escrow coins after any reservations were cancelled. Ressa’s old association purse, need, tool and detour history remain retained.')]}),
    command({id: 'lore.warning.clear_notch', label: 'Line and open the actual notch · 1 log + held kit + 2 stamina + 4 min',
        visibleWhen: f('warning.started'), requires: all(observe, f('playerKit')), ...timed(4, all(observe, f('playerKit')), I.drain),
        costs: [item('player', K.log, -1), item('player', K.kit, -1), stamina('player', -2)],
        effects: [item('player', K.kit, 1, true), wf('warning.drainOpen'), wf('warning.obstructionCause', 'cleared_with_log'),
            know('warning.clearance', 'One actual log became the notch lining after my four-minute work and two stamina. My counted kit returned. The current open drain removes the flood’s physical support if rain has not already happened; it supplies no reward stock or restored past outcome.')]}),
    command({id: 'lore.warning.entrust_stave', label: 'Entrust one real sound stave to Ressa’s chosen trial position until rain', once: true, ...contact(I.ressa),
        visibleWhen: all(f('warning.started'), f('warning.responseSettled'), recipient), requires: all(local, recipient, beforeRain, f('warning.responseSettled'), f('warning.trialAccepted', true, 'Ressa must separately agree to the explicitly entrusted trial after her own check.'), f('warning.noTrial'), f('warning.noPendingRelay')),
        costs: [transfer('player', I.ressa, K.sound)], effects: [wf('warning.trialEntrusted'),
            know('warning.entrusted', 'Transferred one actual unencumbered Sound repair stave to consenting Ressa for the expressly disclosed low-shelf trial. It is hers. Her response and chosen exposed or sheltered position were settled before this admission. It remains reserved until the exact remaining rain endpoint.', 'player', I.ressa),
            know('warning.entrusted', 'Accepted this one newly entrusted sound stave for the declared trial after my own response had finished. My previous kit request and other property are separate.', I.ressa)]}),
    // Host supplies only the exact positive remaining window, freezes its
    // descriptor, and starts this internal owner-operated reservation atomically
    // with entrust_stave. Its result is selected from current physical support.
    npc({id: I.exposure, actorId: I.ressa, once: true, label: 'Ressa’s expressly entrusted stave waits at the chosen shelf position', duration: 1,
        siteId: I.shelf, cancellation: 'refund', visibleWhen: f('warning.exposureHost'), requires: all(local, f('warning.exposureHost'), f('warning.responseSettled'), beforeRain),
        costs: [item(I.ressa, K.sound, -1)], effects: []}),
    command({id: 'lore.warning.buy_wet', label: 'Offer to buy Ressa’s one wet trial result · 1 coin', once: true, ...contact(I.ressa),
        visibleWhen: all(f('warning.wetResult'), recipient), requires: all(local, recipient, f('warning.wetBuyable')),
        costs: [money(-1), transfer(I.ressa, 'player', K.wet)], effects: [resource(I.ressa, 'lore.warning.earnedCoins', 1), wf('warning.wetBought'),
            know('warning.wet_buyback', 'Ressa willingly sold her one actual wet trial stave for my one native coin. Only this explicit purchase put it into my own bag; existing player drying, brace, fitting and kit recipes may now consume that owned material.', 'player', I.ressa)]}),
    command({id: 'lore.warning.account', label: 'Hear Ressa’s actual warning and material account', ...contact(I.ressa),
        visibleWhen: f('warning.started'), requires: all(local, recipient, f('warning.responseSettled')), effects: [
            know('warning.account', 'Met the actual recipient after her response. The received message, performed/refused work, current physical rain/drain result and owner of the trial material are separate observations.', 'player', I.ressa)]}),
    command({id: 'lore.warning.leave', label: 'Leave the rain undertaking · ordinary work remains', once: true,
        visibleWhen: all(f('warning.started'), not(f('warning.left'))), requires: all(local, f('warning.noUnperformedFunding'), f('warning.noTrial')),
        effects: [wf('warning.left'), know('warning.left', 'Left this optional undertaking without a newly entrusted load or outstanding work escrow. The one observed rain still arrives on supported local time. Ordinary preparation remains available; no person, purse, material or crisis is reset.')]}),
];
const context = {worldId: I.world, instanceId: 'frontier.main', continuityId: 'frontier.branch', eraId: 'frontier.present', regionId: 'frontier.village'};
const controllers = [
    {id: 'lore.work.neri_controller', actorId: I.neri, actions: ['neri_accept', 'neri_refuse', 'neri_bind'].map((id, i) => ({commandId: `lore.work.${id}`, priority: 10 - i}))},
    {id: 'lore.work.orr_controller', actorId: I.orr, actions: ['orr_accept', 'orr_refuse', 'orr_repair', 'orr_return'].map((id, i) => ({commandId: `lore.work.${id}`, priority: 10 - i}))},
    {id: 'lore.warning.orr_controller', actorId: I.orr, actions: ['orr_relay_accept', 'orr_relay_refuse', 'orr_relay'].map((id, i) => ({commandId: `lore.warning.${id}`, priority: 10 - i}))},
    {id: 'lore.warning.ressa_controller', actorId: I.ressa, actions: ['ressa_check', 'ressa_small_check', 'ressa_refuse', 'ressa_trial_accept', 'ressa_trial_refuse'].map((id, i) => ({commandId: `lore.warning.${id}`, priority: 10 - i}))},
].map(d => ({revision: 1, interval: 1, label: 'Finite opt-in original local response', ...d}));
export const lorePracticeDefinitions = {commands, controllers,
    sites: [{id: I.drain, revision: 1, label: 'One permitted local drainage notch', capacity: 1, provision: false},
        {id: I.shelf, revision: 1, label: 'Ressa’s one expressly entrusted low-shelf trial', capacity: 1, provision: false}],
    situations: [{id: I.shift, revision: 1, label: 'The overlapping shifts', context, participants: ['player', I.neri, I.orr], responseWindow: 18,
        initialPhase: 'offered', phases: ['offered', 'agreed', 'repaired', 'delivered', 'late', 'declined', 'withdrawn'],
        privateTruth: {extraService: 'requires_neri_consent', inspection: 'new_original_local_request'}},
    {id: I.rain, revision: 1, label: 'A warning with expiring assumptions', context, participants: ['player', I.ressa, I.orr], responseWindow: 20,
        initialPhase: 'observed', phases: ['observed', 'warned', 'rained', 'closed'],
        privateTruth: {baseline: 'blocked_notch_may_wet_expressly_exposed_sound_stave', weather: 'one_original_rain_occurrence', durationPolicy: 'retained_supported_remaining_window'}}]};
export const lorePracticeCommand = id => commands.find(d => d.id === id);
