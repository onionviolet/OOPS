import {FIELD_EXTENSION as E,FREIGHT_KEYS} from './field_works_extension_content.js';
import {workerLodgingStatus} from './home_workers.js';
import {isRainingAtMinute} from './weather_calendar.js';
import {receivedRainDose} from './drying_exposure.js';
const busy=(s,id)=>s.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes(id));
export function fieldCalendarMinute(state,context) {
    const a=context.remainderLivelihoodClock;
    return Number.isFinite(a?.calendarMinute)&&Number.isFinite(a.clock)?a.calendarMinute+state.clock-a.clock:Number.isFinite(context.facts?.calendarMinute)?context.facts.calendarMinute:null;
}
export function fieldWeatherMinute(state,context){const a=context.nativeWeatherClock;return Number.isFinite(a?.minute)&&Number.isFinite(a.clock)?a.minute+state.clock-a.clock:null;}
export function fieldWorksExtensionFacts(state,context,{I,K,owned,local}) {
    const P=I.prefix,s=state.simulation,f=state.actors.player.facts,r=state.actors.player.resources,minute=fieldCalendarMinute(state,context),weatherMinute=fieldWeatherMinute(state,context),id=context.actorId||'player',person=s?.people[id];
    const location=context.facts?.location||person?.location,n=k=>r[P+k]||0,stock=actor=>s?.owners[actor]||{};
    if(f[P+'enrolled']!==true)return {clockKnown:weatherMinute!==null,workerCanStart:true,workerResidenceValid:true};
    const housing=workerLodgingStatus(context.nativeHomes,id,minute);
    const ready=actor=>s?.people[actor]?.life==='alive'&&state.actors[actor]?.worldId===I.world;
    const running=f[P+'rackRunning']===true,wet=stock(E.rack)[K.wet]||0,dry=stock(E.rack)[K.dry]||0,progress=n('rackProgress'),covered=f[P+'rackCovered']===true,raining=weatherMinute!==null&&isRainingAtMinute(weatherMinute),receivedRain=receivedRainDose(raining?1000:0,covered?1000:0)>0;
    const intent=f[P+'freightIntent']||'none',hasOrder=intent!=='none',origin=intent.split('.')[0],carrier=s?.people[E.freighter],freight=f[P+'freight']===true;
    const playerSupported=owned&&local&&['Shack','Village'].includes(location)&&context.nativeAlive===true&&context.nativeReady!==false;
    const out={clockKnown:weatherMinute!==null,workerCanStart:housing.canStart,workerResidenceValid:housing.valid,
        rackSupported:owned&&local&&ready(E.rack)&&weatherMinute!==null,rackRunning:running,rackWet:wet,rackDry:dry,rackProgress:progress,
        rackCanDry:wet>0&&progress<E.dryMinutes&&!receivedRain,rackFinish:wet>0&&progress>=E.dryMinutes&&!receivedRain,rackReset:wet>0&&progress>0&&receivedRain,
        rackRoom1:dry===0&&wet+1<=3,rackRoom3:dry===0&&wet===0,rack:f[P+'rack']===true,
        freight,freightAssigned:f[P+'freightAssigned']===true,freightIntent:intent,freightHasOrder:hasOrder,freightIdle:!busy(state,E.freighter),
        freightPlayerSupported:freight&&playerSupported,at_shack:location==='Shack',at_village:location==='Village',
        freightSupported:freight&&owned&&local&&ready(E.freighter)&&ready(E.shack)&&ready(E.village)&&s.sites[E.site]?.owner==='player'&&workerLodgingStatus(context.nativeHomes,E.freighter,minute).valid,
        freightAt_shack:carrier?.location==='Shack',freightAt_village:carrier?.location==='Village',
        freightReturn_shack:hasOrder&&origin==='village'&&carrier?.location==='Shack',freightReturn_village:hasOrder&&origin==='shack'&&carrier?.location==='Village'};
    for(const site of ['shack','village'])for(const k of FREIGHT_KEYS)for(const count of [1,3])out['freightAvailable_'+`${site}.${k}.${count}`]=(stock(E[site])[K[k]]||0)>=count&&(state.actors[E[site]]?.resources[P+'storage']||0)>=0&&(state.actors[E[site==='shack'?'village':'shack']]?.resources[P+'storage']||0)>=count;
    for(const [role,actor,inputs,output]of [['spirit',I.spirit,[['log',1],['coal',1],['empty',1]],K.staves],['artisan',I.artisan,[['stave',2],['parts',1],['empty',1]],K.kits]])
        for(const [k,count]of inputs)out[role+'Missing_'+k]=ready(actor)&&n(role+'Orders')>0&&!busy(state,actor)&&!stock(actor)[output]&&(stock(actor)[K[k]]||0)<count;
    return out;
}
export function fieldWorksExtensionView(state,context,{I,K}) {
    const P=I.prefix,s=state.simulation,f=state.actors.player.facts,n=k=>state.actors.player.resources[P+k]||0,minute=fieldCalendarMinute(state,context),stock=id=>({...s.owners[id]});
    const rack=f[P+'rack']?{wet:s.owners[E.rack]?.[K.wet]||0,dry:s.owners[E.rack]?.[K.dry]||0,progress:n('rackProgress'),running:f[P+'rackRunning']===true,covered:f[P+'rackCovered']===true,raining:fieldWeatherMinute(state,context)===null?null:isRainingAtMinute(fieldWeatherMinute(state,context))}:null;
    const freight=f[P+'freight']?{intent:f[P+'freightIntent'],assigned:f[P+'freightAssigned']===true,location:s.people[E.freighter]?.location,
        job:s.jobs.find(j=>j.actorId===E.freighter),funded:n('freightOrders'),earned:state.actors[E.freighter]?.resources[P+'earnedWages']||0,
        depots:Object.fromEntries(['shack','village'].map(site=>[site,{stock:stock(E[site]),space:state.actors[E[site]].resources[P+'storage']}]))}:null;
    return {rack,freight,housing:Object.fromEntries([I.artisan,I.courier,E.freighter].filter(id=>s.people[id]).map(id=>[id,workerLodgingStatus(context.nativeHomes,id,minute)]))};
}
export function validateFieldWorksExtension(state,{I,K,check,natural}) {
    const P=I.prefix,s=state.simulation,f=state.actors.player.facts,r=state.actors.player.resources,jobs=s.jobs.filter(j=>j.commandId.startsWith(P));
    if(f[P+'rack']){
        check(s.people[E.rack]?.createdBy==='player'&&s.people[E.rack].definitionId===E.rack,'The rack needs actual construction.');
        const inv=s.owners[E.rack];check(Object.keys(inv).every(k=>[K.wet,K.dry].includes(k))&&(inv[K.wet]||0)+(inv[K.dry]||0)<=3,'Unsupported drying batch.');
        check(natural(r[P+'rackProgress'])&&r[P+'rackProgress']<=E.dryMinutes,'Unsupported drying progress.');
    }
    if(f[P+'freight']){
        for(const id of [E.shack,E.village,E.freighter])check(s.people[id]?.createdBy==='player'&&s.people[id].definitionId===id&&state.actors[id]?.worldId===I.world,'Freight needs its actual local owners.');
        check(s.sites[E.site]?.owner==='player'&&['Shack','Village'].includes(s.people[E.freighter].location),'Unsupported freight endpoints.');
        const intent=f[P+'freightIntent'];check(intent==='none'||['shack','village'].some(site=>FREIGHT_KEYS.some(k=>[1,3].some(n=>intent===`${site}.${k}.${n}`))),'Unknown freight parcel.');
        const work=jobs.filter(j=>j.actorId===E.freighter),orders=r[P+'freightOrders']||0,wages=state.actors[E.freighter].resources[P+'wages'];
        const reserved=work.reduce((n,j)=>n+j.costs.filter(c=>c.type==='resource'&&c.actor==='player'&&c.key===P+'freightOrders').reduce((n,c)=>n-c.amount,0),0);
        check(natural(wages)&&wages===orders&&orders+reserved===(intent==='none'?0:1)&&natural(state.actors[E.freighter].resources[P+'earnedWages']||0),'Freight funding and its actual parcel disagree.');
        for(const site of ['shack','village']){
            const actor=E[site],inv=s.owners[actor],space=state.actors[actor].resources[P+'storage'];
            const reserved=work.reduce((n,j)=>n+j.costs.reduce((n,c)=>n+(c.actor===actor&&(c.type==='item'||c.type==='resource'&&c.key===P+'storage')?-c.amount:0),0),0);
            check(Object.keys(inv).every(k=>FREIGHT_KEYS.some(name=>K[name]===k))&&natural(space)&&Object.values(inv).reduce((a,b)=>a+b,0)+space+reserved===E.capacity,'Freight receiving space and held/reserved cargo do not balance.');
        }
    }
}
