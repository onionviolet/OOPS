// PC23 Body, PC86: join chapter evidence to L's existing kind row. The structural
// fields on that row are registry conventions; they are not chapter observations.
import {needRate} from './needs.js';
import {livingBodyState, SATIETY} from './world_substrate_packs/living_body.js';

export function adaptGuBody(kind, body, {minutesPerDay, mealEvidence} = {}) {
    if (kind.class !== 'gu' || !body) throw new Error('Expected a chapter-checked Gu body.');
    const stated = (evidence, value) => evidence && value != null
        ? {basis: 'chapter', value, chapters: [...evidence.chapters]} : {basis: 'unknown'};
    const fields = {
        diet: stated(body.diet, body.diet?.food && [...body.diet.food]),
        interval: stated(body.interval, body.interval && {observed: body.interval.observed,
            ...(body.interval.days == null ? {} : {days: body.interval.days}),
            ...(body.interval.years == null ? {} : {years: body.interval.years})}),
        ration: stated(body.ration, body.ration && {amount: body.ration.amount, unit: body.ration.unit, days: body.ration.days}),
        starvation: stated(body.starves, body.starves?.observed),
        notes: stated(body.notes, body.notes?.observed),
        stageMinutes: {basis: 'unknown'},
        lifespan: {basis: 'unknown'},
    };
    // A stated interval in experienced years is not a conversion to W minutes.
    const duration = body.ration?.days != null ? body.ration : body.interval;
    const minutes = duration?.days != null && minutesPerDay != null ? duration.days * minutesPerDay : null;
    const durationMinutes = stated(duration, minutes);
    const amount = body.ration
        ? stated(body.ration, {amount: body.ration.amount, unit: body.ration.unit})
        : stated(mealEvidence, mealEvidence?.value);
    const row = {...kind, diet: fields.diet.basis === 'chapter' ? {food: fields.diet.value} : {},
        bodyFields: {...fields, mealAmount: amount}};
    return {row, durationMinutes};
}

// A caller may materialize appetite from its own ration calibration even when
// food identity is unknown. No diet lookup is part of the clock law.
export function guBodyHolder(row, {id, place, satiety}) {
    if (!Number.isSafeInteger(satiety) || satiety < SATIETY.min || satiety > SATIETY.max)
        throw new Error('Expected whole, bounded satiety.');
    return {id, kind: 'body', place, as: ['gu'], tags: ['living.body'], quantities: {satiety},
        state: {'l.living_body': livingBodyState({species: row.id, rate: needRate(row.needs)})}};
}
