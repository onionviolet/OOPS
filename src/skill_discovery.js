// Read-only presentation of existing owner snapshots. No DOM, imports, owner
// getters, discovery writes, XP awards, enrollment, command execution or RNG.
// Callers supply player-qualified names/text and actual unlock/eligibility facts.
const text = value => typeof value === "string" ? value : "";
const nonempty = value => text(value).trim().length > 0;
const surfaceNames = ["description", "tooltip", "preview", "return"];
const blockedReason = "The required preparation or access is unavailable.";

// Raw preview reasons are not automatically safe: some depend on NPC secrets.
// Only text explicitly qualified as known by the owning adapter is projected.
function knownText(rows) {
    return (Array.isArray(rows) ? rows : []).filter(row =>
        row?.known === true && nonempty(row.text)).map(row => row.text);
}
function knownRequirements(rows) {
    return (Array.isArray(rows) ? rows : []).filter(row =>
        row?.known === true && nonempty(row.text)).map(row => {
        const result = {text: row.text};
        if(typeof row.met === "boolean") result.met = row.met;
        return result;
    });
}
function knownSurfaces(rows) {
    const surfaces = Object.fromEntries(surfaceNames.map(name => [name, []]));
    for(const row of Array.isArray(rows) ? rows : []) {
        if(row?.known === true && surfaceNames.includes(row.surface) && nonempty(row.text)) {
            surfaces[row.surface].push(row.text);
        }
    }
    return surfaces;
}
function searchText(row) {
    return [row.label, row.description, ...row.requirements.map(r => r.text),
        ...row.reasons, ...Object.values(row.surfaces).flat()].filter(nonempty).join(" ");
}
function projected({id, label, description = "", status, requirements = [],
    reasons = [], surfaces = knownSurfaces(), controlVisible = false, enabled = false}) {
    const row = {id, label, description, status, requirements, reasons, surfaces,
        control: {visible: controlVisible, enabled}};
    row.searchText = searchText(row);
    return row;
}

/**
 * Unknown -> null, so no unknown name/ID, heading, search text, badge or preview
 * escapes through this result. A hint uses its OWN public ID/name/text, never
 * the feature's undisclosed label. Discovery and unlock are independent.
 *
 * Known text inputs: requirements/reasons are [{known:true,text,...}], details
 * are [{known:true,surface:"tooltip"|"preview"|"return"|"description",text}].
 * Omitted eligibility is unavailable, never a grant. Current fuel/tool/access
 * failures belong to eligible/reasons, not discovered or acquired unlock.
 */
export function projectDiscoveryFeature(input = {}) {
    if(input.discovered !== true) {
        const hint = input.hint;
        if(hint?.known !== true || !nonempty(hint.id) || !nonempty(hint.label)) return null;
        return projected({id: hint.id, label: hint.label, description: text(hint.text),
            status: "hinted"});
    }
    if(!nonempty(input.id) || !nonempty(input.label)) return null;
    const unlocked = input.unlocked === true, eligible = input.eligible === true;
    const requirements = knownRequirements(input.requirements);
    const reasons = eligible && unlocked ? [] : knownText(input.reasons);
    if(!eligible && unlocked && !reasons.length) reasons.push(blockedReason);
    return projected({id: input.id, label: input.label, description: text(input.description),
        status: unlocked ? eligible ? "available" : "blocked" : "discovered",
        requirements, reasons, surfaces: knownSurfaces(input.details),
        controlVisible: unlocked, enabled: unlocked && eligible});
}

/**
 * Preserve native Skill's exact isUnlocked + visibility_treshold gate.
 * Plain scalars only: Skill.getTotalXP/getName can initialize native XP storage.
 * Supply the persisted XP total (zero if absent), actual constructor-normalized
 * threshold and already-qualified current name. No XP or threshold defaults are
 * invented here. Hints about an activity use projectDiscoveryFeature separately,
 * never reveal a native skill name below its existing visibility threshold.
 */
export function projectNativeSkillDiscovery(input = {}) {
    const discovered = input.unlocked === true &&
        Number.isFinite(input.totalXP) && input.totalXP >= 0 &&
        Number.isFinite(input.visibilityThreshold) && input.visibilityThreshold >= 0 &&
        input.totalXP >= input.visibilityThreshold;
    return discovered ? projectDiscoveryFeature({...input, discovered: true, hint: null}) : null;
}

/**
 * The record is the validated existing actor.techniques[id] snapshot.
 * Observation discloses the technique; acquisition still needs understood+owned.
 * Actual executable eligibility comes from the host's existing technique/action
 * preview, including proficiency, body, world, fuel and occupancy requirements.
 */
export function projectTechniqueDiscovery(input = {}) {
    const record = input.record;
    return projectDiscoveryFeature({...input,
        discovered: !!record?.observed,
        unlocked: !!record?.understood && !!record?.owned});
}

/**
 * Retain only an actual player's accepted commitment, separately from feature
 * discovery. Use the known command/action label, NEVER a pending job's frozen
 * outcome label or effects. Host supplies its authoritative clock difference.
 * Core Save/navigation/recovery controls remain outside discovery gating.
 */
export function projectAcceptedWork(input = {}) {
    if(input.accepted !== true || !nonempty(input.id)) return null;
    const row = projected({id: input.id, label: nonempty(input.label) ? input.label : "Your accepted work",
        description: text(input.description), status: "accepted",
        surfaces: knownSurfaces(input.details)});
    if(Number.isFinite(input.remainingMinutes) && input.remainingMinutes >= 0) {
        row.remainingMinutes = input.remainingMinutes;
    }
    return row;
}

/**
 * Filter before search/count/badges. Never search a private/raw definition.
 * Both feature and technique/native adapters can be projected by the host first;
 * this catalog accepts only their projected rows/null, not raw descriptors.
 */
export function projectDiscoveryCatalog(rows = [], {query = ""} = {}) {
    const needle = text(query).trim().toLowerCase();
    const entries = (Array.isArray(rows) ? rows : []).filter(row =>
        row && ["hinted", "discovered", "blocked", "available", "accepted"].includes(row.status) &&
        typeof row.searchText === "string" && (!needle || row.searchText.toLowerCase().includes(needle)));
    return {entries, count: entries.length,
        availableCount: entries.filter(row => row.status === "available").length,
        hintCount: entries.filter(row => row.status === "hinted").length};
}

/**
 * Pass only projected rows. Empty future panels return null, including their
 * label and counts. Retained accepted work is not filtered by an optional search.
 * The renderer keeps its old focus/attention destinations and core recovery UI.
 */
export function projectDiscoveryPanel({id, label, entries = [], retained = []} = {}) {
    const catalog = projectDiscoveryCatalog(entries);
    const work = projectDiscoveryCatalog(retained).entries.filter(row => row.status === "accepted");
    if(!catalog.count && !work.length || !nonempty(id) || !nonempty(label)) return null;
    return {id, label, ...catalog, retained: work};
}
