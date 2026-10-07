// Original reversible P1 proposal. Pure definitions reuse the existing resin
// route; importing this module enrolls no plan, stock, worker or timer.
import {REFERENCE_GAMEPLAY_IDS as R, REFERENCE_GAMEPLAY_KEYS as K} from './reference_gameplay_content.js';

export const AUDITED_KIT_RESERVE_IDS = Object.freeze({
    plan: 'audited_kit_reserve.resin_plan', command: 'reference_gameplay.resin_kits',
    origin: R.open, world: R.world, location: 'Village', site: R.site,
});
export const AUDITED_KIT_RESERVE_POLICY = Object.freeze({version: 1, key: K.kit,
    upper: 4, lower: 2, batchOutput: 2, maxAcceptedBatches: 3});
export const AUDITED_KIT_RESERVE_TERMS = Object.freeze({commandRevision: 1, duration: 3,
    resinKey: K.resin, resinCount: 1, soundKey: K.sound, soundCount: 2, stamina: 1,
    text: 'Resin route: 1 Set repair resin + 2 Sound repair staves + 1 stamina + 3 played minutes → 2 Prepared survey kits.'});

export const planDefinitions = [{id: AUDITED_KIT_RESERVE_IDS.plan, revision: 1,
    label: 'Eda’s finite survey-kit reserve', actorId: 'player', origin: R.open,
    visibleWhen: {fact: 'auditedKitReserve.opened', op: 'eq', value: true},
    requires: {fact: 'auditedKitReserve.supported', op: 'eq', value: true,
        reason: 'Return to Eda’s Village bench with your living native body, usable hands and supported local clock.'},
    stockPolicy: {...AUDITED_KIT_RESERVE_POLICY},
    steps: Array.from({length: 3}, (_, index) => ({id: `resin_batch_${index + 1}`, kind: 'command',
        commandId: AUDITED_KIT_RESERVE_IDS.command, revision: 1}))}];
export const auditedKitReservePlanDefinitions = planDefinitions;
