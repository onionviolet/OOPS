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
    assert.equal(node.style.values['--custom-font'], 'var(--ui-font-gothic)');
    assert.equal(node.style.values['--custom-prose-font'], 'var(--ui-font-prose)');
    assert.deepEqual(validateCustomizationState(JSON.parse(JSON.stringify(state))), state);
    assert.throws(() => validateCustomizationState({...state, profiles:{Default:{...state.profiles.Default,settings:{...state.profiles.Default.settings,typography:{font:'unknown',size:14}}}}}), /invalid font/);
});

test('Luminous Gothic name collision gets a valid suffix and profile cap is enforced', () => {
    const state = defaultCustomizationState();
    state.profiles['Luminous Gothic'] = clone(state.profiles.Default);
    assert.equal(createLuminousGothicDraft(state).active, 'Luminous Gothic 2');
    const full = defaultCustomizationState();
    for (let index=2; index<=20; index++) full.profiles[`Profile ${index}`] = clone(full.profiles.Default);
    assert.throws(() => createLuminousGothicDraft(full), /profile limit is 20/);
});
