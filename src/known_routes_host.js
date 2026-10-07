import { projectKnownRoutes } from './known_routes.js';
import { playerOfferCostText } from './feature_expansion_presentation_costs.js';

// Only these existing actions can appear. Availability and exact commands
// still come from their current native presentation rows below.
const familyRoutes = [
    {family: 'nested', actions: {
        'nested.enter_hub': ['onward', 'Original Paradise service district'],
        'nested.return_frontier': ['return', 'Village'],
        'nested.personal.saltworks': ['onward', 'Saltworks'],
        'nested.personal.archive': ['onward', 'The Lamplit Archive'],
        'nested.personal.return': ['return', 'Original Paradise service district'],
        'nested.mission.arrive': ['onward', 'mission'],
        'nested.extraction.arrive': ['return', 'Original Paradise service district']
    }},
    {family: 'paradise', actions: {
        'book.paradise.enter_hub': ['onward', 'Paradise contractor district'],
        'book.paradise.return_frontier': ['return', 'Village'],
        'book.paradise.goa.personal': ['onward', 'First-Goa branch · Gray Terminal'],
        'book.paradise.contract.arrive': ['onward', 'First-Goa branch · Gray Terminal'],
        'book.paradise.return_hub': ['return', 'Paradise contractor district'],
        'book.paradise.extraction.arrive': ['return', 'Paradise contractor district']
    }},
    {family: 'mol', actions: {
        'book.mol.enter': ['onward', 'Cyoria'],
        'book.mol.return': ['return', 'Village']
    }},
    {family: 'proto23', actions: {
        'proto23.enter': ['onward', 'Proto23 village'],
        'proto23.return': ['return', 'Village']
    }},
    {family: 'tidemark', actions: {
        'tidemark.open': ['onward', 'Tidemark'],
        'tidemark.enter': ['onward', 'Tidemark'],
        'tidemark.return': ['return', 'Village']
    }},
    {family: 'pocket', actions: {
        'pocket.open': ['onward', 'Folded Glasshouse'],
        'pocket.enter': ['onward', 'Folded Glasshouse'],
        'pocket.exit': ['return', 'Village']
    }}
];

const records = value => Array.isArray(value) ? value : [];
const routesIn = projection => {
    const result = [];
    for (const section of records(projection?.sections)) for (const action of records(section?.actions)) {
        if (action?.visible === false) continue;
        if (action?.legibility && action.legibility?.visible === false) continue;
        result.push({action, section});
    }
    for (const action of records(projection?.actions)) if (action?.visible !== false) result.push({action, section: projection});
    return result;
};
const known = text => ({known: true, text: typeof text === 'string' ? text : ''});
const displayedText = rows => records(rows).map(row => typeof row === 'string' ? row : row?.text)
    .filter(text => typeof text === 'string' && text).join(' · ');
const legibilityNotes = action => {
    const view = action?.legibility, parts = [];
    const requirements = displayedText(view?.requirements);
    const reservations = displayedText(view?.reservations);
    if (requirements) parts.push(`Known requirements: ${requirements}`);
    if (reservations) parts.push(`Reserved: ${reservations}`);
    return parts.join(' · ');
};
const actionText = (action, kind) => {
    const direct = action?.[kind];
    if (typeof direct === 'string') return direct;
    if (direct?.known === true && typeof direct.text === 'string') return direct.text;
    const legibility = action?.legibility;
    if (kind === 'costText') {
        const knownCosts = displayedText(legibility?.costs);
        if (knownCosts) return [knownCosts, legibility?.duration?.text].filter(Boolean).join(' · ');
        if (action?.terms) return [action.terms, legibility?.duration?.text].filter(Boolean).join(' · ');
        if (Array.isArray(action?.costs) && Number.isFinite(action?.duration))
            return playerOfferCostText(action.costs || [], action.duration || 0);
        return legibility?.duration?.text || '';
    }
    if (kind === 'blockerText') return displayedText(legibility?.blockers) || reasons(action);
    if (kind === 'commitmentText') return displayedText(action?.commitments) || '';
    return [action?.description || legibility?.description || '', legibilityNotes(action)].filter(Boolean).join(' · ');
};
function reasons(action) {
    const blockers = records(action?.legibility?.blockers).map(row => row?.text).filter(Boolean);
    if (blockers.length) return blockers.join(' · ');
    return records(action?.reasons).map(row => typeof row === 'string' ? row : row?.text).filter(Boolean).join(' · ');
}
const familyOf = id => id.startsWith('nested.') ? 'nested' : id.startsWith('book.paradise.') ? 'paradise' :
    id.startsWith('book.mol.') ? 'mol' : id.startsWith('proto23.') ? 'proto23' : id.startsWith('tidemark.') ? 'tidemark' :
    id.startsWith('pocket.') ? 'pocket' : '';
function routeOwner(state, family) {
    if (family === 'nested') return state.nestedCampaign;
    if (family === 'paradise') return state.bookWorldCampaign;
    if (family === 'mol') return state.motherOfLearning;
    if (family === 'proto23') return state.proto23Village;
    if (family === 'tidemark') return state.featureDestination;
    if (family === 'pocket') return state.realmPrototype;
    return null;
}
function currentDestination(snapshot, {refinement, pocket, proto23}) {
    const state = snapshot?.state;
    const worldId = state?.actors?.player?.worldId;
    const location = snapshot?.context?.facts?.location || state?.simulation?.people?.player?.location;
    if (typeof worldId !== 'string' || typeof location !== 'string' || !location) return null;
    let destinationId = `${worldId}@${location}`, destinationLabel = location;
    if (worldId === 'nested.paradise_hub' || worldId === 'nested.saltworks' || worldId === 'nested.archive') {
        if (!state.nestedCampaign || !refinement?.visible) return null;
        destinationLabel = `Original Paradise service district · ${location}`;
    } else if (worldId === 'book.paradise.hub' || worldId === 'book.paradise.goa') {
        if (!state.bookWorldCampaign || !refinement?.visible) return null;
        destinationLabel = worldId === 'book.paradise.hub' ? `Paradise contractor district · ${location}` : `First-Goa branch · ${location}`;
    } else if (worldId === 'book.mol.cyoria') {
        if (!state.motherOfLearning || !refinement?.visible) return null;
        destinationLabel = `Cyoria · ${location}`;
    } else if (worldId === 'reference.proto23.village') {
        if (!state.proto23Village || !proto23?.visible) return null;
        destinationLabel = `Proto23 village · ${location}`;
    } else if (worldId === 'feature.tidemark') {
        if (!state.featureDestination || !refinement?.visible) return null;
        destinationLabel = `Tidemark · ${location}`;
    } else if (worldId === 'pocket.folded_glasshouse') {
        if (!state.realmPrototype || !pocket?.view?.inside) return null;
        destinationLabel = `Folded Glasshouse · ${location}`;
    } else if (worldId !== 'base.frontier') return null;
    return {known: true, recipientId: 'player', destinationId, destinationLabel, commitments: []};
}
function destinationLabel(routeId, action, state) {
    const family = familyOf(routeId);
    if (family === 'nested' && routeId === 'nested.mission.arrive') {
        const missionId = state.nestedCampaign?.mission?.id || '';
        if (missionId.includes('.saltworks.')) return 'Saltworks';
        if (missionId.includes('.archive.')) return 'The Lamplit Archive';
        return '';
    }
    const route = familyRoutes.find(row => row.family === family)?.actions[routeId];
    if (!route) return '';
    // Action descriptions are already player-facing and may refine the
    // destination name. Preserve the fixed source name for clear hub identity.
    return route[1] === 'mission' ? '' : route[1];
}
function existingCommitmentText(state, family, action, section) {
    if (family === 'nested' && ['nested.mission.arrive', 'nested.extraction.arrive'].includes(action.id)) {
        const mission = state.nestedCampaign?.mission;
        if (mission && typeof section?.label === 'string') return `${section.label} · ${mission.stage}`;
    }
    if (family === 'paradise' && ['book.paradise.contract.arrive', 'book.paradise.extraction.arrive'].includes(action.id) &&
        state.bookWorldCampaign?.mission && typeof section?.description === 'string') return section.description;
    return actionText(action, 'commitmentText');
}
function fingerprint(snapshot, current, family, action) {
    const state = snapshot.state, player = state.actors?.player || {}, context = snapshot.context || {};
    const owner = routeOwner(state, family);
    return JSON.stringify({
        sequence: state.sequence,
        clock: state.clock,
        current: current.destinationId,
        player: {worldId: player.worldId, location: state.simulation?.people?.player?.location,
            facts: player.facts, resources: player.resources, sources: player.sources, techniques: player.techniques},
        body: state.simulation?.people?.player?.body,
        owner: owner && {nativeRevision: owner.nativeRevision, connections: owner.connections,
            connection: owner.connection, mission: owner.mission, activeVisitId: owner.activeVisitId},
        custody: state.simulation?.custody,
        gameplay: context.gameplay?.player,
        equipment: context.equipment?.player,
        routeInputs: {
            location: context.facts?.location,
            facts: context.facts,
            nativeAlive: context.nativeAlive,
            nativeBody: context.nativeBody || context.nestedNative?.body || context.paradiseNative?.body ||
                context.molNative?.body || context.proto23Native?.body || context.destinationNative?.body,
            vitals: context.vitals?.player,
            external: context.external,
            busy: context.busy,
            nestedNative: context.nestedNative,
            paradiseNative: context.paradiseNative,
            molNative: context.molNative,
            proto23Native: context.proto23Native,
            destinationNative: context.destinationNative
        },
        action: {id: action.id, visible: action.visible, eligible: action.eligible,
            reasons: action.reasons, costs: action.costs, duration: action.duration,
            command: action.command, legibility: action.legibility}
    });
}

/**
 * Adapt the currently rendered native projections into one route panel view.
 * `pocket.actions` and `proto23` are the exact previews from their current
 * hosts. `refinement` is the existing featureExpansionRefinementsPresentation.
 */
export function knownRoutesPresentation(snapshot, {refinement, pocket, proto23} = {}) {
    const state = snapshot?.state;
    const current = currentDestination(snapshot, {refinement, pocket, proto23});
    if (!current) return {visible: false, section: null};

    const visibleActions = [
        // The feature-wave base already includes Proto23. When its exact
        // native projection is supplied, use that source once for route rows.
        ...routesIn(refinement).filter(({action}) => !proto23 ||
            typeof action?.id !== 'string' || familyOf(action.id) !== 'proto23'),
        ...routesIn(proto23),
        ...routesIn({actions: pocket?.actions})
    ];
    const candidates = [];
    for (const {action, section} of visibleActions) {
        const id = action?.id, family = typeof id === 'string' ? familyOf(id) : '';
        const declared = familyRoutes.find(row => row.family === family)?.actions[id];
        if (!declared || routeOwner(state, family) == null || !action.command || typeof action.command !== 'object') continue;
        if (family === 'pocket' && pocket?.view?.discovered !== true) continue;
        const to = destinationLabel(id, action, state);
        if (!to) continue;
        const label = action.label || action.legibility?.label;
        if (typeof label !== 'string' || !label) continue;
        const direction = declared[0];
        candidates.push({
            known: true,
            recipientId: 'player',
            currentDestinationId: current.destinationId,
            id,
            direction,
            destinationLabel: to,
            label,
            description: known(actionText(action, 'description')),
            costText: known(actionText(action, 'costText')),
            blockerText: known(actionText(action, 'blockerText')),
            commitmentText: known(existingCommitmentText(state, family, action, section)),
            inputFingerprint: fingerprint(snapshot, current, family, action),
            action: {
                eligible: typeof action.eligible === 'boolean' ? action.eligible : action.legibility?.control?.enabled === true,
                reasons: action.reasons || action.legibility?.blockers || [],
                command: structuredClone(action.command)
            },
            sourceSectionId: section?.id || ''
        });
    }
    if (!candidates.length) return {visible: false, section: null};
    const projected = projectKnownRoutes({current, routes: candidates});
    if (!projected.visible) return projected;
    projected.section.routes.sort((a, b) => a.direction.localeCompare(b.direction) || a.label.localeCompare(b.label));
    return projected;
}
