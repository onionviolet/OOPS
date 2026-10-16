// Inert authoring contract. No evaluator, RNG, inventory mutation or save hooks.
export const EFFECT_DSL_SCHEMA = 1;
export const SRD521_ATTRIBUTION = 'This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.';
export const CONDITION_IDS = Object.freeze(['blinded','charmed','deafened','exhaustion','frightened','grappled','incapacitated','invisible','paralyzed','petrified','poisoned','prone','restrained','stunned','unconscious']);
export const SCHOOLS = Object.freeze(['abjuration','conjuration','divination','enchantment','evocation','illusion','necromancy','transmutation']);
const abilities = ['str','dex','con','int','wis','cha'];
const damageTypes = ['acid','bludgeoning','cold','fire','force','lightning','necrotic','piercing','poison','psychic','radiant','slashing','thunder'];
const assert = (test, path, message) => { if (!test) throw new TypeError(`${path}: ${message}`); };
const text = (v,p) => assert(typeof v === 'string' && v.trim().length > 0 && v.length <= 8000,p,'expected nonempty text');
const integer = (v,p,min=0,max=1000000) => assert(Number.isSafeInteger(v) && v>=min && v<=max,p,`expected integer ${min}..${max}`);
const one = (v,values,p) => assert(values.includes(v),p,`expected one of ${values.join(', ')}`);
const bool = (v,p) => assert(typeof v === 'boolean',p,'expected boolean');
const array = (v,p,min=0,max=128) => assert(Array.isArray(v) && v.length>=min && v.length<=max,p,'invalid array size');
function shape(v, fields, p) {
    assert(v && typeof v==='object' && !Array.isArray(v),p,'expected object');
    assert(Object.keys(v).every(k=>fields.includes(k)) && fields.every(k=>Object.hasOwn(v,k)),p,`expected exactly ${fields.join(', ')}`);
}
function strings(v,p,min=0) { array(v,p,min); v.forEach((x,i)=>text(x,`${p}[${i}]`)); assert(new Set(v).size===v.length,p,'duplicate values'); }
function json(v,p='$',parents=new Set(),depth=0) {
    assert(depth<=30,p,'JSON nesting budget exceeded');
    if(v===null || typeof v==='string' || typeof v==='boolean') return;
    if(typeof v==='number') { assert(Number.isFinite(v),p,'nonfinite number'); return; }
    assert(v && typeof v==='object' && !parents.has(v),p,'expected acyclic JSON data');
    assert(Array.isArray(v) || [Object.prototype,null].includes(Object.getPrototypeOf(v)),p,'expected plain JSON object');
    assert(!Reflect.ownKeys(v).some(k=>typeof k==='symbol'),p,'symbol key');
    const descriptors=Object.getOwnPropertyDescriptors(v);
    assert(Object.values(descriptors).every(d=>Object.hasOwn(d,'value')),p,'accessor property');
    assert(Object.keys(descriptors).every(k=>descriptors[k].enumerable || Array.isArray(v)&&k==='length'),p,'hidden property');
    parents.add(v);
    for(const key of Object.keys(v)) json(v[key],`${p}.${key}`,parents,depth+1);
    if(Array.isArray(v)) assert(Object.keys(v).length===v.length && Object.keys(v).every((k,i)=>k===String(i)),p,'sparse or decorated array');
    parents.delete(v);
}
function dice(v,p) {
    shape(v,['count','sides','bonus','ability'],p); integer(v.count,`${p}.count`,0,100); one(v.sides,[4,6,8,10,12,20],`${p}.sides`);
    integer(v.bonus,`${p}.bonus`,-1000,1000); one(v.ability,[null,'spellcasting'],`${p}.ability`);
}
function duration(v,p) {
    shape(v,['unit','value','ends'],p); one(v.unit,['instant','round','minute','hour','source'],`${p}.unit`);
    integer(v.value,`${p}.value`,v.unit==='instant'||v.unit==='source'?0:1); strings(v.ends,`${p}.ends`);
    if(['instant','source'].includes(v.unit)) assert(v.value===0,p,'instant/source duration must have zero value');
}
function components(v,p) {
    shape(v,['verbal','somatic','materials'],p); bool(v.verbal,`${p}.verbal`); bool(v.somatic,`${p}.somatic`); array(v.materials,`${p}.materials`);
    const ids=new Set();
    for(const [i,m] of v.materials.entries()) {
        const q=`${p}.materials[${i}]`; shape(m,['stockId','description','quantity','minimumValueGp','consumed','substitutable'],q);
        text(m.stockId,`${q}.stockId`); assert(/^srd521\.stock\.[a-z0-9_]+$/.test(m.stockId),q,'expected stock identity');
        assert(!ids.has(m.stockId),q,'duplicate stock requirement'); ids.add(m.stockId);
        text(m.description,`${q}.description`); integer(m.quantity,`${q}.quantity`,1); integer(m.minimumValueGp,`${q}.minimumValueGp`);
        bool(m.consumed,`${q}.consumed`); bool(m.substitutable,`${q}.substitutable`);
        if(m.minimumValueGp>0 || m.consumed) assert(!m.substitutable,q,'costly/consumed material requires actual stock, not a focus');
    }
}
function rule(r,p) {
    shape(r,['op','subject','value','when'],p);
    one(r.when,['always','source_visible','target_not_source','attacker_within_5','attacker_beyond_5','observer_cannot_see','ally_near_target','target_medium_or_smaller','target_large_or_smaller'],`${p}.when`);
    if(r.op==='roll') {
        one(r.subject,['incoming_attack','outgoing_attack','ability_check','sight_check','hearing_check','social_source_check','initiative','str_save','dex_save'],`${p}.subject`);
        one(r.value,['advantage','disadvantage','auto_fail'],`${p}.value`);
    } else if(r.op==='block') {
        one(r.subject,['sight','hearing','action','bonus_action','reaction','speech','harm_source','approach_source','seen_targeting','speed_increase'],`${p}.subject`); assert(r.value===true,p,'block value must be true');
    } else if(r.op==='speed') { assert(r.subject==='all' && r.value===0,p,'only setting all speed to zero supported'); }
    else if(r.op==='grant_condition') { one(r.subject,CONDITION_IDS,`${p}.subject`); assert(r.value===true,p,'grant value must be true'); }
    else if(r.op==='resistance') { one(r.subject,['all',...damageTypes],`${p}.subject`); assert(r.value===true,p,'resistance value must be true'); }
    else if(r.op==='condition_immunity') { one(r.subject,CONDITION_IDS,`${p}.subject`); assert(r.value===true,p,'immunity value must be true'); }
    else if(r.op==='break_concentration' || r.op==='drop_held' || r.op==='unaware') { assert(r.subject==='self' && r.value===true,p,'expected self and true'); }
    else if(r.op==='critical_hit') { assert(r.subject==='incoming_hit' && r.value===true && r.when==='attacker_within_5',p,'critical requires incoming hit within 5 feet'); }
    else assert(false,p,'unknown rule opcode');
}
function effect(e,p) {
    shape(e,['id','target','area','range','castingTime','resolution','damage','healing','conditions','duration','concentration','components','rules','notes'],p);
    text(e.id,`${p}.id`);
    shape(e.target,['kind','count','disposition','requiresSight','sizes','creatureTypes'],`${p}.target`);
    one(e.target.kind,['self','creature','object','creature_or_object','creature_object_or_effect','point','area'],`${p}.target.kind`);
    assert(e.target.count===null || Number.isSafeInteger(e.target.count)&&e.target.count>0,p,'invalid target count');
    assert((e.target.kind==='area')===(e.target.count===null),p,'only area targets use unbounded count');
    if(e.target.kind==='self') assert(e.target.count===1,p,'self target count must be one');
    one(e.target.disposition,['any','willing'],`${p}.target.disposition`); bool(e.target.requiresSight,`${p}.target.requiresSight`);
    strings(e.target.sizes,`${p}.target.sizes`); e.target.sizes.forEach(s=>one(s,['tiny','small','medium','large','huge','gargantuan'],p)); strings(e.target.creatureTypes,`${p}.target.creatureTypes`);
    if(e.area!==null) { shape(e.area,['shape','feet','origin'],`${p}.area`); one(e.area.shape,['sphere','cone','emanation','wall'],p); integer(e.area.feet,p,1); one(e.area.origin,['self','point','target'],p); }
    assert(e.target.kind!=='area'||e.area!==null,p,'area target requires geometry');
    shape(e.range,['kind','feet','longFeet'],`${p}.range`); one(e.range.kind,['self','touch','distance'],p);
    integer(e.range.feet,p); integer(e.range.longFeet,p);
    assert(e.range.longFeet>=e.range.feet,p,'long range shorter than normal range');
    if(e.range.kind!=='distance') assert(e.range.feet===0 && e.range.longFeet===0,p,'self/touch range has no numeric distance');
    shape(e.castingTime,['unit','value','trigger','ritual'],`${p}.castingTime`);
    one(e.castingTime.unit,['action','bonus_action','reaction','minute','hour','passive'],p); integer(e.castingTime.value,p,e.castingTime.unit==='passive'?0:1);
    bool(e.castingTime.ritual,p); assert(e.castingTime.trigger===null || typeof e.castingTime.trigger==='string'&&e.castingTime.trigger.trim().length>0,p,'invalid trigger');
    assert((e.castingTime.unit==='reaction')===(e.castingTime.trigger!==null),p,'only reactions require a trigger');
    assert(e.castingTime.unit!=='passive'||e.castingTime.value===0,p,'passive time must be zero');
    if(['action','bonus_action','reaction'].includes(e.castingTime.unit)) assert(e.castingTime.value===1,p,'action timing must be one');
    const r=e.resolution;
    if(r.kind==='none') shape(r,['kind'],`${p}.resolution`);
    else if(r.kind==='save') { shape(r,['kind','ability','dc','success','repeat'],`${p}.resolution`); one(r.ability,abilities,p); assert(r.dc==='spell' || Number.isSafeInteger(r.dc)&&r.dc>0&&r.dc<=40,p,'invalid save DC'); one(r.success,['none','half_damage','ends'],p); one(r.repeat,['none','end_turn'],p); }
    else if(r.kind==='attack') { shape(r,['kind','mode','bonus'],`${p}.resolution`); one(r.mode,['melee','ranged','melee_or_ranged'],p); assert(r.bonus==='spell' || Number.isSafeInteger(r.bonus)&&Math.abs(r.bonus)<=40,p,'invalid attack bonus'); }
    else assert(false,p,'unknown resolution kind');
    array(e.damage,`${p}.damage`);
    for(const d of e.damage) { shape(d,['type','dice','instances'],p); one(d.type,damageTypes,p); dice(d.dice,p); integer(d.instances,p,1,100); }
    if(e.healing!==null) dice(e.healing,`${p}.healing`);
    if(r.kind==='save' && r.success==='half_damage') assert(e.damage.length>0,p,'half_damage requires damage');
    array(e.conditions,`${p}.conditions`);
    for(const c of e.conditions) { shape(c,['id','operation','when','duration'],p); one(c.id,CONDITION_IDS,p); one(c.operation,['apply','remove'],p); one(c.when,['always','failed_save','hit','target_medium_or_smaller','target_large_or_smaller','entirely_inside'],p); duration(c.duration,p); if(c.when==='failed_save') assert(r.kind==='save',p,'condition requires save'); if(c.when==='hit') assert(r.kind==='attack',p,'condition requires attack'); }
    duration(e.duration,`${p}.duration`); bool(e.concentration,p);
    assert(!e.concentration || !['instant','source'].includes(e.duration.unit),p,'concentration requires finite duration');
    components(e.components,`${p}.components`); array(e.rules,`${p}.rules`); e.rules.forEach((r,i)=>rule(r,`${p}.rules[${i}]`)); strings(e.notes,`${p}.notes`);
}
function functionRecord(f,p) {
    shape(f,['doesWhat','carrier','needs','scale'],p); strings(f.doesWhat,`${p}.doesWhat`,1);
    one(f.carrier,['body','spell','projectile','field','spectral_hand','touch','creature'],p); strings(f.needs,`${p}.needs`);
    shape(f.scale,['basis','steps'],`${p}.scale`); one(f.scale.basis,['fixed','caster_level','slot_level','exhaustion_level','challenge_rating'],p); array(f.scale.steps,p);
    const seen=new Set();
    for(const s of f.scale.steps) { shape(s,['at','effectId','field','add'],p); integer(s.at,p,1,40); text(s.effectId,p); one(s.field,['damage_dice','healing_dice','target_count','projectile_count'],p); integer(s.add,p,1,100); const k=[s.at,s.effectId,s.field].join(':'); assert(!seen.has(k),p,'duplicate scale step'); seen.add(k); }
    if(['fixed','challenge_rating'].includes(f.scale.basis)) assert(!f.scale.steps.length,p,'fixed scale cannot have steps');
}
function monster(m,p) {
    shape(m,['cr','sizes','type','alignment','ac','hp','initiative','abilities','speed','skills','senses','languages','gear','immunities','multiattack','recharge','xp','proficiencyBonus'],p);
    integer(m.xp,p); integer(m.proficiencyBonus,p,2,9);
    one(m.cr,['0','1/8','1/4','1/2',...Array.from({length:30},(_,i)=>String(i+1))],p); strings(m.sizes,p,1); m.sizes.forEach(s=>one(s,['tiny','small','medium','large','huge','gargantuan'],p));
    text(m.type,p); text(m.alignment,p); integer(m.ac,p,1,40); shape(m.hp,['average','dice'],p); integer(m.hp.average,p,1); dice(m.hp.dice,p); integer(m.initiative,p,-40,40);
    shape(m.abilities,abilities,p); for(const a of abilities) { shape(m.abilities[a],['score','save'],p); integer(m.abilities[a].score,p,1,30); integer(m.abilities[a].save,p,-10,40); }
    array(m.speed,p,1); const modes=new Set(); for(const s of m.speed) { shape(s,['mode','feet'],p); one(s.mode,['walk','climb','fly','swim','burrow'],p); integer(s.feet,p); assert(!modes.has(s.mode),p,'duplicate speed'); modes.add(s.mode); }
    array(m.skills,p); for(const s of m.skills) { shape(s,['name','bonus'],p); text(s.name,p); integer(s.bonus,p,-10,40); }
    shape(m.senses,['passivePerception','darkvision','blindsight'],p); Object.values(m.senses).forEach(n=>integer(n,p)); strings(m.languages,p); strings(m.gear,p); strings(m.immunities,p); m.immunities.forEach(t=>one(t,damageTypes,p));
    array(m.multiattack,p); for(const a of m.multiattack) { shape(a,['effectId','count'],p); text(a.effectId,p); integer(a.count,p,1,10); }
    array(m.recharge,p); for(const a of m.recharge) { shape(a,['effectId','die','minimum'],p); text(a.effectId,p); assert(a.die===6,p,'recharge die must be d6'); integer(a.minimum,p,1,6); }
}
/** Throws with a field path. Returns the same record without mutation. */
export function validateEffectRecord(record) {
    json(record);
    const common=['schema','id','kind','name','revision','source','licence','attribution','status','rulings','unmodeled','function','effects'];
    assert(record && typeof record==='object','$','expected record');
    one(record.kind,['spell','condition','monster'],'$.kind');
    shape(record,[...common,...(record.kind==='spell'?['spell']:record.kind==='monster'?['monster']:[])],'$');
    assert(record.schema===EFFECT_DSL_SCHEMA,'$.schema','unsupported schema');
    text(record.id,'$.id'); assert(new RegExp(`^srd521\\.${record.kind}\\.[a-z0-9_]+$`).test(record.id),'$.id','expected namespaced record ID');
    text(record.name,'$.name'); integer(record.revision,'$.revision',1);
    shape(record.source,['document','edition','heading','page','url','textSha256'],'$.source');
    assert(record.source.document==='SRD' && record.source.edition==='5.2.1','$.source','canonical edition required'); text(record.source.heading,'$.source.heading'); integer(record.source.page,'$.source.page',1,364);
    assert(record.source.url==='https://www.dndbeyond.com/srd','$.source.url','canonical source URL required'); assert(/^[a-f0-9]{64}$/.test(record.source.textSha256),'$.source.textSha256','expected canonical text hash');
    assert(record.licence==='CC-BY-4.0','$.licence','SRD licence required'); assert(record.attribution===SRD521_ATTRIBUTION,'$.attribution','required attribution must travel with record');
    one(record.status,['supported','needs_ruling','unsupported'],'$.status'); strings(record.unmodeled,'$.unmodeled'); array(record.rulings,'$.rulings');
    for(const r of record.rulings) { shape(r,['id','question'],'$.rulings'); text(r.id,'$.rulings.id'); text(r.question,'$.rulings.question'); }
    assert(new Set(record.rulings.map(r=>r.id)).size===record.rulings.length,'$.rulings','duplicate question IDs');
    if(record.status==='supported') assert(!record.rulings.length && !record.unmodeled.length,'$.status','supported record cannot conceal gaps');
    else assert(record.unmodeled.length>0,'$.unmodeled','non-supported record must state missing semantics');
    if(record.status==='needs_ruling') assert(record.rulings.length>0,'$.rulings','needs_ruling requires a question');
    functionRecord(record.function,'$.function'); array(record.effects,'$.effects',1,64); const ids=new Set();
    record.effects.forEach((e,i)=>{ effect(e,`$.effects[${i}]`); assert(!ids.has(e.id),'$.effects','duplicate effect ID'); ids.add(e.id); });
    for(const s of record.function.scale.steps) {
        const e=record.effects.find(e=>e.id===s.effectId); assert(e,'$.function.scale','unknown effect');
        assert(s.field!=='damage_dice'||e.damage.length===1,'$.function.scale','damage scaling requires one damage channel');
        assert(s.field!=='healing_dice'||e.healing!==null,'$.function.scale','healing scaling requires healing');
        assert(s.field!=='projectile_count'||e.damage.length===1,'$.function.scale','projectile scaling requires damage');
        assert(s.field!=='target_count'||e.target.count!==null,'$.function.scale','target scaling requires a base count');
    }
    if(record.kind==='spell') { shape(record.spell,['level','school'],'$.spell'); integer(record.spell.level,'$.spell.level',0,9); one(record.spell.school,SCHOOLS,'$.spell.school'); }
    if(record.kind==='condition') { one(record.id.slice('srd521.condition.'.length),CONDITION_IDS,'$.id'); }
    if(record.kind==='monster') { monster(record.monster,'$.monster'); for(const a of [...record.monster.multiattack,...record.monster.recharge]) assert(ids.has(a.effectId),'$.monster','unknown action effect'); }
    return record;
}
/** Pack admission is atomic; duplicate IDs, dangling condition refs and cycles fail. */
export function validateEffectPack(records) {
    array(records,'pack',1,10000); const map=new Map();
    for(const record of records) { validateEffectRecord(record); assert(!map.has(record.id),'pack','duplicate record ID'); map.set(record.id,record); }
    for(const r of records) for(const e of r.effects) for(const id of [...e.conditions.map(c=>c.id),...e.rules.filter(r=>['grant_condition','condition_immunity'].includes(r.op)).map(r=>r.subject)]) assert(map.has(`srd521.condition.${id}`),'pack',`missing condition ${id}`);
    const visit=(id,stack=new Set())=>{ assert(!stack.has(id),'pack','cyclic condition grants'); stack.add(id); for(const e of map.get(id).effects) for(const r of e.rules.filter(r=>r.op==='grant_condition')) visit(`srd521.condition.${r.subject}`,stack); stack.delete(id); };
    for(const r of records.filter(r=>r.kind==='condition')) visit(r.id);
    return records;
}
