import {harvestedMaterialOutput} from './processed_materials.js';
import {readMaterialLineage} from './material_lineage.js';
// Wolf-rat slice. Pure plans have no random calls or native mutations.
import {natural} from './basics.js';
export const HARVEST_CAP = 24;
export const HARVEST_SPECIES = Object.freeze(['Starving wolf rat','Wolf rat','Elite wolf rat','Elite wolf rat guardian','Wall rat']);
export const HARVEST_PARTS = Object.freeze({pelt:{id:'Rat pelt',count:1,minutes:2},tail:{id:'Rat tail',count:1,minutes:1},fang:{id:'Rat fang',count:2,minutes:1}});
export const GRADED_IDS = Object.freeze(['Rat pelt','Rat tail','Rat fang','Piece of wolf rat leather','Processed rat pelt','Rat meat chunks']);
const clamp=(n,lo,hi)=>Math.min(hi,Math.max(lo,n));
export const supportedHarvest = species => HARVEST_SPECIES.includes(species);
export const partNames = species => species==='Wall rat'?['tail','fang']:['pelt','tail','fang'];
export const replacedHarvestDrop = (species,id) => supportedHarvest(species)&&partNames(species).some(p=>HARVEST_PARTS[p].id===id);
export function createHarvest(){return {schema:1,revision:1,sequence:0,auto:false,lots:{},job:null,left:0,processed:0,last:null};}
export function damageRecord(previous,{health,maxHealth,damage,critical=false,type='physical',hits=1}){
    const p=previous??{hits:0,crits:0,overkill:0,type:'physical'};
    return {hits:p.hits+hits,crits:p.crits+Number(critical),overkill:Math.max(p.overkill,Math.max(0,damage-health)/maxHealth),type:type==='physical'?p.type:type};
}
export function drawSpecimen({species,key,clock,damage},random){
    if(!supportedHarvest(species))throw Error('Unsupported carcass.');
    const draw=random(`harvest:${key}:specimen`);
    return {species,key,born:clock,draw,size:draw<.2?'small':draw>.8?'large':'ordinary',condition:draw<.1?'frail':draw>.9?'robust':'ordinary',variant:draw>.97?'unusual':'ordinary',damage:damage??{hits:1,crits:0,overkill:0,type:'physical'}};
}
export function harvestGrade(specimen,{clock,skill=0,tool=0},part){
    const d=specimen.damage;
    const sensitivity={pelt:1,tail:.65,fang:.35}[part];
    const integrity=clamp(100-sensitivity*(Math.min(d.overkill,2)*35+Math.max(0,d.hits-1)*3+d.crits*8+({physical:0,cut:8,blunt:16,fire:40,magic:25}[d.type]??0)),0,100);
    const completeness=integrity>=75?'whole':integrity>=40?'damaged':'scraps';
    const freshness=clamp(1-Math.max(0,clock-specimen.born)/240,0,1);
    const quality=Math.round(clamp(45+Math.min(skill,100)*.6+Math.min(tool,150)*.15+freshness*25+(specimen.condition==='robust'?5:specimen.condition==='frail'?-5:0),10,150)/5)*5;
    return {completeness,quality,integrity:Math.round(integrity),freshness};
}
export function gradedKey(id,quality,completeness){return JSON.stringify({id,quality,...(completeness?{completeness}:{})});}
export function validateGradedKey(key){
    const v=JSON.parse(key);
    if(v.lineage){readMaterialLineage(key);const plain={...v};delete plain.lineage;validateGradedKey(JSON.stringify(plain));return v;}
    if(v.completeness==null)return v; // Legacy quality-only keys retain their original reader contract.
    if(v.completeness!=null){
        if(!GRADED_IDS.includes(v.id)||!Number.isInteger(v.quality)||v.quality<10||v.quality>150||v.quality%5||
            (v.completeness!=null&&!['whole','damaged','scraps'].includes(v.completeness))||
            (!['Rat pelt','Rat tail','Rat fang'].includes(v.id)&&v.completeness!=null)||
            key!==gradedKey(v.id,v.quality,v.completeness))throw Error('Invalid graded harvest material.');
    }
    return v;
}
export function planHarvest(specimen,choice,context){
    const parts=choice==='whole'?partNames(specimen.species):[choice];
    if(!parts.length||parts.some(p=>!partNames(specimen.species).includes(p)))throw Error('Unavailable carcass part.');
    const outputs=parts.map(p=>{const grade=harvestGrade(specimen,context,p);return {part:p,item_key:gradedKey(HARVEST_PARTS[p].id,grade.quality,grade.completeness),count:HARVEST_PARTS[p].count+(p==='fang'&&context.skill>=25?1:0),...grade};});
    const minutes=parts.reduce((n,p)=>n+HARVEST_PARTS[p].minutes,0)*(context.tool>0?1:2);
    return {outputs,minutes,xp:parts.reduce((n,p)=>n+HARVEST_PARTS[p].minutes,0)*2,choice};
}
// Finite routine uses the existing native processing clock and publication.
export function setHarvestRoutine(state,target,clock){
    if(state.job)throw Error('Finish or cancel the current carcass before choosing a new routine.');
    if(!Number.isSafeInteger(target)||target<1||target>10000)throw Error('Choose 1 to 10000 carcasses.');
    state.routine={target,completed:0,outputs:{},started:clock,status:'active'};state.auto=true;state.sequence++;
}
export function pauseHarvestRoutine(state){state.auto=false;if(state.routine?.status==='active')state.routine.status='paused';state.sequence++;}
export function resumeHarvestRoutine(state){if(!state.routine||!['paused','active'].includes(state.routine.status)||state.routine.completed>=state.routine.target)throw Error('Choose a new finite routine.');state.routine.status='active';state.auto=true;state.sequence++;}
export function cancelHarvestRoutine(state){cancelHarvest(state);state.auto=false;if(state.routine&&state.routine.status!=='complete')state.routine.status='cancelled';state.sequence++;}
export function harvestWorkStages(job){
    if(!job?.total)return [];
    const parts=job.choice==='whole'?partNames(job.specimen.species):[job.choice],weight=parts.reduce((n,p)=>n+HARVEST_PARTS[p].minutes,0);
    return parts.map(p=>({label:`${p} work`,duration:job.total*HARVEST_PARTS[p].minutes/weight}));
}
export function settledHarvestPlan(specimen,choice,context){
    const plan=planHarvest(specimen,choice,context);
    return {...plan,outputs:plan.outputs.map(o=>harvestedMaterialOutput(specimen,o,context))};
}
export function finishHarvest(state,specimen,choice,context){
    const plan=settledHarvestPlan(specimen,choice,context);state.processed++;state.sequence++;
    const r=state.routine;
    if(r&&['active','paused'].includes(r.status)&&r.completed<r.target){r.completed++;for(const o of plan.outputs)r.outputs[o.item_key]=(r.outputs[o.item_key]??0)+o.count;if(r.completed===r.target){r.status='complete';state.auto=false;}}
    state.last={specimen:structuredClone(specimen),key:specimen.key,species:specimen.species,choice,outputs:plan.outputs,damage:specimen.damage,draw:specimen.draw,skill:context.skill,tool:context.tool,clock:context.clock};
    return plan;
}
export function addCarcass(state,specimen,context){
    const lot=state.lots[specimen.species]??=[];
    const cap=HARVEST_CAP-Number(state.job?.specimen.species===specimen.species);
    state.sequence++;
    if(lot.length>=cap){if(state.auto&&(!state.routine||!['active','paused'].includes(state.routine.status)||state.routine.completed+Number(!!state.job)<state.routine.target))return finishHarvest(state,specimen,'whole',context);state.left++;return null;}
    lot.push(specimen);return null;
}
export function beginHarvest(state,species,choice,context,automatic=false,specimenKey=null){
    if(state.job)throw Error('Finish or cancel the current processing.');
    const lot=state.lots[species];
    const specimen=automatic||specimenKey==null?lot?.[0]:lot?.find(s=>s.key===specimenKey);
    if(!specimen){if(specimenKey!=null)throw Error('That selected carcass is no longer available. Choose again.');throw Error('No carcass in this lot.');}
    const plan=planHarvest(specimen,choice,context);
    lot.splice(lot.indexOf(specimen),1);state.job={specimen,choice,total:plan.minutes,remaining:plan.minutes,automatic};state.sequence++;return plan;
}
export function cancelHarvest(state){if(!state.job)return;const s=state.job.specimen;state.lots[s.species].unshift(s);state.job=null;state.sequence++;}
const freshnessBand = value => value>=.75?'fresh':value>=.25?'aging':'spent';
const integrityBand = value => value>=75?'intact':value>=40?'damaged':'heavily damaged';
export function observeCarcass(state,species,specimenKey,{clock,skill=0}={}){
    const specimen=state.lots[species]?.find(s=>s.key===specimenKey);
    if(!specimen)throw Error('That selected carcass is no longer available. Choose again.');
    if(!natural(clock)||clock<specimen.born||!Number.isFinite(skill)||skill<0)throw Error('A current played-time observation is required.');
    const grade=harvestGrade(specimen,{clock,skill,tool:0},'pelt');
    const margin=skill>=50?10:skill>=20?30:60,age=clock-specimen.born;
    const observation={at:clock,skill,ageEstimate:{min:Math.max(0,age-margin),max:age+margin},freshness:freshnessBand(grade.freshness),integrity:integrityBand(grade.integrity)};
    specimen.observations??=[];specimen.observations.push(observation);state.sequence++;
    return structuredClone(observation);
}
export function advanceHarvest(state,minutes,context,{ready=true}={}){
    const results=[];
    if(state.job&&ready){const remaining=state.job.remaining;if(remaining<=minutes){const elapsedAfterFinish=Math.max(0,minutes-remaining);const completionContext={...context,clock:Math.max(state.job.specimen.born,context.clock-elapsedAfterFinish)};results.push(finishHarvest(state,state.job.specimen,state.job.choice,completionContext));state.job=null;}else state.job.remaining-=minutes;}
    if(!state.job&&state.auto&&ready){const species=HARVEST_SPECIES.find(s=>state.lots[s]?.length);if(species)beginHarvest(state,species,'whole',context,true);}
    return results;
}
// Weighted quality of the exact FIFO-by-price recipe expenditure. No draws.
export function consumedHarvestQuality(groups,requirements,attempts){
    let weight=0,total=0,graded=false;
    groups.forEach((g,i)=>{let remaining=requirements[i].count*attempts;for(const row of g.items){const n=Math.min(remaining,row.count);remaining-=n;if(n&&row.item.quality!=null)graded=true;total+=n*(row.item.quality??100);weight+=n;if(!remaining)break;}});
    return graded&&weight?Math.round(total/weight/5)*5:null;
}
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const fail=()=>{throw Error('Invalid or unsupported saved harvest state.');};
export function validateHarvestDamage(d){
    if(!object(d)||!natural(d.hits)||!natural(d.crits)||d.crits>d.hits||!Number.isFinite(d.overkill)||d.overkill<0||!['physical','cut','blunt','fire','magic'].includes(d.type))fail();return d;
}
export function validateSpecimen(s,clock=Number.MAX_SAFE_INTEGER){
    if(!object(s)||!supportedHarvest(s.species)||typeof s.key!=='string'||!s.key||s.key.length>500||!natural(s.born)||s.born>clock||
        !Number.isFinite(s.draw)||s.draw<0||s.draw>=1)fail();
    const expected=drawSpecimen({species:s.species,key:s.key,clock:s.born,damage:validateHarvestDamage(s.damage)},()=>s.draw);
    for(const k of ['size','condition','variant'])if(expected[k]!==s[k])fail();
    if(s.observations!=null){if(!Array.isArray(s.observations))fail();let prior=s.born;for(const o of s.observations){if(!object(o)||!natural(o.at)||o.at<s.born||o.at>clock||o.at<prior||!Number.isFinite(o.skill)||o.skill<0||!object(o.ageEstimate)||!natural(o.ageEstimate.min)||!natural(o.ageEstimate.max)||o.ageEstimate.min>o.ageEstimate.max||!['fresh','aging','spent'].includes(o.freshness)||!['intact','damaged','heavily damaged'].includes(o.integrity))fail();const margin=o.skill>=50?10:o.skill>=20?30:60,age=o.at-s.born;if(o.ageEstimate.min!==Math.max(0,age-margin)||o.ageEstimate.max!==age+margin)fail();const grade=harvestGrade(s,{clock:o.at,skill:o.skill,tool:0},'pelt');if(o.freshness!==freshnessBand(grade.freshness)||o.integrity!==integrityBand(grade.integrity))fail();prior=o.at;}}
    return s;
}
export function validateHarvest(s,clock=Number.MAX_SAFE_INTEGER){
    if(s==null)return null;
    if(!object(s)||s.schema!==1||s.revision!==1||!natural(s.sequence)||!natural(s.left)||!natural(s.processed)||typeof s.auto!=='boolean'||!object(s.lots))fail();
    if(s.routine!=null){const r=s.routine;if(!object(r)||Object.keys(r).some(k=>!['target','completed','outputs','started','status'].includes(k))||!Number.isSafeInteger(r.target)||r.target<1||r.target>10000||!natural(r.completed)||r.completed>r.target||r.completed>s.processed||!natural(r.started)||r.started>clock||!['active','paused','complete','cancelled'].includes(r.status)||!object(r.outputs)||Object.keys(r.outputs).length>r.target*5||r.status==='complete'&&r.completed!==r.target||r.completed===r.target&&r.status!=='complete'||r.status==='active'&&!s.auto||['paused','complete','cancelled'].includes(r.status)&&s.auto)fail();let count=0;for(const [key,n]of Object.entries(r.outputs)){const v=validateGradedKey(key);if(!['Rat pelt','Rat tail','Rat fang'].includes(v.id)||v.completeness==null||!Number.isSafeInteger(n)||n<1)fail();count+=n;}if(count<r.completed||count>r.completed*5)fail();}
    const keys=new Set();const visit=x=>{validateSpecimen(x,clock);if(keys.has(x.key))fail();keys.add(x.key);};
    for(const [species,lot] of Object.entries(s.lots)){if(!supportedHarvest(species)||!Array.isArray(lot)||lot.length>HARVEST_CAP)fail();for(const x of lot){if(x.species!==species)fail();visit(x);}}
    if(s.job!=null){const j=s.job;if(!object(j)||typeof j.automatic!=='boolean'||!Number.isFinite(j.remaining)||j.remaining<=0)fail();visit(j.specimen);const plan=planHarvest(j.specimen,j.choice,{clock,skill:0,tool:0});if(j.remaining>plan.minutes||(s.lots[j.specimen.species]?.length??0)+1>HARVEST_CAP)fail();if(j.total!=null&&(![plan.minutes,plan.minutes/2].includes(j.total)||j.remaining>j.total))fail();}
    if(s.last!=null){const l=s.last;validateSpecimen(l.specimen,clock);if(!natural(l.clock)||l.clock>clock||l.clock<l.specimen.born||!Number.isFinite(l.skill)||l.skill<0||!Number.isFinite(l.tool)||l.tool<0)fail();const expected=(l.outputs?.some(o=>JSON.parse(o.item_key).lineage)?settledHarvestPlan:planHarvest)(l.specimen,l.choice,l);if(JSON.stringify(expected.outputs)!==JSON.stringify(l.outputs)||l.key!==l.specimen.key||l.species!==l.specimen.species||l.draw!==l.specimen.draw||JSON.stringify(l.damage)!==JSON.stringify(l.specimen.damage))fail();}
    return s;
}
export function validateHarvestEnvelope(envelope,clock=Number.MAX_SAFE_INTEGER){
    validateHarvest(envelope.harvest,clock);
    function visit(v){if(typeof v==='string'&&v.startsWith('{')){let parsed;try{parsed=JSON.parse(v);}catch{return;}if(parsed.completeness!=null||GRADED_IDS.includes(parsed.id)&&parsed.quality!=null)validateGradedKey(v);}else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){visit(k);visit(x);}}
    visit(envelope);return envelope;
}
