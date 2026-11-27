export const villageRouteRule = {world:'base.frontier', maxPlaces:32, stopForRain:true};
export const emptyRoute = () => ({revision:1,life:'',mode:'ready',places:[],cursor:0});

export function readRoute(saved=emptyRoute(), rule=villageRouteRule) {
    if(saved?.revision!==1 || typeof saved.life!=='string' || !['recording','ready','replaying'].includes(saved.mode) ||
        !Array.isArray(saved.places) || saved.places.length>rule.maxPlaces ||
        saved.places.some(id=>typeof id!=='string'||!id) || !Number.isInteger(saved.cursor) || saved.cursor<0 ||
        (saved.places.length>0 && !saved.life) || (saved.mode==='recording' && !saved.places.length) ||
        (saved.mode==='replaying' ? saved.cursor<1 || saved.cursor>=saved.places.length : saved.cursor!==0)) throw Error('Invalid recorded route.');
    return {...saved,places:[...saved.places]};
}

export function recordArrival(row, from, to, rule=villageRouteRule) {
    if(from===to || row.mode!=='recording')return row;
    if(from!==row.places.at(-1) || row.places.length>=rule.maxPlaces)return {...row,mode:'ready'};
    const places=[...row.places,to];
    return {...row,places,mode:places.length===rule.maxPlaces?'ready':'recording'};
}

export function nextRouteLeg(row,{place,hostile,rain,open},rule=villageRouteRule) {
    if(row.mode!=='replaying')return {};
    const to=row.places[row.cursor];
    const reason=hostile?'a hostile encounter':place!==row.places[row.cursor-1]?'a change of starting place':
        !open?'a closed destination':rain && rule.stopForRain?'rain on the road':null;
    return reason ? {reason} : {to};
}
