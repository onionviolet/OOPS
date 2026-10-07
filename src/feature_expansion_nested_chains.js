// Original authored branches in the qualified opening Paradise service footprint.
// Existing situations, people, native inventories, sources, jobs and publisher
// own every mutable value. Importing these immutable definitions enrolls nothing.
export const NESTED_CHAIN_IDS = Object.freeze({roles:'nested.chain.roles',welfare:'nested.chain.welfare',method:'nested.chain.method',
 hub:'nested.paradise_hub',salt:'nested.saltworks',archive:'nested.archive',issuer:'nested.hub.issuer',trainer:'nested.hub.trainer',
 keeper:'nested.saltworks.keeper',foreman:'nested.saltworks.foreman',registrar:'nested.archive.registrar',claimant:'nested.archive.claimant',witness:'nested.archive.witness',
 pulse:'nested.pressure_pulse',office:'nested.chain.roles.provisional_office'});
export const NESTED_CHAIN_ITEMS = Object.freeze({log:JSON.stringify({id:'Rough wood log'}),kit:JSON.stringify({id:'Prepared survey kit'}),rope:JSON.stringify({id:'Survey rope'})});
const I=NESTED_CHAIN_IDS,K=NESTED_CHAIN_ITEMS;
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})}),gte=(fact,value,reason)=>({fact,op:'gte',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules}),any=(...rules)=>({any:rules}),not=rule=>({not:rule});
const phase=(chain,...values)=>any(...values.map(value=>eq(`situation.${I[chain]}.phase`,value)));
const af=(chain,key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:`nested.chain.${chain}.${key}`,value});
const wf=(world,key,value)=>({type:'world',worldId:world,key,value});
const credit=(actor,amount)=>({type:'resource',actor,key:'nested.credit',amount});
const attention=(actor,amount=-1)=>({type:'resource',actor,key:'nested.attention',amount});
const agenda=(actor,amount=-1)=>({type:'resource',actor,key:'nested.agenda',amount});
const stamina=(actor,amount=-1)=>({type:'vital',actor,key:'stamina',amount});
const item=(actor,key,amount,returned=false)=>({type:'item',actor,key,amount,...(returned?{reservationReturn:true}:{})});
const memory=(actor,target,text,amount=1)=>({type:'relationship',actor,target,axis:'respect',amount,text});
const knowledge=(chain,key,value,attributedTo,actor='player',stage='seen',kind='observation')=>({type:'knowledge',actor,key:`nested.chain.${chain}.${key}`,stage,value,
 basis:{kind,attributedTo,situationId:I[chain]}});
const advance=(chain,expected,next)=>({type:'situation',situationId:I[chain],operation:'advance',expected:Array.isArray(expected)?expected:[expected],phase:next});
const learn=actor=>[{type:'source',actor,sourceId:I.pulse,operation:'grant',origin:'trained',awakened:true,active:true},{type:'power',actor,powerId:I.pulse,operation:'learn'}];
const refine=(actor,amount)=>({type:'power',actor,powerId:I.pulse,operation:'refine',amount});
const local=world=>eq(`nested.chain.local.${world}`,true,'Meet the actual local people with the supported native body and clock.');
const a=(chain,key,value=true)=>eq(`actor.nested.chain.${chain}.${key}`,value);
const cmd=(chain,id,label,world,location,d={})=>({id:`${I[chain]}.${id}`,revision:1,label,group:'nested_chains',chainId:I[chain],actorId:'player',worldId:world,location,once:true,costs:[],effects:[],
 ...d,requires:all(eq('nested.nativeBound'),local(world),...(d.requires?[d.requires]:[]))});
const npc=(chain,id,label,actor,world,location,d)=>cmd(chain,id,label,world,location,{...d,actorId:actor,audience:['$actor']});
const job=(requires,coLocated=true)=>({duration:3,cancellation:'refund',completionRequires:requires,completionCoLocated:coLocated,completionFailure:'refund'});
const reception='Archive reception',records='Archive records room',landing='Saltworks landing',enginehouse='Saltworks enginehouse',street='Paradise service street',workroom='Paradise workroom';
const rolesDecisions=['corrected','shared','refused','coerced'];
const welfareDecisions=['cooperated','issuer_first','partial','refused','seized','abstained'];
const methodChoices=['refined','retained','ordinary','appropriated'];
const pulseReady=all(eq(`faculty.${I.pulse}.active`),eq(`power.${I.pulse}.owned`),eq('nested.chain.handsUsable'),gte('vital.health',2));

const rolesCommands=[
 cmd('roles','begin','Hear the disputed catalogue appointment',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],
  visibleWhen:all(eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.archive.claim'),not(eq('nested.chain.roles.started'))),
  requires:all(eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.archive.claim'),not(eq('nested.chain.roles.started'))),
  description:'A provisional office badge identifies its holder. Credit, competence, appointment and archive access still require separate evidence. No local right follows your hub contract.',
  effects:[{type:'situation',situationId:I.roles,operation:'begin'},{type:'claim',key:I.office,actor:I.claimant,operation:'acquire'},
   af('roles','started'),af('roles','disposition','open'),af('roles','reviewRequested',true,I.registrar),
   knowledge('roles','opening','The registrar has provisionally appointed the claimant. The catalogue repair is disputed; the badge proves the provisional appointment, not authorship or unrestricted access.',I.registrar)]}),
 cmd('roles','appearance','Ask what the badge actually authorizes',I.archive,reception,{targetId:I.claimant,coLocated:true,participants:['$target'],visibleWhen:phase('roles','open'),requires:phase('roles','open'),
  effects:[advance('roles','open','recognized'),knowledge('roles','appearance','The claimant shows a real provisional badge for reception duties. It has no records-room jurisdiction and conveys none of the witness’s repair competence.',I.claimant)]}),
 cmd('roles','witness','Hear the records-room witness',I.archive,records,{targetId:I.witness,coLocated:true,participants:['$target'],visibleWhen:phase('roles','recognized','evidence'),requires:phase('roles','recognized','evidence'),
  ...job(all(local(I.archive),eq('nested.chain.witnessAvailable'))),costs:[stamina('player'),attention(I.witness)],
  effects:[af('roles','witnessHeard'),knowledge('roles','witness','The witness identifies their own repairs and the uncorrected attribution. This testimony is attributed evidence; it is not yet a verified institutional verdict.',I.witness)]}),
 cmd('roles','minutes','Compare the dated repair minutes · reusable kit',I.archive,records,{visibleWhen:phase('roles','recognized'),requires:all(phase('roles','recognized'),a('roles','witnessHeard')),
  ...job(all(local(I.archive),eq('nested.chain.handsUsable')),false),costs:[item('player',K.kit,-1),stamina('player')],
  effects:[item('player',K.kit,1,true),advance('roles','recognized','evidence'),af('roles','minutesChecked'),
   wf(I.archive,'nested.archive.evidence','audited'),knowledge('roles','minutes','Dated minutes and the actual repaired folios corroborate the witness’s work. Returned your counted kit. The catalogue result does not itself appoint anybody.',I.witness,'player','interpreted')]}),
 npc('roles','registrar_audit','Registrar funds the limited attribution audit',I.registrar,I.archive,reception,{
  requires:all(phase('roles','open','recognized','evidence'),eq('actor.nested.chain.roles.reviewRequested'),eq('nested.chain.registrarAvailable')),
  ...job(all(local(I.archive),eq('nested.chain.registrarAvailable')),false),costs:[credit(I.registrar,-2),attention(I.registrar),agenda(I.registrar),stamina(I.registrar)],
  effects:[af('roles','auditReady',true,I.registrar),knowledge('roles','private.audit','I spent two actual credits and one bounded agenda/attention to review the signed minutes. A lawful correction can qualify the witness without dismissing the claimant’s ordinary duties.',I.registrar,I.registrar)]}),
 npc('roles','claimant_folio','Claimant keeps their separate funded folio duty',I.claimant,I.archive,reception,{
  requires:all(phase('roles','open','recognized','evidence',...rolesDecisions,'reported','accounted','closed'),eq('nested.chain.claimantAvailable')),...job(local(I.archive),false),
  costs:[credit(I.claimant,-1),item(I.claimant,K.rope,-1),attention(I.claimant),agenda(I.claimant),stamina(I.claimant)],
  effects:[wf(I.archive,'nested.chain.roles.folioSecured',true),af('roles','ordinaryDutyKept',true,I.claimant),
   knowledge('roles','private.folio','I bound the damaged receipt folio with my own rope and operating credit. The attribution dispute did not erase my separate reception work.',I.claimant,I.claimant)]}),
 npc('roles','witness_preserve','Witness preserves their own dated repair evidence',I.witness,I.archive,records,{
  requires:all(phase('roles','open','recognized','evidence',...rolesDecisions,'reported','accounted','closed'),eq('nested.chain.witnessAvailable')),...job(local(I.archive),false),
  costs:[credit(I.witness,-1),item(I.witness,K.kit,-1),attention(I.witness),agenda(I.witness),stamina(I.witness)],
  effects:[item(I.witness,K.kit,1,true),wf(I.archive,'nested.chain.roles.evidenceRetained',true),
   knowledge('roles','private.preservation','I spent my own operating credit, kit time and body/attention to preserve the dated repair evidence. Refusal or a false demand cannot erase this ordinary archive duty.',I.witness,I.witness)]}),
 cmd('roles','lawful','Request a corroborated correction and qualified appointment',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],visibleWhen:phase('roles','evidence'),
  requires:all(phase('roles','evidence'),a('roles','witnessHeard'),eq('nested.chain.roles.auditReady')),
  effects:[advance('roles','evidence','corrected'),af('roles','disposition','corrected'),
   {type:'claim',key:I.office,actor:I.claimant,target:I.witness,operation:'transfer'},credit(I.claimant,-2),credit(I.witness,2),
   af('roles','officeDuty',true,I.witness),wf(I.archive,'nested.archive.claim','audited'),wf(I.archive,'nested.archive.resolved',true),
   memory('player',I.registrar,'Requested a supported correction, qualified appointment and finite restitution.'),
   knowledge('roles','decision','The witness receives the archive’s limited office and its ongoing duty after corroboration. The claimant repays two owned credits and keeps their separate reception work. Your hub role gains no archive title.',I.registrar)]}),
 cmd('roles','partial','Negotiate credited joint work under registrar oversight',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],visibleWhen:phase('roles','evidence'),requires:all(phase('roles','evidence'),eq('nested.chain.roles.auditReady')),
  effects:[advance('roles','evidence','shared'),af('roles','disposition','shared'),{type:'claim',key:I.office,actor:I.claimant,target:I.registrar,operation:'transfer'},
   wf(I.archive,'nested.archive.claim','registered'),wf(I.archive,'nested.archive.resolved',true),af('roles','jointDuty',true,I.claimant),af('roles','jointDuty',true,I.witness),
   knowledge('roles','decision','Authorship is corrected, but the registrar retains the appointment while the two residents perform bounded joint work. This settles the mission’s registration without pretending the disagreement vanished.',I.registrar)]}),
 cmd('roles','refuse','Decline to decide another archive’s appointment',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],visibleWhen:phase('roles','recognized','evidence'),requires:phase('roles','recognized','evidence'),
  effects:[advance('roles',['recognized','evidence'],'refused'),af('roles','disposition','refused'),wf(I.archive,'nested.archive.claim','withdrawn'),wf(I.archive,'nested.archive.resolved',true),
   knowledge('roles','decision','You withdrew from the appointment dispute. The claimant retains a provisional local office, the witness retains their claim, and the registrar will handle ordinary duties. Withdrawal grants no audit-success reward.',I.registrar)]}),
 cmd('roles','hostile','Demand the office by displaying your hub contract',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],visibleWhen:phase('roles','recognized','evidence'),requires:phase('roles','recognized','evidence'),
  costs:[stamina('player',-2)],effects:[advance('roles',['recognized','evidence'],'coerced'),af('roles','disposition','coerced'),af('roles','restitutionDue'),
   wf(I.archive,'nested.archive.evidence','disputed'),wf(I.archive,'nested.archive.claim','disputed'),wf(I.archive,'nested.archive.resolved',true),
   memory('player',I.registrar,'Tried to use a hub contract beyond its jurisdiction.',-2),
   knowledge('roles','decision','The registrar rejects the demand. The provisional office remains local, access is restricted, and the dispute closes for this assignment. No title, technique or stronger relative is generated.',I.registrar)]}),
 cmd('roles','report','Report the actual appointment disposition to the hub',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('roles',...rolesDecisions),
  requires:all(phase('roles',...rolesDecisions),eq('nested.chain.roles.returned')),
  effects:[advance('roles',rolesDecisions,'reported'),af('roles','backingRequested',true,I.issuer),
   knowledge('roles','return','You reported the appointment and local jurisdiction, including withdrawal or coercion when applicable. The hub contract’s payment remains the mission settlement owner’s decision.',I.issuer)]}),
 cmd('roles','abstain_return','Record that you returned without deciding the appointment',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('roles','open','recognized','evidence'),
  requires:all(phase('roles','open','recognized','evidence'),eq('nested.chain.roles.returned')),
  effects:[advance('roles',['open','recognized','evidence'],'refused'),af('roles','disposition','refused'),af('roles','abstained'),
   knowledge('roles','abstention','Your actual return left the appointment to its local owners. No remote office, evidence, resident funds or world outcome changed when you recorded abstention. The old cast and their finite duties remain available on supported reentry.',I.issuer)]}),
 npc('roles','hub_review','Issuer funds a scoped archive-report review',I.issuer,I.hub,street,{requires:all(phase('roles','reported'),eq('actor.nested.chain.roles.backingRequested')),
  ...job(local(I.hub),false),costs:[credit(I.issuer,-1),attention(I.issuer),agenda(I.issuer)],effects:[af('roles','backingReady',true,I.issuer),
   af('roles','backingRequested',false,I.issuer),knowledge('roles','private.backing','One owned credit and one bounded agenda funded a jurisdiction review. The hub cannot appoint an archive officer or normalize the witnesses’ standing.',I.issuer,I.issuer)]}),
 cmd('roles','account','Hear the jurisdiction review and retained later treatment',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('roles','reported'),requires:all(phase('roles','reported'),eq('nested.chain.roles.backingReady')),
  effects:[advance('roles','reported','accounted'),af('roles','hubAccounted'),knowledge('roles','account','The issuer records your actual conduct separately from the archive’s appointment. Later archive entry keeps the same people, office claim, credit transfers, folio and duties.',I.issuer)]}),
 cmd('roles','restitute','Make bounded restitution for the jurisdiction demand · 2 credits',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],visibleWhen:all(phase('roles','accounted'),a('roles','restitutionDue')),
  requires:all(phase('roles','accounted'),a('roles','restitutionDue'),eq('nested.chain.roles.reentry')),
  costs:[credit('player',-2)],effects:[credit(I.claimant,2),af('roles','restitutionDue',false),af('roles','restituted'),
   memory('player',I.registrar,'Accepted the local office boundary and repaid the bounded disruption.'),knowledge('roles','restitution','Two of your actual credits compensate the claimant’s disruption. The registrar permits a supervised later inspection; the old appointment and attribution history are preserved.',I.registrar)]}),
 ...rolesDecisions.map(disposition=>cmd('roles',`revisit_${disposition}`,'Meet the same archive under its retained appointment',I.archive,reception,{targetId:I.registrar,coLocated:true,participants:['$target'],
  visibleWhen:all(phase('roles','accounted'),a('roles','disposition',disposition)),requires:all(phase('roles','accounted'),a('roles','disposition',disposition),eq('nested.chain.roles.reentry'),
   ...(disposition==='coerced'?[a('roles','restituted')]:[])),
  effects:[advance('roles','accounted','closed'),af('roles','laterAccess',disposition==='coerced'?'supervised':disposition==='refused'?'visitor':'qualified_local'),
   knowledge('roles','revisit',({corrected:'The witness still holds the earned office and its duties. The claimant’s separate folio work and restitution remain credited.',shared:'The registrar still oversees the joint office. Corrected authorship and unfinished cooperation remain separate accounts.',refused:'The unresolved attribution remains a local matter; ordinary visitor access and separate resident work continue.',coerced:'After bounded restitution, the registrar allows supervised inspection. The demand and local restriction remain in the account.'})[disposition],I.registrar)]}))
];

const welfareCommands=[
 cmd('welfare','begin','Hear export terms and the keeper’s water duty',I.salt,landing,{targetId:I.keeper,coLocated:true,participants:['$target'],
  visibleWhen:all(eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.saltworks.audit'),not(eq('nested.chain.welfare.started'))),
  requires:all(eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.saltworks.audit'),not(eq('nested.chain.welfare.started'))),
  effects:[{type:'situation',situationId:I.welfare,operation:'begin'},af('welfare','started'),af('welfare','disposition','open'),
   knowledge('welfare','opening','The issuer wants a delivered export report. The keeper must maintain drinking water; the foreman has a separate production duty and finite stock. Success for one account is not success for all three.',I.keeper)]}),
 cmd('welfare','inspect','Inspect the shared outlet with the foreman',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','open'),requires:phase('welfare','open'),
  ...job(all(local(I.salt),eq('nested.chain.foremanAvailable'))),costs:[item('player',K.kit,-1),stamina('player'),attention(I.foreman)],
  effects:[item('player',K.kit,1,true),advance('welfare','open','informed'),af('welfare','outletKnown'),
   knowledge('welfare','outlet','The export outlet and freshwater line share one brace. A full repair needs two logs and one rope; one log supports rationing. Diverting the intact outlet exports promptly but depletes the local reserve.',I.foreman,'player','understood')]}),
 npc('welfare','keeper_ration','Keeper funds their finite ordinary rationing duty',I.keeper,I.salt,landing,{requires:all(phase('welfare','open','informed',...welfareDecisions,'reported','accounted','closed'),eq('nested.chain.keeperAvailable')),
  ...job(local(I.salt),false),costs:[item(I.keeper,K.log,-1),credit(I.keeper,-1),stamina(I.keeper),agenda(I.keeper),attention(I.keeper)],
  effects:[wf(I.salt,'nested.chain.welfare.residentRation',true),knowledge('welfare','private.ration','I spent my owned log, operating credit and body time to ration water independently. This preserves a reserve; it does not deliver the issuer’s export or create new stock.',I.keeper,I.keeper)]}),
 npc('welfare','foreman_notice','Foreman reserves a finite maintenance account',I.foreman,I.salt,enginehouse,{requires:all(phase('welfare','open','informed',...welfareDecisions,'reported','accounted','closed'),eq('nested.chain.foremanAvailable')),
  ...job(local(I.salt),false),costs:[credit(I.foreman,-1),agenda(I.foreman),attention(I.foreman)],effects:[wf(I.salt,'nested.chain.welfare.maintenanceFiled',true),
   knowledge('welfare','private.maintenance','I used one owned credit and agenda to file a maintenance account. Any later diversion must name the water loss; no distant patron owes unlimited repair funds.',I.foreman,I.foreman)]}),
 cmd('welfare','cooperate','Repair both lines and honor the export · 2 logs + rope',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','informed'),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.repaired',false),eq('world.nested.saltworks.export','pending')),
  ...job(all(local(I.salt),eq('nested.chain.foremanAvailable'))),costs:[item('player',K.log,-2),item('player',K.rope,-1),stamina('player',-2),stamina(I.foreman),credit(I.foreman,-2)],
  effects:[advance('welfare','informed','cooperated'),af('welfare','disposition','cooperated'),wf(I.salt,'nested.saltworks.repaired',true),wf(I.salt,'nested.saltworks.water','stable'),wf(I.salt,'nested.saltworks.export','delivered'),
   knowledge('welfare','decision','Two actual logs and one rope became the retained shared brace. The foreman paid two operating credits and used their own stamina. Export is delivered and the local water line is stable.',I.foreman)]}),
 cmd('welfare','early_solution','Honor the export through the already repaired works · 1 owned rope',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],
  visibleWhen:all(phase('welfare','informed'),eq('world.nested.saltworks.repaired',true)),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.repaired',true),eq('world.nested.saltworks.export','pending')),
  costs:[{type:'transfer',from:'player',to:I.foreman,key:K.rope,count:1}],effects:[advance('welfare','informed','cooperated'),af('welfare','disposition','cooperated'),af('welfare','solvedEarly'),wf(I.salt,'nested.saltworks.export','delivered'),
   knowledge('welfare','decision','The actual earlier repair already protects the water line. Your owned rope now supports the foreman’s export authorization. Earlier materials, source work and stock stay spent; the chain did not force the old scarcity problem back into existence.',I.foreman)]}),
 cmd('welfare','issuer_first','Deliver the export through the intact outlet · 1 owned rope',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','informed'),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.repaired',false),eq('world.nested.saltworks.export','pending')),costs:[stamina('player'),{type:'transfer',from:'player',to:I.foreman,key:K.rope,count:1}],
  effects:[advance('welfare','informed','issuer_first'),af('welfare','disposition','issuer_first'),af('welfare','repairDue'),wf(I.salt,'nested.saltworks.export','delivered'),wf(I.salt,'nested.saltworks.water','depleted'),
   memory('player',I.keeper,'Delivered the export at the water line’s expense.',-1),knowledge('welfare','decision','The issuer’s export is delivered. The keeper’s water reserve is depleted and a bounded repair obligation remains. This delivery does not award local friendship or repair materials.',I.foreman)]}),
 cmd('welfare','partial','Support rationing and record a partial export · 1 log',I.salt,enginehouse,{visibleWhen:phase('welfare','informed'),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.repaired',false),eq('world.nested.saltworks.export','pending')),...job(local(I.salt),false),
  costs:[item('player',K.log,-1),stamina('player',-2)],effects:[advance('welfare','informed','partial'),af('welfare','disposition','partial'),af('welfare','repairDue'),
   wf(I.salt,'nested.saltworks.water','rationed'),wf(I.salt,'nested.saltworks.export','partial'),knowledge('welfare','decision','One actual log supports local rationing. The export remains partial and a full repair is still owed. You did useful limited work without claiming full issuer success.',I.foreman)]}),
 cmd('welfare','refuse','Withhold the export and decline the repair commitment',I.salt,enginehouse,{visibleWhen:phase('welfare','informed'),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.export','pending')),
  effects:[advance('welfare','informed','refused'),af('welfare','disposition','refused'),wf(I.salt,'nested.saltworks.export','withheld'),
   knowledge('welfare','decision','You withheld the export and made no repair promise. The keeper’s finite rationing duty and the foreman’s maintenance account continue under their own actual means; any completed spending remains spent. Ordinary departure is available under the mission’s withdrawal terms.',I.foreman)]}),
 cmd('welfare','hostile','Force the outlet and seize the delivered-export claim',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','informed'),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.export','pending'),gte('vital.health',3)),
  costs:[item('player',K.kit,-1),stamina('player',-2),{type:'vital',actor:'player',key:'health',amount:-2}],effects:[item('player',K.kit,1,true),advance('welfare','informed','seized'),af('welfare','disposition','seized'),af('welfare','repairDue'),af('welfare','accessRestricted'),
   wf(I.salt,'nested.saltworks.export','delivered'),wf(I.salt,'nested.saltworks.water','depleted'),wf(I.salt,'nested.saltworks.repaired',false),memory('player',I.foreman,'Forced the outlet and left a water loss.',-2),
   knowledge('welfare','decision','Forcing the actual mechanism injured you and depleted the water reserve. The delivery claim is contested, future enginehouse work requires restitution, and the same residents retain the grievance.',I.foreman)]}),
 ...[['cooperated','delivered',true],['issuer_first','delivered',false],['refused','withheld',null]].map(([disposition,exported,repaired])=>cmd('welfare',`prior_${disposition}`,'Account for the export decision that already happened',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],
  visibleWhen:all(phase('welfare','informed'),eq('world.nested.saltworks.export',exported)),requires:all(phase('welfare','informed'),eq('world.nested.saltworks.export',exported),...(repaired===null?[]:[eq('world.nested.saltworks.repaired',repaired)])),
  effects:[advance('welfare','informed',disposition),af('welfare','disposition',disposition),af('welfare','priorDecisionAcknowledged'),...(disposition==='issuer_first'?[af('welfare','repairDue')]:[]),
   knowledge('welfare','decision',disposition==='cooperated'?'The export and actual repair predate this deeper inquiry. Both remain real; no stock, rope authorization or prior payout is repeated.':disposition==='issuer_first'?
    'The export was already authorized while water support remained incomplete. Its actual rope transfer is retained. You accept a bounded future repair account; no forced replay depletes the line or grants another delivery.':
    'The export was already withheld. That refusal remains real, and this inquiry creates no new remote repair, stock or issuer payment.',I.foreman)]})),
 cmd('welfare','abstain_return','Record your return without a local allocation decision',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','open','informed'),
  requires:all(phase('welfare','open','informed'),eq('nested.chain.welfare.returned')),
  effects:[advance('welfare',['open','informed'],'abstained'),af('welfare','disposition','abstained'),
   knowledge('welfare','abstention','You returned without choosing this local allocation. The actual mission outcome and water/export state remain unchanged. Resident duties and already spent means stay local; this report creates no remote decision or new obligation.',I.issuer)]}),
 cmd('welfare','report','Return a truthful export and welfare report',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('welfare',...welfareDecisions),
  requires:all(phase('welfare',...welfareDecisions),eq('nested.chain.welfare.returned')),
  effects:[advance('welfare',welfareDecisions,'reported'),af('welfare','auditRequested',true,I.issuer),
   wf(I.hub,'nested.hub.returnDispute',true),knowledge('welfare','return','The return report states export delivery, actual water welfare, independent resident spending and any retained repair duty separately. Mission settlement remains once-only in the issuer’s existing contract.',I.issuer)]}),
 npc('welfare','issuer_audit','Issuer funds the return-account dispute',I.issuer,I.hub,street,{requires:all(phase('welfare','reported'),eq('actor.nested.chain.welfare.auditRequested')),
  ...job(local(I.hub),false),costs:[credit(I.issuer,-1),attention(I.issuer),agenda(I.issuer)],effects:[af('welfare','auditReady',true,I.issuer),af('welfare','auditRequested',false,I.issuer),
   knowledge('welfare','private.audit','I spent one owned credit and agenda on the returned contract. Export success cannot certify water welfare or erase a resident obligation. This audit is not another mission payout.',I.issuer,I.issuer)]}),
 cmd('welfare','account','Accept the separate issuer and water accounts',I.hub,street,{targetId:I.issuer,coLocated:true,participants:['$target'],visibleWhen:phase('welfare','reported'),requires:all(phase('welfare','reported'),eq('nested.chain.welfare.auditReady')),
  effects:[advance('welfare','reported','accounted'),af('welfare','accounted'),wf(I.hub,'nested.hub.returnDispute',false),knowledge('welfare','account','The hub retains separate export and welfare accounts. Success payment follows the original contract; a repair duty survives settlement, and refusing further work creates no free supplies or forced feud.',I.issuer)]}),
 cmd('welfare','restitute','Fulfill the retained water duty on reentry · 2 logs + rope',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:all(phase('welfare','accounted','closed'),a('welfare','repairDue')),
  requires:all(phase('welfare','accounted','closed'),a('welfare','repairDue'),eq('nested.chain.welfare.reentry')),
  ...job(all(local(I.salt),eq('nested.chain.foremanAvailable'))),costs:[item('player',K.log,-2),item('player',K.rope,-1),stamina('player',-2),stamina(I.foreman)],
  effects:[af('welfare','repairDue',false),af('welfare','accessRestricted',false),af('welfare','restituted'),wf(I.salt,'nested.saltworks.repaired',true),wf(I.salt,'nested.saltworks.water','stable'),
   memory('player',I.foreman,'Repaid the actual water repair after return.'),knowledge('welfare','restitution','Your owned logs and rope repaired the retained water line. Earlier export, stock spending and contested conduct remain recorded. This repair awards no second export payment.',I.foreman)]}),
 ...welfareDecisions.map(disposition=>cmd('welfare',`revisit_${disposition}`,'Hear the keeper’s changed later water account',I.salt,landing,{targetId:I.keeper,coLocated:true,participants:['$target'],
  visibleWhen:all(phase('welfare','accounted'),a('welfare','disposition',disposition)),requires:all(phase('welfare','accounted'),a('welfare','disposition',disposition),eq('nested.chain.welfare.reentry'),
   ...(disposition==='seized'?[a('welfare','restituted')]:[])),effects:[advance('welfare','accounted','closed'),af('welfare','laterTerms',disposition==='seized'?'supervised':disposition==='refused'?'visitor':'maintenance'),
   knowledge('welfare','revisit',({cooperated:'The shared brace is still repaired; export and water welfare succeeded together. Residents offer finite maintenance work from their remaining stock.',issuer_first:'The earlier export remains delivered. Incomplete water support and your repair duty remain separate; a later repair can resolve the duty without repeating the old wage.',partial:'The partial export and useful rationing remain credited. The old full repair duty is still visible until paid with actual materials.',refused:'The export remains withheld. The keeper retains the water duty and their remaining stock; any completed ordinary rationing remains spent. Visitor contact stays available.',seized:'The outlet seizure remains in the record. Actual restitution allows supervised cooperation with the same residents; it does not erase the old grievance.',abstained:'The keeper still owns the water duty and its remaining means. Your abstention did not decide the export remotely or erase the actual earlier allocation; visitor contact and finite future work remain available.'})[disposition],I.keeper)]}))
];

const methodCommands=[
 cmd('method','begin','Ask the trainer what the fragment leaves out',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],
  visibleWhen:all(any(eq('actor.nested.method','fragment'),eq('actor.nested.method','supported')),not(eq('nested.chain.method.started'))),
  requires:all(any(eq('actor.nested.method','fragment'),eq('actor.nested.method','supported')),not(eq('nested.chain.method.started'))),
  effects:[{type:'situation',situationId:I.method,operation:'begin'},af('method','started'),knowledge('method','opening','The trainer attributes the pressure-pulse fragment to their working method. The notes omit load reversal and supported transmission. Reading them provides no source, practiced body or fuel.',I.trainer)]}),
 cmd('method','prepare','Test an ordinary brace before learning the pulse',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],visibleWhen:phase('method','fragment'),requires:phase('method','fragment'),
  ...job(all(local(I.hub),eq('nested.chain.trainerAvailable'))),costs:[item('player',K.kit,-1),item('player',K.rope,-1),stamina('player'),attention(I.trainer)],
  effects:[item('player',K.kit,1,true),item('player',K.rope,1,true),advance('method','fragment','prepared'),af('method','ordinaryPrepared'),
   knowledge('method','preparation','Your own kit, rope and body tested an ordinary brace. Both counted tools returned. You located the missing reversal term without claiming the trainer’s source or practiced mastery.',I.trainer,'player','understood','instruction')]}),
 cmd('method','acknowledge','Distinguish your earned lesson from the written fragment',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],visibleWhen:phase('method','prepared'),
  requires:all(phase('method','prepared'),pulseReady,any(eq('actor.nested.method','supported'),eq('actor.nested.method','refined'),eq('actor.nested.method','taught'))),
  effects:[advance('method','prepared','supported'),knowledge('method','source','Your separately paid support lesson gave you your own trained active source and zero initial copied mastery. Actual kit, rope, stamina and local support still govern every execution.',I.trainer,'player','understood','instruction')]}),
 cmd('method','use','Use the supported pulse on the real water brace · log + effort',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],powerId:I.pulse,visibleWhen:phase('method','supported'),requires:all(phase('method','supported'),pulseReady),
  ...job(all(local(I.salt),pulseReady,eq('nested.chain.foremanAvailable'))),costs:[item('player',K.log,-1),item('player',K.kit,-1),item('player',K.rope,-1),stamina('player',-2)],
  effects:[item('player',K.kit,1,true),item('player',K.rope,1,true),refine('player',1),{type:'xp',actor:'player',skill:'Equilibrium',amount:12},advance('method','supported','used'),
   wf(I.salt,'nested.chain.method.braceSupported',true),wf(I.salt,'nested.saltworks.repaired',true),wf(I.salt,'nested.saltworks.water','stable'),
   knowledge('method','use','Your acquired source, actual kit/rope and two stamina matched one consumed log into the retained water brace. The operation stabilized water; it did not deliver an export or grant archive office.',I.foreman)]}),
 npc('method','counter','Foreman demonstrates the ordinary reversed-load counter',I.foreman,I.salt,enginehouse,{requires:all(phase('method','used'),eq('nested.chain.foremanAvailable')),
  ...job(local(I.salt),false),costs:[item(I.foreman,K.rope,-1),item(I.foreman,K.kit,-1),stamina(I.foreman),agenda(I.foreman),attention(I.foreman)],
  effects:[item(I.foreman,K.kit,1,true),advance('method','used','countered'),wf(I.salt,'nested.chain.method.counterRetained',true),
   knowledge('method','private.counter','I spent my own rope into a retained reversed-load clamp, kit time and body/attention. This ordinary counter exposes the incomplete fragment without owning or copying the trainer’s pulse.',I.foreman,I.foreman)]}),
 cmd('method','hear_counter','Observe the retained counter and correct your inference',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:phase('method','countered'),requires:phase('method','countered'),
  effects:[af('method','counterHeard'),knowledge('method','counter','The foreman’s own clamp reverses the outlet load. The first fragment cannot follow the changed load safely; its earlier successful use remains real but limited. Their ordinary counter copied no source.',I.foreman,'player','understood')]}),
 cmd('method','refine','Pay for reversal refinement · 2 credits + paired effort',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],powerId:I.pulse,
  visibleWhen:phase('method','countered'),requires:all(phase('method','countered'),a('method','counterHeard'),pulseReady,eq('nested.chain.trainerSupported')),
  ...job(all(local(I.hub),pulseReady,eq('nested.chain.trainerSupported'))),costs:[credit('player',-2),stamina('player',-2),stamina(I.trainer),attention(I.trainer)],
  effects:[credit(I.trainer,2),refine('player',2),advance('method','countered','refined'),af('method','choice','refined'),{type:'fact',scope:'actor',actor:'player',key:'nested.method',value:'refined'},
   knowledge('method','choice','Two actual credits paid the trainer. Both bodies spent effort; your own practiced pulse now tracks reversal. The improvement grants no mature copy of the trainer and leaves their attribution intact.',I.trainer,'player','understood','instruction')]}),
 cmd('method','partial','Keep the old pulse and state its actual limit',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],visibleWhen:phase('method','countered'),requires:all(phase('method','countered'),a('method','counterHeard')),
  effects:[advance('method','countered','retained'),af('method','choice','retained'),knowledge('method','choice','You keep your earned old operation and decline refinement. It still works on inspected stable loads; the reversed-load limit remains disclosed. No teaching or future function was purchased.',I.trainer)]}),
 cmd('method','ordinary','Decline the pulse path and build an ordinary bypass · 2 logs + rope',I.salt,enginehouse,{visibleWhen:phase('method','prepared','supported','countered'),requires:phase('method','prepared','supported','countered'),
  ...job(all(local(I.salt),eq('nested.chain.handsUsable')),false),costs:[item('player',K.log,-2),item('player',K.rope,-1),stamina('player',-2)],
  effects:[advance('method',['prepared','supported','countered'],'ordinary'),af('method','choice','ordinary'),wf(I.salt,'nested.chain.method.ordinaryBypass',true),wf(I.salt,'nested.saltworks.repaired',true),wf(I.salt,'nested.saltworks.water','stable'),
   knowledge('method','choice','Two actual logs, rope and body effort made an ordinary retained bypass. You may refuse special teaching and still provide useful water support. Any source already learned remains yours; no method or mastery is copied.',I.foreman)]}),
 cmd('method','hostile','Publish the incomplete fragment as your exclusive invention',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],visibleWhen:phase('method','countered'),requires:all(phase('method','countered'),a('method','counterHeard')),
  effects:[advance('method','countered','appropriated'),af('method','choice','appropriated'),af('method','attributionDue'),af('method','teachingRestricted'),
   memory('player',I.trainer,'Claimed the attributed incomplete method as exclusive invention.',-2),knowledge('method','choice','The trainer contests the exclusive claim and suspends consent for further teaching. Your already earned source remains yours, but no ownership, counter-proof or inherited mastery follows from the assertion.',I.trainer)]}),
 cmd('method','restitute','Correct the false attribution and compensate one lost lesson · 1 credit',I.hub,workroom,{targetId:I.trainer,coLocated:true,participants:['$target'],visibleWhen:all(phase('method','appropriated'),a('method','attributionDue')),
  requires:all(phase('method','appropriated'),a('method','attributionDue')),costs:[credit('player',-1)],effects:[credit(I.trainer,1),af('method','attributionDue',false),af('method','teachingRestricted',false),af('method','correctedAttribution'),
   knowledge('method','correction','You corrected the exclusive-invention claim and paid one actual credit for the disrupted lesson. The trainer’s provenance remains; consent can return without granting a refinement you never practiced.',I.trainer)]}),
 cmd('method','teach','Teach the foreman a consented reversal lesson · rope + 1 credit + paired effort',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],powerId:I.pulse,
  visibleWhen:phase('method','refined'),requires:all(phase('method','refined'),pulseReady,eq('nested.chain.foremanAvailable'),not(eq('nested.chain.foremanOwnsPulse'))),
  ...job(all(local(I.salt),pulseReady,eq('nested.chain.foremanAvailable'))),costs:[credit('player',-1),{type:'transfer',from:'player',to:I.foreman,key:K.rope,count:1},stamina('player'),stamina(I.foreman),attention(I.foreman)],
  effects:[credit(I.foreman,1),...learn(I.foreman),af('method','learnerConsented',true,I.foreman),{type:'fact',scope:'actor',actor:'player',key:'nested.method',value:'taught'},af('method','taught'),
   knowledge('method','teaching','The foreman agreed to a bounded reversal lesson, used their own body and attention, and acquired their own active source and operation with mastery zero. One credit paid their training time and your actual rope became their own replacement support. Your mastery and future labor were not transferred.',I.foreman,'player','understood','instruction'),
   knowledge('method','private.lesson','I consented to one bounded lesson and earned my own zero-mastery source. My tools, remaining effort and ordinary maintenance duty still belong to me.',I.trainer,I.foreman,'understood','instruction')]}),
 npc('method','foreman_use','Foreman uses their own learned pulse on a finite maintenance support',I.foreman,I.salt,enginehouse,{powerId:I.pulse,
  requires:all(phase('method','refined'),eq('actor.nested.chain.method.learnerConsented'),eq('nested.chain.foremanSupported')),
  ...job(all(local(I.salt),eq('nested.chain.foremanSupported')),false),costs:[credit(I.foreman,-1),item(I.foreman,K.kit,-1),item(I.foreman,K.rope,-1),stamina(I.foreman),attention(I.foreman)],
  effects:[item(I.foreman,K.kit,1,true),item(I.foreman,K.rope,1,true),refine(I.foreman,1),{type:'xp',actor:I.foreman,skill:'Equilibrium',amount:6},wf(I.salt,'nested.chain.method.foremanSupportInstalled',true),
   knowledge('method','private.use','My own taught source, kit, replacement rope and body performed one finite support cycle. I paid its operating credit and attention. This earned my own practice and a retained maintenance support, not the player’s mastery or a cancelled water debt.',I.foreman,I.foreman)]}),
 cmd('method','hear_use','Observe the foreman’s own taught operation',I.salt,enginehouse,{targetId:I.foreman,coLocated:true,participants:['$target'],visibleWhen:all(phase('method','refined'),eq('nested.chain.method.foremanSupportInstalled')),
  requires:all(phase('method','refined'),eq('nested.chain.method.foremanSupportInstalled')),effects:[knowledge('method','learner_use','The foreman shows the maintenance support made with their own acquired source, replacement rope, kit and effort. Their zero-start mastery earned one practice step and native Equilibrium XP; your mastery remained yours. Any old water duty remains separate.',I.foreman)]}),
 ...methodChoices.map(choice=>cmd('method',`later_${choice}`,choice==='refined'?'Protect the later archive evidence with reversal control':'Resolve the later archive work under your retained method limits',I.archive,records,{
  visibleWhen:all(phase('method',choice),eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.archive.followup')),
  requires:all(phase('method',choice),eq('nested.mission.arrived'),eq('nested.mission.id','nested.mission.archive.followup'),
   ...(choice==='refined'?[pulseReady,gte(`power.${I.pulse}.mastery`,3)]:choice==='appropriated'?[a('method','correctedAttribution')]:[])),
  ...(choice==='refined'?{powerId:I.pulse}:{}),...job(all(local(I.archive),eq('nested.chain.handsUsable')),false),
  costs:[item('player',K.kit,-1),stamina('player',choice==='refined'?-1:-2),...(choice==='refined'?[item('player',K.rope,-1)]:[item('player',K.log,-1)])],
  effects:[item('player',K.kit,1,true),...(choice==='refined'?[item('player',K.rope,1,true)]:[]),advance('method',choice,'closed'),wf(I.archive,'nested.chain.method.laterEvidenceProtected',true),af('method','laterFunction',choice==='refined'?'reversal_support':'ordinary_support'),
   knowledge('method','later',choice==='refined'?'Your practiced reversal supported the archive’s tilted evidence fixture with one stamina and a reusable kit, preserving the actual later evidence without consuming timber. No archive title or duplicate mission reward was granted.':
    'An ordinary timber support preserved the later archive evidence at the cost of one actual log and two stamina. Your earlier refusal, limited pulse or corrected attribution remains recorded; special refinement was not required.',I.witness)]}))
];

// The native-world module owns nested.pressure_pulse and its source definition.
// This empty immutable export deliberately creates no parallel method identity.
export const nestedChainSources=freeze([]);
export const nestedChainItemDefinitions=freeze([]);
export const nestedChainDefinitions=freeze({
 situations:[
  {id:I.roles,revision:1,label:'Attribution, office and institutional treatment',context:{worldId:I.archive,instanceId:'nested.archive.main',continuityId:'nested.original.branch',eraId:'nested.service_district.present',regionId:'nested.archive.building'},
   privateTruth:{authorship:I.witness,provisionalOffice:I.claimant,authority:I.registrar,disposition:'finite_local_audit'},participants:['player',I.registrar,I.claimant,I.witness],initialPhase:'open',
   phases:['open','recognized','evidence',...rolesDecisions,'reported','accounted','closed']},
  {id:I.welfare,revision:1,label:'Export, local water and returned obligations',context:{worldId:I.salt,instanceId:'nested.saltworks.main',continuityId:'nested.original.branch',eraId:'nested.service_district.present',regionId:'nested.saltworks.coast'},
   privateTruth:{localDuty:I.keeper,productionDuty:I.foreman,issuerDuty:'export_account',scarcity:'actual_wood_rope_effort'},participants:['player',I.keeper,I.foreman],initialPhase:'open',
   phases:['open','informed',...welfareDecisions,'reported','accounted','closed']},
  {id:I.method,revision:1,label:'Attributed fragment, actual use and earned transmission',context:{worldId:I.hub,instanceId:'nested.paradise.main',continuityId:'nested.original.branch',eraId:'nested.service_district.present',regionId:'nested.hub.service'},
   privateTruth:{teacher:I.trainer,source:I.pulse,missingTerm:'reversed_load',ordinaryAlternative:'owned_timber_support'},participants:['player',I.trainer],initialPhase:'fragment',
   phases:['fragment','prepared','supported','used','countered',...methodChoices,'closed']}
 ],
 commands:[...rolesCommands,...welfareCommands,...methodCommands],
 controllers:[
  {id:'nested.chain.roles.registrar',revision:1,label:'Finite registrar attribution review',actorId:I.registrar,interval:1,actions:[{commandId:`${I.roles}.registrar_audit`,priority:1}]},
  {id:'nested.chain.roles.claimant',revision:1,label:'Independent reception folio duty',actorId:I.claimant,interval:1,actions:[{commandId:`${I.roles}.claimant_folio`,priority:1}]},
  {id:'nested.chain.roles.witness',revision:1,label:'Independent dated-evidence preservation',actorId:I.witness,interval:1,actions:[{commandId:`${I.roles}.witness_preserve`,priority:1}]},
  {id:'nested.chain.welfare.keeper',revision:1,label:'Independent finite water rationing',actorId:I.keeper,interval:1,actions:[{commandId:`${I.welfare}.keeper_ration`,priority:1}]},
  {id:'nested.chain.local.foreman',revision:1,label:'Finite foreman maintenance and counter',actorId:I.foreman,interval:1,actions:[{commandId:`${I.method}.foreman_use`,priority:3},{commandId:`${I.method}.counter`,priority:2},{commandId:`${I.welfare}.foreman_notice`,priority:1}]},
  {id:'nested.chain.hub.issuer',revision:1,label:'Scoped finite returned-account reviews',actorId:I.issuer,interval:1,actions:[{commandId:`${I.welfare}.issuer_audit`,priority:2},{commandId:`${I.roles}.hub_review`,priority:1}]}
 ]
});

// Eligibility projection only. Player-facing presentation reads observed records.
export function nestedChainFacts(state,context={}) {
 const s=state.simulation,player=state.actors?.player,a=state.actors?.[context.actorId||'player'],facts={};
 const present=world=>!!state.nestedCampaign&&player?.worldId===world&&a?.worldId===world;
 for(const world of [I.hub,I.salt,I.archive])facts[`nested.chain.local.${world}`]=present(world);
 for(const chain of ['roles','welfare','method'])facts[`nested.chain.${chain}.started`]=!!s?.situations?.[I[chain]];
 const campaign=state.nestedCampaign,mission=campaign?.mission,history=campaign?.history||[];
 const returned=id=>[mission,...history].some(m=>m?.id===id&&['returned','settled'].includes(m.stage)&&m.returnedAt!==null);
 facts['nested.chain.roles.returned']=returned('nested.mission.archive.claim');
 facts['nested.chain.welfare.returned']=returned('nested.mission.saltworks.audit');
 facts['nested.chain.roles.reentry']=present(I.archive)&&facts['nested.chain.roles.returned'];
 facts['nested.chain.welfare.reentry']=present(I.salt)&&facts['nested.chain.welfare.returned'];
 const usable=id=>s?.people?.[id]?.life==='alive'&&(s.people[id].body?.hands??2)>=2&&s.people[id].body?.mobile!==false&&(context.vitals?.[id]?.health??s.people[id].vitals?.health??0)>1;
 for(const [name,id] of [['trainer',I.trainer],['foreman',I.foreman],['keeper',I.keeper],['registrar',I.registrar],['claimant',I.claimant],['witness',I.witness]])facts[`nested.chain.${name}Available`]=usable(id);
 facts['nested.chain.handsUsable']=usable(context.actorId||'player');
 const supported=id=>{const source=state.actors?.[id]?.sources?.[I.pulse],f=s?.faculties?.[id]?.[I.pulse];return usable(id)&&!!source&&(source.expiresAt==null||source.expiresAt>state.clock)&&!!f?.active&&!!f.awakened&&!f.suppressed&&!!s?.powers?.[id]?.[I.pulse]?.owned;};
 facts['nested.chain.trainerSupported']=supported(I.trainer);
 facts['nested.chain.foremanSupported']=supported(I.foreman);
 facts['nested.chain.foremanOwnsPulse']=!!s?.powers?.[I.foreman]?.[I.pulse]?.owned;
 facts['nested.chain.method.foremanSupportInstalled']=state.worlds?.[I.salt]?.facts?.['nested.chain.method.foremanSupportInstalled']===true;
 facts['nested.chain.roles.auditReady']=state.actors?.[I.registrar]?.facts?.['nested.chain.roles.auditReady']===true;
 facts['nested.chain.roles.backingReady']=state.actors?.[I.issuer]?.facts?.['nested.chain.roles.backingReady']===true;
 facts['nested.chain.welfare.auditReady']=state.actors?.[I.issuer]?.facts?.['nested.chain.welfare.auditReady']===true;
 return facts;
}

export const nestedChainCoverage=freeze([
 {id:I.roles,phases:nestedChainDefinitions.situations[0].phases,branches:rolesDecisions,actors:[I.registrar,I.claimant,I.witness,I.issuer],closure:'same_archive_followup',nativeOutputs:['finite claimant-to-witness restitution','owned rope into receipt folio','reusable player kit','actual native stamina'],jurisdiction:'archive office only'},
 {id:I.welfare,phases:nestedChainDefinitions.situations[1].phases,branches:welfareDecisions,actors:[I.keeper,I.foreman,I.issuer],closure:'same_saltworks_followup',nativeOutputs:['owned wood/rope into retained brace','actual resident operating credits/body','player injury on forcing','later repair with no repeated export award'],jurisdiction:'export settlement and water duty remain separate'},
 {id:I.method,phases:nestedChainDefinitions.situations[2].phases,branches:methodChoices,actors:[I.trainer,I.foreman,I.witness],closure:'archive_followup_evidence',nativeOutputs:['native Equilibrium XP','actual trained source and zero-copy transmission','owned clamp rope','paid refinement','later timber saving or ordinary timber support'],jurisdiction:'learned local operation without title or copied body'}
]);
