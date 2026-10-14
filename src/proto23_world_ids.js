// Pinned source mechanics/place labels; all visitor people, rights, stock,
// methods, furniture uses, prices and timings below are original proposals.
export const PROTO23_SOURCE_HASH = 'a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5';
export const PROTO23_SOURCE_SNAPSHOT = 'Proto23-e93a8cd617932fb698ff889b968a32f9a20d48f3';
export const PROTO23_NATIVE_DOMAIN = 'proto23_village_native';
export const PROTO23_IDS = Object.freeze({prefix: 'proto23.', group: 'proto23', world: 'reference.proto23.village',
    steward: 'proto23.guest_steward', tutor: 'proto23.handling_tutor', stock: 'proto23.village.stock',
    shop: 'proto23.visitor.shop', quest: 'proto23.visitor.local_life', site: 'proto23.cottage.station',
    dojo: 'proto23.dojo.station', situation: 'proto23.visitor_branch'});
export const PROTO23_LOCATIONS = Object.freeze({center: 'Proto23 Village Center', dojo: 'Proto23 Dojo lobby', cottage: 'Proto23 visitor cottage'});
// Optional host locations do not change schema-1 native footprints or generated visitor moves.
export const PROTO23_OPTIONAL_NATIVE_LOCATIONS = Object.freeze(['Proto23 reed-circle training']);
const key = id => JSON.stringify({id});
export const PROTO23_KEYS = Object.freeze({bed: key('Proto23 plain bed'), hearth: key('Proto23 cottage hearth'),
    bookstand: key('Proto23 bookstand'), notes: key('Proto23 annotated practice notebook'), log: key('Rough wood log'),
    sap: key('Tree sap'), sharp: key('Field fitting knife'), dull: key('Dulled field fitting knife'),
    wet: key('Wet repair stave'), sound: key('Sound repair stave'), green: key('Green repair offcut'),
    offcut: key('Compatible repair offcut'), kit: key('Prepared survey kit'),
    paper: key('Cyorian research paper'), ink: key('Cyorian formula ink')});
export const PROTO23_FRONTIER = Object.freeze({worldId: 'base.frontier', instanceId: 'frontier.main', regionId: 'frontier.village', layerId: 'surface'});
const I = PROTO23_IDS, L = PROTO23_LOCATIONS;
export const PROTO23_FOOTPRINTS = Object.freeze([{worldId: I.world, instanceId: 'reference.proto23.village.main',
    continuityId: 'reference.proto23.independent_visitor.branch', eraId: 'reference.proto23.ordinary_village',
    endpoint: {worldId: I.world, instanceId: 'reference.proto23.village.main', regionId: I.world, layerId: 'reference.proto23.surface'},
    native: {stockOwner: I.stock, shopOwner: I.shop, questId: I.quest, locations: Object.values(L),
        quest: {title: 'Proto23: a practiced visitor and furnished cottage', firstFact: 'proto23.arrivalMet', resolvedFacts: ['proto23.arcClosed']}},
    definition: {id: 'reference.proto23.village.definition', worldId: I.world, revision: 1,
        label: 'Proto23 village · independent visitor', unidentifiedLabel: 'Proto23 visitor village',
        regions: [{id: I.world, layerIds: ['reference.proto23.surface']}],
        sites: [{id: I.site, label: 'Visitor cottage station', regionId: I.world, layerId: 'reference.proto23.surface', initialOpen: true},
            {id: I.dojo, label: 'Dojo visitor practice station', regionId: I.world, layerId: 'reference.proto23.surface', initialOpen: true}],
        initialFacts: {}, uniqueClaimIds: []}}]);
