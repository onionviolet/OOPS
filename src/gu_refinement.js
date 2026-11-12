// Settlement for one world. Callers serialize transitions against the current
// world state and publish the returned snapshot once. The living specimen is
// the uniqueness claim, so changing custody cannot release it.
import {stableId} from './simulation_ids.js';

function check(condition, message) {
    if (!condition) throw Error(message);
}

export function beginGuRefinement(state, {id, refiner, recipe, precursor, ingredients = {}, productId = id}) {
    check(stableId(id) && !state.attempts.some(job => job.id === id), 'Refinement identity is invalid or already used.');
    check(stableId(refiner) && Object.hasOwn(state.stocks, refiner), 'Unknown refiner.');
    check(stableId(recipe?.id) && Number.isSafeInteger(recipe.revision) && recipe.revision > 0 &&
        stableId(recipe.kind) && Number.isSafeInteger(recipe.rank) && recipe.rank > 0 &&
        (recipe.uniqueKey === undefined || stableId(recipe.uniqueKey)) &&
        Array.isArray(recipe.stages) && recipe.stages.length > 0, 'Invalid refinement procedure.');
    const roles = recipe.ingredients ?? {};
    check(recipe.vitalSuccessorRole === undefined || precursor === undefined && Object.hasOwn(roles, recipe.vitalSuccessorRole),
        'A vital successor needs a bound fusion ingredient.');
    check(Object.keys(ingredients).length === Object.keys(roles).length, 'Choose every refinement ingredient.');
    const participants = Object.entries(roles).map(([role, kind]) => {
        const binding = Object.hasOwn(ingredients, role) && ingredients[role];
        const specimen = state.gu.find(gu => gu.id === binding);
        check(stableId(role) && stableId(kind) && specimen?.alive && specimen.holder === refiner &&
            specimen.kind === kind, 'The refinement needs the right living Gu in your custody.');
        if (role === recipe.vitalSuccessorRole) check(stableId(specimen.vitalMaster), 'The chosen Gu has no vital bond to carry forward.');
        return binding;
    });
    if (recipe.precursorKind !== undefined) {
        const specimen = state.gu.find(gu => gu.id === precursor);
        check(specimen?.alive && specimen.holder === refiner && specimen.kind === recipe.precursorKind &&
            specimen.rank < recipe.rank, 'The refinement needs its living precursor in your custody.');
        check(!specimen.uniqueKey || recipe.uniqueKey, 'Advancement needs the resulting Immortal identity.');
        check(!specimen.uniqueKey || specimen.kind !== recipe.kind || recipe.uniqueKey === specimen.uniqueKey,
            'Advancing the same Immortal Gu kind must preserve its unique identity.');
        participants.push(precursor);
    } else {
        check(precursor === undefined && (stableId(productId) || Number.isSafeInteger(productId) && productId > 0) &&
            !state.gu.some(gu => gu.id === productId) && !state.attempts.some(job =>
                job.status === 'working' && job.precursor === undefined && job.productId === productId),
        'Invalid product binding.');
    }
    check(new Set(participants).size === participants.length, 'Choose separate Gu for each refinement role.');
    check(!state.attempts.some(job => job.status === 'working' && participants.some(specimen =>
        job.precursor === specimen || Object.values(job.ingredients ?? {}).includes(specimen))),
    'A refinement participant is already committed.');
    const next = structuredClone(state);
    const stock = next.stocks[refiner];
    for (const stage of recipe.stages) {
        check(stableId(stage.id) && Array.isArray(stage.inputs), 'Invalid refinement stage.');
        check(stage.onPrecursorControlFailure === undefined || precursor !== undefined &&
            ['destroy', 'injure'].includes(stage.onPrecursorControlFailure), 'Invalid precursor failure effect.');
        for (const [role, effect] of Object.entries(stage.onControlFailure ?? {})) {
            check(Object.hasOwn(roles, role) && ['destroy', 'injure'].includes(effect), 'Invalid refinement failure effect.');
        }
        for (const {material, amount} of stage.inputs) {
            check(stableId(material) && Number.isSafeInteger(amount) && amount > 0, 'Invalid refinement input.');
            check(Object.hasOwn(stock, material) && Number.isSafeInteger(stock[material]) &&
                stock[material] >= amount, 'The refiner lacks the required materials.');
            stock[material] -= amount;
        }
    }
    next.attempts.push({id, refiner, recipe: structuredClone(recipe), ingredients: structuredClone(ingredients),
        ...(precursor === undefined ? {productId} : {precursor}),
        cursor: 0, status: 'working'});
    return next;
}

// A host can supply an ordinary control failure at any stage. The report for
// either kind of failure is identical; the private record keeps the reason.
export function stepGuRefinement(state, id, {controlFailed = false, isLivingMaster = () => false} = {}) {
    const {next, job} = workingAttempt(state, id);
    const {recipe} = job;
    const specimen = job.precursor === undefined ? null : next.gu.find(gu => gu.id === job.precursor);
    if (job.precursor !== undefined && (!specimen?.alive || specimen.holder !== job.refiner ||
        specimen.kind !== recipe.precursorKind || specimen.rank >= recipe.rank)) {
        finishUnsuccessful(next, job, 'precursor-unavailable');
        return next;
    }
    const ingredients = Object.entries(job.ingredients ?? {}).map(([role, binding]) =>
        [role, next.gu.find(gu => gu.id === binding)]);
    if (ingredients.some(([role, gu]) => !gu?.alive || gu.holder !== job.refiner || gu.kind !== recipe.ingredients[role])) {
        finishUnsuccessful(next, job, 'ingredient-unavailable');
        return next;
    }
    const stage = recipe.stages[job.cursor];
    job.cursor++;
    if (controlFailed) {
        applyRefinementFailure(specimen, stage.onPrecursorControlFailure, isLivingMaster, job);
        for (const [role, gu] of ingredients) {
            applyRefinementFailure(gu, stage.onControlFailure?.[role], isLivingMaster, job);
        }
        finishUnsuccessful(next, job, 'control');
        return next;
    }
    if (job.cursor < recipe.stages.length) return next;

    const replaced = new Set([job.precursor, ...ingredients.map(([, gu]) => gu.id)]);
    if (recipe.uniqueKey && next.gu.some(gu => gu.alive && !replaced.has(gu.id) && gu.uniqueKey === recipe.uniqueKey)) {
        finishUnsuccessful(next, job, 'occupied');
        return next;
    }
    const product = {kind: recipe.kind, rank: recipe.rank, uniqueKey: recipe.uniqueKey};
    if (recipe.productTraits) product.traits = structuredClone(recipe.productTraits);
    if (recipe.recordLineage) product.provenance = {recipe: recipe.id, revision: recipe.revision, ingredients: {...job.ingredients}};
    if (specimen) {
        Object.assign(specimen, product);
        if (product.uniqueKey === undefined) delete specimen.uniqueKey;
    } else {
        const productId = job.productId ?? id;
        check(!next.gu.some(gu => gu.id === productId), 'The product identity is already in use.');
        const vitalSource = ingredients.find(([role]) => role === recipe.vitalSuccessorRole)?.[1];
        const vitalMaster = vitalSource?.vitalMaster;
        if (vitalMaster) delete vitalSource.vitalMaster;
        next.gu.push({id: productId, kind: product.kind, rank: product.rank, ...(product.uniqueKey && {uniqueKey: product.uniqueKey}),
            ...(product.traits && {traits: product.traits}), ...(product.provenance && {provenance: product.provenance}),
            ...(vitalMaster && {vitalMaster}),
            alive: true, holder: job.refiner});
    }
    for (const [, gu] of ingredients) endSpecimen(gu, 'consumed');
    job.status = 'complete';
    job.product = specimen?.id ?? job.productId ?? id;
    return next;
}

function applyRefinementFailure(gu, consequence, isLivingMaster, job) {
    if (!consequence) return;
    if (consequence === 'destroy' && gu.vitalMaster && isLivingMaster(gu.vitalMaster)) {
        gu.injured = true;
        (job.vitalSurvivors ??= []).push(gu.id);
    } else if (consequence === 'destroy') endSpecimen(gu, 'destroyed');
    else gu.injured = true;
}

function endSpecimen(gu, fate) {
    gu.alive = false;
    gu.fate = fate;
}

export function cancelGuRefinement(state, id) {
    const {next, job} = workingAttempt(state, id);
    finishUnsuccessful(next, job, 'cancelled');
    return next;
}

export function previewGuRefinementProduct(state, id) {
    const job = state.attempts.find(attempt => attempt.id === id);
    if (job?.status !== 'working' || job.cursor + 1 !== job.recipe.stages.length) return null;
    const forecast = stepGuRefinement(state, id);
    const result = forecast.attempts.find(attempt => attempt.id === id);
    return result.status === 'complete' ? forecast.gu.find(gu => gu.id === result.product) : null;
}

function workingAttempt(state, id) {
    const next = structuredClone(state);
    const job = next.attempts.find(attempt => attempt.id === id);
    check(job?.status === 'working', 'This refinement is not in progress.');
    return {next, job};
}

function finishUnsuccessful(state, job, cause) {
    const stock = state.stocks[job.refiner];
    for (const stage of job.recipe.stages.slice(job.cursor)) {
        for (const {material, amount} of stage.inputs) stock[material] += amount;
    }
    job.status = cause === 'cancelled' ? 'cancelled' : 'failed';
    job.cause = cause;
}

export function observeGuRefinement(state, id, observer) {
    const job = state.attempts.find(attempt => attempt.id === id && attempt.refiner === observer);
    if (!job) return null;
    return {id, kind: job.recipe.kind, stage: job.cursor, status: job.status,
        ...(job.status === 'complete' && {product: job.product})};
}
