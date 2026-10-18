import test from 'node:test';
import assert from 'node:assert/strict';
import {secondaryVisible,coldApplies,pinKey} from '../src/condition_facts.js';
import {LAYOUT_SPEC,regionFor,routeById} from '../src/layout_spec.js';
import {moveBox,normalizePlacement,resetContext} from '../src/shell_layout_edit.js';
import {registerPanelSettings,setDisplaySettings,getDisplaySetting,replaceDisplaySettings,resetDisplaySettings,getDisplaySettings} from '../src/display_settings.js';
const row=(id,value,unit='',sources=[])=>({id,value,unit,sources,availability:{status:'active'}});
test('neutral secondary rows hide, effects and pins reveal them, reference values stay unavailable',()=>{
    for(const id of ['health_regeneration_flat','health_regeneration_percent','stamina_regeneration_flat']){
        assert.equal(secondaryVisible(row(id,0)),false);
        assert.equal(secondaryVisible(row(id,2)),true);
        assert.equal(secondaryVisible(row(id,0),true),true);
        assert.equal(secondaryVisible(row(id,0,'',[{label:'Active effects',flat:2,multiplier:1},{label:'Equipment',flat:-2,multiplier:1}])),true);
    }
    assert.equal(secondaryVisible(row('xp_all',1,'×')),false);
    assert.equal(secondaryVisible(row('xp_all',1.2,'×')),true);
    assert.equal(secondaryVisible(row('attack_count',1,'hits')),false);
    assert.equal(secondaryVisible(row('unarmed_power',1)),false);
    assert.equal(secondaryVisible(row('cold_tolerance',3)),false,'weather is everyday home');
    assert.equal(secondaryVisible(row('cold_tolerance',3),true),true);
    assert.equal(secondaryVisible({...row('block_strength',null),availability:{status:'unavailable'}},true),false);
});
test('cold exposure matches native inclusive threshold, including warmed tolerance and exact boundary',()=>{
    assert.equal(coldApplies(14,0,14),true);
    assert.equal(coldApplies(14.00001,0,14),false);
    assert.equal(coldApplies(12,1,14),true);
    assert.equal(coldApplies(12,4,14),false,'native warmed +3 tolerance changes exposure without a new comfort scale');
});
test('Condition has registered reads, navigation and movable default under You; reset restores home',()=>{
    assert.deepEqual(LAYOUT_SPEC.surfaces.condition.reads,['body','time','place']);
    assert.equal(routeById('condition').target,'condition');
    let p=normalizePlacement(null);
    assert.equal(regionFor('condition',{placement:p.contexts.idle}),'player');
    p=moveBox(p,'idle','condition','actions');
    assert.equal(regionFor('condition',{placement:p.contexts.idle}),'actions');
    assert.equal(regionFor('vitals',{placement:p.contexts.idle}),'player');
    assert.equal(regionFor('condition',{placement:p.contexts.combat}),'player');
    assert.equal(regionFor('condition',{placement:resetContext(p,'idle').contexts.idle}),'player');
});
test('pins follow browser display export/import and reset, missing imported pins default off',()=>{
    registerPanelSettings({id:'shell-character',title:'You',settings:[{key:'pin.health_regeneration_flat',default:'off',options:[['off','Auto'],['on','Pinned']]}]});
    const key=pinKey('health_regeneration_flat');setDisplaySettings({[key]:'on'});
    const exported=getDisplaySettings();resetDisplaySettings();assert.equal(getDisplaySetting(key),'off');
    replaceDisplaySettings(exported);assert.equal(getDisplaySetting(key),'on');
    replaceDisplaySettings({});assert.equal(getDisplaySetting(key),'off');
});
