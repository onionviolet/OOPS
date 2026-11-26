// Bounded retained results, not a limit on what a request may inspect.
export function boundedCache({maxEntries = 8, maxWeight = 16 * 1024 * 1024, ttlMs = 30000, now = Date.now} = {}) {
    const entries = new Map();let weight = 0;
    const remove = key => {const old = entries.get(key);if(old){weight -= old.weight;entries.delete(key);}};
    return {
        get(key) {
            const item = entries.get(key);if(!item)return undefined;
            if(now()-item.at >= ttlMs){remove(key);return undefined;}
            entries.delete(key);entries.set(key,item);return item.value;
        },
        set(key,value,size = typeof value === 'string' ? value.length * 2 : 1) {
            remove(key);
            if(!Number.isFinite(size)||size<0)throw Error('Cache weight must be finite and non-negative.');
            if(size>maxWeight||maxEntries<1)return value;
            while(entries.size>=maxEntries||weight+size>maxWeight)remove(entries.keys().next().value);
            entries.set(key,{value,weight:size,at:now()});weight += size;return value;
        },
        delete:remove,
        stats:()=>({entries:entries.size,weight,maxEntries,maxWeight}),
    };
}
