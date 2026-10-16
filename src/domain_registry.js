// One synchronous lifecycle. Native clock, transaction and storage owners stay outside.
export function createDomainRegistry() {
    const domains=new Map();
    function ordered() {
        const result=[],visiting=new Set(),seen=new Set();
        function visit(id) {
            if(seen.has(id))return;
            const d=domains.get(id);if(!d)throw Error(`Missing domain dependency: ${id}`);
            if(visiting.has(id))throw Error(`Domain dependency cycle: ${id}`);
            visiting.add(id);for(const dep of d.deps??[])visit(dep);
            visiting.delete(id);seen.add(id);result.push(d);
        }
        for(const id of domains.keys())visit(id);
        return result;
    }
    function registerDomain(domain) {
        if(!domain||typeof domain.id!=='string'||!domain.id||domains.has(domain.id))throw Error('Domain needs a unique id.');
        if(domain.deps!=null&&(!Array.isArray(domain.deps)||domain.deps.some(id=>typeof id!=='string')))throw Error('Invalid domain dependencies.');
        for(const hook of ['initialState','save','validate','migrate','load','tick','projection'])if(domain[hook]!=null&&typeof domain[hook]!=='function')throw Error(`Invalid domain hook: ${hook}`);
        domains.set(domain.id,Object.freeze({...domain}));return domain;
    }
    return Object.freeze({registerDomain,
        list:()=>ordered(),
        initialize:()=>{for(const d of ordered())if(d.initialState)d.load?.(d.initialState());},
        save:envelope=>{for(const d of ordered()){if(!d.save)continue;const slice=d.save(envelope);if(slice!==undefined)envelope[d.id]=slice;}return envelope;},
        validate:envelope=>{for(const d of ordered())d.validate?.(envelope[d.id],envelope);return envelope;},
        load:envelope=>{for(const d of ordered()){if(!d.load)continue;const slice=Object.hasOwn(envelope,d.id)?envelope[d.id]:d.initialState?.();d.load(d.migrate?d.migrate(slice,envelope):slice,envelope);}},
        tick:minutes=>{for(const d of ordered())d.tick?.(minutes);},
        mountPanels:()=>{for(const d of ordered())for(const mount of d.panels??[])mount();},
        command:(id,name)=>domains.get(id)?.commands?.[name],
        project:(id,...args)=>domains.get(id)?.projection?.(...args)
    });
}
export const domainRegistry=createDomainRegistry();
export const registerDomain=domainRegistry.registerDomain;
