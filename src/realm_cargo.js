// Pure read references and consent plans. Native stock and simulation custody
// remain their actual owners. Nothing here publishes effects or inventory.
export const REALM_CARGO_SCHEMA = 1;
const assert = (ok, message) => {if (!ok) throw new Error(message);};
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v) && [Object.prototype, null].includes(Object.getPrototypeOf(v));
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'prototype', 'constructor'].includes(v);
const natural = v => Number.isSafeInteger(v) && v >= 0;
const positive = v => natural(v) && v > 0;
const copy = v => structuredClone(v);
const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;
function json(v, parents = new Set(), depth = 0) {
    assert(depth < 24, 'Cargo data exceeds JSON depth.');
    if (v === null || ['string', 'boolean'].includes(typeof v)) return;
    if (typeof v === 'number') {assert(Number.isFinite(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER, 'Invalid cargo number.'); return;}
    assert(Array.isArray(v) || object(v), 'Cargo data must be plain JSON.');
    assert(!parents.has(v), 'Cyclic cargo data.'); parents.add(v);
    const keys = Reflect.ownKeys(v), descriptors = Object.getOwnPropertyDescriptors(v);
    assert(keys.every(k => typeof k === 'string'), 'Cargo JSON cannot contain symbols.');
    if (Array.isArray(v)) assert(keys.length === v.length + 1 && Object.keys(v).every((k, i) => k === String(i)), 'Cargo arrays must be dense.');
    for (const k of keys) {
        if (Array.isArray(v) && k === 'length') continue;
        const d = descriptors[k];
        assert(!['__proto__', 'constructor', 'prototype'].includes(k) && Object.hasOwn(d, 'value') && d.enumerable, 'Unsafe cargo property.');
        json(d.value, parents, depth + 1);
    }
    parents.delete(v);
}
function itemKey(key) {
    assert(typeof key === 'string' && key.length > 0, 'Supply the exact native inventory key.');
    let value; try {value = JSON.parse(key);} catch {throw Error('Invalid native inventory key.');}
    json(value);
    assert(object(value) && (typeof value.id === 'string' && value.id.length > 0 && !['__proto__','constructor','prototype'].includes(value.id) || object(value.components)), 'Invalid native item identity.');
    if (value.quality != null) assert(Number.isFinite(value.quality) && value.quality >= 0 && value.quality <= Number.MAX_SAFE_INTEGER, 'Invalid native item quality.');
}
function endpoint(v) {
    assert(object(v) && Object.keys(v).length === 4 && ['worldId', 'instanceId', 'regionId', 'layerId'].every(k => id(v[k])), 'Supply four cargo endpoint IDs.');
}
const canonical = v => JSON.stringify(Array.isArray(v) ? v.map(v => JSON.parse(canonical(v))) : object(v)
    ? Object.fromEntries(Object.keys(v).sort(order).map(k => [k, JSON.parse(canonical(v[k]))])) : v);
const same = (a, b) => canonical(a) === canonical(b);
// Fixed-width UTF-16 encoding is injective even for unusual native item keys.
const encode = v => Array.from({length: v.length}, (_, i) => v.charCodeAt(i).toString(16).padStart(4, '0')).join('');
export function nativeCargoStockId(actorId, container, item, slot = null) {
    assert(id(actorId) && ['bag', 'equipment'].includes(container), 'Invalid native cargo container.'); itemKey(item);
    assert(container === 'bag' ? slot === null : id(slot), 'Bind the actual equipment slot.');
    return `native.cargo.${actorId}.${container}.${container === 'equipment' ? encode(slot) + '.' : ''}k${encode(item)}`;
}
function custodyRecord(c, custodyId) {
    assert(id(custodyId) && object(c) && id(c.owner) && id(c.holder) && c.owner !== c.holder && positive(c.count) && natural(c.at), 'Invalid actual custody reference.');
    itemKey(c.key);
    assert(c.cause == null || id(c.cause), 'Invalid custody cause.');
    return {id: custodyId, owner: c.owner, holder: c.holder, key: c.key, count: c.count, at: c.at, cause: c.cause ?? null};
}
/** Exact material binding, not a claimed monotonic custody revision. */
export function realmCargoCustodyBinding(custodyId, custody) {
    json(custody); return canonical(custodyRecord(custody, custodyId));
}
const snapshotMaterial = s => ({actorId:s.actorId, bodyId:s.bodyId, sequence:s.sequence, revision:s.revision, sources:s.sources, cargo:s.cargo});
export function validateRealmCargoSnapshot(s) {
    json(s);
    assert(object(s) && s.schema === 1 && id(s.actorId) && id(s.bodyId) && natural(s.sequence) && positive(s.revision) && s.complete === true, 'Invalid complete cargo snapshot.');
    assert(Array.isArray(s.sources) && Array.isArray(s.cargo) && s.cargo.length <= 256, 'Cargo manifest exceeds route budget.');
    const sources = new Map();
    for (const source of s.sources) {
        assert(object(source) && !sources.has(source.id) && source.id === nativeCargoStockId(s.actorId, source.container, source.itemKey, source.slot) && positive(source.count), 'Invalid or duplicate native stock source.');
        assert(id(source.classId) && typeof source.transferable === 'boolean' && source.revision === s.revision, 'Invalid stock classification/revision.');
        if (source.container === 'equipment') assert(source.count === 1, 'One equipment slot carries one item.');
        sources.set(source.id, source);
    }
    const ids = new Set(), totals = new Map(), loans = new Map();
    for (const c of s.cargo) {
        const source = sources.get(c.sourceId);
        assert(source && id(c.itemId) && !ids.has(c.itemId) && id(c.ownerId) && c.holderId === s.actorId && c.holderBodyId === s.bodyId && positive(c.count), 'Invalid exact cargo reference.');
        ids.add(c.itemId);
        assert(c.itemKey === source.itemKey && c.classId === source.classId && c.transferable === source.transferable && c.equipped === (source.container === 'equipment') && c.slot === source.slot, 'Cargo does not match actual native stock.');
        assert(same(c.stockRef, {domain:source.container === 'bag' ? 'native_inventory' : 'native_equipment', id:c.itemId, revision:s.revision}), 'Invalid stock slice reference.');
        if (c.custodyRef === null) assert(c.ownerId === s.actorId && c.custodyBinding === null && c.itemId === `${source.id}.owned`, 'Owned cargo has no lender.');
        else {
            const loan = custodyRecord(c.custodyRef, c.custodyRef.id);
            assert(loan.owner === c.ownerId && loan.holder === s.actorId && loan.key === c.itemKey && c.itemId === `${source.id}.loan.${loan.id}`, 'Cargo does not match actual custody.');
            assert(c.custodyBinding === canonical(loan), 'Custody reference changed.');
            const prior = loans.get(loan.id);
            assert(!prior || prior.binding === c.custodyBinding, 'Inconsistent custody slices.');
            loans.set(loan.id, {binding:c.custodyBinding, count:(prior?.count || 0) + c.count, total:loan.count});
        }
        totals.set(source.id, (totals.get(source.id) || 0) + c.count);
    }
    for (const source of sources.values()) assert(totals.get(source.id) === source.count, 'Cargo omits or duplicates carried stock.');
    for (const loan of loans.values()) assert(Number.isSafeInteger(loan.count) && loan.count === loan.total, 'Cargo omits or duplicates held custody.');
    assert(s.binding === canonical(snapshotMaterial(s)), 'Cargo snapshot binding changed.');
    return s;
}
/** Input is one actual actor's bag/equipment plus existing simulation custody.
 * classifications: [{itemKey,classId,transferable}], default carried/true.
 * allocations: [{custodyId,container,slot,count}] required for ambiguous copies.
 */
export function buildNativeRealmCargoSnapshot(input) {
    json(input);
    const {actorId, bodyId, sequence, revision, inventory, equipment, custody, classifications = [], allocations = []} = input;
    assert(id(actorId) && id(bodyId) && natural(sequence) && positive(revision) && object(inventory) && object(equipment) && object(custody), 'Bind actual bag, equipment and custody owners.');
    assert(Array.isArray(classifications) && Array.isArray(allocations), 'Invalid cargo adapter declarations.');
    const classes = new Map();
    for (const c of classifications) {itemKey(c.itemKey); assert(!classes.has(c.itemKey) && id(c.classId) && typeof c.transferable === 'boolean', 'Invalid duplicate cargo classification.'); classes.set(c.itemKey, c);}
    const sources = [], cargo = [], sourceLoans = new Map();
    const add = (container, key, count, slot) => {
        const classification = classes.get(key);
        sources.push({id:nativeCargoStockId(actorId,container,key,slot), container, slot, itemKey:key, count, revision, classId:classification?.classId || 'carried', transferable:classification?.transferable ?? true});
    };
    for (const key of Object.keys(inventory).sort(order)) {itemKey(key); assert(natural(inventory[key]), 'Invalid bag count.'); if (inventory[key]) add('bag',key,inventory[key],null);}
    for (const slot of Object.keys(equipment).sort(order)) {assert(id(slot), 'Invalid equipment slot.'); add('equipment',equipment[slot],1,slot);}
    const loans = new Map(Object.entries(custody).filter(([,c]) => c.holder === actorId).sort(([a],[b]) => order(a,b)).map(([key,c]) => [key,custodyRecord(c,key)]));
    const usedAllocations = new Set();
    for (const [loanId, loan] of loans) {
        const matching = sources.filter(s => s.itemKey === loan.key), assigned = [];
        const explicit = allocations.map((a,i) => ({a,i})).filter(({a}) => a.custodyId === loanId);
        if (explicit.length) {
            for (const {a,i} of explicit) {
                assert(['bag','equipment'].includes(a.container) && positive(a.count) && (a.container === 'bag' ? a.slot === null : id(a.slot)), 'Invalid exact custody allocation.');
                const source = matching.find(s => s.container === a.container && s.slot === a.slot);
                assert(source && !assigned.some(v => v.source.id === source.id), 'Invalid or duplicated custody allocation.');
                assigned.push({source,count:a.count}); usedAllocations.add(i);
            }
        } else {
            assert(matching.length === 1, 'Custody stock is absent or ambiguous between bag/equipment; bind exact allocations.');
            assigned.push({source:matching[0],count:loan.count});
        }
        assert(assigned.reduce((n,a) => n+a.count,0) === loan.count, 'Custody allocation does not match actual loan quantity.');
        for (const a of assigned) {const list = sourceLoans.get(a.source.id) || []; list.push({loan,count:a.count}); sourceLoans.set(a.source.id,list);}
    }
    assert(usedAllocations.size === allocations.length, 'Allocation references absent or another holder custody.');
    for (const source of sources) {
        const held = sourceLoans.get(source.id) || [], borrowed = held.reduce((n,a) => n+a.count,0);
        assert(Number.isSafeInteger(borrowed) && borrowed <= source.count, 'Custody exceeds actual carried stock.');
        const slice = (count, loan = null) => {
            const itemId = `${source.id}.${loan ? 'loan.'+loan.id : 'owned'}`;
            cargo.push({itemId,sourceId:source.id,itemKey:source.itemKey,ownerId:loan?.owner || actorId,holderId:actorId,holderBodyId:bodyId,count,
                equipped:source.container === 'equipment',slot:source.slot,classId:source.classId,transferable:source.transferable,
                stockRef:{domain:source.container === 'bag' ? 'native_inventory' : 'native_equipment',id:itemId,revision},
                custodyRef:loan ? copy(loan) : null,custodyBinding:loan ? canonical(loan) : null});
        };
        if (source.count > borrowed) slice(source.count-borrowed);
        for (const a of held) slice(a.count,a.loan);
    }
    const s = {schema:1,actorId,bodyId,sequence,revision,complete:true,sources,cargo}; s.binding = canonical(snapshotMaterial(s));
    return validateRealmCargoSnapshot(s);
}
function scope(v) {
    assert(id(v.lenderId) && id(v.holderId) && v.lenderId !== v.holderId && id(v.custodyId) && typeof v.custodyBinding === 'string' &&
        id(v.purposeId) && id(v.connectionId) && positive(v.maxCount), 'Invalid lender permission scope.');
    endpoint(v.from); endpoint(v.to);
    assert(!same(v.from,v.to) && natural(v.at) && (v.expiresAt === null || natural(v.expiresAt) && v.expiresAt > v.at), 'Invalid consent endpoint/time scope.');
}
const terms = v => ({lenderId:v.lenderId,holderId:v.holderId,custodyId:v.custodyId,custodyBinding:v.custodyBinding,purposeId:v.purposeId,
    connectionId:v.connectionId,from:v.from,to:v.to,maxCount:v.maxCount,at:v.at,expiresAt:v.expiresAt});
export function validateRealmCargoConsent(consent) {
    json(consent); assert(object(consent) && consent.schema === 1 && id(consent.id) && positive(consent.revision) && typeof consent.active === 'boolean', 'Invalid actual lender consent.');
    scope(consent); return consent;
}
export function validateRealmCargoPermission(permission) {
    json(permission); assert(object(permission) && permission.schema === 1 && id(permission.id) && positive(permission.revision) && typeof permission.active === 'boolean', 'Invalid cargo permission.');
    scope(permission);
    assert(object(permission.consentRef) && permission.consentRef.domain === 'lender_consent' && id(permission.consentRef.id) && positive(permission.consentRef.revision), 'Permission needs actual lender consent provenance.');
    return permission;
}
function consentMatches(permission, consent) {
    return consent?.active === true && permission.consentRef.id === consent.id && permission.consentRef.revision === consent.revision && same(terms(permission),terms(consent));
}
/** Propose an optional record for root's durable writer after actual consent.
 * No existing custody, knowledge, title or scene text grants permission.
 */
export function previewRealmCargoPermission(snapshot, consent, request, context) {
    validateRealmCargoSnapshot(snapshot); validateRealmCargoConsent(consent); json(request); json(context);
    assert(id(request.id) && positive(request.revision) && natural(context.sequence) && natural(context.clock), 'Invalid permission request.');
    const reasons = [];
    if (request.expectedSequence !== context.sequence || snapshot.sequence !== context.sequence || request.expectedSnapshotRevision !== snapshot.revision || request.expectedSnapshotBinding !== snapshot.binding || request.expectedConsentRevision !== consent.revision) reasons.push('This lender permission request is stale.');
    const loan = snapshot.cargo.find(c => c.custodyRef?.id === consent.custodyId);
    if (!consent.active || !loan || loan.custodyBinding !== consent.custodyBinding || loan.ownerId !== consent.lenderId || snapshot.actorId !== consent.holderId || consent.maxCount > (loan?.custodyRef.count || 0)) reasons.push('Consent does not bind the actual lender, holder and current custody.');
    if (context.clock < consent.at || consent.expiresAt !== null && context.clock >= consent.expiresAt) reasons.push('Actual lender consent is not currently valid.');
    const permission = reasons.length ? null : {schema:1,id:request.id,revision:request.revision,active:true,...copy(terms(consent)),consentRef:{domain:'lender_consent',id:consent.id,revision:consent.revision}};
    if (permission) validateRealmCargoPermission(permission);
    return {schema:1,allowed:reasons.length === 0,reasons,permission,guards:{sequence:context.sequence,snapshotRevision:snapshot.revision,snapshotBinding:snapshot.binding,consentId:consent.id,consentRevision:consent.revision,consentBinding:canonical(consent)},effects:[]};
}
/** Cargo-only gate. Host still checks body, boundary, route opening and costs.
 * request carries expectedSequence/Revision/SnapshotRevision/SnapshotBinding,
 * purposeId, from/to, and optional complete [{itemId,count}] cargo selection.
 */
export function previewRealmCargoPassage(snapshot, connection, request, context) {
    validateRealmCargoSnapshot(snapshot); json(connection); json(request); json(context);
    assert(id(connection.id) && positive(connection.revision) && natural(context.sequence) && natural(context.clock) && id(request.purposeId), 'Invalid cargo passage binding.');
    endpoint(request.from); endpoint(request.to); endpoint(connection.from); endpoint(connection.to);
    const policy = connection.cargoPolicy;
    assert(object(policy) && typeof policy.allowed === 'boolean' && typeof policy.allowEquipped === 'boolean' && natural(policy.maxUnits) && Array.isArray(policy.classes) && policy.classes.every(id) && new Set(policy.classes).size === policy.classes.length, 'Invalid actual route cargo policy.');
    const permissions = context.permissions || [], consents = context.consents || [];
    assert(Array.isArray(permissions) && Array.isArray(consents), 'Bind actual lender permission owners.');
    permissions.forEach(validateRealmCargoPermission); consents.forEach(validateRealmCargoConsent);
    assert(new Set(permissions.map(p => p.id)).size === permissions.length && new Set(consents.map(c => c.id)).size === consents.length, 'Duplicate permission/consent reference.');
    const duration = request.duration ?? 0, arrivesAt = context.clock + duration;
    assert(natural(duration) && natural(arrivesAt), 'Invalid cargo passage duration.');
    const reasons = [];
    if (request.expectedSequence !== context.sequence || snapshot.sequence !== context.sequence || request.expectedRevision !== connection.revision || request.expectedSnapshotRevision !== snapshot.revision || request.expectedSnapshotBinding !== snapshot.binding) reasons.push('This cargo passage request is stale.');
    if (!(same(request.from,connection.from) && same(request.to,connection.to) || connection.bidirectional === true && same(request.from,connection.to) && same(request.to,connection.from))) reasons.push('Cargo endpoints do not match the directed route.');
    const selected = request.cargo ?? snapshot.cargo.map(c => ({itemId:c.itemId,count:c.count}));
    assert(Array.isArray(selected) && selected.every(c => id(c.itemId) && positive(c.count)) && new Set(selected.map(c => c.itemId)).size === selected.length, 'Invalid requested exact cargo.');
    if (selected.length !== snapshot.cargo.length || snapshot.cargo.some(c => !selected.some(v => v.itemId === c.itemId && v.count === c.count))) reasons.push('Passage must bind the complete actual bag and equipment; deposit omitted goods with their actual owner first.');
    const manifest = [], used = new Map(); let units = 0;
    for (const c of snapshot.cargo) {
        units += c.count;
        if (!policy.allowed || !policy.classes.includes(c.classId) || !c.transferable) reasons.push('The route does not admit one of your carried items.');
        if (c.equipped && !policy.allowEquipped) reasons.push('The route does not admit one of your equipped items.');
        let grant = null;
        if (c.custodyRef) {
            grant = [...permissions].sort((a,b) => order(a.id,b.id)).find(p => p.active && p.lenderId === c.ownerId && p.holderId === c.holderId && p.custodyId === c.custodyRef.id &&
                p.custodyBinding === c.custodyBinding && p.purposeId === request.purposeId && p.connectionId === connection.id && same(p.from,request.from) && same(p.to,request.to) &&
                context.clock >= p.at && (p.expiresAt === null || arrivesAt < p.expiresAt) && p.maxCount >= c.custodyRef.count && consentMatches(p,consents.find(v => v.id === p.consentRef.id)));
            if (!grant) reasons.push('Borrowed cargo lacks actual lender consent for this purpose, route and destination.');
            else used.set(grant.id,grant);
        }
        manifest.push({...copy(c),authorizedConnectionIds:grant ? [connection.id] : []});
    }
    if (!Number.isSafeInteger(units) || units > policy.maxUnits) reasons.push('Actual carried cargo exceeds route capacity.');
    return {schema:1,allowed:reasons.length === 0,reasons:[...new Set(reasons)],cargo:manifest,cargoComplete:true,units,
        guards:{sequence:context.sequence,connectionId:connection.id,connectionRevision:connection.revision,connectionBinding:canonical(connection),duration,arrivesAt,snapshotRevision:snapshot.revision,snapshotBinding:snapshot.binding,
            permissions:[...used.values()].map(p => ({id:p.id,revision:p.revision,binding:canonical(p),consentBinding:canonical(consents.find(c => c.id === p.consentRef.id))}))},effects:[]};
}
