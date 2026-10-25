// D7 authored slice definitions. Canon setting, original profile and values.
// All text is paraphrased; no novel prose, secret truth or protagonist privilege.
const P='book.hp.school', id=n=>`${P}.${n}`, key=n=>JSON.stringify({id:id(n)});
const note=(n,value)=>({type:'knowledge',key:id(n),stage:'understood',value});
export const hpSchoolLife={
 schema:2,id:P,revision:1,title:'Harry Potter · first school term',
 description:'Opt-in proposal: a Muggle-born first-year in an ordinary Hogwarts term. Begin a separate local life with a fitted wand, school access and a finite supply allowance. This is a test branch, not the full seven-year world.',
 compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock','jobs'],
 world:{id:id('world'),label:'Harry Potter · school term (original life)'},
 locations:[{id:id('commons'),label:'Hogwarts study room',description:'A supervised room with practice desks and a posted lesson notice.',underRoof:true}],
 items:[{id:id('wand'),label:'Fitted school wand',description:'Your owned wand, fitted before this opening. Its wood and core are not a numeric rank.',value:1},
 {id:id('paper'),label:'School parchment',description:'A sheet paid for from the school supply allowance.',value:1}],
 starts:[{id:id('start'),locationId:id('commons'),description:'You are an eleven-year-old Muggle-born first-year. Your guardian arranged supplies; you owe the school supply fund four local allowance units. You know your room and school rules, not the hidden world.',
 body:{id:id('body'),ownerId:'player',controllerId:'player',form:'human',lifeStage:'child',hands:2,mobile:true},
 effects:[{type:'item',key:key('wand'),amount:1},{type:'item',key:key('paper'),amount:6},
 {type:'resource',key:id('allowance'),amount:8},{type:'resource',key:id('debt'),amount:4},
 {type:'fact',scope:'actor',key:id('student'),value:true},
 note('opening','Your guardian supplied one fitted wand and six sheets. You hold eight local allowance units and owe four to the supply fund. Units and prices are authored test values, not Galleons.'),
 note('access','You may use the supervised study room. School access is not adult office clearance or permission to enter private stores.')]}],
 simulation:{people:[],commands:[]},presentation:{people:{},status:[{id:id('opening_status'),label:'Means',knowledgeKey:id('opening')},{id:id('access_status'),label:'Access',knowledgeKey:id('access')}]}
};

// Authored timetable: one 70-calendar-day term; weekdays have morning charms and afternoon plant study.
// Clock is elapsed played time from the opening record, not the Frontier's year/month.
const eq=(fact,value=true,reason)=>({fact,op:'eq',value,...reason?{reason}:{}}),all=(...r)=>({all:r});
const alive=all(eq('actor.life','alive'),eq('native.ready'));
const schoolCmd=(n,label,extra={})=>({id:id(n),revision:1,label,group:'structured_local',worldId:id('world'),actorId:'player',location:id('commons'),audience:['$actor'],costs:[],effects:[],requires:alive,...extra});
hpSchoolLife.sources=[{id:id('magic'),revision:1,label:'Born magical',kind:'trait',origin:'inherited',grants:[],bioDetail:'This original pupil was already magical before school. Tuition teaches control; it does not manufacture eligibility.'}];
hpSchoolLife.starts[0].effects.push({type:'source',sourceId:id('magic'),operation:'grant',awakened:true,active:true,origin:'inherited'},note('timetable','Original timetable: 70 calendar days. Weekdays: charms during the first two hours after 09:00; plant study 13:00–15:00. Weekends and the following break have no lessons. Private practice stays available. Missed lessons create no rewards.'));
hpSchoolLife.simulation.people=[{id:id('tutor'),revision:1,label:'Mara Reed (original school tutor)',worldId:id('world'),location:id('commons'),inventory:'simulation',provision:false,body:{id:id('tutor_body'),ownerId:id('tutor'),controllerId:id('tutor'),form:'human',hands:2,mobile:true},vitals:{health:100,stamina:100}}];
hpSchoolLife.presentation.people[id('tutor')]={introductionKnowledgeKey:id('tutor_known')};
hpSchoolLife.starts[0].effects.push(note('tutor_known','Mara runs this supervised study room. Her appointment, voice and timetable are original proposals, not a canon staff replacement.'));
hpSchoolLife.presentation.status.push({id:id('timetable_status'),label:'Posted timetable',knowledgeKey:id('timetable')});
hpSchoolLife.simulation.powers=[{id:id('levitation'),revision:1,label:'Feather levitation',model:'practice',capacity:1,cooldown:0}];
const tuition=(window)=>all(alive,eq('hp.school.'+window,true,'The posted lesson is closed, or there is not enough time left to complete it.'));
hpSchoolLife.simulation.commands.push(
 schoolCmd('lesson_charms','Attend introductory charms · 30 min',{
 description:'Mara demonstrates wand motion and pronunciation with a feather. Completing this supervised introduction teaches the method, separate from your inborn magical faculty. Exact lesson and time are authored.',
 targetId:id('tutor'),coLocated:true,participants:['$target'],once:true,duration:30,cancellation:'refund',reservationReturns:1,
 requires:tuition('charmsStart'),completionRequires:tuition('charmsOpen'),completionCoLocated:true,completionFailure:'refund',
 costs:[{type:'item',key:key('paper'),amount:-1}],effects:[{type:'power',powerId:id('levitation'),operation:'learn'},{type:'xp',skill:'Literacy',amount:5},note('lesson_charms','Your tutor corrected your wand motion and pronunciation. You can now drill feather levitation; attendance itself is not mastery.')]}),
 schoolCmd('lesson_plants','Attend plant identification · 30 min',{
 description:'Compare labelled safe classroom plants and take notes. This exercises Literacy through the native skill owner; it grants no automatic potion or magical faculty.',
 targetId:id('tutor'),coLocated:true,participants:['$target'],once:true,duration:30,cancellation:'refund',reservationReturns:1,
 requires:tuition('plantsStart'),completionRequires:tuition('plantsOpen'),completionCoLocated:true,completionFailure:'refund',
 costs:[{type:'item',key:key('paper'),amount:-1}],effects:[{type:'xp',skill:'Literacy',amount:5},note('lesson_plants','You compared labels with actual leaves and wrote identification notes. The plant study is useful reading practice, not permission to take private ingredients.')]}),
 schoolCmd('study_notes','Study your school notes · 10 min',{
 description:'Write and compare notes. This remains available outside class; it consumes a sheet and exercises Literacy rather than buying a school rank.',duration:10,cancellation:'refund',reservationReturns:1,completionRequires:alive,completionCoLocated:true,completionFailure:'refund',
 costs:[{type:'item',key:key('paper'),amount:-1}],effects:[{type:'xp',skill:'Literacy',amount:2},note('notes','You compared your written notes with the posted lesson instructions.')]}),
 schoolCmd('wait_hour','Spend an hour in the study room', {description:'Let played time pass. This claims no lesson, practice or wages.',duration:60,cancellation:'refund',completionRequires:alive,completionCoLocated:true,completionFailure:'refund'}),
 schoolCmd('repay','Repay four supply-fund units', {once:true,description:'Settle the opening supply debt from your actual local allowance. This does not spend Frontier coins.',costs:[{type:'resource',key:id('allowance'),amount:-4},{type:'resource',key:id('debt'),amount:-4}],effects:[note('debt_paid','The four-unit school supply debt is paid.')]})
);

// Two source-qualified operations, no per-spell runtime. All costs/thresholds are original dials.
// SHOWN B1:PDF-p137–138: instruction in motion/pronunciation and a feather lifted.
// SHOWN B4:PDF-p1276: Reparo reunites all shards into the compartment pane.
export const hpSpellRows=[
 {key:'levitation',label:'Feather levitation',input:'feather',output:'raised_feather',inputLabel:'Practice feather',outputLabel:'Feather on the high practice rack',
  lesson:'lesson_charms',effect:'Your feather rose and settled on the high practice rack. This proves this feather exercise, not lifting people or a hot cauldron.'},
 {key:'repair_glass',label:'Reparo · practice pane',input:'glass_shards',output:'glass_pane',inputLabel:'Complete set of practice-pane shards',outputLabel:'Repaired practice pane',
  lesson:'lesson_repair',effect:'The complete set of ordinary glass fragments rejoined as a practice pane. Missing material, enchanted objects and wand repair remain separate cases.'}
];
hpSchoolLife.items.push({id:id('practice_wand'),label:'School practice wand (borrowed)',description:'A supported borrowed practice wand. Custody and cooperation are separate; these bounded exercises support this tool without declaring all borrowed wands equally good.',value:1});
hpSchoolLife.starts[0].effects.push({type:'fact',scope:'actor',key:id('borrowed'),value:false});
for(const r of hpSpellRows){
 for(const [name,label] of [[r.input,r.inputLabel],[r.output,r.outputLabel]])hpSchoolLife.items.push({id:id(name),label,description:'Original supervised exercise target, all material present. No permission for arbitrary targets follows from this case.',value:1});
 hpSchoolLife.starts[0].effects.push({type:'item',key:key(r.input),amount:3});
 if(r.key!=='levitation'){
  hpSchoolLife.simulation.powers.push({id:id(r.key),revision:1,label:r.label,model:'practice',capacity:1,cooldown:0});
  hpSchoolLife.simulation.commands.push(schoolCmd(r.lesson,'Attend glass-repair instruction · 30 min',{
   description:'An optional original tutor demonstration using the source-qualified ordinary-glass repair case. This is not a claim about a canon first-year syllabus.',targetId:id('tutor'),coLocated:true,participants:['$target'],once:true,duration:30,cancellation:'refund',reservationReturns:1,
   requires:tuition('charmsStart'),completionRequires:tuition('charmsOpen'),completionCoLocated:true,completionFailure:'refund',
   costs:[{type:'item',key:key('paper'),amount:-1}],effects:[{type:'power',powerId:id(r.key),operation:'learn'},note(r.lesson,'You learned the bounded ordinary-glass repair exercise. Practice is still needed before reliable execution.')]}));
 }
 hpSchoolLife.simulation.commands.push(schoolCmd('practice_'+r.key,'Practice '+r.label+' · 3 min',{
  description:'Drill the taught motion on the practice target. Adds one step of this method’s actual mastery; it does not grant magical eligibility.',
  duration:3,cancellation:'refund',reservationReturns:1,requires:all(alive,eq('hp.school.wandReady'),eq('power.'+id(r.key)+'.owned')),
  completionRequires:all(alive,eq('hp.school.wandReady')),completionCoLocated:true,completionFailure:'refund',
  costs:[{type:'vital',key:'stamina',amount:-1}],effects:[{type:'power',powerId:id(r.key),operation:'refine',amount:1},note('practice_'+r.key,'You practiced '+r.label+' with a supported wand and corrected the taught motion.')]}),
  schoolCmd('cast_'+r.key,'Use '+r.label,{
   description:'Move one actual exercise target from its initial state to its useful result. Requires your magical faculty, a learned and practiced method, a supported held wand, one free hand and stamina. Targets and thresholds are authored slice dials.',powerId:id(r.key),
   requires:all(alive,eq('hp.school.wandReady'),{fact:'body.hands',op:'gte',value:1},{fact:'power.'+id(r.key)+'.mastery',op:'gte',value:1,reason:'Practice this taught method first.'}),
   costs:[{type:'item',key:key(r.input),amount:-1},{type:'vital',key:'stamina',amount:-1}],
   effects:[{type:'item',key:key(r.output),amount:1},note('cast_'+r.key,r.effect)]}));
}
hpSchoolLife.abilities=hpSpellRows.map(r=>({id:id('ability_'+r.key),commandId:id('cast_'+r.key),powerId:id(r.key),sourceId:id('magic'),function:'physical',acquisition:'learned',executionKind:'ordinary-technique',control:alive,target:null,counters:[],carriers:[]}));
for(const r of hpSpellRows)for(const n of ['practice_'+r.key,'cast_'+r.key])hpSchoolLife.presentation.status.push({id:id(n+'_status'),label:n.startsWith('cast')?'Last exercise result':'Practice',knowledgeKey:id(n)});
hpSchoolLife.simulation.commands.push(
 schoolCmd('borrow_wand','Exchange your fitted wand for the school practice loan',{
  targetId:id('tutor'),coLocated:true,participants:['$target'],requires:all(alive,eq('actor.'+id('borrowed'),false)),
  description:'Leave your fitted wand with Mara and sign out the finite school practice wand. Returning the loan restores your fitted wand.',
  costs:[{type:'transfer',from:'player',to:id('tutor'),key:key('wand'),count:1}],effects:[{type:'custody',loanId:id('wand_loan'),from:id('tutor'),to:'player',key:key('practice_wand'),count:1},{type:'fact',scope:'actor',key:id('borrowed'),value:true},note('wand_loan','Mara holds your fitted wand while you hold the school practice wand. This supported tool can perform the bounded exercises; ownership alone does not decide performance.')]}),
 schoolCmd('return_wand','Return the practice wand and reclaim your fitted wand',{
  targetId:id('tutor'),coLocated:true,participants:['$target'],requires:all(alive,eq('actor.'+id('borrowed'))),
  costs:[{type:'custody',loanId:id('wand_loan'),from:'player',to:id('tutor'),key:key('practice_wand'),count:1,returning:true}],effects:[{type:'transfer',from:id('tutor'),to:'player',key:key('wand'),count:1},{type:'fact',scope:'actor',key:id('borrowed'),value:false}]}),
 schoolCmd('retrieve_feather','Retrieve a feather from the practice rack',{
  description:'Take the elevated feather down by hand. The spell changed a real target; a completed practice receipt alone would not supply another feather.',costs:[{type:'item',key:key('raised_feather'),amount:-1}],effects:[{type:'item',key:key('feather'),amount:1}]}));
// Finite school stock provisioned at the explicit beginning through ordinary item effects.
hpSchoolLife.starts[0].effects.push({type:'item',actor:id('tutor'),key:key('practice_wand'),amount:1});

// A second life reuses the same method descriptors, with its own IDs, body, access and stock.
// Original adult Diagon Alley glass trade, not a Ministry appointment or school admission.
const T='book.hp.trade',tid=n=>`${T}.${n}`,tkey=n=>JSON.stringify({id:tid(n)});
const tnote=(n,value)=>({type:'knowledge',key:tid(n),stage:'understood',value});
const tcmd=(n,label,location='workshop',extra={})=>({id:tid(n),revision:1,label,group:'structured_local',worldId:tid('world'),actorId:'player',location:tid(location),audience:['$actor'],requires:alive,costs:[],effects:[],...extra});
const trules=all(alive,eq('hp.trade.wandReady'),{fact:'body.hands',op:'gte',value:1});
const tradeMagic={id:tid('magic'),revision:1,label:'Adult wizard faculty',kind:'trait',origin:'inherited',grants:[],bioDetail:'This original adult was magical before the opening and already learned ordinary glass repair. Employment itself supplies no magical faculty.'};
export const hpTradeLife={schema:2,id:T,revision:1,title:'Harry Potter · Diagon Alley glass trade',
 description:'Opt-in original adult wizard life: rent a workshop, repair owned glass stock and sell it at a Diagon Alley counter. Your purse, debt, access and remembered methods belong to this life. No school or Ministry clearance is supplied.',
 compatibility:{legacy:'preserve-dormant',origin:'mandatory'},capabilities:['native-stock','jobs'],world:{id:tid('world'),label:'Harry Potter · Diagon Alley trade (original life)'},
 locations:[{id:tid('workshop'),label:'Diagon Alley rented glass workshop',description:'An original rented bench behind the public shopping street. Only ordinary panes with all fragments are admitted repair targets.',underRoof:true},{id:tid('shop'),label:'Diagon Alley glass counter',description:'Elias’s original shop counter. Stock and purchasing cash are finite; this is no claim about a canon shop or price.',underRoof:true}],
 items:['wand',...hpSpellRows.flatMap(r=>[r.input,r.output])].map(n=>({id:tid(n),label:n==='wand'?'Owned trade wand':hpSchoolLife.items.find(i=>i.id===id(n)).label,description:'Owned local trade stock. All prices, quantities and trade conditions are authored proposals.',value:1})),
 sources:[tradeMagic],
 starts:[{id:tid('start'),locationId:tid('workshop'),description:'You are an adult wizard renting a glass bench. You own your wand and two complete sets of pane fragments, know glass repair, hold twelve local trade units and owe Elias six rent units. School and Ministry spaces remain outside this start’s access.',
 body:{id:tid('body'),ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult',hands:2,mobile:true},effects:[
 {type:'source',sourceId:tid('magic'),operation:'grant',awakened:true,active:true,origin:'inherited'},
 {type:'power',powerId:tid('repair_glass'),operation:'learn'},{type:'power',powerId:tid('repair_glass'),operation:'refine',amount:2},
 {type:'item',key:tkey('wand'),amount:1},{type:'item',key:tkey('glass_shards'),amount:2},{type:'item',actor:tid('merchant'),key:tkey('glass_shards'),amount:6},
 {type:'resource',key:tid('coins'),amount:12},{type:'resource',key:tid('debt'),amount:6},
 tnote('opening','Opening means: owned wand, two complete pane-fragment sets, learned glass repair, twelve local trade units and six units of rent debt. This trade purse is separate from any Frontier coins.'),
 tnote('merchant_known','Elias Brook runs this original glass counter. He buys usable ordinary panes for four units and sells complete fragment sets for two while his own stock and cash last.')]}],
 simulation:{people:[{id:tid('merchant'),revision:1,label:'Elias Brook (original glass trader)',worldId:tid('world'),location:tid('shop'),inventory:'simulation',provision:false,resources:{[tid('coins')]:20},body:{id:tid('merchant_body'),ownerId:tid('merchant'),controllerId:tid('merchant'),form:'human',hands:2,mobile:true},vitals:{health:100,stamina:100}}],
 powers:[{id:tid('repair_glass'),revision:1,label:'Reparo · ordinary pane',model:'practice',capacity:1,cooldown:0}],commands:[
 tcmd('repair','Repair one complete glass pane · 10 min','workshop',{
  description:'Apply your learned glass-repair method to one owned complete fragment set. Reserve material and stamina now; a stopped or unsupported job refunds them and yields no pane.',
  powerId:tid('repair_glass'),requires:all(trules,eq('faculty.'+tid('magic')+'.active')),
  duration:10,cancellation:'refund',reservationReturns:1,completionRequires:all(trules,eq('faculty.'+tid('magic')+'.active')),completionCoLocated:true,completionFailure:'refund',
  costs:[{type:'item',key:tkey('glass_shards'),amount:-1},{type:'vital',key:'stamina',amount:-1}],effects:[{type:'item',key:tkey('glass_pane'),amount:1},tnote('repair','All the fragments rejoined as a usable ordinary pane. It is now owned stock you can sell at the counter.')]}),
 tcmd('deliver','Sell one repaired pane · receive 4 trade units','shop',{
  targetId:tid('merchant'),coLocated:true,participants:['$target'],description:'Elias takes the actual pane into his inventory and pays from his finite till. The sale is not wages or a school credential.',
  costs:[{type:'transfer',from:'player',to:tid('merchant'),key:tkey('glass_pane'),count:1},{type:'resource',actor:tid('merchant'),key:tid('coins'),amount:-4}],effects:[{type:'resource',key:tid('coins'),amount:4},tnote('sale','You sold one actual repaired pane to Elias for four local trade units from his till.')]}),
 tcmd('buy_fragments','Buy a complete fragment set · 2 trade units','shop',{
  targetId:tid('merchant'),coLocated:true,participants:['$target'],description:'Buy one of Elias’s six starting fragment sets. Stock is not refreshed by leaving, saving or reloading.',
  costs:[{type:'resource',key:tid('coins'),amount:-2},{type:'transfer',from:tid('merchant'),to:'player',key:tkey('glass_shards'),count:1}],effects:[{type:'resource',actor:tid('merchant'),key:tid('coins'),amount:2}]}),
 tcmd('repay','Pay the six-unit opening rent debt','shop',{
  targetId:tid('merchant'),coLocated:true,participants:['$target'],once:true,description:'Elias receives six actual trade units and the opening rent debt is settled once.',
  costs:[{type:'resource',key:tid('coins'),amount:-6},{type:'resource',key:tid('debt'),amount:-6}],effects:[{type:'resource',actor:tid('merchant'),key:tid('coins'),amount:6},tnote('rent','You settled the six-unit opening rent debt with Elias.')]}),
 ...[['workshop','shop'],['shop','workshop']].map(([from,to])=>tcmd('walk_'+to,'Walk to the '+(to==='shop'?'glass counter':'rented workshop')+' · 5 min',from,{
  description:'A five-minute original route. You remain at the departure place until arrival; cancellation keeps you there.',duration:5,cancellation:'refund',completionRequires:all(alive,eq('body.mobile')),completionFailure:'refund',effects:[{type:'relocate',location:tid(to)}]}))
 ]},
 abilities:[{id:tid('ability_repair'),commandId:tid('repair'),powerId:tid('repair_glass'),sourceId:tid('magic'),function:'craft',acquisition:'learned',executionKind:'ordinary-technique',control:trules,target:null,counters:[],carriers:[]}],
 presentation:{people:{[tid('merchant')]:{introductionKnowledgeKey:tid('merchant_known')}},status:['opening','repair','sale','rent'].map(n=>({id:tid(n+'_status'),label:{opening:'Opening means',repair:'Repair',sale:'Trade',rent:'Rent'}[n],knowledgeKey:tid(n)}))}
};

for(const life of [hpSchoolLife,hpTradeLife])life.calendarProfile={
 id:life.id+'.calendar',revision:1,algorithmId:'fixed_months',algorithmRevision:1,
 units:{minutesPerHour:60,hoursPerDay:24},months:Array.from({length:12},(_,i)=>({id:String(i+1),days:30})),
 week:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],precision:'day',evidence:'original slice elapsed calendar',
 label:life===hpSchoolLife?'Hogwarts term':'Diagon Alley trade',format:'elapsed',seasons:false,
 anchor:{year:1,month:1,day:1,hour:9,minute:0,day_count:0}
};
