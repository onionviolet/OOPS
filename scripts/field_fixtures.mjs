import {createExpansionState,advanceSimulation,loadExpansionState} from "../src/expansion_engine.js";
import {initializeExpedition,expeditionRegistry} from "../src/expedition_content.js";
import {beginFieldWorkshop} from "../src/field_workshop.js";
import {commitSimulationCommand} from "../src/simulation.js";
import {everydayFacts} from "../src/everyday_life.js";
export const wood=JSON.stringify({id:"Rough wood log"}),kit=JSON.stringify({id:"Prepared survey kit"});
export const vitals={health:30,max_health:30,stamina:30,max_stamina:30};
export function fieldContext(p,location="Village",extra={}) {
    return {actorId:"player",external:p.external,gameplay:p.gameplay,vitals:{player:{...vitals,stamina:30-(p.native?.staminaToFull || 0)}},
        facts:{location,"village.craftsmanMet":true,"village.elderMet":true,"village.shackUnlocked":true,...everydayFacts(p.state,{hour:8})},...extra};
}
export function createFieldFixture() {
    const state=initializeExpedition(createExpansionState(71));
    const p={state,external:{money:100},gameplay:{player:{inventory:{[wood]:20},skills:{},reputation:{Village:0}},oldCraftsman:{inventory:{},skills:{},reputation:{}}}};
    return beginFieldWorkshop(state,expeditionRegistry,fieldContext(p));
}
export const fieldCommand=(p,id,location="Village",extra={})=>commitSimulationCommand(p.state,expeditionRegistry,{id},fieldContext(p,location,extra));
export const fieldAdvance=(p,n)=>advanceSimulation(p.state,expeditionRegistry,n,p.external,p.gameplay,{player:{facts:fieldContext(p).facts,vitals:fieldContext(p).vitals.player}});
export const fieldReload=p=>({...structuredClone(p),state:initializeExpedition(loadExpansionState(JSON.parse(JSON.stringify(p.state)),expeditionRegistry))});
export function joinField(p=createFieldFixture(),route="survey") {
    if(route === "survey")p.state.campaign.facts.anchor=true;
    return fieldAdvance(fieldCommand(p,`field.join_${route}`),route === "survey" ? 2 : 3);
}
export function completeFieldProject(p) {
    p=fieldCommand(p,"field.project_start","Village",{targetId:"oldCraftsman"});p=fieldAdvance(p,7);p=fieldCommand(p,"field.inspect");
    return fieldAdvance(fieldCommand(p,"field.workshop.assembly","Shack"),3);
}
