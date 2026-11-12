import {keeperProcedure as id, keeperProcedureWorld, keeperProcedureBay, procedureNets,
    keeperBeamCondensation as condensationId, keeperBeamPassage, beamCondensationMinutes, beamCondensationProfile,
    keeperBeamLink as linkId, beamLinkMinutes, keeperBeamRecord, keeperBeamRecordGate} from '../gu_keeper_procedure.js';
import {extensionFact} from '../structured_pack_extensions.js';
import {KEEPER_PREFIX, kId, kKey} from './book_gu_keeper.js';
import {giantHandForceSupportCost, giantHandPractice as giantTuning} from '../gu_giant_hand.js';
import {giantHandBracePath, giantHandFarBank, giantHandRecipe, giantHandRedDate, giantHandRefineMinutes, giantHandWardBank,
    giantHandYard, keeperGiantHand, keeperGiantHandVariants, keeperGiantHandWard} from '../gu_keeper_giant_hand.js';

const baseHash = 'sha256:7e51c59315a673fba1a3820aa2efb2244397facd2e2c4b42a518101a5c9d02ae';
const annex = kId('annex');
const eq = (fact, value = true, reason) => ({fact, op: 'eq', value, ...(reason && {reason})});
const all = (...rules) => ({all: rules});
const admitted = eq(extensionFact(id));
const ready = all(eq('actor.life', 'alive'), eq('native.ready'), eq('native.alive'),
    eq('body.ownerId', 'player'), eq('body.controllerId', 'player'));
const aperture = eq(`faculty.${kId('aperture')}.active`);
const holds = slot => eq(`claim.${kId(slot + '_title')}.owner`, 'player');
const can = (op, reason) => eq(`${id}.${op}`, true, reason);
const move = location => ({type: 'relocate', actor: 'player', location});

function command(operation, label, description, needs, effects, location = annex) {
    return {id: `${id}.${operation}`, revision: 1, label, description, duration: 0, group: 'structured_local',
        worldId: keeperProcedureWorld, location, actorId: 'player', audience: ['$actor'], visibleWhen: admitted,
        requires: all(ready, admitted, ...needs), costs: [], effects};
}

function loan(idPart, label, take) {
    const operation = `${take ? 'borrow' : 'return'}_${idPart}`;
    const fact = `${id}.holds_${idPart}`;
    return command(operation, `${take ? 'Borrow' : 'Return'} ${label}`, 'The steward keeps the loan Gu fed.',
        [eq(fact, !take)], [{type: 'fact', actor: 'player', scope: 'actor', key: fact, value: take}]);
}

function exercise(operation, label, description) {
    return command(operation, label, description, [aperture, can(operation)],
        [{type: 'guProcedure', actor: 'player', operation}]);
}

export const guKeeperBeamProcedure = {
    schema: 1, id, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Research a three-core move for the storeroom beam',
    description: 'Brace yourself, cut the old rope and catch the beam at the same instant. The steward has two Gu that can take the last role.',
    requires: all(ready, holds('moon'), holds('jade')),
    reason: 'Take in a Moonlight Gu and a White Jade Gu first.',
    locations: [{id: keeperProcedureBay, label: 'Storeroom beam bay', underRoof: true,
        description: 'The lowered beam leaves room to pass. A heavier shelf still holds a bundle of petals.'}],
    commands: [
        ...Object.entries(procedureNets).flatMap(([part, {label}]) => [loan(part, label, true), loan(part, label, false)]),
        exercise('research', 'Write down workable three-core moves', 'Compare the catch Gu you hold and the essence each move needs.'),
        exercise('try_1', 'Try written beam move 1', 'Pay for bracing first. Cutting and catching need to work together.'),
        exercise('try_2', 'Try written beam move 2', 'Pay for bracing first. Cutting and catching need to work together.'),
        command('enter', 'Enter the bay beneath the lowered beam', 'Go into the space cleared by the completed move.',
            [can('enter', 'Lower the beam first.')], [move(keeperProcedureBay)]),
        command('salvage', 'Collect the petals from the heavy shelf', 'Take four petals from the heavy shelf.',
            [can('salvage', 'Use the stronger catch to lower the heavy shelf.')],
            [{type: 'item', actor: 'player', key: kKey('petals'), amount: 4}], keeperProcedureBay),
        command('back', 'Return to the Gu house', 'Leave the beam bay.', [], [move(annex)], keeperProcedureBay),
    ],
};

export async function registerGuKeeperBeamProcedure(register, base) {
    if (register.bundledInstantExtension && base.contentHash === baseHash) {
        await register.bundledInstantExtension(guKeeperBeamProcedure, base);
        await register.bundledInstantExtension(guKeeperBeamCondensation, base);
        await register.bundledInstantExtension(guKeeperBeamLink, base);
        await register.bundledInstantExtension(guKeeperGiantHand, base);
        await register.bundledInstantExtension(guKeeperGiantHandWard, base);
        await register.bundledInstantExtension(guKeeperGiantHandVariants, base);
        await register.bundledInstantExtension(guKeeperBeamRecord, base);
    }
}

const condensationAdmission = eq(extensionFact(condensationId));
const canCondense = (operation, reason) => eq(`${condensationId}.${operation}`, true, reason);
const materials = beamCondensationProfile.recipe.stages[0].inputs;
function condensationCommand(operation, label, description, {needs = [], costs = [], effects, location = annex} = {}) {
    const action = command(operation, label, description, [], [], location);
    return {...action, id: `${condensationId}.${operation}`, visibleWhen: condensationAdmission,
        requires: all(ready, condensationAdmission, ...needs), costs,
        effects: effects ?? [{type: 'guProcedure', actor: 'player', operation}]};
}
const guKeeperBeamCondensation = {
    schema: 1, id: condensationId, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [id], requires: all(ready, canCondense('ready')),
    label: 'Refine a Gu from the practiced beam move',
    description: 'Use the notes from a successful rehearsal to make a Gu that can brace, cut and catch a light beam on its own.',
    reason: 'Finish a written beam move successfully.',
    locations: [{id: keeperBeamPassage, label: 'Narrow storeroom passage', underRoof: true,
        description: 'The light beam is seated in its catch. You can pass without disturbing the heavy shelf.'}],
    commands: [
        condensationCommand('prepare_beam_gu', 'Shape Beam Catch Gu · 2 petals, 1 stone',
            `Use the successful beam notes and let the shaped Gu settle for ${beamCondensationMinutes} minutes.`, {
                needs: [canCondense('prepare_beam_gu', 'Finish a written beam move successfully.'),
                    ...materials.map(({material, amount}) => ({fact: `item.${kKey(material)}`, op: 'gte', value: amount}))],
                costs: materials.map(({material, amount}) => ({type: 'item', actor: 'player', key: kKey(material), amount: -amount})),
            }),
        condensationCommand('cancel_beam_gu', 'Stop shaping Beam Catch Gu', 'The shaping has used the petals and stone.', {
            needs: [canCondense('cancel_beam_gu')],
        }),
        condensationCommand('finish_beam_gu', 'Finish Beam Catch Gu', 'Settle the living Gu and take it in.', {
            needs: [canCondense('finish_beam_gu', 'Let the shaping settle first.')],
        }),
        condensationCommand('use_beam_gu', `Lower the passage beam with Beam Catch · ${beamCondensationProfile.cost} essence`,
            'Use the finished Gu to clear the narrow passage in one activation.', {
                needs: [aperture, canCondense('use_beam_gu', 'Bring Beam Catch and enough essence.')],
            }),
        condensationCommand('test_heavy_gu', `Try Beam Catch on the heavy shelf · ${beamCondensationProfile.cost} essence`,
            'Test the same Gu on the heavier shelf. The test uses essence even if the shelf stays up.', {
                needs: [aperture, canCondense('test_heavy_gu', 'Bring Beam Catch and enough essence.')],
            }),
        condensationCommand('enter', 'Enter the narrow storeroom passage', 'Walk under the lowered beam.', {
            needs: [canCondense('enter', 'Lower the passage beam first.')], effects: [move(keeperBeamPassage)],
        }),
        condensationCommand('back', 'Return to the Gu house', 'Leave the passage.', {location: keeperBeamPassage, effects: [move(annex)]}),
    ],
};

const linkAdmission = eq(extensionFact(linkId));
const canLink = (operation, reason) => eq(`${linkId}.${operation}`, true, reason);
function linkCommand(operation, label, description, reason) {
    const action = command(operation, label, description, [], [{type: 'guProcedure', actor: 'player', operation}]);
    return {...action, id: `${linkId}.${operation}`, visibleWhen: linkAdmission,
        requires: all(ready, linkAdmission, aperture, canLink(operation, reason))};
}

const guKeeperBeamLink = {
    schema: 1, id: linkId, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    dependsOn: [condensationId], requires: all(ready, canLink('ready')),
    label: 'Pair Beam Catch with Woven Catch',
    description: 'Use Beam Catch to release the shelf, then let Woven Catch take its weight.',
    reason: 'Finish refining Beam Catch Gu.',
    commands: [
        linkCommand('prime_shelf', 'Release the heavy shelf with Beam Catch · 2 essence',
            `Beam Catch holds the released shelf for ${beamLinkMinutes} minutes. Borrow Woven Catch before you start.`,
            'Bring Beam Catch, borrow Woven Catch, and have two essence available.'),
        linkCommand('catch_shelf', 'Take the shelf’s weight with Woven Catch · up to 2 essence',
            'The support takes the load while Beam Catch holds it. If the hold is gone or the Gu is away, the attempt ends.',
            'Release the heavy shelf with Beam Catch first.'),
    ],
};

const recordAdmission = eq(extensionFact(keeperBeamRecord));
const recordCan = op => eq(`${keeperBeamRecord}.${op}`);
function recordCommand(op, label, description, needs, effects, location = annex) {
    return {...command(op, label, description, [], effects, location), id: `${keeperBeamRecord}.${op}`,
        visibleWhen: recordAdmission, requires: all(ready, recordAdmission, ...needs)};
}
const recordEffect = operation => ({type: 'guProcedure', actor: 'player', operation});
const guKeeperBeamRecord = {
    schema: 1, id: keeperBeamRecord, revision: 1, base: guKeeperBeamProcedure.base, dependsOn: [id],
    label: 'Keep a record of a successful beam move',
    description: 'Copy the Gu that worked together. Use the record to try the move on the side gate.',
    requires: ready, reason: 'Open the three-core beam research first.',
    locations: [{id: keeperBeamRecordGate, label: 'Side passage beyond the gate', underRoof: true,
        description: 'The gate beam has been lowered into its catch.'}],
    commands: [
        recordCommand('copy_beam', 'Copy the successful beam demonstration', 'Keep the actual Gu and the observed load in your notes.',
            [recordCan('copy_beam')], [recordEffect('copy_beam')]),
        recordCommand('replay_beam', 'Try the copied move on the side gate', 'Use the Gu named in the copy. The gate’s load can differ from practice.',
            [aperture, recordCan('replay_beam')], [recordEffect('replay_beam')]),
        recordCommand('remove_weight', 'Remove the spare counterweight', 'Lighten the gate beam before trying the copied move again.',
            [recordCan('remove_weight')], []),
        recordCommand('enter', 'Go through the lowered side gate', 'Use the passage the copied move opened.',
            [recordCan('enter')], [move(keeperBeamRecordGate)]),
        recordCommand('back', 'Return to the Gu house', '', [], [move(annex)], keeperBeamRecordGate),
    ],
};

const giantAdmission = eq(extensionFact(keeperGiantHand));
const giantFact = operation => eq(`${keeperGiantHand}.${operation}`);
const redDateId = `${keeperGiantHand}.red_date`;
const materialsId = `${keeperGiantHand}.practice_materials`;
const redDate = giantHandRedDate;
const giantMaterials = JSON.stringify({id: materialsId});
const countAtLeast = (key, value) => ({fact: `item.${key}`, op: 'gte', value});
const stock = (key, amount) => ({type: 'item', actor: 'player', key, amount});

function giantCommand(operation, label, description, {location = giantHandYard, needs = [giantFact(operation)], costs = [], effects} = {}) {
    const action = command(operation, label, description, [], [], location);
    return {...action, id: `${keeperGiantHand}.${operation}`, visibleWhen: giantAdmission,
        requires: all(ready, giantAdmission, ...needs), costs,
        effects: effects ?? [{type: 'guProcedure', actor: 'player', operation}]};
}

const guKeeperGiantHand = {
    schema: 1, id: keeperGiantHand, revision: 1, base: {id: KEEPER_PREFIX, revision: 1, contentHash: baseHash},
    label: 'Practice Myriad Self Giant Hand',
    description: 'A visiting refiner lends Gu for the older move and prepares a cloud-soil yard for testing.',
    requires: ready, reason: 'Visit the steward at the Gu house.',
    items: [{id: redDateId, label: 'Stored red date essence', value: 0, description: 'A rank-seven essence bead for the visiting refiner’s lesson.'},
        {id: materialsId, label: 'Myriad Self practice materials', value: 0,
            description: 'Mortal Gu and refinement materials packed by the visiting refiner.'}],
    locations: [{id: giantHandYard, label: 'Cloud-soil practice yard', underRoof: false,
        description: 'A cloud-soil slab blocks the far path. The visitor stands behind a ward.'},
    {id: giantHandFarBank, label: 'Far side of the cloud-soil yard', underRoof: false,
        description: 'A handprint in the broken slab leaves room for a footpath.'}],
    commands: [
        giantCommand('enter', 'Go to the cloud-soil practice yard', 'Meet the visiting refiner.', {location: annex, needs: [], effects: [move(giantHandYard)]}),
        giantCommand('back', 'Return to the Gu house', 'Leave the practice yard.', {needs: [], effects: [move(annex)]}),
        giantCommand('buy_red', 'Buy three red date beads · 1 stone', 'Use the visitor’s stored essence for the Immortal Gu.', {
            needs: [countAtLeast(kKey('stone'), 1)], costs: [stock(kKey('stone'), -1)], effects: [stock(redDate, 3)],
        }),
        giantCommand('buy_materials', 'Buy Myriad Self practice materials · 1 stone', 'Take the visitor’s packet of mortal Gu and refinement materials.', {
            needs: [countAtLeast(kKey('stone'), 1)], costs: [stock(kKey('stone'), -1)], effects: [stock(giantMaterials, 1)],
        }),
        giantCommand('borrow_older', 'Borrow Self Strength and its older supports', 'The visitor keeps this set of Gu fed.'),
        giantCommand('return_older', 'Return Self Strength and its older supports', 'The visitor takes back the first set.'),
        giantCommand('borrow_group', 'Borrow two Group Strength Gu', 'Use these mortal Gu to draw the phantoms into a hand.'),
        giantCommand('return_group', 'Return the Group Strength Gu', 'Without the pair you cannot gather the phantoms.'),
        giantCommand('prepare_phantoms', 'Prepare strength phantoms · 2 red date beads, 1 essence', 'The older move takes ten minutes of preparation. The phantoms hold for thirty minutes after that.', {
            needs: [aperture, giantFact('prepare_phantoms'), countAtLeast(redDate, giantTuning.oldBeads)], costs: [stock(redDate, -giantTuning.oldBeads)],
        }),
        giantCommand('release_phantoms', 'Gather the prepared phantoms into Giant Hand · up to 2 essence', 'The phantoms must still be present, and both Group Strength Gu must be at hand.', {
            needs: [aperture, giantFact('release_phantoms')],
        }),
        giantCommand('prepare_myriad', 'Begin refining Myriad Self · 1 packet, 2 petals', `Show the visitor the older move. Let the formation work for ${giantHandRefineMinutes} minutes.`, {
            needs: [giantFact('prepare_myriad'), ...giantHandRecipe.stages[0].inputs.map(({material, amount}) =>
                countAtLeast(material === 'practice_materials' ? giantMaterials : kKey(material), amount))],
            costs: giantHandRecipe.stages[0].inputs.map(({material, amount}) => stock(material === 'practice_materials' ? giantMaterials : kKey(material), -amount)),
        }),
        giantCommand('finish_myriad', 'Finish the rank-seven Myriad Self Gu', 'Take control of the living Gu when the formation is ready.'),
        giantCommand('cast_giant_hand', 'Use revised Giant Hand · 1 red date bead, 2 essence', 'Myriad Self makes the phantoms now. The two Group Strength Gu gather them as they form.', {
            needs: [aperture, giantFact('cast_giant_hand'), countAtLeast(redDate, giantTuning.newBeads)], costs: [stock(redDate, -giantTuning.newBeads)],
        }),
        giantCommand('reset_slab', 'Set a fresh slab in the yard', 'The refiner replaces the broken cloud-soil slab for another trial.'),
        giantCommand('cross', 'Walk through the shattered slab', 'Take the path opened by Giant Hand.', {needs: [giantFact('cross')], effects: [move(giantHandFarBank)]}),
        giantCommand('return_yard', 'Return to the practice yard', 'Follow the path back.', {location: giantHandFarBank, needs: [], effects: [move(giantHandYard)]}),
    ],
};

const wardAdmission = eq(extensionFact(keeperGiantHandWard));
const wardFact = operation => eq(`${keeperGiantHandWard}.${operation}`);
function wardCommand(operation, label, description, {location = giantHandYard, needs = [], costs = [], effects} = {}) {
    return {...command(operation, label, description, [], [], location), id: `${keeperGiantHandWard}.${operation}`,
        visibleWhen: wardAdmission, requires: all(ready, wardAdmission, ...needs), costs,
        effects: effects ?? [{type: 'guProcedure', actor: 'player', operation}]};
}

const guKeeperGiantHandWard = {
    schema: 1, id: keeperGiantHandWard, revision: 1, base: guKeeperGiantHand.base, dependsOn: [keeperGiantHand],
    label: 'Compare Giant Hand against the ward', description: 'The visitor has warded a second slab. Try a hand formed with more strength.',
    requires: all(ready, wardFact('ready')), reason: 'Finish the rank-seven Myriad Self Gu first.',
    locations: [{id: giantHandWardBank, label: 'Beyond the cloud-soil ward', underRoof: false,
        description: 'The ward has shattered along with the slab it guarded.'}],
    commands: [
        ...[false, true].map(reinforced => {
            const operation = reinforced ? 'ward_self' : 'ward_plain';
            const beads = giantTuning.newBeads + (reinforced ? giantHandForceSupportCost : 0);
            return wardCommand(operation, `Strike the ward ${reinforced ? 'with Self Strength · 2 beads' : 'with Giant Hand · 1 bead'}, 2 essence`,
                reinforced ? 'Let Self Strength reinforce the formed hand. The visitor’s plans show the expected force.' :
                    'Test the usual revised hand against the separate ward.', {
                    needs: [aperture, wardFact(operation), countAtLeast(redDate, beads)], costs: [stock(redDate, -beads)],
                });
        }),
        wardCommand('cross', 'Walk through the shattered ward', 'Follow the path that the ward protected.', {
            needs: [wardFact('cross')], effects: [move(giantHandWardBank)],
        }),
        wardCommand('return_yard', 'Return to the practice yard', 'Take the path back to the refiner.', {
            location: giantHandWardBank, effects: [move(giantHandYard)],
        }),
    ],
};

const variantAdmission = eq(extensionFact(keeperGiantHandVariants));
const variantFact = (operation, reason) => eq(`${keeperGiantHandVariants}.${operation}`, true, reason);
function variantCommand(operation, label, description, {location = giantHandYard, needs = [variantFact(operation)], costs = [], effects} = {}) {
    return {...command(operation, label, description, [], [], location), id: `${keeperGiantHandVariants}.${operation}`,
        visibleWhen: variantAdmission, requires: all(ready, variantAdmission, ...needs), costs,
        effects: effects ?? [{type: 'guProcedure', actor: 'player', operation}]};
}

const guKeeperGiantHandVariants = {
    schema: 1, id: keeperGiantHandVariants, revision: 1, base: guKeeperGiantHand.base, dependsOn: [keeperGiantHand],
    label: 'Compare individual Group Strength Gu',
    description: 'The refiner offers a third Group Strength Gu with a stronger pull. Write down which pair you will use on the braced slab.',
    requires: all(ready, variantFact('ready')), reason: 'Finish the rank-seven Myriad Self Gu first.',
    locations: [{id: giantHandBracePath, label: 'Covered path behind the braced slab', underRoof: true,
        description: 'The lifted brace has fallen clear of the path.'}],
    commands: [
        variantCommand('borrow_focused', 'Borrow the focused Group Strength Gu', 'This specimen can gather more strength. It also draws more essence.'),
        variantCommand('return_focused', 'Return the focused Group Strength Gu', 'Leave the specimen with the refiner. Its place in your notes stays marked.'),
        variantCommand('write_plain', 'Write a plan with the two usual Gu', 'Bind the first and second Group Strength Gu to separate roles.'),
        variantCommand('write_focused_first', 'Write a plan with the focused Gu and the first Gu', 'Bind the focused specimen beside the first of the usual loans.'),
        variantCommand('write_focused_second', 'Write a plan with the focused Gu and the second Gu', 'Bind the focused specimen beside the second of the usual loans.'),
        variantCommand('cast_written', 'Strike the braced slab with the written plan · 1 red date bead',
            'Use the two exact Gu from your notes. The quote shows their primeval essence cost.', {
                needs: [aperture, variantFact('cast_written', 'Write a plan and bring the same Gu and enough essence.'),
                    countAtLeast(redDate, giantTuning.newBeads)], costs: [stock(redDate, -giantTuning.newBeads)],
            }),
        variantCommand('cross', 'Follow the covered path', 'Pass through the opening behind the braced slab.', {effects: [move(giantHandBracePath)]}),
        variantCommand('return_yard', 'Return to the practice yard', 'Take the footpath back.', {
            location: giantHandBracePath, needs: [], effects: [move(giantHandYard)],
        }),
    ],
};
