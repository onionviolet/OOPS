// Public gameplay status, independent of archive preparation and source binding.
export const PLAYABLE = 'Playable';
export const PARTIAL = 'Partial';
export const READING = 'Reading-only';
export const WORLD_CONSUMERS = {lotm:{cast:'lotm',group:'Lord of the Mysteries'},mol:{cast:'mol',group:'Mother of Learning'},
    hp:{group:'Harry Potter'},ri:{group:'Reverend Insanity'},ss:{group:'Shadow Slave'}};

export function playStatus({receipt, gap} = {}) {
    if (receipt) return {playStatus: PLAYABLE, playReceipt: receipt};
    if (gap) return {playStatus: PARTIAL, playGap: gap};
    return {playStatus: READING};
}

export function routeEvidence(report, href) {
    const id = /^#workbench\/play-evidence\/([^/]+)$/.exec(href || '')?.[1];
    return report?.entries?.find(row => row.id === id)?.playReceipt;
}

export const registeredPlaceStatus = () => playStatus({
    gap:'The location is registered. An exercised route to this exact place has not been cited.',
});
export const sourceMapPlaceStatus = state => ['absorbed','added'].includes(state)?registeredPlaceStatus():playStatus();
export const boundActionStatus = label => playStatus({gap:'A native replay of '+label+' on a named build is needed.'});

export function mechanicPlayStatus(world, aspect, hasConsumer) {
    return playStatus({gap:hasConsumer
        ? 'A native replay that exercises '+aspect+' in '+world+' is still needed. This row counts source pointers for the world.'
        : undefined});
}

export function mechanicReadinessRows(worlds, aspect) {
    return worlds.filter(w=>w.consumer||w.aspects[aspect])
        .sort((a,b)=>(b.aspects[aspect]||0)-(a.aspects[aspect]||0)).slice(0,48);
}
