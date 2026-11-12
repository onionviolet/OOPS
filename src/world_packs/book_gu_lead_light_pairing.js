import {littleLightMoonblade, littleLightSupport, moonlightBlade} from '../gu_ability_profiles.js';
import {resolveGuActivation} from '../gu_activation.js';
import {bindGuMove} from '../gu_move_roles.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {GU_LEAD, riLeadId as id} from './book_gu_lead_life.js';
import {GU_LEAD_SECOND_GU} from './book_gu_lead_second_gu.js';
import {GU_LEAD_VITAL} from './book_gu_lead_vital.js';

const extensionId = id('light_pairing');
const key = name => `${extensionId}.${name}`;
const baseHash = 'sha256:9efca86558d35ae4ca0bce01755dd50761bf4c3aee82d1cd72d8b72d50f2001c';
const academy = id('academy');
const energyId = id('primeval');
const eq = (fact, value = true) => ({fact, op: 'eq', value});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(extensionId));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'), eq('body.mobile'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'), eq(`faculty.${id('aperture')}.active`));
const hasMoonlight = eq(`actor.${GU_LEAD_VITAL}.moonlight_form`, 'forehead');
const hasLittleLight = {fact: `item.${JSON.stringify({id: `${GU_LEAD_SECOND_GU}.little_light`})}`, op: 'gte', value: 1};
const stage = (kind, ability) => ({gu: {id: kind, kind, fedThrough: 0}, operator: 'player', ability});
const moonlight = stage('moonlight', moonlightBlade);
const available = [moonlight, stage('little-light', littleLightSupport)];
const [pairing] = bindGuMove(littleLightMoonblade, available);

function practice(name, label, targetDistance, stages, holdings) {
    const quote = resolveGuActivation({stages, reserves: {player: {primeval: 44}}, day: 0});
    const spent = quote.activations.reduce((total, activation) => total + activation.cost, 0);
    const reaches = quote.effects.some(effect => effect.kind === 'damage' && effect.range >= targetDistance);
    const support = all(ready, admitted, ...holdings);
    return {
        id: key(name), revision: 1, label, duration: 5, group: 'structured_local',
        worldId: id('world'), location: academy, actorId: 'player', audience: ['$actor'],
        visibleWhen: admitted,
        requires: {...all(support, {fact: `energy.${energyId}.reserve`, op: 'gte', value: spent}),
            reason: 'Bring the refined Gu and enough essence for the throw.'},
        completionRequires: support, completionCoLocated: true, completionFailure: 'refund',
        cancellation: 'refund', reservationReturns: 1,
        costs: [{type: 'energy', actor: 'player', energyId, operation: 'use', output: spent, control: 1}],
        effects: [
            {type: 'fact', scope: 'actor', actor: 'player', key: key('far_target_cut'), value: reaches},
            {type: 'knowledge', actor: 'player', key: key('result'), stage: 'understood', value: reaches
                ? 'The star brightens the crescent. The blade reaches the far straw target and cuts through it.'
                : 'The crescent fades before it reaches the far straw target.'},
        ],
    };
}

export const guLeadLightPairing = {
    schema: 1, id: extensionId, revision: 1, base: {id: GU_LEAD, revision: 1, contentHash: baseHash},
    label: 'Practice the Moonlight and Little Light pairing',
    description: 'Try both throws from the same mark and see which crescent reaches the far straw target.',
    requires: all(ready, hasMoonlight, hasLittleLight, eq(`completed.${GU_LEAD_SECOND_GU}.refine_little_light`)),
    reason: 'Refine your Little Light Gu and keep both Gu to practice the pairing.',
    status: [{id: key('result_status'), label: 'Far straw target', knowledgeKey: key('result')}],
    commands: [
        practice('solo', 'Throw a Moonblade at the far target', 2, [moonlight], [hasMoonlight]),
        practice('paired', 'Throw a Moonblade with Little Light', 2, pairing.stages, [hasMoonlight, hasLittleLight]),
    ],
};

export async function registerGuLeadLightPairing(register, base) {
    if (register.extension && base.contentHash === baseHash &&
        base.extensions?.some(extension => extension.id === GU_LEAD_SECOND_GU)) {
        await register.extension(guLeadLightPairing, base);
    }
}
