// Finite sid20 first-Goa continuation. New services, geometry, timings, fees,
// training, rescue and aftermath are original reversible branch proposals.
// Definitions grant no person, body, stock, source, purse or reward on import.
import {PARADISE_IDS as P, PARADISE_LOCATIONS as L, PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {eq, gte} from './basics.js';
import {itemActorFirst as item, transferOne as transfer} from './content_kit.js';

export const PARADISE_CAMPAIGN_IDS = Object.freeze({prefix:'book.paradise.campaign.', group:'book_paradise_campaign',
    npcGroup:'book_paradise_campaign_npc', method:'book.paradise.campaign.line_rigging', bench:'book.paradise.campaign.personal_bench',
    shelter:'book.paradise.campaign.civil_shelter', scene:'book.paradise.campaign.gate_rescue',
    smoke:'book.paradise.campaign.smoke_irritation', guard:'book.paradise.campaign.smoke_wrap',
    bruise:'book.paradise.campaign.gate_bruising', situation:'book.paradise.side_branch'});
export const PARADISE_CAMPAIGN_KEYS = Object.freeze({cloth:JSON.stringify({id:'Linen cloth'}), herb:JSON.stringify({id:'Golmoon leaf'})});
export const PARADISE_CAMPAIGN_WINDOW = Object.freeze({assembly:58, danger:60, deadline:72});
const I=PARADISE_CAMPAIGN_IDS, F=I.prefix, Q=PARADISE_CAMPAIGN_KEYS;
const all=(...rules)=>({all:rules}), not=rule=>({not:rule});
const f=(name,reason)=>eq('paradiseCampaign.'+name,true,reason);
const af=(name,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:F+name,value});
const wf=(name,value=true)=>({type:'world',worldId:P.goa,key:F+name,value});
const old=(name,value=true)=>({type:'world',worldId:P.goa,key:'book.goa.'+name,value});
const vital=(actor,key,amount)=>({type:'vital',actor,key,amount});
const stamina=(actor,amount)=>vital(actor,'stamina',amount);
const purse=(actor,amount,hub=false)=>({type:'resource',actor,key:hub?'book.paradise.coin':'book.paradise.belli',amount});
const attention=(actor,amount=-1)=>({type:'resource',actor,key:'book.paradise.attention',amount});
const condition=(actor,id,operation,duration)=>({type:'condition',actor,id,operation,...(duration?{duration}:{})});
const know=(name,value,actor='player',speaker=actor,instruction=false)=>({type:'knowledge',actor,key:F+name,stage:instruction?'understood':'seen',value,
    basis:{kind:instruction?'instruction':'observation',attributedTo:speaker,situationId:I.situation}});
const sourceLearn=[{type:'source',actor:'player',sourceId:I.method,operation:'grant',origin:'trained',awakened:true,active:true},
    {type:'power',actor:'player',powerId:I.method,operation:'learn'}];
const refine=amount=>({type:'power',actor:'player',powerId:I.method,operation:'refine',amount});
const supported=f('supported','Use the actual living, controlled human body in this retained source branch.');
const local=world=>all(supported,f('enrolled'),eq(`paradise.local.${world}`));
const currentHands=f('hands','Recover strained or injured hands before precise load work.');
const contact=targetId=>({targetId,coLocated:true,participants:['$target']});
const timed=(duration,support,coLocated=false,siteId=null)=>({duration,cancellation:'refund',reservationReturns:1,
    completionFailure:'refund',completionRequires:support,completionCoLocated:coLocated,...(siteId?{siteId}:{})});
const command=(id,label,world,location,d={})=>({id:F+id,revision:1,label,actorId:'player',group:I.group,worldId:world,location,
    costs:[],effects:[],once:true,requires:local(world),...d,
    visibleWhen:all(eq(`paradise.local.${world}`),eq('actor.location',location),d.visibleWhen||f('enrolled'))});
const npc=(id,label,actor,location,d={})=>({id:F+'npc.'+id,revision:1,label,actorId:actor,group:I.npcGroup,worldId:P.goa,location,
    audience:['$actor'],once:true,costs:[],effects:[],visibleWhen:f('enrolled'),requires:all(local(P.goa),eq(`paradise.support.${actor}`)),...d});
const ownTools=[item('player',K.kit,-1),item('player',K.rope,-1)];
const returnTools=[item('player',K.kit,1,true),item('player',K.rope,1,true)];
const bench=all(local(P.hub),currentHands,f('bench'));
const method=all(currentHands,f('methodActive','Keep your own active taught line procedure and actual kit/rope.'));
const lesson=all(local(P.hub),currentHands,eq('world.book.paradise.hub.met'),f('baseMethod'),not(f('methodOwned')));
const paidLesson=all(lesson,eq(`paradise.support.${P.employee}`));
const sceneSupport=all(local(P.goa),f('gateKnown'),f('rescueContact'),f('rescueWindow'),not(f('rescueFinished')));
const retreat=af('retreated');
const livingRescue=[old('hank','sheltered'),wf('rescueOutcome','rescued'),af('rescued',true,P.hank),
    know('hank_received_rescue','The traveler actually reached me at the gate and helped me out of the finite crush. My own body and spent effort remain mine. The fire and my injuries are real; this is not an automatic route report, death reversal or return guarantee.',P.hank,'player',true)];
const turnReady=all(local(P.goa),f('rescueContact'),f('rescueWindow'),not(eq('actor.'+F+'retreated')));
const thirdReady=all(local(P.goa),f('sceneRescued'));

const commands=[
    ...[[P.hub,L.hub,'hub'],[P.goa,L.gray,'goa']].map(([world,place,slug])=>command(slug+'.begin','Open the extended craft, danger and return terms · optional',world,place,{
        visibleWhen:all(eq(`paradise.local.${world}`),not(f('enrolled'))),requires:all(supported,eq(`paradise.local.${world}`),not(f('enrolled'))),
        effects:[af('enrolled'),know('entry',
            'This optional continuation represents the sid20 first-Goa fire, gate and immediate retained aftermath, beside an original paid hub workshop. Its 58–72 local-minute rescue window is a game proposal, not the source tomorrow18:00/midnight notices. People keep their own body, money, materials, attention and source knowledge. Your learned line procedure is ordinary physical craft, not Hunter talent or mana. Failure can kill the endangered Hank; no source restoration, free loot, save rewind, prestige or universal evacuation follows. Previously reserved jobs retain their original terms.', 'player','player',true)],
        description:'Deliberately adopt this bounded new rescue/aftermath branch. Earlier completed work and frozen jobs retain their meanings. No source capability or physical supply is seeded.'})),
    command('hub.bench','Build your own paid-district bench · 2 logs + rope + 2 stamina · 5 min',P.hub,L.hub,{
        requires:all(local(P.hub),currentHands,eq('world.book.paradise.hub.met'),not(f('bench'))),
        ...timed(5,all(local(P.hub),currentHands)),claim:F+'bench_claim',costs:[item('player',K.log,-2),item('player',K.rope,-1),stamina('player',-2)],
        effects:[{type:'site',operation:'open',siteId:I.bench,actor:'player'},af('bench'),know('bench',
            'My two actual logs, rope, two stamina and five played minutes became one personally owned small bench. The original district permits this finite work surface. It supports personal kit repair and paid deliveries; it grants no room, employee office, World Source or automatic stock.')] }),
    command('hub.learn_paid','Buy line-rigging instruction · 2 credits + paired effort · 4 min',P.hub,L.hub,{
        ...contact(P.employee),requires:paidLesson,...timed(4,paidLesson,true),claim:F+'method_claim',
        costs:[purse('player',-2,true),stamina('player',-2),stamina(P.employee,-1),attention(P.employee),item(P.employee,K.kit,-1)],
        effects:[purse(P.employee,2,true),item(P.employee,K.kit,1,true),...sourceLearn,af('taught'),know('line_instruction',
            'The employee taught an original line procedure after checking my actually acquired bracing method. We tested a held kit, a loaded rope path, an anchor and release order with our own bodies. I acquired my own zero-start line procedure, not the employee’s mastery, sword technique, Soul Eater, mana or Hunter source. Control still needs my own practice and real kit/rope.', 'player',P.employee,true)]}),
    command('hub.learn_self','Develop a line procedure at your own bench · log + held kit/rope + 4 stamina · 7 min',P.hub,L.hub,{
        requires:all(lesson,f('bench'),f('ownTools')),...timed(7,all(local(P.hub),currentHands,f('baseMethod'),f('bench')),false,I.bench),claim:F+'method_claim',
        costs:[item('player',K.log,-1),...ownTools,stamina('player',-4)],effects:[...returnTools,...sourceLearn,af('selfTaught'),know('line_instruction',
            'At my actually built bench I spent one log, four stamina and seven minutes testing a loaded line against my own learned bracing. My held kit and rope returned once. I developed this original ordinary procedure at zero mastery; no teacher’s hidden knowledge, magical faculty, city authority or stock was copied.','player','player',true)]}),
    ...[['hub',P.hub,L.training],['goa',P.goa,L.pier]].map(([slug,world,place])=>command(slug+'.practice','Practice control of your own line · held kit/rope + 2 stamina · 3 min',world,place,{
        once:false,visibleWhen:all(f('enrolled'),eq(`paradise.local.${world}`),f('methodOwned')),requires:all(local(world),method,f('practiceAvailable')),
        powerId:I.method,...timed(3,all(local(world),currentHands,f('methodFaculty'))),costs:[...ownTools,stamina('player',-2)],
        effects:[...returnTools,refine(1),know('practice','I practiced the anchor, tension, two-body load and release sequence with my own real kit and rope. Both held tools returned once; two stamina and three minutes stayed spent. Mastery up to three now changes my supported rescue, timber use and repeat workshop labor. This is ordinary technique control, with no mana reserve or borrowed talent.','player','player',true)]})),
    command('hub.pause_method','Stop using your taught line procedure',P.hub,L.training,{once:false,
        visibleWhen:all(f('enrolled'),eq(`paradise.local.${P.hub}`),f('methodFaculty')),
        requires:all(local(P.hub),f('methodFaculty')),effects:[{type:'source',actor:'player',sourceId:I.method,operation:'activate',active:false},
            know('paused','I voluntarily stopped using my line procedure. Its source record and learned history remain mine; exact source activation is required again for its consumers. No tool, body or mastery changed.')]}),
    command('hub.resume_method','Resume your own learned line procedure',P.hub,L.training,{once:false,
        visibleWhen:all(f('enrolled'),eq(`paradise.local.${P.hub}`),f('methodOwned'),not(f('methodFaculty'))),
        requires:all(local(P.hub),currentHands,f('methodResumable')),effects:[{type:'source',actor:'player',sourceId:I.method,operation:'activate',active:true},
            know('resumed','I resumed my own already learned, awakened and unsuppressed ordinary line procedure. This did not grant a new source or restore missing supplies.')]}),
    ...[['ordinary',4,3,false],['controlled',2,1,true]].map(([slug,duration,effort,controlled])=>command('hub.make_'+slug,
        controlled?'Make a controlled bench kit · log + held rope + 1 stamina · 2 min':'Make an ordinary bench kit · log + held rope + 3 stamina · 4 min',P.hub,L.hub,{
        once:false,requires:all(bench,...(controlled?[method,f('mastered')]:[])),...timed(duration,all(bench,...(controlled?[f('methodFaculty'),f('mastered')]:[])),false,I.bench),
        ...(controlled?{powerId:I.method}:{}),costs:[item('player',K.log,-1),item('player',K.rope,-1),stamina('player',-effort)],
        effects:[item('player',K.rope,1,true),item('player',K.kit,1),know('bench_production',controlled?
            'My own mastered line procedure and retained personal bench used one real log, one held-returned rope, one stamina and two minutes for one native Prepared survey kit. No shop, purse or material was refilled.':
            'My retained personal bench used one real log, one held-returned rope, three stamina and four minutes for one native Prepared survey kit. The ordinary route remains useful without the line procedure.')] })),
    ...[1,2].map(n=>command('hub.commission_'+n,`Supply district repair order ${n} · one actual kit for 3 owned credits`,P.hub,L.hub,{
        ...contact(P.employee),claim:F+'commission_'+n,requires:all(bench,eq(`paradise.support.${P.employee}`),...(n===2?[eq('actor.'+F+'commission1')]:[])),
        ...timed(2,all(bench,eq(`paradise.support.${P.employee}`)),true,I.bench),costs:[item('player',K.kit,-1),purse(P.employee,-3,true),attention(P.employee)],
        effects:[item(P.employee,K.kit,1),purse('player',3,true),af('commission'+n),know('commission'+n,
            `Completed original finite district repair order ${n}. My actual kit entered the employee’s inventory; three of their own credits entered my purse and their finite attention was spent. This physical supply and specific completed order grants no general rank, repeated payroll or new shop stock.`, 'player',P.employee)]})),
    command('goa.wrap','Fit an ordinary smoke wrap · linen + 1 stamina · 2 min',P.goa,L.pier,{once:false,
        requires:all(local(P.goa),currentHands,not(f('wrapped'))),...timed(2,all(local(P.goa),currentHands)),costs:[item('player',Q.cloth,-1),stamina('player',-1)],
        effects:[condition('player',I.guard,'apply',20),know('smoke_wrap','Spent one real Linen cloth and one stamina on an original twenty-minute smoke wrap. It supports the specifically authored sheltered escort and lowers that route’s injury. It grants no general fire/poison immunity, underwater breath, magical barrier or new body.')]}),
    command('goa.recon','Inspect the actual gate route · 2 stamina · 3 min',P.goa,L.gate,{
        requires:all(local(P.goa),f('gateInspectable')),...timed(3,all(local(P.goa),f('gateInspectable'))),costs:[stamina('player',-2)],
        effects:[af('gateSurvey'),know('gate_survey','I physically inspected the gate-side line route and two reachable timber anchor positions. These original small geometric observations support a later braced or ordinary rescue, if the actual people and access still exist. I learned no private assassination task or future timing.','player','player',true)]}),
    command('goa.observe_gate','Look at the actual endangered guard and fleeing pirate at the gate',P.goa,L.gate,{
        visibleWhen:all(f('enrolled'),eq(`paradise.local.${P.goa}`),f('gateScenePresent')),requires:all(local(P.goa),f('gateScenePresent')),
        effects:[af('gateKnown'),know('gate_notice','At the actual burned-district gate I saw Hank caught in a small dangerous crush and Krieg pressing for escape after his own operation. The original branch offers one bounded rescue through local minute72. I can use a studied line, ordinary timber, paid breathing room or an exposed attempt, and may retreat. The scene cannot restore the burned homes or guarantee any broad evacuation. No person’s private plan was disclosed.')]}),
    command('goa.rescue','Intervene in the bounded gate conflict · own and opposed means · three choices',P.goa,L.gate,{
        ...contact(P.krieg),participants:['$target',P.hank],claim:F+'gate_scene_claim',encounterId:I.scene,
        visibleWhen:all(f('enrolled'),eq(`paradise.local.${P.goa}`),f('gateKnown'),f('rescueContact')),
        requires:sceneSupport,costs:[stamina('player',-1),stamina(P.krieg,-1),attention(P.krieg)],
        description:'A bounded original physical contest during the source-motivated gate panic. Krieg spends his own finite body/attention on pressure; Hank remains his own living body. Each response discloses actual supplies, injury and effort. Withdrawal retains already spent costs and leaves the unrescued danger real. This is a scripted encounter, not general native person combat.'}),
    command('goa.recover','Treat your actual smoke and bruising · linen + herb + ration · 5 min',P.goa,L.pier,{once:false,
        requires:all(local(P.goa),f('playerInjured')),...timed(5,local(P.goa)),costs:[item('player',Q.cloth,-1),item('player',Q.herb,-1),item('player',K.ration,-1)],
        effects:[condition('player',I.smoke,'remove'),condition('player',I.bruise,'remove'),vital('player','health',3),vital('player','stamina',2),
            know('recovery','My actually spent linen, Golmoon leaf, food and five minutes eased this scene’s temporary smoke irritation and bruising, restoring at most three health/two stamina within my real maxima. Dead people, other effects, permanent marks, materials and source powers stayed separate.')]}),
    command('goa.rest','Rest away from smoke · time only · 6 min',P.goa,L.pier,{once:false,
        requires:all(local(P.goa),f('playerInjured')),...timed(6,local(P.goa)),effects:[condition('player',I.smoke,'remove'),condition('player',I.bruise,'remove'),
            know('quiet_recovery','Six quiet played minutes eased the temporary smoke and bruising. No food, health, stamina, attention, stock or dead person was restored.')]}),
    command('goa.hank_care','Offer surviving Hank actual supplied recovery at the gate · linen + herb + ration · 4 min',P.goa,L.gate,{
        ...contact(P.hank),requires:all(local(P.goa),f('hankSheltered'),f('hankNeedsCare')),
        ...timed(4,all(local(P.goa),f('hankSheltered')),true),costs:[item('player',Q.cloth,-1),item('player',Q.herb,-1),item('player',K.ration,-1),attention(P.hank)],
        effects:[condition(P.hank,I.smoke,'remove'),condition(P.hank,I.bruise,'remove'),vital(P.hank,'health',3),vital(P.hank,'stamina',3),af('hankCared'),
            know('hank_care','The surviving, present Hank consented to ordinary care. My counted linen, herb and food and his finite attention supported four minutes of recovery. His health/stamina improved within their actual maxima; the received care did not restore attention, rewrite the fire or reverse death.', 'player',P.hank),
            know('received_care','I accepted actual supplied care from the traveler after surviving the gate. My own native health and stamina changed; my office, attention, possessions and witnessed history remain mine.',P.hank,'player',true)]}),
    command('goa.hank_order','Supply recovered Hank’s personal duty-kit order · kit for 2 owned belli · 3 min',P.goa,L.gate,{
        ...contact(P.hank),requires:all(local(P.goa),f('oldArcClosed'),f('hankWorkReady')),
        ...timed(3,all(local(P.goa),f('oldArcClosed'),f('hankWorkSupported')),true),
        costs:[item('player',K.kit,-1),purse(P.hank,-2),attention(P.hank),stamina(P.hank,-1)],
        effects:[item(P.hank,K.kit,1),purse('player',2),af('hankOrder'),know('hank_order',
            'The living, present and actually recovered Hank commissioned one personal duty kit. My kit entered his own inventory; two of his actual belli paid me and his finite attention/body were spent. Smoke irritation or bruising would have blocked his careful acceptance. This private supply order grants no royal appointment, post-fire political authority or copied office.', 'player',P.hank),
            know('received_kit','After my actual shelter and bodily recovery I commissioned and received the traveler’s real kit using my own money, attention and effort. This is my personal supplied duty work, not a new royal decree or a refilled purse.',P.hank,'player',true)]}),
    command('goa.salvage','Recover one sound cache beam after the burned arc · 2 stamina · 4 min',P.goa,L.gray,{
        requires:all(local(P.goa),f('oldArcClosed'),f('recoverableCache')),claim:F+'cache_recovery',...timed(4,all(local(P.goa),f('oldArcClosed'),f('recoverableCache'))),costs:[stamina('player',-2)],
        effects:[item('player',K.log,1),wf('cacheRecovered'),old('cache',false),know('cache_recovery',
            'Recovered one sound beam from the actual small cache I had previously built and supplied. Its old timber has now changed custody; that cache no longer supplies an active material route. This is once-only recovery of previously spent property after the arc, not spontaneous salvage, shop refill or a reset of the warning history.')] }),
    ...[false,true].map(controlled=>command(controlled?'goa.rebuild_controlled':'goa.rebuild_ordinary',
        controlled?'Build retained district shelter with mastered rigging · log + rope + ration · 4 min':'Build retained district shelter ordinarily · 2 logs + rope + ration · 6 min',P.goa,L.gray,{
        ...contact(P.mia),claim:F+'shelter_claim',requires:all(local(P.goa),currentHands,f('oldArcClosed'),not(f('shelter')),...(controlled?[method,f('mastered')]:[])),
        ...(controlled?{powerId:I.method}:{}),...timed(controlled?4:6,all(local(P.goa),currentHands,f('oldArcClosed'),...(controlled?[f('methodFaculty'),f('mastered')]:[])),true),
        costs:[item('player',K.log,controlled?-1:-2),item('player',K.rope,-1),item('player',K.ration,-1),stamina('player',controlled?-2:-3),attention(P.mia)],
        effects:[{type:'site',actor:'player',siteId:I.shelter,operation:'open'},wf('shelter'),wf('shelterCapacity',2),af('shelter'),know('shelter',
            'Mia joined the actual two-person-scale shelter work with her own finite attention. My real timber, rope, ration and effort became a retained physical district support. Mastered rigging can save one log and two minutes; ordinary extra timber remains valid. No burned property or dead life was restored, and there is no compulsory daily maintenance.', 'player',P.mia)]})),
    command('goa.shelter_work','Use your retained shelter bench · log + held rope + 2 stamina · 3 min',P.goa,L.gray,{once:false,
        requires:all(local(P.goa),currentHands,f('shelter')),...timed(3,all(local(P.goa),currentHands,f('shelter')),false,I.shelter),
        costs:[item('player',K.log,-1),item('player',K.rope,-1),stamina('player',-2)],effects:[item('player',K.rope,1,true),item('player',K.kit,1),
            know('shelter_work','My retained district shelter supported three minutes of useful personal work. One actual log and two stamina became one native kit; the held rope returned once. It remains usable after personal or contracted return without regenerating stock, pay, or the source arc.')] }),
    command('goa.rin_order','Supply Rin’s changed-district cargo order · one actual kit for 2 owned belli',P.goa,L.pier,{
        ...contact(P.porter),requires:all(local(P.goa),f('oldArcClosed'),f('shelter'),eq('actor.book.paradise.porterMet')),
        ...timed(2,all(local(P.goa),f('oldArcClosed'),f('shelter')),true),costs:[item('player',K.kit,-1),purse(P.porter,-2),attention(P.porter)],
        effects:[item(P.porter,K.kit,1),purse('player',2),af('rinOrder'),know('rin_order','Supplied one real prepared kit for Rin’s separate changed-district cargo order. Rin paid two owned local belli and spent one finite attention; the kit entered their actual inventory. Their old pier repair and wages are separate conserved work, and this order cannot pay again.', 'player',P.porter)]}),
    ...['rescued','retreated','late','earlier_shelter','earlier_loss'].map(outcome=>command('goa.account_'+outcome,'Record the actual gate disposition with Mia',P.goa,L.gray,{
        ...contact(P.mia),claim:F+'rescue_account',visibleWhen:all(f('enrolled'),f('rescueAccountReady'),eq('world.'+F+'rescueOutcome',outcome)),
        requires:all(local(P.goa),f('rescueAccountReady'),eq('world.'+F+'rescueOutcome',outcome)),effects:[af('rescueAccount'),
            know('rescue_account',outcome==='rescued'?'Recorded my actual gate rescue and current wounds with the present Mia. Hank remains alive in his own body; his spent means, received accounts and the burned district persist.':
                outcome==='retreated'?'Recorded my actual retreat from the gate. Costs and damage already suffered remain spent. The endangered guard’s later own survival or death remains its physical outcome; retreat earned no rescue credit.':
                outcome==='late'?'Recorded that no supported rescue reached Hank before this original local danger window closed. His actual death and lost living contact persist; no return, craft outcome or report restores him.':
                    outcome==='earlier_shelter'?'Recorded Hank’s actually completed earlier shelter. The gate rescue was unnecessary because a received route or contained ignition already supported his own survival. No new rescue fee, injury or achievement was manufactured.':
                        'Recorded the existing loss of Hank before this new optional branch could intervene. His earlier committed death keeps its original cause and cannot become a newly claimed rescue-window failure, resurrected contact or repeated source event.', 'player',P.mia)]})),
    command('hub.return_account','Show the desk your own return work and attributed Goa account',P.hub,L.hub,{
        ...contact(P.employee),requires:all(local(P.hub),f('returnedMature'),f('bench')),...timed(2,all(local(P.hub),f('returnedMature'),f('bench')),true),
        costs:[attention(P.employee)],effects:[af('returnAccount'),know('return_account',
            'The present desk worker received my actual retained Goa account and shelter/work evidence after I physically returned. My bench, own learned method, materials, completed orders and the same changed Goa instance remain usable. This specific receipt grants no new survey payout, Hunter reward, source rank or employee office.', 'player',P.employee),
            know('received_return','I received the traveler’s actual new Goa account at our desk. It reports their original shelter/craft work and their attributed gate outcome, not my own eyewitness knowledge of Goa, a whole-world safety claim or another person’s private mission.',P.employee,'player',true)]}),
];

const assembly=all(local(P.goa),f('enrolled'),eq('world.book.goa.fire','burned'),eq('world.book.goa.hank','on_duty'),
    gte('paradise.goaElapsed',PARADISE_CAMPAIGN_WINDOW.assembly),not(f('rescueFinished')));
commands.push(
    npc('hank_gate','Hank spends his own duty effort reaching the endangered gate',P.hank,L.guard,{
        requires:all(assembly,eq(`paradise.support.${P.hank}`)),costs:[stamina(P.hank,-1),attention(P.hank)],effects:[{type:'relocate',actor:P.hank,location:L.gate},af('endangered',true,P.hank),wf('rescueOutcome','pending'),
            know('gate_arrival','I spent my own duty attention and effort reaching the actual gate after the district ignited. The original small crush is dangerous; I know neither the traveler’s unreceived route report nor a guaranteed future rescue.',P.hank,P.hank,true)]}),
    npc('krieg_gate','Krieg spends his own remaining escape effort approaching the gate',P.krieg,L.pier,{
        requires:all(assembly,f('gateOpen'),eq(`paradise.support.${P.krieg}`)),costs:[stamina(P.krieg,-1)],effects:[{type:'relocate',actor:P.krieg,location:L.gate},af('gatePressure',true,P.krieg),
            know('gate_escape','My own operation ignited the district and I now seek escape through the actually open gate. I spent my own body reaching this original bounded gate contact. My source-era aim is survival after the promised bargain fails, not an omniscient desire to punish this traveler.',P.krieg,P.krieg,true)]}),
    npc('hank_late','Hank’s unsupported gate danger ends in actual death',P.hank,L.gate,{
        requires:all(local(P.goa),f('enrolled'),f('hankDanger'),not(f('rescueWindow'))),costs:[],effects:[old('hank','dead'),wf('rescueOutcome','late'),
            vital(P.hank,'health',{fact:`paradise.health.${P.hank}`,scale:-1}),{type:'life',actor:P.hank,status:'dead',lethal:true,reason:'The original bounded gate rescue window closed after actual fire with no supported shelter/rescue.'},
            know('gate_loss','No supported rescue or own received-route shelter reached me before this bounded physical danger closed. My actual life ended; this is an authored alternative branch consequence, not an inevitable source restoration.',P.hank)]}),
);

const turns=[
    {cue:'Krieg presses for escape while Hank is caught at the actual gate. Choose how to gain a small working gap; pressure already spent Krieg’s own attention and body.',responses:[
        {id:'rigged_gap',label:'Rig a controlled working gap · held kit/rope + 2 stamina',requires:all(turnReady,method,f('controlled'),f('surveyed')),
            costs:[...ownTools,stamina('player',-2)],effects:[...returnTools,af('approach','rigged'),know('gap','Used my learned controlled line and personally inspected anchors to hold a small working gap. My kit/rope returned; the opposed pirate remains a separate actor. No cask, crew or general guard command was acquired.')]},
        {id:'timber_gap',label:'Brace an ordinary working gap · 2 logs + 3 stamina',requires:turnReady,
            costs:[item('player',K.log,-2),stamina('player',-3)],effects:[af('approach','timber'),know('gap','Spent two real logs and my effort on an original ordinary barrier that holds a small working gap. The consumed timber cannot also become shelter stock; no line method or source power was required.')]},
        {id:'paid_gap',label:'Pay for a brief breathing gap · 2 belli',requires:turnReady,costs:[purse('player',-2)],effects:[purse(P.krieg,2),af('approach','paid'),
            know('gap','Krieg accepted two actual belli for one small working gap while seeking his own escape. His purse changed; payment bought neither friendship, noble rights, source mission success nor guaranteed rescue.', 'player',P.krieg)]},
        {id:'exposed_gap',label:'Force an exposed gap · 3 health + 3 stamina + bruising',requires:all(turnReady,f('canExpose')),
            costs:[vital('player','health',-3),stamina('player',-3)],effects:[condition('player',I.bruise,'apply',18),af('approach','exposed'),know('gap',
                'Forced an original small gap under physical pressure. Three actual health, three stamina and temporary gate bruising were the disclosed cost. I did not defeat or loot Krieg, and my injury persists after withdrawal.')]},
        {id:'retreat_first',label:'Retreat now · retain the already spent admission effort',effects:[retreat,af('approach','retreated'),wf('rescueOutcome','retreated'),know('retreat','Withdrew before lifting Hank. The admission effort and Krieg’s spent pressure stay spent; no person was rescued, source event reset or item granted.')]},
    ]},
    {cue:'Hank needs an actual lift out of the dangerous pocket. Current source control, supplies, protection and each person’s own body determine the supported choice.',responses:[
        {id:'protected_lift',label:'Use the controlled line and current smoke wrap · held kit/rope + our effort',requires:all(turnReady,method,f('controlled'),f('surveyed'),f('wrapped')),
            costs:[...ownTools,stamina('player',-2),stamina(P.hank,-1)],effects:[...returnTools,...livingRescue,refine(1),af('lift','protected'),
                know('lift','My controlled line, still-active actual cloth wrap and inspected anchors supported this small rescue. I spent two stamina, Hank spent his own one, and the held tools returned. His living shelter is now actual; the fire, pirate, king and other civilian capacity stay separate.')]},
        {id:'ordinary_lift',label:'Use rope and your body · rope + 4 stamina + 2 health; Hank also strains',requires:all(turnReady,f('canLift')),
            costs:[item('player',K.rope,-1),stamina('player',-4),vital('player','health',-2),stamina(P.hank,-2),vital(P.hank,'health',-2)],
            effects:[...livingRescue,af('lift','ordinary'),condition('player',I.smoke,'apply',16),condition(P.hank,I.smoke,'apply',16),condition(P.hank,I.bruise,'apply',18),
                know('lift','My consumed rope and ordinary physical effort pulled Hank clear at the disclosed cost of two health/four stamina to me and two health/two stamina to his own body. Both received temporary smoke irritation; Hank also has bruising. Surviving does not heal those costs or establish a city-wide evacuation.')]},
        {id:'exposed_lift',label:'Hurry without a line · 4 health + 5 stamina; Hank loses 4 health',requires:all(turnReady,f('canHurry')),
            costs:[vital('player','health',-4),stamina('player',-5),vital(P.hank,'health',-4),stamina(P.hank,-2)],effects:[...livingRescue,af('lift','exposed'),
                condition('player',I.smoke,'apply',16),condition('player',I.bruise,'apply',18),condition(P.hank,I.smoke,'apply',16),condition(P.hank,I.bruise,'apply',18),
                know('lift','Chose the explicitly exposed hurry. My own body paid four health/five stamina; Hank’s own body paid four health/two stamina. He is alive and sheltered with retained smoke irritation and bruising. The rescue supplies no free recovery, pirate loot or source reward.')]},
        {id:'retreat_second',label:'Stop the lift and retreat · retain the actual gap costs',requires:not(eq('actor.'+F+'retreated')),effects:[retreat,wf('rescueOutcome','retreated'),know('retreat',
            'Stopped before the unsupported lift. Already paid materials, money, effort and injuries persist; the endangered Hank still needs a real supported shelter or faces the original closing window.')]},
        {id:'leave_first',label:'Continue the earlier retreat',requires:eq('actor.'+F+'retreated'),effects:[]},
    ]},
    {cue:'Conclude your own intervention. Rescue, wounds, lost means and unresolved danger stay separate from any later extraction or settlement.',responses:[
        {id:'supply_hank',label:'Give the rescued Hank your food · ration + his one attention',requires:all(thirdReady,f('hankAttention')),
            costs:[item('player',K.ration,-1),attention(P.hank)],effects:[vital(P.hank,'stamina',2),af('fed',true,P.hank),know('scene_account',
                'Hank consented to consume my actual food after the supported rescue. At most two of his spent stamina recovered; his injuries, remaining attention, office and possessions remain his. I receive no second rescue, wages or Hunter settlement.', 'player',P.hank),
                know('received_food','After my actual rescue I accepted and consumed the traveler’s food, spending my own remaining attention. My actual stamina recovered within my maximum; my wounds still need their distinct care.',P.hank,'player',true)]},
        {id:'record_wounds',label:'Conclude the rescue with its current wounds',requires:thirdReady,effects:[know('scene_account',
            'Concluded my actual gate rescue without buying recovery. Hank remains alive and sheltered; all suffered smoke, bruising, lost health, supplies and effort remain their actual owners. A separate later visit or treatment may help but cannot replay this rescue.')]},
        {id:'conclude_retreat',label:'Conclude the retreat with no rescue claim',requires:eq('actor.'+F+'retreated'),effects:[know('scene_account',
            'Concluded the actual retreat. Already spent gap/admission costs and injuries persist. Hank’s later own supported shelter or the closing danger determines his fate; my return does not reset either person.') ]},
    ]},
];

export const paradiseCampaignWithdrawalEffects=[af('retreated'),af('sceneClosed'),wf('sceneClosed'),wf('rescueOutcome','retreated'),
    know('withdrawal','Withdrew from the actual admitted gate scene. Already spent effort, materials, money and injuries persist. This finite intervention cannot be re-entered for a reset; an unrescued Hank still faces his own supported danger and closing window.')];
export const paradiseCampaignPostRescueWithdrawalEffects=[af('sceneClosed'),wf('sceneClosed'),know('scene_account',
    'Left the remaining gate conversation after my actually completed rescue. Hank remains alive and sheltered with his current wounds and spent means. No closing meal or further treatment was supplied; leaving this session cannot erase the performed lift or replay its reward.')];

export const paradiseCampaignSources=[{id:I.method,revision:1,label:'Independently acquired line rigging',kind:'technique',origin:'trained',grants:[],
    bioDetail:'Original paid or personally researched derivative of the learner’s actual bracing procedure. Ordinary hands, owned kit/rope, active source and personally inspected anchors control its bounded lift and craft consumers. No copied talent or mana.'}];
export const paradiseCampaignDefinitions={commands,conditions:[
    {id:I.smoke,revision:1,label:'Smoke irritation',stacking:'max',bioVisible:true,bioDetail:'Temporary irritation from the disclosed exposed Goa rescue. Player native perception ×0.9 and stamina efficiency ×0.9; Hank’s careful personal duty-kit order waits for recovery. No additional health drain.'},
    {id:I.guard,revision:1,label:'Ordinary smoke wrap',stacking:'max',bioVisible:true,bioDetail:'A spent cloth preparation for the exact sheltered gate-lift consumer; no general immunity or new protection rank.'},
    {id:I.bruise,revision:1,label:'Gate bruising',stacking:'max',bioVisible:true,bioDetail:'Temporary bruising from actual disclosed gate pressure. Player native dexterity ×0.9; Hank’s careful personal duty-kit order waits for recovery. The scene already paid its health cost.'}],
    sites:[{id:I.bench,revision:1,label:'Personally built district bench',capacity:1},{id:I.shelter,revision:1,label:'Retained small district shelter',capacity:1}],
    powers:[{id:I.method,revision:1,label:'Controlled line rigging',model:'practice',worlds:[P.hub,P.goa],capacity:1,
        execution:all(supported,method),description:'Own acquired ordinary procedure. Control2 supports a protected lift with an inspected anchor and spent smoke wrap; mastery3 reduces bench effort/time and saves one shelter log.'}],
    encounters:[{id:I.scene,revision:1,label:'The actual endangered gate',lethal:false,turns,
        settlement:[af('sceneClosed'),wf('sceneClosed'),know('scene_closed','This one admitted gate intervention ended. Its answers, spent means, actual rescue or retreat and current wounds are retained. Any later unrescued closing-window death is a distinct real world outcome; no source plot, character, inventory or return entitlement was reset.')]}],
    controllers:[{id:F+'hank_controller',revision:1,label:'Hank’s own bounded endangered duty',actorId:P.hank,interval:1,actions:[
        {commandId:F+'npc.hank_late',priority:20},{commandId:F+'npc.hank_gate',priority:10}]},
        {id:F+'krieg_controller',revision:1,label:'Krieg’s remaining source-era escape means',actorId:P.krieg,interval:1,actions:[{commandId:F+'npc.krieg_gate',priority:10}]}],
};
