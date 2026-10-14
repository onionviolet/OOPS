import {validateStoryRequests} from './story_requests.js';
import {drawUnit,scopedStream} from './seeded_streams.js';
import {deriveSimulationSeed} from './simulation_resolution.js';
import {generatePersonName} from './name_grammar.js';
const traits=['kind','curious','patient','practical','sociable','reserved'];
const needs=['rest','belonging','purpose'];
export const peopleTemplates=Object.freeze([
    {id:'road_mender',role:'traveling mender',requests:['Rat pelt','Stale bread'],keepsakes:['bone needle','thread spool']},
    {id:'river_walker',role:'river traveler',requests:['Stale bread','Rat tail'],keepsakes:['river stone','reed whistle']},
    {id:'hill_carrier',role:'hill courier',requests:['Stale bread','Rat pelt'],keepsakes:['folded letter','brass clasp']}
]);
const check=(ok,m)=>{if(!ok)throw Error(`Invalid generated people: ${m}.`);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export function createGeneratedPeople(seed,at,authoredNames=[],streamState=null) {
    check(natural(seed)&&seed<=0xffffffff&&natural(at),'seed or clock');
    let rng=deriveSimulationSeed(seed,'village.generated_people@1');
    const draw=n=>{if(streamState)return Math.floor(drawUnit(streamState,scopedStream('world.people:village'),'generation')*n);rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;rng>>>=0;return Math.floor(rng/0x100000000*n);};
    const people=[];
    for(let i=0;i<3;i++) {
        const template=peopleTemplates[draw(peopleTemplates.length)],id=`traveler_${i+1}`;
        const naming=generatePersonName({seed:streamState?draw(0x100000000):rng,key:id,used:people.map(p=>p.name),authored:authoredNames.length?authoredNames:undefined});
        const pool=[...traits],picked=[];for(let j=0,n=2+draw(2);j<n;j++)picked.push(pool.splice(draw(pool.length),1)[0]);
        const item=template.requests[draw(template.requests.length)],reward=3+draw(4);
        people.push({id,...naming,templateId:template.id,role:template.role,traits:picked,knownTraits:[],met:false,
            need:{id:needs[draw(needs.length)],initial:60+draw(26),value:70},goal:{id:'supply',item,reward,fulfilled:false},
            possessions:{coins:reward+2+draw(8),keepsake:template.keepsakes[draw(template.keepsakes.length)],supplies:{}},
            arrivedAt:at+(i===2?1440:0),status:i===2?'on_road':'visiting',resident:false,action:'arriving',relationship:null});
    }
    return advanceGeneratedPeople({schema:1,seed,rng,enrolledAt:at,lastMinute:at,people},at);
}
export function validateGeneratedPeople(s) {
    check(s&&s.schema===1&&natural(s.seed)&&s.seed<=0xffffffff&&natural(s.rng)&&s.rng<=0xffffffff&&natural(s.enrolledAt)&&natural(s.lastMinute)&&s.lastMinute>=s.enrolledAt,'schema/clock');
    check(Array.isArray(s.people)&&s.people.length===3,'population');const ids=new Set(),names=new Set();
    for(const p of s.people) {
        check(/^traveler_[1-3]$/.test(p.id)&&!ids.has(p.id)&&typeof p.name==='string'&&p.name.length<=64&&!names.has(p.name.toLowerCase()),'identity');ids.add(p.id);names.add(p.name.toLowerCase());
        check(peopleTemplates.some(t=>t.id===p.templateId)&&typeof p.role==='string'&&p.role.length<=40&&['hill','river','road'].includes(p.culture)&&p.grammarRevision===1,'template');
        check(Array.isArray(p.traits)&&p.traits.length>=2&&p.traits.length<=3&&new Set(p.traits).size===p.traits.length&&p.traits.every(t=>traits.includes(t))&&Array.isArray(p.knownTraits)&&new Set(p.knownTraits).size===p.knownTraits.length&&p.knownTraits.every(t=>p.traits.includes(t))&&typeof p.met==='boolean'&&(p.met||p.knownTraits.length===0),'traits/knowledge');
        check(needs.includes(p.need?.id)&&natural(p.need.initial)&&p.need.initial<=100&&natural(p.need.value)&&p.need.value<=100,'need');
        check(p.goal?.id==='supply'&&['Stale bread','Rat pelt','Rat tail'].includes(p.goal.item)&&natural(p.goal.reward)&&p.goal.reward>=3&&p.goal.reward<=6&&typeof p.goal.fulfilled==='boolean','goal');
        check(natural(p.possessions?.coins)&&p.possessions.coins<=20&&typeof p.possessions.keepsake==='string'&&p.possessions.keepsake.length<=40&&p.possessions.supplies&&Object.keys(p.possessions.supplies).every(k=>k===p.goal.item&&p.possessions.supplies[k]===1),'possessions');
        check(natural(p.arrivedAt)&&p.arrivedAt>=s.enrolledAt&&['visiting','on_road','resident'].includes(p.status)&&typeof p.resident==='boolean'&&(!p.resident||p.goal.fulfilled)&&['arriving','resting','talking','planning','browsing','traveling'].includes(p.action)&&[null,'helped with supplies'].includes(p.relationship),'routine');
        check(!p.goal.fulfilled||(p.met&&p.relationship==='helped with supplies'&&p.possessions.supplies[p.goal.item]===1),'settlement');
    }validateStoryRequests(s);return s;
}
// Pure hourly projection: no random draws, no offline wall time, no preview mutation.
// The six-hour routine includes recovery; long calendar jumps cost O(people).
export function advanceGeneratedPeople(state,at) {
    if(state==null)return null;validateGeneratedPeople(state);check(natural(at)&&at>=state.lastMinute,'clock went backward');
    const s=structuredClone(state);s.lastMinute=at;
    for(const p of s.people) {
        if(at<p.arrivedAt)continue;
        const hours=Math.floor((at-p.arrivedAt)/60),day=Math.floor(hours/24);
        p.status=p.resident?'resident':day%5<3?'visiting':'on_road';
        const pressure=100-p.need.initial+(hours%6)*12;
        const satisfying={rest:'resting',belonging:'talking',purpose:'planning'}[p.need.id];
        const choices=[{id:satisfying,score:pressure+(p.traits.includes('patient')?8:0)},
            {id:'browsing',score:35+(p.traits.includes('curious')?8:0)},
            {id:'planning',score:p.goal.fulfilled?15:30+(p.traits.includes('practical')?12:0)}];
        choices.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
        p.action=p.status==='on_road'?'traveling':choices[0].id;
        p.need.value=Math.min(100,Math.max(0,100-pressure)+(p.action===satisfying?20:0));
    }return validateGeneratedPeople(s);
}
export function generatedPeopleView(s) {
    if(!s)return [];validateGeneratedPeople(s);
    return s.people.filter(p=>p.arrivedAt<=s.lastMinute&&(p.met||p.status!=='on_road')).map(p=>({id:p.id,name:p.met?p.name:'Unmet traveler',role:p.role,status:p.status,action:p.action,met:p.met,
        traits:p.knownTraits,undiscovered:p.met?p.traits.length-p.knownTraits.length:null,need:p.met?p.need.id:null,
        goal:p.met?structuredClone(p.goal):null,relationship:p.relationship}));
}
export function interactGeneratedPerson(state,id,action,{inVillage=true,suppliedItem=null}={}) {
    validateGeneratedPeople(state);check(inVillage,'meet them in Village');const s=structuredClone(state),p=s.people.find(p=>p.id===id);
    check(p&&p.arrivedAt<=s.lastMinute&&p.status!=='on_road','person is away');let reward=0;
    if(action==='meet'){check(!p.met,'already met');p.met=true;}
    else {
        check(p.met,'meet first');
        if(action==='talk'){const next=p.traits.find(t=>!p.knownTraits.includes(t));check(next,'nothing new to share');p.knownTraits.push(next);}
        else if(action==='help') {check(!s.storyRequests?.requests.some(r=>r.issuer===id&&['offered','accepted'].includes(r.status)),'use the reserved request');check(!p.goal.fulfilled&&suppliedItem===p.goal.item&&p.possessions.coins>=p.goal.reward,'request needs its actual supply');p.goal.fulfilled=true;p.possessions.supplies[suppliedItem]=1;reward=p.goal.reward;p.possessions.coins-=reward;p.relationship='helped with supplies';}
        else if(action==='settle'){check(p.goal.fulfilled&&!p.resident,'help before offering a place');p.resident=true;p.status='resident';}
        else throw Error('Unknown generated person interaction.');
    }
    return {state:validateGeneratedPeople(s),reward};
}
