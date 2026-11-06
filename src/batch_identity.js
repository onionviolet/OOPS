// Shared batch / portion / label identity (M1, larger-foundations audit; detail-pass rows J5, R4, H6).
// A leaf: no imports. It names a lot of issued doses, splits portions off it without creating or
// losing a dose, and says what a holder is allowed to see of it.
//
// Default: an issued dose that carries a batch ref is traceable to its batch.
// Dial: a world decides whether doses carry labels at all (a world that never calls makeBatchRef
//   has untraceable stock, and nothing here requires otherwise); it also decides what "known" means.
// Reason: a dose traceable to a batch supports consequences such as recalls, tampering and forgery,
//   and a holder who has not identified the batch sees its label, not its grade (AD6-AD8).
//
// Shape-compatible with the HP brewing batch ({id, cohortId, custody, grade, history, doses,
// dosesLeft, known:{identified}}): validateBatch accepts one unchanged, and fromHpBatch is the
// adapter (it drops `history`, which is the brewer's record, not the holder's).
const fail = message => { throw new Error(message); };
const int = n => Number.isSafeInteger(n);
const text = v => typeof v === 'string' && v.length > 0;

// Throws on a malformed batch; returns it. Only the identity core is required, so an HP batch,
// a ref from makeBatchRef and a portion all pass.
export function validateBatch(b) {
    if(!b || typeof b !== 'object' || Array.isArray(b)) fail('A batch is an object.');
    if(!text(b.id)) fail('A batch needs an id.');
    if(b.cohortId !== undefined && !text(b.cohortId)) fail('A batch cohort id is text.');
    if(!int(b.doses) || b.doses < 0) fail('Batch doses are a whole number, zero or more.');
    if(!int(b.dosesLeft) || b.dosesLeft < 0 || b.dosesLeft > b.doses) fail('Batch doses left run from zero to its doses.');
    if(b.label !== undefined && !text(b.label)) fail('A batch label is text.');
    if(b.grade !== undefined && b.grade !== null && !text(b.grade)) fail('A batch grade is text or absent.');
    if(b.known !== undefined && (!b.known || typeof b.known !== 'object' || typeof (b.known.identified ?? false) !== 'boolean')) fail('Batch knowledge records whether it is identified.');
    if(b.cohortDoses !== undefined && (!int(b.cohortDoses) || b.cohortDoses < b.doses)) fail('The cohort cannot be smaller than a portion of it.');
    return b;
}

export function makeBatchRef({id, kind, label, grade = null, source = null, doses}) {
    if(!text(id) || !text(label) || !text(kind)) fail('A batch ref needs an id, a kind and a label.');
    if(!int(doses) || doses < 1) fail('A batch ref needs at least one dose.');
    return validateBatch({id, cohortId: id, kind, label, grade, source, doses, dosesLeft: doses, cohortDoses: doses, known: {identified: false}});
}

// Adapter: an HP brewing batch (not edited, not mutated) as a ref. `label` is the holder-facing name.
export function fromHpBatch(hp, {label = null, kind = 'potion'} = {}) {
    validateBatch(hp);
    return validateBatch({id: hp.id, cohortId: hp.cohortId ?? hp.id, kind, label: label ?? `Batch ${hp.id}`, grade: hp.grade ?? null,
        source: null, doses: hp.doses, dosesLeft: hp.dosesLeft, cohortDoses: hp.cohortDoses ?? hp.doses, known: {identified: hp.known?.identified === true}});
}

// Takes n doses from what remains. Parent id, cohort and label are kept; doses are conserved.
export function splitPortion(batch, n) {
    validateBatch(batch);
    if(!int(n) || n < 1) fail('A portion is a whole number of doses, one or more.');
    if(n > batch.dosesLeft) fail(`Only ${batch.dosesLeft} ${batch.dosesLeft === 1 ? 'dose remains' : 'doses remain'} in this batch.`);
    const cohortDoses = batch.cohortDoses ?? batch.doses, rest = batch.dosesLeft - n;
    const portion = {...structuredClone(batch), doses: n, dosesLeft: n, cohortDoses};
    const remainder = {...structuredClone(batch), doses: rest, dosesLeft: rest, cohortDoses};
    if(portion.dosesLeft + remainder.dosesLeft !== batch.dosesLeft) fail('A split must conserve doses.');
    return {portion: validateBatch(portion), remainder: validateBatch(remainder)};
}

// What the holder may see. `known.identified` (default: the batch's own record) unlocks the grade;
// an unidentified batch shows its label and count only.
export function describeBatch(batch, {known} = {}) {
    validateBatch(batch);
    const identified = (known?.identified ?? batch.known?.identified) === true;
    const label = batch.label ?? `Batch ${batch.id}`, n = batch.dosesLeft;
    const grade = identified && batch.grade ? batch.grade : null;
    return {id: batch.id, label, doses: n, identified, grade,
        text: `${label}: ${n} ${n === 1 ? 'dose' : 'doses'}${grade ? `, ${grade}` : ''}`};
}
