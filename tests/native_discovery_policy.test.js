import test from 'node:test';
import assert from 'node:assert/strict';
import {createDiscoveryCuePolicy} from '../src/native_discovery_policy.js';
import {defaultCustomizationState,validateCustomizationState,getCustomizationSettings} from '../src/customization_profiles.js';
const event = (id, label = id) => ({type:'native-skill-discovery',id,label,known:true,settled:true});
test('undisclosed, uncommitted, ordinary XP and malformed events cannot announce a skill', () => {
    const policy = createDiscoveryCuePolicy();
    const secret = event('unseen');
    assert.equal(policy.take([{...secret,known:false},{...secret,settled:false},
        {...secret,type:'skill-xp'},event('', 'bad'),event('bad','')]), null);
    assert.equal(policy.take([secret]).text, 'Discovered: unseen');
});
test('a batch coalesces new discoveries, keeps native input immutable, and cannot replay', () => {
    const policy = createDiscoveryCuePolicy();
    const rows = [Object.freeze(event('Run','Running')),Object.freeze(event('Rest','Regeneration'))];
    const before = JSON.stringify(rows);
    const receipt = policy.take([...rows, rows[0]]);
    assert.equal(receipt.text,'Discovered 2 skills: Running, Regeneration');
    assert.equal(receipt.motif,'guidance');
    assert.equal(JSON.stringify(rows),before);
    assert.equal(policy.take(rows),null);
    assert.equal(policy.take([event('Read','Literacy'),rows[1]]).text,'Discovered: Literacy');
});
test('restored known state alone is not an event; a deliberate new-run reset permits a new crossing', () => {
    const policy = createDiscoveryCuePolicy();
    assert.equal(policy.take([{id:'Run',label:'Running',known:true}]),null);
    assert.ok(policy.take([event('Run')]));
    assert.equal(policy.take([event('Run')]),null);
    policy.reset();
    assert.ok(policy.take([event('Run')]));
});
test('saved skill effects override only their supported consumer and old profiles remain valid', () => {
    const old = defaultCustomizationState();
    const restored = validateCustomizationState(JSON.parse(JSON.stringify(old)));
    assert.equal(getCustomizationSettings(restored,'skills').effects,'reduced');
    for(const mode of ['off','reduced','full']) {
        const profile = structuredClone(old);
        profile.profiles.Default.modules.skills = {effects:mode,sound:false};
        const saved = validateCustomizationState(JSON.parse(JSON.stringify(profile)));
        assert.equal(getCustomizationSettings(saved,'skills').effects,mode);
        assert.equal(getCustomizationSettings(saved,'crafting').effects,'reduced');
    }
    const invalid = structuredClone(old);
    invalid.profiles.Default.modules.vitals = {effects:'full'};
    assert.throws(()=>validateCustomizationState(invalid),/typography, palette and spacing/);
});
