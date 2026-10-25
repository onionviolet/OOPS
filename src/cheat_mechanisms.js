import {sketchPattern,rebuildPattern} from './pattern_book.js';
import {projectCrafting} from './crafting_frontier_runtime.js';
import {defineGate,evaluateGate} from './progression_gates.js';
import {validateCheatState,grantCheat} from './cheat_cards.js';
import {CHEAT_MODULES,moduleCard} from './cheat_definitions.js';
import {observeCarcass,setHarvestRoutine} from './harvest.js';
import {ensureStreams,scopedStream,armStreamCall,peekStreamDecision} from './seeded_streams.js';
import {calendarMinutes} from './world_rhythm.js';

export function insightMilestones(save) {
    const awake=save.cheats?.held?.['quiet-faculty']?.card.state.awakened===true;
    const xp=save.levels?.person?.main_character?.skill_xp||{};
    const rows=[
        {id:'recognition',label:'Recognize the continuing insight',met:awake},
        {id:'first-victory',label:'Win a combat-zone round',met:Object.values(save.locations||{}).some(x=>x.enemy_groups_killed>0)},
        {id:'first-processing',label:'Process a carcass',met:(save.harvest?.processed||0)>0},
        {id:'practised-craft',label:'Learn through crafting',met:(xp.Crafting||0)>0},
        {id:'practised-perception',label:'Learn through perception',met:(xp.Perception||0)>0},
        {id:'learned-method',label:'Learn a written method',met:(save.crafting?.references?.learned?.player?.length||0)>0},
        {id:'recorded-pattern',label:'Retain a readable design',met:(save.cheats?.held?.['pattern-book']?.card.state.patterns.length||0)>0},
    ];
    return rows.map(row=>({...row,met:evaluateGate(defineGate({id:`cheat.insight.${row.id}`,kind:'knowledge',reason:row.label,requires:{fact:row.id,op:'eq',value:true},routes:[{id:'live',reason:'Reflect on relevant lived experience.',cost:'Practice and attention.'}]}),{[row.id]:row.met},{knows:()=>true}).met}));
}
export function cheatProjection(save) {
    const faculty=save.cheats?.held?.['quiet-faculty'];
    if(!faculty?.card.state.awakened)return {visible:false,cards:[],milestones:[]};
    const state=faculty.card.state;
    return {visible:true,points:state.points??0,earned:state.earned??0,spent:state.spent??0,
        milestones:insightMilestones(save).map(m=>({...m,claimed:(state.claimed||[]).includes(m.id)})),
        decisions:save.decisions||[],
        methods:projectCrafting(save.crafting,Object.fromEntries(Object.entries(save.inventories?.person?.main_character||{}).map(([k,r])=>[k,r.count]))).methods,
        development:CHEAT_MODULES.find(d=>!save.cheats.held[d.id])? 'Explore the next facet · 1 insight':null,
        cards:CHEAT_MODULES.filter(d=>save.cheats.held[d.id]).map(d=>({...d,state:structuredClone(save.cheats.held[d.id].card.state)})),
        specimens:Object.entries(save.harvest?.lots||{}).flatMap(([species,rows])=>rows.map(row=>({species,key:row.key}))),
        reason:''};
}
function held(save,id) {
    const card=save.cheats?.held?.[id]?.card;
    if(!card)throw Error('That faculty has not been discovered.');return card;
}
function spend(card) {
    if(card.state.charges<1)throw Error('No charges remain in this faculty.');
    card.state.charges--;card.state.used++;
}
// Pure envelope plan. The host rechecks against a fresh capture and commits the
// complete envelope through the existing native writer before publishing owners.
export function planCheatAction(original, request) {
    const save=structuredClone(original),at=calendarMinutes(save['current time']);
    save.cheats=validateCheatState(save.cheats);
    if(request.type==='system-claim') {
        const system=held(save,'system-quests'),quest=systemQuestProjection(save);
        if(!quest.canClaim)throw Error('That quest is not complete or is already claimed.');
        system.state.claimed=[...(system.state.claimed||[]),'first-victory'];system.state.points=(system.state.points||0)+1;
        system.state.earned=(system.state.earned||0)+1;
        return {...save,cheats:validateCheatState(save.cheats)};
    }
    const faculty=held(save,'quiet-faculty');
    if(!faculty.state.awakened)throw Error('The faculty has not been recognized.');
    if(['appraise','routine'].includes(request.type)&&save.expansion?.actors?.player?.worldId!=='base.frontier')throw Error('These carcasses remain in the Frontier. Return to their location to work on them.');
    if(request.type==='claim') {
        const m=insightMilestones(save).find(m=>m.id===request.id),s=faculty.state;
        if(!m?.met||(s.claimed||[]).includes(m.id))throw Error('This insight is not ready or is already retained.');
        s.claimed=[...(s.claimed||[]),m.id];s.points=(s.points||0)+1;s.earned=(s.earned||0)+1;
    } else if(request.type==='develop') {
        if(faculty.state.points<1)throw Error('Reflect on a lived milestone to develop an insight.');
        const d=CHEAT_MODULES.find(d=>!save.cheats.held[d.id]);if(!d)throw Error('No further facet is understood yet.');
        faculty.state.points--;faculty.state.spent=(faculty.state.spent||0)+1;
        faculty.stages.push({id:d.id,at,via:'lived-insight',carried:true});
        save.cheats=grantCheat(save.cheats,moduleCard(d.id),{route:'faculty-development',at});
    } else if(request.type==='recharge') {
        const card=held(save,request.id),definition=CHEAT_MODULES.find(d=>d.id===request.id);
        if(!definition||card.state.charges>=definition.state.charges)throw Error('That reserve is already full.');
        if(faculty.state.points<1)throw Error('Retain a lived insight before restoring a reserve.');
        faculty.state.points--;faculty.state.spent++;card.state.charges++;card.state.recharged++;
    } else if(request.type==='appraise') {
        const card=held(save,'true-appraisal');spend(card);
        // A stronger eye uses the existing observation mechanism, not a second truth store.
        const skill=Math.max(25,Number.isFinite(request.skill)?request.skill:0);
        const reading=observeCarcass(save.harvest,request.species,request.key,{clock:at,skill});
        card.state.readings.push({...reading,species:request.species,key:request.key,source:'true-appraisal'});
    } else if(request.type==='sketch') {
        const card=held(save,'pattern-book');
        if(card.state.patterns.some(p=>p.recipe.id===request.id))throw Error('This design is already retained.');
        const inventory=Object.fromEntries(Object.entries(save.inventories?.person?.main_character||{}).map(([k,r])=>[k,r.count]));
        const pattern=sketchPattern(save.crafting,inventory,request.id,at);spend(card);card.state.patterns.push(pattern);
    } else if(request.type==='rebuild-pattern') {
        const card=held(save,'pattern-book'),pattern=card.state.patterns.find(p=>p.recipe.id===request.id);
        if(!pattern)throw Error('That design is not retained.');
        save.crafting=rebuildPattern(save.crafting,pattern,save.expansion?.actors?.player?.worldId);spend(card);
    } else if(request.type==='call') {
        const card=held(save,'loaded-dice');
        armStreamCall(save.expansion,scopedStream('loot',save.expansion.actors.player.worldId),{value:0,via:'loaded-dice'});spend(card);
    } else if(request.type==='peek') {
        const card=held(save,'fate-ledger');
        if(typeof request.key!=='string'||!request.key.trim()||request.key.length>240)throw Error('Name the decision to read.');
        const stream=scopedStream('loot',save.expansion.actors.player.worldId),s=ensureStreams(save.expansion),n=request.keyed?0:(s.cells[stream]?.n||0)+1;
        const reading=peekStreamDecision(s,stream,request.key,n);spend(card);
        card.state.readings.push({at,key:request.key,label:request.label||'Loot decision',ordinal:n,value:reading.value,source:'fate-ledger',via:reading.receipt.via});
    } else if(request.type==='routine') {
        const card=held(save,'earned-habit');
        if(!(save.harvest?.processed>0))throw Error('Process a carcass by hand before entrusting its pattern to habit.');
        setHarvestRoutine(save.harvest,request.target,at);spend(card);
    } else throw Error('Unknown faculty action.');
    save.cheats=validateCheatState(save.cheats);
    return save;
}

export function executeCheatAction({capture,commit,publish},request) {
    const next=planCheatAction(capture(),request);
    commit(next,()=>publish(next));
    return next;
}

export function systemQuestProjection(save) {
    const card=save.cheats?.held?.['system-quests']?.card;
    const claimed=(card?.state.claimed||[]).includes('first-victory');
    const met=Object.values(save.locations||{}).some(x=>x.enemy_groups_killed>0);
    return {text:claimed?'First victory · claimed. One system point retained.':met?'First victory · complete. Claim one system point.':'First victory · win a combat-zone round. Reward: one system point.',
        canClaim:card?.state.awakened===true&&met&&!claimed};
}
