// Original, optional care inside the existing supplied-MTL qualified branch.
// Costs, strains, services, work and durations are proposals, not source canon.
// Registration supplies no person, item, clock, source or reward.
import {PARADISE_IDS as P, PARADISE_LOCATIONS as L, PARADISE_KEYS as K} from './book_world_paradise_ids.js';

export const BOOK_CARE_IDS = Object.freeze({
    prefix:'book.care.', group:'book_care', npcGroup:'book_care_npc',
    braced:'book.care.braced', strain:'book.care.load_strain', restored:'book.care.worker_restored',
    hubBegin:'book.care.hub.begin', goaBegin:'book.care.goa.begin',
});
const I=BOOK_CARE_IDS;
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});
const all=(...rules)=>({all:rules}), not=rule=>({not:rule});
const af=(key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:I.prefix+key,value});
const item=(actor,key,amount,returned=false)=>({type:'item',actor,key,amount,...(returned?{reservationReturn:true}:{})});
const vital=(actor,key,amount)=>({type:'vital',actor,key,amount});
const attention=(actor,amount=-1)=>({type:'resource',actor,key:'book.paradise.attention',amount});
const coin=(actor,amount,hub)=>({type:'resource',actor,key:hub?'book.paradise.coin':'book.paradise.belli',amount});
const condition=(actor,id,operation,duration)=>({type:'condition',actor,id,operation,...(duration==null?{}:{duration})});
const knowledge=(key,value,actor='player',teacher=actor,stage='seen')=>({type:'knowledge',actor,key:I.prefix+key,stage,value,
    basis:{kind:teacher===actor?'observation':'instruction',attributedTo:teacher,situationId:'book.paradise.side_branch'}});
const supported=all(eq('paradise.nativeBound'),eq('paradise.playerSupported'),eq('bookCare.enrolled'));
const local=world=>all(supported,eq(`paradise.local.${world}`));
const readyHands=eq('bookCare.handsUsable',true,'Recover tender or strained hands before precise work.');
const prepared=eq('bookCare.preciseReady',true,'Prepare a load brace here, or carry your own still-active earned steady grip.');
const cases=[
    {slug:'hub',world:P.hub,place:L.hub,worker:P.employee,met:eq('world.book.paradise.hub.met'),cargo:K.kit,hub:true},
    {slug:'goa',world:P.goa,place:L.pier,worker:P.porter,met:eq('actor.book.paradise.porterMet'),cargo:K.ration,hub:false},
];
export const BOOK_CARE_CASES=Object.freeze(cases.map(c=>Object.freeze(c)));
const commands=[];
function player(c,suffix,label,requires,costs,effects,extra={}) {
    const gate=all(local(c.world),c.met,requires);
    return {id:I.prefix+c.slug+'.'+suffix,revision:1,label,group:I.group,actorId:'player',worldId:c.world,location:c.place,
        costs,effects,visibleWhen:all(eq('bookCare.enrolled'),eq(`paradise.local.${c.world}`),c.met),requires:gate,
        ...extra,...(extra.targetId?{coLocated:true,participants:['$target']}:{})};
}
function work(c,suffix,label,duration,requires,costs,effects,description,extra={}) {
    const row=player(c,suffix,label,requires,costs,effects,{duration,cancellation:'refund',reservationReturns:1,
        completionFailure:'refund',description,...extra});
    row.completionRequires=all(local(c.world),c.met,extra.completionRequires||requires,
        ...(extra.targetId?[eq(`paradise.support.${extra.targetId}`)]:[]));
    row.completionCoLocated=!!extra.targetId;
    return row;
}
function npc(c,suffix,label,duration,requires,costs,effects,description,admissionRequires=null) {
    const gate=all(local(c.world),eq(`paradise.support.${c.worker}`),eq(`bookCare.workerAt.${c.worker}`),requires);
    return {id:I.prefix+c.slug+'.npc.'+suffix,revision:1,label,group:I.npcGroup,actorId:c.worker,worldId:c.world,location:c.place,
        once:true,claim:I.prefix+c.slug+'.claim.'+suffix,costs,effects,requires:admissionRequires?all(gate,admissionRequires):gate,visibleWhen:gate,audience:['$actor'],
        duration,cancellation:'refund',reservationReturns:1,completionFailure:'refund',completionRequires:gate,completionCoLocated:false,description};
}

for(const c of cases) {
    const name=c.hub?'the service worker':'Rin',currency=c.hub?'district credit':'belli';
    const prefix=c.slug+'.';
    commands.push({id:I.prefix+prefix+'begin',revision:1,label:'Open optional local care and work notes',group:I.group,actorId:'player',
        worldId:c.world,location:c.place,once:true,costs:[],effects:[af('enrolled'),knowledge(prefix+'entry',
            'Opened optional care inside the already admitted independent retained-human branch. The desk and pier offer paid ordinary preparations and real supplied recovery. Care grants no supplies, attention, source powers, role, injury immunity or Paradise settlement. Every worker keeps their own body, means and decision.', 'player',c.worker,'understood')],
        visibleWhen:all(eq(`paradise.local.${c.world}`),c.met,not(eq('bookCare.enrolled'))),
        requires:all(eq('paradise.nativeBound'),eq('paradise.playerSupported'),eq(`paradise.local.${c.world}`),c.met,not(eq('bookCare.enrolled'))),
        targetId:c.worker,coLocated:true,participants:['$target'],description:'An optional original care record. The existing source-qualified campaign and present worker must already be admitted. Enrollment grants no goods, injury, replenishment or obligation.'});
    commands.push(work(c,'read_terms','Read local preparation and recovery terms · 1 min',1,readyHands,[],[
        knowledge(prefix+'terms',`At this ${c.hub?'service desk':'provision pier'}, a real brace or your own still-active learned steady grip supports precise packing. Rushing uses more effort and can strain your own body. Rest eases temporary strain without replenishing vitals; supplied recovery consumes your ration and pays ${name}. An optional inspection belongs to ${name}, who can decline unless their real means and attention support it.`, 'player',c.worker,'understood'),
    ],'Read the actual present terms. This provides understanding, not a brace, supplies or a health grant.',{targetId:c.worker}));
    const prepCosts=c.hub?[coin('player',-2,true),item(c.worker,K.kit,-1),vital('player','stamina',-1),vital(c.worker,'stamina',-1),attention(c.worker)]:
        [item('player',K.log,-1),item('player',K.rope,-1),vital('player','stamina',-2)];
    const prepEffects=[...(c.hub?[coin(c.worker,2,true),item(c.worker,K.kit,1,true)]:[item('player',K.rope,1,true)]),
        condition('player',I.braced,'apply',c.hub?20:16),knowledge(prefix+'prepared',c.hub?
            'Paid two owned district credits and paired real effort for a fitted ordinary load brace. The worker’s exact reusable kit returned once. The brace supports precise packing for twenty played minutes; it is no Hunter or supernatural method.':
            'Consumed one real log and two stamina while fitting a small ordinary load brace with your held-returned rope. The rope returned once. The brace supports precise packing for sixteen played minutes; it grants no weather immunity or foreign source.', 'player',c.hub?c.worker:'player')];
    commands.push(work(c,'prepare',c.hub?'Buy a fitted load brace · 2 credits + effort · 3 min':'Fit your own load brace · log + held rope + effort · 4 min',c.hub?3:4,
        all(readyHands,eq('knowledge.'+I.prefix+prefix+'terms.understood')),prepCosts,prepEffects,
        c.hub?'Use paid paired service and the employee’s existing reusable kit. Completion returns that same kit and grants one temporary preparation.':
            'The physical alternative consumes a real log and your effort; your exact rope is held during work and returned. Temporary preparation must last through its later consumer.',c.hub?{targetId:c.worker}:{}));
    for(const precise of [false,true]) commands.push(work(c,precise?'pack_precise':'pack_hurried',
        precise?'Pack precisely · log + fee + held rope + 2 stamina · 3 min':'Pack hurriedly · log + fee + 3 stamina + strain · 2 min',precise?3:2,
        all(readyHands,...(precise?[prepared]:[eq('bookCare.canRush',true,'Keep more than three actual health before choosing this two-health cost.')])),[item('player',K.log,-1),coin('player',-1,c.hub),vital('player','stamina',precise?-2:-3),
            ...(precise?[item('player',K.rope,-1)]:[vital('player','health',-2)])],
        [coin(c.worker,1,c.hub),item('player',K.kit,1),...(precise?[item('player',K.rope,1,true)]:[condition('player',I.strain,'apply',18)]),
            knowledge(prefix+(precise?'precise':'hurried'),precise?
                'A still-active actual brace or your own earned steady grip supported precise kit packing. One log, one real fittings payment and two stamina became one Prepared survey kit; the held rope returned once. No new injury was added.':
                'Chose hurried kit packing. One log, one real fittings payment, three stamina and two actual health became one Prepared survey kit. Your own body now has a temporary load strain; time or care can ease the condition, but health recovery needs real supplied care.', 'player',c.worker)],
        precise?'Use a preparation that remains active through completion. Produce one existing native kit from paid fittings and real wood, returning the reserved rope once.':
            'An optional faster approach with disclosed actual health loss and temporary dexterity/stamina-efficiency strain. The injury affects your own current body and blocks further precise work until recovery.',
        {targetId:c.worker,...(!precise?{completionRequires:readyHands}:{})}));
    commands.push(work(c,'recover','Take supplied recovery · your ration + 1 fee · 4 min',4,eq('bookCare.playerNeedsRecovery'),
        [item('player',K.ration,-1),coin('player',-1,c.hub),attention(c.worker)],
        [coin(c.worker,1,c.hub),vital('player','health',2),vital('player','stamina',3),condition('player',I.strain,'remove'),
            condition('player','body.sore_hands','remove'),condition('player','body.scraped_hands','remove'),
            knowledge(prefix+'recovery',`Your actual ration, one owned ${currency} and ${name}'s finite attention supported four played minutes of ordinary supplied recovery. It restored at most two health and three stamina within your current maxima and eased temporary load strain, soreness and scrapes. Lasting hand marks, unrelated native effects, death and source rights remain their own states.`, 'player',c.worker)],
        'A ration-backed ordinary recovery service for actual missing vitals or temporary strain/tender hands. It cannot refill attention or manufacture food. Cancellation returns the exact reservation; completion rechecks the actual bodies and co-location.',
        {targetId:c.worker,completionRequires:eq('bookCare.supportedBody')}));
    commands.push(work(c,'rest','Rest strained hands without supplies · 4 min',4,eq('bookCare.playerTender'),[],[
        condition('player',I.strain,'remove'),condition('player','body.sore_hands','remove'),condition('player','body.scraped_hands','remove'),
        knowledge(prefix+'rest','Four played minutes of quiet eased temporary load strain, soreness and scraped hands. This creates no health, stamina or attention and leaves permanent hand marks intact.'),
    ],'The time-only alternative clears temporary strain/tender hands. Missing health and stamina still require their actual recovery owners.',{completionRequires:eq('bookCare.supportedBody')}));
    commands.push(work(c,'request_inspection',`Ask ${name} to accept one supplied inspection · 1 fee + effort · 1 min`,1,
        all(readyHands,prepared,not(eq(`bookCare.requested.${c.worker}`))),
        [coin('player',-1,c.hub),vital('player','stamina',-1),attention(c.worker)],
        [coin(c.worker,1,c.hub),af('requested',true,c.worker),knowledge(prefix+'inspection_request',
            `${name} accepted one paid original inspection and possible cargo handover. They will choose only supported work using their own current body, finite attention, stamina, health and actual reusable kit/rope. Inspection causes disclosed modest exertion. Recovery is separately offered after the work, and neither consent nor payment supplies missing materials.`, 'player',c.worker)],
        'An optional consenting work request. Pay one real local fee and spend your own effort. No immediate cargo or healing is granted; the worker’s independently controlled inspection must actually complete.',{targetId:c.worker,once:true}));
    commands.push(work(c,'aid_worker',`Give ${name} consented recovery · your ration + 1 fee + effort · 3 min`,3,
        all(eq(`bookCare.aidOffered.${c.worker}`),eq(`bookCare.workerNeedsRecovery.${c.worker}`)),
        [item('player',K.ration,-1),coin('player',-1,c.hub),vital('player','stamina',-1),attention(c.worker)],
        [coin(c.worker,1,c.hub),vital(c.worker,'health',2),vital(c.worker,'stamina',4),condition(c.worker,I.strain,'remove'),
            condition(c.worker,I.restored,'apply',16),af('aidOffered',false,c.worker),
            knowledge(prefix+'aid',`After their actually completed inspection, ${name} accepted your counted ration, one owned ${currency} and paired recovery interval. Your one stamina and their one finite attention were spent. Their own body recovered at most two health and four stamina, and gains sixteen played minutes of recovered work readiness. No player vitals or anyone's attention were refilled. This can support their separate actual cargo work only while their remaining means and readiness last.`, 'player',c.worker),
            knowledge(prefix+'own_recovery','I accepted the offered ordinary recovery after my own completed inspection. My own health/stamina changed within their existing maxima; the traveler supplied the consumed ration and actual fee. I can now consider the separately requested cargo work with my remaining stock and attention.',c.worker,'player','understood')],
        'Aid only the present worker who actually offered consent after their inspection. The worker gains their own bounded recovery; every physical supply, fee, effort and attention belongs to its real owner.',
        {targetId:c.worker,completionRequires:all(eq(`bookCare.aidOffered.${c.worker}`),eq(`bookCare.surveyDone.${c.worker}`)),once:true}));
    commands.push(player(c,'receive_account',`Ask ${name} for the actual inspection and cargo account`,
        all(eq(`bookCare.cargoDone.${c.worker}`),not(eq('knowledge.'+I.prefix+prefix+'cargo_account.seen'))),[],[
            knowledge(prefix+'cargo_account',`${name}'s returned account identifies one actually completed material inspection, your separate supplied recovery and one completed physical handover. The ${c.hub?'kit':'ration'} came from their existing stock; timber, rope, effort and finite attention were spent on securing it. This original work receipt says nothing about future plot events, unrestricted trade or another contractor's reward.`, 'player',c.worker),
        ],{targetId:c.worker,once:true,description:'Hear the worker’s own local account only after the actual cargo completed. This conversation creates no second item, currency or completed-source reward.'}));
    commands.push(npc(c,'inspect',`${name} performs their accepted material inspection`,3,
        all(eq(`actor.${I.prefix}requested`),not(eq(`actor.${I.prefix}surveyDone`)),eq(`bookCare.playerAt.${c.slug}`)),
        [item(c.worker,K.rope,-1),...(c.hub?[item(c.worker,K.kit,-1)]:[item(c.worker,K.log,-1)]),
            vital(c.worker,'stamina',-6),vital(c.worker,'health',-2),attention(c.worker)],
        [item(c.worker,K.rope,1,true),...(c.hub?[item(c.worker,K.kit,1,true)]:[item(c.worker,K.log,1,true)]),
            condition(c.worker,I.strain,'apply',18),af('surveyDone',true,c.worker),af('aidOffered',true,c.worker),
            knowledge(prefix+'own_inspection','I completed the accepted three-minute material inspection with my own controlled human body, six stamina, two health and one finite attention. My exact held rope and inspection implement returned once. I have temporary load strain and consent to a separately supplied ordinary recovery before heavy cargo work.',c.worker,c.worker,'understood')],
        'The original worker performs their own finite requested work, spending their own real vitals and attention. Held inspection goods return once. Completion offers limited consent to recovery, without refilling any resource.',
        eq(`bookCare.workerCanInspect.${c.worker}`)));
    commands.push(npc(c,'cargo',`${name} completes one recovered cargo handover`,4,
        all(eq(`actor.${I.prefix}requested`),eq(`actor.${I.prefix}surveyDone`),not(eq(`actor.${I.prefix}cargoDone`)),
            eq(`bookCare.restored.${c.worker}`),eq(`bookCare.playerAt.${c.slug}`)),
        [item(c.worker,K.log,-1),item(c.worker,K.rope,-1),item(c.worker,c.cargo,-1),vital(c.worker,'stamina',-12),attention(c.worker)],
        [item('player',c.cargo,1),af('cargoDone',true,c.worker),af('requested',false,c.worker),condition(c.worker,I.restored,'remove'),
            knowledge(prefix+'own_cargo','I completed my own recovered cargo work with twelve actual stamina, one finite attention, timber, rope and one owned cargo unit. The traveler received that same reserved unit once; it was not a newly seeded reward. My remaining stock and body stay mine.',c.worker,c.worker,'understood')],
        'Actual recovered work readiness, living independent body, present recipient and remaining stock are rechecked through completion. One owned cargo unit is conserved into the player inventory. Cancellation/lost support returns exact reserved stock and effort.'));
}

const controllers=cases.map(c=>({id:I.prefix+c.slug+'.controller',revision:1,label:`${c.hub?'Service worker':'Rin'}'s optional care-linked work`,
    actorId:c.worker,interval:2,actions:[{commandId:I.prefix+c.slug+'.npc.cargo',priority:2},{commandId:I.prefix+c.slug+'.npc.inspect',priority:1}]}));
const conditions=[
    {id:I.braced,revision:1,label:'Load brace prepared',stacking:'max',bioVisible:true,bioDetail:'Temporary ordinary load preparation permits the precise book-world kit approach.'},
    {id:I.strain,revision:1,label:'Load strain',stacking:'max',bioVisible:true,bioDetail:'A temporary strain from deliberately hurried or accepted demanding work. Recovery or played time eases the condition; missing health stays missing.'},
    {id:I.restored,revision:1,label:'Recovered for cargo work',stacking:'max',bioVisible:true,bioDetail:'This actual worker received supplied recovery and can consider one supported cargo handover before readiness expires.'},
];
export const bookCareDefinitions={commands,controllers,conditions};
export const bookCareCommand=id=>commands.find(d=>d.id===id)||null;
