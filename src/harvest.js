// Wolf-rat slice. Pure plans have no random calls or native mutations.
export const HARVEST_CAP = 24;
export const HARVEST_SPECIES = Object.freeze(['Starving wolf rat','Wolf rat','Elite wolf rat','Elite wolf rat guardian','Wall rat']);
export const HARVEST_PARTS = Object.freeze({pelt:{id:'Rat pelt',count:1,minutes:2},tail:{id:'Rat tail',count:1,minutes:1},fang:{id:'Rat fang',count:2,minutes:1}});
export const GRADED_IDS = Object.freeze(['Rat pelt','Rat tail','Rat fang','Piece of wolf rat leather']);
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
    if(v.completeness!=null||GRADED_IDS.includes(v.id)&&v.quality!=null){
        if(!GRADED_IDS.includes(v.id)||!Number.isInteger(v.quality)||v.quality<10||v.quality>150||v.quality%5||
            (v.completeness!=null&&!['whole','damaged','scraps'].includes(v.completeness))||
            (v.id==='Piece of wolf rat leather'&&v.completeness!=null)||
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
    state.last={key:specimen.key,species:specimen.species,choice,outputs:plan.outputs,damage:specimen.damage,draw:specimen.draw,skill:context.skill,tool:context.tool,clock:context.clock};
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
