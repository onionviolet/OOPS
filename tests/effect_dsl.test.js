import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateEffectRecord,validateEffectPack,CONDITION_IDS,SCHOOLS,SRD521_ATTRIBUTION} from '../src/effect_dsl.js';
import {draftSpell} from '../tools/import_srd521.mjs';
const read=n=>JSON.parse(readFileSync(new URL(`../src/data/srd521/${n}.json`,import.meta.url)));
const conditions=read('conditions'),spells=read('spells'),monsters=read('monsters'),pack=[...conditions,...spells,...monsters];
const get=id=>structuredClone(pack.find(r=>r.id===`srd521.${id}`));
const valid=()=>get('spell.acid_splash');
for(const r of pack) test(`shipped ${r.id} validates and carries attribution`,()=>{
    assert.equal(validateEffectRecord(r),r);
    assert.equal(r.licence,'CC-BY-4.0'); assert.equal(r.attribution,SRD521_ATTRIBUTION);
    assert.equal(r.source.edition,'5.2.1'); assert.ok(r.source.heading.endsWith(r.name));
});
test('pack covers every condition, 20 spells, all schools and levels 0-5, and 10 monsters across CRs',()=>{
    const before=JSON.stringify(pack); assert.equal(validateEffectPack(pack),pack); assert.equal(JSON.stringify(pack),before);
    assert.deepEqual(conditions.map(r=>r.id.split('.').at(-1)).sort(),[...CONDITION_IDS].sort());
    assert.equal(spells.length,20);assert.equal(monsters.length,10);
    assert.deepEqual([...new Set(spells.map(r=>r.spell.level))].sort(),[0,1,2,3,4,5]);
    assert.deepEqual([...new Set(spells.map(r=>r.spell.school))].sort(),[...SCHOOLS].sort());
    assert.deepEqual([...new Set(monsters.map(r=>r.monster.cr))].sort(),['0','1','1/2','1/4','1/8','10','2','4','5']);
});
test('notice includes exact SRD attribution and declares adaptations',()=>{
    const notice=readFileSync(new URL('../src/data/srd521/ATTRIBUTION.md',import.meta.url),'utf8');
    assert.ok(notice.includes(SRD521_ATTRIBUTION)); assert.match(notice,/Adaptations/);
});
const malformed=[
    ['unknown root field',r=>r.castTime='action'],
    ['missing source',r=>delete r.source],
    ['missing nested field',r=>delete r.effects[0].range.feet],
    ['unknown nested field',r=>r.effects[0].range.units='feet'],
    ['string damage count',r=>r.effects[0].damage[0].dice.count='1'],
    ['nonfinite range',r=>r.effects[0].range.feet=Infinity],
    ['negative duration',r=>r.effects[0].duration.value=-1],
    ['unknown enum',r=>r.effects[0].damage[0].type='mana'],
    ['unknown opcode',r=>r.effects[0].rules=[{op:'eval',subject:'self',value:'alert(1)',when:'always'}]],
    ['wrong edition',r=>r.source.edition='5.1'],
    ['bad source hash',r=>r.source.textSha256='not-a-hash'],
    ['missing licence',r=>delete r.licence],
    ['wrong licence',r=>r.licence='MIT'],
    ['missing attribution',r=>r.attribution=''],
    ['revision zero',r=>r.revision=0],
    ['unknown schema',r=>r.schema=2],
    ['fractional spell level',r=>r.spell.level=1.5],
    ['school typo',r=>r.spell.school='evokation'],
    ['foreign namespace',r=>r.id='other.spell.acid_splash'],
    ['self range with numeric feet',r=>r.effects[0].range.kind='self'],
    ['reversed long range',r=>r.effects[0].range.longFeet=1],
    ['reaction without trigger',r=>r.effects[0].castingTime.unit='reaction'],
    ['trigger on non-reaction',r=>r.effects[0].castingTime.trigger='anything'],
    ['instant concentration',r=>r.effects[0].concentration=true],
    ['half damage with no damage',r=>{r.effects[0].damage=[];r.effects[0].resolution.success='half_damage';}],
    ['save DC string typo',r=>r.effects[0].resolution.dc='auto'],
    ['supported with hidden gap',r=>r.unmodeled=['teleport missing']],
    ['needs ruling without question',r=>{r.status='needs_ruling';r.unmodeled=['missing'];}],
    ['unsupported without reason',r=>r.status='unsupported'],
    ['duplicate effects',r=>r.effects.push(structuredClone(r.effects[0]))],
    ['scale references absent effect',r=>r.function.scale.steps[0].effectId='absent'],
    ['duplicate scaling',r=>r.function.scale.steps.push(structuredClone(r.function.scale.steps[0]))],
    ['healing scaling without healing',r=>r.function.scale.steps[0].field='healing_dice'],
    ['function instead of data',r=>r.function.needs=[()=>true]],
    ['cycle',r=>r.effects[0].notes=[r]],
    ['sparse array',r=>r.effects[0].notes=Array(1)],
    ['decorated array',r=>r.effects.extra=true],
    ['class instance',r=>r.source=new Date()],
    ['accessor',r=>Object.defineProperty(r,'name',{get(){throw Error('getter ran');},enumerable:true})],
];
for(const [name,mutate] of malformed)test(`rejects ${name}`,()=>{const r=valid();mutate(r);assert.throws(()=>validateEffectRecord(r),TypeError);});
test('costly stock cannot be omitted or replaced by focus, or use negative values',()=>{
    for(const change of [m=>delete m.stockId,m=>m.substitutable=true,m=>m.quantity=0,m=>m.minimumValueGp=-1,m=>m.consumed='yes']) {
        const r=get('spell.revivify');change(r.effects[0].components.materials[0]);assert.throws(()=>validateEffectRecord(r));
    }
    for(const id of ['revivify','stoneskin']) {
        const m=get('spell.'+id).effects[0].components.materials[0];
        assert.ok(m.stockId.startsWith('srd521.stock.'));assert.equal(m.consumed,true);assert.equal(m.substitutable,false);
        assert.equal(m.minimumValueGp,id==='revivify'?300:100);assert.equal(m.quantity,1);
    }
});
test('malformed creature and dangling/cyclic pack references fail admission',()=>{
    const r=get('monster.young_red_dragon');r.monster.recharge[0].effectId='missing';assert.throws(()=>validateEffectRecord(r));
    const bad=get('monster.black_bear');bad.monster.abilities.str.score=31;assert.throws(()=>validateEffectRecord(bad));
    assert.throws(()=>validateEffectPack([...pack,pack[0]]));
    assert.throws(()=>validateEffectPack(pack.filter(r=>r.id!=='srd521.condition.incapacitated')));
    const cycle=structuredClone(pack);cycle.find(r=>r.id==='srd521.condition.incapacitated').effects[0].rules.push({op:'grant_condition',subject:'paralyzed',value:true,when:'always'});assert.throws(()=>validateEffectPack(cycle),/cyclic/);
});
test('unsupported status remains valid with a reason and never bypasses schema',()=>{
    const r=valid();r.status='unsupported';r.unmodeled=['foreign physics adapter unavailable'];validateEffectRecord(r);
    r.effects[0].resolution.kind='execute_js';assert.throws(()=>validateEffectRecord(r));
});
test('5.2.1 regressions: healing, Counterspell, Stoneskin and monster effects differ from 5.1',()=>{
    assert.equal(get('spell.cure_wounds').effects[0].healing.count,2);
    assert.equal(get('spell.cure_wounds').spell.school,'abjuration');
    assert.deepEqual(get('spell.counterspell').effects[0].resolution,{kind:'save',ability:'con',dc:'spell',success:'none',repeat:'none'});
    assert.equal(get('spell.lesser_restoration').effects[0].castingTime.unit,'bonus_action');
    const stoneskin=get('spell.stoneskin').effects[0];assert.deepEqual(stoneskin.rules.map(r=>r.subject),['bludgeoning','piercing','slashing']);
    assert.equal(get('monster.young_red_dragon').effects.find(e=>e.id==='fire_breath').damage[0].dice.count,16);
    assert.equal(get('condition.stunned').effects[0].rules.some(r=>r.op==='speed'),false);
    assert.equal(get('condition.petrified').effects[0].rules.some(r=>r.op==='critical_hit'),false);
});
const fixture=`Acid Splash\nEvocation Cantrip (Sorcerer, Wizard)\nCasting Time: Action\nRange: 60 feet\nComponents: V, S\nDuration: Instantaneous\nEach creature must succeed on a Dexterity saving throw or take 1d6 Acid damage.`;
const metadata={page:107,textSha256:pack[0].source.textSha256};
test('importer validates a draft but never marks it reviewed or supported',()=>{
    const a=draftSpell(fixture,metadata), b=draftSpell(fixture,metadata);
    assert.deepEqual(a,b);assert.equal(a.validation.valid,true);assert.equal(a.review.required,true);assert.equal(a.review.accepted,false);assert.equal(a.draft.status,'needs_ruling');
    assert.equal(a.draft.effects[0].damage[0].type,'acid');
    assert.equal(a.draft.effects[0].resolution.ability,'dex');
});
test('importer leaves unknown headers invalid instead of inventing units',()=>{
    const r=draftSpell(fixture.replace('Range: 60 feet','Range: Somewhere'),metadata);
    assert.equal(r.validation.valid,false);assert.match(r.validation.errors[0],/expected one of/);
});
test('importer detects costly stock, consumption and concentration',()=>{
    const r=draftSpell(`Stoneskin\nLevel 4 Transmutation (Druid, Wizard)\nCasting Time: Action\nRange: Touch\nComponents: V, S, M (diamond dust worth 100+ GP,\nwhich the spell consumes)\nDuration: Concentration, up to 1 hour\nResistance.`,{...metadata,page:165});
    assert.equal(r.validation.valid,true);assert.equal(r.draft.effects[0].concentration,true);
    assert.deepEqual(r.draft.effects[0].components.materials[0],{stockId:'srd521.stock.stoneskin_draft_material',description:'diamond dust worth 100+ GP, which the spell consumes',quantity:1,minimumValueGp:100,consumed:true,substitutable:false});
});
