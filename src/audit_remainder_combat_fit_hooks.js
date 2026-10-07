// Deterministic schema5 hooks. Every function returns staged data and leaves
// its inputs untouched. The existing native battle planner pays and commits.
import {REMAINDER_COMBAT_FIT_IDS as I, REMAINDER_COMBAT_FIT_KEYS as K,
    REMAINDER_COMBAT_FIT_PROFILES as P} from './audit_remainder_combat_fit_content.js';
import {combatFitAssert as A, combatFitNatural as N, combatFitRecord as R, combatFitSame as same,
    remainderCombatFitEnrolled, remainderCombatFitTermsAccepted, remainderCombatFitLatestPractice,
    remainderCombatFitGripPreparation, remainderCombatFitEarnedGrip, remainderCombatFitActiveSource,
    remainderCombatFitPlayerSupported, remainderCombatFitHandsUsable, remainderCombatFitUnencumbered,
    remainderCombatFitCurrentHarness, validateRemainderGripModule} from './audit_remainder_combat_fit_facts.js';

export const REMAINDER_COMBAT_FIT_BATTLE_SCHEMA = 5;
export const REMAINDER_COMBAT_FIT_HOOK_SCHEMA = 1;
const sourceReceipt = state => state.actors?.player?.sources?.[I.grip]?.receiptId;
const renewalCount = state => Number(state.actors?.player?.facts?.['field.renewed'] === true);
const moduleOf = state => state.auditRemainder?.modules?.combat_fit || null;
const sessionSequence = id => /^simulation:[1-9][0-9]*$/.test(id || '') ? Number(id.slice(11)) : NaN;
const targets = c => c.targetIds || (c.targetId ? [c.targetId] : []);
const receiptBase = (kind, actorId, action, sequence) => ({kind, actorId, action, sequence});
const freezeFit = (actorId, profile) => ({actorId, key: profile.key, profileId: profile.id, blockStrength: profile.block,
    guardExtra: profile.guardExtra, hookStaminaImmune: profile.hookStaminaImmune});

// Call after exact grip_practice completion effects and completed count, before
// simulation/expansion validation. Call at later played-clock/transition commits
// too. It uses one retained receipt and does not run a job or award a result.
export function syncRemainderCombatFitCompletion(state) {
    const latest = remainderCombatFitLatestPractice(state), saved = moduleOf(state);
    if(!latest) return saved == null ? null : structuredClone(saved);
    let out = saved == null ? null : structuredClone(saved);
    if(out?.grip?.cause !== latest.cause) {
        A(!out || ['spent', 'expired'].includes(out.grip.status), 'Prepared grip cannot stack or overwrite a reserved charge.');
        A(remainderCombatFitEarnedGrip(state) && typeof sourceReceipt(state) === 'string', 'Completed brace practice lacks its actual earned active trained source.');
        out = {schema: 1, grip: {...latest, status: 'ready', sessionId: null, reservedSequence: null, spentAction: null,
            spentSequence: null, endedSequence: null, expiryReason: null, sourceReceiptId: sourceReceipt(state), renewalCount: renewalCount(state)}};
    }
    const g = out.grip;
    if(['ready', 'reserved'].includes(g.status)) {
        const reason = state.clock >= g.expiresAt ? 'timeout' : state.actors.player.worldId !== I.world ? 'left_frontier' : renewalCount(state) > g.renewalCount ? 'field_renewal' : null;
        if(reason) Object.assign(g, {status: 'expired', endedSequence: state.sequence, expiryReason: reason});
    }
    return out;
}

export function previewRemainderCombatFitAdmission(state, context = {}, {reserveGripPreparation = false} = {}) {
    const preparation = remainderCombatFitGripPreparation(state), reasons = [];
    if(reserveGripPreparation) {
        if(!remainderCombatFitTermsAccepted(state) || preparation?.status !== 'ready') reasons.push('Complete one unspent conditioned brace practice before reserving it.');
        if(!remainderCombatFitPlayerSupported(state, context) || !remainderCombatFitHandsUsable(state) || !remainderCombatFitEarnedGrip(state)) reasons.push('Reserve practice only with your present recovered living hands and actual active trained grip.');
        if(preparation?.sourceReceiptId !== sourceReceipt(state)) reasons.push('The preparation belongs to its actual trained source acquisition.');
        if(preparation && state.clock >= preparation.expiresAt) reasons.push('This sixty-minute preparation has expired.');
    }
    return {eligible: reasons.length === 0, reasons, reserveGripPreparation: !!reserveGripPreparation};
}
// Root calls only for a newly explicitly admitted schema5 session. No old
// session is upgraded. Returned module replaces only modules.combat_fit.
export function admitRemainderCombatFit(state, session, context = {}, options = {}) {
    const b = session?.nativeBattle;
    A(remainderCombatFitEnrolled(state) && b?.schema === 5 && session.definitionId === 'feature_battle.sluice' &&
        b.actions === 0 && N(sessionSequence(session.id)) && sessionSequence(session.id) <= state.sequence, 'Combat-fit admission needs a new explicit schema5 sluice attempt.');
    const admission = previewRemainderCombatFitAdmission(state, context, options);
    A(admission.eligible, admission.reasons.join(' '));
    const harnesses = {};
    for(const actorId of [I.lio, I.shield]) {
        if(!b.fighters?.[actorId]) continue;
        const profile = remainderCombatFitCurrentHarness(state, actorId);
        if(profile && (profile.id === 'original' || remainderCombatFitTermsAccepted(state))) harnesses[actorId] = freezeFit(actorId, profile);
    }
    const module = syncRemainderCombatFitCompletion(state);
    const combatFit = {schema: 1, admittedSequence: sessionSequence(session.id), harnesses, gripPractice: null, receipts: []};
    if(options.reserveGripPreparation === true) {
        A(module?.grip?.status === 'ready', 'The paid grip preparation is unavailable.');
        Object.assign(module.grip, {status: 'reserved', sessionId: session.id, reservedSequence: state.sequence});
        combatFit.gripPractice = module.grip.cause;
    }
    return {combatFit, module};
}
export function remainderCombatFitRetainedHarness(state, battle, actorId) {
    if(battle?.schema !== 5 || battle.combatFit?.schema !== 1) return null;
    const snapshot = battle.combatFit.harnesses?.[actorId], profile = remainderCombatFitCurrentHarness(state, actorId);
    return snapshot && profile && same(snapshot, freezeFit(actorId, profile)) ? profile : null;
}
// Return null for old3/4: the caller must preserve its exact original path.
// Schema5 binds this projection into Enemy.hasShield/getBlockStrength AND
// sync defense/block_chance before readNativeFighter takes the actual snapshot.
export function remainderCombatFitNativeStats(state, battle, actorId) {
    if(battle?.schema !== 5) return null;
    const p = remainderCombatFitRetainedHarness(state, battle, actorId);
    return {hasFrame: !!p, blockStrength: p?.block || 0, defenseBonus: p?.defense || 0,
        blockChance: p?.blockChance || 0, guardExtra: p?.guardExtra || 0, hookStaminaImmune: p?.hookStaminaImmune || false,
        profileId: p?.id || null, key: p?.key || null};
}
export function remainderCombatFitRopeAvailable(state, battle, context = {}) {
    if(remainderCombatFitUnencumbered(state, context, 'player', K.rope, {unequipped: true})) return {available: true, reservationId: null};
    // Combat-objectives owns this existing paid reservation. Its held rope can
    // serve a separate grip action without consuming the traversal charge or
    // creating a second refund. Root validates that owner's exact admission.
    const session = state.simulation?.sessions?.player, physical = battle?.combatObjectives?.physical;
    const available = battle?.schema === 5 && battle.combatObjectives?.schema === 1 && physical?.kind === 'traversal' &&
        physical.ropeKey === K.rope && physical.reservationId === `${session?.id}:physical` &&
        physical.admittedSequence === sessionSequence(session?.id) && [0, 1].includes(physical.remaining) &&
        !Object.values(state.simulation?.custody || {}).some(c => c.holder === 'player' && c.key === K.rope) &&
        !Object.values(context.equipment?.player || state.simulation?.equipment?.player || {}).includes(K.rope);
    return {available, reservationId: available ? physical.reservationId : null};
}
export function quoteRemainderCombatFitAction(state, battle, c, context = {}, baseCost = 0) {
    const reasons = [], result = {eligible: true, reasons, handled: false, cost: baseCost, escapeGain: null,
        preparedGrip: false, harnessProfileId: null, guardExtra: 0, maneuver: null, sourceId: null, sourceOrigin: null, sourceReceiptId: null, ropeReservationId: null};
    const requested = c.useGripPreparation != null || c.maneuver != null;
    if(battle?.schema !== 5) {
        if(requested) reasons.push('These body choices require a newly explicitly enrolled schema5 attempt.');
        result.eligible = !reasons.length; return result;
    }
    if(c.useGripPreparation != null && typeof c.useGripPreparation !== 'boolean') reasons.push('Choose whether to use this one prepared self-guard.');
    if(c.maneuver != null && !['balance', 'grip_rope'].includes(c.maneuver)) reasons.push('Unsupported earned-body maneuver.');
    if(c.type === 'guard') {
        const fit = remainderCombatFitRetainedHarness(state, battle, c.actorId);
        if(fit) {
            result.cost += fit.guardExtra; result.guardExtra = fit.guardExtra;
            result.harnessProfileId = fit.id; result.handled = fit.guardExtra > 0;
        }
    }
    if(c.useGripPreparation === true) {
        const prep = remainderCombatFitGripPreparation(state), session = state.simulation?.sessions?.player;
        result.handled = true;
        if(c.actorId !== 'player' || c.type !== 'guard' || !same(targets(c), ['player']) || c.maneuver != null || c.opportunity != null ||
            c.physicalPreparation != null || c.preparation != null || c.usePreparation != null || baseCost !== 2) reasons.push('Use prepared grip only on your ordinary two-stamina self-guard, without another physical preparation.');
        if(!remainderCombatFitTermsAccepted(state) || prep?.status !== 'reserved' || prep.sessionId !== session?.id || battle.combatFit?.gripPractice !== prep.cause) reasons.push('No unspent grip practice is reserved to this actual attempt.');
        if(!remainderCombatFitPlayerSupported(state, context) || !remainderCombatFitHandsUsable(state) || !remainderCombatFitEarnedGrip(state) || prep?.sourceReceiptId !== sourceReceipt(state)) reasons.push('Current living recovered hands and the same actual active trained grip must support this guard.');
        if(!reasons.length) {result.cost = 1; result.preparedGrip = true; result.sourceId = I.grip; result.sourceOrigin = 'trained'; result.sourceReceiptId = sourceReceipt(state);}
    }
    if(c.maneuver != null) {
        result.handled = true; result.maneuver = c.maneuver;
        if(c.type !== 'escape' || c.actorId !== 'player' || targets(c).length || c.opportunity != null || c.useGripPreparation === true ||
            c.usePreparation != null || c.preparation != null || c.physicalPreparation != null || c.usePreparedEscape != null) reasons.push('An earned-body escape uses only its own maneuver cost and progress, without a defensive opening or physical traversal charge.');
        if(!remainderCombatFitTermsAccepted(state) || !remainderCombatFitPlayerSupported(state, context) || !remainderCombatFitHandsUsable(state)) reasons.push('Use this learned-body route only with your current recovered supported Village body.');
        if(c.maneuver === 'balance') {
            result.cost = 2; result.escapeGain = 2; result.sourceId = I.balance; result.sourceOrigin = 'inherited';
            result.sourceReceiptId = state.actors?.player?.sources?.[I.balance]?.receiptId || null;
            if(!remainderCombatFitActiveSource(state, 'player', I.balance, 'inherited')) reasons.push('Awaken and activate your actual inherited Natural balance first; suppressed or dormant balance supplies no step.');
        } else if(c.maneuver === 'grip_rope') {
            result.cost = 1; result.escapeGain = 1; result.sourceId = I.grip; result.sourceOrigin = 'trained'; result.sourceReceiptId = sourceReceipt(state) || null;
            if(!remainderCombatFitEarnedGrip(state)) reasons.push('This rope maneuver needs your actual earned active trained Conditioned grip.');
            const rope = remainderCombatFitRopeAvailable(state, battle, context);
            result.ropeReservationId = rope.reservationId;
            if(!rope.available) reasons.push('Carry one actual owned unequipped unborrowed Survey rope, or use this attempt\'s exact already reserved rope; this maneuver keeps it.');
        }
    }
    if(result.handled && (!Number.isFinite(result.cost) || result.cost < 0)) reasons.push('Invalid actual paid maneuver/guard effort.');
    result.eligible = !reasons.length; return result;
}
// Called after the root pays quote.cost and advances its ONE action/sequence.
// The root attaches returned receipt entries to its normal action receipt and
// uses returned combatFit/module in that same plan before publication.
export function settleRemainderCombatFitAction(state, session, c, quote, {action, sequence} = {}) {
    const b = session?.nativeBattle;
    if(b?.schema !== 5) return {combatFit: null, module: moduleOf(state), receipt: []};
    A(quote?.eligible && N(action) && action > 0 && N(sequence) && sequence > b.combatFit.admittedSequence, 'Only an accepted paid action can settle combat-fit hooks.');
    const fit = structuredClone(b.combatFit), module = moduleOf(state) == null ? null : structuredClone(moduleOf(state)), receipt = [];
    if(quote.guardExtra > 0) receipt.push({...receiptBase('fit_guard', c.actorId, action, sequence), targetId: targets(c)[0],
        profileId: quote.harnessProfileId, extraStamina: quote.guardExtra, staminaCost: quote.cost});
    if(quote.preparedGrip) {
        const g = module?.grip;
        A(g?.status === 'reserved' && g.sessionId === session.id && g.cause === fit.gripPractice, 'The unique prepared-grip charge was already spent or belongs elsewhere.');
        Object.assign(g, {status: 'spent', spentAction: action, spentSequence: sequence});
        receipt.push({...receiptBase('prepared_guard', 'player', action, sequence), targetId: 'player', preparationCause: g.cause,
            staminaCost: 1, sourceId: I.grip, sourceOrigin: 'trained', sourceReceiptId: g.sourceReceiptId});
    }
    if(quote.maneuver) receipt.push({...receiptBase('maneuver', 'player', action, sequence), maneuver: quote.maneuver,
        staminaCost: quote.cost, escapeGain: quote.escapeGain, sourceId: quote.sourceId, sourceOrigin: quote.sourceOrigin,
        sourceReceiptId: quote.sourceReceiptId, ...(quote.maneuver === 'grip_rope' ? {ropeKey: K.rope, ropeConsumed: false, ropeReservationId: quote.ropeReservationId} : {})});
    fit.receipts = [...fit.receipts, ...receipt].slice(-16);
    return {combatFit: fit, module, receipt};
}
// Quote for the actual redirected target BEFORE native damage changes support;
// consume solely in the existing landed Oren hook branch AFTER native damage.
// Never change damage, HP, strike kind or held-guard disruption here.
export function remainderCombatFitHookAftermath(state, battle, targetId) {
    const fit = remainderCombatFitRetainedHarness(state, battle, targetId);
    return {extraStaminaLoss: fit?.hookStaminaImmune ? 0 : 1, resisted: fit?.hookStaminaImmune === true, profileId: fit?.id || null};
}
export function remainderCombatFitHookReceipt(targetId, aftermath, {action, sequence} = {}) {
    if(!aftermath?.resisted) return null;
    A(aftermath.profileId === 'flexible' && aftermath.extraStaminaLoss === 0 && N(action) && action > 0 && N(sequence), 'Unsupported flexible hook resistance.');
    return {...receiptBase('hook_resisted', I.hook, action, sequence), targetId, profileId: 'flexible', extraStaminaLoss: 0};
}
export function retainRemainderCombatFitHookReceipts(combatFit, receipts) {
    const fit = structuredClone(combatFit);
    fit.receipts = [...fit.receipts, ...receipts.filter(Boolean)].slice(-16); return fit;
}
export function finishRemainderCombatFit(state, session, sequence = state.sequence) {
    const saved = moduleOf(state);
    if(session?.nativeBattle?.schema !== 5 || !saved || saved.grip.sessionId !== session.id) return saved == null ? null : structuredClone(saved);
    const out = structuredClone(saved), g = out.grip;
    if(g.status === 'reserved') Object.assign(g, {status: 'expired', endedSequence: sequence, expiryReason: 'session_finish'});
    else if(g.status === 'spent') g.endedSequence = sequence;
    return out;
}
export function remainderCombatFitBattleChoices(battle) {
    if(battle?.schema !== 5) return [];
    return [
        {label: 'Use prepared conditioned self-guard · 1 stamina, once', command: {type: 'guard', actorId: 'player', targetId: 'player', useGripPreparation: true}},
        {label: 'Sure-footed balance step · 2 stamina, 2 retreat progress', command: {type: 'escape', actorId: 'player', maneuver: 'balance'}},
        {label: 'Conditioned grip and owned rope · 1 stamina, 1 retreat progress', command: {type: 'escape', actorId: 'player', maneuver: 'grip_rope'}},
    ];
}

export function validateRemainderCombatFitBattle(b, state, session) {
    if(b?.schema !== 5) {A(b?.combatFit == null, 'Frozen earlier sluice sessions cannot acquire new fit hooks.'); return;}
    const fit = b.combatFit;
    A(remainderCombatFitEnrolled(state) && R(fit) && Object.keys(fit).sort().join(',') === 'admittedSequence,gripPractice,harnesses,receipts,schema' && fit.schema === 1 &&
        N(fit.admittedSequence) && fit.admittedSequence === sessionSequence(session.id) && fit.admittedSequence <= state.sequence, 'Invalid explicit schema5 combat-fit admission snapshot.');
    A(R(fit.harnesses) && Object.entries(fit.harnesses).every(([actorId, snapshot]) => {
        const profile = P[snapshot?.profileId];
        return [I.lio, I.shield].includes(actorId) && !!b.fighters?.[actorId] && !!profile && (actorId !== I.shield || profile.id === 'original') &&
            (profile.id === 'original' || remainderCombatFitTermsAccepted(state)) && same(snapshot, freezeFit(actorId, profile));
    }), 'Invalid retained actual-harness fit profile.');
    A(fit.gripPractice === null || /^simulation:[1-9][0-9]*$/.test(fit.gripPractice), 'Invalid battle grip reservation identity.');
    if(fit.gripPractice !== null) {
        const module = moduleOf(state);
        validateRemainderGripModule(module, state);
        A(module.grip.cause === fit.gripPractice && module.grip.sessionId === session.id && ['reserved', 'spent', 'expired'].includes(module.grip.status), 'The attempt lost its unique admitted grip preparation.');
    }
    A(Array.isArray(fit.receipts) && fit.receipts.length <= 16, 'Invalid bounded combat-fit action history.');
    const seen = new Set();
    for(const r of fit.receipts) {
        A(R(r) && ['fit_guard', 'prepared_guard', 'maneuver', 'hook_resisted'].includes(r.kind) && N(r.action) && r.action > 0 && r.action <= b.actions &&
            N(r.sequence) && r.sequence > fit.admittedSequence && r.sequence <= state.sequence && !!b.fighters[r.actorId], 'Invalid combat-fit committed action cause.');
        const identity = `${r.action}:${r.kind}:${r.actorId}:${r.targetId || r.maneuver || ''}`;
        A(!seen.has(identity), 'Combat-fit effect cannot spend or apply twice on one action.'); seen.add(identity);
        let expected;
        if(r.kind === 'fit_guard') {
            expected = ['kind', 'actorId', 'action', 'sequence', 'targetId', 'profileId', 'extraStamina', 'staminaCost'];
            A(r.actorId === I.lio && !!b.fighters[r.targetId] && r.profileId === 'rigid' && r.extraStamina === 1 && [2, 3].includes(r.staminaCost) && fit.harnesses[I.lio]?.profileId === 'rigid', 'Rigid fit guard lost its paid extra effort.');
        } else if(r.kind === 'prepared_guard') {
            expected = ['kind', 'actorId', 'action', 'sequence', 'targetId', 'preparationCause', 'staminaCost', 'sourceId', 'sourceOrigin', 'sourceReceiptId'];
            const g = moduleOf(state)?.grip;
            A(r.actorId === 'player' && r.targetId === 'player' && r.staminaCost === 1 && r.sourceId === I.grip && r.sourceOrigin === 'trained' &&
                r.preparationCause === fit.gripPractice && g?.status === 'spent' && g.spentAction === r.action && g.spentSequence === r.sequence && g.sourceReceiptId === r.sourceReceiptId, 'Prepared self-guard lacks its unique actual spent receipt.');
        } else if(r.kind === 'maneuver') {
            expected = ['kind', 'actorId', 'action', 'sequence', 'maneuver', 'staminaCost', 'escapeGain', 'sourceId', 'sourceOrigin', 'sourceReceiptId', ...(r.maneuver === 'grip_rope' ? ['ropeKey', 'ropeConsumed', 'ropeReservationId'] : [])];
            A(r.actorId === 'player' && (r.maneuver === 'balance' ? r.staminaCost === 2 && r.escapeGain === 2 && r.sourceId === I.balance && r.sourceOrigin === 'inherited' :
                r.maneuver === 'grip_rope' && r.staminaCost === 1 && r.escapeGain === 1 && r.sourceId === I.grip && r.sourceOrigin === 'trained' && r.ropeKey === K.rope && r.ropeConsumed === false &&
                (r.ropeReservationId === null || r.ropeReservationId === `${session.id}:physical` && b.combatObjectives?.physical?.ropeKey === K.rope)) &&
                typeof r.sourceReceiptId === 'string' && r.sourceReceiptId.length > 0 && r.sourceReceiptId.length <= 120, 'Earned-body maneuver lost its paid effect and actual innate/trained source provenance.');
        } else {
            expected = ['kind', 'actorId', 'action', 'sequence', 'targetId', 'profileId', 'extraStaminaLoss'];
            A(r.actorId === I.hook && r.targetId === I.lio && r.profileId === 'flexible' && r.extraStaminaLoss === 0 && fit.harnesses[I.lio]?.profileId === 'flexible', 'Flexible fit resistance has no actual retained frame.');
        }
        A(Object.keys(r).sort().join(',') === expected.sort().join(','), 'Unsupported combat-fit receipt fields.');
        const parent = b.receipts?.find(p => p.action === r.action);
        if(parent) {
            A(parent.actorId === r.actorId && parent.nonce?.sequence + 1 === r.sequence && parent.combatFit?.some(p => same(p, r)), 'Combat-fit receipt is not bound to its actual native action nonce.');
            if(['fit_guard', 'prepared_guard'].includes(r.kind)) A(parent.type === 'guard' && parent.targets.includes(r.targetId), 'Combat-fit guard receipt belongs to another action.');
            if(r.kind === 'maneuver') A(parent.type === 'escape' && parent.targets.length === 0, 'Body maneuver must advance the actual escape.');
            if(r.kind === 'hook_resisted') A(parent.type === 'strike' && parent.technique === 'hook' && parent.outcomes?.some(o => o.targetId === r.targetId && o.kind === 'hit'), 'Flexible hook resistance must follow an actual landed native pole pull.');
        }
    }
}
