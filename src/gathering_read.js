// Gathering read (GS1-GS3, docs/representations/GATHERING_AND_SEASONS.md): the existing source table, node owner
// and odds lens (craft_sources.js) projected into the generic site list the gathering view draws. Pure and
// read-only: forecastHarvest takes no draw (GR9), so previewing a site never changes what a gather gives (UIV4).
// No world, place or material ids live here; the adapter that wires a world passes the source ids, the clock and
// the calendar coordinate it already holds.
import {forecastHarvest, nodeKey} from './craft_sources.js';

/**
 * readGatherSites(table, {sourceIds, nodes, world, location, clock, calendar, actor})
 * -> [{id, name, kind, stock, capacity, regenPerDay, dayMinutes, gathered, unavailable?, yields[], rare}]
 * A yield is {id, family, material, qty:[lo,hi], permille, blocked:[reasons], hours, season, tool, openSeasons}.
 * openSeasons lists the local season ids in which a season-gated yield opens (from the source's own calendar
 * binding), or null when the source keeps no season map and only the current season is known.
 */
export function readGatherSites(table, {sourceIds = [], nodes = {}, world, location, clock, calendar = null, actor = {}} = {}) {
    const out = [];
    for (const id of sourceIds) {
        const source = table.sources[id];
        if (!source) continue;
        const node = nodes[nodeKey(world, location, id, source.calendar ? calendar?.instanceId : undefined)];
        const dayMinutes = source.calendar ? source.calendar.minutesPerHour * source.calendar.hoursPerDay : 1440;
        const base = {id, name: source.name, kind: source.kind, capacity: source.capacity, regenPerDay: source.regenPerDay, dayMinutes,
            gathered: (node?.harvests ?? 0) > 0};
        let forecast;
        try { forecast = forecastHarvest(table, id, {at: clock, actor, node, calendar}); } catch { out.push({...base, stock: node?.stock ?? source.capacity, unavailable: true, yields: [], rare: null}); continue; }
        const seasonTags = source.calendar?.seasonTags ?? null;
        out.push({...base, stock: forecast.stock, yields: forecast.yields.map(f => {
            const y = source.yields.find(row => row.id === f.id);
            return {id: f.id, family: y.family, material: y.material, qty: y.qty, permille: f.permille, blocked: f.blocked, hours: y.hours, season: y.season, tool: y.tool,
                openSeasons: y.season && seasonTags ? Object.entries(seasonTags).filter(([, tag]) => tag === y.season).map(([seasonId]) => seasonId) : null};
        }), rare: forecast.rare});
    }
    return out;
}
