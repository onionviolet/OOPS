// Original Frontier adaptations of the pinned Minecraft research. These are
// local material laws and ordinary simulation commands, not Minecraft recipes.
import {fieldWorksExtensionDefinitions} from './field_works_extension_content.js';
import {all, any, eq, not} from './basics.js';

export const WORKS = Object.freeze({prefix:'field.works.', world:'base.frontier', spirit:'fieldWorksSpirit', artisan:'fieldWorksArtisan', courier:'fieldWorksCourier', bench:'field.works.bench'});
const P=WORKS.prefix, key=id=>JSON.stringify({id});
export const WORKS_KEYS=Object.freeze(Object.fromEntries(Object.entries({
    log:'Rough wood log', coal:'Charcoal', ore:'Iron ore', iron:'Iron ingot', kit:'Prepared survey kit',
    parts:'Basic spare parts', belmart:'Belmart leaf', golmoon:'Golmoon leaf',
    clay:'Field clay', wet:'Wet field vessel', dry:'Dry field vessel', fired:'Fired field vessel',
    shards:'Field ceramic fragments', sample:'Unsorted field mineral', charge:'Prepared field charge',
    stave:'Measured field stave', empty:'Empty field receiver', staves:'Field stave receiver', fittings:'Field fittings receiver', kits:'Field kit receiver',
}).map(([k,v])=>[k,key(v)])));
const K=WORKS_KEYS;
export const fieldWorksItemSpecs=[
    ['Field clay','Workable bank clay. Shape it while wet; dry before firing. A dry unfired vessel can be rewetted.',1],
    ['Wet field vessel','Shaped clay retaining water. Dry it before a hot firing; heating it directly can crack it.',1],
    ['Dry field vessel','A dry but unfired vessel. A hot firing makes a usable ceramic vessel; gentle warming leaves it unfired.',2],
    ['Fired field vessel','A fired vessel used to contain the workshop garden’s energy reservoir. It can also be crushed for drainage.',4],
    ['Field ceramic fragments','Fired fragments remain ceramic. Use them for garden drainage; they cannot be rewetted into raw clay.',1],
    ['Unsorted field mineral','A retained mineral parcel. Its practical properties do not depend on whether you have identified them. Inspect it in Practical works.',1],
    ['Prepared field charge','An iron-bearing charge prepared from one actual Iron ore and a mineral parcel. Fire with actual charcoal to obtain one Iron ingot.',3],
    ['Measured field stave','Two staves are cut from one log. Bind them with a fitting for two ordinary Prepared survey kits.',2],
    ['Empty field receiver','One physical receiving tray. Supply it to a machine or worker; a filled or absent tray cannot receive a new batch.',1],
    ['Field stave receiver','The same tray holding exactly two measured staves. Collecting returns its empty tray and both staves.',5],
    ['Field fittings receiver','The same tray holding two Basic spare parts made from one Iron ingot. Collecting returns its empty tray.',6],
    ['Field kit receiver','The same tray holding two ordinary Prepared survey kits. Collection returns the empty tray too.',7],
];
export function registerFieldWorksItems({item_templates,OtherItem}) {
    for(const [name,description,value] of fieldWorksItemSpecs) item_templates[name]=new OtherItem({id:name,name,description,value,tags:{expedition:true}});
}
const item=(key,amount,actor)=>({type:'item',key,amount,...(actor?{actor}:{})});
const res=(key,amount,actor='player',capacity)=>({type:'resource',key:P+key,amount,actor,...(capacity==null?{}:{capacity})});
const fact=(key,value=true,actor='player')=>({type:'fact',scope:'actor',actor,key:P+key,value});
const cash=amount=>({type:'resource',native:true,key:'money',amount,actor:'player'});
const know=(key,value,actor='player')=>({type:'knowledge',actor,key:P+key,stage:'understood',value});
const transfer=(from,to,key,count=1)=>({type:'transfer',from,to,key,count});
const f=(name,reason)=>eq('fieldWorks.'+name,true,reason);
const enrolled=f('enrolled'), supported=f('supported','Return to your supported field workshop in the Frontier.'), operating=all(enrolled,supported);
const visible=(...rules)=>all(enrolled,...rules);
const command=d=>({revision:1,worldId:WORKS.world,group:'field',actorId:'player',location:'Shack',uiSection:'works',reservationReturns:1,costs:[],effects:[],...d});
const timed=duration=>({duration,cancellation:'refund',completionFailure:'refund',completionRequires:operating});
const fuel=[item(K.coal,-1)];
const manaCost=n=>n?[res('mana',-n)]:[];
const manaSpent=n=>n?[res('space',n,'player',12)]:[];
const receipt=(name,text)=>[fact('lastWork',text),know(name,text)];

// One ordered material resolver is shared by individual steps and recorded
// sequences. Knowledge changes available shortcuts, not these true properties.
export const WORKS_STEPS=Object.freeze(['shape','dry','fire']);
export function resolveFieldCeramic(steps,strength='strong',input='clay') {
    if(!Array.isArray(steps)||!steps.length||steps.length>3||!steps.every(s=>WORKS_STEPS.includes(s))||!['gentle','strong'].includes(strength)||!['clay','wet','dry','fired','shards'].includes(input))throw new Error('Unsupported ceramic application.');
    let wet=['clay','wet'].includes(input),shaped=['wet','dry','fired'].includes(input),fired=['fired','shards'].includes(input),broken=input==='shards';
    for(const step of steps) {
        if(step==='shape') {if(wet&&!fired&&!broken)shaped=true;}
        if(step==='dry'&&!fired)wet=false;
        if(step==='fire') {
            if(wet&&shaped&&strength==='strong'){broken=true;fired=true;}
            wet=false;
            if(strength==='strong')fired=true;
        }
    }
    const output=broken||fired&&!shaped?'shards':fired?'fired':shaped?wet?'wet':'dry':'clay';
    // An unshaped dried lump remains Field clay: this bulk stock includes its
    // ordinary rehydration, while shaped vessels retain their drying stage.
    return {output,mana:steps.filter(s=>s==='fire').length*(strength==='strong'?3:1),duration:steps.length+(strength==='gentle'?1:0)};
}
const sequences=[];
for(const a of WORKS_STEPS) {sequences.push([a]);for(const b of WORKS_STEPS){sequences.push([a,b]);for(const c of WORKS_STEPS)sequences.push([a,b,c]);}}
export function fieldSequenceId(steps,strength,input='clay',batch=1){return P+'compose.'+steps.join('_')+'.'+strength+(input==='clay'&&batch===1?'':'.'+input+'.'+batch);}
export const fieldWorksCompositionCommands=sequences.flatMap(steps=>['gentle','strong'].flatMap(strength=>['clay','wet','dry'].flatMap(input=>[1,3].map(batch=>{
    const result=resolveFieldCeramic(steps,strength,input),id=fieldSequenceId(steps,strength,input,batch),mana=result.mana*batch,duration=result.duration*batch;
    return command({id,worksSection:'composition',worksComposition:true,automatable:true,
        label:`${steps.join(' → ')} · ${strength} · ${batch} ${input} work + ${mana} energy · ${duration} min`,...timed(duration),
        visibleWhen:visible(f('composition')),requires:all(operating,...steps.map(s=>eq(`knowledge.${P}verb.${s}.understood`,true,`Learn the ${s} operation first.`))),
        costs:[item(K[input],-batch),...manaCost(mana)],effects:[item(K[result.output],batch),...manaSpent(mana),...receipt('sequence',`Applied ${steps.join(' → ')} to ${batch} ${input} work with ${strength} heat; retained ${result.output==='shards'?'ceramic fragments':result.output+' clay work'}.`)],
        description:'Apply to actual raw clay or a retained wet/dry stage. A three-piece batch reserves all three inputs and their energy; cancelling returns that exact preparation.'});
}))));

const machine=(id,label,load,costs,effects,extra={})=>command({id:P+id,worksSection:'machines',label,...timed(3),automatable:true,visibleWhen:visible(f('drive')),
    requires:all(operating,f('drive'),f('connected','Reconnect the transmission before starting powered work.'),eq('fieldWorks.drive'+load,true,`Drive needs ${load} free units. Wait for another machine or helper to release its load.`)),
    completionRequires:all(operating,f('connected')),costs:[res('drive',-load),...fuel,...costs],effects:[res('drive',load),...effects],...extra});
const workerSupported=all(f('workerSupported','This assignment has no supported local clock or owned workshop.'),f('connected','The transmission is disconnected.'));
const workerCommand=(id,actor,label,duration,requires,costs,effects)=>({id:P+id,revision:1,worldId:WORKS.world,group:'field_works_worker',actorId:actor,location:'Shack',reservationReturns:1,label,duration,cancellation:'refund',completionFailure:'refund',completionRequires:requires,requires:all(requires,f('workerCanStart','This worker is off shift or has lost its assigned room.')),costs,effects});

export const fieldWorksDefinitions={
    sites:[{id:WORKS.bench,revision:1,label:'Practical field works',worldId:WORKS.world,location:'Shack',capacity:1,provision:false}],
    people:[{id:WORKS.spirit,revision:1,label:'Bound workshop wisp',worldId:WORKS.world,location:'Shack',inventory:'simulation',provision:false},
        {id:WORKS.artisan,revision:1,label:'Contract field fitter',worldId:WORKS.world,location:'Shack',inventory:'simulation',provision:false},
        {id:WORKS.courier,revision:1,label:'Workshop handcart courier',worldId:WORKS.world,location:'Shack',inventory:'simulation',provision:false}],
    commands:[
        command({id:P+'begin',worksSection:'start',label:'Set up practical works · 2 logs + 3 coins · 4 min',once:true,...timed(4),
            visibleWhen:eq('actor.field.facility',true),requires:all(f('canBegin','Assemble your existing field workshop first.'),not(enrolled)),
            completionRequires:f('canBegin'),costs:[item(K.log,-2),cash(-3)],
            effects:[fact('enrolled'),fact('version',1),{type:'site',siteId:WORKS.bench,operation:'open'},item(K.empty,2),res('drive',0),res('mana',0),res('space',12),
                ...receipt('setup','Installed a small workbench with two physical receiving trays. Clay work, powered production, a garden and funded helpers are optional local applications.')]}),
        command({id:P+'gather_clay',worksSection:'materials',label:'Gather and wash bank clay · 1 stamina · 3 min',...timed(3),visibleWhen:enrolled,requires:operating,
            costs:[{type:'vital',key:'stamina',amount:-1}],effects:[item(K.clay,2)],description:'Bring two workable clay units from the ordinary local bank and wash them at your workshop. Uses played time and real effort.'}),
        command({id:P+'sift',worksSection:'discovery',label:'Separate the mineral fraction · 1 clay · 2 min',...timed(2),visibleWhen:enrolled,requires:operating,
            costs:[item(K.clay,-1)],effects:[item(K.sample,1),...receipt('sample','Separated and retained one mineral parcel from the washed clay. Its properties remain untested.')]}),
        command({id:P+'hint',worksSection:'discovery',label:'Consult the workshop test notes · 1 coin',once:true,visibleWhen:visible(not(f('mineralKnown'))),requires:operating,costs:[cash(-1)],
            effects:[know('hint','Keep one actual mineral parcel. Gentle heat at the workshop can characterize it without spending the sample. Trying it in a charge remains possible before that test.')],
            description:'A paid procedural hint, with no automatic discovery or change to the retained mineral.'}),
        ...[['shape','clay','wet',1,[]],['dry','wet','dry',3,[]],['fire','dry','fired',3,fuel],['wet_fire','wet','shards',2,fuel],['rewet','dry','clay',1,[]],['crush','fired','shards',1,[]]].map(([id,input,output,duration,extra])=>command({
            id:P+id,worksSection:'materials',label:`${{shape:'Shape a wet vessel',dry:'Air-dry the wet vessel',fire:'Fire the dry vessel',wet_fire:'Try firing the wet vessel',rewet:'Rewet unfired clay',crush:'Crush fired ceramic for drainage'}[id]} · ${duration} min${extra.length?' + charcoal':''}`,
            ...timed(duration),automatable:true,visibleWhen:enrolled,requires:operating,costs:[item(K[input],-1),...extra],effects:[item(K[output],1),...receipt(id,`${input} work became ${output==='shards'?'ceramic fragments':output+' work'}. Completed earlier stages remain committed.`)],
            description:id==='wet_fire'?'Hot firing of wet shaped clay cracks this local clay body. The fired fragments remain useful as drainage.':id==='fire'?'Reserve one charcoal and a dry vessel. Firing settles at completion; cancelling its preparation returns the dry vessel and unburned fuel.':'This stage keeps its actual output. Cancelling a later stage does not turn it back into earlier stock.'})),
        command({id:P+'prepare_charge',worksSection:'discovery',label:'Try the retained mineral in an ore charge · ore + parcel · 2 min',...timed(2),visibleWhen:enrolled,requires:operating,
            costs:[item(K.ore,-1),item(K.sample,-1)],effects:[item(K.charge,1),...receipt('charge','Prepared a charge from the actual ore and mineral parcel; the heat treatment remains unfinished.')]}),
        command({id:P+'smelt',worksSection:'materials',label:'Fire the prepared charge · charcoal · 4 min',...timed(4),visibleWhen:enrolled,requires:operating,
            costs:[item(K.charge,-1),...fuel],effects:[item(K.iron,1),...receipt('smelt','The prepared charge yielded one ordinary Iron ingot. Its ore and mineral input were spent in this firing.')]}),
        command({id:P+'observe',worksSection:'discovery',label:'Test a retained parcel with gentle heat · 1 energy · 2 min',...timed(2),once:true,visibleWhen:visible(f('garden')),requires:operating,
            costs:[item(K.sample,-1),...manaCost(1)],effects:[{...item(K.sample,1),reservationReturn:true},...manaSpent(1),fact('mineralKnown'),
                know('mineral','A heated sample showed the mineral fraction’s flux behavior. The same retained parcel can prepare an iron-bearing charge; recognition changes the shortcut, not its material action.')],
            description:'Reserve the same sample, test it, then retain it. An untested parcel can already be tried in an ore charge.'}),
        command({id:P+'known_charge',worksSection:'discovery',label:'Repeat the observed charge preparation · ore + parcel · 1 min',...timed(1),automatable:true,visibleWhen:visible(f('mineralKnown')),requires:all(operating,f('mineralKnown')),
            costs:[item(K.ore,-1),item(K.sample,-1)],effects:[item(K.charge,1)]}),
        command({id:P+'composition',worksSection:'composition',label:'Study reusable operations · 1 coin · 2 min',...timed(2),once:true,visibleWhen:enrolled,requires:operating,
            costs:[cash(-1)],effects:[fact('composition'),know('composition','An ordered contact method can shape, dry and fire the same clay. Each learned operation remains reusable; heat strength affects cost and result.')]}),
        ...WORKS_STEPS.map(step=>command({id:P+'learn_'+step,worksSection:'composition',label:`Practice the ${step} operation · 1 coin · 2 min`,...timed(2),once:true,visibleWhen:visible(f('composition')),requires:operating,
            costs:[cash(-1)],effects:[know('verb.'+step,`Practiced ${step} on the actual local clay process. This reusable operation does not grant unknown techniques.`)]})),
        ...fieldWorksCompositionCommands,
        command({id:P+'drive',worksSection:'machines',label:'Install a charcoal drive · 2 logs + 1 Iron ingot · 4 min',...timed(4),once:true,visibleWhen:enrolled,requires:operating,
            costs:[item(K.log,-2),item(K.iron,-1)],effects:[fact('drive'),fact('connected'),res('drive',2),...receipt('drive','Installed a two-load charcoal drive. Jobs reserve their actual load and charcoal; an idle or disconnected drive burns nothing.')]}),
        command({id:P+'make_receiver',worksSection:'machines',label:'Make another receiving tray · 1 log · 2 min',...timed(2),automatable:true,visibleWhen:enrolled,requires:operating,
            costs:[item(K.log,-1)],effects:[item(K.empty,1)],description:'Replace a sold or stored tray, or supply another worker. Receiving objects remain actual owned stock.'}),
        command({id:P+'disconnect',worksSection:'machines',label:'Disconnect the drive · pending powered work returns its inputs',visibleWhen:visible(f('connected')),requires:operating,effects:[fact('connected',false)]}),
        command({id:P+'connect',worksSection:'machines',label:'Reconnect the drive',visibleWhen:visible(f('drive'),not(f('connected'))),requires:operating,effects:[fact('connected')]}),
        machine('mill','Saw one log into a receiving tray · log + charcoal · load 1 · 3 min',1,[item(K.log,-1),item(K.empty,-1)],[item(K.staves,1)]),
        machine('press','Press two fittings into a receiving tray · ingot + charcoal · load 2 · 3 min',2,[item(K.iron,-1),item(K.empty,-1)],[item(K.fittings,1)]),
        ...[['staves','stave',2],['fittings','parts',2],['kits','kit',2]].map(([full,output,count])=>command({id:P+'collect_'+full,worksSection:'machines',label:`Empty your ${full} receiver · retain the tray`,visibleWhen:enrolled,requires:operating,
            costs:[item(K[full],-1)],effects:[item(K.empty,1),item(K[output],count)]})),
        command({id:P+'bind_kits',worksSection:'materials',label:'Fit two survey kits · 2 staves + 1 spare part · 2 min',...timed(2),automatable:true,visibleWhen:enrolled,requires:operating,
            costs:[item(K.stave,-2),item(K.parts,-1)],effects:[item(K.kit,2)]}),
        command({id:P+'garden',worksSection:'garden',label:'Plant an energy garden · fired vessel + fragments + 2 logs · 4 min',...timed(4),once:true,visibleWhen:enrolled,requires:operating,
            costs:[item(K.fired,-1),item(K.shards,-1),item(K.log,-2)],effects:[fact('garden'),...receipt('garden','Installed two supplied plant beds, ceramic drainage and a twelve-unit reservoir. No plants consume stock or create energy while idle.')]}),
        ...[['ember',4,[item(K.coal,-1)],'Feed the ember bed · 1 charcoal → 4 energy · 3 min'],['variety',6,[item(K.belmart,-1),item(K.golmoon,-1)],'Feed the mixed bed · Belmart + Golmoon → 6 energy · 4 min']].map(([id,amount,inputs,label])=>command({
            id:P+'grow_'+id,worksSection:'garden',label,...timed(id==='ember'?3:4),automatable:true,visibleWhen:visible(f('garden')),requires:all(operating,f('garden')),
            costs:[res('space',-amount),...inputs],effects:[res('mana',amount,'player',12)],description:'Reserve the full receiving space before feeding this bed. A full reservoir takes no inputs. The mixed bed needs both actual herbs, rather than rewarding the same repeated offering.'})),
        command({id:P+'bind_spirit',worksSection:'helpers',label:'Bind a workshop wisp · 2 energy + 1 coin · 2 min',...timed(2),once:true,visibleWhen:visible(f('garden')),requires:operating,
            costs:[...manaCost(2),cash(-1)],effects:[...manaSpent(2),{type:'spawn',personId:WORKS.spirit,definitionId:WORKS.spirit},fact('spirit'),fact('spiritRank',1),fact('spiritAssigned',false)]}),
        command({id:P+'rank_spirit',worksSection:'helpers',label:'Refine the wisp’s binding · 4 energy + 2 coins · 3 min',...timed(3),once:true,visibleWhen:visible(f('spirit')),requires:all(operating,f('spiritIdle','Wait for the wisp to finish its current reserved batch.')),
            costs:[...manaCost(4),cash(-2)],effects:[...manaSpent(4),fact('spiritRank',2),know('spiritRank','The refined binding performs the same supplied two-stave batch in two minutes rather than four. It does not duplicate a log or supply free energy.')]}),
        ...[1,3].map(count=>command({id:P+'assign_spirit_'+count,worksSection:'helpers',label:`Assign ${count} wisp batch${count===1?'':'es'} · one log + charcoal + tray per batch`,visibleWhen:visible(f('spirit')),requires:all(operating,f('spiritUnassigned','Finish or withdraw the existing wisp order first.')),
            effects:[res('spiritOrders',count),fact('spiritAssigned')]})),
        command({id:P+'pause_spirit',worksSection:'helpers',label:'Pause the wisp · retain remaining orders and supplies',visibleWhen:visible(f('spiritAssigned')),requires:operating,effects:[fact('spiritAssigned',false)]}),
        command({id:P+'resume_spirit',worksSection:'helpers',label:'Resume the wisp’s remaining order',visibleWhen:visible(f('spiritPaused'),f('spiritHasOrders')),requires:operating,effects:[fact('spiritAssigned')]}),
        command({id:P+'supply_spirit',worksSection:'helpers',label:'Supply one wisp batch · log + charcoal + empty tray',visibleWhen:visible(f('spirit')),requires:all(operating,f('spiritNeedsSupply','The wisp already holds a supplied or reserved batch, or has no remaining order.')),
            costs:[transfer('player',WORKS.spirit,K.log),transfer('player',WORKS.spirit,K.coal),transfer('player',WORKS.spirit,K.empty)]}),
        command({id:P+'collect_spirit',worksSection:'helpers',label:'Collect the wisp’s tray and two staves',visibleWhen:visible(f('spirit')),requires:operating,
            costs:[transfer(WORKS.spirit,'player',K.staves)],effects:[item(K.staves,-1),item(K.empty,1),item(K.stave,2)]}),
        ...[1,2].map(rank=>workerCommand('spirit_mill_'+rank,WORKS.spirit,'Wisp saws its supplied log',rank===1?4:2,
            all(workerSupported,f('spiritAssigned'),eq('fieldWorks.spiritRank',rank)),
            [res('spiritOrders',-1),res('drive',-1),...manaCost(1),item(K.log,-1),item(K.coal,-1),item(K.empty,-1)],
            [res('drive',1),...manaSpent(1),item(K.staves,1)])),
        command({id:P+'hire_artisan',worksSection:'supply',label:'Commission a fitter · prepay 3 one-coin batches',once:true,visibleWhen:enrolled,requires:operating,costs:[cash(-3)],
            effects:[{type:'spawn',personId:WORKS.artisan,definitionId:WORKS.artisan},fact('artisan'),fact('artisanAssigned'),res('artisanOrders',3),res('wages',3,WORKS.artisan)]}),
        command({id:P+'renew_artisan',worksSection:'supply',label:'Fund three more fitter batches · 3 coins',visibleWhen:visible(f('artisan')),requires:all(operating,f('artisanContractFinished','The current funded order still has batches remaining.')),costs:[cash(-3)],
            effects:[fact('artisanAssigned'),res('artisanOrders',3),res('wages',3,WORKS.artisan)]}),
        command({id:P+'supply_artisan',worksSection:'supply',label:'Deliver the fitter’s request · 2 staves + spare part + tray',visibleWhen:visible(f('artisan')),requires:all(operating,f('artisanNeedsSupply','The fitter already holds the requested stock, reserved work or a filled receiver, or has no funded order.')),
            costs:[transfer('player',WORKS.artisan,K.stave,2),transfer('player',WORKS.artisan,K.parts),transfer('player',WORKS.artisan,K.empty)]}),
        command({id:P+'collect_artisan',worksSection:'supply',label:'Collect two finished kits and the fitter’s tray',visibleWhen:visible(f('artisan')),requires:operating,
            costs:[transfer(WORKS.artisan,'player',K.kits)],effects:[item(K.kits,-1),item(K.empty,1),item(K.kit,2)]}),
        command({id:P+'pause_artisan',worksSection:'supply',label:'Pause the fitter · uncompleted wages remain funded',visibleWhen:visible(f('artisanAssigned')),requires:operating,effects:[fact('artisanAssigned',false)]}),
        command({id:P+'resume_artisan',worksSection:'supply',label:'Resume the funded fitter order',visibleWhen:visible(f('artisanPaused'),f('artisanHasOrders')),requires:all(operating,f('artisanHasOrders')),effects:[fact('artisanAssigned')]}),
        workerCommand('artisan_fit',WORKS.artisan,'Fitter assembles the supplied kits',3,all(f('workerSupported'),f('artisanAssigned')),
            [res('artisanOrders',-1),res('wages',-1,WORKS.artisan),item(K.stave,-2),item(K.parts,-1),item(K.empty,-1)],
            [item(K.kits,1),res('earnedWages',1,WORKS.artisan)]),
        command({id:P+'charcoal',worksSection:'materials',label:'Smolder a covered wood charge · 2 logs + reusable fired vessel · 6 min',...timed(6),automatable:true,visibleWhen:enrolled,requires:operating,
            costs:[item(K.log,-2),item(K.fired,-1)],effects:[item(K.coal,2),{...item(K.fired,1),reservationReturn:true}],
            description:'Use the fired vessel as a covered retort. Retain that vessel and two charcoal for ordinary heating, powered work or the ember bed. Cancelling unperformed preparation returns both logs and vessel.'}),
        command({id:P+'tend_garden',worksSection:'garden',label:'Tend and mulch the beds · Belmart + Golmoon · 2 min',...timed(2),visibleWhen:visible(f('garden')),requires:all(operating,f('garden'),f('gardenUntended','Use the remaining prepared mulch before tending again.')),
            costs:[item(K.belmart,-1),item(K.golmoon,-1)],effects:[res('gardenCare',3,'player',3)],description:'Three tended feedings retain moisture in these sheltered beds. Care is actual prepared mulch, used by the improved feeding; idle beds do not decay on a separate clock.'}),
        command({id:P+'grow_tended',worksSection:'garden',label:'Feed a tended ember bed · charcoal + 1 care → 6 energy · 3 min',...timed(3),automatable:true,visibleWhen:visible(f('garden')),requires:all(operating,f('garden')),
            costs:[res('gardenCare',-1),res('space',-6),item(K.coal,-1)],effects:[res('mana',6,'player',12)],description:'The prepared living bed handles this feeding more efficiently. It still needs actual fuel and six free reservoir units.'}),
        command({id:P+'recorded_smelt',worksSection:'discovery',label:'Repeat your demonstrated ore treatment · ore + parcel + charcoal · 3 min',...timed(3),automatable:true,
            visibleWhen:visible(f('mineralKnown'),eq('knowledge.'+P+'smelt.understood',true)),requires:all(operating,f('mineralKnown'),eq('knowledge.'+P+'smelt.understood',true,'Complete an actual prepared-charge firing first.')),
            costs:[item(K.ore,-1),item(K.sample,-1),item(K.coal,-1)],effects:[item(K.iron,1),...receipt('recordedSmelt','Repeated the demonstrated preparation and heat treatment with the same actual inputs. Familiar setup shortened the work without changing the material yield.')]}),
        command({id:P+'withdraw_spirit',worksSection:'helpers',label:'Withdraw the paused wisp order · keep its held goods',visibleWhen:visible(f('spiritPaused'),f('spiritHasOrders')),requires:all(operating,f('spiritIdle')),
            effects:[res('spiritOrders',{fact:'fieldWorks.spiritOrders',scale:-1})]}),
        ...logisticsCommands(),
        // Return actual held stock after a pause. There is no deletion/dismissal
        // path that can strand funded goods or silently take a worker's output.
        ...[['spirit',WORKS.spirit,['log','coal','empty']],['artisan',WORKS.artisan,['stave','parts','empty']]].flatMap(([role,actor,keys])=>keys.map(k=>command({
            id:P+'recall_'+role+'_'+k,worksSection:role==='spirit'?'helpers':'supply',label:`Recall one ${JSON.parse(K[k]).id} from the paused ${role==='spirit'?'wisp':'fitter'}`,
            visibleWhen:visible(f(role+'Paused')),requires:all(operating,f(role+'Idle','Wait for reserved work to settle before recalling its stock.')),
            costs:[transfer(actor,'player',K[k])]}))),
        ...[1,2,3].map(n=>command({id:P+'refund_artisan_'+n,worksSection:'supply',label:`Close the fitter order · return ${n} unearned coin${n===1?'':'s'}`,visibleWhen:visible(f('artisanPaused'),eq('fieldWorks.artisanOrders',n)),
            requires:all(operating,f('artisanIdle'),eq('fieldWorks.artisanOrders',n)),costs:[res('artisanOrders',-n),res('wages',-n,WORKS.artisan)],effects:[cash(n)]})),
    ],
    controllers:[{id:P+'spirit',revision:1,label:'Assigned workshop wisp',actorId:WORKS.spirit,interval:1,actions:[{commandId:P+'spirit_mill_2',priority:2},{commandId:P+'spirit_mill_1',priority:1}]},
        {id:P+'artisan',revision:1,label:'Funded field fitter',actorId:WORKS.artisan,interval:1,actions:[{commandId:P+'artisan_fit',priority:1}]},
        {id:P+'courier',revision:1,label:'Funded workshop deliveries',actorId:WORKS.courier,interval:1,actions:['collect_spirit','collect_artisan','supply_artisan','supply_spirit'].map((id,i)=>({commandId:P+'courier_'+id,priority:4-i}))}],
};

function logisticsCommands() {
    const C=WORKS.courier;
    const funded=all(f('workerSupported'),f('courierAssigned','The handcart route is paused.'));
    const trip=(id,worker,label,requires,costs,effects)=>({...workerCommand('courier_'+id,C,label,2,all(funded,requires),
        [res('courierOrders',-1),res('wages',-1,C),...costs],[...effects,res('earnedWages',1,C)]),completionRequires:funded,participants:[C,worker],participantsCoLocated:true});
    return [
        command({id:P+'hire_courier',worksSection:'logistics',label:'Open a handcart depot · prepay 3 one-coin trips',once:true,visibleWhen:enrolled,requires:operating,costs:[cash(-3)],
            effects:[{type:'spawn',personId:C,definitionId:C},fact('courier'),fact('courierAssigned'),res('courierOrders',3),res('wages',3,C)],
            description:'A local route between your Shack workshop stations. Completed-output pickups take priority, then fitter and wisp requests. Each two-minute trip reserves its cargo and recipient; waiting costs no wage. Supply the depot from your actual inventory.'}),
        command({id:P+'renew_courier',worksSection:'logistics',label:'Fund three more handcart trips · 3 coins',visibleWhen:visible(f('courier')),requires:all(operating,f('courierContractFinished','The current route still has funded or reserved trips.')),costs:[cash(-3)],
            effects:[fact('courierAssigned'),res('courierOrders',3),res('wages',3,C)]}),
        ...['log','coal','empty','stave','parts'].map(k=>command({id:P+'stock_depot_'+k,worksSection:'logistics',label:`Stock depot · one ${JSON.parse(K[k]).id}`,visibleWhen:visible(f('courier')),requires:operating,costs:[transfer('player',C,K[k])]})),
        ...['log','coal','empty','stave','parts'].map(k=>command({id:P+'recall_courier_'+k,worksSection:'logistics',label:`Recall depot stock · one ${JSON.parse(K[k]).id}`,visibleWhen:visible(f('courierPaused')),requires:all(operating,f('courierIdle','Wait for the reserved trip to settle.')),costs:[transfer(C,'player',K[k])]})),
        command({id:P+'pause_courier',worksSection:'logistics',label:'Pause the handcart route · retain funding and cargo',visibleWhen:visible(f('courierAssigned')),requires:operating,effects:[fact('courierAssigned',false)]}),
        command({id:P+'resume_courier',worksSection:'logistics',label:'Resume the funded handcart route',visibleWhen:visible(f('courierPaused'),f('courierHasOrders')),requires:all(operating,f('courierHasOrders')),effects:[fact('courierAssigned')]}),
        ...[1,2,3].map(n=>command({id:P+'refund_courier_'+n,worksSection:'logistics',label:`Close handcart route · return ${n} unearned coins`,visibleWhen:visible(f('courierPaused'),eq('fieldWorks.courierOrders',n)),
            requires:all(operating,f('courierIdle'),eq('fieldWorks.courierOrders',n)),costs:[res('courierOrders',-n),res('wages',-n,C)],effects:[cash(n)]})),
        ...[['spirit',WORKS.spirit,[['log',1],['coal',1],['empty',1]]],['artisan',WORKS.artisan,[['stave',2],['parts',1],['empty',1]]]].flatMap(([role,worker,inputs])=>[
            trip('supply_'+role,worker,`Handcart delivers the ${role==='spirit'?'wisp':'fitter'} request`,f(role+'NeedsSupply'),inputs.map(([k,n])=>item(K[k],-n,C)),inputs.map(([k,n])=>item(K[k],n,worker))),
            trip('collect_'+role,worker,`Handcart returns ${role==='spirit'?'staves':'survey kits'} and their tray`,f(role+'OutputReady'),[item(K[role==='spirit'?'staves':'kits'],-1,worker)],
                [item(K.empty,1,'player'),item(K[role==='spirit'?'stave':'kit'],2,'player')]),
        ]),
    ];
}

const extension=fieldWorksExtensionDefinitions({I:WORKS,K,item,res,fact,cash,transfer,f,operating,visible,command,timed,workerCommand});
for(const [key,rows] of Object.entries(extension))fieldWorksDefinitions[key].push(...rows);
