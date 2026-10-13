import {I,K,command,eq,gte,all,any,not,af,item,money,coins,stamina,transfer,know,contact,purse,owned,relationship} from './shared.js';

const P = 'actor.mg.';
const booking = eq(`${P}eventBooked`);
const program = value => eq(`${P}eventProgram`,value);
const displayed = kind => eq(`${P}displayedKind`,kind);
const displaySupport = kind => all(displayed(kind),gte(`management.stock.${I.mira}.${kind}`,1));

export const commands = [
    command({id:'mg.restoration.inspect',family:'MG10',label:'Inspect the damaged heirloom',description:'Look closely at the actual damaged heirloom you own. Its loose join and chipped surface support two known treatments; this inspection does not reveal hidden provenance or future value.',
        visibleWhen:owned('Damaged courtyard heirloom'),requires:owned('Damaged courtyard heirloom'),
        effects:[know('restoration.condition','The actual damaged courtyard heirloom has a loose join and chipped surface. A linen-cloth conservation can prepare it for a local display; a log-supported repair makes it sale-grade. This is an ordinary condition report, not a valuation or provenance claim.')] }),

    command({id:'mg.restoration.conserve',family:'MG10',label:'Conserve for display · 1 cloth + 2 stamina + 5 min',description:'Use one real linen cloth, stamina and the shared bench to transform your damaged heirloom into one conserved object. Inputs return if the work is cancelled or support fails.',
        targetId:I.mira,coLocated:true,participants:['$target'],
        visibleWhen:all(eq('knowledge.mg.restoration.condition.seen'),owned('Damaged courtyard heirloom')),
        support:all(contact(I.mira),eq('knowledge.mg.restoration.condition.seen')),
        requires:all(eq('knowledge.mg.restoration.condition.seen'),owned('Damaged courtyard heirloom'),owned('Linen cloth')),
        duration:5,siteId:I.bench,costs:[item(K.damaged,-1),item(K.cloth,-1),stamina(-2)],
        effects:[item(K.conserved,1),know('restoration.conserved','Conserved one actual damaged heirloom with one real linen cloth at the shared bench. The resulting conserved object remains in your inventory until you display it or use another supported route.',I.mira)]}),

    command({id:'mg.restoration.sale_grade',family:'MG10',label:'Repair to sale-grade · 1 log + 2 stamina + 6 min',description:'Use one real log, stamina and the shared bench to transform your damaged heirloom into one sale-grade restored object. Inputs return if the work is cancelled or support fails.',
        targetId:I.mira,coLocated:true,participants:['$target'],
        visibleWhen:all(eq('knowledge.mg.restoration.condition.seen'),owned('Damaged courtyard heirloom')),
        support:all(contact(I.mira),eq('knowledge.mg.restoration.condition.seen')),
        requires:all(eq('knowledge.mg.restoration.condition.seen'),owned('Damaged courtyard heirloom'),owned('Rough wood log')),
        duration:6,siteId:I.bench,costs:[item(K.damaged,-1),item(K.log,-1),stamina(-2)],
        effects:[item(K.restored,1),know('restoration.sale_grade','Repaired one actual damaged heirloom with one real log at the shared bench. The resulting restored object is sale-grade and remains your inventory.',I.mira)]}),

    ...[
        {kind:'conserved',item:K.conserved,ownedName:'conserved',label:'Conserved heirloom'},
        {kind:'restored',item:K.restored,ownedName:'restored',label:'Restored heirloom'},
    ].flatMap(d => [
        command({id:`mg.restoration.display_${d.kind}`,family:'MG10',label:`Place ${d.label} in Mira’s courtyard display`,description:`Transfer your actual ${d.label.toLowerCase()} to Mira’s local display stock. The display record points to that same object; it is unavailable for sale or other use until you withdraw it.`,
            targetId:I.mira,coLocated:true,participants:['$target'],
            visibleWhen:all(not(any(displayed('conserved'),displayed('restored'))),owned(d.ownedName)),
            support:contact(I.mira),requires:owned(d.ownedName),
            costs:[],effects:[transfer(d.item,1,'player',I.mira),af('displayedKind',d.kind),know('restoration.display',`Placed one actual ${d.label.toLowerCase()} in Mira’s courtyard display. It is held in Mira’s stock and cannot also be sold. Withdraw the same object before taking it elsewhere.`,I.mira)]}),

        command({id:`mg.restoration.withdraw_${d.kind}`,family:'MG10',label:`Withdraw ${d.label} from Mira’s display`,description:`Return the same actual ${d.label.toLowerCase()} from Mira’s display stock to your inventory. This clears the display record so the object can be used or sold through a supported route.`,
            targetId:I.mira,coLocated:true,participants:['$target'],
            visibleWhen:displayed(d.kind),support:all(contact(I.mira),displaySupport(d.kind)),requires:displaySupport(d.kind),
            effects:[transfer(d.item,1,I.mira,'player'),af('displayedKind',false),know('restoration.display',`Withdrew the same actual ${d.label.toLowerCase()} from Mira’s courtyard display to your inventory. It is no longer available as an exhibition display.`,I.mira)]}),
    ]),

    command({id:'mg.restoration.sell_restored',family:'MG10',label:'Sell restored heirloom to Bram · 14 coins',description:'Transfer your actual sale-grade restored heirloom to Bram for fourteen coins from his finite purse. The sale consumes that object; a displayed object must first be withdrawn from Mira.',
        targetId:I.bram,coLocated:true,participants:['$target'],
        visibleWhen:all(not(displayed('restored')),owned('Restored courtyard heirloom')),
        support:all(contact(I.bram),purse(I.bram,14)),requires:owned('Restored courtyard heirloom'),
        costs:[transfer(K.restored,1,'player',I.bram)],effects:[coins(-14,I.bram),money(14),know('restoration.sale','Bram bought and received one actual sale-grade restored courtyard heirloom for fourteen of his coins.',I.bram),relationship(I.bram,1)]}),

    command({id:'mg.event.book',family:'MG09',label:'Book the courtyard venue · 2 coins',description:'Pay Mira’s real two-coin venue fee and reserve this courtyard for one local programme. A booking grants no audience, food or display object.',
        targetId:I.mira,coLocated:true,participants:['$target'],
        visibleWhen:not(booking),support:contact(I.mira),requires:all(purse(I.mira,2)),
        costs:[money(-2)],effects:[coins(2,I.mira),af('eventBooked'),af('eventProgram',false),know('event.booking','Booked the courtyard venue for one event by paying Mira two actual coins. Choose and prepare one programme before hosting.',I.mira)]}),

    ...[
        {id:'meal_greens',label:'Prepare a greens meal gathering',kind:'greens',item:K.greens,food:'Courtyard greens',guest:I.sela,pay:3,description:'Sela is the quoted local guest. The gathering uses one actual greens portion and pays three coins only if her finite purse still covers it.'},
        {id:'meal_grain',label:'Prepare a grain meal gathering',kind:'grain',item:K.grain,food:'Courtyard grain',guest:I.bram,pay:5,description:'Bram is the quoted local guest. The gathering uses one actual grain portion and pays five coins only if his finite purse still covers it.'},
        {id:'exhibition_conserved',label:'Prepare a conserved-object exhibition',kind:'exhibition_conserved',guest:I.bram,pay:8,display:'conserved',description:'Bram offers a finite eight-coin sponsorship for an exhibition featuring the actual conserved object in Mira’s display. The object stays with Mira.'},
        {id:'exhibition_restored',label:'Prepare a restored-object exhibition',kind:'exhibition_restored',guest:I.bram,pay:8,display:'restored',description:'Bram offers a finite eight-coin sponsorship for an exhibition featuring the actual restored object in Mira’s display. The object stays with Mira.'},
    ].map(d => command({id:`mg.event.prepare_${d.id}`,family:'MG09',label:d.label,description:`${d.description} Preparation records a distinct programme; hosting is a separate timed action.`,
        targetId:I.mira,coLocated:true,participants:['$target'],
        visibleWhen:all(booking,eq(`${P}eventProgram`,false)),
        support:contact(I.mira),
        requires:all(booking,...(d.item?[owned(d.food)]:[]),...(d.display?[displaySupport(d.display)]:[])),
        effects:[af('eventProgram',d.kind),know(`event.program.${d.kind}`,`${d.label} is prepared for the booked courtyard. ${d.description}`,I.mira)]})),

    ...[
        {kind:'greens',label:'Host the greens gathering',guest:I.sela,pay:3,item:K.greens,food:'Courtyard greens',minutes:5,relationship:1,knowledge:'Sela attended the greens meal gathering, paid three actual coins from her purse and shared a local note about serving fresh greens.'},
        {kind:'grain',label:'Host the grain gathering',guest:I.bram,pay:5,item:K.grain,food:'Courtyard grain',minutes:6,relationship:1,knowledge:'Bram attended the grain meal gathering and paid five actual coins from his purse. You learned that he values a filling local meal before a delivery.'},
        {kind:'exhibition_conserved',label:'Host the conserved-object exhibition',guest:I.bram,pay:8,display:'conserved',minutes:7,relationship:1,knowledge:'Bram attended an exhibition featuring the actual conserved courtyard heirloom and paid eight actual sponsorship coins from his purse. Mira noted that the conservation is careful and suitable for display.'},
        {kind:'exhibition_restored',label:'Host the restored-object exhibition',guest:I.bram,pay:8,display:'restored',minutes:7,relationship:1,knowledge:'Bram attended an exhibition featuring the actual restored courtyard heirloom and paid eight actual sponsorship coins from his purse. Mira noted that the repaired join is ready for practical use.'},
    ].map(d => command({id:`mg.event.host_${d.kind}`,family:'MG09',label:`${d.label} · ${d.pay} coins + ${d.minutes} min`,description:`Host the prepared programme for ${d.minutes} played minutes. ${d.item?`One actual ${d.food} portion and two stamina are reserved and consumed only on completion; cancellation or lost support returns them.`:'The displayed object stays in Mira’s stock throughout the event.'} ${d.guest===I.sela?'Sela':'Bram'} pays from their actual finite purse at completion.`,
        targetId:d.guest,coLocated:true,participants:['$target'],
        visibleWhen:all(booking,program(d.kind)),
        support:all(program(d.kind),contact(d.guest),purse(d.guest,d.pay),...(d.display?[displaySupport(d.display)]:[])),
        requires:all(booking,program(d.kind),...(d.item?[owned(d.food)]:[]),...(d.display?[displaySupport(d.display)]:[])),
        duration:d.minutes,siteId:I.venue,
        costs:[...(d.item?[item(d.item,-1)]:[]),stamina(-2)],
        effects:[coins(-d.pay,d.guest),money(d.pay),af('eventBooked',false),af('eventProgram',false),know(`event.attendance.${d.kind}`,d.knowledge,d.guest),relationship(d.guest,d.relationship),...(d.display?[relationship(I.mira,1)]:[])]})),

    command({id:'mg.event.cancel_booking',family:'MG09',label:'Cancel the unhosted event booking',description:'Clear any unhosted booking and release the venue, whether or not a programme was prepared. Mira returns the two-coin fee from her actual purse; no food or display object is consumed by cancelling before hosting.',
        targetId:I.mira,coLocated:true,participants:['$target'],
        visibleWhen:booking,support:all(contact(I.mira),purse(I.mira,2)),requires:booking,
        effects:[coins(-2,I.mira),money(2),af('eventBooked',false),af('eventProgram',false),know('event.cancellation','Cancelled the unhosted courtyard booking. Mira returned the same two-coin venue fee from her actual purse; no food or displayed object was consumed.',I.mira)]}),
];
