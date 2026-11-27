import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadNative,STANCE_LOCATION_STUBS} from './helpers/native_loader.mjs';
import {activeSkillForm,activeSkillFunction,automaticSkillTiers,skillTierEvent,offerSkillEvolution,chooseSkillEvolution,
    evolveSkillPractice,emptySkillEvolution,mergedSkillView,quoteSkillEvolution,readSkillEvolution,refuseSkillEvolution,
    settleSkillRecovery,settleSkinBodyEffect,settleSkinCritical,settleSkinStamina,validateEvolutionRows,SKILL_EVOLUTION_REVISION} from '../src/skill_evolution.js';
import {mitigateCombatDamage} from '../src/combat_math.js';
import {SKILL_EVOLUTIONS,validateSkillEvolutionEnvelope} from '../src/data/skill_evolutions.js';

const [row]=SKILL_EVOLUTIONS;
const [heavy,balance]=row.targets;
const context={...row.requirements};
const path=new URL('./fixtures/skill-evolution-legacy.json',import.meta.url);

test('native skill data keeps the YAIR tier boundaries and upgrade event',async()=>{
    const {skills,character,fill_availability_methods}=await loadNative(`export {skills} from './src/data/skills.js'; export {character} from './src/data/character.js'; export {fill_availability_methods} from './src/component_management.js';`,{stubs:STANCE_LOCATION_STUBS});
    fill_availability_methods();
    const iron=skills['Iron skin'], giant=skills['Giant slayer'];
    assert.ok(!Object.hasOwn(skills,'village.breathing-skin'));
    assert.ok(Object.hasOwn(skills,'Grain lifting: heavy sets'));
    for(const [skill,levels,names] of [
        [iron,[0,9,10,19,20,29,30],['Tough skin','Tough skin','Wooden skin','Wooden skin','Stone skin','Stone skin','Iron skin']],
        [giant,[0,14,15],['Giant killer','Giant killer','Giant slayer']],
    ]){
        assert.deepEqual(levels.map(level=>skill.getTierName(level)),names);
        assert.ok(automaticSkillTiers(skill.skill_id,skill.names).every(tier=>tier.automatic&&tier.targets.length===1&&tier.targets[0].id===skill.skill_id));
    }
    assert.deepEqual(skillTierEvent(iron.skill_id,iron.getTierName(29),iron.getTierName(30)),{
        type:'skill-tier-changed',from:'Iron skin',previous:'Stone skin',current:'Iron skin',
    });
    const legacy=JSON.parse(await readFile(path,'utf8')),old=structuredClone(legacy);
    assert.deepEqual(validateSkillEvolutionEnvelope(legacy),emptySkillEvolution());
    for(const [id,total] of Object.entries(legacy.levels.person.main_character.skill_xp)){
        const xp=character.getSkillXPObject({skill_id:id});
        skills[id].add_xp({skillXP:xp,xp_to_add:total,track_dependencies:false});
        assert.equal(xp.total_xp,total);
        assert.equal(skills[id].getName(xp),skills[id].getTierName(xp.current_level));
    }
    assert.deepEqual(legacy,old);
    assert.equal(iron.getName(),'Stone skin');
    assert.equal(skills.Weightlifting.getCurrentLvl(),2);
});

test('only qualifying practice offers a choice, with unchanged XP while waiting',()=>{
    const start=emptySkillEvolution();
    assert.equal(offerSkillEvolution(start,row,2,context),null);
    assert.equal(offerSkillEvolution(start,row,3,{...context,world:'elsewhere'}),null);
    const offered=offerSkillEvolution(start,row,3,context);
    assert.deepEqual(offered.event,{type:'skill-evolution-waiting',from:'Weightlifting',evolution:row.id});
    assert.equal(offerSkillEvolution(offered.state,row,4,context),null);
    assert.deepEqual(evolveSkillPractice(offered.state,row,4,context),{sourceXP:4,extra:[]});
    assert.throws(()=>chooseSkillEvolution(offered.state,row,heavy.id,3,{...context,activity:null}),/Carry grain/);
    assert.throws(()=>chooseSkillEvolution(offered.state,row,'other branch',3,context),/not offered/);
});

test('one durable form has its own identity and distinct earned effects',()=>{
    const waiting=offerSkillEvolution(emptySkillEvolution(),row,3,context).state;
    const stronger=chooseSkillEvolution(waiting,row,heavy.id,3,context);
    assert.deepEqual(stronger.costs,[]);
    assert.deepEqual(evolveSkillPractice(stronger.state,row,2,context),{sourceXP:3,extra:[[heavy.id,1]]});
    assert.deepEqual(evolveSkillPractice(stronger.state,row,2,{...context,location:'Nearby cave'}),{sourceXP:2,extra:[]});
    assert.throws(()=>chooseSkillEvolution(stronger.state,row,balance.id,3,context),/no longer waiting/);
    const control=chooseSkillEvolution(waiting,row,balance.id,3,context).state;
    assert.deepEqual(evolveSkillPractice(control,row,2,context),{sourceXP:2,extra:[[balance.id,1],['Equilibrium',1]]});
    assert.deepEqual(validateSkillEvolutionEnvelope({skill_evolution:JSON.parse(JSON.stringify(control))}),control);
    const trained={skill_evolution:control,levels:{person:{main_character:{skill_xp:{[balance.id]:11}}}}};
    assert.deepEqual(validateSkillEvolutionEnvelope(trained),control);
    assert.throws(()=>validateSkillEvolutionEnvelope({...trained,skill_evolution:waiting}),/chosen skill form/);
    assert.throws(()=>validateSkillEvolutionEnvelope({skill_evolution:{...control,revision:SKILL_EVOLUTION_REVISION+1}}),/revision/);
    assert.throws(()=>validateSkillEvolutionEnvelope({skill_evolution:{...control,choices:{[row.id]:{status:'chosen',target:'forged',level:3}}}}),/Invalid saved/);
});

test('revision 1 preserves the A2 specialization, original XP and tier',async()=>{
    const envelope=JSON.parse(await readFile(new URL('./fixtures/skill-evolution-a2.json',import.meta.url),'utf8'));
    const old=structuredClone(envelope);
    const migrated=validateSkillEvolutionEnvelope(envelope);
    assert.deepEqual(migrated,{...old.skill_evolution,revision:3});
    assert.deepEqual(envelope,old);
    assert.equal(activeSkillForm(migrated,SKILL_EVOLUTIONS,row.from),undefined);
    assert.deepEqual(evolveSkillPractice(migrated,row,2,context),{sourceXP:3,extra:[[heavy.id,1]]});
});

test('Iron skin evolves its own slot past the tier cap and picks a gated combat function',()=>{
    const iron=SKILL_EVOLUTIONS.find(row=>row.policy==='EV2');
    const qualified={...iron.requirements,xp:120,thresholdXP:100,unarmored:true};
    assert.equal(offerSkillEvolution(emptySkillEvolution(),iron,30,{...qualified,xp:107}),null);
    const {state}=offerSkillEvolution(emptySkillEvolution(),iron,30,qualified);
    assert.equal(activeSkillForm(state,SKILL_EVOLUTIONS,iron.from),undefined);
    assert.deepEqual(evolveSkillPractice(state,iron,9,qualified),{sourceXP:9,extra:[]});
    const [tempered,breathing]=iron.targets;
    for(const target of iron.targets){
        const chosen=chooseSkillEvolution(state,iron,target.id,30,qualified).state;
        assert.equal(activeSkillForm(chosen,SKILL_EVOLUTIONS,iron.from).id,target.id);
        const {trigger,mode}=target.gains.function;
        assert.equal(activeSkillFunction(chosen,SKILL_EVOLUTIONS,iron.from,trigger,qualified).mode,mode);
        assert.equal(activeSkillFunction(chosen,SKILL_EVOLUTIONS,iron.from,trigger,{...qualified,unarmored:false}).mode,mode);
        assert.deepEqual(evolveSkillPractice(chosen,iron,9,qualified),{sourceXP:9,extra:[]});
        assert.throws(()=>readSkillEvolution({...chosen,revision:1},SKILL_EVOLUTIONS),/Invalid saved/);
        const xp={levels:{person:{main_character:{skill_xp:{[iron.from]:120}}}}};
        assert.deepEqual(validateSkillEvolutionEnvelope({...xp,skill_evolution:chosen}),chosen);
        assert.throws(()=>validateSkillEvolutionEnvelope({skill_evolution:chosen}),/original XP/);
    }
    assert.notEqual(tempered.gains.function.trigger,breathing.gains.function.trigger);
});

test('evolved skin settles after armor and shortens only its own body effect',()=>{
    const row=SKILL_EVOLUTIONS.find(row=>row.policy==='EV2'), [tempered,breathing]=row.targets;
    const context={...row.requirements,xp:120,thresholdXP:100};
    const {state}=offerSkillEvolution(emptySkillEvolution(),row,30,context);
    const use=(target,trigger,armored)=>activeSkillFunction(
        chooseSkillEvolution(state,row,target.id,30,context).state,[row],row.from,trigger,{...context,armored});
    const armoredCrit=mitigateCombatDamage([20],8), armoredOrdinary=mitigateCombatDamage([10],8);
    assert.deepEqual(settleSkinCritical(use(tempered,'enemy-critical',true),armoredCrit,armoredOrdinary,true),{damage:7,saved:5});
    assert.deepEqual(settleSkinCritical(use(tempered,'enemy-critical',false),20,10,false),{damage:10,saved:10});
    assert.deepEqual(settleSkinCritical(use(tempered,'enemy-critical',true),0,0,true),{damage:0,saved:0});
    const restore=(armored,damage,missing=3)=>settleSkinStamina(use(breathing,'enemy-hit',armored),{damage,raw:20,armored,missing});
    assert.equal(restore(true,12),0.6);
    assert.equal(restore(true,20),0.75);
    assert.equal(restore(true,0),0);
    assert.equal(restore(false,20),1);
    assert.equal(restore(false,20,0.2),0.2);
    for(const armored of [false,true]){
        assert.equal(settleSkinBodyEffect(use(tempered,'body-effect',armored),'Bleeding',8),6);
        assert.equal(settleSkinBodyEffect(use(tempered,'body-effect',armored),'Dragonfly venom',8),8);
        assert.equal(settleSkinBodyEffect(use(breathing,'body-effect',armored),'Dragonfly venom',8),6);
        assert.equal(settleSkinBodyEffect(use(breathing,'body-effect',armored),'Bleeding',8),8);
    }
});

test('Sleeping offers a strict grade climb and an executed recovery function',()=>{
    const sleeping=SKILL_EVOLUTIONS.find(row=>row.policy==='EV3'), context=sleeping.requirements;
    const offered=offerSkillEvolution(emptySkillEvolution(),sleeping,2,context);
    const chosen=chooseSkillEvolution(offered.state,sleeping,sleeping.targets[0].id,2,context).state;
    assert.equal(activeSkillForm(chosen,SKILL_EVOLUTIONS,'Sleeping').grade,'Uncommon');
    assert.equal(activeSkillFunction(chosen,SKILL_EVOLUTIONS,'Sleeping','sleep-health',context).multiplier,1.25);
    assert.equal(activeSkillFunction(chosen,SKILL_EVOLUTIONS,'Sleeping','sleep-stamina',context),undefined);
    const invalid=structuredClone(sleeping);
    invalid.targets[0].grade='Common';
    assert.throws(()=>validateEvolutionRows([invalid],{[context.world]:{primary:'EV3',mix:[],grades:['Common','Uncommon']}}),/Invalid/);
});

test('the same law runs the held-out Thrust choice and Arcane Fang grade climb',async()=>{
    const cases=JSON.parse(await readFile(new URL('./fixtures/skill-evolution-canon.json',import.meta.url),'utf8'));
    for(const {row,proof,world} of cases){
        validateEvolutionRows([row],{[row.requirements.world]:world});
        const context={...proof.context,world:row.requirements.world};
        assert.equal(offerSkillEvolution(emptySkillEvolution(),row,0,context),null);
        const {state}=offerSkillEvolution(emptySkillEvolution(),row,1,context);
        const result=chooseSkillEvolution(state,row,proof.target,1,context);
        assert.equal(activeSkillForm(result.state,[row],row.from).id,proof.target);
        assert.equal(activeSkillForm(result.state,[row],row.from).grade,proof.grade);
        assert.equal(activeSkillFunction(result.state,[row],row.from,proof.trigger,context).mode,proof.mode);
    }
});

const mergedContext=(row,extra={})=>({...row.requirements,trigger:row.offerOn,
    lineages:Object.fromEntries(row.sources.map(({id,level},i)=>[id,{level,xp:(i+1)*137}])),...extra});

test('fusion and consolidation quote and keep each lineage exactly once',()=>{
    for(const row of SKILL_EVOLUTIONS.filter(row=>['EV4','EV5'].includes(row.policy))){
        const context=mergedContext(row,{healthy:true}), initial=emptySkillEvolution();
        const last=row.sources.at(-1);
        assert.equal(offerSkillEvolution(initial,row,row.threshold,{...context,trigger:'invalid'}),null);
        const short={...context,lineages:{...context.lineages,[last.id]:{level:last.level-1,xp:1}}};
        assert.equal(offerSkillEvolution(initial,row,row.threshold,short),null);
        const {state}=offerSkillEvolution(initial,row,row.threshold,context);
        assert.equal(offerSkillEvolution(state,row,row.threshold,context),null);
        const waiting=structuredClone(state), quote=quoteSkillEvolution(state,row,row.threshold,context);
        assert.deepEqual(waiting,state);
        assert.equal(quote.lineages.length,row.sources.length);
        assert.deepEqual(quote.lineages,Object.entries(context.lineages).map(([id,xp])=>({id,...xp})));
        assert.throws(()=>chooseSkillEvolution(state,row,row.targets[0].id,row.threshold,short));
        const kept=refuseSkillEvolution(state,row).state;
        assert.equal(kept.choices[row.id].status,'refused');
        assert.equal(offerSkillEvolution(kept,row,row.threshold,context),null);
        assert.equal(activeSkillForm(kept,[row],row.from),undefined);
        assert.deepEqual(readSkillEvolution(kept,[row]),kept);

        const picked=chooseSkillEvolution(state,row,row.targets[0].id,row.threshold,context);
        const restored=readSkillEvolution(JSON.parse(JSON.stringify(picked.state)),[row]);
        assert.deepEqual(restored,picked.state);
        assert.deepEqual(picked.event.lineages,quote.lineages);
        assert.throws(()=>readSkillEvolution({...restored,revision:2},[row]),/Invalid saved/);
        for(const {id} of row.sources){
            const view=mergedSkillView(restored,[row],id,part=>context.lineages[part]);
            assert.deepEqual(view.lineages,quote.lineages);
            assert.equal(view.id,row.targets[0].id);
            assert.equal(view.primary,id===row.from);
        }
        const {trigger,amount}=row.targets[0].gains.function;
        assert.equal(settleSkillRecovery(waiting,[row],row.from,trigger,context,10),null);
        assert.equal(settleSkillRecovery(restored,[row],row.from,trigger,context,0),null);
        assert.equal(settleSkillRecovery(restored,[row],row.from,trigger,{...context,world:'other'},10),null);
        assert.equal(settleSkillRecovery(restored,[row],row.from,trigger,context,10).stamina,amount);
        if(row.policy==='EV5')assert.equal(settleSkillRecovery(restored,[row],row.from,trigger,{...context,healthy:false},10).stamina,1);
        assert.equal(settleSkillRecovery(restored,[row],row.from,trigger,context,0.5).stamina,0.5);
    }
});

test('revision 2 keeps the A2b forms and native XP without writing new skills',async()=>{
    const envelope=JSON.parse(await readFile(new URL('./fixtures/skill-evolution-a2b.json',import.meta.url),'utf8'));
    const original=structuredClone(envelope);
    const migrated=validateSkillEvolutionEnvelope(envelope);
    assert.equal(migrated.revision,3);
    assert.deepEqual(migrated.choices,original.skill_evolution.choices);
    assert.equal(activeSkillForm(migrated,SKILL_EVOLUTIONS,'Iron skin').name,'Breathing skin');
    assert.equal(activeSkillForm(migrated,SKILL_EVOLUTIONS,'Sleeping').grade,'Uncommon');
    assert.deepEqual(envelope,original);
});

test('held-out Rampage and the Alchemy Master offer use the same rules',async()=>{
    const cases=JSON.parse(await readFile(new URL('./fixtures/skill-evolution-merge-canon.json',import.meta.url),'utf8'));
    for(const {row} of cases){
        const context=mergedContext(row,{ongoingBattle:true});
        validateEvolutionRows([row],{[context.world]:{primary:row.policy,mix:[]}});
        const {state}=offerSkillEvolution(emptySkillEvolution(),row,row.threshold,context);
        const view=quoteSkillEvolution(state,row,row.threshold,context);
        assert.equal(view.eligible,true);
        assert.equal(view.lineages.length,row.policy==='EV4'?2:4);
        if(row.policy==='EV4'){
            const chosen=chooseSkillEvolution(state,row,row.targets[0].id,row.threshold,context).state;
            assert.equal(activeSkillFunction(chosen,[row],'Fast Stab','battle-progress',context).mode,'escalating-speed-and-lethality');
            assert.equal(activeSkillForm(chosen,[row],'Assassinate'),undefined);
        }else{
            assert.equal(view.targets[0].name,'Alchemy Master');
            assert.equal(refuseSkillEvolution(state,row).state.choices[row.id].status,'refused');
        }
    }
});
