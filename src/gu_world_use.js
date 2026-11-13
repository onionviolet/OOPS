// Shared admission for world casts. The activation law still owns appetite,
// condition and fuel. Read the grant when the particular Gu is activated.
export const GU_OCCUPANCY_PROPERTIES = [
    {id: 'gu_use_working', type: 'label'},
    {id: 'gu_use_working_until', type: 'level', min: 0},
];

export function sharedGuTerms(properties) {
    if (!properties.gu_title || properties.gu_shared_use_by !== properties.gu_title) return [];
    return (properties.gu_shared_use ?? []).map(term => {
        const split = term.lastIndexOf(':');
        return {operator: term.slice(0, split), until: Number(term.slice(split + 1))};
    });
}

export function guUseOccupied(properties, at, working) {
    return !!properties.gu_use_working && properties.gu_use_working !== working && properties.gu_use_working_until >= at;
}

export function guWorldUseReason(held, operator, place, at, {allowShared = false, working} = {}) {
    const p = held.properties;
    const shared = allowShared && p.gu_keeper === p.gu_title && p.gu_controller === p.gu_title &&
        sharedGuTerms(p).find(term => term.operator === operator);
    if (p.gu_keeper !== operator && !shared) return 'gu-not-held';
    if (p.gu_installed_in || (p.gu_furnace_job && p.gu_furnace_until >= at) || guUseOccupied(p, at, working)) return 'gu-already-committed';
    if (!place || held.place !== place) return 'gu-not-controlled-here';
    const {gu_controller: controller, gu_use_grantee: grantee, gu_use_until: until, gu_exclusive_loan: exclusive} = p;
    const active = Number.isSafeInteger(until) && at < until;
    if (exclusive && active && grantee !== operator) return 'gu-promised-to-another';
    if (controller === operator) return null;
    if (shared) return Number.isSafeInteger(shared.until) && at < shared.until ? null : 'gu-use-grant-expired';
    if (grantee !== operator) return 'gu-not-controlled-here';
    return active ? null : 'gu-use-grant-expired';
}
