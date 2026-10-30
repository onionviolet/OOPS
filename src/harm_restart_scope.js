// Death restart scope (AR3, AR6). No continuation schema change. Intentional
// initial/checkpoint/cycle rewinds still use their existing whole-save route.
// Default: replay the seat and its world, retain other worlds and shared records.
// Dial: Frontier keeps its historical whole-save rewind. New owner adapters can
// narrow the default when their in-world temporal mechanism needs another rule.
//
// Expansion clock/sequence and shared simulation ledgers stay at the source's
// time, so retained owners cannot end up in their own future. The native calendar
// stays shared when bound to a chronicle or retained calendar-driven residents;
// otherwise it is the replayed body's local date. Seat deadlines use the clock
// delta, preserving their remaining duration without moving retained deadlines.
// The anchor body wins for carried items, purse/resources and custody, regardless
// of the goods' namespace. Retained owners keep their gift/completion receipts,
// so their grants are not recreated. carry_ledger.js describes boundary rules;
// it is not a second inventory or a transaction log to replay on a restart.
// A loan that would otherwise duplicate an anchor copy reconciles the retained
// holder's actual stock. If that copy has been spent or moved beyond the known
// custody binding, refuse rather than fabricate stock or erase another item.
// No second calendar owner is invented. A retained active visit
// cannot share the restored body. All refusals leave both inputs untouched.
import {check, copy, deepFreeze} from './basics.js';

const owners=['lotm','proto23Village','motherOfLearning','mistglassRealm',
    'realmPrototype','featureDestination','nestedCampaign','bookWorldCampaign'];
const scoped={mode:'scoped',replace:['expansion.worlds[worldId]','expansion.actors[seat]','expansion.simulation[seat]',
    'character','levels[seat]','inventories[seat]','quests[seat]','harm','unbound current time'],
    retain:['expansion.worlds[other]','expansion[other owners]','expansion.clock','expansion.sequence',
        'expansion.simulation[shared records]','cross-world records','bound current time'],
    reason:'The connection replays this life; other lives and their worlds continue.'};
export const RESTART_SCOPES=deepFreeze({default:{...scoped},'book.lotm.tingen':{...scoped},
    'base.frontier':{mode:'whole',replace:['save'],retain:['restore carries'],
        reason:'Frontier retains its existing whole-save intentional-loop semantics.'}});

const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const keys=(a,b)=>new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
function setFrom(to,from,key) {
    if(Object.hasOwn(from||{},key))to[key]=copy(from[key]);else delete to[key];
}
function ownerHasWorld(owner,worldId) {
    if(!record(owner))return false;
    if(owner.worldId===worldId)return true;
    return Object.values(owner.instances||{}).some(i=>i?.worldId===worldId||i?.endpoint?.worldId===worldId);
}
// Only deadlines move. Historical receipts keep their actual recorded time.
function deadlines(value,delta) {
    if(!value||typeof value!=='object')return value;
    for(const [key,x] of Object.entries(value)) {
        if(['due','nextTick','expiresAt','deadline'].includes(key)&&Number.isSafeInteger(x))value[key]=x+delta;
        else if(x&&typeof x==='object')deadlines(x,delta);
    }
    return value;
}
function partition(source,target,belongs,move=x=>copy(x)) {
    if(Array.isArray(source)||Array.isArray(target))return [
        ...(source||[]).filter(x=>!belongs('',x)).map(x=>copy(x)),
        ...(target||[]).filter(x=>belongs('',x)).map(move)];
    const next=copy(source||{});
    for(const key of keys(source,target)) {
        if(belongs(key,source?.[key])||belongs(key,target?.[key])) {
            if(Object.hasOwn(target||{},key))next[key]=move(target[key]);else delete next[key];
        }
    }
    return next;
}

export function scopedRestart(source,target,worldId) {
    const scope=Object.hasOwn(RESTART_SCOPES,worldId)?RESTART_SCOPES[worldId]:RESTART_SCOPES.default;
    if(scope.mode==='whole')return copy(target);
    const live=source.expansion||{},anchor=target.expansion||{};
    const dyingOwners=new Set(owners.filter(key=>key==='lotm'?worldId==='book.lotm.tingen':
        ownerHasWorld(live[key],worldId)||ownerHasWorld(anchor[key],worldId)));
    for(const key of owners)if(!dyingOwners.has(key))check(live[key]?.activeVisitId==null,
        `Cannot restart while the retained ${key} owner has an active visit. End that visit before restarting.`);
    const next=copy(target),state=copy(live);
    next.expansion=state;
    if(live.chronicle||source.generated_people||source.npc_lives)setFrom(next,source,'current time');
    state.worlds=copy(live.worlds||{});setFrom(state.worlds,anchor.worlds,worldId);
    for(const key of dyingOwners)setFrom(state,anchor,key);
    // The random draw cursor belongs to the replayed seat; named shared streams
    // and the host sequence remain live so retained receipts keep their identity.
    setFrom(state,anchor,'rng');
    const delta=Number.isSafeInteger(live.clock)&&Number.isSafeInteger(anchor.clock)?live.clock-anchor.clock:0;
    check(delta>=0,'Cannot restart before the anchor expansion clock.');
    const actors=new Set(['player',...Array.from(keys(live.actors,anchor.actors)).filter(id=>
        live.actors?.[id]?.worldId===worldId||anchor.actors?.[id]?.worldId===worldId)]);
    state.actors=copy(live.actors||{});
    for(const id of actors){setFrom(state.actors,anchor.actors,id);deadlines(state.actors[id],delta);}
    const prefix=worldId==='book.lotm.tingen'?'book.lotm.':worldId+'.';
    // Foreign knowledge and completion receipts remain live. Consumable resources
    // belong to the anchor body, even when their names name a retained world.
    for(const key of ['facts','completed','sources','techniques'])if(state.actors.player)
        for(const [id,value] of Object.entries(live.actors?.player?.[key]||{}))
            if(id.includes('.')&&!id.startsWith(prefix)) {
                state.actors.player[key] ||= {};state.actors.player[key][id]=copy(value);
            }
    const belongs=(id,row)=> {
        if(id.startsWith(prefix)||actors.has(id)||actors.has(row?.actorId)||actors.has(row?.context?.actorId)||
            actors.has(row?.ownerId)||actors.has(row?.owner)||actors.has(row?.holder)||
            row?.participants?.some(id=>actors.has(id)))return true;
        const world=row?.worldId||row?.context?.worldId;
        if(world)return world===worldId;
        if(id.includes('.'))return false;
        return actors.has(row?.actorId)||actors.has(row?.ownerId)||
            actors.has(row?.owner)||row?.participants?.some(id=>actors.has(id));
    };
    for(const key of ['pending','opportunities','scenarios','checkpoints'])
        if(live[key]!=null||anchor[key]!=null)state[key]=partition(live[key],anchor[key],belongs,x=>deadlines(copy(x),delta));
    if(live.simulation||anchor.simulation) {
        const s=state.simulation=copy(live.simulation||{}),a=anchor.simulation||{};
        // These are shared event/cause/history ledgers, not the seat's present
        // embodiment. Other keyed maps partition by actor, world or namespace.
        const shared=new Set(['schema','seed','enrolledAt','causes','log','transitions']);
        for(const key of keys(s,a))if(!shared.has(key)) {
            if(record(s[key])||record(a[key])||Array.isArray(s[key])||Array.isArray(a[key]))
                s[key]=partition(s[key],a[key],belongs,x=>deadlines(copy(x),delta));
        }
        // Jobs bind actual participants, even when the destination's namespace
        // is retained. Reconcile site reservations with the selected jobs; a
        // retained road/workshop must not reserve the abandoned body.
        const jobs=new Map((s.jobs||[]).map(job=>[job.id,job]));
        for(const site of Object.values(s.sites||{}))for(const id of Object.keys(site.reservations||{}))
            if(!jobs.has(id))delete site.reservations[id];
        for(const job of s.jobs||[])if(job.siteId&&s.sites?.[job.siteId])
            s.sites[job.siteId].reservations[job.id]=job.actorId;
        // Cross-world observations and relationships belong to the continuing
        // record, even though the player's local LOTM facts rewind.
        for(const key of ['knowledge','relationships'])if(s[key])for(const actor of actors) {
            s[key][actor]=partition(live.simulation?.[key]?.[actor],a[key]?.[actor],
                (id)=>key==='knowledge'?id.startsWith(prefix):actors.has(id));
            if(!Object.keys(s[key][actor]).length&&!Object.hasOwn(a[key]||{},actor)&&
                !Object.hasOwn(live.simulation?.[key]||{},actor))delete s[key][actor];
        }
    }
    // Retain independent native owners, metadata and records. Body fields and
    // their native world projections keep restore's anchor defaults.
    for(const key of ['memory','generated_people','npc_lives','retired_content','content_packs'])setFrom(next,source,key);
    // Owner namespaces can appear after the anchor. Preserve non-seat residents,
    // communal stock and their XP; the native player stays the replayed body.
    for(const key of ['npcs','npc_equipment'])if(source[key]) {
        next[key] ||= {};
        for(const [id,value] of Object.entries(source[key]))if(!actors.has(id))next[key][id]=copy(value);
    }
    for(const key of ['inventories','levels'])if(source[key]) {
        next[key] ||= {};
        for(const [group,rows] of Object.entries(source[key])) {
            if(!record(rows))continue;
            next[key][group] ||= {};
            for(const [id,value] of Object.entries(rows))if(id!=='main_character'&&!actors.has(id)&&!id.startsWith(prefix))
                next[key][group][id]=copy(value);
        }
    }
    // Retained campaigns describe their exact native projections in metadata.
    // Copy those projections as a unit rather than rewinding a quest/stock alone.
    for(const [key,metadata] of Object.entries(source))if(key.endsWith('_native')&&record(metadata)) {
        const rows=metadata.worldOwners||[metadata];
        if(rows.some(row=>row.worldId===worldId))continue;
        next[key]=copy(metadata);
        for(const row of rows) {
            if(row.questId&&source.quests?.[row.questId]){next.quests ||= {};next.quests[row.questId]=copy(source.quests[row.questId]);}
        }
    }
    // These tables contain retained native world projections as well as the
    // seat's. Local LOTM locations are supplied by its owned actors' positions.
    const localPlaces=new Set(Array.from(actors).flatMap(id=>[
        live.simulation?.people?.[id]?.location,anchor.simulation?.people?.[id]?.location]).filter(Boolean));
    if(source.locations)for(const [id,value] of Object.entries(source.locations))if(!localPlaces.has(id)) {
        next.locations ||= {};next.locations[id]=copy(value);
    }
    if(source.availabilities)for(const [group,rows] of Object.entries(source.availabilities))
        for(const [id,value] of Object.entries(rows))if(!actors.has(id)&&!id.startsWith(prefix)&&!localPlaces.has(id)) {
            next.availabilities ||= {};next.availabilities[group] ||= {};next.availabilities[group][id]=copy(value);
        }
    // Custody binds a physical copy, unlike gift/history receipts. Reconcile
    // retained holders for seat-owned loans, and remove returned borrowed copies
    // before restoring the anchor's seat-held loan. Do not refund a later gift.
    const adjustments=new Map(),borrowed=new Map();
    const adjust=(actor,key,amount)=>{
        const byKey=adjustments.get(actor)||new Map();
        byKey.set(key,(byKey.get(key)||0)+amount);adjustments.set(actor,byKey);
    };
    for(const [rows,sign] of [[live.simulation?.custody,-1],[anchor.simulation?.custody,1]])
        for(const row of Object.values(rows||{})) {
            if(actors.has(row.owner)&&!actors.has(row.holder))adjust(row.holder,row.key,sign*row.count);
            if(!actors.has(row.owner)&&actors.has(row.holder)) {
                const byKey=borrowed.get(row.owner)||new Map();
                byKey.set(row.key,(byKey.get(row.key)||0)+sign*row.count);borrowed.set(row.owner,byKey);
            }
        }
    for(const [actor,byKey] of borrowed)for(const [key,count] of byKey)if(count>0)adjust(actor,key,-count);
    for(const [actor,byKey] of adjustments)for(const [key,amount] of byKey)if(amount) {
        const simulated=state.simulation?.people?.[actor]?.inventory==='simulation';
        const bag=simulated?state.simulation.owners?.[actor]:next.inventories?.person?.[actor];
        const row=bag?.[key],count=typeof row==='number'?row:row?.count||0,remaining=count+amount;
        check(bag&&Number.isSafeInteger(remaining)&&remaining>=0,
            'Cannot restart: a cross-world loan copy has moved beyond its recorded holder. Settle its custody before restarting.');
        if(!remaining)delete bag[key];
        else bag[key]=simulated?remaining:{...(record(row)?row:{}),count:remaining};
    }
    return next;
}
