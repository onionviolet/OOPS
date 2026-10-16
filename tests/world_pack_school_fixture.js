// Synthetic test-school world pack (P9Q45). Original test data only: no canon
// source, no real world secrets. The sealed term below is a test string.
import {address, hash64} from '../src/gen_kit.js';

export const FEATURES = Object.freeze(['generator:person.cohort@1', 'resolver:test.d20@1']);
export const HOUSES = Object.freeze(['ash', 'birch', 'cedar', 'damson']);
export const BLOCKS = Object.freeze([{id: 'b1', start: 540, end: 600}, {id: 'b2', start: 600, end: 660}, {id: 'b3', start: 780, end: 840}, {id: 'b4', start: 840, end: 900}]);
export const SEALED_TEST_TERM = 'vault beneath the bell tower';
const P = 'test.school';
const id = s => `${P}.${s}`;
const classrooms = ['classroom_a', 'classroom_b', 'classroom_c'].map(s => id(`area.${s}`));
export const cohortId = (year, house) => id(`cohort.y${year}_${house}`);

export const fakeRuleAdapter = Object.freeze({
    createRuleLock(modules) {
        const refs = modules.map(m => `${m.id}@${m.revision}`).sort();
        const {lo, hi} = hash64('fake-rule-lock', address(refs));
        return {refs, fingerprint: `${hi}:${lo}`};
    },
});

export function makeRulebookPack({revision = 1} = {}) {
    return {
        format: 'yairpg.world-pack', formatVersion: 1, id: 'test.rulebook', revision, saveSchema: 1, kind: 'rulebook',
        title: 'Test dice rulebook',
        attribution: {source: 'YAIRPG test fixture', licence: 'original', notice: 'Original test rules.'},
        budgets: {entities: 1, drawsPerEntity: 1, saveBytes: 1024},
        provides: {ruleProfiles: [{
            id: 'test.rulebook.core', resolver: 'test.d20@1', growthUnit: 'xp', scaleClass: 'human', directorPolicy: 'steady',
            modules: [
                {id: 'test.rulebook.mod.base_check', revision: 1, priority: {layer: 'core'}},
                {id: 'test.rulebook.mod.optional_crit', revision: 1, priority: {layer: 'core'}},
            ],
            rulings: {'test.rulebook.mod.base_check': 'supported', 'test.rulebook.mod.optional_crit': 'needs_ruling'},
        }]},
        content: {},
    };
}

// years x houses cohorts of `perCohort` generated students plus named records.
export function makeSchoolPack({revision = 1, years = 7, perCohort = 12, given = null} = {}) {
    const cohorts = [];
    for (let y = 1; y <= years; y++) HOUSES.forEach((h, hi) => {
        const timetable = {};
        for (let day = 0; day < 5; day++) timetable[day] = Object.fromEntries(BLOCKS.map((b, bi) => [b.id, classrooms[(y + hi + day + bi) % 3]]));
        cohorts.push({id: cohortId(y, h), label: `Year ${y} ${h}`, institution: id('inst.academy'), house: id(`house.${h}`), entryYear: 10 - y, count: perCohort, timetable, slot: id('slot.students')});
    });
    const area = (key, label, coverage, extra = {}) => ({id: id(`area.${key}`), label, coverage, routes: [], activities: [], ...extra});
    const areas = [
        area('gate', 'Front gate', 'playable', {activities: [id('act.look')], people: [id('person.porter')], routes: [{to: id('area.hall'), method: 'walk', minutes: 3}]}),
        area('hall', 'Great hall', 'playable', {activities: [id('act.eat'), id('act.ask_around')], slots: [id('slot.students')],
            routes: [{to: id('area.gate'), method: 'walk', minutes: 3}, {to: id('area.library'), method: 'walk', minutes: 2}, {to: id('area.greenhouse'), method: 'walk', minutes: 4},
                ...classrooms.map(to => ({to, method: 'walk', minutes: 2})), ...HOUSES.map(h => ({to: id(`area.dorm_${h}`), method: 'walk', minutes: 5}))]}),
        ...['a', 'b', 'c'].map(k => area(`classroom_${k}`, `Classroom ${k.toUpperCase()}`, 'playable', {activities: [id('act.attend')], routes: [{to: id('area.hall'), method: 'walk', minutes: 2}]})),
        area('library', 'Library', 'playable', {activities: [id('act.study')], slots: [id('slot.students')], routes: [{to: id('area.hall'), method: 'walk', minutes: 2}]}),
        ...HOUSES.map(h => area(`dorm_${h}`, `${h} dormitory`, 'playable', {activities: [id('act.rest')], slots: [id('slot.students')], routes: [{to: id('area.hall'), method: 'walk', minutes: 5}]})),
        area('greenhouse', 'Greenhouse', 'inspectable'),
        area('tower', 'Bell tower', 'background'),
    ];
    return {
        format: 'yairpg.world-pack', formatVersion: 1, id: P, revision, saveSchema: 1, saveCompatibleFrom: 1, kind: 'canon',
        title: 'Test school',
        sourceSnapshot: {hash: 'synthetic-test-school-1', locator: 'tests/world_pack_school_fixture.js'},
        attribution: {source: 'YAIRPG synthetic fixture', licence: 'original', notice: 'Synthetic test data.'},
        requires: {features: [], packs: [{id: 'test.rulebook', minRevision: 1}], ruleProfile: id('profile')},
        provides: {ruleProfiles: [{id: id('profile'), extends: 'test.rulebook.core', resolver: 'test.d20@1', growthUnit: 'xp', scaleClass: 'human', directorPolicy: 'term_rhythm',
            modules: [{id: id('mod.curfew'), revision: 1, priority: {layer: 'world'}}], rulings: {[id('mod.curfew')]: 'supported'}}]},
        budgets: {entities: 1000, drawsPerEntity: 4, saveBytes: 200000, presenceQueryMicros: 50},
        entryArea: id('area.gate'),
        retired: [{id: id('person.old_headmaster'), since: 1}],
        content: {
            catalog: [{id: id('cat.academy'), label: 'The academy', kind: 'institution', canonWeight: 'W2'}, {id: id('cat.founding'), label: 'Founding day', kind: 'event', era: 'founding', containedIn: id('cat.academy')}],
            areas,
            institutions: [{id: id('inst.academy'), label: 'Academy', commons: id('area.hall'),
                houses: HOUSES.map(h => ({id: id(`house.${h}`), label: h, dorm: id(`area.dorm_${h}`)})), blocks: [...BLOCKS],
                calendar: {weekLength: 7, terms: [[0, 90], [100, 190], [200, 290]], wake: 420, curfew: 1320},
                clubs: [{id: id('club.chess'), label: 'Chess club', weekday: 2, block: 'b4', place: id('area.library')}, {id: id('club.choir'), label: 'Choir', weekday: 4, block: 'b3', place: id('area.hall')}]}],
            cohorts,
            people: [
                {id: id('person.porter'), name: 'Old Porter', canonWeight: 'W1'},
                {id: id('person.ada'), name: 'Ada Quill', cohort: cohortId(3, 'ash'), canonWeight: 'W3', club: id('club.chess')},
                {id: id('person.bram'), name: 'Bram Holt', cohort: cohortId(3, 'birch'), canonWeight: 'W2'},
                {id: id('person.cora'), name: 'Cora Venn', cohort: cohortId(5, 'cedar'), canonWeight: 'W2', club: id('club.choir')},
                {id: id('person.dev'), name: 'Dev Marsh', cohort: cohortId(1, 'damson'), canonWeight: 'W1'},
            ],
            relationships: [{id: id('rel.ada_bram'), a: id('person.ada'), b: id('person.bram'), kind: 'rival', source: 'canon'}],
            exceptions: [
                {id: id('exc.assembly'), kind: 'canon_event', cohortId: cohortId(3, 'ash'), placeId: id('area.hall'), start: 10 * 1440 + 540, end: 10 * 1440 + 660},
                {id: id('exc.ada_detention'), kind: 'detention', personId: id('person.ada'), placeId: id('area.library'), start: 10 * 1440 + 540, end: 10 * 1440 + 600},
                {id: id('exc.bram_ill'), kind: 'illness', personId: id('person.bram'), placeId: id('area.dorm_birch'), start: 12 * 1440, end: 15 * 1440},
            ],
            slots: [{id: id('slot.students'), kind: 'cohort_members', generator: 'person.cohort@1', budget: {maxEntities: 1000, maxDrawsPerEntity: 4},
                table: {revision: 1, noClubWeight: 6, clubWeight: 2,
                    given: (given || ['Alma', 'Basil', 'Clem', 'Dora', 'Edda', 'Fenn', 'Gil', 'Hale', 'Iris', 'Jory', 'Kit', 'Lark']).map(n => ({id: n, weight: 1})),
                    family: ['Ashby', 'Brook', 'Croft', 'Dale', 'Ember', 'Frost', 'Gale', 'Heath', 'Ivy', 'Jett', 'Knoll', 'Lowe'].map(n => ({id: n, weight: 1})),
                    traits: ['bookish', 'brash', 'kind', 'sly', 'sporty', 'quiet'].map(n => ({id: n, weight: 1}))}}],
            secrets: [{id: id('secret.s1'), sealed: true, route: 'library_archive', status: 'sealed', sealedTerms: [SEALED_TEST_TERM]}],
            crossings: [],
        },
    };
}
