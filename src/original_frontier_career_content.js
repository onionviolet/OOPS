// Original reversible proposals. Import is inert; existing simulation owners
// execute exact stock, purse, source, participant/site and publication effects.
const W = "base.frontier", P = "original_frontier", M = P + ".mira", N = P + ".wen";
const I = P + ".iven", H = P + ".halden", S = P + ".jun";
const T = P + ".load_tally", STOP = P + ".stop_procedure", SAMPLE = P + ".sample_check";
const LOG = JSON.stringify({id:"Rough wood log"}), KIT = JSON.stringify({id:"Prepared survey kit"});
const WOOD = JSON.stringify({id:"Wood log"}), ASH = JSON.stringify({id:"Ash wood log"});
const eq = (fact,value=true,reason) => ({fact,op:"eq",value,...(reason ? {reason} : {})});
const gte = (fact,value,reason) => ({fact,op:"gte",value,...(reason ? {reason} : {})});
const all = (...rules) => ({all:rules}), any = (...rules) => ({any:rules}), not = rule => ({not:rule});
const a = (key,value=true,reason) => eq("actor." + P + "." + key,value,reason);
const w = (key,value=true,reason) => eq("world." + P + "." + key,value,reason);
const af = (key,value=true,actor="player") => ({type:"fact",scope:"actor",actor,key:P + "." + key,value});
const wf = (key,value=true) => ({type:"world",worldId:W,key:P + "." + key,value});
const money = amount => ({type:"resource",native:true,actor:"player",key:"money",amount});
const res = (actor,key,amount) => ({type:"resource",actor,key,amount});
const coin = (actor,amount) => res(actor,"coins",amount);
const item = (key,amount,actor="player") => ({type:"item",actor,key,amount});
const stamina = (amount,actor="player") => ({type:"vital",actor,key:"stamina",amount});
const transfer = (key,count,from,to) => ({type:"transfer",key,count,from,to});
const know = (key,value,actor="player") => ({type:"knowledge",actor,key:P + "." + key,stage:"understood",value});
const memory = (actor,text) => ({type:"relationship",actor,target:"player",axis:"trust",amount:0,text});
const observe = key => ({type:"observation",scope:"world",key:P + "." + key,as:P + "." + key});
const progress = (field,actor="player") => ({type:"progress",actor,track:P + ".work",field,amount:1});
const owned = id => eq("power." + id + ".owned"), active = id => eq("faculty." + id + ".active");
const live = all(eq("actor.life","alive"),gte("vital.health",2,"Recover before committing work."));
const learned = all(a("freight.trained"),active(T)), returned = a("freight.villageRevisited");
const known = a("charter.known"), open = w("charter.state","open"), free = not(w("institution.settled"));
const settled = any(w("charter.state","settled"),w("charter.state","terminated"),w("charter.state","declined"));
const evidence = any(a("material.sheltered"),a("material.report"),a("explore.dossier"));
const realOrder = gte("progress." + P + ".work.charterOrders",1,"Complete an actual quoted order first.");
const mature = any(a("career.dispatchMature"),a("career.craftMature"),a("career.inquiryMature"),a("explore.return"),a("control.workday"),a("mastery.feat"));
const cmd = d => ({revision:1,worldId:W,group:P,actorId:"player",location:"Village",costs:[],effects:[],...d});
const npc = d => cmd({audience:["$actor"],...d});
const guard = (rule,contact=true) => ({completionRequires:rule,completionFailure:"refund",...(contact ? {completionCoLocated:true} : {})});
const ending = (id,text) => [af("ending." + id),know("ending." + id,text)];
const paidOrder = (key,text,employer) => [af("charter." + key),wf("charter." + key),progress("charterOrders"),know("charter." + key,text),memory(employer,text)];
const person = (id,label,resources) => ({id,revision:1,label,worldId:W,location:"Village",inventory:"simulation",provision:false,
    resources,body:{hands:2},vitals:{health:20,max_health:20,stamina:8,max_stamina:8}});

export const originalFrontierCareerSources = [
    {id:STOP,revision:1,label:"Ordinary stop-and-check procedure",kind:"knowledge",grants:[],
        bioDetail:"A willing learner's own acquired ordinary operation, with independent attention, tools, body and funds."},
    {id:SAMPLE,revision:1,label:"Iven's bounded sample examination",kind:"knowledge",grants:[],
        bioDetail:"The examiner's own ordinary operation; results apply to an actual supplied sample and declared use."},
];

const charter = [
    cmd({id:P + ".charter_hear_wen",label:"Hear Wen's four different return-order needs",once:true,location:"Town square",
        targetId:N,coLocated:true,participants:["$target"],visibleWhen:a("freight.townMet"),requires:a("freight.townMet"),
        requirementIds:["OF.ARC02","OF.PATH.DISPATCH","OF.MECH.DEMAND"],
        description:"Wen offers a corrected one-log delivery and a qualified report for one coin each from his remaining purse. Mira may separately buy one kit and one supported local check. Hearing accepts no work; each of four different orders is quoted and accepted separately.",
        effects:[af("charter.known"),af("charter.wenConsent"),wf("charter.wenConsent"),res(N,"returnLogDemand",1),res(N,"returnEvidenceDemand",1),
            know("charter.terms","Four finite needs: one corrected log, one tested kit, one qualified dossier comparison and one supported reserve check. Wen consents to his two one-coin Town fees. Mira must consent to her two Village fees in person. Each actual job reserves its exact inputs; an unsigned future quote creates no debt. Choose a viable subset, then close remaining quotes. Time never refills stock or funds.")]}),
    cmd({id:P + ".charter_hear_mira",label:"Hear Mira's reserve and return-lot terms",once:true,targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:returned,requires:all(returned,known),
        description:"Mira offers two own coins for one actual tested kit and one own coin for a supported local reserve check. Her retained log remains hers. A later written framework costs one coin for the writing service, a declared sink. No recurring dues or acceptance of every order.",
        effects:[af("charter.miraConsent"),wf("charter.miraConsent"),res(M,"returnKitDemand",1),res(M,"returnSupportDemand",1),
            know("charter.reserve","Mira consented to buy one actual prepared kit for two of her remaining coins and pay one coin for one supported reserve check. Written terms authorize separately accepted jobs, refunded on cancellation. Termination forfeits only the already spent one-coin writing fee; completed costs/results stay retained.")]}),
    cmd({id:P + ".charter_sign",label:"Sign the finite return charter · 1 coin writing fee",once:true,claim:P + ".charter.entry",
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:all(known,a("charter.miraConsent")),
        requires:all(live,a("charter.wenConsent"),a("charter.miraConsent"),free),costs:[money(-1)],
        description:"Both owners consented in separate actual meetings. One coin pays a declared writing-service sink. Promise truthful specifications and settlement only for work actually committed. Each of four orders remains optional, independently funded and separately accepted. Future quotes can close after current work settles.",
        effects:[af("charter.signed"),wf("charter.state","open"),wf("institution.settled",false),
            know("charter.signed","Signed finite terms after both actual consent meetings. No order was accepted by signing. One coin was spent on writing and remains spent on settlement/withdrawal.")]}),
    cmd({id:P + ".charter_decline",label:"Decline management and retain ordinary work",once:true,claim:P + ".charter.entry",
        targetId:M,coLocated:true,visibleWhen:all(known,returned),requires:free,
        effects:[af("charter.declined"),wf("charter.state","declined"),wf("institution.settled"),wf("institution.kind","none"),af("institution.known","none"),
            know("charter.closure","Declined the unsigned framework. No promise, fee or debt was created. Native work, learned tally, personal methods and finite specialist offers remain.")]}),
    cmd({id:P + ".order_corrected_log",label:"Deliver Wen's corrected lot · 1 log + 2 min · earn 1 coin",once:true,location:"Town square",
        targetId:N,coLocated:true,participants:["$target"],siteId:P + ".receiving_desk",duration:2,cancellation:"refund",automatable:true,routineDefault:3,powerId:T,
        visibleWhen:all(known,a("charter.signed")),requires:all(live,open,learned),...guard(all(open,active(T))),
        description:"Accept the smaller one-log specification. Hold your exact log in escrow with Wen's receiving slot, one demand and one coin. Completion transfers the reserved log count to Wen and pays his wage. No cargo is created. A routine target of three stops after this one funded need.",
        costs:[item(LOG,-1),stamina(-1),coin(N,-1),res(N,"returnLogDemand",-1)],
        effects:[item(LOG,1,N),money(1),...paidOrder("corrected","Wen received one real held log under the corrected smaller specification and paid one coin. No larger quantity was promised.",N)]}),
    cmd({id:P + ".order_prepared_kit",label:"Supply Mira's tested prepared lot · 1 kit + 3 min · earn 2 coins",once:true,
        targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",duration:3,cancellation:"refund",automatable:true,routineDefault:3,
        visibleWhen:all(known,a("charter.signed")),requires:all(live,open,a("material.prepared")),...guard(open),
        description:"Reserve one actual Prepared survey kit acquired through existing recipes or lawful trade. Completion transfers it to Mira under the tested specification and pays her two reserved coins. This sale supplies no duplicate craft output or replayed native reward.",
        costs:[item(KIT,-1),coin(M,-2),res(M,"returnKitDemand",-1)],
        effects:[item(KIT,1,M),money(2),...paidOrder("prepared","Mira received the actual held kit under the tested prepared-stock order and paid two own coins. Existing native crafting/trade supplied it.",M)]}),
    cmd({id:P + ".order_qualified_report",label:"Compare Wen's real lot with your dossier · 3 min · earn 1 coin",once:true,location:"Town square",
        targetId:N,coLocated:true,participants:["$target"],siteId:P + ".receiving_desk",duration:3,cancellation:"refund",automatable:true,routineDefault:3,
        visibleWhen:all(known,a("charter.signed"),a("explore.dossier")),requires:all(live,open,a("explore.dossier")),...guard(open),
        description:"Reserve an actual Wen-owned log and return it after comparing your earned dossier with its handling use. Wen's one demand/coin fund this report. A qualified local dossier is not an atlas; no cargo donation or native quest reward is required.",
        costs:[item(LOG,-1,N),stamina(-1),coin(N,-1),res(N,"returnEvidenceDemand",-1)],
        effects:[item(LOG,1,N),money(1),...paidOrder("evidence","Compared the actual Wen-owned sample with the earned local dossier. Returned the same held count; Wen paid one coin for the qualified handling report.",N)]}),
    cmd({id:P + ".order_supported_check",label:"Apply the supported workday to Mira's reserve · 2 min · earn 1 coin",once:true,
        targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",duration:2,cancellation:"refund",automatable:true,routineDefault:3,
        visibleWhen:all(known,a("charter.signed"),a("control.workday")),requires:all(live,open,a("control.workday")),...guard(open),
        description:"Apply the stop/handling procedure from a newly completed protected or safe-parent workday. Hold Mira's real local log and return it after checking. Her one demand/coin are finite. An old native clear or practice duel alone cannot supply the workday receipt.",
        costs:[item(LOG,-1,M),stamina(-1),coin(M,-1),res(M,"returnSupportDemand",-1)],
        effects:[item(LOG,1,M),money(1),...paidOrder("support","Applied the new supported workday procedure to Mira's actual held reserve, returned the log and settled her one demand/coin.",M)]}),
    cmd({id:P + ".charter_settle_orders",label:"Settle the chosen orders and close future quotes",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:a("charter.signed"),requires:all(open,realOrder),
        description:"Finish or cancel current work first. Signing never accepted all four orders. Record the delivered subset and close remaining unsigned quotes; writing fee, goods and earned pay remain. The institution choice still needs later evidence and owners' consent.",
        effects:[af("charter.settled"),wf("charter.state","settled"),know("charter.closure","Settled the chosen actual return orders and closed unsigned future quotes. Completed transfers/payments and the spent writing fee remain.")]}),
    cmd({id:P + ".charter_terminate",label:"Terminate the signed charter under its stated terms",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:a("charter.signed"),requires:all(open,free),
        description:"Finish/cancel current work first. Close this actually signed charter. The writing fee, consumed samples and completed results remain; no debt, reset, backpay or home destruction. Future work needs a separately funded new cause.",
        effects:[af("charter.terminated"),wf("charter.state","terminated"),wf("institution.settled"),wf("institution.kind","closed"),af("institution.known","closed"),
            ...ending("OF.END.05","Terminated an actually signed charter under its disclosed terms. Its writing fee, consumed samples and completed work remain in history. This counter closes for the charter; learned methods, observations, home and native livelihoods survive. A future repair is a new funded project, not an erased failure or missed wage.")]}),
];

const materials = [
    cmd({id:P + ".material_meet",label:"Meet Iven and hear his limited stock question",once:true,targetId:M,coLocated:true,
        visibleWhen:returned,requires:returned,requirementIds:["OF.ARC03","OF.PATH.CRAFT","OF.PATH.INQUIRY","OF.MECH.NPC"],
        description:"Mira introduces Iven at Village. He has six coins, one sampling allowance, two attention slots and his own body/stamina/trained examination. He suspects an unsuitable use, not sabotage. An actual sample/tool and permission must still be supplied.",
        effects:[{type:"spawn",personId:I,definitionId:I},{type:"site",actor:I,siteId:P + ".material_bench",operation:"open"},
            af("material.met"),af("material.willing",true,I),wf("material.consent",false),wf("material.npcDone",false),
            {type:"power",actor:I,powerId:SAMPLE,operation:"learn"},{type:"power",actor:I,powerId:SAMPLE,operation:"refine",amount:1},
            {type:"source",actor:I,sourceId:SAMPLE,operation:"grant",origin:"trained",awakened:true,active:true},
            know("material.question","Iven offered a bounded examination. His suspicion is a claim, not a diagnosis or culprit. Sheltered rough stock need not meet an exposed-load specification."),
            know("material.question","I own my ordinary examination and can spend one allowance, coin and stamina on a permitted actual sample if a real kit is supplied.",I)]}),
    cmd({id:P + ".material_sheltered_test",label:"Test one owned log for sheltered use · 4 min + 1 stamina",once:true,
        duration:4,cancellation:"refund",siteId:P + ".material_bench",visibleWhen:a("material.met"),requires:live,
        description:"Hold one actual player-owned rough log in escrow for an ordinary fitting and return it on completion. Supports sheltered stock only. No rare quality or waterproof certificate. Cancellation refunds the held goods and stamina.",
        costs:[item(LOG,-1),stamina(-1)],effects:[item(LOG,1),af("material.sheltered"),af("material.sampleOwner","player"),af("material.sampleKey",LOG),
            know("material.sheltered","The actual held player log fitted sheltered support and was returned. Exposure remains unknown; this narrow result permits a smaller sheltered specification.")]}),
    ...[["ordinary",5,2,null],["timber",3,1,"frontier.timber_judgment"]].map(([id,duration,effort,powerId]) => cmd({
        id:P + ".material_prepared_" + id,label:"Test prepared handling · 1 kit + 1 log · " + duration + " min",once:true,
        claim:P + ".material.prepared",duration,cancellation:"refund",siteId:P + ".material_bench",...(powerId ? {powerId,output:1} : {}),
        visibleWhen:all(a("material.sheltered"),...(powerId ? [owned(powerId)] : []),not(a("material.prepared"))),
        requires:all(live,a("material.sheltered")),...(powerId ? guard(active(powerId),false) : {}),
        description:"Hold one actual log and consume one real kit as test bracing in a handling comparison. Return the log at completion. The learned Timber judgment variant reduces five minutes/two stamina to three/one. No old kit reward repeats; neither result certifies all timber or exposure.",
        costs:[item(LOG,-1),item(KIT,-1),stamina(-effort)],
        effects:[item(LOG,1),af("material.prepared"),af("material.trainedTest",!!powerId),
            know("material.prepared","The real kit-supported test held this rough-log sample aligned. The held log was returned; the bracing kit was consumed. This supports the particular prepared-kit order, with bare exposed freight still unproven.")]})),
    cmd({id:P + ".material_limit_test",label:"Safely test the bare exposed limit · 1 kit + 3 min",once:true,duration:3,cancellation:"forfeit",
        siteId:P + ".material_bench",visibleWhen:a("material.sheltered"),requires:all(live,a("material.sheltered")),
        description:"Use one actual kit as a sacrificial alignment gauge and stop when the unsupported arrangement slips. No valuable cargo is loaded or log taken. The kit/stamina are consumed even on cancellation. This safely observed failure neither injures the player nor certifies unsafe freight.",
        costs:[item(KIT,-1),stamina(-1)],effects:[af("material.limitation"),af("material.attemptFailed"),
            know("material.limitation","The bare exposed arrangement failed the alignment gauge and was safely stopped before loading cargo. One kit/stamina were spent. The limitation remains beside any later prepared success, not overwritten by it.")]}),
    cmd({id:P + ".material_allow_iven",label:"Permit Iven's independent examination · supply 1 kit",once:true,
        targetId:I,coLocated:true,participants:["$target",M],visibleWhen:a("material.met"),requires:all(returned,w("material.consent",false)),
        description:"Mira consents to the use of her actual retained log. Transfer one real kit into Iven's ownership. He independently spends his one allowance/coin/stamina, consumes the kit, holds and returns the sample. The player is free during his job. Hear the result only at a later actual meeting.",
        costs:[transfer(KIT,1,"player",I)],effects:[wf("material.consent"),af("material.requested"),
            know("material.request","Mira permitted one reserve examination and Iven received an actual supplied kit. His independent result is pending and unknown."),
            know("material.consent","Mira permitted one actual reserve sample. I received a kit and may spend my own allowance/coin/stamina.",I)]}),
    npc({id:P + ".iven_examine",label:"Iven examines the permitted reserve sample",actorId:I,targetId:M,coLocated:true,participants:["$target"],
        duration:4,cancellation:"refund",once:true,siteId:P + ".material_bench",powerId:SAMPLE,
        requires:all(w("material.consent"),a("material.willing")),...guard(all(w("material.consent"),a("material.willing"),active(SAMPLE))),
        costs:[item(LOG,-1,M),item(KIT,-1,I),coin(I,-1),res(I,"samplingAllowance",-1),stamina(-1,I)],
        effects:[item(LOG,1,M),wf("material.npcDone"),af("material.examined",true,I),
            know("material.result","Examined Mira's actual held log and returned it. My kit was consumed as test bracing; my allowance, coin (measuring-service sink) and stamina paid this bounded work. It fits sheltered use; bare exposure is not certified.",I),
            know("material.result","Iven returned my actual sampled reserve. His supplied kit was consumed, not my reserve.",M)]}),
    cmd({id:P + ".material_iven_report",label:"Hear Iven's completed sample report",once:true,targetId:I,coLocated:true,participants:["$target"],
        visibleWhen:a("material.requested"),requires:w("material.npcDone"),
        effects:[observe("material.npcDone"),af("material.report"),know("material.report","At this actual meeting Iven reported his completed permitted test. Mira's actual log was returned, the kit consumed and Iven's own allowance/coin/stamina spent. His attributed narrow result supports sheltered use. This is last-known completed evidence, not live private telemetry.")]}),
    cmd({id:P + ".material_decline",label:"Leave the proposed sample unaccepted with its owner",once:true,visibleWhen:a("material.met"),
        requires:all(not(a("material.requested")),not(a("material.sheltered"))),
        effects:[af("material.declined"),know("material.refusal","Declined the proposed sample before acceptance. It remains with its actual owner. No diagnosis, contaminated bag, cost, debt or native-inventory rejection was created.")]}),
    cmd({id:P + ".material_downgrade",label:"Agree a sheltered specification from limited evidence",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:a("material.met"),requires:evidence,
        effects:[af("material.standardAgreed"),wf("material.standardAgreed"),know("material.specification","Mira consents to a sheltered-use specification based on the actual sample/report or qualified dossier. Exposure remains unknown. This is partial acceptance of a declared use, not a diagnosis or blame.")]}),
    ...[["wood",WOOD,4],["ash",ASH,5]].map(([id,key,duration]) => cmd({
        id:P + ".material_compare_" + id,label:"Compare owned rough and " + (id === "ash" ? "ash" : "ordinary wood") + " samples · " + duration + " min",once:true,
        duration,cancellation:"refund",siteId:P + ".material_bench",visibleWhen:all(a("material.sheltered"),gte("item." + key,1)),
        requires:all(live,a("material.sheltered")),
        description:"Both exact native material keys must actually be in your bag through earned gathering or lawful acquisition. Hold one rough and one comparison log, then return both. One real kit is consumed as the test's bending gauge. The declared result concerns this frame use only; a rare material is not universally better and no native material quality/provenance schema is added.",
        costs:[item(LOG,-1),item(key,-1),item(KIT,-1),stamina(-1)],
        effects:[item(LOG,1),item(key,1),af("material." + id + "Compared"),know("material." + id,
            id === "ash" ? "The actual held ash sample flexed through the tested reserve-frame recovery while the rough control needed a second bearing. Both logs returned; the real bending-gauge kit was consumed. One ash log can replace two rough logs in this specific constructed frame; its acquisition cost and other uses remain distinct."
                : "The actual held ordinary Wood log and rough control both supported the sheltered bearing; the comparison did not certify exposure or make the ordinary log a kit. Both samples returned and the actual gauge kit was consumed. Existing native recipes retain their distinct material choices.")]})),
    cmd({id:P + ".material_frame",label:"Build and trial a sound reserve frame · 2 logs + 1 kit · 6 min",once:true,
        claim:P + ".material.frame",duration:6,cancellation:"refund",siteId:P + ".material_bench",targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:a("material.prepared"),requires:all(live,a("material.prepared"),a("material.limitation"),w("material.standardAgreed")),
        ...guard(w("material.standardAgreed")),
        description:"Two actual player logs become the fixed Village reserve frame; one kit becomes its installed lashings. Hold Mira's real log for a harder loaded trial and return it. The constructed structure and earlier success/limitation establish a mature craft result. It enables two-minute funded checks instead of four-minute ordinary checks; consumed construction materials do not reappear.",
        costs:[item(LOG,-2),item(KIT,-1),item(LOG,-1,M),stamina(-2)],
        effects:[item(LOG,1,M),af("material.frame"),wf("material.frame"),af("career.craftMature"),
            know("career.craft","Built the fixed Village reserve frame from two actual owned logs and one kit, then trialled it with Mira's held real log and returned that sample. Prior prepared success and safe bare limitation support the result. Its fixed physical support halves supported local check time.")]}),
    cmd({id:P + ".material_frame_ash",label:"Build the specifically tested ash frame · 1 ash log + 1 kit · 5 min",once:true,
        claim:P + ".material.frame",duration:5,cancellation:"refund",siteId:P + ".material_bench",targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:a("material.ashCompared"),requires:all(live,a("material.ashCompared"),a("material.prepared"),a("material.limitation"),w("material.standardAgreed")),
        ...guard(w("material.standardAgreed")),
        description:"Consume one actual Ash wood log and one actual kit in the fixed frame, using the specifically completed ash/rough comparison. Hold and return Mira's real rough log in the harder loaded trial. This saves one bearing and one minute in this authored use; it does not turn every rare material into an upgrade or unlock native gathering.",
        costs:[item(ASH,-1),item(KIT,-1),item(LOG,-1,M),stamina(-2)],
        effects:[item(LOG,1,M),af("material.frame"),wf("material.frame"),af("career.craftMature"),af("material.frameMaterial","ash"),
            know("career.craft","The specifically tested ash sample justified one actual ash log and one kit in the constructed reserve frame. Mira's held trial log returned. This particular structure supports shorter local checks; consumed construction materials remain consumed and rare-material acquisition remains real.")]}),
];

const careers = [
    cmd({id:P + ".dispatch_reconcile",label:"Reconcile actual accepted stock and the held reserve · 4 min",once:true,
        duration:4,cancellation:"refund",powerId:T,targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",
        visibleWhen:all(returned,learned),requires:all(live,learned,a("freight.reserveChecked"),a("freight.receivingChecked"),realOrder,evidence),
        ...guard(active(T)),requirementIds:["OF.PATH.DISPATCH","OF.MECH.PROGRESSION"],
        description:"Use the two actually completed checks, Wen's heard receiving record and one new qualified return order. Hold Mira's real local reserve during reconciliation and return it. This produces an accountable new agreement procedure, not remote Town inspection, goods or repeated native XP.",
        costs:[item(LOG,-1,M),stamina(-1)],effects:[item(LOG,1,M),af("career.dispatchMature"),
            know("career.dispatch","Reconciled the actual checked local reserve, Wen's heard acceptance and a newly completed qualified return order. Held/returned the physical reserve; distinguished owned, promised and accepted quantities. This process supports consented split terms without disclosing private purse balances.")]}),
    ...[["ordinary",3,null],["joint",2,"frontier.shared_inquiry"]].map(([id,duration,powerId]) => cmd({
        id:P + ".inquiry_reconcile_" + id,label:"Compare your returned dossier with the actual sample limit · " + duration + " min",once:true,
        claim:P + ".career.inquiry",duration,cancellation:"refund",targetId:I,coLocated:true,participants:["$target"],
        ...(powerId ? {powerId,output:1} : {}),visibleWhen:all(a("material.met"),a("explore.dossier"),...(powerId ? [owned(powerId)] : []),not(a("career.inquiryMature"))),
        requires:all(live,a("explore.return"),evidence,a("material.limitation")),...(powerId ? guard(active(powerId)) : {}),
        description:"Iven consents to one of his two actual attention slots for this new returned-dossier/observed-limitation comparison. Shared inquiry shortens it from three to two minutes. Personal observation and offered claims retain their different sources; no map, copied ability or old quest reward.",
        costs:[stamina(-1),res(I,"attention",-1)],effects:[af("career.inquiryMature"),
            know("career.inquiry","Compared the actual returned local dossier with the observed material limit in an actual consenting meeting. Recommend sheltered or tested prepared handling only. Retain firsthand field evidence separately from Iven's offered examination; no unseen route or broad certification.")]})),
    cmd({id:P + ".fund_next_local_need",label:"Fund three new local reserve checks · 3 coins to Mira",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:w("institution.settled"),
        requires:all(settled,any(w("institution.kind","small_public"),w("institution.kind","resilient_public"),w("institution.kind","private"))),
        description:"Voluntarily transfer three native coins to Mira's existing purse in one transaction. She consents to three real local checks, each using her actual reserve log and paying one coin. A finite routine defaults to three; it pauses without source, stock, stamina, funds, demand, contact, site or supported clock. It never accepts new work or refills a budget.",
        costs:[money(-3)],effects:[coin(M,3),res(M,"localCheckDemand",3),af("routine.funded"),wf("routine.funded"),
            know("routine.terms","Transferred three native coins into Mira's own purse for three newly consented reserve checks. Each future unit reserves exact physical goods, her one wage and one remaining need. Default target three; cancellation refunds only current reserved means and grants no output/pay.")]}),
    ...[["ordinary",4,learned],["frame",2,a("material.frame")]].map(([id,duration,method]) => cmd({
        id:P + ".routine_" + id + "_check",label:"Check the next funded reserve lot · " + duration + " min · earn 1 coin",
        targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",duration,cancellation:"refund",automatable:true,routineDefault:3,
        visibleWhen:all(a("routine.funded"),method),requires:all(live,w("routine.funded"),method),...guard(all(w("routine.funded"),method)),
        description:"Reserve only the next actual Mira log, one demand and one purse coin. Return the inspected count and settle one wage on completion. The built tested frame halves the ordinary four-minute period. Finite target defaults to three; pause/cancel/resume preserve the remaining target and current job's stated refund terms.",
        costs:[item(LOG,-1,M),coin(M,-1),res(M,"localCheckDemand",-1),stamina(-1)],
        effects:[item(LOG,1,M),money(1),progress("localChecks"),know("routine.last","Completed one actual held local reserve check; returned Mira's log and paid her reserved coin. One funded demand settled. Future target units remain separate commitments.")]})),
    cmd({id:P + ".specialist_quote",label:"Hear Iven's finite mature comparison need",once:true,targetId:I,coLocated:true,participants:["$target"],
        visibleWhen:a("material.met"),requires:all(mature,settled),
        description:"Iven offers two one-coin comparisons from his actual remaining purse. This is a new named need, not a calendar refill. Hearing accepts no work. Management is unnecessary.",
        effects:[af("specialist.quoted"),res(I,"specialistDemand",2),know("specialist.quote","Iven offered two qualified mature comparisons at one of his own coins each, backed by his actual remaining purse. Each real completion settles one demand; no future refill is promised.")]}),
    cmd({id:P + ".specialist_compare",label:"Complete a mature paid comparison · 3 min · earn 1 coin",duration:3,cancellation:"refund",
        targetId:I,coLocated:true,participants:["$target"],siteId:P + ".material_bench",automatable:true,routineDefault:3,
        visibleWhen:a("specialist.quoted"),requires:all(live,mature,settled),...guard(settled),
        description:"Hold one actual player-owned log, apply the mature procedure/dossier, return it and supply one qualified comparison. Iven reserves one actual coin and demand. Default target three pauses after the two funded requests; completion grants no copied source or repeated native XP.",
        costs:[item(LOG,-1),coin(I,-1),res(I,"specialistDemand",-1),stamina(-1)],
        effects:[item(LOG,1),money(1),af("specialist.output"),progress("specialistReports"),know("specialist.last","Completed a qualified mature comparison on the actual held player sample, returned it, supplied Iven one report and settled his reserved coin/demand.")]}),
];

const counter = [
    cmd({id:P + ".buyer_meet",label:"Hear Halden's lawful finite offer",once:true,targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:returned,requires:all(returned,evidence),requirementIds:["OF.ARC04","OF.MECH.CONSEQUENCE"],
        description:"Mira invites Halden to state his actual offer. He has twelve coins, two appointments and no free stock. Four coins buy two actual logs and exclusive future service. A two-coin one-log split permits a smaller public remainder. No sale/capacity change occurs on introduction and no sabotage is inferred.",
        effects:[{type:"spawn",personId:H,definitionId:H},af("buyer.met"),wf("buyer.open"),wf("buyer.sale","none"),
            know("buyer.terms","Halden offers four own coins for two actual logs and Mira's consenting exclusive service, or two coins for one log alongside a smaller public counter. Mira retains stock until a sale actually settles. Both owners consent to negotiate. Legal terms do not imply sabotage.")]}),
    cmd({id:P + ".buyer_supply_lot",label:"Sell Mira one real substitute log · earn 1 coin",once:true,targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:a("buyer.met"),requires:all(free,w("buyer.open")),
        description:"Mira buys one real player log for one actual coin, supplementing her retained log. This is a paid lawful substitute, not a donation. A later split can sell one and retain the original reserve; an exclusive sale needs two actual logs.",
        costs:[item(LOG,-1),coin(M,-1)],effects:[item(LOG,1,M),money(1),af("buyer.substitute"),wf("buyer.substitute"),
            know("buyer.substitute","Mira purchased one actual owned player log for her one coin. Her original reserve and this substitute can form a real two-log lot if still available. No extra inventory was created.")]}),
    cmd({id:P + ".counter_small",label:"Settle the one-log split and smaller public counter · 4 min",once:true,claim:P + ".institution.choice",
        duration:4,cancellation:"refund",targetId:M,coLocated:true,participants:["$target",H],siteId:P + ".reserve_desk",
        visibleWhen:a("buyer.met"),requires:all(live,settled,free,realOrder,evidence,w("buyer.open")),...guard(all(free,w("buyer.open"))),
        description:"Mira and Halden consent to lower public throughput and a real one-log sale. Hold two actual Mira logs: transfer one to Halden and return one as her conserved local reserve at completion. His two coins/one appointment pay the split. No player donation or all-four-order completion required; the smaller promise is explicit.",
        costs:[item(LOG,-2,M),coin(H,-2),res(H,"appointments",-1),stamina(-1)],
        effects:[item(LOG,1,H),item(LOG,1,M),coin(M,2),wf("buyer.open",false),wf("buyer.sale","split"),wf("institution.settled"),wf("institution.kind","small_public"),af("institution.known","small_public"),
            ...ending("OF.END.01","An actual qualified order and adequate limited evidence led to both owners' consented split. Halden received one actual log and paid Mira two coins; another real log remains her local reserve. The smaller public counter keeps lower feasible throughput and finite funded work. A larger promise was not falsely fulfilled."),memory(M,"Signed the smaller public terms while retaining one actual reserve."),memory(H,"Paid two own coins for the lawful one-log split.")]}),
    cmd({id:P + ".counter_prepare_buffer",label:"Build the substitute public buffer · 1 log + 1 kit · 4 min",once:true,
        duration:4,cancellation:"refund",targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",
        visibleWhen:a("buyer.met"),requires:all(live,settled,free,a("material.prepared")),
        description:"Supply one real log into Mira's ownership as a substitute buffer. Consume one real kit as its installed support. This prepares one public operation, not regional/native stock, and does not itself sign the agreement. Both owners' consent still matters.",
        costs:[item(LOG,-1),item(KIT,-1),stamina(-1)],effects:[item(LOG,1,M),af("institution.preparedBuffer"),wf("institution.preparedBuffer"),
            know("institution.buffer","Installed one actual substitute log owned by Mira and consumed one real support kit at the counter. This concrete prepared buffer supports a later feasible public agreement; no stock copied.")]}),
    cmd({id:P + ".counter_resilient",label:"Agree prepared public service and one funded next need · 4 min",once:true,claim:P + ".institution.choice",
        duration:4,cancellation:"refund",targetId:M,coLocated:true,participants:["$target",H],siteId:P + ".reserve_desk",
        visibleWhen:a("buyer.met"),requires:all(live,settled,free,realOrder,a("material.prepared"),w("buyer.open"),any(a("institution.preparedBuffer"),a("control.workday"))),
        ...guard(all(free,w("buyer.open"))),
        description:"Use the tested preparation and actual substitute buffer or completed supported workday. Mira consents to retain an actual held reserve log and one next need funded from her existing purse; Halden consents to close his unsigned exclusive offer. Reserve and return her coin/log during signing, then debit that actual coin only when the next check commits. No sale or wage occurs just from calling service resilient.",
        costs:[item(LOG,-1,M),coin(M,-1),res(H,"appointments",-1),stamina(-1)],
        effects:[item(LOG,1,M),coin(M,1),res(M,"resilientDemand",1),wf("buyer.open",false),wf("buyer.sale","declined"),wf("institution.settled"),wf("institution.kind","resilient_public"),af("institution.known","resilient_public"),
            ...ending("OF.END.02","Tested preparation plus actual substitute resources or a completed supported workday made one feasible public operation possible. Mira retained her real inspected log and agreed one funded next check; Halden closed his unsigned offer by consent. Future capacity still depends on actual stock, worker means and funds."),memory(H,"Closed the unsigned offer by consent; no duel erased a contract.")]}),
    cmd({id:P + ".counter_resilient_check",label:"Complete the resilient next check · 2 min · earn 1 coin",once:true,
        duration:2,cancellation:"refund",targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",
        visibleWhen:a("institution.known","resilient_public"),requires:all(live,w("institution.kind","resilient_public")),...guard(w("institution.kind","resilient_public")),
        costs:[item(LOG,-1,M),coin(M,-1),res(M,"resilientDemand",-1),stamina(-1)],
        effects:[item(LOG,1,M),money(1),af("institution.nextComplete"),know("institution.next","Completed the service's real next check, holding/returning Mira's owned log and settling one demand with one of her coins. No infinite wages or stock refill.")]}),
    cmd({id:P + ".counter_private",label:"Fulfil the paid exclusive agreement · 2 logs · 3 min",once:true,claim:P + ".institution.choice",
        duration:3,cancellation:"refund",targetId:M,coLocated:true,participants:["$target",H],siteId:P + ".reserve_desk",
        visibleWhen:a("buyer.met"),requires:all(live,settled,free,evidence,w("buyer.open")),...guard(all(free,w("buyer.open"))),
        description:"Mira chooses to sell two actual owned logs for Halden's four own coins and exclusive future service. Hold goods, payment and one appointment, then transfer stock/payment once. Public quotes close for this agreement. Native shops, home and personal careers continue; reopening requires new actual consent.",
        costs:[item(LOG,-2,M),coin(H,-4),res(H,"appointments",-1),stamina(-1)],
        effects:[item(LOG,2,H),coin(M,4),wf("buyer.open",false),wf("buyer.sale","exclusive"),wf("institution.settled"),wf("institution.kind","private"),af("institution.known","private"),
            ...ending("OF.END.04","Mira fulfilled a lawful paid exclusive agreement: two actual held logs became Halden's and four of his coins became hers. Public service closes for this agreement; legitimate private work/native livelihoods remain. Consent and payment persist; fighting the buyer does not erase the contract."),memory(M,"Chose actual paid private terms after earlier obligations settled.")]}),
    cmd({id:P + ".counter_withdraw",label:"Close the unsigned counter proposal and retain its results",once:true,claim:P + ".institution.choice",
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:a("buyer.met"),requires:all(settled,free),
        effects:[wf("buyer.open",false),wf("institution.settled"),wf("institution.kind","none"),af("institution.known","none"),
            know("institution.withdrawal","Closed this optional unsigned counter after resolving earlier work. No stock transferred, public result claimed or unsigned promise broken. Personal results/native livelihoods remain; a later project requires new funds/permission.")]}),
    cmd({id:P + ".specialist_settle",label:"Retain the proven practice and decline further management",once:true,
        visibleWhen:all(returned,mature),requires:all(settled,w("institution.settled"),mature,
            any(a("specialist.output"),a("career.craftMature"),a("career.inquiryMature"),a("explore.return"),a("control.workday"),a("mastery.insight"))),
        requirementIds:["OF.END.03","OF.ARC05","OF.MECH.HANDOFF"],
        effects:[af("career.specialist"),af("management.retired"),...ending("OF.END.03","A demonstrated mature craft/inquiry/control/mastery result or returned dossier remains a useful personal practice. Further management was consciously declined after the earlier agreement was separately resolved. Native work, rest, travel and finite elective paying customers continue. No final declaration manufactured mastery or a new institution.")]}),
];

const succession = [
    cmd({id:P + ".successor_meet",label:"Meet a willing learner for one ordinary local operation",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:all(returned,mature),requires:all(settled,w("institution.settled"),mature),
        requirementIds:["OF.ARC05","OF.PATH.STEWARD","OF.MECH.HANDOFF","OF.MECH.NPC"],
        description:"Mira introduces Jun with two actual hands, eight stamina and two attention. No tools, funds, method or player stats are cloned. A consented lesson and actual supplied kit/funds must precede one independent contribution. Introduction accepts no work.",
        effects:[{type:"spawn",personId:S,definitionId:S},{type:"site",actor:S,siteId:P + ".teaching_mat",operation:"open"},
            af("successor.met"),af("successor.willing",true,S),wf("successor.willing"),wf("successor.taught",false),wf("successor.funded",false),wf("successor.completed",false),
            know("successor.offer","Jun willingly discusses one ordinary stop-and-check operation. Their own body/stamina/limited attention exist, but their operation/tool/funds must actually be acquired before independent work.")]}),
    cmd({id:P + ".successor_teach",label:"Teach Jun an ordinary stop procedure · 3 min + 1 stamina",once:true,
        duration:3,cancellation:"refund",targetId:S,coLocated:true,participants:["$target"],siteId:P + ".teaching_mat",
        visibleWhen:a("successor.met"),requires:all(live,learned,w("successor.willing"),evidence,any(a("material.limitation"),a("control.workday"),a("mastery.insight"))),
        ...guard(all(active(T),w("successor.willing"))),
        description:"Demonstrate only the ordinary portion you actually know: stop, hold, compare the declared count/use, decline unsupported continuation. Jun spends their own attention during actual contact. Completion grants Jun their own trained operation/mastery one, not Rat-step, magic, anatomy or player stats. Cancellation teaches nothing.",
        costs:[stamina(-1),res(S,"attention",-1)],
        effects:[af("successor.taught"),af("successor.taught",true,S),wf("successor.taught"),
            {type:"power",actor:S,powerId:STOP,operation:"learn"},{type:"power",actor:S,powerId:STOP,operation:"refine",amount:1},
            {type:"source",actor:S,sourceId:STOP,operation:"grant",origin:"trained",awakened:true,active:true},
            know("successor.lesson","Jun completed the actual willing ordinary lesson with their own attention. Their operation/source is acquired, but teaching granted no tool, funds, completed task or copied player ability."),
            know("successor.lesson","I learned my own ordinary stop-and-check operation. Actual tools/funds/body/stamina still determine whether I can execute it.",S)]}),
    cmd({id:P + ".successor_fund",label:"Supply Jun's own kit and finite means · 1 kit + 2 coins",once:true,
        targetId:S,coLocated:true,participants:["$target",M],visibleWhen:a("successor.taught"),requires:all(settled,w("successor.willing"),w("successor.taught")),
        description:"Transfer one real kit and two native coins to Jun's separate ownership/purse. Mira consents to one wage-funded local check from her existing purse. Jun will spend one acquired coin on declared consumables and use their own trained operation, kit/body/stamina. Funding grants no new method or result.",
        costs:[transfer(KIT,1,"player",S),money(-2)],effects:[coin(S,2),res(M,"successorDemand",1),wf("successor.funded"),af("successor.funded"),
            know("successor.funding","Jun acquired an actual owned kit and two finite coins. Mira consented to one independently executed reserve check funded by her own one-coin wage. The future result remains unknown.")]}),
    cmd({id:P + ".successor_supply_reserve",label:"Sell Mira a new local trial reserve · 1 log · earn 1 coin",once:true,
        targetId:M,coLocated:true,participants:["$target"],visibleWhen:a("successor.met"),requires:all(settled,w("institution.settled"),w("successor.willing")),
        description:"Mira consents to a separate paid one-log local trial need for Jun's taught operation. Sell one actual player-owned log for one of her actual coins. This can supply lawful new reserve stock after the private sale depleted the earlier lot. It does not undo the sale, reopen public service, refill a purse or grant a missed reward.",
        costs:[item(LOG,-1),coin(M,-1)],effects:[item(LOG,1,M),money(1),af("successor.reserveSupplied"),
            know("successor.reserve","Mira bought a new actual one-log local trial reserve for her one coin. This separately funded cause can support Jun's independent operation after earlier stock was sold. The private/closed/public agreement and original sale remain intact.")]}),
    npc({id:P + ".successor_work",label:"Jun performs their own funded local contribution",actorId:S,once:true,
        targetId:M,coLocated:true,participants:["$target"],siteId:P + ".reserve_desk",powerId:STOP,duration:4,cancellation:"refund",
        requires:all(a("successor.willing"),a("successor.taught"),w("successor.willing"),w("successor.funded")),
        ...guard(all(a("successor.willing"),active(STOP),w("successor.willing"),w("successor.funded"))),
        description:"Reserve Jun/Mira/site and their exact physical sample/tool. Jun pays one own consumable coin/two stamina, Mira reserves one real employer wage/need. Completion returns log/tool and pays the wage into Jun's actual purse. The player is not occupied or granted private telemetry.",
        costs:[item(LOG,-1,M),item(KIT,-1,S),coin(M,-1),res(M,"successorDemand",-1),coin(S,-1),stamina(-2,S)],
        effects:[item(LOG,1,M),item(KIT,1,S),coin(S,1),af("successor.completed",true,S),wf("successor.completed"),progress("independentChecks",S),
            know("successor.result","Completed the consenting reserve task with my own acquired ordinary operation, actual kit/body, two stamina and one consumable coin (a work-supply sink). Returned Mira's held log and my kit; her reserved wage paid my purse. This is one contribution, not infinite autonomous work.",S),
            know("successor.result","Jun returned my actual log after their own supported check. My real wage/need settled. Their independently learned operation and acquired physical means supported it.",M)]}),
    cmd({id:P + ".successor_report",label:"Hear Jun's actual completed contribution",once:true,targetId:S,coLocated:true,participants:["$target"],
        visibleWhen:a("successor.funded"),requires:w("successor.completed"),
        effects:[observe("successor.completed"),af("successor.reported"),af("career.stewardMature"),
            know("successor.report","At this later actual meeting Jun reported their completed check. Their own acquired source, kit/body/stamina and finite funds supported it; Mira paid the reserved wage and got her log back. This is the last reported contribution, not live private telemetry or acceptance of another job.")]}),
    cmd({id:P + ".successor_handoff",label:"Hand off management after the demonstrated contribution",once:true,
        targetId:S,coLocated:true,participants:["$target"],visibleWhen:a("successor.reported"),
        requires:all(settled,w("institution.settled"),w("successor.willing"),a("successor.reported")),
        effects:[af("management.retired"),af("successor.handedOff"),...ending("OF.END.06","Jun willingly acquired one ordinary operation, received an owned actual kit/finite funds and completed an independent paid contribution with their own body/stamina. The player heard the actual result before handing off management. Lineage survives later pauses in funds/access; no cloned player or limitless future worker was claimed."),
            memory(S,"Accepted a bounded handoff after demonstrating my own learned operation and reporting an actual contribution.")]}),
    cmd({id:P + ".successor_decline",label:"Close the future lesson before acceptance",once:true,targetId:S,coLocated:true,
        visibleWhen:a("successor.met"),requires:all(not(a("successor.taught")),not(a("successor.funded"))),
        effects:[wf("successor.willing",false),af("successor.willing",false,S),af("successor.declined"),
            know("successor.refusal","Closed future teaching before acceptance. Jun acquired no source/tool/pay and accepted no task. Personal specialist/ordinary life remains possible; no succession result was awarded.")]}),
];

const returns = [
    cmd({id:P + ".departure_prepare",label:"Settle home terms before the next native journey",once:true,
        visibleWhen:all(returned,w("institution.settled")),requires:all(settled,w("institution.settled")),
        requirementIds:["OF.ARC05","OF.END.07","OF.MECH.HANDOFF"],
        description:"Record already settled/declined/terminated terms and retain Village procedures. No new duty or cargo is accepted. Native travel still requires real earned access/time/means. The actual Town square arrival, not preparation, records departure.",
        effects:[af("departure.prepared"),af("departure.homeRetained"),
            know("departure.terms","Local management terms are settled/declined/terminated. Retain Village procedures and current agreement records. Native travel pays its own actual journey/time/means; no teleport or off-screen aging/loss inferred.")]}),
    cmd({id:P + ".departure_arrive_town",label:"Record the actual outward journey with home retained",once:true,location:"Town square",
        visibleWhen:a("departure.prepared"),requires:all(a("departure.prepared"),settled,w("institution.settled"),eq("originalFrontier.townAccessible")),
        effects:[af("departure.arrived"),af("management.retired"),...ending("OF.END.07","After resolving local duties and recording home terms, the player actually reached earned Town square by native travel. The same home procedures, stock owners and public/private/closed terms persist. Return distinguishes actual known reports; no aging, death, offline loss, extraction timer or missed wage inferred.")]}),
    cmd({id:P + ".home_return",label:"Revisit the retained agreement and useful home procedure",once:true,targetId:M,coLocated:true,participants:["$target"],
        visibleWhen:a("departure.arrived"),requires:all(a("departure.arrived"),settled),
        effects:[af("departure.returned"),observe("institution.kind"),af("career.usefulReturn"),
            know("departure.return","Returned to an actual Village meeting after the outward native journey. Mira reports the retained agreement kind. Tested personal procedures remain useful. No stock refill, old wage, access/clearance reward or reversal of private/terminal terms. Jun's report stays its dated last-known contribution.")]}),
    cmd({id:P + ".home_review_shack",label:"Review your retained procedure at the earned Shack · 2 min",once:true,location:"Shack",duration:2,cancellation:"refund",
        visibleWhen:all(returned,eq("village.shackUnlocked"),w("institution.settled")),requires:all(eq("village.shackUnlocked"),settled,mature),
        effects:[af("career.homeProcedure"),know("career.home","At the actually earned Shack, retained the tested local procedure and settled terms for useful home preparation. Native rack/rope/board/chest keep their actual owners. No copied chest or repeated housing reward.")]}),
];

export const originalFrontierCareerDefinitions = {
    people:[person(I,"Iven, stock examiner",{coins:6,samplingAllowance:1,attention:2}),
        person(H,"Halden, contract buyer",{coins:12,appointments:2}),person(S,"Jun, willing resident learner",{coins:0,attention:2})],
    sites:[{id:P + ".material_bench",revision:1,label:"Permitted Village sample bench",capacity:1},
        {id:P + ".teaching_mat",revision:1,label:"Ordinary load-check teaching space",capacity:1}],
    powers:[{id:STOP,revision:1,label:"Ordinary stop-and-check",model:"practice",capacity:1,
        execution:all(active(STOP),a("successor.taught"),a("successor.willing"),eq("body.hands",2),gte("vital.health",2))},
        {id:SAMPLE,revision:1,label:"Bounded sample examination",model:"practice",capacity:1,
            execution:all(active(SAMPLE),a("material.willing"),eq("body.hands",2),gte("vital.health",2))}],
    commands:[...charter,...materials,...careers,...counter,...succession,...returns],
    controllers:[{id:P + ".iven_plan",revision:1,label:"Iven's permitted one-sample plan",actorId:I,interval:1,
        actions:[{commandId:P + ".iven_examine",targetId:M,priority:1}]},
        {id:P + ".successor_plan",revision:1,label:"Jun's independent funded contribution",actorId:S,interval:1,
            actions:[{commandId:P + ".successor_work",targetId:M,priority:1}]}],
};

// Only earned player facts/reports are projected. Rendering cannot grant an
// ending or leak an NPC's inventory/controller/private result.
export function originalFrontierCareerView(state) {
    const f = state.actors?.player?.facts || {}, k = state.simulation?.knowledge?.player || {};
    const flag = key => !!f[P + "." + key];
    const endings = ["OF.END.01","OF.END.02","OF.END.03","OF.END.04","OF.END.05","OF.END.06","OF.END.07"]
        .filter(id => flag("ending." + id)).map(id => ({id,text:k[P + ".ending." + id]?.value || "Recorded local outcome.",at:k[P + ".ending." + id]?.at ?? null}));
    return {introduced:flag("freight.introduced"),charterKnown:flag("charter.known"),signed:flag("charter.signed"),
        settled:flag("charter.settled"),terminated:flag("charter.terminated"),declined:flag("charter.declined"),institution:f[P + ".institution.known"] || null,
        careers:{dispatch:flag("career.dispatchMature"),craft:flag("career.craftMature"),inquiry:flag("career.inquiryMature"),stewardship:flag("career.stewardMature")},
        successor:{met:flag("successor.met"),taught:flag("successor.taught"),funded:flag("successor.funded"),reported:flag("successor.reported"),handedOff:flag("successor.handedOff")},
        departure:{prepared:flag("departure.prepared"),arrived:flag("departure.arrived"),returned:flag("departure.returned")},endings,
        details:Object.entries(k).filter(([key]) => key.startsWith(P + ".") && !key.startsWith(P + ".freight."))
            .map(([key,value]) => ({key,text:value.value,at:value.at,basis:value.basis ? {...value.basis} : null}))};
}
