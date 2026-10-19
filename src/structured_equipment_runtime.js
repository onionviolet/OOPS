import {check, object} from './basics.js';
import {validateItemKey} from './gameplay_transactions.js';
import {canonicalDurabilityKey} from './absorb_e2/durability.js';

const slots={head:'helmet interior',torso:'chestplate interior',legs:'leg armor interior',arms:'glove interior',feet:'shoes interior'};
const regions=new Set(['head','chest','back','groin','thigh','shin','forearm','wrist','hand','foot','elbow','armpit']);
const number=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
const fraction=v=>number(v)&&v<=1;
const present=(facts,key)=>key==null||facts[key]===true||typeof facts[key]==='number'&&facts[key]>0;

// Optional metadata changes no legacy item, save, inventory or equipment key.
export function validateStructuredEquipmentDefinition(item) {
    if(item.equipment==null)return;
    const e=item.equipment;
    check(object(e)&&Object.keys(e).every(k=>['slot','baseDefense','weight','layer','coverage','forms','titleClaimId','fitFlag','maintainedFlag','dryFlag','paddingFlag','conditionFlag','unfitMultiplier','unmaintainedMultiplier','movementPenalty','heatBurden','coldProtection','rainProtection','riding'].includes(k)),'Invalid structured equipment metadata.');
    check(Object.hasOwn(slots,e.slot)&&number(e.baseDefense)&&number(e.weight)&&Number.isSafeInteger(e.layer)&&e.layer>=0,'Invalid structured equipment physical definition.');
    check(object(e.coverage)&&Object.keys(e.coverage).length>0&&Object.entries(e.coverage).every(([r,v])=>regions.has(r)&&fraction(v)),'Invalid structured equipment coverage.');
    check(Array.isArray(e.forms)&&e.forms.length>0&&new Set(e.forms).size===e.forms.length&&e.forms.every(v=>typeof v==='string'&&v.length>0),'Invalid structured equipment body fit.');
    for(const k of ['titleClaimId','fitFlag','maintainedFlag','dryFlag','paddingFlag','conditionFlag'])check(e[k]==null||typeof e[k]==='string'&&e[k].length>0,'Invalid structured equipment binding.');
    for(const k of ['unfitMultiplier','unmaintainedMultiplier','movementPenalty','heatBurden','coldProtection','rainProtection'])check(e[k]==null||fraction(e[k]),'Invalid structured equipment effect.');
    check(e.riding==null||typeof e.riding==='boolean','Invalid structured riding policy.');
}

export function nativeStructuredEquipmentTemplate(item) {
    validateStructuredEquipmentDefinition(item);
    if(!item.equipment)return null;
    return {id:item.id,name:item.label,description:item.description,value:item.value||1,component_type:slots[item.equipment.slot],base_defense:0,component_stats:{},quality:100,use_quality:false};
}

function authorized(item,key,actorId,state) {
    const title=item.equipment.titleClaimId;
    if(!title)return true;
    const claim=state?.simulation?.claims?.[title];
    if(claim?.status!=='held')return false;
    if(claim.owner===actorId)return true;
    return Object.values(state?.simulation?.custody||{}).some(c=>c.owner===claim.owner&&c.holder===actorId&&canonicalDurabilityKey(c.key)===canonicalDurabilityKey(key)&&c.count===1);
}

// Equipment is the actual native slot->inventory-key snapshot, not carried stock.
// Native structured armor has zero base defense. This projection supplies the
// actual worn defense once and withdraws it when body/custody/condition changes.
export function projectStructuredEquipment({definitions=[],equipment={},actorId='player',state={},body={},facts={},weather={},activity={},wearByKey={}}={}) {
    const items=new Map(definitions.map(i=>[i.id,i]));
    const out={weight:0,coverage:{},regionDefense:{},defenseByKey:{},layers:[],riding:false,rainMultiplier:1,coldProtection:0,effects:{},facts:{}};
    let defenseDelta=0,penalty=0,cold=0,rain=0,heat=0,ridingItems=0;
    for(const [slot,key]of Object.entries(equipment)) {
        if(!key)continue;
        validateItemKey(key);
        const item=items.get(JSON.parse(key).id);
        if(!item?.equipment)continue;
        validateStructuredEquipmentDefinition(item);
        const e=item.equipment;
        const valid=e.slot===slot&&e.forms.includes(body.form)&&body.ownerId===actorId&&body.controllerId===actorId&&authorized(item,key,actorId,state);
        const fit=present(facts,e.fitFlag),maintained=present(facts,e.maintainedFlag),dry=present(facts,e.dryFlag),padded=present(facts,e.paddingFlag);
        const condition=(e.conditionFlag==null?1:fraction(facts[e.conditionFlag])?facts[e.conditionFlag]:0)*(wearByKey[key]==null?1:fraction(wearByKey[key])?wearByKey[key]:0);
        const factor=valid?condition*(fit?1:e.unfitMultiplier??0)*(maintained?1:e.unmaintainedMultiplier??1):0;
        const defense=e.baseDefense*factor;
        defenseDelta+=defense;
        out.defenseByKey[key]=defense;
        if(!valid)continue;
        out.weight+=e.weight;
        out.layers.push({key,slot,layer:e.layer,fit,maintained,dry,padded,condition});
        for(const [region,coverage]of Object.entries(e.coverage)) {
            out.coverage[region]=1-(1-(out.coverage[region]||0))*(1-coverage*factor);
            out.regionDefense[region]=(out.regionDefense[region]||0)+defense*coverage;
        }
        penalty+=e.movementPenalty||0;
        if(!fit||!padded)penalty+=e.movementPenalty||0;
        heat+=e.heatBurden||0;
        cold+=dry?(e.coldProtection||0)*condition:0;
        rain+=(e.rainProtection||0)*(maintained?condition:0);
        if(e.riding&&fit&&condition>0)ridingItems++;
    }
    out.layers.sort((a,b)=>a.layer-b.layer||a.slot.localeCompare(b.slot));
    out.riding=ridingItems>0&&body.mobile!==false&&body.legs!==0;
    out.rainMultiplier=1-Math.min(1,rain);
    out.coldProtection=Math.min(1,cold);
    // Declared movement burden reaches native stamina; weather adds the actual
    // exposure penalty only when that environmental fact is supplied.
    if(weather.hot===true)penalty+=heat;
    if(weather.cold===true)penalty+=Math.max(0,(weather.coldPenalty||0)-Math.min(1,cold));
    if(weather.raining===true)penalty+=Math.max(0,(weather.rainPenalty||0)-Math.min(1,rain));
    if(activity.riding===true&&!out.riding)penalty+=activity.unsupportedPenalty||0;
    const stats={};
    if(defenseDelta!==0)stats.defense={flat:defenseDelta};
    if(penalty>0)stats.stamina_efficiency={multiplier:1/(1+penalty)};
    if(Object.keys(stats).length)out.effects['structured.equipment']={name:'Worn equipment',duration:null,tags:{effect:true},effects:{stats,bonus_skill_levels:{},xp_multipliers:{}}};
    out.facts={'equipment.weight':out.weight,'equipment.riding':out.riding,'equipment.rainMultiplier':out.rainMultiplier,'equipment.coldProtection':out.coldProtection};
    for(const region of regions){out.facts[`equipment.coverage.${region}`]=out.coverage[region]||0;out.facts[`equipment.defense.${region}`]=out.regionDefense[region]||0;}
    return out;
}
