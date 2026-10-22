// Mistglass method tracks as path descriptors (ASC17, second case for AR11).
// Read-only over the P12 method table: practice minutes stay in
// worldAdaptation.techniques and cultivationView stays the rate authority.
// Open-mist is the no-method state (DR1), so it has no track.
import {definePath, pathView} from './ascension_paths.js';
import {cultivationMethods, cultivationView} from './absorb_p23/world_adaptation/techniques.js';

const track = (key, grants) => definePath({id:`mistglass.${key}`, world:'p23.mistglass', label:cultivationMethods[key].label, shape:'ladder', stages:[
    {id:'learning', label:'Learning', crossings:[], grants:[grants[0]]},
    {id:'practiced', label:'Practiced', crossings:[{id:'practice', type:'quota', label:'Eligible mist practice (minutes)', fact:'practiceMinutes', need:16}], grants:[grants[1]]},
    {id:'integrated', label:'Integrated', crossings:[{id:'practice', type:'quota', label:'Eligible mist practice (minutes)', fact:'practiceMinutes', need:48}], grants:[grants[2]]},
]});
const fmt = key => [0,1,2].map(i => {const m=cultivationMethods[key];return `${(m.rates[i]/1000).toFixed(3)} condensate/min, ${m.odds[i]/100}% purification`;});
export const mistglassPaths = Object.freeze({breath:track('breath', fmt('breath')), settling:track('settling', fmt('settling'))});

// The stage position comes from the same practice minutes cultivationView reads.
export function mistglassPathView(techniques) {
    const v = cultivationView(techniques);
    const path = mistglassPaths[v.id];
    if(!path) return null;
    const position = v.minutes >= 48 ? 2 : v.minutes >= 16 ? 1 : 0;
    return pathView(path, position, {practiceMinutes:v.minutes});
}
