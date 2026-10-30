import {createMemoryDomain} from './person_memory.js';
import {calendarMinutes} from './world_rhythm.js';
import {deferSimulationRender} from './simulation_render.js';
// One synchronous lifecycle. Native clock, transaction and storage owners stay outside.
export function createDomainRegistry() {
    const domains=new Map();
    let orderedDomains;
    function ordered() {
        if(orderedDomains)return orderedDomains;
        const result=[],visiting=new Set(),seen=new Set();
        function visit(id) {
            if(seen.has(id))return;
            const d=domains.get(id);if(!d)throw Error(`Missing domain dependency: ${id}`);
            if(visiting.has(id))throw Error(`Domain dependency cycle: ${id}`);
            visiting.add(id);for(const dep of d.deps??[])visit(dep);
            visiting.delete(id);seen.add(id);result.push(d);
        }
        for(const id of domains.keys())visit(id);
        return orderedDomains=Object.freeze(result);
    }
    function registerDomain(domain) {
        if(!domain||typeof domain.id!=='string'||!domain.id||domains.has(domain.id))throw Error('Domain needs a unique id.');
        if(domain.deps!=null&&(!Array.isArray(domain.deps)||domain.deps.some(id=>typeof id!=='string')))throw Error('Invalid domain dependencies.');
        for(const hook of ['initialState','save','validate','migrate','load','tick','refresh','projection','ownsItemKey'])if(domain[hook]!=null&&typeof domain[hook]!=='function')throw Error(`Invalid domain hook: ${hook}`);
        // Snapshot registration metadata so later caller edits cannot change the
        // lifecycle graph or command routing. Domain closure state stays owned.
        const commands=domain.commands && Object.freeze(Object.fromEntries(Object.entries(domain.commands).map(([name,command])=>
            [name,command && typeof command==='object'?Object.freeze({...command}):command])));
        domains.set(domain.id,Object.freeze({...domain,
            ...(domain.deps?{deps:Object.freeze([...domain.deps])}:{}),
            ...(domain.panels?{panels:Object.freeze([...domain.panels])}:{}),
            ...(commands?{commands}:{})}));
        orderedDomains=undefined;
        return domain;
    }
    return Object.freeze({registerDomain,
        list:()=>[...ordered()],
        initialize:()=>{for(const d of ordered())if(d.initialState)d.load?.(d.initialState());},
        save:envelope=>{for(const d of ordered()){if(!d.save)continue;const slice=d.save(envelope);if(slice!==undefined)envelope[d.id]=slice;}return envelope;},
        validate:envelope=>{for(const d of ordered())d.validate?.(envelope[d.id],envelope);return envelope;},
        load:envelope=>{for(const d of ordered()){if(!d.load)continue;const slice=Object.hasOwn(envelope,d.id)?envelope[d.id]:d.initialState?.();d.load(d.migrate?d.migrate(slice,envelope):slice,envelope);}},
        tick:minutes=>{for(const d of ordered())d.tick?.(minutes);},
        // Display only: native publications (ticks, commands, save ownership, restore end) redraw panels
        // through the existing simulation render batch. No timer and no second refresh path.
        refresh:()=>{for(const d of ordered())if(d.refresh&&!deferSimulationRender(d.refresh,d.refresh))d.refresh();},
        mountPanels:()=>{for(const d of ordered())for(const mount of d.panels??[])mount();},
        useItem:key=>{for(const d of ordered()){const command=d.commands?.useItem;if(!command?.accepts(key))continue;const quote=command.quote(key);if(!quote.eligible)throw Error(quote.reason);command.execute(quote);return true;}return false;},
        // A domain-owned native item key is restored verbatim; its owner resolves and validates it.
        ownsItemKey:key=>ordered().some(d=>d.ownsItemKey?.(key)===true),
        command:(id,name)=>domains.get(id)?.commands?.[name],
        project:(id,...args)=>domains.get(id)?.projection?.(...args)
    });
}
export const domainRegistry=createDomainRegistry();
export const registerDomain=domainRegistry.registerDomain;

// Envelopes without a game calendar (tests, partial saves) validate with no future-day bound.
const memoryDay = envelope => { try { return Math.floor(calendarMinutes(envelope?.['current time']) / 1440); } catch { return Number.MAX_SAFE_INTEGER; } };
const memoryDomain = createMemoryDomain({day: memoryDay});
// An empty memory writes no save key, so saves without memories keep their shape.
const memorySave = () => { const slice = memoryDomain.save(); return Object.keys(slice.holders).length ? slice : undefined; };
registerDomain({...memoryDomain, save: memorySave, commands:{...memoryDomain.commands, read:memoryDomain.save, publish:memoryDomain.load}});
