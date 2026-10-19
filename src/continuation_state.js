// One continuing self; native snapshots are flat records, never nested journeys.
import {check, copy, natural} from './basics.js';
export const CONTINUATION_SCHEMA = 1;
export const STUDY_MINUTES = 10;
// These native skills do not grant bodily stat milestones. Other learning stays
// recorded, without copying its mixed body/stat XP into a new embodiment.
export const COMPATIBLE_MASTERY = Object.freeze(['Literacy', 'Crafting', 'Smelting', 'Forging']);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const id = value => typeof value === 'string' && /^[a-zA-Z0-9_.:-]{1,160}$/.test(value);
const preferences = ['language','options','display_preferences','customization','favourite_consumables','favourite_items',
    'favourite_locations','skill_category_order','skill_list_state','message_filters','are_finished_quests_hidden',
    'last_rewarded_export','total_playtime'];

export function nativeMoment(save) {
    const t=save['current time'];
    check(object(t)&&['year','month','day','hour','minute'].every(k=>Number.isFinite(t[k])), 'This life has no supported calendar.');
    return (((t.year*12+t.month)*30+t.day)*24+t.hour)*60+t.minute;
}
export function nativeSnapshot(save) {
    const next=copy(save); delete next.continuation;
    return next;
}
export function continuationEligibility(save) {
    const bio=save.character?.bio;
    if(bio&&((bio.race||'human')!=='human'||(bio.age||'adult')!=='adult'))
        return 'This embodiment needs its own capability adapter. The current continuation route supports an adult human; your life is preserved.';
    if(save.expansion?.actors?.player?.worldId !== 'base.frontier') return 'Return from this world needs its own temporal means. This slice supports the Frontier.';
    if(Object.keys(save.expansion?.worlds||{}).some(world=>world!=='base.frontier'))
        return 'Other retained worlds need a compatible temporal boundary. Their state is preserved; this first slice cannot rewind them.';
    if(save.content_packs?.structured || save.content_packs?.pendingStructured ||
        Object.values(save.content_packs?.packs || {}).some(p=>p.active) || save.expansion?.bookWorldCampaign)
        return 'This optional campaign needs a compatible continuation adapter. Its state is preserved.';
    return '';
}
function snapshotValid(value) {
    check(object(value)&&object(value.character)&&object(value.levels)&&!Object.hasOwn(value,'continuation'), 'Invalid or recursive continuation snapshot.');
    nativeMoment(value);
}
export function validateContinuation(value) {
    check(object(value)&&value.schema===1&&id(value.journeyId)&&id(value.active)&&natural(value.sequence)&&
        natural(value.nextLife)&&object(value.lives)&&object(value.mastery)&&object(value.research)&&object(value.loop), 'Unsupported continuation state.');
    check(natural(value.research.minutes)&&value.research.minutes<=STUDY_MINUTES&&typeof value.research.running==='boolean'&&
        Number.isFinite(value.research.observedAt)&&typeof value.research.checkpoint==='boolean', 'Invalid continuation research.');
    check(typeof value.loop.enabled==='boolean'&&['initial','checkpoint'].includes(value.loop.target)&&natural(value.loop.cycles), 'Invalid intentional loop.');
    check(Number.isFinite(value.loop.nextAt)&&typeof value.arrivalPaused==='boolean'&&Array.isArray(value.knownMastery)&&
        value.knownMastery.every(x=>typeof x==='string'&&x.length<=160), 'Invalid continuation operation state.');
    if(value.memories!==undefined)check(Array.isArray(value.memories)&&value.memories.every(m=>object(m)&&id(m.lifeId)&&
        object(m.event)&&typeof m.event.text==='string'&&m.event.text.length<=240&&Number.isFinite(m.event.at)), 'Invalid remembered life events.');
    for(const [key,xp] of Object.entries(value.mastery)) check(typeof key==='string'&&key.length>0&&key.length<=160&&
        !['__proto__','constructor','prototype'].includes(key)&&Number.isFinite(xp)&&xp>=0, 'Invalid remembered mastery.');
    check(value.lives[value.active]&&Object.keys(value.lives).length>0, 'Missing active continuation life.');
    for(const [key,life] of Object.entries(value.lives)) {
        check(id(key)&&life.id===key&&id(life.bodyId)&&typeof life.label==='string'&&life.label.length<=120&&
            (life.tether===null||id(life.tether)&&value.lives[life.tether]), 'Invalid continuation life binding.');
        snapshotValid(life.initial);
        if(life.checkpoint!==null) snapshotValid(life.checkpoint);
        if(life.paused!==null) snapshotValid(life.paused);
        check(key===value.active ? life.paused===null : life.paused!==null, 'Paused/active life disagreement.');
    }
    return value;
}
export function validateContinuationEnvelope(save) {
    if(save.continuation!=null) validateContinuation(save.continuation);
    return save;
}
export function beginContinuation(save, journeyId) {
    check(!save.continuation,'This life already has a continuing connection.');
    check(id(journeyId),'Invalid journey identity.');
    check(!continuationEligibility(save),continuationEligibility(save));
    const s=nativeSnapshot(save),lifeId='life-1';
    const next=copy(save);
    next.continuation={schema:1,journeyId,active:lifeId,sequence:0,nextLife:2,
        lives:{[lifeId]:{id:lifeId,bodyId:`${journeyId}:body-1`,label:'First life',tether:null,initial:s,checkpoint:null,paused:null}},
        mastery:{},knownMastery:[],memories:[],research:{minutes:0,running:false,observedAt:nativeMoment(save),checkpoint:false},
        loop:{enabled:false,target:'initial',cycles:0,nextAt:nativeMoment(save)+5},arrivalPaused:false,lastTransition:null};
    return next;
}
export function observeContinuation(save, {canStudy=false,knownSkills=[]}={}) {
    if(!save.continuation)return save;
    const c=validateContinuation(save.continuation),at=nativeMoment(save);
    const skillXP=save.levels?.person?.main_character?.skill_xp || {};
    for(const [skill,xp] of Object.entries(skillXP)) if(Number.isFinite(xp)&&xp>=0)c.mastery[skill]=Math.max(c.mastery[skill]||0,xp);
    c.knownMastery=[...new Set([...(c.knownMastery||[]),...knownSkills.filter(skill=>Object.hasOwn(c.mastery,skill))])];
    c.memories ||= [];
    for(const event of save.life_record?.recent||[]) {
        if(!c.memories.some(m=>m.lifeId===c.active&&m.event.at===event.at&&m.event.kind===event.kind&&m.event.text===event.text))
            c.memories.push({lifeId:c.active,event:copy(event)});
    }
    if(c.research.running&&canStudy) {
        c.research.minutes=Math.min(STUDY_MINUTES,c.research.minutes+Math.max(0,at-c.research.observedAt));
        if(c.research.minutes===STUDY_MINUTES){c.research.checkpoint=true;c.research.running=false;}
    }
    c.research.observedAt=at;
    return save;
}
function restore(source, snapshot, c) {
    const next=copy(snapshot);
    for(const key of preferences) if(Object.hasOwn(source,key))next[key]=copy(source[key]);
    next.saved_at=source.saved_at;
    const xp=next.levels?.person?.main_character?.skill_xp;
    if(xp)for(const skill of COMPATIBLE_MASTERY)if(c.mastery[skill]>0)xp[skill]=Math.max(xp[skill]||0,c.mastery[skill]);
    // Native load can infer a missing parent's XP from a child. Do not let
    // retained Crafting knowledge create its parent's dexterity conditioning.
    if(xp?.Crafting>0&&!Object.hasOwn(xp,'Crafting mastery'))xp['Crafting mastery']=0;
    c.research.running=false;c.research.observedAt=nativeMoment(next);
    c.arrivalPaused=true;
    next.continuation=c;
    return next;
}
export function planContinuation(original, command, {expectedSequence, fresh, token, label}={}) {
    const source=copy(original);observeContinuation(source);
    const c=validateContinuation(source.continuation);
    check(expectedSequence===c.sequence,'This continuation choice is stale. Inspect it again.');
    check(id(token),'Missing continuation event identity.');
    check(c.lastTransition?.token!==token,'This return has already been applied.');
    check(!continuationEligibility(source),continuationEligibility(source));
    const life=c.lives[c.active];let next=source;
    if(command==='study') {c.research.running=!c.research.running;c.research.observedAt=nativeMoment(source);}
    else if(command==='set') {
        check(c.research.checkpoint,'Investigate the connection before marking a later point.');
        life.checkpoint=nativeSnapshot(source);
    } else if(command==='initial'||command==='checkpoint') {
        const target=command==='initial'?life.initial:life.checkpoint;
        check(target,'There is no later checkpoint in this life.');
        check(nativeMoment(target)<=nativeMoment(source),'That recorded point lies in an abandoned future. This connection does not grant forward travel.');
        next=restore(source,target,c);
    } else if(command==='fresh') {
        check(fresh&&!continuationEligibility(fresh),'A compatible native fresh beginning is required.');
        const old=c.active,newId=`life-${c.nextLife++}`;
        life.paused=nativeSnapshot(source);
        const initial=nativeSnapshot(fresh);
        check(!fresh.continuation,'Fresh life cannot contain another journey.');
        initial.global_flags={...initial.global_flags,is_hero_created:true};
        initial.character.name=source.character.name;
        if(source.character.bio)initial.character.bio=copy(source.character.bio);
        c.lives[newId]={id:newId,bodyId:`${c.journeyId}:body-${newId}`,label:label||`Life ${c.nextLife-1}`,
            tether:old,initial:copy(initial),checkpoint:null,paused:null};
        c.active=newId; next=restore(source,initial,c);
    } else if(command.startsWith('resume:')) {
        const targetId=command.slice(7),target=c.lives[targetId];
        check(target&&target.paused&&(life.tether===targetId||target.tether===c.active),'No reciprocal connection reaches that life.');
        life.paused=nativeSnapshot(source);
        const targetSave=target.paused;target.paused=null;c.active=targetId;
        next=restore(source,targetSave,c);
    } else if(['loop','loop:initial','loop:checkpoint'].includes(command)) {
        if(command==='loop')c.loop.enabled=!c.loop.enabled;
        else {c.loop.target=command.slice(5);c.loop.enabled=true;}
        check(c.loop.target!=='checkpoint'||life.checkpoint,'Set a checkpoint before choosing it for repetition.');
        c.loop.nextAt=nativeMoment(source)+5;
    }
    else if(command==='continue') {c.arrivalPaused=false;}
    else if(command==='cycle') {
        check(c.loop.enabled,'Enable deliberate repetition before starting another cycle.');
        const target=c.loop.target==='initial'?life.initial:life.checkpoint;
        check(target,'Choose an existing checkpoint for repetition.');
        check(nativeMoment(target)<=nativeMoment(source),'This loop cannot reach a future checkpoint.');
        c.loop.cycles++;next=restore(source,target,c);c.arrivalPaused=false;c.loop.nextAt=nativeMoment(next)+5;
    } else throw Error('Unknown continuation action.');
    c.sequence++;c.lastTransition={token,kind:command,lifeId:c.active,sequence:c.sequence};
    next.continuation=c;validateContinuation(c);
    return next;
}
export function continuationView(save) {
    if(!save?.continuation)return {available:false,reason:continuationEligibility(save)};
    const c=validateContinuation(save.continuation),life=c.lives[c.active];
    return {available:true,reason:continuationEligibility(save),sequence:c.sequence,life:life.label,active:c.active,
        initialDate:copy(life.initial['current time']),checkpointDate:life.checkpoint?copy(life.checkpoint['current time']):null,
        checkpointReachable:!!life.checkpoint&&(!save['current time']||nativeMoment(life.checkpoint)<=nativeMoment(save)),
        memories:copy(c.memories||[]).map(m=>({...m,lifeLabel:c.lives[m.lifeId]?.label||'Earlier life'})),arrivalPaused:!!c.arrivalPaused,research:copy(c.research),loop:copy(c.loop),mastery:Object.entries(c.mastery).filter(([skill,xp])=>xp>0&&(c.knownMastery||[]).includes(skill)).map(([skill,xp])=>({skill,xp,usable:COMPATIBLE_MASTERY.includes(skill)})),
        paused:Object.values(c.lives).filter(x=>x.paused).map(x=>({id:x.id,label:x.label,reachable:life.tether===x.id||x.tether===c.active,date:copy(x.paused['current time'])}))};
}
