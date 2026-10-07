// Original finite office-replacement proof. No novel canon, body/identity swap,
// timer, native owner or persistence writer is introduced here.
import {backlogAssert as assert,backlogRecord,backlogActor,backlogInventory,backlogItem,backlogTransfer,backlogLog,assertBacklogBoundary} from './backlog_expansion_core.js';
import {simulationOccupiesActor} from './simulation.js';

const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const copy=v=>structuredClone(v),nat=v=>Number.isSafeInteger(v)&&v>=0;
const obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const key=id=>JSON.stringify({id});
export const REPLACEMENT_IDS=freeze({holder:'backlog.registry.eda',clerk:'backlog.registry.orrin',witness:'backlog.registry.bera',
    office:'backlog.registry.seal_steward',duty:'backlog.registry.two_seals',loan:'backlog.registry.template_loan',
    signature:'backlog.registry.eda_press',apprentice:'backlog.registry.apprentice_press',site:'backlog.registry.counter'});
const I=REPLACEMENT_IDS,WOOD=key('Rough wood log'),TEMPLATE=key('Sealing template'),BLANK=key('Sound seal blank'),SEAL=key('Fitted parcel seal'),KIT=key('Prepared survey kit');
const DUTY='backlog.registry.seals_owed',PURSE='backlog.registry.purse',FUEL='backlog.registry.press_fuel',PERSONAL_DEBT='backlog.registry.personal_debt';
const MARK='backlog.registry.eda_forearm_mark';
export const REPLACEMENT_CONTRACT=freeze({schema:1,revision:1,id:'backlog.registry.office_substitution',operation:'office_substitution',
    provenance:{kind:'original',edition:null,baseline:'Living Eda holds the Village seal-steward office, its two-seal duty, her own property and personal method.'},
    branchCause:'Deliberate mutual temporary appointment of the player.',
    transferred:['institutional office right','accepted office duty'],borrowed:['one actual reusable template with explicit custody'],
    retained:['actual actor identities','bodies and controllers','personal memories','personal learned mastery','original sources and fuel','personal goods','personal debt','relationships and completed quests'],
    recognition:['credential bearer inference','personal memory plus physical/method signature','institutional registry'],
    exceptions:['No face/soul/canonical-role replacement.','A claimed name changes a scoped belief only.','Separate paid learning grants the apprentice method only.','No resurrected rightful holder or automatic transferred affection/rewards.']});
const person=(id,label,resources,body={})=>({id,revision:1,label,worldId:'base.frontier',location:'Village',inventory:'simulation',provision:false,
    resources,body:{id:`${id}.body`,ownerId:id,controllerId:id,form:'human',hands:2,mobile:true,...body}});
export const replacementDefinitions=freeze({people:[
    person(I.holder,'Eda, seal steward',{[DUTY]:2,[PERSONAL_DEBT]:3,[FUEL]:1,[PURSE]:0},{forearmMark:MARK}),
    person(I.clerk,'Orrin, counter clerk',{[PURSE]:4}),person(I.witness,'Bera, Eda’s longtime colleague',{})],
    sites:[{id:I.site,revision:1,label:'Village seal registry counter',capacity:1}],
    powers:[{id:I.signature,revision:1,label:'Eda’s personal plate press',model:'practice'},
        {id:I.apprentice,revision:1,label:'Taught template pressing',model:'practice'}]});
export const replacementSources=freeze([
    {id:I.signature,revision:1,label:'Eda’s practiced plate press',kind:'technique',grants:[]},
    {id:I.apprentice,revision:1,label:'Taught template pressing',kind:'knowledge',grants:[]}]);
const row=(name,label,description,family='replacement')=>({id:`backlog.replacement.${name}`,label,description,family});
export const replacementCommands=freeze([
    row('meet','Hear the seal-steward’s terms','Meet the seal steward, counter clerk and a longtime colleague. Hearing their actual terms changes no identity, office, duty or possessions.'),
    row('honest_entry','Enter as an ordinary visitor','Use your own name. This transfers no office, duty, source, memory, possessions or relationship.'),
    row('public_delivery','Make an ordinary counter delivery · 1 kit','An honest visitor may transfer one actual owned survey kit to Orrin for one funded coin, once. No replacement or special method is needed.'),
    row('ask_eda_press','Ask Eda for her own press · 1 blank + 1 coin','As visitor or deputy, pay for Eda’s one fueled demonstration while her actual template is with her. She consumes her own fuel and your supplied blank, then transfers one real seal. You receive no mastery or source.'),
    row('accept_office','Accept Eda’s temporary office · owe 2 seals','Eda consents and you accept the same office right and its two-seal duty. Eda remains alive with her body, skill, fuel, goods and personal debt. No stock or reward is granted.'),
    row('present_honest','Present the badge as Eda’s deputy','Orrin checks the authentic office credential and records your reported identity. The credential proves office access, not another person’s body or memories.','recognition'),
    row('claim_eda','Use Eda’s name at the counter','Make an attributed false name claim. Orrin’s credential-only test may believe the claim; actual actor, body, mastery and lawful office ownership remain separate.','recognition'),
    row('personal_test','Meet Bera’s personal recognition test','Bera compares her remembered forearm mark and Eda’s actual personal method. Her conclusion belongs to Bera; Orrin receives no automatic correction.','recognition'),
    row('registry_test','Ask for the institutional registry check','The registry names the actual appointed player and the living rightful holder. This yields an observed report, no material, power, global reputation or automatic affection.','recognition'),
    row('correct_clerk','Tell Orrin the registry’s correction','Deliver the actual known registry report to Orrin. Only this informed observer’s identity belief changes; remembered earlier claims remain.','recognition'),
    row('borrow_template','Borrow Eda’s actual template','The appointed credential bearer may take Eda’s one template under a named custody loan. Possession grants no learned method.'),
    row('learn_press','Learn the apprentice press · 1 coin','Pay Eda one actual coin for one funded lesson. Learn a separate modest method; Eda retains her five-mastery personal method and source.'),
    row('press','Fit a seal · 1 sound blank + 1 stamina','Use the actual borrowed template, taught active apprentice source, usable hands and one native stamina. Consume one sound blank and make one native fitted seal; at most two in this proof.'),
    row('deliver_duty','Perform the inherited duty · 2 seals','Transfer two actual fitted seals to Orrin, settle the same office duty once and receive one funded coin. A title or copied claim cannot complete the work.'),
    row('return_template','Return the actual template','Return the exact custody loan to the same living owner. Learned apprentice control stays learned; no new acquisition or reward.'),
    row('return_office','Return the temporary office','Return its same right to living Eda after returning the template. An unperformed two-seal duty returns to Eda; a performed duty stays settled. No history is reset.'),
    row('revisit','Meet the same people later','After duty or office return, hear Orrin’s remembered belief, Bera’s own conclusion and Eda’s retained identity. This meeting pays nothing and creates no replacement actor.','recognition')]);
const cause=s=>`backlog:${s.sequence+1}`;
function record(plan){const b=backlogRecord(plan);assert(!b.replacement,'This original replacement scene is already enrolled.');b.schema=2;
    return b.replacement={schema:1,revision:1,contractId:REPLACEMENT_CONTRACT.id,enrolledAt:plan.state.clock,enrolledSequence:plan.state.sequence+1,
        route:'unselected',officeStatus:'rightful',credential:null,claim:null,recognition:{},registryRead:false,clerkCorrected:false,
        carriers:{entrant:{actorId:'player',bodyId:'native.player.body',controllerId:'player',memoryOwner:'player',nativeInventoryOwner:'person.main_character'},
            rightful:{actorId:I.holder,bodyId:`${I.holder}.body`,controllerId:I.holder,memoryOwner:I.holder,sourceOwner:I.holder,propertyOwner:I.holder,personalDebtOwner:I.holder}},
        publicDelivered:false,edaWorked:false,pressed:0,dutyPerformed:false,lesson:false,borrowed:false,loan:false,revisited:false,history:[]};}
function local(plan,context){assertBacklogBoundary(plan.state,context);assert(context.worldId==='base.frontier'&&plan.state.actors.player.worldId==='base.frontier'&&context.facts?.location==='Village','Meet the registry in the actual Village.');
    const body=plan.state.simulation.people.player.body;
    assert((body?.id==null||body.id==='native.player.body')&&(body?.ownerId==null||body.ownerId==='player')&&(body?.controllerId==null||body.controllerId==='player'),'Return to the same actual native body before this office replacement.');}
function available(plan,id){const {actor,person}=backlogActor(plan,id);assert(person.life==='alive'&&person.location==='Village'&&actor.worldId==='base.frontier'&&
    person.body?.id===`${id}.body`&&person.body.ownerId===id&&person.body.controllerId===id&&!simulationOccupiesActor(plan.state,id),'The same living registry participant must control their own body, be present and be free.');return {actor,person};}
function know(plan,actor,key,value,stage='seen',basis){(plan.state.simulation.knowledge[actor]||={})[key]={stage,value,at:plan.state.clock,cause:cause(plan.state),...(basis?{basis}: {})};}
function observed(plan,key,text){know(plan,'player',`backlog.registry.${key}`,text);backlogLog(plan,text);}
function remember(plan,observer,text){const people=plan.state.simulation.relationships[observer]||={},relation=people.player||={axes:{},memories:[]};
    relation.memories.push({at:plan.state.clock,cause:cause(plan.state),text});relation.memories=relation.memories.slice(-32);}
function receipt(plan,r,id){assert(r.history.length<32,'The finite registry scene has no remaining receipt capacity.');r.history.push({id,at:plan.state.clock,sequence:plan.state.sequence+1,cause:cause(plan.state)});}
function grantSource(plan,id,sourceId){const a=plan.state.actors[id],s=plan.state.simulation;assert(!a.sources[sourceId],'That method source is already held.');
    a.sources[sourceId]={acquiredAt:plan.state.clock,expiresAt:null,receiptId:cause(plan.state),worldId:a.worldId,revision:1,origin:'trained'};
    (s.faculties[id]||={})[sourceId]={awakened:true,active:true,suppressed:false,development:1};}
function ownedMethod(plan,id,sourceId){const a=plan.state.actors[id],f=plan.state.simulation.faculties[id]?.[sourceId],p=plan.state.simulation.powers[id]?.[sourceId];
    return !!a?.sources[sourceId]&&f?.active===true&&f.awakened===true&&!f.suppressed&&p?.owned===true;}
function office(plan,r){assert(r.officeStatus==='appointed'&&r.credential?.active===true&&r.credential.holderId==='player'&&
    plan.state.simulation.claims[I.office]?.owner==='player'&&plan.state.simulation.claims[I.office].status==='held','Accept the actual office and current issued credential first.');}
function loan(plan,r){const c=plan.state.simulation.custody[I.loan];assert(r.loan&&c?.owner===I.holder&&c.holder==='player'&&c.key===TEMPLATE&&c.count===1&&
    (backlogInventory(plan,'player')[TEMPLATE]||0)>=1,'The exact owned template loan must be present.');}
function pay(plan,to,coins){assert(Number.isFinite(plan.external.money)&&plan.external.money>=coins,'The actual native coin payment is missing.');plan.external.money-=coins;plan.state.actors[to].resources[PURSE]+=coins;}
function wage(plan,r,kind){const purse=plan.state.actors[I.clerk].resources;assert(purse[PURSE]>=1&&Number.isFinite(plan.external.money)&&Number.isFinite(plan.external.money+1),'The counter’s funded coin owner is unavailable.');purse[PURSE]--;plan.external.money++;r[kind]=true;}
function belief(plan,r,observer,beliefId,kind,suspicion){const b={beliefId,kind,suspicion,at:plan.state.clock,sequence:plan.state.sequence+1,cause:cause(plan.state)};
    r.recognition[observer]=b;const text=`I presently interpret the bearer as ${beliefId==='player'?'the appointed visitor':'Eda'} by ${kind}.`;
    know(plan,observer,'backlog.registry.identity',text,'interpreted',{kind:'inference',attributedTo:'player'});remember(plan,observer,text);return b;}

export function stageReplacementCommand(plan,command,context){const d=replacementCommands.find(d=>d.id===command.id);assert(d,'Unknown replacement scene command.');local(plan,context);
    const s=plan.state.simulation;
    if(command.id==='backlog.replacement.meet'){
        const r=record(plan);assert(!s.claims[I.office]&&!s.claims[I.duty],'The office or duty already belongs to another committed history.');
        for(const def of replacementDefinitions.people){assert(!plan.state.actors[def.id]&&!s.people[def.id]&&!s.owners[def.id],'Do not replace or revive an existing resolved registry person.');
            plan.state.actors[def.id]={facts:{},resources:copy(def.resources),completed:{},sources:{},techniques:{},worldId:def.worldId};
            s.people[def.id]={life:'alive',inventory:'simulation',location:def.location,bornAt:plan.state.clock,definitionId:def.id,definitionRevision:1,body:copy(def.body)};s.owners[def.id]={};}
        backlogItem(plan,I.holder,TEMPLATE,1);backlogItem(plan,I.holder,KIT,1);
        grantSource(plan,I.holder,I.signature);(s.powers[I.holder]||={})[I.signature]={revision:1,mastery:5,owned:true,fragments:[],executions:0};
        plan.state.actors[I.holder].facts['backlog.registry.willing']=true;
        s.claims[I.office]={owner:I.holder,status:'held',at:plan.state.clock,cause:cause(plan.state)};
        s.claims[I.duty]={owner:I.holder,status:'held',at:plan.state.clock,cause:cause(plan.state)};
        s.sites[I.site]={owner:I.clerk,capacity:1,reservations:{}};
        know(plan,I.witness,'backlog.registry.eda_memory','I remember Eda’s forearm mark and her practiced plate press.','understood',{kind:'recollection',attributedTo:I.witness});
        observed(plan,'terms','Eda offers a temporary office with a two-seal duty. She remains herself, with her template, personal method, fuel and three-coin personal debt. Orrin accepts credential evidence; Bera knows Eda personally. Ordinary visitor work stays open.');receipt(plan,r,command.id);return;
    }
    const r=plan.state.backlog?.replacement;assert(r?.schema===1,'Hear the actual registry’s terms first.');
    for(const id of [I.holder,I.clerk,I.witness])available(plan,id);
    const player=plan.state.actors.player,eda=plan.state.actors[I.holder],right=s.claims[I.office],duty=s.claims[I.duty];
    switch(command.id){
    case 'backlog.replacement.honest_entry':assert(r.route==='unselected','The entry route is already selected.');r.route='visitor';remember(plan,I.clerk,'The visitor entered under their own name and accepted no office.');observed(plan,'entry','You entered as yourself. Eda still holds her office and duty; your ordinary counter delivery is available.');break;
    case 'backlog.replacement.public_delivery':assert(r.route==='visitor'&&!r.publicDelivered,'Enter honestly for this one ordinary paid delivery.');backlogTransfer(plan,'player',I.clerk,KIT,1);wage(plan,r,'publicDelivered');observed(plan,'public_delivery','Orrin received your actual kit and paid one coin. The office, personal powers and Eda’s duty did not move.');break;
    case 'backlog.replacement.ask_eda_press':{
        const method=s.powers[I.holder]?.[I.signature],person=s.people[I.holder];
        assert(r.route!=='unselected'&&!r.edaWorked&&ownedMethod(plan,I.holder,I.signature)&&method.mastery===5&&eda.resources[FUEL]===1&&
            person.body?.hands>=2&&(backlogInventory(plan,I.holder)[TEMPLATE]||0)>=1&&!r.loan,'Eda needs her own learned control, hands, template and one actual fuel unit for this finite paid demonstration.');
        pay(plan,I.holder,1);backlogTransfer(plan,'player',I.holder,BLANK,1);backlogItem(plan,I.holder,BLANK,-1);eda.resources[FUEL]--;method.executions++;
        backlogItem(plan,I.holder,SEAL,1);backlogTransfer(plan,I.holder,'player',SEAL,1);r.edaWorked=true;
        observed(plan,'eda_work','Eda used her own full method, actual template and last fuel to fit your paid blank. She handed over one real seal. Her mastery and source did not transfer to you.');break;}
    case 'backlog.replacement.accept_office':
        assert(['unselected','visitor'].includes(r.route)&&r.officeStatus==='rightful'&&eda.facts['backlog.registry.willing']===true&&right?.owner===I.holder&&right.status==='held'&&duty?.owner===I.holder&&duty.status==='held'&&eda.resources[DUTY]===2&&!player.resources[DUTY],'The rightful living holder must consent with her actual office and unperformed duty.');
        r.route='replacement';r.officeStatus='appointed';right.owner='player';right.cause=cause(plan.state);duty.owner='player';duty.cause=cause(plan.state);
        eda.resources[DUTY]=0;player.resources[DUTY]=2;r.credential={schema:1,id:'backlog.registry.deputy_credential',issuerId:I.holder,holderId:'player',officeId:I.office,active:true,issuedAt:plan.state.clock};
        remember(plan,I.holder,'I willingly appointed the visitor and transferred the same office and its two-seal duty. I remain myself.');
        observed(plan,'appointment','You accepted the office and its actual two-seal duty. Eda remains alive and keeps her body, memories, personal skill, source, fuel, goods and private debt. The issued credential grants scoped counter access only.');break;
    case 'backlog.replacement.present_honest':case 'backlog.replacement.claim_eda':{
        office(plan,r);assert(!r.claim,'The first attributed identity presentation is already recorded.');const alias=command.id.endsWith('claim_eda');
        r.claim={speakerId:'player',claimedActorId:alias?I.holder:'player',kind:alias?'alias':'honest',at:plan.state.clock,cause:cause(plan.state)};
        belief(plan,r,I.clerk,r.claim.claimedActorId,'credential_only',false);
        observed(plan,'clerk_report',alias?'Orrin trusts the office credential and calls you Eda. This is Orrin’s interpretation of your claim; your actual identity and body remain yours.':'Orrin accepts you as the named deputy, based on the office credential. This grants no personal identity or inherited skill.');break;}
    case 'backlog.replacement.personal_test':{
        office(plan,r);assert(r.claim&&!r.recognition[I.witness],'Present your identity at the counter before this one personal comparison.');
        const p=s.people.player,method=s.powers.player?.[I.signature];
        const matches=p.body?.forearmMark===MARK&&ownedMethod(plan,'player',I.signature)&&(method?.mastery||0)>=5;
        belief(plan,r,I.witness,matches?I.holder:'player','personal_memory_and_method',r.claim.claimedActorId===I.holder&&!matches);
        observed(plan,'witness_report',matches?'Bera sees the remembered physical and method signs. She reports a local match, which alone does not rewrite actor identity.':'Bera distinguishes you from Eda by the remembered mark and personal method. She can accept a lawful deputy while rejecting a claim to be her old colleague. Orrin has not heard this report.');break;}
    case 'backlog.replacement.registry_test':office(plan,r);assert(r.claim&&!r.registryRead,'Present your identity before requesting this one registry check.');r.registryRead=true;
        observed(plan,'registry_report','The institutional registry names you as the temporary holder and living Eda as the rightful returning holder. A name claim and inherited duty are separate records.');break;
    case 'backlog.replacement.correct_clerk':office(plan,r);assert(r.registryRead&&!r.clerkCorrected&&s.knowledge.player?.['backlog.registry.registry_report'],'Read the actual registry report before delivering its correction once.');
        belief(plan,r,I.clerk,'player','delivered_registry_report',r.claim?.kind==='alias');r.clerkCorrected=true;
        observed(plan,'correction','Orrin received the registry report and now recognizes the appointed visitor. The earlier claimed name stays in his remembered account; Bera’s evidence and Eda’s identity stay separate.');break;
    case 'backlog.replacement.borrow_template':office(plan,r);assert(r.claim&&!r.borrowed&&!s.custody[I.loan],'Present the credential before this one template loan.');backlogTransfer(plan,I.holder,'player',TEMPLATE,1);
        s.custody[I.loan]={owner:I.holder,holder:'player',key:TEMPLATE,count:1,at:plan.state.clock,cause:cause(plan.state)};r.loan=true;r.borrowed=true;observed(plan,'template','Eda lent her actual template for your appointed work. It grants no memory, skill or owned goods.');break;
    case 'backlog.replacement.learn_press':office(plan,r);assert(!r.lesson&&!player.sources[I.apprentice],'This separate apprentice lesson was already acquired.');pay(plan,I.holder,1);grantSource(plan,'player',I.apprentice);
        (s.powers.player||={})[I.apprentice]={revision:1,mastery:0,owned:true,fragments:[],executions:0};r.lesson=true;
        observed(plan,'lesson','You paid for the apprentice template method. This is your new learning; Eda’s personal five-mastery method, source and fuel remain hers.');break;
    case 'backlog.replacement.press':{
        office(plan,r);loan(plan,r);const v=plan.vitals?.player,body=s.people.player.body;
        assert(r.lesson&&r.pressed<2&&ownedMethod(plan,'player',I.apprentice)&&(body?.hands??2)>=2&&v?.stamina>=1,'Learn the apprentice method, retain the template loan and usable hands, and recover one native stamina. Two seals maximum.');
        backlogItem(plan,'player',BLANK,-1);v.stamina--;
        plan.native={...plan.native,hpToFull:v.max_health-v.health,staminaToFull:v.max_stamina-v.stamina};
        backlogItem(plan,'player',SEAL,1);r.pressed++;s.powers.player[I.apprentice].executions++;
        observed(plan,'press','Your actual template, apprentice method, sound blank and stamina made one fitted seal. The office itself supplied no skill or material.');break;}
    case 'backlog.replacement.deliver_duty':office(plan,r);assert(!r.dutyPerformed&&duty?.owner==='player'&&duty.status==='held'&&player.resources[DUTY]===2,'The accepted actual office duty must remain unpaid.');
        backlogTransfer(plan,'player',I.clerk,SEAL,2);player.resources[DUTY]=0;duty.status='settled';duty.cause=cause(plan.state);wage(plan,r,'dutyPerformed');
        observed(plan,'duty','Orrin received two actual seals. Your inherited office duty settled once and his purse paid one coin. Eda’s separate three-coin personal debt remains hers.');break;
    case 'backlog.replacement.return_template':office(plan,r);loan(plan,r);delete s.custody[I.loan];
        backlogItem(plan,'player',TEMPLATE,-1,{acquisition:false});backlogItem(plan,I.holder,TEMPLATE,1,{acquisition:false});r.loan=false;
        observed(plan,'return_template','The same template returned to living Eda. Its custody ended; your separately learned apprentice method remains yours.');break;
    case 'backlog.replacement.return_office':office(plan,r);assert(!r.loan&&!s.custody[I.loan],'Return the actual borrowed template before returning the office.');
        right.owner=I.holder;right.cause=cause(plan.state);
        if(!r.dutyPerformed){assert(duty.owner==='player'&&duty.status==='held'&&player.resources[DUTY]===2,'The unpaid duty has an incompatible carrier.');
            duty.owner=I.holder;duty.cause=cause(plan.state);player.resources[DUTY]=0;eda.resources[DUTY]=2;}
        r.officeStatus='returned';r.credential.active=false;
        observed(plan,'return_office',r.dutyPerformed?'Eda recovered her same office. The performed duty remains settled under your receipt; no reward or debt reappeared.':'Eda recovered her same office and its unperformed two-seal duty. Your learned method and earlier observers’ memories remain; no person was reset.');break;
    case 'backlog.replacement.revisit':assert(!r.revisited&&(r.dutyPerformed||r.officeStatus==='returned'||r.publicDelivered),'Complete a duty, honest delivery or office return before this remembered meeting.');
        assert(s.relationships[I.clerk]?.player?.memories.length>0||s.relationships[I.holder]?.player?.memories.length>0,'The same participant must retain the actual earlier meeting.');r.revisited=true;
        observed(plan,'revisit',`The same people meet you again. Orrin remembers ${r.recognition[I.clerk]?.beliefId===I.holder?'your Eda claim':r.clerkCorrected?'the delivered registry correction':'the visitor or deputy account'}. Bera ${r.recognition[I.witness]?'retains her own personal comparison':'has received no personal comparison'}. Eda remains alive with her own method and personal debt. No stock or reward comes from revisiting.`);break;
    default:throw Error('Unknown replacement scene command.');
    }
    receipt(plan,r,command.id);
}

/** Beliefs are projected only through actually delivered player reports. */
export function replacementView(state){const r=state.backlog?.replacement,records=[];
    if(r){const known=state.simulation?.knowledge.player||{};
        for(const id of ['terms','entry','public_delivery','eda_work','appointment','clerk_report','witness_report','registry_report','correction','template','lesson','press','duty','return_template','return_office','revisit']){
            const k=known[`backlog.registry.${id}`];if(k)records.push(k.value);}}
    return {title:'The seal-steward’s office',description:'Original office replacement and differing recognition rules. Actual people, duties, sources, belongings and observer accounts stay separate.',records};
}

export function replacementActionVisible(state,actionId){
    if(!actionId.startsWith('backlog.replacement.'))return true;
    return actionId==='backlog.replacement.meet' ? !state.backlog?.replacement : !!state.backlog?.replacement;
}

export function replacementCarrierView(state){const r=state.backlog?.replacement;if(!r)return null;
    return {operation:REPLACEMENT_CONTRACT.operation,carriers:copy(r.carriers),officeHolder:state.simulation.claims[I.office]?.owner,
        officeStatus:r.officeStatus,dutyHolder:state.simulation.claims[I.duty]?.owner,dutyStatus:state.simulation.claims[I.duty]?.status,
        transferred:copy(REPLACEMENT_CONTRACT.transferred),retained:copy(REPLACEMENT_CONTRACT.retained),
        // The observer-safe player surface remains replacementView; these are
        // author/integration carrier references, never an omniscient UI report.
        sourceRules:REPLACEMENT_CONTRACT.id};
}

export function validateReplacementRecord(backlog,state){const r=backlog?.replacement;if(r==null)return;
    assert(backlog.schema===2&&obj(r)&&r.schema===1&&r.revision===1&&r.contractId===REPLACEMENT_CONTRACT.id&&nat(r.enrolledAt)&&r.enrolledAt<=state.clock&&
        nat(r.enrolledSequence)&&r.enrolledSequence>0&&r.enrolledSequence<=state.sequence&&['unselected','visitor','replacement'].includes(r.route)&&
        ['rightful','appointed','returned'].includes(r.officeStatus)&&nat(r.pressed)&&r.pressed<=2,'Unsupported replacement branch or version.');
    for(const k of ['registryRead','clerkCorrected','publicDelivered','edaWorked','dutyPerformed','lesson','borrowed','loan','revisited'])assert(typeof r[k]==='boolean','Invalid replacement progress.');
    const s=state.simulation,eda=state.actors[I.holder],player=state.actors.player;
    for(const id of [I.holder,I.clerk,I.witness])assert(state.actors[id]&&s.people[id]?.definitionId===id&&s.people[id].definitionRevision===1&&s.people[id].inventory==='simulation','Missing same registry person or actual owner.');
    assert(r.carriers?.entrant?.actorId==='player'&&r.carriers.entrant.bodyId==='native.player.body'&&r.carriers.entrant.controllerId==='player'&&
        r.carriers.entrant.memoryOwner==='player'&&r.carriers.entrant.nativeInventoryOwner==='person.main_character'&&
        r.carriers.rightful.actorId===I.holder&&r.carriers.rightful.bodyId===`${I.holder}.body`&&r.carriers.rightful.controllerId===I.holder&&
        ['memoryOwner','sourceOwner','propertyOwner','personalDebtOwner'].every(k=>r.carriers.rightful[k]===I.holder),'Replacement cannot alias the actual identity/body/controller/property carriers.');
    assert(eda.resources[PERSONAL_DEBT]===3&&eda.resources[FUEL]===1-Number(r.edaWorked)&&eda.sources[I.signature]&&s.powers[I.holder]?.[I.signature]?.owned===true&&s.powers[I.holder][I.signature].mastery===5&&s.powers[I.holder][I.signature].executions===Number(r.edaWorked),
        'The original office proof cannot transfer or recreate Eda’s personal debt, source, fuel or mastery.');
    const right=s.claims[I.office],duty=s.claims[I.duty];assert(right?.status==='held'&&right.owner===(r.officeStatus==='appointed'?'player':I.holder),'The same office claim must follow the actual appointment.');
    assert(duty?.status===(r.dutyPerformed?'settled':'held')&&duty.owner===(r.dutyPerformed||r.officeStatus==='appointed'?'player':I.holder)&&
        (player.resources[DUTY]||0)===(r.officeStatus==='appointed'&&!r.dutyPerformed?2:0)&&eda.resources[DUTY]===(r.officeStatus!=='appointed'&&!r.dutyPerformed?2:0),'Office liability must follow its named carrier once.');
    if(r.officeStatus==='rightful')assert(r.credential===null&&r.route!=='replacement'&&!r.loan&&!r.borrowed&&!r.lesson&&!r.dutyPerformed,'Unappointed entry cannot acquire the former holder’s access or means.');
    else assert(r.route==='replacement'&&r.credential?.schema===1&&r.credential.id==='backlog.registry.deputy_credential'&&r.credential.issuerId===I.holder&&r.credential.holderId==='player'&&
        r.credential.officeId===I.office&&r.credential.active===(r.officeStatus==='appointed')&&nat(r.credential.issuedAt)&&r.credential.issuedAt<=state.clock,'Invalid issued office credential.');
    if(r.claim)assert(['honest','alias'].includes(r.claim.kind)&&r.claim.speakerId==='player'&&r.claim.claimedActorId===(r.claim.kind==='alias'?I.holder:'player')&&nat(r.claim.at)&&r.claim.at<=state.clock,'An attributed name claim cannot rewrite actual identity.');
    assert(obj(r.recognition)&&Object.keys(r.recognition).every(id=>[I.clerk,I.witness].includes(id)),'Unknown recognition observer.');
    for(const [id,b] of Object.entries(r.recognition)){assert(r.claim&&[I.holder,'player'].includes(b.beliefId)&&typeof b.suspicion==='boolean'&&
        ['credential_only','personal_memory_and_method','delivered_registry_report'].includes(b.kind)&&nat(b.at)&&b.at<=state.clock&&nat(b.sequence)&&b.sequence>0&&b.sequence<=state.sequence&&
        s.knowledge[id]?.['backlog.registry.identity']?.stage==='interpreted'&&s.relationships[id]?.player?.memories.some(m=>m.cause===b.cause),'Invalid scoped recognition or missing observer knowledge/memory.');
        assert(id===I.witness?b.kind==='personal_memory_and_method':['credential_only','delivered_registry_report'].includes(b.kind),'Different tests need different observers.');}
    assert(!r.clerkCorrected||r.registryRead&&r.recognition[I.clerk]?.kind==='delivered_registry_report'&&r.recognition[I.clerk].beliefId==='player','Correction requires actual informed registry delivery.');
    const c=s.custody[I.loan];
    if(r.loan)assert(r.borrowed&&r.officeStatus==='appointed'&&c?.owner===I.holder&&c.holder==='player'&&c.key===TEMPLATE&&c.count===1&&!s.owners[I.holder][TEMPLATE],'Template custody cannot duplicate Eda’s actual tool.');
    else assert(!c&&s.owners[I.holder][TEMPLATE]===1,'The same returned/unborrowed template must remain with its original owner.');
    assert(!r.lesson||player.sources[I.apprentice]&&s.powers.player?.[I.apprentice]?.owned===true&&s.powers.player[I.apprentice].mastery===0&&s.powers.player[I.apprentice].executions===r.pressed,'Separate apprentice learning must have its own source and actual executions.');
    assert(eda.resources[PURSE]===Number(r.lesson)+Number(r.edaWorked)&&state.actors[I.clerk].resources[PURSE]===4-Number(r.publicDelivered)-Number(r.dutyPerformed)&&
        (s.owners[I.clerk][KIT]||0)>=Number(r.publicDelivered)&&(s.owners[I.clerk][SEAL]||0)>=2*Number(r.dutyPerformed),'Known counter work must be funded and retain transferred stock.');
    assert(Array.isArray(r.history)&&r.history.length>0&&r.history.length<=32,'Invalid finite replacement receipts.');let previous=0;
    for(const h of r.history){assert(replacementCommands.some(d=>d.id===h.id)&&nat(h.at)&&h.at<=state.clock&&nat(h.sequence)&&h.sequence>previous&&h.sequence<=state.sequence,'Invalid replacement history ordering.');previous=h.sequence;}
}
