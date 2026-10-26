import test from 'node:test';
import assert from 'node:assert/strict';
import {defineCatalogue, materialPool, materialTags, materialPropertySupport, validateMaterialQuery, generateMaterial} from '../src/craft_materials.js';
import {defineCraftLaw, resolveBatch} from '../src/craft_resolver.js';
import {nativeCatalogue, nativeItemsMatching, NATIVE_MATERIAL_EVIDENCE} from '../src/native_material_catalogue.js';
import {frontierCatalogue} from '../src/craft_content_frontier.js';
import {renderingSources} from '../src/native_rendering_recipes.js';

const spec = () => ({id:'test.materials', revision:1,
    axes:[{id:'oil', kind:'fraction', unit:'test.materials:mass-parts'}, {id:'hardness', kind:'scalar'}],
    tags:[{id:'fuel', kind:'use', revision:1}, {id:'hearth', kind:'station', revision:1}],
    materials:[{id:'omitted',revision:1}, {id:'zero',revision:1,properties:{oil:0}}]});

test('catalogue selectors reject typos and malformed skipped branches before searching', () => {
    const catalogue = defineCatalogue({...spec(), materials:[]});
    for(const query of ['feul', {any:['fuel', 'feul']}, {all:['fuel', {any:'fuel'}]}, {not:{any:['feul']}}]) {
        assert.throws(() => validateMaterialQuery(catalogue, query), /Unknown query tag|array/);
        assert.throws(() => materialPool(catalogue, query), /Unknown query tag|array/);
    }
    assert.throws(() => materialPool(catalogue, null, {overlays:[{id:'bad',op:'ban',match:'feul'}]}), /Unknown query tag/);
    assert.deepEqual(materialPool(catalogue, {any:['fuel', {not:'hearth'}]}), []);
});

test('reaction catalyst/station and actual supplied stations validate against the law vocabulary', () => {
    const catalogue = defineCatalogue(spec());
    const reaction = {id:'render', reactants:{oil:1}, products:{matrix:1}};
    const lawSpec = {id:'test.law',revision:1,catalogue};
    assert.throws(() => defineCraftLaw({...lawSpec,reactions:[{...reaction,station:'haerth'}]}), /Unknown station tag/);
    assert.throws(() => defineCraftLaw({...lawSpec,reactions:[{...reaction,catalyst:{any:['fuel','feul']}}]}), /Unknown query tag/);
    const law = defineCraftLaw({...lawSpec,reactions:[{...reaction,station:'hearth',catalyst:'fuel'}]});
    assert.throws(() => resolveBatch(law,{inputs:[{material:catalogue.materials.zero,qty:1}],stations:['haerth']}), /Unknown station tag/);
    assert.equal(resolveBatch(law,{inputs:[{material:catalogue.materials.zero,qty:1}],stations:['hearth']}).product.mass,1000);
});

test('author defaults stay distinct from explicit zero and required missing data refuses at authoring', () => {
    const catalogue = defineCatalogue(spec());
    assert.deepEqual(catalogue.materials.omitted.properties,catalogue.materials.zero.properties);
    assert.equal(materialPropertySupport(catalogue,catalogue.materials.omitted,'oil').status,'defaulted');
    assert.equal(materialPropertySupport(catalogue,catalogue.materials.zero,'oil').status,'authored');
    assert.equal(materialPropertySupport(catalogue,catalogue.materials.zero,'oil').value,0);
    assert.equal(materialPropertySupport(catalogue,catalogue.materials.zero,'matrix').status,'derived');
    const required = {...spec(),axes:[{id:'oil',kind:'fraction',omission:'required'}]};
    assert.throws(() => defineCatalogue(required),/Missing required axis oil.*unsupported/);
    assert.equal(defineCatalogue({...required,materials:[{id:'zero',revision:1,properties:{oil:0}}]}).materials.zero.properties.oil,0);
    const generated = generateMaterial(frontierCatalogue,'reedherb',{root:1,scope:'fixture',index:0}).value;
    assert.equal(materialPropertySupport(frontierCatalogue,generated,'restore').status,'generated');
});

test('units and declared scalar combination prevent invalid comparisons and unsupported mixtures', () => {
    assert.throws(() => nativeItemsMatching(null,{min:{oil:1},units:{oil:'millilitres'}}),/Incompatible unit/);
    assert.throws(() => nativeItemsMatching({not:'fuel'},{min:{oil:1},units:{oil:'count'}}),/Incompatible unit/);
    assert.throws(() => nativeItemsMatching(null,{min:{oil:NaN}}),/Invalid bound/);
    assert.deepEqual(nativeItemsMatching(null,{min:{oil:800},units:{oil:nativeCatalogue.axes.oil.unit}}),['Animal fat','Lamp oil']);
    const catalogue = defineCatalogue({...spec(),axes:[{id:'hardness',kind:'scalar',combination:'unmixed'}],
        materials:[{id:'a',revision:1,properties:{hardness:10}},{id:'b',revision:1,properties:{hardness:90}}]});
    const law = defineCraftLaw({id:'test.unmixed',revision:1,catalogue,outputs:[{id:'metric',route:'fixture',effect:'hardness',axis:'hardness',mode:'scalar',per:1}]});
    assert.equal(resolveBatch(law,{inputs:[{material:catalogue.materials.a,qty:2}]}).product.scalars.hardness,10);
    assert.throws(() => resolveBatch(law,{inputs:Object.values(catalogue.materials).map(material=>({material,qty:1}))}),/no supported mixture rule/);
    assert.throws(() => defineCatalogue({...spec(),axes:[{id:'oil',kind:'fraction',combination:'mass-weighted'}]}),/Invalid combination/);
    assert.throws(() => defineCatalogue({...spec(),axes:[{id:'oil',kind:'fraction',unit:'millilitres'}]}),/Incompatible fraction unit/);
    const unrelated = defineCraftLaw({id:'test.no-metric',revision:1,catalogue});
    const result = resolveBatch(unrelated,{inputs:Object.values(catalogue.materials).map(material=>({material,qty:1}))});
    assert.equal(Object.hasOwn(result.product.scalars,'hardness'),false,'unread unsupported metric does not prohibit the mixture or invent a mean');
});

test('native current substance, source relationship and contextual contribution remain separate', () => {
    const charcoal = nativeCatalogue.materials.Charcoal;
    const tags = materialTags(nativeCatalogue,charcoal);
    assert.ok(tags.has('char') && tags.has('fuel') && tags.has('tinder'));
    assert.ok(!tags.has('wood') && !tags.has('plant'));
    assert.ok(!nativeItemsMatching('wood').includes('Charcoal'));
    assert.throws(() => nativeItemsMatching('feul'),/Unknown query tag/);
    assert.deepEqual(NATIVE_MATERIAL_EVIDENCE.relations[0],{subject:'Charcoal',relation:'derived-from',object:'wood',status:'ORIGINAL'});
    assert.equal(nativeCatalogue.registry.get('deathly').kind,'symbolic_proposal');
    assert.deepEqual(renderingSources().map(({id,count})=>[id,count]),[['Goat meat',4],['Crab meat',10],['Frog meat',10]]);
    assert.ok(!renderingSources().some(row=>row.id==='Lamp oil'));
});
