import {fieldWorksExtensionFacts,fieldWorksExtensionView,validateFieldWorksExtension} from './field_works_extension_facts.js';
import {check,natural} from './basics.js';
import {WORKS as I,WORKS_KEYS as K,fieldWorksDefinitions} from './field_works_content.js';

const P=I.prefix;
const stock=(state,id)=>state.simulation?.owners?.[id]||{};
const remaining=(state,key)=>(state.actors.player.resources[P+key]||0);
const working=(state,id)=>state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes(id))||false;
export function fieldWorksBodySupported(state,context={}) {
    const own=state.simulation?.people.player?.body,b=own?.id?own:context.nativeBody;
    // The local hand-work default follows actual manipulators and control,
    // rather than using species or the medical-care human-body predicate.
    return context.nativeAlive===true&&b?.ownerId==='player'&&b.controllerId==='player'&&Number.isFinite(b.hands)&&b.hands>=2&&state.simulation?.people.player?.life==='alive';
}
export function fieldWorksFacts(state,context={}) {
    const s=state.simulation,p=state.actors.player,f=p.facts,role=context.actorId||'player';
    const enrolled=f[P+'enrolled']===true,site=s?.sites[I.bench];
    const owned=enrolled&&f[P+'version']===1&&f['field.facility']===true&&site?.owner==='player';
    const local=p.worldId===I.world&&s?.people.player?.life==='alive';
    const supported=owned&&local&&context.facts?.location==='Shack'&&fieldWorksBodySupported(state,context)&&context.nativeReady!==false;
    const ready=id=>s?.people[id]?.life==='alive'&&s.people[id].location==='Shack'&&state.actors[id]?.worldId===I.world;
    const unfilled=id=>![K.empty,K.staves,K.kits,K.fittings,K.log,K.coal,K.stave,K.parts].some(key=>stock(state,id)[key]>0)&&!working(state,id);
    const spiritOrders=remaining(state,'spiritOrders'),artisanOrders=remaining(state,'artisanOrders'),courierOrders=remaining(state,'courierOrders');
    const extension=fieldWorksExtensionFacts(state,context,{I,K,owned,local});
    const result={...extension,enrolled,canBegin:f['field.facility']===true&&local&&context.facts?.location==='Shack'&&fieldWorksBodySupported(state,context),supported,
        workerSupported:owned&&local&&ready(role)&&extension.workerResidenceValid,gardenUntended:remaining(state,'gardenCare')===0,garden:f[P+'garden']===true,composition:f[P+'composition']===true,
        drive:f[P+'drive']===true,connected:f[P+'connected']===true,drive1:remaining(state,'drive')>=1,drive2:remaining(state,'drive')>=2,
        mineralKnown:f[P+'mineralKnown']===true,spirit:f[P+'spirit']===true,spiritRank:f[P+'spiritRank']||0,
        spiritOutputReady:ready(I.spirit)&&!working(state,I.spirit)&&(stock(state,I.spirit)[K.staves]||0)>0,spiritOrders,
        spiritAssigned:f[P+'spiritAssigned']===true,spiritIdle:!working(state,I.spirit),
        spiritUnassigned:ready(I.spirit)&&spiritOrders===0&&!working(state,I.spirit),
        spiritPaused:ready(I.spirit)&&f[P+'spiritAssigned']!==true,
        spiritHasOrders:spiritOrders>0,
        spiritNeedsSupply:ready(I.spirit)&&spiritOrders>0&&unfilled(I.spirit),
        artisanOutputReady:ready(I.artisan)&&!working(state,I.artisan)&&(stock(state,I.artisan)[K.kits]||0)>0,artisanHasOrders:artisanOrders>0,
        courier:f[P+'courier']===true,courierAssigned:f[P+'courierAssigned']===true,courierOrders,courierHasOrders:courierOrders>0,
        courierIdle:!working(state,I.courier),courierPaused:ready(I.courier)&&f[P+'courierAssigned']!==true,
        courierContractFinished:ready(I.courier)&&courierOrders===0&&!working(state,I.courier),
        artisan:f[P+'artisan']===true,artisanAssigned:f[P+'artisanAssigned']===true,artisanOrders,
        artisanIdle:!working(state,I.artisan),artisanContractFinished:ready(I.artisan)&&artisanOrders===0&&!working(state,I.artisan),
        artisanPaused:ready(I.artisan)&&f[P+'artisanAssigned']!==true,
        artisanNeedsSupply:ready(I.artisan)&&artisanOrders>0&&unfilled(I.artisan),
    };
    return Object.fromEntries(Object.entries(result).map(([k,v])=>['fieldWorks.'+k,v]));
}

export function fieldWorksView(state,context={}) {
    const s=state.simulation,f=state.actors.player.facts,r=state.actors.player.resources;
    if(f[P+'enrolled']!==true)return null;
    const count=key=>r[P+key]||0;
    const worker=(id,role)=>{
        if(!s?.people[id])return null;
        const job=s.jobs.find(j=>(j.participants||[j.actorId]).includes(id)),goods=stock(state,id),orders=count(role+'Orders'),assigned=f[P+role+'Assigned']===true;
        let status;
        if(job)status=`${job.label}: ${Math.max(0,job.due-state.clock)} min remaining; ${orders} later batch${orders===1?'':'es'}.`;
        else if(goods[role==='spirit'?K.staves:K.kits])status='Output ready. Collect the filled receiver before another batch.';
        else if(!orders)status='Order finished. Held supplies remain owned and recoverable.';
        else if(!assigned)status=`Paused with ${orders} funded/assigned batches remaining.`;
        else if(state.actors.player.worldId!==I.world)status='Waiting for the supported Frontier clock.';
        else if(!goods[K.empty]||!goods[role==='spirit'?K.log:K.stave]||!goods[role==='spirit'?K.coal:K.parts])status=role==='spirit'?'Requests one log, one charcoal and an empty receiver.':'Requests two measured staves, one spare part and an empty receiver.';
        else if(role==='spirit'&&f[P+'connected']!==true)status='Waiting for the disconnected transmission.';
        else if(role==='spirit'&&count('drive')<1)status='Waiting for one drive unit to be released.';
        else if(role==='spirit'&&count('mana')<1)status='Waiting for one energy unit in your reservoir.';
        else status='Supplied; starts on the next shared work boundary.';
        return {id,role,status,orders,assigned,working:!!job,inventory:{...goods},wages:state.actors[id].resources[P+'wages']||0,earned:state.actors[id].resources[P+'earnedWages']||0};
    };
    const knowledge=s?.knowledge.player?.[P+'mineral'];
    const courier=s?.people[I.courier]?{inventory:{...stock(state,I.courier)},orders:count('courierOrders'),
        wages:state.actors[I.courier].resources[P+'wages']||0,earned:state.actors[I.courier].resources[P+'earnedWages']||0,
        status:s.jobs.find(j=>j.actorId===I.courier)?`${s.jobs.find(j=>j.actorId===I.courier).label}: ${Math.max(0,s.jobs.find(j=>j.actorId===I.courier).due-state.clock)} min remaining. Cargo is reserved in transit.`:
            !count('courierOrders')?'Route finished; depot stock remains recoverable.':f[P+'courierAssigned']!==true?'Route paused; unearned wages and depot stock remain held.':state.actors.player.worldId!==I.world?'Waiting for the supported Frontier clock.':'Waiting for a free recipient, its request and matching depot stock, or completed output. Pickups have priority.'}:null;
    return {...fieldWorksExtensionView(state,context,{I,K}),version:1,gardenCare:count('gardenCare'),courier,mana:count('mana'),space:count('space'),capacity:12,
        drive:f[P+'drive']===true?{free:count('drive'),capacity:2,connected:f[P+'connected']===true}:null,
        mineral:knowledge?.value||'Retained mineral parcel: not yet characterized. You can try its actual behavior in a charge before identifying it.',
        lastWork:f[P+'lastWork']||'',spirit:worker(I.spirit,'spirit'),artisan:worker(I.artisan,'artisan')};
}

export function validateFieldWorksState(state) {
    const p=state.actors.player,s=state.simulation,f=p.facts,r=p.resources;
    const fields=Object.keys(f).filter(k=>k.startsWith(P)),resources=Object.keys(r).filter(k=>k.startsWith(P));
    const jobs=(s?.jobs||[]).filter(j=>j.commandId.startsWith(P));
    if(!fields.length&&!resources.length&&!jobs.length)return;
    const enrolled=f[P+'enrolled']===true;
    if(!enrolled){check(!fields.length&&!resources.length&&jobs.every(j=>j.commandId===P+'begin'),'Practical works require actual setup.');return;}
    check(f[P+'version']===1&&p.completed[P+'begin']===1&&s?.sites[I.bench]?.owner==='player','Unsupported practical works edition or setup.');
    const bools=['enrolled','composition','drive','connected','garden','mineralKnown','spirit','spiritAssigned','artisan','artisanAssigned','courier','courierAssigned','rack','rackRunning','rackCovered','freight','freightAssigned'];
    check(fields.every(k=>[...bools,'version','lastWork','spiritRank','freightIntent'].includes(k.slice(P.length))),'Unknown practical works field.');
    for(const k of bools)check(f[P+k]==null||typeof f[P+k]==='boolean','Invalid practical works flag.');
    check(f[P+'lastWork']==null||typeof f[P+'lastWork']==='string','Invalid practical works receipt.');
    const allowed=['drive','mana','space','spiritOrders','artisanOrders','courierOrders','gardenCare','rackProgress','freightOrders'];
    check(resources.every(k=>allowed.includes(k.slice(P.length))&&natural(r[k])),'Invalid practical works resource.');
    const n=k=>r[P+k]||0;
    const reserved=key=>jobs.reduce((sum,j)=>sum+(j.costs||[]).filter(e=>e.type==='resource'&&e.actor==='player'&&e.key===P+key&&e.amount<0).reduce((a,e)=>a-e.amount,0),0);
    check(n('drive')+reserved('drive')===(f[P+'drive']===true?2:0),'Practical works drive reservation does not balance.');
    check(n('mana')<=12&&n('space')<=12&&n('mana')+n('space')+reserved('mana')+reserved('space')===12,'Practical works reservoir reservation does not balance.');
    check(n('gardenCare')<=3,'Unsupported garden care capacity.');
    for(const [role,id]of [['spirit',I.spirit],['artisan',I.artisan],['courier',I.courier]]) {
        if(f[P+role]!==true){check(!s.people[id]&&!n(role+'Orders'),'A worker order needs its actual contracted worker.');continue;}
        check(s.people[id]?.definitionId===id&&s.people[id].createdBy==='player'&&state.actors[id]?.worldId===I.world,'Unsupported practical works worker.');
        check(n(role+'Orders')+reserved(role+'Orders')<=3,'Unsupported practical works order count.');
    }
    if(f[P+'spirit'])check([1,2].includes(f[P+'spiritRank']),'Unsupported wisp binding rank.');
    for(const [role,id] of [['artisan',I.artisan],['courier',I.courier]])if(f[P+role]) {
        const wages=state.actors[id].resources;
        check(natural(wages[P+'wages'])&&wages[P+'wages']===n(role+'Orders')&&natural(wages[P+'earnedWages']||0),'Worker funding and outstanding work disagree.');
    }
    if(f[P+'mineralKnown'])check(p.completed[P+'observe']===1&&s.knowledge.player?.[P+'mineral']?.stage==='understood','Mineral recognition needs its actual observation.');
    validateFieldWorksExtension(state,{I,K,check,natural});
    const definitions=new Map(fieldWorksDefinitions.commands.map(d=>[d.id,d]));
    for(const [id,value]of Object.entries(p.completed).filter(([id])=>id.startsWith(P)))check(definitions.has(id)&&natural(value)&&value>0,'Unknown practical works completion.');
}
