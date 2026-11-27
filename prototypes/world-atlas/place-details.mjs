// Bounded projection of the batch PLACE schema: crowd and routes inherit the
// containing row's evidence label/locator. No source prose or invented paths.
import {publicLifeRow as open} from './texture-life.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const arr = value => Array.isArray(value) ? value : [];
const text = (value, max = 180) => typeof value === 'string' && value.trim() &&
    !/^(?:unstated|not stated|not mentioned|none stated)$/i.test(value.trim()) ? value.trim().replace(/\s+/g, ' ').slice(0,max) : null;
export function mergePlaceDetails(previous = {}, row, withheld = new Set()) {
    const out = {crowd: [...(previous.crowd || [])], routes: [...(previous.routes || [])], accessRecords:[...(previous.accessRecords || [])]};
    if (!open(row) || withheld.has(row.id)) return out;
    const evidence = {label: ['S','T','I','U','P'].includes(row.label) ? row.label : null,
        locator: parseLocator(row.locator) ? row.locator.trim() : null};
    const add = (key,value) => {if(!out[key].some(old=>JSON.stringify(old)===JSON.stringify(value)))out[key].push(value);};
    const crowd = text(row.crowd);
    if (crowd) add('crowd',{text:crowd,...evidence});
    for (const value of arr(row.access)) {const access=text(value);if(access)add('accessRecords',{text:access,...evidence});}
    for (const route of arr(row.routes).filter(open)) {
        const to=text(route.to,100);
        if (!to || withheld.has(to)) continue;
        add('routes',{to,mode:text(route.mode,70),minutes:Number.isFinite(route.minutes)&&route.minutes>=0?route.minutes:null,...evidence});
    }
    return out;
}
