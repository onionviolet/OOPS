import {registerDomain} from './domain_registry.js';
import {emptyRoute,readRoute,recordArrival,nextRouteLeg,villageRouteRule as rule} from './recorded_route.js';
import {kitElement,kitControl} from './ui/kit.js';

let ports,state=emptyRoute(),busy=false,refreshControls;
export function configureRoutes(adapter){ports=adapter;}
const rowFor=ctx=>state.life===ctx.life?state:emptyRoute();
function write(next,message) {
    ports.persist(next);
    state=next;
    refreshControls?.();
    if(message)ports.report(message);
}
export function observeRouteArrival(from,to) {
    if(busy||!ports||!from||from===to)return;
    const ctx=ports.context(),row=rowFor(ctx);
    if(ctx.world!==rule.world||row.mode!=='recording')return;
    const next=recordArrival(row,from,to);
    write(next,next.mode==='ready'?'Route recording stopped.':`Recorded the walk to ${to}.`);
}
export function idleRouteStep() {
    if(busy||!ports)return;
    const ctx=ports.context(),row=rowFor(ctx);
    if(row.mode!=='replaying'||!ports.writable())return;
    const to=row.places[row.cursor];
    const leg=nextRouteLeg(row,{place:ctx.place,hostile:ctx.hostile,rain:ctx.rain&&ports.outdoors(to),
        open:ctx.world===rule.world&&ports.open(to)});
    const stop=reason=>write({...row,mode:'ready',cursor:0},`Route interrupted by ${reason}.`);
    if(leg.reason)return stop(leg.reason);
    if(ctx.occupied)return stop('another occupation');
    busy=true;
    try{
        ports.walk(to);
        const arrival=ports.context();
        if(arrival.place!==to)return stop('an unavailable passage');
        const done=row.cursor+1===row.places.length||arrival.hostile;
        write({...row,cursor:done?0:row.cursor+1,mode:done?'ready':'replaying'},
            arrival.hostile?`Route interrupted by a hostile encounter at ${to}.`:done?`Finished the recorded route at ${to}.`:`Followed the recorded route to ${to}.`);
    }finally{busy=false;}
}
export function routeControls(){
    if(!ports||ports.context().world!==rule.world)return;
    const box=kitElement('section','');box.dataset.recordedRoute='';
    function render(){
        const ctx=ports.context(),row=rowFor(ctx),renderedState=state;
        const names=row.places.map(place=>ports.known(place)?place:'Unknown place');
        box.replaceChildren(kitElement('p','',names.length?`Recorded route: ${names.join(' ? ')}`:'No recorded route.'));
        function control(label,next,line,disabled=false){
            const button=kitControl(kitElement('button','',label));button.type='button';button.disabled=disabled||!ports.writable();
            button.addEventListener('click',()=>{if(!ports.writable()||state!==renderedState||ctx.life!==ports.context().life)return render();write(next,line);});
            box.append(button);
        }
        if(!row.places.length)control('Record a route',{...emptyRoute(),life:ctx.life,mode:'recording',places:[ctx.place]},'Recording your walks.');
        if(row.mode==='recording')control('Finish recording',{...row,mode:'ready'},'Saved your recorded route.');
        if(row.mode==='ready'&&row.places.length>1)control('Replay while idle',{...row,mode:'replaying',cursor:1},'Following the recorded route on idle minutes.',row.places[0]!==ctx.place);
        if(row.mode==='replaying')control('Stop replay',{...row,mode:'ready',cursor:0},'Stopped following the recorded route.');
        if(row.places.length)control('Forget route',emptyRoute(),'Forgot the recorded route.');
    }
    refreshControls=render;render();return box;
}
registerDomain({id:'recorded_route',initialState:emptyRoute,validate:saved=>readRoute(saved),
    load:saved=>{state=readRoute(saved);},save:()=>state.places.length?readRoute(state):undefined});
