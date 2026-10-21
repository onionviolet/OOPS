import test from 'node:test';
import assert from 'node:assert/strict';
import {createDom} from '../scripts/headless/dom.mjs';
import {descriptionCopy} from '../src/shell_item_description.js';

test('compact item inspection keeps native facts and links, without repeated modifiers',()=>{
    const dom=createDom();dom.loadHTML('<html><body></body></html>');
    const native=dom.document.createElement('div');
    native.innerHTML='<b id="item-title">Coat</b><br>Quality: 40%<br>Cold tolerance: +0.5<br>Component tier: 1<br>Basic stats: <br>Cold tolerance: +0.5<br>Fire resistance: -0.2<br><button data-known-recipe="coat">Repair coat</button>';
    const before=native.innerHTML,copy=descriptionCopy(native);
    assert.equal(native.innerHTML,before,'native tooltip remains intact');
    assert.equal((copy.textContent.match(/Cold tolerance: \+0.5/g)||[]).length,1);
    assert.match(copy.textContent,/Fire resistance: -0.2/,'a different contribution is retained');
    assert.match(copy.querySelector('details').textContent,/Component tier: 1/,'technical facts remain accessible');
    assert.equal(copy.querySelector('button').dataset.knownRecipe,'coat','native action identity remains');
    assert.equal(copy.querySelector('[id]'),null,'copy adds no duplicate IDs');
});
