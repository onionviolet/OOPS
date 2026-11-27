import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultCustomizationState, validateCustomizationState, createLuminousGothicDraft, applyCustomizationProfile} from '../src/customization_profiles.js';

const clone = value => structuredClone(value);

test('Luminous Gothic draft is isolated, preserves profiles and copies explicit module choices', () => {
    const state = defaultCustomizationState();
    state.profiles.Default.settings.typography.size = 21;
    state.profiles.Default.settings.spacing = 13;
    state.profiles.Default.modules.messages = {palette:{background:'#123456'}, typography:{font:'serif',size:17}, componentTheme:'arcane'};
    state.profiles.Keeper = clone(state.profiles.Default);
    state.active = 'Default';
    const before = clone(state), result = createLuminousGothicDraft(state);
    assert.deepEqual(state, before);
    assert.deepEqual(result.profiles.Default, before.profiles.Default);
    assert.deepEqual(result.profiles.Keeper, before.profiles.Keeper);
    assert.equal(result.active, 'Luminous Gothic');
    assert.deepEqual(result.profiles[result.active].modules, before.profiles.Default.modules);
    assert.equal(result.profiles[result.active].settings.componentTheme, 'luminous');
    assert.equal(result.profiles[result.active].settings.typography.font, 'gothic');
    assert.equal(result.profiles[result.active].settings.typography.size, 21);
    assert.equal(result.profiles[result.active].settings.spacing, 13);
    assert.deepEqual(result.profiles[result.active].settings.palette, {background:'#07162d',text:'#d5f7ff',accent:'#7fe7e8'});
});

test('Luminous Gothic supplies purple messages palette only when no explicit palette exists', () => {
    const state = defaultCustomizationState();
    const result = createLuminousGothicDraft(state);
    assert.deepEqual(result.profiles[result.active].modules.messages.palette, {background:'#231735',text:'#eee5ff',accent:'#bca4ff'});
    state.profiles.Default.modules.messages = {palette:{background:'#112233',text:'#eeeeee',accent:'#abcdef'}};
    const preserved = createLuminousGothicDraft(state);
    assert.deepEqual(preserved.profiles[preserved.active].modules.messages, state.profiles.Default.modules.messages);
});

test('Gothic font validates, applies its role tokens and survives JSON roundtrip', () => {
    const state = createLuminousGothicDraft(defaultCustomizationState());
    const node = {style:{values:{},setProperty(key,value){this.values[key]=value;}},classList:{add(){}},dataset:{},querySelectorAll(){return [];}};
    applyCustomizationProfile(state, {moduleNodes:{ledger:node}});
    assert.equal(node.dataset.typographyFont, 'gothic');
    assert.equal(node.style.values['--custom-font'], '"OOPS Gothic Bitmap 14", var(--ui-font-gothic)');
    assert.equal(node.style.values['--custom-prose-font'], '"OOPS Gothic Bitmap 14", var(--ui-font-gothic)');
    assert.deepEqual(validateCustomizationState(JSON.parse(JSON.stringify(state))), state);
    assert.throws(() => validateCustomizationState({...state, profiles:{Default:{...state.profiles.Default,settings:{...state.profiles.Default.settings,typography:{font:'unknown',size:14}}}}}), /invalid font/);
});

test('tiny Gothic secondary text uses the outline rather than an empty strike or a scaled 14px face', () => {
    for (const [size, smallSize, bodyFamily, smallFamily] of [
        [10, 9, '"OOPS Gothic Bitmap 10", var(--ui-font-gothic)', 'var(--ui-gothic-outline)'],
        [11, 9, '"OOPS Gothic Bitmap 11", var(--ui-font-gothic)', 'var(--ui-gothic-outline)'],
        [12, 10, '"OOPS Gothic Bitmap 12", var(--ui-font-gothic)', '"OOPS Gothic Bitmap 10", var(--ui-font-gothic)'],
        [23, 20, 'var(--ui-gothic-outline)', '"OOPS Gothic Bitmap 20", var(--ui-font-gothic)'],
        [28, 24, 'var(--ui-gothic-outline)', 'var(--ui-gothic-outline)'],
    ]) {
        const state = defaultCustomizationState();
        state.profiles.Default.settings.typography.size = size;
        const node = {style:{values:{},setProperty(key,value){this.values[key]=value;}},classList:{add(){}},dataset:{},querySelectorAll(){return [];}};
        applyCustomizationProfile(state, {moduleNodes:{ledger:node}});
        assert.equal(node.style.values['--custom-font'], bodyFamily, `body at ${size}px`);
        assert.equal(node.style.values['--custom-small-font'], smallFamily, `secondary at ${smallSize}px`);
        assert.equal(node.style.values['--custom-small-size'], `${smallSize}px`);
    }
});

test('internal Gothic defaults include prose while explicit saved font choices stay intact', () => {
    const initial = defaultCustomizationState();
    assert.equal(initial.profiles.Default.settings.typography.font, 'gothic');
    const saved = clone(initial);
    saved.profiles.Default.settings.typography.font = 'system';
    saved.profiles.Default.modules.messages = {typography:{font:'serif',size:21}};
    const nodes = Object.fromEntries(['ledger','messages'].map(id => [id, {style:{values:{},setProperty(k,v){this.values[k]=v;}},classList:{add(){}},dataset:{},querySelectorAll(){return [];}}]));
    applyCustomizationProfile(saved, {moduleNodes:nodes});
    assert.equal(nodes.ledger.style.values['--custom-font'], 'var(--ui-font-system)');
    assert.equal(nodes.messages.style.values['--custom-prose-font'], 'Georgia, serif');
    assert.equal(nodes.messages.style.values['--custom-size'], '21px');
    assert.deepEqual(validateCustomizationState(JSON.parse(JSON.stringify(saved))), saved);
});

test('Luminous Gothic name collision gets a valid suffix and profile cap is enforced', () => {
    const state = defaultCustomizationState();
    state.profiles['Luminous Gothic'] = clone(state.profiles.Default);
    assert.equal(createLuminousGothicDraft(state).active, 'Luminous Gothic 2');
    const full = defaultCustomizationState();
    for (let index=2; index<=20; index++) full.profiles[`Profile ${index}`] = clone(full.profiles.Default);
    assert.throws(() => createLuminousGothicDraft(full), /profile limit is 20/);
});

test('Graphite is the default look; only an untouched Neutral or Luminous default profile is upgraded', async () => {
    const {neutralPresentationSettings, upgradeUntouchedCustomization} = await import('../src/customization_profiles.js');
    const fresh = defaultCustomizationState();
    assert.equal(fresh.profiles.Default.settings.componentTheme, 'graphite');
    assert.deepEqual(fresh.profiles.Default.settings.palette, {background:'#1e1e1e',text:'#eeeeee',accent:'#518ae0'});
    assert.deepEqual(fresh.profiles.Default.modules.messages.palette, {background:'#1e1e1e',text:'#eeeeee',accent:'#b9a0d8'});
    const legacy = {schema:1, active:'Default', theme:{mode:'automatic',season:'spring'}, profiles:{Default:{settings:neutralPresentationSettings(), modules:{}}}};
    const upgraded = upgradeUntouchedCustomization(clone(legacy));
    assert.equal(upgraded.profiles.Default.settings.componentTheme, 'graphite');
    // A save from the Luminous default (2026-10-29 to 2026-11-20) that was never touched moves to Graphite once.
    const luminousDefault = {schema:1, active:'Default', theme:{mode:'off',season:'spring'}, profiles:{Default:{settings:{...neutralPresentationSettings(), componentTheme:'luminous', palette:{background:'#07162d',text:'#d5f7ff',accent:'#7fe7e8'}}, modules:{messages:{palette:{background:'#231735',text:'#eee5ff',accent:'#bca4ff'}}}}}};
    assert.equal(upgradeUntouchedCustomization(clone(luminousDefault)).profiles.Default.settings.componentTheme, 'graphite');
    const keptLuminous = clone(luminousDefault); keptLuminous.profiles.Default.settings.spacing = 12;
    assert.equal(upgradeUntouchedCustomization(keptLuminous).profiles.Default.settings.componentTheme, 'luminous');
    assert.equal(upgraded.theme.mode, 'automatic');
    const edited = clone(legacy); edited.profiles.Default.settings.typography.size = 17;
    assert.deepEqual(upgradeUntouchedCustomization(edited), validateCustomizationState(edited));
    const named = clone(legacy); named.profiles.Mine = clone(legacy.profiles.Default);
    assert.equal(upgradeUntouchedCustomization(named).profiles.Default.settings.componentTheme, 'neutral');
    assert.deepEqual(validateCustomizationState(JSON.parse(JSON.stringify(fresh))), fresh);
});

test('DK1: every save moves to the dark default once; an edited look is kept as its own profile', async () => {
    const {neutralPresentationSettings, moveToDefaultLook} = await import('../src/customization_profiles.js');
    const lum = {schema:1, active:'Default', theme:{mode:'off',season:'spring'}, profiles:{Default:{settings:{...neutralPresentationSettings(), componentTheme:'luminous', spacing:12}, modules:{}}}};
    const moved = moveToDefaultLook(clone(lum));
    assert.equal(moved.active, 'Default');
    assert.equal(moved.profiles.Default.settings.componentTheme, 'graphite');
    assert.equal(moved.profiles['Kept look'].settings.componentTheme, 'luminous');
    assert.equal(moved.profiles['Kept look'].settings.spacing, 12);
    const mine = clone(lum); mine.profiles.Mine = mine.profiles.Default; delete mine.profiles.Default; mine.active = 'Mine';
    const moved2 = moveToDefaultLook(mine);
    assert.deepEqual(Object.keys(moved2.profiles).sort(), ['Default', 'Mine']);
    const already = moveToDefaultLook(moved);
    assert.deepEqual(already, moved);
});

test('DK1 keeps inactive and capped profiles when adding Graphite', async () => {
    const {neutralPresentationSettings, moveToDefaultLook} = await import('../src/customization_profiles.js');
    const oldLook = {settings:{...neutralPresentationSettings(), spacing:12}, modules:{}};
    const state = {schema:1, active:'Mine', theme:{mode:'off',season:'spring'}, profiles:{
        Default:oldLook, Mine:{...oldLook, settings:{...oldLook.settings, spacing:16}}, Graphite:oldLook,
    }};
    const moved = moveToDefaultLook(state);
    assert.equal(moved.active, 'Graphite 2');
    for (const [name, profile] of Object.entries(state.profiles)) assert.deepEqual(moved.profiles[name], profile);
    for (let i = 4; i <= 19; i++) state.profiles[`Look ${i}`] = oldLook;
    state.active = 'Default';
    const lastSlot = moveToDefaultLook(state);
    assert.equal(Object.keys(lastSlot.profiles).length, 20);
    assert.deepEqual(lastSlot.profiles['Kept look'], oldLook);
    state.profiles['Look 20'] = oldLook;
    assert.deepEqual(moveToDefaultLook(state), validateCustomizationState(state));
    state.profiles['Look 20'] = defaultCustomizationState().profiles.Default;
    const reused = moveToDefaultLook(state);
    assert.equal(reused.active, 'Look 20');
    assert.deepEqual(reused.profiles, validateCustomizationState(state).profiles);
});
