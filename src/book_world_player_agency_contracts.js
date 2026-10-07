import contractBook from '../docs/gm/book-world-player-agency/contracts/CONTRACTS.json' with {type:'json'};

const freezeTree = value => {
    if(value && typeof value === 'object') {
        for(const child of Object.values(value)) freezeTree(child);
        Object.freeze(value);
    }
    return value;
};

export const BOOK_WORLD_AGENCY_CONTRACTS = freezeTree(contractBook.contracts);
const contractByKey = new Map();
for(const contract of BOOK_WORLD_AGENCY_CONTRACTS) {
    for(const key of contract.aliases) contractByKey.set(String(key).toLowerCase(), contract);
}

export function getBookWorldAgencyContract(idOrAlias) {
    if(typeof idOrAlias !== 'string') return null;
    return contractByKey.get(idOrAlias.trim().toLowerCase()) ?? null;
}

const record = value => value && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string' && value.trim().length > 0;
const hash = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const present = value => typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value) || text(value) ||
    Array.isArray(value) && value.length > 0 && value.every(present) ||
    record(value) && Object.keys(value).length > 0 && Object.values(value).every(present);
const sourceClasses = new Map([
    ['original-frontier','original'],
    ...['skyrim','fallout4','elden-ring'].map(id=>[id,'game-reference']),
    ...['naruto','bleach'].map(id=>[id,'manga-anime-reference']),
    ['harry-potter','bounded-publisher-reference'],
    ...['reincarnation-paradise','fated-villain','reverend-insanity','shadow-slave','regressors-tale','omniscient-reader','labyrinth-mad-god',
        'mother-of-learning','lord-of-mysteries','circle-of-inevitability','worm','legendary-mechanic'].map(id=>[id,'supplied-novel']),
]);

function validateSourceIdentity(contract,errors) {
    const prefix=contract.id,source=contract.sourceIdentity,expectedClass=sourceClasses.get(prefix);
    const fail = message => errors.push(`${prefix}: ${message}`);
    if(!record(source)) {fail('missing source identity');return;}
    if(!expectedClass||source.sourceClass!==expectedClass)fail('missing or mismatched source class');
    if(!text(source.profileId)||!text(source.workerGroup))fail('source profile and owner group are required');
    const retrieval=source.retrieval;
    if(!record(retrieval)||retrieval.path!==contractBook.source.path||!hash(contractBook.source.sha256)||retrieval.sha256!==contractBook.source.sha256||
        retrieval.canonicalRowId!==contract.id||retrieval.rowPointer!==`/rows/${contract.ordinal-1}`||retrieval.sourcePointer!==`${retrieval.rowPointer}/source`) {
        fail('source retrieval must bind this exact qualified assembled row and snapshot');
    }
    const available=source.availableProvenance;
    if(!record(available))fail('available provenance shape must be retained');
    // Available fields come from the reconciled source snapshot, not from a
    // narrow common-key projection. Reject erased path/locators/edition/limits.
    for(const family of ['editionPins','citations','memberPins']) {
        const entries=source[family],shapes=available?.[family];
        if(family==='memberPins'&&shapes==null&&entries==null)continue;
        if(!Array.isArray(entries)||!entries.length||!Array.isArray(shapes)||shapes.length!==entries.length) {
            fail(`${family} must preserve the available nonempty records`);continue;
        }
        for(const [index,entry] of entries.entries()) {
            const fields=shapes[index];
            if(!record(entry)||!Array.isArray(fields)||!fields.length||fields.some(key=>!text(key)||!Object.hasOwn(entry,key)||!present(entry[key]))) {
                fail(`${family}[${index}] discarded available provenance fields`);
            }
        }
    }
    if(available?.reviewedExtentAuthorityCount!=null&&(!Number.isSafeInteger(available.reviewedExtentAuthorityCount)||available.reviewedExtentAuthorityCount<=0||
        !Array.isArray(source.reviewedExtentAuthority)||source.reviewedExtentAuthority.length!==available.reviewedExtentAuthorityCount||!source.reviewedExtentAuthority.every(text))) {
        fail('available reviewed-extent authority must be retained');
    }
    for(const [index,edition] of (Array.isArray(source.editionPins)?source.editionPins:[]).entries()) {
        if(!record(edition))continue;
        if(!text(edition.edition)&&!text(edition.owner)&&!text(edition.path))fail(`editionPins[${index}] needs its available edition label or edition owner`);
        if(!present(edition.reviewedExtent))fail(`editionPins[${index}] needs its exact qualified reviewed extent`);
        if(expectedClass==='supplied-novel') {
            if(!hash(edition.suppliedSourceSha256))fail(`editionPins[${index}] needs its actual supplied-source hash`);
            if(edition.sha256!=null&&edition.sha256!==edition.suppliedSourceSha256)fail(`editionPins[${index}] source-hash aliases conflict`);
            if(!text(edition.qualification)&&!text(edition.provenance)&&!text(edition.limits))fail(`editionPins[${index}] needs its authenticity or compilation qualification`);
        } else {
            // Original content and bounded game/manga/publisher references have
            // an edition/scope owner; they need no invented supplied-book hash.
            if(!text(edition.kind))fail(`editionPins[${index}] needs its original or bounded-reference kind`);
            if(expectedClass!=='original'&&!text(edition.qualification))fail(`editionPins[${index}] needs its bounded-reference qualification`);
        }
    }
    for(const [index,citation] of (Array.isArray(source.citations)?source.citations:[]).entries()) {
        if(!record(citation))continue;
        if(!text(citation.path)||!Array.isArray(citation.locators)||!citation.locators.length||!citation.locators.every(present))fail(`citations[${index}] needs a source owner path and nonempty locators`);
        if(citation.owner!=null&&citation.owner!==citation.path||citation.notesPath!=null&&citation.notesPath!==citation.path||citation.file!=null&&citation.file!==citation.path)fail(`citations[${index}] source-path aliases conflict`);
        if(citation.locator!=null&&(!text(citation.locator)||!citation.locators.includes(citation.locator)))fail(`citations[${index}] lost its original singular locator`);
    }
    const refs=source.reviewedSourceRefs;
    if(!Array.isArray(refs)||!refs.length||refs.some(ref=>!record(ref)||!text(ref.path)||!text(ref.kind)||!Array.isArray(ref.locators)||!ref.locators.length||!ref.locators.every(present))) {
        fail('reviewed source references must resolve available provenance');
    } else {
        if(!refs.some(ref=>ref.kind==='assembled-source'&&ref.path===retrieval?.path&&ref.sha256===retrieval?.sha256&&ref.locators.includes(retrieval?.sourcePointer)))fail('reviewed source references need the exact per-contract retrieval');
        for(const citation of Array.isArray(source.citations)?source.citations:[])if(record(citation)&&!refs.some(ref=>ref.path===citation.path&&ref.kind==='reviewed-citation'))fail('available citation owner missing from reviewed source references');
        for(const path of Array.isArray(source.reviewedExtentAuthority)?source.reviewedExtentAuthority:[])if(!refs.some(ref=>ref.path===path&&ref.kind==='reviewed-coverage'))fail('available reviewed-extent authority missing from source references');
    }
    const inspectHashes = value => {
        if(Array.isArray(value)) {value.forEach(inspectHashes);return;}
        if(!record(value))return;
        for(const [key,child] of Object.entries(value)) {
            if(key.toLowerCase().replaceAll('_','').endsWith('sha256')&&!hash(child))fail(`malformed retained provenance hash: ${key}`);
            inspectHashes(child);
        }
    };
    inspectHashes(source);
}

// Definition integrity only. This intentionally performs no game action,
// activation, state lookup, registration, or mutation.
export function validateBookWorldAgencyContracts(contracts=BOOK_WORLD_AGENCY_CONTRACTS) {
    const ids = new Set();
    const aliases = new Map();
    const errors = [];
    if(!Array.isArray(contracts))return Object.freeze({valid:false,count:0,errors:Object.freeze(['contracts must be an array'])});
    for(const contract of contracts) {
        if(!record(contract)) {errors.push('contract must be a definition record');continue;}
        if(!contract.id || ids.has(contract.id)) errors.push(`missing or duplicate id: ${contract.id ?? '(empty)'}`);
        ids.add(contract.id);
        validateSourceIdentity(contract,errors);
        if(contract.native?.activation !== false) errors.push(`${contract.id}: native activation must remain false`);
        if(contract.replacement?.availableAsDefault !== false || contract.replacement?.supportedOnlyWhenBound !== true) {
            errors.push(`${contract.id}: replacement must be separate and binding-gated`);
        }
        for(const alias of contract.aliases ?? []) {
            const key = String(alias).toLowerCase();
            const previous = aliases.get(key);
            if(previous && previous !== contract.id) errors.push(`duplicate alias: ${key}`);
            else aliases.set(key, contract.id);
        }
    }
    if(contracts.length !== 19) errors.push(`expected 19 contracts; found ${contracts.length}`);
    return Object.freeze({valid:errors.length === 0, count:contracts.length, errors:Object.freeze(errors)});
}
