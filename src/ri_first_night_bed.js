import {registerDomain} from './domain_registry.js';
import {beginRiInnSleepRecovery} from './ri_lead_sea_domain.js';
// Native housing for Fang Yuan's household and earned inn room. Sleep, recovery of
// the native body and elapsed time remain owned by YAIR's sleep/wake host.
import {GU_FIRST_NIGHT_CHOICE,GU_FIRST_NIGHT_SLEEP_ACTION,GU_FIRST_NIGHT_STARTED,
    guFirstNightChoiceExtension} from './world_packs/book_gu_lead_first_night_choice.js';
const PACK='book.ri.lead',WORLD=PACK+'.world',HOME=PACK+'.home',VITAL=PACK+'.vital';
const originalUnlocked=new WeakMap(),originalPlaceView=new WeakMap();
const sceneViews={
    inn:{name:'Room at the inn',description:'You have taken a room at the village inn.'},
    grove:{name:'Mountain bamboo grove',description:'You are among the bamboo on the mountain.'},
    crevice:{name:'Rock crevice',description:'The narrow opening has brought you inside the rock.'}
};
function currentPlaceView(c,base) {
    if(c.record?.packId!==PACK||c.state?.actors?.player?.worldId!==WORLD)return base;
    const scene=c.state.actors.player.facts?.[PACK+'.vital.scene'];
    if(scene==null||scene==='home')return base;
    return sceneViews[scene]||{name:'Your surroundings',description:'You are away from your room in the guardians’ house.'};
}
export function createRiFirstNightBed({locations,availabilities,makeHousing,read,view,command,startSleep,refreshLocal=()=>{},log=()=>{},extension=guFirstNightChoiceExtension,beginInnRecovery=beginRiInnSleepRecovery}) {
    const home=locations[HOME];
    if(!home)throw Error('The household location must be registered before its bed.');
    const housing=home.housing||makeHousing({is_unlocked:true,sleeping_xp_per_tick:1,text_to_sleep:'Sleep in your bed'});
    home.housing=housing;
    housing.personal_storage=false;
    availabilities.location[HOME+':housing']=housing.getAvailabilityComponent();
    if(!originalUnlocked.has(housing))originalUnlocked.set(housing,housing.isUnlocked.bind(housing));
    if(!originalPlaceView.has(home))originalPlaceView.set(home,{name:home.name||'Guardians’ house',
        description:home.getDescription?.bind(home)||(()=>home.description||'')});
    const basePlace=originalPlaceView.get(home);
    Object.defineProperty(home,'name',{configurable:true,enumerable:true,
        get:()=>currentPlaceView(read(),basePlace).name,set:value=>{basePlace.name=value;}});
    home.getDescription=()=>{
        const current=currentPlaceView(read(),basePlace);
        return current===basePlace?basePlace.description():current.description;
    };
    let ownsSleep=false,lastView=null;
    const sameLife=c=>{
        const p=c.state?.simulation?.people?.player,r=c.record;
        return r?.packId===PACK&&r.worldId===WORLD&&c.state?.actors?.player?.worldId===WORLD
            &&r.locationIds?.includes(HOME)&&c.nativeAlive===true&&p?.life==='alive'
            &&p.body?.id===r.bodyId&&p.body?.ownerId==='player'&&p.body?.controllerId==='player';
    };
    const bedKind=c=>{
        if(!sameLife(c))return null;
        const actor=c.state.actors.player,scene=actor.facts?.[VITAL+'.scene'];
        if(scene==null||scene==='home')return 'home';
        // The paid action is the receipt. The later inn_bed fact describes
        // where the worm was left, and cannot confer a paid room by itself.
        if(scene==='inn'&&c.record.extensions?.some(pin=>pin.id===VITAL)
            &&actor.completed?.[VITAL+'.leave']>0)return 'inn';
        return null;
    };
    const atBed=c=>{
        const kind=bedKind(c);
        return kind&&c.locationId===HOME&&c.state.simulation.people.player.location===HOME
            &&originalUnlocked.get(housing)()?kind:null;
    };
    housing.isUnlocked=()=>!!bedKind(read())&&originalUnlocked.get(housing)();
    Object.defineProperty(housing,'text_to_sleep',{configurable:true,enumerable:true,
        get:()=>bedKind(read())==='inn'?'Sleep in your room at the inn':'Sleep in your bed'});
    return {
        housing,
        refresh() {
            const c=read(),scene=c.state?.actors?.player?.facts?.[PACK+'.vital.scene'];
            const key=JSON.stringify([c.locationId,c.record?.instanceId,scene,housing.isUnlocked(),
                c.state?.simulation?.people?.player?.location]);
            if(key===lastView)return;
            lastView=key;
            if(c.locationId===HOME)refreshLocal();
        },
        prepare() {
            let c=read();
            const inLife=c.record?.packId===PACK||c.state?.actors?.player?.worldId===WORLD;
            if(!inLife){ownsSleep=false;return true;}
            const kind=atBed(c);
            if(!kind){log('You need to be by a bed you can use.');return false;}
            if(c.restoring){ownsSleep=kind;return true;}
            if(!c.writable){log('Restore saving before settling into bed.');return false;}
            if((typeof c.busy==='function'?c.busy():c.busy)||c.state.simulation.jobs.some(job=>job.actorId==='player')||c.state.pending?.some(job=>job.context?.actorId==='player')){
                log('Finish or stop your current work before settling into bed.');return false;
            }
            ownsSleep=kind;
            // Paid lodging is already earned. Sleeping there uses the native
            // host without replaying the household's first-night choice.
            if(kind==='inn'){beginInnRecovery(c.state);return true;}
            if(c.state.simulation.knowledge?.player?.[GU_FIRST_NIGHT_STARTED])return true;
            try{
                const installed=extension();
                if(installed&&!c.record.extensions?.some(pin=>pin.id===GU_FIRST_NIGHT_CHOICE)){
                    const offer=view().extensions?.find(row=>row.id===GU_FIRST_NIGHT_CHOICE);
                    if(offer?.eligible)command({type:'adopt-extension',id:offer.id,revision:offer.revision,contentHash:offer.contentHash});
                }
                c=read();
                if(c.record.extensions?.some(pin=>pin.id===GU_FIRST_NIGHT_CHOICE)){
                    const action=view().actions?.find(row=>row.id===GU_FIRST_NIGHT_SLEEP_ACTION);
                    if(action?.eligible)command({type:'action',id:GU_FIRST_NIGHT_SLEEP_ACTION});
                }
                // A normal structured Sleep action can already have entered the
                // host through settled(); the original caller must not start twice.
                return !read().sleeping;
            }catch(error){log('Sleep could not be started. '+error.message);return false;}
        },
        continuing() {
            if(!ownsSleep)return true;
            if(atBed(read())===ownsSleep)return true;
            ownsSleep=false;log('You are no longer resting by your bed.');return false;
        },
        settled(request) {
            if(request.type==='action'&&request.id===GU_FIRST_NIGHT_SLEEP_ACTION)startSleep();
        }
    };
}
let bed=null;
export const configureRiFirstNightBed=ports=>bed=createRiFirstNightBed(ports);
export const prepareRiFirstNightSleep=()=>bed?.prepare()??true;
export const continueRiFirstNightSleep=()=>bed?.continuing()??true;
export const settleRiFirstNightSleep=request=>bed?.settled(request);

registerDomain({id:'ri_native_bed',refresh:()=>bed?.refresh()});
