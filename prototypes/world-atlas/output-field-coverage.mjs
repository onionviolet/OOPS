// Per-file input presence, after the selected-file admission/exact-match boundary.
// Contract owner: scripts/lead_run/batch_lib.mjs, shardSchema(..., {version:'1.5'}).
// Descriptors are a bounded public-content allowlist, not keys discovered in rows.
// Never return row values, census notes, private knowledge or reset memory holders.
const field = (id, label, ...selectors) => ({id, label, selectors});
const other = [field('about', 'Subjects linked to the observation', 'about:a')];
const definitions = [
    {pass:'census', kind:'census', fields:[
        field('original-name','Original-language name','zh'),
        field('name-source','Naming provenance','nameSource'),
        field('mention-rung','Mention depth','rung'),
        field('aliases','Alternative names','aliases:a'),
        field('whereabouts','Recorded whereabouts','whereabouts.place'),
        field('whereabouts-era','Whereabouts dates or eras','whereabouts.era'),
        field('whereabouts-status','Whereabouts qualifications','whereabouts.status'),
        field('claimant','Attributed claimant','claimant'),
        field('amount','Numeric amount','amount.value:n'),
        field('amount-unit','Amount unit','amount.unit'),
        field('amount-per','Amount frequency','amount.per'),
        field('amount-cap','Amount ceiling','amount.cap:n'),
        field('lead-contact','Whether the lead encounters it','touchedByLead:b'),
    ]},
    {pass:'scenes', kind:'scenes', fields:[
        field('time-precision','Recorded time granularity','timeOfDay.precision'),
        field('date-anchor','Date anchor','date.anchor'),
        field('date-offset','Date offset','date.offsetDays:n'),
        field('step-actor','Step actors','steps.actor'),
        field('step-locator','Step locators','steps.locator'),
        field('step-kind','Kinds of step','steps.kind'),
        field('step-class','Step action classes','steps.class'),
        field('step-target','Step targets','steps.target:a'),
        field('step-tools','Items used in steps','steps.using:a'),
        field('step-habit','Repeated or habitual steps','steps.habit'),
        field('step-results','Step result links','steps.results:a'),
        field('step-witnesses','Step witnesses','steps.witnesses:a'),
        field('step-time','Step timing','steps.time.minutes:n','steps.time.band'),
        field('step-inputs','Step inputs','steps.inputs:a'),
        field('step-outputs','Step outputs','steps.outputs:a'),
        field('step-gains','Step gains','steps.gains:a'),
        field('step-needs','Step prerequisites','steps.requires:a'),
        field('footprint-places','Broader affected places','footprint.places:a'),
        field('footprint-window','Broader affected time window','footprint.window.anchor','footprint.window.fromOffsetDays:n','footprint.window.toOffsetDays:n'),
        field('footprint-hazards','Broader hazards','footprint.hazards:a'),
        field('footprint-roles','Broader roles','footprint.roles:a'),
        field('mechanism','Mechanism account','mechanism'),
    ]},
    {pass:'scenes', kind:'fills', fields:[
        field('basis','Evidence for the proposal','basis:a'),
        field('respects','Rules the proposal respects','respects:a'),
        field('replacement','What could replace the proposal','replaceableBy'),
        field('layer','Proposal layer','layer'),
        field('confidence','Proposal confidence','confidence'),
    ]},
    {pass:'rules', kind:'rules', fields:[
        field('world-kind','World-specific kind','worldKind'),
        field('conditions','Conditions','conditions:a'),
        field('steps','Ordered working steps','steps.what'),
        field('step-minutes','Step durations','steps.minutes:n'),
        field('inputs','Input items','inputs.item'),
        field('input-quantity','Input quantities','inputs.qty:n'),
        field('input-unit','Input units','inputs.unit'),
        field('input-role','Input roles','inputs.role'),
        field('products','Products','products.item'),
        field('product-quantity','Product quantities','products.qty:n'),
        field('product-unit','Product units','products.unit'),
        field('minutes','Total duration','minutes:n'),
        field('place','Working place','place'),
        field('costs','Costs','costs.what'),
        field('cost-amount','Cost amounts','costs.amount:n'),
        field('cost-unit','Cost units','costs.unit'),
        field('ritual-needed','Whether a ritual is needed','ritual.needed:b'),
        field('ritual-scale','Ritual scale','ritual.scale'),
        field('ritual-steps','Ritual steps','ritual.steps:a'),
        field('results','Success, failure or partial results','results.what'),
        field('limits','Limits','limits:a'),
        field('consequences','Consequences','consequences.response'),
        field('consequence-trigger','Consequence triggers','consequences.trigger'),
        field('consequence-actor','Actors imposing consequences','consequences.by'),
        field('who','Who can use the rule','who:a'),
        field('cost-stated','Whether costs are stated','costStated'),
        field('teacher','Acquisition teacher','acquire.teacher'),
        field('acquire-needs','Acquisition prerequisites','acquire.prerequisites:a'),
        field('acquire-time','Acquisition time','acquire.time'),
        field('practice','Practice','acquire.practice'),
        field('progress','Signs of progress','acquire.progressSign'),
        field('failure','Learning failure','acquire.failure'),
        field('ceiling','Learning ceiling','acquire.ceiling'),
        field('reset-trigger','Reset trigger','reset.trigger'),
        field('reset-span','Reset span','reset.span'),
        field('resets','What resets','reset.resets:a'),
        field('keeps','What survives a reset','reset.keeps:a'),
        field('reset-end','How a reset ends','reset.ends'),
        field('penalty','Enforcement penalty','enforcement.penalty'),
        field('enforcer','Enforcing actor','enforcement.enforcer'),
        field('detection','How breaches are detected','enforcement.detection'),
    ]},
    {pass:'rules', kind:'other', fields:other},
    {pass:'people', kind:'people', fields:[
        field('routine','Routine activity','routine.what'),
        field('routine-place','Routine place','routine.place'),
        field('routine-days','Routine days','routine.days'),
        field('routine-clock','Routine start or end','routine.from','routine.to'),
        field('routine-recurrence','Routine recurrence','routine.recurrence'),
        field('routine-until','When a routine ends','routine.until'),
        field('relations','Relations','relations.with'),
        field('relation-attitude','Relation attitudes','relations.attitude'),
        field('relation-basis','Basis for relations','relations.basis'),
        field('relation-since','Dated relations','relations.since'),
        field('reactions','Reactions','reacts.response'),
        field('reaction-class','Action class reacted to','reacts.class'),
        field('reaction-actor','Actor reacted to','reacts.by'),
        field('response-class','Response action class','reacts.responseClass'),
        field('goals','Goals','wants:a'),
    ]},
    {pass:'people', kind:'other', fields:other},
    {pass:'texture', kind:'places', fields:[
        field('within','Containing place','within'),
        field('hours','Opening hours','hours'),
        field('access','Access conditions','access:a'),
        field('crowd','Crowding','crowd'),
        field('affordances','Available actions','affordances.what'),
        field('affordance-needs','Action prerequisites','affordances.needs:a'),
        field('routes','Route destinations','routes.to'),
        field('route-minutes','Route durations','routes.minutes:n'),
        field('route-mode','Route transport modes','routes.mode'),
    ]},
    {pass:'texture', kind:'services', fields:[
        field('place','Service place','place'),
        field('hours','Service hours','hours'),
        field('price','Price description','price'),
        field('price-kind','Kind of price or payment','kind'),
        field('price-stated','Whether a price is stated','priceStated'),
        field('amount','Numeric price','amount:n'),
        field('unit','Price unit','unit'),
        field('per','Price frequency','per'),
        field('price-id','Linked price record','priceId'),
    ]},
    {pass:'texture', kind:'news', fields:[
        field('date','News date','date'),
        field('carrier','News carrier','carriedBy'),
    ]},
    {pass:'texture', kind:'customs', fields:[field('applies','Where the custom applies','applies')]},
    {pass:'texture', kind:'other', fields:other},
];

export const OUTPUT_FIELD_DESCRIPTORS = Object.freeze(definitions.map(def => Object.freeze({
    pass:def.pass, kind:def.kind,
    fields:Object.freeze(def.fields.map(({id,label}) => Object.freeze({id,label}))),
})));

// Only own JSON data properties are inspected. Accessors and prototype fields do
// not become evidence, and arbitrary source object keys never become output keys.
const own = (value, key) => value && typeof value === 'object' ? Object.getOwnPropertyDescriptor(value,key)?.value : undefined;
const publicObject = value => value && typeof value === 'object' && !Array.isArray(value)
    && own(value,'private') !== true && own(value,'scope') !== 'private'
    && !(Array.isArray(own(value,'sealed')) ? own(value,'sealed').length : own(value,'sealed'));
const text = value => typeof value === 'string' && value.trim() !== ''
    && !/^(?:unstated|not stated|not mentioned|none stated)$/i.test(value.trim());
const scalar = (value, type) => type === 'n' ? typeof value === 'number' && Number.isFinite(value)
    : type === 'b' ? typeof value === 'boolean'
        : type === 'a' ? Array.isArray(value) && value.some(text) : text(value);
function present(value, path, type, index=0, depth=0) {
    if (depth > 16) return false;
    if (index === path.length) return scalar(value,type);
    if (Array.isArray(value)) return value.some(item => present(item,path,type,index,depth+1));
    return publicObject(value) && present(own(value,path[index]),path,type,index+1,depth+1);
}

/** Stream rows only after the caller's exact join. Counts cover the entire file,
 * before pagination/deduplication, and each source row contributes once per field.
 * Admission is a separate caller verdict, never a flag read from source data. */
export function createOutputFieldCoverage(pass, kind) {
    const index=definitions.findIndex(def => def.pass === pass && def.kind === kind);
    if (index < 0) throw new TypeError('Unsupported output kind.');
    const definition=definitions[index], descriptor=OUTPUT_FIELD_DESCRIPTORS[index];
    const selectors=definition.fields.map(field => field.selectors.map(selector => {
        const [path,type='s']=selector.split(':');return {path:path.split('.'),type};
    }));
    const counts=definition.fields.map(() => 0);
    let rows=0;
    return {
        observe(row, {admitted=false, matched=false, rejected=false}={}) {
            if (admitted !== true || matched !== true || rejected !== false || !publicObject(row)
                || (kind === 'news' && own(row,'at') === 'private')) return false;
            rows++;
            selectors.forEach((alternatives,i) => {if (alternatives.some(({path,type}) => present(row,path,type))) counts[i]++;});
            return true;
        },
        snapshot() {
            return {schema:'atlas-output-field-coverage/1',pass:descriptor.pass,kind:descriptor.kind,
                basis:'admitted-matched-source-rows',rows,
                fields:descriptor.fields.map((field,i) => ({...field,rows:counts[i]})),
                presentation:{status:'not-assessed',note:'Input presence does not establish that an Atlas view displays a field.'}};
        },
    };
}
