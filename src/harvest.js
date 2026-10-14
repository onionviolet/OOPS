// Wolf-rat slice. Pure plans have no random calls or native mutations.
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
export function finishHarvest(state,specimen,choice,context){
    const plan=planHarvest(specimen,choice,context);state.processed++;state.sequence++;
    state.last={specimen:structuredClone(specimen),key:specimen.key,species:specimen.species,choice,outputs:plan.outputs,damage:specimen.damage,draw:specimen.draw,skill:context.skill,tool:context.tool,clock:context.clock};
    return plan;
}
export function addCarcass(state,specimen,context){
    const lot=state.lots[specimen.species]??=[];
    const cap=HARVEST_CAP-Number(state.job?.specimen.species===specimen.species);
    state.sequence++;
    if(lot.length>=cap){if(state.auto)return finishHarvest(state,specimen,'whole',context);state.left++;return null;}
    lot.push(specimen);return null;
}
export function beginHarvest(state,species,choice,context,automatic=false){
    if(state.job)throw Error('Finish or cancel the current processing.');
    const specimen=state.lots[species]?.[0];if(!specimen)throw Error('No carcass in this lot.');
    const plan=planHarvest(specimen,choice,context);
    state.lots[species].shift();state.job={specimen,choice,remaining:plan.minutes,automatic};state.sequence++;return plan;
}
export function cancelHarvest(state){if(!state.job)return;const s=state.job.specimen;state.lots[s.species].unshift(s);state.job=null;state.sequence++;}
export function advanceHarvest(state,minutes,context,{ready=true}={}){
    const results=[];
    if(state.job&&ready){state.job.remaining-=minutes;if(state.job.remaining<=0){results.push(finishHarvest(state,state.job.specimen,state.job.choice,context));state.job=null;}}
    if(!state.job&&state.auto&&ready){const species=HARVEST_SPECIES.find(s=>state.lots[s]?.length);if(species)beginHarvest(state,species,'whole',context,true);}
    return results;
}
// Weighted quality of the exact FIFO-by-price recipe expenditure. No draws.
export function consumedHarvestQuality(groups,requirements,attempts){
    let weight=0,total=0,graded=false;
    groups.forEach((g,i)=>{let remaining=requirements[i].count*attempts;for(const row of g.items){const n=Math.min(remaining,row.count);remaining-=n;if(n&&row.item.quality!=null)graded=true;total+=n*(row.item.quality??100);weight+=n;if(!remaining)break;}});
    return graded&&weight?Math.round(total/weight/5)*5:null;
}
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const fail=()=>{throw Error('Invalid or unsupported saved harvest state.');};
export function validateHarvestDamage(d){
    if(!object(d)||!natural(d.hits)||!natural(d.crits)||d.crits>d.hits||!Number.isFinite(d.overkill)||d.overkill<0||!['physical','cut','blunt','fire','magic'].includes(d.type))fail();return d;
}
export function validateSpecimen(s,clock=Number.MAX_SAFE_INTEGER){
    if(!object(s)||!supportedHarvest(s.species)||typeof s.key!=='string'||!s.key||s.key.length>500||!natural(s.born)||s.born>clock||
        !Number.isFinite(s.draw)||s.draw<0||s.draw>=1)fail();
    const expected=drawSpecimen({species:s.species,key:s.key,clock:s.born,damage:validateHarvestDamage(s.damage)},()=>s.draw);
    for(const k of ['size','condition','variant'])if(expected[k]!==s[k])fail();return s;
}
export function validateHarvest(s,clock=Number.MAX_SAFE_INTEGER){
    if(s==null)return null;
    if(!object(s)||s.schema!==1||s.revision!==1||!natural(s.sequence)||!natural(s.left)||!natural(s.processed)||typeof s.auto!=='boolean'||!object(s.lots))fail();
    const keys=new Set();const visit=x=>{validateSpecimen(x,clock);if(keys.has(x.key))fail();keys.add(x.key);};
    for(const [species,lot] of Object.entries(s.lots)){if(!supportedHarvest(species)||!Array.isArray(lot)||lot.length>HARVEST_CAP)fail();for(const x of lot){if(x.species!==species)fail();visit(x);}}
    if(s.job!=null){const j=s.job;if(!object(j)||typeof j.automatic!=='boolean'||!Number.isFinite(j.remaining)||j.remaining<=0)fail();visit(j.specimen);const plan=planHarvest(j.specimen,j.choice,{clock,skill:0,tool:0});if(j.remaining>plan.minutes||(s.lots[j.specimen.species]?.length??0)+1>HARVEST_CAP)fail();}
    if(s.last!=null){const l=s.last;validateSpecimen(l.specimen,clock);if(!natural(l.clock)||l.clock>clock||l.clock<l.specimen.born||!Number.isFinite(l.skill)||l.skill<0||!Number.isFinite(l.tool)||l.tool<0)fail();const expected=planHarvest(l.specimen,l.choice,l);if(JSON.stringify(expected.outputs)!==JSON.stringify(l.outputs)||l.key!==l.specimen.key||l.species!==l.specimen.species||l.draw!==l.specimen.draw||JSON.stringify(l.damage)!==JSON.stringify(l.specimen.damage))fail();}
    return s;
}
export function validateHarvestEnvelope(envelope,clock=Number.MAX_SAFE_INTEGER){
    validateHarvest(envelope.harvest,clock);
    function visit(v){if(typeof v==='string'&&v.startsWith('{')){let parsed;try{parsed=JSON.parse(v);}catch{return;}if(parsed.completeness!=null||GRADED_IDS.includes(parsed.id)&&parsed.quality!=null)validateGradedKey(v);}else if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){visit(k);visit(x);}}
    visit(envelope);return envelope;
}
