import {SWK} from './systems_workshop_content.js';
import {runIrrigationModel} from './systems_irrigation_model.js';
const SW='systems_workshop',P=SW+'.provider',N=SW+'.apprentice';
const check=(ok,message)=>{if(!ok)throw Error(message);};
export function validateSystemsWorkshop(state){
 const a=state.actors?.player,f=a?.facts||{};
 if(!f[SW+'.joined'])return;
 check(f[SW+'.version']===1&&state.simulation&&state.actors[P]&&state.actors[N],'Unsupported work-ledger local edition or missing participants.');
 for(const id of [P,N])check(state.simulation.people[id]?.definitionId===id&&state.simulation.people[id].inventory==='simulation'&&state.actors[id].worldId==='base.frontier','Changed local ledger actor binding.');
 const completed=id=>(a.completed[SW+'.'+id]||0)>0;
 for(const [fact,id] of [['accepted','accept'],['objective','commission_craft'],['claimed','claim'],['learned','learn'],['leased','lease'],['upgraded','upgrade'],['lensMade','lens'],['modelApplied',null]])if(f[SW+'.'+fact])check(id?completed(id):completed('apply_model_recommended')||completed('apply_model_trial'),'Local ledger evidence has no actual completed cause.');
 check(!f[SW+'.objective']||f[SW+'.accepted'],'A commission result requires frozen accepted terms.');
 check(!f[SW+'.claimed']||f[SW+'.objective']&&state.simulation.claims[SW+'.first_reward']?.status==='settled','Grant points require the settled earned claim.');
 check(!f[SW+'.claimed']||state.simulation.titles.player?.[SW+'.commissioner']?.issuer===P,'Commission recognition requires its actual provider.');
 check(!f[SW+'.learned']||a.sources[SW+'.seam_method'],'Permanent learned method lost its declared carrier.');
 check(f[SW+'.connected']||!a.sources[SW+'.assist'],'Disconnected provider cannot supply leased assistance.');
 const escrow=a.resources[SW+'.escrow']||0;
 check(escrow===(f[SW+'.round']==='open'?4:0),'The sealed draw must bind exactly both funded stakes.');
 if(f[SW+'.round']==='open')check(['win','loss'].includes(f[SW+'.draw']),'Missing committed sealed draw.');
 const points=a.resources[SW+'.points']||0;check(Number.isSafeInteger(points)&&points>=0&&points<=10 && points===(f[SW+'.claimed']?10:0)-(f[SW+'.learned']?3:0)-(f[SW+'.leased']?2:0)-(f[SW+'.upgraded']?5:0),'Invalid authority-funded local points.');
 if(f[SW+'.modeled']){check(['straight','branched'].includes(f[SW+'.modelLayout'])&&[1,2,3].includes(f[SW+'.modelInlet'])&&['straight','branched'].includes(f[SW+'.modelBest']),'Unsupported represented experiment.');
 const run=runIrrigationModel({layout:f[SW+'.modelLayout'],inlet:f[SW+'.modelInlet']});
 check(f[SW+'.modelHarvest']===run.output.harvest&&f[SW+'.modelBest']===run.knowledge.recommendedLayout&&(a.completed[SW+'.model_'+f[SW+'.modelLayout']+'_'+f[SW+'.modelInlet']]||0)>0,'Represented knowledge lacks its exact experiment cause.');
 }
 for(const kind of ['ration','parcel']){
  const id=SW+'.ordinary_'+kind,receipt=state.simulation.knowledge.player[id],count=a.completed[id]||0,due=f[SW+'.'+kind+'Due'];
  check(!count||receipt&&due===receipt.at+4,'Timed comparison expiry lacks its actual completion receipt.');
  check(count||due==null,'Timed comparison has no actual manufacture.');
  if(count&&state.clock>=due)check(f[SW+'.'+kind+'Spoiled']===true,'Overdue comparison needs its actual deterioration.');
  if(f[SW+'.'+kind+'Spoiled'])check(count&&state.clock>=due,'Premature comparison deterioration.');
 }

}

export function validateSystemsWorkshopEnvelope(save){
 const state=save.expansion,f=state?.actors?.player?.facts;if(!f?.[SW+'.joined'])return;
 const inventories=[];for(const category of Object.values(save.inventories||{}))inventories.push(...Object.values(category));inventories.push(...Object.values(state.simulation.owners||{}));
 for(const kind of ['ration','parcel'])if(f[SW+'.'+kind+'Spoiled'])for(const inventory of inventories){const key=kind==='ration'?SWK.ordinaryFood:SWK.ordinaryParcel;const row=inventory[key];check(!(typeof row==='number'?row:row?.count),'Expired comparison goods remain in saved custody.');}
}
