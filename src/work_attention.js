// A world supplies a small projection for an actionable pause. Native work and
// waiting responses retain priority; this port owns no activity or save state.
// The world-keyed lookup calls one lightweight reader, not a panel projection.
const sources=new Map();
export function registerWorkAttention({worldId,read,open}){
 if(!worldId||typeof read!=='function'||typeof open!=='function'||sources.has(worldId))throw Error('Work attention needs one reader and opener per world.');
 const source={read,open};sources.set(worldId,source);return ()=>{if(sources.get(worldId)===source)sources.delete(worldId);};
}
export function readWorkAttention(view){
 if(view.waiting||view.work?.length)return null;
 const source=sources.get(view.world);if(!source)return null;
 const row=source.read();return row?.text&&row?.label?{...row,open:source.open}:null;
}
