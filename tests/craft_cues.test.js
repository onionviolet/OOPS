import test from 'node:test';
import assert from 'node:assert/strict';
import {craftCue, CRAFT_CUES} from '../src/craft_cues.js';
import {craftReceiptText} from '../src/crafting_detail.js';
import {villageLedgerSentence} from '../src/town_content.js';
for(const skill of ['Woodworking', 'Forging']) {
    for(const [band, levels] of [['novice',[0,9]],['practiced',[10,49]],['master',[50,100]]]) {
        test(`${skill} ${band} observes the same channel at both band edges`, () => {
            for(const level of levels) assert.equal(craftCue(skill,level,{made:1}),CRAFT_CUES[skill].sight[band]);
        });
    }
}
test('unsupported skills, missing/invalid levels and empty/failed results have no cue', () => {
    assert.equal(craftCue('Cooking',50,{made:1}),'');
    assert.equal(craftCue('toString',50,{made:1}),'');
    for(const level of [undefined,null,NaN,Infinity,-1,'50']) assert.equal(craftCue('Forging',level,{made:1}),'');
    for(const result of [undefined,{}, {made:0},{made:-1}]) assert.equal(craftCue('Woodworking',10,result),'');
    assert.equal(craftCue('Woodworking',10,{count:2}),CRAFT_CUES.Woodworking.sight.practiced);
});
test('receipt uses its captured level and never describes a failed finished piece', () => {
    const receipt = {made:1,result_name:'wood',used:[],xp:2,skill_id:'Woodworking',skill_level:9};
    const before=structuredClone(receipt), text=craftReceiptText(receipt);
    craftCue('Woodworking',50,{made:1});
    assert.equal(craftReceiptText(receipt),text);
    assert.ok(text.endsWith(CRAFT_CUES.Woodworking.sight.novice));
    assert.deepEqual(receipt,before);
    assert.equal(craftReceiptText({...receipt,made:0}),'Nothing was crafted. Your materials are unchanged.');
});
for(const present of [false,true]) test(`Village saved fact ${present?'present':'absent'} projects without mutation`, () => {
    const state={actors:{player:{facts:present?{'town.returned':true}:{}}}};
    const before=structuredClone(state);
    for(let i=0;i<3;i++) assert.equal(villageLedgerSentence(state),present?'Travelers use the corrected signs copied from your ledger.':'');
    assert.deepEqual(state,before);
    assert.equal(villageLedgerSentence(JSON.parse(JSON.stringify(state))),villageLedgerSentence(state));
});
