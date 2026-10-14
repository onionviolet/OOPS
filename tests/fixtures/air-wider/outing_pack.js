import {abilityPack} from './ability_pack.js';
const eq=(fact,value)=>({fact,op:'eq',value});
const fact=(key,value)=>({type:'fact',scope:'actor',key,value});
export function outingPack(){
 const d=JSON.parse(JSON.stringify(abilityPack()).replaceAll('airproof','outingproof'));d.world.label='Local reed outing';
 const phase='outingproof.site.phase',injury='outingproof.site.injury';
 d.locations.push({id:'outingproof.reeds',label:'Reed patch',description:'An original public local outing.'});
 const make=(id,from,to,effects=[],extra={})=>({id:'outingproof.'+id,revision:1,label:id,description:'Public local outing proposal.',worldId:d.world.id,location:'outingproof.reeds',group:'structured_local',actorId:'player',audience:['$actor'],duration:0,costs:[],requires:{all:[{any:from.map(v=>eq('actor.'+phase,v))},eq('native.alive',true)]},visibleWhen:{any:from.map(v=>eq('actor.'+phase,v))},effects:[...(to==null?[]:[fact(phase,to)]),...effects],...extra});
 d.simulation.commands.push(
 make('discover',[0,4],null,[{type:'knowledge',key:'outingproof.site.known',stage:'seen',value:'You know the nearby reed patch.'}],{location:'outingproof.room',label:'Ask about the reed patch'}),
 make('prepare',[0,4],1,[],{location:'outingproof.room',label:'Prepare reed outing',duration:3,cancellation:'refund',requires:{all:[{any:[eq('actor.'+phase,0),eq('actor.'+phase,4)]},eq('actor.'+injury,0),eq('native.alive',true)]},costs:[{type:'resource',native:true,key:'money',amount:-2}]}),
 make('enter',[1],2,[{type:'relocate',location:'outingproof.reeds'}],{location:'outingproof.room',label:'Enter reed patch'}),
 make('method',[2],3,[],{label:'Clear reeds with held method',duration:3,cancellation:'refund',requires:{all:[eq('actor.'+phase,2),eq('faculty.outingproof.hand.active',true),eq('native.alive',true)]},costs:[{type:'resource',native:true,key:'money',amount:-1}]}),
 make('ordinary',[2],3,[fact(injury,1),{type:'vital',key:'health',amount:-2}],{label:'Clear reeds with ordinary gear',duration:3,cancellation:'refund',costs:[{type:'resource',native:true,key:'money',amount:-1}]}),
 make('retreat',[2,3],4,[{type:'relocate',location:'outingproof.room'}],{label:'Retreat and return without reward'}),
 make('extract',[3],4,[{type:'item',key:'{"id":"Stale bread"}',amount:1},{type:'relocate',location:'outingproof.room'}],{label:'Extract supplies and return'}),
 make('treat',[0,4],null,[fact(injury,0),{type:'vital',key:'health',amount:2}],{location:'outingproof.room',label:'Treat reed scratches',requires:{all:[{any:[eq('actor.'+phase,0),eq('actor.'+phase,4)]},eq('actor.'+injury,1),eq('native.alive',true)]},costs:[{type:'resource',native:true,key:'money',amount:-1}]})
 );
 d.expeditions=[{id:'outingproof.site',label:'Known reed patch',phaseKey:phase,injuryKey:injury,knowledgeKey:'outingproof.site.known',locationIds:d.locations.map(l=>l.id),prepareId:'outingproof.prepare',enterId:'outingproof.enter',approaches:['outingproof.method','outingproof.ordinary'],retreatId:'outingproof.retreat',extractId:'outingproof.extract',treatmentId:'outingproof.treat'}];
 d.bootstrap.effects.push(fact(phase,0),fact(injury,0));d.starts=[{...d.bootstrap,body:{id:'outingproof.body',ownerId:'player',controllerId:'player',form:'human',mobile:true}}];delete d.bootstrap;return d;
}
