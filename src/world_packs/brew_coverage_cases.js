// PC95 case data. Each case starts with finite stock or a measured prepared
// dose, then uses the generic runner's shared brewing and delivery laws.
import {BREW_LAW, BREW_PUBLISHES, brewMethod} from '../brew_law.js';
import {defineSeparationLaw} from '../craft_process_separation.js';
import {THERMAL_REVISION} from '../craft_process_thermal.js';
import {brewAssayMethod, brewLotAssayMethod, brewPanelAssayMethod, brewScentMethod, brewStripQuantity} from '../brew_assay.js';
import {brewCoatingMethod, brewDoseMethod} from '../brew_dose_delivery.js';
import {brewDoseQuantity, brewFilmQuantity, brewMeasureQuantity} from '../engine_brew_stock.js';
import {blendedAntidoteRecipe, commonPoisonAntidote, confusingConcoction, cureForBoilsTrial, draughtOfLivingDeathRecipe, draughtOfPeaceMethod,
    felixMaturation, FELIX_STEW_MINUTES, polyjuiceBase, polyjuiceGradeMinutes, POLYJUICE_BASES, POLYJUICE_STEW,
    forgetfulnessPotion, shrinkingSolution, silverAndDittany, strengtheningSolution, STRENGTHENING_REST} from './hp_brew_pack.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';
import {residueQuantity} from '../world_substrate_packs/residue_flow.js';
import {grazeOp} from '../world_substrate_packs/living_residue.js';
import {BREW_SURFACE_CONTACT} from '../world_substrate_packs/brew_splash.js';
import {livingBodyState} from '../world_substrate_packs/living_body.js';
import {KNOWLEDGE_LAW, KNOWLEDGE_PACK, defineRecord} from '../knowledge_record.js';
import {lotmBrewRow, lotmLots} from './lotm_brew_pack.js';

const ref = (kind, id = kind) => ({kind, id});
const flask = ref('flask');
const recipient = ref('body', 'recipient');
const part = (holder, name, direction, to) => ({holder, quantity: brewDoseQuantity(name), direction, to});
const property = (property, direction, to) => ({holder: recipient.id, property, direction, to});
const restore = id => ({id, restore: true});
const sleep = (part, minimum, minutes) => ({part, minimum, sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
    details: {minutes, mind: {faculty: 'awareness'}}});

function serving(id, route, responses, at, measured, effect, recovery) {
    return [
        {id: 'serve', working: {family: 'brew-dose', method: brewDoseMethod({id, route, responses}), bindings: {flask, recipient}}},
        restore('restore-pending-serving'),
        {id: 'settle-serving', advanceTo: at + 2, expect: [part('flask', measured.name, 'down', 0),
            part(recipient.id, measured.name, measured.amount ? 'up' : 'unchanged', measured.amount), ...effect]},
        restore('restore-served'),
        ...(recovery ? [{id: 'recover', advanceTo: at + 2 + recovery.minutes, expect: recovery.expect}] : []),
    ];
}

function stocked({lots = {}, vessel = {id: 'cauldron'}, method, initial = {}, target = {},
    measured, route, responses = [], effect = [], recovery}) {
    const place = 'bench';
    const things = {[`vessel:${vessel.id}`]: vessel};
    const bindings = {vessel: ref('vessel', vessel.id), flask};
    const holders = [{id: place, kind: 'place'}, {id: vessel.id, kind: 'thing', as: ['vessel'], place},
        {id: flask.id, kind: 'thing', as: ['flask'], place,
            quantities: Object.fromEntries(Object.entries(initial).map(([name, amount]) => [brewDoseQuantity(name), amount]))},
        {id: recipient.id, kind: 'body', place, properties: {mind_awake: true, mind_mood: 10, mind_confusion: 0, ...target}},
    ];
    const debits = [];
    for (const [slot, {id, amount, properties, ...data}] of Object.entries(lots)) {
        holders.push({id, kind: 'thing', as: ['lot'], place, quantities: {[brewMeasureQuantity]: amount}});
        things[`lot:${id}`] = {...data, properties: {constituents: properties}};
        bindings[slot] = ref('lot', id);
        debits.push({holder: id, quantity: brewMeasureQuantity, direction: 'down', to: 0});
    }
    const timeline = [];
    let at = 0;
    if (method) {
        at = method.steps.reduce((n, step) => n + (step.minutes ?? 0), 0);
        timeline.push({id: 'brew', working: {family: 'brew', method, bindings}}, restore('restore-running-brew'),
            {id: 'bottled', advanceTo: at, expect: [part('flask', measured.name, 'up', measured.amount)]}, restore('restore-bottled'));
    }
    if (route) timeline.push(...serving(`${method?.id ?? measured.name}.serve`, route, responses, at, measured, effect, recovery));
    return {basis: 'authored', engine: {packs: ['a.mind'], host: {things}, shared: {effectKinds: BREW_PUBLISHES}}, world: {holders}, timeline,
        expect: [...debits, part(route ? recipient.id : flask.id, measured.name, 'up', measured.amount)]};
}

// HPPE020/021. A prepared base is divided before the hair is admitted.
// Each recipient is resolved from the donor encoded by the delivered sample.
export function polyjuiceCase({donor = 'goyle', stewMinutes = POLYJUICE_STEW.ready, fullMoon = true} = {}) {
    const {lots, method} = polyjuiceBase({stewMinutes, fullMoon});
    lots.sample = {id: 'hair', material: 'hair', amount: 1, properties: {}, donor};
    const responses = Object.entries(POLYJUICE_BASES).flatMap(([grade, part]) =>
        [['goyle', 'goyle'], ['crabbe', 'crabbe'], ['cat', 'cat-features']].map(([id, form]) => ({
            part: `sample:${id}`, minimum: 1, route: 'oral', requires: [{part, minimum: 6}],
            temporaryForm: {form, minutes: polyjuiceGradeMinutes(grade) * (id === 'cat' ? 2 : 1), priority: 2},
        })));
    const grade = !fullMoon || stewMinutes < POLYJUICE_STEW.near ? null :
        stewMinutes < POLYJUICE_STEW.ready ? 'near' : 'ready';
    const form = donor === 'cat' ? 'cat-features' : donor;
    const minutes = grade ? polyjuiceGradeMinutes(grade) * (donor === 'cat' ? 2 : 1) : 0;
    const layers = 'temporary-form-layers';
    const data = stocked({lots, method, measured: {name: `sample:${donor}`, amount: 1}, route: 'oral', target: {form: 'original'},
        responses, effect: [minutes ? property(layers, 'changed', [`${form}|2|${stewMinutes + 4 + minutes}`]) :
            property(layers, 'unchanged', null)],
        recovery: minutes ? {minutes, expect: [property(layers, 'changed', null), property('form', 'unchanged', 'original')]} : undefined});
    data.engine.packs.push('l.creature_form');
    data.world.holders.push({id: 'base-control', kind: 'thing', as: ['flask'], place: 'bench'});
    data.timeline[0].working.bindings.control = ref('flask', 'base-control');
    data.timeline.splice(2, 0, {id: 'mid-stew', advanceTo: Math.floor(stewMinutes / 2), expect: [
        part('flask', 'polyjuice-base', 'unchanged', 0)]}, restore('restore-stewing'),
        {id: 'divide-base', advanceTo: stewMinutes + 1, expect: [
            {holder: 'hair', quantity: brewMeasureQuantity, direction: 'unchanged', to: 1}]}, restore('restore-separated-base'));
    if (minutes) data.timeline.splice(-1, 0, {id: 'before-expiry', advanceTo: stewMinutes + 3 + minutes,
        expect: [property(layers, 'unchanged', [`${form}|2|${stewMinutes + 4 + minutes}`])]});
    data.expect.push(property('form', 'unchanged', 'original'), property(layers, 'unchanged', null),
        ...Object.entries(POLYJUICE_BASES).map(([key, name]) => grade === key ?
            part('base-control', name, 'up', 6) : part('base-control', name, 'unchanged', 0)),
        part('base-control', `sample:${donor}`, 'unchanged', 0));
    return data;
}

// HPPE184. The companion source identifies the pair. The amount, duration
// and laughter as the observable symptom are local modeling choices.
export function alihotsyAntidoteCase({route = 'oral', smallDose = false, hold = 'alihotsy.exposure', reserveSample = false} = {}) {
    const amount = smallDose ? 2 : 5;
    const leaf = 'alihotsy', antidote = 'treacle';
    const lots = {
        leaf: {id: 'leaf', material: leaf, amount: reserveSample ? 16 : 8, properties: {[leaf]: 500}},
        treacle: {id: 'treacle', material: antidote, amount: 5, properties: {[antidote]: 800}},
    };
    const method = brewMethod({id: 'hp.brew.alihotsy', slots: [{id: 'leaf'}], process: [
        {op: 'divide', minutes: 1, options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    const data = stocked({lots: {leaf: lots.leaf}, method, measured: {name: leaf, amount: reserveSample ? 8 : 4}, route: 'oral',
        target: {mind_laughing: false}, responses: [{part: leaf, minimum: 4,
            sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
            details: {working: 'alihotsy.exposure', minutes: 12, mind: {faculty: 'laughter', disruptSpeech: false}}}],
        effect: [property('mind_laughing', 'changed', true)]});
    if (reserveSample) {
        data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.amount = 8;
        data.timeline.find(step => step.id === 'settle-serving').expect.splice(0, 2,
            part(flask.id, leaf, 'down', 4), part(recipient.id, leaf, 'up', 4));
        data.expect[data.expect.length - 1] = part(recipient.id, leaf, 'up', 4);
    }
    const lot = lots.treacle;
    const cup = ref('flask', 'remedy');
    data.world.holders.push({id: lot.id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: lot.amount}},
        {id: cup.id, kind: 'thing', as: ['flask'], place: 'bench'});
    data.engine.host.things[`lot:${lot.id}`] = {material: lot.material, properties: {constituents: lot.properties}};
    const remedy = brewMethod({id: 'hp.brew.treacle', slots: [{id: 'treacle'}], process: [
        {op: 'divide', minutes: 1, options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    const relieved = route === 'oral' && !smallDose && hold === 'alihotsy.exposure';
    const given = smallDose ? 2 : 4;
    data.timeline.push(
        {id: 'brew-remedy', working: {family: 'brew', method: remedy,
            bindings: {vessel: ref('vessel', 'cauldron'), treacle: ref('lot', 'treacle'), flask: cup}}},
        {id: 'bottle-remedy', advanceTo: 4, expect: [part(cup.id, antidote, 'up', 4)]},
        {id: 'administer-remedy', working: {family: 'brew-dose', method: brewDoseMethod({id: 'hp.serve.treacle', route, amount,
            responses: [{part: antidote, route: 'oral', minimum: 4, sentence: {verb: 'end', object: 'working', time: 'instant'},
                details: {working: hold}}]}), bindings: {flask: cup, recipient}}},
        restore('restore-pending-treatment'),
        {id: 'treatment', advanceTo: 6, expect: [part(cup.id, antidote, 'down', 4 - given),
            part(recipient.id, antidote, 'up', given), property('mind_laughing', relieved ? 'changed' : 'unchanged', !relieved)]},
        restore('restore-treated'),
        {id: 'after-treatment', advanceTo: 7, expect: [property('mind_laughing', 'unchanged', !relieved)]});
    data.expect.push({holder: lot.id, quantity: brewMeasureQuantity, direction: 'down', to: 0},
        part(recipient.id, antidote, 'up', given));
    return data;
}

// The spell and treacle pairing come from separate sources. Their combination
// here exercises the handoff from an observed ingredient to a physical remedy.
export function identifiedAntidoteCase({observer = 'healer', concealed = false, removeRemedy = false, panelResolution} = {}) {
    const data = alihotsyAntidoteCase({reserveSample: true});
    data.engine.packs.push('n.knowledge');
    data.engine.shared.properties = [
        ...Object.values(WORLD_PROPERTIES),
        {id: 'antidote_for', type: 'label'},
    ];
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 5}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    data.world.holders.push({id: 'hall', kind: 'place'},
        {id: 'healer', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}, quantities: {stamina: 5}},
        {id: 'witness', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}},
        {id: 'wand', kind: 'thing', place: 'bench', properties: {marks: ['grip:healer']}},
        {id: 'other-remedy', kind: 'thing', as: ['flask'], place: 'bench', properties: {antidote_for: 'mint'},
            quantities: {[brewDoseQuantity('other-remedy')]: 5}});
    const sample = data.world.holders.find(holder => holder.id === flask.id);
    sample.as.push('object');
    if (concealed) sample.properties = {concealed: ['composition']};
    data.world.holders.find(holder => holder.id === 'remedy').properties = {antidote_for: 'alihotsy'};
    const at = data.timeline.findIndex(step => step.id === 'administer-remedy');
    const treatment = data.timeline[at].working;
    treatment.family = 'brew-dose-from-identification';
    treatment.request = {observer, sample: flask.id, candidates: ['other-remedy', 'remedy']};
    delete treatment.bindings.flask;
    data.timeline.splice(at, 0,
        {id: 'inspect-exposure', working: {family: 'spell', payer: 'healer', spells: [{
            sentence: {verb: 'sense', object: 'composition', target: 'object', time: 'instant', cost: 'stamina'},
            target: {kind: 'flask', id: flask.id}, grip: {caster: 'healer', implement: 'wand'}, inspectComposition: 'dose',
            requiresSpeech: true, minutes: 1, details: {cost: 1},
        }]}},
        restore('restore-pending-identification'),
        {id: 'identify-exposure', advanceTo: 5, expect: [
            {holder: 'healer', property: 'mind_memory', direction: concealed ? 'unchanged' : 'changed',
                to: concealed ? [] : [brewDoseQuantity('alihotsy'), brewDoseQuantity('alihotsy:matrix')]
                    .map(quantity => `assay:flask:5:${quantity}`).sort()},
            {holder: 'healer', quantity: 'stamina', direction: 'down', to: 4}]},
        restore('restore-identification'),
        ...(removeRemedy ? [{id: 'move-remedy', ops: [{op: 'move', holder: 'remedy', to: 'hall'}]}] : []));
    data.timeline.find(step => step.id === 'treatment').advanceTo = 7;
    data.timeline.find(step => step.id === 'after-treatment').advanceTo = 8;
    data.expect.push({holder: 'witness', property: 'mind_memory', direction: 'unchanged', to: []},
        part('other-remedy', 'other-remedy', 'unchanged', 5), part(flask.id, 'alihotsy', 'up', 4));
    if (panelResolution !== undefined) {
        const kit = ref('instrument', 'treacle-assay-kit');
        data.engine.shared.properties.push({id: 'assay_parts', type: 'set'}, {id: 'assay_quantitative_only', type: 'flag'});
        data.world.holders.push({id: kit.id, kind: 'thing', as: [kit.kind], place: 'bench',
            properties: {assay_parts: ['alihotsy'], assay_quantitative_only: true}, quantities: {[brewStripQuantity]: 1}});
        const paid = {holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: 0};
        data.timeline.splice(at, 4,
            {id: 'assay-exposure', working: {family: 'brew-assay',
                method: brewPanelAssayMethod({id: 'alihotsy-panel', parts: ['alihotsy'], resolution: panelResolution}),
                bindings: {flask, instrument: kit, observer: ref('body', 'healer')}}},
            restore('restore-pending-exposure-assay'),
            {id: 'read-exposure-panel', advanceTo: 6, expect: [paid]}, restore('restore-exposure-panel'));
        data.timeline.find(step => step.id === 'treatment').advanceTo = 8;
        data.timeline.find(step => step.id === 'after-treatment').advanceTo = 9;
        data.expect.push(paid);
    }
    return data;
}

// HPPE024/025. Each body holder here represents an exposed part. The
// classroom preparations, measures and duration are authored.
export function swellingCase({treat = true, remedyRoute = 'oral'} = {}) {
    const exposure = 'swelling-serving', remedy = 'deflating-serving';
    const layers = 'temporary-form-layers';
    const secondary = 'other-form|1|20';
    const swollen = 'swollen|2|12';
    const data = stocked({initial: {[exposure]: 1}, measured: {name: exposure, amount: 1}, route: 'topical',
        target: {form: 'ordinary', [layers]: [secondary]},
        responses: [{part: exposure, minimum: 1, route: 'topical',
            temporaryForm: {form: 'swollen', priority: 2, minutes: 10}}],
        effect: [property(layers, 'changed', [secondary, swollen])]});
    data.engine.packs.push('l.creature_form');
    data.world.holders.push({id: 'other-part', kind: 'body', place: 'bench', properties: {form: 'ordinary'}});
    data.expect.push({holder: 'other-part', property: layers, direction: 'unchanged', to: null},
        property('form', 'unchanged', 'ordinary'));
    if (!treat) {
        data.expect.push(property(layers, 'changed', [secondary, swollen]));
        return data;
    }
    const cup = ref('flask', 'deflating-flask');
    data.world.holders.push({id: cup.id, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[brewDoseQuantity(remedy)]: 1}});
    const cleared = remedyRoute === 'oral';
    data.timeline.push(
        {id: 'administer-deflating', working: {family: 'brew-dose', bindings: {flask: cup, recipient},
            method: brewDoseMethod({id: 'hp.serve.deflating', route: remedyRoute,
                responses: [{part: remedy, minimum: 1, route: 'oral', clearTemporaryForm: 'swollen'}]})}},
        restore('restore-pending-deflation'),
        {id: 'deflate', advanceTo: 4, expect: [part(cup.id, remedy, 'down', 0), part(recipient.id, remedy, 'up', 1),
            property(layers, cleared ? 'changed' : 'unchanged', cleared ? [secondary] : [secondary, swollen])]},
        restore('restore-deflated'),
        {id: 'after-swelling', advanceTo: 12, expect: [
            property(layers, cleared ? 'unchanged' : 'changed', [secondary])]},
    );
    data.expect.push(part(recipient.id, remedy, 'up', 1), property(layers, 'unchanged', [secondary]));
    return data;
}

// HPPE024 shows one disturbed batch splashing several exposed pupils.
export function swellingSplashCase({withdraw = false} = {}) {
    const active = 'swelling-serving';
    const layers = 'temporary-form-layers';
    const data = stocked({initial: {[active]: 12}, measured: {name: active, amount: 12}});
    data.engine.packs.push('l.creature_form', 'b.splash', 'w.residue_flow');
    data.engine.settings = {'b.splash': {uptakePermille: 500, response: {part: active,
        minimum: 3, form: 'swollen', priority: 2, minutes: 10}}};
    data.world.holders.find(holder => holder.id === recipient.id).tags = ['splash-exposed'];
    data.world.holders.push({id: 'hall', kind: 'place'},
        {id: 'drain', kind: 'place', quantities: {[residueQuantity(active)]: 0}},
        {id: 'second-part', kind: 'body', place: 'bench', tags: ['splash-exposed']},
        {id: 'covered-part', kind: 'body', place: 'bench', tags: ['splash-exposed', 'splash-covered']},
        {id: 'bystander', kind: 'body', place: 'bench'});
    data.world.links = [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}];
    const layer = (holder, direction, to) => ({holder, property: layers, direction, to});
    const targets = withdraw ? [recipient.id] : [recipient.id, 'second-part'];
    const excluded = ['covered-part', 'bystander', ...(withdraw ? ['second-part'] : [])];
    const material = [part(flask.id, active, 'down', 0),
        ...targets.map(id => part(id, active, 'up', 6 / targets.length)),
        ...excluded.map(id => part(id, active, 'unchanged', 0)),
        {holder: 'drain', quantity: residueQuantity(active), direction: 'up', to: 6}];
    data.timeline = [
        {id: 'disperse', working: {family: 'brew', bindings: {flask},
            method: {id: 'hp.brew.disperse-swelling', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask'},
                steps: [{op: 'spill-flask', bindings: {flask: 'flask'}, minutes: 2, options: {splash: true}}]}}},
        {id: 'before-splash', advanceTo: 1}, restore('restore-pending-splash'),
        ...(withdraw ? [{id: 'withdraw', ops: [{op: 'move', holder: 'second-part', to: 'hall'}]}] : []),
        {id: 'splash', advanceTo: 2, expect: [...material, ...targets.map(id => layer(id, 'changed', ['swollen|2|12'])),
            ...excluded.map(id => layer(id, 'unchanged', null))]},
        restore('restore-splash'),
        {id: 'lapse', advanceTo: 12, expect: targets.map(id => layer(id, 'changed', null))},
    ];
    data.expect = [...material, ...targets.map(id => layer(id, 'unchanged', null))];
    return data;
}

export function swellingSurfaceCase({covered = false} = {}) {
    const data = swellingSplashCase({withdraw: true});
    const settings = data.engine.settings['b.splash'];
    settings.surfaceTransferPermille = 500;
    data.engine.shared.effectKinds = [...BREW_PUBLISHES, BREW_SURFACE_CONTACT];
    const active = settings.response.part;
    const quantity = residueQuantity(active);
    const second = data.world.holders.find(holder => holder.id === 'second-part');
    if (covered) second.tags.push('splash-covered');
    const surface = (holder, direction, to) => ({holder, quantity, direction, to});
    const coat = data.timeline.find(step => step.id === 'splash');
    const stockQuantity = brewDoseQuantity(active);
    for (const check of [...coat.expect, ...data.expect]) {
        if (check.quantity === stockQuantity && check.holder !== flask.id) check.quantity = quantity;
    }
    data.expect = data.expect.filter(check => check.quantity !== quantity || check.holder === 'drain');
    const layers = 'temporary-form-layers';
    const first = recipient.id;
    data.timeline.splice(-1, 1,
        {id: 'return-for-contact', ops: [{op: 'move', holder: second.id, to: 'bench'}]},
        {id: 'contact-time', advanceTo: 3}, restore('restore-wet-surface'),
        {id: 'touch', ops: [{op: 'publish', kind: BREW_SURFACE_CONTACT, place: 'bench',
            detail: {from: first, target: second.id}}],
        expect: [surface(first, covered ? 'unchanged' : 'down', covered ? 6 : 3),
            surface(second.id, covered ? 'unchanged' : 'up', covered ? 0 : 3),
            {holder: second.id, property: layers, direction: covered ? 'unchanged' : 'changed',
                to: covered ? null : ['swollen|2|13']}]},
        restore('restore-secondary-contact'),
        {id: 'first-lapse', advanceTo: 12, expect: [property(layers, 'changed', null),
            {holder: second.id, property: layers, direction: 'unchanged', to: covered ? null : ['swollen|2|13']}]},
        {id: 'second-lapse', advanceTo: 13, expect: [
            {holder: second.id, property: layers, direction: covered ? 'unchanged' : 'changed', to: null}]},
    );
    data.expect.push(surface(first, 'up', covered ? 6 : 3),
        surface(second.id, covered ? 'unchanged' : 'up', covered ? 0 : 3));
    return data;
}

export function washedSplashCase({short = false} = {}) {
    const data = swellingSurfaceCase({covered: true});
    const active = data.engine.settings['b.splash'].response.part;
    const quantity = residueQuantity(active), water = residueQuantity('water');
    const drain = data.world.holders.find(holder => holder.id === 'drain');
    drain.quantities[water] = 0;
    data.world.holders.push({id: 'wash-water', kind: 'thing', as: ['lot'], place: 'bench',
        quantities: {[brewMeasureQuantity]: short ? 2 : 3}});
    data.engine.host.things['lot:wash-water'] = {material: 'water'};
    const second = data.world.holders.find(holder => holder.id === 'second-part');
    second.tags = ['splash-exposed'];
    const wash = data.timeline.findIndex(step => step.id === 'touch');
    const checks = [
        {holder: recipient.id, quantity, direction: 'down', to: 0},
        {holder: 'drain', quantity, direction: 'up', to: 12},
        {holder: 'drain', quantity: water, direction: 'up', to: 3},
        {holder: 'wash-water', quantity: brewMeasureQuantity, direction: 'down', to: 0},
    ];
    data.timeline.splice(wash, 0, {id: 'wash', working: {family: 'brew',
        bindings: {target: recipient, solvent: ref('lot', 'wash-water')},
        method: {id: 'trial.surface-rinse', revision: 1, law: BREW_LAW.ref, roles: {target: 'body', solvent: 'lot'},
            steps: [{op: 'rinse-surface', minutes: 1, bindings: {target: 'target', solvent: 'solvent'},
                options: {part: active, amount: 3, removalPerUnit: 2}}]}}},
    restore('restore-pending-wash'), {id: 'washed', advanceTo: 4, expect: checks}, restore('restore-washed'));
    data.timeline.find(step => step.id === 'touch').expect[0].to = 0;
    data.expect = data.expect.filter(check => check.quantity !== quantity || check.holder === second.id);
    data.expect.push(...checks.slice(1), {holder: recipient.id, quantity, direction: 'unchanged', to: 0});
    return data;
}

// HPPE131 supplies the failed scrub. The loose dirt control and solvent
// affinities are authored so the same operation can distinguish two deposits.
export function messRemoverCase({diluted = false} = {}) {
    const cleaner = 'mess-remover', dirt = 'loose-dirt', writing = 'wall-writing';
    const residue = (holder, part, direction, to) => ({holder, quantity: residueQuantity(part), direction, to});
    const soil = diluted ? 3 : 0;
    const scrub = (id, part, solventPart, at, expect) => [
        {id, working: {family: 'brew', bindings: {target: ref('thing', 'wall'), solvent: ref('lot', 'bottle')},
            method: {id: `hp.scrub.${part}`, revision: 1, law: BREW_LAW.ref, roles: {target: 'thing', solvent: 'lot'},
                steps: [{op: 'rinse-object', minutes: 1, bindings: {target: 'target', solvent: 'solvent'},
                    options: {part, amount: 4, removalPerUnit: 3, solventPart}}]}}},
        restore(`restore-pending-${id}`),
        {id: `settle-${id}`, advanceTo: at, expect},
        restore(`restore-settled-${id}`),
    ];
    const clean = [residue('wall', dirt, 'down', soil), residue('drain', dirt, 'up', 6 - soil)];
    const failed = [residue('wall', writing, 'unchanged', 5), residue('drain', writing, 'unchanged', 0)];
    return {
        basis: 'authored',
        engine: {packs: ['w.residue_flow'], host: {things: {'lot:bottle': {
            material: cleaner, properties: {constituents: {'dirt-solvent': diluted ? 250 : 500}},
        }}}, shared: {effectKinds: BREW_PUBLISHES}},
        world: {holders: [
            {id: 'bench', kind: 'place'},
            {id: 'wall', kind: 'thing', place: 'bench', quantities: {[residueQuantity(dirt)]: 6, [residueQuantity(writing)]: 5}},
            {id: 'bottle', kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: 8}},
            {id: 'drain', kind: 'place', quantities: Object.fromEntries([cleaner, dirt, writing].map(part => [residueQuantity(part), 0]))},
        ], links: [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}]},
        timeline: [
            ...scrub('scrub-dirt', dirt, 'dirt-solvent', 1, clean),
            ...scrub('scrub-writing', writing, 'writing-solvent', 2, failed),
        ],
        expect: [...clean, ...failed, residue('drain', cleaner, 'up', 8),
            {holder: 'bottle', quantity: brewMeasureQuantity, direction: 'down', to: 0}],
    };
}

export function driedSplashCase() {
    const data = swellingSurfaceCase({covered: true});
    const settings = data.engine.settings['b.splash'];
    settings.dryingPerMinute = 2;
    const wet = residueQuantity(settings.response.part), dry = residueQuantity(`${settings.response.part}:dry`);
    const surface = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    data.world.holders.find(holder => holder.id === 'second-part').tags = ['splash-exposed'];
    const contact = data.timeline.find(step => step.id === 'contact-time');
    contact.expect = [surface(wet, 'down', 4), surface(dry, 'up', 2)];
    const touch = data.timeline.findIndex(step => step.id === 'touch');
    data.timeline[touch].expect[0].to = 0;
    data.timeline.splice(touch, 0,
        {id: 'dry-coating', advanceTo: 5, expect: [surface(wet, 'down', 0), surface(dry, 'up', 6)]},
        restore('restore-dry-coating'));
    Object.assign(data.expect.find(check => check.holder === recipient.id && check.quantity === wet),
        surface(wet, 'unchanged', 0));
    data.expect.push(surface(dry, 'up', 6));
    return data;
}

// HPPE026/027 give the mature harvest and recovery. The extraction, route
// and measured dose are authored. The lot's grade is supplied by its owner.
export function mandrakeCase({mature = true, route = 'oral'} = {}) {
    const root = mature ? 'mature-root' : 'young-root';
    const remedy = 'mandrake-restorative';
    const delivered = mature ? remedy : root;
    const restored = mature && route === 'oral';
    const layers = 'temporary-form-layers';
    const stone = 'petrified|3|';
    const disguise = 'disguised|1|20';
    const lots = {mandrake: {id: 'mandrake', material: 'mandrake-root', amount: 6, properties: {[root]: 1000}}};
    const method = withPour(brewMethod({id: 'hp.brew.mandrake', slots: [{id: 'mandrake'}], process: [
        {op: 'react', minutes: 2, options: {reactions: [{id: 'extract-mature-mandrake',
            reactants: {'mature-root': 1}, products: {[remedy]: 1}}]}},
    ]}), true);
    const data = stocked({lots, method, route, measured: {name: delivered, amount: 6},
        target: {form: 'ordinary', [layers]: [disguise, stone]},
        responses: [{part: remedy, minimum: 6, route: 'oral', clearTemporaryForm: 'petrified'}],
        effect: [property(layers, restored ? 'changed' : 'unchanged', restored ? [disguise] : [disguise, stone])]});
    data.engine.packs.push('l.creature_form');
    data.world.holders.push({id: 'second-patient', kind: 'body', place: 'bench', properties: {form: 'ordinary', [layers]: [stone]}});
    data.timeline.push({id: 'after-disguise', advanceTo: 20, expect: [
        property(layers, 'changed', restored ? null : [stone]),
        {holder: 'second-patient', property: layers, direction: 'unchanged', to: [stone]},
    ]}, restore('restore-restoration-outcome'));
    data.expect.push(property('form', 'unchanged', 'ordinary'),
        {holder: 'second-patient', property: layers, direction: 'unchanged', to: [stone]});
    return data;
}

function withPour(method, divide = false) {
    const binding = {vessel: 'vessel'};
    return {...method, roles: {...method.roles, flask: 'flask'}, steps: [...method.steps,
        ...(divide ? [{op: 'divide', bindings: binding, minutes: 1, options: {doses: 1}}] : []),
        {op: 'pour', bindings: {...binding, flask: 'flask'}, minutes: 1, options: {index: 0}}]};
}

function lotmCase(id, {blood = 11000, route = 'oral', halfServing = false} = {}) {
    const row = lotmBrewRow(id);
    if (!row) throw new Error(`Unknown LOTM brew ${id}.`);
    const seer = id === 'fool_9';
    const crystal = 48000;
    const lots = lotmLots(row, seer ? {m1: blood, m2: crystal} : {});
    const response = {part: 'charge', minimum: row.hazardUnit, route: 'oral', mindUnitsPerPoint: row.hazardUnit,
        sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
        details: {minutes: 1, mind: {faculty: 'confusion'}}};
    const boundBlood = Math.min(blood, Math.floor(crystal / 5));
    const potency = boundBlood * 6;
    const charge = blood - boundBlood;
    const delivered = halfServing ? potency / 2 : potency;
    const deliveredCharge = halfServing ? charge / 2 : charge;
    const hazard = route === 'oral' ? Math.floor(deliveredCharge / row.hazardUnit) : 0;
    const data = stocked({lots, method: withPour(row.method), measured: {name: 'potency', amount: seer ? potency : row.formulaPotency},
        ...(seer ? {route, responses: [response],
            effect: [property('mind_confusion', hazard ? 'changed' : 'unchanged', hazard),
                part(recipient.id, 'charge', deliveredCharge ? 'up' : 'unchanged', deliveredCharge)],
            recovery: {minutes: 1, expect: [property('mind_confusion', hazard ? 'changed' : 'unchanged', 0)]}} : {})});
    if (seer && halfServing) {
        const total = Object.values(lots).reduce((n, lot) => n + lot.amount, 0);
        data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.amount = total / 2;
        data.timeline.find(step => step.id === 'settle-serving').expect.splice(0, 2,
            part(flask.id, 'potency', 'down', potency - delivered), part(recipient.id, 'potency', 'up', delivered));
        data.expect[data.expect.length - 1] = part(recipient.id, 'potency', 'up', delivered);
    }
    return data;
}

export const seerDoseCase = options => lotmCase('fool_9', options);

const sleepingServing = (name, route, minutes) => stocked({initial: {[name]: 3}, measured: {name, amount: 3}, route,
    responses: [sleep(name, 3, minutes)], effect: [property('mind_awake', 'changed', false)],
    recovery: {minutes, expect: [property('mind_awake', 'changed', true)]}});

export function confusingConcoctionCase({restMinutes = 3} = {}) {
    const {lots, method} = confusingConcoction({restMinutes});
    const thick = restMinutes >= 3;
    const active = 'confusing-active';
    const data = stocked({lots, method: withPour(method, true), measured: {name: thick ? active : 'thin-infusion', amount: 6},
        route: 'oral', responses: [{part: active, minimum: 3, route: 'oral', mindUnitsPerPoint: 2,
            sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
            details: {minutes: 4, mind: {faculty: 'confusion'}}}],
        effect: [property('mind_confusion', thick ? 'changed' : 'unchanged', thick ? 3 : 0)],
        recovery: {minutes: 4, expect: [property('mind_confusion', thick ? 'changed' : 'unchanged', 0)]}});
    data.timeline.splice(2, 0, {id: 'infused', advanceTo: 1, expect: [part(flask.id, active, 'unchanged', 0)]},
        restore('restore-before-thickening'));
    data.expect.push(part(recipient.id, thick ? 'thin-infusion' : active, 'unchanged', 0));
    return data;
}

export function forgetfulnessPotionCase({amount = 6} = {}) {
    const {lots, method} = forgetfulnessPotion();
    const active = 'forgetfulness-active';
    const forgotten = amount >= 4;
    const memories = ['home', 'last-meeting'];
    const data = stocked({lots, method: withPour(method, true), measured: {name: active, amount: 6},
        route: 'oral', target: {mind_memory: memories}, responses: [{part: active, minimum: 4, route: 'oral',
            sentence: {verb: 'transform', object: 'memory'},
            details: {mind: {faculty: 'memory', record: 'last-meeting'}}}],
        effect: [property('mind_memory', forgotten ? 'changed' : 'unchanged', forgotten ? ['home'] : memories)]});
    data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.amount = amount;
    data.timeline.find(step => step.id === 'settle-serving').expect.splice(0, 2,
        part(flask.id, active, 'down', 6 - amount), part(recipient.id, active, 'up', amount));
    data.expect[data.expect.length - 1] = part(recipient.id, active, 'up', amount);
    data.expect.push(property('mind_memory', forgotten ? 'changed' : 'unchanged', forgotten ? ['home'] : memories));
    return data;
}

// HPPE135 supports the cake carrier. The starting draught is prepared stock,
// and the loading ratio, split, and sleep duration are authored.
export function sleepingCakeCase({route = 'eaten'} = {}) {
    const active = 'sleeping-serving', crumb = 'cake-crumb';
    const source = ref('flask', 'draught-bottle'), spare = ref('flask', 'spare-cake');
    const lots = {cake: {id: 'cake-stock', material: 'cake', amount: 12, properties: {[crumb]: 1000}}};
    const method = brewMethod({id: 'hp.brew.load-sleeping-cakes', slots: [{id: 'cake'}], process: [
        {op: 'admit-fraction', flask: 'source', minutes: 1},
        {op: 'divide', minutes: 1, options: {doses: 2}},
        {op: 'pour', minutes: 1, options: {index: 0}},
        {op: 'pour', flask: 'spare', options: {index: 1}},
    ]});
    const eaten = route === 'eaten';
    const data = stocked({lots, method, route, measured: {name: active, amount: 3},
        responses: [{...sleep(active, 3, 6), route: 'eaten', requires: [{part: crumb, minimum: 6}]}],
        effect: [property('mind_awake', eaten ? 'changed' : 'unchanged', !eaten),
            part(flask.id, crumb, 'down', 0), part(recipient.id, crumb, 'up', 6)],
        recovery: eaten ? {minutes: 6, expect: [property('mind_awake', 'changed', true)]} : undefined});
    data.world.holders.push({id: source.id, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[brewDoseQuantity(active)]: 6}},
    {id: spare.id, kind: 'thing', as: ['flask'], place: 'bench', properties: {form: 'cake'}});
    data.world.holders.find(holder => holder.id === flask.id).properties = {form: 'cake'};
    Object.assign(data.timeline[0].working.bindings, {source, spare});
    data.timeline.splice(2, 0, {id: 'incorporated', advanceTo: 1, expect: [
        part(source.id, active, 'down', 0), part(flask.id, active, 'unchanged', 0),
    ]}, restore('restore-incorporated'));
    data.timeline.find(step => step.id === 'bottled').expect.push(
        part(flask.id, crumb, 'up', 6), part(spare.id, active, 'up', 3), part(spare.id, crumb, 'up', 6));
    data.expect.push(part(source.id, active, 'down', 0), part(spare.id, active, 'up', 3),
        part(spare.id, crumb, 'up', 6), part(recipient.id, crumb, 'up', 6));
    return data;
}

export function draughtOfPeaceCase({syrup = true} = {}) {
    const inputs = [['base', 'peace-base', 60], ['moonstone', 'powdered-moonstone', 6]];
    if (syrup) inputs.push(['syrup', 'hellebore-syrup', 2]);
    const lots = Object.fromEntries(inputs.map(([id, part, amount]) => [id, {id, material: id, amount, properties: {[part]: 1000}}]));
    const fuel = 'stock:burner-fuel';
    const method = draughtOfPeaceMethod({moonstone: 6, syrupDrops: syrup ? 2 : 0});
    const data = stocked({lots, vessel: {id: 'cauldron', closure: 'open', fuelAccount: fuel,
        thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}},
        method, measured: {name: syrup ? 'peace-active' : 'peace-stirred', amount: syrup ? 6 : 4}, route: 'oral',
        responses: [{part: 'peace-active', minimum: 6, sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
            details: {minutes: 4, mind: {faculty: 'mood', amount: 6}}}],
        effect: [property('mind_mood', syrup ? 'changed' : 'unchanged', syrup ? 16 : 10)],
        recovery: {minutes: 4, expect: [property('mind_mood', syrup ? 'changed' : 'unchanged', 10)]}});
    data.world.holders.find(holder => holder.id === 'cauldron').quantities = {[fuel]: 120};
    data.expect.push({holder: 'cauldron', quantity: fuel, direction: 'down', to: 15});
    if (!syrup) data.expect.push(part(recipient.id, 'peace-active', 'unchanged', 0));
    const cue = {working: 'case.brew', step: method.steps.findIndex(step => step.op === 'react'),
        to: {cues: syrup ? ['Light silver vapour'] : []}};
    data.timeline.splice(2, 0, {id: 'mid-simmer', advanceTo: 4}, restore('restore-mid-simmer'),
        {id: 'check-vapour', advanceTo: 8, expectObserved: cue},
        {...restore('restore-vapour'), expectObserved: cue});
    return data;
}

export function shrinkingCase({reverse = true, juice = 1} = {}) {
    const {lots, method} = shrinkingSolution({juice});
    const spoiled = juice > 1;
    const active = spoiled ? 'shrinking-irritant' : 'shrink';
    const layers = 'temporary-form-layers';
    const marking = 'marked-toad|1|20';
    const shrunk = [marking, 'tadpole|2|16'];
    // HPPE029–034 anchors the transformation and reversal. The prepared
    // counteragent, amounts and unreversed duration are authored.
    const vitality = (direction, to) => ({holder: recipient.id, quantity: 'vitality', direction, to});
    const data = stocked({lots, method: withPour(method, true), measured: {name: active, amount: spoiled ? 6 : 5}, route: 'oral',
        target: {form: 'toad', [layers]: [marking]},
        responses: [
            {part: 'shrinking-irritant', minimum: 6, sentence: {verb: 'remove', object: 'vitality'}, details: {amount: 2}},
            {part: 'shrink', minimum: 1, temporaryForm: {form: 'tadpole', priority: 2, minutes: 10}},
        ],
        effect: [property(layers, spoiled ? 'unchanged' : 'changed', spoiled ? [marking] : shrunk),
            vitality(spoiled ? 'down' : 'unchanged', spoiled ? 8 : 10)]});
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {vitality: 10};
    const cue = {working: 'case.brew', step: method.steps.length - 1, to: {cues: [spoiled ? 'orange' : 'acid green']}};
    data.timeline.splice(2, 0, {id: 'mix', advanceTo: 1}, restore('restore-before-finish'),
        {id: 'check-colour', advanceTo: 2, expectObserved: cue},
        {...restore('restore-colour'), expectObserved: cue});
    data.engine.packs.push('l.creature_form');
    if (spoiled) {
        data.expect.push(part(recipient.id, 'shrink', 'unchanged', 0), vitality('down', 8));
        return data;
    }
    const source = ref('flask', 'reversal-flask');
    const counteragent = reverse ? 'shrink-counteragent' : 'water';
    data.world.holders.push({id: source.id, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[brewDoseQuantity(counteragent)]: 1}});
    data.timeline.push(
        {id: 'apply-counteragent', working: {family: 'brew-dose', bindings: {flask: source, recipient},
            method: brewDoseMethod({id: 'hp.shrinking.reversal', route: 'topical',
                responses: [{part: 'shrink-counteragent', minimum: 1, clearTemporaryForm: 'tadpole'}]})}},
        restore('restore-before-reversal'),
        {id: 'counteragent-settled', advanceTo: 8, expect: [part(source.id, counteragent, 'down', 0),
            property(layers, reverse ? 'changed' : 'unchanged', reverse ? [marking] : shrunk)]},
        restore('restore-after-reversal'));
    data.expect.push(property('form', 'unchanged', 'toad'), property(layers, reverse ? 'unchanged' : 'changed', reverse ? [marking] : shrunk));
    return data;
}

// HPPE070/071/107 supply preparation. HPPE110 supplies clarity in the drinker.
export function witSharpeningCase({route = 'oral', amount = 6} = {}) {
    const inputs = [['ginger', 'slice', 'sliced-ginger'], ['scarab', 'pound', 'pounded-scarab'], ['armadillo-bile']];
    const lots = Object.fromEntries(inputs.map(([id]) => [id, {id, material: id, amount: 2, properties: {[id]: 1000}}]));
    const active = 'wit-active';
    const method = withPour(brewMethod({id: 'hp.brew.wit-sharpening', slots: inputs.map(([id]) => ({id})), process: [
        {op: 'react', minutes: 1, options: {reactions: [{id: 'clarifying-mix',
            reactants: {'sliced-ginger': 1, 'pounded-scarab': 1, 'armadillo-bile': 1}, products: {[active]: 3}}]}},
    ]}), true);
    for (const [id, how, part] of inputs.filter(([, how]) => how)) {
        method.steps.splice(method.steps.findIndex(step => step.bindings.lot === id), 0, {
            op: 'prepare', bindings: {vessel: 'vessel', lot: id}, options: {how, changes: [{from: id, to: part, num: 1, den: 1}]},
        });
    }
    const clarity = route === 'oral' ? Math.floor(amount / 2) : 0;
    const data = stocked({lots, method, measured: {name: active, amount: 6}, route,
        target: {mind_confusion: 3},
        responses: [{part: active, route: 'oral', minimum: 2, mindUnitsPerPoint: 2, mindDirection: -1,
            sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
            details: {minutes: 3, mind: {faculty: 'confusion'}}}],
        effect: [property('mind_confusion', clarity ? 'changed' : 'unchanged', 3 - clarity)]});
    data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.amount = amount;
    const settlement = data.timeline.find(step => step.id === 'settle-serving');
    settlement.expect.splice(0, 2, part(flask.id, active, 'down', 6 - amount), part(recipient.id, active, 'up', amount));
    data.timeline.splice(2, 0, {id: 'mixed', advanceTo: 1, expect: [part('flask', active, 'unchanged', 0)]},
        restore('restore-mixed'));
    const focused = clarity === 3;
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES), {id: 'occlumency_tutor', type: 'flag'}];
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES),
        {id: 'occlumency-practice', unit: 'exercise', min: 0, max: 100},
        {id: 'stamina', unit: 'effort', min: 0, max: 10}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {'occlumency-practice': 2, stamina: 4};
    const stamina = {holder: recipient.id, quantity: 'stamina', direction: focused ? 'down' : 'unchanged', to: focused ? 3 : 4};
    data.timeline.push(
        {id: 'try-focus', working: {id: 'wit-focus', family: 'occlumency', op: 'focus', student: recipient.id, payer: recipient.id}},
        restore('restore-pending-focus'),
        {id: 'focus-settled', advanceTo: 6,
            ...(!focused ? {interruption: {working: 'wit-focus', reason: 'The student cannot settle their thoughts.'}} : {}),
            expect: [stamina, {lawField: 'occlumency.wit-focus:s0', direction: focused ? 'changed' : 'unchanged',
                to: focused ? {scope: recipient.id, kind: 'conceal', params: {channel: 'mind'}, until: 9} : null}]},
        {id: 'clarity-expired', advanceTo: 8, expect: [property('mind_confusion', clarity ? 'changed' : 'unchanged', 3)]},
        restore('restore-clarity-expired'),
    );
    data.expect[data.expect.length - 1] = part(recipient.id, active, 'up', amount);
    data.expect.push(stamina);
    return data;
}

export function generatedBrightening({staged = false, directOnly = false, split = false, blendRoutes = false} = {}) {
    const lots = {
        moss: {id: 'moss', material: 'moss', amount: 16, properties: {brightSap: 750}},
        salt: {id: 'salt', material: 'salt', amount: 16, properties: {stabilizer: 500}},
        stronger: {id: 'stronger', material: 'moss', amount: 16, properties: {brightSap: 1000}},
    };
    if (split) {
        lots.moss.amount = 6;
        lots.reed = {id: 'reed', material: 'reed', amount: 8, properties: {[blendRoutes ? 'reedSap' : 'brightSap']: 750}};
    }
    const measured = {name: 'bright', amount: 9};
    const data = stocked({lots, measured});
    const kit = ref('instrument', 'kit');
    data.engine.shared.properties = [
        {id: 'assay_parts', type: 'set'}, {id: 'assay_resolution', type: 'level', min: 1, max: 1000},
    ];
    data.world.holders.push({id: kit.id, kind: 'thing', as: [kit.kind], place: 'bench',
        quantities: {[brewStripQuantity]: split ? 3 : 2}, properties: {
            assay_parts: ['brightSap', 'stabilizer', ...(blendRoutes ? ['reedSap'] : [])], assay_resolution: 200}});
    const assay = (id, name, at, strips) => [
        {id: `assay-${id}`, working: {family: 'brew-assay',
            method: brewLotAssayMethod({id: `assay-${id}`, part: name, resolution: 200}),
            bindings: {lot: ref('lot', id), instrument: kit, observer: recipient}}},
        restore(`restore-pending-${id}-assay`),
        {id: `read-${id}`, advanceTo: at, expect: [{holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: strips}]},
    ];
    const request = {observer: recipient.id, id: 'trial.brightening', extent: 3, vessel: 'cauldron', flask: flask.id,
        reaction: {id: 'fix-brightness', reactants: {brightSap: 2, stabilizer: 1}, products: {bright: 3}}};
    if (staged) {
        delete request.reaction;
        delete request.extent;
        request.goal = {part: 'bright', amount: 9};
        request.reactions = [
            {id: 'direct', minutes: 1, reactants: {brightSap: 3, stabilizer: 1}, products: {bright: 3, sludge: 1}},
            ...(!directOnly ? [
                {id: 'prime', minutes: 3, reactants: {brightSap: 2, stabilizer: 1}, products: {primed: 3}},
                {id: 'finish', minutes: 2, reactants: {primed: 2, brightSap: 1}, products: {bright: 3}},
            ] : []),
        ];
    }
    if (split) {
        request.goal = {part: 'bright', amount: 9};
        request.reactions = blendRoutes ? [
            {...request.reaction, minutes: 2},
            {id: 'fix-reed-brightness', minutes: 2, reactants: {reedSap: 2, stabilizer: 1}, products: {bright: 3}},
        ] : [{...request.reaction, minutes: 2, limit: 2}];
        delete request.reaction;
        delete request.extent;
    }
    const responses = [{part: 'bright', minimum: 9, sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
        details: {minutes: 9, mind: {faculty: 'mood', amount: 9}}}];
    const bottledAt = split ? 12 : staged ? directOnly ? 7 : 11 : 9;
    data.timeline = [
        ...assay('moss', 'brightSap', 2, split ? 2 : 1), ...assay('salt', 'stabilizer', 4, split ? 1 : 0),
        ...(split ? assay('reed', blendRoutes ? 'reedSap' : 'brightSap', 6, 0) : []), restore('restore-assayed-lots'),
        {id: 'brew', working: {family: 'brew-from-assays', request}},
        {id: 'mid-brew', advanceTo: split ? 8 : staged && !directOnly ? 7 : 5,
            expect: [part(flask.id, measured.name, 'unchanged', 0)]}, restore('restore-running-brew'),
        {id: 'bottled', advanceTo: bottledAt, expect: [part(flask.id, measured.name, 'up', measured.amount)]}, restore('restore-bottled'),
        ...serving('trial.brightening.serve', 'oral', responses, bottledAt, measured, [property('mind_mood', 'changed', 19)],
            {minutes: 9, expect: [property('mind_mood', 'changed', 10)]}),
    ];
    data.expect = [
        {holder: 'moss', quantity: brewMeasureQuantity, direction: 'down', to: blendRoutes ? 2 : split ? 1 : staged ? directOnly ? 1 : 4 : 6},
        {holder: 'salt', quantity: brewMeasureQuantity, direction: 'down', to: staged && !directOnly ? 11 : 8},
        {holder: 'stronger', quantity: brewMeasureQuantity, direction: 'unchanged', to: 16},
        {holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: 0},
        part(recipient.id, measured.name, 'up', measured.amount),
        ...(split ? [{holder: 'reed', quantity: brewMeasureQuantity, direction: 'down', to: blendRoutes ? 1 : 3}] : []),
        ...(staged ? [directOnly ? part(recipient.id, 'sludge', 'up', 3) : part(recipient.id, 'sludge', 'unchanged', 0)] : []),
    ];
    return data;
}

export function generatedHeatCase({fuelStock = 45, withdraw = false, finishHot = false} = {}) {
    const data = generatedBrightening({staged: true});
    const fuel = 'stock:burner-fuel';
    const vessel = data.world.holders.find(holder => holder.id === 'cauldron');
    vessel.quantities = {[fuel]: fuelStock};
    Object.assign(data.engine.host.things['vessel:cauldron'], {fuelAccount: fuel,
        thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}});
    data.engine.shared.quantities = [WORLD_QUANTITIES.stock];
    const brew = data.timeline.findIndex(step => step.id === 'brew');
    const {request} = data.timeline[brew].working;
    request.reactions = request.reactions.slice(1);
    request.reactions[0].activeHeat = true;
    request.reactions[1].activeHeat = finishHot;
    request.heating = {
        law: {revision: THERMAL_REVISION, ambient: 20,
            extraction: {min: 50, max: 85, seconds: 60}, degradation: {above: 85, seconds: 60}},
        load: {mass: 1, volume: 1, specificHeat: 1},
        maker: {tools: ['brazier'], competence: 4, workCapacity: 1000,
            heater: {maxTemperature: 80, maxConductance: 20, fuelPerSecond: 0.25}},
        program: {startTemperature: 59, sourceTemperature: 75, targetTemperature: 60,
            holdSeconds: 180, heaterTool: 'brazier'},
    };
    if (withdraw) {
        data.timeline.splice(brew + 1, 0,
            {id: 'mid-heating', advanceTo: 5}, restore('restore-pending-heat'),
            {id: 'take-fuel', ops: [{op: 'add', holder: vessel.id, quantity: fuel, amount: -40}]},
            restore('restore-short-fuel'));
        const bottled = data.timeline.findIndex(step => step.id === 'bottled');
        data.timeline[bottled].expect = [part(flask.id, 'bright', 'unchanged', 0),
            part(flask.id, 'primed', 'unchanged', 0), part(flask.id, 'brightSap', 'up', 9)];
        data.timeline.splice(bottled + 2);
        data.expect.splice(4, 1);
    }
    data.expect.push({holder: vessel.id, quantity: fuel, direction: 'down',
        to: fuelStock - (finishHot ? 75 : 45)});
    return data;
}

export function generatedLateFlaskCase({life = 14, move = false, useSpent = false} = {}) {
    const data = generatedHeatCase();
    const source = ref('flask', 'saved-binder');
    const binder = brewDoseQuantity('stabilizer');
    data.world.holders.push({id: source.id, kind: 'thing', as: [source.kind], place: 'bench',
        quantities: {[binder]: 6}, state: {'b.brew_storage': {bottledAt: 0, life}}});
    const assay = data.timeline.find(step => step.id === 'assay-salt').working;
    assay.method = brewAssayMethod({id: 'assay-binder', part: 'stabilizer', resolution: 1});
    assay.bindings.flask = source;
    delete assay.bindings.lot;
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    Object.assign(request.reactions[0], {reactants: {brightSap: 3}, products: {primed: 3}});
    request.reactions[1].reactants = {primed: 2, [useSpent ? 'stabilizer:spent' : 'stabilizer']: 1};
    if (useSpent) request.searchAdmissionFor = [source.id];
    else request.admitAfter = {[source.id]: 'prime'};
    data.expect.find(row => row.holder === 'moss').to = 6;
    data.expect.find(row => row.holder === 'salt').direction = 'unchanged';
    data.expect.find(row => row.holder === 'salt').to = 16;
    const bottleStock = (direction, to) => part(source.id, 'stabilizer', direction, to);
    const mid = data.timeline.find(step => step.id === 'mid-brew');
    mid.advanceTo = 6;
    mid.expect.push(bottleStock('unchanged', 6));
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    if (move) {
        data.world.holders.push({id: 'shelf', kind: 'place'});
        data.timeline.splice(bottled, data.timeline.length - bottled,
            {id: 'move-binder', ops: [{op: 'move', holder: source.id, to: 'shelf'}]},
            restore('restore-moved-binder'),
            {id: 'admission-interrupted', advanceTo: 7, expect: [bottleStock('unchanged', 6), part(flask.id, 'bright', 'unchanged', 0)],
                interruption: {working: 'case.brew', reason: 'flask-out-of-reach'}});
        data.expect = data.expect.filter(row => row.holder !== recipient.id);
        data.expect.push(bottleStock('unchanged', 6));
    } else {
        data.timeline.splice(bottled, 0, {id: 'admit-binder', advanceTo: 7, expect: [bottleStock('down', 1)]},
            restore('restore-after-binder-admission'));
        data.expect.push(bottleStock('down', 1), part(recipient.id, useSpent ? 'stabilizer' : 'stabilizer:spent', 'up', 2));
        if (useSpent) data.expect.push(part(recipient.id, 'stabilizer:spent', 'unchanged', 0));
    }
    return data;
}

export function generatedAdmissionCase({binderStock = 8} = {}) {
    const data = generatedHeatCase();
    const stock = data.world.holders.find(holder => holder.id === 'salt');
    stock.quantities[brewMeasureQuantity] = binderStock;
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    Object.assign(request.reactions[0], {reactants: {brightSap: 3}, products: {primed: 3},
        catalyst: 'stabilizer', catalystMinimum: 3});
    request.reactions[1].reactants = {primed: 2, stabilizer: 1};
    request.searchAdmissionFor = ['salt'];
    const binder = (direction, to) => ({holder: 'salt', quantity: brewMeasureQuantity, direction, to});
    const mid = data.timeline.find(step => step.id === 'mid-brew');
    mid.advanceTo = 6;
    mid.expect.push(binder('unchanged', binderStock));
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    data.timeline.splice(bottled, 0, {id: 'binder-admitted', advanceTo: 7, expect: [binder('down', binderStock - 8)]},
        restore('restore-inferred-admission'));
    data.expect.find(row => row.holder === 'moss').to = 6;
    data.expect.find(row => row.holder === 'salt').to = binderStock - 8;
    return data;
}

export function generatedSpentLotCase({spent = 1440, storageSince, storageRate = 1} = {}) {
    const data = generatedHeatCase();
    const stock = data.world.holders.find(holder => holder.id === 'salt');
    stock.quantities[brewMeasureQuantity] = 8;
    Object.assign(data.engine.host.things['lot:salt'], {spent, storageRate, ageing: {constituent: 'stabilizer', perDay: 3},
        ...(storageSince !== undefined ? {storageSince} : {})});
    const {request} = data.timeline.find(step => step.id === 'brew').working;
    Object.assign(request.reactions[0], {reactants: {brightSap: 3}, products: {primed: 3}});
    request.reactions[1].reactants = {primed: 2, 'stabilizer:spent': 1};
    request.recoverSpentFrom = ['salt'];
    if (storageSince === undefined) request.admitAfter = {salt: 'prime'};
    else request.searchAdmissionFor = ['salt'];
    const mid = data.timeline.find(step => step.id === 'mid-brew');
    mid.advanceTo = 6;
    mid.expect.push({holder: 'salt', quantity: brewMeasureQuantity, direction: 'unchanged', to: 8});
    const bottled = data.timeline.findIndex(step => step.id === 'bottled');
    data.timeline.splice(bottled, 0, {id: 'recover-aged-binder', advanceTo: 7,
        expect: [{holder: 'salt', quantity: brewMeasureQuantity, direction: 'down', to: 0}]},
    restore('restore-recovered-binder'));
    data.expect.find(row => row.holder === 'moss').to = 6;
    data.expect.find(row => row.holder === 'salt').to = 0;
    data.expect.push(part(recipient.id, 'stabilizer', 'up', 1), part(recipient.id, 'stabilizer:spent', 'unchanged', 0));
    return data;
}

export function generatedLotStorageChangeCase({duringPrime = false} = {}) {
    const data = generatedSpentLotCase({spent: duringPrime ? 1433 : 1436, storageSince: 0});
    const storage = ref('storage', 'cold-box');
    data.engine.shared.properties.push({id: 'brew_storage_rate', type: 'level', min: 0, max: 1000});
    data.world.holders.push({id: storage.id, kind: 'thing', as: [storage.kind], place: 'bench',
        properties: {brew_storage_rate: 0}});
    const change = {id: 'cool-raw-binder', working: {family: 'brew', bindings: {lot: ref('lot', 'salt'), storage},
        method: {id: 'trial.cool-binder', revision: 1, law: BREW_LAW.ref, roles: {lot: 'lot', storage: 'storage'},
            steps: [{op: 'change-lot-storage', bindings: {lot: 'lot', storage: 'storage'}}]}}};
    const restored = {...restore('restore-cold-binder'), expectObserved: {working: 'case.cool-raw-binder',
        step: 0, to: {storage: storage.id}}};
    const brew = data.timeline.findIndex(step => step.id === 'brew');
    if (!duringPrime) {
        const {request} = data.timeline[brew].working;
        delete request.searchAdmissionFor;
        request.admitAfter = {salt: 'prime'};
        data.timeline.splice(brew, 0, change, restored);
    } else {
        const draw = data.timeline.findIndex(step => step.id === 'recover-aged-binder');
        data.timeline.splice(draw, data.timeline.length - draw, change, restored,
            {id: 'recovery-refused', advanceTo: 7, interruption: {working: 'case.brew', reason: 'ingredient-below-assayed-minimum'},
                expect: [{holder: 'salt', quantity: brewMeasureQuantity, direction: 'unchanged', to: 8},
                    part(flask.id, 'bright', 'unchanged', 0)]}, restore('restore-refused-recovery'));
        data.expect = data.expect.filter(row => row.holder !== recipient.id);
        Object.assign(data.expect.find(row => row.holder === 'salt'), {direction: 'unchanged', to: 8});
    }
    return data;
}

export function generatedLinedVesselCase({mossStock = 20, occupied = false} = {}) {
    const data = generatedBrightening({staged: true});
    data.engine.host.things['vessel:cauldron'].retainPermille = 250;
    data.world.holders.find(holder => holder.id === 'moss').quantities[brewMeasureQuantity] = mossStock;
    if (occupied) data.world.holders.find(holder => holder.id === flask.id).quantities[brewDoseQuantity('water')] = 1;
    data.expect.find(row => row.holder === 'moss').to = mossStock - 17;
    data.expect.find(row => row.holder === 'salt').to = 8;
    data.expect.push({holder: 'cauldron', quantity: brewFilmQuantity('bright'), direction: 'up', to: 3});
    return data;
}

export function generatedAgedIngredientCase({mossStock = 24, perishable = false} = {}) {
    const data = generatedBrightening({staged: true});
    Object.assign(data.engine.host.things['lot:moss'], perishable ? {
        key: {id: 'book.hp.ing.fluxweed'}, spent: 5040,
    } : {ageing: {constituent: 'brightSap', perDay: 4}, spent: 1440, storageRate: 0.5});
    data.world.holders.find(holder => holder.id === 'moss').quantities[brewMeasureQuantity] = mossStock;
    data.expect.find(row => row.holder === 'moss').to = mossStock - (perishable ? 22 : 15);
    data.expect.push(part(recipient.id, 'brightSap:spent', 'unchanged', 0));
    return data;
}

// HPPE060 shows spray contact and a doxy falling still. This prepared dose
// uses the mind owner's existing temporary movement hold.
export function doxycideCase({route = 'spray'} = {}) {
    const active = 'doxycide-active';
    const held = route === 'spray';
    const data = stocked({initial: {[active]: 3}, measured: {name: active, amount: 3}, route,
        target: {mind_compelled_steps: false, form: 'doxy'},
        responses: [{part: active, minimum: 3, route: 'spray', sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
            details: {minutes: 4, mind: {faculty: 'steps'}}}],
        effect: [property('mind_compelled_steps', held ? 'changed' : 'unchanged', held)]});
    data.world.holders.push({id: 'refuge', kind: 'place'},
        {id: 'second-doxy', kind: 'body', place: 'bench', properties: {form: 'doxy', mind_awake: true}});
    data.world.links = [{id: 'escape', kind: 'path', from: 'bench', to: 'refuge'}];
    const position = (direction, to) => ({holder: recipient.id, position: true, direction, to});
    data.timeline.push(
        {id: 'try-to-flee', ops: [recipient.id, 'second-doxy'].map(holder =>
            ({op: 'property', holder, property: 'agency_goal', value: 'refuge'}))},
        {id: 'movement', advanceTo: 3, expect: [position(held ? 'unchanged' : 'changed', held ? 'bench' : 'refuge'),
            {holder: 'second-doxy', position: true, direction: 'changed', to: 'refuge'}]},
        restore('restore-fleeing'),
        {id: 'after-hold', advanceTo: 7, expect: [position(held ? 'changed' : 'unchanged', 'refuge'),
            property('mind_compelled_steps', held ? 'changed' : 'unchanged', false)]});
    return data;
}

// HPPE068 describes obsession. The target and movement choices are authored.
export function amortentiaCase({route = 'oral', closed = false, sealed = false, secondCanSmell = true} = {}) {
    const active = 'amortentia-extract', subject = 'subject';
    const fixated = route === 'oral';
    const follows = fixated && !closed;
    const position = (direction, to) => ({holder: recipient.id, position: true, direction, to});
    const data = stocked({initial: {[active]: 3}, measured: {name: active, amount: 3}, route,
        responses: [{part: active, minimum: 3, route: 'oral', sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
            details: {minutes: 5, mind: {faculty: 'fixation', subject}}}],
        effect: [property('mind_fixation', fixated ? 'changed' : 'unchanged', fixated ? subject : null)]});
    data.world.holders.push(...['gallery', 'stairs', 'study'].map(id => ({id, kind: 'place'})),
        {id: subject, kind: 'body', place: 'bench', properties: {mind_awake: true}});
    data.world.links = [
        {id: 'gallery-door', kind: 'path', from: 'bench', to: 'gallery', ...(closed ? {state: 'closed'} : {})},
        {id: 'gallery-stairs', kind: 'path', from: 'gallery', to: 'stairs'},
        {id: 'study-door', kind: 'path', from: 'bench', to: 'study'},
        {id: 'study-stairs', kind: 'path', from: 'stairs', to: 'study'},
    ];
    const second = 'second-observer', aroma = 'aroma.amortentia';
    data.engine.packs.push(KNOWLEDGE_PACK);
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES),
        {id: 'brew_aroma_associations', type: 'set'}, {id: 'brew_sealed', type: 'flag'}];
    const sample = data.world.holders.find(holder => holder.id === flask.id);
    sample.properties = {brew_sealed: sealed};
    Object.assign(sample.quantities, {'scent:cedar': 6, 'scent:mint': 4});
    const first = data.world.holders.find(holder => holder.id === recipient.id);
    Object.assign(first.properties, {senses: ['smell'], brew_aroma_associations: ['cedar', 'mint'], mind_memory: []});
    data.world.holders.push({id: second, kind: 'body', place: 'bench', properties: {mind_awake: true,
        senses: secondCanSmell ? ['smell'] : ['sight'], brew_aroma_associations: ['mint'], mind_memory: []}});
    const aromaResults = [[recipient.id, sealed ? null : 'cedar'], [second, sealed || !secondCanSmell ? null : 'mint']]
        .map(([holder, to]) => ({holder, belief: aroma, direction: to ? 'changed' : 'unchanged', to}));
    const smell = (id, observer) => ({id, working: {family: 'brew-assay',
        method: brewScentMethod({id: aroma, part: active, minimum: 1}), bindings: {flask, observer}}});
    data.timeline.push(
        {id: 'subject-leaves', ops: [{op: 'move', holder: subject, to: 'gallery'},
            {op: 'property', holder: recipient.id, property: 'agency_goal', value: 'study'}]},
        restore('restore-before-choice'),
        {id: 'choose-route', advanceTo: 3, expect: [position(closed && fixated ? 'unchanged' : 'changed',
            follows ? 'gallery' : fixated ? 'bench' : 'study')]},
        {id: 'subject-moves-again', ops: [{op: 'move', holder: subject, to: 'stairs'}]},
        restore('restore-moving-subject'),
        {id: 'track-live-subject', advanceTo: 4, expect: [position(follows ? 'changed' : 'unchanged',
            follows ? 'stairs' : fixated ? 'bench' : 'study')]},
        {id: 'fixation-ends', advanceTo: 8, expect: [position(fixated ? 'changed' : 'unchanged', 'study'),
            property('mind_fixation', fixated ? 'changed' : 'unchanged', null)]},
        restore('restore-ended'),
    );
    data.expect.push(position('changed', 'study'));
    for (const step of data.timeline) if (step.advanceTo !== undefined) step.advanceTo++;
    data.timeline.unshift(smell('first-aroma', recipient), smell('second-aroma', ref('body', second)),
        restore('restore-pending-aroma'),
        {id: 'read-aromas', advanceTo: 1, expect: [...aromaResults, part(flask.id, active, 'unchanged', 3)]},
        restore('restore-aromas'));
    if (sealed) data.timeline.splice(5, 0, {id: 'open-flask-for-dose',
        ops: [{op: 'property', holder: flask.id, property: 'brew_sealed', value: false}]});
    data.expect.push(...aromaResults);
    return data;
}

export function storedInfusionCase({wait = 6, rate = 1, warmAt = null, decant = false, decantAmount = 12} = {}) {
    const active = 'storage-active';
    const lots = {extract: {id: 'extract', material: 'extract', amount: 12, properties: {[active]: 1000}}};
    const method = brewMethod({id: 'trial.stored-infusion', slots: [{id: 'extract'}], process: [
        {op: 'divide', minutes: 1, options: {doses: 1}},
        {op: 'pour', options: {index: 0, shelfLife: {life: 8, rate}}},
    ]});
    const data = stocked({lots, method, measured: {name: active, amount: 12}});
    const serveAt = decant ? Math.max(wait, warmAt ?? 1, 1) + 1 : wait + 1;
    const elapsed = serveAt + 1;
    const spent = warmAt === null ? elapsed * rate : (warmAt - 1) * rate + (elapsed - (warmAt - 1));
    const servedAmount = decant ? decantAmount : 12;
    const remaining = servedAmount - Math.floor(servedAmount * Math.min(8, spent) / 8);
    const awake = remaining < 9;
    const served = serving('trial.stored-infusion.serve', 'oral', [sleep(active, 9, 3)], serveAt,
        {name: active, amount: remaining}, [property('mind_awake', awake ? 'unchanged' : 'changed', awake),
            part(recipient.id, `${active}:spent`, remaining < servedAmount ? 'up' : 'unchanged', servedAmount - remaining)],
        awake ? undefined : {minutes: 3, expect: [property('mind_awake', 'changed', true)]});
    if (warmAt !== null) {
        data.engine.shared.properties = [{id: 'brew_storage_rate', type: 'level', min: 0, max: 10000}];
        data.world.holders.push({id: 'warm-shelf', kind: 'thing', as: ['storage'], place: 'bench',
            properties: {brew_storage_rate: 1000}});
        data.timeline.push(
            {id: 'before-storage-change', advanceTo: warmAt - 1},
            {id: 'set-warm-storage', working: {family: 'brew',
                bindings: {flask, storage: ref('storage', 'warm-shelf')},
                method: {id: 'trial.warm-storage', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask', storage: 'storage'},
                    steps: [{op: 'change-flask-storage', minutes: 1, bindings: {flask: 'flask', storage: 'storage'}}]}}},
            restore('restore-pending-storage-change'), {id: 'changed-storage', advanceTo: warmAt}, restore('restore-warmed'));
    }
    if (decant) {
        const receiver = ref('flask', 'receiver');
        data.world.holders.push({id: receiver.id, kind: 'thing', as: ['flask'], place: 'bench'});
        data.timeline.push({id: 'ready-to-decant', advanceTo: serveAt - 1},
            {id: 'decant', working: {family: 'brew', bindings: {flask, receiver},
                method: {id: 'trial.decant-infusion', revision: 1, law: BREW_LAW.ref,
                    roles: {flask: 'flask', receiver: 'flask'},
                    steps: [{op: 'decant-flask', minutes: 1, bindings: {flask: 'flask', receiver: 'receiver'},
                        ...(decantAmount === 12 ? {} : {options: {amount: decantAmount}})}]}}},
            restore('restore-pending-decant'),
            {id: 'decanted', advanceTo: serveAt, expect: [part(flask.id, active, 'down', 12 - decantAmount),
                part(receiver.id, active, 'up', decantAmount)]},
            restore('restore-decanted'));
        served[0].working.bindings.flask = receiver;
        served[2].expect[0] = part(receiver.id, active, 'down', 0);
    }
    data.timeline.push({id: 'stored', advanceTo: serveAt}, restore('restore-storage'), ...served);
    data.expect = [data.expect[0],
        part(recipient.id, active, remaining ? 'up' : 'unchanged', remaining),
        part(recipient.id, `${active}:spent`, remaining < servedAmount ? 'up' : 'unchanged', servedAmount - remaining)];
    if (decant && decantAmount < 12) data.expect.push(part(flask.id, active, 'up', 12 - decantAmount));
    return data;
}

export function blendedStorageCase({warmRate = 1, secondOrigin = 'store'} = {}) {
    const active = 'blend-active', spent = `${active}:spent`;
    const warm = ref('flask', 'warm-flask'), product = ref('flask', 'blend');
    const vessel = ref('vessel', 'cauldron');
    const lot = (id, origin) => ({id, origin, material: 'infusion-extract', amount: 8, properties: {[active]: 1000}});
    const bottle = (id, rate) => brewMethod({id: `trial.bottle-${id}`, slots: [{id}], process: [
        {op: 'divide', minutes: 1, options: {doses: 1}}, {op: 'pour', options: {index: 0, shelfLife: {life: 8, rate}}},
    ]});
    const data = stocked({lots: {cool: lot('cool', 'garden'), warm: lot('warm', secondOrigin)},
        method: bottle('cool', 0), measured: {name: active, amount: 8}});
    delete data.timeline[0].working.bindings.warm;
    data.world.holders.push(...[warm, product].map(({id}) => ({id, kind: 'thing', as: ['flask'], place: 'bench'})));
    const retained = 16 - Math.min(8, Math.floor(4 * warmRate));
    const sharedOrigin = secondOrigin === 'garden' || retained === 8;
    const servedPart = sharedOrigin ? 'garden-active' : active;
    const sleeps = retained >= 14;
    data.timeline.push(
        {id: 'bottle-warm', working: {family: 'brew', method: bottle('warm', warmRate), bindings: {vessel, flask: warm, warm: ref('lot', 'warm')}}},
        {id: 'warm-bottled', advanceTo: 2, expect: [part(warm.id, active, 'up', 8)]},
        restore('restore-both-bottles'),
        {id: 'blend', working: {family: 'brew', bindings: {vessel, flask, warm, product},
            method: {id: 'trial.blend-infusions', revision: 1, law: BREW_LAW.ref,
                roles: {vessel: 'vessel', flask: 'flask', warm: 'flask', product: 'flask'}, steps: [
                    {op: 'admit-fraction', minutes: 1, bindings: {vessel: 'vessel', flask: 'flask'}},
                    {op: 'admit-fraction', minutes: 3, bindings: {vessel: 'vessel', flask: 'warm'}},
                    {op: 'react', bindings: {vessel: 'vessel'}, options: {reactions: [
                        {id: 'garden-origin', requiresOrigins: {[active]: 'garden'}, reactants: {[active]: 1}, products: {'garden-active': 1}},
                    ]}},
                    {op: 'divide', bindings: {vessel: 'vessel'}, options: {doses: 1}},
                    {op: 'pour', bindings: {vessel: 'vessel', flask: 'product'}, options: {index: 0}},
                ]}}},
        {id: 'first-admitted', advanceTo: 3, expect: [part(flask.id, active, 'down', 0)]}, restore('restore-between-admissions'),
        {id: 'blend-bottled', advanceTo: 6, expect: [part(warm.id, active, 'down', 0), part(product.id, servedPart, 'up', retained),
            part(product.id, spent, retained < 16 ? 'up' : 'unchanged', 16 - retained)]}, restore('restore-blend'),
    );
    const served = serving('trial.serve-blend', 'oral', [sleep(servedPart, 14, 3)], 6,
        {name: servedPart, amount: retained}, [property('mind_awake', sleeps ? 'changed' : 'unchanged', !sleeps)],
        sleeps ? {minutes: 3, expect: [property('mind_awake', 'changed', true)]} : undefined);
    served[0].working.bindings.flask = product;
    served[2].expect[0] = part(product.id, servedPart, 'down', 0);
    data.timeline.push(...served);
    data.expect.splice(-1, 1, part(recipient.id, servedPart, 'up', retained),
        part(recipient.id, spent, retained < 16 ? 'up' : 'unchanged', 16 - retained));
    return data;
}

export function livingDeathUptakeCase({route = 'oral', halfServing = false} = {}) {
    const {lots, vessel, method} = draughtOfLivingDeathRecipe({preparation: 'crush', beanUnits: 12, precursor: 6,
        carrier: 94, strokes: 'LLLLLLLR', storage: {days: 0, vessel: 'sealed'}});
    const bodyPack = 'l.living_body';
    const liquidKey = 'oral-liquid', activeKey = 'settled-soporific';
    const liquid = `energy:${liquidKey}`, active = `energy:${activeKey}`;
    const response = (direction, to) => ({holder: recipient.id, quantity: 'responsiveness', direction, to});
    const oral = route === 'oral';
    const delivered = halfServing ? 4 : 8;
    const suppressed = Math.max(0, 100 - delivered * 14);
    const recovery = Math.ceil((100 - suppressed) / 7);
    const data = stocked({lots, vessel, method: withPour(method, true), route, measured: {name: 'settled', amount: 8},
        responses: [{part: 'settled', minimum: 1, route: 'oral', liquidUptake: {part: 'settled', liquidKey, activeKey}}],
        effect: [response(oral ? 'down' : 'unchanged', oral ? suppressed : 100),
            ...[[flask.id, liquid], [flask.id, active], [recipient.id, liquid]].map(([holder, quantity]) =>
                ({holder, quantity, direction: 'unchanged', to: 0}))],
        recovery: oral ? {minutes: recovery, expect: [response('up', 100)]} : undefined});
    if (halfServing) {
        const serving = data.timeline.find(step => step.id === 'serve');
        serving.working.method.steps[0].options.amount = 54;
        const settlement = data.timeline.find(step => step.id === 'settle-serving');
        settlement.expect.splice(0, 2, part(flask.id, 'settled', 'down', 4), part(recipient.id, 'settled', 'up', 4));
        data.expect[data.expect.length - 1] = part(recipient.id, 'settled', 'up', 4);
    }
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {dose: {liquid, active, baseline: 100, suppressionPerUnit: 14, recoveryPerMinute: 7}}};
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 360, [liquid]: 0, responsiveness: 100},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})},
    });
    if (oral) data.timeline.splice(-1, 0, {id: 'before-body-recovery',
        advanceTo: data.timeline.at(-1).advanceTo - 1, expect: [response('up', suppressed + (recovery - 1) * 7)]});
    data.expect.push(response('unchanged', 100));
    return data;
}

// HPPE066 shows oral dosing, revival and questioning as distinct steps.
export function veritaserumCase({route = 'oral', delay = 0, awake = true, remembered = true,
    silenced = false, recalledCode = 'larch'} = {}) {
    const active = 'disclosure-extract', record = 'locker-code';
    const listener = ref('body', 'questioner');
    const canAnswer = awake && !silenced;
    const discloses = route === 'oral' && delay < 3 && canAnswer && remembered;
    const memory = (direction, to) => ({holder: listener.id, property: 'mind_memory', direction, to});
    const belief = (direction, to) => ({holder: listener.id, belief: record, direction, to});
    const data = stocked({initial: {[active]: 3}, measured: {name: active, amount: 3}});
    data.engine.packs.push(KNOWLEDGE_PACK);
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES), {id: 'code', type: 'label'}];
    data.world.holders.push({id: listener.id, kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}});
    data.world.holders.push({id: 'locker', kind: 'thing', place: 'bench', properties: {code: 'larch'}});
    const patient = data.world.holders.find(holder => holder.id === recipient.id);
    Object.assign(patient.properties, {mind_awake: awake, mind_speech_disrupted: silenced, mind_memory: remembered ? [record] : []});
    patient.state = {[KNOWLEDGE_PACK]: {records: {[record]: defineRecord({
        id: record, subject: {kind: 'fact', id: record}, true: {holder: 'locker', property: 'code'}, believed: {value: recalledCode},
    })}}};
    const method = brewDoseMethod({id: 'hp.serve.veritaserum', route, responses: [{
        part: active, route: 'oral', minimum: 3, sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
        details: {minutes: 3, mind: {faculty: 'disclosure'}},
    }]});
    data.timeline.push(
        {id: 'dose', working: {family: 'brew-dose', method, bindings: {flask, recipient}}},
        restore('restore-pending-dose'),
        {id: 'dosed', advanceTo: 2, expect: [part(flask.id, active, 'down', 0), part(recipient.id, active, 'up', 3),
            memory('unchanged', [])]}, restore('restore-dosed'),
        {id: 'ask', working: {family: 'knowledge', bindings: {speaker: recipient, listener},
            method: {id: 'question.locker-code', revision: 1, law: KNOWLEDGE_LAW.ref,
                roles: {speaker: 'body', listener: 'body'}, steps: [{op: 'answer', minutes: Math.max(1, delay),
                    bindings: {speaker: 'speaker', listener: 'listener'}, options: {record}}]}}},
        restore('restore-pending-answer'),
        {id: 'answer', advanceTo: 2 + Math.max(1, delay),
            ...(!canAnswer ? {interruption: {working: 'case.ask', reason: 'speaker-cannot-answer'}} : {}),
            expect: [memory(discloses ? 'changed' : 'unchanged', discloses ? [record] : []),
                belief(discloses ? 'changed' : 'unchanged', discloses ? recalledCode : null)]},
        restore('restore-answer'),
    );
    data.expect = [part(recipient.id, active, 'up', 3), belief(discloses ? 'changed' : 'unchanged', discloses ? recalledCode : null)];
    return data;
}

// HPPE064/065 describe a lucky interval and a successful attempt to get a memory.
export function felixFelicisCase({route = 'oral', expired = false, unrelated = false, odds = 300, amount = 3,
    drawRoot = 12, succeeds = route === 'oral' && amount >= 3 && !expired && !unrelated && odds > 0} = {}) {
    const data = veritaserumCase();
    const active = 'felix-active', recipientId = recipient.id;
    const action = 'seek-recollection', bonus = 400, minutes = 4;
    const lucky = route === 'oral' && amount >= 3;
    const toxic = route === 'oral' && amount >= 6;
    const vitality = {holder: 'questioner', quantity: 'vitality', direction: toxic ? 'down' : 'unchanged', to: toxic ? 8 : 10};
    const received = part('questioner', active, 'up', amount);
    const field = {lawField: 'luck.case.dose.0'};
    const learned = {holder: 'questioner', belief: 'locker-code',
        direction: succeeds ? 'changed' : 'unchanged', to: succeeds ? 'larch' : null};
    const effort = {holder: 'questioner', quantity: 'stamina', direction: 'down', to: 1};
    const [dose, , dosed, , ask, , answer] = data.timeline;
    data.world.drawRoot = drawRoot;
    data.world.holders.find(holder => holder.id === flask.id).quantities = {[brewDoseQuantity(active)]: 6};
    data.world.holders.find(holder => holder.id === 'questioner').quantities = {stamina: 2, vitality: 10};
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 10}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    dose.working.bindings.recipient = ref('body', 'questioner');
    dose.working.method = brewDoseMethod({id: 'hp.serve.felix', route, amount, responses: [
        {part: active, route: 'oral', minimum: 6, luck: {action, bonus, minutes},
            sentence: {verb: 'remove', object: 'vitality', time: 'instant'}, details: {amount: 2}},
        {part: active, route: 'oral', minimum: 3, luck: {action, bonus, minutes}},
    ]});
    dosed.expect = [part(flask.id, active, 'down', 6 - amount), received, vitality,
        {...field, direction: lucky ? 'changed' : 'unchanged', to: lucky ?
            {scope: 'questioner', kind: 'working-luck', params: {action, bonus}, until: 6} : null}];
    ask.working.id = 'felix-question';
    const question = ask.working.method.steps[0];
    question.minutes = expired ? 4 : 1;
    Object.assign(question.options, {willing: true, opportunity: {action: unrelated ? 'other-question' : action, odds, effort: 1}});
    answer.advanceTo = 2 + question.minutes;
    answer.expect = [learned, effort,
        {holder: recipientId, property: 'mind_compelled_disclosure', direction: 'unchanged', to: null}];
    if (expired && lucky) answer.expect.push({...field, direction: 'changed', to: null});
    data.expect = [received, learned, effort, vitality];
    return data;
}

export function maturedFelixCase({early = false} = {}) {
    const stewMinutes = FELIX_STEW_MINUTES - Number(early);
    const material = early ? 'felix-base' : 'felix-active';
    const {lots, method} = felixMaturation({stewMinutes});
    const brew = stocked({lots, method, measured: {name: material, amount: 6}});
    const trial = felixFelicisCase({drawRoot: 4, succeeds: !early});
    delete trial.world.holders.find(holder => holder.id === flask.id).quantities;
    trial.world.holders.push(brew.world.holders.find(holder => holder.id === lots.base.id));
    Object.assign(trial.engine.host.things, brew.engine.host.things);
    for (const step of trial.timeline) if (step.advanceTo !== undefined) step.advanceTo += stewMinutes;
    const dosed = trial.timeline.find(step => step.id === 'dosed');
    if (early) {
        dosed.expect[0] = part(flask.id, material, 'down', 3);
        dosed.expect[1] = part('questioner', material, 'up', 3);
        dosed.expect[3] = {lawField: dosed.expect[3].lawField, direction: 'unchanged', to: null};
        trial.expect[0] = dosed.expect[1];
    } else {
        dosed.expect[3].to.until += stewMinutes;
    }
    brew.timeline.splice(2, 0, {id: 'mid-maturation', advanceTo: Math.floor(stewMinutes / 2),
        expect: [part(flask.id, material, 'unchanged', 0)]}, restore('restore-mid-maturation'));
    trial.timeline.unshift(...brew.timeline);
    trial.expect.push(brew.expect[0], part(flask.id, material, 'up', 3));
    return trial;
}

// HPPE067 establishes the counteragent. Its administration is an authored trial.
export function veritaserumAntidoteCase({before = false, route = 'oral', waitForExpiry = false, willing = false} = {}) {
    const data = veritaserumCase();
    const active = 'disclosure-counteragent', antidote = ref('flask', 'antidote');
    const [dose, pendingDose, dosed, restoredDose, ask, pendingAnswer, answer, restoredAnswer] = data.timeline;
    const countered = route === 'oral' && !waitForExpiry && !willing;
    const antidoteAt = before ? 2 : 4;
    const doseAt = before ? 4 : 2;
    const protectionMinutes = 4;
    const questionAt = Math.max(antidoteAt, doseAt);
    dose.working.method.steps[0].options.responses[0].details.minutes = 8;
    dosed.advanceTo = doseAt;
    data.world.holders.push({id: antidote.id, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[brewDoseQuantity(active)]: 2}});
    const remedy = [
        {id: 'give-antidote', working: {family: 'brew-dose', bindings: {flask: antidote, recipient},
            method: brewDoseMethod({id: 'hp.serve.veritaserum-antidote', route, responses: [{
                part: active, route: 'oral', minimum: 2, sentence: {verb: 'block', object: 'mind', time: 'sustained'},
                details: {minutes: protectionMinutes, mind: {faculty: 'disclosure'}},
            }]})}},
        restore('restore-pending-antidote'),
        {id: 'antidote-settled', advanceTo: antidoteAt, expect: [
            part(antidote.id, active, 'down', 0), part(recipient.id, active, 'up', 2),
        ]}, restore('restore-antidote'),
    ];
    const oralDose = [dose, pendingDose, dosed, restoredDose];
    ask.working.method.steps[0].options.willing = willing;
    answer.advanceTo = waitForExpiry ? antidoteAt + protectionMinutes : questionAt + 1;
    ask.working.method.steps[0].minutes = answer.advanceTo - questionAt;
    if (countered) {
        answer.expect = answer.expect.map(check => ({...check, direction: 'unchanged', to: check.belief ? null : []}));
        data.expect[1] = {...data.expect[1], direction: 'unchanged', to: null};
    }
    answer.expect.push(property('mind_compelled_disclosure', 'unchanged', true),
        property('mind_disclosure_protected', route === 'oral' && waitForExpiry ? 'changed' : 'unchanged',
            route === 'oral' && !waitForExpiry ? true : null));
    data.timeline = [...(before ? [...remedy, ...oralDose] : [...oralDose, ...remedy]),
        ask, pendingAnswer, answer, restoredAnswer];
    data.expect.push(part(recipient.id, active, 'up', 2));
    return data;
}

// HPPE057 shows painful overnight regrowth of missing arm bones.
export function skeleGroCase({route = 'oral', amount = 4, existingBone = 0} = {}) {
    const active = 'bone-growth-extract', bodyPack = 'l.living_body';
    const liquidKey = 'bone-growth-liquid', activeKey = 'bone-growth-active';
    const liquid = `energy:${liquidKey}`, activeAccount = `energy:${activeKey}`;
    const bone = 'arm-bone', reserve = 'bone-growth-reserve';
    const capacity = 480, pain = 6;
    const growth = route === 'oral' ? Math.min(capacity - existingBone, 120 * amount) : 0;
    const account = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const data = stocked({initial: {[active]: 4}, measured: {name: active, amount: 4}});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {boneGrowth: {liquid, active: activeAccount, capacity,
        growthPerUnit: 120, growthPerMinute: 1, pain}}};
    const patient = data.world.holders.find(holder => holder.id === recipient.id);
    patient.tags = ['living.body'];
    patient.quantities = {satiety: 0, [liquid]: 0, [bone]: existingBone, [reserve]: 0};
    patient.state = {[bodyPack]: livingBodyState({species: 'human', rate: 0})};
    patient.properties.mind_pain = 1;
    const method = brewDoseMethod({id: 'hp.serve.skele-gro', route, amount, responses: [{
        part: active, route: 'oral', minimum: 1, liquidUptake: {part: active, liquidKey, activeKey},
    }]});
    data.timeline.push(
        {id: 'dose', working: {family: 'brew-dose', method, bindings: {flask, recipient}}},
        restore('restore-pending-dose'),
        {id: 'uptake', advanceTo: 2, expect: [part(flask.id, active, 'down', 4 - amount), part(recipient.id, active, 'up', amount),
            account(bone, 'unchanged', existingBone), account(reserve, growth ? 'up' : 'unchanged', growth),
            property('mind_pain', growth ? 'changed' : 'unchanged', growth ? 1 + pain : 1)]},
        restore('restore-uptake'),
    );
    const halfway = Math.floor(growth / 2);
    if (halfway) data.timeline.push({id: 'mid-growth', advanceTo: 2 + halfway, expect: [
        account(bone, 'up', existingBone + halfway), account(reserve, 'down', growth - halfway),
        property('mind_pain', 'unchanged', 1 + pain),
    ]}, restore('restore-mid-growth'));
    data.timeline.push({id: 'regrown', advanceTo: 2 + Math.max(growth, 1), expect: [
        account(bone, growth ? 'up' : 'unchanged', existingBone + growth), account(reserve, growth ? 'down' : 'unchanged', 0),
        property('mind_pain', growth ? 'changed' : 'unchanged', 1),
    ]}, restore('restore-regrown'));
    data.expect = [part(recipient.id, active, 'up', amount), account(bone, growth ? 'up' : 'unchanged', existingBone + growth)];
    return data;
}

// HPPE035/036 separate a sugar interaction from preservation of the mind.
export function wolfsbaneCase({early = false, sweetened = false} = {}) {
    const active = 'wolfsbane-active', inert = 'wolfsbane-inert';
    const material = sweetened ? inert : active;
    const amount = sweetened ? 5 : 4;
    const protectedAtChange = !early && !sweetened;
    const lots = {base: {id: 'base', material: 'wolfsbane-base', amount: 4, properties: {[active]: 1000}}};
    if (sweetened) lots.sugar = {id: 'sugar', material: 'sugar', amount: 1, properties: {sugar: 1000}};
    const method = brewMethod({id: 'hp.brew.wolfsbane-serving', slots: Object.keys(lots).map(id => ({id})), process: [
        {op: 'react', minutes: 1, options: {reactions: [
            {id: 'sugar-incompatibility', reactants: {[active]: 4, sugar: 1}, products: {[inert]: 5}},
        ]}},
        {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    const data = stocked({lots, method, measured: {name: material, amount}, target: {form: 'human'}});
    data.engine.packs.push('l.creature_form');
    data.world.holders.push({id: 'woods', kind: 'place'}, {id: 'room', kind: 'place'});
    data.world.links = ['woods', 'room'].map(to => ({id: `path-${to}`, kind: 'path', from: 'bench', to}));
    const doseAt = early ? 1 : 5;
    const moon = 12, dawn = 16;
    const layers = 'temporary-form-layers';
    const guard = 'mind_instinct_protected';
    const position = (direction, to) => ({holder: recipient.id, position: true, direction, to});
    const form = property(layers, 'changed', [`wolf|2|${dawn}`]);
    const dose = brewDoseMethod({id: 'hp.serve.wolfsbane', route: 'oral', responses: [{
        part: active, route: 'oral', minimum: 4, sentence: {verb: 'block', object: 'mind', time: 'sustained'},
        details: {minutes: 9, mind: {faculty: 'instinct'}},
    }]});
    // The authored moon minute starts the ordinary creature form working.
    // The mind stimulus is separate, so both cases undergo the same change.
    const definition = {id: 'hp.wolf-change', revision: 1, routes: [{
        id: 'moon-change', from: 'human', to: 'wolf', trigger: 'event', minutes: 1,
        roles: {animal: 'body'}, temporary: {duration: dawn - moon, priority: 2},
        needs: [{op: 'is', clock: true, value: moon}],
    }]};
    data.timeline.push(
        {id: 'before-dose', advanceTo: doseAt},
        {id: 'drink', working: {family: 'brew-dose', method: dose, bindings: {flask, recipient}}},
        restore('restore-pending-drink'),
        {id: 'dosed', advanceTo: doseAt + 2, expect: [part(flask.id, material, 'down', 0),
            part(recipient.id, material, 'up', amount), property(guard, sweetened ? 'unchanged' : 'changed', sweetened ? null : true)]},
        {id: 'before-moon', advanceTo: moon - 1},
        {id: 'change', working: {family: 'evolution', definition, method: 'moon-change', bindings: {animal: recipient}}},
        restore('restore-pending-change'),
        {id: 'transformed', advanceTo: moon, expect: [form, property(guard, early && !sweetened ? 'changed' : 'unchanged',
            protectedAtChange ? true : null)]},
        {id: 'choose-room', ops: [{op: 'property', holder: recipient.id, property: 'agency_goal', value: 'room'}]},
        {id: 'instinct', sentence: {verb: 'bind', object: 'mind', time: 'sustained'},
            details: {place: 'bench', target: {shape: 'holder', id: recipient.id}, minutes: dawn - moon,
                mind: {faculty: 'instinct', to: 'woods'}}},
        restore('restore-transformed'),
        {id: 'move-while-transformed', advanceTo: moon + 1, expect: [position('changed', protectedAtChange ? 'room' : 'woods'),
            property(layers, 'unchanged', [`wolf|2|${dawn}`])]},
        {id: 'return-to-human', advanceTo: dawn, expect: [property(layers, 'changed', null)]},
        restore('restore-human'),
    );
    data.expect.pop();
    data.expect.push(part(recipient.id, material, 'up', amount));
    return data;
}

// HPPE059 shows rapid cold relief followed by steam from the ears.
export function pepperupCase({route = 'oral', amount = 6} = {}) {
    const active = 'pepperup-extract', burden = 'cold-burden';
    const oral = route === 'oral', steams = oral && amount >= 3;
    const eased = oral ? Math.min(3, Math.floor(amount / 2)) : 0;
    const data = stocked({initial: {[active]: 6}, measured: {name: active, amount: 6}});
    data.engine.packs.push('b.body_steam');
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES), {id: burden, unit: 'symptom-unit', min: 0, max: 10}];
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {[burden]: 3};
    data.world.holders.find(holder => holder.id === 'bench').quantities = {humidity: 0};
    data.world.holders.push({id: 'hall', kind: 'place', quantities: {humidity: 0}});
    const humidity = (holder, to) => ({holder, quantity: 'humidity', direction: steams ? 'up' : 'unchanged', to});
    const field = {lawField: 'steam.case.serve.0'};
    const cold = {holder: recipient.id, quantity: burden, direction: eased ? 'down' : 'unchanged', to: 3 - eased};
    const received = part(recipient.id, active, 'up', amount);
    const method = brewDoseMethod({id: 'hp.serve.pepperup', route, amount,
        treatment: {route: 'oral', pairs: [{quantity: burden, part: active, per: 2, reason: 'cold-relief'}]},
        responses: [{part: active, route: 'oral', minimum: 3, steam: {minutes: 180, humidityPerMinute: 1}}]});
    data.timeline.push(
        {id: 'serve', working: {family: 'brew-dose', method, bindings: {flask, recipient}}},
        restore('restore-pending-serving'),
        {id: 'treated', advanceTo: 2, expect: [part(flask.id, active, 'down', 6 - amount), received, cold,
            {...field, direction: steams ? 'changed' : 'unchanged', to: steams ?
                {scope: recipient.id, kind: 'body-steam', params: {humidityPerMinute: 1}, until: 182} : null}]},
        restore('restore-treated'),
        {id: 'steam-in-infirmary', advanceTo: 92, expect: [humidity('bench', steams ? 90 : 0)]},
        {id: 'walk-out', ops: [{op: 'move', holder: recipient.id, to: 'hall'}]},
        restore('restore-moved-steam-source'),
        {id: 'steam-in-hall', advanceTo: 182, expect: [humidity('hall', steams ? 90 : 0),
            {holder: 'bench', quantity: 'humidity', direction: 'unchanged', to: steams ? 90 : 0},
            {...field, direction: steams ? 'changed' : 'unchanged', to: null}]},
        {id: 'after-steam', advanceTo: 183, expect: [
            {holder: 'hall', quantity: 'humidity', direction: 'unchanged', to: steams ? 90 : 0}]},
        restore('restore-after-steam'),
    );
    data.expect = [received, cold, humidity('bench', steams ? 90 : 0), humidity('hall', steams ? 90 : 0)];
    return data;
}

// HPPE058 shows repeated supportive doses during continued bleeding.
export function bloodReplenishingCase({route = 'oral', blood = 60} = {}) {
    const active = 'blood-replenishing-extract';
    const bodyPack = 'l.living_body';
    const liquid = 'replenishing-liquid', uptake = 'replenishing-active';
    const delivered = route === 'oral';
    const volume = (direction, to) => ({holder: recipient.id, quantity: 'circulating-blood', direction, to});
    const loss = {holder: recipient.id, quantity: 'blood-loss-rate', direction: 'unchanged', to: 2};
    const afterFirst = Math.min(100, blood - 4 + (delivered ? 16 : 0));
    const afterSecond = Math.min(100, afterFirst - 4 + (delivered ? 16 : 0));
    const data = stocked({initial: {[active]: 4}, measured: {name: active, amount: 4}});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {circulation: {liquid: `energy:${liquid}`, active: `energy:${uptake}`,
        capacity: 100, volumePerUnit: 4}}};
    const second = ref('flask', 'second-serving');
    data.world.holders.push({id: second.id, kind: 'thing', as: ['flask'], place: 'bench',
        quantities: {[brewDoseQuantity(active)]: 4}});
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 360, [`energy:${liquid}`]: 0,
            'circulating-blood': blood, 'blood-loss-rate': 2},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})},
    });
    const method = brewDoseMethod({id: 'hp.serve.blood-replenishing', route,
        responses: [{part: active, route: 'oral', minimum: 1, liquidUptake: {part: active, liquidKey: liquid, activeKey: uptake}}]});
    const serve = (id, source, at, before, retained, received) => [
        {id, working: {family: 'brew-dose', method, bindings: {flask: source, recipient}}},
        restore(`restore-pending-${id}`),
        {id: `settle-${id}`, advanceTo: at, expect: [volume(retained === before ? 'unchanged' : retained > before ? 'up' : 'down', retained), loss,
            part(source.id, active, 'down', 0), part(recipient.id, active, 'up', received)]},
        restore(`restore-settled-${id}`),
    ];
    data.timeline.push(...serve('first-dose', flask, 2, blood, afterFirst, 4),
        ...serve('second-dose', second, 4, afterFirst, afterSecond, 8),
        {id: 'continued-bleeding', advanceTo: 9, expect: [volume('down', afterSecond - 10), loss]},
        restore('restore-continued-bleeding'));
    data.expect = [loss, part(recipient.id, active, 'up', 8)];
    return data;
}

// HPPE055 shows a topical wound closure without replacing blood already lost.
export function dittanyCase({route = 'topical', amount = 3} = {}) {
    const active = 'dittany-essence', bodyPack = 'l.living_body';
    const data = stocked({initial: {[active]: 3}, measured: {name: active, amount}});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {
        circulation: {liquid: 'energy:replenishing-liquid', active: 'energy:replenishing-active', capacity: 100, volumePerUnit: 4},
        skinInjury: {kind: 'open-cut', capacity: 10, unitsPerLesion: 1},
    }};
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 360, 'circulating-blood': 60, 'blood-loss-rate': 2, 'skin-lesions': 1},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})},
    });
    const treatment = {route: 'topical', pairs: [
        {quantity: 'blood-loss-rate', part: active, reason: 'close the bleeding cut'},
        {quantity: 'skin-lesions', part: active, reason: 'close the remaining lesion'},
    ]};
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const bleed = route === 'topical' ? Math.max(0, 2 - amount) : 2;
    const lesion = route === 'topical' && amount === 3 ? 0 : 1;
    data.timeline = [
        {id: 'apply', working: {family: 'brew-dose', method: brewDoseMethod({id: 'hp.serve.dittany', route, amount, treatment}),
            bindings: {flask, recipient}}}, restore('restore-pending-dittany'),
        {id: 'treated', advanceTo: 2, expect: [read('circulating-blood', 'down', 56),
            read('blood-loss-rate', bleed < 2 ? 'down' : 'unchanged', bleed), read('skin-lesions', lesion ? 'unchanged' : 'down', lesion)]},
        restore('restore-treated-cut'),
        {id: 'observe-bleeding', advanceTo: 5, expect: [read('circulating-blood', bleed ? 'down' : 'unchanged', 56 - 3 * bleed)]},
        restore('restore-observed-cut'),
    ];
    data.expect = [part(flask.id, active, 'down', 3 - amount), part(recipient.id, active, 'up', amount)];
    return data;
}

export function silverAndDittanyCase({powdered = true, route = 'topical'} = {}) {
    const {lots, method} = silverAndDittany({powdered});
    const active = 'bite-seal', bodyPack = 'l.living_body';
    const seals = powdered && route === 'topical';
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const settleAt = powdered ? 6 : 5;
    const bloodAtTreatment = 60 - 2 * settleAt;
    const data = stocked({lots, method: withPour(method, true),
        measured: {name: powdered ? active : 'silver', amount: powdered ? 4 : 2}, route,
        effect: [read('circulating-blood', 'down', bloodAtTreatment),
            read('blood-loss-rate', seals ? 'down' : 'unchanged', seals ? 0 : 2),
            read('skin-lesions', 'unchanged', 1)]});
    if (powdered) data.timeline.splice(2, 0, {id: 'silver-prepared', advanceTo: 1,
        expect: [part(flask.id, active, 'unchanged', 0)]}, restore('restore-before-binding'));
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {
        circulation: {liquid: 'energy:replenishing-liquid', active: 'energy:replenishing-active', capacity: 100, volumePerUnit: 4},
        skinInjury: {kind: 'werewolf-bite', capacity: 10, unitsPerLesion: 1},
    }};
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 360, 'circulating-blood': 60, 'blood-loss-rate': 2, 'skin-lesions': 1},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 1})},
    });
    data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.treatment = {route: 'topical', pairs: [
        {quantity: 'blood-loss-rate', part: active, per: 2, reason: 'Seal the fresh bite.'},
    ]};
    data.timeline.push({id: 'check-blood-loss', advanceTo: settleAt + 3,
        expect: [read('circulating-blood', seals ? 'unchanged' : 'down', bloodAtTreatment - (seals ? 0 : 6))]},
    restore('restore-bite-outcome'));
    if (!powdered) data.expect.push(part(recipient.id, active, 'unchanged', 0), part(recipient.id, 'dittany', 'up', 2));
    return data;
}

export function commonPoisonAntidoteCase({route = 'oral'} = {}) {
    const {lots, method} = commonPoisonAntidote();
    const active = 'mistletoe-antidote', bodyPack = 'l.living_body';
    const burden = 'poison:common', other = 'poison:unmatched', breathing = 'respiratory-capacity';
    const helped = route === 'oral';
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const data = stocked({lots, method: withPour(method, true), measured: {name: active, amount: 4}, route,
        effect: [read(burden, helped ? 'down' : 'unchanged', helped ? 0 : 4), read(other, 'unchanged', 2),
            read(breathing, 'down', 4)]});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {poison: {burden, threshold: 3, capacity: 10}}};
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES), {id: 'poison', keyed: true, unit: 'burden', min: 0, max: 20}];
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 0, [burden]: 4, [other]: 2, [breathing]: 10},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})},
    });
    data.timeline.find(step => step.id === 'serve').working.method.steps[0].options.treatment = {route: 'oral', pairs: [
        {quantity: burden, part: active, reason: 'Counter the susceptible poison.'},
    ]};
    data.timeline.push({id: 'observe-breathing', advanceTo: 9, expect: [read(breathing, helped ? 'up' : 'down', helped ? 7 : 1),
        read(other, 'unchanged', 2)]}, restore('restore-breathing'));
    return data;
}

export function burdenSizedAntidoteCase({remainingBurden = 2, aged = false} = {}) {
    const data = commonPoisonAntidoteCase();
    const active = 'mistletoe-antidote', burden = 'poison:common';
    const serve = data.timeline.findIndex(step => step.id === 'serve');
    data.timeline[serve].working.method.steps[0].options.sizeForBurden = burden;
    data.timeline.splice(serve, 0, {id: 'dilute-antidote', ops: [
        {op: 'carry', holder: flask.id, quantity: brewDoseQuantity('water'), amount: 4},
        ...(aged ? [{op: 'state', holder: flask.id, pack: 'b.brew_storage',
            value: {bottledAt: 4, life: 2, keep: ['water']}}] : []),
    ]});
    const settle = data.timeline.findIndex(step => step.id === 'settle-serving');
    data.timeline.splice(settle, 0, {id: 'update-burden', ops: [
        {op: 'set', holder: recipient.id, quantity: burden, amount: remainingBurden},
    ]}, restore('restore-updated-burden'));
    const step = data.timeline[settle + 2];
    if (remainingBurden !== 2 || aged) {
        step.interruption = {working: 'case.serve', reason: remainingBurden ? 'treatment-serving-insufficient' : 'treatment-burden-unavailable'};
        step.expect = [part(flask.id, active, 'unchanged', 4), part(flask.id, 'water', 'unchanged', 4),
            part(recipient.id, active, 'unchanged', 0)];
        data.timeline.splice(settle + 4);
        data.expect = data.expect.filter(row => row.holder !== recipient.id);
        return data;
    }
    step.expect.splice(0, 2, part(flask.id, active, 'down', 2), part(recipient.id, active, 'up', 2));
    step.expect.push(part(flask.id, 'water', 'down', 2), part(recipient.id, 'water', 'up', 2));
    // The burden falls below the breathing threshold for the last two minutes.
    Object.assign(step.expect.find(row => row.quantity === 'respiratory-capacity'), {direction: 'up', to: 8});
    data.timeline.find(row => row.id === 'observe-breathing').expect[0].to = 10;
    data.expect.find(row => row.holder === recipient.id).to = 2;
    return data;
}

export function sharedAntidoteServingCase({short = false, allTargets = true} = {}) {
    const active = 'shared-remedy', first = 'poison:first', second = 'poison:second', unrelated = 'poison:other';
    const initial = {[active]: short ? 2 : 4, water: 4};
    const data = stocked({initial, measured: {name: active, amount: initial[active]}});
    data.engine.shared.quantities = [WORLD_QUANTITIES.stock, {id: 'poison', keyed: true, unit: 'burden', min: 0, max: 20}];
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {[first]: 2, [second]: 2, [unrelated]: 1};
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const method = brewDoseMethod({id: 'trial.shared-remedy', route: 'oral', sizeForBurden: allTargets ? [first, second] : second,
        treatment: {route: 'oral', pairs: [
            {quantity: first, part: active, reason: 'Treat the first poison first.'},
            {quantity: second, part: active, reason: 'Treat the second poison with the remaining remedy.'},
        ]}});
    data.timeline.push({id: 'shared-serving', working: {family: 'brew-dose', method, bindings: {flask, recipient}}},
        restore('restore-pending-shared-serving'),
        {id: 'less-first-poison', ops: [{op: 'set', holder: recipient.id, quantity: first, amount: 1}]},
        restore('restore-reduced-burden'),
        {id: 'settle-shared-serving', advanceTo: 2, expect: [
            part(flask.id, active, short ? 'unchanged' : 'down', short ? 2 : 1),
            part(flask.id, 'water', short ? 'unchanged' : 'down', short ? 4 : 1),
            read(first, short ? 'unchanged' : 'down', short ? 1 : 0),
            read(second, short ? 'unchanged' : 'down', short ? 2 : 0), read(unrelated, 'unchanged', 1),
        ], ...(short ? {interruption: {working: 'case.shared-serving', reason: 'treatment-serving-insufficient'}} : {})},
        restore('restore-shared-outcome'));
    data.expect = [read(first, 'down', short ? 1 : 0),
        part(recipient.id, active, short ? 'unchanged' : 'up', short ? 0 : 3),
        part(recipient.id, 'water', short ? 'unchanged' : 'up', short ? 0 : 3)];
    return data;
}

// HPPE061 supplies the infirmary use. The size and duration are authored.
export function calmingDraughtCase({route = 'oral'} = {}) {
    const active = 'calming-extract', oral = route === 'oral';
    return stocked({initial: {[active]: 4}, measured: {name: active, amount: 4}, route,
        target: {mind_mood: 4}, responses: [{part: active, minimum: 4, route: 'oral',
            sentence: {verb: 'transform', object: 'mind', time: 'sustained'}, details: {minutes: 6, mind: {faculty: 'mood', amount: 4}}}],
        effect: [property('mind_mood', oral ? 'changed' : 'unchanged', oral ? 8 : 4)],
        recovery: {minutes: 6, expect: [property('mind_mood', oral ? 'changed' : 'unchanged', 4)]}});
}

// HPPE116 reports a treated handle. The contact and coverage test is authored.
export function antiJinxVarnishCase({amount = 2, wash = false, washPart = 'varnish-solvent', recoat = false} = {}) {
    const active = 'anti-jinx-varnish', broom = ref('thing', 'broom'), spare = 'spare-broom';
    const protectedHandle = amount >= 2;
    const coating = residueQuantity(active);
    const data = stocked({initial: {[active]: 3}, measured: {name: active, amount}, lots: wash ? {
        solvent: {id: 'solvent', material: 'wash-liquid', amount: 2, properties: {[washPart]: 1000}},
    } : {}});
    data.world.holders.push(...[broom.id, spare].map(id => ({id, kind: 'thing', as: ['object'], place: 'bench',
        properties: {form: 'straight'}, quantities: {noise: 0}})),
        {id: 'wand', kind: 'thing', place: 'bench', properties: {marks: [`grip:${recipient.id}`]}});
    data.engine.shared.properties = [WORLD_PROPERTIES.form, WORLD_PROPERTIES.marks];
    data.engine.shared.quantities = [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.noise, WORLD_QUANTITIES.residue,
        {id: 'stamina', unit: 'effort', min: 0, max: 10}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {stamina: 4};
    const field = 'varnished-handle.case.coat.0';
    const params = {verb: 'transform', object: 'spell-contact', spellObject: 'form', threshold: {quantity: coating, minimum: 2}};
    const coat = units => brewCoatingMethod({id: 'hp.coat.anti-jinx', amount: units, responses: [{part: active, minimum: 1,
        sentence: {verb: 'block', object: 'form', time: 'sustained'}, details: {field: 'varnished-handle', minutes: 4, params}}]});
    const form = (holder, direction, to) => ({holder, property: 'form', direction, to});
    const cast = (id, target, verb, object, details) => ({id, working: {family: 'spell', spells: [{target: {id: target},
        sentence: {verb, object, target: 'object', time: 'instant', cost: 'stamina'},
        grip: {caster: recipient.id, implement: 'wand'}, contact: {}, minutes: 1,
        details: {...details, cost: 1, payer: recipient.id}}]}});
    const jinx = (id, target, value) => cast(id, target, 'transform', 'form', {value});
    data.timeline = [
        {id: 'coat', working: {family: 'brew-dose', method: coat(amount), bindings: {flask, recipient: broom}}}, restore('restore-pending-coat'),
        {id: 'coated', advanceTo: 2, expect: [{holder: broom.id, quantity: coating, direction: 'up', to: amount}, {lawField: field,
            direction: 'changed', to: {scope: broom.id, kind: 'block', params, until: 6}}]},
        restore('restore-coated'),
        jinx('jinx-treated', broom.id, 'crooked'), restore('restore-pending-jinx'),
        {id: 'jinx-treated-settles', advanceTo: 3, expect: [form(broom.id, protectedHandle ? 'unchanged' : 'changed', protectedHandle ? 'straight' : 'crooked')]},
        jinx('jinx-spare', spare, 'crooked'),
        {id: 'jinx-spare-settles', advanceTo: 4, expect: [form(spare, 'changed', 'crooked')]},
        cast('noise-on-treated', broom.id, 'add', 'sound', {amount: 2}),
        {id: 'noise-settles', advanceTo: 5, expect: [{holder: broom.id, quantity: 'noise', direction: 'up', to: 2}]},
        {id: 'coating-expires', advanceTo: 6, expect: [{lawField: field, direction: 'changed', to: null}]},
        restore('restore-expired-coating'), jinx('jinx-after-expiry', broom.id, 'twisted'),
        {id: 'last-jinx-settles', advanceTo: 7, expect: [form(broom.id, 'changed', 'twisted')]}, restore('restore-last-jinx'),
    ];
    const washed = wash && washPart === 'varnish-solvent' ? 1 : 0;
    if (wash) {
        data.engine.packs.push('w.residue_flow');
        data.world.holders.push({id: 'drain', kind: 'place', quantities: {[coating]: 0, [residueQuantity('wash-liquid')]: 0}});
        data.world.links = [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}];
        const start = data.timeline.findIndex(step => step.id === 'jinx-spare');
        data.timeline.splice(start, 4,
            {id: 'wash', working: {family: 'brew', bindings: {target: broom, solvent: ref('lot', 'solvent')}, method: {
                id: 'hp.varnish.wash', revision: 1, law: BREW_LAW.ref, roles: {target: 'thing', solvent: 'lot'},
                steps: [{op: 'rinse-object', minutes: 1, bindings: {target: 'target', solvent: 'solvent'},
                    options: {part: active, amount: 1, solventPart: 'varnish-solvent'}}],
            }}}, restore('restore-pending-wash'),
            {id: 'wash-settles', advanceTo: 4, expect: [{holder: broom.id, quantity: coating, direction: washed ? 'down' : 'unchanged', to: amount - washed},
                {holder: 'drain', quantity: coating, direction: washed ? 'up' : 'unchanged', to: washed},
                {holder: 'drain', quantity: residueQuantity('wash-liquid'), direction: 'up', to: 1},
                {holder: 'solvent', quantity: brewMeasureQuantity, direction: 'down', to: 1}]}, restore('restore-washed-broom'),
            jinx('jinx-after-wash', broom.id, 'crooked'),
            {id: 'washed-jinx-settles', advanceTo: 5, expect: [form(broom.id, protectedHandle && amount - washed < 2 ? 'changed' : 'unchanged',
                amount - washed >= 2 ? 'straight' : 'crooked')]});
    }
    data.expect = [part(flask.id, active, 'down', 3 - amount), {holder: broom.id, quantity: coating, direction: 'up', to: amount - washed},
        form(broom.id, 'changed', 'twisted'),
        {holder: recipient.id, quantity: 'stamina', direction: 'down', to: wash ? 1 : 0}];
    if (recoat) {
        const firstForm = protectedHandle ? 'straight' : 'crooked';
        data.timeline.splice(data.timeline.findIndex(step => step.id === 'jinx-spare'),
            data.timeline.length,
            {id: 'recoat', working: {family: 'brew-dose', method: coat(1), bindings: {flask, recipient: broom}}},
            restore('restore-pending-recoat'),
            {id: 'recoated', advanceTo: 5, expect: [{holder: broom.id, quantity: coating, direction: 'up', to: amount + 1},
                part(flask.id, active, 'down', 2 - amount)]}, restore('restore-recoated'),
            {id: 'first-coat-expires', advanceTo: 6, expect: [{lawField: field, direction: 'changed', to: null}]},
            jinx('jinx-after-first-expiry', broom.id, 'twisted'), restore('restore-jinx-between-expiries'),
            {id: 'second-coat-holds', advanceTo: 7, expect: [form(broom.id, 'unchanged', firstForm)]},
            {id: 'second-coat-expires', advanceTo: 9, expect: [{lawField: 'varnished-handle.case.recoat.0', direction: 'changed', to: null}]},
            jinx('jinx-after-recoat-expiry', broom.id, 'twisted'),
            {id: 'unprotected', advanceTo: 10, expect: [form(broom.id, 'changed', 'twisted')]}, restore('restore-unprotected'));
        data.expect[0].to = 2 - amount;
        data.expect[1].to = amount + 1;
        data.expect[3].to = 1;
    }
    return data;
}

// HPPE043/044 anchor the added sprig and the reported quality judgment.
export function euphoriaCase({mintUnits = 2, route = 'oral'} = {}) {
    const active = 'euphoria-active', exciter = 'euphoria-exciter', mint = 'peppermint';
    const lots = {base: {id: 'base', material: 'prepared-elixir', amount: 8,
        properties: {precursor: 750, [exciter]: 250}}};
    if (mintUnits) lots.mint = {id: 'mint', material: mint, amount: mintUnits, properties: {[mint]: 1000}};
    const method = brewMethod({id: 'hp.brew.euphoria', slots: Object.keys(lots).map(id => ({id})), process: [
        {op: 'react', minutes: 2, options: {reactions: [
            {id: 'balance-exciter', reactants: {[exciter]: 1, [mint]: 1}, products: {'balanced-residue': 2}},
            {id: 'finish-elixir', reactants: {precursor: 1}, products: {[active]: 1}},
        ]}},
        {op: 'divide', minutes: 1, options: {doses: 1}}, {op: 'pour', minutes: 1, options: {index: 0}},
    ]});
    const oral = route === 'oral', remainingExciter = Math.max(0, 2 - mintUnits);
    const disrupted = oral && remainingExciter > 0;
    const mood = {part: active, minimum: 6, route: 'oral', sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
        details: {minutes: 6, mind: {faculty: 'mood', amount: 6}}};
    const data = stocked({lots, method, route, measured: {name: active, amount: 6}, target: {mind_speech_disrupted: false},
        responses: [{...mood, group: 'mood'}, {part: exciter, minimum: 1, route: 'oral', group: 'speech',
            sentence: {verb: 'bind', object: 'mind', time: 'sustained'}, details: {minutes: 3, mind: {faculty: 'laughter'}},
        }],
        effect: [property('mind_mood', oral ? 'changed' : 'unchanged', oral ? 16 : 10),
            property('mind_speech_disrupted', disrupted ? 'changed' : 'unchanged', disrupted)],
        recovery: {minutes: 6, expect: [property('mind_mood', oral ? 'changed' : 'unchanged', 10),
            property('mind_speech_disrupted', 'unchanged', false)]}});
    const bottled = data.timeline.find(step => step.id === 'bottled');
    bottled.expect.push(part(flask.id, exciter, remainingExciter ? 'up' : 'unchanged', remainingExciter),
        part(flask.id, 'balanced-residue', mintUnits ? 'up' : 'unchanged', 2 * Math.min(mintUnits, 2)));
    const listener = ref('body', 'listener'), record = 'elixir-observation';
    data.engine.packs.push(KNOWLEDGE_PACK);
    data.world.holders.push({id: listener.id, kind: 'body', place: 'bench', properties: {mind_awake: true}});
    data.world.holders.find(holder => holder.id === recipient.id).state = {[KNOWLEDGE_PACK]: {records: {[record]: defineRecord({
        id: record, subject: {kind: 'fact', id: record}, true: {holder: recipient.id, property: 'mind_awake'}, believed: {value: true},
    })}}};
    const answer = id => ({id, working: {family: 'knowledge', bindings: {speaker: recipient, listener},
        method: {id: 'question.elixir-observation', revision: 1, law: KNOWLEDGE_LAW.ref,
            roles: {speaker: 'body', listener: 'body'}, steps: [{op: 'answer', minutes: 1,
                bindings: {speaker: 'speaker', listener: 'listener'}, options: {record, willing: true}}]}}});
    data.timeline.splice(data.timeline.findIndex(step => step.id === 'recover'), 0,
        answer('first-answer'), restore('restore-pending-first-answer'),
        {id: 'first-conversation', advanceTo: 7,
            ...(disrupted ? {interruption: {working: 'case.first-answer', reason: 'speaker-cannot-answer'}} : {}),
            expect: [{holder: listener.id, belief: record, direction: disrupted ? 'unchanged' : 'changed', to: disrupted ? null : true}]},
        {id: 'side-effect-expired', advanceTo: 9, expect: [property('mind_mood', 'unchanged', oral ? 16 : 10),
            property('mind_speech_disrupted', disrupted ? 'changed' : 'unchanged', false)]}, restore('restore-after-side-effect'),
        answer('later-answer'), restore('restore-pending-later-answer'),
        {id: 'later-conversation', advanceTo: 10,
            expect: [{holder: listener.id, belief: record, direction: disrupted ? 'changed' : 'unchanged', to: true}]});
    return data;
}

export function compoundUptakeCase({half = false, occupied = false} = {}) {
    const liquidKey = 'mixed-liquid', liquid = `energy:${liquidKey}`, bodyPack = 'l.living_body';
    const active = part => `energy:${part}`;
    const response = part => ({part, minimum: 1, group: part, route: 'oral',
        liquidUptake: {part, liquidKey, activeKey: part}});
    const data = stocked({initial: {sedative: 4, restorative: 2}, measured: {name: 'sedative', amount: 4}});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {
        dose: {liquid, active: active('sedative'), baseline: 100, suppressionPerUnit: 10, recoveryPerMinute: 5},
        circulation: {liquid, active: active('restorative'), capacity: 100, volumePerUnit: 8},
    }};
    const source = data.world.holders.find(holder => holder.id === flask.id);
    if (occupied) source.quantities[active('restorative')] = 1;
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 0, [liquid]: 0, responsiveness: 100, 'circulating-blood': 60, 'blood-loss-rate': 2},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})},
    });
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const draw = half ? 3 : 6;
    const method = brewDoseMethod({id: 'trial.compound-uptake', route: 'oral', amount: draw,
        responses: [response('sedative'), response('restorative')]});
    const settlement = [read('responsiveness', occupied ? 'unchanged' : 'down', occupied ? 100 : half ? 80 : 60),
        read('circulating-blood', occupied ? 'down' : 'up', occupied ? 56 : half ? 64 : 72),
        read(liquid, 'unchanged', 0)];
    data.expect = [['sedative', half ? 2 : 4], ['restorative', half ? 1 : 2]].flatMap(([name, amount]) => [
        part(flask.id, name, occupied ? 'unchanged' : 'down', source.quantities[brewDoseQuantity(name)] - (occupied ? 0 : amount)),
        part(recipient.id, name, occupied ? 'unchanged' : 'up', occupied ? 0 : amount),
    ]);
    data.timeline.push({id: 'serve-compound', working: {family: 'brew-dose', method, bindings: {flask, recipient}}},
        restore('restore-before-uptake'),
        {id: 'compound-uptake', advanceTo: 2, expect: settlement,
            ...(occupied ? {interruption: {working: 'case.serve-compound', reason: 'liquid-uptake-account-unavailable'}} :
                {expectObserved: {working: 'case.serve-compound', step: 0,
                    to: {contents: {sedative: half ? 2 : 4, restorative: half ? 1 : 2}}}})},
        restore('restore-after-uptake'));
    if (occupied) data.expect.push(read('circulating-blood', 'down', 56),
        {holder: flask.id, quantity: active('restorative'), direction: 'unchanged', to: 1});
    else data.timeline.push({id: 'compound-recovery', advanceTo: 6, expect: [
        read('responsiveness', 'up', half ? 100 : 80), read('circulating-blood', 'down', half ? 56 : 64),
        ...[liquid, active('sedative'), active('restorative')].map(quantity =>
            ({holder: flask.id, quantity, direction: 'unchanged', to: 0})),
    ]}, restore('restore-compound-recovery'));
    return data;
}

export function compoundMoodDoseCase({half = false} = {}) {
    const response = (part, group, minimum, amount, minutes) => ({part, group, minimum, route: 'oral',
        sentence: {verb: 'transform', object: 'mind', time: 'sustained'}, details: {minutes, mind: {faculty: 'mood', amount}}});
    const mood = (direction, to) => property('mind_mood', direction, to);
    const data = stocked({initial: {bright: 4, mellow: 2}, measured: {name: 'bright', amount: 4}, route: 'oral',
        responses: [response('bright', 'brightness', 4, 4, 3), response('bright', 'brightness', 2, 2, 3),
            response('mellow', 'mellowness', 1, 3, 6)],
        effect: [mood('changed', half ? 15 : 17)],
        recovery: {minutes: 6, expect: [mood('changed', 10)]}});
    if (half) {
        data.timeline[0].working.method.steps[0].options.amount = 3;
        data.timeline.find(step => step.id === 'settle-serving').expect.splice(0, 2,
            part(flask.id, 'bright', 'down', 2), part(recipient.id, 'bright', 'up', 2));
        data.expect[0].to = 2;
    }
    data.timeline.splice(data.timeline.findIndex(step => step.id === 'recover'), 0,
        {id: 'brightness-expires', advanceTo: 5, expect: [mood('changed', 13)]},
        restore('restore-remaining-mellowness'));
    data.expect.push(part(recipient.id, 'mellow', 'up', half ? 1 : 2),
        part(flask.id, 'mellow', 'down', half ? 1 : 0));
    return data;
}

// HPPE148 shows a shared infusion and sugar added to one person's cup.
export function gurdyrootInfusionCase({sweeten = true, removeSugar = false, measured = false} = {}) {
    const infusion = 'gurdyroot-extract', sugar = 'sugar';
    const cup = ref('flask', 'plain-cup');
    const sweetened = sweeten && !removeSugar;
    const data = stocked({initial: {[infusion]: 4, water: 12}, measured: {name: infusion, amount: measured ? 1 : 2},
        lots: {sugar: {id: sugar, material: sugar, amount: 2, properties: {[sugar]: 1000}}}});
    data.world.holders.push({id: cup.id, kind: 'thing', as: ['flask'], place: 'bench'}, {id: 'shelf', kind: 'place'});
    if (measured) data.world.holders.find(holder => holder.id === flask.id).state = {
        'b.brew_fraction': {volume: 2, constituents: [{id: infusion, phase: 'dissolved', amount: 4},
            {id: 'water', phase: 'dissolved', amount: 12}]},
        'b.brew_storage': {bottledAt: 0, life: 6, rate: 1, keep: ['water']},
    };
    const method = (id, roles, steps) => ({id, revision: 1, law: BREW_LAW.ref, roles, steps});
    data.timeline = [
        {id: 'share', working: {family: 'brew', bindings: {flask, receiver: cup}, method: method('hp.gurdyroot.share',
            {flask: 'flask', receiver: 'flask'}, [{op: 'decant-flask', minutes: 1,
                bindings: {flask: 'flask', receiver: 'receiver'}, options: measured ? {volume: 1} : {amount: 8}}])}},
        restore('restore-pending-share'),
        {id: 'poured-cups', advanceTo: 1, expect: [part(flask.id, infusion, 'down', 2), part(cup.id, infusion, 'up', 2),
            part(flask.id, 'water', 'down', 6), part(cup.id, 'water', 'up', 6)]}, restore('restore-cups'),
    ];
    if (sweeten) {
        const bindings = {flask, sugar: ref('lot', sugar)};
        data.timeline.push({id: 'sweeten', working: {family: 'brew', bindings, method: method('hp.gurdyroot.sweeten',
            {flask: 'flask', sugar: 'lot'}, [
                {op: 'dissolve-in-flask', minutes: 2, bindings: {flask: 'flask', lot: 'sugar'}, options: {amount: 1}},
            ])}}, restore('restore-pending-sugar'));
        if (removeSugar) data.timeline.push({id: 'take-sugar', ops: [{op: 'move', holder: sugar, to: 'shelf'}]}, restore('restore-away-sugar'));
        data.timeline.push({id: 'sweetening-settled', advanceTo: 3,
            ...(removeSugar ? {interruption: {working: 'case.sweeten', reason: 'ingredient-out-of-reach'}} : {}),
            expect: [part(flask.id, infusion, 'unchanged', 2),
                part(flask.id, sugar, sweetened ? 'up' : 'unchanged', sweetened ? 1 : 0)]}, restore('restore-sweetening'));
    }
    let drink = flask;
    if (measured) {
        drink = ref('flask', 'tasting-cup');
        data.world.holders.push({id: drink.id, kind: 'thing', as: ['flask'], place: 'bench'});
        data.timeline.push({id: 'measured-transfer', working: {family: 'brew', bindings: {flask, receiver: drink},
            method: method('hp.gurdyroot.measured-transfer', {flask: 'flask', receiver: 'flask'}, [
                {op: 'decant-flask', minutes: 1, bindings: {flask: 'flask', receiver: 'receiver'}, options: {volume: 1}},
            ])}}, restore('restore-pending-measured-transfer'),
        {id: 'measured-transfer-settled', advanceTo: sweeten ? 4 : 2, expect: [part(drink.id, infusion, 'up', 2),
            part(drink.id, sugar, sweetened ? 'up' : 'unchanged', sweetened ? 1 : 0)]}, restore('restore-measured-transfer'));
    }
    data.timeline.push({id: 'drink', working: {family: 'brew-dose',
        method: brewDoseMethod({id: 'hp.gurdyroot.drink', route: 'oral'}), bindings: {flask: drink, recipient}}},
        restore('restore-pending-drink'),
        {id: 'drank', advanceTo: (sweeten ? 5 : 3) + Number(measured), expect: [part(drink.id, infusion, 'down', 0)]}, restore('restore-drank'));
    const aged = measured && sweeten;
    data.expect = [part(recipient.id, infusion, aged ? 'unchanged' : 'up', aged ? 0 : measured ? 1 : 2),
        part(recipient.id, `${infusion}:spent`, measured ? 'up' : 'unchanged', aged ? 2 : measured ? 1 : 0), part(recipient.id, 'water', 'up', 6),
        part(recipient.id, sugar, sweetened ? 'up' : 'unchanged', sweetened ? 1 : 0),
        part(cup.id, infusion, 'up', 2), part(cup.id, 'water', 'up', 6), part(cup.id, sugar, 'unchanged', 0),
        {holder: sugar, quantity: brewMeasureQuantity, direction: sweetened ? 'down' : 'unchanged', to: sweetened ? 1 : 2}];
    return data;
}

// HPPE053/054. Start with pickled tentacles. Straining and the distinction
// between mending a bowl and recovering its contents are independently shown.
export function murtlapEssenceCase({meshSize = 5, workStock = 4, reliefRoute = null, doseAmount = 7} = {}) {
    const active = 'murtlap-extract', solids = 'tentacle-pieces';
    const work = 'stock:filter-work';
    const filtered = meshSize <= 10;
    const law = defineSeparationLaw({id: 'hp.murtlap.strain', revision: 1,
        constituents: {[active]: {}, [solids]: {particleSize: 10}},
        costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op =>
            [op, {secondsPerVolume: 60, workPerVolume: 2}])),
        filmRetainPermille: 0, filmReleasePerVolume: 0, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
    const vessel = {id: 'strainer', separator: {material: 'glass', capacity: 2, closure: 'open', condenserPermille: 0,
        meshSize, thermalMass: 1, heatTransfer: 1, accounts: {work}}};
    const lots = {tentacles: {id: 'tentacles', material: 'pickled-tentacles', amount: 20,
        properties: {[active]: 700, [solids]: 300}}};
    const method = brewMethod({id: 'hp.brew.murtlap', slots: [{id: 'tentacles'}], process: [
        {op: 'strain', minutes: 2, options: {law, volume: 2, phases: {[solids]: 'suspended'}}},
        {op: 'pour', minutes: 1, options: {index: 0}},
        ...(filtered ? [{op: 'divide', options: {doses: 1}}, {op: 'pour', flask: 'cake', options: {index: 1}}] : []),
    ]});
    const data = stocked({lots, vessel, method, measured: {name: active, amount: 14}});
    data.engine.packs.push('w.residue_flow');
    data.world.holders.find(holder => holder.id === vessel.id).quantities = {[work]: workStock};
    data.world.holders.find(holder => holder.id === flask.id).properties = {form: 'whole'};
    if (filtered) {
        data.world.holders.push({id: 'cake', kind: 'thing', as: ['flask'], place: 'bench'});
        data.timeline[0].working.bindings.cake = ref('flask', 'cake');
    }
    data.world.holders.push({id: 'drain', kind: 'place', quantities: {[residueQuantity(active)]: 0, [residueQuantity(solids)]: 0}});
    data.world.links = [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}];
    data.timeline.splice(2, 0, {id: 'strained', advanceTo: 2, expect: [
        {holder: vessel.id, quantity: work, direction: 'down', to: 0},
        part(flask.id, active, 'unchanged', 0)]}, restore('restore-strained'));
    const bowl = (direction, to) => ({holder: flask.id, property: 'form', direction, to});
    const drained = (name, direction, to) => ({holder: 'drain', quantity: residueQuantity(name), direction, to});
    let spillAt = 4, spilled = 14;
    if (reliefRoute !== null) {
        const patient = data.world.holders.find(holder => holder.id === recipient.id);
        patient.properties.mind_pain = 9;
        patient.properties.form = 'cut-hand';
        const pain = (direction, to) => property('mind_pain', direction, to);
        const wound = property('form', 'unchanged', 'cut-hand');
        const relieves = reliefRoute === 'topical' && doseAmount >= 7;
        const responses = [{part: active, route: 'topical', minimum: 7,
            sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
            details: {minutes: 3, mind: {faculty: 'pain', amount: -7}}}];
        const dose = brewDoseMethod({id: 'hp.murtlap.soak', route: reliefRoute, amount: doseAmount, responses});
        spilled -= doseAmount;
        data.timeline.push(
            {id: 'soak', working: {family: 'brew-dose', method: dose, bindings: {flask, recipient}}},
            restore('restore-pending-soak'),
            {id: 'soaked', advanceTo: 5, expect: [part(flask.id, active, 'down', spilled), part(recipient.id, active, 'up', doseAmount),
                pain(relieves ? 'changed' : 'unchanged', relieves ? 2 : 9), wound]},
            restore('restore-relief'),
            {id: 'relief-before-expiry', advanceTo: 7, expect: [pain('unchanged', relieves ? 2 : 9), wound]},
            {id: 'relief-expired', advanceTo: 8, expect: [pain(relieves ? 'changed' : 'unchanged', 9), wound]},
            restore('restore-after-relief'),
        );
        spillAt = 9;
    }
    data.timeline.push(
        {id: 'break-bowl', sentence: {verb: 'transform', object: 'form', time: 'instant'},
            details: {target: {shape: 'holder', id: flask.id}, value: 'broken'}, expect: [bowl('changed', 'broken')]},
        {id: 'drop', working: {family: 'brew', bindings: {flask}, method: {
            id: 'hp.murtlap.drop-bowl', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask'},
            steps: [{op: 'spill-flask', bindings: {flask: 'flask'}, minutes: 1}],
        }}},
        restore('restore-pending-drop'),
        {id: 'spill', advanceTo: spillAt, expect: [bowl('unchanged', 'broken'), part(flask.id, active, 'down', 0),
            drained(active, 'up', spilled)]},
        restore('restore-spilled'),
        {id: 'repair', sentence: {verb: 'transform', object: 'form', time: 'instant'},
            details: {target: {shape: 'holder', id: flask.id}, value: 'whole'},
            expect: [bowl('changed', 'whole'), part(flask.id, active, 'unchanged', 0), drained(active, 'unchanged', spilled)]},
        restore('restore-repaired'));
    data.expect = [
        {holder: 'tentacles', quantity: brewMeasureQuantity, direction: 'down', to: 0},
        drained(active, 'up', spilled), drained(solids, filtered ? 'unchanged' : 'up', filtered ? 0 : 6),
        ...(filtered ? [part('cake', solids, 'up', 6)] : []), bowl('unchanged', 'whole'),
        ...(reliefRoute === null ? [] : [part(recipient.id, active, 'up', doseAmount)]),
    ];
    return data;
}

export function recoveredOriginCase({origin = 'garden', mixed = false} = {}) {
    const work = 'stock:filter-work';
    const law = defineSeparationLaw({id: 'trial.origin-filter', revision: 1, constituents: {extract: {}},
        costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op =>
            [op, {secondsPerVolume: 60, workPerVolume: 1}])),
        filmRetainPermille: 0, filmReleasePerVolume: 0, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
    const lots = {leaf: {id: 'leaf', material: 'leaf', amount: mixed ? 2 : 4, properties: {extract: 1000}, origin}};
    if (mixed) lots.extra = {id: 'extra', material: 'leaf', amount: 2, properties: {extract: 1000}, origin: 'store'};
    const method = brewMethod({id: 'trial.recover-origin', slots: Object.keys(lots).map(id => ({id})), process: [
        {op: 'strain', minutes: 1, options: {law, volume: 1}},
        {op: 'pour', minutes: 1, options: {index: 0}},
    ]});
    const data = stocked({lots, method, measured: {name: 'extract', amount: 4}, vessel: {id: 'cauldron', separator: {
        material: 'glass', capacity: 1, closure: 'open', condenserPermille: 0,
        meshSize: 5, thermalMass: 1, heatTransfer: 1, accounts: {work},
    }}});
    data.world.holders.find(holder => holder.id === 'cauldron').quantities = {[work]: 1};
    const product = ref('flask', 'product');
    data.world.holders.push({id: product.id, kind: 'thing', as: ['flask'], place: 'bench'});
    const activated = origin === 'garden' && !mixed;
    data.timeline.push(
        {id: 'rework', working: {family: 'brew', bindings: {vessel: ref('vessel', 'cauldron'), flask, product},
            method: {id: 'trial.origin-reaction', revision: 1, law: BREW_LAW.ref,
                roles: {vessel: 'vessel', flask: 'flask', product: 'flask'}, steps: [
                    {op: 'admit-fraction', minutes: 1, bindings: {vessel: 'vessel', flask: 'flask'}},
                    {op: 'react', minutes: 1, bindings: {vessel: 'vessel'}, options: {reactions: [
                        {id: 'source-reacts', requiresOrigins: {extract: 'garden'}, reactants: {extract: 1}, products: {active: 1}},
                    ]}},
                    {op: 'divide', bindings: {vessel: 'vessel'}, options: {doses: 1}},
                    {op: 'pour', bindings: {vessel: 'vessel', flask: 'product'}, options: {index: 0}},
                ]}}},
        {id: 'readmitted', advanceTo: 3, expect: [part(flask.id, 'extract', 'down', 0)]}, restore('restore-readmitted'),
        {id: 'finished', advanceTo: 4}, restore('restore-product'),
    );
    data.expect.splice(-1, 1, part(product.id, activated ? 'active' : 'extract', 'up', 4),
        part(product.id, activated ? 'extract' : 'active', 'unchanged', 0),
        {holder: 'cauldron', quantity: work, direction: 'down', to: 0});
    return data;
}

export function retainedCatalystCase({remove = false, spent = false} = {}) {
    const catalyst = ref('lot', 'mesh');
    const stock = brewMeasureQuantity;
    const active = 'catalysed';
    const outcome = remove || spent ? 'intermediate' : active;
    const lots = {base: {id: 'base', material: 'base', amount: 4, properties: {base: 1000}}};
    const heldCatalyst = {part: 'seed', minimum: 2};
    const method = brewMethod({id: 'trial.retained-catalyst', slots: [{id: 'base'}], process: [
        {op: 'react-with-catalyst', minutes: 1, options: {heldCatalyst, reactions: [
            {id: 'prime', catalyst: 'seed', reactants: {base: 1}, products: {intermediate: 1}},
        ]}},
        {op: 'cascade-with-catalyst', minutes: 2, options: {heldCatalyst, maxFirings: 2, reactions: [
            {id: 'finish', catalyst: 'seed', priority: 1, reactants: {intermediate: 1}, products: {[active]: 1}},
        ]}},
        {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    const data = stocked({lots, method, measured: {name: outcome, amount: 4}});
    data.world.holders.push({id: 'hall', kind: 'place'},
        {id: catalyst.id, kind: 'thing', as: ['lot'], place: 'bench', quantities: {[stock]: 4}});
    data.engine.host.things[`lot:${catalyst.id}`] = {material: 'seed-mesh', properties: {constituents: {seed: 500}}};
    data.timeline[0].working.bindings.catalyst = catalyst;
    data.timeline.splice(2, 0,
        {id: 'primed', advanceTo: 1, expect: [{holder: catalyst.id, quantity: stock, direction: 'unchanged', to: 4}]},
        restore('restore-primed'),
        ...(remove ? [{id: 'move-mesh', ops: [{op: 'move', holder: catalyst.id, to: 'hall'}]}] : []),
        ...(spent ? [{id: 'withdraw-mesh', ops: [{op: 'add', holder: catalyst.id, quantity: stock, amount: -1}]}] : []));
    data.expect.push({holder: catalyst.id, quantity: stock, direction: spent ? 'down' : 'unchanged', to: spent ? 3 : 4},
        part(flask.id, 'seed', 'unchanged', 0),
        part(flask.id, outcome === active ? 'intermediate' : active, 'unchanged', 0));
    return data;
}

export function generatedCatalystCase({remove = false, sharedStock} = {}) {
    const seedLot = sharedStock === undefined ? 'mesh' : 'leaf';
    const data = stocked({measured: {name: remove ? 'primed' : 'active', amount: 4}, lots: {
        leaf: {id: 'leaf', material: 'leaf', amount: sharedStock ?? 5,
            properties: sharedStock === undefined ? {extract: 900} : {extract: 800, seed: 200}},
        mesh: {id: 'mesh', material: 'mesh', amount: 5, properties: {seed: 500}},
        spare: {id: 'spare', material: 'mesh', amount: 5, properties: {seed: 1000}},
    }});
    const kit = ref('instrument', 'kit');
    data.engine.shared.properties = [
        {id: 'assay_parts', type: 'set'}, {id: 'assay_resolution', type: 'level', min: 1, max: 1000},
    ];
    data.world.holders.push({id: 'hall', kind: 'place'},
        {id: kit.id, kind: 'thing', as: [kit.kind], place: 'bench', quantities: {[brewStripQuantity]: 2},
            properties: {assay_parts: ['extract', 'seed'], assay_resolution: 200}});
    const assay = (lot, constituent, at, strips) => [
        {id: `assay-${constituent}`, working: {family: 'brew-assay',
            method: brewLotAssayMethod({id: `assay-${constituent}`, part: constituent, resolution: 200}),
            bindings: {lot: ref('lot', lot), instrument: kit, observer: recipient}}},
        restore(`restore-pending-${constituent}-assay`),
        {id: `read-${constituent}`, advanceTo: at, expect: [{holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: strips}]},
    ];
    const request = {id: 'trial.catalyst-invention', observer: recipient.id, vessel: 'cauldron', flask: flask.id,
        goal: {part: 'active', amount: 4}, reactions: [
            {id: 'prime', minutes: 1, catalyst: 'seed', catalystMinimum: 2, reactants: {extract: 1}, products: {primed: 1}},
            {id: 'finish', minutes: 2, catalyst: 'seed', catalystMinimum: 2, reactants: {primed: 1}, products: {active: 1}},
        ]};
    data.timeline = [
        ...assay('leaf', 'extract', 2, 1), ...assay(seedLot, 'seed', 4, 0), restore('restore-assayed-lots'),
        {id: 'brew', working: {family: 'brew-from-assays', request}},
        {id: 'primed', advanceTo: 5}, restore('restore-primed'),
        ...(remove ? [{id: 'move-mesh', ops: [{op: 'move', holder: 'mesh', to: 'hall'}]}, restore('restore-withdrawn-mesh')] : []),
        {id: 'bottled', advanceTo: 9}, restore('restore-bottled'),
    ];
    data.expect = [
        {holder: 'leaf', quantity: brewMeasureQuantity, direction: 'down', to: (sharedStock ?? 5) - 5},
        ...['mesh', 'spare'].map(holder => ({holder, quantity: brewMeasureQuantity, direction: 'unchanged', to: 5})),
        part(flask.id, 'seed', sharedStock === undefined ? 'unchanged' : 'up', sharedStock === undefined ? 0 : 1),
        part(flask.id, 'active', remove ? 'unchanged' : 'up', remove ? 0 : 4),
        part(flask.id, 'primed', remove ? 'up' : 'unchanged', remove ? 4 : 0),
    ];
    return data;
}

// HPPE069 shows rejection followed by beard growth. The dose's separate
// apparent form, the eligibility measure and both durations are authored.
export function ageingPotionCase({years = 16, route = 'oral', removeLine = false} = {}) {
    const active = 'ageing-extract', layers = 'temporary-form-layers';
    const aged = route === 'oral', admitted = years >= 17;
    const doseLayers = aged ? ['older-looking|2|5'] : [];
    const crossingLayers = admitted ? doseLayers : [...doseLayers, 'bearded|3|8'].sort();
    const data = stocked({initial: {[active]: 2}, measured: {name: active, amount: 2}, route,
        target: {form: 'human', 'lived-years': years},
        responses: [{part: active, route: 'oral', minimum: 2,
            temporaryForm: {form: 'older-looking', minutes: 3, priority: 2}}],
        effect: [property(layers, aged ? 'changed' : 'unchanged', aged ? doseLayers : null),
            property('lived-years', 'unchanged', years)]});
    data.engine.packs.push('l.creature_form');
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES),
        {id: 'lived-years', type: 'level', min: 0}, {id: 'minimum-years', type: 'level', min: 1}];
    data.world.holders.push({id: 'inside', kind: 'place'}, {id: 'outside', kind: 'place'},
        {id: 'line', kind: 'thing', place: 'bench', properties: {'minimum-years': 17}});
    data.timeline.push(
        {id: 'attempt-crossing', working: {family: 'age-line',
            bindings: {entrant: recipient, line: ref('thing', 'line'), inside: ref('place', 'inside'), outside: ref('place', 'outside')}}},
        restore('restore-pending-crossing'),
        ...(removeLine ? [{id: 'leave-threshold', ops: [{op: 'move', holder: recipient.id, to: 'outside'}]}] : []),
        {id: 'crossing', advanceTo: 3, expect: [{holder: recipient.id, position: true, direction: 'changed', to: admitted ? 'inside' : 'outside'},
            property(layers, admitted ? 'unchanged' : 'changed', crossingLayers.length ? crossingLayers : null),
            property('lived-years', 'unchanged', years)]},
        restore('restore-crossing'),
        {id: 'potion-expires', advanceTo: 5, expect: [property(layers, aged ? 'changed' : 'unchanged', admitted ? null : ['bearded|3|8'])]},
        {id: 'beard-clears', advanceTo: 8, expect: [property(layers, admitted ? 'unchanged' : 'changed', null)]},
        restore('restore-expired'),
    );
    return data;
}

// HPPE124 shows a soil amendment. This liquid preparation and crop
// response are an original trial, since the scene supplies no brew.
export function nutrientInfusionCase({uptake = true} = {}) {
    const partName = 'plant-nutrient', nutrient = residueQuantity(partName), forage = 'stock:clover';
    const lots = {base: {id: 'nutrient-lot', material: 'nutrient-base', amount: 8, properties: {'nutrient-base': 1000}}};
    const method = brewMethod({id: 'trial.nutrient-infusion', slots: [{id: 'base'}], process: [
        {op: 'react', minutes: 1, options: {reactions: [
            {id: 'dissolve-nutrient', reactants: {'nutrient-base': 1}, products: {[partName]: 1}},
        ]}},
        {op: 'divide', options: {doses: 1}}, {op: 'pour', options: {index: 0}},
    ]});
    const data = stocked({lots, method, measured: {name: partName, amount: 8}});
    const absorbed = uptake ? 4 : 0;
    const quantity = (holder, quantity, direction, to) => ({holder, quantity, direction, to});
    data.engine.packs.push('w.residue_flow', 'l.living_residue');
    data.engine.settings = {'l.living_residue': {plots: [{field: 'field', crop: 'clover', forage,
        concentration: 'uniform-per-deposit', residues: [{substance: partName, quantity: nutrient,
            uptakePermille: uptake ? 500 : 0, growthPerMinute: 1, intakeReason: 'The crop takes up dissolved nutrient.'}]}]}};
    data.world.holders.push({id: 'field', kind: 'place', quantities: {[nutrient]: 0}},
        {id: 'clover', kind: 'thing', place: 'field', quantities: {[nutrient]: 0, [forage]: 2}},
        {id: 'ewe', kind: 'body', place: 'field', tags: ['living.body']});
    data.world.links = [{id: 'irrigation', kind: 'water', from: 'bench', to: 'field', oneWay: true}];
    data.timeline.push(
        {id: 'water-bed', working: {family: 'brew', bindings: {flask}, method: {
            id: 'trial.water-bed', revision: 1, law: BREW_LAW.ref, roles: {flask: 'flask'},
            steps: [{op: 'spill-flask', bindings: {flask: 'flask'}, minutes: 1}],
        }}}, restore('restore-pending-watering'),
        {id: 'watered', advanceTo: 2, expect: [part(flask.id, partName, 'down', 0),
            quantity('field', nutrient, 'up', 8 - absorbed), quantity('clover', nutrient, uptake ? 'up' : 'unchanged', absorbed)]},
        restore('restore-watered'),
        {id: 'mid-growth', advanceTo: 4, expect: [quantity('clover', forage, uptake ? 'up' : 'unchanged', 2 + absorbed / 2)]},
        restore('restore-mid-growth'),
        {id: 'ready-for-grazing', advanceTo: 8, expect: [
            quantity('clover', forage, uptake ? 'up' : 'unchanged', 2 + absorbed),
            quantity('clover', nutrient, uptake ? 'down' : 'unchanged', 0)]},
        {id: 'graze', ops: [grazeOp({place: 'field', crop: 'clover', body: 'ewe', portions: 4})],
            expect: [quantity('clover', forage, uptake ? 'down' : 'unchanged', 2)]},
        restore('restore-grazed'),
    );
    data.expect.splice(-1, 1, quantity('field', nutrient, 'up', 8 - absorbed), quantity('clover', forage, 'unchanged', 2));
    return data;
}

export function cureForBoilsCase({route = 'topical', withdraw = false, halfDose = false} = {}) {
    const bodyPack = 'l.living_body', lesions = 'skin-lesions';
    const vessel = {id: 'cauldron', thermal: {capacity: 10, surfaceArea: 2, heatTransfer: 1, thermalMass: 1}};
    const failed = cureForBoilsTrial({lift: false, splash: true});
    const cured = cureForBoilsTrial({lift: true});
    const data = stocked({lots: failed.lots, vessel, method: failed.method, measured: {name: 'acid', amount: 1000}});
    const remedy = stocked({lots: cured.lots, vessel, method: withPour(cured.method, true), measured: {name: 'cure', amount: 750}});
    const preparation = remedy.timeline[0].working;
    const splash = data.timeline[0].working;
    delete splash.bindings.flask;
    splash.bindings.target = recipient;
    // A fresh set of held ingredients and an intact vessel supply the remedy.
    const goodPot = 'remedy-pot';
    preparation.bindings.vessel = ref('vessel', goodPot);
    data.engine.host.things[`vessel:${goodPot}`] = {...vessel, id: goodPot};
    data.world.holders.push({id: goodPot, kind: 'thing', as: ['vessel'], place: 'bench', quantities: {condition: 100}});
    for (const {id} of Object.values(cured.lots)) {
        const fresh = `remedy-${id}`;
        data.world.holders.push({...remedy.world.holders.find(holder => holder.id === id), id: fresh});
        data.engine.host.things[`lot:${fresh}`] = remedy.engine.host.things[`lot:${id}`];
        preparation.bindings[id] = ref('lot', fresh);
        data.expect.push({holder: fresh, quantity: brewMeasureQuantity, direction: 'down', to: 0});
    }
    data.engine.packs.push('w.residue_flow', bodyPack);
    data.engine.settings = {[bodyPack]: {skinInjury: {kind: 'corrosive-spill', capacity: 10, unitsPerLesion: 25}}};
    data.world.holders.find(holder => holder.id === vessel.id).quantities = {condition: 100};
    const patient = data.world.holders.find(holder => holder.id === recipient.id);
    Object.assign(patient, {tags: ['living.body'], quantities: {satiety: 0, [lesions]: 0},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})}});
    const names = ['acid', 'cure', 'nettles:matrix', 'fangs:matrix', 'slugs:matrix', 'quills:matrix'];
    data.world.holders.push({id: 'hall', kind: 'place'}, {id: 'drain', kind: 'place',
        quantities: Object.fromEntries(names.map(name => [residueQuantity(name), 0]))});
    data.world.links = [{id: 'runoff', kind: 'water', from: 'bench', to: 'drain', oneWay: true}];
    const injured = withdraw ? 0 : 4;
    const amount = halfDose ? 200 : 400;
    const delivered = halfDose ? 38 : 75;
    const healed = route === 'topical' ? Math.min(injured, Math.floor(delivered / 18)) : 0;
    const skin = (direction, to) => ({holder: recipient.id, quantity: lesions, direction, to});
    const runoff = {holder: 'drain', quantity: residueQuantity('acid'), direction: 'up', to: withdraw ? 1000 : 900};
    const dose = brewDoseMethod({id: 'hp.serve.cure-for-boils', amount, route, treatment: {
        route: 'topical', pairs: [{quantity: lesions, part: 'cure', per: 18, reason: 'The treated skin receives the curative fraction.'}],
    }});
    data.timeline.splice(2, 2, {id: 'before-quills', advanceTo: 1}, restore('restore-before-quills'),
        ...(withdraw ? [{id: 'step-away', ops: [{op: 'move', holder: recipient.id, to: 'hall'}]}] : []),
        {id: 'spill', advanceTo: 2, expect: [runoff, skin(withdraw ? 'unchanged' : 'up', injured),
            {holder: vessel.id, quantity: 'condition', direction: 'down', to: 0}]}, restore('restore-injury'),
        ...(withdraw ? [{id: 'return', ops: [{op: 'move', holder: recipient.id, to: 'bench'}]}] : []),
        {id: 'make-remedy', working: preparation}, restore('restore-pending-remedy'),
        {id: 'remedy-bottled', advanceTo: 6, expect: [part(flask.id, 'cure', 'up', 750),
            {holder: goodPot, quantity: 'condition', direction: 'unchanged', to: 100}]},
        restore('restore-remedy'),
        {id: 'treat', working: {family: 'brew-dose', method: dose, bindings: {flask, recipient}}},
        restore('restore-pending-treatment'),
        {id: 'treatment', advanceTo: 8, expect: [part(flask.id, 'cure', 'down', 750 - delivered),
            part(recipient.id, 'cure', 'up', delivered), skin(healed ? 'down' : 'unchanged', injured - healed)]},
        restore('restore-treatment'));
    data.expect = [...data.expect.filter(check => check.holder !== flask.id), runoff, part(recipient.id, 'cure', 'up', delivered)];
    return data;
}

// HPPE129 shows a successful classroom brew when the pupil is left alone.
export function invigorationCase({distraction = 0, leave = false, stamina = 4, resume = false, segmented = false} = {}) {
    const active = 'invigoration-active';
    const lots = {base: {id: 'base', material: 'prepared-invigoration-base', amount: 6, properties: {precursor: 1000}}};
    const stirring = {maxConfusion: 0, reversal: {after: 2, from: 'precursor', to: active, amount: 6}};
    const strokes = segmented ? [...'LLR'].map(direction => ({op: 'stir-by-operator', minutes: 1,
        options: {...stirring, pattern: 'finish-base', strokes: direction, effort: 1}})) :
        [{op: 'stir-by-operator', minutes: 3, options: {...stirring, strokes: 'LLR', effort: 2}}];
    const method = brewMethod({id: 'hp.brew.invigoration', slots: [{id: 'base'}], process: [
        ...strokes,
        {op: 'divide', options: {doses: 1}}, {op: 'pour', minutes: 1, options: {index: 0}},
    ]});
    const checkpoint = segmented ? 2 : 1, effort = segmented ? 3 : 2;
    if (segmented && stamina < 2) throw new Error('The segmented trial needs enough stamina for the first two strokes.');
    const interruption = leave ? 'brew-operator-out-of-reach' : distraction > 3 - checkpoint ? 'brew-operator-unfocused' :
        stamina < effort ? 'brew-operator-short-stamina' : null;
    const data = stocked({lots, method, measured: {name: active, amount: 6}});
    data.timeline[0].working.bindings.operator = recipient;
    data.engine.shared.quantities = [WORLD_QUANTITIES.stock, {id: 'stamina', unit: 'effort', min: 0, max: 10}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {stamina};
    data.world.holders.push({id: 'hall', kind: 'place'});
    data.timeline.splice(2, 0,
        {id: 'stirring-pending', advanceTo: checkpoint, expect: [{holder: 'base', quantity: brewMeasureQuantity, direction: 'unchanged', to: 0},
            {holder: recipient.id, quantity: 'stamina', direction: segmented ? 'down' : 'unchanged', to: stamina - (segmented ? 2 : 0)}]},
        ...(leave ? [{id: 'leave-bench', ops: [{op: 'move', holder: recipient.id, to: 'hall'}]}] : []),
        ...(distraction ? [{id: 'distracted', by: recipient.id, sentence: {verb: 'transform', object: 'mind', time: 'sustained'},
            details: {place: 'bench', target: {shape: 'holder', id: recipient.id}, minutes: distraction, mind: {faculty: 'confusion', amount: 2}},
            expect: [property('mind_confusion', 'changed', 2)]}] : []),
        restore('restore-during-stirring'));
    const bottled = data.timeline.find(step => step.id === 'bottled');
    const settledEffort = segmented ? 2 : 0;
    const short = stamina < effort;
    if (interruption) {
        bottled.interruption = {working: 'case.brew', reason: interruption};
        bottled.expect = [part(flask.id, active, 'unchanged', 0)];
        data.expect[1] = bottled.expect[0];
    }
    if (resume) {
        if (!interruption) throw new Error('The retry case needs an interrupted stir.');
        const retryAt = Math.max(4, checkpoint + distraction);
        const noStock = {holder: 'base', quantity: brewMeasureQuantity, direction: 'unchanged', to: 0};
        bottled.expect.push({holder: recipient.id, quantity: 'stamina', direction: 'unchanged', to: stamina - settledEffort});
        data.timeline.push(
            ...(leave ? [{id: 'return-to-bench', ops: [{op: 'move', holder: recipient.id, to: 'bench'}]}] : []),
            ...(short ? [{id: 'recover-effort', ops: [{op: 'add', holder: recipient.id, quantity: 'stamina', amount: effort - settledEffort}]}] : []),
            {id: 'ready-to-retry', advanceTo: retryAt, expect: [noStock]},
            {id: 'retry-stir', resumeBrewStir: {from: 'case.brew'}}, restore('restore-retry-stir'),
            {id: 'retry-bottled', advanceTo: retryAt + (segmented ? 2 : 4), expect: [noStock, part(flask.id, active, 'up', 6),
                {holder: recipient.id, quantity: 'stamina', direction: 'down', to: short ? stamina - settledEffort : stamina - effort}]},
            restore('restore-retry-bottle'));
        data.expect[1] = part(flask.id, active, 'up', 6);
    }
    const netPaid = !interruption || resume && !short ? effort : settledEffort;
    data.expect.push({holder: recipient.id, quantity: 'stamina', direction: netPaid ? 'down' : 'unchanged', to: stamina - netPaid});
    return data;
}

export function strengtheningCase({early = false, substituted = false, route = 'oral', expired = false} = {}) {
    const {lots, method, liquid} = strengtheningSolution({early, substituted});
    const active = 'strengthening-active', boost = !early && !substituted && route === 'oral';
    const succeeds = boost && !expired;
    const finished = STRENGTHENING_REST - Number(early);
    const material = early || substituted ? liquid : active;
    const amount = early || substituted ? 3 : 6;
    const data = stocked({lots, method, measured: {name: material, amount}, target: {'haul-capacity': 3}});
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES),
        {id: 'haul-capacity', type: 'level', min: 0}, {id: 'haul-load', type: 'level', min: 1}];
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 10}];
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {stamina: 2};
    data.world.holders.push({id: 'store', kind: 'place'}, {id: 'crate', kind: 'thing', place: 'bench', properties: {'haul-load': 5}});
    data.world.links = [{id: 'store-door', kind: 'path', from: 'bench', to: 'store'}];
    const dose = brewDoseMethod({id: 'hp.serve.strengthening', route, responses: [
        {part: active, route: 'oral', minimum: 6, haulStrength: {bonus: 2, minutes: 3}},
    ]});
    const haulAt = finished + (expired ? 5 : 3);
    const move = holder => ({holder, position: true, direction: succeeds ? 'changed' : 'unchanged', to: succeeds ? 'store' : 'bench'});
    const stamina = {holder: recipient.id, quantity: 'stamina', direction: succeeds ? 'down' : 'unchanged', to: succeeds ? 1 : 2};
    data.timeline.splice(2, 0, {id: 'weekend-rest', advanceTo: Math.floor(finished / 2),
        expect: [part(flask.id, material, 'unchanged', 0)]}, restore('restore-weekend-rest'));
    data.timeline.push(
        {id: 'serve', working: {family: 'brew-dose', method: dose, bindings: {flask, recipient}}},
        restore('restore-pending-serving'),
        {id: 'served', advanceTo: finished + 2, expect: [part(flask.id, material, 'down', 0), part(recipient.id, material, 'up', amount)]},
        restore('restore-serving'),
        {id: 'haul', working: {family: 'body-haul', minutes: expired ? 3 : 1,
            bindings: {actor: recipient, cargo: ref('thing', 'crate'), destination: ref('place', 'store')}}},
        ...(expired ? [{id: 'wait-on-haul', advanceTo: finished + 4}] : []),
        restore('restore-pending-haul'),
        {id: 'haul-settles', advanceTo: haulAt, expect: [move(recipient.id), move('crate'), stamina],
            ...(!succeeds ? {interruption: {working: 'case.haul', reason: 'load-exceeds-capacity'}} : {})},
        restore('restore-haul'),
    );
    data.expect.splice(-1, 1, part(recipient.id, material, 'up', amount), move('crate'), stamina);
    return data;
}

// An original volatile brew. HPPE127 establishes a corridor diversion story,
// so the cloud trial makes no claim about the named gas's composition.
export function lingeringVaporCase({enterLate = true} = {}) {
    const active = 'trial-vapor', air = `residue:air.${active}`, vent = `residue:vented.${active}`;
    const inhaled = `residue:inhaled.${active}`, bodyPack = 'l.living_body';
    const work = 'stock:still-work';
    const law = defineSeparationLaw({id: 'trial.cloud-still', revision: 1,
        constituents: {[active]: {volatilePerVolume: 12}},
        costs: Object.fromEntries(['strain', 'decant', 'skim', 'distill', 'divide'].map(op =>
            [op, {secondsPerVolume: 60, workPerVolume: 1}])),
        filmRetainPermille: 0, filmReleasePerVolume: 0, cleanWaterPerAmount: 1, cleanWorkPerAmount: 1});
    const lots = {base: {id: 'volatile-base', material: 'volatile-base', amount: 12, properties: {[active]: 1000}}};
    const vessel = {id: 'still', separator: {material: 'glass', capacity: 1, closure: 'reflux', condenserPermille: 0,
        meshSize: 0, thermalMass: 1, heatTransfer: 1, accounts: {work}}};
    const method = brewMethod({id: 'trial.lingering-vapor', slots: [{id: 'base'}], process: [
        {op: 'distill', minutes: 1, options: {law, volume: 1}},
    ]});
    const data = stocked({lots, vessel, method, measured: {name: active, amount: 12}});
    data.engine.packs.push('b.cloud', bodyPack);
    data.engine.settings = {'b.cloud': {constituent: active, uptakePerMinute: 2, ventilationPerMinute: 2, harm: 'vapor-irritation'}};
    const holders = data.world.holders;
    holders.find(holder => holder.id === 'bench').quantities = {[air]: 0, [vent]: 0};
    holders.find(holder => holder.id === vessel.id).quantities = {[work]: 1};
    const breather = (place, sealed = false) => ({place, tags: ['living.body', 'breathes.air', ...(sealed ? ['breath.sealed'] : [])],
        quantities: {satiety: 0, [inhaled]: 0},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})}});
    Object.assign(holders.find(holder => holder.id === recipient.id), breather('bench'));
    holders.push({id: 'hall', kind: 'place'}, {id: 'visitor', kind: 'body', ...breather('hall')},
        {id: 'protected', kind: 'body', ...breather('bench', true)});
    delete data.timeline[0].working.bindings.flask;
    const quantity = (holder, quantity, direction, to) => ({holder, quantity, direction, to});
    data.timeline.splice(2, 2,
        {id: 'released', advanceTo: 1, expect: [quantity('bench', air, 'up', 12), quantity(vessel.id, work, 'down', 0),
            quantity(recipient.id, inhaled, 'unchanged', 0)]}, restore('restore-cloud'),
        {id: 'first-exposure', advanceTo: 2, expect: [quantity('bench', air, 'down', 8), quantity('bench', vent, 'up', 2),
            quantity(recipient.id, inhaled, 'up', 2)]},
        {id: 'change-occupants', ops: [{op: 'move', holder: recipient.id, to: 'hall'},
            ...(enterLate ? [{op: 'move', holder: 'visitor', to: 'bench'}] : [])]}, restore('restore-occupants'),
        {id: 'cloud-clears', advanceTo: 6, expect: [quantity('bench', air, 'down', 0),
            quantity('bench', vent, 'up', enterLate ? 6 : 10),
            quantity('visitor', inhaled, enterLate ? 'up' : 'unchanged', enterLate ? 4 : 0),
            quantity(recipient.id, inhaled, 'unchanged', 2), quantity('protected', inhaled, 'unchanged', 0)]},
        restore('restore-cleared'));
    data.expect.splice(-1, 1, quantity('bench', vent, 'up', enterLate ? 6 : 10),
        quantity('visitor', inhaled, enterLate ? 'up' : 'unchanged', enterLate ? 4 : 0),
        quantity(recipient.id, inhaled, 'up', 2));
    return data;
}

export function spreadingVaporCase({closeBeforeSpread = false} = {}) {
    const data = lingeringVaporCase();
    const air = 'residue:air.trial-vapor', vent = 'residue:vented.trial-vapor', inhaled = 'residue:inhaled.trial-vapor';
    const quantity = (holder, quantity, direction, to) => ({holder, quantity, direction, to});
    data.engine.settings['b.cloud'].exchangePerMinute = 4;
    data.world.holders.find(holder => holder.id === 'hall').quantities = {[air]: 0, [vent]: 0};
    data.world.holders.push({id: 'outside', kind: 'place'});
    data.world.links = [{id: 'air-door', kind: 'air', from: 'bench', to: 'hall'}];
    const spreadAt = data.timeline.findIndex(step => step.id === 'first-exposure');
    const close = {id: 'shut-door', ops: [{op: 'link_set', id: 'air-door', state: 'closed'}]};
    const spreads = !closeBeforeSpread;
    const totals = [quantity('bench', vent, 'up', spreads ? 6 : 10),
        quantity('hall', vent, spreads ? 'up' : 'unchanged', spreads ? 2 : 0),
        quantity('visitor', inhaled, spreads ? 'up' : 'unchanged', spreads ? 2 : 0),
        quantity(recipient.id, inhaled, 'up', 2)];
    data.timeline.splice(spreadAt, Infinity,
        ...(closeBeforeSpread ? [close, restore('restore-shut-door')] : []),
        {id: 'spread', advanceTo: 2, expect: [quantity('bench', air, 'down', spreads ? 4 : 8),
            quantity('hall', air, spreads ? 'up' : 'unchanged', spreads ? 4 : 0),
            quantity('visitor', inhaled, 'unchanged', 0)]},
        ...(spreads ? [close] : []),
        restore('restore-isolated-rooms'),
        {id: 'leave-cloud', ops: [{op: 'move', holder: recipient.id, to: 'outside'}]},
        {id: 'settle-both-rooms', advanceTo: 6, expect: [quantity('bench', air, 'down', 0),
            quantity('hall', air, spreads ? 'down' : 'unchanged', 0), ...totals.slice(0, 3),
            quantity(recipient.id, inhaled, 'unchanged', 2)]},
        restore('restore-clear-rooms'));
    data.expect = [data.expect[0], ...totals];
    return data;
}

export function gillyweedCase({available = true} = {}) {
    const layers = 'temporary-form-layers';
    const reserve = (direction, to) => ({holder: recipient.id, quantity: 'breath', direction, to});
    const health = (direction, to) => ({holder: recipient.id, quantity: 'vitality', direction, to});
    const position = (holder, to) => ({holder, position: true, direction: 'changed', to});
    const plant = {holder: 'plant', quantity: brewMeasureQuantity, direction: available ? 'down' : 'unchanged', to: 0};
    const paid = {holder: recipient.id, quantity: 'stamina', direction: 'down', to: 1};
    return {basis: 'authored', engine: {packs: ['a.mind', 'l.creature_form', 'l.breathing'], settings: {'l.breathing': {gills: true}}, shared: {
        quantities: [...Object.values(WORLD_QUANTITIES), {id: 'stamina', unit: 'effort', min: 0, max: 10}],
        properties: [...Object.values(WORLD_PROPERTIES), {id: 'material', type: 'label'},
            {id: 'haul-capacity', type: 'level', min: 0}, {id: 'haul-load', type: 'level', min: 1}],
    }, host: {costs: {accounts: {stamina: {quantity: 'stamina'}}}}},
    world: {holders: [
        {id: 'bank', kind: 'place'}, {id: 'lake', kind: 'place', properties: {submerged: true}},
        {id: 'ledge', kind: 'place', properties: {submerged: true}},
        {id: 'plant', kind: 'thing', place: 'bank', properties: {material: 'gillyweed'}, quantities: {[brewMeasureQuantity]: Number(available)}},
        {id: recipient.id, kind: 'body', place: 'bank', properties: {mind_awake: true, form: 'human', 'haul-capacity': 2},
            quantities: {breath: 3, vitality: 10, stamina: 2}},
        {id: 'marker', kind: 'thing', place: 'lake', properties: {'haul-load': 2}},
    ], links: [{id: 'shore', kind: 'path', from: 'bank', to: 'lake'},
        {id: 'lake-ledge', kind: 'path', from: 'lake', to: 'ledge'}]},
    timeline: [
        {id: 'eat', working: {family: 'gillyweed', bindings: {plant: ref('thing', 'plant'), eater: recipient}}},
        restore('restore-pending-eating'),
        {id: 'eaten', advanceTo: 1, expect: [plant, property(layers, available ? 'changed' : 'unchanged', available ? ['gilled|2|9'] : null)],
            ...(!available ? {interruption: {working: 'case.eat', reason: 'gillyweed-serving-unavailable'}} : {})},
        {id: 'dive', ops: [{op: 'property', holder: recipient.id, property: 'agency_goal', value: 'lake'}]},
        {id: 'underwater', advanceTo: 2, expect: [position(recipient.id, 'lake')]},
        {id: 'recover-marker', working: {family: 'body-haul', minutes: 5,
            bindings: {actor: recipient, cargo: ref('thing', 'marker'), destination: ref('place', 'ledge')}}},
        restore('restore-underwater-task'),
        {id: 'marker-moved', advanceTo: 7, expect: [position(recipient.id, 'ledge'), position('marker', 'ledge'), paid,
            reserve(available ? 'unchanged' : 'down', available ? 3 : 0), health(available ? 'unchanged' : 'down', available ? 10 : 8)]},
        {id: 'stay-on-ledge', ops: [{op: 'property', holder: recipient.id, property: 'agency_goal', value: null}]},
        {id: 'gills-expire', advanceTo: 9, expect: [property(layers, available ? 'changed' : 'unchanged', null),
            health(available ? 'unchanged' : 'down', available ? 10 : 6)]},
        restore('restore-after-gills'),
        {id: 'ordinary-breath', advanceTo: 10, expect: [reserve(available ? 'down' : 'unchanged', available ? 2 : 0)]},
    ], expect: [plant, position('marker', 'ledge'), paid, health(available ? 'unchanged' : 'down', available ? 10 : 5)]};
}

// The plant's raw yield can be re-admitted as exact stock for dilution.
export function bubotuberCase({gloves = true, dilute = true} = {}) {
    const pus = 'bubotuber-pus', water = 'dilution-water', bodyPack = 'l.living_body';
    const patient = 'patient', collected = gloves ? 4 : 3, lesions = 'skin-lesions';
    const output = ref('flask', 'serving');
    const data = stocked({measured: {name: pus, amount: collected}});
    data.engine.packs.push(bodyPack);
    data.engine.shared.properties = [...Object.values(WORLD_PROPERTIES),
        {id: 'material', type: 'label'}, {id: 'protective-gloves', type: 'flag'}];
    data.engine.settings = {[bodyPack]: {skinInjury: {kind: 'undiluted-pus', capacity: 10, unitsPerLesion: 1}}};
    const collector = data.world.holders.find(holder => holder.id === recipient.id);
    const living = () => ({[bodyPack]: livingBodyState({species: 'human', rate: 0})});
    Object.assign(collector, {tags: ['living.body'], state: living(), quantities: {satiety: 0, [lesions]: 0}});
    collector.properties['protective-gloves'] = gloves;
    data.world.holders.push({id: 'plant', kind: 'thing', place: 'bench', properties: {material: 'bubotuber'},
        quantities: {[brewMeasureQuantity]: 4}},
    {id: 'water', kind: 'thing', as: ['lot'], place: 'bench', quantities: {[brewMeasureQuantity]: 12}},
    {id: output.id, kind: 'thing', as: ['flask'], place: 'bench'},
    {id: patient, kind: 'body', place: 'bench', tags: ['living.body'], state: living(),
        quantities: {satiety: 0, [lesions]: 2}});
    data.engine.host.things['lot:water'] = {material: water, properties: {constituents: {[water]: 1000}}};
    const dose = brewDoseMethod({id: 'hp.apply-bubotuber', route: 'topical', treatment: {route: 'topical',
        pairs: [{quantity: lesions, part: 'diluted-pus', per: 2, reason: 'The diluted preparation treats the skin.'}]},
        responses: [{part: pus, minimum: 1, route: 'topical',
            sentence: {verb: 'add', object: 'mind', time: 'sustained'}, details: {minutes: 2, mind: {faculty: 'pain', amount: 2}}}]});
    const skin = (holder, direction, to) => ({holder, quantity: lesions, direction, to});
    const raw = dilute ? 'diluted-pus' : pus;
    data.world.holders.find(holder => holder.id === patient).properties = {mind_awake: true, mind_pain: 0};
    const pain = {holder: patient, property: 'mind_pain', direction: dilute ? 'unchanged' : 'changed', to: dilute ? 0 : 2};
    data.timeline = [
        {id: 'collect', working: {family: 'bubotuber', bindings: {plant: ref('thing', 'plant'), flask, collector: recipient}}},
        restore('restore-pending-collection'),
        {id: 'collected', advanceTo: 2, expect: [
            {holder: 'plant', quantity: brewMeasureQuantity, direction: 'down', to: 0},
            part(flask.id, pus, 'up', collected), part(recipient.id, pus, gloves ? 'unchanged' : 'up', gloves ? 0 : 1),
            skin(recipient.id, gloves ? 'unchanged' : 'up', gloves ? 0 : 1),
        ]}, restore('restore-collected'),
        ...(dilute ? [
            {id: 'dilute', working: {family: 'brew', bindings: {vessel: ref('vessel', 'cauldron'), flask, output, water: ref('lot', 'water')},
                method: {id: 'hp.dilute-bubotuber', revision: 1, law: BREW_LAW.ref,
                    roles: {vessel: 'vessel', flask: 'flask', output: 'flask', water: 'lot'}, steps: [
                        {op: 'admit-fraction', bindings: {vessel: 'vessel', flask: 'flask'}},
                        {op: 'admit', bindings: {vessel: 'vessel', lot: 'water'}},
                        {op: 'react', minutes: 1, bindings: {vessel: 'vessel'}, options: {reactions: [
                            {id: 'dilution', reactants: {[pus]: 1, [water]: 3}, products: {'diluted-pus': 4}},
                        ]}},
                        {op: 'divide', bindings: {vessel: 'vessel'}, options: {doses: 1}},
                        {op: 'pour', bindings: {vessel: 'vessel', flask: 'output'}, options: {index: 0}},
                    ]}}, expect: [part(flask.id, pus, 'down', 0),
                {holder: 'water', quantity: brewMeasureQuantity, direction: 'down', to: 0}]},
            restore('restore-pending-dilution'),
            {id: 'diluted', advanceTo: 3, expect: [part(flask.id, pus, 'unchanged', 0), part(output.id, raw, 'up', collected * 4)]},
            restore('restore-dilution'),
        ] : []),
        {id: 'apply', working: {family: 'brew-dose', method: dose,
            bindings: {flask: dilute ? output : flask, recipient: ref('body', patient)}}},
        restore('restore-pending-treatment'),
        {id: 'treated', advanceTo: dilute ? 5 : 4, expect: [part(patient, raw, 'up', dilute ? collected * 4 : collected),
            skin(patient, dilute ? 'down' : 'unchanged', dilute ? 0 : 2), pain]},
        restore('restore-treatment'),
    ];
    data.expect = [part(patient, raw, 'up', dilute ? collected * 4 : collected),
        skin(patient, dilute ? 'down' : 'unchanged', dilute ? 0 : 2),
        skin(recipient.id, gloves ? 'unchanged' : 'up', gloves ? 0 : 1)];
    return data;
}

// HPPE121 reports improvement with repeated application to lingering scars.
export function scarUnctionCase({route = 'topical', repeated = true} = {}) {
    const bodyPack = 'l.living_body', active = 'unction-active';
    const liquidKey = 'unction-liquid', activeKey = 'unction-active';
    const scar = 'scar-burden', care = 'scar-care-reserve';
    const topical = route === 'topical';
    const data = stocked({initial: {[active]: 8}, measured: {name: active, amount: 8}});
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {scarCare: {liquid: `energy:${liquidKey}`, active: `energy:${activeKey}`,
        capacity: 10, unitsPerPoint: 2}, skinInjury: {kind: 'corrosive-spill', capacity: 10, unitsPerLesion: 1}}};
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 0, [scar]: 5, [care]: 0, 'skin-lesions': 2, [`energy:${liquidKey}`]: 0},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})},
    });
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const dose = brewDoseMethod({id: 'hp.apply-scar-unction', route, amount: 4, responses: [{
        part: active, route: 'topical', minimum: 2, liquidUptake: {part: active, liquidKey, activeKey},
    }]});
    const apply = (id, at, before, total) => [
        {id, working: {family: 'brew-dose', method: dose, bindings: {flask, recipient}}},
        restore(`restore-pending-${id}`),
        {id: `settle-${id}`, advanceTo: at, expect: [part(flask.id, active, 'down', 8 - total),
            part(recipient.id, active, 'up', total), read(scar, 'unchanged', before),
            read(care, topical ? 'up' : 'unchanged', topical ? 2 : 0)]},
        restore(`restore-settled-${id}`),
        {id: `first-minute-${id}`, advanceTo: at + 1, expect: [
            read(scar, topical ? 'down' : 'unchanged', before - Number(topical)),
            read(care, topical ? 'down' : 'unchanged', Number(topical))]},
        restore(`restore-remodeling-${id}`),
        {id: `end-${id}`, advanceTo: at + 2, expect: [
            read(scar, topical ? 'down' : 'unchanged', before - 2 * Number(topical)),
            read(care, topical ? 'down' : 'unchanged', 0)]},
    ];
    data.timeline.push(...apply('first-application', 2, 5, 4),
        ...(repeated ? apply('second-application', 6, topical ? 3 : 5, 8) : []),
        {id: 'later-check', advanceTo: 10, expect: [
            read(scar, 'unchanged', topical ? (repeated ? 1 : 3) : 5), read('skin-lesions', 'unchanged', 2)]},
        restore('restore-later-check'));
    data.expect = [part(recipient.id, active, 'up', repeated ? 8 : 4),
        read(scar, topical ? 'down' : 'unchanged', topical ? (repeated ? 1 : 3) : 5), read('skin-lesions', 'unchanged', 2)];
    return data;
}

export function coverageCase(id) {
    if (id === 'dr_ubbly_s_oblivious_unction') return scarUnctionCase();
    if (id === 'bubotuber_pus') return bubotuberCase();
    if (id === 'gillyweed') return gillyweedCase();
    if (id === 'spreading_vapor') return spreadingVaporCase();
    if (id === 'lingering_vapor') return lingeringVaporCase();
    if (id === 'strengthening_solution') return strengtheningCase();
    if (id === 'invigoration_draught') return invigorationCase();
    if (id === 'cure_for_boils') return cureForBoilsCase();
    if (id === 'poisoning_aftercare') return poisoningAftercareCase();
    if (id === 'nutrient_infusion') return nutrientInfusionCase();
    if (id === 'ageing_potion') return ageingPotionCase();
    if (id === 'wolfsbane_potion') return wolfsbaneCase();
    if (id === 'pepperup_potion') return pepperupCase();
    if (id === 'felix_felicis') return maturedFelixCase();
    if (id === 'amortentia') return amortentiaCase();
    if (id === 'antidote_to_veritaserum') return veritaserumAntidoteCase();
    if (id === 'veritaserum') return veritaserumCase();
    if (id === 'skele_gro') return skeleGroCase();
    if (id === 'blood_replenishing_potion') return bloodReplenishingCase();
    if (id === 'mixture_of_powdered_silver_and_dittany') return silverAndDittanyCase();
    if (id === 'antidote_to_common_poisons') return commonPoisonAntidoteCase();
    if (id === 'burden_sized_antidote') return burdenSizedAntidoteCase();
    if (id === 'shared_antidote_serving') return sharedAntidoteServingCase();
    if (id === 'essence_of_dittany') return dittanyCase();
    if (id === 'calming_draught') return calmingDraughtCase();
    if (id === 'anti_jinx_varnish') return antiJinxVarnishCase();
    if (id === 'elixir_to_induce_euphoria') return euphoriaCase();
    if (id === 'gurdyroot_infusion') return gurdyrootInfusionCase();
    if (id === 'blended_storage') return blendedStorageCase();
    if (id === 'mrs_skower_s_all_purpose_magical_mess_remover') return messRemoverCase();
    if (id === 'retained_catalyst') return retainedCatalystCase();
    if (id === 'mandrake_restorative_draught') return mandrakeCase();
    if (id === 'recovered_origin') return recoveredOriginCase();
    if (id === 'murtlap_essence') return murtlapEssenceCase({reliefRoute: 'topical'});
    if (id === 'draught_of_living_death') return livingDeathUptakeCase();
    if (id === 'stored_infusion') return storedInfusionCase();
    if (id === 'polyjuice_potion') return polyjuiceCase();
    if (id === 'wit_sharpening_potion') return witSharpeningCase();
    if (id === 'doxycide') return doxycideCase();
    if (id === 'blended_antidote_trial') return identifiedBlendCase();
    if (id === 'identified_blend_strength') return identifiedBlendCase({sampleAmounts: {a: 2, b: 2}});
    if (id === 'assayed_blend_strength') return assayedBlendStrengthCase();
    if (id === 'alihotsy_draught') return identifiedAntidoteCase();
    if (id === 'assayed_alihotsy_remedy') return identifiedAntidoteCase({panelResolution: 3});
    if (id === 'strength_qualified_remedy') return strengthQualifiedRemedyCase();
    if (id === 'measured_remedy_serving') return measuredRemedyServingCase();
    if (id.startsWith('lotm.')) return lotmCase(id.slice('lotm.'.length));
    if (id === 'draught_of_peace') return draughtOfPeaceCase();
    if (id === 'shrinking_solution') return shrinkingCase();
    if (id === 'sleeping_draught') return sleepingCakeCase();
    if (id === 'potion_for_dreamless_sleep') return sleepingServing('dreamless-serving', 'oral', 8);
    if (id === 'confusing_concoction') return confusingConcoctionCase();
    if (id === 'forgetfulness_potion') return forgetfulnessPotionCase();
    if (id === 'swelling_solution') return swellingSplashCase();
    if (id === 'deflating_draught') return swellingCase();
    if (id === 'generated_brightening') return generatedBrightening();
    if (id === 'generated_staged_brightening') return generatedBrightening({staged: true});
    if (id === 'generated_catalyst') return generatedCatalystCase();
    if (id === 'generated_heat') return generatedHeatCase();
    if (id === 'generated_late_flask') return generatedLateFlaskCase();
    if (id === 'generated_aged_byproduct') return generatedLateFlaskCase({life: 10, useSpent: true});
    if (id === 'generated_admission') return generatedAdmissionCase();
    if (id === 'generated_lined_vessel') return generatedLinedVesselCase();
    if (id === 'generated_aged_ingredient') return generatedAgedIngredientCase();
    if (id === 'generated_spent_lot') return generatedSpentLotCase();
    if (id === 'generated_lot_storage_clock') return generatedSpentLotCase({spent: 1433, storageSince: 0});
    if (id === 'generated_lot_storage_change') return generatedLotStorageChangeCase();
    if (id === 'compound_mood_dose') return compoundMoodDoseCase();
    if (id === 'compound_uptake') return compoundUptakeCase();
    if (id === 'resumed_draught_of_peace') {
        const data = coverageCase('draught_of_peace');
        const bottled = data.timeline.findIndex(step => step.id === 'bottled');
        const at = data.timeline[bottled].advanceTo;
        const pour = data.timeline[0].working.method.steps.at(-1);
        pour.minutes = 1;
        data.world.holders.push({id: 'hall', kind: 'place'});
        data.timeline.splice(bottled, 0,
            {id: 'move-flask', ops: [{op: 'move', holder: flask.id, to: 'hall'}]},
            {id: 'failed-pour', advanceTo: at + 1, interruption: {working: 'case.brew', reason: 'flask-out-of-reach'},
                expect: [part(flask.id, 'peace-active', 'unchanged', 0)]},
            restore('restore-interrupted-pour'),
            {id: 'return-flask', ops: [{op: 'move', holder: flask.id, to: 'bench'}]},
            {id: 'retry-pour', resumeBrewPour: {from: 'case.brew'}},
            restore('restore-retry'));
        for (const step of data.timeline.slice(bottled + 6))
            if (step.advanceTo !== undefined) step.advanceTo += 2;
        return data;
    }
    throw new Error(`Unknown potion case ${id}.`);
}

// HPPE045/046 motivate a distinct combined burden. The amounts, binder
// and test subject's burden accounts are authored, as at the classroom bench.
export function blendedAntidoteCase({withBinder = true} = {}) {
    const recipe = blendedAntidoteRecipe({remedyA: 4, remedyB: 4, binder: Number(withBinder), operations: ['bind']});
    const lots = Object.fromEntries(recipe.lots.map(lot => [lot.material, lot]));
    const method = withPour(recipe.method, true);
    const measured = withBinder ? {name: 'joint', amount: 3} : {name: 'remedyA', amount: 4};
    const axis = (name, direction, to) => ({holder: recipient.id, quantity: `poison:${name}`, direction, to});
    const effects = [axis('a', 'down', 0), axis('b', 'down', 0), axis('blend', withBinder ? 'down' : 'unchanged', withBinder ? 1 : 2)];
    const data = stocked({lots, method, measured, route: 'oral', effect: effects});
    data.world.holders.find(holder => holder.id === recipient.id).quantities = {'poison:a': 2, 'poison:b': 2, 'poison:blend': 2};
    data.engine.shared.quantities = [WORLD_QUANTITIES.stock, {id: 'poison', keyed: true, unit: 'burden', min: 0, max: 20}];
    data.timeline.find(step => step.id === 'serve').working.method = brewDoseMethod({
        id: 'hp.serve.blended-remedy', route: 'oral', treatment: {route: 'oral', pairs: [
            {quantity: 'poison:a', part: 'remedyA', reason: 'The first remedy treats the first constituent.'},
            {quantity: 'poison:b', part: 'remedyB', reason: 'The second remedy treats the second constituent.'},
            {quantity: 'poison:blend', part: 'joint', per: 3, reason: 'The combined remedy treats the combined burden.'},
        ]},
    });
    data.expect.push(...effects);
    return data;
}

// HPPE047 and HPPE150 show acute oral treatment followed by rue.
export function poisoningAftercareCase({acuteRoute = 'oral'} = {}) {
    const acute = 'bezoar', followUp = 'rue-extract', burden = 'poison:acute';
    const vital = 'respiratory-capacity', bodyPack = 'l.living_body';
    const helped = acuteRoute === 'oral';
    const data = stocked({initial: {[acute]: 1}, measured: {name: acute, amount: 1}});
    const rue = ref('flask', 'rue');
    data.world.holders.push({id: rue.id, kind: 'thing', as: ['flask'], place: 'bench', quantities: {[brewDoseQuantity(followUp)]: 2}});
    Object.assign(data.world.holders.find(holder => holder.id === recipient.id), {
        tags: ['living.body'], quantities: {satiety: 0, [vital]: 4, [burden]: 3},
        state: {[bodyPack]: livingBodyState({species: 'human', rate: 0})},
    });
    data.engine.packs.push(bodyPack);
    data.engine.settings = {[bodyPack]: {poison: {burden, threshold: 3, capacity: 6}}};
    data.engine.shared.quantities = [...Object.values(WORLD_QUANTITIES),
        {id: 'poison', keyed: true, unit: 'burden', min: 0, max: 20}];
    const read = (quantity, direction, to) => ({holder: recipient.id, quantity, direction, to});
    const treatment = (id, source, partName, route, amount) => ({id, working: {family: 'brew-dose',
        bindings: {flask: source, recipient}, method: brewDoseMethod({id: `trial.${id}`, route, amount,
            treatment: {route: 'oral', pairs: [{quantity: burden, part: partName, reason: 'Supportive treatment.'}]}})}});
    data.timeline.push(treatment('acute-care', flask, acute, acuteRoute, 1), restore('restore-pending-acute'),
        {id: 'acute-settles', advanceTo: 2, expect: [read(vital, 'down', 2), read(burden, helped ? 'down' : 'unchanged', helped ? 2 : 3),
            part(flask.id, acute, 'down', 0), part(recipient.id, acute, 'up', 1)]},
        restore('restore-acute'),
        {id: 'breathing-after-acute', advanceTo: 3, expect: [read(vital, helped ? 'up' : 'down', helped ? 3 : 1)]},
        treatment('first-rue', rue, followUp, 'oral', 1), restore('restore-pending-rue'),
        {id: 'first-rue-settles', advanceTo: 5, expect: [read(burden, 'down', helped ? 1 : 2),
            read(vital, helped ? 'up' : 'down', helped ? 5 : 0), part(rue.id, followUp, 'down', 1)]},
        restore('restore-partial-rue'),
        treatment('second-rue', rue, followUp, 'oral', 1), restore('restore-pending-second-rue'),
        {id: 'second-rue-settles', advanceTo: 7, expect: [read(burden, 'down', helped ? 0 : 1),
            read(vital, 'up', helped ? 6 : 2), part(rue.id, followUp, 'down', 0)]},
        restore('restore-aftercare'));
    data.expect = [part(recipient.id, acute, 'up', 1), part(recipient.id, followUp, 'up', 2), read(burden, 'down', helped ? 0 : 1)];
    return data;
}

export function identifiedBlendCase({observer = 'healer', extraIngredient = false, withBinder = true, sampleAmounts} = {}) {
    const data = blendedAntidoteCase({withBinder});
    const brew = data.timeline[0];
    const {method, bindings} = brew.working;
    const simple = withBinder ? blendedAntidoteCase({withBinder: false}).timeline[0].working : brew.working;
    const combined = !withBinder && sampleAmounts ? blendedAntidoteCase().timeline[0].working : brew.working;
    const recipes = sampleAmounts ? [
        {ingredients: ['a', 'b'], shares: {b: {max: 400}}, method: simple.method, bindings: simple.bindings},
        {ingredients: ['a', 'b'], shares: {b: {min: 500, max: 600}}, method: combined.method, bindings: combined.bindings},
    ] : [{ingredients: ['a'], method: simple.method, bindings: simple.bindings}, {ingredients: ['a', 'b'], method, bindings}];
    brew.working = {family: 'brew-from-identification', request: {observer, sample: 'poison-sample', recipes}};
    data.engine.packs.push('n.knowledge');
    data.engine.shared.properties = Object.values(WORLD_PROPERTIES).filter(property => !['senses', 'concealed'].includes(property.id));
    data.engine.shared.quantities.push({id: 'stamina', unit: 'effort', min: 0, max: 5});
    data.engine.host.costs = {accounts: {stamina: {quantity: 'stamina'}}};
    const paid = {holder: 'healer', quantity: 'stamina', direction: 'down', to: 4};
    const sample = sampleAmounts ?? (extraIngredient ? {a: 2, b: 2, c: 2} : {a: 2, b: 2});
    data.world.holders.push(
        {id: 'poison-sample', kind: 'thing', as: ['flask'], place: 'bench',
            quantities: Object.fromEntries(Object.entries(sample).map(([name, amount]) => [brewDoseQuantity(name), amount]))},
        {id: 'healer', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}, quantities: {stamina: 5}},
        {id: 'witness', kind: 'body', place: 'bench', properties: {mind_awake: true, mind_memory: []}},
        {id: 'wand', kind: 'thing', place: 'bench', properties: {marks: ['grip:healer']}},
    );
    for (const step of data.timeline) if (step.advanceTo !== undefined) step.advanceTo++;
    data.timeline.unshift({id: 'inspect-blend', working: {family: 'spell', payer: 'healer', spells: [{
        sentence: {verb: 'sense', object: 'composition', target: 'object', time: 'instant', cost: 'stamina'},
        target: {id: 'poison-sample', kind: 'flask'}, grip: {caster: 'healer', implement: 'wand'},
        inspectComposition: 'dose', requiresSpeech: true, minutes: 1, details: {cost: 1},
    }]}}, restore('restore-pending-blend-reading'), {id: 'identify-blend', advanceTo: 1, expect: [paid]},
    restore('restore-blend-reading'));
    data.expect.push(paid, ...Object.entries(sample).map(([name, amount]) => part('poison-sample', name, 'unchanged', amount)));
    return data;
}

export function assayedBlendStrengthCase({resolution = 4, parts = ['a', 'b'], strips = 2, sessions = [parts],
    sampleAmounts = {a: 19, b: 21}, quantitativeOnly = false} = {}) {
    const data = identifiedBlendCase({sampleAmounts});
    const sample = ref('flask', 'poison-sample'), kit = ref('instrument', 'panel-kit');
    data.engine.shared.properties.push({id: 'assay_parts', type: 'set'}, {id: 'assay_quantitative_only', type: 'flag'});
    data.world.holders.push({id: kit.id, kind: 'thing', as: [kit.kind], place: 'bench',
        properties: {assay_parts: ['a', 'b'], assay_quantitative_only: quantitativeOnly},
        quantities: {[brewStripQuantity]: strips}});
    let remaining = strips;
    const panels = sessions.flatMap((session, i) => {
        const panel = Array.isArray(session) ? {parts: session, resolution} : session;
        const id = `blend-panel-${i + 1}`;
        remaining -= panel.parts.length;
        return [
            {id, working: {family: 'brew-assay', method: brewPanelAssayMethod({id, ...panel}),
                bindings: {flask: sample, instrument: kit, observer: ref('body', 'healer')}}},
            restore(`restore-pending-${id}`),
            {id: `read-${id}`, advanceTo: 2 * (i + 1), expect: [
                {holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: remaining},
            ]}, restore(`restore-${id}`),
        ];
    });
    data.timeline.splice(0, 4, ...panels);
    for (const step of data.timeline.slice(panels.length))
        if (step.advanceTo !== undefined) step.advanceTo += 2 * sessions.length - 1;
    data.expect = data.expect.filter(row => row.holder !== 'healer');
    data.expect.push({holder: kit.id, quantity: brewStripQuantity, direction: 'down', to: remaining});
    return data;
}

export function strengthQualifiedRemedyCase({panelResolution = 3, min = 375, max = 625, competing = false} = {}) {
    const data = identifiedAntidoteCase({panelResolution});
    data.engine.shared.properties.push(...['antidote_share_min', 'antidote_share_max'].map(id =>
        ({id, type: 'level', min: 0, max: 1000})));
    const remedy = data.world.holders.find(holder => holder.id === 'remedy');
    Object.assign(remedy.properties, {antidote_share_min: min, antidote_share_max: max});
    const other = data.world.holders.find(holder => holder.id === 'other-remedy');
    other.properties.antidote_for = 'alihotsy';
    if (competing) Object.assign(other.properties, {antidote_share_min: 300, antidote_share_max: 650});
    return data;
}

export function measuredRemedyServingCase({per = 5, serving = 5, panelResolution = 3} = {}) {
    const data = strengthQualifiedRemedyCase({panelResolution});
    data.engine.shared.properties.push(...['antidote_sample_units', 'antidote_serving_units'].map(id =>
        ({id, type: 'level', min: 1, max: 1000})));
    const remedy = data.world.holders.find(holder => holder.id === 'remedy');
    Object.assign(remedy.properties, {antidote_sample_units: per, antidote_serving_units: serving});
    const active = brewDoseQuantity('treacle');
    const administer = data.timeline.findIndex(step => step.id === 'administer-remedy');
    data.timeline[administer].working.request.candidates = ['remedy'];
    // Add two more active units to the four units just bottled.
    data.timeline.splice(administer, 0, {id: 'restock-treacle', ops: [
        {op: 'add', holder: 'remedy', quantity: active, amount: 2},
    ]}, restore('restore-restocked-treacle'));
    const treatment = data.timeline.find(step => step.id === 'treatment');
    treatment.expect.find(row => row.holder === 'remedy' && row.quantity === active).to = 2;
    return data;
}
