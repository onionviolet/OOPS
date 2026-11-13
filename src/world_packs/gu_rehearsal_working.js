// PC95. The generator forecasts a composition. The bench archives it only
// when the corresponding heat change lands on the actual target.
import {sameStructural} from '../basics.js';
import {archiveOffer, createNicheArchive, worldLaws} from '../effect_checks.js';
import {defineEffectGrammar} from '../effect_grammar.js';
import {startEngineWorking} from '../engine_world.js';
import {generateGuMoves, settleGeneratedGuMove} from '../gu_move_generation.js';
import {asBoundGu, guWorkingLaw} from '../gu_working_law.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {defineRecord, KNOWLEDGE_KINDS, recordsOf, taughtRecord} from '../knowledge_record.js';
import {substratePort} from '../world_substrate.js';

export const GU_REHEARSAL_PACK = 'g.gu-rehearsal';
export const GU_REHEARSAL_FUEL = 'energy:primeval.rank1';
const heat = {verb: 'add', object: 'heat', target: 'touched', time: 'instant', carrier: 'gu', cost: 'essence-primeval', limits: []};
const fitted = defineEffectGrammar({world: 'gu-fire-bench', carriers: {gu: ['essence-primeval']}});
const world = {
    fitted, canonParts: [heat], canonMoves: [['duplicate', 'enlarge', 'fire-source', 'red-fire']],
    laws: worldLaws([heat]), priceQuantity: 'essence.primeval',
    curve: {base: 1, perPoint: 1, fitted: false, reason: 'authored bench price'},
    words: {verb: {add: 'Raise'}, object: {heat: 'the heat'}, target: {touched: 'on contact'},
        time: {instant: 'at once'}, carrier: {gu: 'through Gu'}, cost: {'essence-primeval': 'using primeval essence'}},
    project: effect => effect.kind === 'flame' ? {parts: heat, fit: effect.magnitude} : null,
};
const heatFor = effect => effect.magnitude * (effect.count ?? 1);
const trialOpened = 'gu.rehearsal.trial';
const trialClosed = 'gu.rehearsal.closed';
const studyFuel = 'energy:attention';
const lessonRoles = {teacher: 'operator', student: 'operator'};
const fireSubject = kinds => 'gu.fire.' + kinds.join('.');
const operatorRef = id => ({kind: 'operator', id});
const readSpecimen = (gu, operator, at) => {
    const p = gu?.properties;
    if (!p || !operator.place || operator.place !== gu.place || p.gu_keeper !== operator.id || p.gu_controller !== operator.id) return null;
    return asBoundGu({id: gu.id, kind: p.gu_kind, holder: operator.id, rank: p.gu_rank, alive: p.alive === true,
        injured: p.injured, fedThrough: gu.quantities.satiety > 0 ? at : at - 1});
};
const reserves = operator => ({[operator.id]: {primeval: operator.quantities[GU_REHEARSAL_FUEL] ?? 0}});

function searchContext(engine, request) {
    const read = substratePort(engine.world);
    const operator = read(operatorRef(request.operator));
    if (!operator?.properties.alive) throw Error('The rehearsal needs a living operator.');
    const at = engine.world.clock;
    return {...request, operator, world, at, path: 'fire', effect: 'flame', facts: {reserves: reserves(operator)},
        ports: {read: (ref, minute) => ref.kind === 'gu' ? readSpecimen(read(ref), operator, minute) : read(ref)}};
}

export const generateRehearsalMoves = (engine, request) => generateGuMoves(searchContext(engine, request));
export const rehearsalArchive = (engine, operator) => engine.world.holders[operator]?.state[GU_REHEARSAL_PACK]?.archive ?? createNicheArchive();

export const guRehearsalPack = {
    id: GU_REHEARSAL_PACK, revision: 1,
    publishes: [trialOpened, trialClosed, KNOWLEDGE_KINDS.learn, KNOWLEDGE_KINDS.teach],
    hears: [trialOpened, trialClosed, 'effect.add'], reactors: [{
        id: 'trial', on: [trialOpened, trialClosed], appliesTo: holder => holder.as.includes('operator'),
        react(view, id, event) {
            if (event.by !== id) return [];
            const archive = view.state(id)?.archive ?? createNicheArchive();
            return [{op: 'state', holder: id, value: event.kind === trialOpened ? {archive, trial: event.detail} : {archive}}];
        },
    }, {
        id: 'record-landed-heat', on: ['effect.add'], appliesTo: holder => !!holder.state[GU_REHEARSAL_PACK]?.trial,
        react(view, id, event) {
            const {trial, archive} = view.state(id);
            if (event.by !== trial.cause || event.detail?.target !== trial.target ||
                event.detail.object !== 'temperature' || event.detail.amount !== trial.amount) return [];
            const evidence = {working: trial.working, at: view.clock, target: trial.target, amount: trial.amount};
            const settled = archiveOffer(archive, {...trial.entry, evidence});
            const roles = trial.entry.recipe.roles;
            const subject = fireSubject(roles.map(role => role.kind));
            const record = defineRecord({id: subject, subject: {kind: 'composition', id: subject},
                true: {fillers: Object.fromEntries(roles.map(role => [role.id, role.kind]))},
                source: {kind: 'observation', by: id, from: trial.working, at: view.clock}});
            return [{op: 'state', holder: id, value: {archive: settled.archive}},
                {op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: event.place, by: id, detail: {knowledge: {to: id, record}}}];
        },
    }],
};

const roles = {operator: 'operator', gu: 'gu', target: 'place'};
export const GU_REHEARSAL_LAW = defineWorkingLaw({id: 'gu.fire-rehearsal', revision: 1, operations: {
    teach: {roles: lessonRoles, minutes: 2, settle({bound: {teacher, student}, options, at}) {
        if (teacher.id === student.id || !teacher.place || teacher.place !== student.place ||
            !teacher.properties.alive || !student.properties.alive ||
            teacher.properties.mind_memory && [options.record, options.cover].filter(Boolean)
                .some(id => !teacher.properties.mind_memory.includes(id))) {
            return {ok: false, reason: 'The teacher and student must be present and the teacher must recall the move.'};
        }
        if ((teacher.quantities[studyFuel] ?? 0) < 1) return {ok: false, reason: 'The teacher needs attention for the lesson.'};
        return {ok: true, costs: [{quantity: studyFuel, payer: teacher.holder, amount: 1}], effects: [
            {op: 'publish', kind: KNOWLEDGE_KINDS.teach, place: student.place, by: teacher.holder,
                detail: {knowledge: {...options, from: teacher.holder, to: student.holder, at}}},
        ]};
    }},
    activate: {roles, minutes: 1, settle(context) {
        const {bound: {operator, gu: holder, target}, options, facts, at, address} = context;
        const gu = readSpecimen(holder, operator, at);
        if (!operator.properties.alive || !gu || gu.guKind !== options.kind || target.holder !== operator.place ||
            !Number.isSafeInteger(target.quantities.temperature)) {
            return {ok: false, reason: 'The living Gu or bench is unavailable.'};
        }
        const used = guWorkingLaw.operations.activate.settle({...context, bound: {operator, gu}, options: {},
            facts: {...facts, reserves: reserves(operator)}});
        if (!used.ok) return used;
        const costs = [{quantity: GU_REHEARSAL_FUEL, payer: operator.holder, amount: used.observed.cost}];
        const paid = [...(facts.paid ?? []), used.observed.cost];
        const effects = [];
        const [flame] = used.effects;
        if (flame) {
            const [working, step] = address.split('/');
            const {entry} = facts;
            const amount = heatFor(flame);
            const cause = `working:${working}:${step}`;
            const trial = entry && sameStructural(entry.effects, [flame]) && sameStructural(entry.costs.map(row => row.amount), paid);
            const event = {op: 'publish', place: target.holder, by: operator.id};
            if (trial) effects.push({...event, kind: trialOpened, detail: {working, cause, target: target.holder, amount, entry}});
            effects.push({sentence: {...heat, cost: 'none'}, details: {target: {shape: 'holder', id: target.holder}, amount}});
            if (trial) effects.push({...event, kind: trialClosed});
        }
        return {ok: true, costs, effects, facts: {modifiers: used.facts.modifiers, paid}, observed: used.observed};
    }},
}});

function startMove(engine, {id, recipe, bindings, target, facts}) {
    const methodRoles = {operator: 'operator', target: 'place', ...Object.fromEntries(recipe.roles.map(role => [role.id, 'gu']))};
    const method = {id: `gu.rehearsal.${recipe.id}`, revision: 1, law: GU_REHEARSAL_LAW.ref, grammar: recipe.grammar, roles: methodRoles,
        steps: recipe.roles.map(role => ({op: 'activate', bindings: {operator: 'operator', gu: role.id, target: 'target'},
            options: {kind: role.kind}}))};
    return startEngineWorking(engine, {id, law: GU_REHEARSAL_LAW, method, facts, bindings: {...bindings, target: {kind: 'place', id: target}}});
}

export function rehearseGuMove(engine, {candidate, request, id, target}) {
    const validation = settleGeneratedGuMove(candidate, searchContext(engine, request));
    if (!validation.ok) return {engine, reason: validation.reason};
    const entry = Object.values(validation.archive.niches)[0];
    return {engine: startMove(engine, {id, recipe: candidate.recipe, bindings: candidate.bindings, target,
        facts: {entry}})};
}

export function useRehearsedGuMove(engine, {id, operator, target, specimens}) {
    const entry = rehearsalArchive(engine, operator).niches['add|heat|gu'];
    if (!entry) return {engine, reason: 'No rehearsal has established this move.'};
    return useFireRecipe(engine, {id, operator, target, specimens, recipe: entry.recipe});
}

function useFireRecipe(engine, {id, operator, target, specimens, recipe}) {
    if (specimens.length !== recipe.roles.length || new Set(specimens).size !== specimens.length) {
        return {engine, reason: 'Each role needs a distinct Gu.'};
    }
    const bindings = {operator: operatorRef(operator),
        ...Object.fromEntries(recipe.roles.map((role, index) => [role.id, {kind: 'gu', id: specimens[index]}]))};
    return {engine: startMove(engine, {id, recipe, bindings, target})};
}

export function teachRehearsedGuMove(engine, {id, teacher, student, record, slots, cover}) {
    const records = recordsOf(engine.world, teacher);
    const lesson = records[record];
    if (lesson?.subject.kind !== 'composition' || !lesson.subject.id.startsWith('gu.fire.')) {
        return {engine, reason: 'The teacher has no record of that fire move.'};
    }
    if (slots && (!slots.length || slots.some(slot => !Object.hasOwn(lesson.true.fillers, slot)))) {
        return {engine, reason: 'The teacher cannot supply those steps.'};
    }
    const options = {record, ...(slots && {slots}), ...(cover && {cover})};
    if (!taughtRecord(records, {...options, from: teacher})) return {engine, reason: 'The cover must describe the same move.'};
    const method = {id: 'gu.fire.lesson', revision: 1, law: GU_REHEARSAL_LAW.ref, roles: lessonRoles,
        steps: [{op: 'teach', bindings: {teacher: 'teacher', student: 'student'}, options}]};
    return {engine: startEngineWorking(engine, {id, law: GU_REHEARSAL_LAW, method,
        bindings: {teacher: operatorRef(teacher), student: operatorRef(student)}})};
}

export function useLearnedGuMove(engine, {id, operator, record, target, specimens}) {
    const lesson = recordsOf(engine.world, operator)[record];
    if (lesson?.subject.kind !== 'composition' || !lesson.subject.id.startsWith('gu.fire.')) {
        return {engine, reason: 'The operator has no record of that fire move.'};
    }
    const fillers = Object.entries(lesson.believed.fillers);
    const roles = fillers.sort(([a], [b]) => Number(a.split('.')[1]) - Number(b.split('.')[1]))
        .map(([id, kind]) => ({id, kind}));
    if (roles.some((role, index) => role.id !== 'cast.' + index) ||
        fireSubject(roles.map(role => role.kind)) !== lesson.subject.id || lesson.believed.conditions.length) {
        return {engine, reason: 'The operator needs the full sequence and its casting conditions.'};
    }
    const recipe = {id: lesson.subject.id, grammar: fitted.ref, roles};
    return useFireRecipe(engine, {id, operator, target, specimens, recipe});
}
