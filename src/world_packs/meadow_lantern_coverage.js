import {lanternCoatProperties, WISP_NECTAR} from './meadow_lantern_fleece.js';

const id = 'lantern-fleece.moon-veil';
const animal = {kind: 'body', id: 'ewe'}, site = {kind: 'place', id: 'pen'};
const grazer = {kind: 'body', id: 'pasture-ewe'};
const charge = 'energy:lantern-charge', light = 'light:lantern-fleece';
const form = 'temporary-form';
const prism = 'stock:sun-prism', husk = 'stock:lantern-husk';
const altar = {kind: 'thing', id: 'altar'}, wisp = {kind: 'body', id: 'wisp'};
const awakening = {parent: grazer.id, huskHolder: altar.id, offspring: wisp.id};
const read = (holder, term, direction, to) => ({holder, ...term, direction, to});
const reserve = (direction, to) => read(animal.id, {quantity: charge}, direction, to);
const glow = (direction, to) => read(site.id, {quantity: light}, direction, to);
const working = (id, method, bindings = {animal}) => ({id, working: {family: 'lantern-fleece', id, method, bindings}});

export function coverageCase(caseId) {
    if (caseId !== id) throw Error(`Unknown Lantern Fleece case ${caseId}.`);
    const sheep = {matureAt: 0, genes: {fleece: ['F', 'f'], coat: ['D', 'd'], winter: ['w', 'w'], vigor: ['v', 'v']}};
    return {
        basis: 'authored',
        engine: {packs: ['w.sky', 'l.lantern_coat', 'l.creature_form', 'l.lantern_moon_cycle'],
            settings: {'w.sky': {dawn: 490, dusk: 510, moonCycleDays: 2}},
            host: {things: {'body:ewe': sheep, 'body:pasture-ewe': sheep}}},
        world: {clock: 10, holders: [
            {id: site.id, kind: 'place', quantities: {daylight: 0, moon_phase: 4, [light]: 0}},
            {id: animal.id, kind: 'body', place: site.id, refs: {creature: animal.id},
                properties: {...lanternCoatProperties(sheep), form: 'lantern-fleece'}, quantities: {[charge]: 4}},
            {id: 'pasture', kind: 'place', tags: ['sky'], quantities: {daylight: 1, moon_phase: 4, [light]: 0}},
            {id: 'lit-barn', kind: 'place', quantities: {daylight: 1, [light]: 0, [WISP_NECTAR]: 1}},
            {id: altar.id, kind: 'thing', place: 'lit-barn', quantities: {[prism]: 1, [husk]: 0, [charge]: 0}},
            {id: grazer.id, kind: 'body', as: ['creature'], place: 'pasture', refs: {creature: grazer.id},
                properties: {...lanternCoatProperties(sheep), form: 'lantern-fleece'}, quantities: {[charge]: 4}},
        ]},
        timeline: [
            working('base-beam', 'moonbeam'),
            {id: 'base-refuses', advanceTo: 11, interruption: {working: 'base-beam', reason: 'moonbeam-needs-moon-fleece'},
                expect: [reserve('unchanged', 4), glow('unchanged', 0)]},
            working('veil', 'moon-veil', {animal, site}),
            {id: 'restore-veil', restore: true},
            {id: 'enter-veil', advanceTo: 12, expect: [reserve('down', 3), read(animal.id, {property: form}, 'changed', 'moon-fleece')]},
            working('beam', 'moonbeam'),
            {id: 'beam-lands', advanceTo: 13, expect: [reserve('down', 2), glow('up', 12)]},
            {id: 'before-expiry', advanceTo: 17, expect: [glow('down', 0)]},
            working('expiry-flash', 'flash'),
            {id: 'restore-expiry', restore: true},
            {id: 'revert-and-flash', advanceTo: 18, expect: [reserve('down', 1), glow('up', 4),
                read(animal.id, {property: form}, 'changed', null), read(animal.id, {property: 'form'}, 'unchanged', 'lantern-fleece')]},
            {id: 'before-dusk', advanceTo: 29},
            {id: 'restore-before-dusk', restore: true},
            {id: 'dusk-enters-veil', advanceTo: 30, expect: [
                read(grazer.id, {quantity: charge}, 'down', 3), read(grazer.id, {property: form}, 'changed', 'moon-fleece'),
            ]},
            working('pasture-beam', 'moonbeam', {animal: grazer}),
            {id: 'pasture-beam-lands', advanceTo: 31, expect: [
                read(grazer.id, {quantity: charge}, 'down', 2), read('pasture', {quantity: light}, 'up', 12),
            ]},
            {id: 'call-into-daylight', working: {family: 'spell', id: 'call-into-daylight', spells: [{
                sentence: {verb: 'move', object: 'position', target: 'creature', time: 'instant', carrier: 'wand'},
                target: {id: grazer.id}, minutes: 1, details: {target: {shape: 'holder', id: grazer.id}, to: 'lit-barn'},
            }]}},
            {id: 'restore-crossing', restore: true},
            {id: 'daylight-releases-veil', advanceTo: 32, expect: [
                read(grazer.id, {position: true}, 'changed', 'lit-barn'), read(grazer.id, {property: form}, 'changed', null),
                read(grazer.id, {quantity: charge}, 'unchanged', 2),
            ]},
            working('daylight-beam', 'moonbeam', {animal: grazer}),
            {id: 'daylight-refuses-moonbeam', advanceTo: 33,
                interruption: {working: 'daylight-beam', reason: 'moonbeam-needs-moon-fleece'},
                expect: [read(grazer.id, {quantity: charge}, 'up', 3), read('lit-barn', {quantity: light}, 'unchanged', 0)]},
            working('sun-molt', 'sun-molt', {animal: grazer, site: {kind: 'place', id: 'lit-barn'}, altar}),
            {id: 'restore-molt', restore: true},
            {id: 'molt-sheds-husk', advanceTo: 34, expect: [
                read(grazer.id, {property: 'form'}, 'changed', 'beacon-fleece'),
                read(altar.id, {quantity: prism}, 'down', 0), read(altar.id, {quantity: husk}, 'up', 1),
            ]},
            {id: 'empty-husk-refuses', awakenLanternHusk: awakening, refusal: 'lantern-husk-needs-parent-and-charge'},
            {id: 'charge-husk', ops: [
                {op: 'add', holder: grazer.id, quantity: charge, amount: -1},
                {op: 'add', holder: altar.id, quantity: charge, amount: 1},
            ]},
            {id: 'restore-charged-husk', restore: true},
            {id: 'occupied-identity-refuses', awakenLanternHusk: {...awakening, offspring: grazer.id},
                refusal: 'lantern-husk-identity-unavailable'},
            {id: 'husk-awakens', awakenLanternHusk: awakening, expect: [
                read(wisp.id, {exists: true}, 'changed', true), read(wisp.id, {property: 'form'}, 'changed', 'husk-wisp'),
                read(wisp.id, {creationParents: true}, 'changed', [grazer.id]),
                read(wisp.id, {quantity: charge}, 'up', 1), read(altar.id, {quantity: charge}, 'down', 0),
                read(altar.id, {quantity: husk}, 'down', 0),
            ]},
            working('wisp-glow', 'wisp-glow', {animal: wisp}),
            {id: 'restore-wisp-glow', restore: true},
            {id: 'wisp-lights-barn', advanceTo: 35, expect: [
                read(wisp.id, {quantity: charge}, 'down', 0), read('lit-barn', {quantity: light}, 'up', 6),
                read(wisp.id, {creationParents: true}, 'unchanged', [grazer.id]),
            ]},
            {id: 'shade-barn', ops: [{op: 'property', holder: 'lit-barn', property: 'lantern-shade', value: true}]},
            {id: 'restore-spent-wisp', restore: true},
            {id: 'wisp-feeds', advanceTo: 36, expect: [
                read('lit-barn', {quantity: WISP_NECTAR}, 'down', 0), read(wisp.id, {quantity: charge}, 'up', 1),
            ]},
            working('wisp-second-glow', 'wisp-glow', {animal: wisp}),
            {id: 'wisp-glows-again', advanceTo: 37, expect: [
                read(wisp.id, {quantity: charge}, 'down', 0), read('lit-barn', {quantity: light}, 'unchanged', 6),
            ]},
            working('wisp-without-nectar', 'wisp-glow', {animal: wisp}),
            {id: 'empty-patch-cannot-fund-glow', advanceTo: 38,
                interruption: {working: 'wisp-without-nectar', reason: 'lantern-charge-empty'},
                expect: [read(wisp.id, {quantity: charge}, 'unchanged', 0)]},
        ],
        expect: [reserve('down', 1), glow('unchanged', 0), read(animal.id, {property: form}, 'unchanged', null),
            read(grazer.id, {position: true}, 'changed', 'lit-barn'), read(grazer.id, {property: 'form'}, 'changed', 'beacon-fleece'),
            read(wisp.id, {exists: true}, 'changed', true), read('lit-barn', {quantity: light}, 'up', 6),
            read('lit-barn', {quantity: WISP_NECTAR}, 'down', 0)],
    };
}
