// Host-independent potion workshop state over craft working and batch owners.
import {compileCraftWorking, craftOperationDictionary} from './craft_working.js';
import {createCraftState, learnCraftWorking, readCraftWorking, recordProduct, recordWorkingTrial, validateCraftState} from './craft_state.js';
import {cancelOutputs, defineDoseRules} from './craft_dose_rules.js';
import {potionWorkingWorlds} from './potion_working_rules.js';
import {planLiningBrew, planLiningWash, traceParts, validateLiningHistory, viewLining} from './potion_vessel_history.js';
import {ashwinderEggStage} from './hp_companion_potions.js';

const itemKey = id => JSON.stringify({id});
const materialId = key => JSON.parse(key).id;
const require = (ok, reason) => {if(!ok) throw Error(reason);};
const observer = 'player';
const whole = n => Number.isSafeInteger(n) && n >= 0;
const supportedStep = (law, op, level) => Object.hasOwn(law.ops, op) && whole(level)
    && level >= law.ops[op].levels[0] && level <= law.ops[op].levels[1];
const liningBrewInputs = (product, rule, serial) => ({
    serial, product: product.id,
    volume: product.inputs.reduce((n, [, , , qty]) => n + qty, 0) * rule.volumePerMeasure,
    freshTrace: product.inputs.reduce((n, [, id, , qty]) => n + (id === rule.tracer ? qty * rule.partsPerMeasure : 0), 0),
});
const bottleTrace = (workshop, serial) => workshop.liningHistory?.find(entry => entry.kind === 'brew' && entry.serial === Number(serial));
const fresh = world => ({craft: createCraftState({world}), stock: {}, steps: [], amounts: {}, serial: 0, bottles: {}, effects: {}});

function give(workshop, material) {
    const key = itemKey(material);
    workshop.stock[key] = (workshop.stock[key] ?? 0) + 1;
}
function spend(workshop, key, quantity) {
    require(workshop.stock[key] >= quantity, 'You no longer hold those portions.');
    workshop.stock[key] -= quantity;
    if(workshop.stock[key] === 0) delete workshop.stock[key];
}
function draftPlan(workshop, world, rules) {
    const lots = Object.entries(workshop.amounts).map(([key, qty]) => ({key, qty}));
    require(lots.length > 0, 'Measure at least one held ingredient.');
    const working = {
        id: `${rules.law.id}.working.${workshop.serial + 1}`, revision: 1, world, law: rules.law.ref,
        slots: lots.map(({key, qty}, index) => ({id: `portion-${index}`, role: materialId(key) === 'water' ? 'solvent' : 'active', select: {material: materialId(key)}, qty: [qty, qty]})),
        steps: workshop.steps,
    };
    return compileCraftWorking(working, {world, law: rules.law, lots, stock: workshop.stock,
        materialForKey: key => rules.law.catalogue.materials[materialId(key)], stations: []});
}

function pressFractions({law, separation}, mesh, exposed) {
    const screen = Object.hasOwn(separation.meshes, mesh) && separation.meshes[mesh];
    require(screen, 'Choose a mesh fitted to this press.');
    const liquid = screen.liquid;
    const liquidMass = law.catalogue.materials[liquid].properties[separation.axis];
    const fibre = law.catalogue.basis - exposed;
    const retainedLiquid = exposed - liquidMass;
    require(liquidMass > 0 && fibre > 0 && retainedLiquid >= 0, 'This press needs both liquid and fibre.');
    return {liquid, liquidMass, solidMass: fibre + retainedLiquid, fibre, retainedLiquid,
        capacity: Math.max(0, fibre - Math.ceil(retainedLiquid / separation.retainedLiquidPerCapacity))};
}

function wipeResidue(workshop, capacity) {
    const lifted = Math.min(workshop.pressResidue, capacity);
    workshop.pressResidue -= lifted;
    return lifted;
}

const settleWorkshop = (workshop, now) => {
    for(const [effect, record] of Object.entries(workshop.effects)) {
        if(now >= record.endsAt) delete workshop.effects[effect];
    }
    const job = workshop.job;
    if(!job || now < job.readyAt) return;
    if(job.lining) (workshop.liningHistory ??= []).push(job.lining);
    if(job.lining?.kind === 'wash') {
        delete workshop.job;
        return;
    }
    if(job.material) give(workshop, job.material);
    else if(job.separation) {
        workshop.separation = job.separation;
        give(workshop, job.separation.liquid);
        workshop.pressResidue = potionWorkingWorlds[workshop.craft.scope.world].separation.residue;
    }
    else if(job.drainCake) workshop.separation.drained = true;
    else {
        workshop.craft = recordProduct(workshop.craft, job.product);
        workshop.bottles[job.serial] = {product: job.product.id, working: job.working,
            ...(job.extraction ? {extraction: job.extraction} : {})};
    }
    delete workshop.job;
};

export function settlePotionWorkings(workshops, now) {
    for(const workshop of Object.values(workshops ?? {})) settleWorkshop(workshop, now);
}

function consume(workshop, rules, request, now) {
    const bottle = workshop.bottles[request.bottle];
    require(bottle, 'Choose a bottle you still hold.');
    const product = workshop.craft.products[bottle.product];
    require(['oral', 'assay', 'topical'].includes(request.route), 'Choose a delivery route.');
    const outputs = product.outputs[request.route] ?? {};
    const effects = Object.entries(outputs).filter(([effect]) => rules.outcomes[effect]?.route === request.route);
    const subjects = effects.flatMap(([effect]) => rules.outcomes[effect].subjects ?? []);
    if(subjects.length) {
        require(subjects.includes(request.subject), 'Choose the object of attention before taking the dose.');
    }
    const trace = bottleTrace(workshop, request.bottle);
    if(trace) (workshop.liningUses ??= {})[request.bottle] = request.route;
    delete workshop.liningInspections?.[request.bottle];
    delete workshop.bottles[request.bottle];
    const witnessed = [];
    const messages = [];
    for(const [effect, strength] of effects) {
        const rule = rules.outcomes[effect];
        if(rule.clears) {
            const condition = workshop.effects[rule.clears];
            if(!condition) continue;
            const doseLaw = defineDoseRules({id: rules.law.id, revision: rules.law.revision,
                pairs: [{a: rule.clears, b: effect, reason: rule.label}]});
            const result = cancelOutputs(doseLaw, {[request.route]: {[rule.clears]: condition.strength, [effect]: strength}});
            const remaining = result.outputs[request.route]?.[rule.clears];
            if(remaining) condition.strength = remaining;
            else delete workshop.effects[rule.clears];
            messages.push(remaining ? `${rule.label}: the symptoms eased.` : `${rule.label}: the symptoms cleared.`);
        } else if(request.route === 'assay') {
            messages.push(`${rule.label}: the liquid moves more slowly (${strength}).`);
        } else {
            workshop.effects[effect] = {strength, endsAt: now + strength, ...(rule.subjects ? {subject: request.subject} : {})};
            messages.push(rule.subjects ? `${rule.onset} ${request.subject.toLowerCase()}.` : `${rule.label} set in.`);
        }
        witnessed.push({route: request.route, effect});
    }
    if(witnessed.length) {
        workshop.craft = recordWorkingTrial(workshop.craft, product, {observer, at: now, effects: witnessed});
        workshop.craft = learnCraftWorking(workshop.craft, rules.law, bottle.working, {
            observer, product: product.id, ...witnessed[0],
        });
    }
    return messages.join(' ') || 'You used the bottle and observed no change.';
}

export function applyPotionWorking(state, context, request, pay) {
    const {world, location, now} = context;
    const rules = potionWorkingWorlds[world];
    require(rules && rules.location === location, 'Go to the local potioneering workroom.');
    const workshops = state.potionWorkings ??= {};
    const workshop = workshops[world] ??= fresh(world);
    settleWorkshop(workshop, now);
    switch(request.action) {
    case 'separate': {
        const rule = rules.separation;
        require(rule && !workshop.job, 'Use the local press after the current work finishes.');
        require(!workshop.separation || workshop.separation.liquidUsed && workshop.separation.solidsUsed && !workshop.pressResidue,
            'Clear the tray and wipe away the previous residue first.');
        require(workshop.amounts[itemKey(rule.input)] === 1 && Object.keys(workshop.amounts).length === 1 &&
            workshop.steps.length === 1 && workshop.steps[0].op === 'extract', 'Measure one balm leaf and choose only Grind and press.');
        const plan = draftPlan(workshop, world, rules);
        const {product} = plan.batch;
        const mesh = request.mesh ?? rule.defaultMesh;
        const fractions = pressFractions(rules, mesh, product.composition[rule.axis]);
        pay(rule.fee);
        spend(workshop, itemKey(rule.input), 1);
        workshop.amounts = {};
        const readyAt = now + rules.operationMinutes.extract;
        workshop.job = {readyAt, separation: {id: ++workshop.serial, parent: product.id, input: rule.input, ...fractions,
            mesh, startedAt: now, readyAt, liquidUsed: false, solidsUsed: false}};
        return 'One balm leaf is in the press. Its liquid and cake will stay in separate containers.';
    }
    case 'drain-cake': {
        const portion = workshop.separation;
        const minutes = rules.separation?.drainMinutes;
        require(minutes && !workshop.job && portion?.retainedLiquid > 0 && !portion.solidsUsed && !portion.drained,
            'Keep a damp cake and free the worktable before draining it.');
        workshop.job = {readyAt: now + minutes, drainCake: {id: portion.id, startedAt: now}};
        return `The cake is on the draining rack. The runoff goes to the waste tray. Return in ${minutes} minutes.`;
    }
    case 'wipe-press': {
        const portion = workshop.separation;
        require(rules.separation && portion && !portion.solidsUsed && !workshop.job?.drainCake && workshop.pressResidue > 0, 'Keep a press cake to wipe the dirty press.');
        portion.solidsUsed = true;
        const lifted = wipeResidue(workshop, portion.drained ? portion.fibre : portion.capacity ?? portion.solidMass);
        return workshop.pressResidue
            ? `The damp cake lifted ${lifted} parts of residue. ${workshop.pressResidue} remain on the press.`
            : 'The fibrous cake lifted the residue from the press.';
    }
    case 'wipe-cloth': {
        const cloth = rules.separation?.cloth;
        require(cloth && workshop.separation?.solidsUsed && workshop.pressResidue > 0, 'Use the cake before asking for a clean cloth.');
        pay(cloth.fee);
        wipeResidue(workshop, cloth.capacity);
        workshop.separation.clothUsed = true;
        return 'The clean cloth lifted the remaining residue.';
    }
    case 'source': {
        const source = rules.sources.find(row => row.material === request.material);
        require(source && !workshop.job, 'Finish the current work or choose a local supply.');
        workshop.job = {material: source.material, readyAt: now + source.minutes};
        return `${source.label}. Return in ${source.minutes} minutes.`;
    }
    case 'fire':
        require(rules.ashwinder && !workshop.egg && !workshop.job, 'Finish the current work before tending the magical fire.');
        workshop.egg = {fireAt: now};
        return 'The magical fire is burning in the attended hearth.';
    case 'collect':
        require(rules.ashwinder && workshop.egg && ashwinderEggStage(workshop.egg, now) === 'nest', 'There is no hot egg ready to collect.');
        workshop.egg.takenAt = now;
        return 'You collect the hot egg with tongs.';
    case 'freeze':
        require(rules.ashwinder && workshop.egg && ashwinderEggStage(workshop.egg, now) === 'hot', 'Bring a hot egg to the freezing station.');
        give(workshop, 'frozen_egg');
        delete workshop.egg;
        return 'The instructor freezes your egg. You keep one frozen egg.';
    case 'clear':
        require(rules.ashwinder && workshop.egg && ['scorched', 'missed'].includes(ashwinderEggStage(workshop.egg, now)), 'There is no spent nest to clear.');
        delete workshop.egg;
        return 'You clear the spent nest.';
    case 'measure': {
        const key = itemKey(request.material);
        require(whole(request.quantity) && request.quantity <= (workshop.stock[key] ?? 0), 'Measure an amount you actually hold.');
        if(request.quantity) workshop.amounts[key] = request.quantity;
        else delete workshop.amounts[key];
        return 'Portions measured for this working.';
    }
    case 'append':
        require(Object.hasOwn(rules.law.ops, request.operation) && workshop.steps.length < rules.law.limits.steps, 'Choose an available operation with space on the slate.');
        require(supportedStep(rules.law, request.operation, request.level), 'Choose an available effort.');
        workshop.steps.push({op: request.operation, level: request.level});
        return 'Operation added.';
    case 'reset':
        workshop.steps = [];
        workshop.amounts = {};
        return 'Slate cleared.';
    case 'inspect-trace': {
        require(rules.lining && Object.hasOwn(workshop.bottles, request.bottle), 'Choose a bottle you still hold.');
        const trace = bottleTrace(workshop, request.bottle);
        const amount = trace ? traceParts(trace.bottle) : 0;
        (workshop.liningInspections ??= {})[request.bottle] = true;
        return amount ? `You measure ${amount} ${amount === 1 ? 'part' : 'parts'} of ${rules.lining.label.toLowerCase()} in this bottle.`
            : 'You find no blue tracer in this bottle.';
    }
    case 'wash-lining': {
        const rule = rules.lining;
        require(rule && !workshop.job, 'Use the cauldron after the current work finishes.');
        const lining = planLiningWash(workshop.liningHistory, rule, workshop.serial + 1);
        spend(workshop, itemKey('water'), lining.waterMeasures);
        const key = itemKey('water');
        const measured = Math.min(workshop.amounts[key] ?? 0, workshop.stock[key] ?? 0);
        if(measured) workshop.amounts[key] = measured;
        else delete workshop.amounts[key];
        workshop.serial++;
        workshop.job = {lining, readyAt: now + rule.washMinutes * lining.waterMeasures};
        return 'You start rinsing the cauldron into a separate jar.';
    }
    case 'brew': {
        require(!workshop.job, 'Finish the work already in progress.');
        const plan = draftPlan(workshop, world, rules);
        const lining = rules.lining && planLiningBrew(workshop.liningHistory, rules.lining,
            liningBrewInputs(plan.batch.product, rules.lining, workshop.serial + 1));
        const split = workshop.separation;
        // The bench makes up a standard measure with water paid for at the
        // press. Only the actual extract came out of the leaf.
        const extraction = split && plan.consumed.some(({key}) => key === itemKey(split.liquid))
            ? {id: split.id, parent: split.parent, extractMass: split.liquidMass,
                ...(split.mesh ? {mesh: split.mesh} : {}), makeUpWater: rules.law.catalogue.basis - split.liquidMass}
            : null;
        if(extraction) split.liquidUsed = true;
        for(const {key, qty} of plan.consumed) spend(workshop, key, qty);
        const minutes = plan.process.reduce((total, step) => total + rules.operationMinutes[step.op] * step.level, 0);
        workshop.job = {readyAt: now + minutes, serial: ++workshop.serial, product: structuredClone(plan.batch.product), working: plan.working,
            ...(extraction ? {extraction} : {}), ...(lining ? {lining} : {})};
        workshop.amounts = {};
        return `The working is underway. Return in ${minutes} minutes.`;
    }
    case 'recall': {
        const method = readCraftWorking(workshop.craft, request.method, observer);
        require(method, 'Choose a working you have written down.');
        workshop.steps = method.steps;
        workshop.amounts = Object.fromEntries(method.slots.filter(({select, qty}) => (workshop.stock[itemKey(select.material)] ?? 0) >= qty[0])
            .map(({select, qty}) => [itemKey(select.material), qty[0]]));
        return 'Working recalled. Check the measured stock.';
    }
    case 'dose':
        return consume(workshop, rules, request, now);
    case 'sore-skin':
        require(rules.skinTrial && !workshop.effects.sore_skin, 'There is already a skin condition to observe.');
        workshop.effects.sore_skin = {strength: rules.skinTrial.strength, endsAt: now + rules.skinTrial.minutes};
        return 'You recorded a mild irritation for the salve comparison.';
    default:
        throw Error('Choose a potioneering action.');
    }
}

export function viewPotionWorkings(workshops, context) {
    const {world, location, now} = context;
    const rules = potionWorkingWorlds[world];
    if(!rules || rules.location !== location) return null;
    const workshop = structuredClone(workshops?.[world] ?? fresh(world));
    settleWorkshop(workshop, now);
    const egg = workshop.egg && ashwinderEggStage(workshop.egg, now);
    return {
        title: rules.title, world, sources: rules.sources,
        lining: viewLining(workshop.liningHistory, rules.lining, workshop.liningUses),
        separation: rules.separation ? {fee: rules.separation.fee, portion: workshop.separation ?? null, residue: workshop.pressResidue ?? 0, cloth: rules.separation.cloth, drainMinutes: rules.separation.drainMinutes,
            defaultMesh: rules.separation.defaultMesh, meshes: Object.entries(rules.separation.meshes)} : null,
        materials: Object.entries(workshop.stock).map(([key, count]) => {
            const id = materialId(key);
            return {id, name: rules.law.catalogue.materials[id].name, count, measured: workshop.amounts[key] ?? 0};
        }),
        egg, eggSite: !!rules.ashwinder, skinTrial: !!rules.skinTrial,
        subjects: Object.values(rules.outcomes).flatMap(row => row.subjects ?? []),
        operations: craftOperationDictionary(rules.law),
        steps: workshop.steps,
        working: workshop.job ? {minutes: workshop.job.readyAt - now} : null,
        bottles: Object.keys(workshop.bottles).map(id => {
            const trace = workshop.liningInspections?.[id] && bottleTrace(workshop, id);
            return {id, label: `Sealed bottle ${id}`, ...(workshop.liningInspections?.[id] ? {
                trace: trace ? traceParts(trace.bottle) : 0,
                released: trace ? trace.released : 0,
            } : {})};
        }),
        methods: Object.keys(workshop.craft.recipes).map(id => readCraftWorking(workshop.craft, id, observer)).filter(Boolean),
        effects: Object.entries(workshop.effects).map(([effect, {subject, strength, endsAt}]) => ({
            label: rules.outcomes[effect]?.label ?? 'Skin irritation', subject, strength, minutes: endsAt - now,
        })),
        routes: [...new Set(Object.values(rules.outcomes).map(row => row.route))],
    };
}

function validBottledWorking(working, product, world, law, serial) {
    if(!working || !product || working.world !== world || working.law !== law.ref || working.revision !== 1
        || working.id !== `${law.id}.working.${serial}` || working.steps.length !== product.process.length
        || working.slots.length !== product.inputs.length) return false;
    if(!working.steps.every(({op, level}, index) => op === product.process[index][0] && level === product.process[index][1])) return false;
    const quantities = new Map(product.inputs.map(([role, id, , qty]) => [id, role === 'consumed' ? qty : 0]));
    return working.slots.every(({id, role, select, qty}, index) => {
        const material = select.material;
        const amount = quantities.get(material);
        quantities.delete(material);
        return id === `portion-${index}` && role === (material === 'water' ? 'solvent' : 'active')
            && whole(amount) && amount > 0 && qty[0] === amount && qty[1] === amount;
    });
}

function checkLiningBatch(entry, product, rule) {
    require(entry.kind === 'brew' && product && entry.product === product.id, 'Cauldron history needs its batch.');
    const inputs = liningBrewInputs(product, rule, entry.serial);
    require(entry.volume === inputs.volume && entry.freshTrace === inputs.freshTrace, 'Cauldron trace disagrees with measured stock.');
}

export function validatePotionWorkings(workshops, now) {
    require(workshops && typeof workshops === 'object' && !Array.isArray(workshops), 'Invalid potion workrooms.');
    for(const [world, workshop] of Object.entries(workshops)) {
        const rules = potionWorkingWorlds[world];
        require(rules && workshop?.craft?.scope?.world === world && whole(workshop.serial), 'Invalid local potion records.');
        const {law} = rules;
        const {catalogue} = law;
        const fractionsFor = record => {
            const rule = rules.separation;
            return pressFractions(rules, record.mesh ?? rule.defaultMesh, catalogue.materials[rule.input].properties[rule.sourceAxis]);
        };
        const checkExtraction = record => require(rules.separation && whole(record.id) && record.id > 0 && record.id <= workshop.serial &&
            typeof record.parent === 'string' && record.extractMass === fractionsFor(record).liquidMass &&
            record.makeUpWater === catalogue.basis - record.extractMass, 'Invalid retained extract source.');
        const checkSeparation = record => {
            const rule = rules.separation;
            require(rule && whole(record.id) && record.id > 0 && record.id <= workshop.serial && record.input === rule.input &&
                typeof record.parent === 'string' && whole(record.startedAt) && record.startedAt <= now &&
                record.readyAt === record.startedAt + rules.operationMinutes.extract &&
                typeof record.liquidUsed === 'boolean' && typeof record.solidsUsed === 'boolean', 'Invalid saved separated portions.');
            const {liquid, liquidMass, solidMass, capacity, fibre, retainedLiquid} = fractionsFor(record);
            require(record.liquid === liquid && record.liquidMass === liquidMass && record.solidMass === solidMass &&
                (record.mesh == null ? record.capacity == null && record.fibre == null && record.retainedLiquid == null
                    : record.capacity === capacity && record.fibre === fibre && record.retainedLiquid === retainedLiquid) &&
                (record.drained == null || record.drained === true && record.retainedLiquid > 0) &&
                (record.clothUsed == null || record.clothUsed === true && record.solidsUsed && (record.drained ? fibre : capacity) < rule.residue),
                'Invalid saved press fractions.');
        };
        if(workshop.separation) {
            const split = workshop.separation;
            checkSeparation(split);
            const capacity = split.drained ? split.fibre : split.capacity ?? split.solidMass;
            const lifted = split.solidsUsed ? capacity : 0;
            const clothLifted = split.clothUsed ? rules.separation.cloth.capacity : 0;
            const remaining = Math.max(0, rules.separation.residue - lifted - clothLifted);
            require(split.readyAt <= now && workshop.pressResidue === remaining, 'Saved press residue disagrees with cleaning.');
        }
        for(const mesh of Object.values(rules.separation?.meshes ?? {})) {
            const split = workshop.separation;
            const held = split?.liquid === mesh.liquid && !split.liquidUsed ? 1 : 0;
            require((workshop.stock[itemKey(mesh.liquid)] ?? 0) === held, 'Separated stock disagrees with its custody.');
        }
        const registry = {laws: {[law.ref]: law}, catalogues: {[catalogue.ref]: catalogue}};
        validateCraftState(workshop.craft, registry);
        require(Object.entries(workshop.stock).every(([key, count]) => whole(count) && count > 0
            && key === itemKey(materialId(key)) && Object.hasOwn(catalogue.materials, materialId(key))), 'Invalid held potion stock.');
        require(Object.entries(workshop.amounts).every(([key, qty]) => whole(qty) && qty > 0 && qty <= workshop.stock[key]), 'Invalid measured portions.');
        require(Array.isArray(workshop.steps) && workshop.steps.length <= law.limits.steps
            && workshop.steps.every(({op, level}) => supportedStep(law, op, level)), 'Invalid saved potion operations.');
        for(const [id, bottle] of Object.entries(workshop.bottles)) {
            require(whole(Number(id)) && Number(id) > 0 && String(Number(id)) === id && Number(id) <= workshop.serial
                && validBottledWorking(bottle.working, workshop.craft.products[bottle.product], world, law, id), 'Invalid saved potion bottle.');
            if(bottle.extraction) checkExtraction(bottle.extraction);
            if(rules.lining && liningBrewInputs(workshop.craft.products[bottle.product], rules.lining, Number(id)).freshTrace)
                require(bottleTrace(workshop, id), 'A tracer brew needs its cauldron history.');
        }
        if(workshop.liningHistory || workshop.liningUses || workshop.liningInspections || workshop.job?.lining) {
            const history = workshop.liningHistory ?? [];
            const pending = workshop.job?.lining;
            require(!pending || pending.kind === 'wash' || pending.kind === 'brew' && workshop.job.product &&
                !workshop.job.material && !workshop.job.separation, 'Invalid pending cauldron job.');
            validateLiningHistory(pending ? [...history, pending] : history, rules.lining, workshop.serial);
            for(const entry of history.filter(row => row.kind === 'brew')) {
                checkLiningBatch(entry, workshop.craft.products[entry.product], rules.lining);
                require(Object.hasOwn(workshop.bottles, entry.serial) !== Object.hasOwn(workshop.liningUses ?? {}, entry.serial),
                    'Traced bottle has inconsistent custody.');
                if(workshop.bottles[entry.serial]) require(workshop.bottles[entry.serial].product === entry.product, 'Traced bottle disagrees with its batch.');
            }
            for(const [id, route] of Object.entries(workshop.liningUses ?? {}))
                require(bottleTrace(workshop, id) && ['oral', 'assay', 'topical'].includes(route), 'Invalid traced bottle use.');
            for(const [id, inspected] of Object.entries(workshop.liningInspections ?? {}))
                require(inspected === true && Object.hasOwn(workshop.bottles, id), 'Invalid bottle inspection.');
        }
        if(workshop.job) {
            const job = workshop.job;
            require(whole(job.readyAt) && job.readyAt > now, 'Invalid saved potion deadline.');
            if(job.lining?.kind === 'wash') {
                require(job.lining.serial === workshop.serial && !job.product && !job.material && !job.separation,
                    'Invalid saved cauldron wash.');
            }
            else if(job.separation) {
                checkSeparation(job.separation);
                require(job.readyAt === job.separation.readyAt && !job.separation.liquidUsed && !job.separation.solidsUsed && !job.separation.clothUsed && !job.separation.drained, 'Invalid press job.');
            }
            else if(job.drainCake) {
                const split = workshop.separation;
                const {id, startedAt} = job.drainCake;
                require(rules.separation && split?.id === id && split.retainedLiquid > 0 && !split.drained &&
                    !split.solidsUsed && whole(startedAt) && startedAt >= split.readyAt && startedAt <= now &&
                    job.readyAt === startedAt + rules.separation.drainMinutes, 'Invalid cake draining job.');
            }
            else if(job.material) require(rules.sources.some(row => row.material === job.material), 'Invalid potion supply job.');
            else {
                require(job.serial === workshop.serial && !workshop.bottles[job.serial]
                    && validBottledWorking(job.working, job.product, world, law, job.serial), 'Invalid potion batch job.');
                validateCraftState(recordProduct(workshop.craft, job.product), registry);
                if(job.extraction) checkExtraction(job.extraction);
                if(rules.lining) {
                    const expected = planLiningBrew(workshop.liningHistory, rules.lining,
                        liningBrewInputs(job.product, rules.lining, job.serial));
                    require(Boolean(expected) === Boolean(job.lining), 'A pending tracer brew needs its cauldron history.');
                }
                if(job.lining) {
                    require(job.lining.serial === job.serial, 'Invalid pending cauldron transfer.');
                    checkLiningBatch(job.lining, job.product, rules.lining);
                }
            }
        }
        for(const [effect, entry] of Object.entries(workshop.effects)) {
            require((Object.hasOwn(rules.outcomes, effect) || effect === 'sore_skin' && rules.skinTrial)
                && whole(entry.strength) && entry.strength > 0 && whole(entry.endsAt) && entry.endsAt > now
                && (!rules.outcomes[effect]?.subjects || rules.outcomes[effect].subjects.includes(entry.subject)), 'Invalid saved potion effect.');
        }
        if(workshop.egg) require(rules.ashwinder && whole(workshop.egg.fireAt) && workshop.egg.fireAt <= now
            && (workshop.egg.takenAt == null || whole(workshop.egg.takenAt) && workshop.egg.takenAt <= now
                && ashwinderEggStage({fireAt: workshop.egg.fireAt}, workshop.egg.takenAt) === 'nest'), 'Invalid saved egg work.');
    }
}
