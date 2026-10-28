// Name-free supplementary cast validation bridge (AD1).
import {whereabouts,lintAnchors} from './cast_schedule.js';
import {defineBeats} from './beat_records.js';
// Forward anchors are eligible only when the worksheet explicitly ties them to this loop.
// Unknown-day anchors probe the authored envelope and every candidate schedule boundary.
export function molAnchorProbes(pack) {
    const minutes = new Set([0, ...pack.schedule.flatMap(r => [r.from, r.to - 1])]);
    return pack.anchors.flatMap(a => {
        const out = [], window = a.dayWindow ?? pack.timing.window;
        for (let day = a.day ?? window[0]; day <= (a.day ?? window[1]); day++) {
            for (const minute of minutes) out.push({actor: a.actor, place: a.place,
                at: {calendar: {year: 999, month: Math.floor((day - 1) / 30) + 1, day: (day - 1) % 30 + 1,
                    day_count: day, hour: Math.floor(minute / 60), minute: minute % 60}}});
        }
        return out;
    });
}

export function validateMolCast(pack) {
    if(!pack||pack.schema!=='mol-cast/1'||!['people','references','places','schedule','beats','days','anchors','remoteWhereabouts','clockClaims','placeAliases','resets'].every(k=>Array.isArray(pack[k])))return ['Invalid private cast header.'];
    const errors = [], labels = new Set(['S', 'T', 'I', 'U', 'fill']);
    const actors = new Set(pack.people.map(p => p.id));
    const targets = new Set([...actors, ...pack.references.map(p => p.id)]);
    const places = new Set(pack.places.map(p => p.id));
    const days = new Map(pack.days.map(d => [d.scene, d]));
    const evidence = (r, path) => {
        if (!labels.has(r.label) || !(r.locator || r.label === 'fill' && r.basis)) errors.push(`${path}: evidence`);
        if (r.label === 'fill' && !r.basis) errors.push(`${path}: fill basis`);
        if (r.locator && !/^en b1 c[1-5] p\d+$/.test(r.locator)) errors.push(`${path}: outside input slice`);
        if (r.locator?.startsWith('en b1 c5 ') && Number(r.locator.split(' p')[1]) > 9) errors.push(`${path}: outside input slice`);
    };
    const walk = (v, path) => {
        if (typeof v === 'string' && v.length > 200) errors.push(`${path}: string over 200 characters`);
        if (v && typeof v === 'object') for (const [k, child] of Object.entries(v)) walk(child, `${path}.${k}`);
    };
    walk(pack, 'pack');
    for (const [name, rows] of Object.entries({people: [...pack.people, ...pack.references], places: pack.places,
        schedule: pack.schedule, beats: pack.beats, days: pack.days})) {
        const seen = new Set();
        for (const r of rows) {
            const id = r.id ?? r.scene;
            if (seen.has(id)) errors.push(`${name}: duplicate ${id}`);
            seen.add(id); evidence(r, id);
        }
    }
    for (const p of pack.references) if (p.sameActorAs && !actors.has(p.sameActorAs)) errors.push(`${p.id}: alias actor missing`);
    for (const p of pack.people) {
        for (const r of p.relations ?? []) {
            evidence(r, p.id);
            if (!targets.has(r.withId) || !r.basis) errors.push(`${p.id}: relation target or basis`);
        }
        for (const r of [...(p.knows ?? []), ...(p.wants ?? [])]) evidence(r, p.id);
        for (const r of [...(p.knows ?? []), ...(p.relations ?? [])]) {
            const d = days.get(r.since?.scene);
            if (!r.since?.locator || !r.since?.window || !d || d.excluded || r.since.day !== d.day)
                errors.push(`${p.id}: acquisition date`);
        }
    }
    for (const p of pack.places) for (const r of p.openingHours) evidence(r, p.id);
    for (const r of [...pack.schedule, ...pack.beats, ...pack.anchors, ...pack.remoteWhereabouts]) {
        evidence(r, r.id ?? r.actor);
        if (!actors.has(r.actor)) errors.push(`${r.id}: actor missing`);
        if (!places.has(r.place)) errors.push(`${r.id}: place missing`);
    }
    for (const r of [...pack.placeAliases, ...pack.clockClaims, ...pack.resets]) evidence(r, r.id);
    for (const r of pack.placeAliases) if (!places.has(r.place)) errors.push(`${r.id}: alias place missing`);
    for (const a of pack.anchors) if (a.loop !== 'initial') errors.push(`${a.actor}: other-loop anchor`);
    for (const r of pack.schedule) {
        const d = days.get(r.scene);
        if (!d || d.excluded) errors.push(`${r.id}: excluded or missing scene`);
        if (d?.day == null && r.recurrence !== 'irregular') errors.push(`${r.id}: unresolved schedule active`);
        if (d?.day != null && (r.day !== d.day || r.recurrence !== 'once')) errors.push(`${r.id}: bound schedule date`);
        if (pack.places.find(p => p.id === r.place)?.addressOnly) errors.push(`${r.id}: remote address used as body placement`);
        try { whereabouts([r], r.actor, {calendar: {year: 999, month: 1, day: 1, day_count: 1, hour: 0, minute: 0}}); }
        catch (e) { errors.push(`${r.id}: ${e.message}`); }
    }
    for (const r of pack.beats) {
        const d = days.get(r.scene);
        if (!d || d.excluded) errors.push(`${r.id}: excluded or missing scene`);
        if (d?.day != null && (r.dayIndex !== d.day || r.until !== d.day)) errors.push(`${r.id}: bound beat date`);
        if (d?.day == null && (!r.needs?.fact || r.window?.label !== 'U')) errors.push(`${r.id}: unresolved beat ungated`);
        if (pack.people.find(p => p.id === r.actor)?.tier !== 'principal') errors.push(`${r.id}: non-principal beat`);
        if (!r.scope?.footprint?.includes(r.place)) errors.push(`${r.id}: beat footprint`);
    }
    for (const d of pack.days) {
        if (d.day != null && (!Number.isInteger(d.day) || d.day < 1)) errors.push(`${d.scene}: invalid day`);
        if (d.mark && d.day != null && Number(d.mark.match(/-D(\d+)$/)?.[1]) !== d.day) errors.push(`${d.scene}: stated mark changed`);
    }
    try { defineBeats(pack.beats); } catch (e) { errors.push(e.message); }
    try { if (lintAnchors(pack.schedule, molAnchorProbes(pack)).length) errors.push('Forward anchor conflict'); }
    catch (e) { errors.push(e.message); }
    return errors;
}
