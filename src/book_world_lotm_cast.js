// Name-free supplementary cast validation bridge (AD1).
import {whereabouts,lintAnchors} from './cast_schedule.js';
import {defineBeats} from './beat_records.js';
// Probe every possible day and schedule boundary of an undated forward anchor.
// This is conservative lint input, not an assertion that a future scene happens every day.
export function lotmAnchorProbes(pack) {
    const minutes = new Set([0, ...pack.schedule.flatMap(r => [r.from, r.to - 1])]);
    return pack.anchors.flatMap(a => {
        const out = [];
        for (let day = a.dayWindow[0]; day <= a.dayWindow[1]; day++) {
            for (const minute of minutes) out.push({actor: a.actor, place: a.place,
                at: {calendar: {year: 999, month: 1, day, day_count: day,
                    hour: Math.floor(minute / 60), minute: minute % 60}}});
        }
        return out;
    });
}

export function validateLotmCast(pack) {
    if(!pack||pack.schema!=='lotm-cast/1'||!['people','references','places','schedule','beats','remoteWhereabouts','anchors','placeAliases','clockClaims'].every(k=>Array.isArray(pack[k])))return ['Invalid private cast header.'];
    const errors = [], labels = new Set(['S', 'T', 'I', 'U', 'fill']);
    const people = new Set(pack.people.map(p => p.id));
    const targets = new Set([...people, ...pack.references.map(p => p.id)]);
    const places = new Set(pack.places.map(p => p.id));
    const ids = new Set();
    const requireEvidence = (row, where) => {
        if (!labels.has(row.label) || !(row.locator || row.label === 'fill' && row.basis)) errors.push(`${where}: evidence`);
        if (row.label === 'fill' && !row.basis) errors.push(`${where}: fill basis`);
    };
    const walk = (value, path) => {
        if (typeof value === 'string' && value.length > 200) errors.push(`${path}: string over 200 characters`);
        if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) walk(v, `${path}.${k}`);
    };
    walk(pack, 'pack');
    for (const p of [...pack.people, ...pack.references]) {
        if (ids.has(p.id)) errors.push(`${p.id}: duplicate person`);
        ids.add(p.id); requireEvidence(p, p.id);
        for (const r of p.relations ?? []) {
            requireEvidence(r, p.id); if (!targets.has(r.withId)) errors.push(`${p.id}: relation target`);
        }
        for (const r of [...(p.knows ?? []), ...(p.wants ?? [])]) requireEvidence(r, p.id);
        for (const r of p.knows ?? []) if (!r.since?.locator || !r.since?.window) errors.push(`${p.id}: undated knowledge`);
    }
    for (const p of pack.places) { requireEvidence(p, p.id); for (const r of p.openingHours) requireEvidence(r, p.id); }
    for (const row of [...pack.schedule, ...pack.beats, ...pack.remoteWhereabouts, ...pack.anchors]) {
        requireEvidence(row, row.id ?? row.actor);
        if (!targets.has(row.actor)) errors.push(`${row.actor}: actor missing`);
        if (row.place != null && !places.has(row.place)) errors.push(`${row.place}: place missing`);
    }
    for (const row of pack.schedule) {
        if (pack.places.find(p => p.id === row.place)?.anchorOnly) errors.push(`${row.id}: anchor address used as a live place`);
        try { whereabouts([row], row.actor, {calendar: {year: 999, month: 1, day: 1, day_count: 1, hour: 0, minute: 0}}); }
        catch (e) { errors.push(`${row.id}: ${e.message}`); }
    }
    for (const row of pack.beats) {
        if (pack.places.find(p => p.id === row.place)?.anchorOnly) errors.push(`${row.id}: anchor address used as a live place`);
        if (row.window?.label === 'U' && (!row.needs?.fact || !row.until)) errors.push(`${row.id}: unresolved beat needs a dated window gate`);
    }
    for (const row of [...pack.placeAliases, ...pack.clockClaims]) requireEvidence(row, row.id);
    for (const row of pack.placeAliases) if (!places.has(row.place)) errors.push(`${row.id}: alias place missing`);
    try { defineBeats(pack.beats); } catch (e) { errors.push(e.message); }
    try { if (lintAnchors(pack.schedule, lotmAnchorProbes(pack)).length) errors.push('Forward anchor conflict'); }
    catch (e) { errors.push(e.message); }
    if(pack.bindings){
        const b=pack.bindings,days=new Map((b.days||[]).map(r=>[r.scene,r]));
        if(!Array.isArray(b.days)||!b.days.length||!Array.isArray(b.schedule)||!Array.isArray(b.beats)||!pack.host?.profile?.blurb||!pack.host?.situation?.label)errors.push('Invalid host binding.');
        for(const r of b.days||[])if(!Number.isInteger(r.day)||r.day<1||!(r.from>=0&&r.from<r.to&&r.to<=1440))errors.push('Invalid bound day.');
        for(const r of b.schedule||[]){
            if(!people.has(r.actor)||!places.has(r.place))errors.push('Invalid bound address.');
            if(r.scene&&(!days.has(r.scene)||r.day!==days.get(r.scene).day||r.recurrence!=='once'))errors.push('Invalid bound schedule date.');
            try{whereabouts([r],r.actor,{calendar:{year:0,month:1,day:1,day_count:1,hour:0,minute:0}});}catch(e){errors.push(e.message);}
        }
        try{defineBeats(b.beats||[]);}catch(e){errors.push(e.message);}
        for(const p of pack.places)if(p.travel&&(p.anchorOnly||!['evernight','storm','machinery'].includes(p.travel.district)||!p.travel.basis))errors.push('Invalid cast walk district.');
    }
    return errors;
}
