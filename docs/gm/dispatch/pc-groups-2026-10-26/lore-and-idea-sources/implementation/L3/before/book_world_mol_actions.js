// Cyoria's commands, powers, sources, conditions, encounters, situations and
// controllers are definitions owned by the book.mol world pack (WAC8, WA17);
// this module freezes the installed copies and keeps only the fact reader.
import {MOL_IDS as I,MOL_LOCATIONS as L,MOL_KEYS as K} from './book_world_mol_ids.js';
import {packNative} from './world_pack_registry.js';
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const installed=packNative('book.mol');
const {commands,controllers,powers,conditions,encounters,situations}=installed.definitions;
export const molCommands=freeze(commands),molControllers=freeze(controllers),molPowers=freeze(powers),molConditions=freeze(conditions),molEncounters=freeze(encounters),molSituations=freeze(situations),molSources=freeze(installed.sources);
export function molFacts(state,ctx={}){
 const d=state.motherOfLearning,s=state.simulation||{},p=s.people?.player,n=ctx.molNative||{},b=p?.body,actual=n.body,actorId=ctx.actorId||'player';
 const visit=d?.visits?.find(v=>v.id===d.activeVisitId&&v.status==='active');
 const vitals=id=>ctx.vitals?.[id]||ctx.vitalsByActor?.[id];
 const usable=id=>{const person=s.people?.[id],body=person?.body,v=vitals(id);return person?.inventory==='native'&&person.life==='alive'&&body?.form==='human'&&body.ownerId===id&&body.controllerId===id&&(body.hands??0)>=2&&body.mobile===true&&(v?.health??0)>1;};
 const bound=!!d&&n.bound===true&&n.revision===d.nativeRevision&&n.revision>0;
 const sameBody=b?.id==='native.player.body'&&actual?.id===b.id&&actual.form===b.form&&actual.ownerId===b.ownerId&&actual.controllerId===b.controllerId;
 const here=visit?.endpoint.worldId===I.world&&state.actors?.player?.worldId===I.world&&Object.values(L).includes(p?.location);
 const playerSupported=bound&&sameBody&&ctx.nativeAlive===true&&usable('player')&&here;
 const f={'mol.nativeBound':bound,'mol.playerSupported':playerSupported,'mol.chartSupported':ctx.nativeAlive===true&&p?.life==='alive'&&p.location==='Village'&&state.actors?.player?.worldId==='base.frontier',[`mol.local.${I.world}`]:playerSupported&&state.actors?.[actorId]?.worldId===I.world};
 for(const id of [I.imaya,I.ilsa,I.ibery,I.nora,I.xvim,I.taiven,I.kael,I.zorian,I.opponent]){f[`mol.support.${id}`]=playerSupported&&usable(id)&&s.people[id].body.id===`native.person.${id}.body`&&state.actors?.[id]?.worldId===I.world&&Object.values(L).includes(s.people[id].location);f[`mol.at.${id}`]=s.people?.[id]?.location||'';}
 const accepted=ctx.molAcceptedJob,acceptedDefinition=molCommands.find(c=>c.id===accepted?.commandId);
 const acceptedTool=key=>accepted&&acceptedDefinition&&accepted.actorId==='player'&&accepted.context?.actorId==='player'&&accepted.revision===acceptedDefinition.revision&&accepted.reservationReturns===1&&accepted.cancellation==='refund'&&accepted.due===state.clock&&accepted.completionSupport?.location===acceptedDefinition.location&&JSON.stringify(accepted.costs)===JSON.stringify(acceptedDefinition.costs)&&accepted.effects.some(e=>e.type==='item'&&e.actor==='player'&&e.key===key&&e.amount===1&&e.reservationReturn===true)&&accepted.costs.some(e=>e.type==='item'&&e.actor==='player'&&e.key===key&&e.amount===-1)?1:0;
 const held=(id,key)=>Math.max(0,(ctx.gameplay?.[id]?.inventory?.[key]||0)-Object.values(s.custody||{}).filter(c=>(c.key===key||c.itemKey===key)&&c.holder===id&&c.owner!==id).reduce((a,c)=>a+c.count,0));
 const sourceSupported=(id,sourceId)=>{const source=state.actors?.[id]?.sources?.[sourceId],faculty=s.faculties?.[id]?.[sourceId];return usable(id)&&!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&faculty?.awakened===true&&faculty.active===true&&!faculty.suppressed;};
 const active=id=>{const c=s.conditions?.player?.[id];return !!c&&(c.expiresAt==null||c.expiresAt>state.clock);};
 f['mol.needsTreatment']=active(I.smoke)||active(I.burn);
 f['mol.operatorFacultySupported']=playerSupported&&sourceSupported('player',I.operator)&&s.powers?.player?.[I.operator]?.owned===true;
 f['mol.deviceSupported']=f['mol.operatorFacultySupported']&&(held('player',K.lamp)+acceptedTool(K.lamp))>=1&&!f['mol.needsTreatment'];
 f['mol.noraReserveRoom']=(state.actors?.[I.nora]?.resources?.['book.mol.personalMana']??18)<=12;
 f['mol.noraSourceSupported']=f[`mol.support.${I.nora}`]&&sourceSupported(I.nora,I.noraFormula);
 const received=s.knowledge?.[I.taiven]?.['book.mol.receivedSurvey'];
 f['mol.taivenReceivedSurvey']=state.actors?.player?.completed?.['book.mol.report_to_taiven']===1&&state.actors?.player?.facts?.['book.mol.surveyDelivered']===true&&received?.stage==='understood'&&received.basis?.kind==='instruction'&&received.basis?.attributedTo==='player'&&received.basis?.situationId==='book.mol.visitor_branch';
 f['mol.taivenResponseSupported']=f[`mol.support.${I.taiven}`]&&sourceSupported(I.taiven,I.taivenCombat)&&held(I.taiven,K.rod)>=1&&state.actors?.[I.taiven]?.facts?.['book.mol.coverWilling']===true&&s.people[I.taiven].location===L.sewer;
 f['mol.opponentThreatSupported']=f[`mol.support.${I.opponent}`]&&sourceSupported(I.opponent,I.opponentMethod)&&held(I.opponent,K.hook)>=1&&state.actors?.[I.opponent]?.facts?.['book.mol.guardReady']===true&&!state.actors[I.opponent].facts['book.mol.coverStopped']&&!state.actors[I.opponent].facts['book.mol.agreedStandAside'];
 const worldFacts=state.worlds?.[I.world]?.facts||{},elapsed=d?.instances?.[0]?.clock.elapsed||0,terms=s.knowledge?.player?.['book.mol.retrievalTerms'];
 f['mol.retrievalWindowOpen']=!!terms&&elapsed<((d?.retrievalOpenedAt??elapsed)+90);
 f['mol.hatchReturnSupported']=['avoided','deterred','negotiated'].includes(worldFacts['book.mol.hazard'])&&worldFacts['book.mol.forecast']==='residue_and_movement';
 f['mol.outcomeResolved']=['paid','failed','declined','withdrawn'].includes(worldFacts['book.mol.retrieval'])||worldFacts['book.mol.retrieval']==='late'&&state.actors?.player?.facts?.['book.mol.lateAcknowledged']===true;
 for(const [owner,bag]of Object.entries(n.stock||{}))for(const [key,count]of Object.entries(bag))f[`mol.stock.${owner}.${key}`]=count;
 return f;
}
export const molContext=(state,ctx={})=>({...ctx,facts:{...ctx.facts,...molFacts(state,ctx)}});
