import fs from "node:fs";
import {performance} from "node:perf_hooks";
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from "../src/expansion_engine.js";
import {enrollSimulation} from "../src/simulation.js";
import {expeditionRegistry} from "../src/expedition_content.js";
const definitions=Object.fromEntries(Object.entries(expeditionRegistry.simulation).filter(([,v])=>v instanceof Map).map(([k,v])=>[k,[...v.values()]]));
definitions.onEnroll=expeditionRegistry.simulation.onEnroll;
for(let i=0;i<64;i++) {
    const id=`fixture.actor_${i}`;
    definitions.people.push({id,revision:1,label:`Fixture actor ${i}`,worldId:"base.frontier",location:"Village",inventory:"simulation",resources:{fuel:3}});
    definitions.controllers.push({id:`fixture.controller_${i}`,revision:1,label:"Fixture work plan",actorId:id,interval:1,actions:[{commandId:"fixture.work",priority:1,when:{fact:"resource.fuel",op:"gte",value:1}}]});
}
definitions.commands.push({id:"fixture.work",revision:1,label:"Fixture work",duration:2,costs:[{type:"resource",key:"fuel",amount:-1}],effects:[{type:"resource",key:"output",amount:1}]});
const registry=createContentRegistry({worlds:[...expeditionRegistry.worlds.values()],sources:[...expeditionRegistry.sources.values()],capabilities:[...expeditionRegistry.capabilities.values()],simulation:definitions});
let plan=enrollSimulation(createExpansionState(19),registry,{actorId:"player",external:{money:100},gameplay:{player:{inventory:{},skills:{},reputation:{}}},facts:{location:"Village"}});
const started=performance.now();plan=advanceSimulation(plan.state,registry,480,plan.external,plan.gameplay);const advanceMs=performance.now()-started;
for(let i=0;i<64;i++)if(plan.state.actors[`fixture.actor_${i}`].resources.output !== 3)throw Error("Missing owned output");
const bytes=JSON.stringify(plan.state),loadStart=performance.now();loadExpansionState(JSON.parse(bytes),registry);const loadMs=performance.now()-loadStart;
if(plan.remaining || plan.budgetExhausted)throw Error("Unexpected unspent fixture time");
const result={fixtureActors:64,minutes:480,jobsCompleted:192,advanceMs,loadMs,expansionBytes:Buffer.byteLength(bytes),remaining:plan.remaining,budgetExhausted:plan.budgetExhausted,generatedFixtureOnly:true,
    scope:"Pure shared scheduler and expansion hydration; excludes legacy offline replay and full native UI cost."};
if(process.env.YAIRPG_SCALE_OUTPUT)fs.writeFileSync(process.env.YAIRPG_SCALE_OUTPUT,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
