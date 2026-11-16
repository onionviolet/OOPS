// PS107-PS110: Here's panels by kind. The frame tags each panel and shows it in its kind's tab; a crossing joins Ways out.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {uiViolations} from './helpers/ui_contract.mjs';
import {hereTab, HERE_KINDS, HERE_HOMES, HERE_KIND_MAP} from '../src/ui/here_kinds.js';
import {projectNearbyContext, registerWayOut, extraWayOuts} from '../src/nearby_context_view.js';

// The files that append their own panel under Here today. The list only shrinks: a new module declares its kind with
// placeHerePanel (src/ui/here_kinds.js) and lets the frame place it (PS108).
const HERE_APPENDERS = ['src/absorb_p23/host_joins/combat_options_ui.js', 'src/absorb_p23/host_joins/encounter_profiles_ui.js', 'src/absorb_p23/host_joins/growth_profile_ui.js',
    'src/absorb_p23/host_joins/tranche_four_ui.js', 'src/absorb_p23/host_joins/tranche_three_ui.js', 'src/absorb_p23/host_joins/tranche_two_ui.js', 'src/body_ui.js', 'src/chronicle_ui.js',
    'src/content_pack_ui.js', 'src/display.js', 'src/exchange_ui.js', 'src/expedition_ui.js', 'src/feature_expansion_nested_ink_ui.js', 'src/feature_expansion_ui.js', 'src/field_ui.js',
    'src/foundation_interaction_ui.js', 'src/frontier_campaign_ui.js', 'src/main.js', 'src/observation_ui.js', 'src/original_frontier_campaign_ui.js', 'src/party_ui.js', 'src/pocket_realm_ui.js',
    'src/promise_ui.js', 'src/pursuit_ui.js', 'src/repository_absorption_ui.js', 'src/simulation_ui.js', 'src/skill_expansion_ui.js', 'src/storylet_ui.js', 'src/structured_pack_ui.js',
    'src/technique_ui.js', 'src/town_ui.js', 'src/ui/here_kinds.js', 'src/village_career_ui.js'];

test('no new module appends its own panel under Here; it declares a kind and the frame places it (PS108)', () => {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const paths = [...new Set(uiViolations(root).filter(v => v.rule === 'foreign-host').map(v => v.path))]
        .filter(p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8').includes('location_actions_div')).sort();
    assert.deepEqual(paths.filter(p => !HERE_APPENDERS.includes(p)), [], 'Use placeHerePanel(panel, kind, home) from src/ui/here_kinds.js instead of appending to #location_actions_div.');
});

test('each kind has one home: acts in Actions, settings in Options, features and projects in their tab, places in Ways out (PS107)', () => {
    assert.deepEqual(HERE_KINDS, ['act', 'place', 'setting', 'feature', 'project']);
    assert.equal(hereTab('act'), 'actions'); assert.equal(hereTab('setting'), 'options'); assert.equal(hereTab('place'), 'none');
    assert.equal(hereTab('feature', 'home'), 'home'); assert.equal(hereTab('project'), 'workshop'); assert.equal(hereTab('feature', 'nowhere'), 'equipment');
    // The panels Weibao named (2026-11-15) each have a kind, so none falls back to the action pile.
    const named = HERE_KIND_MAP.map(([selector]) => selector);
    for (const id of ['#pacing_status_panel', '#durability_panel', '#furniture_panel', '#systems_workshop_panel', '[data-lotm-door]']) assert.ok(named.includes(id), id);
    for (const [, entry] of HERE_KIND_MAP) if (typeof entry !== 'function') assert.ok(!entry.home || HERE_HOMES.some(([id]) => id === entry.home), entry.home);
});

test('a crossing joins Ways out and pressing it runs the owner\'s own control (PS107, AR3)', () => {
    let pressed = 0;
    const release = registerWayOut({id: 'test-crossing', rows: () => [{id: 'place:door', name: 'Tingen', role: 'Another world', act: 'Cross to another world: Tingen', run: () => pressed++}]});
    try {
        const frame = {place: 'Village', exits: [{id: 'go:field', name: 'Field'}, ...extraWayOuts()]};
        const view = projectNearbyContext(frame, 'place:door');
        assert.deepEqual(view.exits.map(e => e.name), ['Field', 'Tingen']);
        assert.match(view.summary, /2 ways out/);
        assert.equal(view.subject.actions[0].label, 'Cross to another world: Tingen');
        view.subject.actions[0].run(); assert.equal(pressed, 1);
    } finally { release(); }
    assert.deepEqual(extraWayOuts(), []);
});

test('every display or visibility rule splits cleanly for the headless cascade (scripts/headless/css.mjs)', () => {
    // css.mjs splits a selector list with /,(?![^(]*\))/. A comma before a nested :not(...) inside :is(...) breaks there,
    // and the unclosed half can match an ancestor: da9a20646 hid #main_content in every headless run that way.
    const dir = new URL('../styles/', import.meta.url), broken = [];
    for (const f of readdirSync(dir).filter(f => f.endsWith('.css'))) {
        const css = readFileSync(new URL(f, dir), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        for (const m of css.matchAll(/([^{}]+)\{[^{}]*(?:display|visibility)[^{}]*\}/g))
            for (const part of m[1].trim().split(/,(?![^(]*\))/)) if ((part.match(/\(/g) || []).length !== (part.match(/\)/g) || []).length) broken.push(`${f}: ${part.trim().slice(0, 100)}`);
    }
    assert.deepEqual(broken, [], 'Write one selector per rule instead of a list with a nested :not(...) inside :is(...).');
});
