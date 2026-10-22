import {all,eq,not} from './basics.js';
import {HOME_PLACES} from './home_content.js';
export const FIELD_EXTENSION=Object.freeze({rack:'fieldWorksDryingRack',freighter:'fieldWorksFreighter',shack:'fieldWorksShackDepot',village:'fieldWorksVillageDepot',site:'field.works.village_depot',capacity:12,dryMinutes:6,roadMinutes:HOME_PLACES.shack.travelMinutes});
export const FREIGHT_KEYS=Object.freeze(['log','coal','ore','iron','parts','stave','kit','empty','clay','wet','dry','fired','shards','sample','charge','belmart','golmoon']);
export const freightOrderId=(site,key,count)=>`field.works.freight_order.${site}.${key}.${count}`;
export function fieldWorksExtensionDefinitions(h) {
    const {I,K,item,res,fact,cash,transfer,f,operating,visible,command,timed,workerCommand}=h,E=FIELD_EXTENSION,P=I.prefix;
    const person=(id,label,location='Shack')=>({id,revision:1,label,worldId:I.world,location,inventory:'simulation',provision:false});
    const rackSupport=all(f('rackSupported'),f('rackRunning'));
    const freightSupport=all(f('freightSupported','The road, room or workshop no longer supports this route.'),f('freightAssigned','The road route is paused.'));
    const rackWork=(id,label,requires,costs,effects,duration=0)=>{const d=workerCommand(id,E.rack,label,duration,all(rackSupport,requires),costs,effects);if(!duration)delete d.completionRequires;return d;};
    const commands=[
        command({id:P+'rack',worksSection:'drying',label:'Build an exposed drying rack · 2 logs · 3 min',once:true,...timed(3),visibleWhen:visible(),requires:all(operating,f('clockKnown','This rack needs the native weather calendar.')),costs:[item(K.log,-2)],
            effects:[{type:'spawn',personId:E.rack,definitionId:E.rack},fact('rack'),fact('rackRunning'),res('rackProgress',0)],description:'An outdoor rack beside the Shack frees your hands. Six consecutive dry played minutes dry up to three actual vessels. Rain rewets the unfired batch and resets its drying work.'}),
        command({id:P+'rack_cover',worksSection:'drying',label:'Fit a weather cover · 2 logs + ceramic fragments · 3 min',once:true,...timed(3),visibleWhen:visible(f('rack')),requires:operating,costs:[item(K.log,-2),item(K.shards,-1)],effects:[fact('rackCovered')],description:'A raised timber cover sheds rain while air still circulates. It protects this rack rather than changing the weather.'}),
        ...[1,3].map(n=>command({id:P+'rack_add_'+n,worksSection:'drying',label:`Put ${n} wet vessel${n===1?'':'s'} on the rack · reset this batch’s drying`,visibleWhen:visible(f('rack')),requires:all(operating,f('rackRoom'+n,'Collect the dried work or leave enough room on the three-piece rack.')),
            costs:[transfer('player',E.rack,K.wet,n)],effects:[res('rackProgress',{fact:'fieldWorks.rackProgress',scale:-1})]})),
        ...[['wet','unfinished wet vessel'],['dry','finished dry vessel']].map(([k,label])=>command({id:P+'rack_take_'+k,worksSection:'drying',label:'Take one '+label+' from the rack',visibleWhen:visible(f('rack')),requires:operating,costs:[transfer(E.rack,'player',K[k])],effects:k==='wet'?[res('rackProgress',{fact:'fieldWorks.rackProgress',scale:-1})]:[]})),
        ...[['pause',false],['resume',true]].map(([id,running])=>command({id:P+'rack_'+id,worksSection:'drying',label:`${running?'Resume':'Pause'} the drying rack · keep its actual batch`,visibleWhen:visible(f('rack'),eq('fieldWorks.rackRunning',!running)),requires:operating,effects:[fact('rackRunning',running)]})),
        {...rackWork('rack_rain','Rain rewets the exposed batch',f('rackReset'),[res('rackProgress',{fact:'fieldWorks.rackProgress',scale:-1})],[]),requires:all(f('rackSupported'),f('rackReset'))},
        ...[1,2,3].map(n=>rackWork('rack_finish_'+n,'The rack batch finishes drying',all(f('rackFinish'),eq('fieldWorks.rackWet',n)),[item(K.wet,-n),res('rackProgress',-E.dryMinutes)],[item(K.dry,n)])),
        {...rackWork('rack_tick','Air circulates through the drying rack',f('rackCanDry'),[],[res('rackProgress',1,'player',E.dryMinutes)],1),completionRequires:all(rackSupport,f('rackCanDry'))},
        command({id:P+'freight',worksSection:'freight',label:'Open Shack–Village freight · 2 logs + 2 coins',once:true,visibleWhen:visible(),requires:operating,costs:[item(K.log,-2),cash(-2)],
            effects:[...[[E.shack,'Shack'],[E.village,'Village'],[E.freighter,'Shack']].map(([id])=>({type:'spawn',personId:id,definitionId:id})),{type:'site',siteId:E.site,operation:'open'},fact('freight'),fact('freightAssigned'),fact('freightIntent','none'),res('freightOrders',0),res('wages',0,E.freighter),...['shack','village'].map(site=>res('storage',E.capacity,E[site]))],
            description:`The association provides a dispatch bay in Village and a box at your workshop, each holding ${E.capacity} units. A hired carrier follows the existing ${E.roadMinutes}-minute road in either direction. One prepaid coin funds one delivered parcel, including an empty return when needed. Stock stays at the destination until collected there.`}),
        ...['shack','village'].flatMap(site=>FREIGHT_KEYS.flatMap(k=>[
            command({id:P+'freight_store_'+site+'_'+k,location:site==='shack'?'Shack':'Village',worksSection:'freight',label:'Store one '+JSON.parse(K[k]).id+' in this depot',visibleWhen:visible(f('freight'),f('at_'+site)),requires:f('freightPlayerSupported'),costs:[res('storage',-1,E[site]),transfer('player',E[site],K[k])]}),
            command({id:P+'freight_take_'+site+'_'+k,location:site==='shack'?'Shack':'Village',worksSection:'freight',label:'Take one '+JSON.parse(K[k]).id+' from this depot',visibleWhen:visible(f('freight'),f('at_'+site)),requires:f('freightPlayerSupported'),costs:[transfer(E[site],'player',K[k])],effects:[res('storage',1,E[site],E.capacity)]}),
            ...[1,3].map(n=>{
                const other=site==='shack'?'village':'shack',intent=`${site}.${k}.${n}`;
                return command({id:freightOrderId(site,k,n),location:site==='shack'?'Shack':'Village',worksSection:'freight',worksFreightOrder:true,label:`Send ${n} ${JSON.parse(K[k]).id} to ${other==='shack'?'Shack':'Village'} · prepay 1 coin`,visibleWhen:visible(f('freight'),f('at_'+site)),
                    requires:all(f('freightPlayerSupported'),not(f('freightHasOrder')),f('freightAvailable_'+intent,'The origin needs the actual cargo and the destination needs receiving space.')),costs:[cash(-1)],effects:[fact('freightIntent',intent),res('freightOrders',1),res('wages',1,E.freighter),fact('freightAssigned')]});
            }),
        ])),
        ...[['pause',false],['resume',true]].map(([id,assigned])=>command({id:P+'freight_'+id,location:undefined,worksSection:'freight',label:`${assigned?'Resume':'Pause'} the road route · keep the prepaid parcel`,visibleWhen:visible(f('freight'),eq('fieldWorks.freightAssigned',!assigned)),requires:f('freightPlayerSupported'),effects:[fact('freightAssigned',assigned)]})),
        command({id:P+'freight_cancel',location:undefined,worksSection:'freight',label:'Withdraw the unstarted parcel · return its unearned coin',visibleWhen:visible(f('freight'),f('freightHasOrder')),requires:all(f('freightPlayerSupported'),f('freightIdle','Let the current road leg settle before withdrawing its order.')),
            costs:[res('freightOrders',-1),res('wages',-1,E.freighter)],effects:[cash(1),fact('freightIntent','none')]}),
        ...['shack','village'].flatMap(site=>{
            const other=site==='shack'?'village':'shack',here=site==='shack'?'Shack':'Village',there=other==='shack'?'Shack':'Village';
            const road=(id,label,requires,costs,effects)=>({...workerCommand(id,E.freighter,label,E.roadMinutes,all(freightSupport,f('freightAt_'+site),requires),costs,effects),location:undefined,completionRequires:freightSupport});
            return [road('freight_return_'+site,`Carrier returns empty from ${here} to ${there}`,f('freightReturn_'+site),[],[{type:'relocate',actor:E.freighter,location:there}]),
                ...FREIGHT_KEYS.flatMap(k=>[1,3].map(n=>road('freight_deliver_'+site+'_'+k+'_'+n,`Parcel: ${n} ${JSON.parse(K[k]).id}, ${here} → ${there}`,eq('fieldWorks.freightIntent',`${site}.${k}.${n}`),
                    [res('freightOrders',-1),res('wages',-1,E.freighter),item(K[k],-n,E[site]),res('storage',-n,E[other])],
                    [item(K[k],n,E[other]),res('storage',n,E[site],E.capacity),res('earnedWages',1,E.freighter),fact('freightIntent','none'),{type:'relocate',actor:E.freighter,location:there}]))),
            ];
        }),
        // Exact missing components remain deliverable after a partial recall.
        ...[['spirit',I.spirit,[['log',1],['coal',1],['empty',1]]],['artisan',I.artisan,[['stave',2],['parts',1],['empty',1]]]].flatMap(([role,id,inputs])=>inputs.map(([k])=>command({id:P+'topup_'+role+'_'+k,worksSection:role==='spirit'?'helpers':'supply',label:`Top up ${role==='spirit'?'wisp':'fitter'} · one missing ${JSON.parse(K[k]).id}`,visibleWhen:visible(f(role+'Missing_'+k)),requires:operating,costs:[transfer('player',id,K[k])]}))),
    ];
    for(const c of commands)if(c.location===undefined)delete c.location;
    return {sites:[{id:E.site,revision:1,label:'Village association dispatch bay',worldId:I.world,location:'Village',capacity:1,provision:false}],people:[person(E.rack,'Outdoor drying rack'),person(E.shack,'Shack freight box'),person(E.village,'Village dispatch box','Village'),person(E.freighter,'Road freighter')],commands,
        controllers:[{id:P+'rack',revision:1,label:'Exposed rack weather and drying',actorId:E.rack,interval:1,actions:['rack_rain',... [1,2,3].map(n=>'rack_finish_'+n),'rack_tick'].map((id,i)=>({commandId:P+id,priority:6-i}))},
            {id:P+'freighter',revision:1,label:'Funded road parcel',actorId:E.freighter,interval:1,actions:commands.filter(c=>c.actorId===E.freighter).map(c=>({commandId:c.id,priority:1}))}]};
}
