// Church team roles and sealed-item clearance for Tingen (Q4, institutions pass F1, F4, F7, EF6). The ladder (clerk by contract,
// formal member, captain, senior deacon, archbishop) is source-seen [17, 168]; the grade rules are source-stated by Dunn [19 p51]:
// grade 2 needs a bishop or team-captain clearance and a central cathedral keeps three to five; grade 3 needs a group of three or more
// to request it and formal-member clearance. The local vault's one grade-3 item and its handling text are an authored original (WPR5);
// no higher-grade item is held here. Roles are read from facts the owners already emit, never saved: a probationer who has drunk a
// dose is a formal member (authored: the source's formal members are the potion-holders of the team).
import {defineClearance,clearanceFor} from './clearance.js';
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_KEYS as K} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,attention,transfer,know,cmd} from './book_world_lotm_kit.js';
import {NIGHTHAWKS,meritRes} from './book_world_lotm_merit.js';
export const LOTM_CLEARANCE=defineClearance({id:'lotm.church_team',roles:['civil_staff','probationer','formal_member','captain','senior_deacon','bishop','archbishop'],grades:{
 3:{needs:{atLeast:'formal_member',group:{min:3,atLeast:'formal_member'}},line:'A grade 3 sealed item is issued to a group of three or more with formal-member clearance.',vague:'The vault will not hand an item to one clerk.'},
 2:{needs:{anyOf:['captain','bishop']},line:'A grade 2 sealed item needs a bishop\'s or a team captain\'s clearance; the central cathedral keeps three to five.',vague:'A heavier seal needs someone senior to sign.'}}});
// Who stands where: Hale is the team's captain stand-in (authored), the member is an original formal member. Roles of present people are data, not entities' knowledge.
export const LOTM_ROLE_OF={[I.supervisor]:'captain',[I.member]:'formal_member',[I.seniorDeacon]:'senior_deacon',[I.stormDeacon]:'senior_deacon',[I.evernightDeacon]:'senior_deacon'};
// An absent role field keeps the authored initial appointment; a recorded reassignment wins.
export const lotmRoleOf=(state,id)=>state.actors?.[id]?.facts?.['book.lotm.role']??LOTM_ROLE_OF[id];
export function playerRole(profileKey,ingested){return profileKey==='civil'?'civil_staff':ingested?'formal_member':'probationer';}
export const sealedItem={id:'Tingen sealed grade-3 item',description:'A grade 3 sealed item from the Tingen vault: a small tarnished lamp that must not be lit. Handling it needs the group and clearance the church sets; it is returned the same day.'};
export const clearanceCommands=[
 cmd('request_sealed_3','Request the vault\'s grade 3 sealed item (needs a group of three with formal-member clearance)',L.workroom,{targetId:I.supervisor,requires:all(eq('lotm.clearance.3'),no('sealed.held')),
  visibleWhen:all(eq('lotm.ready'),no('sealed.held')),costs:[transfer(I.supervisor,'player',K.sealed3)],effects:[af('sealed.held'),know('sealed.handled','Hale and the member stood with you while the vault released the grade 3 item. The group and your clearance are what let it leave the vault; nobody can take it out alone.','player','player','observation','understood')]}),
 cmd('return_sealed_3','Return the sealed item to the vault',L.workroom,{targetId:I.supervisor,once:false,requires:has('sealed.held'),visibleWhen:all(eq('lotm.ready'),has('sealed.held')),costs:[transfer('player',I.supervisor,K.sealed3)],effects:[af('sealed.held',false),know('sealed.returned','You returned the sealed item and Hale logged it back into the vault. Custody is the vault\'s again.','player','player','observation','understood')]})];
// G3 handling (M4 A3, WPR5): this local protocol and its tradeoff are authored,
// not a franchise claim. Instruction is discovered through Hale; the item stays unlit.
const custody=all(eq('lotm.clearance.3'),has('sealed.held'),gte('lotm.holds.sealed3',1));
const taught=eq('lotm.sealed.protocolKnown');
const workSupport=all(custody,taught,eq('lotm.home.evernight'));
const supportedWork=all(workSupport,gte('vital.stamina',3));
const watch=NIGHTHAWKS.missions.find(m=>m.id==='cold_room_watch');
clearanceCommands.push(
 cmd('learn_sealed_3_protocol','Ask Hale to teach the G3 handling protocol · 5 min · reserves 1 attention, returned on completion or Stop',L.workroom,{
  targetId:I.supervisor,once:false,visibleWhen:all(has('sealed.held'),eq('lotm.sealed.protocolKnown',false)),requires:all(custody,eq('lotm.sealed.protocolKnown',false)),
  duration:5,costs:[attention()],cancellation:'refund',completionRequires:custody,completionCoLocated:true,completionFailure:'refund',
  effects:[attention(1),know('sealed.protocol','Hale taught you to keep the lamp unlit and covered, hold its cold handle while the cleared group observes, and let its weight draw your attention over the cold-room register. Under this supervised protocol the watch takes fifteen minutes instead of an hour, but handling it reserves 3 stamina at the start. Completed work keeps that cost; normal rest can recover the fatigue. The group and custody must remain in place. Stop before completion returns the reserved attention and stamina without pay.',I.supervisor,'player','instruction','understood')]}),
 cmd('work_sealed_3_protocol',`Use the taught G3 protocol for Hale's cold-room watch · 15 min · ${watch.pay} merit · reserves 3 stamina (spent on success, refunded on Stop) and 1 attention (returned on completion or Stop)`,L.workroom,{
  targetId:I.supervisor,once:false,visibleWhen:all(has('sealed.held'),taught),requires:supportedWork,
  duration:15,costs:[attention(),{type:'vital',key:'stamina',amount:-3}],cancellation:'refund',completionRequires:workSupport,completionCoLocated:true,completionFailure:'refund',
  effects:[attention(1),{type:'resource',actor:'player',key:meritRes.earned,amount:watch.pay},
   know('sealed.watch','The unlit, covered lamp drew your attention through the cold-room register while Hale and the cleared group watched. Hale logged the shortened watch and its merit. The handling spent stamina when you took up the lamp; returning it does not itself restore that effort. Ordinary recovery still applies.','player','player','observation','understood')]}));
supportedWork.reason='Need the taught protocol, current G3 custody and cleared group, and 3 stamina.';
// Facts: the player's role and the clearance verdict for each grade the vault can reach from here.
export function clearanceFacts(state,f,{profile,ingested,here,peopleAt}){
 const role=playerRole(profile,ingested),present=peopleAt.map(id=>lotmRoleOf(state,id)).filter(Boolean);
 for(const r of LOTM_CLEARANCE.roles)f[`lotm.role.${r}`]=role===r;
 for(const g of Object.keys(LOTM_CLEARANCE.grades))f[`lotm.clearance.${g}`]=here&&clearanceFor(LOTM_CLEARANCE,g,{role,present}).ok;
 f['lotm.sealed.protocolKnown']=state.simulation?.knowledge?.player?.['book.lotm.sealed.protocol']?.stage==='understood';
 f['lotm.roleName']=role;f['lotm.presentRoles']=present.join(',');
 return {role,present};
}
export const clearanceView=(role,present,known=true)=>Object.keys(LOTM_CLEARANCE.grades).sort().map(g=>({grade:Number(g),...clearanceFor(LOTM_CLEARANCE,g,{role,present,known})}));
